import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, map, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

const ADMIN_SESSION_KEY = 'tourism.dashboard.session';

export type UserRole = 'admin' | 'facility_manager';

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface SessionMeta {
  isImpersonating: boolean;
  impersonatedBy: {
    id: string;
    email: string;
  } | null;
}

interface LoginResponse {
  token: string;
  expiresAt: string;
  user: AdminUser;
  session: SessionMeta;
}

interface MeResponse {
  user: AdminUser;
  session: SessionMeta;
}

export interface DashboardSession {
  token: string;
  expiresAt: string;
  user: AdminUser;
  session: SessionMeta;
}

export interface InviteResponse {
  invited: boolean;
  email: string;
  role: UserRole;
  expiresAt: string;
}

export interface DashboardUserRow {
  id: string;
  email: string;
  role: UserRole;
  isRegistered: boolean;
  invitedByEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationStatusResponse {
  status: 'valid' | 'expired' | 'already_registered' | 'invalid';
  email?: string;
  expiresAt?: string;
}

export interface CompleteInvitationResponse {
  completed?: boolean;
  message?: string;
  status?: 'valid' | 'expired' | 'already_registered' | 'invalid';
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly sessionSubject = new BehaviorSubject<DashboardSession | null>(this.readSessionFromStorage());
  private restoreRequest$?: Observable<boolean>;

  readonly session$ = this.sessionSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  get session(): DashboardSession | null {
    return this.sessionSubject.value;
  }

  get user(): AdminUser | null {
    return this.session?.user || null;
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  get isImpersonating(): boolean {
    return Boolean(this.session?.session?.isImpersonating);
  }

  login(email: string, password: string): Observable<DashboardSession> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password }).pipe(
      map((response) =>
        this.persistSession({
          token: response.token,
          expiresAt: response.expiresAt,
          user: response.user,
          session: response.session
        })
      )
    );
  }

  ensureAuthenticated(): Observable<boolean> {
    if (this.sessionSubject.value) {
      return of(true);
    }

    return this.restoreSession();
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
      .get<MeResponse>(`${environment.apiBaseUrl}/auth/me`, {
        headers: this.authHeaders(fromStorage.token)
      })
      .pipe(
        map((response) =>
          this.persistSession({
            ...fromStorage,
            user: response.user,
            session: response.session
          })
        ),
        map(() => true),
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
    const token = this.sessionSubject.value?.token;
    if (!token) {
      this.clearSession();
      return of(void 0);
    }

    return this.http.post(`${environment.apiBaseUrl}/auth/logout`, {}, { headers: this.authHeaders(token) }).pipe(
      catchError(() => of(null)),
      tap(() => this.clearSession()),
      map(() => void 0)
    );
  }

  inviteUser(email: string, role: UserRole, origin: string): Observable<InviteResponse> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<InviteResponse>(
      `${environment.apiBaseUrl}/admin/invitations`,
      { email, role, origin },
      { headers: this.authHeaders(token) }
    );
  }

  listUsers(): Observable<DashboardUserRow[]> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.get<DashboardUserRow[]>(`${environment.apiBaseUrl}/admin/users`, {
      headers: this.authHeaders(token)
    });
  }

  updateUserRole(userId: string, role: UserRole): Observable<DashboardUserRow> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.patch<DashboardUserRow>(
      `${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}/role`,
      { role },
      { headers: this.authHeaders(token) }
    );
  }

  impersonateUser(userId: string): Observable<DashboardSession> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http
      .post<LoginResponse>(
        `${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}/impersonate`,
        {},
        { headers: this.authHeaders(token) }
      )
      .pipe(
        map((response) =>
          this.persistSession({
            token: response.token,
            expiresAt: response.expiresAt,
            user: response.user,
            session: response.session
          })
        )
      );
  }

  exitImpersonation(): Observable<DashboardSession> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/impersonation/exit`, {}, { headers: this.authHeaders(token) })
      .pipe(
        map((response) =>
          this.persistSession({
            token: response.token,
            expiresAt: response.expiresAt,
            user: response.user,
            session: response.session
          })
        )
      );
  }

  getInvitationStatus(token: string): Observable<InvitationStatusResponse> {
    const encoded = encodeURIComponent(token);
    return this.http.get<InvitationStatusResponse>(`${environment.apiBaseUrl}/auth/invitations/${encoded}`);
  }

  completeInvitation(token: string, password: string): Observable<CompleteInvitationResponse> {
    const encoded = encodeURIComponent(token);
    return this.http.post<CompleteInvitationResponse>(`${environment.apiBaseUrl}/auth/invitations/${encoded}/complete`, {
      password
    });
  }

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private persistSession(session: DashboardSession): DashboardSession {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    this.sessionSubject.next(session);
    return session;
  }

  private readSessionFromStorage(): DashboardSession | null {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as DashboardSession;
      if (!parsed?.token || !parsed?.user?.email) {
        return null;
      }

      if (!parsed.session) {
        parsed.session = { isImpersonating: false, impersonatedBy: null };
      }

      return parsed;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    this.sessionSubject.next(null);
  }
}
