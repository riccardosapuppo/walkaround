import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, combineLatest, map, of, shareReplay, startWith, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { City } from '../../core/models/city.model';
import { Poi } from '../../core/models/poi.model';
import { AppStateService, HotelAssociation } from '../../core/services/app-state.service';
import { Coordinates, GeoPermissionState, GeoService } from '../../core/services/geo.service';
import { PlayerService } from '../../core/services/player.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';
import { StructureLocationService } from '../../core/services/structure-location.service';
import { formatCityLabel } from '../../core/utils/city-label.util';
import {
  CityPoiPickerDialogComponent,
  CityPoiPickerDialogData,
  CityPoiPickerDialogResult
} from './city-poi-picker-dialog.component';

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
  permission: GeoPermissionState;
}

const cityFallbackMap: Record<string, Coordinates> = {
  catania: { lat: 37.5079, lng: 15.083 },
  siracusa: { lat: 37.067, lng: 15.2866 },
  taormina: { lat: 37.8531, lng: 15.2899 },
  ragusa: { lat: 36.9269, lng: 14.7305 }
};

const cityDescriptionMap: Record<string, string> = {
  catania: 'Citta di pietra lavica e barocco, perfetta per iniziare un tour tra storia e mercati locali.',
  siracusa: "Tra Ortigia e area archeologica, un mix unico di mare, mito e architettura classica.",
  taormina: "Panorami sullo Ionio, vicoli eleganti e siti iconici come il Teatro Antico e Isola Bella.",
  ragusa: 'Un itinerario tra scorci barocchi, salite panoramiche e piazze storiche del Val di Noto.'
};

