import { Component } from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { formatCityLabel } from '../../core/utils/city-label.util';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/poi.service";
import * as i2 from "../../core/services/app-state.service";
import * as i3 from "../../core/services/purchase.service";
import * as i4 from "../../core/services/structure-location.service";
import * as i5 from "@angular/material/snack-bar";
import * as i6 from "../../core/services/i18n.service";
import * as i7 from "@angular/common";
import * as i8 from "@angular/material/button";
import * as i9 from "@angular/material/card";
import * as i10 from "@angular/material/form-field";
import * as i11 from "@angular/material/progress-spinner";
import * as i12 from "@angular/material/select";
import * as i13 from "../../shared/pipes/translate.pipe";
function ProfileComponent_mat_card_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 11);
    i0.ɵɵelement(1, "mat-progress-spinner", 12);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 1, "profile.loading"));
} }
function ProfileComponent_ng_container_10_mat_option_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r3 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("value", city_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.cityName(city_r3.id));
} }
function ProfileComponent_ng_container_10_p_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(2, 2, "profile.activeCodeExpiry"), ": ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.inviteCodeExpiresAt);
} }
function ProfileComponent_ng_container_10_p_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 3, "profile.associatedStructure"), ": ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.hotelAssociation.structureName);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" (", ctx_r1.hotelAssociation.structureAddress, ") ");
} }
function ProfileComponent_ng_container_10_div_30_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 31)(1, "button", 32);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_10_div_30_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.navigateToAssociatedStructure()); });
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(3, 1, "profile.navigateToStructure"), " ");
} }
function ProfileComponent_ng_container_10_ng_template_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "profile.noAssociatedStructure"));
} }
function ProfileComponent_ng_container_10_div_33_div_6_small_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const entry_r5 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind1(2, 2, "profile.expiry"), ": ", ctx_r1.entryExpiryLabel(entry_r5), "");
} }
function ProfileComponent_ng_container_10_div_33_div_6_small_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const entry_r5 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind1(2, 2, "profile.usedAt"), ": ", ctx_r1.entryUsedAtLabel(entry_r5), "");
} }
function ProfileComponent_ng_container_10_div_33_div_6_button_19_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 40);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_10_div_33_div_6_button_19_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const entry_r5 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.removeInviteCodeAssociation(entry_r5)); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.removingInviteCode ? i0.ɵɵpipeBind1(2, 1, "profile.removingCode") : i0.ɵɵpipeBind1(3, 3, "profile.removeCode"), " ");
} }
function ProfileComponent_ng_container_10_div_33_div_6_ng_template_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 41);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "profile.codeLocked"));
} }
function ProfileComponent_ng_container_10_div_33_div_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 36)(1, "div", 37)(2, "code");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "small");
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "t");
    i0.ɵɵpipe(9, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "small");
    i0.ɵɵtext(11);
    i0.ɵɵpipe(12, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "small");
    i0.ɵɵtext(14);
    i0.ɵɵpipe(15, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(16, ProfileComponent_ng_container_10_div_33_div_6_small_16_Template, 3, 4, "small", 10)(17, ProfileComponent_ng_container_10_div_33_div_6_small_17_Template, 3, 4, "small", 10);
    i0.ɵɵelementStart(18, "div", 38);
    i0.ɵɵtemplate(19, ProfileComponent_ng_container_10_div_33_div_6_button_19_Template, 4, 5, "button", 39)(20, ProfileComponent_ng_container_10_div_33_div_6_ng_template_20_Template, 3, 3, "ng-template", null, 2, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const entry_r5 = ctx.$implicit;
    const codeNotRemovable_r7 = i0.ɵɵreference(21);
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(entry_r5.inviteCode);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.codeEntryStatusClass(entry_r5));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.codeEntryStatusLabel(entry_r5));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind1(8, 14, "profile.associatedStructure"), ": ", entry_r5.structureName || i0.ɵɵpipeBind1(9, 16, "profile.structureUnavailable"), "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind1(12, 18, "profile.scope"), ": ", ctx_r1.codeEntryScopeLabel(entry_r5), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind1(15, 20, "profile.city"), ": ", ctx_r1.codeEntryCitiesLabel(entry_r5), "");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", entry_r5.expiresAt);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", entry_r5.usedAt);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.canRemoveCodeEntry(entry_r5))("ngIfElse", codeNotRemovable_r7);
} }
function ProfileComponent_ng_container_10_div_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 33)(1, "p")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 34);
    i0.ɵɵtemplate(6, ProfileComponent_ng_container_10_div_33_div_6_Template, 22, 22, "div", 35);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(4, 2, "profile.codeList"), ":");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngForOf", ctx_r1.hotelCodeEntries);
} }
function ProfileComponent_ng_container_10_ng_template_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "profile.noCodeHistory"));
} }
function ProfileComponent_ng_container_10_span_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 42);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cityId_r8 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.cityName(cityId_r8));
} }
function ProfileComponent_ng_container_10_span_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 43);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "profile.noUnlockedCities"));
} }
function ProfileComponent_ng_container_10_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "mat-card", 13)(2, "h3");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "mat-form-field", 14)(6, "mat-label");
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "mat-select", 15);
    i0.ɵɵlistener("selectionChange", function ProfileComponent_ng_container_10_Template_mat_select_selectionChange_9_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setCity($event.value)); });
    i0.ɵɵtemplate(10, ProfileComponent_ng_container_10_mat_option_10_Template, 2, 2, "mat-option", 16);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "mat-card", 13)(12, "h3");
    i0.ɵɵtext(13);
    i0.ɵɵpipe(14, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "p");
    i0.ɵɵtext(16);
    i0.ɵɵpipe(17, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "p");
    i0.ɵɵtext(19);
    i0.ɵɵpipe(20, "t");
    i0.ɵɵelementStart(21, "strong");
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "p");
    i0.ɵɵtext(24);
    i0.ɵɵpipe(25, "t");
    i0.ɵɵelementStart(26, "strong");
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(28, ProfileComponent_ng_container_10_p_28_Template, 5, 4, "p", 10)(29, ProfileComponent_ng_container_10_p_29_Template, 6, 5, "p", 17)(30, ProfileComponent_ng_container_10_div_30_Template, 4, 3, "div", 18)(31, ProfileComponent_ng_container_10_ng_template_31_Template, 3, 3, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor)(33, ProfileComponent_ng_container_10_div_33_Template, 7, 4, "div", 19)(34, ProfileComponent_ng_container_10_ng_template_34_Template, 3, 3, "ng-template", null, 1, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "mat-card", 13)(37, "h3");
    i0.ɵɵtext(38);
    i0.ɵɵpipe(39, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "div", 20);
    i0.ɵɵtemplate(41, ProfileComponent_ng_container_10_span_41_Template, 2, 1, "span", 21)(42, ProfileComponent_ng_container_10_span_42_Template, 3, 3, "span", 22);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "div", 23)(44, "button", 24);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_10_Template_button_click_44_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.restorePurchases()); });
    i0.ɵɵtext(45);
    i0.ɵɵpipe(46, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "button", 25);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_10_Template_button_click_47_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.resetUserSession()); });
    i0.ɵɵtext(48);
    i0.ɵɵpipe(49, "t");
    i0.ɵɵpipe(50, "t");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(51, "mat-card", 13)(52, "h3");
    i0.ɵɵtext(53);
    i0.ɵɵpipe(54, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "div", 23)(56, "button", 26);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_10_Template_button_click_56_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setLanguage("it")); });
    i0.ɵɵtext(57);
    i0.ɵɵpipe(58, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(59, "button", 26);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_10_Template_button_click_59_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setLanguage("en")); });
    i0.ɵɵtext(60);
    i0.ɵɵpipe(61, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(62, "button", 26);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_10_Template_button_click_62_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setLanguage("fr")); });
    i0.ɵɵtext(63);
    i0.ɵɵpipe(64, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(65, "button", 26);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_10_Template_button_click_65_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setLanguage("es")); });
    i0.ɵɵtext(66);
    i0.ɵɵpipe(67, "t");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(68, "mat-card", 27)(69, "a", 28);
    i0.ɵɵtext(70);
    i0.ɵɵpipe(71, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(72, "a", 29);
    i0.ɵɵtext(73);
    i0.ɵɵpipe(74, "t");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const noAssociation_r9 = i0.ɵɵreference(32);
    const noCodeHistory_r10 = i0.ɵɵreference(35);
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 33, "profile.activeCity"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 35, "profile.city"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", ctx_r1.activeCityId);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.cities);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(14, 37, "profile.inviteCodes"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(17, 39, "profile.manageCodes"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(20, 41, "profile.activeCode"), ": ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.hotelCode);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(25, 43, "profile.activeCodeStatus"), ": ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.inviteCodeStatusText);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.hotelAssociation);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.hotelAssociation)("ngIfElse", noAssociation_r9);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.hotelAssociation);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.hotelCodeEntries.length)("ngIfElse", noCodeHistory_r10);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(39, 45, "profile.unlockedCities"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngForOf", ctx_r1.unlockedCityIds);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.unlockedCityIds.length);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(46, 47, "profile.restorePurchases"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.resettingUserSession);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.resettingUserSession ? i0.ɵɵpipeBind1(49, 49, "profile.resettingUser") : i0.ɵɵpipeBind1(50, 51, "profile.resetUser"), " ");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(54, 53, "profile.language"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("color", ctx_r1.language === "it" ? "primary" : undefined);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(58, 55, "common.italian"), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("color", ctx_r1.language === "en" ? "primary" : undefined);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(61, 57, "common.english"), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("color", ctx_r1.language === "fr" ? "primary" : undefined);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(64, 59, "common.french"), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("color", ctx_r1.language === "es" ? "primary" : undefined);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(67, 61, "common.spanish"), " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(71, 63, "common.support"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(74, 65, "common.privacy"));
} }
export class ProfileComponent {
    constructor(poiService, appState, purchaseService, structureLocationService, snackBar, i18n) {
        this.poiService = poiService;
        this.appState = appState;
        this.purchaseService = purchaseService;
        this.structureLocationService = structureLocationService;
        this.snackBar = snackBar;
        this.i18n = i18n;
        this.cities = [];
        this.activeCityId = 'catania';
        this.hotelCode = '-';
        this.hotelAssociation = null;
        this.hotelCodeEntries = [];
        this.unlockedCityIds = [];
        this.language = 'it';
        this.loading = true;
        this.removingInviteCode = false;
        this.resettingUserSession = false;
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.purchaseService.refresh();
        this.syncHotelAssociationDetails();
        this.poiService
            .getCities()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
            next: (cities) => {
                this.cities = cities;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.cities = [];
            }
        });
        combineLatest([
            this.appState.activeCityId$,
            this.appState.hotelCode$,
            this.appState.hotelAssociation$,
            this.appState.language$,
            this.purchaseService.purchases$
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([cityId, hotelCode, hotelAssociation, language, purchases]) => {
            this.activeCityId = cityId;
            this.hotelCode = hotelCode || '-';
            this.hotelAssociation = hotelAssociation;
            this.language = language;
            this.unlockedCityIds = purchases.unlockedCityIds;
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    setCity(cityId) {
        this.appState.setActiveCity(cityId);
    }
    setLanguage(language) {
        this.appState.setLanguage(language);
        this.snackBar.open(this.i18n.t('profile.languageSet', { language: this.i18n.languageLabel(language) }), this.i18n.t('common.ok'), { duration: 1800 });
    }
    get hasStoredInviteCode() {
        return this.hotelCode !== '-' || !!this.hotelAssociation;
    }
    get inviteCodeStatusText() {
        const status = this.hotelAssociation?.codeStatus || (this.hasStoredInviteCode ? 'invalid' : null);
        if (status === 'valid') {
            return this.i18n.t('profile.inviteStatus.valid');
        }
        if (status === 'used') {
            return this.i18n.t('profile.inviteStatus.used');
        }
        if (status === 'expired') {
            return this.i18n.t('profile.inviteStatus.expired');
        }
        if (status === 'invalid') {
            return this.i18n.t('profile.inviteStatus.invalid');
        }
        return this.i18n.t('profile.inviteStatus.none');
    }
    get inviteCodeExpiresAt() {
        return this.i18n.formatDateTime(this.hotelAssociation?.expiresAt);
    }
    removeInviteCodeAssociation(entry) {
        if (this.removingInviteCode) {
            return;
        }
        if (entry && !this.canRemoveCodeEntry(entry)) {
            this.snackBar.open(this.i18n.t('profile.removeUsedError'), this.i18n.t('common.close'), { duration: 2500 });
            return;
        }
        if (!entry && !this.hasStoredInviteCode) {
            return;
        }
        const codeLabel = entry?.inviteCode || this.hotelAssociation?.inviteCode || this.hotelCode;
        const confirmed = window.confirm(this.i18n.t('profile.removeCodeConfirm', { code: codeLabel || this.hotelCode }));
        if (!confirmed) {
            return;
        }
        this.removingInviteCode = true;
        this.purchaseService.removeHotelAssociation().subscribe({
            next: () => {
                this.appState.setHotelCode('');
                this.appState.setHotelAssociation(null);
                this.syncHotelAssociationDetails();
                this.removingInviteCode = false;
                this.snackBar.open(this.i18n.t('profile.removeCodeDone'), this.i18n.t('common.ok'), { duration: 2200 });
            },
            error: () => {
                this.removingInviteCode = false;
                this.snackBar.open(this.i18n.t('profile.removeCodeError'), this.i18n.t('common.close'), { duration: 3200 });
            }
        });
    }
    restorePurchases() {
        this.purchaseService.refresh();
        this.snackBar.open(this.i18n.t('profile.restoreDone'), this.i18n.t('common.ok'), { duration: 2200 });
    }
    codeEntryStatusLabel(entry) {
        if (entry.status === 'activated') {
            return this.i18n.t('profile.codeStatus.activated');
        }
        if (entry.status === 'used') {
            return this.i18n.t('profile.codeStatus.used');
        }
        if (entry.status === 'expired') {
            return this.i18n.t('profile.codeStatus.expired');
        }
        return this.i18n.t('profile.codeStatus.invalid');
    }
    codeEntryStatusClass(entry) {
        if (entry.status === 'activated') {
            return 'status-chip unlocked';
        }
        if (entry.status === 'used') {
            return 'status-chip pending';
        }
        return 'status-chip locked';
    }
    codeEntryScopeLabel(entry) {
        if (entry.appliesTo === 'bundle') {
            return this.i18n.t('profile.scopeBundle');
        }
        if (entry.appliesTo === 'single') {
            return this.i18n.t('profile.scopeSingle');
        }
        return '-';
    }
    codeEntryCitiesLabel(entry) {
        const ids = Array.isArray(entry.cityIds) ? entry.cityIds.map((id) => String(id || '').trim()).filter(Boolean) : [];
        if (ids.length) {
            return ids.map((cityId) => this.cityName(cityId)).join(', ');
        }
        const names = Array.isArray(entry.cityNames) ? entry.cityNames.map((name) => String(name || '').trim()).filter(Boolean) : [];
        if (names.length) {
            return names.join(', ');
        }
        if (entry.cityName) {
            return entry.cityName;
        }
        return entry.cityId || '-';
    }
    canRemoveCodeEntry(entry) {
        if (this.removingInviteCode) {
            return false;
        }
        if (entry.status === 'used') {
            return false;
        }
        if (!this.hotelAssociation?.inviteCode) {
            return false;
        }
        if (this.hotelAssociation.codeStatus === 'used') {
            return false;
        }
        return String(entry.inviteCode || '').trim().toUpperCase() === String(this.hotelAssociation.inviteCode || '').trim().toUpperCase();
    }
    resetUserSession() {
        if (this.resettingUserSession) {
            return;
        }
        const confirmed = window.confirm(this.i18n.t('profile.resetConfirm'));
        if (!confirmed) {
            return;
        }
        this.resettingUserSession = true;
        const finalizeReset = () => {
            this.purchaseService.resetLocalState();
            this.appState.resetUserSession();
            this.hotelCodeEntries = [];
            this.purchaseService.refresh();
            this.resettingUserSession = false;
            this.snackBar.open(this.i18n.t('profile.resetDone'), this.i18n.t('common.ok'), { duration: 2400 });
        };
        finalizeReset();
    }
    navigateToAssociatedStructure() {
        const association = this.hotelAssociation;
        if (!association?.structureId) {
            return;
        }
        const coordinates = this.coerceCoordinates(association.lat, association.lng);
        const url = this.structureLocationService.buildExternalDirectionsUrl(association, coordinates);
        if (!url) {
            this.snackBar.open(this.i18n.t('profile.structureDataUnavailable'), this.i18n.t('common.close'), { duration: 2400 });
            return;
        }
        window.open(url, '_blank', 'noopener');
    }
    cityName(cityId) {
        return formatCityLabel(cityId, this.cities, this.i18n.language);
    }
    entryExpiryLabel(entry) {
        return this.i18n.formatDateTime(entry.expiresAt);
    }
    entryUsedAtLabel(entry) {
        return this.i18n.formatDateTime(entry.usedAt);
    }
    syncHotelAssociationDetails() {
        this.purchaseService
            .getHotelAssociationDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
            next: ({ association, codes }) => {
                this.hotelCodeEntries = codes;
                this.appState.setHotelAssociation(association);
                if (association?.inviteCode) {
                    this.appState.setHotelCode(association.inviteCode);
                }
                else {
                    this.appState.setHotelCode('');
                }
            },
            error: () => {
                // Keep locally cached association when backend sync is unavailable.
            }
        });
    }
    coerceCoordinates(latRaw, lngRaw) {
        const lat = Number(latRaw);
        const lng = Number(lngRaw);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return null;
        }
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return null;
        }
        return { lat, lng };
    }
    static { this.ɵfac = function ProfileComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ProfileComponent)(i0.ɵɵdirectiveInject(i1.PoiService), i0.ɵɵdirectiveInject(i2.AppStateService), i0.ɵɵdirectiveInject(i3.PurchaseService), i0.ɵɵdirectiveInject(i4.StructureLocationService), i0.ɵɵdirectiveInject(i5.MatSnackBar), i0.ɵɵdirectiveInject(i6.I18nService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ProfileComponent, selectors: [["app-profile"]], standalone: false, decls: 11, vars: 8, consts: [["noAssociation", ""], ["noCodeHistory", ""], ["codeNotRemovable", ""], [1, "page-shell", "profile"], [1, "brand-hero"], [1, "brand-hero-stage"], ["src", "/assets/logo.png", "loading", "eager", "decoding", "sync", "fetchpriority", "high", 1, "brand-hero-logo"], [1, "brand-hero-footer"], [1, "brand-hero-slogan"], ["class", "card section-loading-card", 4, "ngIf"], [4, "ngIf"], [1, "card", "section-loading-card"], ["mode", "indeterminate", "diameter", "44"], [1, "card", "section"], ["appearance", "outline", 1, "full-width"], [3, "selectionChange", "value"], [3, "value", 4, "ngFor", "ngForOf"], [4, "ngIf", "ngIfElse"], ["class", "structure-actions", 4, "ngIf"], ["class", "code-history", 4, "ngIf", "ngIfElse"], [1, "chips"], ["class", "status-chip unlocked", 4, "ngFor", "ngForOf"], ["class", "status-chip locked", 4, "ngIf"], [1, "language-row"], ["mat-stroked-button", "", "color", "primary", 3, "click"], ["mat-stroked-button", "", "color", "warn", "type", "button", 3, "click", "disabled"], ["mat-stroked-button", "", 3, "click", "color"], [1, "card", "section", "links"], ["href", "mailto:info@walkaround.cloud"], ["href", "#", "target", "_blank", "rel", "noopener"], [3, "value"], [1, "structure-actions"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click"], [1, "code-history"], [1, "code-history-list"], ["class", "code-history-item", 4, "ngFor", "ngForOf"], [1, "code-history-item"], [1, "code-history-row"], [1, "code-entry-actions"], ["mat-stroked-button", "", "color", "warn", "type", "button", 3, "click", 4, "ngIf", "ngIfElse"], ["mat-stroked-button", "", "color", "warn", "type", "button", 3, "click"], [1, "code-entry-locked"], [1, "status-chip", "unlocked"], [1, "status-chip", "locked"]], template: function ProfileComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 3)(1, "header", 4)(2, "div", 5);
            i0.ɵɵelement(3, "img", 6);
            i0.ɵɵpipe(4, "t");
            i0.ɵɵelementStart(5, "div", 7)(6, "p", 8);
            i0.ɵɵtext(7);
            i0.ɵɵpipe(8, "t");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵtemplate(9, ProfileComponent_mat_card_9_Template, 5, 3, "mat-card", 9)(10, ProfileComponent_ng_container_10_Template, 75, 67, "ng-container", 10);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵattribute("alt", i0.ɵɵpipeBind1(4, 4, "common.appName"));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 6, "common.brandTagline"));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading);
        } }, dependencies: [i7.NgForOf, i7.NgIf, i8.MatButton, i9.MatCard, i10.MatFormField, i10.MatLabel, i11.MatProgressSpinner, i12.MatSelect, i12.MatOption, i13.TranslatePipe], styles: [".profile[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n}\n\n.section[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  h3 {\n    margin: 0;\n    font-size: 1.05rem;\n  }\n\n  p {\n    margin: 0;\n    color: #677790;\n  }\n}\n\n.full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.chips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.language-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.structure-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-start;\n}\n\n.code-history[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n}\n\n.code-history-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n}\n\n.code-history-item[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 4px;\n  padding: 8px 10px;\n  border-radius: 10px;\n  border: 1px solid #d9e3f2;\n  background: #f8fbff;\n}\n\nbody.app-user-theme[_nghost-%COMP%]   .code-history-item[_ngcontent-%COMP%], body.app-user-theme   [_nghost-%COMP%]   .code-history-item[_ngcontent-%COMP%] {\n  border-color: rgba(182, 164, 129, 0.18);\n  background: linear-gradient(180deg, rgba(247, 250, 253, 0.96) 0%, rgba(250, 246, 239, 0.94) 100%);\n}\n\n.code-history-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.code-history-item[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 0.9rem;\n}\n\n.code-entry-actions[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  display: flex;\n  justify-content: flex-end;\n}\n\n.code-entry-locked[_ngcontent-%COMP%] {\n  color: #7a879c;\n  font-size: 0.8rem;\n}\n\n.status-chip.pending[_ngcontent-%COMP%] {\n  color: #9a3412;\n  background: #fff4e5;\n  border: 1px solid #f6cf9b;\n}\n\n.links[_ngcontent-%COMP%] {\n  a {\n    color: #1769aa;\n    font-weight: 600;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ProfileComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-profile', template: "<section class=\"page-shell profile\">\n  <header class=\"brand-hero\">\n    <div class=\"brand-hero-stage\">\n      <img\n        class=\"brand-hero-logo\"\n        src=\"/assets/logo.png\"\n        [attr.alt]=\"'common.appName' | t\"\n        loading=\"eager\"\n        decoding=\"sync\"\n        fetchpriority=\"high\"\n      />\n      <div class=\"brand-hero-footer\">\n        <p class=\"brand-hero-slogan\">{{ 'common.brandTagline' | t }}</p>\n      </div>\n    </div>\n  </header>\n\n  <mat-card class=\"card section-loading-card\" *ngIf=\"loading\">\n    <mat-progress-spinner mode=\"indeterminate\" diameter=\"44\"></mat-progress-spinner>\n    <p>{{ 'profile.loading' | t }}</p>\n  </mat-card>\n\n  <ng-container *ngIf=\"!loading\">\n    <mat-card class=\"card section\">\n      <h3>{{ 'profile.activeCity' | t }}</h3>\n      <mat-form-field appearance=\"outline\" class=\"full-width\">\n        <mat-label>{{ 'profile.city' | t }}</mat-label>\n        <mat-select [value]=\"activeCityId\" (selectionChange)=\"setCity($event.value)\">\n          <mat-option *ngFor=\"let city of cities\" [value]=\"city.id\">{{ cityName(city.id) }}</mat-option>\n        </mat-select>\n      </mat-form-field>\n    </mat-card>\n\n    <mat-card class=\"card section\">\n      <h3>{{ 'profile.inviteCodes' | t }}</h3>\n      <p>{{ 'profile.manageCodes' | t }}</p>\n      <p>{{ 'profile.activeCode' | t }}: <strong>{{ hotelCode }}</strong></p>\n      <p>{{ 'profile.activeCodeStatus' | t }}: <strong>{{ inviteCodeStatusText }}</strong></p>\n      <p *ngIf=\"hotelAssociation\">{{ 'profile.activeCodeExpiry' | t }}: <strong>{{ inviteCodeExpiresAt }}</strong></p>\n      <p *ngIf=\"hotelAssociation; else noAssociation\">\n        {{ 'profile.associatedStructure' | t }}: <strong>{{ hotelAssociation.structureName }}</strong>\n        ({{ hotelAssociation.structureAddress }})\n      </p>\n      <div class=\"structure-actions\" *ngIf=\"hotelAssociation\">\n        <button mat-stroked-button color=\"primary\" type=\"button\" (click)=\"navigateToAssociatedStructure()\">\n          {{ 'profile.navigateToStructure' | t }}\n        </button>\n      </div>\n      <ng-template #noAssociation>\n        <p>{{ 'profile.noAssociatedStructure' | t }}</p>\n      </ng-template>\n\n      <div class=\"code-history\" *ngIf=\"hotelCodeEntries.length; else noCodeHistory\">\n        <p><strong>{{ 'profile.codeList' | t }}:</strong></p>\n        <div class=\"code-history-list\">\n          <div class=\"code-history-item\" *ngFor=\"let entry of hotelCodeEntries\">\n            <div class=\"code-history-row\">\n              <code>{{ entry.inviteCode }}</code>\n              <span [class]=\"codeEntryStatusClass(entry)\">{{ codeEntryStatusLabel(entry) }}</span>\n            </div>\n            <small>{{ 'profile.associatedStructure' | t }}: {{ entry.structureName || ('profile.structureUnavailable' | t) }}</small>\n            <small>{{ 'profile.scope' | t }}: {{ codeEntryScopeLabel(entry) }}</small>\n            <small>{{ 'profile.city' | t }}: {{ codeEntryCitiesLabel(entry) }}</small>\n            <small *ngIf=\"entry.expiresAt\">{{ 'profile.expiry' | t }}: {{ entryExpiryLabel(entry) }}</small>\n            <small *ngIf=\"entry.usedAt\">{{ 'profile.usedAt' | t }}: {{ entryUsedAtLabel(entry) }}</small>\n            <div class=\"code-entry-actions\">\n              <button\n                mat-stroked-button\n                color=\"warn\"\n                type=\"button\"\n                *ngIf=\"canRemoveCodeEntry(entry); else codeNotRemovable\"\n                (click)=\"removeInviteCodeAssociation(entry)\"\n              >\n                {{ removingInviteCode ? ('profile.removingCode' | t) : ('profile.removeCode' | t) }}\n              </button>\n              <ng-template #codeNotRemovable>\n                <small class=\"code-entry-locked\">{{ 'profile.codeLocked' | t }}</small>\n              </ng-template>\n            </div>\n          </div>\n        </div>\n      </div>\n      <ng-template #noCodeHistory>\n        <p>{{ 'profile.noCodeHistory' | t }}</p>\n      </ng-template>\n    </mat-card>\n\n    <mat-card class=\"card section\">\n      <h3>{{ 'profile.unlockedCities' | t }}</h3>\n      <div class=\"chips\">\n        <span class=\"status-chip unlocked\" *ngFor=\"let cityId of unlockedCityIds\">{{ cityName(cityId) }}</span>\n        <span class=\"status-chip locked\" *ngIf=\"!unlockedCityIds.length\">{{ 'profile.noUnlockedCities' | t }}</span>\n      </div>\n\n      <div class=\"language-row\">\n        <button mat-stroked-button color=\"primary\" (click)=\"restorePurchases()\">{{ 'profile.restorePurchases' | t }}</button>\n        <button\n          mat-stroked-button\n          color=\"warn\"\n          type=\"button\"\n          [disabled]=\"resettingUserSession\"\n          (click)=\"resetUserSession()\"\n        >\n          {{ resettingUserSession ? ('profile.resettingUser' | t) : ('profile.resetUser' | t) }}\n        </button>\n      </div>\n    </mat-card>\n\n    <mat-card class=\"card section\">\n      <h3>{{ 'profile.language' | t }}</h3>\n      <div class=\"language-row\">\n        <button mat-stroked-button [color]=\"language === 'it' ? 'primary' : undefined\" (click)=\"setLanguage('it')\">\n          {{ 'common.italian' | t }}\n        </button>\n        <button mat-stroked-button [color]=\"language === 'en' ? 'primary' : undefined\" (click)=\"setLanguage('en')\">\n          {{ 'common.english' | t }}\n        </button>\n        <button mat-stroked-button [color]=\"language === 'fr' ? 'primary' : undefined\" (click)=\"setLanguage('fr')\">\n          {{ 'common.french' | t }}\n        </button>\n        <button mat-stroked-button [color]=\"language === 'es' ? 'primary' : undefined\" (click)=\"setLanguage('es')\">\n          {{ 'common.spanish' | t }}\n        </button>\n      </div>\n    </mat-card>\n\n    <mat-card class=\"card section links\">\n      <a href=\"mailto:info@walkaround.cloud\">{{ 'common.support' | t }}</a>\n      <a href=\"#\" target=\"_blank\" rel=\"noopener\">{{ 'common.privacy' | t }}</a>\n    </mat-card>\n  </ng-container>\n</section>\n", styles: [".profile {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n}\n\n.section {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  h3 {\n    margin: 0;\n    font-size: 1.05rem;\n  }\n\n  p {\n    margin: 0;\n    color: #677790;\n  }\n}\n\n.full-width {\n  width: 100%;\n}\n\n.chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.language-row {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.structure-actions {\n  display: flex;\n  justify-content: flex-start;\n}\n\n.code-history {\n  display: grid;\n  gap: 8px;\n}\n\n.code-history-list {\n  display: grid;\n  gap: 8px;\n}\n\n.code-history-item {\n  display: grid;\n  gap: 4px;\n  padding: 8px 10px;\n  border-radius: 10px;\n  border: 1px solid #d9e3f2;\n  background: #f8fbff;\n}\n\n:host-context(body.app-user-theme) .code-history-item {\n  border-color: rgba(182, 164, 129, 0.18);\n  background: linear-gradient(180deg, rgba(247, 250, 253, 0.96) 0%, rgba(250, 246, 239, 0.94) 100%);\n}\n\n.code-history-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.code-history-item code {\n  font-weight: 700;\n  font-size: 0.9rem;\n}\n\n.code-entry-actions {\n  margin-top: 6px;\n  display: flex;\n  justify-content: flex-end;\n}\n\n.code-entry-locked {\n  color: #7a879c;\n  font-size: 0.8rem;\n}\n\n.status-chip.pending {\n  color: #9a3412;\n  background: #fff4e5;\n  border: 1px solid #f6cf9b;\n}\n\n.links {\n  a {\n    color: #1769aa;\n    font-weight: 600;\n  }\n}\n"] }]
    }], () => [{ type: i1.PoiService }, { type: i2.AppStateService }, { type: i3.PurchaseService }, { type: i4.StructureLocationService }, { type: i5.MatSnackBar }, { type: i6.I18nService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ProfileComponent, { className: "ProfileComponent", filePath: "src/app/features/profile/profile.component.ts", lineNumber: 19 }); })();
