import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { Poi } from '../../core/models/poi.model';
import { AppStateService } from '../../core/services/app-state.service';
import { PoiService } from '../../core/services/poi.service';

@Component({
  standalone: false,
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: Poi[] = [];
  loading = true;

  private allPois: Poi[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly appState: AppStateService,
    private readonly poiService: PoiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.poiService
      .getCities()
      .pipe(
        switchMap((cities) => forkJoin(cities.map((city) => this.poiService.getPoisByCity(city.id)))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (groups) => {
          this.allPois = groups.flat();
          this.refreshFavorites();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.favorites = [];
        }
      });

    this.appState.favorites$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refreshFavorites());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openPoi(poiId: string): void {
    void this.router.navigate(['/poi', poiId]);
  }

  playPreview(poiId: string): void {
    void this.router.navigate(['/player', poiId], {
      queryParams: {
        preview: true
      }
    });
  }

  private refreshFavorites(): void {
    const ids = new Set(this.appState.favoriteIds);
    this.favorites = this.allPois.filter((poi) => ids.has(poi.id));
  }
}

