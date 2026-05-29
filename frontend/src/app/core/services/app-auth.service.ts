import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppStateService, HotelAssociation } from './app-state.service';
import { DashboardSession, AdminAuthService } from './admin-auth.service';

const APP_SESSION_KEY = 'walkaround.app.session';

export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AppSession {
  token: string;
  expiresAt: string;
  user: AppUser;
}

interface AuthResponse {
  token: string;
  expiresAt: string;
  user: AppUser;
  dashboardSession?: DashboardSession | null;
}

interface MeResponse {
  user: AppUser;
}

interface StoredDiscountValidationResponse {
  valid: boolean;
  association?: HotelAssociation;
  codeStatus?: 'valid' | 'expired' | 'invalid' | 'used';
}

export interface PasswordResetStatusResponse {
  status: 'valid' | 'expired' | 'invalid';
  email?: string;
  expiresAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AppAuthService {
  private readonly sessionSubject = new BehaviorSubject<AppSession | null>(this.readSessionFromStorage());
  private restoreRequest$?: Observable<boolean>;

  readonly session$ = this.sessionSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly appState: AppStateService,
    private readonly adminAuth: AdminAuthService
  ) {
    const session = this.sessionSubject.value;
    if (session?.user?.id) {
      this.appState.setUserId(session.user.id);
    }
  }

  get session(): AppSession | null {
    return this.sessionSubject.value;
  }

  get user(): AppUser | null {
    return this.session?.user || null;
  }

  get isAuthenticated(): boolean {
    return !!this.user?.id && !!this.session?.token;
  }

  login(email: string, password: string): Observable<AppSession> {
    const clientUserId = this.appState.userId;
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/app-auth/login`, { email, password, clientUserId }).pipe(
      map((response) => this.persistAuthResponse(response)),
      switchMap((session) => this.syncStoredDiscountCode().pipe(map(() => session)))
    );
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<AppSession> {
    const clientUserId = this.appState.userId;
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/app-auth/register`, { firstName, lastName, email, password, clientUserId })
      .pipe(
        map((response) => this.persistAuthResponse(response)),
        switchMap((session) => this.syncStoredDiscountCode().pipe(map(() => session)))
      );
  }

  loginWithDashboardSession(dashboardToken: string): Observable<AppSession> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiBaseUrl}/app-auth/dashboard-session`,
        {},
        { headers: this.authHeaders(dashboardToken) }
      )
      .pipe(map((response) => this.persistSession(response)));
  }

  restoreSession(): Observable<boolean> {
    if (this.restoreRequest$) {
      return this.restoreRequest$;
    }

    const fromStorage = this.readSessionFromStorage();
    if (!fromStorage) {
      return of(false);
    }

    this.restoreRequest$ = this.http
      .get<MeResponse>(`${environment.apiBaseUrl}/app-auth/me`, {
        headers: this.authHeaders(fromStorage.token)
      })
      .pipe(
        map((response) => {
          this.persistSession({
            ...fromStorage,
            user: response.user
          });
          return true;
        }),
        catchError(() => {
          this.clearSession();
          return of(false);
        }),
        finalize(() => {
          this.restoreRequest$ = undefined;
        }),
        shareReplay(1)
      );

    return this.restoreRequest$;
  }

  logout(): Observable<void> {
    const token = this.session?.token;
    if (!token) {
      this.clearSession();
      return of(void 0);
    }

    return this.http.post(`${environment.apiBaseUrl}/app-auth/logout`, {}, { headers: this.authHeaders(token) }).pipe(
      catchError(() => of(null)),
      map(() => {
        this.clearSession();
        return void 0;
      })
    );
  }

  requestPasswordReset(email: string, origin: string): Observable<{ sent: boolean }> {
    return this.http.post<{ sent: boolean }>(`${environment.apiBaseUrl}/app-auth/password-reset`, { email, origin });
  }

  getPasswordResetStatus(token: string): Observable<PasswordResetStatusResponse> {
    return this.http.get<PasswordResetStatusResponse>(
      `${environment.apiBaseUrl}/app-auth/password-resets/${encodeURIComponent(token)}`
    );
  }

  completePasswordReset(token: string, password: string): Observable<{ completed: boolean }> {
    return this.http.post<{ completed: boolean }>(
      `${environment.apiBaseUrl}/app-auth/password-resets/${encodeURIComponent(token)}/complete`,
      { password }
    );
  }

  authHeaders(token = this.session?.token || ''): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngsw-bypass': 'true'
    });
  }

  private persistSession(session: AppSession): AppSession {
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify(session));
    this.sessionSubject.next(session);
    this.appState.setUserId(session.user.id);
    return session;
  }

  private persistAuthResponse(response: AuthResponse): AppSession {
    if (response.dashboardSession) {
      this.adminAuth.persistSession(response.dashboardSession);
    }

    return this.persistSession({
      token: response.token,
      expiresAt: response.expiresAt,
      user: response.user
    });
  }

  private readSessionFromStorage(): AppSession | null {
    const raw = localStorage.getItem(APP_SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as AppSession;
      if (!parsed?.token || !parsed?.user?.id || !parsed?.user?.email) {
        return null;
      }
      parsed.user.firstName = parsed.user.firstName || '';
      parsed.user.lastName = parsed.user.lastName || '';
      return parsed;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    localStorage.removeItem(APP_SESSION_KEY);
    this.sessionSubject.next(null);
    this.appState.startGuestSession();
  }

  private syncStoredDiscountCode(): Observable<unknown> {
    const code = String(this.appState.hotelCode || '').trim();
    if (!code) {
      return of(null);
    }

    return this.http
      .post<StoredDiscountValidationResponse>(`${environment.apiBaseUrl}/hotel/validate`, {
        code,
        userId: this.appState.userId
      })
      .pipe(
        tap((response) => {
          if (response.valid && response.association?.codeStatus === 'valid') {
            this.appState.setHotelCode(response.association.inviteCode || code);
            this.appState.setHotelAssociation(response.association);
            return;
          }
          if (response.codeStatus === 'expired' || response.codeStatus === 'invalid' || response.codeStatus === 'used') {
            this.clearStoredDiscountCode();
          }
        }),
        catchError((error: { status?: number; error?: { codeStatus?: 'expired' | 'invalid' | 'used' } }) => {
          const status = error?.error?.codeStatus;
          if (error?.status === 404 || status === 'expired' || status === 'invalid' || status === 'used') {
            this.clearStoredDiscountCode();
          }
          return of(null);
        })
      );
  }

  private clearStoredDiscountCode(): void {
    this.appState.setHotelCode('');
    this.appState.setHotelAssociation(null);
  }
}
