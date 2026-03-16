import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/foot/';
const FALLBACK_WALKING_METERS_PER_SEC = 1.25;
export class NavigationService {
    constructor(http) {
        this.http = http;
    }
    getWalkingRoute(from, to) {
        return this.fetchOsrmRoute(from, to).pipe(catchError(() => of(this.buildFallbackRoute(from, to))));
    }
    fetchOsrmRoute(from, to) {
        const fromParam = `${from.lng},${from.lat}`;
        const toParam = `${to.lng},${to.lat}`;
        const url = `${OSRM_BASE_URL}${fromParam};${toParam}?overview=full&geometries=geojson&steps=true`;
        return this.http.get(url).pipe(map((response) => {
            const route = response.routes?.[0];
            if (!route || response.code !== 'Ok') {
                throw new Error('No route');
            }
            const points = (route.geometry?.coordinates || [])
                .map((coord) => this.toCoordinates(coord))
                .filter((coord) => Boolean(coord));
            if (!points.length) {
                throw new Error('No geometry');
            }
            const steps = this.mapSteps(route, points);
            return {
                provider: 'osrm',
                distanceMeters: route.distance || 0,
                durationSec: route.duration || 0,
                points,
                steps
            };
        }));
    }
    mapSteps(route, points) {
        const sourceSteps = (route.legs || []).flatMap((leg) => leg.steps || []);
        const mapped = sourceSteps
            .map((step, index) => this.mapSingleStep(step, index, sourceSteps.length))
            .filter((step) => Boolean(step));
        if (!mapped.length) {
            return [
                {
                    instruction: 'Raggiungi la destinazione',
                    distanceMeters: route.distance || 0,
                    durationSec: route.duration || 0,
                    location: points[0] || points[points.length - 1]
                }
            ];
        }
        return mapped;
    }
    mapSingleStep(step, index, totalSteps) {
        const location = this.toCoordinates(step.maneuver?.location);
        if (!location) {
            return null;
        }
        const instruction = this.buildInstruction(step, index, totalSteps);
        return {
            instruction,
            distanceMeters: step.distance || 0,
            durationSec: step.duration || 0,
            location
        };
    }
    buildInstruction(step, index, totalSteps) {
        const maneuverType = step.maneuver?.type || '';
        const modifier = this.toItalianModifier(step.maneuver?.modifier);
        const roadName = this.cleanRoadName(step.name);
        if (maneuverType === 'arrive' || index === totalSteps - 1) {
            return 'Arriva alla destinazione';
        }
        if (maneuverType === 'depart') {
            return roadName ? `Parti e prosegui su ${roadName}` : 'Parti e prosegui dritto';
        }
        if (maneuverType === 'roundabout' || maneuverType === 'rotary') {
            const exit = step.maneuver?.exit;
            if (exit) {
                return `Alla rotonda prendi la ${exit}a uscita${roadName ? ` verso ${roadName}` : ''}`;
            }
            return roadName ? `Alla rotonda prosegui verso ${roadName}` : 'Alla rotonda prosegui';
        }
        if (maneuverType === 'turn' || maneuverType === 'fork' || maneuverType === 'merge') {
            return roadName
                ? `Svolta ${modifier} su ${roadName}`
                : `Svolta ${modifier}`;
        }
        if (maneuverType === 'continue' || maneuverType === 'new name') {
            return roadName ? `Continua su ${roadName}` : 'Continua dritto';
        }
        if (maneuverType === 'uturn') {
            return 'Effettua inversione a U';
        }
        if (maneuverType === 'end of road') {
            return roadName ? `Alla fine della strada, svolta ${modifier} su ${roadName}` : `Alla fine della strada, svolta ${modifier}`;
        }
        return roadName ? `Prosegui su ${roadName}` : 'Prosegui verso la destinazione';
    }
    toItalianModifier(modifier) {
        switch ((modifier || '').toLowerCase()) {
            case 'left':
                return 'a sinistra';
            case 'right':
                return 'a destra';
            case 'slight left':
                return 'leggermente a sinistra';
            case 'slight right':
                return 'leggermente a destra';
            case 'sharp left':
                return 'decisamente a sinistra';
            case 'sharp right':
                return 'decisamente a destra';
            case 'uturn':
                return 'indietro';
            case 'straight':
            default:
                return 'dritto';
        }
    }
    cleanRoadName(name) {
        const trimmed = String(name || '').trim();
        return trimmed || '';
    }
    buildFallbackRoute(from, to) {
        const distanceMeters = this.distanceInMeters(from, to);
        const durationSec = Math.max(30, Math.round(distanceMeters / FALLBACK_WALKING_METERS_PER_SEC));
        return {
            provider: 'fallback',
            distanceMeters,
            durationSec,
            points: [from, to],
            steps: [
                {
                    instruction: 'Prosegui verso la destinazione',
                    distanceMeters,
                    durationSec,
                    location: from
                },
                {
                    instruction: 'Arriva alla destinazione',
                    distanceMeters: 0,
                    durationSec: 0,
                    location: to
                }
            ]
        };
    }
    toCoordinates(coord) {
        if (!coord || coord.length < 2) {
            return null;
        }
        const lng = Number(coord[0]);
        const lat = Number(coord[1]);
        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return null;
        }
        return { lat, lng };
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
    static { this.ɵfac = function NavigationService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NavigationService)(i0.ɵɵinject(i1.HttpClient)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: NavigationService, factory: NavigationService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NavigationService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }], null); })();
