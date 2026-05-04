import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, map, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CityTranslations, PoiTranslationFields, PoiTranslations } from '../models/localized-content.model';

const ADMIN_SESSION_KEY = 'walkaround.dashboard.session';

export type UserRole = 'admin' | 'facility_manager' | 'user';
export type DiscountCodeApplyTo = 'single' | 'bundle';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  structureId: string | null;
  structureName: string | null;
  email: string;
  role: UserRole;
}

export interface SessionMeta {
  isImpersonating: boolean;
  impersonatedBy: {
    id: string;
    firstName: string;
    lastName: string;
    structureId: string | null;
    structureName: string | null;
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
  firstName: string;
  lastName: string;
  structureId: string | null;
  structureName: string | null;
  email: string;
  role: UserRole;
  expiresAt: string;
}

export interface DashboardUserRow {
  id: string;
  firstName: string;
  lastName: string;
  accountType?: 'dashboard' | 'app';
  structureId: string | null;
  structureName: string | null;
  structureAddress: string | null;
  structureInviteCode: string | null;
  email: string;
  role: UserRole;
  isRegistered: boolean;
  invitedByEmail?: string;
  createdAt: string;
  updatedAt: string;
  associatedStructures: DashboardUserAssociation[];
  unlockedCities: DashboardUserUnlockedCity[];
  unlockedPois: DashboardUserUnlockedPoi[];
  unlockedCitiesCount: number;
  unlockedPoisCount: number;
}

export interface DashboardUserAssociation {
  structureId: string;
  structureName: string | null;
  structureAddress: string | null;
  inviteCode: string | null;
  status: 'active' | 'used' | 'expired' | 'invalid' | 'assigned';
  associatedAt: string | null;
  usedAt: string | null;
  updatedAt: string | null;
}

export interface DashboardUserUnlockedCity {
  cityId: string;
  cityName: string | null;
  unlockedAt: string | null;
}

export interface DashboardUserUnlockedPoi {
  poiId: string;
  poiName: string | null;
  cityId: string;
  cityName: string | null;
  unlockedAt: string | null;
}

export interface DashboardStructure {
  id: string;
  name: string;
  address: string;
  street: string | null;
  streetNumber: string | null;
  city: string | null;
  postalCode: string | null;
  province: string | null;
  country: string | null;
  inviteCode: string | null;
  userDiscountPercent: number;
  structureFixedAmount: number;
  usersCount: number;
  totalStructureEarnings: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardDiscountCode {
  id: number;
  structureId: string;
  structureName: string | null;
  structureAddress: string | null;
  applyTo: DiscountCodeApplyTo;
  cityId: string | null;
  cityName: string | null;
  cityIds: string[];
  cityNames: string[];
  code: string;
  userDiscountPercent: number;
  userDiscountPercentApplied: number;
  userDiscountPercentSingle: number;
  userDiscountPercentBundle: number;
  structureFixedAmount: number;
  structureFixedAmountApplied: number;
  structureFixedAmountSingle: number;
  structureFixedAmountBundle: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardCatalogCity {
  id: string;
  name: string;
  region: string;
  bundlePrice: number;
  heroImage: string;
  isDefault: boolean;
  translations?: CityTranslations;
  poiCount: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface DashboardCatalogPoi {
  id: string;
  cityId: string;
  cityName: string | null;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  descriptionShort: string;
  descriptionLong: string;
  imageUrl: string;
  audioUrl: string;
  priceSingle: number;
  durationSec: number;
  translations?: PoiTranslations;
}

export interface CatalogCityInput {
  name: string;
  region: string;
  bundlePrice: number;
  heroImage: string;
  isDefault: boolean;
  translations?: CityTranslations;
}

export interface CatalogPoiInput {
  cityId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  descriptionShort: string;
  descriptionLong: string;
  imageUrl: string;
  audioUrl: string;
  priceSingle: number;
  durationSec: number;
  translations?: PoiTranslations;
}

export type OpenAiTranslationTargetLanguage = 'en' | 'fr' | 'es' | 'de' | 'pl';

export interface OpenAiTranslationSettings {
  hasApiKey: boolean;
  maskedApiKey: string | null;
  model: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface OpenAiTranslationSettingsInput {
  apiKey?: string;
  model: string;
  clearApiKey?: boolean;
}

export interface OpenAiTranslationUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface OpenAiPoiTranslationStatus {
  poiId: string;
  cityId: string;
  cityName: string | null;
  name: string;
  targetLanguage: OpenAiTranslationTargetLanguage;
  isComplete: boolean;
  missingFields: string[];
  translation: PoiTranslationFields;
}

export interface OpenAiTranslatePoiInput {
  cityId?: string;
  targetLanguage: OpenAiTranslationTargetLanguage;
  overwrite?: boolean;
}

export interface OpenAiTranslatePoiResponse {
  poi: DashboardCatalogPoi;
  translation: PoiTranslationFields;
  usage: OpenAiTranslationUsage;
  skipped?: boolean;
}

export interface CatalogMediaTarget {
  cityId?: string;
  cityName?: string;
}

export interface StructureAssociatedUserRow {
  userId: string;
  structureId: string;
  structureName: string;
  structureAddress: string;
  inviteCode: string | null;
  inviteCodeUsed: boolean;
  inviteCodeUsedAt: string | null;
  associatedAt: string;
  updatedAt: string;
  purchasesCount: number;
  totalSpent: number;
  lastPurchaseAt: string | null;
}

export interface DashboardPaymentRow {
  id: number;
  userId: string;
  customerId: string;
  customerFirstName: string;
  customerLastName: string;
  customerBirthDate: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  paymentMethod: string;
  paymentProvider: string;
  paymentStatus: string;
  paymentOrderId?: string | null;
  paymentCaptureId?: string | null;
  paymentEnvironment?: string | null;
  type: 'single' | 'bundle';
  cityId: string | null;
  cityName: string | null;
  poiId: string | null;
  poiName: string | null;
  targetName: string | null;
  baseAmount: number;
  discountPercent: number;
  discountAmount: number;
  finalAmount: number;
  paidAmount: number;
  structureId: string | null;
  structureName: string | null;
  inviteCode: string | null;
  structureFixedAmount: number;
  structureEarningAmount: number;
  purchasedAt: string;
}

export interface DashboardPaymentsSummary {
  totalPayments: number;
  totalCollected: number;
  totalDiscountAmount: number;
  totalStructureEarnings: number;
}

export interface DashboardPaymentsResponse {
  summary: DashboardPaymentsSummary;
  items: DashboardPaymentRow[];
}

export interface DashboardPayPalSettings {
  id: number;
  isEnabled: boolean;
  mode: 'sandbox' | 'live';
  clientId: string;
  clientSecret: string;
  merchantId: string;
  merchantEmail: string;
  brandName: string;
  webhookId: string;
  currencyCode: 'EUR';
  lastVerifiedAt: string | null;
  lastVerificationStatus: 'valid' | 'invalid' | 'pending' | 'incomplete' | string;
  lastVerificationError: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface DashboardPayPalVerificationResponse {
  valid: boolean;
  verification?: {
    tokenType: string;
    expiresIn: number;
    scope: string;
  };
  settings?: DashboardPayPalSettings;
  message?: string;
}

export interface PartnerEmailTemplatePlaceholder {
  key: string;
  description: string;
}

export interface DashboardPartnerEmailSettings {
  approvalSubject: string;
  approvalBody: string;
  rejectionSubject: string;
  rejectionBody: string;
  placeholders: PartnerEmailTemplatePlaceholder[];
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface PartnerEmailSettingsInput {
  approvalSubject: string;
  approvalBody: string;
  rejectionSubject: string;
  rejectionBody: string;
}

export interface DashboardPartnerRequest {
  id: number;
  structureName: string;
  structureType: string | null;
  vatNumber: string | null;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  website: string | null;
  addressStreet: string;
  addressNumber: string | null;
  addressCity: string;
  addressPostalCode: string | null;
  addressProvince: string | null;
  addressRegion: string | null;
  addressCountry: string | null;
  roomsCount: number | null;
  notes: string | null;
  status: 'pending' | 'approved' | 'rejected';
  pdfReleaseStatus: 'pending' | 'sent';
  approvedStructureId: string | null;
  approvedDiscountCodeId: number | null;
  discountCode: string | null;
  approvalEmailSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerRequestApprovalInput {
  applyTo: DiscountCodeApplyTo;
  cityIds: string[];
  code: string;
  userDiscountPercent: number;
  structureFixedAmount: number;
  expiresAt: string;
}

export interface PartnerRequestPdfPreviewInput {
  cityIds?: string[];
  code?: string | null;
  userDiscountPercent?: number | null;
  structureFixedAmount?: number | null;
  expiresAt?: string | null;
}

interface GenerateStructureInviteCodeResponse {
  inviteCode: string;
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

export interface PasswordResetStatusResponse {
  status: 'valid' | 'expired' | 'invalid';
  email?: string;
  expiresAt?: string;
}

export interface CompletePasswordResetResponse {
  completed?: boolean;
  message?: string;
  status?: 'valid' | 'expired' | 'invalid';
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
      const role = this.sessionSubject.value.user?.role;
      if (role === 'admin' || role === 'facility_manager') {
        return of(true);
      }

      this.clearSession();
      return of(false);
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

  inviteUser(
    firstName: string,
    lastName: string,
    email: string,
    role: UserRole,
    origin: string,
    structureId?: string
  ): Observable<InviteResponse> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<InviteResponse>(
      `${environment.apiBaseUrl}/admin/invitations`,
      { firstName, lastName, structureId, email, role, origin },
      { headers: this.authHeaders(token) }
    );
  }

  createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole,
    structureId?: string
  ): Observable<DashboardUserRow> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<DashboardUserRow>(
      `${environment.apiBaseUrl}/admin/users`,
      { firstName, lastName, email, password, role, structureId },
      { headers: this.authHeaders(token) }
    );
  }

  listStructures(): Observable<DashboardStructure[]> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.get<DashboardStructure[]>(`${environment.apiBaseUrl}/admin/structures`, {
      headers: this.authHeaders(token)
    });
  }

  listCatalogCities(): Observable<DashboardCatalogCity[]> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.get<DashboardCatalogCity[]>(`${environment.apiBaseUrl}/admin/catalog/cities`, {
      headers: this.authHeaders(token)
    });
  }

  createCatalogCity(payload: CatalogCityInput): Observable<DashboardCatalogCity> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<DashboardCatalogCity>(`${environment.apiBaseUrl}/admin/catalog/cities`, payload, {
      headers: this.authHeaders(token)
    });
  }

  updateCatalogCity(cityId: string, payload: CatalogCityInput): Observable<DashboardCatalogCity> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.patch<DashboardCatalogCity>(
      `${environment.apiBaseUrl}/admin/catalog/cities/${encodeURIComponent(cityId)}`,
      payload,
      { headers: this.authHeaders(token) }
    );
  }

  deleteCatalogCity(cityId: string): Observable<{ deleted: boolean; cityId: string }> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.delete<{ deleted: boolean; cityId: string }>(
      `${environment.apiBaseUrl}/admin/catalog/cities/${encodeURIComponent(cityId)}`,
      { headers: this.authHeaders(token) }
    );
  }

