import { Component } from '@angular/core';
import { catchError, combineLatest, map, of, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { divIcon, latLng, marker, tileLayer } from 'leaflet';
import { environment } from '../../../environments/environment';
import { PoiMapSheetComponent } from '../../shared/components/poi-map-sheet/poi-map-sheet.component';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/app-state.service";
import * as i2 from "../../core/services/geo.service";
import * as i3 from "../../core/services/poi.service";
import * as i4 from "../../core/services/purchase.service";
import * as i5 from "@angular/material/bottom-sheet";
import * as i6 from "@angular/material/snack-bar";
import * as i7 from "@angular/router";
import * as i8 from "@angular/common";
import * as i9 from "@angular/material/button";
import * as i10 from "@angular/material/card";
import * as i11 from "@angular/material/icon";
import * as i12 from "@angular/material/progress-spinner";
import * as i13 from "@bluehalo/ngx-leaflet";
function MapComponent_mat_card_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 8)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.apiErrorMessage);
} }
function MapComponent_section_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 9);
    i0.ɵɵelement(1, "mat-progress-spinner", 10);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Caricamento mappa...");
    i0.ɵɵelementEnd()();
} }
function MapComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 11);
    i0.ɵɵlistener("leafletMapReady", function MapComponent_div_8_Template_div_leafletMapReady_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onMapReady($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("leafletOptions", ctx_r0.mapOptions)("leafletLayers", ctx_r0.markerLayers);
} }
function MapComponent_button_9_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 12);
    i0.ɵɵlistener("click", function MapComponent_button_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.centerOnMe()); });
    i0.ɵɵelementStart(1, "mat-icon", 13);
    i0.ɵɵtext(2, "my_location");
    i0.ɵɵelementEnd()();
} }
const cityFallbackMap = {
    catania: { lat: 37.5079, lng: 15.083 },
    siracusa: { lat: 37.067, lng: 15.2866 },
    taormina: { lat: 37.8531, lng: 15.2899 }
};
const cityNameMap = {
    catania: 'Catania',
    siracusa: 'Siracusa',
    taormina: 'Taormina'
};
export class MapComponent {
    constructor(appState, geoService, poiService, purchaseService, bottomSheet, snackBar, router) {
        this.appState = appState;
        this.geoService = geoService;
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.bottomSheet = bottomSheet;
        this.snackBar = snackBar;
        this.router = router;
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
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.purchaseService.refresh();
        void this.geoService.requestPermissionAndTrack();
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
            this.poiCount = prepared.length;
            this.markerLayers = prepared.map((poi) => this.createPoiMarker(poi));
            this.isLoading = false;
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    onMapReady(map) {
        this.mapRef = map;
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
    createPoiMarker(poi) {
        const markerStatusClass = poi.near ? 'poi-near' : poi.unlocked ? 'poi-unlocked' : 'poi-locked';
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
                    unlocked: poi.unlocked
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
    formatDistance(distanceMeters) {
        if (distanceMeters < 1000) {
            return `${Math.round(distanceMeters)} m`;
        }
        return `${(distanceMeters / 1000).toFixed(1)} km`;
    }
    cityName(cityId) {
        return cityNameMap[cityId] || cityId;
    }
    static { this.ɵfac = function MapComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MapComponent)(i0.ɵɵdirectiveInject(i1.AppStateService), i0.ɵɵdirectiveInject(i2.GeoService), i0.ɵɵdirectiveInject(i3.PoiService), i0.ɵɵdirectiveInject(i4.PurchaseService), i0.ɵɵdirectiveInject(i5.MatBottomSheet), i0.ɵɵdirectiveInject(i6.MatSnackBar), i0.ɵɵdirectiveInject(i7.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MapComponent, selectors: [["app-map"]], standalone: false, decls: 10, vars: 5, consts: [[1, "map-page"], [1, "map-header"], [1, "page-title"], [1, "page-subtitle"], ["class", "card warning api-warning", 4, "ngIf"], ["class", "loading-shell", 4, "ngIf"], ["class", "map-frame", "leaflet", "", 3, "leafletOptions", "leafletLayers", "leafletMapReady", 4, "ngIf"], ["mat-fab", "", "color", "primary", "class", "center-btn", "aria-label", "Centra su di me", 3, "click", 4, "ngIf"], [1, "card", "warning", "api-warning"], [1, "loading-shell"], ["mode", "indeterminate", "diameter", "48"], ["leaflet", "", 1, "map-frame", 3, "leafletMapReady", "leafletOptions", "leafletLayers"], ["mat-fab", "", "color", "primary", "aria-label", "Centra su di me", 1, "center-btn", 3, "click"], ["fontSet", "material-icons-round"]], template: function MapComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "h1", 2);
            i0.ɵɵtext(3, "Mappa");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p", 3);
            i0.ɵɵtext(5);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(6, MapComponent_mat_card_6_Template, 3, 1, "mat-card", 4)(7, MapComponent_section_7_Template, 4, 0, "section", 5)(8, MapComponent_div_8_Template, 1, 2, "div", 6)(9, MapComponent_button_9_Template, 3, 0, "button", 7);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate1("", ctx.poiCount, " punti di interesse disponibili intorno a te");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.apiErrorMessage);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.isLoading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.isLoading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.isLoading);
        } }, dependencies: [i8.NgIf, i9.MatFabButton, i10.MatCard, i11.MatIcon, i12.MatProgressSpinner, i13.LeafletDirective, i13.LeafletLayersDirective], styles: [".map-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding: 16px 12px 92px;\n  display: grid;\n  gap: 12px;\n}\n\n.map-header[_ngcontent-%COMP%] {\n  padding: 0 4px;\n}\n\n.map-frame[_ngcontent-%COMP%] {\n  height: calc(100vh - 190px);\n  min-height: 460px;\n  border-radius: 22px;\n  overflow: hidden;\n  box-shadow: 0 10px 30px rgba(20, 38, 62, 0.12);\n}\n\n.loading-shell[_ngcontent-%COMP%] {\n  min-height: 300px;\n}\n\n.api-warning[_ngcontent-%COMP%] {\n  border: 1px solid #f0cf8e;\n  background: #fff7e8;\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #89652a;\n  }\n}\n\n.center-btn[_ngcontent-%COMP%] {\n  position: fixed;\n  right: 22px;\n  bottom: 96px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MapComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-map', template: "<section class=\"map-page\">\n  <header class=\"map-header\">\n    <h1 class=\"page-title\">Mappa</h1>\n    <p class=\"page-subtitle\">{{ poiCount }} punti di interesse disponibili intorno a te</p>\n  </header>\n\n  <mat-card class=\"card warning api-warning\" *ngIf=\"apiErrorMessage\">\n    <p>{{ apiErrorMessage }}</p>\n  </mat-card>\n\n  <section class=\"loading-shell\" *ngIf=\"isLoading\">\n    <mat-progress-spinner mode=\"indeterminate\" diameter=\"48\"></mat-progress-spinner>\n    <p>Caricamento mappa...</p>\n  </section>\n\n  <div\n    class=\"map-frame\"\n    *ngIf=\"!isLoading\"\n    leaflet\n    [leafletOptions]=\"mapOptions\"\n    [leafletLayers]=\"markerLayers\"\n    (leafletMapReady)=\"onMapReady($event)\"\n  ></div>\n\n  <button\n    mat-fab\n    color=\"primary\"\n    class=\"center-btn\"\n    *ngIf=\"!isLoading\"\n    (click)=\"centerOnMe()\"\n    aria-label=\"Centra su di me\"\n  >\n    <mat-icon fontSet=\"material-icons-round\">my_location</mat-icon>\n  </button>\n</section>\n", styles: [".map-page {\n  min-height: 100vh;\n  padding: 16px 12px 92px;\n  display: grid;\n  gap: 12px;\n}\n\n.map-header {\n  padding: 0 4px;\n}\n\n.map-frame {\n  height: calc(100vh - 190px);\n  min-height: 460px;\n  border-radius: 22px;\n  overflow: hidden;\n  box-shadow: 0 10px 30px rgba(20, 38, 62, 0.12);\n}\n\n.loading-shell {\n  min-height: 300px;\n}\n\n.api-warning {\n  border: 1px solid #f0cf8e;\n  background: #fff7e8;\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #89652a;\n  }\n}\n\n.center-btn {\n  position: fixed;\n  right: 22px;\n  bottom: 96px;\n}\n"] }]
    }], () => [{ type: i1.AppStateService }, { type: i2.GeoService }, { type: i3.PoiService }, { type: i4.PurchaseService }, { type: i5.MatBottomSheet }, { type: i6.MatSnackBar }, { type: i7.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MapComponent, { className: "MapComponent", filePath: "frontend/src/app/features/map/map.component.ts", lineNumber: 52 }); })();
