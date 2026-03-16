import { Component } from '@angular/core';
import { catchError, combineLatest, map, of, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { circleMarker, divIcon, latLng, latLngBounds, marker, polyline, tileLayer } from 'leaflet';
import { environment } from '../../../environments/environment';
import { PoiMapSheetComponent } from '../../shared/components/poi-map-sheet/poi-map-sheet.component';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/app-state.service";
import * as i2 from "../../core/services/geo.service";
import * as i3 from "../../core/services/navigation.service";
import * as i4 from "../../core/services/poi.service";
import * as i5 from "../../core/services/purchase.service";
import * as i6 from "../../core/services/structure-location.service";
import * as i7 from "@angular/material/bottom-sheet";
import * as i8 from "@angular/material/snack-bar";
import * as i9 from "@angular/router";
import * as i10 from "@angular/common";
import * as i11 from "@angular/material/button";
import * as i12 from "@angular/material/card";
import * as i13 from "@angular/material/icon";
import * as i14 from "@angular/material/progress-bar";
import * as i15 from "@angular/material/progress-spinner";
import * as i16 from "@bluehalo/ngx-leaflet";
function MapComponent_p_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", ctx_r0.poiCount, " punti di interesse disponibili intorno a te");
} }
function MapComponent_p_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" Navigazione attiva verso ", ctx_r0.navigationTarget.name, " ");
} }
function MapComponent_mat_card_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 11)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.apiErrorMessage);
} }
function MapComponent_mat_card_7_span_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 20);
    i0.ɵɵtext(1, "Posizione...");
    i0.ɵɵelementEnd();
} }
function MapComponent_mat_card_7_button_12_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 21);
    i0.ɵɵlistener("click", function MapComponent_mat_card_7_button_12_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.focusAssociatedStructure()); });
    i0.ɵɵtext(1, " Mostra punto ");
    i0.ɵɵelementEnd();
} }
function MapComponent_mat_card_7_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 12)(1, "div", 13)(2, "p", 14);
    i0.ɵɵtext(3, "Struttura associata");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, MapComponent_mat_card_7_span_4_Template, 2, 0, "span", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h3");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 16);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 17)(10, "button", 18);
    i0.ɵɵlistener("click", function MapComponent_mat_card_7_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.navigateToAssociatedStructure()); });
    i0.ɵɵtext(11, "Naviga");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(12, MapComponent_mat_card_7_button_12_Template, 2, 0, "button", 19);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const structure_r4 = ctx.ngIf;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r0.resolvingAssociatedStructure);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(structure_r4.structureName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(structure_r4.structureAddress);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r0.associatedStructureCoords);
} }
function MapComponent_section_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 22);
    i0.ɵɵelement(1, "mat-progress-spinner", 23);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Caricamento mappa...");
    i0.ɵɵelementEnd()();
} }
function MapComponent_div_9_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 24);
    i0.ɵɵlistener("leafletMapReady", function MapComponent_div_9_Template_div_leafletMapReady_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onMapReady($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("leafletOptions", ctx_r0.mapOptions)("leafletLayers", ctx_r0.markerLayers);
} }
function MapComponent_section_10_div_33_article_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article")(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const step_r7 = ctx.$implicit;
    const index_r8 = ctx.index;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", index_r8 + 1, ". ", step_r7.instruction, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(step_r7.distanceLabel);
} }
function MapComponent_section_10_div_33_button_2_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 39);
    i0.ɵɵlistener("click", function MapComponent_section_10_div_33_button_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r9); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.toggleNavigationSteps()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.showAllNavigationSteps ? "Mostra meno" : "Mostra tutti gli step", " ");
} }
function MapComponent_section_10_div_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 36);
    i0.ɵɵtemplate(1, MapComponent_section_10_div_33_article_1_Template, 5, 3, "article", 37)(2, MapComponent_section_10_div_33_button_2_Template, 2, 1, "button", 38);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r0.visibleNavigationSteps);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.canExpandNavigationSteps);
} }
function MapComponent_section_10_div_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 40);
    i0.ɵɵelement(1, "mat-progress-spinner", 41);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "Aggiornamento percorso in corso...");
    i0.ɵɵelementEnd()();
} }
function MapComponent_section_10_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 25)(1, "div", 26)(2, "div")(3, "p", 27);
    i0.ɵɵtext(4, "Navigatore in app");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h3");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 28);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "button", 29);
    i0.ɵɵlistener("click", function MapComponent_section_10_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r6); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.stopNavigation()); });
    i0.ɵɵelementStart(10, "mat-icon", 30);
    i0.ɵɵtext(11, "close");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "div", 31)(13, "article")(14, "span");
    i0.ɵɵtext(15, "Distanza");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "strong");
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "article")(19, "span");
    i0.ɵɵtext(20, "Tempo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "strong");
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "article")(24, "span");
    i0.ɵɵtext(25, "Arrivo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "strong");
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelement(28, "mat-progress-bar", 32);
    i0.ɵɵelementStart(29, "p", 33);
    i0.ɵɵtext(30, "Prossima manovra: ");
    i0.ɵɵelementStart(31, "strong");
    i0.ɵɵtext(32);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(33, MapComponent_section_10_div_33_Template, 3, 2, "div", 34)(34, MapComponent_section_10_div_34_Template, 4, 0, "div", 35);
    i0.ɵɵelementStart(35, "button", 21);
    i0.ɵɵlistener("click", function MapComponent_section_10_Template_button_click_35_listener() { i0.ɵɵrestoreView(_r6); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.focusNavigationRoute()); });
    i0.ɵɵtext(36, "Inquadra percorso");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const target_r10 = ctx.ngIf;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(target_r10.name);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fallback", ctx_r0.navigationProvider === "fallback");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.navigationProviderLabel);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate(ctx_r0.navigationDistanceLabel);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.navigationEtaLabel);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.navigationArrivalLabel);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.navigationProgress);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.navigationNextInstruction);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.navigationUpcomingSteps.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.isRouting);
} }
function MapComponent_button_11_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 42);
    i0.ɵɵlistener("click", function MapComponent_button_11_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r11); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.centerOnMe()); });
    i0.ɵɵelementStart(1, "mat-icon", 30);
    i0.ɵɵtext(2, "my_location");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("with-navigation", ctx_r0.hasActiveNavigation);
} }
const cityFallbackMap = {
    catania: { lat: 37.5079, lng: 15.083 },
    siracusa: { lat: 37.067, lng: 15.2866 },
    taormina: { lat: 37.8531, lng: 15.2899 },
    ragusa: { lat: 36.9269, lng: 14.7305 }
};
const cityNameMap = {
    catania: 'Catania',
    siracusa: 'Siracusa',
    taormina: 'Taormina',
    ragusa: 'Ragusa'
};
const ARRIVAL_THRESHOLD_METERS = 35;
const ROUTE_REFRESH_MIN_INTERVAL_MS = 12_000;
const ROUTE_RECALC_MIN_MOVEMENT_METERS = 18;
const MIN_NAV_DURATION_SEC = 30;
export class MapComponent {
    constructor(appState, geoService, navigationService, poiService, purchaseService, structureLocationService, bottomSheet, snackBar, router, route) {
        this.appState = appState;
        this.geoService = geoService;
        this.navigationService = navigationService;
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.structureLocationService = structureLocationService;
        this.bottomSheet = bottomSheet;
        this.snackBar = snackBar;
        this.router = router;
        this.route = route;
        this.cityUnlockPrice = 14.99;
        this.mapOptions = {
            layers: [
                tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; OpenStreetMap contributors'
                })
            ],
            zoom: 14,
            center: latLng(37.5079, 15.083)
        };
        this.markerLayers = [];
        this.poiCount = 0;
        this.isLoading = true;
        this.apiErrorMessage = null;
        this.navigationDistanceLabel = '--';
        this.navigationEtaLabel = '--';
        this.navigationArrivalLabel = '--';
        this.navigationProgress = 0;
        this.navigationNextInstruction = 'Calcolo percorso...';
        this.navigationUpcomingSteps = [];
        this.showAllNavigationSteps = false;
        this.navigationProviderLabel = 'Ricerca percorso pedonale...';
        this.navigationProvider = null;
        this.isRouting = false;
        this.activeCityId = 'catania';
        this.associatedStructure = null;
        this.associatedStructureCoords = null;
        this.resolvingAssociatedStructure = false;
        this.latestPreparedPois = [];
        this.pendingNavigationPoiId = null;
        this.routeRemainingMetersByPoint = [];
        this.routeStepPointIndexes = [];
        this.hasShownArrivalSnack = false;
        this.hasShownFallbackSnack = false;
        this.lastRouteRequestedAt = 0;
        this.routeRequestToken = 0;
        this.destroy$ = new Subject();
    }
    get hasActiveNavigation() {
        return Boolean(this.navigationTarget);
    }
    get visibleNavigationSteps() {
        if (this.showAllNavigationSteps) {
            return this.navigationUpcomingSteps;
        }
        return this.navigationUpcomingSteps.slice(0, 3);
    }
    get canExpandNavigationSteps() {
        return this.navigationUpcomingSteps.length > 3;
    }
    get visibleAssociatedStructure() {
        const association = this.associatedStructure;
        if (!association?.structureId) {
            return null;
        }
        const cityIds = this.associationCityIds(association);
        if (cityIds.length && !cityIds.includes(this.activeCityId)) {
            return null;
        }
        return association;
    }
    ngOnInit() {
        this.purchaseService.refresh();
        void this.geoService.requestPermissionAndTrack();
        this.appState.hotelAssociation$
            .pipe(takeUntil(this.destroy$), switchMap((association) => {
            this.associatedStructure = association;
            this.associatedStructureCoords = null;
            this.resolvingAssociatedStructure = Boolean(association?.structureId);
            if (!association?.structureId) {
                return of(null);
            }
            return this.structureLocationService.resolveAssociationCoordinates(association);
        }))
            .subscribe((coordinates) => {
            this.associatedStructureCoords = coordinates;
            this.resolvingAssociatedStructure = false;
            this.markerLayers = this.composeMapLayers(this.latestPreparedPois);
        });
        this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((queryParams) => {
            const shouldNavigate = queryParams.get('nav') === '1';
            const poiId = String(queryParams.get('poiId') || '').trim();
            if (!shouldNavigate || !poiId) {
                return;
            }
            this.pendingNavigationPoiId = poiId;
        });
        combineLatest([
            this.appState.activeCityId$.pipe(tap(() => {
                this.isLoading = true;
            }), switchMap((cityId) => this.poiService.getPoisByCity(cityId).pipe(tap(() => {
                this.apiErrorMessage = null;
            }), map((pois) => ({ cityId, pois })), catchError(() => {
                this.apiErrorMessage = 'Errore caricamento mappa. Controlla backend e proxy API.';
                return of({ cityId, pois: [] });
            })))),
            this.geoService.coordinates$.pipe(startWith(null)),
            this.purchaseService.purchases$.pipe(startWith({ items: [], unlockedPoiIds: [], unlockedCityIds: [] }))
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([cityData, coordinates]) => {
            this.activeCityId = cityData.cityId;
            const fallback = cityFallbackMap[cityData.cityId] || cityFallbackMap['catania'];
            this.currentCoordinates = coordinates || fallback;
            const prepared = cityData.pois.map((poi) => {
                const distanceMeters = this.geoService.distanceInMeters(this.currentCoordinates, {
                    lat: poi.lat,
                    lng: poi.lng
                });
                const unlocked = this.purchaseService.isPoiUnlocked(poi.id, poi.cityId);
                return {
                    ...poi,
                    distanceMeters,
                    distanceLabel: this.formatDistance(distanceMeters),
                    unlocked,
                    near: distanceMeters <= environment.geofenceRadiusMeters
                };
            });
            this.latestPreparedPois = prepared;
            this.poiCount = prepared.length;
            this.updateNavigationState();
            if (this.hasActiveNavigation) {
                this.maybeRequestNavigationRoute(false);
            }
            this.markerLayers = this.composeMapLayers(prepared);
            this.tryStartPendingNavigation();
            this.isLoading = false;
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    onMapReady(map) {
        this.mapRef = map;
        if (this.hasActiveNavigation) {
            this.focusNavigationRoute();
            return;
        }
        this.centerOnMe();
    }
    centerOnMe() {
        if (!this.mapRef || !this.currentCoordinates) {
            return;
        }
        this.mapRef.flyTo([this.currentCoordinates.lat, this.currentCoordinates.lng], 15, {
            duration: 0.8
        });
    }
    focusNavigationRoute() {
        if (!this.mapRef || !this.currentCoordinates || !this.navigationTarget) {
            this.centerOnMe();
            return;
        }
        const routePoints = this.activeRoute?.points?.length
            ? this.activeRoute.points
            : [this.currentCoordinates, { lat: this.navigationTarget.lat, lng: this.navigationTarget.lng }];
        const bounds = latLngBounds(routePoints.map((point) => [point.lat, point.lng])).pad(0.18);
        this.mapRef.fitBounds(bounds, { animate: true, duration: 0.8 });
    }
    focusAssociatedStructure() {
        if (!this.mapRef || !this.associatedStructureCoords) {
            return;
        }
        this.mapRef.flyTo([this.associatedStructureCoords.lat, this.associatedStructureCoords.lng], 16, {
            duration: 0.8
        });
    }
    navigateToAssociatedStructure() {
        const association = this.visibleAssociatedStructure;
        if (!association) {
            return;
        }
        const url = this.structureLocationService.buildExternalDirectionsUrl(association, this.associatedStructureCoords);
        if (!url) {
            this.snackBar.open('Dati struttura non sufficienti per la navigazione', 'Chiudi', { duration: 2400 });
            return;
        }
        window.open(url, '_blank', 'noopener');
    }
    stopNavigation() {
        this.routeRequestToken += 1;
        this.clearNavigationState();
        this.markerLayers = this.composeMapLayers(this.latestPreparedPois);
    }
    toggleNavigationSteps() {
        this.showAllNavigationSteps = !this.showAllNavigationSteps;
    }
    createPoiMarker(poi) {
        const markerStatusClass = this.navigationTarget?.id === poi.id ? 'poi-nav-target' : poi.near ? 'poi-near' : poi.unlocked ? 'poi-unlocked' : 'poi-locked';
        const poiMarker = marker([poi.lat, poi.lng], {
            icon: divIcon({
                className: '',
                html: `<div class="poi-marker ${markerStatusClass}"></div>`,
                iconSize: [22, 22],
                iconAnchor: [11, 11]
            })
        });
        poiMarker.on('click', (event) => {
            event.originalEvent.preventDefault();
            const sheet = this.bottomSheet.open(PoiMapSheetComponent, {
                data: {
                    poi,
                    distanceLabel: poi.distanceLabel,
                    unlocked: poi.unlocked,
                    isNavigating: this.navigationTarget?.id === poi.id
                }
            });
            sheet.afterDismissed().subscribe((result) => {
                if (!result) {
                    return;
                }
                if (result.action === 'open-detail') {
                    void this.router.navigate(['/poi', result.poiId]);
                    return;
                }
                if (result.action === 'navigate') {
                    this.deferNavigationStart(poi);
                    return;
                }
                if (result.action === 'play') {
                    void this.router.navigate(['/player', result.poiId], {
                        queryParams: { preview: result.preview }
                    });
                    return;
                }
                if (result.action === 'purchase-poi') {
                    this.purchaseService.purchasePoiSingle(result.poiId, poi.cityId, poi.name, poi.priceSingle).subscribe({
                        next: (dialogResult) => {
                            if (dialogResult?.action === 'paid') {
                                this.snackBar.open(`Luogo sbloccato: ${poi.name}`, 'OK', { duration: 2400 });
                            }
                        },
                        error: () => {
                            this.snackBar.open('Operazione non riuscita', 'Chiudi', { duration: 2400 });
                        }
                    });
                    return;
                }
                this.purchaseService.purchaseCityBundle(result.cityId, this.cityName(result.cityId), this.cityUnlockPrice).subscribe({
                    next: (dialogResult) => {
                        if (dialogResult?.action === 'paid') {
                            this.snackBar.open(`Citta sbloccata: ${this.cityName(result.cityId)}`, 'OK', { duration: 2400 });
                        }
                    },
                    error: () => {
                        this.snackBar.open('Operazione non riuscita', 'Chiudi', { duration: 2400 });
                    }
                });
            });
        });
        return poiMarker;
    }
    composeMapLayers(pois) {
        const navigationLayers = [];
        if (this.navigationTarget && this.currentCoordinates) {
            const to = { lat: this.navigationTarget.lat, lng: this.navigationTarget.lng };
            const routePoints = this.activeRoute?.points?.length ? this.activeRoute.points : [this.currentCoordinates, to];
            const fallbackStyle = this.navigationProvider === 'fallback' || routePoints.length <= 2;
            navigationLayers.push(polyline(routePoints.map((point) => [point.lat, point.lng]), {
                color: '#1769aa',
                weight: 6,
                opacity: 0.92,
                dashArray: fallbackStyle ? '10 10' : undefined,
                lineCap: 'round',
                lineJoin: 'round'
            }), circleMarker([this.currentCoordinates.lat, this.currentCoordinates.lng], {
                radius: 9,
                color: '#ffffff',
                weight: 3,
                fillColor: '#1769aa',
                fillOpacity: 1
            }), circleMarker([to.lat, to.lng], {
                radius: 17,
                color: '#1769aa',
                weight: 2,
                fillColor: '#1769aa',
                fillOpacity: 0.14
            }));
        }
        const structureMarker = this.createStructureMarker();
        if (structureMarker) {
            navigationLayers.push(structureMarker);
        }
        const poiLayers = pois.map((poi) => this.createPoiMarker(poi));
        return [...navigationLayers, ...poiLayers];
    }
    createStructureMarker() {
        const association = this.visibleAssociatedStructure;
        if (!association || !this.associatedStructureCoords) {
            return null;
        }
        const structureMarker = marker([this.associatedStructureCoords.lat, this.associatedStructureCoords.lng], {
            icon: divIcon({
                className: '',
                html: '<div class="poi-marker structure-marker"></div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            })
        });
        structureMarker.on('click', () => {
            this.navigateToAssociatedStructure();
        });
        return structureMarker;
    }
    startNavigation(poi) {
        this.pendingNavigationPoiId = null;
        this.navigationTarget = poi;
        this.activeRoute = undefined;
        this.routeRemainingMetersByPoint = [];
        this.routeStepPointIndexes = [];
        this.navigationProvider = null;
        this.navigationProviderLabel = 'Ricerca percorso pedonale...';
        this.navigationNextInstruction = 'Calcolo percorso...';
        this.navigationUpcomingSteps = [];
        this.showAllNavigationSteps = false;
        this.navigationProgress = 0;
        this.hasShownArrivalSnack = false;
        this.hasShownFallbackSnack = false;
        this.lastRouteOrigin = undefined;
        this.lastRouteRequestedAt = 0;
        this.updateNavigationState();
        this.maybeRequestNavigationRoute(true);
        this.markerLayers = this.composeMapLayers(this.latestPreparedPois);
        this.focusNavigationRoute();
    }
    maybeRequestNavigationRoute(force) {
        if (!this.navigationTarget || !this.currentCoordinates) {
            return;
        }
        if (!force) {
            if (this.isRouting) {
                return;
            }
            const now = Date.now();
            if (now - this.lastRouteRequestedAt < ROUTE_REFRESH_MIN_INTERVAL_MS) {
                return;
            }
            if (this.lastRouteOrigin &&
                this.geoService.distanceInMeters(this.lastRouteOrigin, this.currentCoordinates) < ROUTE_RECALC_MIN_MOVEMENT_METERS) {
                return;
            }
        }
        const from = { lat: this.currentCoordinates.lat, lng: this.currentCoordinates.lng };
        const to = { lat: this.navigationTarget.lat, lng: this.navigationTarget.lng };
        const activePoiId = this.navigationTarget.id;
        const requestToken = ++this.routeRequestToken;
        this.isRouting = true;
        this.lastRouteRequestedAt = Date.now();
        this.lastRouteOrigin = from;
        this.navigationService
            .getWalkingRoute(from, to)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
            next: (route) => {
                if (requestToken !== this.routeRequestToken || this.navigationTarget?.id !== activePoiId) {
                    return;
                }
                this.isRouting = false;
                this.applyNavigationRoute(route);
                this.updateNavigationState();
                this.markerLayers = this.composeMapLayers(this.latestPreparedPois);
                if (route.provider === 'fallback' && !this.hasShownFallbackSnack) {
                    this.hasShownFallbackSnack = true;
                    this.snackBar.open('Routing stradale non disponibile: modalita semplificata attiva', 'OK', { duration: 2800 });
                }
            },
            error: () => {
                if (requestToken !== this.routeRequestToken) {
                    return;
                }
                this.isRouting = false;
            }
        });
    }
    applyNavigationRoute(route) {
        this.activeRoute = route;
        this.navigationProvider = route.provider;
        this.navigationProviderLabel =
            route.provider === 'osrm' ? 'Percorso pedonale su strade reali' : 'Modalita semplificata (linea diretta)';
        this.routeRemainingMetersByPoint = this.buildRemainingDistanceByPoint(route.points);
        this.routeStepPointIndexes = this.buildRouteStepIndexes(route.steps, route.points);
    }
    updateNavigationState() {
        if (!this.navigationTarget) {
            return;
        }
        const refreshedTarget = this.latestPreparedPois.find((poi) => poi.id === this.navigationTarget?.id);
        if (!refreshedTarget) {
            this.clearNavigationState();
            return;
        }
        this.navigationTarget = refreshedTarget;
        if (!this.currentCoordinates) {
            this.navigationDistanceLabel = refreshedTarget.distanceLabel;
            this.navigationEtaLabel = '--';
            this.navigationArrivalLabel = '--';
            this.navigationProgress = 0;
            return;
        }
        let remainingMeters = this.geoService.distanceInMeters(this.currentCoordinates, {
            lat: refreshedTarget.lat,
            lng: refreshedTarget.lng
        });
        let remainingDurationSec = Math.max(MIN_NAV_DURATION_SEC, Math.round(remainingMeters / 1.25));
        if (this.activeRoute &&
            this.activeRoute.points.length > 0 &&
            this.routeRemainingMetersByPoint.length === this.activeRoute.points.length) {
            const nearestPointIndex = this.findNearestPointIndex(this.currentCoordinates, this.activeRoute.points);
            const nearestPoint = this.activeRoute.points[nearestPointIndex];
            remainingMeters =
                this.routeRemainingMetersByPoint[nearestPointIndex] + this.geoService.distanceInMeters(this.currentCoordinates, nearestPoint);
            if (this.activeRoute.distanceMeters > 0 && this.activeRoute.durationSec > 0) {
                const ratio = Math.max(0, Math.min(1, remainingMeters / this.activeRoute.distanceMeters));
                remainingDurationSec = Math.max(MIN_NAV_DURATION_SEC, Math.round(this.activeRoute.durationSec * ratio));
            }
            const nextStep = this.findNextStep(nearestPointIndex);
            this.navigationNextInstruction = nextStep?.instruction || 'Prosegui fino alla destinazione';
            this.navigationUpcomingSteps = this.buildUpcomingStepViews(nearestPointIndex);
        }
        else {
            this.navigationNextInstruction = 'Muoviti verso la destinazione';
            this.navigationUpcomingSteps = [];
        }
        this.navigationDistanceLabel = this.formatDistance(remainingMeters);
        this.navigationEtaLabel = this.formatDurationShort(remainingDurationSec);
        this.navigationArrivalLabel = new Date(Date.now() + remainingDurationSec * 1000).toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const totalDistance = Math.max(this.activeRoute?.distanceMeters || remainingMeters, 1);
        this.navigationProgress = Math.max(0, Math.min(100, ((totalDistance - remainingMeters) / totalDistance) * 100));
        if (!this.hasShownArrivalSnack && remainingMeters <= ARRIVAL_THRESHOLD_METERS) {
            this.hasShownArrivalSnack = true;
            this.snackBar.open(`Sei arrivato vicino a ${refreshedTarget.name}`, 'OK', { duration: 2400 });
        }
    }
    clearNavigationState() {
        this.navigationTarget = undefined;
        this.navigationDistanceLabel = '--';
        this.navigationEtaLabel = '--';
        this.navigationArrivalLabel = '--';
        this.navigationProgress = 0;
        this.navigationNextInstruction = 'Calcolo percorso...';
        this.navigationUpcomingSteps = [];
        this.showAllNavigationSteps = false;
        this.navigationProvider = null;
        this.navigationProviderLabel = 'Ricerca percorso pedonale...';
        this.isRouting = false;
        this.activeRoute = undefined;
        this.routeRemainingMetersByPoint = [];
        this.routeStepPointIndexes = [];
        this.hasShownArrivalSnack = false;
        this.hasShownFallbackSnack = false;
    }
    tryStartPendingNavigation() {
        if (!this.pendingNavigationPoiId) {
            return;
        }
        const target = this.latestPreparedPois.find((poi) => poi.id === this.pendingNavigationPoiId);
        if (!target) {
            return;
        }
        this.deferNavigationStart(target);
        this.pendingNavigationPoiId = null;
    }
    deferNavigationStart(poi) {
        window.setTimeout(() => {
            if (this.destroy$.closed) {
                return;
            }
            this.startNavigation(poi);
        }, 0);
    }
    buildRemainingDistanceByPoint(points) {
        if (!points.length) {
            return [];
        }
        const remaining = new Array(points.length).fill(0);
        for (let index = points.length - 2; index >= 0; index -= 1) {
            remaining[index] = remaining[index + 1] + this.geoService.distanceInMeters(points[index], points[index + 1]);
        }
        return remaining;
    }
    buildRouteStepIndexes(steps, points) {
        if (!steps.length || !points.length) {
            return [];
        }
        return steps.map((step) => this.findNearestPointIndex(step.location, points));
    }
    findNextStep(currentPointIndex) {
        if (!this.activeRoute || !this.activeRoute.steps.length || !this.routeStepPointIndexes.length) {
            return null;
        }
        const nextIndex = this.routeStepPointIndexes.findIndex((stepPointIndex) => stepPointIndex > currentPointIndex + 1);
        if (nextIndex === -1) {
            return null;
        }
        return this.activeRoute.steps[nextIndex] || null;
    }
    buildUpcomingStepViews(currentPointIndex) {
        if (!this.activeRoute || !this.activeRoute.steps.length || !this.routeStepPointIndexes.length) {
            return [];
        }
        const upcoming = [];
        for (let index = 0; index < this.routeStepPointIndexes.length; index += 1) {
            if (this.routeStepPointIndexes[index] <= currentPointIndex + 1) {
                continue;
            }
            const step = this.activeRoute.steps[index];
            if (!step || !step.instruction) {
                continue;
            }
            upcoming.push({
                instruction: step.instruction,
                distanceLabel: this.formatDistance(Math.max(step.distanceMeters, 0))
            });
        }
        return upcoming;
    }
    findNearestPointIndex(from, points) {
        if (!points.length) {
            return 0;
        }
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        points.forEach((point, index) => {
            const distance = this.geoService.distanceInMeters(from, point);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = index;
            }
        });
        return nearestIndex;
    }
    formatDurationShort(durationSec) {
        if (!Number.isFinite(durationSec) || durationSec <= 0) {
            return '--';
        }
        const totalMinutes = Math.max(1, Math.round(durationSec / 60));
        if (totalMinutes < 60) {
            return `${totalMinutes} min`;
        }
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    formatDistance(distanceMeters) {
        if (distanceMeters < 1000) {
            return `${Math.round(distanceMeters)} m`;
        }
        return `${(distanceMeters / 1000).toFixed(1)} km`;
    }
    cityName(cityId) {
        return cityNameMap[cityId] || cityId;
    }
    associationCityIds(association) {
        if (Array.isArray(association.cityIds) && association.cityIds.length) {
            return association.cityIds.map((cityId) => String(cityId || '').trim()).filter(Boolean);
        }
        const singleCityId = String(association.cityId || '').trim();
        return singleCityId ? [singleCityId] : [];
    }
    static { this.ɵfac = function MapComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MapComponent)(i0.ɵɵdirectiveInject(i1.AppStateService), i0.ɵɵdirectiveInject(i2.GeoService), i0.ɵɵdirectiveInject(i3.NavigationService), i0.ɵɵdirectiveInject(i4.PoiService), i0.ɵɵdirectiveInject(i5.PurchaseService), i0.ɵɵdirectiveInject(i6.StructureLocationService), i0.ɵɵdirectiveInject(i7.MatBottomSheet), i0.ɵɵdirectiveInject(i8.MatSnackBar), i0.ɵɵdirectiveInject(i9.Router), i0.ɵɵdirectiveInject(i9.ActivatedRoute)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MapComponent, selectors: [["app-map"]], standalone: false, decls: 12, vars: 8, consts: [[1, "map-page"], [1, "map-header"], [1, "page-title"], ["class", "page-subtitle", 4, "ngIf"], ["class", "card warning api-warning", 4, "ngIf"], ["class", "card structure-card", 4, "ngIf"], ["class", "loading-shell", 4, "ngIf"], ["class", "map-frame", "leaflet", "", 3, "leafletOptions", "leafletLayers", "leafletMapReady", 4, "ngIf"], ["class", "nav-hud card", 4, "ngIf"], ["mat-fab", "", "color", "primary", "class", "center-btn", "aria-label", "Centra su di me", 3, "with-navigation", "click", 4, "ngIf"], [1, "page-subtitle"], [1, "card", "warning", "api-warning"], [1, "card", "structure-card"], [1, "structure-card-head"], [1, "structure-kicker"], ["class", "structure-status", 4, "ngIf"], [1, "structure-address"], [1, "structure-actions"], ["mat-flat-button", "", "color", "primary", 3, "click"], ["mat-stroked-button", "", "color", "primary", 3, "click", 4, "ngIf"], [1, "structure-status"], ["mat-stroked-button", "", "color", "primary", 3, "click"], [1, "loading-shell"], ["mode", "indeterminate", "diameter", "48"], ["leaflet", "", 1, "map-frame", 3, "leafletMapReady", "leafletOptions", "leafletLayers"], [1, "nav-hud", "card"], [1, "nav-hud-head"], [1, "nav-kicker"], [1, "nav-provider"], ["mat-icon-button", "", "aria-label", "Chiudi navigazione", 3, "click"], ["fontSet", "material-icons-round"], [1, "nav-metrics"], ["mode", "determinate", 3, "value"], [1, "nav-direction"], ["class", "nav-steps", 4, "ngIf"], ["class", "nav-refresh", 4, "ngIf"], [1, "nav-steps"], [4, "ngFor", "ngForOf"], ["mat-button", "", "class", "nav-steps-toggle", 3, "click", 4, "ngIf"], ["mat-button", "", 1, "nav-steps-toggle", 3, "click"], [1, "nav-refresh"], ["mode", "indeterminate", "diameter", "16"], ["mat-fab", "", "color", "primary", "aria-label", "Centra su di me", 1, "center-btn", 3, "click"]], template: function MapComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "h1", 2);
            i0.ɵɵtext(3, "Mappa");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(4, MapComponent_p_4_Template, 2, 1, "p", 3)(5, MapComponent_p_5_Template, 2, 1, "p", 3);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(6, MapComponent_mat_card_6_Template, 3, 1, "mat-card", 4)(7, MapComponent_mat_card_7_Template, 13, 4, "mat-card", 5)(8, MapComponent_section_8_Template, 4, 0, "section", 6)(9, MapComponent_div_9_Template, 1, 2, "div", 7)(10, MapComponent_section_10_Template, 37, 11, "section", 8)(11, MapComponent_button_11_Template, 3, 2, "button", 9);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", !ctx.hasActiveNavigation);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.hasActiveNavigation && ctx.navigationTarget);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.apiErrorMessage);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.visibleAssociatedStructure);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.isLoading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.isLoading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.navigationTarget);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.isLoading);
        } }, dependencies: [i10.NgForOf, i10.NgIf, i11.MatButton, i11.MatIconButton, i11.MatFabButton, i12.MatCard, i13.MatIcon, i14.MatProgressBar, i15.MatProgressSpinner, i16.LeafletDirective, i16.LeafletLayersDirective], styles: [".map-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding: 16px 12px calc(112px + env(safe-area-inset-bottom));\n  display: grid;\n  gap: 12px;\n}\n\n.map-header[_ngcontent-%COMP%] {\n  padding: 0 4px;\n}\n\n.map-frame[_ngcontent-%COMP%] {\n  height: calc(100vh - 190px);\n  min-height: 460px;\n  border-radius: 22px;\n  overflow: hidden;\n  box-shadow: 0 10px 30px rgba(20, 38, 62, 0.12);\n}\n\n.loading-shell[_ngcontent-%COMP%] {\n  min-height: 300px;\n}\n\n.api-warning[_ngcontent-%COMP%] {\n  border: 1px solid #f0cf8e;\n  background: #fff7e8;\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #89652a;\n  }\n}\n\n.structure-card[_ngcontent-%COMP%] {\n  padding: 14px;\n  border: 1px solid #d9e5f5;\n  display: grid;\n  gap: 6px;\n\n  h3 {\n    margin: 0;\n    font-size: 1.02rem;\n    line-height: 1.25;\n    color: #142d4b;\n  }\n}\n\n.structure-card-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.structure-kicker[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: #5f7391;\n}\n\n.structure-status[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  color: #476a95;\n}\n\n.structure-address[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #5d7390;\n  font-size: 0.88rem;\n}\n\n.structure-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.center-btn[_ngcontent-%COMP%] {\n  position: fixed;\n  right: 22px;\n  bottom: calc(96px + env(safe-area-inset-bottom));\n  transition: bottom 0.22s ease;\n}\n\n.center-btn.with-navigation[_ngcontent-%COMP%] {\n  bottom: calc(360px + env(safe-area-inset-bottom));\n}\n\n.nav-hud[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 12px;\n  right: 12px;\n  bottom: calc(92px + env(safe-area-inset-bottom));\n  z-index: 450;\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n  border: 1px solid #d9e5f5;\n  box-shadow: 0 12px 30px rgba(20, 38, 62, 0.16);\n  max-height: min(52vh, 360px);\n  overflow-y: auto;\n}\n\n.nav-hud-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 10px;\n\n  h3 {\n    margin: 2px 0 0;\n    font-size: 1.03rem;\n    line-height: 1.25;\n  }\n}\n\n.nav-kicker[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: #5f7391;\n}\n\n.nav-provider[_ngcontent-%COMP%] {\n  margin: 6px 0 0;\n  font-size: 0.76rem;\n  color: #2a5f93;\n}\n\n.nav-provider.fallback[_ngcontent-%COMP%] {\n  color: #8b6400;\n}\n\n.nav-metrics[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 8px;\n\n  article {\n    border-radius: 12px;\n    background: #f3f7fc;\n    padding: 9px 10px;\n    display: grid;\n    gap: 4px;\n  }\n\n  span {\n    font-size: 0.74rem;\n    color: #627692;\n    text-transform: uppercase;\n    letter-spacing: 0.04em;\n  }\n\n  strong {\n    font-size: 0.95rem;\n    color: #122640;\n    font-weight: 700;\n  }\n}\n\n.nav-direction[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #465f7f;\n  font-size: 0.9rem;\n}\n\n.nav-steps[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 6px;\n\n  article {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 10px;\n    border-radius: 10px;\n    background: #f7fbff;\n    border: 1px solid #e0ebf7;\n    padding: 8px 10px;\n  }\n\n  span {\n    color: #314f72;\n    font-size: 0.84rem;\n    line-height: 1.3;\n  }\n\n  strong {\n    white-space: nowrap;\n    color: #0f2f52;\n    font-size: 0.82rem;\n  }\n}\n\n.nav-steps-toggle[_ngcontent-%COMP%] {\n  justify-self: start;\n  padding-left: 4px;\n  color: #1769aa;\n  font-weight: 600;\n}\n\n.nav-refresh[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  color: #456485;\n  font-size: 0.82rem;\n}\n\n@media (min-width: 900px) {\n  .center-btn.with-navigation[_ngcontent-%COMP%] {\n    bottom: calc(340px + env(safe-area-inset-bottom));\n  }\n\n  .nav-hud[_ngcontent-%COMP%] {\n    max-width: 736px;\n    left: 50%;\n    right: auto;\n    transform: translateX(-50%);\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MapComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-map', template: "<section class=\"map-page\">\n  <header class=\"map-header\">\n    <h1 class=\"page-title\">Mappa</h1>\n    <p class=\"page-subtitle\" *ngIf=\"!hasActiveNavigation\">{{ poiCount }} punti di interesse disponibili intorno a te</p>\n    <p class=\"page-subtitle\" *ngIf=\"hasActiveNavigation && navigationTarget\">\n      Navigazione attiva verso {{ navigationTarget.name }}\n    </p>\n  </header>\n\n  <mat-card class=\"card warning api-warning\" *ngIf=\"apiErrorMessage\">\n    <p>{{ apiErrorMessage }}</p>\n  </mat-card>\n\n  <mat-card class=\"card structure-card\" *ngIf=\"visibleAssociatedStructure as structure\">\n    <div class=\"structure-card-head\">\n      <p class=\"structure-kicker\">Struttura associata</p>\n      <span class=\"structure-status\" *ngIf=\"resolvingAssociatedStructure\">Posizione...</span>\n    </div>\n    <h3>{{ structure.structureName }}</h3>\n    <p class=\"structure-address\">{{ structure.structureAddress }}</p>\n    <div class=\"structure-actions\">\n      <button mat-flat-button color=\"primary\" (click)=\"navigateToAssociatedStructure()\">Naviga</button>\n      <button mat-stroked-button color=\"primary\" *ngIf=\"associatedStructureCoords\" (click)=\"focusAssociatedStructure()\">\n        Mostra punto\n      </button>\n    </div>\n  </mat-card>\n\n  <section class=\"loading-shell\" *ngIf=\"isLoading\">\n    <mat-progress-spinner mode=\"indeterminate\" diameter=\"48\"></mat-progress-spinner>\n    <p>Caricamento mappa...</p>\n  </section>\n\n  <div\n    class=\"map-frame\"\n    *ngIf=\"!isLoading\"\n    leaflet\n    [leafletOptions]=\"mapOptions\"\n    [leafletLayers]=\"markerLayers\"\n    (leafletMapReady)=\"onMapReady($event)\"\n  ></div>\n\n  <section class=\"nav-hud card\" *ngIf=\"navigationTarget as target\">\n    <div class=\"nav-hud-head\">\n      <div>\n        <p class=\"nav-kicker\">Navigatore in app</p>\n        <h3>{{ target.name }}</h3>\n        <p class=\"nav-provider\" [class.fallback]=\"navigationProvider === 'fallback'\">{{ navigationProviderLabel }}</p>\n      </div>\n\n      <button mat-icon-button (click)=\"stopNavigation()\" aria-label=\"Chiudi navigazione\">\n        <mat-icon fontSet=\"material-icons-round\">close</mat-icon>\n      </button>\n    </div>\n\n    <div class=\"nav-metrics\">\n      <article>\n        <span>Distanza</span>\n        <strong>{{ navigationDistanceLabel }}</strong>\n      </article>\n      <article>\n        <span>Tempo</span>\n        <strong>{{ navigationEtaLabel }}</strong>\n      </article>\n      <article>\n        <span>Arrivo</span>\n        <strong>{{ navigationArrivalLabel }}</strong>\n      </article>\n    </div>\n\n    <mat-progress-bar mode=\"determinate\" [value]=\"navigationProgress\"></mat-progress-bar>\n\n    <p class=\"nav-direction\">Prossima manovra: <strong>{{ navigationNextInstruction }}</strong></p>\n\n    <div class=\"nav-steps\" *ngIf=\"navigationUpcomingSteps.length\">\n      <article *ngFor=\"let step of visibleNavigationSteps; let index = index\">\n        <span>{{ index + 1 }}. {{ step.instruction }}</span>\n        <strong>{{ step.distanceLabel }}</strong>\n      </article>\n\n      <button mat-button class=\"nav-steps-toggle\" *ngIf=\"canExpandNavigationSteps\" (click)=\"toggleNavigationSteps()\">\n        {{ showAllNavigationSteps ? 'Mostra meno' : 'Mostra tutti gli step' }}\n      </button>\n    </div>\n\n    <div class=\"nav-refresh\" *ngIf=\"isRouting\">\n      <mat-progress-spinner mode=\"indeterminate\" diameter=\"16\"></mat-progress-spinner>\n      <span>Aggiornamento percorso in corso...</span>\n    </div>\n\n    <button mat-stroked-button color=\"primary\" (click)=\"focusNavigationRoute()\">Inquadra percorso</button>\n  </section>\n\n  <button\n    mat-fab\n    color=\"primary\"\n    class=\"center-btn\"\n    [class.with-navigation]=\"hasActiveNavigation\"\n    *ngIf=\"!isLoading\"\n    (click)=\"centerOnMe()\"\n    aria-label=\"Centra su di me\"\n  >\n    <mat-icon fontSet=\"material-icons-round\">my_location</mat-icon>\n  </button>\n</section>\n", styles: [".map-page {\n  min-height: 100vh;\n  padding: 16px 12px calc(112px + env(safe-area-inset-bottom));\n  display: grid;\n  gap: 12px;\n}\n\n.map-header {\n  padding: 0 4px;\n}\n\n.map-frame {\n  height: calc(100vh - 190px);\n  min-height: 460px;\n  border-radius: 22px;\n  overflow: hidden;\n  box-shadow: 0 10px 30px rgba(20, 38, 62, 0.12);\n}\n\n.loading-shell {\n  min-height: 300px;\n}\n\n.api-warning {\n  border: 1px solid #f0cf8e;\n  background: #fff7e8;\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #89652a;\n  }\n}\n\n.structure-card {\n  padding: 14px;\n  border: 1px solid #d9e5f5;\n  display: grid;\n  gap: 6px;\n\n  h3 {\n    margin: 0;\n    font-size: 1.02rem;\n    line-height: 1.25;\n    color: #142d4b;\n  }\n}\n\n.structure-card-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.structure-kicker {\n  margin: 0;\n  font-size: 0.74rem;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: #5f7391;\n}\n\n.structure-status {\n  font-size: 0.76rem;\n  color: #476a95;\n}\n\n.structure-address {\n  margin: 0;\n  color: #5d7390;\n  font-size: 0.88rem;\n}\n\n.structure-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.center-btn {\n  position: fixed;\n  right: 22px;\n  bottom: calc(96px + env(safe-area-inset-bottom));\n  transition: bottom 0.22s ease;\n}\n\n.center-btn.with-navigation {\n  bottom: calc(360px + env(safe-area-inset-bottom));\n}\n\n.nav-hud {\n  position: fixed;\n  left: 12px;\n  right: 12px;\n  bottom: calc(92px + env(safe-area-inset-bottom));\n  z-index: 450;\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n  border: 1px solid #d9e5f5;\n  box-shadow: 0 12px 30px rgba(20, 38, 62, 0.16);\n  max-height: min(52vh, 360px);\n  overflow-y: auto;\n}\n\n.nav-hud-head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 10px;\n\n  h3 {\n    margin: 2px 0 0;\n    font-size: 1.03rem;\n    line-height: 1.25;\n  }\n}\n\n.nav-kicker {\n  margin: 0;\n  font-size: 0.74rem;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: #5f7391;\n}\n\n.nav-provider {\n  margin: 6px 0 0;\n  font-size: 0.76rem;\n  color: #2a5f93;\n}\n\n.nav-provider.fallback {\n  color: #8b6400;\n}\n\n.nav-metrics {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 8px;\n\n  article {\n    border-radius: 12px;\n    background: #f3f7fc;\n    padding: 9px 10px;\n    display: grid;\n    gap: 4px;\n  }\n\n  span {\n    font-size: 0.74rem;\n    color: #627692;\n    text-transform: uppercase;\n    letter-spacing: 0.04em;\n  }\n\n  strong {\n    font-size: 0.95rem;\n    color: #122640;\n    font-weight: 700;\n  }\n}\n\n.nav-direction {\n  margin: 0;\n  color: #465f7f;\n  font-size: 0.9rem;\n}\n\n.nav-steps {\n  display: grid;\n  gap: 6px;\n\n  article {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 10px;\n    border-radius: 10px;\n    background: #f7fbff;\n    border: 1px solid #e0ebf7;\n    padding: 8px 10px;\n  }\n\n  span {\n    color: #314f72;\n    font-size: 0.84rem;\n    line-height: 1.3;\n  }\n\n  strong {\n    white-space: nowrap;\n    color: #0f2f52;\n    font-size: 0.82rem;\n  }\n}\n\n.nav-steps-toggle {\n  justify-self: start;\n  padding-left: 4px;\n  color: #1769aa;\n  font-weight: 600;\n}\n\n.nav-refresh {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  color: #456485;\n  font-size: 0.82rem;\n}\n\n@media (min-width: 900px) {\n  .center-btn.with-navigation {\n    bottom: calc(340px + env(safe-area-inset-bottom));\n  }\n\n  .nav-hud {\n    max-width: 736px;\n    left: 50%;\n    right: auto;\n    transform: translateX(-50%);\n  }\n}\n"] }]
    }], () => [{ type: i1.AppStateService }, { type: i2.GeoService }, { type: i3.NavigationService }, { type: i4.PoiService }, { type: i5.PurchaseService }, { type: i6.StructureLocationService }, { type: i7.MatBottomSheet }, { type: i8.MatSnackBar }, { type: i9.Router }, { type: i9.ActivatedRoute }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MapComponent, { className: "MapComponent", filePath: "src/app/features/map/map.component.ts", lineNumber: 69 }); })();
