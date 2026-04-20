import { Component } from '@angular/core';
import { catchError, combineLatest, map, of, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { circleMarker, divIcon, latLng, latLngBounds, marker, polyline, tileLayer } from 'leaflet';
import { environment } from '../../../environments/environment';
import { formatCityLabel } from '../../core/utils/city-label.util';
import { PoiMapSheetComponent } from '../../shared/components/poi-map-sheet/poi-map-sheet.component';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/app-state.service";
import * as i2 from "../../core/services/geo.service";
import * as i3 from "../../core/services/i18n.service";
import * as i4 from "../../core/services/navigation.service";
import * as i5 from "../../core/services/poi.service";
import * as i6 from "../../core/services/purchase.service";
import * as i7 from "../../core/services/structure-location.service";
import * as i8 from "../../core/services/cart.service";
import * as i9 from "@angular/material/bottom-sheet";
import * as i10 from "@angular/material/snack-bar";
import * as i11 from "@angular/router";
import * as i12 from "@angular/common";
import * as i13 from "@angular/material/button";
import * as i14 from "@angular/material/card";
import * as i15 from "@angular/material/icon";
import * as i16 from "@angular/material/progress-bar";
import * as i17 from "@angular/material/progress-spinner";
import * as i18 from "@bluehalo/ngx-leaflet";
import * as i19 from "../../shared/pipes/translate.pipe";
const _c0 = a0 => ({ count: a0 });
const _c1 = a0 => ({ name: a0 });
function MapComponent_button_3_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 12);
    i0.ɵɵpipe(1, "t");
    i0.ɵɵlistener("click", function MapComponent_button_3_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBack()); });
    i0.ɵɵelementStart(2, "mat-icon", 13);
    i0.ɵɵtext(3, "arrow_back");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(1, 1, "common.goBack"));
} }
function MapComponent_p_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 14);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, "map.availablePoiCount", i0.ɵɵpureFunction1(4, _c0, ctx_r1.poiCount)));
} }
function MapComponent_p_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 14);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(2, 1, "map.activeNavigation", i0.ɵɵpureFunction1(4, _c1, ctx_r1.poiName(ctx_r1.navigationTarget))), " ");
} }
function MapComponent_mat_card_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 15)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.apiErrorMessage);
} }
function MapComponent_mat_card_11_span_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 24);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "map.positionResolving"));
} }
function MapComponent_mat_card_11_button_14_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 25);
    i0.ɵɵlistener("click", function MapComponent_mat_card_11_button_14_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.focusAssociatedStructure()); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, "map.showPoint"), " ");
} }
function MapComponent_mat_card_11_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 16)(1, "div", 17)(2, "p", 18);
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, MapComponent_mat_card_11_span_5_Template, 3, 3, "span", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "h3");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 20);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 21)(11, "button", 22);
    i0.ɵɵlistener("click", function MapComponent_mat_card_11_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.navigateToAssociatedStructure()); });
    i0.ɵɵtext(12);
    i0.ɵɵpipe(13, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(14, MapComponent_mat_card_11_button_14_Template, 3, 3, "button", 23);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const structure_r5 = ctx.ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 6, "map.associatedStructure"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.resolvingAssociatedStructure);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(structure_r5.structureName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(structure_r5.structureAddress);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(13, 8, "map.navigate"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.associatedStructureCoords);
} }
function MapComponent_section_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 26);
    i0.ɵɵelement(1, "mat-progress-spinner", 27);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 1, "map.loading"));
} }
function MapComponent_div_13_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 28);
    i0.ɵɵlistener("leafletMapReady", function MapComponent_div_13_Template_div_leafletMapReady_0_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onMapReady($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("leafletOptions", ctx_r1.mapOptions)("leafletLayers", ctx_r1.markerLayers);
} }
function MapComponent_section_14_div_39_article_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article")(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const step_r8 = ctx.$implicit;
    const index_r9 = ctx.index;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", index_r9 + 1, ". ", step_r8.instruction, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(step_r8.distanceLabel);
} }
function MapComponent_section_14_div_39_button_2_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 42);
    i0.ɵɵlistener("click", function MapComponent_section_14_div_39_button_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleNavigationSteps()); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.showAllNavigationSteps ? i0.ɵɵpipeBind1(2, 1, "common.showLess") : i0.ɵɵpipeBind1(3, 3, "map.showAllSteps"), " ");
} }
function MapComponent_section_14_div_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 39);
    i0.ɵɵtemplate(1, MapComponent_section_14_div_39_article_1_Template, 5, 3, "article", 40)(2, MapComponent_section_14_div_39_button_2_Template, 4, 5, "button", 41);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.visibleNavigationSteps);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canExpandNavigationSteps);
} }
function MapComponent_section_14_div_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 43);
    i0.ɵɵelement(1, "mat-progress-spinner", 44);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 1, "map.updatingRoute"));
} }
function MapComponent_section_14_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 29)(1, "div", 30)(2, "div")(3, "p", 31);
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "h3");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 32);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "button", 33);
    i0.ɵɵpipe(11, "t");
    i0.ɵɵlistener("click", function MapComponent_section_14_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.stopNavigation()); });
    i0.ɵɵelementStart(12, "mat-icon", 13);
    i0.ɵɵtext(13, "close");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(14, "div", 34)(15, "article")(16, "span");
    i0.ɵɵtext(17);
    i0.ɵɵpipe(18, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "strong");
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "article")(22, "span");
    i0.ɵɵtext(23);
    i0.ɵɵpipe(24, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "strong");
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "article")(28, "span");
    i0.ɵɵtext(29);
    i0.ɵɵpipe(30, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "strong");
    i0.ɵɵtext(32);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelement(33, "mat-progress-bar", 35);
    i0.ɵɵelementStart(34, "p", 36);
    i0.ɵɵtext(35);
    i0.ɵɵpipe(36, "t");
    i0.ɵɵelementStart(37, "strong");
    i0.ɵɵtext(38);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(39, MapComponent_section_14_div_39_Template, 3, 2, "div", 37)(40, MapComponent_section_14_div_40_Template, 5, 3, "div", 38);
    i0.ɵɵelementStart(41, "button", 25);
    i0.ɵɵlistener("click", function MapComponent_section_14_Template_button_click_41_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.focusNavigationRoute()); });
    i0.ɵɵtext(42);
    i0.ɵɵpipe(43, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const target_r11 = ctx.ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(5, 18, "map.inAppNavigator"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.poiName(target_r11));
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fallback", ctx_r1.navigationProvider === "fallback");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.navigationProviderLabel);
    i0.ɵɵadvance();
    i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(11, 20, "map.closeNavigation"));
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(18, 22, "map.distance"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.navigationDistanceLabel);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(24, 24, "map.time"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.navigationEtaLabel);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(30, 26, "map.arrival"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.navigationArrivalLabel);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r1.navigationProgress);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(36, 28, "map.nextManeuver"), ": ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.navigationNextInstruction);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.navigationUpcomingSteps.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isRouting);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(43, 30, "map.focusRoute"));
} }
function MapComponent_button_15_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 45);
    i0.ɵɵpipe(1, "t");
    i0.ɵɵlistener("click", function MapComponent_button_15_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.centerOnMe()); });
    i0.ɵɵelementStart(2, "mat-icon", 13);
    i0.ɵɵtext(3, "my_location");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("with-navigation", ctx_r1.hasActiveNavigation);
    i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(1, 3, "map.centerOnMe"));
} }
const cityFallbackMap = {
    catania: { lat: 37.5079, lng: 15.083 },
    siracusa: { lat: 37.067, lng: 15.2866 },
    taormina: { lat: 37.8531, lng: 15.2899 },
    ragusa: { lat: 36.9269, lng: 14.7305 }
};
const ARRIVAL_THRESHOLD_METERS = 35;
const ROUTE_REFRESH_MIN_INTERVAL_MS = 12_000;
const ROUTE_RECALC_MIN_MOVEMENT_METERS = 18;
const MIN_NAV_DURATION_SEC = 30;
export class MapComponent {
    constructor(appState, geoService, i18n, navigationService, poiService, purchaseService, structureLocationService, cartService, bottomSheet, snackBar, router, route, location) {
        this.appState = appState;
        this.geoService = geoService;
        this.i18n = i18n;
        this.navigationService = navigationService;
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.structureLocationService = structureLocationService;
        this.cartService = cartService;
        this.bottomSheet = bottomSheet;
        this.snackBar = snackBar;
        this.router = router;
        this.route = route;
        this.location = location;
        this.cityUnlockPrice = 15;
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
        this.navigationNextInstruction = '';
        this.navigationUpcomingSteps = [];
        this.showAllNavigationSteps = false;
        this.navigationProviderLabel = '';
        this.navigationProvider = null;
        this.isRouting = false;
        this.activeCityId = 'catania';
        this.associatedStructure = null;
        this.associatedStructureCoords = null;
        this.resolvingAssociatedStructure = false;
        this.latestPreparedPois = [];
        this.pendingNavigationPoiId = null;
        this.pendingNavigationFromQuery = false;
        this.routeRemainingMetersByPoint = [];
        this.routeStepPointIndexes = [];
        this.hasShownArrivalSnack = false;
        this.hasShownFallbackSnack = false;
        this.lastRouteRequestedAt = 0;
        this.routeRequestToken = 0;
        this.destroy$ = new Subject();
        this.applyNavigationPlaceholders();
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
            this.pendingNavigationFromQuery = true;
            this.tryStartPendingNavigation();
        });
        combineLatest([
            this.appState.activeCityId$.pipe(tap(() => {
                this.isLoading = true;
            }), switchMap((cityId) => this.poiService.getPoisByCity(cityId).pipe(tap(() => {
                this.apiErrorMessage = null;
            }), map((pois) => ({ cityId, pois })), catchError(() => {
                this.apiErrorMessage = this.i18n.t('map.apiError');
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
    goBack() {
        if (!this.hasActiveNavigation) {
            return;
        }
        if (window.history.length > 1) {
            this.location.back();
            return;
        }
        void this.router.navigate(['/home']);
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
            this.snackBar.open(this.i18n.t('map.structureNavigationUnavailable'), this.i18n.t('common.close'), {
                duration: 2400
            });
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
                    isNavigating: this.navigationTarget?.id === poi.id,
                    isFavorite: this.appState.isFavorite(poi.id),
                    inCart: this.cartService.isPoiInCart(poi.id)
                }
            });
            sheet.afterDismissed().subscribe((result) => {
                if (!result) {
                    return;
                }
                if (result.action === 'navigate') {
                    this.deferNavigationStart(poi);
                    return;
                }
                if (result.action === 'play') {
                    if (!this.hasPlayableAudio(poi)) {
                        this.snackBar.open(this.i18n.t('map.noAudio'), this.i18n.t('common.ok'), { duration: 2400 });
                        return;
                    }
                    if (result.preview) {
                        void this.router.navigate(['/poi', result.poiId]);
                        return;
                    }
                    void this.router.navigate(['/player', result.poiId], { queryParams: { preview: false } });
                    return;
                }
                if (result.action === 'add-to-cart') {
                    if (this.purchaseService.isPoiUnlocked(poi.id, poi.cityId)) {
                        this.snackBar.open(this.i18n.t('map.placeAlreadyUnlocked'), this.i18n.t('common.ok'), { duration: 2200 });
                        return;
                    }
                    if (this.cartService.isPoiInCart(poi.id)) {
                        this.snackBar.open(this.i18n.t('map.placeAlreadyInCart'), this.i18n.t('common.ok'), { duration: 2200 });
                        return;
                    }
                    this.cartService.addPoi({
                        poiId: poi.id,
                        cityId: poi.cityId,
                        cityName: this.cityName(poi.cityId),
                        label: this.poiName(poi),
                        amount: poi.priceSingle
                    });
                    this.snackBar.open(this.i18n.t('map.placeAdded', { name: this.poiName(poi) }), this.i18n.t('common.ok'), {
                        duration: 2400
                    });
                    return;
                }
                if (result.action === 'toggle-favorite') {
                    this.appState.toggleFavorite(result.poiId);
                    return;
                }
                this.purchaseService.purchaseCityBundle(result.cityId, this.cityName(result.cityId), this.cityUnlockPrice).subscribe({
                    next: (dialogResult) => {
                        if (dialogResult?.action === 'paid') {
                            this.snackBar.open(this.i18n.t('map.cityUnlocked', { city: this.cityName(result.cityId) }), this.i18n.t('common.ok'), { duration: 2400 });
                        }
                    },
                    error: () => {
                        this.snackBar.open(this.i18n.t('map.operationFailed'), this.i18n.t('common.close'), { duration: 2400 });
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
        if (this.navigationTarget?.id === poi.id && this.activeRoute?.points?.length) {
            this.focusNavigationRoute();
            return;
        }
        this.pendingNavigationPoiId = null;
        this.navigationTarget = poi;
        this.activeRoute = undefined;
        this.routeRemainingMetersByPoint = [];
        this.routeStepPointIndexes = [];
        this.navigationProvider = null;
        this.applyNavigationPlaceholders();
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
                    this.snackBar.open(this.i18n.t('map.routeFallback'), this.i18n.t('common.ok'), { duration: 2800 });
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
            route.provider === 'osrm' ? this.i18n.t('map.providerRealRoute') : this.i18n.t('map.providerFallbackRoute');
        this.routeRemainingMetersByPoint = this.buildRemainingDistanceByPoint(route.points);
        this.routeStepPointIndexes = this.buildRouteStepIndexes(route.steps, route.points);
    }
    updateNavigationState() {
        if (!this.navigationTarget) {
            return;
        }
        const refreshedTarget = this.latestPreparedPois.find((poi) => poi.id === this.navigationTarget?.id);
        if (!refreshedTarget) {
            if (!this.latestPreparedPois.length) {
                return;
            }
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
            this.navigationNextInstruction = nextStep?.instruction || this.i18n.t('navigation.proceedDestination');
            this.navigationUpcomingSteps = this.buildUpcomingStepViews(nearestPointIndex);
        }
        else {
            this.navigationNextInstruction = this.i18n.t('navigation.proceedDestination');
            this.navigationUpcomingSteps = [];
        }
        this.navigationDistanceLabel = this.i18n.formatDistance(remainingMeters);
        this.navigationEtaLabel = this.formatDurationShort(remainingDurationSec);
        this.navigationArrivalLabel = new Intl.DateTimeFormat(this.i18n.locale, {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(Date.now() + remainingDurationSec * 1000));
        const totalDistance = Math.max(this.activeRoute?.distanceMeters || remainingMeters, 1);
        this.navigationProgress = Math.max(0, Math.min(100, ((totalDistance - remainingMeters) / totalDistance) * 100));
        if (!this.hasShownArrivalSnack && remainingMeters <= ARRIVAL_THRESHOLD_METERS) {
            this.hasShownArrivalSnack = true;
            this.snackBar.open(this.i18n.t('map.arrivedNear', { name: this.poiName(refreshedTarget) }), this.i18n.t('common.ok'), { duration: 2400 });
        }
    }
    clearNavigationState() {
        this.navigationTarget = undefined;
        this.navigationDistanceLabel = '--';
        this.navigationEtaLabel = '--';
        this.navigationArrivalLabel = '--';
        this.navigationProgress = 0;
        this.navigationNextInstruction = this.i18n.t('map.calculatingRoute');
        this.navigationUpcomingSteps = [];
        this.showAllNavigationSteps = false;
        this.navigationProvider = null;
        this.navigationProviderLabel = this.i18n.t('map.searchingRoute');
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
        if (this.pendingNavigationFromQuery) {
            this.pendingNavigationFromQuery = false;
            void this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                    nav: null,
                    poiId: null
                },
                queryParamsHandling: 'merge',
                replaceUrl: true
            });
        }
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
        return this.i18n.formatDistance(distanceMeters);
    }
    hasPlayableAudio(poi) {
        return Boolean(this.i18n.resolvePoiAudioUrl(poi));
    }
    poiName(poi) {
        return this.i18n.resolvePoiField(poi?.name, poi?.translations, 'name');
    }
    cityName(cityId) {
        return formatCityLabel(cityId, [], this.i18n.language);
    }
    associationCityIds(association) {
        if (Array.isArray(association.cityIds) && association.cityIds.length) {
            return association.cityIds.map((cityId) => String(cityId || '').trim()).filter(Boolean);
        }
        const singleCityId = String(association.cityId || '').trim();
        return singleCityId ? [singleCityId] : [];
    }
    applyNavigationPlaceholders() {
        this.navigationProviderLabel = this.i18n.t('map.searchingRoute');
        this.navigationNextInstruction = this.i18n.t('map.calculatingRoute');
    }
    static { this.ɵfac = function MapComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MapComponent)(i0.ɵɵdirectiveInject(i1.AppStateService), i0.ɵɵdirectiveInject(i2.GeoService), i0.ɵɵdirectiveInject(i3.I18nService), i0.ɵɵdirectiveInject(i4.NavigationService), i0.ɵɵdirectiveInject(i5.PoiService), i0.ɵɵdirectiveInject(i6.PurchaseService), i0.ɵɵdirectiveInject(i7.StructureLocationService), i0.ɵɵdirectiveInject(i8.CartService), i0.ɵɵdirectiveInject(i9.MatBottomSheet), i0.ɵɵdirectiveInject(i10.MatSnackBar), i0.ɵɵdirectiveInject(i11.Router), i0.ɵɵdirectiveInject(i11.ActivatedRoute), i0.ɵɵdirectiveInject(i12.Location)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MapComponent, selectors: [["app-map"]], standalone: false, decls: 16, vars: 12, consts: [[1, "map-page"], [1, "map-header"], [1, "map-header-top"], ["mat-icon-button", "", "class", "map-back-btn", "type", "button", 3, "click", 4, "ngIf"], [1, "page-title"], ["class", "page-subtitle", 4, "ngIf"], ["class", "card warning api-warning", 4, "ngIf"], ["class", "card structure-card", 4, "ngIf"], ["class", "loading-shell", 4, "ngIf"], ["class", "map-frame", "leaflet", "", 3, "leafletOptions", "leafletLayers", "leafletMapReady", 4, "ngIf"], ["class", "nav-hud card", 4, "ngIf"], ["mat-fab", "", "color", "primary", "class", "center-btn", 3, "with-navigation", "click", 4, "ngIf"], ["mat-icon-button", "", "type", "button", 1, "map-back-btn", 3, "click"], ["fontSet", "material-icons-round"], [1, "page-subtitle"], [1, "card", "warning", "api-warning"], [1, "card", "structure-card"], [1, "structure-card-head"], [1, "structure-kicker"], ["class", "structure-status", 4, "ngIf"], [1, "structure-address"], [1, "structure-actions"], ["mat-flat-button", "", "color", "primary", 3, "click"], ["mat-stroked-button", "", "color", "primary", 3, "click", 4, "ngIf"], [1, "structure-status"], ["mat-stroked-button", "", "color", "primary", 3, "click"], [1, "loading-shell"], ["mode", "indeterminate", "diameter", "48"], ["leaflet", "", 1, "map-frame", 3, "leafletMapReady", "leafletOptions", "leafletLayers"], [1, "nav-hud", "card"], [1, "nav-hud-head"], [1, "nav-kicker"], [1, "nav-provider"], ["mat-icon-button", "", 3, "click"], [1, "nav-metrics"], ["mode", "determinate", 3, "value"], [1, "nav-direction"], ["class", "nav-steps", 4, "ngIf"], ["class", "nav-refresh", 4, "ngIf"], [1, "nav-steps"], [4, "ngFor", "ngForOf"], ["mat-button", "", "class", "nav-steps-toggle", 3, "click", 4, "ngIf"], ["mat-button", "", 1, "nav-steps-toggle", 3, "click"], [1, "nav-refresh"], ["mode", "indeterminate", "diameter", "16"], ["mat-fab", "", "color", "primary", 1, "center-btn", 3, "click"]], template: function MapComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div", 2);
            i0.ɵɵtemplate(3, MapComponent_button_3_Template, 4, 3, "button", 3);
            i0.ɵɵelementStart(4, "div")(5, "h1", 4);
            i0.ɵɵtext(6);
            i0.ɵɵpipe(7, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(8, MapComponent_p_8_Template, 3, 6, "p", 5)(9, MapComponent_p_9_Template, 3, 6, "p", 5);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(10, MapComponent_mat_card_10_Template, 3, 1, "mat-card", 6)(11, MapComponent_mat_card_11_Template, 15, 10, "mat-card", 7)(12, MapComponent_section_12_Template, 5, 3, "section", 8)(13, MapComponent_div_13_Template, 1, 2, "div", 9)(14, MapComponent_section_14_Template, 44, 32, "section", 10)(15, MapComponent_button_15_Template, 4, 5, "button", 11);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngIf", ctx.hasActiveNavigation);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 10, "map.title"));
            i0.ɵɵadvance(2);
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
        } }, dependencies: [i12.NgForOf, i12.NgIf, i13.MatButton, i13.MatIconButton, i13.MatFabButton, i14.MatCard, i15.MatIcon, i16.MatProgressBar, i17.MatProgressSpinner, i18.LeafletDirective, i18.LeafletLayersDirective, i19.TranslatePipe], styles: [".map-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding: 16px 12px calc(126px + env(safe-area-inset-bottom));\n  display: grid;\n  gap: 12px;\n}\n\n.map-header[_ngcontent-%COMP%] {\n  padding: 0 4px;\n}\n\n.map-header-top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n}\n\n.map-back-btn[_ngcontent-%COMP%] {\n  margin-top: -2px;\n}\n\n.map-frame[_ngcontent-%COMP%] {\n  height: clamp(320px, calc(100dvh - 330px), 620px);\n  min-height: 320px;\n  border-radius: 22px;\n  overflow: hidden;\n  box-shadow: 0 10px 30px rgba(20, 38, 62, 0.12);\n}\n\nbody.app-user-theme[_nghost-%COMP%]   .map-frame[_ngcontent-%COMP%], body.app-user-theme   [_nghost-%COMP%]   .map-frame[_ngcontent-%COMP%] {\n  border: 1px solid rgba(182, 165, 131, 0.16);\n  box-shadow:\n    0 18px 34px rgba(20, 38, 62, 0.12),\n    0 8px 18px rgba(117, 96, 60, 0.08);\n}\n\n[_nghost-%COMP%]     .map-frame .leaflet-bottom {\n  margin-bottom: calc(86px + env(safe-area-inset-bottom));\n}\n\n[_nghost-%COMP%]     .map-frame .leaflet-control-attribution {\n  margin-bottom: 0;\n  font-size: 0.68rem;\n}\n\n.loading-shell[_ngcontent-%COMP%] {\n  min-height: 300px;\n}\n\n.api-warning[_ngcontent-%COMP%] {\n  border: 1px solid #f0cf8e;\n  background: #fff7e8;\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #89652a;\n  }\n}\n\n.structure-card[_ngcontent-%COMP%] {\n  padding: 14px;\n  border: 1px solid #d9e5f5;\n  display: grid;\n  gap: 6px;\n\n  h3 {\n    margin: 0;\n    font-size: 1.02rem;\n    line-height: 1.25;\n    color: #142d4b;\n  }\n}\n\nbody.app-user-theme[_nghost-%COMP%]   .structure-card[_ngcontent-%COMP%], body.app-user-theme   [_nghost-%COMP%]   .structure-card[_ngcontent-%COMP%] {\n  border-color: rgba(180, 162, 128, 0.2);\n  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 243, 236, 0.96) 100%);\n}\n\n.structure-card-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.structure-kicker[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: #5f7391;\n}\n\n.structure-status[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  color: #476a95;\n}\n\n.structure-address[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #5d7390;\n  font-size: 0.88rem;\n}\n\n.structure-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.center-btn[_ngcontent-%COMP%] {\n  position: fixed;\n  right: 22px;\n  bottom: calc(118px + env(safe-area-inset-bottom));\n  z-index: 1250;\n  transition: bottom 0.22s ease;\n}\n\n.center-btn.with-navigation[_ngcontent-%COMP%] {\n  bottom: calc(372px + env(safe-area-inset-bottom));\n}\n\n.nav-hud[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 12px;\n  right: 12px;\n  bottom: calc(92px + env(safe-area-inset-bottom));\n  z-index: 450;\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n  border: 1px solid #d9e5f5;\n  box-shadow: 0 12px 30px rgba(20, 38, 62, 0.16);\n  max-height: min(52vh, 360px);\n  overflow-y: auto;\n}\n\n.nav-hud-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 10px;\n\n  h3 {\n    margin: 2px 0 0;\n    font-size: 1.03rem;\n    line-height: 1.25;\n  }\n}\n\n.nav-kicker[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: #5f7391;\n}\n\n.nav-provider[_ngcontent-%COMP%] {\n  margin: 6px 0 0;\n  font-size: 0.76rem;\n  color: #2a5f93;\n}\n\n.nav-provider.fallback[_ngcontent-%COMP%] {\n  color: #8b6400;\n}\n\n.nav-metrics[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 8px;\n\n  article {\n    border-radius: 12px;\n    background: #f3f7fc;\n    padding: 9px 10px;\n    display: grid;\n    gap: 4px;\n  }\n\n  span {\n    font-size: 0.74rem;\n    color: #627692;\n    text-transform: uppercase;\n    letter-spacing: 0.04em;\n  }\n\n  strong {\n    font-size: 0.95rem;\n    color: #122640;\n    font-weight: 700;\n  }\n}\n\nbody.app-user-theme[_nghost-%COMP%]   .nav-metrics[_ngcontent-%COMP%]   article[_ngcontent-%COMP%], body.app-user-theme   [_nghost-%COMP%]   .nav-metrics[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  background: linear-gradient(180deg, rgba(247, 250, 253, 0.96) 0%, rgba(251, 247, 240, 0.96) 100%);\n  border: 1px solid rgba(182, 164, 129, 0.16);\n}\n\n.nav-direction[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #465f7f;\n  font-size: 0.9rem;\n}\n\n.nav-steps[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 6px;\n\n  article {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 10px;\n    border-radius: 10px;\n    background: #f7fbff;\n    border: 1px solid #e0ebf7;\n    padding: 8px 10px;\n  }\n\n  span {\n    color: #314f72;\n    font-size: 0.84rem;\n    line-height: 1.3;\n  }\n\n  strong {\n    white-space: nowrap;\n    color: #0f2f52;\n    font-size: 0.82rem;\n  }\n}\n\nbody.app-user-theme[_nghost-%COMP%]   .nav-steps[_ngcontent-%COMP%]   article[_ngcontent-%COMP%], body.app-user-theme   [_nghost-%COMP%]   .nav-steps[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  background: linear-gradient(180deg, rgba(248, 251, 255, 0.98) 0%, rgba(251, 247, 241, 0.96) 100%);\n  border-color: rgba(182, 164, 129, 0.16);\n}\n\n.nav-steps-toggle[_ngcontent-%COMP%] {\n  justify-self: start;\n  padding-left: 4px;\n  color: #1769aa;\n  font-weight: 600;\n}\n\n.nav-refresh[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  color: #456485;\n  font-size: 0.82rem;\n}\n\n@media (min-width: 900px) {\n  .center-btn.with-navigation[_ngcontent-%COMP%] {\n    bottom: calc(352px + env(safe-area-inset-bottom));\n  }\n\n  .nav-hud[_ngcontent-%COMP%] {\n    max-width: 736px;\n    left: 50%;\n    right: auto;\n    transform: translateX(-50%);\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MapComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-map', template: "<section class=\"map-page\">\n  <header class=\"map-header\">\n    <div class=\"map-header-top\">\n      <button\n        mat-icon-button\n        class=\"map-back-btn\"\n        type=\"button\"\n        *ngIf=\"hasActiveNavigation\"\n        (click)=\"goBack()\"\n        [attr.aria-label]=\"'common.goBack' | t\"\n      >\n        <mat-icon fontSet=\"material-icons-round\">arrow_back</mat-icon>\n      </button>\n\n      <div>\n        <h1 class=\"page-title\">{{ 'map.title' | t }}</h1>\n        <p class=\"page-subtitle\" *ngIf=\"!hasActiveNavigation\">{{ 'map.availablePoiCount' | t:{ count: poiCount } }}</p>\n        <p class=\"page-subtitle\" *ngIf=\"hasActiveNavigation && navigationTarget\">\n          {{ 'map.activeNavigation' | t:{ name: poiName(navigationTarget) } }}\n        </p>\n      </div>\n    </div>\n  </header>\n\n  <mat-card class=\"card warning api-warning\" *ngIf=\"apiErrorMessage\">\n    <p>{{ apiErrorMessage }}</p>\n  </mat-card>\n\n  <mat-card class=\"card structure-card\" *ngIf=\"visibleAssociatedStructure as structure\">\n    <div class=\"structure-card-head\">\n      <p class=\"structure-kicker\">{{ 'map.associatedStructure' | t }}</p>\n      <span class=\"structure-status\" *ngIf=\"resolvingAssociatedStructure\">{{ 'map.positionResolving' | t }}</span>\n    </div>\n    <h3>{{ structure.structureName }}</h3>\n    <p class=\"structure-address\">{{ structure.structureAddress }}</p>\n    <div class=\"structure-actions\">\n      <button mat-flat-button color=\"primary\" (click)=\"navigateToAssociatedStructure()\">{{ 'map.navigate' | t }}</button>\n      <button mat-stroked-button color=\"primary\" *ngIf=\"associatedStructureCoords\" (click)=\"focusAssociatedStructure()\">\n        {{ 'map.showPoint' | t }}\n      </button>\n    </div>\n  </mat-card>\n\n  <section class=\"loading-shell\" *ngIf=\"isLoading\">\n    <mat-progress-spinner mode=\"indeterminate\" diameter=\"48\"></mat-progress-spinner>\n    <p>{{ 'map.loading' | t }}</p>\n  </section>\n\n  <div\n    class=\"map-frame\"\n    *ngIf=\"!isLoading\"\n    leaflet\n    [leafletOptions]=\"mapOptions\"\n    [leafletLayers]=\"markerLayers\"\n    (leafletMapReady)=\"onMapReady($event)\"\n  ></div>\n\n  <section class=\"nav-hud card\" *ngIf=\"navigationTarget as target\">\n    <div class=\"nav-hud-head\">\n      <div>\n        <p class=\"nav-kicker\">{{ 'map.inAppNavigator' | t }}</p>\n        <h3>{{ poiName(target) }}</h3>\n        <p class=\"nav-provider\" [class.fallback]=\"navigationProvider === 'fallback'\">{{ navigationProviderLabel }}</p>\n      </div>\n\n      <button mat-icon-button (click)=\"stopNavigation()\" [attr.aria-label]=\"'map.closeNavigation' | t\">\n        <mat-icon fontSet=\"material-icons-round\">close</mat-icon>\n      </button>\n    </div>\n\n    <div class=\"nav-metrics\">\n      <article>\n        <span>{{ 'map.distance' | t }}</span>\n        <strong>{{ navigationDistanceLabel }}</strong>\n      </article>\n      <article>\n        <span>{{ 'map.time' | t }}</span>\n        <strong>{{ navigationEtaLabel }}</strong>\n      </article>\n      <article>\n        <span>{{ 'map.arrival' | t }}</span>\n        <strong>{{ navigationArrivalLabel }}</strong>\n      </article>\n    </div>\n\n    <mat-progress-bar mode=\"determinate\" [value]=\"navigationProgress\"></mat-progress-bar>\n\n    <p class=\"nav-direction\">{{ 'map.nextManeuver' | t }}: <strong>{{ navigationNextInstruction }}</strong></p>\n\n    <div class=\"nav-steps\" *ngIf=\"navigationUpcomingSteps.length\">\n      <article *ngFor=\"let step of visibleNavigationSteps; let index = index\">\n        <span>{{ index + 1 }}. {{ step.instruction }}</span>\n        <strong>{{ step.distanceLabel }}</strong>\n      </article>\n\n      <button mat-button class=\"nav-steps-toggle\" *ngIf=\"canExpandNavigationSteps\" (click)=\"toggleNavigationSteps()\">\n        {{ showAllNavigationSteps ? ('common.showLess' | t) : ('map.showAllSteps' | t) }}\n      </button>\n    </div>\n\n    <div class=\"nav-refresh\" *ngIf=\"isRouting\">\n      <mat-progress-spinner mode=\"indeterminate\" diameter=\"16\"></mat-progress-spinner>\n      <span>{{ 'map.updatingRoute' | t }}</span>\n    </div>\n\n    <button mat-stroked-button color=\"primary\" (click)=\"focusNavigationRoute()\">{{ 'map.focusRoute' | t }}</button>\n  </section>\n\n  <button\n    mat-fab\n    color=\"primary\"\n    class=\"center-btn\"\n    [class.with-navigation]=\"hasActiveNavigation\"\n    *ngIf=\"!isLoading\"\n    (click)=\"centerOnMe()\"\n    [attr.aria-label]=\"'map.centerOnMe' | t\"\n  >\n    <mat-icon fontSet=\"material-icons-round\">my_location</mat-icon>\n  </button>\n</section>\n", styles: [".map-page {\n  min-height: 100vh;\n  padding: 16px 12px calc(126px + env(safe-area-inset-bottom));\n  display: grid;\n  gap: 12px;\n}\n\n.map-header {\n  padding: 0 4px;\n}\n\n.map-header-top {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n}\n\n.map-back-btn {\n  margin-top: -2px;\n}\n\n.map-frame {\n  height: clamp(320px, calc(100dvh - 330px), 620px);\n  min-height: 320px;\n  border-radius: 22px;\n  overflow: hidden;\n  box-shadow: 0 10px 30px rgba(20, 38, 62, 0.12);\n}\n\n:host-context(body.app-user-theme) .map-frame {\n  border: 1px solid rgba(182, 165, 131, 0.16);\n  box-shadow:\n    0 18px 34px rgba(20, 38, 62, 0.12),\n    0 8px 18px rgba(117, 96, 60, 0.08);\n}\n\n:host ::ng-deep .map-frame .leaflet-bottom {\n  margin-bottom: calc(86px + env(safe-area-inset-bottom));\n}\n\n:host ::ng-deep .map-frame .leaflet-control-attribution {\n  margin-bottom: 0;\n  font-size: 0.68rem;\n}\n\n.loading-shell {\n  min-height: 300px;\n}\n\n.api-warning {\n  border: 1px solid #f0cf8e;\n  background: #fff7e8;\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #89652a;\n  }\n}\n\n.structure-card {\n  padding: 14px;\n  border: 1px solid #d9e5f5;\n  display: grid;\n  gap: 6px;\n\n  h3 {\n    margin: 0;\n    font-size: 1.02rem;\n    line-height: 1.25;\n    color: #142d4b;\n  }\n}\n\n:host-context(body.app-user-theme) .structure-card {\n  border-color: rgba(180, 162, 128, 0.2);\n  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 243, 236, 0.96) 100%);\n}\n\n.structure-card-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.structure-kicker {\n  margin: 0;\n  font-size: 0.74rem;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: #5f7391;\n}\n\n.structure-status {\n  font-size: 0.76rem;\n  color: #476a95;\n}\n\n.structure-address {\n  margin: 0;\n  color: #5d7390;\n  font-size: 0.88rem;\n}\n\n.structure-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.center-btn {\n  position: fixed;\n  right: 22px;\n  bottom: calc(118px + env(safe-area-inset-bottom));\n  z-index: 1250;\n  transition: bottom 0.22s ease;\n}\n\n.center-btn.with-navigation {\n  bottom: calc(372px + env(safe-area-inset-bottom));\n}\n\n.nav-hud {\n  position: fixed;\n  left: 12px;\n  right: 12px;\n  bottom: calc(92px + env(safe-area-inset-bottom));\n  z-index: 450;\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n  border: 1px solid #d9e5f5;\n  box-shadow: 0 12px 30px rgba(20, 38, 62, 0.16);\n  max-height: min(52vh, 360px);\n  overflow-y: auto;\n}\n\n.nav-hud-head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 10px;\n\n  h3 {\n    margin: 2px 0 0;\n    font-size: 1.03rem;\n    line-height: 1.25;\n  }\n}\n\n.nav-kicker {\n  margin: 0;\n  font-size: 0.74rem;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: #5f7391;\n}\n\n.nav-provider {\n  margin: 6px 0 0;\n  font-size: 0.76rem;\n  color: #2a5f93;\n}\n\n.nav-provider.fallback {\n  color: #8b6400;\n}\n\n.nav-metrics {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 8px;\n\n  article {\n    border-radius: 12px;\n    background: #f3f7fc;\n    padding: 9px 10px;\n    display: grid;\n    gap: 4px;\n  }\n\n  span {\n    font-size: 0.74rem;\n    color: #627692;\n    text-transform: uppercase;\n    letter-spacing: 0.04em;\n  }\n\n  strong {\n    font-size: 0.95rem;\n    color: #122640;\n    font-weight: 700;\n  }\n}\n\n:host-context(body.app-user-theme) .nav-metrics article {\n  background: linear-gradient(180deg, rgba(247, 250, 253, 0.96) 0%, rgba(251, 247, 240, 0.96) 100%);\n  border: 1px solid rgba(182, 164, 129, 0.16);\n}\n\n.nav-direction {\n  margin: 0;\n  color: #465f7f;\n  font-size: 0.9rem;\n}\n\n.nav-steps {\n  display: grid;\n  gap: 6px;\n\n  article {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 10px;\n    border-radius: 10px;\n    background: #f7fbff;\n    border: 1px solid #e0ebf7;\n    padding: 8px 10px;\n  }\n\n  span {\n    color: #314f72;\n    font-size: 0.84rem;\n    line-height: 1.3;\n  }\n\n  strong {\n    white-space: nowrap;\n    color: #0f2f52;\n    font-size: 0.82rem;\n  }\n}\n\n:host-context(body.app-user-theme) .nav-steps article {\n  background: linear-gradient(180deg, rgba(248, 251, 255, 0.98) 0%, rgba(251, 247, 241, 0.96) 100%);\n  border-color: rgba(182, 164, 129, 0.16);\n}\n\n.nav-steps-toggle {\n  justify-self: start;\n  padding-left: 4px;\n  color: #1769aa;\n  font-weight: 600;\n}\n\n.nav-refresh {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  color: #456485;\n  font-size: 0.82rem;\n}\n\n@media (min-width: 900px) {\n  .center-btn.with-navigation {\n    bottom: calc(352px + env(safe-area-inset-bottom));\n  }\n\n  .nav-hud {\n    max-width: 736px;\n    left: 50%;\n    right: auto;\n    transform: translateX(-50%);\n  }\n}\n"] }]
    }], () => [{ type: i1.AppStateService }, { type: i2.GeoService }, { type: i3.I18nService }, { type: i4.NavigationService }, { type: i5.PoiService }, { type: i6.PurchaseService }, { type: i7.StructureLocationService }, { type: i8.CartService }, { type: i9.MatBottomSheet }, { type: i10.MatSnackBar }, { type: i11.Router }, { type: i11.ActivatedRoute }, { type: i12.Location }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MapComponent, { className: "MapComponent", filePath: "frontend/src/app/features/map/map.component.ts", lineNumber: 66 }); })();
