import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
const CART_STORAGE_KEY = 'walkaround.cart.items';
export class CartService {
    constructor() {
        this.itemsSubject = new BehaviorSubject(this.readStoredItems());
        this.items$ = this.itemsSubject.asObservable();
    }
    get items() {
        return this.itemsSubject.value;
    }
    get count() {
        return this.items.length;
    }
    get totalAmount() {
        return this.items.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    }
    addPoi(item) {
        const poiId = String(item.poiId || '').trim();
        if (!poiId || this.isPoiInCart(poiId)) {
            return false;
        }
        const nextItem = {
            key: `single:${poiId}`,
            type: 'single',
            poiId,
            cityId: String(item.cityId || '').trim(),
            cityName: String(item.cityName || '').trim(),
            label: String(item.label || '').trim(),
            amount: Number(item.amount || 0),
            addedAt: new Date().toISOString()
        };
        this.persistItems([nextItem, ...this.items]);
        return true;
    }
    removeItem(key) {
        const normalized = String(key || '').trim();
        if (!normalized) {
            return;
        }
        this.persistItems(this.items.filter((item) => item.key !== normalized));
    }
    clear() {
        this.persistItems([]);
    }
    isPoiInCart(poiId) {
        const normalized = String(poiId || '').trim();
        if (!normalized) {
            return false;
        }
        return this.items.some((item) => item.poiId === normalized);
    }
    persistItems(items) {
        this.itemsSubject.next(items);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
    readStoredItems() {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) {
            return [];
        }
        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                return [];
            }
            return parsed
                .map((entry) => ({
                key: String(entry?.key || '').trim(),
                type: 'single',
                poiId: String(entry?.poiId || '').trim(),
                cityId: String(entry?.cityId || '').trim(),
                cityName: String(entry?.cityName || '').trim(),
                label: String(entry?.label || '').trim(),
                amount: Number(entry?.amount || 0),
                addedAt: String(entry?.addedAt || '').trim() || new Date().toISOString()
            }))
                .filter((entry) => Boolean(entry.key && entry.poiId));
        }
        catch {
            return [];
        }
    }
    static { this.ɵfac = function CartService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CartService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: CartService, factory: CartService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CartService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
