import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { City } from '../../core/models/city.model';
import { Poi } from '../../core/models/poi.model';
import { AppStateService } from '../../core/services/app-state.service';
import { CartService } from '../../core/services/cart.service';
import { GeoService } from '../../core/services/geo.service';
import { I18nService } from '../../core/services/i18n.service';
import { PlayerService } from '../../core/services/player.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';
import { formatCityLabel } from '../../core/utils/city-label.util';

const descriptionPreviewLength = 260;
const defaultCityUnlockPrice = 15;

@Component({
  standalone: false,
  selector: 'app-poi-detail',
  templateUrl: './poi-detail.component.html',
  styleUrls: ['./poi-detail.component.scss']
})
export class PoiDetailComponent implements OnInit, OnDestroy {
  poi?: Poi;
  distanceLabel = '--';
  unlocked = false;
  isFavorite = false;
  loading = true;
  loadError = false;
  descriptionExpanded = false;
  cities: City[] = [];
  readonly previewSeconds = environment.previewSeconds;
  readonly previewPlayerState$ = this.playerService.state$;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    private readonly appState: AppStateService,
    private readonly geoService: GeoService,
    private readonly cartService: CartService,
    private readonly playerService: PlayerService,
    public readonly i18n: I18nService,
    private readonly location: Location,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.purchaseService.refresh();
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

