import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PurchasesResponse } from '../models/purchase.model';
import { AppStateService } from './app-state.service';

interface PurchasePayload {
  userId: string;
  type: 'bundle';
  cityId: string;
}

interface PurchaseResponse {
  purchased: boolean;
  alreadyPurchased?: boolean;
  type: 'bundle';
  cityId: string;
  amount?: number;
}

interface HotelValidationResponse {
  valid: boolean;
  unlocked?: {
    type: 'bundle';
    cityId: string;
    cityName: string;
    amount: number;
  };
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private readonly purchasesSubject = new BehaviorSubject<PurchasesResponse>({
    items: [],
    unlockedPoiIds: [],
    unlockedCityIds: []
  });

  readonly purchases$ = this.purchasesSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly appState: AppStateService
  ) {}

  loadPurchases(): Observable<PurchasesResponse> {
    return this.http
      .get<PurchasesResponse>(`${environment.apiBaseUrl}/me/purchases`, {
        params: {
          userId: this.appState.userId
        }
      })
      .pipe(tap((response) => this.purchasesSubject.next(response)));
  }

  purchaseCityBundle(cityId: string): Observable<PurchaseResponse> {
    const payload: PurchasePayload = {
      userId: this.appState.userId,
      type: 'bundle',
      cityId
    };

    return this.http
      .post<PurchaseResponse>(`${environment.apiBaseUrl}/purchase`, payload)
      .pipe(tap(() => this.refresh()));
  }

  validateHotelCode(code: string): Observable<HotelValidationResponse> {
    return this.http
      .post<HotelValidationResponse>(`${environment.apiBaseUrl}/hotel/validate`, {
        code,
        userId: this.appState.userId
      })
      .pipe(tap(() => this.refresh()));
  }

  isPoiUnlocked(poiId: string, cityId: string): boolean {
    const purchases = this.purchasesSubject.value;
    return purchases.unlockedPoiIds.includes(poiId) || purchases.unlockedCityIds.includes(cityId);
  }

  isCityUnlocked(cityId: string): boolean {
    return this.purchasesSubject.value.unlockedCityIds.includes(cityId);
  }

  refresh(): void {
    this.loadPurchases().subscribe({
      error: (error) => {
        console.warn(this.describeRefreshError(error));
      }
    });
  }

  private describeRefreshError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Cannot refresh purchases: backend non raggiungibile.';
      }

      if (error.status === 200) {
        return 'Cannot refresh purchases: risposta non JSON da /api/me/purchases.';
      }

      return `Cannot refresh purchases: HTTP ${error.status} ${error.statusText}.`;
    }

    return 'Cannot refresh purchases: errore sconosciuto.';
  }
}
