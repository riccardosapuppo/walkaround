import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, map, of, startWith, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import {
  circleMarker,
  divIcon,
  latLng,
  latLngBounds,
  Layer,
  LeafletMouseEvent,
  Map,
  marker,
  polyline,
  tileLayer,
  type Marker
} from 'leaflet';
import { environment } from '../../../environments/environment';
import { City } from '../../core/models/city.model';
import { Poi } from '../../core/models/poi.model';
import { AppStateService, HotelAssociation } from '../../core/services/app-state.service';
import { CartService } from '../../core/services/cart.service';
import { Coordinates, GeoService } from '../../core/services/geo.service';
import { I18nService } from '../../core/services/i18n.service';
import { NavigationRoute, NavigationService, NavigationStep } from '../../core/services/navigation.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';
import { StructureLocationService } from '../../core/services/structure-location.service';
import { formatCityLabel } from '../../core/utils/city-label.util';
import {
  PoiMapSheetAction,
  PoiMapSheetComponent
} from '../../shared/components/poi-map-sheet/poi-map-sheet.component';

interface PoiMapView extends Poi {
  distanceMeters: number;
  distanceLabel: string;
  unlocked: boolean;
  near: boolean;
}

interface NavigationStepView {
  instruction: string;
  distanceLabel: string;
}

const cityFallbackMap: Record<string, Coordinates> = {
  catania: { lat: 37.5079, lng: 15.083 },
  siracusa: { lat: 37.067, lng: 15.2866 },
  taormina: { lat: 37.8531, lng: 15.2899 },
  ragusa: { lat: 36.9269, lng: 14.7305 }
};

const ARRIVAL_THRESHOLD_METERS = 35;
const ROUTE_REFRESH_MIN_INTERVAL_MS = 12_000;
const ROUTE_RECALC_MIN_MOVEMENT_METERS = 18;
const MIN_NAV_DURATION_SEC = 30;
const defaultCityUnlockPrice = 15;

