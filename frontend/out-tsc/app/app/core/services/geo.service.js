import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class GeoService {
    constructor() {
        this.permissionSubject = new BehaviorSubject('prompt');
        this.coordinatesSubject = new BehaviorSubject(null);
        this.watchId = null;
        this.permission$ = this.permissionSubject.asObservable();
        this.coordinates$ = this.coordinatesSubject.asObservable();
    }
    get currentCoordinates() {
        return this.coordinatesSubject.value;
    }
    async requestPermissionAndTrack() {
        if (!('geolocation' in navigator)) {
            this.permissionSubject.next('unsupported');
            return;
        }
        if ('permissions' in navigator && navigator.permissions?.query) {
            try {
                const result = await navigator.permissions.query({ name: 'geolocation' });
                this.permissionSubject.next(result.state);
                result.onchange = () => this.permissionSubject.next(result.state);
            }
            catch {
                this.permissionSubject.next('prompt');
            }
        }
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
        }
        this.watchId = navigator.geolocation.watchPosition((position) => {
            this.permissionSubject.next('granted');
            this.coordinatesSubject.next({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        }, () => {
            this.permissionSubject.next('denied');
        }, {
            enableHighAccuracy: true,
            maximumAge: 10_000,
            timeout: 8_000
        });
    }
    stopTracking() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }
    distanceInMeters(from, to) {
        const toRad = (value) => (value * Math.PI) / 180;
        const earthRadius = 6371e3;
        const deltaLat = toRad(to.lat - from.lat);
        const deltaLng = toRad(to.lng - from.lng);
        const lat1 = toRad(from.lat);
        const lat2 = toRad(to.lat);
        const haversine = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
        return earthRadius * c;
    }
    static { this.ɵfac = function GeoService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || GeoService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: GeoService, factory: GeoService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(GeoService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
