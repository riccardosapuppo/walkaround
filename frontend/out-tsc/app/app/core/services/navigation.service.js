import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./i18n.service";
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/foot/';
const FALLBACK_WALKING_METERS_PER_SEC = 1.25;
export class NavigationService {
    constructor(http, i18n) {
        this.http = http;
        this.i18n = i18n;
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
                    instruction: this.i18n.t('navigation.arrive'),
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
            return this.i18n.t('navigation.arrive');
        }
        if (maneuverType === 'depart') {
            return roadName
                ? this.i18n.t('navigation.departNamed', { road: roadName })
                : this.i18n.t('navigation.departStraight');
        }
        if (maneuverType === 'roundabout' || maneuverType === 'rotary') {
            const exit = step.maneuver?.exit;
            if (exit) {
                return roadName
                    ? this.i18n.t('navigation.roundaboutExitNamed', { exit, road: roadName })
                    : this.i18n.t('navigation.roundaboutExit', { exit });
            }
            return roadName
                ? this.i18n.t('navigation.roundaboutNamed', { road: roadName })
                : this.i18n.t('navigation.roundaboutContinue');
        }
        if (maneuverType === 'turn' || maneuverType === 'fork' || maneuverType === 'merge') {
            return roadName
                ? this.i18n.t('navigation.turnNamed', { modifier, road: roadName })
                : this.i18n.t('navigation.turn', { modifier });
        }
        if (maneuverType === 'continue' || maneuverType === 'new name') {
            return roadName
                ? this.i18n.t('navigation.continueNamed', { road: roadName })
                : this.i18n.t('navigation.continueStraight');
        }
        if (maneuverType === 'uturn') {
            return this.i18n.t('navigation.uturn');
        }
        if (maneuverType === 'end of road') {
            return roadName
                ? this.i18n.t('navigation.endOfRoadNamed', { modifier, road: roadName })
                : this.i18n.t('navigation.endOfRoad', { modifier });
        }
        return roadName
            ? this.i18n.t('navigation.proceedNamed', { road: roadName })
            : this.i18n.t('navigation.proceedDestination');
    }
    toItalianModifier(modifier) {
        switch ((modifier || '').toLowerCase()) {
            case 'left':
                return this.i18n.t('navigation.modifier.left');
            case 'right':
                return this.i18n.t('navigation.modifier.right');
            case 'slight left':
                return this.i18n.t('navigation.modifier.slightLeft');
            case 'slight right':
                return this.i18n.t('navigation.modifier.slightRight');
            case 'sharp left':
                return this.i18n.t('navigation.modifier.sharpLeft');
            case 'sharp right':
                return this.i18n.t('navigation.modifier.sharpRight');
            case 'uturn':
                return this.i18n.t('navigation.modifier.uturn');
            case 'straight':
            default:
                return this.i18n.t('navigation.modifier.straight');
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
                    instruction: this.i18n.t('navigation.proceedDestination'),
                    distanceMeters,
                    durationSec,
                    location: from
                },
                {
                    instruction: this.i18n.t('navigation.arrive'),
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
    static { this.ɵfac = function NavigationService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NavigationService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.I18nService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: NavigationService, factory: NavigationService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NavigationService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }, { type: i2.I18nService }], null); })();
