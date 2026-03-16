import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/bottom-sheet";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/button";
function PoiMapSheetComponent_button_10_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 8);
    i0.ɵɵlistener("click", function PoiMapSheetComponent_button_10_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.play(false)); });
    i0.ɵɵtext(1, " Riproduci ");
    i0.ɵɵelementEnd();
} }
function PoiMapSheetComponent_ng_template_11_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 8);
    i0.ɵɵlistener("click", function PoiMapSheetComponent_ng_template_11_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.purchasePoi()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 5);
    i0.ɵɵlistener("click", function PoiMapSheetComponent_ng_template_11_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.purchaseCity()); });
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" Sblocca questo luogo \u20AC", ctx_r2.formatPrice(ctx_r2.data.poi.priceSingle), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" Sblocca ", ctx_r2.cityName(ctx_r2.data.poi.cityId), " \u20AC", ctx_r2.cityUnlockPriceLabel, " ");
} }
const cityNameMap = {
    catania: 'Catania',
    siracusa: 'Siracusa',
    taormina: 'Taormina'
};
export class PoiMapSheetComponent {
    constructor(data, bottomSheetRef) {
        this.data = data;
        this.bottomSheetRef = bottomSheetRef;
        this.cityUnlockPriceLabel = '14,99';
    }
    openDetail() {
        this.bottomSheetRef.dismiss({ action: 'open-detail', poiId: this.data.poi.id });
    }
    play(preview) {
        this.bottomSheetRef.dismiss({ action: 'play', poiId: this.data.poi.id, preview });
    }
    purchasePoi() {
        this.bottomSheetRef.dismiss({
            action: 'purchase-poi',
            poiId: this.data.poi.id
        });
    }
    purchaseCity() {
        this.bottomSheetRef.dismiss({
            action: 'purchase-city',
            cityId: this.data.poi.cityId
        });
    }
    formatPrice(amount) {
        return amount.toFixed(2).replace('.', ',');
    }
    cityName(cityId) {
        return cityNameMap[cityId] || cityId;
    }
    static { this.ɵfac = function PoiMapSheetComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PoiMapSheetComponent)(i0.ɵɵdirectiveInject(MAT_BOTTOM_SHEET_DATA), i0.ɵɵdirectiveInject(i1.MatBottomSheetRef)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PoiMapSheetComponent, selectors: [["app-poi-map-sheet"]], standalone: false, decls: 15, vars: 6, consts: [["lockedAction", ""], [1, "sheet-wrap"], [1, "sheet-image", 3, "src", "alt"], [1, "sheet-header"], [1, "sheet-actions"], ["mat-stroked-button", "", "color", "primary", 3, "click"], ["mat-flat-button", "", "color", "primary", 3, "click", 4, "ngIf", "ngIfElse"], ["mat-button", "", 3, "click"], ["mat-flat-button", "", "color", "primary", 3, "click"]], template: function PoiMapSheetComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 1);
            i0.ɵɵelement(1, "img", 2);
            i0.ɵɵelementStart(2, "div", 3)(3, "h3");
            i0.ɵɵtext(4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "div", 4)(8, "button", 5);
            i0.ɵɵlistener("click", function PoiMapSheetComponent_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.play(true)); });
            i0.ɵɵtext(9, "Ascolta preview");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(10, PoiMapSheetComponent_button_10_Template, 2, 0, "button", 6)(11, PoiMapSheetComponent_ng_template_11_Template, 4, 3, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "button", 7);
            i0.ɵɵlistener("click", function PoiMapSheetComponent_Template_button_click_13_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.openDetail()); });
            i0.ɵɵtext(14, "Vai al dettaglio");
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            const lockedAction_r5 = i0.ɵɵreference(12);
            i0.ɵɵadvance();
            i0.ɵɵproperty("src", ctx.data.poi.imageUrl, i0.ɵɵsanitizeUrl)("alt", ctx.data.poi.name);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.data.poi.name);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.data.distanceLabel);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", ctx.data.unlocked)("ngIfElse", lockedAction_r5);
        } }, dependencies: [i2.NgIf, i3.MatButton], styles: [".sheet-wrap[_ngcontent-%COMP%] {\n  padding: 8px 8px 20px;\n}\n\n.sheet-image[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 16px;\n  aspect-ratio: 16/9;\n  object-fit: cover;\n}\n\n.sheet-header[_ngcontent-%COMP%] {\n  margin-top: 12px;\n\n  h3 {\n    margin: 0;\n    font-size: 1.1rem;\n  }\n\n  p {\n    margin: 4px 0 0;\n    color: #66748f;\n  }\n}\n\n.sheet-actions[_ngcontent-%COMP%] {\n  margin: 16px 0 8px;\n  display: grid;\n  gap: 10px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PoiMapSheetComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-poi-map-sheet', template: "<div class=\"sheet-wrap\">\n  <img class=\"sheet-image\" [src]=\"data.poi.imageUrl\" [alt]=\"data.poi.name\" />\n\n  <div class=\"sheet-header\">\n    <h3>{{ data.poi.name }}</h3>\n    <p>{{ data.distanceLabel }}</p>\n  </div>\n\n  <div class=\"sheet-actions\">\n    <button mat-stroked-button color=\"primary\" (click)=\"play(true)\">Ascolta preview</button>\n\n    <button *ngIf=\"data.unlocked; else lockedAction\" mat-flat-button color=\"primary\" (click)=\"play(false)\">\n      Riproduci\n    </button>\n\n    <ng-template #lockedAction>\n      <button mat-flat-button color=\"primary\" (click)=\"purchasePoi()\">\n        Sblocca questo luogo \u20AC{{ formatPrice(data.poi.priceSingle) }}\n      </button>\n\n      <button mat-stroked-button color=\"primary\" (click)=\"purchaseCity()\">\n        Sblocca {{ cityName(data.poi.cityId) }} \u20AC{{ cityUnlockPriceLabel }}\n      </button>\n    </ng-template>\n  </div>\n\n  <button mat-button (click)=\"openDetail()\">Vai al dettaglio</button>\n</div>\r\n", styles: [".sheet-wrap {\n  padding: 8px 8px 20px;\n}\n\n.sheet-image {\n  width: 100%;\n  border-radius: 16px;\n  aspect-ratio: 16/9;\n  object-fit: cover;\n}\n\n.sheet-header {\n  margin-top: 12px;\n\n  h3 {\n    margin: 0;\n    font-size: 1.1rem;\n  }\n\n  p {\n    margin: 4px 0 0;\n    color: #66748f;\n  }\n}\n\n.sheet-actions {\n  margin: 16px 0 8px;\n  display: grid;\n  gap: 10px;\n}\r\n"] }]
    }], () => [{ type: undefined, decorators: [{
                type: Inject,
                args: [MAT_BOTTOM_SHEET_DATA]
            }] }, { type: i1.MatBottomSheetRef }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PoiMapSheetComponent, { className: "PoiMapSheetComponent", filePath: "frontend/src/app/shared/components/poi-map-sheet/poi-map-sheet.component.ts", lineNumber: 29 }); })();
