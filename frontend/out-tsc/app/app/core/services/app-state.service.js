import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import * as i0 from "@angular/core";
const STORAGE_KEYS = {
    userId: 'tourism.userId',
    activeCityId: 'tourism.activeCityId',
    hotelCode: 'tourism.hotelCode',
    hotelAssociation: 'tourism.hotelAssociation',
    favorites: 'tourism.favorites',
    language: 'tourism.language'
};
export class AppStateService {
    constructor() {
        this.userIdSubject = new BehaviorSubject(this.ensureUserId());
        this.activeCityIdSubject = new BehaviorSubject(localStorage.getItem(STORAGE_KEYS.activeCityId) || 'catania');
        this.hotelCodeSubject = new BehaviorSubject(localStorage.getItem(STORAGE_KEYS.hotelCode) || '');
        this.hotelAssociationSubject = new BehaviorSubject(this.readObject(STORAGE_KEYS.hotelAssociation));
        this.favoritesSubject = new BehaviorSubject(this.readArray(STORAGE_KEYS.favorites));
        this.languageSubject = new BehaviorSubject(localStorage.getItem(STORAGE_KEYS.language) || 'it');
        this.userId$ = this.userIdSubject.asObservable();
        this.activeCityId$ = this.activeCityIdSubject.asObservable();
        this.hotelCode$ = this.hotelCodeSubject.asObservable();
        this.hotelAssociation$ = this.hotelAssociationSubject.asObservable();
        this.favorites$ = this.favoritesSubject.asObservable();
        this.language$ = this.languageSubject.asObservable();
    }
    get userId() {
        return this.userIdSubject.value;
    }
    get activeCityId() {
        return this.activeCityIdSubject.value;
    }
    get hotelCode() {
        return this.hotelCodeSubject.value;
    }
    get hotelAssociation() {
        return this.hotelAssociationSubject.value;
    }
    get favoriteIds() {
        return this.favoritesSubject.value;
    }
    setActiveCity(cityId) {
        localStorage.setItem(STORAGE_KEYS.activeCityId, cityId);
        this.activeCityIdSubject.next(cityId);
    }
    setHotelCode(code) {
        localStorage.setItem(STORAGE_KEYS.hotelCode, code);
        this.hotelCodeSubject.next(code);
    }
    setHotelAssociation(association) {
        if (!association) {
            localStorage.removeItem(STORAGE_KEYS.hotelAssociation);
            this.hotelAssociationSubject.next(null);
            return;
        }
        localStorage.setItem(STORAGE_KEYS.hotelAssociation, JSON.stringify(association));
        this.hotelAssociationSubject.next(association);
    }
    setLanguage(language) {
        localStorage.setItem(STORAGE_KEYS.language, language);
        this.languageSubject.next(language);
    }
    toggleFavorite(poiId) {
        const current = new Set(this.favoritesSubject.value);
        if (current.has(poiId)) {
            current.delete(poiId);
        }
        else {
            current.add(poiId);
        }
        const next = Array.from(current);
        localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(next));
        this.favoritesSubject.next(next);
    }
    isFavorite(poiId) {
        return this.favoritesSubject.value.includes(poiId);
    }
    resetUserSession() {
        const nextUserId = uuidv4();
        const defaultCityId = 'catania';
        localStorage.setItem(STORAGE_KEYS.userId, nextUserId);
        localStorage.setItem(STORAGE_KEYS.activeCityId, defaultCityId);
        localStorage.removeItem(STORAGE_KEYS.hotelCode);
        localStorage.removeItem(STORAGE_KEYS.hotelAssociation);
        localStorage.removeItem(STORAGE_KEYS.favorites);
        this.userIdSubject.next(nextUserId);
        this.activeCityIdSubject.next(defaultCityId);
        this.hotelCodeSubject.next('');
        this.hotelAssociationSubject.next(null);
        this.favoritesSubject.next([]);
        return nextUserId;
    }
    ensureUserId() {
        const existing = localStorage.getItem(STORAGE_KEYS.userId);
        if (existing) {
            return existing;
        }
        const created = uuidv4();
        localStorage.setItem(STORAGE_KEYS.userId, created);
        return created;
    }
    readArray(key) {
        const value = localStorage.getItem(key);
        if (!value) {
            return [];
        }
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            return [];
        }
    }
    readObject(key) {
        const value = localStorage.getItem(key);
        if (!value) {
            return null;
        }
        try {
            return JSON.parse(value);
        }
        catch {
            return null;
        }
    }
    static { this.ɵfac = function AppStateService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppStateService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AppStateService, factory: AppStateService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppStateService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
