import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PurchaseItem, PurchasesResponse } from '../models/purchase.model';
import {
  UnlockCodeDialogComponent,
  UnlockCodeDialogData,
  UnlockCodeDialogResult
} from '../../shared/components/unlock-code-dialog/unlock-code-dialog.component';
import { AppStateService, HotelAssociation } from './app-state.service';

interface HotelValidationResponse {
  valid: boolean;
  applied?: boolean;
  association?: HotelAssociation;
  message?: string;
}

export interface HotelCodeStatusEntry {
  inviteCode: string;
  structureId: string | null;
  structureName: string | null;
  structureAddress: string | null;
  appliesTo?: 'single' | 'bundle' | null;
  cityId?: string | null;
  cityName?: string | null;
  cityIds?: string[];
  cityNames?: string[];
  status: 'activated' | 'used' | 'expired' | 'invalid';
  expiresAt?: string | null;
  activatedAt?: string | null;
  usedAt?: string | null;
}

interface HotelAssociationResponse {
  associated: boolean;
  association?: HotelAssociation;
  codes?: HotelCodeStatusEntry[];
}

interface RemoveHotelAssociationResponse {
  removed: boolean;
  hadAssociation: boolean;
}

interface ClearPurchasesResponse {
  cleared: boolean;
  deletedCount: number;
}

export interface CheckoutPurchaseResponse {
  purchased: boolean;
  alreadyPurchased?: boolean;
  type: 'single' | 'bundle';
  cityId?: string;
  poiId?: string;
  amount?: number;
  baseAmount?: number;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount?: number;
  structureId?: string | null;
  inviteCode?: string | null;
  structureFixedAmount?: number;
  structureEarningAmount?: number;
  purchasedAt?: string;
  expiresAt?: string | null;
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

  purchaseCityBundle(cityId: string, cityName: string, amount: number): Observable<UnlockCodeDialogResult | null> {
    const dialogData: UnlockCodeDialogData = {
      userId: this.appState.userId,
      existingCode: this.appState.hotelCode,
      existingAssociation: this.appState.hotelAssociation,
      target: {
        type: 'bundle',
        cityId,
        label: cityName,
        baseAmount: Number(amount)
      }
    };

    return this.openUnlockDialog(dialogData);
  }

  purchasePoiSingle(poiId: string, cityId: string, poiName: string, amount: number): Observable<UnlockCodeDialogResult | null> {
    const dialogData: UnlockCodeDialogData = {
      userId: this.appState.userId,
      existingCode: this.appState.hotelCode,
      existingAssociation: this.appState.hotelAssociation,
      target: {
        type: 'single',
        poiId,
        cityId,
        label: poiName,
        baseAmount: Number(amount)
      }
    };

    return this.openUnlockDialog(dialogData);
  }

  purchasePoiSingleWithoutCode(poiId: string): Observable<CheckoutPurchaseResponse> {
    return this.http
      .post<CheckoutPurchaseResponse>(`${environment.apiBaseUrl}/purchase`, {
        userId: this.appState.userId,
        type: 'single',
        poiId,
        ignoreDiscountCode: true
      })
      .pipe(
        tap((result) => {
          this.applyPurchaseResult(result);
        })
      );
  }

  purchaseCityBundleWithoutCode(cityId: string): Observable<CheckoutPurchaseResponse> {
    return this.http
      .post<CheckoutPurchaseResponse>(`${environment.apiBaseUrl}/purchase`, {
        userId: this.appState.userId,
        type: 'bundle',
        cityId,
        ignoreDiscountCode: true
      })
      .pipe(
        tap((result) => {
          this.applyPurchaseResult(result);
        })
      );
  }

  validateHotelCode(code: string): Observable<HotelValidationResponse> {
    return this.http.post<HotelValidationResponse>(`${environment.apiBaseUrl}/hotel/validate`, {
      code,
      userId: this.appState.userId
    });
  }

  getHotelAssociation(): Observable<HotelAssociation | null> {
    return this.getHotelAssociationDetails().pipe(map((response) => response.association));
  }

