import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, combineLatest, map, of, shareReplay, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Poi } from '../../core/models/poi.model';
import { AppStateService } from '../../core/services/app-state.service';
import { Coordinates, GeoPermissionState, GeoService } from '../../core/services/geo.service';
import { PlayerService } from '../../core/services/player.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';

interface PoiHomeView extends Poi {
  distanceMeters: number;
  distanceLabel: string;
  unlocked: boolean;
  near: boolean;
}

interface HomeViewModel {
  nearestPoi: PoiHomeView | null;
  pois: PoiHomeView[];
  permission: GeoPermissionState;
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

const homeScrollStorageKey = 'tourismapp.home.scrollY';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  apiErrorMessage: string | null = null;
  loading = true;
  readonly cityUnlockPriceLabel = '14,99';

  readonly vm$ = combineLatest([
    this.appState.activeCityId$.pipe(
      switchMap((cityId) =>
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
    this.geoService.permission$.pipe(startWith('prompt' as GeoPermissionState)),
    this.purchaseService.purchases$.pipe(startWith({ items: [], unlockedPoiIds: [], unlockedCityIds: [] }))
  ]).pipe(
    map(([cityData, coordinates, permission]) => {
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
            distanceLabel: this.formatDistance(distanceMeters),
            unlocked,
            near: distanceMeters <= environment.geofenceRadiusMeters
          } satisfies PoiHomeView;
        })
        .sort((a, b) => a.distanceMeters - b.distanceMeters);

      return {
        nearestPoi: pois[0] || null,
        pois,
        permission
      } satisfies HomeViewModel;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  continuePoi?: Poi;
  continueTime = 0;

  private readonly geofenceShown = new Set<string>();
  private readonly destroy$ = new Subject<void>();
  private readonly shouldRestoreScroll: boolean;
  private restoredScroll = false;

  constructor(
    private readonly appState: AppStateService,
    private readonly geoService: GeoService,
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    private readonly playerService: PlayerService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {
    this.shouldRestoreScroll = this.router.getCurrentNavigation()?.trigger === 'popstate';
  }

  ngOnInit(): void {
    this.purchaseService.refresh();
    void this.geoService.requestPermissionAndTrack();

    this.vm$.pipe(takeUntil(this.destroy$)).subscribe((vm) => {
      this.loading = false;
      this.restoreScrollPosition();

      if (vm.nearestPoi && vm.nearestPoi.near && !this.geofenceShown.has(vm.nearestPoi.id)) {
        const nearestPoi = vm.nearestPoi;
        this.geofenceShown.add(nearestPoi.id);
        const ref = this.snackBar.open(`Sei davanti a ${nearestPoi.name}. Avvia audio?`, 'Avvia', {
          duration: 4500
        });

        ref.onAction().subscribe(() => {
          this.saveScrollPosition();
          void this.router.navigate(['/player', nearestPoi.id], { queryParams: { preview: false } });
        });
      }
    });

    const latest = this.playerService.getLatestProgress();
    if (latest) {
      this.continueTime = latest.currentTime;
      this.poiService
        .getPoiById(latest.poiId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (poi) => {
            this.continuePoi = poi;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  askLocationAgain(): void {
    void this.geoService.requestPermissionAndTrack();
  }

  onMainCta(poi: PoiHomeView): void {
    if (poi.unlocked) {
      this.playPoi(poi, false);
      return;
    }

    this.purchasePoi(poi);
  }

  playPoi(poi: Poi, preview: boolean): void {
    this.saveScrollPosition();
    void this.router.navigate(['/player', poi.id], {
      queryParams: { preview }
    });
  }

  openPoi(poiId: string): void {
    this.saveScrollPosition();
    void this.router.navigate(['/poi', poiId]);
  }

  purchaseCity(cityId: string): void {
    this.purchaseService.purchaseCityBundle(cityId).subscribe({
      next: () => {
        this.snackBar.open(`Città sbloccata: ${this.cityName(cityId)}`, 'OK', { duration: 2200 });
      },
      error: () => {
        this.snackBar.open('Acquisto simulato non riuscito', 'Chiudi', { duration: 2600 });
      }
    });
  }

  purchasePoi(poi: Poi): void {
    this.purchaseService.purchasePoiSingle(poi.id).subscribe({
      next: () => {
        this.snackBar.open(`Luogo sbloccato: ${poi.name}`, 'OK', { duration: 2200 });
      },
      error: () => {
        this.snackBar.open('Acquisto simulato non riuscito', 'Chiudi', { duration: 2600 });
      }
    });
  }

  cityName(cityId: string): string {
    return cityNameMap[cityId] || cityId;
  }

  formatPrice(amount: number): string {
    return amount.toFixed(2).replace('.', ',');
  }

  resumePlayback(): void {
    if (!this.continuePoi) {
      return;
    }

    this.saveScrollPosition();
    void this.router.navigate(['/player', this.continuePoi.id], {
      queryParams: { preview: false }
    });
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

  private formatDistance(distanceMeters: number): string {
    if (distanceMeters < 1000) {
      return `${Math.round(distanceMeters)} m`;
    }

    return `${(distanceMeters / 1000).toFixed(1)} km`;
  }

  private describeApiError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Backend non raggiungibile. Avvia API su http://localhost:3000.';
      }

      if (error.status === 200) {
        return 'Risposta API non valida (atteso JSON). Controlla proxy Angular e backend.';
      }

      return `Errore API ${error.status}: ${error.statusText || 'risposta non valida'}.`;
    }

    return 'Errore caricamento dati Home.';
  }
}