@Component({
  standalone: false,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  readonly mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 14,
    center: latLng(37.5079, 15.083)
  };

  markerLayers: Layer[] = [];
  poiCount = 0;
  isLoading = true;
  apiErrorMessage: string | null = null;

  navigationTarget?: PoiMapView;
  navigationDistanceLabel = '--';
  navigationEtaLabel = '--';
  navigationArrivalLabel = '--';
  navigationProgress = 0;
  navigationNextInstruction = '';
  navigationUpcomingSteps: NavigationStepView[] = [];
  showAllNavigationSteps = false;
  navigationProviderLabel = '';
  navigationProvider: 'osrm' | 'fallback' | null = null;
  isRouting = false;
  activeCityId = 'catania';
  cities: City[] = [];
  associatedStructure: HotelAssociation | null = null;
  associatedStructureCoords: Coordinates | null = null;
  resolvingAssociatedStructure = false;

  private mapRef?: Map;
  private currentCoordinates?: Coordinates;
  private latestPreparedPois: PoiMapView[] = [];
  private pendingNavigationPoiId: string | null = null;
  private pendingNavigationFromQuery = false;
  private activeRoute?: NavigationRoute;
  private routeRemainingMetersByPoint: number[] = [];
  private routeStepPointIndexes: number[] = [];
  private hasShownArrivalSnack = false;
  private hasShownFallbackSnack = false;
  private lastRouteRequestedAt = 0;
  private lastRouteOrigin?: Coordinates;
  private routeRequestToken = 0;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly appState: AppStateService,
    private readonly geoService: GeoService,
    private readonly i18n: I18nService,
    private readonly navigationService: NavigationService,
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    private readonly structureLocationService: StructureLocationService,
    private readonly cartService: CartService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly zone: NgZone,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.applyNavigationPlaceholders();
  }

  get hasActiveNavigation(): boolean {
    return Boolean(this.navigationTarget);
  }

  get visibleNavigationSteps(): NavigationStepView[] {
    if (this.showAllNavigationSteps) {
      return this.navigationUpcomingSteps;
    }

    return this.navigationUpcomingSteps.slice(0, 3);
  }

  get canExpandNavigationSteps(): boolean {
    return this.navigationUpcomingSteps.length > 3;
  }

  get visibleAssociatedStructure(): HotelAssociation | null {
    const association = this.associatedStructure;
    if (!association?.structureId) {
      return null;
    }

    const cityIds = this.associationCityIds(association);
    if (cityIds.length && !cityIds.includes(this.activeCityId)) {
      return null;
    }

    return association;
  }

  ngOnInit(): void {
    this.purchaseService.refresh();
    void this.geoService.requestPermissionAndTrack();
    this.poiService
      .getCities()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cities) => {
          this.cities = Array.isArray(cities) ? cities : [];
        },
        error: () => {
          this.cities = [];
        }
      });

    this.appState.hotelAssociation$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((association) => {
          this.associatedStructure = association;
          this.associatedStructureCoords = null;
          this.resolvingAssociatedStructure = Boolean(association?.structureId);

          if (!association?.structureId) {
            return of(null);
          }

          return this.structureLocationService.resolveAssociationCoordinates(association);
        })
      )
      .subscribe((coordinates) => {
        this.associatedStructureCoords = coordinates;
        this.resolvingAssociatedStructure = false;
        this.refreshMapLayers();
      });

    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((queryParams) => {
      const shouldNavigate = queryParams.get('nav') === '1';
      const poiId = String(queryParams.get('poiId') || '').trim();
      if (!shouldNavigate || !poiId) {
        return;
      }

      this.pendingNavigationPoiId = poiId;
      this.pendingNavigationFromQuery = true;
      this.tryStartPendingNavigation();
    });

    combineLatest([
      this.appState.activeCityId$.pipe(
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((cityId) =>
          this.poiService.getPoisByCity(cityId).pipe(
            tap(() => {
              this.apiErrorMessage = null;
            }),
            map((pois) => ({ cityId, pois })),
            catchError(() => {
              this.apiErrorMessage = this.i18n.t('map.apiError');
              return of({ cityId, pois: [] as Poi[] });
            })
          )
        )
      ),
      this.geoService.coordinates$.pipe(startWith(null)),
      this.purchaseService.purchases$.pipe(startWith({ items: [], unlockedPoiIds: [], unlockedCityIds: [] }))
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([cityData, coordinates]) => {
        this.activeCityId = cityData.cityId;
        const fallback = cityFallbackMap[cityData.cityId] || cityFallbackMap['catania'];
        this.currentCoordinates = coordinates || fallback;

        const prepared = cityData.pois.map((poi) => {
          const distanceMeters = this.geoService.distanceInMeters(this.currentCoordinates as Coordinates, {
            lat: poi.lat,
            lng: poi.lng
          });

          const unlocked = this.purchaseService.isPoiUnlocked(poi.id, poi.cityId);
          return {
            ...poi,
            distanceMeters,
            distanceLabel: this.formatDistance(distanceMeters),
            unlocked,
            near: distanceMeters <= environment.geofenceRadiusMeters
          } as PoiMapView;
        });

        this.latestPreparedPois = prepared;
        this.poiCount = prepared.length;

        this.updateNavigationState();
        if (this.hasActiveNavigation) {
          this.maybeRequestNavigationRoute(false);
        }

        this.refreshMapLayers(prepared);
        this.tryStartPendingNavigation();
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMapReady(map: Map): void {
    this.mapRef = map;
    if (this.hasActiveNavigation) {
      this.focusNavigationRoute();
      return;
    }

    this.centerOnMe();
  }

  centerOnMe(): void {
    if (!this.mapRef || !this.currentCoordinates) {
      return;
    }

    this.mapRef.flyTo([this.currentCoordinates.lat, this.currentCoordinates.lng], 15, {
      duration: 0.8
    });
  }

  goBack(): void {
    if (!this.hasActiveNavigation) {
      return;
    }

    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    void this.router.navigate(['/home']);
  }

  focusNavigationRoute(): void {
    if (!this.mapRef || !this.currentCoordinates || !this.navigationTarget) {
      this.centerOnMe();
      return;
    }

    const routePoints = this.activeRoute?.points?.length
      ? this.activeRoute.points
      : [this.currentCoordinates, { lat: this.navigationTarget.lat, lng: this.navigationTarget.lng }];

    const bounds = latLngBounds(routePoints.map((point) => [point.lat, point.lng] as [number, number])).pad(0.18);
    this.mapRef.fitBounds(bounds, { animate: true, duration: 0.8 });
  }

  focusAssociatedStructure(): void {
    if (!this.mapRef || !this.associatedStructureCoords) {
      return;
    }

    this.mapRef.flyTo([this.associatedStructureCoords.lat, this.associatedStructureCoords.lng], 16, {
      duration: 0.8
    });
  }

  navigateToAssociatedStructure(): void {
    const association = this.visibleAssociatedStructure;
    if (!association) {
      return;
    }

    const url = this.structureLocationService.buildExternalDirectionsUrl(association, this.associatedStructureCoords);
    if (!url) {
      this.snackBar.open(this.i18n.t('map.structureNavigationUnavailable'), this.i18n.t('common.close'), {
        duration: 2400
      });
      return;
    }

    window.open(url, '_blank', 'noopener');
  }

  stopNavigation(): void {
    this.routeRequestToken += 1;
    this.clearNavigationState();
    this.refreshMapLayers();
  }

  toggleNavigationSteps(): void {
    this.showAllNavigationSteps = !this.showAllNavigationSteps;
  }

  private createPoiMarker(poi: PoiMapView): Marker {
    const markerStatusClass =
      this.navigationTarget?.id === poi.id ? 'poi-nav-target' : poi.near ? 'poi-near' : poi.unlocked ? 'poi-unlocked' : 'poi-locked';

    const poiMarker = marker([poi.lat, poi.lng], {
      icon: divIcon({
        className: '',
        html: `<div class="poi-marker ${markerStatusClass}"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      })
    });

    poiMarker.on('click', (event: LeafletMouseEvent) => {
      event.originalEvent.preventDefault();
      this.zone.run(() => {
        const currentPoi = this.findPreparedPoi(poi.id) || poi;
        const sheet = this.bottomSheet.open(PoiMapSheetComponent, {
          data: {
            poi: currentPoi,
            distanceLabel: currentPoi.distanceLabel,
            unlocked: currentPoi.unlocked,
            isNavigating: this.navigationTarget?.id === currentPoi.id,
            isFavorite: this.appState.isFavorite(currentPoi.id),
            inCart: this.cartService.isPoiInCart(currentPoi.id),
            cityName: this.cityName(currentPoi.cityId),
            cityBundlePrice: this.cityBundlePrice(currentPoi.cityId)
          }
        });

        sheet
          .afterDismissed()
          .pipe(take(1))
          .subscribe((result?: PoiMapSheetAction) => {
            if (!result) {
              return;
            }

            if (result.action === 'navigate') {
              this.startNavigationById(result.poiId);
              return;
            }

            if (result.action === 'play') {
              if (!this.hasPlayableAudio(currentPoi)) {
                this.snackBar.open(this.i18n.t('map.noAudio'), this.i18n.t('common.ok'), { duration: 2400 });
                return;
              }

              if (result.preview) {
                void this.router.navigate(['/poi', result.poiId]);
                return;
              }

              void this.router.navigate(['/player', result.poiId], { queryParams: { preview: false } });
              return;
            }

            if (result.action === 'add-to-cart') {
              if (this.purchaseService.isPoiUnlocked(currentPoi.id, currentPoi.cityId)) {
                this.snackBar.open(this.i18n.t('map.placeAlreadyUnlocked'), this.i18n.t('common.ok'), { duration: 2200 });
                return;
              }

              if (this.cartService.isPoiInCart(currentPoi.id)) {
                this.snackBar.open(this.i18n.t('map.placeAlreadyInCart'), this.i18n.t('common.ok'), { duration: 2200 });
                return;
              }

              this.cartService.addPoi({
                poiId: currentPoi.id,
                cityId: currentPoi.cityId,
                cityName: this.cityName(currentPoi.cityId),
                label: this.poiName(currentPoi),
                amount: currentPoi.priceSingle
              });
              this.snackBar.open(this.i18n.t('map.placeAdded', { name: this.poiName(currentPoi) }), this.i18n.t('common.ok'), {
                duration: 2400
              });
              return;
            }

            if (result.action === 'toggle-favorite') {
              this.appState.toggleFavorite(result.poiId);
              return;
            }

            this.purchaseService.purchaseCityBundle(result.cityId, this.cityName(result.cityId), this.cityBundlePrice(result.cityId)).subscribe({
              next: (dialogResult) => {
                if (dialogResult?.action === 'paid') {
                  this.snackBar.open(
                    this.i18n.t('map.cityUnlocked', { city: this.cityName(result.cityId) }),
                    this.i18n.t('common.ok'),
                    { duration: 2400 }
                  );
                }
              },
              error: () => {
                this.snackBar.open(this.i18n.t('map.operationFailed'), this.i18n.t('common.close'), { duration: 2400 });
              }
            });
          });
      });
    });

    return poiMarker;
  }

  private composeMapLayers(pois: PoiMapView[]): Layer[] {
    const navigationLayers: Layer[] = [];

    if (this.navigationTarget && this.currentCoordinates) {
      const to = { lat: this.navigationTarget.lat, lng: this.navigationTarget.lng };
      const routePoints = this.activeRoute?.points?.length ? this.activeRoute.points : [this.currentCoordinates, to];
      const fallbackStyle = this.navigationProvider === 'fallback' || routePoints.length <= 2;

      navigationLayers.push(
        polyline(
          routePoints.map((point) => [point.lat, point.lng] as [number, number]),
          {
            color: '#1769aa',
            weight: 6,
            opacity: 0.92,
            dashArray: fallbackStyle ? '10 10' : undefined,
            lineCap: 'round',
            lineJoin: 'round'
          }
        ),
        circleMarker([this.currentCoordinates.lat, this.currentCoordinates.lng], {
          radius: 9,
          color: '#ffffff',
          weight: 3,
          fillColor: '#1769aa',
          fillOpacity: 1
        }),
        circleMarker([to.lat, to.lng], {
          radius: 17,
          color: '#1769aa',
          weight: 2,
          fillColor: '#1769aa',
          fillOpacity: 0.14
        })
      );
    }

    const structureMarker = this.createStructureMarker();
    if (structureMarker) {
      navigationLayers.push(structureMarker);
    }

    const poiLayers = pois.map((poi) => this.createPoiMarker(poi));
    return [...navigationLayers, ...poiLayers];
  }

  private createStructureMarker(): Marker | null {
    const association = this.visibleAssociatedStructure;
    if (!association || !this.associatedStructureCoords) {
      return null;
    }

    const structureMarker = marker([this.associatedStructureCoords.lat, this.associatedStructureCoords.lng], {
      icon: divIcon({
        className: '',
        html: '<div class="poi-marker structure-marker"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    });

    structureMarker.on('click', () => {
      this.navigateToAssociatedStructure();
    });

    return structureMarker;
  }

  private findPreparedPoi(poiId: string): PoiMapView | undefined {
    const normalizedPoiId = String(poiId || '').trim();
    return this.latestPreparedPois.find((poi) => poi.id === normalizedPoiId);
  }

  private startNavigationById(poiId: string): void {
    const target = this.findPreparedPoi(poiId);
    if (!target) {
      this.pendingNavigationPoiId = String(poiId || '').trim() || null;
      return;
    }

    this.deferNavigationStart(target);
  }

  private startNavigation(poi: PoiMapView): void {
    if (this.navigationTarget?.id === poi.id && this.activeRoute?.points?.length) {
      this.focusNavigationRoute();
      return;
    }

    this.routeRequestToken += 1;
    this.pendingNavigationPoiId = null;
    this.navigationTarget = poi;
    this.activeRoute = undefined;
    this.routeRemainingMetersByPoint = [];
    this.routeStepPointIndexes = [];
    this.navigationProvider = null;
    this.applyNavigationPlaceholders();
    this.navigationUpcomingSteps = [];
    this.showAllNavigationSteps = false;
    this.navigationProgress = 0;
    this.hasShownArrivalSnack = false;
    this.hasShownFallbackSnack = false;
    this.lastRouteOrigin = undefined;
    this.lastRouteRequestedAt = 0;

    this.updateNavigationState();
    this.maybeRequestNavigationRoute(true);
    this.refreshMapLayers();
    this.focusNavigationRoute();
  }

  private maybeRequestNavigationRoute(force: boolean): void {
    if (!this.navigationTarget || !this.currentCoordinates) {
      return;
    }

    if (!force) {
      if (this.isRouting) {
        return;
      }

      const now = Date.now();
      if (now - this.lastRouteRequestedAt < ROUTE_REFRESH_MIN_INTERVAL_MS) {
        return;
      }

      if (
        this.lastRouteOrigin &&
        this.geoService.distanceInMeters(this.lastRouteOrigin, this.currentCoordinates) < ROUTE_RECALC_MIN_MOVEMENT_METERS
      ) {
        return;
      }
    }

    const from: Coordinates = { lat: this.currentCoordinates.lat, lng: this.currentCoordinates.lng };
    const to: Coordinates = { lat: this.navigationTarget.lat, lng: this.navigationTarget.lng };
    const activePoiId = this.navigationTarget.id;
    const requestToken = ++this.routeRequestToken;

    this.isRouting = true;
    this.lastRouteRequestedAt = Date.now();
    this.lastRouteOrigin = from;

    this.navigationService
      .getWalkingRoute(from, to)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (route) => {
          if (requestToken !== this.routeRequestToken || this.navigationTarget?.id !== activePoiId) {
            return;
          }

          this.isRouting = false;
          this.applyNavigationRoute(route);
          this.updateNavigationState();
          this.refreshMapLayers();

          if (route.provider === 'fallback' && !this.hasShownFallbackSnack) {
            this.hasShownFallbackSnack = true;
            this.snackBar.open(this.i18n.t('map.routeFallback'), this.i18n.t('common.ok'), { duration: 2800 });
          }
        },
        error: () => {
          if (requestToken !== this.routeRequestToken) {
            return;
          }

          this.isRouting = false;
        }
      });
  }

  private applyNavigationRoute(route: NavigationRoute): void {
    this.activeRoute = route;
    this.navigationProvider = route.provider;
    this.navigationProviderLabel =
      route.provider === 'osrm' ? this.i18n.t('map.providerRealRoute') : this.i18n.t('map.providerFallbackRoute');
    this.routeRemainingMetersByPoint = this.buildRemainingDistanceByPoint(route.points);
    this.routeStepPointIndexes = this.buildRouteStepIndexes(route.steps, route.points);
  }

  private updateNavigationState(): void {
    if (!this.navigationTarget) {
      return;
    }

    const refreshedTarget = this.latestPreparedPois.find((poi) => poi.id === this.navigationTarget?.id);
    if (!refreshedTarget) {
      if (!this.latestPreparedPois.length) {
        return;
      }

      this.clearNavigationState();
      return;
    }

    this.navigationTarget = refreshedTarget;

    if (!this.currentCoordinates) {
      this.navigationDistanceLabel = refreshedTarget.distanceLabel;
      this.navigationEtaLabel = '--';
      this.navigationArrivalLabel = '--';
      this.navigationProgress = 0;
      return;
    }

    let remainingMeters = this.geoService.distanceInMeters(this.currentCoordinates, {
      lat: refreshedTarget.lat,
      lng: refreshedTarget.lng
    });
    let remainingDurationSec = Math.max(MIN_NAV_DURATION_SEC, Math.round(remainingMeters / 1.25));

    if (
      this.activeRoute &&
      this.activeRoute.points.length > 0 &&
      this.routeRemainingMetersByPoint.length === this.activeRoute.points.length
    ) {
      const nearestPointIndex = this.findNearestPointIndex(this.currentCoordinates, this.activeRoute.points);
      const nearestPoint = this.activeRoute.points[nearestPointIndex];
      remainingMeters =
        this.routeRemainingMetersByPoint[nearestPointIndex] + this.geoService.distanceInMeters(this.currentCoordinates, nearestPoint);

      if (this.activeRoute.distanceMeters > 0 && this.activeRoute.durationSec > 0) {
        const ratio = Math.max(0, Math.min(1, remainingMeters / this.activeRoute.distanceMeters));
        remainingDurationSec = Math.max(MIN_NAV_DURATION_SEC, Math.round(this.activeRoute.durationSec * ratio));
      }

      const nextStep = this.findNextStep(nearestPointIndex);
      this.navigationNextInstruction = nextStep?.instruction || this.i18n.t('navigation.proceedDestination');
      this.navigationUpcomingSteps = this.buildUpcomingStepViews(nearestPointIndex);
    } else {
      this.navigationNextInstruction = this.i18n.t('navigation.proceedDestination');
      this.navigationUpcomingSteps = [];
    }

    this.navigationDistanceLabel = this.i18n.formatDistance(remainingMeters);
    this.navigationEtaLabel = this.formatDurationShort(remainingDurationSec);
    this.navigationArrivalLabel = new Intl.DateTimeFormat(this.i18n.locale, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(Date.now() + remainingDurationSec * 1000));

    const totalDistance = Math.max(this.activeRoute?.distanceMeters || remainingMeters, 1);
    this.navigationProgress = Math.max(0, Math.min(100, ((totalDistance - remainingMeters) / totalDistance) * 100));

    if (!this.hasShownArrivalSnack && remainingMeters <= ARRIVAL_THRESHOLD_METERS) {
      this.hasShownArrivalSnack = true;
      this.snackBar.open(
        this.i18n.t('map.arrivedNear', { name: this.poiName(refreshedTarget) }),
        this.i18n.t('common.ok'),
        { duration: 2400 }
      );
    }
  }

  private clearNavigationState(): void {
    this.navigationTarget = undefined;
    this.navigationDistanceLabel = '--';
    this.navigationEtaLabel = '--';
    this.navigationArrivalLabel = '--';
    this.navigationProgress = 0;
    this.navigationNextInstruction = this.i18n.t('map.calculatingRoute');
    this.navigationUpcomingSteps = [];
    this.showAllNavigationSteps = false;
    this.navigationProvider = null;
    this.navigationProviderLabel = this.i18n.t('map.searchingRoute');
    this.isRouting = false;
    this.activeRoute = undefined;
    this.routeRemainingMetersByPoint = [];
    this.routeStepPointIndexes = [];
    this.hasShownArrivalSnack = false;
    this.hasShownFallbackSnack = false;
  }

  private refreshMapLayers(pois: PoiMapView[] = this.latestPreparedPois): void {
    this.markerLayers = this.composeMapLayers(pois);
    this.changeDetector.markForCheck();

    if (this.mapRef) {
      window.requestAnimationFrame(() => {
        this.mapRef?.invalidateSize(false);
      });
    }
  }

  private tryStartPendingNavigation(): void {
    if (!this.pendingNavigationPoiId) {
      return;
    }

    const target = this.latestPreparedPois.find((poi) => poi.id === this.pendingNavigationPoiId);
    if (!target) {
      return;
    }

    this.deferNavigationStart(target);
    if (this.pendingNavigationFromQuery) {
      this.pendingNavigationFromQuery = false;
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          nav: null,
          poiId: null
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
    this.pendingNavigationPoiId = null;
  }

  private deferNavigationStart(poi: PoiMapView): void {
    window.requestAnimationFrame(() => {
      this.zone.run(() => this.startNavigation(poi));
    });
  }

  private buildRemainingDistanceByPoint(points: Coordinates[]): number[] {
    if (!points.length) {
      return [];
    }

    const remaining = new Array(points.length).fill(0);
    for (let index = points.length - 2; index >= 0; index -= 1) {
      remaining[index] = remaining[index + 1] + this.geoService.distanceInMeters(points[index], points[index + 1]);
    }

    return remaining;
  }

  private buildRouteStepIndexes(steps: NavigationStep[], points: Coordinates[]): number[] {
    if (!steps.length || !points.length) {
      return [];
    }

    return steps.map((step) => this.findNearestPointIndex(step.location, points));
  }

  private findNextStep(currentPointIndex: number): NavigationStep | null {
    if (!this.activeRoute || !this.activeRoute.steps.length || !this.routeStepPointIndexes.length) {
      return null;
    }

    const nextIndex = this.routeStepPointIndexes.findIndex((stepPointIndex) => stepPointIndex > currentPointIndex + 1);
    if (nextIndex === -1) {
      return null;
    }

    return this.activeRoute.steps[nextIndex] || null;
  }

  private buildUpcomingStepViews(currentPointIndex: number): NavigationStepView[] {
    if (!this.activeRoute || !this.activeRoute.steps.length || !this.routeStepPointIndexes.length) {
      return [];
    }

    const upcoming: NavigationStepView[] = [];
    for (let index = 0; index < this.routeStepPointIndexes.length; index += 1) {
      if (this.routeStepPointIndexes[index] <= currentPointIndex + 1) {
        continue;
      }

      const step = this.activeRoute.steps[index];
      if (!step || !step.instruction) {
        continue;
      }

      upcoming.push({
        instruction: step.instruction,
        distanceLabel: this.formatDistance(Math.max(step.distanceMeters, 0))
      });
    }

    return upcoming;
  }

  private findNearestPointIndex(from: Coordinates, points: Coordinates[]): number {
    if (!points.length) {
      return 0;
    }

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    points.forEach((point, index) => {
      const distance = this.geoService.distanceInMeters(from, point);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }

  private formatDurationShort(durationSec: number): string {
    if (!Number.isFinite(durationSec) || durationSec <= 0) {
      return '--';
    }

    const totalMinutes = Math.max(1, Math.round(durationSec / 60));
    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  private formatDistance(distanceMeters: number): string {
    return this.i18n.formatDistance(distanceMeters);
  }

  private hasPlayableAudio(poi: Poi | null | undefined): boolean {
    return this.poiService.hasPreviewAudio(poi);
  }

  poiName(poi: Poi | null | undefined): string {
    return this.i18n.resolvePoiField(poi?.name, poi?.translations, 'name');
  }

  private cityName(cityId: string): string {
    return formatCityLabel(cityId, this.cities, this.i18n.language);
  }

  private cityBundlePrice(cityId: string): number {
    const normalizedCityId = String(cityId || '').trim().toLowerCase();
    const city = this.cities.find((item) => String(item.id || '').trim().toLowerCase() === normalizedCityId);
    const price = Number(city?.bundlePrice);
    return Number.isFinite(price) && price >= 0 ? price : defaultCityUnlockPrice;
  }

  private associationCityIds(association: HotelAssociation): string[] {
    if (Array.isArray(association.cityIds) && association.cityIds.length) {
      return association.cityIds.map((cityId) => String(cityId || '').trim()).filter(Boolean);
    }
    const singleCityId = String(association.cityId || '').trim();
    return singleCityId ? [singleCityId] : [];
  }

  private applyNavigationPlaceholders(): void {
    this.navigationProviderLabel = this.i18n.t('map.searchingRoute');
    this.navigationNextInstruction = this.i18n.t('map.calculatingRoute');
  }
}
