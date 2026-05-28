import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Poi } from '../../core/models/poi.model';
import { AppStateService } from '../../core/services/app-state.service';
import { GeoService } from '../../core/services/geo.service';
import { I18nService } from '../../core/services/i18n.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';
import { formatCityLabel } from '../../core/utils/city-label.util';

interface FavoriteItem extends Poi {
  distanceMeters: number | null;
  unlocked: boolean;
}

@Component({
  standalone: false,
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: FavoriteItem[] = [];
  loading = true;

  private allPois: Poi[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly appState: AppStateService,
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    private readonly geoService: GeoService,
    private readonly router: Router,
    public readonly i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.purchaseService.refresh();
    void this.geoService.requestPermissionAndTrack();

    this.appState.favorites$
      .pipe(
        switchMap((favoriteIds) => {
          this.loading = true;
          return this.loadFavoritePois(favoriteIds).pipe(catchError(() => of([] as Poi[])));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (pois) => {
          this.allPois = pois;
          this.refreshFavorites();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.favorites = [];
        }
      });

    this.purchaseService.purchases$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refreshFavorites());
    this.geoService.coordinates$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refreshFavorites());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openPoi(poiId: string): void {
    void this.router.navigate(['/poi', poiId]);
  }

  playAudio(item: FavoriteItem): void {
    if (!this.hasPlayableAudio(item)) {
      return;
    }

    if (!item.unlocked) {
      void this.router.navigate(['/poi', item.id]);
      return;
    }

    void this.router.navigate(['/player', item.id], {
      queryParams: {
        preview: false
      }
    });
  }

  toggleFavorite(item: FavoriteItem): void {
    this.appState.toggleFavorite(item.id);
  }

  hasPlayableAudio(poi: Poi | null | undefined): boolean {
    return this.poiService.hasPreviewAudio(poi);
  }

  poiName(poi: Poi): string {
    return this.i18n.resolvePoiField(poi.name, poi.translations, 'name');
  }

  poiDescription(poi: Poi): string {
    return this.i18n.resolvePoiField(poi.descriptionShort, poi.translations, 'descriptionShort');
  }

  poiAddress(poi: Poi): string {
    return String(poi.address || '').trim() || `${this.poiName(poi)}, ${formatCityLabel(poi.cityId, [], this.i18n.language)}`;
  }

  distanceLabel(distanceMeters: number | null): string {
    return this.i18n.formatDistance(distanceMeters);
  }

  private refreshFavorites(): void {
    const ids = new Set(this.appState.favoriteIds);
    const currentCoordinates = this.geoService.currentCoordinates;
    this.favorites = this.allPois
      .filter((poi) => ids.has(poi.id))
      .map((poi) => {
        const distanceMeters = currentCoordinates
          ? this.geoService.distanceInMeters(currentCoordinates, { lat: poi.lat, lng: poi.lng })
          : null;
        return {
          ...poi,
          distanceMeters,
          unlocked: this.purchaseService.isPoiUnlocked(poi.id, poi.cityId)
        } satisfies FavoriteItem;
      });
  }

  private loadFavoritePois(favoriteIds: readonly string[]): Observable<Poi[]> {
    const uniqueIds = Array.from(new Set(favoriteIds.map((value) => String(value || '').trim()).filter(Boolean)));
    if (!uniqueIds.length) {
      return of([]);
    }

    return forkJoin(uniqueIds.map((poiId) => this.poiService.getPoiById(poiId, false).pipe(catchError(() => of(null as Poi | null))))).pipe(
      map((pois) => pois.filter((poi): poi is Poi => Boolean(poi)))
    );
  }
}
