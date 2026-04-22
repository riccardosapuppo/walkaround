import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { formatCityLabel } from '../../../core/utils/city-label.util';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/bottom-sheet";
import * as i2 from "../../../core/services/i18n.service";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/icon";
import * as i6 from "../../directives/img-fallback.directive";
import * as i7 from "../../pipes/translate.pipe";
import * as i8 from "../../pipes/duration-label.pipe";
const _c0 = a0 => ({ price: a0 });
const _c1 = (a0, a1) => ({ city: a0, price: a1 });
function PoiMapSheetComponent_ng_container_20_button_1_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 15);
    i0.ɵɵlistener("click", function PoiMapSheetComponent_ng_container_20_button_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.play(false)); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, "mapSheet.playAudio"), " ");
} }
function PoiMapSheetComponent_ng_container_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, PoiMapSheetComponent_ng_container_20_button_1_Template, 3, 3, "button", 14);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    const unlockedNoAudio_r4 = i0.ɵɵreference(22);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.hasPlayableAudio(ctx_r2.data.poi))("ngIfElse", unlockedNoAudio_r4);
} }
function PoiMapSheetComponent_ng_template_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 16);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "mapSheet.audioUnavailable"));
} }
function PoiMapSheetComponent_ng_template_23_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 17);
    i0.ɵɵlistener("click", function PoiMapSheetComponent_ng_template_23_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.addToCart()); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 18);
    i0.ɵɵlistener("click", function PoiMapSheetComponent_ng_template_23_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.purchaseCity()); });
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r2.data.inCart);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.data.inCart ? i0.ɵɵpipeBind1(2, 3, "common.inCart") : i0.ɵɵpipeBind2(3, 5, "mapSheet.unlockPlace", i0.ɵɵpureFunction1(11, _c0, ctx_r2.formatPrice(ctx_r2.data.poi.priceSingle))), " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(6, 8, "mapSheet.unlockCity", i0.ɵɵpureFunction2(13, _c1, ctx_r2.cityName(ctx_r2.data.poi.cityId), ctx_r2.i18n.formatCurrency(ctx_r2.cityUnlockPrice))), " ");
} }
export class PoiMapSheetComponent {
    constructor(data, bottomSheetRef, i18n) {
        this.data = data;
        this.bottomSheetRef = bottomSheetRef;
        this.i18n = i18n;
        this.cityUnlockPrice = 15;
    }
    close() {
        this.bottomSheetRef.dismiss();
    }
    navigate() {
        this.bottomSheetRef.dismiss({ action: 'navigate', poiId: this.data.poi.id });
    }
    play(preview) {
        if (!this.hasPlayableAudio(this.data.poi)) {
            return;
        }
        this.bottomSheetRef.dismiss({ action: 'play', poiId: this.data.poi.id, preview });
    }
    addToCart() {
        this.bottomSheetRef.dismiss({
            action: 'add-to-cart',
            poiId: this.data.poi.id
        });
    }
    purchaseCity() {
        this.bottomSheetRef.dismiss({
            action: 'purchase-city',
            cityId: this.data.poi.cityId
        });
    }
    toggleFavorite() {
        this.bottomSheetRef.dismiss({
            action: 'toggle-favorite',
            poiId: this.data.poi.id
        });
    }
    formatPrice(amount) {
        return this.i18n.formatCurrency(Number(amount || 0));
    }
    cityName(cityId) {
        return formatCityLabel(cityId, [], this.i18n.language);
    }
    poiAddress() {
        return String(this.data.poi.address || '').trim() || `${this.poiName()}, ${this.cityName(this.data.poi.cityId)}`;
    }
    hasPlayableAudio(poi) {
        return Boolean(this.i18n.resolvePoiAudioUrl(poi));
    }
    poiName() {
        return this.i18n.resolvePoiField(this.data.poi.name, this.data.poi.translations, 'name');
    }
    poiDescription() {
        return this.i18n.resolvePoiField(this.data.poi.descriptionShort, this.data.poi.translations, 'descriptionShort');
    }
    static { this.ɵfac = function PoiMapSheetComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PoiMapSheetComponent)(i0.ɵɵdirectiveInject(MAT_BOTTOM_SHEET_DATA), i0.ɵɵdirectiveInject(i1.MatBottomSheetRef), i0.ɵɵdirectiveInject(i2.I18nService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PoiMapSheetComponent, selectors: [["app-poi-map-sheet"]], standalone: false, decls: 37, vars: 29, consts: [["unlockedNoAudio", ""], ["lockedAction", ""], [1, "sheet-wrap"], [1, "sheet-head-row"], ["mat-icon-button", "", "type", "button", 3, "click"], ["fontSet", "material-icons-round"], [1, "sheet-image", 3, "appImgFallback", "alt"], [1, "sheet-line"], [1, "sheet-teaser"], [1, "sheet-actions"], ["mat-stroked-button", "", "color", "primary", 3, "click", "disabled"], [4, "ngIf", "ngIfElse"], ["mat-flat-button", "", "color", "accent", 1, "navigate-btn", 3, "click"], ["mat-stroked-button", "", "color", "primary", 1, "favorite-btn", 3, "click"], ["mat-flat-button", "", "color", "primary", 3, "click", 4, "ngIf", "ngIfElse"], ["mat-flat-button", "", "color", "primary", 3, "click"], ["mat-flat-button", "", "color", "primary", "disabled", ""], ["mat-flat-button", "", "color", "primary", 3, "click", "disabled"], ["mat-stroked-button", "", "color", "primary", 3, "click"]], template: function PoiMapSheetComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "h3");
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "button", 4);
            i0.ɵɵpipe(5, "t");
            i0.ɵɵlistener("click", function PoiMapSheetComponent_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.close()); });
            i0.ɵɵelementStart(6, "mat-icon", 5);
            i0.ɵɵtext(7, "close");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelement(8, "img", 6);
            i0.ɵɵelementStart(9, "p", 7);
            i0.ɵɵtext(10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "p", 7);
            i0.ɵɵtext(12);
            i0.ɵɵpipe(13, "durationLabel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "p", 8);
            i0.ɵɵtext(15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "div", 9)(17, "button", 10);
            i0.ɵɵlistener("click", function PoiMapSheetComponent_Template_button_click_17_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.play(true)); });
            i0.ɵɵtext(18);
            i0.ɵɵpipe(19, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(20, PoiMapSheetComponent_ng_container_20_Template, 2, 2, "ng-container", 11)(21, PoiMapSheetComponent_ng_template_21_Template, 3, 3, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor)(23, PoiMapSheetComponent_ng_template_23_Template, 7, 16, "ng-template", null, 1, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelementStart(25, "button", 12);
            i0.ɵɵlistener("click", function PoiMapSheetComponent_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.navigate()); });
            i0.ɵɵelementStart(26, "mat-icon", 5);
            i0.ɵɵtext(27, "near_me");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(28);
            i0.ɵɵpipe(29, "t");
            i0.ɵɵpipe(30, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "button", 13);
            i0.ɵɵlistener("click", function PoiMapSheetComponent_Template_button_click_31_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.toggleFavorite()); });
            i0.ɵɵelementStart(32, "mat-icon", 5);
            i0.ɵɵtext(33);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(34);
            i0.ɵɵpipe(35, "t");
            i0.ɵɵpipe(36, "t");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            const lockedAction_r6 = i0.ɵɵreference(24);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.poiName());
            i0.ɵɵadvance();
            i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(5, 15, "mapSheet.closeAria"));
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("appImgFallback", ctx.data.poi.imageUrl)("alt", ctx.poiName());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.poiAddress());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate2("", ctx.data.distanceLabel, " - ", i0.ɵɵpipeBind1(13, 17, ctx.data.poi.durationSec), "");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.poiDescription());
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", !ctx.hasPlayableAudio(ctx.data.poi));
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(19, 19, "mapSheet.previewAudio"), " ");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.data.unlocked)("ngIfElse", lockedAction_r6);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate1(" ", ctx.data.isNavigating ? i0.ɵɵpipeBind1(29, 21, "mapSheet.updateNavigation") : i0.ɵɵpipeBind1(30, 23, "mapSheet.startNavigation"), " ");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.data.isFavorite ? "favorite" : "favorite_border");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.data.isFavorite ? i0.ɵɵpipeBind1(35, 25, "mapSheet.removeFavorite") : i0.ɵɵpipeBind1(36, 27, "mapSheet.addFavorite"), " ");
        } }, dependencies: [i3.NgIf, i4.MatButton, i4.MatIconButton, i5.MatIcon, i6.ImgFallbackDirective, i7.TranslatePipe, i8.DurationLabelPipe], styles: [".sheet-wrap[_ngcontent-%COMP%] {\n  padding: 8px 8px calc(126px + env(safe-area-inset-bottom));\n}\n\n.sheet-head-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 8px;\n\n  h3 {\n    margin: 2px 0 0;\n    font-size: 1.08rem;\n    line-height: 1.3;\n  }\n}\n\n.sheet-image[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 16px;\n  aspect-ratio: 16/9;\n  object-fit: cover;\n}\n\n.sheet-line[_ngcontent-%COMP%] {\n  margin: 8px 0 0;\n  color: #5f7492;\n  font-size: 0.88rem;\n}\n\n.sheet-teaser[_ngcontent-%COMP%] {\n  margin: 8px 0 0;\n  color: #506884;\n  font-size: 0.88rem;\n  line-height: 1.42;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.sheet-actions[_ngcontent-%COMP%] {\n  margin: 14px 0 8px;\n  display: grid;\n  gap: 10px;\n}\n\n.navigate-btn[_ngcontent-%COMP%], \n.favorite-btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PoiMapSheetComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-poi-map-sheet', template: "<div class=\"sheet-wrap\">\n  <div class=\"sheet-head-row\">\n    <h3>{{ poiName() }}</h3>\n    <button mat-icon-button type=\"button\" [attr.aria-label]=\"'mapSheet.closeAria' | t\" (click)=\"close()\">\n      <mat-icon fontSet=\"material-icons-round\">close</mat-icon>\n    </button>\n  </div>\n\n  <img class=\"sheet-image\" [appImgFallback]=\"data.poi.imageUrl\" [alt]=\"poiName()\" />\n\n  <p class=\"sheet-line\">{{ poiAddress() }}</p>\n  <p class=\"sheet-line\">{{ data.distanceLabel }} - {{ data.poi.durationSec | durationLabel }}</p>\n  <p class=\"sheet-teaser\">{{ poiDescription() }}</p>\n\n  <div class=\"sheet-actions\">\n    <button mat-stroked-button color=\"primary\" (click)=\"play(true)\" [disabled]=\"!hasPlayableAudio(data.poi)\">\n      {{ 'mapSheet.previewAudio' | t }}\n    </button>\n\n    <ng-container *ngIf=\"data.unlocked; else lockedAction\">\n      <button *ngIf=\"hasPlayableAudio(data.poi); else unlockedNoAudio\" mat-flat-button color=\"primary\" (click)=\"play(false)\">\n        {{ 'mapSheet.playAudio' | t }}\n      </button>\n    </ng-container>\n\n    <ng-template #unlockedNoAudio>\n      <button mat-flat-button color=\"primary\" disabled>{{ 'mapSheet.audioUnavailable' | t }}</button>\n    </ng-template>\n\n    <ng-template #lockedAction>\n      <button mat-flat-button color=\"primary\" (click)=\"addToCart()\" [disabled]=\"data.inCart\">\n        {{ data.inCart ? ('common.inCart' | t) : ('mapSheet.unlockPlace' | t:{ price: formatPrice(data.poi.priceSingle) }) }}\n      </button>\n\n      <button mat-stroked-button color=\"primary\" (click)=\"purchaseCity()\">\n        {{ 'mapSheet.unlockCity' | t:{ city: cityName(data.poi.cityId), price: i18n.formatCurrency(cityUnlockPrice) } }}\n      </button>\n    </ng-template>\n\n    <button mat-flat-button color=\"accent\" class=\"navigate-btn\" (click)=\"navigate()\">\n      <mat-icon fontSet=\"material-icons-round\">near_me</mat-icon>\n      {{ data.isNavigating ? ('mapSheet.updateNavigation' | t) : ('mapSheet.startNavigation' | t) }}\n    </button>\n\n    <button mat-stroked-button color=\"primary\" class=\"favorite-btn\" (click)=\"toggleFavorite()\">\n      <mat-icon fontSet=\"material-icons-round\">{{ data.isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>\n      {{ data.isFavorite ? ('mapSheet.removeFavorite' | t) : ('mapSheet.addFavorite' | t) }}\n    </button>\n  </div>\n</div>\n", styles: [".sheet-wrap {\n  padding: 8px 8px calc(126px + env(safe-area-inset-bottom));\n}\n\n.sheet-head-row {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 8px;\n\n  h3 {\n    margin: 2px 0 0;\n    font-size: 1.08rem;\n    line-height: 1.3;\n  }\n}\n\n.sheet-image {\n  width: 100%;\n  border-radius: 16px;\n  aspect-ratio: 16/9;\n  object-fit: cover;\n}\n\n.sheet-line {\n  margin: 8px 0 0;\n  color: #5f7492;\n  font-size: 0.88rem;\n}\n\n.sheet-teaser {\n  margin: 8px 0 0;\n  color: #506884;\n  font-size: 0.88rem;\n  line-height: 1.42;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.sheet-actions {\n  margin: 14px 0 8px;\n  display: grid;\n  gap: 10px;\n}\n\n.navigate-btn,\n.favorite-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n"] }]
    }], () => [{ type: undefined, decorators: [{
                type: Inject,
                args: [MAT_BOTTOM_SHEET_DATA]
            }] }, { type: i1.MatBottomSheetRef }, { type: i2.I18nService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PoiMapSheetComponent, { className: "PoiMapSheetComponent", filePath: "src/app/shared/components/poi-map-sheet/poi-map-sheet.component.ts", lineNumber: 29 }); })();
