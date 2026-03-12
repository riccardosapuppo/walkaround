import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Poi } from '../../core/models/poi.model';
import { AppStateService } from '../../core/services/app-state.service';
import { GeoService } from '../../core/services/geo.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';

const cityNameMap: Record<string, string> = {
  catania: 'Catania',
  siracusa: 'Siracusa',
  taormina: 'Taormina'
};

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
  readonly cityUnlockPriceLabel = '14,99';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    private readonly appState: AppStateService,
    private readonly geoService: GeoService,
    private readonly location: Location,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.purchaseService.refresh();

    this.route.paramMap
      .pipe(
        tap(() => {
          this.loading = true;
          this.loadError = false;
          this.poi = undefined;
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
  }

  openPlayer(preview: boolean): void {
    if (!this.poi) {
      return;
    }

    void this.router.navigate(['/player', this.poi.id], { queryParams: { preview } });
  }

  purchasePoi(): void {
    if (!this.poi) {
      return;
    }

    this.purchaseService.purchasePoiSingle(this.poi.id).subscribe({
      next: () => {
        this.unlocked = true;
        this.snackBar.open(`Luogo sbloccato: ${this.poi?.name || ''}`, 'OK', { duration: 2200 });
      },
      error: () => {
        this.snackBar.open('Acquisto non riuscito', 'Chiudi', { duration: 2400 });
      }
    });
  }

  purchaseCity(): void {
    if (!this.poi) {
      return;
    }

    this.purchaseService.purchaseCityBundle(this.poi.cityId).subscribe({
      next: () => {
        this.unlocked = true;
        this.snackBar.open(`Città sbloccata: ${this.cityName(this.poi?.cityId || '')}`, 'OK', { duration: 2200 });
      },
      error: () => {
        this.snackBar.open('Acquisto non riuscito', 'Chiudi', { duration: 2400 });
      }
    });
  }

  formatPrice(amount: number): string {
    return amount.toFixed(2).replace('.', ',');
  }

  cityName(cityId: string): string {
    return cityNameMap[cityId] || cityId;
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

  private updateDistanceLabel(): void {
    if (!this.poi) {
      return;
    }

    const current = this.geoService.currentCoordinates;
    if (!current) {
      this.distanceLabel = 'Posizione non disponibile';
      return;
    }

    const distance = this.geoService.distanceInMeters(current, {
      lat: this.poi.lat,
      lng: this.poi.lng
    });

    this.distanceLabel = distance < 1000 ? `${Math.round(distance)} m` : `${(distance / 1000).toFixed(1)} km`;
  }
}

