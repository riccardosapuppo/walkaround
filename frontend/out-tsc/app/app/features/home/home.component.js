import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, combineLatest, map, of, shareReplay, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/app-state.service";
import * as i2 from "../../core/services/geo.service";
import * as i3 from "../../core/services/poi.service";
import * as i4 from "../../core/services/purchase.service";
import * as i5 from "../../core/services/player.service";
import * as i6 from "../../core/services/structure-location.service";
import * as i7 from "@angular/material/snack-bar";
import * as i8 from "@angular/router";
import * as i9 from "@angular/common";
import * as i10 from "@angular/material/button";
import * as i11 from "@angular/material/card";
import * as i12 from "@angular/material/icon";
import * as i13 from "@angular/material/progress-spinner";
import * as i14 from "../../shared/pipes/duration-label.pipe";
function HomeComponent_section_0_mat_card_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 16)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 17);
    i0.ɵɵtext(4, "Controlla che backend e proxy siano attivi.");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.apiErrorMessage);
} }
function HomeComponent_section_0_mat_card_10_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 18)(1, "div", 19)(2, "p", 20);
    i0.ɵɵtext(3, "Struttura associata");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 21);
    i0.ɵɵtext(5, "Attiva");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "h3");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 22);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 23);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_10_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.navigateToAssociatedStructure()); });
    i0.ɵɵtext(11, "Naviga verso struttura");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const structure_r3 = ctx.ngIf;
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(structure_r3.structureName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(structure_r3.structureAddress);
} }
function HomeComponent_section_0_mat_card_11_button_14_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 33);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_11_button_14_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const nearest_r5 = i0.ɵɵnextContext().ngIf; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.purchaseCity(nearest_r5.cityId)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const nearest_r5 = i0.ɵɵnextContext().ngIf;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" Oppure sblocca ", ctx_r0.cityName(nearest_r5.cityId), " \u20AC", ctx_r0.cityUnlockPriceLabel, " ");
} }
function HomeComponent_section_0_mat_card_11_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 24)(1, "div", 25)(2, "p", 26)(3, "mat-icon", 27);
    i0.ɵɵtext(4, "near_me");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5, " Sei vicino a ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 28);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "h2");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "p", 29);
    i0.ɵɵtext(11, "Perfetto per iniziare ora il tour nelle vicinanze.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 30);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_11_Template_button_click_12_listener() { const nearest_r5 = i0.ɵɵrestoreView(_r4).ngIf; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.onMainCta(nearest_r5)); });
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(14, HomeComponent_section_0_mat_card_11_button_14_Template, 2, 2, "button", 31);
    i0.ɵɵelementStart(15, "button", 32);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_11_Template_button_click_15_listener() { const nearest_r5 = i0.ɵɵrestoreView(_r4).ngIf; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.playPoi(nearest_r5, true)); });
    i0.ɵɵtext(16, "Ascolta preview");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const nearest_r5 = ctx.ngIf;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(nearest_r5.distanceLabel);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(nearest_r5.name);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", nearest_r5.unlocked ? "Riproduci audio guida" : "Sblocca questo luogo \u20AC" + ctx_r0.formatPrice(nearest_r5.priceSingle), " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !nearest_r5.unlocked);
} }
function HomeComponent_section_0_mat_card_12_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 34)(1, "p");
    i0.ɵɵtext(2, "Geolocalizzazione negata. Sto usando il centro citt\u00E0.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 23);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_12_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.askLocationAgain()); });
    i0.ɵɵtext(4, "Riprova permesso");
    i0.ɵɵelementEnd()();
} }
function HomeComponent_section_0_mat_card_13_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 35)(1, "p", 36);
    i0.ɵɵtext(2, "Continua ascolto");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h3");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6);
    i0.ɵɵpipe(7, "durationLabel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "button", 23);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_13_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.resumePlayback()); });
    i0.ɵɵtext(9, "Riprendi");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.continuePoi.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Riprendi da ", i0.ɵɵpipeBind1(7, 2, ctx_r0.continueTime), "");
} }
function HomeComponent_section_0_mat_card_17_button_15_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 43);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_17_button_15_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r11); const poi_r10 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.playPoi(poi_r10, false)); });
    i0.ɵɵelementStart(1, "mat-icon", 27);
    i0.ɵɵtext(2, "headphones");
    i0.ɵɵelementEnd()();
} }
function HomeComponent_section_0_mat_card_17_div_16_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 46)(1, "button", 47);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_17_div_16_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r12); const poi_r10 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.purchasePoi(poi_r10)); });
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 48);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_17_div_16_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r12); const poi_r10 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.purchaseCity(poi_r10.cityId)); });
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const poi_r10 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" Sblocca luogo \u20AC", ctx_r0.formatPrice(poi_r10.priceSingle), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" Sblocca ", ctx_r0.cityName(poi_r10.cityId), " \u20AC", ctx_r0.cityUnlockPriceLabel, " ");
} }
function HomeComponent_section_0_mat_card_17_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 37)(1, "div", 38)(2, "img", 39);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_17_Template_img_click_2_listener() { const poi_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.openPoi(poi_r10.id)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 40);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_17_Template_div_click_3_listener() { const poi_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.openPoi(poi_r10.id)); });
    i0.ɵɵelementStart(4, "h4");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p");
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "durationLabel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span", 41);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 42)(12, "button", 43);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_17_Template_button_click_12_listener() { const poi_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.playPoi(poi_r10, true)); });
    i0.ɵɵelementStart(13, "mat-icon", 27);
    i0.ɵɵtext(14, "play_circle");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(15, HomeComponent_section_0_mat_card_17_button_15_Template, 3, 0, "button", 44);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(16, HomeComponent_section_0_mat_card_17_div_16_Template, 5, 3, "div", 45);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const poi_r10 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("src", poi_r10.imageUrl, i0.ɵɵsanitizeUrl)("alt", poi_r10.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(poi_r10.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", poi_r10.distanceLabel, " \u00B7 ", i0.ɵɵpipeBind1(8, 9, poi_r10.durationSec), "");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", poi_r10.unlocked ? "unlocked" : poi_r10.near ? "near" : "locked");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", poi_r10.unlocked ? "Sbloccato" : poi_r10.near ? "Vicino" : "Bloccato", " ");
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", poi_r10.unlocked);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !poi_r10.unlocked);
} }
function HomeComponent_section_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 2)(1, "header", 3)(2, "div", 4);
    i0.ɵɵelement(3, "img", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 6)(5, "h1", 7);
    i0.ɵɵtext(6, "Tour Citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 8);
    i0.ɵɵtext(8, "Punti di interesse vicini");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(9, HomeComponent_section_0_mat_card_9_Template, 5, 1, "mat-card", 9)(10, HomeComponent_section_0_mat_card_10_Template, 12, 2, "mat-card", 10)(11, HomeComponent_section_0_mat_card_11_Template, 17, 4, "mat-card", 11)(12, HomeComponent_section_0_mat_card_12_Template, 5, 0, "mat-card", 12)(13, HomeComponent_section_0_mat_card_13_Template, 10, 4, "mat-card", 13);
    i0.ɵɵelementStart(14, "section", 14)(15, "h3");
    i0.ɵɵtext(16, "Vicino a te");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(17, HomeComponent_section_0_mat_card_17_Template, 17, 11, "mat-card", 15);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const vm_r13 = ctx.ngIf;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("ngIf", ctx_r0.apiErrorMessage);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.visibleAssociatedStructure);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", vm_r13.nearestPoi);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", vm_r13.permission === "denied");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.continuePoi);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngForOf", vm_r13.pois);
} }
function HomeComponent_section_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 49);
    i0.ɵɵelement(1, "mat-progress-spinner", 50);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Caricamento punti di interesse...");
    i0.ɵɵelementEnd()();
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
const homeScrollStorageKey = 'tourismapp.home.scrollY';
export class HomeComponent {
    constructor(appState, geoService, poiService, purchaseService, playerService, structureLocationService, snackBar, router) {
        this.appState = appState;
        this.geoService = geoService;
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.playerService = playerService;
        this.structureLocationService = structureLocationService;
        this.snackBar = snackBar;
        this.router = router;
        this.apiErrorMessage = null;
        this.loading = true;
        this.cityUnlockPrice = 14.99;
        this.cityUnlockPriceLabel = '14,99';
        this.activeCityId = 'catania';
        this.associatedStructure = null;
        this.vm$ = combineLatest([
            this.appState.activeCityId$.pipe(switchMap((cityId) => this.poiService.getPoisByCity(cityId).pipe(tap(() => {
                this.apiErrorMessage = null;
            }), map((pois) => ({ cityId, pois })), catchError((error) => {
                this.apiErrorMessage = this.describeApiError(error);
                return of({ cityId, pois: [] });
            })))),
            this.geoService.coordinates$.pipe(startWith(null)),
            this.geoService.permission$.pipe(startWith('prompt')),
            this.purchaseService.purchases$.pipe(startWith({ items: [], unlockedPoiIds: [], unlockedCityIds: [] }))
        ]).pipe(map(([cityData, coordinates, permission]) => {
            const fallback = cityFallbackMap[cityData.cityId] || cityFallbackMap['catania'];
            const center = coordinates || fallback;
            const pois = cityData.pois
                .map((poi) => {
                const distanceMeters = this.geoService.distanceInMeters(center, {
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
            })
                .sort((a, b) => a.distanceMeters - b.distanceMeters);
            return {
                nearestPoi: pois[0] || null,
                pois,
                permission
            };
        }), shareReplay({ bufferSize: 1, refCount: true }));
        this.continueTime = 0;
        this.geofenceShown = new Set();
        this.destroy$ = new Subject();
        this.restoredScroll = false;
        this.shouldRestoreScroll = this.router.getCurrentNavigation()?.trigger === 'popstate';
    }
    get visibleAssociatedStructure() {
        if (!this.associatedStructure?.structureId) {
            return null;
        }
        const cityIds = this.associationCityIds(this.associatedStructure);
        if (cityIds.length && !cityIds.includes(this.activeCityId)) {
            return null;
        }
        return this.associatedStructure;
    }
    ngOnInit() {
        this.purchaseService.refresh();
        void this.geoService.requestPermissionAndTrack();
        combineLatest([this.appState.activeCityId$, this.appState.hotelAssociation$])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([cityId, association]) => {
            this.activeCityId = cityId;
            this.associatedStructure = association;
        });
        this.vm$.pipe(takeUntil(this.destroy$)).subscribe((vm) => {
            this.loading = false;
            this.restoreScrollPosition();
            if (vm.nearestPoi && vm.nearestPoi.near && !this.geofenceShown.has(vm.nearestPoi.id)) {
                const nearestPoi = vm.nearestPoi;
                this.geofenceShown.add(nearestPoi.id);
                const ref = this.snackBar.open(`Sei davanti a ${nearestPoi.name}. Avvia audio?`, 'Avvia', {
                    duration: 4500
                });
                ref.onAction().subscribe(() => {
                    this.saveScrollPosition();
                    void this.router.navigate(['/player', nearestPoi.id], { queryParams: { preview: false } });
                });
            }
        });
        const latest = this.playerService.getLatestProgress();
        if (latest) {
            this.continueTime = latest.currentTime;
            this.poiService
                .getPoiById(latest.poiId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                next: (poi) => {
                    this.continuePoi = poi;
                }
            });
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    askLocationAgain() {
        void this.geoService.requestPermissionAndTrack();
    }
    onMainCta(poi) {
        if (poi.unlocked) {
            this.playPoi(poi, false);
            return;
        }
        this.purchasePoi(poi);
    }
    playPoi(poi, preview) {
        this.saveScrollPosition();
        void this.router.navigate(['/player', poi.id], {
            queryParams: { preview }
        });
    }
    openPoi(poiId) {
        this.saveScrollPosition();
        void this.router.navigate(['/poi', poiId]);
    }
    purchaseCity(cityId) {
        this.purchaseService.purchaseCityBundle(cityId, this.cityName(cityId), this.cityUnlockPrice).subscribe({
            next: (result) => {
                if (result?.action === 'paid') {
                    this.snackBar.open(`Citta sbloccata: ${this.cityName(cityId)}`, 'OK', { duration: 2400 });
                }
            },
            error: () => {
                this.snackBar.open('Operazione non riuscita', 'Chiudi', { duration: 2600 });
            }
        });
    }
    purchasePoi(poi) {
        this.purchaseService.purchasePoiSingle(poi.id, poi.cityId, poi.name, poi.priceSingle).subscribe({
            next: (result) => {
                if (result?.action === 'paid') {
                    this.snackBar.open(`Luogo sbloccato: ${poi.name}`, 'OK', { duration: 2400 });
                }
            },
            error: () => {
                this.snackBar.open('Operazione non riuscita', 'Chiudi', { duration: 2600 });
            }
        });
    }
    navigateToAssociatedStructure() {
        const association = this.visibleAssociatedStructure;
        if (!association?.structureId) {
            return;
        }
        const url = this.structureLocationService.buildExternalDirectionsUrl(association, null);
        if (!url) {
            this.snackBar.open('Dati struttura non disponibili per la navigazione', 'Chiudi', { duration: 2400 });
            return;
        }
        window.open(url, '_blank', 'noopener');
    }
    cityName(cityId) {
        return cityNameMap[cityId] || cityId;
    }
    formatPrice(amount) {
        return amount.toFixed(2).replace('.', ',');
    }
    resumePlayback() {
        if (!this.continuePoi) {
            return;
        }
        this.saveScrollPosition();
        void this.router.navigate(['/player', this.continuePoi.id], {
            queryParams: { preview: false }
        });
    }
    saveScrollPosition() {
        const y = window.scrollY || window.pageYOffset || 0;
        sessionStorage.setItem(homeScrollStorageKey, String(Math.max(0, Math.round(y))));
    }
    restoreScrollPosition() {
        if (this.restoredScroll) {
            return;
        }
        this.restoredScroll = true;
        if (!this.shouldRestoreScroll) {
            sessionStorage.removeItem(homeScrollStorageKey);
            return;
        }
        const raw = sessionStorage.getItem(homeScrollStorageKey);
        if (raw === null) {
            return;
        }
        sessionStorage.removeItem(homeScrollStorageKey);
        const y = Number(raw);
        if (!Number.isFinite(y) || y < 0) {
            return;
        }
        requestAnimationFrame(() => {
            window.scrollTo({ top: y, left: 0, behavior: 'auto' });
        });
    }
    formatDistance(distanceMeters) {
        if (distanceMeters < 1000) {
            return `${Math.round(distanceMeters)} m`;
        }
        return `${(distanceMeters / 1000).toFixed(1)} km`;
    }
    describeApiError(error) {
        if (error instanceof HttpErrorResponse) {
            if (error.status === 0) {
                return 'Backend non raggiungibile. Avvia API su http://localhost:3000.';
            }
            if (error.status === 200) {
                return 'Risposta API non valida (atteso JSON). Controlla proxy Angular e backend.';
            }
            return `Errore API ${error.status}: ${error.statusText || 'risposta non valida'}.`;
        }
        return 'Errore caricamento dati Home.';
    }
    associationCityIds(association) {
        if (Array.isArray(association.cityIds) && association.cityIds.length) {
            return association.cityIds.map((cityId) => String(cityId || '').trim()).filter(Boolean);
        }
        const singleCityId = String(association.cityId || '').trim();
        return singleCityId ? [singleCityId] : [];
    }
    static { this.ɵfac = function HomeComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HomeComponent)(i0.ɵɵdirectiveInject(i1.AppStateService), i0.ɵɵdirectiveInject(i2.GeoService), i0.ɵɵdirectiveInject(i3.PoiService), i0.ɵɵdirectiveInject(i4.PurchaseService), i0.ɵɵdirectiveInject(i5.PlayerService), i0.ɵɵdirectiveInject(i6.StructureLocationService), i0.ɵɵdirectiveInject(i7.MatSnackBar), i0.ɵɵdirectiveInject(i8.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: HomeComponent, selectors: [["app-home"]], standalone: false, decls: 3, vars: 4, consts: [["class", "page-shell home", 4, "ngIf"], ["class", "page-shell home loading-state", 4, "ngIf"], [1, "page-shell", "home"], [1, "home-brand"], ["aria-hidden", "true", 1, "home-logo"], ["src", "/assets/images/logo-tour-citta.svg", "alt", ""], [1, "home-brand-copy"], [1, "page-title"], [1, "page-subtitle"], ["class", "card warning api-warning", 4, "ngIf"], ["class", "card structure-card", 4, "ngIf"], ["class", "card nearest-card", 4, "ngIf"], ["class", "card warning geo-warning", 4, "ngIf"], ["class", "card continue", 4, "ngIf"], [1, "nearby-section"], ["class", "card poi-card", 4, "ngFor", "ngForOf"], [1, "card", "warning", "api-warning"], [1, "hint"], [1, "card", "structure-card"], [1, "structure-head"], [1, "structure-kicker"], [1, "status-chip", "unlocked"], [1, "structure-address"], ["mat-stroked-button", "", "color", "primary", 3, "click"], [1, "card", "nearest-card"], [1, "nearest-head"], [1, "overline"], ["fontSet", "material-icons-round"], [1, "distance-pill"], [1, "nearest-hint"], ["mat-flat-button", "", "color", "primary", 1, "big-cta", 3, "click"], ["mat-stroked-button", "", "color", "primary", "class", "nearest-secondary-cta", 3, "click", 4, "ngIf"], ["mat-button", "", "color", "primary", 1, "nearest-preview-btn", 3, "click"], ["mat-stroked-button", "", "color", "primary", 1, "nearest-secondary-cta", 3, "click"], [1, "card", "warning", "geo-warning"], [1, "card", "continue"], [1, "section-label"], [1, "card", "poi-card"], [1, "poi-card-main"], [3, "click", "src", "alt"], [1, "poi-meta", 3, "click"], [1, "status-chip", 3, "ngClass"], [1, "poi-quick-actions"], ["mat-icon-button", "", "color", "primary", 3, "click"], ["mat-icon-button", "", "color", "primary", 3, "click", 4, "ngIf"], ["class", "poi-unlock-actions", 4, "ngIf"], [1, "poi-unlock-actions"], ["mat-flat-button", "", "color", "primary", 1, "unlock-poi-btn", 3, "click"], ["mat-stroked-button", "", "color", "primary", 1, "unlock-city-btn", 3, "click"], [1, "page-shell", "home", "loading-state"], ["mode", "indeterminate", "diameter", "48"]], template: function HomeComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, HomeComponent_section_0_Template, 18, 6, "section", 0);
            i0.ɵɵpipe(1, "async");
            i0.ɵɵtemplate(2, HomeComponent_section_2_Template, 4, 0, "section", 1);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", i0.ɵɵpipeBind1(1, 2, ctx.vm$));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.loading);
        } }, dependencies: [i9.NgClass, i9.NgForOf, i9.NgIf, i10.MatButton, i10.MatIconButton, i11.MatCard, i12.MatIcon, i13.MatProgressSpinner, i9.AsyncPipe, i14.DurationLabelPipe], styles: [".home[_ngcontent-%COMP%] {\r\n  display: grid;\r\n  gap: 16px;\r\n}\r\n\r\n.home-brand[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 12px;\r\n}\r\n\r\n.home-logo[_ngcontent-%COMP%] {\r\n  width: 44px;\r\n  height: 44px;\r\n  display: grid;\r\n  place-items: center;\r\n  border-radius: 12px;\r\n  background: linear-gradient(145deg, #1769aa 0%, #2f86c8 100%);\r\n  box-shadow: 0 8px 16px rgba(23, 105, 170, 0.22);\r\n\r\n  img {\n    width: 26px;\n    height: 26px;\n    display: block;\n  }\n}\n\r\n.home-brand-copy[_ngcontent-%COMP%] {\n  min-width: 0;\n\r\n  .page-title {\r\n    margin: 0;\r\n  }\r\n\r\n  .page-subtitle {\r\n    margin: 4px 0 0;\r\n  }\n}\n\n.structure-card[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 6px;\n  border: 1px solid rgba(23, 105, 170, 0.16);\n  background:\n    linear-gradient(140deg, rgba(23, 105, 170, 0.05) 0%, rgba(63, 170, 87, 0.04) 55%, rgba(255, 255, 255, 0.96) 100%),\n    #fff;\n\n  h3 {\n    margin: 0;\n    color: #12304f;\n  }\n}\n\n.structure-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.structure-kicker[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: #617591;\n}\n\n.structure-address[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #5d7390;\n  font-size: 0.9rem;\n}\n\n\n.nearest-card[_ngcontent-%COMP%] {\n  position: relative;\n  isolation: isolate;\r\n  overflow: hidden;\r\n  padding: 18px;\r\n  border: 1px solid rgba(23, 105, 170, 0.14);\r\n  box-shadow:\r\n    0 12px 26px rgba(20, 54, 93, 0.08),\r\n    inset 0 1px 0 rgba(255, 255, 255, 0.8);\r\n  background:\r\n    linear-gradient(145deg, rgba(23, 105, 170, 0.08) 0%, rgba(63, 170, 87, 0.05) 52%, rgba(255, 255, 255, 0.98) 100%),\r\n    #fff;\r\n\r\n  > * {\r\n    position: relative;\r\n    z-index: 1;\r\n  }\r\n\r\n  &::before,\r\n  &::after {\r\n    content: '';\r\n    position: absolute;\r\n    pointer-events: none;\r\n  }\r\n\r\n  &::before {\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    height: 56px;\r\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 420 72' fill='none'%3E%3Cpath d='M0 62H420' stroke='%231769aa' stroke-opacity='.08' stroke-width='1.5'/%3E%3Cpath d='M8 62V44h18v18m6 0V34h22v28m8 0V48h14v14m12 0V30h26v32m8 0V40h18v22m10 0V26h22v36m8 0V46h12v16m10 0V36h20v26m8 0V28h24v34m8 0V42h16v20m10 0V32h28v30m8 0V50h14v12m12 0V38h22v24m8 0V28h20v34m8 0V46h12v16' stroke='%231769aa' stroke-opacity='.10' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\");\r\n    background-repeat: no-repeat;\r\n    background-position: center bottom;\r\n    background-size: cover;\r\n    opacity: 0.18;\r\n  }\r\n\r\n  &::after {\r\n    width: 170px;\r\n    height: 94px;\r\n    top: 6px;\r\n    right: 8px;\r\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 170 94' fill='none'%3E%3Cpath d='M8 72C35 45 67 82 96 55c19-18 31-12 56-36' stroke='%233faa57' stroke-opacity='.22' stroke-width='2.2' stroke-linecap='round' stroke-dasharray='4 6'/%3E%3Ccircle cx='10' cy='72' r='4' fill='%233faa57' fill-opacity='.2'/%3E%3Cpath d='M95 21c0-5.2 4.2-9.4 9.4-9.4s9.4 4.2 9.4 9.4c0 8.3-9.4 16.9-9.4 16.9S95 29.3 95 21Z' stroke='%231769aa' stroke-opacity='.24' stroke-width='1.8'/%3E%3Ccircle cx='104.4' cy='21' r='2.6' fill='%231769aa' fill-opacity='.22'/%3E%3C/svg%3E\");\r\n    background-repeat: no-repeat;\r\n    background-size: contain;\r\n    opacity: 0.38;\r\n  }\r\n\r\n  .nearest-head {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    gap: 10px;\r\n  }\r\n\r\n  .overline {\r\n    margin: 0;\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    font-size: 0.8rem;\r\n    letter-spacing: 0.04em;\r\n    text-transform: uppercase;\r\n    color: #5f7491;\r\n\r\n    mat-icon {\r\n      width: 18px;\r\n      height: 18px;\r\n      font-size: 18px;\r\n      color: #1769aa;\r\n    }\r\n  }\r\n\r\n  .distance-pill {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    border-radius: 999px;\r\n    padding: 4px 10px;\r\n    font-size: 0.76rem;\r\n    font-weight: 600;\r\n    color: #1c5e91;\r\n    background: rgba(23, 105, 170, 0.12);\r\n    border: 1px solid rgba(23, 105, 170, 0.18);\r\n  }\r\n\r\n  h2 {\r\n    margin: 6px 0 8px;\r\n    font-size: 1.36rem;\r\n    line-height: 1.32;\r\n    color: #0e2440;\r\n  }\r\n\r\n  .nearest-hint {\r\n    margin: 0 0 12px;\r\n    color: #556b89;\r\n    font-size: 0.92rem;\r\n  }\r\n\r\n  .big-cta {\r\n    background: linear-gradient(120deg, #1769aa 0%, #2383cd 55%, #2c8dd6 100%) !important;\r\n    color: #fff !important;\r\n    box-shadow: 0 10px 18px rgba(23, 105, 170, 0.28);\r\n    transition: box-shadow 160ms ease, transform 120ms ease;\r\n\r\n    &:active {\r\n      transform: translateY(1px);\r\n      box-shadow: 0 7px 14px rgba(23, 105, 170, 0.24);\r\n    }\r\n  }\r\n\r\n  .nearest-secondary-cta {\r\n    margin-top: 10px;\r\n    width: 100%;\r\n    border-radius: 14px !important;\r\n    background: rgba(255, 255, 255, 0.72);\r\n    backdrop-filter: blur(1px);\r\n  }\r\n\r\n  .nearest-preview-btn {\r\n    margin-top: 4px;\r\n    font-weight: 600;\r\n  }\r\n}\r\n\r\n.warning[_ngcontent-%COMP%], \r\n.continue[_ngcontent-%COMP%] {\r\n  padding: 14px;\r\n\r\n  p {\r\n    margin: 0;\r\n    color: #5d6d86;\r\n  }\r\n\r\n  .section-label {\r\n    margin-bottom: 6px;\r\n    font-size: 0.82rem;\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.04em;\r\n  }\r\n\r\n  h3 {\r\n    margin: 0;\r\n  }\r\n\r\n  button {\r\n    margin-top: 10px;\r\n  }\r\n}\r\n\r\n.api-warning[_ngcontent-%COMP%] {\r\n  border: 1px solid #f0cf8e;\r\n  background: #fff7e8;\r\n\r\n  .hint {\r\n    margin-top: 6px;\r\n    color: #89652a;\r\n    font-size: 0.9rem;\r\n  }\r\n}\r\n\r\n.geo-warning[_ngcontent-%COMP%] {\r\n  border: 1px solid rgba(23, 105, 170, 0.16);\r\n  background:\r\n    linear-gradient(135deg, rgba(23, 105, 170, 0.07) 0%, rgba(23, 105, 170, 0.02) 55%, rgba(255, 255, 255, 0.95) 100%),\r\n    #fff;\r\n\r\n  p {\r\n    color: #385676;\r\n  }\r\n}\r\n\r\n.nearby-section[_ngcontent-%COMP%] {\r\n  display: grid;\r\n  gap: 12px;\r\n\r\n  h3 {\r\n    margin: 4px 0;\r\n  }\r\n}\r\n\r\n.poi-card[_ngcontent-%COMP%] {\r\n  padding: 16px;\r\n  display: grid;\r\n  gap: 10px;\r\n}\r\n\r\n.poi-card-main[_ngcontent-%COMP%] {\r\n  display: grid;\r\n  grid-template-columns: 92px 1fr auto;\r\n  gap: 14px;\r\n  align-items: start;\r\n\r\n  img {\r\n    width: 92px;\r\n    height: 74px;\r\n    object-fit: cover;\r\n    border-radius: 12px;\r\n    cursor: pointer;\r\n  }\r\n}\r\n\r\n.poi-meta[_ngcontent-%COMP%] {\r\n  min-width: 0;\r\n  cursor: pointer;\r\n\r\n  h4 {\r\n    margin: 0 0 4px;\r\n    font-size: 1.03rem;\r\n  }\r\n\r\n  p {\r\n    margin: 0 0 8px;\r\n    color: #6f7d95;\r\n    font-size: 0.9rem;\r\n  }\r\n}\r\n\r\n.poi-quick-actions[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: flex-end;\r\n  gap: 4px;\r\n}\r\n\r\n.poi-unlock-actions[_ngcontent-%COMP%] {\r\n  display: grid;\r\n  gap: 8px;\r\n  margin-top: 4px;\r\n\r\n  .unlock-poi-btn,\r\n  .unlock-city-btn {\r\n    width: 100%;\r\n    height: 34px;\r\n    padding: 0 10px;\r\n    border-radius: 10px;\r\n    font-size: 0.78rem;\r\n    line-height: 1;\r\n  }\r\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HomeComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-home', template: "<section class=\"page-shell home\" *ngIf=\"vm$ | async as vm\">\n  <header class=\"home-brand\">\n    <div class=\"home-logo\" aria-hidden=\"true\">\n      <img src=\"/assets/images/logo-tour-citta.svg\" alt=\"\" />\n    </div>\n    <div class=\"home-brand-copy\">\n      <h1 class=\"page-title\">Tour Citt\u00E0</h1>\n      <p class=\"page-subtitle\">Punti di interesse vicini</p>\n    </div>\n  </header>\n\n  <mat-card class=\"card warning api-warning\" *ngIf=\"apiErrorMessage\">\n    <p>{{ apiErrorMessage }}</p>\n    <p class=\"hint\">Controlla che backend e proxy siano attivi.</p>\n  </mat-card>\n\n  <mat-card class=\"card structure-card\" *ngIf=\"visibleAssociatedStructure as structure\">\n    <div class=\"structure-head\">\n      <p class=\"structure-kicker\">Struttura associata</p>\n      <span class=\"status-chip unlocked\">Attiva</span>\n    </div>\n    <h3>{{ structure.structureName }}</h3>\n    <p class=\"structure-address\">{{ structure.structureAddress }}</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"navigateToAssociatedStructure()\">Naviga verso struttura</button>\n  </mat-card>\n\n  <mat-card class=\"card nearest-card\" *ngIf=\"vm.nearestPoi as nearest\">\n    <div class=\"nearest-head\">\n      <p class=\"overline\">\n        <mat-icon fontSet=\"material-icons-round\">near_me</mat-icon>\n        Sei vicino a\n      </p>\n      <span class=\"distance-pill\">{{ nearest.distanceLabel }}</span>\n    </div>\n    <h2>{{ nearest.name }}</h2>\n    <p class=\"nearest-hint\">Perfetto per iniziare ora il tour nelle vicinanze.</p>\n\n    <button mat-flat-button color=\"primary\" class=\"big-cta\" (click)=\"onMainCta(nearest)\">\n      {{\n        nearest.unlocked\n          ? 'Riproduci audio guida'\n          : ('Sblocca questo luogo \u20AC' + formatPrice(nearest.priceSingle))\n      }}\n    </button>\n\n    <button\n      mat-stroked-button\n      color=\"primary\"\n      class=\"nearest-secondary-cta\"\n      *ngIf=\"!nearest.unlocked\"\n      (click)=\"purchaseCity(nearest.cityId)\"\n    >\n      Oppure sblocca {{ cityName(nearest.cityId) }} \u20AC{{ cityUnlockPriceLabel }}\n    </button>\n\n    <button mat-button color=\"primary\" class=\"nearest-preview-btn\" (click)=\"playPoi(nearest, true)\">Ascolta preview</button>\n  </mat-card>\n\n  <mat-card class=\"card warning geo-warning\" *ngIf=\"vm.permission === 'denied'\">\n    <p>Geolocalizzazione negata. Sto usando il centro citt\u00E0.</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"askLocationAgain()\">Riprova permesso</button>\n  </mat-card>\n\n  <mat-card class=\"card continue\" *ngIf=\"continuePoi\">\n    <p class=\"section-label\">Continua ascolto</p>\n    <h3>{{ continuePoi.name }}</h3>\n    <p>Riprendi da {{ continueTime | durationLabel }}</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"resumePlayback()\">Riprendi</button>\n  </mat-card>\n\n  <section class=\"nearby-section\">\n    <h3>Vicino a te</h3>\n\n    <mat-card class=\"card poi-card\" *ngFor=\"let poi of vm.pois\">\n      <div class=\"poi-card-main\">\n        <img [src]=\"poi.imageUrl\" [alt]=\"poi.name\" (click)=\"openPoi(poi.id)\" />\n\n        <div class=\"poi-meta\" (click)=\"openPoi(poi.id)\">\n          <h4>{{ poi.name }}</h4>\n          <p>{{ poi.distanceLabel }} \u00B7 {{ poi.durationSec | durationLabel }}</p>\n          <span class=\"status-chip\" [ngClass]=\"poi.unlocked ? 'unlocked' : (poi.near ? 'near' : 'locked')\">\n            {{ poi.unlocked ? 'Sbloccato' : (poi.near ? 'Vicino' : 'Bloccato') }}\n          </span>\n        </div>\n\n        <div class=\"poi-quick-actions\">\n          <button mat-icon-button color=\"primary\" (click)=\"playPoi(poi, true)\">\n            <mat-icon fontSet=\"material-icons-round\">play_circle</mat-icon>\n          </button>\n\n          <button mat-icon-button color=\"primary\" *ngIf=\"poi.unlocked\" (click)=\"playPoi(poi, false)\">\n            <mat-icon fontSet=\"material-icons-round\">headphones</mat-icon>\n          </button>\n        </div>\n      </div>\n\n      <div class=\"poi-unlock-actions\" *ngIf=\"!poi.unlocked\">\n        <button mat-flat-button color=\"primary\" class=\"unlock-poi-btn\" (click)=\"purchasePoi(poi)\">\n          Sblocca luogo \u20AC{{ formatPrice(poi.priceSingle) }}\n        </button>\n\n        <button mat-stroked-button color=\"primary\" class=\"unlock-city-btn\" (click)=\"purchaseCity(poi.cityId)\">\n          Sblocca {{ cityName(poi.cityId) }} \u20AC{{ cityUnlockPriceLabel }}\n        </button>\n      </div>\n    </mat-card>\n  </section>\n</section>\n\n<section class=\"page-shell home loading-state\" *ngIf=\"loading\">\n  <mat-progress-spinner mode=\"indeterminate\" diameter=\"48\"></mat-progress-spinner>\n  <p>Caricamento punti di interesse...</p>\n</section>\n", styles: [".home {\r\n  display: grid;\r\n  gap: 16px;\r\n}\r\n\r\n.home-brand {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 12px;\r\n}\r\n\r\n.home-logo {\r\n  width: 44px;\r\n  height: 44px;\r\n  display: grid;\r\n  place-items: center;\r\n  border-radius: 12px;\r\n  background: linear-gradient(145deg, #1769aa 0%, #2f86c8 100%);\r\n  box-shadow: 0 8px 16px rgba(23, 105, 170, 0.22);\r\n\r\n  img {\n    width: 26px;\n    height: 26px;\n    display: block;\n  }\n}\n\r\n.home-brand-copy {\n  min-width: 0;\n\r\n  .page-title {\r\n    margin: 0;\r\n  }\r\n\r\n  .page-subtitle {\r\n    margin: 4px 0 0;\r\n  }\n}\n\n.structure-card {\n  padding: 14px;\n  display: grid;\n  gap: 6px;\n  border: 1px solid rgba(23, 105, 170, 0.16);\n  background:\n    linear-gradient(140deg, rgba(23, 105, 170, 0.05) 0%, rgba(63, 170, 87, 0.04) 55%, rgba(255, 255, 255, 0.96) 100%),\n    #fff;\n\n  h3 {\n    margin: 0;\n    color: #12304f;\n  }\n}\n\n.structure-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.structure-kicker {\n  margin: 0;\n  font-size: 0.74rem;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: #617591;\n}\n\n.structure-address {\n  margin: 0;\n  color: #5d7390;\n  font-size: 0.9rem;\n}\n\n\n.nearest-card {\n  position: relative;\n  isolation: isolate;\r\n  overflow: hidden;\r\n  padding: 18px;\r\n  border: 1px solid rgba(23, 105, 170, 0.14);\r\n  box-shadow:\r\n    0 12px 26px rgba(20, 54, 93, 0.08),\r\n    inset 0 1px 0 rgba(255, 255, 255, 0.8);\r\n  background:\r\n    linear-gradient(145deg, rgba(23, 105, 170, 0.08) 0%, rgba(63, 170, 87, 0.05) 52%, rgba(255, 255, 255, 0.98) 100%),\r\n    #fff;\r\n\r\n  > * {\r\n    position: relative;\r\n    z-index: 1;\r\n  }\r\n\r\n  &::before,\r\n  &::after {\r\n    content: '';\r\n    position: absolute;\r\n    pointer-events: none;\r\n  }\r\n\r\n  &::before {\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    height: 56px;\r\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 420 72' fill='none'%3E%3Cpath d='M0 62H420' stroke='%231769aa' stroke-opacity='.08' stroke-width='1.5'/%3E%3Cpath d='M8 62V44h18v18m6 0V34h22v28m8 0V48h14v14m12 0V30h26v32m8 0V40h18v22m10 0V26h22v36m8 0V46h12v16m10 0V36h20v26m8 0V28h24v34m8 0V42h16v20m10 0V32h28v30m8 0V50h14v12m12 0V38h22v24m8 0V28h20v34m8 0V46h12v16' stroke='%231769aa' stroke-opacity='.10' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\");\r\n    background-repeat: no-repeat;\r\n    background-position: center bottom;\r\n    background-size: cover;\r\n    opacity: 0.18;\r\n  }\r\n\r\n  &::after {\r\n    width: 170px;\r\n    height: 94px;\r\n    top: 6px;\r\n    right: 8px;\r\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 170 94' fill='none'%3E%3Cpath d='M8 72C35 45 67 82 96 55c19-18 31-12 56-36' stroke='%233faa57' stroke-opacity='.22' stroke-width='2.2' stroke-linecap='round' stroke-dasharray='4 6'/%3E%3Ccircle cx='10' cy='72' r='4' fill='%233faa57' fill-opacity='.2'/%3E%3Cpath d='M95 21c0-5.2 4.2-9.4 9.4-9.4s9.4 4.2 9.4 9.4c0 8.3-9.4 16.9-9.4 16.9S95 29.3 95 21Z' stroke='%231769aa' stroke-opacity='.24' stroke-width='1.8'/%3E%3Ccircle cx='104.4' cy='21' r='2.6' fill='%231769aa' fill-opacity='.22'/%3E%3C/svg%3E\");\r\n    background-repeat: no-repeat;\r\n    background-size: contain;\r\n    opacity: 0.38;\r\n  }\r\n\r\n  .nearest-head {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    gap: 10px;\r\n  }\r\n\r\n  .overline {\r\n    margin: 0;\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    font-size: 0.8rem;\r\n    letter-spacing: 0.04em;\r\n    text-transform: uppercase;\r\n    color: #5f7491;\r\n\r\n    mat-icon {\r\n      width: 18px;\r\n      height: 18px;\r\n      font-size: 18px;\r\n      color: #1769aa;\r\n    }\r\n  }\r\n\r\n  .distance-pill {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    border-radius: 999px;\r\n    padding: 4px 10px;\r\n    font-size: 0.76rem;\r\n    font-weight: 600;\r\n    color: #1c5e91;\r\n    background: rgba(23, 105, 170, 0.12);\r\n    border: 1px solid rgba(23, 105, 170, 0.18);\r\n  }\r\n\r\n  h2 {\r\n    margin: 6px 0 8px;\r\n    font-size: 1.36rem;\r\n    line-height: 1.32;\r\n    color: #0e2440;\r\n  }\r\n\r\n  .nearest-hint {\r\n    margin: 0 0 12px;\r\n    color: #556b89;\r\n    font-size: 0.92rem;\r\n  }\r\n\r\n  .big-cta {\r\n    background: linear-gradient(120deg, #1769aa 0%, #2383cd 55%, #2c8dd6 100%) !important;\r\n    color: #fff !important;\r\n    box-shadow: 0 10px 18px rgba(23, 105, 170, 0.28);\r\n    transition: box-shadow 160ms ease, transform 120ms ease;\r\n\r\n    &:active {\r\n      transform: translateY(1px);\r\n      box-shadow: 0 7px 14px rgba(23, 105, 170, 0.24);\r\n    }\r\n  }\r\n\r\n  .nearest-secondary-cta {\r\n    margin-top: 10px;\r\n    width: 100%;\r\n    border-radius: 14px !important;\r\n    background: rgba(255, 255, 255, 0.72);\r\n    backdrop-filter: blur(1px);\r\n  }\r\n\r\n  .nearest-preview-btn {\r\n    margin-top: 4px;\r\n    font-weight: 600;\r\n  }\r\n}\r\n\r\n.warning,\r\n.continue {\r\n  padding: 14px;\r\n\r\n  p {\r\n    margin: 0;\r\n    color: #5d6d86;\r\n  }\r\n\r\n  .section-label {\r\n    margin-bottom: 6px;\r\n    font-size: 0.82rem;\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.04em;\r\n  }\r\n\r\n  h3 {\r\n    margin: 0;\r\n  }\r\n\r\n  button {\r\n    margin-top: 10px;\r\n  }\r\n}\r\n\r\n.api-warning {\r\n  border: 1px solid #f0cf8e;\r\n  background: #fff7e8;\r\n\r\n  .hint {\r\n    margin-top: 6px;\r\n    color: #89652a;\r\n    font-size: 0.9rem;\r\n  }\r\n}\r\n\r\n.geo-warning {\r\n  border: 1px solid rgba(23, 105, 170, 0.16);\r\n  background:\r\n    linear-gradient(135deg, rgba(23, 105, 170, 0.07) 0%, rgba(23, 105, 170, 0.02) 55%, rgba(255, 255, 255, 0.95) 100%),\r\n    #fff;\r\n\r\n  p {\r\n    color: #385676;\r\n  }\r\n}\r\n\r\n.nearby-section {\r\n  display: grid;\r\n  gap: 12px;\r\n\r\n  h3 {\r\n    margin: 4px 0;\r\n  }\r\n}\r\n\r\n.poi-card {\r\n  padding: 16px;\r\n  display: grid;\r\n  gap: 10px;\r\n}\r\n\r\n.poi-card-main {\r\n  display: grid;\r\n  grid-template-columns: 92px 1fr auto;\r\n  gap: 14px;\r\n  align-items: start;\r\n\r\n  img {\r\n    width: 92px;\r\n    height: 74px;\r\n    object-fit: cover;\r\n    border-radius: 12px;\r\n    cursor: pointer;\r\n  }\r\n}\r\n\r\n.poi-meta {\r\n  min-width: 0;\r\n  cursor: pointer;\r\n\r\n  h4 {\r\n    margin: 0 0 4px;\r\n    font-size: 1.03rem;\r\n  }\r\n\r\n  p {\r\n    margin: 0 0 8px;\r\n    color: #6f7d95;\r\n    font-size: 0.9rem;\r\n  }\r\n}\r\n\r\n.poi-quick-actions {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: flex-end;\r\n  gap: 4px;\r\n}\r\n\r\n.poi-unlock-actions {\r\n  display: grid;\r\n  gap: 8px;\r\n  margin-top: 4px;\r\n\r\n  .unlock-poi-btn,\r\n  .unlock-city-btn {\r\n    width: 100%;\r\n    height: 34px;\r\n    padding: 0 10px;\r\n    border-radius: 10px;\r\n    font-size: 0.78rem;\r\n    line-height: 1;\r\n  }\r\n}\r\n"] }]
    }], () => [{ type: i1.AppStateService }, { type: i2.GeoService }, { type: i3.PoiService }, { type: i4.PurchaseService }, { type: i5.PlayerService }, { type: i6.StructureLocationService }, { type: i7.MatSnackBar }, { type: i8.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "src/app/features/home/home.component.ts", lineNumber: 50 }); })();
