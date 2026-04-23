import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppLanguage } from '../../core/i18n/app-language';
import { City } from '../../core/models/city.model';
import { AppAuthService } from '../../core/services/app-auth.service';
import { AppStateService } from '../../core/services/app-state.service';
import { I18nService } from '../../core/services/i18n.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';

@Component({
  standalone: false,
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  hotelCode = '';
  isCheckingCode = false;
  showCodeInput = false;
  language: AppLanguage = 'it';
  selectedCityId = 'catania';
  cities: City[] = [];
  loadingCities = false;
  isAppLoggedIn = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly appState: AppStateService,
    private readonly appAuth: AppAuthService,
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    public readonly i18n: I18nService
  ) {
    this.hotelCode = this.appState.hotelCode;
    this.language = this.appState.language;
    this.selectedCityId = this.appState.activeCityId || 'catania';
  }

  ngOnInit(): void {
    this.isAppLoggedIn = this.appAuth.isAuthenticated;
    this.appAuth.session$
      .pipe(takeUntil(this.destroy$))
      .subscribe((session) => {
        this.isAppLoggedIn = !!session?.user?.id;
      });

    this.loadingCities = true;
    this.poiService
      .getCities()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cities) => {
          this.loadingCities = false;
          this.cities = Array.isArray(cities) ? cities : [];
          this.ensureSelectedCity();
        },
        error: () => {
          this.loadingCities = false;
          this.cities = [];
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  start(): void {
    this.appState.markOnboardingSeen();
    this.saveSelectedCity();
    this.purchaseService.refresh();
    void this.router.navigate(['/home']);
  }

  setLanguage(language: AppLanguage): void {
    this.language = language;
    this.appState.setLanguage(language);
  }

  setCity(cityId: string): void {
    if (!cityId) {
      return;
    }

    this.selectedCityId = cityId;
    this.saveSelectedCity();
  }

  cityName(city: City): string {
    return String(city.name || '').trim();
  }

  get welcomeDescriptionRest(): string {
    const description = this.i18n.t('welcome.description').trim();
    const appName = this.i18n.t('common.appName').trim();
    return description.toLowerCase().startsWith(appName.toLowerCase())
      ? description.slice(appName.length)
      : ` ${description}`;
  }

  goToPartnerRegistration(): void {
    void this.router.navigate(['/partner-registration']);
  }

  goToLogin(): void {
    void this.router.navigate(['/profile']);
  }

  validateCode(): void {
    const trimmed = this.hotelCode.trim();
    if (!trimmed) {
      this.snackBar.open(this.i18n.t('welcome.insertInviteCode'), this.i18n.t('common.close'), { duration: 2200 });
      return;
    }

    this.isCheckingCode = true;
    this.purchaseService.validateHotelCode(trimmed).subscribe({
      next: (response) => {
        this.isCheckingCode = false;
        if (!response.valid || !response.association) {
          this.snackBar.open(this.i18n.t('welcome.codeNotFound'), this.i18n.t('common.ok'), { duration: 2800 });
          return;
        }

        if (response.association.codeStatus !== 'valid') {
          const invalidMessage =
            response.association.codeStatus === 'expired'
              ? this.i18n.t('welcome.codeExpired')
              : response.association.codeStatus === 'used'
                ? this.i18n.t('welcome.codeUsed')
                : this.i18n.t('welcome.codeNotValid');
          this.snackBar.open(invalidMessage, this.i18n.t('common.ok'), { duration: 2800 });
          return;
        }

        const normalizedCode = (response.association.inviteCode || trimmed).toUpperCase();
        this.appState.markOnboardingSeen();
        this.appState.setHotelCode(normalizedCode);
        this.appState.setHotelAssociation(response.association);
        this.saveSelectedCity();
        this.purchaseService.refresh();
        void this.router.navigate(['/home']);
      },
      error: (error: { error?: { codeStatus?: 'expired' | 'used' | 'invalid'; message?: string } }) => {
        this.isCheckingCode = false;
        const message =
          error?.error?.codeStatus === 'expired'
            ? this.i18n.t('welcome.codeExpired')
            : error?.error?.codeStatus === 'used'
              ? this.i18n.t('welcome.codeUsed')
              : error?.error?.codeStatus === 'invalid'
                ? this.i18n.t('welcome.codeNotValid')
                : this.i18n.t('welcome.validationError');
        this.snackBar.open(message, this.i18n.t('common.close'), { duration: 2800 });
      }
    });
  }

  private ensureSelectedCity(): void {
    if (!this.cities.length) {
      return;
    }

    const selectedStillExists = this.cities.some((city) => city.id === this.selectedCityId);
    if (selectedStillExists) {
      return;
    }

    const defaultCity = this.cities.find((city) => city.isDefault) || this.cities[0];
    this.selectedCityId = defaultCity.id;
  }

  private saveSelectedCity(): void {
    const selectedCityId = String(this.selectedCityId || '').trim();
    if (!selectedCityId) {
      return;
    }

    this.appState.setActiveCity(selectedCityId);
  }
}
