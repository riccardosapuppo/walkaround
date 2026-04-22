import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { City } from '../../core/models/city.model';
import { Poi } from '../../core/models/poi.model';
import { AppStateService } from '../../core/services/app-state.service';
import { GeoService } from '../../core/services/geo.service';
import { I18nService } from '../../core/services/i18n.service';
import { OfflineService } from '../../core/services/offline.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';
import { formatCityLabel } from '../../core/utils/city-label.util';

interface AudioItem extends Poi {
  offline: boolean;
  distanceMeters: number | null;
  isFavorite: boolean;
}

@Component({
  standalone: false,
  selector: 'app-my-audio',
  templateUrl: './my-audio.component.html',
  styleUrls: ['./my-audio.component.scss']
})
export class MyAudioComponent implements OnInit, OnDestroy {
  audioItems: AudioItem[] = [];
  offlineMinutes = 0;
  loading = true;

  private allPois: Poi[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    private readonly offlineService: OfflineService,
    private readonly appState: AppStateService,
    private readonly geoService: GeoService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    public readonly i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.purchaseService.refresh();
    void this.geoService.requestPermissionAndTrack();

    this.poiService
      .getCities()
      .pipe(
        switchMap((cities: City[]) => forkJoin(cities.map((city) => this.poiService.getPoisByCity(city.id)))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: async (allGroups) => {
          this.allPois = allGroups.flat();
          await this.rebuildList();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });

    this.purchaseService.purchases$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      void this.rebuildList();
    });

    this.geoService.coordinates$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      void this.rebuildList();
    });

    this.appState.favorites$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      void this.rebuildList();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async downloadAll(): Promise<void> {
    const toCache = this.audioItems
      .filter((item) => this.hasPlayableAudio(item))
      .map((item) => ({
        poiId: item.id,
        urls: [this.poiAudioUrl(item), item.imageUrl]
      }));

    await this.offlineService.cacheBatch(toCache);
    await this.rebuildList();
    this.snackBar.open(this.i18n.t('myAudio.downloadDone'), this.i18n.t('common.ok'), { duration: 2400 });
  }

  play(item: AudioItem): void {
    if (!this.hasPlayableAudio(item)) {
      this.snackBar.open(this.i18n.t('myAudio.noAudio'), this.i18n.t('common.ok'), { duration: 2400 });
      return;
    }

    void this.router.navigate(['/player', item.id], {
      queryParams: { preview: false }
    });
  }

  openPoi(poiId: string): void {
    void this.router.navigate(['/poi', poiId]);
  }

  toggleFavorite(item: AudioItem): void {
    this.appState.toggleFavorite(item.id);
  }

  hasPlayableAudio(poi: Poi | null | undefined): boolean {
    return Boolean(this.poiAudioUrl(poi));
  }

  poiName(poi: Poi): string {
    return this.i18n.resolvePoiField(poi.name, poi.translations, 'name');
  }

  poiDescription(poi: Poi): string {
    return this.i18n.resolvePoiField(poi.descriptionShort, poi.translations, 'descriptionShort');
  }

  poiAudioUrl(poi: Poi | null | undefined): string {
    return this.i18n.resolvePoiAudioUrl(poi);
  }

  poiAddress(poi: Poi): string {
    return String(poi.address || '').trim() || `${this.poiName(poi)}, ${formatCityLabel(poi.cityId, [], this.i18n.language)}`;
  }

  distanceLabel(distanceMeters: number | null): string {
    return this.i18n.formatDistance(distanceMeters);
  }

  private async rebuildList(): Promise<void> {
    if (!this.allPois.length) {
      this.audioItems = [];
      return;
    }

    const offlineIds = await this.offlineService.getOfflinePoiIds();
    const currentCoordinates = this.geoService.currentCoordinates;

    const unlocked = this.allPois.filter((poi) => this.purchaseService.isPoiUnlocked(poi.id, poi.cityId));

    this.audioItems = unlocked
      .map((poi) => {
        const distanceMeters = currentCoordinates
          ? this.geoService.distanceInMeters(currentCoordinates, { lat: poi.lat, lng: poi.lng })
          : null;

        return {
          ...poi,
          offline: offlineIds.includes(poi.id),
          distanceMeters,
          isFavorite: this.appState.isFavorite(poi.id)
        } satisfies AudioItem;
      })
      .sort((a, b) => this.poiName(a).localeCompare(this.poiName(b), this.i18n.locale));

    this.offlineMinutes = Math.round(
      this.audioItems
        .filter((item) => item.offline)
        .reduce((acc, item) => acc + item.durationSec, 0) / 60
    );
  }
}
