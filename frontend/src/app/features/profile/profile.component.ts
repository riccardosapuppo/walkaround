import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { City } from '../../core/models/city.model';
import { AppStateService, HotelAssociation } from '../../core/services/app-state.service';
import { PoiService } from '../../core/services/poi.service';
import { HotelCodeStatusEntry, PurchaseService } from '../../core/services/purchase.service';
import { StructureLocationService } from '../../core/services/structure-location.service';

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
  language: 'it' | 'en' = 'it';
  loading = true;
  removingInviteCode = false;
  resettingUserSession = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly poiService: PoiService,
    private readonly appState: AppStateService,
    private readonly purchaseService: PurchaseService,
    private readonly structureLocationService: StructureLocationService,
    private readonly snackBar: MatSnackBar
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

  setLanguage(language: 'it' | 'en'): void {
    this.appState.setLanguage(language);
    this.snackBar.open(`Lingua impostata: ${language.toUpperCase()}`, 'OK', { duration: 1800 });
  }

  get hasStoredInviteCode(): boolean {
    return this.hotelCode !== '-' || !!this.hotelAssociation;
  }

  get inviteCodeStatusText(): string {
    const status = this.hotelAssociation?.codeStatus || (this.hasStoredInviteCode ? 'invalid' : null);
    if (status === 'valid') {
      return 'Attivato (non usato)';
    }
    if (status === 'used') {
      return 'Usato';
    }
    if (status === 'expired') {
      return 'Scaduto';
    }
    if (status === 'invalid') {
      return 'Non valido';
    }
    return 'Nessun codice';
  }

  get inviteCodeExpiresAt(): string {
    const value = this.hotelAssociation?.expiresAt || '';
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  removeInviteCodeAssociation(entry?: HotelCodeStatusEntry): void {
    if (this.removingInviteCode) {
      return;
    }
    if (entry && !this.canRemoveCodeEntry(entry)) {
      this.snackBar.open('Questo codice e gia usato e non puo essere rimosso', 'Chiudi', { duration: 2500 });
      return;
    }
    if (!entry && !this.hasStoredInviteCode) {
      return;
    }

    const codeLabel = entry?.inviteCode || this.hotelAssociation?.inviteCode || this.hotelCode;
    const confirmed = window.confirm(`Rimuovere il codice ${codeLabel || 'selezionato'}?`);
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
        this.snackBar.open('Codice invito/sconto rimosso', 'OK', { duration: 2200 });
      },
      error: (error: { error?: { message?: string } }) => {
        this.removingInviteCode = false;
        const message = error?.error?.message || 'Impossibile rimuovere il codice in questo momento';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  restorePurchases(): void {
    this.purchaseService.refresh();
    this.snackBar.open('Acquisti ripristinati (simulato)', 'OK', { duration: 2200 });
  }

  codeEntryStatusLabel(entry: HotelCodeStatusEntry): string {
    if (entry.status === 'activated') {
      return 'Attivato';
    }
    if (entry.status === 'used') {
      return 'Usato';
    }
    if (entry.status === 'expired') {
      return 'Scaduto';
    }
    return 'Non valido';
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
      return 'Pacchetto citta';
    }
    if (entry.appliesTo === 'single') {
      return 'Luogo singolo';
    }
    return '-';
  }

  codeEntryCitiesLabel(entry: HotelCodeStatusEntry): string {
    const names = Array.isArray(entry.cityNames) ? entry.cityNames.map((name) => String(name || '').trim()).filter(Boolean) : [];
    if (names.length) {
      return names.join(', ');
    }
    if (entry.cityName) {
      return entry.cityName;
    }
    const ids = Array.isArray(entry.cityIds) ? entry.cityIds.map((id) => String(id || '').trim()).filter(Boolean) : [];
    if (ids.length) {
      return ids.join(', ');
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

    const confirmed = window.confirm(
      'Vuoi avviare una nuova sessione utente? Verranno rimossi codice invito/sconto e dati locali del profilo.'
    );
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
      this.snackBar.open('Sessione utente resettata', 'OK', { duration: 2400 });
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
      this.snackBar.open('Dati struttura non disponibili per la navigazione', 'Chiudi', { duration: 2400 });
      return;
    }

    window.open(url, '_blank', 'noopener');
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

