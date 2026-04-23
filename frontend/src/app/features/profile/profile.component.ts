import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, finalize, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AppLanguage } from '../../core/i18n/app-language';
import { City } from '../../core/models/city.model';
import { AdminAuthService, DashboardSession, UserRole } from '../../core/services/admin-auth.service';
import { AppAuthService, AppSession } from '../../core/services/app-auth.service';
import { AppStateService, HotelAssociation } from '../../core/services/app-state.service';
import { I18nService } from '../../core/services/i18n.service';
import { PoiService } from '../../core/services/poi.service';
import { HotelCodeStatusEntry, PurchaseService } from '../../core/services/purchase.service';
import { StructureLocationService } from '../../core/services/structure-location.service';
import { formatCityLabel } from '../../core/utils/city-label.util';

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
  hotelAssociation: HotelAssociation | null = null;
  hotelCodeEntries: HotelCodeStatusEntry[] = [];
  unlockedCityIds: string[] = [];
  language: AppLanguage = 'it';
  loadingCities = true;
  removingInviteCode = false;
  isAdmin = false;
  adminSessionChecked = false;
  appSessionChecked = false;
  appSession: AppSession | null = null;
  dashboardSession: DashboardSession | null = null;
  adminUnlockSimulationActive = false;
  togglingAdminUnlockSimulation = false;
  authMode: 'login' | 'register' = 'login';
  authSubmitting = false;
  resetSubmitting = false;
  resetRequested = false;
  loggingOutApp = false;
  showLoginPassword = false;
  showRegisterPassword = false;
  showRegisterConfirmPassword = false;

  @ViewChild('appLogoutDialog') private appLogoutDialog?: TemplateRef<unknown>;

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  readonly registerForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(120)]],
    confirmPassword: ['', [Validators.required]]
  });

  readonly resetForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly poiService: PoiService,
    private readonly appState: AppStateService,
    private readonly purchaseService: PurchaseService,
    private readonly adminAuth: AdminAuthService,
    private readonly appAuth: AppAuthService,
    private readonly structureLocationService: StructureLocationService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    public readonly i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.hydrateStoredSessions();
    this.purchaseService.refresh();
    this.appAuth
      .restoreSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.appSessionChecked = true;
        this.appSession = this.appAuth.session;
        this.purchaseService.refresh();
        this.syncHotelAssociationDetails();
      });
    this.adminAuth
      .restoreSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.adminSessionChecked = true;
        this.isAdmin = this.adminAuth.user?.role === 'admin';
        this.purchaseService.refresh();
        this.syncAppSessionFromDashboard();
      });
    this.syncHotelAssociationDetails();

    this.poiService
      .getCities()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cities) => {
          this.cities = cities;
          this.loadingCities = false;
        },
        error: () => {
          this.loadingCities = false;
          this.cities = [];
        }
      });

    combineLatest([
      this.appState.activeCityId$,
      this.appState.hotelCode$,
      this.appState.hotelAssociation$,
      this.appState.language$,
      this.purchaseService.purchases$,
      this.adminAuth.session$,
      this.appAuth.session$,
      this.purchaseService.adminUnlockSimulation$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([cityId, hotelCode, hotelAssociation, language, purchases, adminSession, appSession, adminUnlockSimulation]) => {
        this.activeCityId = cityId;
        this.hotelCode = hotelCode || '-';
        this.hotelAssociation = hotelAssociation;
        this.language = language;
        this.unlockedCityIds = purchases.unlockedCityIds;
        this.appSession = this.appSessionChecked ? appSession : null;
        this.dashboardSession = this.adminSessionChecked ? adminSession : null;
        this.isAdmin = this.adminSessionChecked && adminSession?.user?.role === 'admin';
        this.adminUnlockSimulationActive = this.isAdmin && adminUnlockSimulation && purchases.adminUnlockSimulation === true;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private hydrateStoredSessions(): void {
    this.appSession = this.appAuth.session;
    if (this.appSession?.user) {
      this.appSessionChecked = true;
    }

    this.dashboardSession = this.adminAuth.session;
    if (this.dashboardSession?.user) {
      this.adminSessionChecked = true;
      this.isAdmin = this.dashboardSession.user.role === 'admin';
    }
  }

  setCity(cityId: string): void {
    this.appState.setActiveCity(cityId);
  }

  setLanguage(language: AppLanguage): void {
    this.appState.setLanguage(language);
    this.snackBar.open(
      this.i18n.t('profile.languageSet', { language: this.i18n.languageLabel(language) }),
      this.i18n.t('common.ok'),
      { duration: 1800 }
    );
  }

  get hasStoredInviteCode(): boolean {
    return this.hotelCode !== '-' || !!this.hotelAssociation;
  }

  get isAppLoggedIn(): boolean {
    return this.appSessionChecked && !!this.appSession?.user;
  }

  get isDashboardLoggedIn(): boolean {
    return this.adminSessionChecked && !!this.dashboardSession?.user;
  }

  get appDisplayName(): string {
    const firstName = this.appSession?.user?.firstName || '';
    const lastName = this.appSession?.user?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || this.appEmail || '-';
  }

  get appEmail(): string {
    return this.appSession?.user?.email || '';
  }

  get appInitials(): string {
    return this.initialsFrom(this.appDisplayName || this.appEmail || 'WA');
  }

  get accountDisplayName(): string {
    const firstName = this.dashboardSession?.user?.firstName || '';
    const lastName = this.dashboardSession?.user?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || this.accountEmail || '-';
  }

  get accountEmail(): string {
    return this.dashboardSession?.user?.email || '';
  }

  get accountInitials(): string {
    return this.initialsFrom(this.accountDisplayName || this.accountEmail || 'WA');
  }

  get accountRoleLabel(): string {
    const role = this.dashboardSession?.user?.role || 'user';
    return this.roleLabel(role);
  }

  get accountStructureName(): string {
    return this.dashboardSession?.user?.structureName || '';
  }

  get isImpersonating(): boolean {
    return Boolean(this.dashboardSession?.session?.isImpersonating);
  }

  get impersonatedByEmail(): string {
    return this.dashboardSession?.session?.impersonatedBy?.email || '';
  }

  get displayedUnlockedCityIds(): string[] {
    if (this.adminUnlockSimulationActive) {
      return this.cities.map((city) => city.id);
    }

    return this.unlockedCityIds;
  }

  get inviteCodeStatusText(): string {
    const status = this.hotelAssociation?.codeStatus || (this.hasStoredInviteCode ? 'invalid' : null);
    if (status === 'valid') {
      return this.i18n.t('profile.inviteStatus.valid');
    }
    if (status === 'used') {
      return this.i18n.t('profile.inviteStatus.used');
    }
    if (status === 'expired') {
      return this.i18n.t('profile.inviteStatus.expired');
    }
    if (status === 'invalid') {
      return this.i18n.t('profile.inviteStatus.invalid');
    }
    return this.i18n.t('profile.inviteStatus.none');
  }

  get inviteCodeExpiresAt(): string {
    return this.i18n.formatDateTime(this.hotelAssociation?.expiresAt);
  }

  removeInviteCodeAssociation(entry?: HotelCodeStatusEntry): void {
    if (this.removingInviteCode) {
      return;
    }
    if (entry && !this.canRemoveCodeEntry(entry)) {
      this.snackBar.open(this.i18n.t('profile.removeUsedError'), this.i18n.t('common.close'), { duration: 2500 });
      return;
    }
    if (!entry && !this.hasStoredInviteCode) {
      return;
    }

    const codeLabel = entry?.inviteCode || this.hotelAssociation?.inviteCode || this.hotelCode;
    const confirmed = window.confirm(this.i18n.t('profile.removeCodeConfirm', { code: codeLabel || this.hotelCode }));
    if (!confirmed) {
      return;
    }

    this.removingInviteCode = true;
    this.purchaseService.removeHotelAssociation().subscribe({
      next: () => {
        this.appState.setHotelCode('');
        this.appState.setHotelAssociation(null);
        this.syncHotelAssociationDetails();
        this.removingInviteCode = false;
        this.snackBar.open(this.i18n.t('profile.removeCodeDone'), this.i18n.t('common.ok'), { duration: 2200 });
      },
      error: () => {
        this.removingInviteCode = false;
        this.snackBar.open(this.i18n.t('profile.removeCodeError'), this.i18n.t('common.close'), { duration: 3200 });
      }
    });
  }

  setAuthMode(mode: 'login' | 'register'): void {
    this.authMode = mode;
    this.resetRequested = false;
  }

  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleRegisterPasswordVisibility(): void {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  toggleRegisterConfirmPasswordVisibility(): void {
    this.showRegisterConfirmPassword = !this.showRegisterConfirmPassword;
  }

  loginAppUser(): void {
    if (this.authSubmitting || this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.authSubmitting = true;
    this.appAuth
      .login(email, password)
      .pipe(
        finalize(() => {
          this.authSubmitting = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => this.handleAppAuthSuccess('auth.loginDone'),
        error: (error: { error?: { message?: string } }) => {
          this.snackBar.open(error?.error?.message || this.i18n.t('auth.loginError'), this.i18n.t('common.close'), {
            duration: 3000
          });
        }
      });
  }

  registerAppUser(): void {
    if (this.authSubmitting || this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, password, confirmPassword } = this.registerForm.getRawValue();
    if (password !== confirmPassword) {
      this.snackBar.open(this.i18n.t('completeRegistration.passwordMismatch'), this.i18n.t('common.close'), { duration: 2800 });
      return;
    }

    this.authSubmitting = true;
    this.appAuth
      .register(firstName, lastName, email, password)
      .pipe(
        finalize(() => {
          this.authSubmitting = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => this.handleAppAuthSuccess('auth.registerDone'),
        error: (error: { error?: { message?: string } }) => {
          this.snackBar.open(error?.error?.message || this.i18n.t('auth.registerError'), this.i18n.t('common.close'), {
            duration: 3200
          });
        }
      });
  }

  requestPasswordReset(): void {
    if (this.resetSubmitting || this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { email } = this.resetForm.getRawValue();
    this.resetSubmitting = true;
    this.appAuth
      .requestPasswordReset(email, window.location.origin)
      .pipe(
        finalize(() => {
          this.resetSubmitting = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.resetRequested = true;
          this.snackBar.open(this.i18n.t('auth.resetSent'), this.i18n.t('common.ok'), { duration: 3200 });
        },
        error: () => {
          this.snackBar.open(this.i18n.t('auth.resetError'), this.i18n.t('common.close'), { duration: 3200 });
        }
      });
  }

  openAppLogoutDialog(): void {
    if (!this.isAppLoggedIn || this.loggingOutApp || !this.appLogoutDialog) {
      return;
    }

    this.dialog
      .open(this.appLogoutDialog, {
        autoFocus: false,
        restoreFocus: true,
        width: '92vw',
        maxWidth: '420px'
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmed) => {
        if (confirmed === true) {
          this.logoutAppUser();
        }
      });
  }

  private logoutAppUser(): void {
    if (this.loggingOutApp) {
      return;
    }

    this.loggingOutApp = true;
    this.purchaseService
      .setAdminUnlockSimulation(false)
      .pipe(
        switchMap(() => this.logoutDashboardSessionIfNeeded()),
        switchMap(() => this.appAuth.logout()),
        finalize(() => {
          this.loggingOutApp = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.appSession = null;
          this.dashboardSession = null;
          this.isAdmin = false;
          this.adminUnlockSimulationActive = false;
          this.purchaseService.resetLocalState();
          this.purchaseService.refresh();
          this.snackBar.open(this.i18n.t('auth.logoutDone'), this.i18n.t('common.ok'), { duration: 2200 });
        },
        error: () => {
          this.snackBar.open(this.i18n.t('auth.logoutError'), this.i18n.t('common.close'), { duration: 3000 });
        }
      });
  }

  private logoutDashboardSessionIfNeeded() {
    if (!this.adminAuth.session?.token) {
      return of(void 0);
    }

    return this.adminAuth.logout();
  }

  toggleAdminUnlockSimulation(enabled: boolean): void {
    if (this.togglingAdminUnlockSimulation) {
      return;
    }

    this.togglingAdminUnlockSimulation = true;
    this.purchaseService.setAdminUnlockSimulation(enabled).subscribe({
      next: (changed) => {
        this.togglingAdminUnlockSimulation = false;
        if (!changed) {
          this.snackBar.open(this.i18n.t('profile.adminSimulationUnavailable'), this.i18n.t('common.close'), {
            duration: 3000
          });
          return;
        }

        const message = enabled ? 'profile.adminSimulationEnabled' : 'profile.adminSimulationDisabled';
        this.snackBar.open(this.i18n.t(message), this.i18n.t('common.ok'), { duration: 2200 });
      },
      error: () => {
        this.togglingAdminUnlockSimulation = false;
        this.snackBar.open(this.i18n.t('profile.adminSimulationUnavailable'), this.i18n.t('common.close'), {
          duration: 3000
        });
      }
    });
  }

  codeEntryStatusLabel(entry: HotelCodeStatusEntry): string {
    if (entry.status === 'activated') {
      return this.i18n.t('profile.codeStatus.activated');
    }
    if (entry.status === 'used') {
      return this.i18n.t('profile.codeStatus.used');
    }
    if (entry.status === 'expired') {
      return this.i18n.t('profile.codeStatus.expired');
    }
    return this.i18n.t('profile.codeStatus.invalid');
  }

  codeEntryStatusClass(entry: HotelCodeStatusEntry): string {
    if (entry.status === 'activated') {
      return 'status-chip unlocked';
    }
    if (entry.status === 'used') {
      return 'status-chip pending';
    }
    return 'status-chip locked';
  }

  codeEntryScopeLabel(entry: HotelCodeStatusEntry): string {
    if (entry.appliesTo === 'bundle') {
      return this.i18n.t('profile.scopeBundle');
    }
    if (entry.appliesTo === 'single') {
      return this.i18n.t('profile.scopeSingle');
    }
    return '-';
  }

  codeEntryCitiesLabel(entry: HotelCodeStatusEntry): string {
    const ids = Array.isArray(entry.cityIds) ? entry.cityIds.map((id) => String(id || '').trim()).filter(Boolean) : [];
    if (ids.length) {
      return ids.map((cityId) => this.cityName(cityId)).join(', ');
    }

    const names = Array.isArray(entry.cityNames) ? entry.cityNames.map((name) => String(name || '').trim()).filter(Boolean) : [];
    if (names.length) {
      return names.join(', ');
    }
    if (entry.cityName) {
      return entry.cityName;
    }
    return entry.cityId || '-';
  }

  canRemoveCodeEntry(entry: HotelCodeStatusEntry): boolean {
    if (this.removingInviteCode) {
      return false;
    }
    if (entry.status === 'used') {
      return false;
    }
    if (!this.hotelAssociation?.inviteCode) {
      return false;
    }
    if (this.hotelAssociation.codeStatus === 'used') {
      return false;
    }
    return String(entry.inviteCode || '').trim().toUpperCase() === String(this.hotelAssociation.inviteCode || '').trim().toUpperCase();
  }

  private roleLabel(role: UserRole): string {
    if (role === 'admin') {
      return this.i18n.t('profile.role.admin');
    }
    if (role === 'facility_manager') {
      return this.i18n.t('profile.role.facilityManager');
    }
    return this.i18n.t('profile.role.user');
  }

  private handleAppAuthSuccess(messageKey: string): void {
    this.appSessionChecked = true;
    this.appSession = this.appAuth.session;
    const dashboardSession = this.adminAuth.session;
    if (dashboardSession?.user) {
      this.adminSessionChecked = true;
      this.dashboardSession = dashboardSession;
      this.isAdmin = dashboardSession.user.role === 'admin';
    }
    this.purchaseService.refresh();
    this.syncHotelAssociationDetails();
    this.snackBar.open(this.i18n.t(messageKey), this.i18n.t('common.ok'), { duration: 2200 });

    const returnUrl = String(this.route.snapshot.queryParamMap.get('returnUrl') || '').trim();
    if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      void this.router.navigateByUrl(returnUrl);
    }
  }

  private syncAppSessionFromDashboard(): void {
    const dashboardToken = this.adminAuth.session?.token;
    if (!dashboardToken || this.appAuth.isAuthenticated) {
      return;
    }

    this.appAuth
      .loginWithDashboardSession(dashboardToken)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.appSessionChecked = true;
          this.appSession = this.appAuth.session;
          this.purchaseService.refresh();
          this.syncHotelAssociationDetails();
        },
        error: () => {
          // Dashboard session remains valid even if app-account sync is unavailable.
        }
      });
  }

  private initialsFrom(source: string): string {
    const normalized = String(source || 'WA').trim();
    const parts = normalized
      .split(/\s+/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return normalized.slice(0, 2).toUpperCase();
  }

  navigateToAssociatedStructure(): void {
    const association = this.hotelAssociation;
    if (!association?.structureId) {
      return;
    }

    const coordinates = this.coerceCoordinates(association.lat, association.lng);
    const url = this.structureLocationService.buildExternalDirectionsUrl(association, coordinates);
    if (!url) {
      this.snackBar.open(this.i18n.t('profile.structureDataUnavailable'), this.i18n.t('common.close'), { duration: 2400 });
      return;
    }

    window.open(url, '_blank', 'noopener');
  }

  cityName(cityId: string): string {
    return formatCityLabel(cityId, this.cities, this.i18n.language);
  }

  entryExpiryLabel(entry: HotelCodeStatusEntry): string {
    return this.i18n.formatDateTime(entry.expiresAt);
  }

  entryUsedAtLabel(entry: HotelCodeStatusEntry): string {
    return this.i18n.formatDateTime(entry.usedAt);
  }

  private syncHotelAssociationDetails(): void {
    this.purchaseService
      .getHotelAssociationDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ association, codes }) => {
          this.hotelCodeEntries = codes;
          this.appState.setHotelAssociation(association);
          if (association?.inviteCode) {
            this.appState.setHotelCode(association.inviteCode);
          } else {
            this.appState.setHotelCode('');
          }
        },
        error: () => {
          // Keep locally cached association when backend sync is unavailable.
        }
      });
  }

  private coerceCoordinates(latRaw: unknown, lngRaw: unknown): { lat: number; lng: number } | null {
    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return null;
    }
    return { lat, lng };
  }
}
