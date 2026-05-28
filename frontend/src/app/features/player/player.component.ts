import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Poi } from '../../core/models/poi.model';
import { I18nService } from '../../core/services/i18n.service';
import { OfflineService } from '../../core/services/offline.service';
import { PlayerService } from '../../core/services/player.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';

@Component({
  standalone: false,
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  poi?: Poi;
  previewMode = false;
  unlocked = false;
  offlineEnabled = false;
  audioUnavailable = false;
  loading = true;
  loadError = false;
  readonly previewSeconds = environment.previewSeconds;

  readonly playerState$ = this.playerService.state$;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    private readonly playerService: PlayerService,
    private readonly offlineService: OfflineService,
    public readonly i18n: I18nService,
    private readonly location: Location,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.purchaseService.refresh();

    combineLatest([
      this.route.paramMap.pipe(map((params) => String(params.get('id')))),
      this.route.queryParamMap.pipe(map((params) => params.get('preview') === 'true'))
    ])
      .pipe(
        tap(() => {
          this.loading = true;
          this.loadError = false;
          this.audioUnavailable = false;
          this.poi = undefined;
        }),
        switchMap(([poiId, preview]) =>
          this.poiService.getPoiById(poiId, false).pipe(
            map((poi) => ({
              poi,
              preview
            }))
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: async ({ poi, preview }) => {
          this.poi = poi;
          this.previewMode = preview;
          this.unlocked = this.purchaseService.isPoiUnlocked(poi.id, poi.cityId);

          if (!this.hasPlayableAudio(poi)) {
            this.audioUnavailable = true;
            this.offlineEnabled = false;
            this.playerService.pause();
            this.loading = false;
            return;
          }

          if (!this.unlocked && !preview) {
            this.snackBar.open(this.i18n.t('player.blockedPreview'), this.i18n.t('common.ok'), { duration: 2400 });
            this.previewMode = true;
          }

          this.playerService.loadTrack(poi.id, this.currentAudioUrl(poi), this.previewMode);
          this.offlineEnabled = await this.offlineService.isPoiOffline(poi.id);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.loadError = true;
          this.poi = undefined;
        }
      });

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

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    if (this.poi) {
      void this.router.navigate(['/poi', this.poi.id]);
      return;
    }

    void this.router.navigate(['/home']);
  }

  togglePlay(): void {
    if (this.audioUnavailable) {
      return;
    }

    this.playerService.togglePlayPause();
  }

  seek(event: Event): void {
    if (this.audioUnavailable) {
      return;
    }

    const value = Number((event.target as HTMLInputElement).value);
    this.playerService.seek(value);
  }

  skip(deltaSeconds: number): void {
    if (this.audioUnavailable) {
      return;
    }

    this.playerService.skipBy(deltaSeconds);
  }

  async toggleOffline(value: boolean): Promise<void> {
    if (!this.poi || this.audioUnavailable) {
      this.offlineEnabled = false;
      return;
    }

    if (!this.canToggleOffline) {
      this.offlineEnabled = false;
      this.snackBar.open(this.i18n.t('player.offlineAfterUnlock'), this.i18n.t('common.ok'), { duration: 2400 });
      return;
    }

    if (!value) {
      this.offlineEnabled = value;
      return;
    }

    await this.offlineService.cachePoiAssets(this.poi.id, [this.poiService.getPoiFullAudioUrl(this.poi), this.poi.imageUrl]);
    this.offlineEnabled = true;
    this.snackBar.open(this.i18n.t('player.availableOffline'), this.i18n.t('common.ok'), { duration: 2200 });
  }

  get canToggleOffline(): boolean {
    return this.unlocked && !this.previewMode;
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

  hasPlayableAudio(poi: Poi | null | undefined): boolean {
    return Boolean(this.currentAudioUrl(poi));
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

  currentAudioUrl(poi: Poi | null | undefined): string {
    return this.previewMode ? this.poiService.getPoiPreviewAudioUrl(poi) : this.poiService.getPoiFullAudioUrl(poi);
  }
}