    this.route.paramMap
      .pipe(
        tap(() => {
          this.loading = true;
          this.loadError = false;
          this.poi = undefined;
          this.descriptionExpanded = false;
        }),
        switchMap((params) => this.poiService.getPoiById(String(params.get('id')))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (poi) => {
          this.poi = poi;
          this.isFavorite = this.appState.isFavorite(poi.id);
          this.unlocked = this.purchaseService.isPoiUnlocked(poi.id, poi.cityId);
          this.updateDistanceLabel();
          if (this.hasPlayableAudio(poi)) {
            this.playerService.loadTrack(poi.id, this.poiPreviewAudioUrl(poi), true);
          } else {
            this.playerService.pause();
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.loadError = true;
          this.poi = undefined;
        }
      });

    this.geoService.coordinates$.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateDistanceLabel());
    this.purchaseService.purchases$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.poi) {
        this.unlocked = this.purchaseService.isPoiUnlocked(this.poi.id, this.poi.cityId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.playerService.pause();
  }

  openFullPlayer(): void {
    if (!this.poi) {
      return;
    }

    if (!this.hasPlayableAudio(this.poi)) {
      this.snackBar.open(this.i18n.t('map.noAudio'), this.i18n.t('common.ok'), { duration: 2400 });
      return;
    }

    if (!this.unlocked) {
      this.snackBar.open(this.i18n.t('poiDetail.listenPreviewFirst'), this.i18n.t('common.ok'), { duration: 2200 });
      return;
    }

    void this.router.navigate(['/player', this.poi.id], { queryParams: { preview: false } });
  }

  startNavigation(): void {
    if (!this.poi) {
      return;
    }

    this.appState.setActiveCity(this.poi.cityId);
    void this.router.navigate(['/map'], {
      queryParams: {
        poiId: this.poi.id,
        nav: 1
      }
    });
  }

  addPoiToCart(): void {
    if (!this.poi) {
      return;
    }

    if (this.unlocked) {
      this.snackBar.open(this.i18n.t('home.placeAlreadyUnlocked'), this.i18n.t('common.ok'), { duration: 2200 });
      return;
    }

    if (this.cartService.isPoiInCart(this.poi.id)) {
      this.snackBar.open(this.i18n.t('home.placeAlreadyInCart'), this.i18n.t('common.ok'), { duration: 2200 });
      return;
    }

    this.cartService.addPoi({
      poiId: this.poi.id,
      cityId: this.poi.cityId,
      cityName: this.cityName(this.poi.cityId),
      label: this.poiName(this.poi),
      amount: this.poi.priceSingle
    });
    this.snackBar.open(this.i18n.t('home.placeAdded', { name: this.poiName(this.poi) }), this.i18n.t('common.ok'), {
      duration: 2400
    });
  }

  purchaseCity(): void {
    if (!this.poi) {
      return;
    }

    this.purchaseService.purchaseCityBundle(this.poi.cityId, this.cityName(this.poi.cityId), this.cityBundlePrice(this.poi.cityId)).subscribe({
      next: (result) => {
        if (result?.action === 'paid') {
          this.unlocked = true;
          this.snackBar.open(
            this.i18n.t('map.cityUnlocked', { city: this.cityName(this.poi?.cityId || '') }),
            this.i18n.t('common.ok'),
            { duration: 2400 }
          );
        }
      },
      error: () => {
        this.snackBar.open(this.i18n.t('home.operationFailed'), this.i18n.t('common.close'), { duration: 2400 });
      }
    });
  }

  formatPrice(amount: number): string {
    return this.i18n.formatCurrency(Number(amount || 0));
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

  hasPlayableAudio(poi: Poi | null | undefined): boolean {
    return Boolean(this.poiPreviewAudioUrl(poi));
  }

  toggleFavorite(): void {
    if (!this.poi) {
      return;
    }

    this.appState.toggleFavorite(this.poi.id);
    this.isFavorite = this.appState.isFavorite(this.poi.id);
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    void this.router.navigate(['/home']);
  }

  poiAddress(poi: Poi): string {
    return String(poi.address || '').trim() || `${this.poiName(poi)}, ${this.cityName(poi.cityId)}`;
  }

  descriptionText(poi: Poi): string {
    const source = this.unlocked ? this.poiDescriptionLong(poi) : this.poiDescriptionShort(poi);
    if (!source) {
      return '';
    }

    if (this.descriptionExpanded || source.length <= descriptionPreviewLength) {
      return source;
    }

    return `${source.slice(0, descriptionPreviewLength).trimEnd()}...`;
  }

  canExpandDescription(poi: Poi): boolean {
    const source = this.unlocked ? this.poiDescriptionLong(poi) : this.poiDescriptionShort(poi);
    return source.length > descriptionPreviewLength;
  }

  toggleDescription(): void {
    this.descriptionExpanded = !this.descriptionExpanded;
  }

  isInCart(): boolean {
    return this.poi ? this.cartService.isPoiInCart(this.poi.id) : false;
  }

  togglePreviewPlay(): void {
    if (!this.poi || !this.hasPlayableAudio(this.poi)) {
      return;
    }

    this.playerService.togglePlayPause();
  }

  seekPreview(event: Event): void {
    if (!this.poi || !this.hasPlayableAudio(this.poi)) {
      return;
    }

    const value = Number((event.target as HTMLInputElement).value);
    this.playerService.seek(value);
  }

  skipPreview(deltaSeconds: number): void {
    if (!this.poi || !this.hasPlayableAudio(this.poi)) {
      return;
    }

    this.playerService.skipBy(deltaSeconds);
  }

  previewDurationLimit(state: { duration?: number } | null | undefined, poi: Poi | null | undefined): number {
    const metadataDuration = Number(state?.duration || 0);
    const poiDuration = Number(poi?.durationSec || 0);
    const previewLimit = Number(this.previewSeconds || 30);

    if (Number.isFinite(metadataDuration) && metadataDuration > 0) {
      return Math.max(1, Math.min(previewLimit, metadataDuration));
    }

    if (Number.isFinite(poiDuration) && poiDuration > 0) {
      return Math.max(1, Math.min(previewLimit, poiDuration));
    }

    return Math.max(1, previewLimit);
  }

  previewCurrentTime(state: { currentTime?: number; duration?: number } | null | undefined, poi: Poi | null | undefined): number {
    const currentTime = Number(state?.currentTime || 0);
    if (!Number.isFinite(currentTime) || currentTime <= 0) {
      return 0;
    }

    return Math.min(currentTime, this.previewDurationLimit(state, poi));
  }

  formatClock(value: number): string {
    if (!Number.isFinite(value) || value <= 0) {
      return '0:00';
    }

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60)
      .toString()
      .padStart(2, '0');

    return `${minutes}:${seconds}`;
  }

  poiName(poi: Poi | null | undefined): string {
    return this.i18n.resolvePoiField(poi?.name, poi?.translations, 'name');
  }

  poiDescriptionShort(poi: Poi | null | undefined): string {
    return this.i18n.resolvePoiField(poi?.descriptionShort, poi?.translations, 'descriptionShort');
  }

  poiDescriptionLong(poi: Poi | null | undefined): string {
    return this.i18n.resolvePoiField(poi?.descriptionLong, poi?.translations, 'descriptionLong');
  }

  poiPreviewAudioUrl(poi: Poi | null | undefined): string {
    return this.poiService.getPoiPreviewAudioUrl(poi);
  }

  poiFullAudioUrl(poi: Poi | null | undefined): string {
    return this.poiService.getPoiFullAudioUrl(poi);
  }

  private updateDistanceLabel(): void {
    if (!this.poi) {
      return;
    }

    const current = this.geoService.currentCoordinates;
    if (!current) {
      this.distanceLabel = this.i18n.t('common.positionUnavailable');
      return;
    }

    const distance = this.geoService.distanceInMeters(current, {
      lat: this.poi.lat,
      lng: this.poi.lng
    });

    this.distanceLabel = this.i18n.formatDistance(distance);
  }
}
