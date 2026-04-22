import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
const ADMIN_SESSION_KEY = 'walkaround.dashboard.session';
export class AdminAuthService {
    constructor(http) {
        this.http = http;
        this.sessionSubject = new BehaviorSubject(this.readSessionFromStorage());
        this.session$ = this.sessionSubject.asObservable();
    }
    get session() {
        return this.sessionSubject.value;
    }
    get user() {
        return this.session?.user || null;
    }
    get isAdmin() {
        return this.user?.role === 'admin';
    }
    get isImpersonating() {
        return Boolean(this.session?.session?.isImpersonating);
    }
    login(email, password) {
        return this.http.post(`${environment.apiBaseUrl}/auth/login`, { email, password }).pipe(map((response) => this.persistSession({
            token: response.token,
            expiresAt: response.expiresAt,
            user: response.user,
            session: response.session
        })));
    }
    ensureAuthenticated() {
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
    restoreSession() {
        if (this.restoreRequest$) {
            return this.restoreRequest$;
        }
        const fromStorage = this.readSessionFromStorage();
        if (!fromStorage) {
            return of(false);
        }
        this.restoreRequest$ = this.http
            .get(`${environment.apiBaseUrl}/auth/me`, {
            headers: this.authHeaders(fromStorage.token)
        })
            .pipe(map((response) => this.persistSession({
            ...fromStorage,
            user: response.user,
            session: response.session
        })), map(() => true), catchError(() => {
            this.clearSession();
            return of(false);
        }), finalize(() => {
            this.restoreRequest$ = undefined;
        }), shareReplay(1));
        return this.restoreRequest$;
    }
    logout() {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            this.clearSession();
            return of(void 0);
        }
        return this.http.post(`${environment.apiBaseUrl}/auth/logout`, {}, { headers: this.authHeaders(token) }).pipe(catchError(() => of(null)), tap(() => this.clearSession()), map(() => void 0));
    }
    inviteUser(firstName, lastName, email, role, origin, structureId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/invitations`, { firstName, lastName, structureId, email, role, origin }, { headers: this.authHeaders(token) });
    }
    createUser(firstName, lastName, email, password, role, structureId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/users`, { firstName, lastName, email, password, role, structureId }, { headers: this.authHeaders(token) });
    }
    listStructures() {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.get(`${environment.apiBaseUrl}/admin/structures`, {
            headers: this.authHeaders(token)
        });
    }
    listCatalogCities() {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.get(`${environment.apiBaseUrl}/admin/catalog/cities`, {
            headers: this.authHeaders(token)
        });
    }
    createCatalogCity(payload) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/catalog/cities`, payload, {
            headers: this.authHeaders(token)
        });
    }
    updateCatalogCity(cityId, payload) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.patch(`${environment.apiBaseUrl}/admin/catalog/cities/${encodeURIComponent(cityId)}`, payload, { headers: this.authHeaders(token) });
    }
    deleteCatalogCity(cityId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.delete(`${environment.apiBaseUrl}/admin/catalog/cities/${encodeURIComponent(cityId)}`, { headers: this.authHeaders(token) });
    }
    listCatalogPoisByCity(cityId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.get(`${environment.apiBaseUrl}/admin/catalog/cities/${encodeURIComponent(cityId)}/pois`, { headers: this.authHeaders(token) });
    }
    createCatalogPoi(payload) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/catalog/pois`, payload, {
            headers: this.authHeaders(token)
        });
    }
    updateCatalogPoi(poiId, payload) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.patch(`${environment.apiBaseUrl}/admin/catalog/pois/${encodeURIComponent(poiId)}`, payload, { headers: this.authHeaders(token) });
    }
    deleteCatalogPoi(poiId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.delete(`${environment.apiBaseUrl}/admin/catalog/pois/${encodeURIComponent(poiId)}`, { headers: this.authHeaders(token) });
    }
    getOpenAiTranslationSettings() {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.get(`${environment.apiBaseUrl}/admin/openai-translations/settings`, {
            headers: this.authHeaders(token)
        });
    }
    saveOpenAiTranslationSettings(payload) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.put(`${environment.apiBaseUrl}/admin/openai-translations/settings`, payload, { headers: this.authHeaders(token) });
    }
    listOpenAiPoiTranslationStatus(cityId, targetLanguage) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        const query = `?targetLanguage=${encodeURIComponent(targetLanguage)}`;
        return this.http.get(`${environment.apiBaseUrl}/admin/openai-translations/cities/${encodeURIComponent(cityId)}/status${query}`, { headers: this.authHeaders(token) });
    }
    translateCatalogPoiWithOpenAi(poiId, payload) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/openai-translations/pois/${encodeURIComponent(poiId)}/translate`, payload, { headers: this.authHeaders(token) });
    }
    uploadCatalogPoiAudio(fileName, mimeType, base64Data, target) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/catalog/upload-audio`, { fileName, mimeType, base64Data, cityId: target.cityId, cityName: target.cityName }, { headers: this.authHeaders(token) });
    }
    uploadCatalogPoiImage(fileName, mimeType, base64Data, target) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/catalog/upload-image`, { fileName, mimeType, base64Data, cityId: target.cityId, cityName: target.cityName }, { headers: this.authHeaders(token) });
    }
    createStructure(name, street, streetNumber, city, postalCode, province, country) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/structures`, { name, street, streetNumber, city, postalCode, province, country }, { headers: this.authHeaders(token) });
    }
    updateStructure(structureId, name, street, streetNumber, city, postalCode, province, country) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.patch(`${environment.apiBaseUrl}/admin/structures/${encodeURIComponent(structureId)}`, { name, street, streetNumber, city, postalCode, province, country }, { headers: this.authHeaders(token) });
    }
    updateStructureDiscounts(structureId, userDiscountPercent, structureFixedAmount) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.patch(`${environment.apiBaseUrl}/admin/structures/${encodeURIComponent(structureId)}/discounts`, { userDiscountPercent, structureFixedAmount }, { headers: this.authHeaders(token) });
    }
    generateStructureInviteCode() {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http
            .post(`${environment.apiBaseUrl}/admin/structures/invite-code`, {}, { headers: this.authHeaders(token) })
            .pipe(map((response) => response.inviteCode));
    }
    listDiscountCodes(structureId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        const query = structureId ? `?structureId=${encodeURIComponent(structureId)}` : '';
        return this.http.get(`${environment.apiBaseUrl}/admin/discount-codes${query}`, {
            headers: this.authHeaders(token)
        });
    }
    createDiscountCode(structureId, applyTo, cityIds, userDiscountPercent, structureFixedAmount, expiresAt, code) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/discount-codes`, {
            structureId,
            applyTo,
            cityIds,
            userDiscountPercent,
            structureFixedAmount,
            expiresAt,
            code: code || undefined
        }, { headers: this.authHeaders(token) });
    }
    updateDiscountCode(discountCodeId, applyTo, cityIds, userDiscountPercent, structureFixedAmount, expiresAt) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.patch(`${environment.apiBaseUrl}/admin/discount-codes/${encodeURIComponent(String(discountCodeId))}`, {
            applyTo,
            cityIds,
            userDiscountPercent,
            structureFixedAmount,
            expiresAt
        }, { headers: this.authHeaders(token) });
    }
    deleteDiscountCode(discountCodeId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.delete(`${environment.apiBaseUrl}/admin/discount-codes/${encodeURIComponent(String(discountCodeId))}`, { headers: this.authHeaders(token) });
    }
    listUsers() {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.get(`${environment.apiBaseUrl}/admin/users`, {
            headers: this.authHeaders(token)
        });
    }
    listAssociatedUsers(structureId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        const query = structureId ? `?structureId=${encodeURIComponent(structureId)}` : '';
        return this.http.get(`${environment.apiBaseUrl}/admin/associated-users${query}`, {
            headers: this.authHeaders(token)
        });
    }
    listPayments(structureId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        const query = structureId ? `?structureId=${encodeURIComponent(structureId)}` : '';
        return this.http.get(`${environment.apiBaseUrl}/admin/payments${query}`, {
            headers: this.authHeaders(token)
        });
    }
    getPayPalSettings() {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.get(`${environment.apiBaseUrl}/admin/paypal-settings`, {
            headers: this.authHeaders(token)
        });
    }
    updatePayPalSettings(payload) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.put(`${environment.apiBaseUrl}/admin/paypal-settings`, payload, {
            headers: this.authHeaders(token)
        });
    }
    testPayPalSettings() {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/paypal-settings/test`, {}, {
            headers: this.authHeaders(token)
        });
    }
    listPartnerRequests() {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.get(`${environment.apiBaseUrl}/admin/partner-requests`, {
            headers: this.authHeaders(token)
        });
    }
    previewPartnerRequestPdf(requestId, payload = {}) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/partner-requests/${encodeURIComponent(String(requestId))}/pdf-preview`, payload, {
            headers: this.authHeaders(token),
            responseType: 'blob'
        });
    }
    approvePartnerRequest(requestId, payload) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/partner-requests/${encodeURIComponent(String(requestId))}/approve`, payload, { headers: this.authHeaders(token) });
    }
    rejectPartnerRequest(requestId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/partner-requests/${encodeURIComponent(String(requestId))}/reject`, {}, { headers: this.authHeaders(token) });
    }
    updateUserRole(userId, role) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.patch(`${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}/role`, { role }, { headers: this.authHeaders(token) });
    }
    updateUserStructure(userId, structureId, inviteCode = null) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.patch(`${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}/structure`, { structureId, inviteCode }, { headers: this.authHeaders(token) });
    }
    updateUserAccess(userId, role, structureId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.patch(`${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}/access`, { role, structureId }, { headers: this.authHeaders(token) });
    }
    sendUserPasswordReset(userId, origin) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.post(`${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}/password-reset`, { origin }, { headers: this.authHeaders(token) });
    }
    deleteUser(userId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http.delete(`${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}`, { headers: this.authHeaders(token) });
    }
    impersonateUser(userId) {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http
            .post(`${environment.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}/impersonate`, {}, { headers: this.authHeaders(token) })
            .pipe(map((response) => this.persistSession({
            token: response.token,
            expiresAt: response.expiresAt,
            user: response.user,
            session: response.session
        })));
    }
    exitImpersonation() {
        const token = this.sessionSubject.value?.token;
        if (!token) {
            return throwError(() => new Error('Sessione dashboard non valida'));
        }
        return this.http
            .post(`${environment.apiBaseUrl}/auth/impersonation/exit`, {}, { headers: this.authHeaders(token) })
            .pipe(map((response) => this.persistSession({
            token: response.token,
            expiresAt: response.expiresAt,
            user: response.user,
            session: response.session
        })));
    }
    getInvitationStatus(token) {
        const encoded = encodeURIComponent(token);
        return this.http.get(`${environment.apiBaseUrl}/auth/invitations/${encoded}`);
    }
    completeInvitation(token, password) {
        const encoded = encodeURIComponent(token);
        return this.http.post(`${environment.apiBaseUrl}/auth/invitations/${encoded}/complete`, {
            password
        });
    }
    getPasswordResetStatus(token) {
        const encoded = encodeURIComponent(token);
        return this.http.get(`${environment.apiBaseUrl}/auth/password-resets/${encoded}`);
    }
    completePasswordReset(token, password) {
        const encoded = encodeURIComponent(token);
        return this.http.post(`${environment.apiBaseUrl}/auth/password-resets/${encoded}/complete`, { password });
    }
    authHeaders(token) {
        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }
    persistSession(session) {
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        this.sessionSubject.next(session);
        return session;
    }
    readSessionFromStorage() {
        const raw = localStorage.getItem(ADMIN_SESSION_KEY);
        if (!raw) {
            return null;
        }
        try {
            const parsed = JSON.parse(raw);
            if (!parsed?.token || !parsed?.user?.email) {
                return null;
            }
            const legacyUser = parsed.user;
            parsed.user.firstName = parsed.user.firstName || legacyUser.name || '';
            parsed.user.lastName = parsed.user.lastName || '';
            parsed.user.structureId = parsed.user.structureId ?? null;
            parsed.user.structureName = parsed.user.structureName ?? legacyUser.facilityName ?? null;
            if (!parsed.session) {
                parsed.session = { isImpersonating: false, impersonatedBy: null };
            }
            if (parsed.session.impersonatedBy) {
                const legacyImpersonated = parsed.session.impersonatedBy;
                parsed.session.impersonatedBy.firstName =
                    parsed.session.impersonatedBy.firstName || legacyImpersonated.name || '';
                parsed.session.impersonatedBy.lastName = parsed.session.impersonatedBy.lastName || '';
                parsed.session.impersonatedBy.structureId = parsed.session.impersonatedBy.structureId ?? null;
                parsed.session.impersonatedBy.structureName =
                    parsed.session.impersonatedBy.structureName ?? legacyImpersonated.facilityName ?? null;
            }
            return parsed;
        }
        catch {
            return null;
        }
    }
    clearSession() {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        this.sessionSubject.next(null);
    }
    static { this.ɵfac = function AdminAuthService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdminAuthService)(i0.ɵɵinject(i1.HttpClient)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AdminAuthService, factory: AdminAuthService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdminAuthService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }], null); })();
