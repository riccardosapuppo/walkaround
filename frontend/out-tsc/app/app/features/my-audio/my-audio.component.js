import { Component } from '@angular/core';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { formatCityLabel } from '../../core/utils/city-label.util';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/poi.service";
import * as i2 from "../../core/services/purchase.service";
import * as i3 from "../../core/services/offline.service";
import * as i4 from "../../core/services/app-state.service";
import * as i5 from "../../core/services/geo.service";
import * as i6 from "@angular/material/snack-bar";
import * as i7 from "@angular/router";
import * as i8 from "../../core/services/i18n.service";
import * as i9 from "@angular/common";
import * as i10 from "@angular/material/button";
import * as i11 from "@angular/material/card";
import * as i12 from "@angular/material/icon";
import * as i13 from "@angular/material/progress-spinner";
import * as i14 from "../../shared/directives/img-fallback.directive";
import * as i15 from "../../shared/pipes/duration-label.pipe";
import * as i16 from "../../shared/pipes/translate.pipe";
const _c0 = a0 => ({ minutes: a0 });
function MyAudioComponent_mat_card_9_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 10)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 11);
    i0.ɵɵlistener("click", function MyAudioComponent_mat_card_9_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.downloadAll()); });
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(3, 2, "myAudio.offlineAvailable", i0.ɵɵpureFunction1(7, _c0, ctx_r1.offlineMinutes)));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(6, 5, "myAudio.downloadAll"));
} }
function MyAudioComponent_mat_card_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 12);
    i0.ɵɵelement(1, "mat-progress-spinner", 13);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 1, "myAudio.loading"));
} }
function MyAudioComponent_ng_container_11_mat_card_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 15)(1, "img", 16);
    i0.ɵɵlistener("click", function MyAudioComponent_ng_container_11_mat_card_1_Template_img_click_1_listener() { const item_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openPoi(item_r4.id)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 17);
    i0.ɵɵlistener("click", function MyAudioComponent_ng_container_11_mat_card_1_Template_div_click_2_listener() { const item_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openPoi(item_r4.id)); });
    i0.ɵɵelementStart(3, "h3");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 18);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 19);
    i0.ɵɵtext(8);
    i0.ɵɵpipe(9, "durationLabel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "p", 20);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 21)(13, "button", 22);
    i0.ɵɵpipe(14, "t");
    i0.ɵɵlistener("click", function MyAudioComponent_ng_container_11_mat_card_1_Template_button_click_13_listener() { const item_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.play(item_r4)); });
    i0.ɵɵelementStart(15, "mat-icon", 23);
    i0.ɵɵtext(16, "headphones");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "button", 24);
    i0.ɵɵpipe(18, "t");
    i0.ɵɵlistener("click", function MyAudioComponent_ng_container_11_mat_card_1_Template_button_click_17_listener() { const item_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleFavorite(item_r4)); });
    i0.ɵɵelementStart(19, "mat-icon", 23);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("appImgFallback", item_r4.imageUrl)("alt", ctx_r1.poiName(item_r4));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.poiName(item_r4));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.poiAddress(item_r4));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r1.distanceLabel(item_r4.distanceMeters), " - ", i0.ɵɵpipeBind1(9, 11, item_r4.durationSec), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.poiDescription(item_r4));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.hasPlayableAudio(item_r4));
    i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(14, 13, "myAudio.playAria"));
    i0.ɵɵadvance(4);
    i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(18, 15, "myAudio.favoriteAria"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r4.isFavorite ? "favorite" : "favorite_border");
} }
function MyAudioComponent_ng_container_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, MyAudioComponent_ng_container_11_mat_card_1_Template, 21, 17, "mat-card", 14);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.audioItems);
} }
function MyAudioComponent_mat_card_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 25)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(3, 1, "myAudio.empty"));
} }
export class MyAudioComponent {
    constructor(poiService, purchaseService, offlineService, appState, geoService, snackBar, router, i18n) {
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.offlineService = offlineService;
        this.appState = appState;
        this.geoService = geoService;
        this.snackBar = snackBar;
        this.router = router;
        this.i18n = i18n;
        this.audioItems = [];
        this.offlineMinutes = 0;
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
            next: async (allGroups) => {
                this.allPois = allGroups.flat();
                await this.rebuildList();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
        this.purchaseService.purchases$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            void this.rebuildList();
        });
        this.geoService.coordinates$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            void this.rebuildList();
        });
        this.appState.favorites$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            void this.rebuildList();
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    async downloadAll() {
        const toCache = this.audioItems
            .filter((item) => this.hasPlayableAudio(item))
            .map((item) => ({
            poiId: item.id,
            urls: [this.poiAudioUrl(item), item.imageUrl]
        }));
        await this.offlineService.cacheBatch(toCache);
        await this.rebuildList();
        this.snackBar.open(this.i18n.t('myAudio.downloadDone'), this.i18n.t('common.ok'), { duration: 2400 });
    }
    play(item) {
        if (!this.hasPlayableAudio(item)) {
            this.snackBar.open(this.i18n.t('myAudio.noAudio'), this.i18n.t('common.ok'), { duration: 2400 });
            return;
        }
        void this.router.navigate(['/player', item.id], {
            queryParams: { preview: false }
        });
    }
    openPoi(poiId) {
        void this.router.navigate(['/poi', poiId]);
    }
    toggleFavorite(item) {
        this.appState.toggleFavorite(item.id);
    }
    hasPlayableAudio(poi) {
        return Boolean(this.poiAudioUrl(poi));
    }
    poiName(poi) {
        return this.i18n.resolvePoiField(poi.name, poi.translations, 'name');
    }
    poiDescription(poi) {
        return this.i18n.resolvePoiField(poi.descriptionShort, poi.translations, 'descriptionShort');
    }
    poiAudioUrl(poi) {
        return this.i18n.resolvePoiAudioUrl(poi);
    }
    poiAddress(poi) {
        return `${formatCityLabel(poi.cityId, [], this.i18n.language)} - ${this.i18n.t('common.coordinates')} ${poi.lat.toFixed(4)}, ${poi.lng.toFixed(4)}`;
    }
    distanceLabel(distanceMeters) {
        return this.i18n.formatDistance(distanceMeters);
    }
    async rebuildList() {
        if (!this.allPois.length) {
            this.audioItems = [];
            return;
        }
        const offlineIds = await this.offlineService.getOfflinePoiIds();
        const currentCoordinates = this.geoService.currentCoordinates;
        const unlocked = this.allPois.filter((poi) => this.purchaseService.isPoiUnlocked(poi.id, poi.cityId));
        this.audioItems = unlocked
            .map((poi) => {
            const distanceMeters = currentCoordinates
                ? this.geoService.distanceInMeters(currentCoordinates, { lat: poi.lat, lng: poi.lng })
                : null;
            return {
                ...poi,
                offline: offlineIds.includes(poi.id),
                distanceMeters,
                isFavorite: this.appState.isFavorite(poi.id)
            };
        })
            .sort((a, b) => this.poiName(a).localeCompare(this.poiName(b), this.i18n.locale));
        this.offlineMinutes = Math.round(this.audioItems
            .filter((item) => item.offline)
            .reduce((acc, item) => acc + item.durationSec, 0) / 60);
    }
    static { this.ɵfac = function MyAudioComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MyAudioComponent)(i0.ɵɵdirectiveInject(i1.PoiService), i0.ɵɵdirectiveInject(i2.PurchaseService), i0.ɵɵdirectiveInject(i3.OfflineService), i0.ɵɵdirectiveInject(i4.AppStateService), i0.ɵɵdirectiveInject(i5.GeoService), i0.ɵɵdirectiveInject(i6.MatSnackBar), i0.ɵɵdirectiveInject(i7.Router), i0.ɵɵdirectiveInject(i8.I18nService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MyAudioComponent, selectors: [["app-my-audio"]], standalone: false, decls: 13, vars: 10, consts: [[1, "page-shell", "my-audio"], [1, "brand-hero"], [1, "brand-hero-stage"], ["src", "/assets/logo.png", "loading", "eager", "decoding", "sync", "fetchpriority", "high", 1, "brand-hero-logo"], [1, "brand-hero-footer"], [1, "brand-hero-slogan"], ["class", "card download-box", 4, "ngIf"], ["class", "card section-loading-card", 4, "ngIf"], [4, "ngIf"], ["class", "card empty", 4, "ngIf"], [1, "card", "download-box"], ["mat-stroked-button", "", "color", "primary", 3, "click"], [1, "card", "section-loading-card"], ["mode", "indeterminate", "diameter", "44"], ["class", "card audio-card", 4, "ngFor", "ngForOf"], [1, "card", "audio-card"], [3, "click", "appImgFallback", "alt"], [1, "meta", 3, "click"], [1, "address"], [1, "distance"], [1, "teaser"], [1, "audio-actions"], ["mat-icon-button", "", "color", "primary", 3, "click", "disabled"], ["fontSet", "material-icons-round"], ["mat-icon-button", "", "color", "primary", 3, "click"], [1, "card", "empty"]], template: function MyAudioComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div", 2);
            i0.ɵɵelement(3, "img", 3);
            i0.ɵɵpipe(4, "t");
            i0.ɵɵelementStart(5, "div", 4)(6, "p", 5);
            i0.ɵɵtext(7);
            i0.ɵɵpipe(8, "t");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵtemplate(9, MyAudioComponent_mat_card_9_Template, 7, 9, "mat-card", 6)(10, MyAudioComponent_mat_card_10_Template, 5, 3, "mat-card", 7)(11, MyAudioComponent_ng_container_11_Template, 2, 1, "ng-container", 8)(12, MyAudioComponent_mat_card_12_Template, 4, 3, "mat-card", 9);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵattribute("alt", i0.ɵɵpipeBind1(4, 6, "common.appName"));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 8, "common.brandTagline"));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.audioItems.length);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && !ctx.audioItems.length);
        } }, dependencies: [i9.NgForOf, i9.NgIf, i10.MatButton, i10.MatIconButton, i11.MatCard, i12.MatIcon, i13.MatProgressSpinner, i14.ImgFallbackDirective, i15.DurationLabelPipe, i16.TranslatePipe], styles: [".my-audio[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n}\n\n.download-box[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5f6e87;\n  }\n}\n\n.audio-card[_ngcontent-%COMP%] {\n  padding: 12px;\n  display: grid;\n  gap: 10px;\n  align-items: start;\n  grid-template-columns: 84px 1fr auto;\n\n  img {\n    width: 84px;\n    height: 84px;\n    border-radius: 12px;\n    object-fit: cover;\n    cursor: pointer;\n  }\n}\n\n.meta[_ngcontent-%COMP%] {\n  min-width: 0;\n  cursor: pointer;\n\n  h3 {\n    margin: 0 0 4px;\n    font-size: 1rem;\n    color: #153250;\n  }\n\n  p {\n    margin: 0;\n    color: #64768f;\n    font-size: 0.84rem;\n  }\n}\n\n.distance[_ngcontent-%COMP%] {\n  margin-top: 2px !important;\n}\n\n.teaser[_ngcontent-%COMP%] {\n  margin-top: 6px !important;\n  color: #526985 !important;\n  line-height: 1.36 !important;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.audio-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n\n.empty[_ngcontent-%COMP%] {\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #6b7a94;\n  }\n}\n\n@media (max-width: 600px) {\n  .download-box[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n\n  .audio-card[_ngcontent-%COMP%] {\n    grid-template-columns: 84px 1fr auto;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MyAudioComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-my-audio', template: "<section class=\"page-shell my-audio\">\n  <header class=\"brand-hero\">\n    <div class=\"brand-hero-stage\">\n      <img\n        class=\"brand-hero-logo\"\n        src=\"/assets/logo.png\"\n        [attr.alt]=\"'common.appName' | t\"\n        loading=\"eager\"\n        decoding=\"sync\"\n        fetchpriority=\"high\"\n      />\n      <div class=\"brand-hero-footer\">\n        <p class=\"brand-hero-slogan\">{{ 'common.brandTagline' | t }}</p>\n      </div>\n    </div>\n  </header>\n\n  <mat-card class=\"card download-box\" *ngIf=\"!loading && audioItems.length\">\n    <p>{{ 'myAudio.offlineAvailable' | t:{ minutes: offlineMinutes } }}</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"downloadAll()\">{{ 'myAudio.downloadAll' | t }}</button>\n  </mat-card>\n\n  <mat-card class=\"card section-loading-card\" *ngIf=\"loading\">\n    <mat-progress-spinner mode=\"indeterminate\" diameter=\"44\"></mat-progress-spinner>\n    <p>{{ 'myAudio.loading' | t }}</p>\n  </mat-card>\n\n  <ng-container *ngIf=\"!loading\">\n    <mat-card class=\"card audio-card\" *ngFor=\"let item of audioItems\">\n      <img [appImgFallback]=\"item.imageUrl\" [alt]=\"poiName(item)\" (click)=\"openPoi(item.id)\" />\n\n      <div class=\"meta\" (click)=\"openPoi(item.id)\">\n        <h3>{{ poiName(item) }}</h3>\n        <p class=\"address\">{{ poiAddress(item) }}</p>\n        <p class=\"distance\">{{ distanceLabel(item.distanceMeters) }} - {{ item.durationSec | durationLabel }}</p>\n        <p class=\"teaser\">{{ poiDescription(item) }}</p>\n      </div>\n\n      <div class=\"audio-actions\">\n        <button\n          mat-icon-button\n          color=\"primary\"\n          (click)=\"play(item)\"\n          [disabled]=\"!hasPlayableAudio(item)\"\n          [attr.aria-label]=\"'myAudio.playAria' | t\"\n        >\n          <mat-icon fontSet=\"material-icons-round\">headphones</mat-icon>\n        </button>\n        <button mat-icon-button color=\"primary\" (click)=\"toggleFavorite(item)\" [attr.aria-label]=\"'myAudio.favoriteAria' | t\">\n          <mat-icon fontSet=\"material-icons-round\">{{ item.isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>\n        </button>\n      </div>\n    </mat-card>\n  </ng-container>\n\n  <mat-card class=\"card empty\" *ngIf=\"!loading && !audioItems.length\">\n    <p>{{ 'myAudio.empty' | t }}</p>\n  </mat-card>\n</section>\n", styles: [".my-audio {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n}\n\n.download-box {\n  padding: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5f6e87;\n  }\n}\n\n.audio-card {\n  padding: 12px;\n  display: grid;\n  gap: 10px;\n  align-items: start;\n  grid-template-columns: 84px 1fr auto;\n\n  img {\n    width: 84px;\n    height: 84px;\n    border-radius: 12px;\n    object-fit: cover;\n    cursor: pointer;\n  }\n}\n\n.meta {\n  min-width: 0;\n  cursor: pointer;\n\n  h3 {\n    margin: 0 0 4px;\n    font-size: 1rem;\n    color: #153250;\n  }\n\n  p {\n    margin: 0;\n    color: #64768f;\n    font-size: 0.84rem;\n  }\n}\n\n.distance {\n  margin-top: 2px !important;\n}\n\n.teaser {\n  margin-top: 6px !important;\n  color: #526985 !important;\n  line-height: 1.36 !important;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.audio-actions {\n  display: flex;\n  flex-direction: column;\n}\n\n.empty {\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #6b7a94;\n  }\n}\n\n@media (max-width: 600px) {\n  .download-box {\n    flex-direction: column;\n    align-items: stretch;\n  }\n\n  .audio-card {\n    grid-template-columns: 84px 1fr auto;\n  }\n}\n"] }]
    }], () => [{ type: i1.PoiService }, { type: i2.PurchaseService }, { type: i3.OfflineService }, { type: i4.AppStateService }, { type: i5.GeoService }, { type: i6.MatSnackBar }, { type: i7.Router }, { type: i8.I18nService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MyAudioComponent, { className: "MyAudioComponent", filePath: "frontend/src/app/features/my-audio/my-audio.component.ts", lineNumber: 27 }); })();
