import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, combineLatest, map, of, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import {
  divIcon,
  latLng,
  Layer,
  LeafletMouseEvent,
  Map,
  marker,
  tileLayer,
  type Marker
} from 'leaflet';
import { environment } from '../../../environments/environment';
import { Poi } from '../../core/models/poi.model';
import { AppStateService } from '../../core/services/app-state.service';
import { Coordinates, GeoService } from '../../core/services/geo.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';
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

const cityFallbackMap: Record<string, Coordinates> = {
  catania: { lat: 37.5079, lng: 15.083 },
  siracusa: { lat: 37.067, lng: 15.2866 },
  taormina: { lat: 37.8531, lng: 15.2899 }
};

const cityNameMap: Record<string, string> = {
  catania: 'Catania',
  siracusa: 'Siracusa',
  taormina: 'Taormina'
};

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

  private mapRef?: Map;
  private currentCoordinates?: Coordinates;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly appState: AppStateService,
    private readonly geoService: GeoService,
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.purchaseService.refresh();
    void this.geoService.requestPermissionAndTrack();

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
              this.apiErrorMessage = 'Errore caricamento mappa. Controlla backend e proxy API.';
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

        this.poiCount = prepared.length;
        this.markerLayers = prepared.map((poi) => this.createPoiMarker(poi));
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMapReady(map: Map): void {
    this.mapRef = map;
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

  private createPoiMarker(poi: PoiMapView): Marker {
    const markerStatusClass = poi.near ? 'poi-near' : poi.unlocked ? 'poi-unlocked' : 'poi-locked';

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
      const sheet = this.bottomSheet.open(PoiMapSheetComponent, {
        data: {
          poi,
          distanceLabel: poi.distanceLabel,
          unlocked: poi.unlocked
        }
      });

      sheet.afterDismissed().subscribe((result?: PoiMapSheetAction) => {
        if (!result) {
          return;
        }

        if (result.action === 'open-detail') {
          void this.router.navigate(['/poi', result.poiId]);
          return;
        }

        if (result.action === 'play') {
          void this.router.navigate(['/player', result.poiId], {
            queryParams: { preview: result.preview }
          });
          return;
        }

        this.purchaseService.purchaseCityBundle(result.cityId).subscribe({
          next: () => {
            this.snackBar.open(`Città sbloccata: ${this.cityName(result.cityId)}`, 'OK', { duration: 2200 });
          },
          error: () => {
            this.snackBar.open('Acquisto non riuscito', 'Chiudi', { duration: 2400 });
          }
        });
      });
    });

    return poiMarker;
  }

  private formatDistance(distanceMeters: number): string {
    if (distanceMeters < 1000) {
      return `${Math.round(distanceMeters)} m`;
    }

    return `${(distanceMeters / 1000).toFixed(1)} km`;
  }

  private cityName(cityId: string): string {
    return cityNameMap[cityId] || cityId;
  }
}


