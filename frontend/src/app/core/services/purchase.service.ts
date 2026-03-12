import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, EMPTY, Observable, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PurchaseItem, PurchasesResponse } from '../models/purchase.model';
import { UnlockCodeDialogComponent } from '../../shared/components/unlock-code-dialog/unlock-code-dialog.component';
import { AppStateService } from './app-state.service';

interface PurchaseResponse {
  purchased: boolean;
  alreadyPurchased?: boolean;
  type: 'bundle' | 'single';
  cityId?: string;
  poiId?: string;
  amount?: number;
}

interface BundleUnlockPayload {
  code: string;
  userId: string;
  type: 'bundle';
  cityId: string;
}

interface SingleUnlockPayload {
  code: string;
  userId: string;
  type: 'single';
  poiId: string;
}

interface BundleUnlockResult {
  type: 'bundle';
  cityId: string;
  cityName?: string;
  amount: number;
}

interface SingleUnlockResult {
  type: 'single';
  cityId: string;
  poiId: string;
  poiName?: string;
  amount: number;
}

type UnlockResult = BundleUnlockResult | SingleUnlockResult;

interface UnlockValidationResponse {
  valid: boolean;
  unlocked?: UnlockResult;
  message?: string;
}

interface HotelValidationResponse {
  valid: boolean;
  unlocked?: BundleUnlockResult;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private readonly purchasesSubject = new BehaviorSubject<PurchasesResponse>({
    items: [],
    unlockedPoiIds: [],
    unlockedCityIds: []
  });
  private sessionPurchaseId = 1;

  readonly purchases$ = this.purchasesSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    private readonly appState: AppStateService
  ) {}

  loadPurchases(): Observable<PurchasesResponse> {
    return of(this.purchasesSubject.value);
  }

  purchaseCityBundle(cityId: string): Observable<PurchaseResponse> {
    return this.requestUnlockCode().pipe(
      switchMap((code) => {
        if (!code) {
          return EMPTY;
        }

        const payload: BundleUnlockPayload = {
          code,
          userId: this.appState.userId,
          type: 'bundle',
          cityId
        };

        return this.http.post<UnlockValidationResponse>(`${environment.apiBaseUrl}/unlock/validate`, payload);
      }),
      tap((response) => {
        const unlocked = response.unlocked;
        if (!response.valid || !unlocked || unlocked.type !== 'bundle') {
          throw new Error(response.message || 'Risposta unlock non valida');
        }

        this.applyBundleUnlock(unlocked.cityId, unlocked.amount);
      }),
      map((response) => {
        const unlocked = response.unlocked as BundleUnlockResult;
        return {
          purchased: true,
          type: 'bundle',
          cityId: unlocked.cityId,
          amount: unlocked.amount
        } satisfies PurchaseResponse;
      })
    );
  }

  purchasePoiSingle(poiId: string): Observable<PurchaseResponse> {
    return this.requestUnlockCode().pipe(
      switchMap((code) => {
        if (!code) {
          return EMPTY;
        }

        const payload: SingleUnlockPayload = {
          code,
          userId: this.appState.userId,
          type: 'single',
          poiId
        };

        return this.http.post<UnlockValidationResponse>(`${environment.apiBaseUrl}/unlock/validate`, payload);
      }),
      tap((response) => {
        const unlocked = response.unlocked;
        if (!response.valid || !unlocked || unlocked.type !== 'single') {
          throw new Error(response.message || 'Risposta unlock non valida');
        }

        this.applySingleUnlock(unlocked.poiId, unlocked.cityId, unlocked.amount);
      }),
      map((response) => {
        const unlocked = response.unlocked as SingleUnlockResult;
        return {
          purchased: true,
          type: 'single',
          cityId: unlocked.cityId,
          poiId: unlocked.poiId,
          amount: unlocked.amount
        } satisfies PurchaseResponse;
      })
    );
  }

  validateHotelCode(code: string): Observable<HotelValidationResponse> {
    return this.http
      .post<HotelValidationResponse>(`${environment.apiBaseUrl}/hotel/validate`, {
        code,
        userId: this.appState.userId
      })
      .pipe(
        tap((response) => {
          if (!response.valid || !response.unlocked) {
            return;
          }

          this.applyBundleUnlock(response.unlocked.cityId, response.unlocked.amount);
        })
      );
  }

  isPoiUnlocked(poiId: string, cityId: string): boolean {
    const purchases = this.purchasesSubject.value;
    return purchases.unlockedPoiIds.includes(poiId) || purchases.unlockedCityIds.includes(cityId);
  }

  isCityUnlocked(cityId: string): boolean {
    return this.purchasesSubject.value.unlockedCityIds.includes(cityId);
  }

  refresh(): void {
    // Session unlocks are kept only in memory and reset on full page refresh.
  }

  private requestUnlockCode(): Observable<string | null> {
    return this.dialog
      .open(UnlockCodeDialogComponent, {
        autoFocus: true,
        restoreFocus: true,
        width: '92vw',
        maxWidth: '420px'
      })
      .afterClosed()
      .pipe(
        map((value) => {
          const normalized = String(value || '').trim();
          return normalized || null;
        })
      );
  }

  private applyBundleUnlock(cityId: string, amount: number): void {
    const current = this.purchasesSubject.value;
    if (current.unlockedCityIds.includes(cityId)) {
      return;
    }

    this.purchasesSubject.next({
      items: [this.createSessionItem('bundle', cityId, null, amount), ...current.items],
      unlockedPoiIds: [...current.unlockedPoiIds],
      unlockedCityIds: Array.from(new Set([...current.unlockedCityIds, cityId]))
    });
  }

  private applySingleUnlock(poiId: string, cityId: string, amount: number): void {
    const current = this.purchasesSubject.value;
    if (current.unlockedPoiIds.includes(poiId) || current.unlockedCityIds.includes(cityId)) {
      return;
    }

    this.purchasesSubject.next({
      items: [this.createSessionItem('single', cityId, poiId, amount), ...current.items],
      unlockedPoiIds: Array.from(new Set([...current.unlockedPoiIds, poiId])),
      unlockedCityIds: [...current.unlockedCityIds]
    });
  }

  private createSessionItem(type: 'bundle' | 'single', cityId: string, poiId: string | null, amount: number): PurchaseItem {
    return {
      id: this.sessionPurchaseId++,
      userId: this.appState.userId,
      type,
      cityId,
      poiId,
      amount,
      purchasedAt: new Date().toISOString()
    };
  }
}