  getHotelAssociationDetails(): Observable<{ association: HotelAssociation | null; codes: HotelCodeStatusEntry[] }> {
    return this.http
      .get<HotelAssociationResponse>(`${environment.apiBaseUrl}/me/hotel-association`, {
        params: { userId: this.appState.userId }
      })
      .pipe(
        map((response) => ({
          association: response.associated ? response.association || null : null,
          codes: Array.isArray(response.codes) ? response.codes : []
        }))
      );
  }

  removeHotelAssociation(): Observable<RemoveHotelAssociationResponse> {
    return this.http.delete<RemoveHotelAssociationResponse>(`${environment.apiBaseUrl}/hotel/association`, {
      params: { userId: this.appState.userId }
    });
  }

  clearPurchasesForDebug(): Observable<ClearPurchasesResponse> {
    return this.http
      .delete<ClearPurchasesResponse>(`${environment.apiBaseUrl}/me/purchases`, {
        params: { userId: this.appState.userId }
      })
      .pipe(
        map((response) => {
          this.purchasesSubject.next({
            items: [],
            unlockedPoiIds: [],
            unlockedCityIds: []
          });
          return response;
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
    this.http
      .get<PurchasesResponse>(`${environment.apiBaseUrl}/me/purchases`, {
        params: { userId: this.appState.userId }
      })
      .subscribe({
        next: (response) => {
          this.purchasesSubject.next(this.normalizePurchases(response));
        },
        error: () => {
          // Keep local state if backend is temporarily unavailable.
        }
      });
  }

  resetLocalState(): void {
    this.sessionPurchaseId = 1;
    this.purchasesSubject.next({
      items: [],
      unlockedPoiIds: [],
      unlockedCityIds: []
    });
  }

  private openUnlockDialog(dialogData: UnlockCodeDialogData): Observable<UnlockCodeDialogResult | null> {
    return this.dialog
      .open(UnlockCodeDialogComponent, {
        autoFocus: true,
        restoreFocus: true,
        data: dialogData,
        width: '92vw',
        maxWidth: '560px'
      })
      .afterClosed()
      .pipe(
        map((value) => value || null),
        map((result) => {
          if (!result?.association) {
            if (result?.action === 'paid') {
              this.applyPurchaseResult(result.purchase || null);
            }
            return result;
          }

          const association = result.association;
          this.appState.setHotelAssociation(association);
          if (association.inviteCode) {
            this.appState.setHotelCode(association.inviteCode);
          }
          if (result.action === 'paid') {
            this.applyPurchaseResult(result.purchase || null);
          }
          return result;
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

  private applyPurchaseResult(purchase: CheckoutPurchaseResponse | null): void {
    if (!purchase || !purchase.purchased) {
      return;
    }

    const amount = this.resolvePurchaseAmount(purchase);
    if (purchase.type === 'bundle' && purchase.cityId) {
      this.applyBundleUnlock(purchase.cityId, amount);
      this.refresh();
      return;
    }

    if (purchase.type === 'single' && purchase.cityId && purchase.poiId) {
      this.applySingleUnlock(purchase.poiId, purchase.cityId, amount);
      this.refresh();
      return;
    }

    this.refresh();
  }

  private resolvePurchaseAmount(purchase: CheckoutPurchaseResponse): number {
    const finalAmount = Number(purchase.finalAmount);
    if (Number.isFinite(finalAmount) && finalAmount >= 0) {
      return finalAmount;
    }

    const amount = Number(purchase.amount);
    if (Number.isFinite(amount) && amount >= 0) {
      return amount;
    }

    return 0;
  }

  private normalizePurchases(response: PurchasesResponse | null | undefined): PurchasesResponse {
    if (!response) {
      return {
        items: [],
        unlockedPoiIds: [],
        unlockedCityIds: []
      };
    }

    return {
      items: Array.isArray(response.items) ? response.items : [],
      unlockedPoiIds: Array.isArray(response.unlockedPoiIds) ? response.unlockedPoiIds : [],
      unlockedCityIds: Array.isArray(response.unlockedCityIds) ? response.unlockedCityIds : []
    };
  }
}
