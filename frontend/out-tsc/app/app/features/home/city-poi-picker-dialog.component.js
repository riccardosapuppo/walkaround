import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "../../core/services/i18n.service";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/button";
import * as i5 from "../../shared/pipes/duration-label.pipe";
import * as i6 from "../../shared/pipes/translate.pipe";
const _c0 = a0 => ({ city: a0 });
const _c1 = a0 => ({ count: a0 });
const _c2 = a0 => ({ price: a0 });
function CityPoiPickerDialogComponent_button_15_span_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 22);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "cityPicker.unlocked"));
} }
function CityPoiPickerDialogComponent_button_15_span_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 23);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const poi_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.isSelected(poi_r2.id) ? i0.ɵɵpipeBind1(2, 1, "cityPicker.selected") : i0.ɵɵpipeBind1(3, 3, "cityPicker.select"), " ");
} }
function CityPoiPickerDialogComponent_button_15_strong_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const poi_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.formatPrice(poi_r2.priceSingle));
} }
function CityPoiPickerDialogComponent_button_15_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 16);
    i0.ɵɵlistener("click", function CityPoiPickerDialogComponent_button_15_Template_button_click_0_listener() { const poi_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.togglePoi(poi_r2)); });
    i0.ɵɵelementStart(1, "div", 17)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "durationLabel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 18);
    i0.ɵɵtemplate(10, CityPoiPickerDialogComponent_button_15_span_10_Template, 3, 3, "span", 19)(11, CityPoiPickerDialogComponent_button_15_span_11_Template, 4, 5, "span", 20)(12, CityPoiPickerDialogComponent_button_15_strong_12_Template, 2, 1, "strong", 21);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const poi_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("unlocked", poi_r2.unlocked)("selected", ctx_r2.isSelected(poi_r2.id));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(poi_r2.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", poi_r2.distanceLabel, " \u00B7 ", i0.ɵɵpipeBind1(6, 11, poi_r2.durationSec), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(poi_r2.descriptionShort);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", poi_r2.unlocked);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !poi_r2.unlocked);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !poi_r2.unlocked);
} }
export class CityPoiPickerDialogComponent {
    constructor(data, dialogRef, i18n) {
        this.data = data;
        this.dialogRef = dialogRef;
        this.i18n = i18n;
        this.selectedIds = new Set();
    }
    get selectedCount() {
        return this.selectedIds.size;
    }
    get selectedTotal() {
        let total = 0;
        for (const poi of this.data.pois) {
            if (this.selectedIds.has(poi.id)) {
                total += Number(poi.priceSingle || 0);
            }
        }
        return total;
    }
    get selectionCtaLabel() {
        if (!this.selectedCount) {
            return this.i18n.t('cityPicker.selectionCta');
        }
        return this.i18n.t('cityPicker.selectionCtaWithTotal', { price: this.formatPrice(this.selectedTotal) });
    }
    isSelected(poiId) {
        return this.selectedIds.has(poiId);
    }
    togglePoi(poi) {
        if (poi.unlocked) {
            return;
        }
        if (this.selectedIds.has(poi.id)) {
            this.selectedIds.delete(poi.id);
            return;
        }
        this.selectedIds.add(poi.id);
    }
    selectAllLocked() {
        this.selectedIds.clear();
        this.data.pois.forEach((poi) => {
            if (!poi.unlocked) {
                this.selectedIds.add(poi.id);
            }
        });
    }
    clearSelection() {
        this.selectedIds.clear();
    }
    confirmSelection() {
        if (!this.selectedIds.size) {
            return;
        }
        this.dialogRef.close({
            action: 'purchase-selection',
            selectedPoiIds: Array.from(this.selectedIds)
        });
    }
    purchaseCityBundle() {
        this.dialogRef.close({
            action: 'purchase-city-bundle'
        });
    }
    formatPrice(amount) {
        return this.i18n.formatCurrency(Number(amount || 0));
    }
    cityBundlePriceLabel() {
        return this.i18n.formatCurrency(Number(this.data.cityUnlockPriceLabel || 0));
    }
    static { this.ɵfac = function CityPoiPickerDialogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CityPoiPickerDialogComponent)(i0.ɵɵdirectiveInject(MAT_DIALOG_DATA), i0.ɵɵdirectiveInject(i1.MatDialogRef), i0.ɵɵdirectiveInject(i2.I18nService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CityPoiPickerDialogComponent, selectors: [["app-city-poi-picker-dialog"]], standalone: false, decls: 36, vars: 39, consts: [["mat-dialog-title", ""], [1, "picker-content"], [1, "picker-subtitle"], [1, "picker-toolbar"], ["mat-button", "", "type", "button", 3, "click"], [1, "picker-list"], ["type", "button", "class", "picker-row", 3, "unlocked", "selected", "click", 4, "ngFor", "ngForOf"], ["align", "end", 1, "picker-actions"], [1, "picker-summary"], [1, "picker-summary-count"], [1, "picker-summary-total"], [1, "picker-action-buttons"], ["mat-button", "", "mat-dialog-close", ""], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click"], [1, "picker-primary-cta"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "click", "disabled"], ["type", "button", 1, "picker-row", 3, "click"], [1, "picker-row-main"], [1, "picker-row-meta"], ["class", "status-pill unlocked", 4, "ngIf"], ["class", "status-pill locked", 4, "ngIf"], [4, "ngIf"], [1, "status-pill", "unlocked"], [1, "status-pill", "locked"]], template: function CityPoiPickerDialogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "h2", 0);
            i0.ɵɵtext(1);
            i0.ɵɵpipe(2, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "mat-dialog-content", 1)(4, "p", 2);
            i0.ɵɵtext(5);
            i0.ɵɵpipe(6, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "div", 3)(8, "button", 4);
            i0.ɵɵlistener("click", function CityPoiPickerDialogComponent_Template_button_click_8_listener() { return ctx.selectAllLocked(); });
            i0.ɵɵtext(9);
            i0.ɵɵpipe(10, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "button", 4);
            i0.ɵɵlistener("click", function CityPoiPickerDialogComponent_Template_button_click_11_listener() { return ctx.clearSelection(); });
            i0.ɵɵtext(12);
            i0.ɵɵpipe(13, "t");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "div", 5);
            i0.ɵɵtemplate(15, CityPoiPickerDialogComponent_button_15_Template, 13, 13, "button", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "mat-dialog-actions", 7)(17, "div", 8)(18, "span", 9);
            i0.ɵɵtext(19);
            i0.ɵɵpipe(20, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "p", 10);
            i0.ɵɵtext(22);
            i0.ɵɵpipe(23, "t");
            i0.ɵɵelementStart(24, "strong");
            i0.ɵɵtext(25);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(26, "div", 11)(27, "button", 12);
            i0.ɵɵtext(28);
            i0.ɵɵpipe(29, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "button", 13);
            i0.ɵɵlistener("click", function CityPoiPickerDialogComponent_Template_button_click_30_listener() { return ctx.purchaseCityBundle(); });
            i0.ɵɵtext(31);
            i0.ɵɵpipe(32, "t");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(33, "div", 14)(34, "button", 15);
            i0.ɵɵlistener("click", function CityPoiPickerDialogComponent_Template_button_click_34_listener() { return ctx.confirmSelection(); });
            i0.ɵɵtext(35);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 14, "cityPicker.title", i0.ɵɵpureFunction1(33, _c0, ctx.data.cityName)));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(6, 17, "cityPicker.subtitle"));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(10, 19, "cityPicker.selectAllLocked"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(13, 21, "cityPicker.clear"));
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngForOf", ctx.data.pois);
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("has-selection", ctx.selectedCount > 0);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(20, 23, "cityPicker.selectedCount", i0.ɵɵpureFunction1(35, _c1, ctx.selectedCount)));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(23, 26, "cityPicker.singleTotal"), " ");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.formatPrice(ctx.selectedTotal));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(29, 28, "common.cancel"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(32, 30, "cityPicker.unlockCity", i0.ɵɵpureFunction1(37, _c2, ctx.cityBundlePriceLabel())), " ");
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("disabled", ctx.selectedCount === 0);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.selectionCtaLabel, " ");
        } }, dependencies: [i3.NgForOf, i3.NgIf, i4.MatButton, i1.MatDialogClose, i1.MatDialogTitle, i1.MatDialogActions, i1.MatDialogContent, i5.DurationLabelPipe, i6.TranslatePipe], styles: ["[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  overflow-x: hidden;\n}\n\n.picker-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: min(100%, 700px);\n  min-width: 0;\n  max-width: 100%;\n  height: min(calc(94dvh - 300px), 540px);\n  max-height: min(calc(94dvh - 300px), 540px);\n  overflow: hidden;\n  padding-bottom: 4px;\n}\n\n.picker-subtitle[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #5b708e;\n  font-size: 0.9rem;\n}\n\n.picker-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  border: 1px solid #dce7f8;\n  border-radius: 10px;\n  padding: 4px;\n  background: #f7fbff;\n}\n\n.picker-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding-right: 2px;\n  padding-bottom: 4px;\n  min-height: 180px;\n  max-width: 100%;\n}\n\n.picker-row[_ngcontent-%COMP%] {\n  border: 1px solid #dce7f8;\n  border-radius: 12px;\n  background: #fff;\n  text-align: left;\n  width: 100%;\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 10px;\n  padding: 10px;\n  cursor: pointer;\n  max-width: 100%;\n}\n\n.picker-row.selected[_ngcontent-%COMP%] {\n  border-color: #2d7fd0;\n  box-shadow: 0 0 0 2px rgba(45, 127, 208, 0.14);\n  background: #f7fbff;\n}\n\n.picker-row.unlocked[_ngcontent-%COMP%] {\n  cursor: default;\n  background: #fbfdff;\n}\n\n.picker-row-main[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 4px;\n\n  strong {\n    color: #123457;\n    font-size: 0.97rem;\n  }\n\n  small {\n    color: #5f7598;\n    font-size: 0.82rem;\n  }\n\n  p {\n    margin: 0;\n    color: #4f6585;\n    font-size: 0.83rem;\n    line-height: 1.35;\n    display: -webkit-box;\n    -webkit-line-clamp: 2;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n  }\n}\n\n.picker-row-meta[_ngcontent-%COMP%] {\n  display: grid;\n  align-content: start;\n  justify-items: end;\n  gap: 6px;\n  min-width: 108px;\n\n  strong {\n    color: #143a61;\n    font-size: 0.88rem;\n  }\n}\n\n.status-pill[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  padding: 3px 8px;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  border: 1px solid transparent;\n}\n\n.status-pill.unlocked[_ngcontent-%COMP%] {\n  color: #17653d;\n  background: #e7f7ee;\n  border-color: #c6e9d5;\n}\n\n.status-pill.locked[_ngcontent-%COMP%] {\n  color: #114f8f;\n  background: #e9f3ff;\n  border-color: #c9defb;\n}\n\n.picker-actions[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n  align-items: stretch;\n  margin: 0;\n  padding: 12px 14px calc(14px + env(safe-area-inset-bottom));\n  border-top: 1px solid #dce7f8;\n  background: linear-gradient(180deg, rgba(249, 252, 255, 0.97) 0%, #ffffff 16px);\n  box-shadow: 0 -10px 24px rgba(19, 50, 82, 0.08);\n  position: sticky;\n  bottom: 0;\n  z-index: 3;\n}\n\n.picker-summary[_ngcontent-%COMP%] {\n  margin-right: 0;\n  display: grid;\n  gap: 4px;\n  color: #4f6585;\n  border: 1px solid #dce7f8;\n  border-radius: 12px;\n  background: #f7fbff;\n  padding: 9px 14px;\n  min-width: 0;\n  width: 100%;\n}\n\n.picker-summary.has-selection[_ngcontent-%COMP%] {\n  border-color: #bfd8f7;\n  box-shadow: 0 6px 14px rgba(23, 105, 170, 0.12);\n}\n\n.picker-summary-count[_ngcontent-%COMP%] {\n  color: #173e67;\n  font-size: 0.9rem;\n  font-weight: 700;\n  line-height: 1.1;\n}\n\n.picker-summary-total[_ngcontent-%COMP%] {\n  margin: 0;\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 8px;\n  color: #4a6384;\n  font-size: 0.84rem;\n  padding-inline: 4px;\n\n  strong {\n    color: #123a64;\n    font-size: 1.08rem;\n    letter-spacing: 0.01em;\n  }\n}\n\n.picker-action-buttons[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n}\n\n.picker-action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n\n.picker-primary-cta[_ngcontent-%COMP%] {\n  position: sticky;\n  bottom: 0;\n  z-index: 4;\n  width: 100%;\n  padding-top: 2px;\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, #ffffff 20px);\n}\n\n.picker-primary-cta[_ngcontent-%COMP%]   button[mat-flat-button][_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 44px;\n  border-radius: 10px;\n  font-weight: 700;\n}\n\n@media (max-width: 760px) {\n  .picker-content[_ngcontent-%COMP%] {\n    min-width: 0;\n    width: 100%;\n    height: min(calc(94dvh - 320px), 460px);\n    max-height: min(calc(94dvh - 320px), 460px);\n  }\n\n  .picker-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .picker-row-meta[_ngcontent-%COMP%] {\n    justify-items: start;\n    grid-auto-flow: column;\n    grid-auto-columns: max-content;\n    align-items: center;\n  }\n\n  .picker-actions[_ngcontent-%COMP%] {\n    margin: 0;\n    padding: 12px 12px calc(16px + env(safe-area-inset-bottom));\n  }\n\n  .picker-summary[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n  }\n\n  .picker-action-buttons[_ngcontent-%COMP%] {\n    width: 100%;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .picker-action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    min-width: 0;\n    width: 100%;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CityPoiPickerDialogComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-city-poi-picker-dialog', template: "<h2 mat-dialog-title>{{ 'cityPicker.title' | t:{ city: data.cityName } }}</h2>\n\n<mat-dialog-content class=\"picker-content\">\n  <p class=\"picker-subtitle\">{{ 'cityPicker.subtitle' | t }}</p>\n\n  <div class=\"picker-toolbar\">\n    <button mat-button type=\"button\" (click)=\"selectAllLocked()\">{{ 'cityPicker.selectAllLocked' | t }}</button>\n    <button mat-button type=\"button\" (click)=\"clearSelection()\">{{ 'cityPicker.clear' | t }}</button>\n  </div>\n\n  <div class=\"picker-list\">\n    <button\n      type=\"button\"\n      class=\"picker-row\"\n      *ngFor=\"let poi of data.pois\"\n      [class.unlocked]=\"poi.unlocked\"\n      [class.selected]=\"isSelected(poi.id)\"\n      (click)=\"togglePoi(poi)\"\n    >\n      <div class=\"picker-row-main\">\n        <strong>{{ poi.name }}</strong>\n        <small>{{ poi.distanceLabel }} &middot; {{ poi.durationSec | durationLabel }}</small>\n        <p>{{ poi.descriptionShort }}</p>\n      </div>\n\n      <div class=\"picker-row-meta\">\n        <span *ngIf=\"poi.unlocked\" class=\"status-pill unlocked\">{{ 'cityPicker.unlocked' | t }}</span>\n        <span *ngIf=\"!poi.unlocked\" class=\"status-pill locked\">\n          {{ isSelected(poi.id) ? ('cityPicker.selected' | t) : ('cityPicker.select' | t) }}\n        </span>\n        <strong *ngIf=\"!poi.unlocked\">{{ formatPrice(poi.priceSingle) }}</strong>\n      </div>\n    </button>\n  </div>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\" class=\"picker-actions\">\n  <div class=\"picker-summary\" [class.has-selection]=\"selectedCount > 0\">\n    <span class=\"picker-summary-count\">{{ 'cityPicker.selectedCount' | t:{ count: selectedCount } }}</span>\n    <p class=\"picker-summary-total\">\n      {{ 'cityPicker.singleTotal' | t }}\n      <strong>{{ formatPrice(selectedTotal) }}</strong>\n    </p>\n  </div>\n\n  <div class=\"picker-action-buttons\">\n    <button mat-button mat-dialog-close>{{ 'common.cancel' | t }}</button>\n    <button mat-stroked-button color=\"primary\" type=\"button\" (click)=\"purchaseCityBundle()\">\n      {{ 'cityPicker.unlockCity' | t:{ price: cityBundlePriceLabel() } }}\n    </button>\n  </div>\n\n  <div class=\"picker-primary-cta\">\n    <button mat-flat-button color=\"primary\" type=\"button\" [disabled]=\"selectedCount === 0\" (click)=\"confirmSelection()\">\n      {{ selectionCtaLabel }}\n    </button>\n  </div>\n</mat-dialog-actions>\n", styles: [":host {\n  display: block;\n  width: 100%;\n  overflow-x: hidden;\n}\n\n.picker-content {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: min(100%, 700px);\n  min-width: 0;\n  max-width: 100%;\n  height: min(calc(94dvh - 300px), 540px);\n  max-height: min(calc(94dvh - 300px), 540px);\n  overflow: hidden;\n  padding-bottom: 4px;\n}\n\n.picker-subtitle {\n  margin: 0;\n  color: #5b708e;\n  font-size: 0.9rem;\n}\n\n.picker-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  border: 1px solid #dce7f8;\n  border-radius: 10px;\n  padding: 4px;\n  background: #f7fbff;\n}\n\n.picker-list {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding-right: 2px;\n  padding-bottom: 4px;\n  min-height: 180px;\n  max-width: 100%;\n}\n\n.picker-row {\n  border: 1px solid #dce7f8;\n  border-radius: 12px;\n  background: #fff;\n  text-align: left;\n  width: 100%;\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 10px;\n  padding: 10px;\n  cursor: pointer;\n  max-width: 100%;\n}\n\n.picker-row.selected {\n  border-color: #2d7fd0;\n  box-shadow: 0 0 0 2px rgba(45, 127, 208, 0.14);\n  background: #f7fbff;\n}\n\n.picker-row.unlocked {\n  cursor: default;\n  background: #fbfdff;\n}\n\n.picker-row-main {\n  min-width: 0;\n  display: grid;\n  gap: 4px;\n\n  strong {\n    color: #123457;\n    font-size: 0.97rem;\n  }\n\n  small {\n    color: #5f7598;\n    font-size: 0.82rem;\n  }\n\n  p {\n    margin: 0;\n    color: #4f6585;\n    font-size: 0.83rem;\n    line-height: 1.35;\n    display: -webkit-box;\n    -webkit-line-clamp: 2;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n  }\n}\n\n.picker-row-meta {\n  display: grid;\n  align-content: start;\n  justify-items: end;\n  gap: 6px;\n  min-width: 108px;\n\n  strong {\n    color: #143a61;\n    font-size: 0.88rem;\n  }\n}\n\n.status-pill {\n  border-radius: 999px;\n  padding: 3px 8px;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  border: 1px solid transparent;\n}\n\n.status-pill.unlocked {\n  color: #17653d;\n  background: #e7f7ee;\n  border-color: #c6e9d5;\n}\n\n.status-pill.locked {\n  color: #114f8f;\n  background: #e9f3ff;\n  border-color: #c9defb;\n}\n\n.picker-actions {\n  display: grid;\n  gap: 10px;\n  align-items: stretch;\n  margin: 0;\n  padding: 12px 14px calc(14px + env(safe-area-inset-bottom));\n  border-top: 1px solid #dce7f8;\n  background: linear-gradient(180deg, rgba(249, 252, 255, 0.97) 0%, #ffffff 16px);\n  box-shadow: 0 -10px 24px rgba(19, 50, 82, 0.08);\n  position: sticky;\n  bottom: 0;\n  z-index: 3;\n}\n\n.picker-summary {\n  margin-right: 0;\n  display: grid;\n  gap: 4px;\n  color: #4f6585;\n  border: 1px solid #dce7f8;\n  border-radius: 12px;\n  background: #f7fbff;\n  padding: 9px 14px;\n  min-width: 0;\n  width: 100%;\n}\n\n.picker-summary.has-selection {\n  border-color: #bfd8f7;\n  box-shadow: 0 6px 14px rgba(23, 105, 170, 0.12);\n}\n\n.picker-summary-count {\n  color: #173e67;\n  font-size: 0.9rem;\n  font-weight: 700;\n  line-height: 1.1;\n}\n\n.picker-summary-total {\n  margin: 0;\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 8px;\n  color: #4a6384;\n  font-size: 0.84rem;\n  padding-inline: 4px;\n\n  strong {\n    color: #123a64;\n    font-size: 1.08rem;\n    letter-spacing: 0.01em;\n  }\n}\n\n.picker-action-buttons {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n}\n\n.picker-action-buttons button {\n  width: 100%;\n  min-width: 0;\n}\n\n.picker-primary-cta {\n  position: sticky;\n  bottom: 0;\n  z-index: 4;\n  width: 100%;\n  padding-top: 2px;\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, #ffffff 20px);\n}\n\n.picker-primary-cta button[mat-flat-button] {\n  width: 100%;\n  min-height: 44px;\n  border-radius: 10px;\n  font-weight: 700;\n}\n\n@media (max-width: 760px) {\n  .picker-content {\n    min-width: 0;\n    width: 100%;\n    height: min(calc(94dvh - 320px), 460px);\n    max-height: min(calc(94dvh - 320px), 460px);\n  }\n\n  .picker-row {\n    grid-template-columns: 1fr;\n  }\n\n  .picker-row-meta {\n    justify-items: start;\n    grid-auto-flow: column;\n    grid-auto-columns: max-content;\n    align-items: center;\n  }\n\n  .picker-actions {\n    margin: 0;\n    padding: 12px 12px calc(16px + env(safe-area-inset-bottom));\n  }\n\n  .picker-summary {\n    width: 100%;\n    min-width: 0;\n  }\n\n  .picker-action-buttons {\n    width: 100%;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .picker-action-buttons button {\n    min-width: 0;\n    width: 100%;\n  }\n}\n"] }]
    }], () => [{ type: undefined, decorators: [{
                type: Inject,
                args: [MAT_DIALOG_DATA]
            }] }, { type: i1.MatDialogRef }, { type: i2.I18nService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CityPoiPickerDialogComponent, { className: "CityPoiPickerDialogComponent", filePath: "frontend/src/app/features/home/city-poi-picker-dialog.component.ts", lineNumber: 32 }); })();
