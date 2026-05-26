import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PurchaseItem, PurchasesResponse } from '../models/purchase.model';
import {
  UnlockCodeDialogComponent,
  UnlockCodeDialogData,
  UnlockCodeDialogResult
} from '../../shared/components/unlock-code-dialog/unlock-code-dialog.component';
import { AdminAuthService } from './admin-auth.service';
import { AppAuthService } from './app-auth.service';
import { AppStateService, HotelAssociation } from './app-state.service';

const ADMIN_UNLOCK_SIMULATION_KEY = 'walkaround.adminUnlockSimulation';

export interface HotelValidationResponse {
  valid: boolean;
  applied?: boolean;
  association?: HotelAssociation;
  alreadyAssociated?: boolean;
  codeStatus?: 'valid' | 'expired' | 'invalid' | 'used';
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
    unlockedCityIds: [],
    adminUnlockSimulation: false
  });
  private readonly adminUnlockSimulationSubject = new BehaviorSubject<boolean>(
    localStorage.getItem(ADMIN_UNLOCK_SIMULATION_KEY) === '1'
  );
  private sessionPurchaseId = 1;

  readonly purchases$ = this.purchasesSubject.asObservable();
  readonly adminUnlockSimulation$ = this.adminUnlockSimulationSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    private readonly appState: AppStateService,
    private readonly adminAuth: AdminAuthService,
    private readonly appAuth: AppAuthService
  ) {}

  loadPurchases(): Observable<PurchasesResponse> {
    return of(this.purchasesSubject.value);
  }

  get isAdminUnlockSimulationActive(): boolean {
    return this.adminUnlockSimulationSubject.value;
  }

  get effectiveUserId(): string {
    return this.appAuth.user?.id || this.appState.userId;
  }

  setAdminUnlockSimulation(enabled: boolean): Observable<boolean> {
    if (!enabled) {
      return this.disableAdminUnlockSimulation();
    }

    return this.enableAdminUnlockSimulation();
  }

  purchaseCityBundle(cityId: string, cityName: string, amount: number): Observable<UnlockCodeDialogResult | null> {
    const dialogData: UnlockCodeDialogData = {
      userId: this.effectiveUserId,
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
      userId: this.effectiveUserId,
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
        userId: this.effectiveUserId,
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
        userId: this.effectiveUserId,
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
      userId: this.effectiveUserId
    });
  }

  getHotelAssociation(): Observable<HotelAssociation | null> {
    return this.getHotelAssociationDetails().pipe(map((response) => response.association));
  }

  getHotelAssociationDetails(): Observable<{ association: HotelAssociation | null; codes: HotelCodeStatusEntry[] }> {
    return this.http
      .get<HotelAssociationResponse>(`${environment.apiBaseUrl}/me/hotel-association`, {
        params: { userId: this.effectiveUserId }
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
      params: { userId: this.effectiveUserId }
    });
  }

  clearPurchasesForDebug(): Observable<ClearPurchasesResponse> {
    return this.http
      .delete<ClearPurchasesResponse>(`${environment.apiBaseUrl}/me/purchases`, {
        params: { userId: this.effectiveUserId }
      })
      .pipe(
        map((response) => {
          this.purchasesSubject.next({
            items: [],
            unlockedPoiIds: [],
            unlockedCityIds: [],
            adminUnlockSimulation: false
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
    const useAdminUnlockSimulation = this.shouldRequestAdminUnlockSimulation();

    if (this.adminUnlockSimulationSubject.value && !useAdminUnlockSimulation) {
      this.persistAdminUnlockSimulation(false);
      this.removeSimulationFromCurrentPurchases();
    }

    this.fetchPurchases(useAdminUnlockSimulation)
      .subscribe({
        next: (response) => {
          if (useAdminUnlockSimulation && !response.adminUnlockSimulation) {
            this.persistAdminUnlockSimulation(false);
          }
          this.purchasesSubject.next(this.normalizePurchases(response));
        },
        error: () => {
          if (!useAdminUnlockSimulation) {
            // Keep local state if backend is temporarily unavailable.
            return;
          }

          this.persistAdminUnlockSimulation(false);
          this.removeSimulationFromCurrentPurchases();
          this.fetchPurchases(false).subscribe({
            next: (response) => {
              this.purchasesSubject.next(this.normalizePurchases(response));
            },
            error: () => {
              // Keep the locally rebuilt non-simulated state.
            }
          });
        }
      });
  }

  resetLocalState(): void {
    this.sessionPurchaseId = 1;
    this.persistAdminUnlockSimulation(false);
    this.purchasesSubject.next({
      items: [],
      unlockedPoiIds: [],
      unlockedCityIds: [],
      adminUnlockSimulation: false
    });
  }

  private enableAdminUnlockSimulation(): Observable<boolean> {
    if (this.adminAuth.user?.role !== 'admin' || !this.adminAuth.session?.token) {
      this.persistAdminUnlockSimulation(false);
      return of(false);
    }

    return this.fetchPurchases(true).pipe(
      map((response) => {
        if (!response.adminUnlockSimulation) {
          this.persistAdminUnlockSimulation(false);
          this.purchasesSubject.next(this.normalizePurchases(response));
          return false;
        }

        this.persistAdminUnlockSimulation(true);
        this.purchasesSubject.next(this.normalizePurchases(response));
        return true;
      }),
      catchError(() => {
        this.persistAdminUnlockSimulation(false);
        this.refresh();
        return of(false);
      })
    );
  }

  private disableAdminUnlockSimulation(): Observable<boolean> {
    this.persistAdminUnlockSimulation(false);
    this.removeSimulationFromCurrentPurchases();

    return this.fetchPurchases(false).pipe(
      map((response) => {
        this.purchasesSubject.next(this.normalizePurchases(response));
        return true;
      }),
      catchError(() => of(true))
    );
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
      unlockedCityIds: Array.from(new Set([...current.unlockedCityIds, cityId])),
      adminUnlockSimulation: current.adminUnlockSimulation
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
      unlockedCityIds: [...current.unlockedCityIds],
      adminUnlockSimulation: current.adminUnlockSimulation
    });
  }

  private createSessionItem(type: 'bundle' | 'single', cityId: string, poiId: string | null, amount: number): PurchaseItem {
    return {
      id: this.sessionPurchaseId++,
      userId: this.effectiveUserId,
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

  private shouldRequestAdminUnlockSimulation(): boolean {
    return (
      this.adminUnlockSimulationSubject.value &&
      this.adminAuth.user?.role === 'admin' &&
      Boolean(this.adminAuth.session?.token)
    );
  }

  private fetchPurchases(adminUnlockSimulation: boolean): Observable<PurchasesResponse> {
    const params: Record<string, string> = {
      userId: this.effectiveUserId
    };
    const token = this.adminAuth.session?.token;
    let headers: HttpHeaders | undefined;

    if (adminUnlockSimulation && token) {
      params['adminUnlockSimulation'] = '1';
      headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
    }

    return this.http.get<PurchasesResponse>(`${environment.apiBaseUrl}/me/purchases`, {
      params,
      headers
    });
  }

  private persistAdminUnlockSimulation(enabled: boolean): void {
    if (enabled) {
      localStorage.setItem(ADMIN_UNLOCK_SIMULATION_KEY, '1');
    } else {
      localStorage.removeItem(ADMIN_UNLOCK_SIMULATION_KEY);
    }

    this.adminUnlockSimulationSubject.next(enabled);
  }

  private removeSimulationFromCurrentPurchases(): void {
    const current = this.purchasesSubject.value;
    const directUnlocks = this.rebuildDirectUnlocks(current.items);
    this.purchasesSubject.next({
      ...current,
      ...directUnlocks,
      adminUnlockSimulation: false
    });
  }

  private rebuildDirectUnlocks(items: PurchaseItem[]): Pick<PurchasesResponse, 'unlockedPoiIds' | 'unlockedCityIds'> {
    const activeItems = items.filter((item) => item.isActive !== false);
    const unlockedPoiIds = activeItems
      .filter((item) => item.type === 'single' && !!item.poiId)
      .map((item) => String(item.poiId));
    const unlockedCityIds = activeItems
      .filter((item) => item.type === 'bundle' && !!item.cityId)
      .map((item) => String(item.cityId));

    return {
      unlockedPoiIds: Array.from(new Set(unlockedPoiIds)),
      unlockedCityIds: Array.from(new Set(unlockedCityIds))
    };
  }

  private normalizePurchases(response: PurchasesResponse | null | undefined): PurchasesResponse {
    if (!response) {
      return {
        items: [],
        unlockedPoiIds: [],
        unlockedCityIds: [],
        adminUnlockSimulation: false
      };
    }

    return {
      items: Array.isArray(response.items) ? response.items : [],
      unlockedPoiIds: Array.isArray(response.unlockedPoiIds) ? response.unlockedPoiIds : [],
      unlockedCityIds: Array.isArray(response.unlockedCityIds) ? response.unlockedCityIds : [],
      adminUnlockSimulation: response.adminUnlockSimulation === true
    };
  }
}
