import { Injectable } from '@angular/core';
import { of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class PoiService {
    constructor(http) {
        this.http = http;
        this.citiesUrl = `${environment.apiBaseUrl}/cities`;
        this.poisByCityCache = new Map();
    }
    getCities() {
        if (!this.citiesRequest$) {
            this.citiesRequest$ = this.http.get(this.citiesUrl).pipe(shareReplay(1));
        }
        return this.citiesRequest$;
    }
    getPoisByCity(cityId, forceRefresh = false) {
        if (!forceRefresh && this.poisByCityCache.has(cityId)) {
            return of(this.poisByCityCache.get(cityId) || []);
        }
        return this.http
            .get(`${environment.apiBaseUrl}/cities/${cityId}/pois`)
            .pipe(tap((pois) => this.poisByCityCache.set(cityId, pois)));
    }
    getPoiById(poiId) {
        const fromCache = Array.from(this.poisByCityCache.values())
            .flat()
            .find((poi) => poi.id === poiId);
        if (fromCache) {
            return of(fromCache);
        }
        return this.http.get(`${environment.apiBaseUrl}/pois/${poiId}`);
    }
    static { this.ɵfac = function PoiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PoiService)(i0.ɵɵinject(i1.HttpClient)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PoiService, factory: PoiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PoiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }], null); })();