  listCatalogPoisByCity(cityId: string): Observable<DashboardCatalogPoi[]> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.get<DashboardCatalogPoi[]>(
      `${environment.apiBaseUrl}/admin/catalog/cities/${encodeURIComponent(cityId)}/pois`,
      { headers: this.authHeaders(token) }
    );
  }

  createCatalogPoi(payload: CatalogPoiInput): Observable<DashboardCatalogPoi> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<DashboardCatalogPoi>(`${environment.apiBaseUrl}/admin/catalog/pois`, payload, {
      headers: this.authHeaders(token)
    });
  }

  updateCatalogPoi(poiId: string, payload: CatalogPoiInput): Observable<DashboardCatalogPoi> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.patch<DashboardCatalogPoi>(
      `${environment.apiBaseUrl}/admin/catalog/pois/${encodeURIComponent(poiId)}`,
      payload,
      { headers: this.authHeaders(token) }
    );
  }

  deleteCatalogPoi(poiId: string): Observable<{ deleted: boolean; poiId: string; cityId: string }> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.delete<{ deleted: boolean; poiId: string; cityId: string }>(
      `${environment.apiBaseUrl}/admin/catalog/pois/${encodeURIComponent(poiId)}`,
      { headers: this.authHeaders(token) }
    );
  }

  getOpenAiTranslationSettings(): Observable<OpenAiTranslationSettings> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.get<OpenAiTranslationSettings>(`${environment.apiBaseUrl}/admin/openai-translations/settings`, {
      headers: this.authHeaders(token)
    });
  }

  saveOpenAiTranslationSettings(payload: OpenAiTranslationSettingsInput): Observable<OpenAiTranslationSettings> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.put<OpenAiTranslationSettings>(
      `${environment.apiBaseUrl}/admin/openai-translations/settings`,
      payload,
      { headers: this.authHeaders(token) }
    );
  }

  listOpenAiPoiTranslationStatus(
    cityId: string,
    targetLanguage: OpenAiTranslationTargetLanguage
  ): Observable<OpenAiPoiTranslationStatus[]> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    const query = `?targetLanguage=${encodeURIComponent(targetLanguage)}`;
    return this.http.get<OpenAiPoiTranslationStatus[]>(
      `${environment.apiBaseUrl}/admin/openai-translations/cities/${encodeURIComponent(cityId)}/status${query}`,
      { headers: this.authHeaders(token) }
    );
  }

  translateCatalogPoiWithOpenAi(
    poiId: string,
    payload: OpenAiTranslatePoiInput
  ): Observable<OpenAiTranslatePoiResponse> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<OpenAiTranslatePoiResponse>(
      `${environment.apiBaseUrl}/admin/openai-translations/pois/${encodeURIComponent(poiId)}/translate`,
      payload,
      { headers: this.authHeaders(token) }
    );
  }

  uploadCatalogPoiAudio(
    fileName: string,
    mimeType: string,
    base64Data: string,
    target: CatalogMediaTarget
  ): Observable<{ audioUrl: string }> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<{ audioUrl: string }>(
      `${environment.apiBaseUrl}/admin/catalog/upload-audio`,
      { fileName, mimeType, base64Data, cityId: target.cityId, cityName: target.cityName },
      { headers: this.authHeaders(token) }
    );
  }

  uploadCatalogPoiImage(
    fileName: string,
    mimeType: string,
    base64Data: string,
    target: CatalogMediaTarget
  ): Observable<{ imageUrl: string }> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<{ imageUrl: string }>(
      `${environment.apiBaseUrl}/admin/catalog/upload-image`,
      { fileName, mimeType, base64Data, cityId: target.cityId, cityName: target.cityName },
      { headers: this.authHeaders(token) }
    );
  }

  createStructure(
    name: string,
    street: string,
    streetNumber: string,
    city: string,
    postalCode: string,
    province: string | null,
    country: string | null
  ): Observable<DashboardStructure> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<DashboardStructure>(
      `${environment.apiBaseUrl}/admin/structures`,
      { name, street, streetNumber, city, postalCode, province, country },
      { headers: this.authHeaders(token) }
    );
  }

  updateStructure(
    structureId: string,
    name: string,
    street: string,
    streetNumber: string,
    city: string,
    postalCode: string,
    province: string | null,
    country: string | null
  ): Observable<DashboardStructure> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.patch<DashboardStructure>(
      `${environment.apiBaseUrl}/admin/structures/${encodeURIComponent(structureId)}`,
      { name, street, streetNumber, city, postalCode, province, country },
      { headers: this.authHeaders(token) }
    );
  }

  updateStructureDiscounts(
    structureId: string,
    userDiscountPercent: number,
    structureFixedAmount: number
  ): Observable<DashboardStructure> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.patch<DashboardStructure>(
      `${environment.apiBaseUrl}/admin/structures/${encodeURIComponent(structureId)}/discounts`,
      { userDiscountPercent, structureFixedAmount },
      { headers: this.authHeaders(token) }
    );
  }

  generateStructureInviteCode(): Observable<string> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http
      .post<GenerateStructureInviteCodeResponse>(
        `${environment.apiBaseUrl}/admin/structures/invite-code`,
        {},
        { headers: this.authHeaders(token) }
      )
      .pipe(map((response) => response.inviteCode));
  }

  listDiscountCodes(structureId?: string): Observable<DashboardDiscountCode[]> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    const query = structureId ? `?structureId=${encodeURIComponent(structureId)}` : '';
    return this.http.get<DashboardDiscountCode[]>(`${environment.apiBaseUrl}/admin/discount-codes${query}`, {
      headers: this.authHeaders(token)
    });
  }

  createDiscountCode(
    structureId: string,
    applyTo: DiscountCodeApplyTo,
    cityIds: string[],
    userDiscountPercent: number,
    structureFixedAmount: number,
    expiresAt: string,
    code?: string
  ): Observable<DashboardDiscountCode> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<DashboardDiscountCode>(
      `${environment.apiBaseUrl}/admin/discount-codes`,
      {
        structureId,
        applyTo,
        cityIds,
        userDiscountPercent,
        structureFixedAmount,
        expiresAt,
        code: code || undefined
      },
      { headers: this.authHeaders(token) }
    );
  }

  updateDiscountCode(
    discountCodeId: number,
    applyTo: DiscountCodeApplyTo,
    cityIds: string[],
    userDiscountPercent: number,
    structureFixedAmount: number,
    expiresAt: string
  ): Observable<DashboardDiscountCode> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.patch<DashboardDiscountCode>(
      `${environment.apiBaseUrl}/admin/discount-codes/${encodeURIComponent(String(discountCodeId))}`,
      {
        applyTo,
        cityIds,
        userDiscountPercent,
        structureFixedAmount,
        expiresAt
      },
      { headers: this.authHeaders(token) }
    );
  }

  deleteDiscountCode(discountCodeId: number): Observable<{ deleted: boolean; id: number; code: string }> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.delete<{ deleted: boolean; id: number; code: string }>(
      `${environment.apiBaseUrl}/admin/discount-codes/${encodeURIComponent(String(discountCodeId))}`,
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

  listAssociatedUsers(structureId?: string): Observable<StructureAssociatedUserRow[]> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    const query = structureId ? `?structureId=${encodeURIComponent(structureId)}` : '';
    return this.http.get<StructureAssociatedUserRow[]>(`${environment.apiBaseUrl}/admin/associated-users${query}`, {
      headers: this.authHeaders(token)
    });
  }

  listPayments(structureId?: string): Observable<DashboardPaymentsResponse> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    const query = structureId ? `?structureId=${encodeURIComponent(structureId)}` : '';
    return this.http.get<DashboardPaymentsResponse>(`${environment.apiBaseUrl}/admin/payments${query}`, {
      headers: this.authHeaders(token)
    });
  }

  getPayPalSettings(): Observable<DashboardPayPalSettings> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.get<DashboardPayPalSettings>(`${environment.apiBaseUrl}/admin/paypal-settings`, {
      headers: this.authHeaders(token)
    });
  }

  updatePayPalSettings(payload: Omit<DashboardPayPalSettings, 'id' | 'lastVerifiedAt' | 'lastVerificationStatus' | 'lastVerificationError' | 'updatedAt' | 'updatedBy'>): Observable<DashboardPayPalSettings> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.put<DashboardPayPalSettings>(`${environment.apiBaseUrl}/admin/paypal-settings`, payload, {
      headers: this.authHeaders(token)
    });
  }

  testPayPalSettings(): Observable<DashboardPayPalVerificationResponse> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<DashboardPayPalVerificationResponse>(`${environment.apiBaseUrl}/admin/paypal-settings/test`, {}, {
      headers: this.authHeaders(token)
    });
  }

  getPartnerEmailSettings(): Observable<DashboardPartnerEmailSettings> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.get<DashboardPartnerEmailSettings>(`${environment.apiBaseUrl}/admin/partner-email-settings`, {
      headers: this.authHeaders(token)
    });
  }

  updatePartnerEmailSettings(payload: PartnerEmailSettingsInput): Observable<DashboardPartnerEmailSettings> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.put<DashboardPartnerEmailSettings>(`${environment.apiBaseUrl}/admin/partner-email-settings`, payload, {
      headers: this.authHeaders(token)
    });
  }

  listPartnerRequests(): Observable<DashboardPartnerRequest[]> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.get<DashboardPartnerRequest[]>(`${environment.apiBaseUrl}/admin/partner-requests`, {
      headers: this.authHeaders(token)
    });
  }

  previewPartnerRequestPdf(requestId: number, payload: PartnerRequestPdfPreviewInput = {}): Observable<Blob> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post(`${environment.apiBaseUrl}/admin/partner-requests/${encodeURIComponent(String(requestId))}/pdf-preview`, payload, {
      headers: this.authHeaders(token),
      responseType: 'blob'
    });
  }

  approvePartnerRequest(requestId: number, payload: PartnerRequestApprovalInput): Observable<DashboardPartnerRequest> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<DashboardPartnerRequest>(
      `${environment.apiBaseUrl}/admin/partner-requests/${encodeURIComponent(String(requestId))}/approve`,
      payload,
      { headers: this.authHeaders(token) }
    );
  }

  rejectPartnerRequest(requestId: number): Observable<DashboardPartnerRequest> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<DashboardPartnerRequest>(
      `${environment.apiBaseUrl}/admin/partner-requests/${encodeURIComponent(String(requestId))}/reject`,
      {},
      { headers: this.authHeaders(token) }
    );
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

  updateUserStructure(userId: string, structureId: string | null, inviteCode: string | null = null): Observable<DashboardUserRow> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.patch<DashboardUserRow>(
      `${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}/structure`,
      { structureId, inviteCode },
      { headers: this.authHeaders(token) }
    );
  }

  updateUserAccess(userId: string, role: UserRole, structureId: string | null): Observable<DashboardUserRow> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.patch<DashboardUserRow>(
      `${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}/access`,
      { role, structureId },
      { headers: this.authHeaders(token) }
    );
  }

  sendUserPasswordReset(
    userId: string,
    origin: string
  ): Observable<{ sent: boolean; userId: string; email: string; expiresAt: string }> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.post<{ sent: boolean; userId: string; email: string; expiresAt: string }>(
      `${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}/password-reset`,
      { origin },
      { headers: this.authHeaders(token) }
    );
  }

  deleteUser(userId: string): Observable<{ deleted: boolean; userId: string }> {
    const token = this.sessionSubject.value?.token;
    if (!token) {
      return throwError(() => new Error('Sessione dashboard non valida'));
    }

    return this.http.delete<{ deleted: boolean; userId: string }>(
      `${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}`,
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

  getPasswordResetStatus(token: string): Observable<PasswordResetStatusResponse> {
    const encoded = encodeURIComponent(token);
    return this.http.get<PasswordResetStatusResponse>(`${environment.apiBaseUrl}/auth/password-resets/${encoded}`);
  }

  completePasswordReset(token: string, password: string): Observable<CompletePasswordResetResponse> {
    const encoded = encodeURIComponent(token);
    return this.http.post<CompletePasswordResetResponse>(
      `${environment.apiBaseUrl}/auth/password-resets/${encoded}/complete`,
      { password }
    );
  }

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngsw-bypass': 'true'
    });
  }

  persistSession(session: DashboardSession): DashboardSession {
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

      const legacyUser = parsed.user as AdminUser & { name?: string; facilityName?: string };
      parsed.user.firstName = parsed.user.firstName || legacyUser.name || '';
      parsed.user.lastName = parsed.user.lastName || '';
      parsed.user.structureId = parsed.user.structureId ?? null;
      parsed.user.structureName = parsed.user.structureName ?? legacyUser.facilityName ?? null;

      if (!parsed.session) {
        parsed.session = { isImpersonating: false, impersonatedBy: null };
      }

      if (parsed.session.impersonatedBy) {
        const legacyImpersonated = parsed.session.impersonatedBy as SessionMeta['impersonatedBy'] & {
          name?: string;
          facilityName?: string;
        };
        parsed.session.impersonatedBy.firstName =
          parsed.session.impersonatedBy.firstName || legacyImpersonated.name || '';
        parsed.session.impersonatedBy.lastName = parsed.session.impersonatedBy.lastName || '';
        parsed.session.impersonatedBy.structureId = parsed.session.impersonatedBy.structureId ?? null;
        parsed.session.impersonatedBy.structureName =
          parsed.session.impersonatedBy.structureName ?? legacyImpersonated.facilityName ?? null;
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


