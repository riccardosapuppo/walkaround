import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, combineLatest, map, of, shareReplay, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { formatCityLabel } from '../../core/utils/city-label.util';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/app-state.service";
import * as i2 from "../../core/services/geo.service";
import * as i3 from "../../core/services/poi.service";
import * as i4 from "../../core/services/purchase.service";
import * as i5 from "../../core/services/player.service";
import * as i6 from "../../core/services/structure-location.service";
import * as i7 from "../../core/services/cart.service";
import * as i8 from "@angular/material/snack-bar";
import * as i9 from "@angular/router";
import * as i10 from "../../core/services/i18n.service";
import * as i11 from "@angular/common";
import * as i12 from "@angular/material/button";
import * as i13 from "@angular/material/card";
import * as i14 from "@angular/material/form-field";
import * as i15 from "@angular/material/icon";
import * as i16 from "@angular/material/progress-spinner";
import * as i17 from "@angular/material/select";
import * as i18 from "../../shared/directives/img-fallback.directive";
import * as i19 from "../../shared/pipes/duration-label.pipe";
import * as i20 from "../../shared/pipes/translate.pipe";
const _c0 = a0 => ({ time: a0 });
const _c1 = (a0, a1) => ({ city: a0, price: a1 });
const _c2 = a0 => ({ city: a0 });
const _c3 = a0 => ({ price: a0 });
function HomeComponent_section_0_mat_option_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 23);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r3 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("value", city_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.cityName(city_r3.id));
} }
function HomeComponent_section_0_mat_card_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 24)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 25);
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.apiErrorMessage);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(5, 2, "home.apiHint"));
} }
function HomeComponent_section_0_button_29_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 26);
    i0.ɵɵlistener("click", function HomeComponent_section_0_button_29_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleCitySummary()); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.citySummaryExpanded ? i0.ɵɵpipeBind1(2, 1, "common.showLess") : i0.ɵɵpipeBind1(3, 3, "common.showMore"), " ");
} }
function HomeComponent_section_0_mat_card_35_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 27)(1, "div", 28)(2, "p", 29);
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 30);
    i0.ɵɵtext(6);
    i0.ɵɵpipe(7, "t");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "h3");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "p", 31);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 32);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_35_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.navigateToAssociatedStructure()); });
    i0.ɵɵtext(13);
    i0.ɵɵpipe(14, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const structure_r6 = ctx.ngIf;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 5, "home.associatedStructure"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 7, "home.structureActive"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(structure_r6.structureName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(structure_r6.structureAddress);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(14, 9, "home.navigateToStructure"));
} }
function HomeComponent_section_0_mat_card_36_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 33)(1, "p", 34);
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "h3");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p");
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "durationLabel");
    i0.ɵɵpipe(9, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 32);
    i0.ɵɵlistener("click", function HomeComponent_section_0_mat_card_36_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.resumePlayback()); });
    i0.ɵɵtext(11);
    i0.ɵɵpipe(12, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(3, 4, "home.continueListening"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.poiName(ctx_r1.continuePoi));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(9, 8, "home.resumeFrom", i0.ɵɵpureFunction1(13, _c0, i0.ɵɵpipeBind1(8, 6, ctx_r1.continueTime))));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(12, 11, "home.resume"));
} }
function HomeComponent_section_0_div_37_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 35)(1, "button", 36);
    i0.ɵɵlistener("click", function HomeComponent_section_0_div_37_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.purchaseCity(ctx_r1.activeCityId)); });
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(3, 1, "home.unlockCity", i0.ɵɵpureFunction2(4, _c1, ctx_r1.currentCityName(), ctx_r1.i18n.formatCurrency(ctx_r1.cityUnlockPrice))), " ");
} }
function HomeComponent_section_0_mat_card_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 37);
    i0.ɵɵelement(1, "mat-progress-spinner", 38);
    i0.ɵɵelementStart(2, "div", 39)(3, "p", 40);
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 41);
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "t");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(5, 2, "home.updatingCity", i0.ɵɵpureFunction1(7, _c2, ctx_r1.currentCityName())));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 5, "home.loadingPoi"));
} }
function HomeComponent_section_0_ng_container_43_mat_card_1_button_13_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 26);
    i0.ɵɵlistener("click", function HomeComponent_section_0_ng_container_43_mat_card_1_button_13_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r11); const poi_r10 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); ctx_r1.togglePoiDescription(poi_r10.id); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const poi_r10 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isPoiDescriptionExpanded(poi_r10.id) ? i0.ɵɵpipeBind1(2, 1, "common.showLess") : i0.ɵɵpipeBind1(3, 3, "common.showMore"), " ");
} }
function HomeComponent_section_0_ng_container_43_mat_card_1_div_21_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 55)(1, "button", 56);
    i0.ɵɵlistener("click", function HomeComponent_section_0_ng_container_43_mat_card_1_div_21_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r12); const poi_r10 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.addPoiToCart(poi_r10)); });
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const poi_r10 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isPoiInCart(poi_r10.id));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isPoiInCart(poi_r10.id) ? i0.ɵɵpipeBind1(3, 2, "home.placeAlreadyInCart") : i0.ɵɵpipeBind2(4, 4, "mapSheet.unlockPlace", i0.ɵɵpureFunction1(7, _c3, ctx_r1.i18n.formatCurrency(poi_r10.priceSingle))), " ");
} }
function HomeComponent_section_0_ng_container_43_mat_card_1_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 43)(1, "div", 44)(2, "img", 45);
    i0.ɵɵlistener("click", function HomeComponent_section_0_ng_container_43_mat_card_1_Template_img_click_2_listener() { const poi_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.openPoi(poi_r10.id)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 46);
    i0.ɵɵlistener("click", function HomeComponent_section_0_ng_container_43_mat_card_1_Template_div_click_3_listener() { const poi_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.openPoi(poi_r10.id)); });
    i0.ɵɵelementStart(4, "h4");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 47);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 48);
    i0.ɵɵtext(9);
    i0.ɵɵpipe(10, "durationLabel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "p", 49);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(13, HomeComponent_section_0_ng_container_43_mat_card_1_button_13_Template, 4, 5, "button", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 50)(15, "button", 51);
    i0.ɵɵlistener("click", function HomeComponent_section_0_ng_container_43_mat_card_1_Template_button_click_15_listener() { const poi_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onPoiAudioAction(poi_r10)); });
    i0.ɵɵelementStart(16, "mat-icon", 52);
    i0.ɵɵtext(17, "headphones");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "button", 53);
    i0.ɵɵlistener("click", function HomeComponent_section_0_ng_container_43_mat_card_1_Template_button_click_18_listener() { const poi_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleFavorite(poi_r10.id)); });
    i0.ɵɵelementStart(19, "mat-icon", 52);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵtemplate(21, HomeComponent_section_0_ng_container_43_mat_card_1_div_21_Template, 5, 9, "div", 54);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const poi_r10 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("appImgFallback", poi_r10.imageUrl)("alt", ctx_r1.poiName(poi_r10));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.poiName(poi_r10));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.poiAddress(poi_r10));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", poi_r10.distanceLabel, " - ", i0.ɵɵpipeBind1(10, 13, poi_r10.durationSec), "");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("expanded", ctx_r1.isPoiDescriptionExpanded(poi_r10.id));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.poiDescription(poi_r10));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canExpandPoiDescription(poi_r10));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.hasPlayableAudio(poi_r10));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.isFavorite(poi_r10.id) ? "favorite" : "favorite_border");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !poi_r10.unlocked);
} }
function HomeComponent_section_0_ng_container_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, HomeComponent_section_0_ng_container_43_mat_card_1_Template, 22, 15, "mat-card", 42);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const vm_r13 = i0.ɵɵnextContext().ngIf;
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", vm_r13.pois);
} }
function HomeComponent_section_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 2)(1, "header", 3)(2, "div", 4);
    i0.ɵɵelement(3, "img", 5);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementStart(5, "div", 6)(6, "p", 7);
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 8)(10, "mat-form-field", 9)(11, "mat-icon", 10);
    i0.ɵɵtext(12, "location_city");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "mat-select", 11);
    i0.ɵɵlistener("selectionChange", function HomeComponent_section_0_Template_mat_select_selectionChange_13_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCityChanged($event.value)); });
    i0.ɵɵtemplate(14, HomeComponent_section_0_mat_option_14_Template, 2, 2, "mat-option", 12);
    i0.ɵɵelementEnd()()()()()();
    i0.ɵɵtemplate(15, HomeComponent_section_0_mat_card_15_Template, 6, 4, "mat-card", 13);
    i0.ɵɵelementStart(16, "mat-card", 14)(17, "p")(18, "strong");
    i0.ɵɵtext(19);
    i0.ɵɵpipe(20, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "p")(23, "strong");
    i0.ɵɵtext(24);
    i0.ɵɵpipe(25, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "p", 15);
    i0.ɵɵtext(28);
    i0.ɵɵtemplate(29, HomeComponent_section_0_button_29_Template, 4, 5, "button", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "p")(31, "strong");
    i0.ɵɵtext(32);
    i0.ɵɵpipe(33, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(35, HomeComponent_section_0_mat_card_35_Template, 15, 11, "mat-card", 17)(36, HomeComponent_section_0_mat_card_36_Template, 13, 15, "mat-card", 18)(37, HomeComponent_section_0_div_37_Template, 4, 7, "div", 19);
    i0.ɵɵelementStart(38, "section", 20)(39, "h3");
    i0.ɵɵtext(40);
    i0.ɵɵpipe(41, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(42, HomeComponent_section_0_mat_card_42_Template, 9, 9, "mat-card", 21)(43, HomeComponent_section_0_ng_container_43_Template, 2, 1, "ng-container", 22);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const vm_r13 = ctx.ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵattribute("alt", i0.ɵɵpipeBind1(4, 19, "common.appName"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 21, "common.brandTagline"));
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("value", ctx_r1.activeCityId);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.cities);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.apiErrorMessage);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(20, 23, "home.region"), ":");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.currentCityRegion(), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(25, 25, "home.city"), ":");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.currentCityName(), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.citySummaryText(), " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canExpandCitySummary());
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(33, 27, "home.placesOfInterest"), ":");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", vm_r13.pois.length, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.visibleAssociatedStructure);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.continuePoi);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.isCityBundleUnlocked(ctx_r1.activeCityId));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(41, 29, "home.nearYou"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.citySwitching);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.citySwitching);
} }
function HomeComponent_section_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 57);
    i0.ɵɵelement(1, "mat-progress-spinner", 58);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 1, "home.loadingPoi"));
} }
const cityFallbackMap = {
    catania: { lat: 37.5079, lng: 15.083 },
    siracusa: { lat: 37.067, lng: 15.2866 },
    taormina: { lat: 37.8531, lng: 15.2899 },
    ragusa: { lat: 36.9269, lng: 14.7305 }
};
const homeScrollStorageKey = 'walkaround.home.scrollY';
const citySummaryMaxLength = 160;
export class HomeComponent {
    constructor(appState, geoService, poiService, purchaseService, playerService, structureLocationService, cartService, snackBar, router, i18n) {
        this.appState = appState;
        this.geoService = geoService;
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.playerService = playerService;
        this.structureLocationService = structureLocationService;
        this.cartService = cartService;
        this.snackBar = snackBar;
        this.router = router;
        this.i18n = i18n;
        this.apiErrorMessage = null;
        this.loading = true;
        this.cityUnlockPrice = 15;
        this.activeCityId = 'catania';
        this.associatedStructure = null;
        this.citySwitching = false;
        this.cities = [];
        this.citySummaryExpanded = false;
        this.vm$ = combineLatest([
            this.appState.activeCityId$.pipe(switchMap((cityId) => this.poiService.getPoisByCity(cityId).pipe(tap(() => {
                this.apiErrorMessage = null;
            }), map((pois) => ({ cityId, pois })), catchError((error) => {
                this.apiErrorMessage = this.describeApiError(error);
                return of({ cityId, pois: [] });
            })))),
            this.geoService.coordinates$.pipe(startWith(null)),
            this.purchaseService.purchases$.pipe(startWith({ items: [], unlockedPoiIds: [], unlockedCityIds: [] }))
        ]).pipe(map(([cityData, coordinates]) => {
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
                    distanceLabel: this.i18n.formatDistance(distanceMeters),
                    unlocked,
                    near: distanceMeters <= environment.geofenceRadiusMeters
                };
            })
                .sort((a, b) => a.distanceMeters - b.distanceMeters);
            return {
                cityId: cityData.cityId,
                nearestPoi: pois[0] || null,
                pois
            };
        }), shareReplay({ bufferSize: 1, refCount: true }));
        this.continueTime = 0;
        this.geofenceShown = new Set();
        this.expandedPoiDescriptions = new Set();
        this.destroy$ = new Subject();
        this.restoredScroll = false;
        this.lastActiveCityId = null;
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
        this.poiService
            .getCities()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
            next: (cities) => {
                this.cities = Array.isArray(cities) ? cities : [];
            },
            error: () => {
                this.cities = [];
            }
        });
        combineLatest([this.appState.activeCityId$, this.appState.hotelAssociation$])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([cityId, association]) => {
            if (this.lastActiveCityId && this.lastActiveCityId !== cityId) {
                this.citySwitching = true;
                this.citySummaryExpanded = false;
                this.expandedPoiDescriptions.clear();
            }
            this.lastActiveCityId = cityId;
            this.activeCityId = cityId;
            this.associatedStructure = association;
        });
        this.vm$.pipe(takeUntil(this.destroy$)).subscribe((vm) => {
            this.loading = false;
            this.restoreScrollPosition();
            if (vm.cityId === this.activeCityId) {
                this.citySwitching = false;
            }
            if (vm.nearestPoi && vm.nearestPoi.near && !this.geofenceShown.has(vm.nearestPoi.id) && this.hasPlayableAudio(vm.nearestPoi)) {
                this.geofenceShown.add(vm.nearestPoi.id);
                const ref = this.snackBar.open(this.i18n.t('home.geofencePrompt', { name: this.poiName(vm.nearestPoi) }), this.i18n.t('home.geofenceAction'), {
                    duration: 4500,
                    verticalPosition: 'top'
                });
                ref.onAction().subscribe(() => {
                    this.saveScrollPosition();
                    void this.router.navigate(['/player', vm.nearestPoi.id], { queryParams: { preview: false } });
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
                    this.continuePoi = this.hasPlayableAudio(poi) ? poi : undefined;
                }
            });
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    onCityChanged(cityId) {
        if (!cityId || cityId === this.activeCityId) {
            return;
        }
        this.citySwitching = true;
        this.citySummaryExpanded = false;
        this.expandedPoiDescriptions.clear();
        this.appState.setActiveCity(cityId);
    }
    currentCityName() {
        const city = this.cities.find((item) => item.id === this.activeCityId);
        return this.i18n.resolveCityField(city?.name, city?.translations, 'name') || this.cityName(this.activeCityId);
    }
    currentCityRegion() {
        const city = this.cities.find((item) => item.id === this.activeCityId);
        return this.i18n.translateRegion(String(city?.region || '').trim() || 'Sicilia');
    }
    currentCityDescription() {
        const key = `home.cityDescription.${this.activeCityId}`;
        const description = this.i18n.t(key);
        return description === key ? '' : description;
    }
    citySummaryText() {
        const full = this.currentCityDescription();
        if (this.citySummaryExpanded || full.length <= citySummaryMaxLength) {
            return full;
        }
        return `${full.slice(0, citySummaryMaxLength).trimEnd()}...`;
    }
    canExpandCitySummary() {
        return this.currentCityDescription().length > citySummaryMaxLength;
    }
    toggleCitySummary() {
        this.citySummaryExpanded = !this.citySummaryExpanded;
    }
    isCityBundleUnlocked(cityId) {
        return this.purchaseService.isCityUnlocked(cityId);
    }
    purchaseCity(cityId) {
        this.purchaseService.purchaseCityBundle(cityId, this.cityName(cityId), this.cityUnlockPrice).subscribe({
            next: (result) => {
                if (result?.action === 'paid') {
                    this.toast(this.i18n.t('map.cityUnlocked', { city: this.cityName(cityId) }));
                }
            },
            error: () => {
                this.toast(this.i18n.t('home.operationFailed'), this.i18n.t('common.close'), 2600);
            }
        });
    }
    addPoiToCart(poi) {
        if (this.purchaseService.isPoiUnlocked(poi.id, poi.cityId)) {
            this.toast(this.i18n.t('home.placeAlreadyUnlocked'), this.i18n.t('common.ok'), 2000);
            return;
        }
        if (this.cartService.isPoiInCart(poi.id)) {
            this.toast(this.i18n.t('home.placeAlreadyInCart'), this.i18n.t('common.ok'), 2200);
            return;
        }
        const added = this.cartService.addPoi({
            poiId: poi.id,
            cityId: poi.cityId,
            cityName: this.cityName(poi.cityId),
            label: this.poiName(poi),
            amount: poi.priceSingle
        });
        if (added) {
            this.toast(this.i18n.t('home.placeAdded', { name: this.poiName(poi) }));
        }
    }
    isPoiInCart(poiId) {
        return this.cartService.isPoiInCart(poiId);
    }
    onPoiAudioAction(poi) {
        if (!this.hasPlayableAudio(poi)) {
            this.toast(this.i18n.t('home.noAudio'));
            return;
        }
        if (poi.unlocked) {
            this.playPoi(poi, false);
            return;
        }
        this.openPoi(poi.id);
    }
    toggleFavorite(poiId) {
        this.appState.toggleFavorite(poiId);
    }
    isFavorite(poiId) {
        return this.appState.isFavorite(poiId);
    }
    togglePoiDescription(poiId) {
        if (!poiId) {
            return;
        }
        if (this.expandedPoiDescriptions.has(poiId)) {
            this.expandedPoiDescriptions.delete(poiId);
            return;
        }
        this.expandedPoiDescriptions.add(poiId);
    }
    isPoiDescriptionExpanded(poiId) {
        return this.expandedPoiDescriptions.has(poiId);
    }
    canExpandPoiDescription(poi) {
        return String(this.poiDescription(poi) || '').trim().length > 120;
    }
    poiAddress(poi) {
        return `${this.cityName(poi.cityId)} - ${this.i18n.t('common.coordinates')} ${poi.lat.toFixed(4)}, ${poi.lng.toFixed(4)}`;
    }
    poiName(poi) {
        return this.i18n.resolvePoiField(poi?.name, poi?.translations, 'name');
    }
    poiDescription(poi) {
        return this.i18n.resolvePoiField(poi?.descriptionShort, poi?.translations, 'descriptionShort');
    }
    playPoi(poi, preview) {
        if (!this.hasPlayableAudio(poi)) {
            this.toast(this.i18n.t('home.noAudio'));
            return;
        }
        this.saveScrollPosition();
        void this.router.navigate(['/player', poi.id], {
            queryParams: { preview }
        });
    }
    openPoi(poiId) {
        this.saveScrollPosition();
        void this.router.navigate(['/poi', poiId]);
    }
    navigateToAssociatedStructure() {
        const association = this.visibleAssociatedStructure;
        if (!association?.structureId) {
            return;
        }
        const url = this.structureLocationService.buildExternalDirectionsUrl(association, null);
        if (!url) {
            this.toast(this.i18n.t('home.structureNavigationUnavailable'), this.i18n.t('common.close'));
            return;
        }
        window.open(url, '_blank', 'noopener');
    }
    cityName(cityId) {
        return formatCityLabel(cityId, this.cities, this.i18n.language);
    }
    resumePlayback() {
        if (!this.continuePoi || !this.hasPlayableAudio(this.continuePoi)) {
            return;
        }
        this.playPoi(this.continuePoi, false);
    }
    hasPlayableAudio(poi) {
        return Boolean(this.i18n.resolvePoiAudioUrl(poi));
    }
    toast(message, action = this.i18n.t('common.ok'), duration = 2400) {
        this.snackBar.open(message, action, {
            duration,
            verticalPosition: 'top'
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
    describeApiError(error) {
        if (error instanceof HttpErrorResponse) {
            if (error.status === 0) {
                return this.i18n.t('home.backendUnavailable');
            }
            if (error.status === 200) {
                return this.i18n.t('home.apiInvalid');
            }
            return this.i18n.t('home.apiError');
        }
        return this.i18n.t('home.apiError');
    }
    associationCityIds(association) {
        if (Array.isArray(association.cityIds) && association.cityIds.length) {
            return association.cityIds.map((cityId) => String(cityId || '').trim()).filter(Boolean);
        }
        const singleCityId = String(association.cityId || '').trim();
        return singleCityId ? [singleCityId] : [];
    }
    static { this.ɵfac = function HomeComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HomeComponent)(i0.ɵɵdirectiveInject(i1.AppStateService), i0.ɵɵdirectiveInject(i2.GeoService), i0.ɵɵdirectiveInject(i3.PoiService), i0.ɵɵdirectiveInject(i4.PurchaseService), i0.ɵɵdirectiveInject(i5.PlayerService), i0.ɵɵdirectiveInject(i6.StructureLocationService), i0.ɵɵdirectiveInject(i7.CartService), i0.ɵɵdirectiveInject(i8.MatSnackBar), i0.ɵɵdirectiveInject(i9.Router), i0.ɵɵdirectiveInject(i10.I18nService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: HomeComponent, selectors: [["app-home"]], standalone: false, decls: 3, vars: 4, consts: [["class", "page-shell home", 4, "ngIf"], ["class", "page-shell home loading-state", 4, "ngIf"], [1, "page-shell", "home"], [1, "home-brand"], [1, "home-brand-stage"], ["src", "/assets/logo.png", "loading", "eager", "decoding", "sync", "fetchpriority", "high", 1, "home-logo"], [1, "home-brand-footer"], [1, "home-slogan"], [1, "home-brand-controls"], ["appearance", "fill", 1, "city-select"], ["matPrefix", "", "fontSet", "material-icons-round", 1, "city-select-icon"], [3, "selectionChange", "value"], [3, "value", 4, "ngFor", "ngForOf"], ["class", "card warning api-warning", 4, "ngIf"], [1, "card", "city-summary"], [1, "summary-description"], ["mat-button", "", "type", "button", "class", "expand-inline-btn", 3, "click", 4, "ngIf"], ["class", "card structure-card", 4, "ngIf"], ["class", "card continue", 4, "ngIf"], ["class", "city-unlock-wrap", 4, "ngIf"], [1, "nearby-section"], ["class", "card city-switch-loader", 4, "ngIf"], [4, "ngIf"], [3, "value"], [1, "card", "warning", "api-warning"], [1, "hint"], ["mat-button", "", "type", "button", 1, "expand-inline-btn", 3, "click"], [1, "card", "structure-card"], [1, "structure-head"], [1, "structure-kicker"], [1, "status-chip", "unlocked"], [1, "structure-address"], ["mat-stroked-button", "", "color", "primary", 3, "click"], [1, "card", "continue"], [1, "section-label"], [1, "city-unlock-wrap"], ["mat-flat-button", "", "color", "primary", 1, "big-cta", "city-unlock-btn", 3, "click"], [1, "card", "city-switch-loader"], ["mode", "indeterminate", "diameter", "32"], [1, "city-switch-loader-copy"], [1, "city-switch-loader-title"], [1, "city-switch-loader-subtitle"], ["class", "card poi-card", 4, "ngFor", "ngForOf"], [1, "card", "poi-card"], [1, "poi-card-main"], [3, "click", "appImgFallback", "alt"], [1, "poi-meta", 3, "click"], [1, "poi-address"], [1, "poi-distance"], [1, "poi-teaser"], [1, "poi-quick-actions"], ["mat-icon-button", "", "color", "primary", 3, "click", "disabled"], ["fontSet", "material-icons-round"], ["mat-icon-button", "", "color", "primary", 3, "click"], ["class", "poi-unlock-actions", 4, "ngIf"], [1, "poi-unlock-actions"], ["mat-flat-button", "", "color", "primary", 1, "unlock-poi-btn", 3, "click", "disabled"], [1, "page-shell", "home", "loading-state"], ["mode", "indeterminate", "diameter", "48"]], template: function HomeComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, HomeComponent_section_0_Template, 44, 31, "section", 0);
            i0.ɵɵpipe(1, "async");
            i0.ɵɵtemplate(2, HomeComponent_section_2_Template, 5, 3, "section", 1);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", i0.ɵɵpipeBind1(1, 2, ctx.vm$));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.loading);
        } }, dependencies: [i11.NgForOf, i11.NgIf, i12.MatButton, i12.MatIconButton, i13.MatCard, i14.MatFormField, i14.MatPrefix, i15.MatIcon, i16.MatProgressSpinner, i17.MatSelect, i17.MatOption, i18.ImgFallbackDirective, i11.AsyncPipe, i19.DurationLabelPipe, i20.TranslatePipe], styles: [".home[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n}\n\n.home-brand[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.home-brand-stage[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  border-radius: 28px;\n  padding: 18px 18px 34px;\n  background:\n    radial-gradient(circle at top left, rgba(87, 160, 217, 0.22) 0%, rgba(87, 160, 217, 0) 42%),\n    radial-gradient(circle at right 18% bottom 18%, rgba(32, 124, 87, 0.14) 0%, rgba(32, 124, 87, 0) 34%),\n    linear-gradient(145deg, #f7fbff 0%, #f0f6ff 45%, #ffffff 100%);\n  border: 1px solid rgba(22, 72, 120, 0.1);\n  box-shadow: 0 18px 36px rgba(15, 47, 79, 0.08);\n}\n\n.home-brand-stage[_ngcontent-%COMP%]::before, \n.home-brand-stage[_ngcontent-%COMP%]::after {\n  content: '';\n  position: absolute;\n  border-radius: 999px;\n  pointer-events: none;\n}\n\n.home-brand-stage[_ngcontent-%COMP%]::before {\n  width: 180px;\n  height: 180px;\n  top: -88px;\n  right: -56px;\n  background: rgba(31, 118, 180, 0.08);\n}\n\n.home-brand-stage[_ngcontent-%COMP%]::after {\n  width: 130px;\n  height: 130px;\n  left: -42px;\n  bottom: -48px;\n  background: rgba(28, 121, 82, 0.08);\n}\n\n.home-logo[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  display: block;\n  width: 100%;\n  height: auto;\n  max-height: 112px;\n  object-fit: contain;\n}\n\n.home-slogan[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  margin: 0;\n  max-width: 30ch;\n  text-align: center;\n  font-size: 1.02rem;\n  font-weight: 700;\n  line-height: 1.45;\n  color: #17385c;\n}\n\n.home-brand-footer[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  margin-top: 14px;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(240px, 280px);\n  gap: 18px;\n  align-items: end;\n}\n\n.home-brand-controls[_ngcontent-%COMP%] {\n  justify-self: end;\n  width: 100%;\n  padding: 0;\n  background: transparent;\n  box-shadow: none;\n  backdrop-filter: none;\n}\n\n.city-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.city-select-icon[_ngcontent-%COMP%] {\n  color: #4f6785;\n  margin-left: 14px;\n  margin-right: 8px;\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n\n.home-brand-controls[_ngcontent-%COMP%]     .mat-mdc-text-field-wrapper {\n  height: 40px;\n  border-radius: 16px;\n  background: rgba(235, 244, 255, 0.58);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);\n  backdrop-filter: blur(10px);\n}\n\n.home-brand-controls[_ngcontent-%COMP%]     .mat-mdc-form-field-flex {\n  height: 100%;\n  align-items: center;\n}\n\n.home-brand-controls[_ngcontent-%COMP%]     .mdc-line-ripple {\n  display: none;\n}\n\n.home-brand-controls[_ngcontent-%COMP%]     .mat-mdc-form-field-infix {\n  min-height: 40px;\n  padding: 0 14px 0 0;\n  display: flex;\n  align-items: center;\n}\n\n.home-brand-controls[_ngcontent-%COMP%]     .mat-mdc-select {\n  font-size: 0.98rem;\n  font-weight: 700;\n  color: #18375b;\n}\n\n.home-brand-controls[_ngcontent-%COMP%]     .mat-mdc-select-arrow {\n  color: #4c6481;\n}\n\n.home-brand-controls[_ngcontent-%COMP%]     .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n\n.api-warning[_ngcontent-%COMP%] {\n  border: 1px solid #f0cf8e;\n  background: #fff7e8;\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #89652a;\n  }\n\n  .hint {\n    margin-top: 6px;\n    font-size: 0.88rem;\n  }\n}\n\n.city-summary[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 6px;\n\n  p {\n    margin: 0;\n    color: #4d6481;\n  }\n}\n\n.summary-description[_ngcontent-%COMP%] {\n  line-height: 1.5;\n}\n\n.expand-inline-btn[_ngcontent-%COMP%] {\n  min-width: unset;\n  padding-inline: 4px;\n  line-height: 1.4;\n  font-size: 0.8rem;\n  color: #1769aa;\n}\n\n.structure-card[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 6px;\n  border: 1px solid rgba(23, 105, 170, 0.16);\n  background:\n    linear-gradient(140deg, rgba(23, 105, 170, 0.05) 0%, rgba(63, 170, 87, 0.04) 55%, rgba(255, 255, 255, 0.96) 100%),\n    #fff;\n\n  h3 {\n    margin: 0;\n    color: #12304f;\n  }\n}\n\n.structure-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.structure-kicker[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: #617591;\n}\n\n.structure-address[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #5d7390;\n  font-size: 0.9rem;\n}\n\n.continue[_ngcontent-%COMP%] {\n  padding: 14px;\n\n  .section-label {\n    margin: 0 0 6px;\n    font-size: 0.82rem;\n    text-transform: uppercase;\n    letter-spacing: 0.04em;\n    color: #5d6d86;\n  }\n\n  h3 {\n    margin: 0;\n  }\n\n  p {\n    margin: 6px 0 0;\n    color: #5d6d86;\n  }\n\n  button {\n    margin-top: 10px;\n  }\n}\n\n.city-unlock-wrap[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n}\n\n.city-unlock-btn[_ngcontent-%COMP%] {\n  width: min(420px, 100%);\n}\n\n.nearby-section[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n\n  h3 {\n    margin: 0;\n  }\n}\n\n.city-switch-loader[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  border: 1px solid rgba(23, 105, 170, 0.18);\n}\n\n.city-switch-loader-copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 3px;\n}\n\n.city-switch-loader-title[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #16395f;\n  font-size: 0.95rem;\n  font-weight: 700;\n}\n\n.city-switch-loader-subtitle[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #5c7392;\n  font-size: 0.86rem;\n}\n\n.poi-card[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n}\n\n.poi-card-main[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 92px 1fr auto;\n  gap: 12px;\n  align-items: start;\n\n  img {\n    width: 92px;\n    height: 78px;\n    object-fit: cover;\n    border-radius: 12px;\n    cursor: pointer;\n  }\n}\n\n.poi-meta[_ngcontent-%COMP%] {\n  min-width: 0;\n  cursor: pointer;\n\n  h4 {\n    margin: 0 0 4px;\n    font-size: 1.02rem;\n    color: #0f2743;\n  }\n\n  p {\n    margin: 0;\n    color: #61758f;\n    font-size: 0.88rem;\n  }\n}\n\n.poi-address[_ngcontent-%COMP%] {\n  margin-bottom: 2px !important;\n}\n\n.poi-distance[_ngcontent-%COMP%] {\n  margin-bottom: 8px !important;\n}\n\n.poi-teaser[_ngcontent-%COMP%] {\n  color: #566c8a !important;\n  font-size: 0.84rem !important;\n  line-height: 1.35 !important;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.poi-teaser.expanded[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.poi-quick-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 2px;\n}\n\n.poi-unlock-actions[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n  margin-top: 2px;\n}\n\n.unlock-poi-btn[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 40px;\n  border-radius: 12px;\n}\n\n@media (max-width: 600px) {\n  .home-brand-stage[_ngcontent-%COMP%] {\n    border-radius: 24px;\n    padding: 14px 14px 30px;\n  }\n\n  .home-logo[_ngcontent-%COMP%] {\n    max-height: 82px;\n  }\n\n  .home-slogan[_ngcontent-%COMP%] {\n    font-size: 0.96rem;\n  }\n\n  .home-brand-footer[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 12px;\n  }\n\n  .home-brand-controls[_ngcontent-%COMP%] {\n    justify-self: stretch;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HomeComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-home', template: "<section class=\"page-shell home\" *ngIf=\"vm$ | async as vm\">\n  <header class=\"home-brand\">\n    <div class=\"home-brand-stage\">\n      <img class=\"home-logo\" src=\"/assets/logo.png\" [attr.alt]=\"'common.appName' | t\" loading=\"eager\" decoding=\"sync\" fetchpriority=\"high\" />\n      <div class=\"home-brand-footer\">\n        <p class=\"home-slogan\">{{ 'common.brandTagline' | t }}</p>\n\n        <div class=\"home-brand-controls\">\n          <mat-form-field appearance=\"fill\" class=\"city-select\">\n            <mat-icon matPrefix fontSet=\"material-icons-round\" class=\"city-select-icon\">location_city</mat-icon>\n            <mat-select [value]=\"activeCityId\" (selectionChange)=\"onCityChanged($event.value)\">\n              <mat-option *ngFor=\"let city of cities\" [value]=\"city.id\">{{ cityName(city.id) }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n  </header>\n\n  <mat-card class=\"card warning api-warning\" *ngIf=\"apiErrorMessage\">\n    <p>{{ apiErrorMessage }}</p>\n    <p class=\"hint\">{{ 'home.apiHint' | t }}</p>\n  </mat-card>\n\n  <mat-card class=\"card city-summary\">\n    <p><strong>{{ 'home.region' | t }}:</strong> {{ currentCityRegion() }}</p>\n    <p><strong>{{ 'home.city' | t }}:</strong> {{ currentCityName() }}</p>\n    <p class=\"summary-description\">\n      {{ citySummaryText() }}\n      <button mat-button type=\"button\" class=\"expand-inline-btn\" *ngIf=\"canExpandCitySummary()\" (click)=\"toggleCitySummary()\">\n        {{ citySummaryExpanded ? ('common.showLess' | t) : ('common.showMore' | t) }}\n      </button>\n    </p>\n    <p><strong>{{ 'home.placesOfInterest' | t }}:</strong> {{ vm.pois.length }}</p>\n  </mat-card>\n\n  <mat-card class=\"card structure-card\" *ngIf=\"visibleAssociatedStructure as structure\">\n    <div class=\"structure-head\">\n      <p class=\"structure-kicker\">{{ 'home.associatedStructure' | t }}</p>\n      <span class=\"status-chip unlocked\">{{ 'home.structureActive' | t }}</span>\n    </div>\n    <h3>{{ structure.structureName }}</h3>\n    <p class=\"structure-address\">{{ structure.structureAddress }}</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"navigateToAssociatedStructure()\">{{ 'home.navigateToStructure' | t }}</button>\n  </mat-card>\n\n  <mat-card class=\"card continue\" *ngIf=\"continuePoi\">\n    <p class=\"section-label\">{{ 'home.continueListening' | t }}</p>\n    <h3>{{ poiName(continuePoi) }}</h3>\n    <p>{{ 'home.resumeFrom' | t:{ time: (continueTime | durationLabel) } }}</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"resumePlayback()\">{{ 'home.resume' | t }}</button>\n  </mat-card>\n\n  <div class=\"city-unlock-wrap\" *ngIf=\"!isCityBundleUnlocked(activeCityId)\">\n    <button mat-flat-button color=\"primary\" class=\"big-cta city-unlock-btn\" (click)=\"purchaseCity(activeCityId)\">\n      {{ 'home.unlockCity' | t:{ city: currentCityName(), price: i18n.formatCurrency(cityUnlockPrice) } }}\n    </button>\n  </div>\n\n  <section class=\"nearby-section\">\n    <h3>{{ 'home.nearYou' | t }}</h3>\n\n    <mat-card class=\"card city-switch-loader\" *ngIf=\"citySwitching\">\n      <mat-progress-spinner mode=\"indeterminate\" diameter=\"32\"></mat-progress-spinner>\n      <div class=\"city-switch-loader-copy\">\n        <p class=\"city-switch-loader-title\">{{ 'home.updatingCity' | t:{ city: currentCityName() } }}</p>\n        <p class=\"city-switch-loader-subtitle\">{{ 'home.loadingPoi' | t }}</p>\n      </div>\n    </mat-card>\n\n    <ng-container *ngIf=\"!citySwitching\">\n      <mat-card class=\"card poi-card\" *ngFor=\"let poi of vm.pois\">\n        <div class=\"poi-card-main\">\n          <img [appImgFallback]=\"poi.imageUrl\" [alt]=\"poiName(poi)\" (click)=\"openPoi(poi.id)\" />\n\n          <div class=\"poi-meta\" (click)=\"openPoi(poi.id)\">\n            <h4>{{ poiName(poi) }}</h4>\n            <p class=\"poi-address\">{{ poiAddress(poi) }}</p>\n            <p class=\"poi-distance\">{{ poi.distanceLabel }} - {{ poi.durationSec | durationLabel }}</p>\n            <p class=\"poi-teaser\" [class.expanded]=\"isPoiDescriptionExpanded(poi.id)\">{{ poiDescription(poi) }}</p>\n            <button\n              mat-button\n              type=\"button\"\n              class=\"expand-inline-btn\"\n              *ngIf=\"canExpandPoiDescription(poi)\"\n              (click)=\"togglePoiDescription(poi.id); $event.stopPropagation()\"\n            >\n              {{ isPoiDescriptionExpanded(poi.id) ? ('common.showLess' | t) : ('common.showMore' | t) }}\n            </button>\n          </div>\n\n          <div class=\"poi-quick-actions\">\n            <button mat-icon-button color=\"primary\" (click)=\"onPoiAudioAction(poi)\" [disabled]=\"!hasPlayableAudio(poi)\">\n              <mat-icon fontSet=\"material-icons-round\">headphones</mat-icon>\n            </button>\n            <button mat-icon-button color=\"primary\" (click)=\"toggleFavorite(poi.id)\">\n              <mat-icon fontSet=\"material-icons-round\">{{ isFavorite(poi.id) ? 'favorite' : 'favorite_border' }}</mat-icon>\n            </button>\n          </div>\n        </div>\n\n        <div class=\"poi-unlock-actions\" *ngIf=\"!poi.unlocked\">\n          <button mat-flat-button color=\"primary\" class=\"unlock-poi-btn\" (click)=\"addPoiToCart(poi)\" [disabled]=\"isPoiInCart(poi.id)\">\n            {{\n              isPoiInCart(poi.id)\n                ? ('home.placeAlreadyInCart' | t)\n                : ('mapSheet.unlockPlace' | t:{ price: i18n.formatCurrency(poi.priceSingle) })\n            }}\n          </button>\n        </div>\n      </mat-card>\n    </ng-container>\n  </section>\n</section>\n\n<section class=\"page-shell home loading-state\" *ngIf=\"loading\">\n  <mat-progress-spinner mode=\"indeterminate\" diameter=\"48\"></mat-progress-spinner>\n  <p>{{ 'home.loadingPoi' | t }}</p>\n</section>\n", styles: [".home {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n}\n\n.home-brand {\n  display: block;\n}\n\n.home-brand-stage {\n  position: relative;\n  overflow: hidden;\n  border-radius: 28px;\n  padding: 18px 18px 34px;\n  background:\n    radial-gradient(circle at top left, rgba(87, 160, 217, 0.22) 0%, rgba(87, 160, 217, 0) 42%),\n    radial-gradient(circle at right 18% bottom 18%, rgba(32, 124, 87, 0.14) 0%, rgba(32, 124, 87, 0) 34%),\n    linear-gradient(145deg, #f7fbff 0%, #f0f6ff 45%, #ffffff 100%);\n  border: 1px solid rgba(22, 72, 120, 0.1);\n  box-shadow: 0 18px 36px rgba(15, 47, 79, 0.08);\n}\n\n.home-brand-stage::before,\n.home-brand-stage::after {\n  content: '';\n  position: absolute;\n  border-radius: 999px;\n  pointer-events: none;\n}\n\n.home-brand-stage::before {\n  width: 180px;\n  height: 180px;\n  top: -88px;\n  right: -56px;\n  background: rgba(31, 118, 180, 0.08);\n}\n\n.home-brand-stage::after {\n  width: 130px;\n  height: 130px;\n  left: -42px;\n  bottom: -48px;\n  background: rgba(28, 121, 82, 0.08);\n}\n\n.home-logo {\n  position: relative;\n  z-index: 1;\n  display: block;\n  width: 100%;\n  height: auto;\n  max-height: 112px;\n  object-fit: contain;\n}\n\n.home-slogan {\n  position: relative;\n  z-index: 1;\n  margin: 0;\n  max-width: 30ch;\n  text-align: center;\n  font-size: 1.02rem;\n  font-weight: 700;\n  line-height: 1.45;\n  color: #17385c;\n}\n\n.home-brand-footer {\n  position: relative;\n  z-index: 1;\n  margin-top: 14px;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(240px, 280px);\n  gap: 18px;\n  align-items: end;\n}\n\n.home-brand-controls {\n  justify-self: end;\n  width: 100%;\n  padding: 0;\n  background: transparent;\n  box-shadow: none;\n  backdrop-filter: none;\n}\n\n.city-select {\n  width: 100%;\n}\n\n.city-select-icon {\n  color: #4f6785;\n  margin-left: 14px;\n  margin-right: 8px;\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n\n.home-brand-controls ::ng-deep .mat-mdc-text-field-wrapper {\n  height: 40px;\n  border-radius: 16px;\n  background: rgba(235, 244, 255, 0.58);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);\n  backdrop-filter: blur(10px);\n}\n\n.home-brand-controls ::ng-deep .mat-mdc-form-field-flex {\n  height: 100%;\n  align-items: center;\n}\n\n.home-brand-controls ::ng-deep .mdc-line-ripple {\n  display: none;\n}\n\n.home-brand-controls ::ng-deep .mat-mdc-form-field-infix {\n  min-height: 40px;\n  padding: 0 14px 0 0;\n  display: flex;\n  align-items: center;\n}\n\n.home-brand-controls ::ng-deep .mat-mdc-select {\n  font-size: 0.98rem;\n  font-weight: 700;\n  color: #18375b;\n}\n\n.home-brand-controls ::ng-deep .mat-mdc-select-arrow {\n  color: #4c6481;\n}\n\n.home-brand-controls ::ng-deep .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n\n.api-warning {\n  border: 1px solid #f0cf8e;\n  background: #fff7e8;\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #89652a;\n  }\n\n  .hint {\n    margin-top: 6px;\n    font-size: 0.88rem;\n  }\n}\n\n.city-summary {\n  padding: 14px;\n  display: grid;\n  gap: 6px;\n\n  p {\n    margin: 0;\n    color: #4d6481;\n  }\n}\n\n.summary-description {\n  line-height: 1.5;\n}\n\n.expand-inline-btn {\n  min-width: unset;\n  padding-inline: 4px;\n  line-height: 1.4;\n  font-size: 0.8rem;\n  color: #1769aa;\n}\n\n.structure-card {\n  padding: 14px;\n  display: grid;\n  gap: 6px;\n  border: 1px solid rgba(23, 105, 170, 0.16);\n  background:\n    linear-gradient(140deg, rgba(23, 105, 170, 0.05) 0%, rgba(63, 170, 87, 0.04) 55%, rgba(255, 255, 255, 0.96) 100%),\n    #fff;\n\n  h3 {\n    margin: 0;\n    color: #12304f;\n  }\n}\n\n.structure-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.structure-kicker {\n  margin: 0;\n  font-size: 0.74rem;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: #617591;\n}\n\n.structure-address {\n  margin: 0;\n  color: #5d7390;\n  font-size: 0.9rem;\n}\n\n.continue {\n  padding: 14px;\n\n  .section-label {\n    margin: 0 0 6px;\n    font-size: 0.82rem;\n    text-transform: uppercase;\n    letter-spacing: 0.04em;\n    color: #5d6d86;\n  }\n\n  h3 {\n    margin: 0;\n  }\n\n  p {\n    margin: 6px 0 0;\n    color: #5d6d86;\n  }\n\n  button {\n    margin-top: 10px;\n  }\n}\n\n.city-unlock-wrap {\n  display: flex;\n  justify-content: center;\n}\n\n.city-unlock-btn {\n  width: min(420px, 100%);\n}\n\n.nearby-section {\n  display: grid;\n  gap: 10px;\n\n  h3 {\n    margin: 0;\n  }\n}\n\n.city-switch-loader {\n  padding: 14px;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  border: 1px solid rgba(23, 105, 170, 0.18);\n}\n\n.city-switch-loader-copy {\n  display: grid;\n  gap: 3px;\n}\n\n.city-switch-loader-title {\n  margin: 0;\n  color: #16395f;\n  font-size: 0.95rem;\n  font-weight: 700;\n}\n\n.city-switch-loader-subtitle {\n  margin: 0;\n  color: #5c7392;\n  font-size: 0.86rem;\n}\n\n.poi-card {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n}\n\n.poi-card-main {\n  display: grid;\n  grid-template-columns: 92px 1fr auto;\n  gap: 12px;\n  align-items: start;\n\n  img {\n    width: 92px;\n    height: 78px;\n    object-fit: cover;\n    border-radius: 12px;\n    cursor: pointer;\n  }\n}\n\n.poi-meta {\n  min-width: 0;\n  cursor: pointer;\n\n  h4 {\n    margin: 0 0 4px;\n    font-size: 1.02rem;\n    color: #0f2743;\n  }\n\n  p {\n    margin: 0;\n    color: #61758f;\n    font-size: 0.88rem;\n  }\n}\n\n.poi-address {\n  margin-bottom: 2px !important;\n}\n\n.poi-distance {\n  margin-bottom: 8px !important;\n}\n\n.poi-teaser {\n  color: #566c8a !important;\n  font-size: 0.84rem !important;\n  line-height: 1.35 !important;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.poi-teaser.expanded {\n  display: block;\n}\n\n.poi-quick-actions {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 2px;\n}\n\n.poi-unlock-actions {\n  display: grid;\n  gap: 8px;\n  margin-top: 2px;\n}\n\n.unlock-poi-btn {\n  width: 100%;\n  min-height: 40px;\n  border-radius: 12px;\n}\n\n@media (max-width: 600px) {\n  .home-brand-stage {\n    border-radius: 24px;\n    padding: 14px 14px 30px;\n  }\n\n  .home-logo {\n    max-height: 82px;\n  }\n\n  .home-slogan {\n    font-size: 0.96rem;\n  }\n\n  .home-brand-footer {\n    grid-template-columns: 1fr;\n    gap: 12px;\n  }\n\n  .home-brand-controls {\n    justify-self: stretch;\n  }\n}\n"] }]
    }], () => [{ type: i1.AppStateService }, { type: i2.GeoService }, { type: i3.PoiService }, { type: i4.PurchaseService }, { type: i5.PlayerService }, { type: i6.StructureLocationService }, { type: i7.CartService }, { type: i8.MatSnackBar }, { type: i9.Router }, { type: i10.I18nService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "frontend/src/app/features/home/home.component.ts", lineNumber: 48 }); })();
