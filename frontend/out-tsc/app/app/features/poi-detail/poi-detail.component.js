import { Component } from '@angular/core';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../../core/services/poi.service";
import * as i3 from "../../core/services/purchase.service";
import * as i4 from "../../core/services/app-state.service";
import * as i5 from "../../core/services/geo.service";
import * as i6 from "@angular/common";
import * as i7 from "@angular/material/snack-bar";
import * as i8 from "@angular/material/button";
import * as i9 from "@angular/material/card";
import * as i10 from "@angular/material/icon";
import * as i11 from "@angular/material/progress-spinner";
import * as i12 from "../../shared/pipes/duration-label.pipe";
function PoiDetailComponent_section_0_button_22_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 17);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_button_22_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openPlayer(false)); });
    i0.ɵɵtext(1, " Riproduci audio ");
    i0.ɵɵelementEnd();
} }
function PoiDetailComponent_section_0_ng_template_23_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 17);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_ng_template_23_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.purchasePoi()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 14);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_ng_template_23_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.purchaseCity()); });
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const currentPoi_r5 = i0.ɵɵnextContext().ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" Sblocca questo luogo \u20AC", ctx_r1.formatPrice(currentPoi_r5.priceSingle), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" Sblocca ", ctx_r1.cityName(currentPoi_r5.cityId), " \u20AC", ctx_r1.cityUnlockPriceLabel, " ");
} }
function PoiDetailComponent_section_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 3)(1, "button", 4);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBack()); });
    i0.ɵɵelementStart(2, "mat-icon", 5);
    i0.ɵɵtext(3, "arrow_back");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(4, "img", 6);
    i0.ɵɵelementStart(5, "div", 7)(6, "div")(7, "h1", 8);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 9);
    i0.ɵɵtext(10);
    i0.ɵɵpipe(11, "durationLabel");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "button", 10);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleFavorite()); });
    i0.ɵɵelementStart(13, "mat-icon", 5);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(15, "p", 11);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "p", 12);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "section", 13)(20, "button", 14);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_Template_button_click_20_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openPlayer(true)); });
    i0.ɵɵtext(21, "Ascolta preview");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(22, PoiDetailComponent_section_0_button_22_Template, 2, 0, "button", 15)(23, PoiDetailComponent_section_0_ng_template_23_Template, 4, 3, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementStart(25, "button", 16);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.startNavigation()); });
    i0.ɵɵelementStart(26, "mat-icon", 5);
    i0.ɵɵtext(27, "near_me");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(28, " Avvia navigazione in app ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const currentPoi_r5 = ctx.ngIf;
    const lockCta_r6 = i0.ɵɵreference(24);
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("src", currentPoi_r5.imageUrl, i0.ɵɵsanitizeUrl)("alt", currentPoi_r5.name);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(currentPoi_r5.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r1.distanceLabel, " \u00B7 ", i0.ɵɵpipeBind1(11, 10, currentPoi_r5.durationSec), "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.isFavorite ? "favorite" : "favorite_border");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(currentPoi_r5.descriptionShort);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(currentPoi_r5.descriptionLong);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r1.unlocked)("ngIfElse", lockCta_r6);
} }
function PoiDetailComponent_section_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 18);
    i0.ɵɵelement(1, "mat-progress-spinner", 19);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Caricamento dettaglio...");
    i0.ɵɵelementEnd()();
} }
function PoiDetailComponent_section_2_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 3)(1, "mat-card", 20)(2, "p");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 21);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_2_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBack()); });
    i0.ɵɵtext(5, "Torna alla home");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.loadError ? "Punto di interesse non disponibile o backend non raggiungibile." : "Contenuto non trovato.");
} }
const cityNameMap = {
    catania: 'Catania',
    siracusa: 'Siracusa',
    taormina: 'Taormina'
};
export class PoiDetailComponent {
    constructor(route, router, poiService, purchaseService, appState, geoService, location, snackBar) {
        this.route = route;
        this.router = router;
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.appState = appState;
        this.geoService = geoService;
        this.location = location;
        this.snackBar = snackBar;
        this.distanceLabel = '--';
        this.unlocked = false;
        this.isFavorite = false;
        this.loading = true;
        this.loadError = false;
        this.cityUnlockPrice = 14.99;
        this.cityUnlockPriceLabel = '14,99';
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.purchaseService.refresh();
        this.route.paramMap
            .pipe(tap(() => {
            this.loading = true;
            this.loadError = false;
            this.poi = undefined;
        }), switchMap((params) => this.poiService.getPoiById(String(params.get('id')))), takeUntil(this.destroy$))
            .subscribe({
            next: (poi) => {
                this.poi = poi;
                this.isFavorite = this.appState.isFavorite(poi.id);
                this.unlocked = this.purchaseService.isPoiUnlocked(poi.id, poi.cityId);
                this.updateDistanceLabel();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.loadError = true;
                this.poi = undefined;
            }
        });
        this.geoService.coordinates$.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateDistanceLabel());
        this.purchaseService.purchases$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.poi) {
                this.unlocked = this.purchaseService.isPoiUnlocked(this.poi.id, this.poi.cityId);
            }
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    openPlayer(preview) {
        if (!this.poi) {
            return;
        }
        void this.router.navigate(['/player', this.poi.id], { queryParams: { preview } });
    }
    startNavigation() {
        if (!this.poi) {
            return;
        }
        this.appState.setActiveCity(this.poi.cityId);
        void this.router.navigate(['/map'], {
            queryParams: {
                poiId: this.poi.id,
                nav: 1
            }
        });
    }
    purchasePoi() {
        if (!this.poi) {
            return;
        }
        this.purchaseService.purchasePoiSingle(this.poi.id, this.poi.cityId, this.poi.name, this.poi.priceSingle).subscribe({
            next: (result) => {
                if (result?.action === 'paid') {
                    this.unlocked = true;
                    this.snackBar.open(`Luogo sbloccato: ${this.poi?.name || ''}`, 'OK', { duration: 2400 });
                }
            },
            error: () => {
                this.snackBar.open('Operazione non riuscita', 'Chiudi', { duration: 2400 });
            }
        });
    }
    purchaseCity() {
        if (!this.poi) {
            return;
        }
        this.purchaseService.purchaseCityBundle(this.poi.cityId, this.cityName(this.poi.cityId), this.cityUnlockPrice).subscribe({
            next: (result) => {
                if (result?.action === 'paid') {
                    this.unlocked = true;
                    this.snackBar.open(`Citta sbloccata: ${this.cityName(this.poi?.cityId || '')}`, 'OK', { duration: 2400 });
                }
            },
            error: () => {
                this.snackBar.open('Operazione non riuscita', 'Chiudi', { duration: 2400 });
            }
        });
    }
    formatPrice(amount) {
        return amount.toFixed(2).replace('.', ',');
    }
    cityName(cityId) {
        return cityNameMap[cityId] || cityId;
    }
    toggleFavorite() {
        if (!this.poi) {
            return;
        }
        this.appState.toggleFavorite(this.poi.id);
        this.isFavorite = this.appState.isFavorite(this.poi.id);
    }
    goBack() {
        if (window.history.length > 1) {
            this.location.back();
            return;
        }
        void this.router.navigate(['/home']);
    }
    updateDistanceLabel() {
        if (!this.poi) {
            return;
        }
        const current = this.geoService.currentCoordinates;
        if (!current) {
            this.distanceLabel = 'Posizione non disponibile';
            return;
        }
        const distance = this.geoService.distanceInMeters(current, {
            lat: this.poi.lat,
            lng: this.poi.lng
        });
        this.distanceLabel = distance < 1000 ? `${Math.round(distance)} m` : `${(distance / 1000).toFixed(1)} km`;
    }
    static { this.ɵfac = function PoiDetailComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PoiDetailComponent)(i0.ɵɵdirectiveInject(i1.ActivatedRoute), i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.PoiService), i0.ɵɵdirectiveInject(i3.PurchaseService), i0.ɵɵdirectiveInject(i4.AppStateService), i0.ɵɵdirectiveInject(i5.GeoService), i0.ɵɵdirectiveInject(i6.Location), i0.ɵɵdirectiveInject(i7.MatSnackBar)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PoiDetailComponent, selectors: [["app-poi-detail"]], standalone: false, decls: 3, vars: 3, consts: [["lockCta", ""], ["class", "page-shell poi-detail", 4, "ngIf"], ["class", "page-shell loading-shell", 4, "ngIf"], [1, "page-shell", "poi-detail"], ["mat-icon-button", "", "aria-label", "Torna indietro", 1, "back-btn", 3, "click"], ["fontSet", "material-icons-round"], [1, "hero-image", 3, "src", "alt"], [1, "title-row"], [1, "page-title"], [1, "page-subtitle"], ["mat-icon-button", "", "color", "primary", 3, "click"], [1, "short"], [1, "long"], [1, "actions"], ["mat-stroked-button", "", "color", "primary", 1, "big-cta", 3, "click"], ["mat-flat-button", "", "color", "primary", "class", "big-cta", 3, "click", 4, "ngIf", "ngIfElse"], ["mat-flat-button", "", "color", "accent", 1, "big-cta", "nav-cta", 3, "click"], ["mat-flat-button", "", "color", "primary", 1, "big-cta", 3, "click"], [1, "page-shell", "loading-shell"], ["mode", "indeterminate", "diameter", "48"], [1, "card", "warning"], ["mat-stroked-button", "", "color", "primary", 3, "click"]], template: function PoiDetailComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, PoiDetailComponent_section_0_Template, 29, 12, "section", 1)(1, PoiDetailComponent_section_1_Template, 4, 0, "section", 2)(2, PoiDetailComponent_section_2_Template, 6, 1, "section", 1);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.poi);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && !ctx.poi);
        } }, dependencies: [i6.NgIf, i8.MatButton, i8.MatIconButton, i9.MatCard, i10.MatIcon, i11.MatProgressSpinner, i12.DurationLabelPipe], styles: [".poi-detail[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 14px;\n}\n\n.back-btn[_ngcontent-%COMP%] {\n  width: fit-content;\n}\n\n.title-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.short[_ngcontent-%COMP%], \n.long[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #4f607a;\n  line-height: 1.5;\n}\n\n.long[_ngcontent-%COMP%] {\r\n  color: #516683;\r\n  white-space: pre-line;\r\n}\n\n.actions[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n}\n\n.nav-cta[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n\n.warning[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5d6d86;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PoiDetailComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-poi-detail', template: "<section class=\"page-shell poi-detail\" *ngIf=\"poi as currentPoi\">\n  <button mat-icon-button class=\"back-btn\" (click)=\"goBack()\" aria-label=\"Torna indietro\">\n    <mat-icon fontSet=\"material-icons-round\">arrow_back</mat-icon>\n  </button>\n\n  <img class=\"hero-image\" [src]=\"currentPoi.imageUrl\" [alt]=\"currentPoi.name\" />\n\n  <div class=\"title-row\">\n    <div>\n      <h1 class=\"page-title\">{{ currentPoi.name }}</h1>\n      <p class=\"page-subtitle\">{{ distanceLabel }} \u00B7 {{ currentPoi.durationSec | durationLabel }}</p>\n    </div>\n\n    <button mat-icon-button color=\"primary\" (click)=\"toggleFavorite()\">\n      <mat-icon fontSet=\"material-icons-round\">{{ isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>\n    </button>\n  </div>\n\n  <p class=\"short\">{{ currentPoi.descriptionShort }}</p>\n  <p class=\"long\">{{ currentPoi.descriptionLong }}</p>\n\n  <section class=\"actions\">\n    <button mat-stroked-button color=\"primary\" class=\"big-cta\" (click)=\"openPlayer(true)\">Ascolta preview</button>\n\n    <button\n      mat-flat-button\n      color=\"primary\"\n      class=\"big-cta\"\n      *ngIf=\"unlocked; else lockCta\"\n      (click)=\"openPlayer(false)\"\n    >\n      Riproduci audio\n    </button>\n\n    <ng-template #lockCta>\n      <button mat-flat-button color=\"primary\" class=\"big-cta\" (click)=\"purchasePoi()\">\n        Sblocca questo luogo \u20AC{{ formatPrice(currentPoi.priceSingle) }}\n      </button>\n\n      <button mat-stroked-button color=\"primary\" class=\"big-cta\" (click)=\"purchaseCity()\">\n        Sblocca {{ cityName(currentPoi.cityId) }} \u20AC{{ cityUnlockPriceLabel }}\n      </button>\n    </ng-template>\n\n    <button mat-flat-button color=\"accent\" class=\"big-cta nav-cta\" (click)=\"startNavigation()\">\n      <mat-icon fontSet=\"material-icons-round\">near_me</mat-icon>\n      Avvia navigazione in app\n    </button>\n  </section>\n</section>\n\n<section class=\"page-shell loading-shell\" *ngIf=\"loading\">\n  <mat-progress-spinner mode=\"indeterminate\" diameter=\"48\"></mat-progress-spinner>\n  <p>Caricamento dettaglio...</p>\n</section>\n\n<section class=\"page-shell poi-detail\" *ngIf=\"!loading && !poi\">\n  <mat-card class=\"card warning\">\n    <p>{{ loadError ? 'Punto di interesse non disponibile o backend non raggiungibile.' : 'Contenuto non trovato.' }}</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"goBack()\">Torna alla home</button>\n  </mat-card>\n</section>\n", styles: [".poi-detail {\n  display: grid;\n  gap: 14px;\n}\n\n.back-btn {\n  width: fit-content;\n}\n\n.title-row {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.short,\n.long {\n  margin: 0;\n  color: #4f607a;\n  line-height: 1.5;\n}\n\n.long {\r\n  color: #516683;\r\n  white-space: pre-line;\r\n}\n\n.actions {\n  display: grid;\n  gap: 10px;\n}\n\n.nav-cta {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n\n.warning {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5d6d86;\n  }\n}\r\n"] }]
    }], () => [{ type: i1.ActivatedRoute }, { type: i1.Router }, { type: i2.PoiService }, { type: i3.PurchaseService }, { type: i4.AppStateService }, { type: i5.GeoService }, { type: i6.Location }, { type: i7.MatSnackBar }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PoiDetailComponent, { className: "PoiDetailComponent", filePath: "src/app/features/poi-detail/poi-detail.component.ts", lineNumber: 24 }); })();
