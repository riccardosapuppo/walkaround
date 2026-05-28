import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, combineLatest, map, of, shareReplay, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { City } from '../../core/models/city.model';
import { Poi } from '../../core/models/poi.model';
import { AppStateService, HotelAssociation } from '../../core/services/app-state.service';
import { CartService } from '../../core/services/cart.service';
import { Coordinates, GeoService } from '../../core/services/geo.service';
import { I18nService } from '../../core/services/i18n.service';
import { PlayerService } from '../../core/services/player.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';
import { StructureLocationService } from '../../core/services/structure-location.service';
import { formatCityLabel } from '../../core/utils/city-label.util';

interface PoiHomeView extends Poi {
  distanceMeters: number;
  distanceLabel: string;
  unlocked: boolean;
  near: boolean;
}

interface HomeViewModel {
  cityId: string;
  nearestPoi: PoiHomeView | null;
  pois: PoiHomeView[];
}

const cityFallbackMap: Record<string, Coordinates> = {
  catania: { lat: 37.5079, lng: 15.083 },
  siracusa: { lat: 37.067, lng: 15.2866 },
  taormina: { lat: 37.8531, lng: 15.2899 },
  ragusa: { lat: 36.9269, lng: 14.7305 }
};

const homeScrollStorageKey = 'walkaround.home.scrollY';
const citySummaryMaxLength = 160;
const defaultCityUnlockPrice = 15;

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  apiErrorMessage: string | null = null;
  loading = true;
  activeCityId = 'catania';
  associatedStructure: HotelAssociation | null = null;
  citySwitching = false;
  cities: City[] = [];
  citySummaryExpanded = false;

  readonly vm$ = combineLatest([
    combineLatest([this.appState.activeCityId$, this.appState.language$]).pipe(
      switchMap(([cityId]) =>
        this.poiService.getPoisByCity(cityId).pipe(
          tap(() => {
            this.apiErrorMessage = null;
          }),
          map((pois) => ({ cityId, pois })),
          catchError((error: unknown) => {
            this.apiErrorMessage = this.describeApiError(error);
            return of({ cityId, pois: [] as Poi[] });
          })
        )
      )
    ),
    this.geoService.coordinates$.pipe(startWith(null)),
    this.purchaseService.purchases$.pipe(startWith({ items: [], unlockedPoiIds: [], unlockedCityIds: [] }))
  ]).pipe(
    map(([cityData, coordinates]) => {
      const fallback = cityFallbackMap[cityData.cityId] || cityFallbackMap['catania'];
      const center = coordinates || fallback;

      const pois = cityData.pois
        .map((poi) => {
          const distanceMeters = this.geoService.distanceInMeters(center, {
            lat: poi.lat,
            lng: poi.lng
          });
          const unlocked = this.purchaseService.isPoiUnlocked(poi.id, poi.cityId);

          return {
            ...poi,
            distanceMeters,
            distanceLabel: this.i18n.formatDistance(distanceMeters),
            unlocked,
            near: distanceMeters <= environment.geofenceRadiusMeters
          } satisfies PoiHomeView;
        })
        .sort((a, b) => a.distanceMeters - b.distanceMeters);

      return {
        cityId: cityData.cityId,
        nearestPoi: pois[0] || null,
        pois
      } satisfies HomeViewModel;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  continuePoi?: Poi;
  continueTime = 0;

  private readonly geofenceShown = new Set<string>();
  private readonly expandedPoiDescriptions = new Set<string>();
  private expandablePoiDescriptions = new Set<string>();
  private readonly destroy$ = new Subject<void>();
  private readonly shouldRestoreScroll: boolean;
  private restoredScroll = false;
  private lastActiveCityId: string | null = null;
  private descriptionMeasurementTimer: ReturnType<typeof setTimeout> | null = null;

  @ViewChildren('poiTeaser') private readonly poiTeaserElements?: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private readonly appState: AppStateService,
    private readonly geoService: GeoService,
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    private readonly playerService: PlayerService,
    private readonly structureLocationService: StructureLocationService,
    private readonly cartService: CartService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    public readonly i18n: I18nService
  ) {
    this.shouldRestoreScroll = this.router.getCurrentNavigation()?.trigger === 'popstate';
  }

  get visibleAssociatedStructure(): HotelAssociation | null {
    if (!this.associatedStructure?.structureId) {
      return null;
    }

    const cityIds = this.associationCityIds(this.associatedStructure);
    if (cityIds.length && !cityIds.includes(this.activeCityId)) {
      return null;
    }

    return this.associatedStructure;
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

    combineLatest([this.appState.activeCityId$, this.appState.hotelAssociation$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([cityId, association]) => {
        if (this.lastActiveCityId && this.lastActiveCityId !== cityId) {
          this.citySwitching = true;
          this.citySummaryExpanded = false;
          this.expandedPoiDescriptions.clear();
        }

        this.lastActiveCityId = cityId;
        this.activeCityId = cityId;
        this.associatedStructure = association;
        this.schedulePoiDescriptionMeasurement();
      });

    this.appState.language$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.schedulePoiDescriptionMeasurement();
    });

    this.vm$.pipe(takeUntil(this.destroy$)).subscribe((vm) => {
      this.loading = false;
      this.restoreScrollPosition();
      if (vm.cityId === this.activeCityId) {
        this.citySwitching = false;
      }
      this.schedulePoiDescriptionMeasurement();

      if (vm.nearestPoi && vm.nearestPoi.near && !this.geofenceShown.has(vm.nearestPoi.id) && this.hasPlayableAudio(vm.nearestPoi)) {
        this.geofenceShown.add(vm.nearestPoi.id);
        const ref = this.snackBar.open(
          this.i18n.t('home.geofencePrompt', { name: this.poiName(vm.nearestPoi) }),
          this.i18n.t('home.geofenceAction'),
          {
            duration: 4500,
            verticalPosition: 'top'
          }
        );

        ref.onAction().subscribe(() => {
          this.saveScrollPosition();
          void this.router.navigate(['/player', vm.nearestPoi!.id], { queryParams: { preview: false } });
        });
      }
    });

    const latest = this.playerService.getLatestProgress();
    if (latest) {
      this.continueTime = latest.currentTime;
      this.poiService
        .getPoiById(latest.poiId, false)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (poi) => {
            this.continuePoi = this.hasPlayableAudio(poi) ? poi : undefined;
          }
        });
    }
  }

  ngAfterViewInit(): void {
    this.poiTeaserElements?.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.schedulePoiDescriptionMeasurement();
    });
    this.schedulePoiDescriptionMeasurement();
  }

  ngOnDestroy(): void {
    if (this.descriptionMeasurementTimer) {
      clearTimeout(this.descriptionMeasurementTimer);
      this.descriptionMeasurementTimer = null;
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.schedulePoiDescriptionMeasurement();
  }

  onCityChanged(cityId: string): void {
    if (!cityId || cityId === this.activeCityId) {
      return;
    }
    this.citySwitching = true;
    this.citySummaryExpanded = false;
    this.expandedPoiDescriptions.clear();
    this.appState.setActiveCity(cityId);
  }

  currentCityName(): string {
    const city = this.cities.find((item) => item.id === this.activeCityId);
    return String(city?.name || '').trim() || this.cityName(this.activeCityId);
  }

  currentCityRegion(): string {
    const city = this.cities.find((item) => item.id === this.activeCityId);
    return this.i18n.translateRegion(String(city?.region || '').trim() || 'Sicilia');
  }

  currentCityDescription(): string {
    const key = `home.cityDescription.${this.activeCityId}`;
    const description = this.i18n.t(key);
    return description === key ? '' : description;
  }

  citySummaryText(): string {
    const full = this.currentCityDescription();
    if (this.citySummaryExpanded || full.length <= citySummaryMaxLength) {
      return full;
    }
    return `${full.slice(0, citySummaryMaxLength).trimEnd()}...`;
  }

  canExpandCitySummary(): boolean {
    return this.currentCityDescription().length > citySummaryMaxLength;
  }

  toggleCitySummary(): void {
    this.citySummaryExpanded = !this.citySummaryExpanded;
  }

  isCityBundleUnlocked(cityId: string): boolean {
    return this.purchaseService.isCityUnlocked(cityId);
  }

  purchaseCity(cityId: string): void {
    this.purchaseService.purchaseCityBundle(cityId, this.cityName(cityId), this.cityBundlePrice(cityId)).subscribe({
      next: (result) => {
        if (result?.action === 'paid') {
          this.toast(this.i18n.t('map.cityUnlocked', { city: this.cityName(cityId) }));
        }
      },
      error: () => {
        this.toast(this.i18n.t('home.operationFailed'), this.i18n.t('common.close'), 2600);
      }
    });
  }

  addPoiToCart(poi: Poi): void {
    if (this.purchaseService.isPoiUnlocked(poi.id, poi.cityId)) {
      this.toast(this.i18n.t('home.placeAlreadyUnlocked'), this.i18n.t('common.ok'), 2000);
      return;
    }
    if (this.cartService.isPoiInCart(poi.id)) {
      this.toast(this.i18n.t('home.placeAlreadyInCart'), this.i18n.t('common.ok'), 2200);
      return;
    }

    const added = this.cartService.addPoi({
      poiId: poi.id,
      cityId: poi.cityId,
      cityName: this.cityName(poi.cityId),
      label: this.poiName(poi),
      amount: poi.priceSingle
    });
    if (added) {
      this.toast(this.i18n.t('home.placeAdded', { name: this.poiName(poi) }));
    }
  }

  isPoiInCart(poiId: string): boolean {
    return this.cartService.isPoiInCart(poiId);
  }

  onPoiAudioAction(poi: PoiHomeView): void {
    if (!this.hasPlayableAudio(poi)) {
      this.toast(this.i18n.t('home.noAudio'));
      return;
    }

    if (poi.unlocked) {
      this.playPoi(poi, false);
      return;
    }

    this.openPoi(poi.id);
  }

  toggleFavorite(poiId: string): void {
    this.appState.toggleFavorite(poiId);
  }

  isFavorite(poiId: string): boolean {
    return this.appState.isFavorite(poiId);
  }

  togglePoiDescription(poiId: string): void {
    if (!poiId) {
      return;
    }

    if (this.expandedPoiDescriptions.has(poiId)) {
      this.expandedPoiDescriptions.delete(poiId);
      return;
    }

    this.expandedPoiDescriptions.add(poiId);
  }

  isPoiDescriptionExpanded(poiId: string): boolean {
    return this.expandedPoiDescriptions.has(poiId);
  }

  canExpandPoiDescription(poi: Poi): boolean {
    return Boolean(poi?.id && this.expandablePoiDescriptions.has(poi.id));
  }

  poiAddress(poi: Poi): string {
    return String(poi.address || '').trim() || `${this.poiName(poi)}, ${this.cityName(poi.cityId)}`;
  }

  poiName(poi: Poi | null | undefined): string {
    return this.i18n.resolvePoiField(poi?.name, poi?.translations, 'name');
  }

  poiDescription(poi: Poi | null | undefined): string {
    return this.i18n.resolvePoiField(poi?.descriptionShort, poi?.translations, 'descriptionShort');
  }

  playPoi(poi: Poi, preview: boolean): void {
    if (!this.hasPlayableAudio(poi)) {
      this.toast(this.i18n.t('home.noAudio'));
      return;
    }

    this.saveScrollPosition();
    void this.router.navigate(['/player', poi.id], {
      queryParams: { preview }
    });
  }

  openPoi(poiId: string): void {
    this.saveScrollPosition();
    void this.router.navigate(['/poi', poiId]);
  }

  navigateToAssociatedStructure(): void {
    const association = this.visibleAssociatedStructure;
    if (!association?.structureId) {
      return;
    }

    const url = this.structureLocationService.buildExternalDirectionsUrl(association, null);
    if (!url) {
      this.toast(this.i18n.t('home.structureNavigationUnavailable'), this.i18n.t('common.close'));
      return;
    }

    window.open(url, '_blank', 'noopener');
  }

  cityName(cityId: string): string {
    return formatCityLabel(cityId, this.cities, this.i18n.language);
  }

  cityBundlePrice(cityId: string): number {
    const normalizedCityId = String(cityId || '').trim().toLowerCase();
    const city = this.cities.find((item) => String(item.id || '').trim().toLowerCase() === normalizedCityId);
    const price = Number(city?.bundlePrice);
    return Number.isFinite(price) && price >= 0 ? price : defaultCityUnlockPrice;
  }

  resumePlayback(): void {
    if (!this.continuePoi || !this.hasPlayableAudio(this.continuePoi)) {
      return;
    }

    this.playPoi(this.continuePoi, false);
  }

  hasPlayableAudio(poi: Poi | null | undefined): boolean {
    return this.poiService.hasPreviewAudio(poi);
  }

  private toast(message: string, action = this.i18n.t('common.ok'), duration = 2400): void {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'top'
    });
  }

  private schedulePoiDescriptionMeasurement(): void {
    if (this.descriptionMeasurementTimer) {
      clearTimeout(this.descriptionMeasurementTimer);
    }

    this.descriptionMeasurementTimer = setTimeout(() => {
      this.descriptionMeasurementTimer = null;
      this.measureExpandablePoiDescriptions();
    }, 0);
  }

  private measureExpandablePoiDescriptions(): void {
    const elements = this.poiTeaserElements?.toArray() || [];
    const nextExpandable = new Set<string>();

    elements.forEach((elementRef) => {
      const element = elementRef.nativeElement;
      const poiId = String(element.dataset['poiId'] || '').trim();
      if (!poiId) {
        return;
      }

      const wasExpanded = element.classList.contains('expanded');
      if (wasExpanded) {
        element.classList.remove('expanded');
      }

      const isOverflowing = element.scrollHeight > element.clientHeight + 1;
      if (isOverflowing) {
        nextExpandable.add(poiId);
      }

      if (wasExpanded) {
        element.classList.add('expanded');
      }
    });

    this.expandedPoiDescriptions.forEach((poiId) => {
      if (!nextExpandable.has(poiId)) {
        this.expandedPoiDescriptions.delete(poiId);
      }
    });
    this.expandablePoiDescriptions = nextExpandable;
  }

  private saveScrollPosition(): void {
    const y = window.scrollY || window.pageYOffset || 0;
    sessionStorage.setItem(homeScrollStorageKey, String(Math.max(0, Math.round(y))));
  }

  private restoreScrollPosition(): void {
    if (this.restoredScroll) {
      return;
    }

    this.restoredScroll = true;
    if (!this.shouldRestoreScroll) {
      sessionStorage.removeItem(homeScrollStorageKey);
      return;
    }

    const raw = sessionStorage.getItem(homeScrollStorageKey);
    if (raw === null) {
      return;
    }

    sessionStorage.removeItem(homeScrollStorageKey);
    const y = Number(raw);
    if (!Number.isFinite(y) || y < 0) {
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: y, left: 0, behavior: 'auto' });
    });
  }

  private describeApiError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return this.i18n.t('home.backendUnavailable');
      }

      if (error.status === 200) {
        return this.i18n.t('home.apiInvalid');
      }

      return this.i18n.t('home.apiError');
    }

    return this.i18n.t('home.apiError');
  }

  private associationCityIds(association: HotelAssociation): string[] {
    if (Array.isArray(association.cityIds) && association.cityIds.length) {
      return association.cityIds.map((cityId) => String(cityId || '').trim()).filter(Boolean);
    }

    const singleCityId = String(association.cityId || '').trim();
    return singleCityId ? [singleCityId] : [];
  }
}
