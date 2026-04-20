import { Injectable } from '@angular/core';
import { BehaviorSubject, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UnlockCodeDialogComponent } from '../../shared/components/unlock-code-dialog/unlock-code-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@angular/material/dialog";
import * as i3 from "./app-state.service";
export class PurchaseService {
    constructor(http, dialog, appState) {
        this.http = http;
        this.dialog = dialog;
        this.appState = appState;
        this.purchasesSubject = new BehaviorSubject({
            items: [],
            unlockedPoiIds: [],
            unlockedCityIds: []
        });
        this.sessionPurchaseId = 1;
        this.purchases$ = this.purchasesSubject.asObservable();
    }
    loadPurchases() {
        return of(this.purchasesSubject.value);
    }
    purchaseCityBundle(cityId, cityName, amount) {
        const dialogData = {
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
    purchasePoiSingle(poiId, cityId, poiName, amount) {
        const dialogData = {
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
    purchasePoiSingleWithoutCode(poiId) {
        return this.http
            .post(`${environment.apiBaseUrl}/purchase`, {
            userId: this.appState.userId,
            type: 'single',
            poiId,
            ignoreDiscountCode: true
        })
            .pipe(tap((result) => {
            this.applyPurchaseResult(result);
        }));
    }
    purchaseCityBundleWithoutCode(cityId) {
        return this.http
            .post(`${environment.apiBaseUrl}/purchase`, {
            userId: this.appState.userId,
            type: 'bundle',
            cityId,
            ignoreDiscountCode: true
        })
            .pipe(tap((result) => {
            this.applyPurchaseResult(result);
        }));
    }
    validateHotelCode(code) {
        return this.http.post(`${environment.apiBaseUrl}/hotel/validate`, {
            code,
            userId: this.appState.userId
        });
    }
    getHotelAssociation() {
        return this.getHotelAssociationDetails().pipe(map((response) => response.association));
    }
    getHotelAssociationDetails() {
        return this.http
            .get(`${environment.apiBaseUrl}/me/hotel-association`, {
            params: { userId: this.appState.userId }
        })
            .pipe(map((response) => ({
            association: response.associated ? response.association || null : null,
            codes: Array.isArray(response.codes) ? response.codes : []
        })));
    }
    removeHotelAssociation() {
        return this.http.delete(`${environment.apiBaseUrl}/hotel/association`, {
            params: { userId: this.appState.userId }
        });
    }
    clearPurchasesForDebug() {
        return this.http
            .delete(`${environment.apiBaseUrl}/me/purchases`, {
            params: { userId: this.appState.userId }
        })
            .pipe(map((response) => {
            this.purchasesSubject.next({
                items: [],
                unlockedPoiIds: [],
                unlockedCityIds: []
            });
            return response;
        }));
    }
    isPoiUnlocked(poiId, cityId) {
        const purchases = this.purchasesSubject.value;
        return purchases.unlockedPoiIds.includes(poiId) || purchases.unlockedCityIds.includes(cityId);
    }
    isCityUnlocked(cityId) {
        return this.purchasesSubject.value.unlockedCityIds.includes(cityId);
    }
    refresh() {
        this.http
            .get(`${environment.apiBaseUrl}/me/purchases`, {
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
    resetLocalState() {
        this.sessionPurchaseId = 1;
        this.purchasesSubject.next({
            items: [],
            unlockedPoiIds: [],
            unlockedCityIds: []
        });
    }
    openUnlockDialog(dialogData) {
        return this.dialog
            .open(UnlockCodeDialogComponent, {
            autoFocus: true,
            restoreFocus: true,
            data: dialogData,
            width: '92vw',
            maxWidth: '560px'
        })
            .afterClosed()
            .pipe(map((value) => value || null), map((result) => {
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
        }));
    }
    applyBundleUnlock(cityId, amount) {
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
    applySingleUnlock(poiId, cityId, amount) {
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
    createSessionItem(type, cityId, poiId, amount) {
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
    applyPurchaseResult(purchase) {
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
    resolvePurchaseAmount(purchase) {
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
    normalizePurchases(response) {
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
    static { this.ɵfac = function PurchaseService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PurchaseService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.MatDialog), i0.ɵɵinject(i3.AppStateService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PurchaseService, factory: PurchaseService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PurchaseService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }, { type: i2.MatDialog }, { type: i3.AppStateService }], null); })();
