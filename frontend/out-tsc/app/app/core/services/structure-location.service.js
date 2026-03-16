import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class StructureLocationService {
    constructor(http) {
        this.http = http;
        this.geocodeCache = new Map();
    }
    resolveAssociationCoordinates(association) {
        if (!association?.structureId) {
            return of(null);
        }
        const fromAssociation = this.coerceCoordinates(association.lat, association.lng);
        if (fromAssociation) {
            return of(fromAssociation);
        }
        const query = this.associationQuery(association);
        if (!query) {
            return of(null);
        }
        const cacheKey = query.toLowerCase();
        if (this.geocodeCache.has(cacheKey)) {
            return of(this.geocodeCache.get(cacheKey) || null);
        }
        const params = new HttpParams().set('format', 'jsonv2').set('limit', '1').set('q', query);
        return this.http.get('https://nominatim.openstreetmap.org/search', { params }).pipe(map((rows) => {
            const first = Array.isArray(rows) ? rows[0] : null;
            if (!first) {
                return null;
            }
            return this.coerceCoordinates(first.lat, first.lon);
        }), tap((coordinates) => {
            this.geocodeCache.set(cacheKey, coordinates);
        }), catchError(() => {
            this.geocodeCache.set(cacheKey, null);
            return of(null);
        }));
    }
    buildExternalDirectionsUrl(association, coordinates) {
        if (!association?.structureId) {
            return null;
        }
        const destination = coordinates
            ? `${coordinates.lat},${coordinates.lng}`
            : this.associationQuery(association) || association.structureName || association.structureAddress;
        if (!destination) {
            return null;
        }
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=walking`;
    }
    associationQuery(association) {
        const parts = [association.structureName, association.structureAddress].map((value) => String(value || '').trim()).filter(Boolean);
        return parts.join(', ');
    }
    coerceCoordinates(latRaw, lngRaw) {
        const lat = Number(latRaw);
        const lng = Number(lngRaw);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return null;
        }
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return null;
        }
        return { lat, lng };
    }
    static { this.ɵfac = function StructureLocationService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StructureLocationService)(i0.ɵɵinject(i1.HttpClient)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: StructureLocationService, factory: StructureLocationService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StructureLocationService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }], null); })();
