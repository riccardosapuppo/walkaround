import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { AppLanguage } from '../../core/i18n/app-language';
import { City } from '../../core/models/city.model';
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
  loading = true;
  removingInviteCode = false;
  resettingUserSession = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly poiService: PoiService,
    private readonly appState: AppStateService,
    private readonly purchaseService: PurchaseService,
    private readonly structureLocationService: StructureLocationService,
    private readonly snackBar: MatSnackBar,
    public readonly i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.purchaseService.refresh();
    this.syncHotelAssociationDetails();

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
      this.appState.hotelAssociation$,
      this.appState.language$,
      this.purchaseService.purchases$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([cityId, hotelCode, hotelAssociation, language, purchases]) => {
        this.activeCityId = cityId;
        this.hotelCode = hotelCode || '-';
        this.hotelAssociation = hotelAssociation;
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

  restorePurchases(): void {
    this.purchaseService.refresh();
    this.snackBar.open(this.i18n.t('profile.restoreDone'), this.i18n.t('common.ok'), { duration: 2200 });
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

  resetUserSession(): void {
    if (this.resettingUserSession) {
      return;
    }

    const confirmed = window.confirm(this.i18n.t('profile.resetConfirm'));
    if (!confirmed) {
      return;
    }

    this.resettingUserSession = true;

    const finalizeReset = () => {
      this.purchaseService.resetLocalState();
      this.appState.resetUserSession();
      this.hotelCodeEntries = [];
      this.purchaseService.refresh();
      this.resettingUserSession = false;
      this.snackBar.open(this.i18n.t('profile.resetDone'), this.i18n.t('common.ok'), { duration: 2400 });
    };
    finalizeReset();
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
