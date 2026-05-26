import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppLanguage } from '../../core/i18n/app-language';
import { City } from '../../core/models/city.model';
import { AppAuthService } from '../../core/services/app-auth.service';
import { AppStateService } from '../../core/services/app-state.service';
import { I18nService } from '../../core/services/i18n.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';

type DiscountCodeStatus = 'valid' | 'expired' | 'invalid' | 'used';
type LinkedDiscountState = 'idle' | 'checking' | 'loaded' | 'stored' | 'expired' | 'used';

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
  linkedDiscountState: LinkedDiscountState = 'idle';
  linkedDiscountMessage = '';
  linkedDiscountDetail = '';

  private readonly destroy$ = new Subject<void>();
  private lastLinkedCode = '';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
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
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.applyLinkedDiscountCode(params);
      });

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

  get showDiscountNotice(): boolean {
    return this.linkedDiscountState !== 'idle' && !!this.linkedDiscountMessage;
  }

  get discountNoticeTone(): 'info' | 'success' | 'warning' {
    if (this.linkedDiscountState === 'loaded' || this.linkedDiscountState === 'stored') {
      return 'success';
    }
    if (this.linkedDiscountState === 'expired' || this.linkedDiscountState === 'used') {
      return 'warning';
    }
    return 'info';
  }

  get discountNoticeIcon(): string {
    if (this.linkedDiscountState === 'loaded' || this.linkedDiscountState === 'stored') {
      return 'verified';
    }
    if (this.linkedDiscountState === 'expired') {
      return 'event_busy';
    }
    if (this.linkedDiscountState === 'used') {
      return 'block';
    }
    return 'vpn_key';
  }

  get canContinueWithStoredCode(): boolean {
    const currentCode = this.appState.normalizeHotelCodeInput(this.hotelCode);
    const storedCode = this.appState.normalizeHotelCodeInput(this.appState.hotelCode);
    return (
      !!currentCode &&
      currentCode === storedCode &&
      (this.linkedDiscountState === 'loaded' || this.linkedDiscountState === 'stored')
    );
  }

  get codeActionLabel(): string {
    if (this.isCheckingCode) {
      return this.i18n.t('welcome.checkingCode');
    }
    return this.canContinueWithStoredCode ? 'Continua con il codice' : this.i18n.t('welcome.applyAndContinue');
  }

  get codeActionIcon(): string {
    return this.canContinueWithStoredCode ? 'arrow_forward' : 'check_circle';
  }

  goToPartnerRegistration(): void {
    void this.router.navigate(['/partner-registration']);
  }

  goToLogin(): void {
    void this.router.navigate(['/profile'], { queryParams: { returnUrl: this.router.url } });
  }

  normalizeCodeInput(value = this.hotelCode): void {
    const normalizedCode = this.appState.normalizeHotelCodeInput(value);
    if (normalizedCode !== this.hotelCode) {
      this.hotelCode = normalizedCode;
    }

    const storedCode = this.appState.normalizeHotelCodeInput(this.appState.hotelCode);
    if (normalizedCode !== storedCode && (this.linkedDiscountState === 'loaded' || this.linkedDiscountState === 'stored')) {
      this.clearDiscountNotice();
    }
  }

  continueOrValidateCode(): void {
    if (this.canContinueWithStoredCode) {
      this.start();
      return;
    }

    this.validateCode();
  }

  validateCode(): void {
    this.normalizeCodeInput();
    const trimmed = this.hotelCode.trim();
    if (!trimmed) {
      this.setDiscountNotice('idle');
      this.snackBar.open(this.i18n.t('welcome.insertInviteCode'), this.i18n.t('common.close'), { duration: 2200 });
      return;
    }

    this.isCheckingCode = true;
    this.setDiscountNotice('checking', 'Verifico il codice sconto', '');
    this.purchaseService.validateHotelCode(trimmed).subscribe({
      next: (response) => {
        this.isCheckingCode = false;
        if (!response.valid || !response.association) {
          this.setDiscountNotice('idle');
          this.snackBar.open(this.i18n.t('welcome.codeNotFound'), this.i18n.t('common.ok'), { duration: 2800 });
          return;
        }

        if (response.association.codeStatus !== 'valid') {
          this.setDiscountNotice('idle');
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
        this.setDiscountNotice('idle');
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

  private applyLinkedDiscountCode(params: ParamMap): void {
    const linkedCode =
      this.appState.normalizeHotelCodeInput(params.get('code')) ||
      this.appState.normalizeHotelCodeInput(params.get('discountCode')) ||
      this.appState.normalizeHotelCodeInput(params.get('codice')) ||
      this.appState.normalizeHotelCodeInput(params.get('promo'));

    if (!/^[A-Z0-9]{6}$/.test(linkedCode) || linkedCode === this.lastLinkedCode) {
      return;
    }

    this.lastLinkedCode = linkedCode;
    this.validateLinkedDiscountCode(linkedCode);
  }

  private validateLinkedDiscountCode(code: string): void {
    const alreadyStoredLocally = this.appState.normalizeHotelCodeInput(this.appState.hotelCode) === code;
    this.isCheckingCode = true;
    this.setDiscountNotice('checking', 'Verifico il codice sconto', code);

    this.purchaseService.validateHotelCode(code).subscribe({
      next: (response) => {
        this.isCheckingCode = false;
        const association = response.association;
        if (!response.valid || !association || association.codeStatus !== 'valid') {
          this.rejectLinkedDiscountCode(code, response.codeStatus || association?.codeStatus || 'invalid');
          return;
        }

        const normalizedCode = this.appState.normalizeHotelCodeInput(association.inviteCode || code);
        this.hotelCode = normalizedCode;
        this.appState.setHotelCode(normalizedCode);
        this.appState.setHotelAssociation(association);
        this.showCodeInput = true;

        const alreadyStored = alreadyStoredLocally || response.alreadyAssociated;
        const message = alreadyStored ? 'Codice sconto gia salvato' : 'Codice sconto caricato';
        const detail = `${normalizedCode} e pronto per gli acquisti compatibili.`;
        this.setDiscountNotice(alreadyStored ? 'stored' : 'loaded', message, detail);
        this.snackBar.open(message, this.i18n.t('common.ok'), { duration: 2600 });
      },
      error: (error: { status?: number; error?: { codeStatus?: DiscountCodeStatus; message?: string } }) => {
        this.isCheckingCode = false;
        const status = error?.error?.codeStatus || (error?.status === 404 ? 'invalid' : 'invalid');
        this.rejectLinkedDiscountCode(code, status);
      }
    });
  }

  private rejectLinkedDiscountCode(code: string, status: DiscountCodeStatus): void {
    this.clearLinkedCodeIfCurrent(code);
    if (status === 'expired') {
      this.setDiscountNotice('expired', 'Codice sconto scaduto', 'Puoi entrare senza codice o inserirne un altro.');
      this.snackBar.open(this.i18n.t('welcome.codeExpired'), this.i18n.t('common.ok'), { duration: 3200 });
      return;
    }
    if (status === 'used') {
      this.setDiscountNotice('used', 'Codice sconto gia utilizzato', 'Puoi entrare senza codice o inserirne un altro.');
      this.snackBar.open(this.i18n.t('welcome.codeUsed'), this.i18n.t('common.ok'), { duration: 3200 });
      return;
    }

    this.clearDiscountNotice();
  }

  private clearLinkedCodeIfCurrent(code: string): void {
    if (this.appState.normalizeHotelCodeInput(this.appState.hotelCode) === code) {
      this.appState.setHotelCode('');
      this.appState.setHotelAssociation(null);
    }
    if (this.appState.normalizeHotelCodeInput(this.hotelCode) === code) {
      this.hotelCode = '';
      this.showCodeInput = false;
    }
  }

  private setDiscountNotice(state: LinkedDiscountState, message = '', detail = ''): void {
    this.linkedDiscountState = state;
    this.linkedDiscountMessage = message;
    this.linkedDiscountDetail = detail;
  }

  private clearDiscountNotice(): void {
    this.setDiscountNotice('idle');
  }
}
