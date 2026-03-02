import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { City } from '../../core/models/city.model';
import { AppStateService } from '../../core/services/app-state.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  cities: City[] = [];
  activeCityId = 'catania';
  hotelCode = '-';
  unlockedCityIds: string[] = [];
  language: 'it' | 'en' = 'it';
  loading = true;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly poiService: PoiService,
    private readonly appState: AppStateService,
    private readonly purchaseService: PurchaseService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.purchaseService.refresh();

    this.poiService
      .getCities()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cities) => {
          this.cities = cities;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.cities = [];
        }
      });

    combineLatest([
      this.appState.activeCityId$,
      this.appState.hotelCode$,
      this.appState.language$,
      this.purchaseService.purchases$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([cityId, hotelCode, language, purchases]) => {
        this.activeCityId = cityId;
        this.hotelCode = hotelCode || '-';
        this.language = language;
        this.unlockedCityIds = purchases.unlockedCityIds;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setCity(cityId: string): void {
    this.appState.setActiveCity(cityId);
  }

  setLanguage(language: 'it' | 'en'): void {
    this.appState.setLanguage(language);
    this.snackBar.open(`Lingua impostata: ${language.toUpperCase()}`, 'OK', { duration: 1800 });
  }

  restorePurchases(): void {
    this.purchaseService.refresh();
    this.snackBar.open('Acquisti ripristinati (simulato)', 'OK', { duration: 2200 });
  }
}