const homeScrollStorageKey = 'walkaround.home.scrollY';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  apiErrorMessage: string | null = null;
  loading = true;
  readonly cityUnlockPrice = 14.99;
  readonly cityUnlockPriceLabel = '14,99';
  activeCityId = 'catania';
  associatedStructure: HotelAssociation | null = null;
  cityPanelOpen = false;
  citySwitching = false;
  cities: City[] = [];

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
        cityId: cityData.cityId,
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
  private latestVm: HomeViewModel | null = null;
  private lastActiveCityId: string | null = null;

  constructor(
    private readonly appState: AppStateService,
    private readonly geoService: GeoService,
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    private readonly playerService: PlayerService,
    private readonly structureLocationService: StructureLocationService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
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
          this.cityPanelOpen = false;
        }

        this.lastActiveCityId = cityId;
        this.activeCityId = cityId;
        this.associatedStructure = association;
      });

    this.vm$.pipe(takeUntil(this.destroy$)).subscribe((vm) => {
      this.latestVm = vm;
      this.loading = false;
      this.restoreScrollPosition();
      if (vm.cityId === this.activeCityId) {
        this.citySwitching = false;
      }

      if (vm.nearestPoi && vm.nearestPoi.near && !this.geofenceShown.has(vm.nearestPoi.id) && this.hasPlayableAudio(vm.nearestPoi)) {
        const nearestPoi = vm.nearestPoi;
        this.geofenceShown.add(nearestPoi.id);
        const ref = this.snackBar.open(`Sei davanti a ${nearestPoi.name}. Avvia audio?`, 'Avvia', {
          duration: 4500,
          verticalPosition: 'top'
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
            this.continuePoi = this.hasPlayableAudio(poi) ? poi : undefined;
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
      if (!this.hasPlayableAudio(poi)) {
        this.toast('Audio non disponibile per questo luogo.');
        return;
      }
      this.playPoi(poi, false);
      return;
    }

    this.purchasePoi(poi);
  }

  onPoiAudioAction(poi: PoiHomeView): void {
    this.playPoi(poi, !poi.unlocked);
  }

  toggleCityPanel(): void {
    if (this.citySwitching) {
      return;
    }

    this.cityPanelOpen = !this.cityPanelOpen;
  }

  closeCityPanel(): void {
    this.cityPanelOpen = false;
  }

  selectCity(cityId: string): void {
    if (!cityId || cityId === this.activeCityId) {
      this.cityPanelOpen = false;
      return;
    }

    this.cityPanelOpen = false;
    this.citySwitching = true;
    this.appState.setActiveCity(cityId);
  }

  currentCityName(): string {
    const city = this.cities.find((item) => item.id === this.activeCityId);
    return city?.name || this.cityName(this.activeCityId);
  }

  currentCityDescription(): string {
    const city = this.cities.find((item) => item.id === this.activeCityId);
    const region = String(city?.region || '').trim();
    const curated = cityDescriptionMap[this.activeCityId];
    if (curated) {
      return region ? `${curated} Regione: ${region}.` : curated;
    }

    return region ? `Scopri i punti di interesse di ${this.currentCityName()} in ${region}.` : `Scopri ${this.currentCityName()}.`;
  }

  unlockedPoiCount(vm: HomeViewModel): number {
    return vm.pois.filter((poi) => poi.unlocked).length;
  }

  isCityBundleUnlocked(cityId: string): boolean {
    return this.purchaseService.isCityUnlocked(cityId);
  }

  onCityBundleStatClick(): void {
    if (this.isCityBundleUnlocked(this.activeCityId)) {
      this.toast(`Pacchetto ${this.currentCityName()} gia attivo`, 'OK', 2200);
      return;
    }

    this.purchaseCity(this.activeCityId);
  }

  openCityPoiPicker(vm: HomeViewModel): void {
    if (this.isCityBundleUnlocked(this.activeCityId)) {
      this.toast(`Hai gia sbloccato tutti i ${vm.pois.length} luoghi di ${this.currentCityName()}.`, 'OK', 2800);
      return;
    }

    const dialogData: CityPoiPickerDialogData = {
      cityId: this.activeCityId,
      cityName: this.currentCityName(),
      cityUnlockPriceLabel: this.cityUnlockPriceLabel,
      pois: vm.pois.map((poi) => ({
        id: poi.id,
        name: poi.name,
        distanceLabel: poi.distanceLabel,
        durationSec: poi.durationSec,
        priceSingle: poi.priceSingle,
        descriptionShort: poi.descriptionShort,
        unlocked: poi.unlocked
      }))
    };

    this.dialog
      .open(CityPoiPickerDialogComponent, {
        autoFocus: false,
        restoreFocus: true,
        width: 'min(92vw, 760px)',
        maxWidth: '760px',
        maxHeight: '94dvh',
        data: dialogData
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: CityPoiPickerDialogResult | undefined) => {
        if (!result) {
          return;
        }

        if (result.action === 'purchase-city-bundle') {
          this.purchaseCity(this.activeCityId);
          return;
        }

        const selectedPoiIds = Array.isArray(result.selectedPoiIds) ? result.selectedPoiIds : [];
        if (!selectedPoiIds.length) {
          return;
        }

        if (selectedPoiIds.length > 1) {
          this.toast('Per acquisto multiplo viene usato il pacchetto citta.', 'OK', 2600);
          this.purchaseCity(this.activeCityId);
          return;
        }

        const latestVm = this.latestVm;
        const target = latestVm?.pois.find((poi) => poi.id === selectedPoiIds[0]);
        if (!target) {
          return;
        }

        this.purchasePoi(target);
      });
  }

  playPoi(poi: Poi, preview: boolean): void {
    if (!this.hasPlayableAudio(poi)) {
      this.toast('Audio non disponibile per questo luogo.');
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

  purchaseCity(cityId: string): void {
    this.purchaseService.purchaseCityBundle(cityId, this.cityName(cityId), this.cityUnlockPrice).subscribe({
      next: (result) => {
        if (result?.action === 'paid') {
          this.toast(`Citta sbloccata: ${this.cityName(cityId)}`);
        }
      },
      error: () => {
        this.toast('Operazione non riuscita', 'Chiudi', 2600);
      }
    });
  }

  purchasePoi(poi: Poi): void {
    this.purchaseService.purchasePoiSingle(poi.id, poi.cityId, poi.name, poi.priceSingle).subscribe({
      next: (result) => {
        if (result?.action === 'paid') {
          this.toast(`Luogo sbloccato: ${poi.name}`);
        }
      },
      error: () => {
        this.toast('Operazione non riuscita', 'Chiudi', 2600);
      }
    });
  }

  navigateToAssociatedStructure(): void {
    const association = this.visibleAssociatedStructure;
    if (!association?.structureId) {
      return;
    }

    const url = this.structureLocationService.buildExternalDirectionsUrl(association, null);
    if (!url) {
      this.toast('Dati struttura non disponibili per la navigazione', 'Chiudi');
      return;
    }

    window.open(url, '_blank', 'noopener');
  }

  cityName(cityId: string): string {
    return formatCityLabel(cityId, this.cities);
  }

  formatPrice(amount: number): string {
    return amount.toFixed(2).replace('.', ',');
  }

  resumePlayback(): void {
    if (!this.continuePoi || !this.hasPlayableAudio(this.continuePoi)) {
      return;
    }

    this.playPoi(this.continuePoi, false);
  }

  hasPlayableAudio(poi: { audioUrl?: string | null } | null | undefined): boolean {
    return Boolean(String(poi?.audioUrl || '').trim());
  }

  private toast(message: string, action = 'OK', duration = 2400): void {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'top'
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

  private associationCityIds(association: HotelAssociation): string[] {
    if (Array.isArray(association.cityIds) && association.cityIds.length) {
      return association.cityIds.map((cityId) => String(cityId || '').trim()).filter(Boolean);
    }

    const singleCityId = String(association.cityId || '').trim();
    return singleCityId ? [singleCityId] : [];
  }
}
