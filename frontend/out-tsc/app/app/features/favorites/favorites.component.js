import { Component } from '@angular/core';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { formatCityLabel } from '../../core/utils/city-label.util';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/app-state.service";
import * as i2 from "../../core/services/poi.service";
import * as i3 from "../../core/services/purchase.service";
import * as i4 from "../../core/services/geo.service";
import * as i5 from "@angular/router";
import * as i6 from "../../core/services/i18n.service";
import * as i7 from "@angular/common";
import * as i8 from "@angular/material/button";
import * as i9 from "@angular/material/card";
import * as i10 from "@angular/material/icon";
import * as i11 from "@angular/material/progress-spinner";
import * as i12 from "../../shared/directives/img-fallback.directive";
import * as i13 from "../../shared/pipes/duration-label.pipe";
import * as i14 from "../../shared/pipes/translate.pipe";
function FavoritesComponent_mat_card_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 9);
    i0.ɵɵelement(1, "mat-progress-spinner", 10);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 1, "favorites.loading"));
} }
function FavoritesComponent_ng_container_10_mat_card_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 12)(1, "img", 13);
    i0.ɵɵlistener("click", function FavoritesComponent_ng_container_10_mat_card_1_Template_img_click_1_listener() { const poi_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openPoi(poi_r2.id)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 14);
    i0.ɵɵlistener("click", function FavoritesComponent_ng_container_10_mat_card_1_Template_div_click_2_listener() { const poi_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openPoi(poi_r2.id)); });
    i0.ɵɵelementStart(3, "h3");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 15);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 16);
    i0.ɵɵtext(8);
    i0.ɵɵpipe(9, "durationLabel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "p", 17);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 18)(13, "button", 19);
    i0.ɵɵpipe(14, "t");
    i0.ɵɵlistener("click", function FavoritesComponent_ng_container_10_mat_card_1_Template_button_click_13_listener() { const poi_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.playAudio(poi_r2)); });
    i0.ɵɵelementStart(15, "mat-icon", 20);
    i0.ɵɵtext(16, "headphones");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "button", 21);
    i0.ɵɵpipe(18, "t");
    i0.ɵɵlistener("click", function FavoritesComponent_ng_container_10_mat_card_1_Template_button_click_17_listener() { const poi_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleFavorite(poi_r2)); });
    i0.ɵɵelementStart(19, "mat-icon", 20);
    i0.ɵɵtext(20, "favorite");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const poi_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("appImgFallback", poi_r2.imageUrl)("alt", ctx_r2.poiName(poi_r2));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r2.poiName(poi_r2));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.poiAddress(poi_r2));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r2.distanceLabel(poi_r2.distanceMeters), " - ", i0.ɵɵpipeBind1(9, 10, poi_r2.durationSec), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r2.poiDescription(poi_r2));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r2.hasPlayableAudio(poi_r2));
    i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(14, 12, "favorites.audioAria"));
    i0.ɵɵadvance(4);
    i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(18, 14, "favorites.favoriteAria"));
} }
function FavoritesComponent_ng_container_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, FavoritesComponent_ng_container_10_mat_card_1_Template, 21, 16, "mat-card", 11);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r2.favorites);
} }
function FavoritesComponent_mat_card_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 22)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(3, 1, "favorites.empty"));
} }
export class FavoritesComponent {
    constructor(appState, poiService, purchaseService, geoService, router, i18n) {
        this.appState = appState;
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.geoService = geoService;
        this.router = router;
        this.i18n = i18n;
        this.favorites = [];
        this.loading = true;
        this.allPois = [];
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.purchaseService.refresh();
        void this.geoService.requestPermissionAndTrack();
        this.poiService
            .getCities()
            .pipe(switchMap((cities) => forkJoin(cities.map((city) => this.poiService.getPoisByCity(city.id)))), takeUntil(this.destroy$))
            .subscribe({
            next: (groups) => {
                this.allPois = groups.flat();
                this.refreshFavorites();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.favorites = [];
            }
        });
        this.appState.favorites$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refreshFavorites());
        this.purchaseService.purchases$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refreshFavorites());
        this.geoService.coordinates$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refreshFavorites());
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    openPoi(poiId) {
        void this.router.navigate(['/poi', poiId]);
    }
    playAudio(item) {
        if (!this.hasPlayableAudio(item)) {
            return;
        }
        if (!item.unlocked) {
            void this.router.navigate(['/poi', item.id]);
            return;
        }
        void this.router.navigate(['/player', item.id], {
            queryParams: {
                preview: false
            }
        });
    }
    toggleFavorite(item) {
        this.appState.toggleFavorite(item.id);
    }
    hasPlayableAudio(poi) {
        return Boolean(this.i18n.resolvePoiAudioUrl(poi));
    }
    poiName(poi) {
        return this.i18n.resolvePoiField(poi.name, poi.translations, 'name');
    }
    poiDescription(poi) {
        return this.i18n.resolvePoiField(poi.descriptionShort, poi.translations, 'descriptionShort');
    }
    poiAddress(poi) {
        return String(poi.address || '').trim() || `${this.poiName(poi)}, ${formatCityLabel(poi.cityId, [], this.i18n.language)}`;
    }
    distanceLabel(distanceMeters) {
        return this.i18n.formatDistance(distanceMeters);
    }
    refreshFavorites() {
        const ids = new Set(this.appState.favoriteIds);
        const currentCoordinates = this.geoService.currentCoordinates;
        this.favorites = this.allPois
            .filter((poi) => ids.has(poi.id))
            .map((poi) => {
            const distanceMeters = currentCoordinates
                ? this.geoService.distanceInMeters(currentCoordinates, { lat: poi.lat, lng: poi.lng })
                : null;
            return {
                ...poi,
                distanceMeters,
                unlocked: this.purchaseService.isPoiUnlocked(poi.id, poi.cityId)
            };
        });
    }
    static { this.ɵfac = function FavoritesComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FavoritesComponent)(i0.ɵɵdirectiveInject(i1.AppStateService), i0.ɵɵdirectiveInject(i2.PoiService), i0.ɵɵdirectiveInject(i3.PurchaseService), i0.ɵɵdirectiveInject(i4.GeoService), i0.ɵɵdirectiveInject(i5.Router), i0.ɵɵdirectiveInject(i6.I18nService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: FavoritesComponent, selectors: [["app-favorites"]], standalone: false, decls: 12, vars: 9, consts: [[1, "page-shell", "favorites"], [1, "brand-hero"], [1, "brand-hero-stage"], ["src", "/assets/logo.png", "loading", "eager", "decoding", "sync", "fetchpriority", "high", 1, "brand-hero-logo"], [1, "brand-hero-footer"], [1, "brand-hero-slogan"], ["class", "card section-loading-card", 4, "ngIf"], [4, "ngIf"], ["class", "card empty", 4, "ngIf"], [1, "card", "section-loading-card"], ["mode", "indeterminate", "diameter", "44"], ["class", "card poi-card", 4, "ngFor", "ngForOf"], [1, "card", "poi-card"], [3, "click", "appImgFallback", "alt"], [1, "meta", 3, "click"], [1, "address"], [1, "distance"], [1, "teaser"], [1, "poi-actions"], ["mat-icon-button", "", "color", "primary", 3, "click", "disabled"], ["fontSet", "material-icons-round"], ["mat-icon-button", "", "color", "primary", 3, "click"], [1, "card", "empty"]], template: function FavoritesComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div", 2);
            i0.ɵɵelement(3, "img", 3);
            i0.ɵɵpipe(4, "t");
            i0.ɵɵelementStart(5, "div", 4)(6, "p", 5);
            i0.ɵɵtext(7);
            i0.ɵɵpipe(8, "t");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵtemplate(9, FavoritesComponent_mat_card_9_Template, 5, 3, "mat-card", 6)(10, FavoritesComponent_ng_container_10_Template, 2, 1, "ng-container", 7)(11, FavoritesComponent_mat_card_11_Template, 4, 3, "mat-card", 8);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵattribute("alt", i0.ɵɵpipeBind1(4, 5, "common.appName"));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 7, "common.brandTagline"));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && !ctx.favorites.length);
        } }, dependencies: [i7.NgForOf, i7.NgIf, i8.MatIconButton, i9.MatCard, i10.MatIcon, i11.MatProgressSpinner, i12.ImgFallbackDirective, i13.DurationLabelPipe, i14.TranslatePipe], styles: [".favorites[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n}\n\n.poi-card[_ngcontent-%COMP%] {\n  padding: 10px;\n  display: grid;\n  grid-template-columns: 86px 1fr auto;\n  align-items: start;\n  gap: 10px;\n\n  img {\n    width: 86px;\n    height: 80px;\n    border-radius: 12px;\n    object-fit: cover;\n    cursor: pointer;\n  }\n}\n\n.meta[_ngcontent-%COMP%] {\n  cursor: pointer;\n  min-width: 0;\n\n  h3 {\n    margin: 0 0 4px;\n    font-size: 1rem;\n    color: #13314f;\n  }\n\n  p {\n    margin: 0;\n    color: #61728b;\n    font-size: 0.84rem;\n  }\n}\n\n.distance[_ngcontent-%COMP%] {\n  margin-top: 2px !important;\n}\n\n.teaser[_ngcontent-%COMP%] {\n  margin-top: 6px !important;\n  line-height: 1.34 !important;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.poi-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n\n.empty[_ngcontent-%COMP%] {\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #65758e;\n  }\n}\n\n@media (max-width: 600px) {\n  .poi-card[_ngcontent-%COMP%] {\n    grid-template-columns: 84px 1fr auto;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FavoritesComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-favorites', template: "<section class=\"page-shell favorites\">\n  <header class=\"brand-hero\">\n    <div class=\"brand-hero-stage\">\n      <img\n        class=\"brand-hero-logo\"\n        src=\"/assets/logo.png\"\n        [attr.alt]=\"'common.appName' | t\"\n        loading=\"eager\"\n        decoding=\"sync\"\n        fetchpriority=\"high\"\n      />\n      <div class=\"brand-hero-footer\">\n        <p class=\"brand-hero-slogan\">{{ 'common.brandTagline' | t }}</p>\n      </div>\n    </div>\n  </header>\n\n  <mat-card class=\"card section-loading-card\" *ngIf=\"loading\">\n    <mat-progress-spinner mode=\"indeterminate\" diameter=\"44\"></mat-progress-spinner>\n    <p>{{ 'favorites.loading' | t }}</p>\n  </mat-card>\n\n  <ng-container *ngIf=\"!loading\">\n    <mat-card class=\"card poi-card\" *ngFor=\"let poi of favorites\">\n      <img [appImgFallback]=\"poi.imageUrl\" [alt]=\"poiName(poi)\" (click)=\"openPoi(poi.id)\" />\n\n      <div class=\"meta\" (click)=\"openPoi(poi.id)\">\n        <h3>{{ poiName(poi) }}</h3>\n        <p class=\"address\">{{ poiAddress(poi) }}</p>\n        <p class=\"distance\">{{ distanceLabel(poi.distanceMeters) }} - {{ poi.durationSec | durationLabel }}</p>\n        <p class=\"teaser\">{{ poiDescription(poi) }}</p>\n      </div>\n\n      <div class=\"poi-actions\">\n        <button\n          mat-icon-button\n          color=\"primary\"\n          (click)=\"playAudio(poi)\"\n          [disabled]=\"!hasPlayableAudio(poi)\"\n          [attr.aria-label]=\"'favorites.audioAria' | t\"\n        >\n          <mat-icon fontSet=\"material-icons-round\">headphones</mat-icon>\n        </button>\n        <button mat-icon-button color=\"primary\" (click)=\"toggleFavorite(poi)\" [attr.aria-label]=\"'favorites.favoriteAria' | t\">\n          <mat-icon fontSet=\"material-icons-round\">favorite</mat-icon>\n        </button>\n      </div>\n    </mat-card>\n  </ng-container>\n\n  <mat-card class=\"card empty\" *ngIf=\"!loading && !favorites.length\">\n    <p>{{ 'favorites.empty' | t }}</p>\n  </mat-card>\n</section>\n", styles: [".favorites {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n}\n\n.poi-card {\n  padding: 10px;\n  display: grid;\n  grid-template-columns: 86px 1fr auto;\n  align-items: start;\n  gap: 10px;\n\n  img {\n    width: 86px;\n    height: 80px;\n    border-radius: 12px;\n    object-fit: cover;\n    cursor: pointer;\n  }\n}\n\n.meta {\n  cursor: pointer;\n  min-width: 0;\n\n  h3 {\n    margin: 0 0 4px;\n    font-size: 1rem;\n    color: #13314f;\n  }\n\n  p {\n    margin: 0;\n    color: #61728b;\n    font-size: 0.84rem;\n  }\n}\n\n.distance {\n  margin-top: 2px !important;\n}\n\n.teaser {\n  margin-top: 6px !important;\n  line-height: 1.34 !important;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.poi-actions {\n  display: flex;\n  flex-direction: column;\n}\n\n.empty {\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #65758e;\n  }\n}\n\n@media (max-width: 600px) {\n  .poi-card {\n    grid-template-columns: 84px 1fr auto;\n  }\n}\n"] }]
    }], () => [{ type: i1.AppStateService }, { type: i2.PoiService }, { type: i3.PurchaseService }, { type: i4.GeoService }, { type: i5.Router }, { type: i6.I18nService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(FavoritesComponent, { className: "FavoritesComponent", filePath: "src/app/features/favorites/favorites.component.ts", lineNumber: 23 }); })();
