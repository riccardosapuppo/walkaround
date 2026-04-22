import { Component, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../core/services/admin-auth.service";
import * as i3 from "@angular/material/dialog";
import * as i4 from "@angular/router";
import * as i5 from "@angular/material/snack-bar";
import * as i6 from "@angular/common";
import * as i7 from "@angular/material/button";
import * as i8 from "@angular/material/card";
import * as i9 from "@angular/material/form-field";
import * as i10 from "@angular/material/input";
import * as i11 from "@angular/material/progress-spinner";
import * as i12 from "@angular/material/radio";
import * as i13 from "@angular/material/select";
import * as i14 from "@angular/material/slide-toggle";
import * as i15 from "@angular/material/tooltip";
const _c0 = ["createCatalogCityDialog"];
const _c1 = ["createCatalogPoiDialog"];
const _c2 = ["editCatalogCityDialog"];
const _c3 = ["editCatalogPoiDialog"];
const _c4 = ["createDiscountCodeDialog"];
const _c5 = ["editDiscountCodeDialog"];
const _c6 = ["partnerRequestApprovalDialog"];
const _c7 = ["catalogPoiAudioPlayerDialog"];
const _c8 = ["poiMapPickerDialog"];
const _c9 = ["poiMapCanvas"];
const _c10 = (a0, a1, a2) => ({ "expiry-badge-active": a0, "expiry-badge-expired": a1, "expiry-badge-unknown": a2 });
function AdminDashboardComponent_mat_card_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 56)(1, "div", 57);
    i0.ɵɵelement(2, "mat-spinner", 58);
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Controllo sessione dashboard...");
    i0.ɵɵelementEnd()()();
} }
function AdminDashboardComponent_mat_card_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 56)(1, "h1", 59);
    i0.ɵɵtext(2, "Dashboard");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 60);
    i0.ɵɵtext(4, "Accedi per entrare nella dashboard.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "form", 61);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_mat_card_2_Template_form_ngSubmit_5_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.login()); });
    i0.ɵɵelementStart(6, "mat-form-field", 62)(7, "mat-label");
    i0.ɵɵtext(8, "Email");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "input", 63);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "mat-form-field", 62)(11, "mat-label");
    i0.ɵɵtext(12, "Password");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "input", 64);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 65);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("formGroup", ctx_r1.loginForm);
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("disabled", ctx_r1.loggingIn);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.loggingIn ? "Accesso..." : "Accedi", " ");
} }
function AdminDashboardComponent_div_3_nav_10_button_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 81);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_nav_10_button_1_Template_button_click_0_listener() { const section_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.selectSection(section_r5.id)); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const section_r5 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("active", ctx_r1.activeSection === section_r5.id);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(section_r5.label);
} }
function AdminDashboardComponent_div_3_nav_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "nav", 79);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_nav_10_button_1_Template, 3, 3, "button", 80);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.visibleSections);
} }
function AdminDashboardComponent_div_3_button_14_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 74);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_button_14_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.exitImpersonation()); });
    i0.ɵɵtext(1, " Torna ad admin ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_header_18_p_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 60);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" Modalita impersonazione attiva (origine: ", ctx_r1.impersonatedByEmail, ") ");
} }
function AdminDashboardComponent_div_3_header_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "header", 82)(1, "div")(2, "h1", 59);
    i0.ɵɵtext(3, "Utenti");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 60);
    i0.ɵɵtext(5, " Connesso come ");
    i0.ɵɵelementStart(6, "strong");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, AdminDashboardComponent_div_3_header_18_p_9_Template, 2, 1, "p", 83);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.currentName || ctx_r1.currentEmail);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" - ", ctx_r1.roleLabel(ctx_r1.currentRole), " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isImpersonating);
} }
function AdminDashboardComponent_div_3_mat_card_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 84)(1, "h2");
    i0.ɵɵtext(2, "Accesso dashboard non consentito");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Solo admin e gestori struttura possono accedere alla dashboard.");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_20_strong_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.totalAssociatedUsers);
} }
function AdminDashboardComponent_div_3_ng_container_20_ng_template_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_20_p_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, " Il tuo account gestore non ha una struttura assegnata. ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_20_div_21_tr_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 98);
    i0.ɵɵelement(2, "mat-spinner", 99);
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_20_div_21_tr_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 100);
    i0.ɵɵtext(2, "Nessun utente associato alla tua struttura.");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_20_div_21_ng_container_19_tr_1_small_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const associatedUser_r7 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatDateTime(associatedUser_r7.inviteCodeUsedAt));
} }
function AdminDashboardComponent_div_3_ng_container_20_div_21_ng_container_19_tr_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td")(2, "code");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "td");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "td")(7, "code");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "td", 102)(10, "span", 103);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(12, AdminDashboardComponent_div_3_ng_container_20_div_21_ng_container_19_tr_1_small_12_Template, 2, 1, "small", 78);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "td");
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "td");
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const associatedUser_r7 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(associatedUser_r7.userId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatDateTime(associatedUser_r7.associatedAt));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(associatedUser_r7.inviteCode || "-");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("association-status-used", associatedUser_r7.inviteCodeUsed)("association-status-active", !associatedUser_r7.inviteCodeUsed);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", associatedUser_r7.inviteCodeUsed ? "Usato" : "Non usato", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", associatedUser_r7.inviteCodeUsedAt);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(associatedUser_r7.purchasesCount);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(associatedUser_r7.totalSpent));
} }
function AdminDashboardComponent_div_3_ng_container_20_div_21_ng_container_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_20_div_21_ng_container_19_tr_1_Template, 17, 11, "tr", 101);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.associatedUsers);
} }
function AdminDashboardComponent_div_3_ng_container_20_div_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 96)(1, "table", 97)(2, "thead")(3, "tr")(4, "th");
    i0.ɵɵtext(5, "ID Utente App");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th");
    i0.ɵɵtext(7, "Registrato il");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "th");
    i0.ɵɵtext(9, "Codice associato");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "th");
    i0.ɵɵtext(11, "Stato codice");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "th");
    i0.ɵɵtext(13, "Acquisti");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "th");
    i0.ɵɵtext(15, "Spesa totale");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "tbody");
    i0.ɵɵtemplate(17, AdminDashboardComponent_div_3_ng_container_20_div_21_tr_17_Template, 3, 0, "tr", 78)(18, AdminDashboardComponent_div_3_ng_container_20_div_21_tr_18_Template, 3, 0, "tr", 78)(19, AdminDashboardComponent_div_3_ng_container_20_div_21_ng_container_19_Template, 2, 1, "ng-container", 78);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(17);
    i0.ɵɵproperty("ngIf", ctx_r1.loadingAssociatedUsers);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingAssociatedUsers && !ctx_r1.associatedUsers.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingAssociatedUsers);
} }
function AdminDashboardComponent_div_3_ng_container_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "div", 85)(2, "mat-card", 86)(3, "span");
    i0.ɵɵtext(4, "Utenti associati");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, AdminDashboardComponent_div_3_ng_container_20_strong_5_Template, 2, 1, "strong", 87)(6, AdminDashboardComponent_div_3_ng_container_20_ng_template_6_Template, 2, 0, "ng-template", null, 9, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "mat-card", 86)(9, "span");
    i0.ɵɵtext(10, "Struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "strong");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(13, "mat-card", 88)(14, "div", 89)(15, "div")(16, "h2");
    i0.ɵɵtext(17, "Utenti associati alla struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "p", 90);
    i0.ɵɵtext(19, "Vista sola lettura: non puoi modificare ruoli o permessi.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(20, AdminDashboardComponent_div_3_ng_container_20_p_20_Template, 2, 0, "p", 91)(21, AdminDashboardComponent_div_3_ng_container_20_div_21_Template, 20, 3, "div", 92);
    i0.ɵɵelementEnd();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const associatedUsersLoadingStat_r8 = i0.ɵɵreference(7);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingAssociatedUsers)("ngIfElse", associatedUsersLoadingStat_r8);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.managerStructureName);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("ngIf", !ctx_r1.managedStructureId);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.managedStructureId);
} }
function AdminDashboardComponent_div_3_ng_container_21_strong_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.totalPayments);
} }
function AdminDashboardComponent_div_3_ng_container_21_ng_template_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_21_strong_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(ctx_r1.totalStructureEarnings));
} }
function AdminDashboardComponent_div_3_ng_container_21_ng_template_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_21_tr_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 106);
    i0.ɵɵelement(2, "mat-spinner", 99);
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_21_tr_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 107);
    i0.ɵɵtext(2, "Nessun pagamento registrato per la tua struttura.");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_21_ng_container_50_tr_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 109)(4, "strong");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "small");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "small");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "small");
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "small");
    i0.ɵɵtext(13, "ID app: ");
    i0.ɵɵelementStart(14, "code");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "td");
    i0.ɵɵtext(17);
    i0.ɵɵpipe(18, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "td", 110)(20, "strong");
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "small");
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "td", 111)(25, "small");
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "span", 112);
    i0.ɵɵtext(28);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(29, "td");
    i0.ɵɵtext(30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "td");
    i0.ɵɵtext(32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "td");
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "td");
    i0.ɵɵtext(36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "td")(38, "code");
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(40, "td");
    i0.ɵɵtext(41);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const payment_r9 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatDateTime(payment_r9.purchasedAt));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("", payment_r9.customerFirstName, " ", payment_r9.customerLastName, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(payment_r9.customerEmail);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(payment_r9.customerPhone);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(payment_r9.customerAddress);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(payment_r9.customerId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind4(18, 23, payment_r9.customerBirthDate, "dd/MM/yyyy", "", "it-IT"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(payment_r9.paymentMethod);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(payment_r9.paymentProvider);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.paymentTargetLabel(payment_r9));
    i0.ɵɵadvance();
    i0.ɵɵclassProp("bundle", payment_r9.type === "bundle")("single", payment_r9.type === "single");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", payment_r9.type === "bundle" ? "Pacchetto citt\u00E0" : "Luogo singolo", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(payment_r9.baseAmount));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r1.formatCurrency(payment_r9.discountAmount), " (", payment_r9.discountPercent, "%)");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(payment_r9.paidAmount));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(payment_r9.paymentStatus);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(payment_r9.inviteCode || "-");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(payment_r9.structureEarningAmount));
} }
function AdminDashboardComponent_div_3_ng_container_21_ng_container_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_21_ng_container_50_tr_1_Template, 42, 28, "tr", 108);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.payments)("ngForTrackBy", ctx_r1.trackByPaymentId);
} }
function AdminDashboardComponent_div_3_ng_container_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "mat-card", 88)(2, "div", 89)(3, "div")(4, "h2");
    i0.ɵɵtext(5, "Pagamenti struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 90);
    i0.ɵɵtext(7, "Visualizzi solo i pagamenti collegati alla tua struttura.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(8, "div", 104)(9, "mat-card", 86)(10, "span");
    i0.ɵɵtext(11, "Pagamenti registrati");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(12, AdminDashboardComponent_div_3_ng_container_21_strong_12_Template, 2, 1, "strong", 87)(13, AdminDashboardComponent_div_3_ng_container_21_ng_template_13_Template, 2, 0, "ng-template", null, 10, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "mat-card", 86)(16, "span");
    i0.ɵɵtext(17, "Guadagno struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(18, AdminDashboardComponent_div_3_ng_container_21_strong_18_Template, 2, 1, "strong", 87)(19, AdminDashboardComponent_div_3_ng_container_21_ng_template_19_Template, 2, 0, "ng-template", null, 11, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 96)(22, "table", 105)(23, "thead")(24, "tr")(25, "th");
    i0.ɵɵtext(26, "Data");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "th");
    i0.ɵɵtext(28, "Utente");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "th");
    i0.ɵɵtext(30, "Data nascita");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "th");
    i0.ɵɵtext(32, "Metodo pagamento");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "th");
    i0.ɵɵtext(34, "Contenuto");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "th");
    i0.ɵɵtext(36, "Prezzo base");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "th");
    i0.ɵɵtext(38, "Sconto");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "th");
    i0.ɵɵtext(40, "Pagato");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "th");
    i0.ɵɵtext(42, "Stato pagamento");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "th");
    i0.ɵɵtext(44, "Codice");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "th");
    i0.ɵɵtext(46, "Quota struttura");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(47, "tbody");
    i0.ɵɵtemplate(48, AdminDashboardComponent_div_3_ng_container_21_tr_48_Template, 3, 0, "tr", 78)(49, AdminDashboardComponent_div_3_ng_container_21_tr_49_Template, 3, 0, "tr", 78)(50, AdminDashboardComponent_div_3_ng_container_21_ng_container_50_Template, 2, 2, "ng-container", 78);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const managerPaymentsLoadingStat_r10 = i0.ɵɵreference(14);
    const managerEarningsLoadingStat_r11 = i0.ɵɵreference(20);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayments)("ngIfElse", managerPaymentsLoadingStat_r10);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayments)("ngIfElse", managerEarningsLoadingStat_r11);
    i0.ɵɵadvance(30);
    i0.ɵɵproperty("ngIf", ctx_r1.loadingPayments);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayments && !ctx_r1.payments.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayments);
} }
function AdminDashboardComponent_div_3_ng_container_22_strong_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.totalUsers);
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_template_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_strong_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.totalStructures);
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_template_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_section_32_mat_form_field_26_mat_option_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const structure_r14 = ctx.$implicit;
    i0.ɵɵproperty("value", structure_r14.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", structure_r14.name, " ");
} }
function AdminDashboardComponent_div_3_ng_container_22_section_32_mat_form_field_26_mat_error_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, " La struttura e obbligatoria per il gestore ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_section_32_mat_form_field_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-form-field", 62)(1, "mat-label");
    i0.ɵɵtext(2, "Struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "mat-select", 128)(4, "mat-option", 129);
    i0.ɵɵtext(5, "Seleziona struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, AdminDashboardComponent_div_3_ng_container_22_section_32_mat_form_field_26_mat_option_6_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, AdminDashboardComponent_div_3_ng_container_22_section_32_mat_form_field_26_mat_error_7_Template, 2, 0, "mat-error", 78);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", !ctx_r1.structures.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r1.noStructureValue)("disabled", true);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r1.structures);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isInviteStructureMissing && ctx_r1.inviteForm.controls.structureId.touched);
} }
function AdminDashboardComponent_div_3_ng_container_22_section_32_p_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, " Nessuna struttura registrata: crea prima una struttura nella sezione dedicata. ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_section_32_div_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 132);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_section_32_div_31_span_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const invite_r15 = i0.ɵɵnextContext().ngIf;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Struttura: ", invite_r15.structureName, "");
} }
function AdminDashboardComponent_div_3_ng_container_22_section_32_div_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 133)(1, "strong");
    i0.ɵɵtext(2, "Ultimo invito:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, AdminDashboardComponent_div_3_ng_container_22_section_32_div_31_span_5_Template, 2, 1, "span", 78);
    i0.ɵɵelementStart(6, "span");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const invite_r15 = ctx.ngIf;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("", ctx_r1.displayName(invite_r15.firstName, invite_r15.lastName, invite_r15.email), " (", invite_r15.email, ")");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", invite_r15.structureName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Scadenza: ", ctx_r1.formatDateTime(invite_r15.expiresAt), "");
} }
function AdminDashboardComponent_div_3_ng_container_22_section_32_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 118)(1, "h3");
    i0.ɵɵtext(2, "Nuovo invito utente");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Compila i dati, scegli ruolo e struttura se il ruolo e gestore.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "form", 61);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_container_22_section_32_Template_form_ngSubmit_5_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.invite()); });
    i0.ɵɵelementStart(6, "mat-form-field", 62)(7, "mat-label");
    i0.ɵɵtext(8, "Nome");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "input", 119);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "mat-form-field", 62)(11, "mat-label");
    i0.ɵɵtext(12, "Cognome");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "input", 120);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "mat-form-field", 62)(15, "mat-label");
    i0.ɵɵtext(16, "Email utente");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(17, "input", 121);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "mat-form-field", 62)(19, "mat-label");
    i0.ɵɵtext(20, "Permesso");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "mat-select", 122)(22, "mat-option", 123);
    i0.ɵɵtext(23, "Gestore struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "mat-option", 124);
    i0.ɵɵtext(25, "Admin");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(26, AdminDashboardComponent_div_3_ng_container_22_section_32_mat_form_field_26_Template, 8, 5, "mat-form-field", 125)(27, AdminDashboardComponent_div_3_ng_container_22_section_32_p_27_Template, 2, 0, "p", 91)(28, AdminDashboardComponent_div_3_ng_container_22_section_32_div_28_Template, 2, 0, "div", 126);
    i0.ɵɵelementStart(29, "button", 65);
    i0.ɵɵtext(30);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(31, AdminDashboardComponent_div_3_ng_container_22_section_32_div_31_Template, 8, 4, "div", 127);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("formGroup", ctx_r1.inviteForm);
    i0.ɵɵadvance(21);
    i0.ɵɵproperty("ngIf", ctx_r1.isInviteStructureRequired);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isInviteStructureRequired && !ctx_r1.structures.length && !ctx_r1.loadingStructures);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isInviteStructureRequired && ctx_r1.loadingStructures);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", !ctx_r1.canSubmitInvite);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.inviting ? "Invio..." : "Invia invito", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.lastInvite);
} }
function AdminDashboardComponent_div_3_ng_container_22_section_33_mat_form_field_34_mat_option_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const structure_r17 = ctx.$implicit;
    i0.ɵɵproperty("value", structure_r17.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", structure_r17.name, " ");
} }
function AdminDashboardComponent_div_3_ng_container_22_section_33_mat_form_field_34_mat_error_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, " La struttura e obbligatoria per il gestore ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_section_33_mat_form_field_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-form-field", 62)(1, "mat-label");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "mat-select", 128)(4, "mat-option", 129);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, AdminDashboardComponent_div_3_ng_container_22_section_33_mat_form_field_34_mat_option_6_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, AdminDashboardComponent_div_3_ng_container_22_section_33_mat_form_field_34_mat_error_7_Template, 2, 0, "mat-error", 78);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.isCreateUserStructureRequired ? "Struttura (obbligatoria)" : "Struttura (opzionale)");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", !ctx_r1.structures.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r1.noStructureValue)("disabled", ctx_r1.isCreateUserStructureRequired);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isCreateUserStructureRequired ? "Seleziona struttura" : "Nessuna struttura", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.structures);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isCreateUserStructureMissing && ctx_r1.createUserForm.controls.structureId.touched);
} }
function AdminDashboardComponent_div_3_ng_container_22_section_33_p_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, " Nessuna struttura registrata: crea prima una struttura nella sezione dedicata. ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_section_33_div_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 132);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_section_33_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 118)(1, "h3");
    i0.ɵɵtext(2, "Aggiungi utente dashboard");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Crea direttamente un utente con password. Ruolo non modificabile dopo la creazione.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "form", 61);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_container_22_section_33_Template_form_ngSubmit_5_listener() { i0.ɵɵrestoreView(_r16); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.createUser()); });
    i0.ɵɵelementStart(6, "mat-form-field", 62)(7, "mat-label");
    i0.ɵɵtext(8, "Nome");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "input", 119);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "mat-form-field", 62)(11, "mat-label");
    i0.ɵɵtext(12, "Cognome");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "input", 120);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "mat-form-field", 62)(15, "mat-label");
    i0.ɵɵtext(16, "Email utente");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(17, "input", 121);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "mat-form-field", 62)(19, "mat-label");
    i0.ɵɵtext(20, "Password iniziale");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(21, "input", 134);
    i0.ɵɵelementStart(22, "mat-hint");
    i0.ɵɵtext(23, "Minimo 8 caratteri");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "mat-form-field", 62)(25, "mat-label");
    i0.ɵɵtext(26, "Ruolo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "mat-select", 122)(28, "mat-option", 135);
    i0.ɵɵtext(29, "Utente normale");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "mat-option", 123);
    i0.ɵɵtext(31, "Gestore struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "mat-option", 124);
    i0.ɵɵtext(33, "Admin");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(34, AdminDashboardComponent_div_3_ng_container_22_section_33_mat_form_field_34_Template, 8, 7, "mat-form-field", 125)(35, AdminDashboardComponent_div_3_ng_container_22_section_33_p_35_Template, 2, 0, "p", 91)(36, AdminDashboardComponent_div_3_ng_container_22_section_33_div_36_Template, 2, 0, "div", 126);
    i0.ɵɵelementStart(37, "button", 65);
    i0.ɵɵtext(38);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("formGroup", ctx_r1.createUserForm);
    i0.ɵɵadvance(29);
    i0.ɵɵproperty("ngIf", ctx_r1.isCreateUserStructureVisible);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isCreateUserStructureVisible && !ctx_r1.structures.length && !ctx_r1.loadingStructures);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isCreateUserStructureVisible && ctx_r1.loadingStructures);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", !ctx_r1.canSubmitCreateUser);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.creatingUser ? "Creazione..." : "Crea utente", " ");
} }
function AdminDashboardComponent_div_3_ng_container_22_div_34_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 136)(1, "span");
    i0.ɵɵtext(2, " Filtro struttura attivo: ");
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "button", 137);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_22_div_34_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r18); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.clearUsersStructureFilter()); });
    i0.ɵɵtext(6, "Rimuovi filtro");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.usersStructureFilterName);
} }
function AdminDashboardComponent_div_3_ng_container_22_tr_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 98);
    i0.ɵɵelement(2, "mat-spinner", 99);
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_22_tr_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 100);
    i0.ɵɵtext(2, "Nessun utente disponibile.");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_small_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 143);
    i0.ɵɵtext(1, " Utente app associato da codice invito/sconto ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_11_div_1_small_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 151);
    i0.ɵɵtext(1, " Codice: ");
    i0.ɵɵelementStart(2, "code");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const association_r19 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(association_r19.inviteCode);
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_11_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 146)(1, "div", 147)(2, "small", 148);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 149);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(6, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_11_div_1_small_6_Template, 4, 1, "small", 150);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const association_r19 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(6);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(association_r19.structureName || association_r19.structureId);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.userAssociationStatusClass(association_r19.status));
    i0.ɵɵproperty("matTooltip", ctx_r1.userAssociationStatusTooltip(association_r19.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.userAssociationStatusLabel(association_r19.status), " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", association_r19.inviteCode);
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 144);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_11_div_1_Template, 7, 6, "div", 145);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const user_r20 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.userAssociations(user_r20));
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_ng_template_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 143);
    i0.ɵɵtext(1, "Nessuna struttura associata");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 156)(1, "small")(2, "strong");
    i0.ɵɵtext(3, "Citt\u00E0:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "small")(6, "strong");
    i0.ɵɵtext(7, "Luoghi:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const user_r20 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", user_r20.unlockedCitiesCount, "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", user_r20.unlockedPoisCount, "");
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_2_span_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 159);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r21 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", city_r21.cityName || city_r21.cityId, " ");
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 157);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_2_span_1_Template, 2, 1, "span", 158);
    i0.ɵɵpipe(2, "slice");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const user_r20 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", i0.ɵɵpipeBind3(2, 1, ctx_r1.userUnlockedCities(user_r20), 0, 3));
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_3_small_1_span_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const poi_r22 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("(", poi_r22.cityName, ")");
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_3_small_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 162);
    i0.ɵɵtext(1);
    i0.ɵɵtemplate(2, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_3_small_1_span_2_Template, 2, 1, "span", 78);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const poi_r22 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", poi_r22.poiName || poi_r22.poiId, " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", poi_r22.cityName);
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 160);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_3_small_1_Template, 3, 2, "small", 161);
    i0.ɵɵpipe(2, "slice");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const user_r20 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", i0.ɵɵpipeBind3(2, 1, ctx_r1.userUnlockedPois(user_r20), 0, 3));
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_small_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 143);
    i0.ɵɵtext(1, " + altri contenuti sbloccati ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_ng_template_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 143);
    i0.ɵɵtext(1, "Nessun contenuto sbloccato");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 152);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_1_Template, 9, 2, "div", 153)(2, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_2_Template, 3, 5, "div", 154)(3, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_div_3_Template, 3, 5, "div", 155)(4, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_small_4_Template, 2, 0, "small", 138)(5, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_ng_template_5_Template, 2, 0, "ng-template", null, 16, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const noUnlockedItems_r23 = i0.ɵɵreference(6);
    const user_r20 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", user_r20.unlockedCitiesCount || user_r20.unlockedPoisCount)("ngIfElse", noUnlockedItems_r23);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.userUnlockedCities(user_r20).length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.userUnlockedPois(user_r20).length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", user_r20.unlockedCitiesCount > 3 || user_r20.unlockedPoisCount > 3);
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_ng_template_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 152)(1, "span", 159);
    i0.ɵɵtext(2, "Tutti");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "small", 143);
    i0.ɵɵtext(4, "Accesso completo (profilo admin)");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_21_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 163)(1, "div", 164)(2, "button", 165);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_21_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r24); const user_r20 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.sendPasswordReset(user_r20)); });
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 166);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_21_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r24); const user_r20 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.deleteUser(user_r20)); });
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "button", 167);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_21_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r24); const user_r20 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.impersonate(user_r20)); });
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const user_r20 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.resettingPasswordUserId === user_r20.id || !user_r20.isRegistered);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.resettingPasswordUserId === user_r20.id ? "Invio reset..." : "Reset password", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.deletingUserId === user_r20.id || ctx_r1.savingUserId === user_r20.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.deletingUserId === user_r20.id ? "Elimino..." : "Elimina", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.impersonatingUserId === user_r20.id || !user_r20.isRegistered)("matTooltip", "Entra come questo utente per verificare esattamente cosa puo vedere nella dashboard.");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.impersonatingUserId === user_r20.id ? "Accesso..." : "Entra come questo utente", " ");
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_small_6_Template, 2, 0, "small", 138);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "td")(10, "div", 139);
    i0.ɵɵtemplate(11, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_11_Template, 2, 1, "div", 140)(12, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_ng_template_12_Template, 2, 0, "ng-template", null, 14, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "td");
    i0.ɵɵtemplate(15, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_15_Template, 7, 5, "div", 141)(16, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_ng_template_16_Template, 5, 0, "ng-template", null, 15, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "td");
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "td");
    i0.ɵɵtemplate(21, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_div_21_Template, 8, 7, "div", 142);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const user_r20 = ctx.$implicit;
    const noUserAssociations_r25 = i0.ɵɵreference(13);
    const adminUnlockedAll_r26 = i0.ɵɵreference(17);
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.displayName(user_r20.firstName, user_r20.lastName, user_r20.email));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(user_r20.email);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isReadOnlyAppUser(user_r20));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.roleLabel(user_r20.role));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.userAssociations(user_r20).length)("ngIfElse", noUserAssociations_r25);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", user_r20.role !== "admin")("ngIfElse", adminUnlockedAll_r26);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.formatDateTime(user_r20.createdAt));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", user_r20.id !== ctx_r1.currentUserId && !ctx_r1.isReadOnlyAppUser(user_r20));
} }
function AdminDashboardComponent_div_3_ng_container_22_ng_container_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_tr_1_Template, 22, 10, "tr", 101);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.usersForDisplay);
} }
function AdminDashboardComponent_div_3_ng_container_22_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "div", 85)(2, "mat-card", 86)(3, "span");
    i0.ɵɵtext(4, "Utenti");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, AdminDashboardComponent_div_3_ng_container_22_strong_5_Template, 2, 1, "strong", 87)(6, AdminDashboardComponent_div_3_ng_container_22_ng_template_6_Template, 2, 0, "ng-template", null, 12, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "mat-card", 86)(9, "span");
    i0.ɵɵtext(10, "Strutture");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, AdminDashboardComponent_div_3_ng_container_22_strong_11_Template, 2, 1, "strong", 87)(12, AdminDashboardComponent_div_3_ng_container_22_ng_template_12_Template, 2, 0, "ng-template", null, 13, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "mat-card", 88)(15, "div", 89)(16, "div")(17, "h2");
    i0.ɵɵtext(18, "Lista utenti");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "p", 90);
    i0.ɵɵtext(20, "Gestisci struttura utente e operazioni rapide.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 113)(22, "button", 114);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_22_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleCreateUserSection()); });
    i0.ɵɵelementStart(23, "span", 115);
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "span");
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "button", 114);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_22_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleInviteSection()); });
    i0.ɵɵelementStart(28, "span", 115);
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "span");
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵtemplate(32, AdminDashboardComponent_div_3_ng_container_22_section_32_Template, 32, 7, "section", 116)(33, AdminDashboardComponent_div_3_ng_container_22_section_33_Template, 39, 6, "section", 116)(34, AdminDashboardComponent_div_3_ng_container_22_div_34_Template, 7, 1, "div", 117);
    i0.ɵɵelementStart(35, "div", 96)(36, "table", 105)(37, "thead")(38, "tr")(39, "th");
    i0.ɵɵtext(40, "Utente");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "th");
    i0.ɵɵtext(42, "Ruolo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "th");
    i0.ɵɵtext(44, "Strutture associate");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "th");
    i0.ɵɵtext(46, "Sbloccati");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "th");
    i0.ɵɵtext(48, "Data registrazione");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "th");
    i0.ɵɵtext(50, "Azioni");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(51, "tbody");
    i0.ɵɵtemplate(52, AdminDashboardComponent_div_3_ng_container_22_tr_52_Template, 3, 0, "tr", 78)(53, AdminDashboardComponent_div_3_ng_container_22_tr_53_Template, 3, 0, "tr", 78)(54, AdminDashboardComponent_div_3_ng_container_22_ng_container_54_Template, 2, 1, "ng-container", 78);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const usersLoadingStat_r27 = i0.ɵɵreference(7);
    const structuresLoadingStat_r28 = i0.ɵɵreference(13);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingUsers)("ngIfElse", usersLoadingStat_r27);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingStructures)("ngIfElse", structuresLoadingStat_r28);
    i0.ɵɵadvance(11);
    i0.ɵɵclassProp("active", ctx_r1.showCreateUserSection);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.showCreateUserSection ? "-" : "+");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.showCreateUserSection ? "Chiudi aggiunta utente" : "Aggiungi utente");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("active", ctx_r1.showInviteSection);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.showInviteSection ? "-" : "+");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.showInviteSection ? "Chiudi invito" : "Invita utente");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.showInviteSection);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.showCreateUserSection);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isUsersStructureFilterActive);
    i0.ɵɵadvance(18);
    i0.ɵɵproperty("ngIf", ctx_r1.loadingUsers);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingUsers && !ctx_r1.usersForDisplay.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingUsers);
} }
function AdminDashboardComponent_div_3_ng_container_23_p_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 90);
    i0.ɵɵtext(1, " Ogni struttura puo avere piu codici con regole diverse e scadenza dedicata. ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_23_p_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 90);
    i0.ɵɵtext(1, " Vista sola lettura dei codici sconto della tua struttura. ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_23_div_8_Template(rf, ctx) { if (rf & 1) {
    const _r29 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 113)(1, "button", 114);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_23_div_8_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r29); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleDiscountCodeCreateSection()); });
    i0.ɵɵelementStart(2, "span", 115);
    i0.ɵɵtext(3, "+");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5, "Aggiungi codice sconto/struttura");
    i0.ɵɵelementEnd()()();
} }
function AdminDashboardComponent_div_3_ng_container_23_tr_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 171);
    i0.ɵɵelement(2, "mat-spinner", 99);
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_23_tr_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 172);
    i0.ɵɵtext(2, "Nessun codice sconto registrato.");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_small_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r30 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(group_r30.structureAddress);
} }
function AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_div_9_div_23_Template(rf, ctx) { if (rf & 1) {
    const _r31 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 180)(1, "button", 181);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_div_9_div_23_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r31); const discountCode_r32 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.editDiscountCode(discountCode_r32)); });
    i0.ɵɵtext(2, " Modifica ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 182);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_div_9_div_23_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r31); const discountCode_r32 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.deleteDiscountCode(discountCode_r32)); });
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const discountCode_r32 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.savingDiscountCodeId === discountCode_r32.id || ctx_r1.deletingDiscountCodeId === discountCode_r32.id);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.savingDiscountCodeId === discountCode_r32.id || ctx_r1.deletingDiscountCodeId === discountCode_r32.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.deletingDiscountCodeId === discountCode_r32.id ? "Elimino..." : "Elimina", " ");
} }
function AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_div_9_ng_template_24_Template(rf, ctx) { }
function AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_div_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 175)(1, "div", 176)(2, "code");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 177);
    i0.ɵɵtext(5, " Applicabile a: ");
    i0.ɵɵelementStart(6, "strong");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "span", 177);
    i0.ɵɵtext(9, " Citt\u00E0: ");
    i0.ɵɵelementStart(10, "strong");
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "span", 177);
    i0.ɵɵtext(13, " Sconto/Incasso: ");
    i0.ɵɵelementStart(14, "strong");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "span", 177);
    i0.ɵɵtext(18, " Scadenza: ");
    i0.ɵɵelementStart(19, "strong");
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "span", 178);
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(23, AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_div_9_div_23_Template, 5, 3, "div", 179)(24, AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_div_9_ng_template_24_Template, 0, 0, "ng-template", null, 17, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const discountCode_r32 = ctx.$implicit;
    const discountReadOnlyActions_r33 = i0.ɵɵreference(25);
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(discountCode_r32.code);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.discountCodeApplyToLabel(discountCode_r32.applyTo));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.discountCodeCitiesLabel(discountCode_r32));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("", discountCode_r32.userDiscountPercentApplied, "%");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" / ", ctx_r1.formatCurrency(discountCode_r32.structureFixedAmountApplied), " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.formatDateTime(discountCode_r32.expiresAt));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(10, _c10, ctx_r1.discountCodeExpiryStatus(discountCode_r32.expiresAt) === "active", ctx_r1.discountCodeExpiryStatus(discountCode_r32.expiresAt) === "expired", ctx_r1.discountCodeExpiryStatus(discountCode_r32.expiresAt) === "unknown"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.discountCodeExpiryStatus(discountCode_r32.expiresAt) === "active" ? "Attivo" : ctx_r1.discountCodeExpiryStatus(discountCode_r32.expiresAt) === "expired" ? "Scaduto" : "Da verificare", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canManageUsers)("ngIfElse", discountReadOnlyActions_r33);
} }
function AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_small_4_Template, 2, 1, "small", 78);
    i0.ɵɵelementStart(5, "small");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "td")(8, "div", 173);
    i0.ɵɵtemplate(9, AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_div_9_Template, 26, 14, "div", 174);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const group_r30 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(group_r30.structureName || "-");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", group_r30.structureAddress);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", group_r30.codes.length, " ", group_r30.codes.length === 1 ? "codice" : "codici", "");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngForOf", group_r30.codes);
} }
function AdminDashboardComponent_div_3_ng_container_23_ng_container_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_23_ng_container_20_tr_1_Template, 10, 5, "tr", 101);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.discountCodeGroups);
} }
function AdminDashboardComponent_div_3_ng_container_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "mat-card", 88)(2, "div", 89)(3, "div")(4, "h2");
    i0.ɵɵtext(5, "Codici invito e sconto");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, AdminDashboardComponent_div_3_ng_container_23_p_6_Template, 2, 0, "p", 168)(7, AdminDashboardComponent_div_3_ng_container_23_p_7_Template, 2, 0, "p", 168);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, AdminDashboardComponent_div_3_ng_container_23_div_8_Template, 6, 0, "div", 169);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 96)(10, "table", 170)(11, "thead")(12, "tr")(13, "th");
    i0.ɵɵtext(14, "Struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "th");
    i0.ɵɵtext(16, "Codici sconto associati");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(17, "tbody");
    i0.ɵɵtemplate(18, AdminDashboardComponent_div_3_ng_container_23_tr_18_Template, 3, 0, "tr", 78)(19, AdminDashboardComponent_div_3_ng_container_23_tr_19_Template, 3, 0, "tr", 78)(20, AdminDashboardComponent_div_3_ng_container_23_ng_container_20_Template, 2, 1, "ng-container", 78);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", ctx_r1.canManageUsers);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.canManageUsers);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canManageUsers);
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("ngIf", ctx_r1.loadingDiscountCodes || ctx_r1.loadingStructures);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingDiscountCodes && !ctx_r1.loadingStructures && !ctx_r1.discountCodeGroups.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingDiscountCodes && !ctx_r1.loadingStructures);
} }
function AdminDashboardComponent_div_3_ng_container_24_strong_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.totalPartnerRequests);
} }
function AdminDashboardComponent_div_3_ng_container_24_ng_template_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_24_strong_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.pendingPartnerRequests);
} }
function AdminDashboardComponent_div_3_ng_container_24_ng_template_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_24_strong_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.approvedPartnerRequests);
} }
function AdminDashboardComponent_div_3_ng_container_24_ng_template_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_24_strong_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.sentPartnerRequestPdfs);
} }
function AdminDashboardComponent_div_3_ng_container_24_ng_template_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_24_tr_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 98);
    i0.ɵɵelement(2, "mat-spinner", 99);
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_24_tr_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 100);
    i0.ɵɵtext(2, "Nessuna richiesta partner registrata.");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_small_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const request_r36 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Tipologia: ", request_r36.structureType, "");
} }
function AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_small_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const request_r36 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Camere: ", request_r36.roomsCount, "");
} }
function AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_small_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const request_r36 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("P.IVA: ", request_r36.vatNumber, "");
} }
function AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_small_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const request_r36 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Sito: ", request_r36.website, "");
} }
function AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_small_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1, "Codice: ");
    i0.ɵɵelementStart(2, "code");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const request_r36 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(request_r36.discountCode);
} }
function AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_Template(rf, ctx) { if (rf & 1) {
    const _r35 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td", 184)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_small_4_Template, 2, 1, "small", 78)(5, AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_small_5_Template, 2, 1, "small", 78)(6, AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_small_6_Template, 2, 1, "small", 78)(7, AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_small_7_Template, 2, 1, "small", 78);
    i0.ɵɵelementStart(8, "small");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "td", 185)(11, "strong");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "small");
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "small");
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "td", 186)(18, "small");
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "td", 187)(21, "span", 188);
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "span", 188);
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(25, AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_small_25_Template, 4, 1, "small", 78);
    i0.ɵɵelementStart(26, "small");
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(28, "td", 189)(29, "small", 190);
    i0.ɵɵtext(30);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(31, "td")(32, "div", 180)(33, "button", 181);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_Template_button_click_33_listener() { const request_r36 = i0.ɵɵrestoreView(_r35).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.previewPartnerRequestPdf(request_r36)); });
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "button", 191);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_Template_button_click_35_listener() { const request_r36 = i0.ɵɵrestoreView(_r35).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.openPartnerRequestApproval(request_r36)); });
    i0.ɵɵtext(36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "button", 182);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_Template_button_click_37_listener() { const request_r36 = i0.ɵɵrestoreView(_r35).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.rejectPartnerRequest(request_r36)); });
    i0.ɵɵtext(38);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const request_r36 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("#", request_r36.id, " - ", request_r36.structureName, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", request_r36.structureType);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", request_r36.roomsCount !== null);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", request_r36.vatNumber);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", request_r36.website);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Inviata il ", ctx_r1.formatDateTime(request_r36.createdAt), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.partnerRequestContactName(request_r36));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(request_r36.contactEmail);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(request_r36.contactPhone);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.partnerRequestAddress(request_r36) || "-");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", ctx_r1.partnerRequestStatusClass(request_r36.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.partnerRequestStatusLabel(request_r36.status), " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.partnerRequestPdfStatusClass(request_r36.pdfReleaseStatus));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" PDF: ", ctx_r1.partnerRequestPdfStatusLabel(request_r36.pdfReleaseStatus), " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", request_r36.discountCode);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Aggiornata ", ctx_r1.formatDateTime(request_r36.updatedAt), "");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("partner-request-empty-note", !request_r36.notes);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", request_r36.notes || "Nessun messaggio aggiuntivo.", " ");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.isPartnerRequestBusy(request_r36));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.previewingPartnerRequestId === request_r36.id ? "Apro..." : "Anteprima PDF", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isPartnerRequestBusy(request_r36) || request_r36.status === "approved");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.approvingPartnerRequestId === request_r36.id ? "Invio..." : "Approva", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isPartnerRequestBusy(request_r36) || request_r36.status !== "pending");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.rejectingPartnerRequestId === request_r36.id ? "Nego..." : "Nega", " ");
} }
function AdminDashboardComponent_div_3_ng_container_24_ng_container_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_24_ng_container_55_tr_1_Template, 39, 26, "tr", 108);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.partnerRequests)("ngForTrackBy", ctx_r1.trackByPartnerRequestId);
} }
function AdminDashboardComponent_div_3_ng_container_24_Template(rf, ctx) { if (rf & 1) {
    const _r34 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "div", 85)(2, "mat-card", 86)(3, "span");
    i0.ɵɵtext(4, "Richieste totali");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, AdminDashboardComponent_div_3_ng_container_24_strong_5_Template, 2, 1, "strong", 87)(6, AdminDashboardComponent_div_3_ng_container_24_ng_template_6_Template, 2, 0, "ng-template", null, 18, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "mat-card", 86)(9, "span");
    i0.ɵɵtext(10, "In attesa");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, AdminDashboardComponent_div_3_ng_container_24_strong_11_Template, 2, 1, "strong", 87)(12, AdminDashboardComponent_div_3_ng_container_24_ng_template_12_Template, 2, 0, "ng-template", null, 19, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "mat-card", 86)(15, "span");
    i0.ɵɵtext(16, "Approvate");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(17, AdminDashboardComponent_div_3_ng_container_24_strong_17_Template, 2, 1, "strong", 87)(18, AdminDashboardComponent_div_3_ng_container_24_ng_template_18_Template, 2, 0, "ng-template", null, 20, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "mat-card", 86)(21, "span");
    i0.ɵɵtext(22, "PDF inviati");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(23, AdminDashboardComponent_div_3_ng_container_24_strong_23_Template, 2, 1, "strong", 87)(24, AdminDashboardComponent_div_3_ng_container_24_ng_template_24_Template, 2, 0, "ng-template", null, 21, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(26, "mat-card", 88)(27, "div", 89)(28, "div")(29, "h2");
    i0.ɵɵtext(30, "Richieste partner");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "p", 90);
    i0.ɵɵtext(32, "Approva o nega le richieste partner e genera il PDF promozionale da inviare alla struttura.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "div", 113)(34, "button", 181);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_24_Template_button_click_34_listener() { i0.ɵɵrestoreView(_r34); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.loadPartnerRequests()); });
    i0.ɵɵtext(35);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(36, "div", 96)(37, "table", 183)(38, "thead")(39, "tr")(40, "th");
    i0.ɵɵtext(41, "Struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "th");
    i0.ɵɵtext(43, "Referente");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "th");
    i0.ɵɵtext(45, "Indirizzo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "th");
    i0.ɵɵtext(47, "Stato");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "th");
    i0.ɵɵtext(49, "Messaggio");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "th");
    i0.ɵɵtext(51, "Azioni");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(52, "tbody");
    i0.ɵɵtemplate(53, AdminDashboardComponent_div_3_ng_container_24_tr_53_Template, 3, 0, "tr", 78)(54, AdminDashboardComponent_div_3_ng_container_24_tr_54_Template, 3, 0, "tr", 78)(55, AdminDashboardComponent_div_3_ng_container_24_ng_container_55_Template, 2, 2, "ng-container", 78);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const partnerRequestsLoadingStat_r37 = i0.ɵɵreference(7);
    const partnerPendingLoadingStat_r38 = i0.ɵɵreference(13);
    const partnerApprovedLoadingStat_r39 = i0.ɵɵreference(19);
    const partnerPdfLoadingStat_r40 = i0.ɵɵreference(25);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPartnerRequests)("ngIfElse", partnerRequestsLoadingStat_r37);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPartnerRequests)("ngIfElse", partnerPendingLoadingStat_r38);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPartnerRequests)("ngIfElse", partnerApprovedLoadingStat_r39);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPartnerRequests)("ngIfElse", partnerPdfLoadingStat_r40);
    i0.ɵɵadvance(11);
    i0.ɵɵproperty("disabled", ctx_r1.loadingPartnerRequests);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.loadingPartnerRequests ? "Aggiorno..." : "Aggiorna elenco", " ");
    i0.ɵɵadvance(18);
    i0.ɵɵproperty("ngIf", ctx_r1.loadingPartnerRequests);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPartnerRequests && !ctx_r1.partnerRequests.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPartnerRequests);
} }
function AdminDashboardComponent_div_3_ng_container_25_strong_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.paymentsSummary.totalPayments);
} }
function AdminDashboardComponent_div_3_ng_container_25_ng_template_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_25_strong_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(ctx_r1.paymentsSummary.totalCollected));
} }
function AdminDashboardComponent_div_3_ng_container_25_ng_template_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_25_strong_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(ctx_r1.paymentsSummary.totalDiscountAmount));
} }
function AdminDashboardComponent_div_3_ng_container_25_ng_template_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_25_strong_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(ctx_r1.paymentsSummary.totalStructureEarnings));
} }
function AdminDashboardComponent_div_3_ng_container_25_ng_template_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_25_mat_option_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const structure_r42 = ctx.$implicit;
    i0.ɵɵproperty("value", structure_r42.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", structure_r42.name, " ");
} }
function AdminDashboardComponent_div_3_ng_container_25_tr_70_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 196);
    i0.ɵɵelement(2, "mat-spinner", 99);
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_25_tr_71_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 197);
    i0.ɵɵtext(2, "Nessun pagamento registrato.");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_25_ng_container_72_tr_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 109)(4, "strong");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "small");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "small");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "small");
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "small");
    i0.ɵɵtext(13, "ID app: ");
    i0.ɵɵelementStart(14, "code");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "td");
    i0.ɵɵtext(17);
    i0.ɵɵpipe(18, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "td", 110)(20, "strong");
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "small");
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "td", 111)(25, "small");
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "span", 112);
    i0.ɵɵtext(28);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(29, "td");
    i0.ɵɵtext(30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "td");
    i0.ɵɵtext(32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "td");
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "td");
    i0.ɵɵtext(36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "td");
    i0.ɵɵtext(38);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "td")(40, "code");
    i0.ɵɵtext(41);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(42, "td");
    i0.ɵɵtext(43);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const payment_r43 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatDateTime(payment_r43.purchasedAt));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("", payment_r43.customerFirstName, " ", payment_r43.customerLastName, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(payment_r43.customerEmail);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(payment_r43.customerPhone);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(payment_r43.customerAddress);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(payment_r43.customerId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind4(18, 24, payment_r43.customerBirthDate, "dd/MM/yyyy", "", "it-IT"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(payment_r43.paymentMethod);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(payment_r43.paymentProvider);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.paymentTargetLabel(payment_r43));
    i0.ɵɵadvance();
    i0.ɵɵclassProp("bundle", payment_r43.type === "bundle")("single", payment_r43.type === "single");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", payment_r43.type === "bundle" ? "Pacchetto citt\u00E0" : "Luogo singolo", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(payment_r43.baseAmount));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r1.formatCurrency(payment_r43.discountAmount), " (", payment_r43.discountPercent, "%)");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(payment_r43.paidAmount));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(payment_r43.paymentStatus);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(payment_r43.structureName || "-");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(payment_r43.inviteCode || "-");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(payment_r43.structureEarningAmount));
} }
function AdminDashboardComponent_div_3_ng_container_25_ng_container_72_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_25_ng_container_72_tr_1_Template, 44, 29, "tr", 108);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.payments)("ngForTrackBy", ctx_r1.trackByPaymentId);
} }
function AdminDashboardComponent_div_3_ng_container_25_Template(rf, ctx) { if (rf & 1) {
    const _r41 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "div", 85)(2, "mat-card", 86)(3, "span");
    i0.ɵɵtext(4, "Pagamenti totali");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, AdminDashboardComponent_div_3_ng_container_25_strong_5_Template, 2, 1, "strong", 87)(6, AdminDashboardComponent_div_3_ng_container_25_ng_template_6_Template, 2, 0, "ng-template", null, 22, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "mat-card", 86)(9, "span");
    i0.ɵɵtext(10, "Incasso totale");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, AdminDashboardComponent_div_3_ng_container_25_strong_11_Template, 2, 1, "strong", 87)(12, AdminDashboardComponent_div_3_ng_container_25_ng_template_12_Template, 2, 0, "ng-template", null, 23, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "mat-card", 86)(15, "span");
    i0.ɵɵtext(16, "Sconti applicati");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(17, AdminDashboardComponent_div_3_ng_container_25_strong_17_Template, 2, 1, "strong", 87)(18, AdminDashboardComponent_div_3_ng_container_25_ng_template_18_Template, 2, 0, "ng-template", null, 24, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "mat-card", 86)(21, "span");
    i0.ɵɵtext(22, "Totale quota strutture");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(23, AdminDashboardComponent_div_3_ng_container_25_strong_23_Template, 2, 1, "strong", 87)(24, AdminDashboardComponent_div_3_ng_container_25_ng_template_24_Template, 2, 0, "ng-template", null, 25, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(26, "mat-card", 88)(27, "div", 89)(28, "div")(29, "h2");
    i0.ɵɵtext(30, "Pagamenti");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "p", 90);
    i0.ɵɵtext(32, "Storico acquisti con eventuale codice sconto e quota struttura.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "div", 113)(34, "mat-form-field", 192)(35, "mat-label");
    i0.ɵɵtext(36, "Filtra per struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "mat-select", 193);
    i0.ɵɵlistener("selectionChange", function AdminDashboardComponent_div_3_ng_container_25_Template_mat_select_selectionChange_37_listener($event) { i0.ɵɵrestoreView(_r41); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onPaymentsStructureFilterChange($event.value)); });
    i0.ɵɵelementStart(38, "mat-option", 194);
    i0.ɵɵtext(39, "Tutte le strutture");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(40, AdminDashboardComponent_div_3_ng_container_25_mat_option_40_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(41, "div", 96)(42, "table", 195)(43, "thead")(44, "tr")(45, "th");
    i0.ɵɵtext(46, "Data");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "th");
    i0.ɵɵtext(48, "Utente");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "th");
    i0.ɵɵtext(50, "Data nascita");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "th");
    i0.ɵɵtext(52, "Metodo pagamento");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "th");
    i0.ɵɵtext(54, "Contenuto");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "th");
    i0.ɵɵtext(56, "Prezzo base");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "th");
    i0.ɵɵtext(58, "Sconto");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(59, "th");
    i0.ɵɵtext(60, "Pagato");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "th");
    i0.ɵɵtext(62, "Stato pagamento");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "th");
    i0.ɵɵtext(64, "Struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(65, "th");
    i0.ɵɵtext(66, "Codice");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(67, "th");
    i0.ɵɵtext(68, "Quota struttura");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(69, "tbody");
    i0.ɵɵtemplate(70, AdminDashboardComponent_div_3_ng_container_25_tr_70_Template, 3, 0, "tr", 78)(71, AdminDashboardComponent_div_3_ng_container_25_tr_71_Template, 3, 0, "tr", 78)(72, AdminDashboardComponent_div_3_ng_container_25_ng_container_72_Template, 2, 2, "ng-container", 78);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const adminPaymentsLoadingStat_r44 = i0.ɵɵreference(7);
    const adminCollectedLoadingStat_r45 = i0.ɵɵreference(13);
    const adminDiscountLoadingStat_r46 = i0.ɵɵreference(19);
    const adminEarningsLoadingStat_r47 = i0.ɵɵreference(25);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayments)("ngIfElse", adminPaymentsLoadingStat_r44);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayments)("ngIfElse", adminCollectedLoadingStat_r45);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayments)("ngIfElse", adminDiscountLoadingStat_r46);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayments)("ngIfElse", adminEarningsLoadingStat_r47);
    i0.ɵɵadvance(14);
    i0.ɵɵproperty("value", ctx_r1.selectedPaymentsStructureId);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngForOf", ctx_r1.structures);
    i0.ɵɵadvance(30);
    i0.ɵɵproperty("ngIf", ctx_r1.loadingPayments);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayments && !ctx_r1.payments.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayments);
} }
function AdminDashboardComponent_div_3_ng_container_26_strong_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.payPalStatusLabel);
} }
function AdminDashboardComponent_div_3_ng_container_26_ng_template_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_26_strong_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", (ctx_r1.payPalSettings == null ? null : ctx_r1.payPalSettings.mode) === "live" ? "Live" : "Sandbox", " ");
} }
function AdminDashboardComponent_div_3_ng_container_26_ng_template_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_26_div_25_span_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Ultima verifica: ", ctx_r1.formatDateTime(ctx_r1.payPalSettings.lastVerifiedAt), "");
} }
function AdminDashboardComponent_div_3_ng_container_26_div_25_span_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.payPalSettings.lastVerificationError);
} }
function AdminDashboardComponent_div_3_ng_container_26_div_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 214)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, AdminDashboardComponent_div_3_ng_container_26_div_25_span_3_Template, 2, 1, "span", 78)(4, AdminDashboardComponent_div_3_ng_container_26_div_25_span_4_Template, 2, 1, "span", 78);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.payPalStatusLabel);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.payPalSettings.lastVerifiedAt);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.payPalSettings.lastVerificationError);
} }
function AdminDashboardComponent_div_3_ng_container_26_mat_error_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, " Email PayPal non valida ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_26_Template(rf, ctx) { if (rf & 1) {
    const _r48 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "div", 85)(2, "mat-card", 86)(3, "span");
    i0.ɵɵtext(4, "Stato connessione");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, AdminDashboardComponent_div_3_ng_container_26_strong_5_Template, 2, 1, "strong", 87)(6, AdminDashboardComponent_div_3_ng_container_26_ng_template_6_Template, 2, 0, "ng-template", null, 26, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "mat-card", 86)(9, "span");
    i0.ɵɵtext(10, "Ambiente");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, AdminDashboardComponent_div_3_ng_container_26_strong_11_Template, 2, 1, "strong", 87)(12, AdminDashboardComponent_div_3_ng_container_26_ng_template_12_Template, 2, 0, "ng-template", null, 27, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "mat-card", 88)(15, "div", 89)(16, "div")(17, "h2");
    i0.ɵɵtext(18, "Configurazione PayPal");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "p", 90);
    i0.ɵɵtext(20, "Client ID, secret, ambiente e dati merchant usati dal checkout reale lato utente.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 113)(22, "button", 181);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_26_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r48); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.testPayPalSettings()); });
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(24, "form", 198);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_container_26_Template_form_ngSubmit_24_listener() { i0.ɵɵrestoreView(_r48); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.savePayPalSettings()); });
    i0.ɵɵtemplate(25, AdminDashboardComponent_div_3_ng_container_26_div_25_Template, 5, 3, "div", 199);
    i0.ɵɵelementStart(26, "div", 200)(27, "mat-form-field", 62)(28, "mat-label");
    i0.ɵɵtext(29, "Ambiente PayPal");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "mat-select", 201)(31, "mat-option", 202);
    i0.ɵɵtext(32, "Sandbox");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "mat-option", 203);
    i0.ɵɵtext(34, "Live");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(35, "mat-form-field", 62)(36, "mat-label");
    i0.ɵɵtext(37, "Brand name");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(38, "input", 204);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "mat-form-field", 205)(40, "mat-label");
    i0.ɵɵtext(41, "Client ID");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(42, "input", 206);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "mat-form-field", 205)(44, "mat-label");
    i0.ɵɵtext(45, "Client secret");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(46, "input", 207);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "mat-form-field", 62)(48, "mat-label");
    i0.ɵɵtext(49, "Merchant ID");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(50, "input", 208);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "mat-form-field", 62)(52, "mat-label");
    i0.ɵɵtext(53, "Merchant email");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(54, "input", 209);
    i0.ɵɵtemplate(55, AdminDashboardComponent_div_3_ng_container_26_mat_error_55_Template, 2, 0, "mat-error", 78);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "mat-form-field", 62)(57, "mat-label");
    i0.ɵɵtext(58, "Webhook ID");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(59, "input", 210);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(60, "mat-slide-toggle", 211);
    i0.ɵɵtext(61, "Attiva PayPal per tutti i checkout utente");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(62, "div", 212)(63, "button", 213);
    i0.ɵɵtext(64);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const payPalStatusLoading_r49 = i0.ɵɵreference(7);
    const payPalModeLoading_r50 = i0.ɵɵreference(13);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayPalSettings)("ngIfElse", payPalStatusLoading_r49);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingPayPalSettings)("ngIfElse", payPalModeLoading_r50);
    i0.ɵɵadvance(11);
    i0.ɵɵproperty("disabled", ctx_r1.testingPayPalSettings || ctx_r1.loadingPayPalSettings);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.testingPayPalSettings ? "Verifico..." : "Verifica connessione", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r1.payPalForm);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.payPalSettings);
    i0.ɵɵadvance(30);
    i0.ɵɵproperty("ngIf", ctx_r1.payPalForm.controls.merchantEmail.invalid && ctx_r1.payPalForm.controls.merchantEmail.touched);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("disabled", !ctx_r1.canSavePayPalSettings);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.savingPayPalSettings ? "Salvo..." : "Salva configurazione", " ");
} }
function AdminDashboardComponent_div_3_ng_container_27_strong_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.gptTranslationMissingCount);
} }
function AdminDashboardComponent_div_3_ng_container_27_ng_template_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_27_strong_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.gptTranslationCompleteCount);
} }
function AdminDashboardComponent_div_3_ng_container_27_ng_template_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_27_div_27_span_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.openAiTranslationSettings.maskedApiKey);
} }
function AdminDashboardComponent_div_3_ng_container_27_div_27_span_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Ultimo aggiornamento: ", ctx_r1.formatDateTime(ctx_r1.openAiTranslationSettings.updatedAt), "");
} }
function AdminDashboardComponent_div_3_ng_container_27_div_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 214)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, AdminDashboardComponent_div_3_ng_container_27_div_27_span_3_Template, 2, 1, "span", 78)(4, AdminDashboardComponent_div_3_ng_container_27_div_27_span_4_Template, 2, 1, "span", 78);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.openAiTranslationSettings.hasApiKey ? "API key configurata" : "API key non configurata");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.openAiTranslationSettings.maskedApiKey);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.openAiTranslationSettings.updatedAt);
} }
function AdminDashboardComponent_div_3_ng_container_27_p_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, " Salva una API key OpenAI prima di avviare le traduzioni. ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_27_mat_option_58_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r52 = ctx.$implicit;
    i0.ɵɵproperty("value", city_r52.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(city_r52.name);
} }
function AdminDashboardComponent_div_3_ng_container_27_mat_option_63_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const language_r53 = ctx.$implicit;
    i0.ɵɵproperty("value", language_r53.code);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(language_r53.label);
} }
function AdminDashboardComponent_div_3_ng_container_27_mat_option_70_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const poi_r54 = ctx.$implicit;
    i0.ɵɵproperty("value", poi_r54.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", poi_r54.name, " ");
} }
function AdminDashboardComponent_div_3_ng_container_27_div_73_div_15_span_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r55 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r55);
} }
function AdminDashboardComponent_div_3_ng_container_27_div_73_div_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 234);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_27_div_73_div_15_span_1_Template, 2, 1, "span", 101);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.gptTranslationLog);
} }
function AdminDashboardComponent_div_3_ng_container_27_div_73_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 228)(1, "div", 229)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 230);
    i0.ɵɵelement(7, "span", 231);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 232)(9, "span");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span");
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(15, AdminDashboardComponent_div_3_ng_container_27_div_73_div_15_Template, 2, 1, "div", 233);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("", ctx_r1.gptTranslationProgressDone, " / ", ctx_r1.gptTranslationProgressTotal, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.gptTranslationProgressPercent, "%");
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", ctx_r1.gptTranslationProgressPercent, "%");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Input: ", ctx_r1.gptTranslationUsage.inputTokens, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Output: ", ctx_r1.gptTranslationUsage.outputTokens, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Totale: ", ctx_r1.gptTranslationUsage.totalTokens, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.gptTranslationLog.length);
} }
function AdminDashboardComponent_div_3_ng_container_27_div_74_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 132);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_27_div_75_Template(rf, ctx) { if (rf & 1) {
    const _r56 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 235)(1, "section", 236)(2, "h3");
    i0.ɵɵtext(3, "Italiano");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "strong");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "section", 236)(11, "h3");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "strong");
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "p");
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "p");
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "button", 191);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_27_div_75_Template_button_click_19_listener() { i0.ɵɵrestoreView(_r56); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.translateSelectedGptPoi()); });
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const poi_r57 = ctx.ngIf;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(poi_r57.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(poi_r57.descriptionShort);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(poi_r57.descriptionLong);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.selectedGptTranslationLanguageLabel);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(poi_r57.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.selectedGptTranslationPoiTargetFields.descriptionShort || "Descrizione breve mancante");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.selectedGptTranslationPoiTargetFields.descriptionLong || "Descrizione lunga mancante");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", !ctx_r1.canTranslateSelectedGptPoi);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.translatingPoiId === poi_r57.id ? "Traduco..." : "Traduci luogo selezionato", " ");
} }
function AdminDashboardComponent_div_3_ng_container_27_tr_87_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 237);
    i0.ɵɵtext(2, "Nessun luogo disponibile per la citt\u00E0 selezionata.");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_27_tr_88_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "td")(7, "span", 103);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "td");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const row_r58 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(row_r58.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(row_r58.cityName);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("association-status-active", row_r58.isComplete)("association-status-used", !row_r58.isComplete);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", row_r58.isComplete ? "Completa" : "Incompleta", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.gptMissingFieldsLabel(row_r58.missingFields));
} }
function AdminDashboardComponent_div_3_ng_container_27_Template(rf, ctx) { if (rf & 1) {
    const _r51 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "div", 85)(2, "mat-card", 86)(3, "span");
    i0.ɵɵtext(4, "Da tradurre");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, AdminDashboardComponent_div_3_ng_container_27_strong_5_Template, 2, 1, "strong", 87)(6, AdminDashboardComponent_div_3_ng_container_27_ng_template_6_Template, 2, 0, "ng-template", null, 28, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "mat-card", 86)(9, "span");
    i0.ɵɵtext(10, "Completi");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, AdminDashboardComponent_div_3_ng_container_27_strong_11_Template, 2, 1, "strong", 87)(12, AdminDashboardComponent_div_3_ng_container_27_ng_template_12_Template, 2, 0, "ng-template", null, 29, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "mat-card", 86)(15, "span");
    i0.ɵɵtext(16, "Token usati");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "strong");
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(19, "mat-card", 88)(20, "div", 89)(21, "div")(22, "h2");
    i0.ɵɵtext(23, "Configurazione OpenAI");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "p", 90);
    i0.ɵɵtext(25, "API key e modello usati solo dalle rotte admin per tradurre i luoghi di interesse.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(26, "form", 215);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_container_27_Template_form_ngSubmit_26_listener() { i0.ɵɵrestoreView(_r51); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.saveOpenAiTranslationSettings()); });
    i0.ɵɵtemplate(27, AdminDashboardComponent_div_3_ng_container_27_div_27_Template, 5, 3, "div", 199);
    i0.ɵɵelementStart(28, "div", 200)(29, "mat-form-field", 205)(30, "mat-label");
    i0.ɵɵtext(31, "API key OpenAI");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(32, "input", 216);
    i0.ɵɵelementStart(33, "mat-hint");
    i0.ɵɵtext(34, "Lascia vuoto per mantenere quella salvata.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(35, "mat-form-field", 62)(36, "mat-label");
    i0.ɵɵtext(37, "Modello");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(38, "input", 217);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(39, "div", 212)(40, "button", 213);
    i0.ɵɵtext(41);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(42, "mat-card", 88)(43, "div", 89)(44, "div")(45, "h2");
    i0.ɵɵtext(46, "Traduzioni luoghi di interesse");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "p", 90);
    i0.ɵɵtext(48, "Seleziona una citt\u00E0 e traduci un singolo punto oppure tutti quelli incompleti.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(49, "div", 113)(50, "button", 191);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_27_Template_button_click_50_listener() { i0.ɵɵrestoreView(_r51); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.translateMissingGptPoisForCity()); });
    i0.ɵɵtext(51);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(52, AdminDashboardComponent_div_3_ng_container_27_p_52_Template, 2, 0, "p", 91);
    i0.ɵɵelementStart(53, "form", 218)(54, "mat-form-field", 62)(55, "mat-label");
    i0.ɵɵtext(56, "Citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "mat-select", 219);
    i0.ɵɵlistener("selectionChange", function AdminDashboardComponent_div_3_ng_container_27_Template_mat_select_selectionChange_57_listener($event) { i0.ɵɵrestoreView(_r51); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onGptTranslationCityChanged($event.value)); });
    i0.ɵɵtemplate(58, AdminDashboardComponent_div_3_ng_container_27_mat_option_58_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(59, "mat-form-field", 62)(60, "mat-label");
    i0.ɵɵtext(61, "Lingua destinazione");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(62, "mat-select", 220);
    i0.ɵɵlistener("selectionChange", function AdminDashboardComponent_div_3_ng_container_27_Template_mat_select_selectionChange_62_listener($event) { i0.ɵɵrestoreView(_r51); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onGptTranslationLanguageChanged($event.value)); });
    i0.ɵɵtemplate(63, AdminDashboardComponent_div_3_ng_container_27_mat_option_63_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(64, "mat-form-field", 62)(65, "mat-label");
    i0.ɵɵtext(66, "Luogo singolo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(67, "mat-select", 221);
    i0.ɵɵlistener("selectionChange", function AdminDashboardComponent_div_3_ng_container_27_Template_mat_select_selectionChange_67_listener($event) { i0.ɵɵrestoreView(_r51); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onGptTranslationPoiChanged($event.value)); });
    i0.ɵɵelementStart(68, "mat-option", 194);
    i0.ɵɵtext(69, "Seleziona un luogo");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(70, AdminDashboardComponent_div_3_ng_container_27_mat_option_70_Template, 2, 2, "mat-option", 222);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(71, "mat-slide-toggle", 223);
    i0.ɵɵtext(72, "Sovrascrivi traduzioni esistenti");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(73, AdminDashboardComponent_div_3_ng_container_27_div_73_Template, 16, 9, "div", 224)(74, AdminDashboardComponent_div_3_ng_container_27_div_74_Template, 2, 0, "div", 126)(75, AdminDashboardComponent_div_3_ng_container_27_div_75_Template, 21, 9, "div", 225);
    i0.ɵɵelementStart(76, "div", 226)(77, "table", 227)(78, "thead")(79, "tr")(80, "th");
    i0.ɵɵtext(81, "Luogo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(82, "th");
    i0.ɵɵtext(83, "Stato");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(84, "th");
    i0.ɵɵtext(85, "Campi mancanti");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(86, "tbody");
    i0.ɵɵtemplate(87, AdminDashboardComponent_div_3_ng_container_27_tr_87_Template, 3, 0, "tr", 78)(88, AdminDashboardComponent_div_3_ng_container_27_tr_88_Template, 11, 8, "tr", 101);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const gptMissingLoading_r59 = i0.ɵɵreference(7);
    const gptCompleteLoading_r60 = i0.ɵɵreference(13);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingOpenAiTranslationStatus)("ngIfElse", gptMissingLoading_r59);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingOpenAiTranslationStatus)("ngIfElse", gptCompleteLoading_r60);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.gptTranslationUsage.totalTokens);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("formGroup", ctx_r1.openAiTranslationSettingsForm);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.openAiTranslationSettings);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("placeholder", (ctx_r1.openAiTranslationSettings == null ? null : ctx_r1.openAiTranslationSettings.maskedApiKey) || "sk-...");
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("disabled", !ctx_r1.canSaveOpenAiTranslationSettings);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.savingOpenAiTranslationSettings ? "Salvo..." : "Salva configurazione", " ");
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("disabled", !ctx_r1.canTranslateMissingGptPois);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.bulkTranslatingPois ? "Traduco..." : "Traduci i luoghi mancanti della citt\u00E0", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.openAiTranslationSettings && !ctx_r1.openAiTranslationSettings.hasApiKey);
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r1.gptTranslationForm);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngForOf", ctx_r1.catalogCities);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngForOf", ctx_r1.contentLanguages);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngForOf", ctx_r1.catalogPois)("ngForTrackBy", ctx_r1.trackByCatalogPoiId);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.gptTranslationProgressTotal);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.loadingCatalogCities || ctx_r1.loadingCatalogPois || ctx_r1.loadingOpenAiTranslationStatus);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.selectedGptTranslationPoi);
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingOpenAiTranslationStatus && !ctx_r1.openAiTranslationStatusRows.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.openAiTranslationStatusRows);
} }
function AdminDashboardComponent_div_3_ng_container_28_strong_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.catalogCities.length);
} }
function AdminDashboardComponent_div_3_ng_container_28_ng_template_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_28_strong_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "strong");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.catalogPois.length);
} }
function AdminDashboardComponent_div_3_ng_container_28_ng_template_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_28_div_26_tr_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 244);
    i0.ɵɵelement(2, "mat-spinner", 99);
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_28_div_26_tr_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 245);
    i0.ɵɵtext(2, "Nessuna citt\u00E0 disponibile.");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_28_div_26_ng_container_32_tr_1_small_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1, "Predefinita");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_28_div_26_ng_container_32_tr_1_Template(rf, ctx) { if (rf & 1) {
    const _r63 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, AdminDashboardComponent_div_3_ng_container_28_div_26_ng_container_32_tr_1_small_4_Template, 2, 0, "small", 78);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "td")(10, "div", 180)(11, "button", 246);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_28_div_26_ng_container_32_tr_1_Template_button_click_11_listener() { const city_r64 = i0.ɵɵrestoreView(_r63).$implicit; const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.editCatalogCity(city_r64)); });
    i0.ɵɵtext(12, "Modifica");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "button", 182);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_28_div_26_ng_container_32_tr_1_Template_button_click_13_listener() { const city_r64 = i0.ɵɵrestoreView(_r63).$implicit; const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.deleteCatalogCity(city_r64)); });
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const city_r64 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(city_r64.name);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", city_r64.isDefault);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(city_r64.region);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(city_r64.poiCount);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r1.deletingCatalogCityId === city_r64.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.deletingCatalogCityId === city_r64.id ? "Elimino..." : "Elimina", " ");
} }
function AdminDashboardComponent_div_3_ng_container_28_div_26_ng_container_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_28_div_26_ng_container_32_tr_1_Template, 15, 6, "tr", 101);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.catalogCities);
} }
function AdminDashboardComponent_div_3_ng_container_28_div_26_Template(rf, ctx) { if (rf & 1) {
    const _r62 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 241)(1, "section", 118)(2, "div", 242)(3, "h3");
    i0.ɵɵtext(4, "Nuova citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 114);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_28_div_26_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r62); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleCatalogCityCreateSection()); });
    i0.ɵɵelementStart(6, "span", 115);
    i0.ɵɵtext(7, "+");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "span");
    i0.ɵɵtext(9, "Nuova citt\u00E0");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(10, "section", 118)(11, "div", 243)(12, "div")(13, "h3");
    i0.ɵɵtext(14, "Lista citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "p", 90);
    i0.ɵɵtext(16, "Modifica da modale e gestisci i luoghi dalla tab dedicata.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(17, "div", 226)(18, "table", 227)(19, "thead")(20, "tr")(21, "th");
    i0.ɵɵtext(22, "Citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "th");
    i0.ɵɵtext(24, "Regione");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "th");
    i0.ɵɵtext(26, "Luoghi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "th");
    i0.ɵɵtext(28, "Azioni");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "tbody");
    i0.ɵɵtemplate(30, AdminDashboardComponent_div_3_ng_container_28_div_26_tr_30_Template, 3, 0, "tr", 78)(31, AdminDashboardComponent_div_3_ng_container_28_div_26_tr_31_Template, 3, 0, "tr", 78)(32, AdminDashboardComponent_div_3_ng_container_28_div_26_ng_container_32_Template, 2, 1, "ng-container", 78);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(30);
    i0.ɵɵproperty("ngIf", ctx_r1.loadingCatalogCities);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingCatalogCities && !ctx_r1.catalogCities.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingCatalogCities);
} }
function AdminDashboardComponent_div_3_ng_container_28_div_27_mat_option_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r66 = ctx.$implicit;
    i0.ɵɵproperty("value", city_r66.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(city_r66.name);
} }
function AdminDashboardComponent_div_3_ng_container_28_div_27_p_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, "Crea una citt\u00E0 per iniziare a gestire i POI.");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_28_div_27_div_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 132);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_28_div_27_p_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, " Seleziona una citt\u00E0 per vedere la lista dei punti di interesse. ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_tr_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 98);
    i0.ɵɵelement(2, "mat-spinner", 99);
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_tr_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 100);
    i0.ɵɵtext(2, "Nessun luogo nella citt\u00E0 selezionata.");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_ng_container_19_tr_1_Template(rf, ctx) { if (rf & 1) {
    const _r67 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "td");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "td");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "td");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td")(11, "button", 249);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_ng_container_19_tr_1_Template_button_click_11_listener() { const poi_r68 = i0.ɵɵrestoreView(_r67).$implicit; const ctx_r1 = i0.ɵɵnextContext(6); return i0.ɵɵresetView(ctx_r1.openCatalogPoiAudioPlayer(poi_r68)); });
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "td")(14, "div", 180)(15, "button", 246);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_ng_container_19_tr_1_Template_button_click_15_listener() { const poi_r68 = i0.ɵɵrestoreView(_r67).$implicit; const ctx_r1 = i0.ɵɵnextContext(6); return i0.ɵɵresetView(ctx_r1.editCatalogPoi(poi_r68)); });
    i0.ɵɵtext(16, "Modifica");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "button", 182);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_ng_container_19_tr_1_Template_button_click_17_listener() { const poi_r68 = i0.ɵɵrestoreView(_r67).$implicit; const ctx_r1 = i0.ɵɵnextContext(6); return i0.ɵɵresetView(ctx_r1.deleteCatalogPoi(poi_r68)); });
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const poi_r68 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(6);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(poi_r68.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(poi_r68.category);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(poi_r68.priceSingle));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatCatalogPoiDuration(poi_r68));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !poi_r68.audioUrl);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", poi_r68.audioUrl ? ctx_r1.audioFileNameFromUrl(poi_r68.audioUrl) : "Nessun audio", " ");
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r1.deletingCatalogPoiId === poi_r68.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.deletingCatalogPoiId === poi_r68.id ? "Elimino..." : "Elimina", " ");
} }
function AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_ng_container_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_ng_container_19_tr_1_Template, 19, 8, "tr", 108);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.catalogPois)("ngForTrackBy", ctx_r1.trackByCatalogPoiId);
} }
function AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 96)(1, "table", 248)(2, "thead")(3, "tr")(4, "th");
    i0.ɵɵtext(5, "Luogo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th");
    i0.ɵɵtext(7, "Categoria");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "th");
    i0.ɵɵtext(9, "Prezzo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "th");
    i0.ɵɵtext(11, "Durata");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "th");
    i0.ɵɵtext(13, "Audio");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "th");
    i0.ɵɵtext(15, "Azioni");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "tbody");
    i0.ɵɵtemplate(17, AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_tr_17_Template, 3, 0, "tr", 78)(18, AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_tr_18_Template, 3, 0, "tr", 78)(19, AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_ng_container_19_Template, 2, 2, "ng-container", 78);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(17);
    i0.ɵɵproperty("ngIf", ctx_r1.loadingCatalogPois);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingCatalogPois && !ctx_r1.catalogPois.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingCatalogPois);
} }
function AdminDashboardComponent_div_3_ng_container_28_div_27_Template(rf, ctx) { if (rf & 1) {
    const _r65 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 241)(1, "section", 118)(2, "div", 242)(3, "h3");
    i0.ɵɵtext(4, "Nuovo luogo di interesse");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 114);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_28_div_27_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r65); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleCatalogPoiCreateSection()); });
    i0.ɵɵelementStart(6, "span", 115);
    i0.ɵɵtext(7, "+");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "span");
    i0.ɵɵtext(9, "Nuovo luogo interesse");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(10, "section", 118)(11, "div", 243)(12, "div")(13, "h3");
    i0.ɵɵtext(14, "Lista luoghi di interesse");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "p", 90);
    i0.ɵɵtext(16, "Sezione in colonna unica per mantenere la lettura pulita.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "mat-form-field", 247)(18, "mat-label");
    i0.ɵɵtext(19, "Filtro citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "mat-select", 193);
    i0.ɵɵlistener("selectionChange", function AdminDashboardComponent_div_3_ng_container_28_div_27_Template_mat_select_selectionChange_20_listener($event) { i0.ɵɵrestoreView(_r65); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onCatalogCityFilterChange($event.value)); });
    i0.ɵɵtemplate(21, AdminDashboardComponent_div_3_ng_container_28_div_27_mat_option_21_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(22, AdminDashboardComponent_div_3_ng_container_28_div_27_p_22_Template, 2, 0, "p", 91)(23, AdminDashboardComponent_div_3_ng_container_28_div_27_div_23_Template, 2, 0, "div", 126)(24, AdminDashboardComponent_div_3_ng_container_28_div_27_p_24_Template, 2, 0, "p", 91)(25, AdminDashboardComponent_div_3_ng_container_28_div_27_div_25_Template, 20, 3, "div", 92);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(20);
    i0.ɵɵproperty("value", ctx_r1.selectedCatalogCityId);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.catalogCities);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingCatalogCities && !ctx_r1.catalogCities.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.loadingCatalogCities);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingCatalogCities && ctx_r1.catalogCities.length && !ctx_r1.selectedCatalogCityId);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.selectedCatalogCityId);
} }
function AdminDashboardComponent_div_3_ng_container_28_Template(rf, ctx) { if (rf & 1) {
    const _r61 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "div", 85)(2, "mat-card", 86)(3, "span");
    i0.ɵɵtext(4, "Citt\u00E0 totali");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, AdminDashboardComponent_div_3_ng_container_28_strong_5_Template, 2, 1, "strong", 87)(6, AdminDashboardComponent_div_3_ng_container_28_ng_template_6_Template, 2, 0, "ng-template", null, 30, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "mat-card", 86)(9, "span");
    i0.ɵɵtext(10, "Luoghi nella citt\u00E0 selezionata");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, AdminDashboardComponent_div_3_ng_container_28_strong_11_Template, 2, 1, "strong", 87)(12, AdminDashboardComponent_div_3_ng_container_28_ng_template_12_Template, 2, 0, "ng-template", null, 31, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "mat-card", 88)(15, "div", 89)(16, "div")(17, "h2");
    i0.ɵɵtext(18, "Gestione Citt\u00E0 e Luoghi di interesse");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "p", 90);
    i0.ɵɵtext(20, "Catalogo admin con tab dedicati e modifica tramite modali.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(21, "div", 238)(22, "button", 239);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_28_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r61); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectCatalogTab("cities")); });
    i0.ɵɵtext(23, " Citt\u00E0 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "button", 239);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_28_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r61); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectCatalogTab("pois")); });
    i0.ɵɵtext(25, " Luoghi interesse ");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(26, AdminDashboardComponent_div_3_ng_container_28_div_26_Template, 33, 3, "div", 240)(27, AdminDashboardComponent_div_3_ng_container_28_div_27_Template, 26, 6, "div", 240);
    i0.ɵɵelementEnd();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const catalogCitiesLoadingStat_r69 = i0.ɵɵreference(7);
    const catalogPoisLoadingStat_r70 = i0.ɵɵreference(13);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingCatalogCities)("ngIfElse", catalogCitiesLoadingStat_r69);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingCatalogPois)("ngIfElse", catalogPoisLoadingStat_r70);
    i0.ɵɵadvance(11);
    i0.ɵɵclassProp("active", ctx_r1.catalogTab === "cities");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("active", ctx_r1.catalogTab === "pois");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.catalogTab === "cities");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogTab === "pois");
} }
function AdminDashboardComponent_div_3_ng_template_29_section_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 270)(1, "h3");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "mat-form-field", 62)(4, "mat-label");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(6, "input", 253);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const language_r72 = ctx.$implicit;
    i0.ɵɵproperty("formGroupName", language_r72.code);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(language_r72.label);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Nome citt\u00E0 ", language_r72.label, "");
} }
function AdminDashboardComponent_div_3_ng_template_29_div_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 271);
    i0.ɵɵelement(1, "img", 272);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r1.catalogCityForm.controls.heroImage.value, i0.ɵɵsanitizeUrl);
} }
function AdminDashboardComponent_div_3_ng_template_29_ng_template_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 273);
    i0.ɵɵtext(1, "Carica un'immagine per la citt\u00E0.");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_29_button_39_Template(rf, ctx) { if (rf & 1) {
    const _r74 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 274);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_29_button_39_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r74); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.clearCatalogCityImage()); });
    i0.ɵɵtext(1, " Rimuovi immagine ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogCityImage || ctx_r1.savingCatalogCity);
} }
function AdminDashboardComponent_div_3_ng_template_29_Template(rf, ctx) { if (rf & 1) {
    const _r71 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "h2", 250);
    i0.ɵɵtext(1, "Nuova citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "form", 251);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_template_29_Template_form_ngSubmit_2_listener() { i0.ɵɵrestoreView(_r71); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.saveCatalogCity()); });
    i0.ɵɵelementStart(3, "div", 252)(4, "mat-form-field", 62)(5, "mat-label");
    i0.ɵɵtext(6, "Nome citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(7, "input", 253);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "mat-form-field", 62)(9, "mat-label");
    i0.ɵɵtext(10, "Regione (fissa)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(11, "input", 254);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "mat-form-field", 62)(13, "mat-label");
    i0.ɵɵtext(14, "Prezzo bundle (EUR)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(15, "input", 255);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 256)(17, "div", 257)(18, "strong");
    i0.ɵɵtext(19, "Traduzioni app utente");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "span");
    i0.ɵɵtext(21, "Compila le lingue disponibili. Se un campo resta vuoto, l'app mostra l'italiano principale.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 258);
    i0.ɵɵtemplate(23, AdminDashboardComponent_div_3_ng_template_29_section_23_Template, 7, 3, "section", 259);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(24, "input", 260);
    i0.ɵɵelementStart(25, "div", 261)(26, "div", 262)(27, "strong");
    i0.ɵɵtext(28, "Immagine citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "span");
    i0.ɵɵtext(30);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(31, AdminDashboardComponent_div_3_ng_template_29_div_31_Template, 2, 1, "div", 263)(32, AdminDashboardComponent_div_3_ng_template_29_ng_template_32_Template, 2, 0, "ng-template", null, 32, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementStart(34, "div", 264)(35, "input", 265, 33);
    i0.ɵɵlistener("change", function AdminDashboardComponent_div_3_ng_template_29_Template_input_change_35_listener($event) { i0.ɵɵrestoreView(_r71); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onCatalogCityImageFileSelected($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "button", 266);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_29_Template_button_click_37_listener() { i0.ɵɵrestoreView(_r71); const createCatalogCityImageInput_r73 = i0.ɵɵreference(36); return i0.ɵɵresetView(createCatalogCityImageInput_r73.click()); });
    i0.ɵɵtext(38);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(39, AdminDashboardComponent_div_3_ng_template_29_button_39_Template, 2, 1, "button", 267);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(40, "div", 268)(41, "button", 269);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_29_Template_button_click_41_listener() { i0.ɵɵrestoreView(_r71); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeCreateCatalogCityDialog()); });
    i0.ɵɵtext(42, " Annulla ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "button", 213);
    i0.ɵɵtext(44);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const createCityImageEmpty_r75 = i0.ɵɵreference(33);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("formGroup", ctx_r1.catalogCityForm);
    i0.ɵɵadvance(21);
    i0.ɵɵproperty("ngForOf", ctx_r1.contentLanguages);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.catalogCityForm.controls.heroImage.value ? "Pronta" : "Nessuna immagine");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogCityForm.controls.heroImage.value)("ngIfElse", createCityImageEmpty_r75);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogCityImage || ctx_r1.savingCatalogCity);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.uploadingCatalogCityImage ? "Upload..." : ctx_r1.catalogCityForm.controls.heroImage.value ? "Sostituisci immagine" : "Carica immagine", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogCityForm.controls.heroImage.value);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.savingCatalogCity);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.canSaveCatalogCity);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.savingCatalogCity ? "Salvataggio..." : "Crea citt\u00E0", " ");
} }
function AdminDashboardComponent_div_3_ng_template_31_mat_option_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r77 = ctx.$implicit;
    i0.ɵɵproperty("value", city_r77.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(city_r77.name);
} }
function AdminDashboardComponent_div_3_ng_template_31_p_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, "Crea prima almeno una citt\u00E0.");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_31_div_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 132);
    i0.ɵɵelement(1, "mat-spinner", 94);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_mat_option_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const category_r79 = ctx.$implicit;
    i0.ɵɵproperty("value", category_r79);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", category_r79, " ");
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_div_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 290)(1, "span", 291);
    i0.ɵɵtext(2, "File:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const language_r81 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.audioFileNameFromUrl(ctx_r1.catalogPoiTranslationAudioUrl(language_r81.code, "create")));
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_ng_template_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 273);
    i0.ɵɵtext(1, "Audio opzionale: puoi caricarlo ora o dopo.");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_button_26_Template(rf, ctx) { if (rf & 1) {
    const _r83 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 274);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_button_26_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r83); const language_r81 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.clearCatalogPoiTranslationAudio(language_r81.code, "create")); });
    i0.ɵɵtext(1, " Rimuovi audio ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const language_r81 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("disabled", ctx_r1.isCatalogPoiTranslationAudioUploading(language_r81.code, "create") || ctx_r1.savingCatalogPoi);
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_audio_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "audio", 292);
} if (rf & 2) {
    const language_r81 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("src", ctx_r1.catalogPoiTranslationAudioUrl(language_r81.code, "create"), i0.ɵɵsanitizeUrl);
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_Template(rf, ctx) { if (rf & 1) {
    const _r80 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 270)(1, "h3");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "mat-form-field", 62)(4, "mat-label");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(6, "textarea", 282);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "mat-form-field", 62)(8, "mat-label");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(10, "textarea", 283);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(11, "input", 285);
    i0.ɵɵelementStart(12, "div", 261)(13, "div", 262)(14, "strong");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span");
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(18, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_div_18_Template, 5, 1, "div", 286)(19, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_ng_template_19_Template, 2, 0, "ng-template", null, 38, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementStart(21, "div", 264)(22, "input", 287, 39);
    i0.ɵɵlistener("change", function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_Template_input_change_22_listener($event) { const language_r81 = i0.ɵɵrestoreView(_r80).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.onCatalogPoiTranslationAudioFileSelected($event, language_r81.code, "create")); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "button", 266);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r80); const createPoiTranslationAudioInput_r82 = i0.ɵɵreference(23); return i0.ɵɵresetView(createPoiTranslationAudioInput_r82.click()); });
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(26, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_button_26_Template, 2, 1, "button", 267);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(27, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_audio_27_Template, 1, 1, "audio", 288);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const language_r81 = ctx.$implicit;
    const createPoiTranslationAudioEmpty_r84 = i0.ɵɵreference(20);
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("formGroupName", language_r81.code);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(language_r81.label);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Descrizione breve ", language_r81.label, "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("Descrizione lunga ", language_r81.label, "");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("Audioguida ", language_r81.label, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.catalogPoiTranslationAudioUrl(language_r81.code, "create") ? "Pronta" : "Nessun audio");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiTranslationAudioUrl(language_r81.code, "create"))("ngIfElse", createPoiTranslationAudioEmpty_r84);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.isCatalogPoiTranslationAudioUploading(language_r81.code, "create") || ctx_r1.savingCatalogPoi);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isCatalogPoiTranslationAudioUploading(language_r81.code, "create") ? "Upload..." : ctx_r1.catalogPoiTranslationAudioUrl(language_r81.code, "create") ? "Sostituisci audio" : "Carica audio", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiTranslationAudioUrl(language_r81.code, "create"));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiTranslationAudioUrl(language_r81.code, "create"));
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_div_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 271);
    i0.ɵɵelement(1, "img", 293);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r1.catalogPoiForm.controls.imageUrl.value, i0.ɵɵsanitizeUrl);
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_ng_template_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 273);
    i0.ɵɵtext(1, "Carica un'immagine per il luogo.");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_button_60_Template(rf, ctx) { if (rf & 1) {
    const _r86 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 274);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_button_60_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r86); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.clearCatalogPoiImage()); });
    i0.ɵɵtext(1, " Rimuovi immagine ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogImage || ctx_r1.savingCatalogPoi);
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_div_68_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 290)(1, "span", 291);
    i0.ɵɵtext(2, "File:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.audioFileNameFromUrl(ctx_r1.catalogPoiForm.controls.audioUrl.value));
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_ng_template_69_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 273);
    i0.ɵɵtext(1, "Audio opzionale: puoi caricarlo ora o dopo.");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_button_76_Template(rf, ctx) { if (rf & 1) {
    const _r88 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 274);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_button_76_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r88); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.clearCatalogPoiAudio()); });
    i0.ɵɵtext(1, " Rimuovi audio ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogAudio || ctx_r1.savingCatalogPoi);
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_audio_77_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "audio", 292);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("src", ctx_r1.catalogPoiForm.controls.audioUrl.value, i0.ɵɵsanitizeUrl);
} }
function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_Template(rf, ctx) { if (rf & 1) {
    const _r78 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "mat-form-field", 62)(2, "mat-label");
    i0.ɵɵtext(3, "Nome luogo");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "input", 253);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "mat-form-field", 62)(6, "mat-label");
    i0.ɵɵtext(7, "Indirizzo");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(8, "input", 275);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "mat-form-field", 62)(10, "mat-label");
    i0.ɵɵtext(11, "Categoria");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "mat-select", 276);
    i0.ɵɵtemplate(13, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_mat_option_13_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 277)(15, "mat-form-field", 62)(16, "mat-label");
    i0.ɵɵtext(17, "Latitudine");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(18, "input", 278);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "mat-form-field", 62)(20, "mat-label");
    i0.ɵɵtext(21, "Longitudine");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(22, "input", 279);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 280)(24, "button", 281);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r78); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.openPoiMapPicker("create")); });
    i0.ɵɵelementStart(25, "span", 115);
    i0.ɵɵtext(26, "+");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "span");
    i0.ɵɵtext(28, "Apri mappa e cerca coordinate");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "mat-form-field", 62)(30, "mat-label");
    i0.ɵɵtext(31, "Descrizione breve");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(32, "textarea", 282);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "mat-form-field", 62)(34, "mat-label");
    i0.ɵɵtext(35, "Descrizione lunga");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(36, "textarea", 283);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "div", 256)(38, "div", 257)(39, "strong");
    i0.ɵɵtext(40, "Traduzioni app utente");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "span");
    i0.ɵɵtext(42, "Questi contenuti vengono mostrati nell'app utente in base alla lingua selezionata.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(43, "div", 258);
    i0.ɵɵtemplate(44, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_section_44_Template, 28, 12, "section", 259);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(45, "input", 284);
    i0.ɵɵelementStart(46, "div", 261)(47, "div", 262)(48, "strong");
    i0.ɵɵtext(49, "Immagine luogo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "span");
    i0.ɵɵtext(51);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(52, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_div_52_Template, 2, 1, "div", 263)(53, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_ng_template_53_Template, 2, 0, "ng-template", null, 34, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementStart(55, "div", 264)(56, "input", 265, 35);
    i0.ɵɵlistener("change", function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_Template_input_change_56_listener($event) { i0.ɵɵrestoreView(_r78); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onCatalogImageFileSelected($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "button", 266);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_Template_button_click_58_listener() { i0.ɵɵrestoreView(_r78); const createCatalogPoiImageInput_r85 = i0.ɵɵreference(57); return i0.ɵɵresetView(createCatalogPoiImageInput_r85.click()); });
    i0.ɵɵtext(59);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(60, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_button_60_Template, 2, 1, "button", 267);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(61, "input", 285);
    i0.ɵɵelementStart(62, "div", 261)(63, "div", 262)(64, "strong");
    i0.ɵɵtext(65, "Audioguida");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(66, "span");
    i0.ɵɵtext(67);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(68, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_div_68_Template, 5, 1, "div", 286)(69, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_ng_template_69_Template, 2, 0, "ng-template", null, 36, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementStart(71, "div", 264)(72, "input", 287, 37);
    i0.ɵɵlistener("change", function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_Template_input_change_72_listener($event) { i0.ɵɵrestoreView(_r78); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onCatalogAudioFileSelected($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(74, "button", 266);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_31_ng_container_11_Template_button_click_74_listener() { i0.ɵɵrestoreView(_r78); const createCatalogPoiAudioInput_r87 = i0.ɵɵreference(73); return i0.ɵɵresetView(createCatalogPoiAudioInput_r87.click()); });
    i0.ɵɵtext(75);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(76, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_button_76_Template, 2, 1, "button", 267);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(77, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_audio_77_Template, 1, 1, "audio", 288);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(78, "div", 277)(79, "mat-form-field", 62)(80, "mat-label");
    i0.ɵɵtext(81, "Prezzo singolo (EUR)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(82, "input", 289);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const createPoiImageEmpty_r89 = i0.ɵɵreference(54);
    const createPoiAudioEmpty_r90 = i0.ɵɵreference(70);
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("ngForOf", ctx_r1.poiCategoryOptionsFor(ctx_r1.catalogPoiForm.controls.category.value));
    i0.ɵɵadvance(31);
    i0.ɵɵproperty("ngForOf", ctx_r1.contentLanguages);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.catalogPoiForm.controls.imageUrl.value ? "Pronta" : "Nessuna immagine");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiForm.controls.imageUrl.value)("ngIfElse", createPoiImageEmpty_r89);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogImage || ctx_r1.savingCatalogPoi);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.uploadingCatalogImage ? "Upload..." : ctx_r1.catalogPoiForm.controls.imageUrl.value ? "Sostituisci immagine" : "Carica immagine", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiForm.controls.imageUrl.value);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.catalogPoiForm.controls.audioUrl.value ? "Pronta" : "Nessun audio");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiForm.controls.audioUrl.value)("ngIfElse", createPoiAudioEmpty_r90);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogAudio || ctx_r1.savingCatalogPoi);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.uploadingCatalogAudio ? "Upload..." : ctx_r1.catalogPoiForm.controls.audioUrl.value ? "Sostituisci audio" : "Carica audio", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiForm.controls.audioUrl.value);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiForm.controls.audioUrl.value);
} }
function AdminDashboardComponent_div_3_ng_template_31_Template(rf, ctx) { if (rf & 1) {
    const _r76 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "h2", 250);
    i0.ɵɵtext(1, "Nuovo luogo di interesse");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "form", 251);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_template_31_Template_form_ngSubmit_2_listener() { i0.ɵɵrestoreView(_r76); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.saveCatalogPoi()); });
    i0.ɵɵelementStart(3, "div", 252)(4, "mat-form-field", 62)(5, "mat-label");
    i0.ɵɵtext(6, "Citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "mat-select", 193);
    i0.ɵɵlistener("selectionChange", function AdminDashboardComponent_div_3_ng_template_31_Template_mat_select_selectionChange_7_listener($event) { i0.ɵɵrestoreView(_r76); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onCatalogCityFilterChange($event.value)); });
    i0.ɵɵtemplate(8, AdminDashboardComponent_div_3_ng_template_31_mat_option_8_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(9, AdminDashboardComponent_div_3_ng_template_31_p_9_Template, 2, 0, "p", 91)(10, AdminDashboardComponent_div_3_ng_template_31_div_10_Template, 2, 0, "div", 126)(11, AdminDashboardComponent_div_3_ng_template_31_ng_container_11_Template, 83, 15, "ng-container", 78);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 268)(13, "button", 269);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_31_Template_button_click_13_listener() { i0.ɵɵrestoreView(_r76); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeCreateCatalogPoiDialog()); });
    i0.ɵɵtext(14, " Annulla ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "button", 213);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("formGroup", ctx_r1.catalogPoiForm);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("value", ctx_r1.selectedCatalogCityId);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.catalogCities);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingCatalogCities && !ctx_r1.catalogCities.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.loadingCatalogCities);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingCatalogCities && ctx_r1.catalogCities.length);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.savingCatalogPoi);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.canSaveCatalogPoi);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.savingCatalogPoi ? "Salvataggio..." : "Crea luogo di interesse", " ");
} }
function AdminDashboardComponent_div_3_ng_template_33_section_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 270)(1, "h3");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "mat-form-field", 62)(4, "mat-label");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(6, "input", 253);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const language_r92 = ctx.$implicit;
    i0.ɵɵproperty("formGroupName", language_r92.code);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(language_r92.label);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Nome citt\u00E0 ", language_r92.label, "");
} }
function AdminDashboardComponent_div_3_ng_template_33_div_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 271);
    i0.ɵɵelement(1, "img", 272);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r1.catalogCityEditForm.controls.heroImage.value, i0.ɵɵsanitizeUrl);
} }
function AdminDashboardComponent_div_3_ng_template_33_ng_template_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 273);
    i0.ɵɵtext(1, "Carica un'immagine per la citt\u00E0.");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_33_button_39_Template(rf, ctx) { if (rf & 1) {
    const _r94 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 274);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_33_button_39_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r94); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.clearCatalogCityEditImage()); });
    i0.ɵɵtext(1, " Rimuovi immagine ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogCityEditImage || ctx_r1.savingCatalogCity);
} }
function AdminDashboardComponent_div_3_ng_template_33_Template(rf, ctx) { if (rf & 1) {
    const _r91 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "h2", 250);
    i0.ɵɵtext(1, "Modifica citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "form", 251);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_template_33_Template_form_ngSubmit_2_listener() { i0.ɵɵrestoreView(_r91); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.saveCatalogCityEdit()); });
    i0.ɵɵelementStart(3, "div", 252)(4, "mat-form-field", 62)(5, "mat-label");
    i0.ɵɵtext(6, "Nome citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(7, "input", 253);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "mat-form-field", 62)(9, "mat-label");
    i0.ɵɵtext(10, "Regione");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(11, "input", 294);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "mat-form-field", 62)(13, "mat-label");
    i0.ɵɵtext(14, "Prezzo bundle (EUR)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(15, "input", 255);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 256)(17, "div", 257)(18, "strong");
    i0.ɵɵtext(19, "Traduzioni app utente");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "span");
    i0.ɵɵtext(21, "Compila le lingue disponibili. Se un campo resta vuoto, l'app mostra l'italiano principale.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 258);
    i0.ɵɵtemplate(23, AdminDashboardComponent_div_3_ng_template_33_section_23_Template, 7, 3, "section", 259);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(24, "input", 260);
    i0.ɵɵelementStart(25, "div", 261)(26, "div", 262)(27, "strong");
    i0.ɵɵtext(28, "Immagine citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "span");
    i0.ɵɵtext(30);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(31, AdminDashboardComponent_div_3_ng_template_33_div_31_Template, 2, 1, "div", 263)(32, AdminDashboardComponent_div_3_ng_template_33_ng_template_32_Template, 2, 0, "ng-template", null, 40, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementStart(34, "div", 264)(35, "input", 265, 41);
    i0.ɵɵlistener("change", function AdminDashboardComponent_div_3_ng_template_33_Template_input_change_35_listener($event) { i0.ɵɵrestoreView(_r91); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onCatalogCityEditImageFileSelected($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "button", 266);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_33_Template_button_click_37_listener() { i0.ɵɵrestoreView(_r91); const catalogCityEditImageInput_r93 = i0.ɵɵreference(36); return i0.ɵɵresetView(catalogCityEditImageInput_r93.click()); });
    i0.ɵɵtext(38);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(39, AdminDashboardComponent_div_3_ng_template_33_button_39_Template, 2, 1, "button", 267);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(40, "div", 268)(41, "button", 269);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_33_Template_button_click_41_listener() { i0.ɵɵrestoreView(_r91); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeCatalogCityEditDialog()); });
    i0.ɵɵtext(42, " Annulla ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "button", 213);
    i0.ɵɵtext(44);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const cityEditImageEmpty_r95 = i0.ɵɵreference(33);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("formGroup", ctx_r1.catalogCityEditForm);
    i0.ɵɵadvance(21);
    i0.ɵɵproperty("ngForOf", ctx_r1.contentLanguages);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.catalogCityEditForm.controls.heroImage.value ? "Pronta" : "Nessuna immagine");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogCityEditForm.controls.heroImage.value)("ngIfElse", cityEditImageEmpty_r95);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogCityEditImage || ctx_r1.savingCatalogCity);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.uploadingCatalogCityEditImage ? "Upload..." : ctx_r1.catalogCityEditForm.controls.heroImage.value ? "Sostituisci immagine" : "Carica immagine", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogCityEditForm.controls.heroImage.value);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.savingCatalogCity);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.canSaveCatalogCityEdit);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.savingCatalogCity ? "Salvataggio..." : "Salva citt\u00E0", " ");
} }
function AdminDashboardComponent_div_3_ng_template_35_mat_option_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r97 = ctx.$implicit;
    i0.ɵɵproperty("value", city_r97.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(city_r97.name);
} }
function AdminDashboardComponent_div_3_ng_template_35_mat_option_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const category_r98 = ctx.$implicit;
    i0.ɵɵproperty("value", category_r98);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", category_r98, " ");
} }
function AdminDashboardComponent_div_3_ng_template_35_section_52_div_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 290)(1, "span", 291);
    i0.ɵɵtext(2, "File:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const language_r100 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.audioFileNameFromUrl(ctx_r1.catalogPoiTranslationAudioUrl(language_r100.code, "edit")));
} }
function AdminDashboardComponent_div_3_ng_template_35_section_52_ng_template_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 273);
    i0.ɵɵtext(1, "Audio opzionale: puoi caricarlo ora o dopo.");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_35_section_52_button_26_Template(rf, ctx) { if (rf & 1) {
    const _r102 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 274);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_35_section_52_button_26_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r102); const language_r100 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.clearCatalogPoiTranslationAudio(language_r100.code, "edit")); });
    i0.ɵɵtext(1, " Rimuovi audio ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const language_r100 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("disabled", ctx_r1.isCatalogPoiTranslationAudioUploading(language_r100.code, "edit") || ctx_r1.savingCatalogPoi);
} }
function AdminDashboardComponent_div_3_ng_template_35_section_52_audio_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "audio", 292);
} if (rf & 2) {
    const language_r100 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("src", ctx_r1.catalogPoiTranslationAudioUrl(language_r100.code, "edit"), i0.ɵɵsanitizeUrl);
} }
function AdminDashboardComponent_div_3_ng_template_35_section_52_Template(rf, ctx) { if (rf & 1) {
    const _r99 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 270)(1, "h3");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "mat-form-field", 62)(4, "mat-label");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(6, "textarea", 282);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "mat-form-field", 62)(8, "mat-label");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(10, "textarea", 283);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(11, "input", 285);
    i0.ɵɵelementStart(12, "div", 261)(13, "div", 262)(14, "strong");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span");
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(18, AdminDashboardComponent_div_3_ng_template_35_section_52_div_18_Template, 5, 1, "div", 286)(19, AdminDashboardComponent_div_3_ng_template_35_section_52_ng_template_19_Template, 2, 0, "ng-template", null, 46, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementStart(21, "div", 264)(22, "input", 287, 47);
    i0.ɵɵlistener("change", function AdminDashboardComponent_div_3_ng_template_35_section_52_Template_input_change_22_listener($event) { const language_r100 = i0.ɵɵrestoreView(_r99).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onCatalogPoiTranslationAudioFileSelected($event, language_r100.code, "edit")); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "button", 266);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_35_section_52_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r99); const editPoiTranslationAudioInput_r101 = i0.ɵɵreference(23); return i0.ɵɵresetView(editPoiTranslationAudioInput_r101.click()); });
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(26, AdminDashboardComponent_div_3_ng_template_35_section_52_button_26_Template, 2, 1, "button", 267);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(27, AdminDashboardComponent_div_3_ng_template_35_section_52_audio_27_Template, 1, 1, "audio", 288);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const language_r100 = ctx.$implicit;
    const editPoiTranslationAudioEmpty_r103 = i0.ɵɵreference(20);
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("formGroupName", language_r100.code);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(language_r100.label);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Descrizione breve ", language_r100.label, "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("Descrizione lunga ", language_r100.label, "");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("Audioguida ", language_r100.label, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.catalogPoiTranslationAudioUrl(language_r100.code, "edit") ? "Pronta" : "Nessun audio");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiTranslationAudioUrl(language_r100.code, "edit"))("ngIfElse", editPoiTranslationAudioEmpty_r103);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.isCatalogPoiTranslationAudioUploading(language_r100.code, "edit") || ctx_r1.savingCatalogPoi);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isCatalogPoiTranslationAudioUploading(language_r100.code, "edit") ? "Upload..." : ctx_r1.catalogPoiTranslationAudioUrl(language_r100.code, "edit") ? "Sostituisci audio" : "Carica audio", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiTranslationAudioUrl(language_r100.code, "edit"));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiTranslationAudioUrl(language_r100.code, "edit"));
} }
function AdminDashboardComponent_div_3_ng_template_35_div_60_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 271);
    i0.ɵɵelement(1, "img", 293);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r1.catalogPoiEditForm.controls.imageUrl.value, i0.ɵɵsanitizeUrl);
} }
function AdminDashboardComponent_div_3_ng_template_35_ng_template_61_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 273);
    i0.ɵɵtext(1, "Carica un'immagine per il luogo.");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_35_button_68_Template(rf, ctx) { if (rf & 1) {
    const _r105 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 274);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_35_button_68_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r105); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.clearCatalogPoiEditImage()); });
    i0.ɵɵtext(1, " Rimuovi immagine ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogPoiEditImage || ctx_r1.savingCatalogPoi);
} }
function AdminDashboardComponent_div_3_ng_template_35_div_76_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 290)(1, "span", 291);
    i0.ɵɵtext(2, "File:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.audioFileNameFromUrl(ctx_r1.catalogPoiEditForm.controls.audioUrl.value));
} }
function AdminDashboardComponent_div_3_ng_template_35_ng_template_77_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 273);
    i0.ɵɵtext(1, "Audio opzionale: puoi caricarlo ora o dopo.");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_35_button_84_Template(rf, ctx) { if (rf & 1) {
    const _r107 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 274);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_35_button_84_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r107); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.clearCatalogPoiEditAudio()); });
    i0.ɵɵtext(1, " Rimuovi audio ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogPoiEditAudio || ctx_r1.savingCatalogPoi);
} }
function AdminDashboardComponent_div_3_ng_template_35_audio_85_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "audio", 292);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("src", ctx_r1.catalogPoiEditForm.controls.audioUrl.value, i0.ɵɵsanitizeUrl);
} }
function AdminDashboardComponent_div_3_ng_template_35_Template(rf, ctx) { if (rf & 1) {
    const _r96 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "h2", 250);
    i0.ɵɵtext(1, "Modifica luogo di interesse");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "form", 251);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_template_35_Template_form_ngSubmit_2_listener() { i0.ɵɵrestoreView(_r96); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.saveCatalogPoiEdit()); });
    i0.ɵɵelementStart(3, "div", 252)(4, "mat-form-field", 62)(5, "mat-label");
    i0.ɵɵtext(6, "Citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "mat-select", 295);
    i0.ɵɵtemplate(8, AdminDashboardComponent_div_3_ng_template_35_mat_option_8_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "mat-form-field", 62)(10, "mat-label");
    i0.ɵɵtext(11, "Nome luogo");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(12, "input", 253);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "mat-form-field", 62)(14, "mat-label");
    i0.ɵɵtext(15, "Indirizzo");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(16, "input", 275);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "mat-form-field", 62)(18, "mat-label");
    i0.ɵɵtext(19, "Categoria");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "mat-select", 276);
    i0.ɵɵtemplate(21, AdminDashboardComponent_div_3_ng_template_35_mat_option_21_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 277)(23, "mat-form-field", 62)(24, "mat-label");
    i0.ɵɵtext(25, "Latitudine");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(26, "input", 278);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "mat-form-field", 62)(28, "mat-label");
    i0.ɵɵtext(29, "Longitudine");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(30, "input", 279);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(31, "div", 280)(32, "button", 281);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_35_Template_button_click_32_listener() { i0.ɵɵrestoreView(_r96); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openPoiMapPicker("edit")); });
    i0.ɵɵelementStart(33, "span", 115);
    i0.ɵɵtext(34, "+");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "span");
    i0.ɵɵtext(36, "Apri mappa e cerca coordinate");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(37, "mat-form-field", 62)(38, "mat-label");
    i0.ɵɵtext(39, "Descrizione breve");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(40, "textarea", 282);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "mat-form-field", 62)(42, "mat-label");
    i0.ɵɵtext(43, "Descrizione lunga");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(44, "textarea", 283);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "div", 256)(46, "div", 257)(47, "strong");
    i0.ɵɵtext(48, "Traduzioni app utente");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "span");
    i0.ɵɵtext(50, "Questi contenuti vengono mostrati nell'app utente in base alla lingua selezionata.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(51, "div", 258);
    i0.ɵɵtemplate(52, AdminDashboardComponent_div_3_ng_template_35_section_52_Template, 28, 12, "section", 259);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(53, "input", 284);
    i0.ɵɵelementStart(54, "div", 261)(55, "div", 262)(56, "strong");
    i0.ɵɵtext(57, "Immagine luogo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "span");
    i0.ɵɵtext(59);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(60, AdminDashboardComponent_div_3_ng_template_35_div_60_Template, 2, 1, "div", 263)(61, AdminDashboardComponent_div_3_ng_template_35_ng_template_61_Template, 2, 0, "ng-template", null, 42, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementStart(63, "div", 264)(64, "input", 265, 43);
    i0.ɵɵlistener("change", function AdminDashboardComponent_div_3_ng_template_35_Template_input_change_64_listener($event) { i0.ɵɵrestoreView(_r96); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onCatalogPoiEditImageFileSelected($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(66, "button", 266);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_35_Template_button_click_66_listener() { i0.ɵɵrestoreView(_r96); const catalogPoiEditImageInput_r104 = i0.ɵɵreference(65); return i0.ɵɵresetView(catalogPoiEditImageInput_r104.click()); });
    i0.ɵɵtext(67);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(68, AdminDashboardComponent_div_3_ng_template_35_button_68_Template, 2, 1, "button", 267);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(69, "input", 285);
    i0.ɵɵelementStart(70, "div", 261)(71, "div", 262)(72, "strong");
    i0.ɵɵtext(73, "Audioguida");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(74, "span");
    i0.ɵɵtext(75);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(76, AdminDashboardComponent_div_3_ng_template_35_div_76_Template, 5, 1, "div", 286)(77, AdminDashboardComponent_div_3_ng_template_35_ng_template_77_Template, 2, 0, "ng-template", null, 44, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementStart(79, "div", 264)(80, "input", 287, 45);
    i0.ɵɵlistener("change", function AdminDashboardComponent_div_3_ng_template_35_Template_input_change_80_listener($event) { i0.ɵɵrestoreView(_r96); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onCatalogPoiEditAudioFileSelected($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(82, "button", 266);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_35_Template_button_click_82_listener() { i0.ɵɵrestoreView(_r96); const catalogPoiEditAudioInput_r106 = i0.ɵɵreference(81); return i0.ɵɵresetView(catalogPoiEditAudioInput_r106.click()); });
    i0.ɵɵtext(83);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(84, AdminDashboardComponent_div_3_ng_template_35_button_84_Template, 2, 1, "button", 267);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(85, AdminDashboardComponent_div_3_ng_template_35_audio_85_Template, 1, 1, "audio", 288);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(86, "div", 277)(87, "mat-form-field", 62)(88, "mat-label");
    i0.ɵɵtext(89, "Prezzo singolo (EUR)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(90, "input", 289);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(91, "div", 268)(92, "button", 269);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_35_Template_button_click_92_listener() { i0.ɵɵrestoreView(_r96); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeCatalogPoiEditDialog()); });
    i0.ɵɵtext(93, " Annulla ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(94, "button", 213);
    i0.ɵɵtext(95);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const poiEditImageEmpty_r108 = i0.ɵɵreference(62);
    const poiEditAudioEmpty_r109 = i0.ɵɵreference(78);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("formGroup", ctx_r1.catalogPoiEditForm);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngForOf", ctx_r1.catalogCities);
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("ngForOf", ctx_r1.poiCategoryOptionsFor(ctx_r1.catalogPoiEditForm.controls.category.value));
    i0.ɵɵadvance(31);
    i0.ɵɵproperty("ngForOf", ctx_r1.contentLanguages);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.catalogPoiEditForm.controls.imageUrl.value ? "Pronta" : "Nessuna immagine");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiEditForm.controls.imageUrl.value)("ngIfElse", poiEditImageEmpty_r108);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogPoiEditImage || ctx_r1.savingCatalogPoi);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.uploadingCatalogPoiEditImage ? "Upload..." : ctx_r1.catalogPoiEditForm.controls.imageUrl.value ? "Sostituisci immagine" : "Carica immagine", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiEditForm.controls.imageUrl.value);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.catalogPoiEditForm.controls.audioUrl.value ? "Pronta" : "Nessun audio");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiEditForm.controls.audioUrl.value)("ngIfElse", poiEditAudioEmpty_r109);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.uploadingCatalogPoiEditAudio || ctx_r1.savingCatalogPoi);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.uploadingCatalogPoiEditAudio ? "Upload..." : ctx_r1.catalogPoiEditForm.controls.audioUrl.value ? "Sostituisci audio" : "Carica audio", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiEditForm.controls.audioUrl.value);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.catalogPoiEditForm.controls.audioUrl.value);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("disabled", ctx_r1.savingCatalogPoi);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.canSaveCatalogPoiEdit);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.savingCatalogPoi ? "Salvataggio..." : "Salva luogo", " ");
} }
function AdminDashboardComponent_div_3_ng_template_37_Template(rf, ctx) { if (rf & 1) {
    const _r110 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "h2", 250);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 296)(3, "p", 90);
    i0.ɵɵtext(4, " File audio: ");
    i0.ɵɵelementStart(5, "strong");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(7, "audio", 297);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 268)(9, "button", 298);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_37_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r110); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeCatalogPoiAudioPlayer()); });
    i0.ɵɵtext(10, "Chiudi");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.audioPlayerPoiName || "Anteprima audioguida");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.audioPlayerFileName || "-");
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r1.audioPlayerUrl, i0.ɵɵsanitizeUrl);
} }
function AdminDashboardComponent_div_3_ng_template_39_p_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, " Cerca un luogo: le coordinate trovate vengono selezionate subito. Poi rifinisci trascinando il marker rosso sulla mappa. ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_39_p_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 308);
    i0.ɵɵtext(1, " Lat: ");
    i0.ɵɵelementStart(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5, " | Lng: ");
    i0.ɵɵelementStart(6, "strong");
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "number");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(4, 2, ctx_r1.mapPickerSelectedLat, "1.4-6"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(8, 5, ctx_r1.mapPickerSelectedLng, "1.4-6"));
} }
function AdminDashboardComponent_div_3_ng_template_39_div_14_article_1_Template(rf, ctx) { if (rf & 1) {
    const _r112 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 311)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "small");
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "number");
    i0.ɵɵpipe(6, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 180)(8, "button", 312);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_39_div_14_article_1_Template_button_click_8_listener() { const result_r113 = i0.ɵɵrestoreView(_r112).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.selectPoiMapResult(result_r113)); });
    i0.ɵɵtext(9, "Evidenzia su mappa");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 313);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_39_div_14_article_1_Template_button_click_10_listener() { const result_r113 = i0.ɵɵrestoreView(_r112).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.usePoiMapResult(result_r113)); });
    i0.ɵɵtext(11, "Usa subito");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const result_r113 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(result_r113.displayName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("Lat: ", i0.ɵɵpipeBind2(5, 3, result_r113.lat, "1.4-6"), " | Lng: ", i0.ɵɵpipeBind2(6, 6, result_r113.lng, "1.4-6"), "");
} }
function AdminDashboardComponent_div_3_ng_template_39_div_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 309);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_template_39_div_14_article_1_Template, 12, 9, "article", 310);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.mapPickerResults);
} }
function AdminDashboardComponent_div_3_ng_template_39_small_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.mapPickerTargetLabel);
} }
function AdminDashboardComponent_div_3_ng_template_39_small_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1, "Clicca o trascina il marker rosso per precisione.");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_39_Template(rf, ctx) { if (rf & 1) {
    const _r111 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "h2", 250);
    i0.ɵɵtext(1, "Cerca luogo e seleziona coordinate");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 296)(3, "form", 299);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_template_39_Template_form_ngSubmit_3_listener() { i0.ɵɵrestoreView(_r111); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.searchPoiMap()); });
    i0.ɵɵelementStart(4, "mat-form-field", 62)(5, "mat-label");
    i0.ɵɵtext(6, "Cerca luogo o indirizzo");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(7, "input", 300);
    i0.ɵɵelementStart(8, "mat-hint");
    i0.ɵɵtext(9, "Ricerca gratuita tramite OpenStreetMap");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "button", 301);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(12, AdminDashboardComponent_div_3_ng_template_39_p_12_Template, 2, 0, "p", 91)(13, AdminDashboardComponent_div_3_ng_template_39_p_13_Template, 9, 8, "p", 302)(14, AdminDashboardComponent_div_3_ng_template_39_div_14_Template, 2, 1, "div", 303);
    i0.ɵɵelementStart(15, "section", 304)(16, "div", 305)(17, "strong");
    i0.ɵɵtext(18, "Anteprima mappa");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(19, AdminDashboardComponent_div_3_ng_template_39_small_19_Template, 2, 1, "small", 78)(20, AdminDashboardComponent_div_3_ng_template_39_small_20_Template, 2, 0, "small", 78);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(21, "div", 306, 48);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 268)(24, "button", 269);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_39_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r111); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closePoiMapPicker()); });
    i0.ɵɵtext(25, " Chiudi ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "button", 307);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_39_Template_button_click_26_listener() { i0.ɵɵrestoreView(_r111); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.confirmPoiMapSelection()); });
    i0.ɵɵtext(27, " Usa coordinate selezionate ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("formGroup", ctx_r1.poiMapSearchForm);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("disabled", ctx_r1.mapPickerLoading);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.mapPickerLoading ? "Ricerca..." : "Cerca", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.mapPickerLoading && !ctx_r1.mapPickerResults.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.hasPoiMapSelection);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.mapPickerResults.length);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", ctx_r1.mapPickerTargetLabel);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.mapPickerTargetLabel);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("ready", ctx_r1.mapPickerMapReady);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.mapPickerLoading);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.hasPoiMapSelection || ctx_r1.mapPickerLoading);
} }
function AdminDashboardComponent_div_3_ng_template_41_mat_option_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const structure_r115 = ctx.$implicit;
    i0.ɵɵproperty("value", structure_r115.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(structure_r115.name);
} }
function AdminDashboardComponent_div_3_ng_template_41_mat_option_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r116 = ctx.$implicit;
    i0.ɵɵproperty("value", city_r116.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(city_r116.name);
} }
function AdminDashboardComponent_div_3_ng_template_41_p_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, " Nessuna citt\u00E0 disponibile. Crea prima una citt\u00E0 nella sezione catalogo. ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_41_div_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 132);
    i0.ɵɵelement(1, "mat-spinner", 329);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_41_Template(rf, ctx) { if (rf & 1) {
    const _r114 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "h2", 250);
    i0.ɵɵtext(1, "Aggiungi codice sconto/struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "form", 251);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_template_41_Template_form_ngSubmit_2_listener() { i0.ɵɵrestoreView(_r114); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.createDiscountCode()); });
    i0.ɵɵelementStart(3, "div", 252)(4, "mat-form-field", 62)(5, "mat-label");
    i0.ɵɵtext(6, "Struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "mat-select", 314);
    i0.ɵɵtemplate(8, AdminDashboardComponent_div_3_ng_template_41_mat_option_8_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 315)(10, "mat-form-field", 316)(11, "mat-label");
    i0.ɵɵtext(12, "Codice");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "input", 317);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 266);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_41_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r114); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.generateDiscountCodeForCreate()); });
    i0.ɵɵtext(15, " Genera codice ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 318)(17, "label");
    i0.ɵɵtext(18, "Applicabile a");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "mat-radio-group", 319)(20, "mat-radio-button", 320);
    i0.ɵɵtext(21, "Luogo singolo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "mat-radio-button", 321);
    i0.ɵɵtext(23, "Pacchetto citt\u00E0");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(24, "mat-form-field", 62)(25, "mat-label");
    i0.ɵɵtext(26, "Citt\u00E0 applicabili");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "mat-select", 322);
    i0.ɵɵtemplate(28, AdminDashboardComponent_div_3_ng_template_41_mat_option_28_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "mat-hint");
    i0.ɵɵtext(30, "Seleziona una o piu citt\u00E0");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(31, AdminDashboardComponent_div_3_ng_template_41_p_31_Template, 2, 0, "p", 91)(32, AdminDashboardComponent_div_3_ng_template_41_div_32_Template, 2, 0, "div", 126);
    i0.ɵɵelementStart(33, "mat-form-field", 62)(34, "mat-label");
    i0.ɵɵtext(35);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(36, "input", 323);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "mat-form-field", 62)(38, "mat-label");
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(40, "input", 324);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "mat-form-field", 62)(42, "mat-label");
    i0.ɵɵtext(43, "Scadenza");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(44, "input", 325, 49);
    i0.ɵɵelementStart(46, "button", 326);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_41_Template_button_click_46_listener() { i0.ɵɵrestoreView(_r114); const createDiscountExpiresInput_r117 = i0.ɵɵreference(45); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openNativeDateTimePicker(createDiscountExpiresInput_r117)); });
    i0.ɵɵelement(47, "span", 327);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "mat-hint");
    i0.ɵɵtext(49, "Seleziona data e ora");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(50, "div", 268)(51, "button", 269);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_41_Template_button_click_51_listener() { i0.ɵɵrestoreView(_r114); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeCreateDiscountCodeDialog()); });
    i0.ɵɵtext(52, " Annulla ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "button", 328);
    i0.ɵɵtext(54);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("formGroup", ctx_r1.discountCodeCreateForm);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngForOf", ctx_r1.structures);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.creatingDiscountCode);
    i0.ɵɵadvance(14);
    i0.ɵɵproperty("ngForOf", ctx_r1.catalogCities);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", !ctx_r1.catalogCities.length && !ctx_r1.loadingCatalogCities);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.loadingCatalogCities);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Sconto utente ", ctx_r1.discountCodeCreateScopeLabel, " (%)");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("Incasso struttura ", ctx_r1.discountCodeCreateScopeLabel, " (EUR)");
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("disabled", ctx_r1.creatingDiscountCode);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.creatingDiscountCode || ctx_r1.discountCodeCreateForm.invalid);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.creatingDiscountCode ? "Salvataggio..." : "Crea codice", " ");
} }
function AdminDashboardComponent_div_3_ng_template_43_p_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, " Verranno creati automaticamente la struttura ");
    i0.ɵɵelementStart(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4, ", il codice sconto e il PDF da inviare a ");
    i0.ɵɵelementStart(5, "strong");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(7, ". ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const request_r119 = ctx.ngIf;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(request_r119.structureName);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(request_r119.contactEmail);
} }
function AdminDashboardComponent_div_3_ng_template_43_mat_option_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r120 = ctx.$implicit;
    i0.ɵɵproperty("value", city_r120.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(city_r120.name);
} }
function AdminDashboardComponent_div_3_ng_template_43_p_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, " Nessuna citt\u00E0 disponibile. Crea prima una citt\u00E0 nella sezione catalogo. ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_43_div_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 132);
    i0.ɵɵelement(1, "mat-spinner", 329);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_43_Template(rf, ctx) { if (rf & 1) {
    const _r118 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "h2", 250);
    i0.ɵɵtext(1, "Approva richiesta partner");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "form", 251);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_template_43_Template_form_ngSubmit_2_listener() { i0.ɵɵrestoreView(_r118); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.approvePartnerRequest()); });
    i0.ɵɵelementStart(3, "div", 252);
    i0.ɵɵtemplate(4, AdminDashboardComponent_div_3_ng_template_43_p_4_Template, 8, 2, "p", 91);
    i0.ɵɵelementStart(5, "div", 315)(6, "mat-form-field", 316)(7, "mat-label");
    i0.ɵɵtext(8, "Codice");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "input", 317);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 266);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_43_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r118); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.generateDiscountCodeForPartnerApproval()); });
    i0.ɵɵtext(11, " Genera codice ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 318)(13, "label");
    i0.ɵɵtext(14, "Applicabile a");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "mat-radio-group", 319)(16, "mat-radio-button", 320);
    i0.ɵɵtext(17, "Luogo singolo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "mat-radio-button", 321);
    i0.ɵɵtext(19, "Pacchetto citt\u00E0");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(20, "mat-form-field", 62)(21, "mat-label");
    i0.ɵɵtext(22, "Citt\u00E0 applicabili");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "mat-select", 322);
    i0.ɵɵtemplate(24, AdminDashboardComponent_div_3_ng_template_43_mat_option_24_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "mat-hint");
    i0.ɵɵtext(26, "Seleziona una o piu citt\u00E0");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(27, AdminDashboardComponent_div_3_ng_template_43_p_27_Template, 2, 0, "p", 91)(28, AdminDashboardComponent_div_3_ng_template_43_div_28_Template, 2, 0, "div", 126);
    i0.ɵɵelementStart(29, "mat-form-field", 62)(30, "mat-label");
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(32, "input", 323);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "mat-form-field", 62)(34, "mat-label");
    i0.ɵɵtext(35);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(36, "input", 324);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "mat-form-field", 62)(38, "mat-label");
    i0.ɵɵtext(39, "Scadenza");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(40, "input", 325, 50);
    i0.ɵɵelementStart(42, "button", 326);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_43_Template_button_click_42_listener() { i0.ɵɵrestoreView(_r118); const partnerApprovalExpiresInput_r121 = i0.ɵɵreference(41); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openNativeDateTimePicker(partnerApprovalExpiresInput_r121)); });
    i0.ɵɵelement(43, "span", 327);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "mat-hint");
    i0.ɵɵtext(45, "Seleziona data e ora");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(46, "div", 268)(47, "button", 269);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_43_Template_button_click_47_listener() { i0.ɵɵrestoreView(_r118); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closePartnerRequestApprovalDialog()); });
    i0.ɵɵtext(48, " Annulla ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "button", 269);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_43_Template_button_click_49_listener() { i0.ɵɵrestoreView(_r118); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.previewSelectedPartnerRequestPdf()); });
    i0.ɵɵtext(50);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "button", 328);
    i0.ɵɵtext(52);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("formGroup", ctx_r1.partnerRequestApprovalForm);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.partnerRequestApprovalTarget);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.approvingPartnerRequestId !== null);
    i0.ɵɵadvance(14);
    i0.ɵɵproperty("ngForOf", ctx_r1.catalogCities);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", !ctx_r1.catalogCities.length && !ctx_r1.loadingCatalogCities);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.loadingCatalogCities);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Sconto utente ", ctx_r1.partnerRequestApprovalForm.controls.applyTo.value === "bundle" ? "citt\u00E0" : "luogo", " (%)");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("Incasso struttura ", ctx_r1.partnerRequestApprovalForm.controls.applyTo.value === "bundle" ? "citt\u00E0" : "luogo", " (EUR)");
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("disabled", ctx_r1.approvingPartnerRequestId !== null);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.previewingPartnerRequestId === (ctx_r1.partnerRequestApprovalTarget == null ? null : ctx_r1.partnerRequestApprovalTarget.id));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.previewingPartnerRequestId === (ctx_r1.partnerRequestApprovalTarget == null ? null : ctx_r1.partnerRequestApprovalTarget.id) ? "Apro anteprima..." : "Anteprima PDF", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.approvingPartnerRequestId !== null || ctx_r1.partnerRequestApprovalForm.invalid);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.approvingPartnerRequestId !== null ? "Invio approvazione..." : "Approva e invia", " ");
} }
function AdminDashboardComponent_div_3_ng_template_45_p_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, " Codice: ");
    i0.ɵɵelementStart(2, "code");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4, " - Struttura: ");
    i0.ɵɵelementStart(5, "strong");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.editingDiscountCode.code);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.editingDiscountCode.structureName);
} }
function AdminDashboardComponent_div_3_ng_template_45_mat_option_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 131);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r123 = ctx.$implicit;
    i0.ɵɵproperty("value", city_r123.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(city_r123.name);
} }
function AdminDashboardComponent_div_3_ng_template_45_p_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 95);
    i0.ɵɵtext(1, " Nessuna citt\u00E0 disponibile. Crea prima una citt\u00E0 nella sezione catalogo. ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_45_div_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 132);
    i0.ɵɵelement(1, "mat-spinner", 329);
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_template_45_Template(rf, ctx) { if (rf & 1) {
    const _r122 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "h2", 250);
    i0.ɵɵtext(1, "Modifica codice sconto");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "form", 251);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_template_45_Template_form_ngSubmit_2_listener() { i0.ɵɵrestoreView(_r122); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.saveDiscountCodeEdit()); });
    i0.ɵɵelementStart(3, "div", 252);
    i0.ɵɵtemplate(4, AdminDashboardComponent_div_3_ng_template_45_p_4_Template, 7, 2, "p", 91);
    i0.ɵɵelementStart(5, "div", 318)(6, "label");
    i0.ɵɵtext(7, "Applicabile a");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "mat-radio-group", 319)(9, "mat-radio-button", 320);
    i0.ɵɵtext(10, "Luogo singolo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "mat-radio-button", 321);
    i0.ɵɵtext(12, "Pacchetto citt\u00E0");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(13, "mat-form-field", 62)(14, "mat-label");
    i0.ɵɵtext(15, "Citt\u00E0 applicabili");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "mat-select", 322);
    i0.ɵɵtemplate(17, AdminDashboardComponent_div_3_ng_template_45_mat_option_17_Template, 2, 2, "mat-option", 130);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "mat-hint");
    i0.ɵɵtext(19, "Seleziona una o piu citt\u00E0");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(20, AdminDashboardComponent_div_3_ng_template_45_p_20_Template, 2, 0, "p", 91)(21, AdminDashboardComponent_div_3_ng_template_45_div_21_Template, 2, 0, "div", 126);
    i0.ɵɵelementStart(22, "mat-form-field", 62)(23, "mat-label");
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(25, "input", 323);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "mat-form-field", 62)(27, "mat-label");
    i0.ɵɵtext(28);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(29, "input", 324);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "mat-form-field", 62)(31, "mat-label");
    i0.ɵɵtext(32, "Scadenza");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(33, "input", 325, 51);
    i0.ɵɵelementStart(35, "button", 326);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_45_Template_button_click_35_listener() { i0.ɵɵrestoreView(_r122); const editDiscountExpiresInput_r124 = i0.ɵɵreference(34); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openNativeDateTimePicker(editDiscountExpiresInput_r124)); });
    i0.ɵɵelement(36, "span", 327);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "mat-hint");
    i0.ɵɵtext(38, "Seleziona data e ora");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(39, "div", 268)(40, "button", 269);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_template_45_Template_button_click_40_listener() { i0.ɵɵrestoreView(_r122); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeEditDiscountCodeDialog()); });
    i0.ɵɵtext(41, " Annulla ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "button", 328);
    i0.ɵɵtext(43);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("formGroup", ctx_r1.discountCodeEditForm);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.editingDiscountCode);
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("ngForOf", ctx_r1.catalogCities);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", !ctx_r1.catalogCities.length && !ctx_r1.loadingCatalogCities);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.loadingCatalogCities);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Sconto utente ", ctx_r1.discountCodeEditScopeLabel, " (%)");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("Incasso struttura ", ctx_r1.discountCodeEditScopeLabel, " (EUR)");
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("disabled", ctx_r1.updatingDiscountCode);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.updatingDiscountCode || ctx_r1.discountCodeEditForm.invalid);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.updatingDiscountCode ? "Salvataggio..." : "Salva modifiche", " ");
} }
function AdminDashboardComponent_div_3_ng_container_47_section_14_mat_error_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Inserisci un CAP valido a 5 cifre");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_47_section_14_Template(rf, ctx) { if (rf & 1) {
    const _r126 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 118)(1, "h3");
    i0.ɵɵtext(2, "Nuova struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Inserisci nome struttura, via, civico, citt\u00E0 e CAP. I codici sconto si gestiscono nella sezione dedicata.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "form", 61);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_container_47_section_14_Template_form_ngSubmit_5_listener() { i0.ɵɵrestoreView(_r126); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.registerStructure()); });
    i0.ɵɵelementStart(6, "mat-form-field", 62)(7, "mat-label");
    i0.ɵɵtext(8, "Nome struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "input", 330);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 331)(11, "mat-form-field", 332)(12, "mat-label");
    i0.ɵɵtext(13, "Via/Piazza");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(14, "input", 333);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "mat-form-field", 62)(16, "mat-label");
    i0.ɵɵtext(17, "Civico");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(18, "input", 334);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "mat-form-field", 62)(20, "mat-label");
    i0.ɵɵtext(21, "CAP");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(22, "input", 335);
    i0.ɵɵtemplate(23, AdminDashboardComponent_div_3_ng_container_47_section_14_mat_error_23_Template, 2, 0, "mat-error", 78);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "mat-form-field", 62)(25, "mat-label");
    i0.ɵɵtext(26, "Citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(27, "input", 336);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "mat-form-field", 62)(29, "mat-label");
    i0.ɵɵtext(30, "Provincia (opzionale)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(31, "input", 337);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "mat-form-field", 62)(33, "mat-label");
    i0.ɵɵtext(34, "Nazione (opzionale)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(35, "input", 338);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(36, "button", 65);
    i0.ɵɵtext(37);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("formGroup", ctx_r1.structureForm);
    i0.ɵɵadvance(18);
    i0.ɵɵproperty("ngIf", ctx_r1.structureForm.controls.postalCode.hasError("pattern"));
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("disabled", ctx_r1.creatingStructure);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.creatingStructure ? "Salvataggio..." : "Registra struttura", " ");
} }
function AdminDashboardComponent_div_3_ng_container_47_section_15_mat_error_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, " Inserisci un CAP valido a 5 cifre ");
    i0.ɵɵelementEnd();
} }
function AdminDashboardComponent_div_3_ng_container_47_section_15_Template(rf, ctx) { if (rf & 1) {
    const _r127 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 118)(1, "h3");
    i0.ɵɵtext(2, "Modifica struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Aggiorna nome e indirizzo. Il codice invito resta invariato.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "form", 61);
    i0.ɵɵlistener("ngSubmit", function AdminDashboardComponent_div_3_ng_container_47_section_15_Template_form_ngSubmit_5_listener() { i0.ɵɵrestoreView(_r127); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateStructure()); });
    i0.ɵɵelementStart(6, "mat-form-field", 62)(7, "mat-label");
    i0.ɵɵtext(8, "Nome struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "input", 330);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 331)(11, "mat-form-field", 332)(12, "mat-label");
    i0.ɵɵtext(13, "Via/Piazza");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(14, "input", 333);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "mat-form-field", 62)(16, "mat-label");
    i0.ɵɵtext(17, "Civico");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(18, "input", 334);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "mat-form-field", 62)(20, "mat-label");
    i0.ɵɵtext(21, "CAP");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(22, "input", 335);
    i0.ɵɵtemplate(23, AdminDashboardComponent_div_3_ng_container_47_section_15_mat_error_23_Template, 2, 0, "mat-error", 78);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "mat-form-field", 62)(25, "mat-label");
    i0.ɵɵtext(26, "Citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(27, "input", 336);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "mat-form-field", 62)(29, "mat-label");
    i0.ɵɵtext(30, "Provincia (opzionale)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(31, "input", 337);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "mat-form-field", 62)(33, "mat-label");
    i0.ɵɵtext(34, "Nazione (opzionale)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(35, "input", 338);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(36, "div", 180)(37, "button", 65);
    i0.ɵɵtext(38);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "button", 307);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_47_section_15_Template_button_click_39_listener() { i0.ɵɵrestoreView(_r127); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.cancelStructureEdit()); });
    i0.ɵɵtext(40, " Annulla ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("formGroup", ctx_r1.structureEditForm);
    i0.ɵɵadvance(18);
    i0.ɵɵproperty("ngIf", ctx_r1.structureEditForm.controls.postalCode.hasError("pattern"));
    i0.ɵɵadvance(14);
    i0.ɵɵproperty("disabled", !ctx_r1.canSaveStructureEdit);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.updatingStructure ? "Salvataggio..." : "Salva modifiche struttura", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.updatingStructure);
} }
function AdminDashboardComponent_div_3_ng_container_47_tr_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 339);
    i0.ɵɵelement(2, "mat-spinner", 99);
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_47_tr_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 340);
    i0.ɵɵtext(2, "Nessuna struttura registrata.");
    i0.ɵɵelementEnd()();
} }
function AdminDashboardComponent_div_3_ng_container_47_ng_container_37_tr_1_div_7_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 345)(1, "code");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "small");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const discountCode_r129 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(6);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(discountCode_r129.code);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Scade: ", ctx_r1.formatDateTime(discountCode_r129.expiresAt), "");
} }
function AdminDashboardComponent_div_3_ng_container_47_ng_container_37_tr_1_div_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 343);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_47_ng_container_37_tr_1_div_7_div_1_Template, 5, 2, "div", 344);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const structure_r130 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.structureCodes(structure_r130.id));
} }
function AdminDashboardComponent_div_3_ng_container_47_ng_container_37_tr_1_ng_template_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, "-");
} }
function AdminDashboardComponent_div_3_ng_container_47_ng_container_37_tr_1_Template(rf, ctx) { if (rf & 1) {
    const _r128 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "td");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "td");
    i0.ɵɵtemplate(7, AdminDashboardComponent_div_3_ng_container_47_ng_container_37_tr_1_div_7_Template, 2, 1, "div", 341)(8, AdminDashboardComponent_div_3_ng_container_47_ng_container_37_tr_1_ng_template_8_Template, 1, 0, "ng-template", null, 52, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td")(11, "button", 342);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_47_ng_container_37_tr_1_Template_button_click_11_listener() { const structure_r130 = i0.ɵɵrestoreView(_r128).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.openUsersForStructure(structure_r130)); });
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "td");
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "td");
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "td")(18, "button", 246);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_47_ng_container_37_tr_1_Template_button_click_18_listener() { const structure_r130 = i0.ɵɵrestoreView(_r128).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.editStructure(structure_r130)); });
    i0.ɵɵtext(19, " Modifica ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const structure_r130 = ctx.$implicit;
    const noStructureCodes_r131 = i0.ɵɵreference(9);
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(structure_r130.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatStructureAddress(structure_r130));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.structureCodes(structure_r130.id).length)("ngIfElse", noStructureCodes_r131);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", structure_r130.usersCount <= 0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", structure_r130.usersCount, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatCurrency(structure_r130.totalStructureEarnings));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatDateTime(structure_r130.createdAt));
} }
function AdminDashboardComponent_div_3_ng_container_47_ng_container_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, AdminDashboardComponent_div_3_ng_container_47_ng_container_37_tr_1_Template, 20, 8, "tr", 101);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.structures);
} }
function AdminDashboardComponent_div_3_ng_container_47_Template(rf, ctx) { if (rf & 1) {
    const _r125 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "mat-card", 88)(2, "div", 89)(3, "div")(4, "h2");
    i0.ɵɵtext(5, "Lista strutture");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 90);
    i0.ɵɵtext(7, "Gestisci dati struttura. I codici invito/sconto sono gestiti nella sezione dedicata.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 113)(9, "button", 114);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_ng_container_47_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r125); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleStructureSection()); });
    i0.ɵɵelementStart(10, "span", 115);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "span");
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵtemplate(14, AdminDashboardComponent_div_3_ng_container_47_section_14_Template, 38, 4, "section", 116)(15, AdminDashboardComponent_div_3_ng_container_47_section_15_Template, 41, 5, "section", 116);
    i0.ɵɵelementStart(16, "div", 96)(17, "table", 195)(18, "thead")(19, "tr")(20, "th");
    i0.ɵɵtext(21, "Struttura");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "th");
    i0.ɵɵtext(23, "Indirizzo");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "th");
    i0.ɵɵtext(25, "Codici sconto");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "th");
    i0.ɵɵtext(27, "Utenti associati");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "th");
    i0.ɵɵtext(29, "Guadagno maturato");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "th");
    i0.ɵɵtext(31, "Creata il");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "th");
    i0.ɵɵtext(33, "Azioni");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(34, "tbody");
    i0.ɵɵtemplate(35, AdminDashboardComponent_div_3_ng_container_47_tr_35_Template, 3, 0, "tr", 78)(36, AdminDashboardComponent_div_3_ng_container_47_tr_36_Template, 3, 0, "tr", 78)(37, AdminDashboardComponent_div_3_ng_container_47_ng_container_37_Template, 2, 1, "ng-container", 78);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(9);
    i0.ɵɵclassProp("active", ctx_r1.showStructureSection);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.showStructureSection ? "-" : "+");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.showStructureSection ? "Chiudi aggiunta struttura" : "Aggiungi struttura");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.showStructureSection);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.editingStructureId);
    i0.ɵɵadvance(20);
    i0.ɵɵproperty("ngIf", ctx_r1.loadingStructures);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.structures.length && !ctx_r1.loadingStructures);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.loadingStructures);
} }
function AdminDashboardComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 66)(1, "aside", 67)(2, "div", 68)(3, "div", 69);
    i0.ɵɵelement(4, "img", 70);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div")(6, "strong");
    i0.ɵɵtext(7, "Walk Around");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p");
    i0.ɵɵtext(9, "Dashboard");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(10, AdminDashboardComponent_div_3_nav_10_Template, 2, 1, "nav", 71);
    i0.ɵɵelementStart(11, "div", 72)(12, "span");
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(14, AdminDashboardComponent_div_3_button_14_Template, 2, 0, "button", 73);
    i0.ɵɵelementStart(15, "button", 74);
    i0.ɵɵlistener("click", function AdminDashboardComponent_div_3_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.logout()); });
    i0.ɵɵtext(16, "Logout");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(17, "main", 75);
    i0.ɵɵtemplate(18, AdminDashboardComponent_div_3_header_18_Template, 10, 3, "header", 76)(19, AdminDashboardComponent_div_3_mat_card_19_Template, 5, 0, "mat-card", 77)(20, AdminDashboardComponent_div_3_ng_container_20_Template, 22, 5, "ng-container", 78)(21, AdminDashboardComponent_div_3_ng_container_21_Template, 51, 7, "ng-container", 78)(22, AdminDashboardComponent_div_3_ng_container_22_Template, 55, 18, "ng-container", 78)(23, AdminDashboardComponent_div_3_ng_container_23_Template, 21, 6, "ng-container", 78)(24, AdminDashboardComponent_div_3_ng_container_24_Template, 56, 13, "ng-container", 78)(25, AdminDashboardComponent_div_3_ng_container_25_Template, 73, 13, "ng-container", 78)(26, AdminDashboardComponent_div_3_ng_container_26_Template, 65, 11, "ng-container", 78)(27, AdminDashboardComponent_div_3_ng_container_27_Template, 89, 23, "ng-container", 78)(28, AdminDashboardComponent_div_3_ng_container_28_Template, 28, 10, "ng-container", 78)(29, AdminDashboardComponent_div_3_ng_template_29_Template, 45, 11, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor)(31, AdminDashboardComponent_div_3_ng_template_31_Template, 17, 9, "ng-template", null, 1, i0.ɵɵtemplateRefExtractor)(33, AdminDashboardComponent_div_3_ng_template_33_Template, 45, 11, "ng-template", null, 2, i0.ɵɵtemplateRefExtractor)(35, AdminDashboardComponent_div_3_ng_template_35_Template, 96, 20, "ng-template", null, 3, i0.ɵɵtemplateRefExtractor)(37, AdminDashboardComponent_div_3_ng_template_37_Template, 11, 3, "ng-template", null, 4, i0.ɵɵtemplateRefExtractor)(39, AdminDashboardComponent_div_3_ng_template_39_Template, 28, 12, "ng-template", null, 5, i0.ɵɵtemplateRefExtractor)(41, AdminDashboardComponent_div_3_ng_template_41_Template, 55, 11, "ng-template", null, 6, i0.ɵɵtemplateRefExtractor)(43, AdminDashboardComponent_div_3_ng_template_43_Template, 53, 13, "ng-template", null, 7, i0.ɵɵtemplateRefExtractor)(45, AdminDashboardComponent_div_3_ng_template_45_Template, 44, 10, "ng-template", null, 8, i0.ɵɵtemplateRefExtractor)(47, AdminDashboardComponent_div_3_ng_container_47_Template, 38, 9, "ng-container", 78);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("ngIf", ctx_r1.canAccessDashboard && ctx_r1.visibleSections.length);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.currentEmail);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isImpersonating);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r1.activeSection === "users");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.canAccessDashboard);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isFacilityManager && ctx_r1.activeSection === "users");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isFacilityManager && ctx_r1.activeSection === "payments");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canManageUsers && ctx_r1.activeSection === "users");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canViewDiscountCodes && ctx_r1.activeSection === "discounts");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canManageUsers && ctx_r1.activeSection === "partnerRequests");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canManageUsers && ctx_r1.activeSection === "payments");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canManagePayPal && ctx_r1.activeSection === "paypal");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canManageGptTranslations && ctx_r1.activeSection === "gptTranslations");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canManageCatalog && ctx_r1.activeSection === "catalog");
    i0.ɵɵadvance(19);
    i0.ɵɵproperty("ngIf", ctx_r1.canManageUsers && ctx_r1.activeSection === "structures");
} }
export class AdminDashboardComponent {
    constructor(formBuilder, auth, dialog, router, route, snackBar) {
        this.formBuilder = formBuilder;
        this.auth = auth;
        this.dialog = dialog;
        this.router = router;
        this.route = route;
        this.snackBar = snackBar;
        this.noStructureValue = '__none__';
        this.fixedCreateCityRegion = 'Sicilia';
        this.contentLanguages = [
            { code: 'en', label: 'Inglese' },
            { code: 'fr', label: 'Francese' },
            { code: 'es', label: 'Spagnolo' }
        ];
        this.poiCategoryOptions = [
            'Monumento',
            'Museo',
            'Archeologia',
            'Cultura',
            'Chiesa',
            'Palazzo',
            'Castello',
            'Piazza',
            'Quartiere',
            'Mercato',
            'Natura',
            'Parco',
            'Belvedere',
            'Spiaggia',
            'Teatro',
            'Galleria',
            'Esperienza'
        ];
        this.sections = [
            { id: 'users', label: 'Utenti' },
            { id: 'structures', label: 'Strutture' },
            { id: 'discounts', label: 'Codici invito/sconto' },
            { id: 'partnerRequests', label: 'Richieste partner' },
            { id: 'payments', label: 'Pagamenti' },
            { id: 'paypal', label: 'PayPal' },
            { id: 'gptTranslations', label: 'Traduzioni GPT' },
            { id: 'catalog', label: 'Città e Punti interesse' }
        ];
        this.managerSections = [
            { id: 'users', label: 'Utenti associati' },
            { id: 'discounts', label: 'Codici invito/sconto' },
            { id: 'payments', label: 'Pagamenti' }
        ];
        this.authChecked = false;
        this.isAuthenticated = false;
        this.activeSection = 'users';
        this.showInviteSection = false;
        this.showCreateUserSection = false;
        this.showStructureSection = false;
        this.selectedUsersStructureFilterId = null;
        this.selectedPaymentsStructureId = '';
        this.editingStructureId = null;
        this.catalogTab = 'cities';
        this.loggingIn = false;
        this.inviting = false;
        this.creatingUser = false;
        this.loadingUsers = false;
        this.loadingStructures = false;
        this.loadingAssociatedUsers = false;
        this.loadingPayments = false;
        this.loadingPartnerRequests = false;
        this.loadingPayPalSettings = false;
        this.loadingOpenAiTranslationSettings = false;
        this.loadingOpenAiTranslationStatus = false;
        this.creatingStructure = false;
        this.updatingStructure = false;
        this.loadingDiscountCodes = false;
        this.creatingDiscountCode = false;
        this.updatingDiscountCode = false;
        this.savingPayPalSettings = false;
        this.savingOpenAiTranslationSettings = false;
        this.bulkTranslatingPois = false;
        this.testingPayPalSettings = false;
        this.loadingCatalogCities = false;
        this.loadingCatalogPois = false;
        this.savingCatalogCity = false;
        this.savingCatalogPoi = false;
        this.uploadingCatalogAudio = false;
        this.uploadingCatalogCityImage = false;
        this.uploadingCatalogImage = false;
        this.uploadingCatalogPoiTranslationAudio = { en: false, fr: false, es: false };
        this.uploadingCatalogCityEditImage = false;
        this.uploadingCatalogPoiEditImage = false;
        this.uploadingCatalogPoiEditAudio = false;
        this.uploadingCatalogPoiEditTranslationAudio = { en: false, fr: false, es: false };
        this.deletingCatalogCityId = null;
        this.deletingCatalogPoiId = null;
        this.savingUserId = null;
        this.savingDiscountCodeId = null;
        this.deletingDiscountCodeId = null;
        this.resettingPasswordUserId = null;
        this.deletingUserId = null;
        this.impersonatingUserId = null;
        this.translatingPoiId = null;
        this.lastInvite = null;
        this.users = [];
        this.structures = [];
        this.discountCodes = [];
        this.discountCodesByStructureId = {};
        this.discountCodeGroups = [];
        this.associatedUsers = [];
        this.payments = [];
        this.partnerRequests = [];
        this.payPalSettings = null;
        this.openAiTranslationSettings = null;
        this.openAiTranslationStatusRows = [];
        this.selectedGptTranslationPoiId = '';
        this.gptTranslationProgressTotal = 0;
        this.gptTranslationProgressDone = 0;
        this.gptTranslationUsage = {
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0
        };
        this.gptTranslationLog = [];
        this.paymentsSummary = {
            totalPayments: 0,
            totalCollected: 0,
            totalDiscountAmount: 0,
            totalStructureEarnings: 0
        };
        this.catalogCities = [];
        this.catalogPois = [];
        this.selectedCatalogCityId = '';
        this.editingCatalogCityId = null;
        this.editingCatalogPoiId = null;
        this.partnerRequestApprovalTarget = null;
        this.approvingPartnerRequestId = null;
        this.rejectingPartnerRequestId = null;
        this.previewingPartnerRequestId = null;
        this.lastLoadedCatalogPoisCityId = '';
        this.catalogPoisRequestToken = 0;
        this.openAiTranslationStatusRequestToken = 0;
        this.hasLoadedCatalogCitiesOnce = false;
        this.mapPickerLoading = false;
        this.mapPickerResults = [];
        this.mapPickerSelectedLat = null;
        this.mapPickerSelectedLng = null;
        this.mapPickerMapReady = false;
        this.mapPickerTarget = null;
        this.mapPickerTargetLabel = '';
        this.editingCatalogCityIsDefault = false;
        this.poiMapInstance = null;
        this.poiMapMarker = null;
        this.audioDurationByUrl = {};
        this.pendingAudioDurationUrls = new Set();
        this.invalidAudioDurationUrls = new Set();
        this.maxCatalogAudioUploadBytes = 15 * 1024 * 1024;
        this.maxCatalogImageUploadBytes = 10 * 1024 * 1024;
        this.audioPlayerPoiName = '';
        this.audioPlayerFileName = '';
        this.audioPlayerUrl = '';
        this.structureInviteCodeDraftByUserId = {};
        this.editingDiscountCodeId = null;
        this.italianDateTimeFormatter = new Intl.DateTimeFormat('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        this.italianCurrencyFormatter = new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        this.loginForm = this.formBuilder.nonNullable.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
        this.inviteForm = this.formBuilder.nonNullable.group({
            firstName: ['', [Validators.required, Validators.maxLength(120)]],
            lastName: ['', [Validators.required, Validators.maxLength(120)]],
            email: ['', [Validators.required, Validators.email]],
            role: ['facility_manager', [Validators.required]],
            structureId: [this.noStructureValue]
        });
        this.createUserForm = this.formBuilder.nonNullable.group({
            firstName: ['', [Validators.required, Validators.maxLength(120)]],
            lastName: ['', [Validators.required, Validators.maxLength(120)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(120)]],
            role: ['user', [Validators.required]],
            structureId: [this.noStructureValue]
        });
        this.structureForm = this.formBuilder.nonNullable.group({
            name: ['', [Validators.required, Validators.maxLength(160)]],
            street: ['', [Validators.required, Validators.maxLength(160)]],
            streetNumber: ['', [Validators.required, Validators.maxLength(20)]],
            city: ['', [Validators.required, Validators.maxLength(120)]],
            postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
            province: ['', [Validators.maxLength(80)]],
            country: ['Italia', [Validators.maxLength(80)]]
        });
        this.structureEditForm = this.formBuilder.nonNullable.group({
            name: ['', [Validators.required, Validators.maxLength(160)]],
            street: ['', [Validators.required, Validators.maxLength(160)]],
            streetNumber: ['', [Validators.required, Validators.maxLength(20)]],
            city: ['', [Validators.required, Validators.maxLength(120)]],
            postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
            province: ['', [Validators.maxLength(80)]],
            country: ['Italia', [Validators.maxLength(80)]]
        });
        this.discountCodeCreateForm = this.formBuilder.nonNullable.group({
            structureId: ['', [Validators.required]],
            applyTo: ['bundle', [Validators.required]],
            cityIds: [[], [Validators.required]],
            code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[A-Z0-9]{6}$/)]],
            userDiscountPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
            structureFixedAmount: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
            expiresAt: ['', [Validators.required]]
        });
        this.discountCodeEditForm = this.formBuilder.nonNullable.group({
            applyTo: ['bundle', [Validators.required]],
            cityIds: [[], [Validators.required]],
            userDiscountPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
            structureFixedAmount: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
            expiresAt: ['', [Validators.required]]
        });
        this.partnerRequestApprovalForm = this.formBuilder.nonNullable.group({
            applyTo: ['bundle', [Validators.required]],
            cityIds: [[], [Validators.required]],
            code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[A-Z0-9]{6}$/)]],
            userDiscountPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
            structureFixedAmount: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
            expiresAt: ['', [Validators.required]]
        });
        this.payPalForm = this.formBuilder.nonNullable.group({
            isEnabled: [false],
            mode: ['sandbox', [Validators.required]],
            clientId: ['', [Validators.maxLength(400)]],
            clientSecret: ['', [Validators.maxLength(400)]],
            merchantId: ['', [Validators.maxLength(180)]],
            merchantEmail: ['', [Validators.email, Validators.maxLength(180)]],
            brandName: ['Walk Around', [Validators.maxLength(127)]],
            webhookId: ['', [Validators.maxLength(180)]]
        });
        this.openAiTranslationSettingsForm = this.formBuilder.nonNullable.group({
            apiKey: ['', [Validators.maxLength(500)]],
            model: ['gpt-4o-mini', [Validators.required, Validators.maxLength(120)]]
        });
        this.gptTranslationForm = this.formBuilder.nonNullable.group({
            cityId: ['', [Validators.required]],
            targetLanguage: ['en', [Validators.required]],
            poiId: [''],
            overwrite: [false]
        });
        this.catalogCityForm = this.formBuilder.nonNullable.group({
            name: ['', [Validators.required, Validators.maxLength(120)]],
            region: [{ value: this.fixedCreateCityRegion, disabled: true }, [Validators.required, Validators.maxLength(120)]],
            bundlePrice: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
            heroImage: ['', [Validators.required, Validators.maxLength(500)]],
            translations: this.formBuilder.nonNullable.group({
                en: this.formBuilder.nonNullable.group({
                    name: ['', [Validators.maxLength(120)]]
                }),
                fr: this.formBuilder.nonNullable.group({
                    name: ['', [Validators.maxLength(120)]]
                }),
                es: this.formBuilder.nonNullable.group({
                    name: ['', [Validators.maxLength(120)]]
                })
            })
        });
        this.catalogPoiForm = this.formBuilder.nonNullable.group({
            cityId: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.maxLength(180)]],
            address: ['', [Validators.maxLength(240)]],
            lat: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
            lng: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
            category: [this.poiCategoryOptions[0], [Validators.required]],
            descriptionShort: ['', [Validators.required, Validators.maxLength(1000)]],
            descriptionLong: ['', [Validators.required, Validators.maxLength(10000)]],
            imageUrl: ['', [Validators.required, Validators.maxLength(500)]],
            audioUrl: ['', [Validators.maxLength(500)]],
            priceSingle: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
            durationSec: [60, [Validators.required, Validators.min(1), Validators.max(7200)]],
            translations: this.formBuilder.nonNullable.group({
                en: this.formBuilder.nonNullable.group({
                    descriptionShort: ['', [Validators.maxLength(1000)]],
                    descriptionLong: ['', [Validators.maxLength(10000)]],
                    audioUrl: ['', [Validators.maxLength(500)]]
                }),
                fr: this.formBuilder.nonNullable.group({
                    descriptionShort: ['', [Validators.maxLength(1000)]],
                    descriptionLong: ['', [Validators.maxLength(10000)]],
                    audioUrl: ['', [Validators.maxLength(500)]]
                }),
                es: this.formBuilder.nonNullable.group({
                    descriptionShort: ['', [Validators.maxLength(1000)]],
                    descriptionLong: ['', [Validators.maxLength(10000)]],
                    audioUrl: ['', [Validators.maxLength(500)]]
                })
            })
        });
        this.catalogCityEditForm = this.formBuilder.nonNullable.group({
            name: ['', [Validators.required, Validators.maxLength(120)]],
            region: ['', [Validators.required, Validators.maxLength(120)]],
            bundlePrice: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
            heroImage: ['', [Validators.required, Validators.maxLength(500)]],
            translations: this.formBuilder.nonNullable.group({
                en: this.formBuilder.nonNullable.group({
                    name: ['', [Validators.maxLength(120)]]
                }),
                fr: this.formBuilder.nonNullable.group({
                    name: ['', [Validators.maxLength(120)]]
                }),
                es: this.formBuilder.nonNullable.group({
                    name: ['', [Validators.maxLength(120)]]
                })
            })
        });
        this.catalogPoiEditForm = this.formBuilder.nonNullable.group({
            cityId: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.maxLength(180)]],
            address: ['', [Validators.maxLength(240)]],
            lat: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
            lng: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
            category: [this.poiCategoryOptions[0], [Validators.required]],
            descriptionShort: ['', [Validators.required, Validators.maxLength(1000)]],
            descriptionLong: ['', [Validators.required, Validators.maxLength(10000)]],
            imageUrl: ['', [Validators.required, Validators.maxLength(500)]],
            audioUrl: ['', [Validators.maxLength(500)]],
            priceSingle: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
            durationSec: [60, [Validators.required, Validators.min(1), Validators.max(7200)]],
            translations: this.formBuilder.nonNullable.group({
                en: this.formBuilder.nonNullable.group({
                    descriptionShort: ['', [Validators.maxLength(1000)]],
                    descriptionLong: ['', [Validators.maxLength(10000)]],
                    audioUrl: ['', [Validators.maxLength(500)]]
                }),
                fr: this.formBuilder.nonNullable.group({
                    descriptionShort: ['', [Validators.maxLength(1000)]],
                    descriptionLong: ['', [Validators.maxLength(10000)]],
                    audioUrl: ['', [Validators.maxLength(500)]]
                }),
                es: this.formBuilder.nonNullable.group({
                    descriptionShort: ['', [Validators.maxLength(1000)]],
                    descriptionLong: ['', [Validators.maxLength(10000)]],
                    audioUrl: ['', [Validators.maxLength(500)]]
                })
            })
        });
        this.poiMapSearchForm = this.formBuilder.nonNullable.group({
            query: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(220)]]
        });
    }
    ngOnInit() {
        this.showDashboardMessagesFromQuery();
        this.auth.ensureAuthenticated().subscribe((isAuthenticated) => {
            this.authChecked = true;
            this.isAuthenticated = isAuthenticated;
            if (isAuthenticated && this.canAccessDashboard) {
                this.syncDashboardDataForCurrentRole();
            }
        });
        this.inviteForm.controls.role.valueChanges.subscribe((role) => {
            if (role === 'admin') {
                this.inviteForm.controls.structureId.setValue(this.noStructureValue);
            }
        });
        this.createUserForm.controls.role.valueChanges.subscribe((role) => {
            if (role === 'admin') {
                this.createUserForm.controls.structureId.setValue(this.noStructureValue);
            }
        });
        this.discountCodeCreateForm.controls.code.valueChanges.subscribe((value) => {
            const normalized = this.normalizeStructureInviteCode(value || '');
            if (normalized !== value) {
                this.discountCodeCreateForm.controls.code.setValue(normalized, { emitEvent: false });
            }
        });
        this.partnerRequestApprovalForm.controls.code.valueChanges.subscribe((value) => {
            const normalized = this.normalizeStructureInviteCode(value || '');
            if (normalized !== value) {
                this.partnerRequestApprovalForm.controls.code.setValue(normalized, { emitEvent: false });
            }
        });
        this.startCreateCatalogCity();
        this.startCreateCatalogPoi();
    }
    get currentEmail() {
        return this.auth.user?.email || '';
    }
    get currentName() {
        const firstName = this.auth.user?.firstName || '';
        const lastName = this.auth.user?.lastName || '';
        return `${firstName} ${lastName}`.trim();
    }
    get currentUserId() {
        return this.auth.user?.id || '';
    }
    get currentRole() {
        return this.auth.user?.role || 'facility_manager';
    }
    get canManageUsers() {
        return this.isAuthenticated && this.auth.isAdmin;
    }
    get canAccessDashboard() {
        return this.isAuthenticated && (this.currentRole === 'admin' || this.currentRole === 'facility_manager');
    }
    get canViewDiscountCodes() {
        return this.canManageUsers || this.isFacilityManager;
    }
    get canManagePayPal() {
        return this.canManageUsers;
    }
    get canManageGptTranslations() {
        return this.canManageUsers;
    }
    get visibleSections() {
        if (this.canManageUsers) {
            return this.sections;
        }
        if (this.isFacilityManager) {
            return this.managerSections;
        }
        return [];
    }
    get isFacilityManager() {
        return this.isAuthenticated && this.currentRole === 'facility_manager';
    }
    get canSavePayPalSettings() {
        return this.canManagePayPal && !this.savingPayPalSettings && this.payPalForm.valid;
    }
    get canSaveOpenAiTranslationSettings() {
        return this.canManageGptTranslations && !this.savingOpenAiTranslationSettings && this.openAiTranslationSettingsForm.valid;
    }
    get selectedGptTranslationLanguageLabel() {
        const selected = this.gptTranslationForm.controls.targetLanguage.value;
        return this.contentLanguages.find((language) => language.code === selected)?.label || selected.toUpperCase();
    }
    get gptTranslationProgressPercent() {
        if (!this.gptTranslationProgressTotal) {
            return 0;
        }
        return Math.min(100, Math.round((this.gptTranslationProgressDone / this.gptTranslationProgressTotal) * 100));
    }
    get gptTranslationMissingCount() {
        return this.openAiTranslationStatusRows.filter((row) => !row.isComplete).length;
    }
    get gptTranslationCompleteCount() {
        return this.openAiTranslationStatusRows.filter((row) => row.isComplete).length;
    }
    get selectedGptTranslationPoi() {
        const selectedPoiId = this.gptTranslationForm.controls.poiId.value || this.selectedGptTranslationPoiId;
        if (!selectedPoiId) {
            return null;
        }
        return this.catalogPois.find((poi) => poi.id === selectedPoiId) || null;
    }
    get selectedGptTranslationPoiTargetFields() {
        const poi = this.selectedGptTranslationPoi;
        const language = this.gptTranslationForm.controls.targetLanguage.value;
        return poi?.translations?.[language] || {};
    }
    get canTranslateSelectedGptPoi() {
        return (this.canManageGptTranslations &&
            Boolean(this.openAiTranslationSettings?.hasApiKey) &&
            Boolean(this.selectedGptTranslationPoi) &&
            !this.loadingCatalogPois &&
            !this.loadingOpenAiTranslationStatus &&
            !this.bulkTranslatingPois &&
            !this.translatingPoiId);
    }
    get canTranslateMissingGptPois() {
        return (this.canManageGptTranslations &&
            Boolean(this.openAiTranslationSettings?.hasApiKey) &&
            Boolean(this.gptTranslationForm.controls.cityId.value) &&
            this.gptTranslationMissingCount > 0 &&
            !this.loadingOpenAiTranslationStatus &&
            !this.loadingCatalogPois &&
            !this.bulkTranslatingPois &&
            !this.translatingPoiId);
    }
    get payPalStatusLabel() {
        const status = this.payPalSettings?.lastVerificationStatus || 'incomplete';
        if (status === 'valid') {
            return 'Connessione valida';
        }
        if (status === 'invalid') {
            return 'Connessione non valida';
        }
        if (status === 'pending') {
            return 'Da verificare';
        }
        return 'Configurazione incompleta';
    }
    get isImpersonating() {
        return this.isAuthenticated && this.auth.isImpersonating;
    }
    get impersonatedByEmail() {
        return this.auth.session?.session.impersonatedBy?.email || '';
    }
    get totalUsers() {
        return this.usersForDisplay.length;
    }
    get totalStructures() {
        return this.structures.length;
    }
    get usersForDisplay() {
        if (!this.selectedUsersStructureFilterId) {
            return this.users;
        }
        return this.users.filter((user) => this.userHasStructureAssociation(user, this.selectedUsersStructureFilterId || ''));
    }
    get isUsersStructureFilterActive() {
        return !!this.selectedUsersStructureFilterId;
    }
    get usersStructureFilterName() {
        if (!this.selectedUsersStructureFilterId) {
            return '';
        }
        const structure = this.structures.find((item) => item.id === this.selectedUsersStructureFilterId);
        return structure?.name || this.selectedUsersStructureFilterId;
    }
    get totalAssociatedUsers() {
        return this.associatedUsers.length;
    }
    get totalPayments() {
        return this.paymentsSummary.totalPayments;
    }
    get totalPartnerRequests() {
        return this.partnerRequests.length;
    }
    get pendingPartnerRequests() {
        return this.partnerRequests.filter((request) => request.status === 'pending').length;
    }
    get approvedPartnerRequests() {
        return this.partnerRequests.filter((request) => request.status === 'approved').length;
    }
    get sentPartnerRequestPdfs() {
        return this.partnerRequests.filter((request) => request.pdfReleaseStatus === 'sent').length;
    }
    get totalStructureEarnings() {
        return this.paymentsSummary.totalStructureEarnings;
    }
    get managerStructureName() {
        return this.auth.user?.structureName || 'Nessuna struttura assegnata';
    }
    get managedStructureId() {
        return this.auth.user?.structureId || null;
    }
    get editingDiscountCode() {
        if (!this.editingDiscountCodeId) {
            return null;
        }
        return this.discountCodes.find((item) => item.id === this.editingDiscountCodeId) || null;
    }
    get discountCodeCreateScopeLabel() {
        return this.discountCodeCreateForm.controls.applyTo.value === 'bundle' ? 'città' : 'luogo';
    }
    get discountCodeEditScopeLabel() {
        return this.discountCodeEditForm.controls.applyTo.value === 'bundle' ? 'città' : 'luogo';
    }
    get isInviteStructureRequired() {
        return this.inviteForm.controls.role.value !== 'admin';
    }
    get isInviteStructureMissing() {
        if (!this.isInviteStructureRequired) {
            return false;
        }
        const selectedStructureId = this.inviteForm.controls.structureId.value;
        return !this.structures.length || !selectedStructureId || selectedStructureId === this.noStructureValue;
    }
    get canSubmitInvite() {
        if (this.inviting || this.inviteForm.invalid) {
            return false;
        }
        return !this.isInviteStructureMissing;
    }
    get isCreateUserStructureRequired() {
        return this.createUserForm.controls.role.value === 'facility_manager';
    }
    get isCreateUserStructureVisible() {
        return this.createUserForm.controls.role.value !== 'admin';
    }
    get isCreateUserStructureMissing() {
        if (!this.isCreateUserStructureRequired) {
            return false;
        }
        const selectedStructureId = this.createUserForm.controls.structureId.value;
        return !this.structures.length || !selectedStructureId || selectedStructureId === this.noStructureValue;
    }
    get canSubmitCreateUser() {
        if (this.creatingUser || this.createUserForm.invalid) {
            return false;
        }
        return !this.isCreateUserStructureMissing;
    }
    get canManageCatalog() {
        return this.canManageUsers;
    }
    get canSaveCatalogCity() {
        return this.canManageCatalog && !this.savingCatalogCity && !this.uploadingCatalogCityImage && this.catalogCityForm.valid;
    }
    get canSaveCatalogCityEdit() {
        return (this.canManageCatalog &&
            !!this.editingCatalogCityId &&
            !this.savingCatalogCity &&
            !this.uploadingCatalogCityEditImage &&
            this.catalogCityEditForm.valid);
    }
    get canSaveCatalogPoi() {
        return (this.canManageCatalog &&
            !this.savingCatalogPoi &&
            !this.uploadingCatalogAudio &&
            !this.uploadingCatalogImage &&
            !this.hasCatalogPoiTranslationAudioUploadInProgress('create') &&
            this.catalogPoiForm.valid);
    }
    get canSaveCatalogPoiEdit() {
        return (this.canManageCatalog &&
            !!this.editingCatalogPoiId &&
            !this.savingCatalogPoi &&
            !this.uploadingCatalogPoiEditImage &&
            !this.uploadingCatalogPoiEditAudio &&
            !this.hasCatalogPoiTranslationAudioUploadInProgress('edit') &&
            this.catalogPoiEditForm.valid);
    }
    get canSaveStructureEdit() {
        return this.canManageUsers && !!this.editingStructureId && !this.updatingStructure && this.structureEditForm.valid;
    }
    get hasPoiMapSelection() {
        return this.mapPickerSelectedLat !== null && this.mapPickerSelectedLng !== null;
    }
    selectSection(section) {
        if (!this.visibleSections.some((item) => item.id === section)) {
            return;
        }
        this.activeSection = section;
        if (section !== 'users') {
            this.showInviteSection = false;
            this.showCreateUserSection = false;
        }
        if (section !== 'structures') {
            this.showStructureSection = false;
            this.cancelStructureEdit();
        }
        if (section !== 'discounts') {
            this.savingDiscountCodeId = null;
            this.deletingDiscountCodeId = null;
            this.closeCreateDiscountCodeDialog();
            this.closeEditDiscountCodeDialog();
        }
        if (section !== 'partnerRequests') {
            this.closePartnerRequestApprovalDialog();
            this.rejectingPartnerRequestId = null;
            this.previewingPartnerRequestId = null;
        }
        if (section !== 'catalog') {
            this.closeCreateCatalogCityDialog();
            this.closeCreateCatalogPoiDialog();
        }
        if (section !== 'gptTranslations') {
            this.translatingPoiId = null;
        }
        if (section === 'payments' && this.canAccessDashboard) {
            this.loadPayments();
        }
        else if (section === 'partnerRequests' && this.canManageUsers) {
            this.loadPartnerRequests();
        }
        else if (section === 'paypal' && this.canManagePayPal) {
            this.loadPayPalSettings();
        }
        else if (section === 'gptTranslations' && this.canManageGptTranslations) {
            this.ensureGptTranslationsLoaded();
        }
        else if (section === 'discounts' && this.canViewDiscountCodes) {
            this.loadDiscountCodes();
        }
        else if (section === 'structures' && this.canManageUsers) {
            this.loadDiscountCodes();
        }
        else if (section === 'catalog' && this.canManageCatalog) {
            this.ensureCatalogLoaded();
        }
        else {
            this.closeCreateCatalogCityDialog();
            this.closeCreateCatalogPoiDialog();
            this.closeCatalogCityEditDialog();
            this.closeCatalogPoiEditDialog();
            this.closePoiMapPicker();
        }
    }
    ensureActiveSectionAllowed() {
        if (!this.visibleSections.length) {
            return;
        }
        if (this.visibleSections.some((section) => section.id === this.activeSection)) {
            return;
        }
        this.activeSection = this.visibleSections[0].id;
    }
    syncDashboardDataForCurrentRole() {
        this.ensureActiveSectionAllowed();
        this.selectedUsersStructureFilterId = null;
        if (!this.canAccessDashboard) {
            return;
        }
        if (this.canManageUsers) {
            this.refreshAll();
            return;
        }
        if (this.isFacilityManager) {
            this.loadAssociatedUsers();
            this.loadPayments();
            this.loadDiscountCodes();
        }
    }
    selectCatalogTab(tab) {
        this.catalogTab = tab;
        if (tab === 'pois') {
            this.ensureCatalogLoaded();
        }
    }
    toggleInviteSection() {
        this.showInviteSection = !this.showInviteSection;
        if (this.showInviteSection) {
            this.showCreateUserSection = false;
        }
    }
    toggleCreateUserSection() {
        this.showCreateUserSection = !this.showCreateUserSection;
        if (this.showCreateUserSection) {
            this.showInviteSection = false;
        }
    }
    toggleStructureSection() {
        this.showStructureSection = !this.showStructureSection;
        if (this.showStructureSection) {
            this.cancelStructureEdit();
        }
    }
    toggleCatalogCityCreateSection() {
        if (!this.canManageCatalog || !this.createCatalogCityDialog) {
            return;
        }
        this.startCreateCatalogCity();
        this.createCatalogCityDialogRef?.close();
        this.createCatalogCityDialogRef = this.dialog.open(this.createCatalogCityDialog, {
            width: '900px',
            maxWidth: '95vw'
        });
        this.createCatalogCityDialogRef.afterClosed().subscribe(() => {
            this.createCatalogCityDialogRef = undefined;
            this.uploadingCatalogCityImage = false;
            this.startCreateCatalogCity();
        });
    }
    toggleCatalogPoiCreateSection() {
        if (!this.canManageCatalog || !this.createCatalogPoiDialog) {
            return;
        }
        this.ensureCatalogLoaded();
        this.startCreateCatalogPoi();
        this.createCatalogPoiDialogRef?.close();
        this.createCatalogPoiDialogRef = this.dialog.open(this.createCatalogPoiDialog, {
            width: '980px',
            maxWidth: '96vw'
        });
        this.createCatalogPoiDialogRef.afterClosed().subscribe(() => {
            this.createCatalogPoiDialogRef = undefined;
            this.uploadingCatalogImage = false;
            this.uploadingCatalogAudio = false;
            this.startCreateCatalogPoi();
        });
    }
    closeCreateCatalogCityDialog() {
        this.createCatalogCityDialogRef?.close();
        this.createCatalogCityDialogRef = undefined;
        this.uploadingCatalogCityImage = false;
        this.startCreateCatalogCity();
    }
    closeCreateCatalogPoiDialog() {
        this.createCatalogPoiDialogRef?.close();
        this.createCatalogPoiDialogRef = undefined;
        this.uploadingCatalogImage = false;
        this.uploadingCatalogAudio = false;
        this.startCreateCatalogPoi();
    }
    openPoiMapPicker(target) {
        if (!this.canManageCatalog || !this.poiMapPickerDialog) {
            return;
        }
        const targetForm = target === 'edit' ? this.catalogPoiEditForm : this.catalogPoiForm;
        const targetLat = Number(targetForm.controls.lat.value);
        const targetLng = Number(targetForm.controls.lng.value);
        this.mapPickerTarget = target;
        this.mapPickerResults = [];
        this.mapPickerLoading = false;
        this.mapPickerMapReady = false;
        this.mapPickerTargetLabel = '';
        this.mapPickerSelectedLat = Number.isFinite(targetLat) ? targetLat : 41.902782;
        this.mapPickerSelectedLng = Number.isFinite(targetLng) ? targetLng : 12.496366;
        this.poiMapSearchForm.reset({ query: '' });
        this.poiMapPickerDialogRef?.close();
        this.poiMapPickerDialogRef = this.dialog.open(this.poiMapPickerDialog, {
            width: '960px',
            maxWidth: '96vw'
        });
        this.poiMapPickerDialogRef.afterOpened().subscribe(() => {
            void this.initializePoiMap();
        });
        this.poiMapPickerDialogRef.afterClosed().subscribe(() => {
            this.destroyPoiMap();
        });
    }
    closePoiMapPicker() {
        this.poiMapPickerDialogRef?.close();
        this.poiMapPickerDialogRef = undefined;
        this.mapPickerTarget = null;
        this.mapPickerLoading = false;
        this.mapPickerMapReady = false;
        this.mapPickerResults = [];
        this.mapPickerTargetLabel = '';
        this.mapPickerSelectedLat = null;
        this.mapPickerSelectedLng = null;
        this.destroyPoiMap();
        this.poiMapSearchForm.reset({ query: '' });
    }
    searchPoiMap() {
        if (this.poiMapSearchForm.invalid || this.mapPickerLoading) {
            this.poiMapSearchForm.markAllAsTouched();
            return;
        }
        const query = this.poiMapSearchForm.controls.query.value.trim();
        if (!query) {
            return;
        }
        const endpoint = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=10&accept-language=it&q=${encodeURIComponent(query)}`;
        this.mapPickerLoading = true;
        fetch(endpoint, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        })
            .then((response) => {
            if (!response.ok) {
                throw new Error('Ricerca mappa non disponibile');
            }
            return response.json();
        })
            .then((rows) => {
            this.mapPickerResults = (rows || [])
                .map((row) => {
                const lat = Number(row.lat);
                const lng = Number(row.lon);
                if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                    return null;
                }
                return {
                    displayName: (row.display_name || '').trim() || `${lat}, ${lng}`,
                    lat,
                    lng,
                    osmUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`
                };
            })
                .filter((row) => !!row);
            if (this.mapPickerResults.length) {
                this.selectPoiMapResult(this.mapPickerResults[0]);
            }
        })
            .catch((error) => {
            this.mapPickerResults = [];
            const message = error?.message || 'Errore durante la ricerca del luogo';
            this.snackBar.open(message, 'Chiudi', { duration: 3500 });
        })
            .finally(() => {
            this.mapPickerLoading = false;
        });
    }
    selectPoiMapResult(result) {
        this.mapPickerTargetLabel = result.displayName;
        this.mapPickerSelectedLat = result.lat;
        this.mapPickerSelectedLng = result.lng;
        this.updatePoiMapMarker(result.lat, result.lng, true);
    }
    usePoiMapResult(result) {
        this.selectPoiMapResult(result);
        this.confirmPoiMapSelection();
    }
    confirmPoiMapSelection() {
        if (!this.hasPoiMapSelection) {
            return;
        }
        const selectedLat = Number(this.mapPickerSelectedLat);
        const selectedLng = Number(this.mapPickerSelectedLng);
        const targetForm = this.mapPickerTarget === 'edit' ? this.catalogPoiEditForm : this.catalogPoiForm;
        targetForm.controls.lat.setValue(selectedLat);
        targetForm.controls.lng.setValue(selectedLng);
        targetForm.controls.lat.markAsDirty();
        targetForm.controls.lng.markAsDirty();
        targetForm.controls.lat.markAsTouched();
        targetForm.controls.lng.markAsTouched();
        this.closePoiMapPicker();
        this.snackBar.open(`Coordinate impostate: ${selectedLat.toFixed(6)}, ${selectedLng.toFixed(6)}`, 'OK', { duration: 2400 });
    }
    login() {
        if (this.loginForm.invalid || this.loggingIn) {
            this.loginForm.markAllAsTouched();
            return;
        }
        this.loggingIn = true;
        const { email, password } = this.loginForm.getRawValue();
        this.auth.login(email, password).subscribe({
            next: () => {
                this.loggingIn = false;
                this.isAuthenticated = true;
                this.authChecked = true;
                this.loginForm.reset();
                if (this.canAccessDashboard) {
                    this.syncDashboardDataForCurrentRole();
                }
            },
            error: (error) => {
                this.loggingIn = false;
                const message = error?.error?.message || 'Login non riuscito';
                this.snackBar.open(message, 'Chiudi', { duration: 3200 });
            }
        });
    }
    invite() {
        if (!this.canManageUsers) {
            return;
        }
        if (this.inviteForm.invalid || this.inviting) {
            this.inviteForm.markAllAsTouched();
            return;
        }
        const { firstName, lastName, email, role, structureId } = this.inviteForm.getRawValue();
        if (role !== 'admin' && !this.structures.length) {
            this.inviteForm.controls.structureId.markAsTouched();
            this.snackBar.open('Devi prima registrare almeno una struttura per invitare un gestore', 'Chiudi', {
                duration: 3500
            });
            return;
        }
        const normalizedStructureId = structureId === this.noStructureValue ? undefined : structureId;
        if (role !== 'admin' && !normalizedStructureId) {
            this.inviteForm.controls.structureId.markAsTouched();
            this.snackBar.open('Per un gestore devi selezionare una struttura', 'Chiudi', { duration: 3200 });
            return;
        }
        this.inviting = true;
        this.auth.inviteUser(firstName, lastName, email, role, window.location.origin, normalizedStructureId).subscribe({
            next: (response) => {
                this.inviting = false;
                this.lastInvite = response;
                this.inviteForm.reset({
                    firstName: '',
                    lastName: '',
                    email: '',
                    role: 'facility_manager',
                    structureId: this.noStructureValue
                });
                this.showInviteSection = false;
                this.snackBar.open(`Invito inviato a ${this.displayName(response.firstName, response.lastName, response.email)}`, 'OK', {
                    duration: 3200
                });
                this.refreshAll();
            },
            error: (error) => {
                this.inviting = false;
                const message = error?.error?.message || 'Errore durante invio invito';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    createUser() {
        if (!this.canManageUsers) {
            return;
        }
        if (this.createUserForm.invalid || this.creatingUser) {
            this.createUserForm.markAllAsTouched();
            return;
        }
        const { firstName, lastName, email, password, role, structureId } = this.createUserForm.getRawValue();
        if (role === 'facility_manager' && !this.structures.length) {
            this.createUserForm.controls.structureId.markAsTouched();
            this.snackBar.open('Devi prima registrare almeno una struttura per creare un gestore', 'Chiudi', {
                duration: 3500
            });
            return;
        }
        const normalizedStructureId = structureId === this.noStructureValue ? undefined : structureId;
        if (role === 'facility_manager' && !normalizedStructureId) {
            this.createUserForm.controls.structureId.markAsTouched();
            this.snackBar.open('Per un gestore devi selezionare una struttura', 'Chiudi', { duration: 3200 });
            return;
        }
        const finalStructureId = role === 'admin' ? undefined : normalizedStructureId;
        this.creatingUser = true;
        this.auth
            .createUser(firstName.trim(), lastName.trim(), email.trim(), password, role, finalStructureId)
            .subscribe({
            next: (createdUser) => {
                this.creatingUser = false;
                this.createUserForm.reset({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    role: 'user',
                    structureId: this.noStructureValue
                });
                this.showCreateUserSection = false;
                this.snackBar.open(`Utente creato: ${this.displayName(createdUser.firstName, createdUser.lastName, createdUser.email)}`, 'OK', { duration: 3200 });
                this.refreshAll();
            },
            error: (error) => {
                this.creatingUser = false;
                const message = error?.error?.message || 'Errore creazione utente';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    loadUsers() {
        if (!this.canManageUsers || this.loadingUsers) {
            return;
        }
        this.loadingUsers = true;
        this.auth.listUsers().subscribe({
            next: (rows) => {
                this.loadingUsers = false;
                this.users = rows.map((row) => ({
                    ...row,
                    associatedStructures: Array.isArray(row.associatedStructures) ? row.associatedStructures : [],
                    unlockedCities: Array.isArray(row.unlockedCities) ? row.unlockedCities : [],
                    unlockedPois: Array.isArray(row.unlockedPois) ? row.unlockedPois : [],
                    unlockedCitiesCount: Number(row.unlockedCitiesCount || 0),
                    unlockedPoisCount: Number(row.unlockedPoisCount || 0)
                }));
            },
            error: (error) => {
                this.loadingUsers = false;
                const message = error?.error?.message || 'Errore caricamento utenti';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    loadStructures() {
        if (!this.canManageUsers || this.loadingStructures) {
            return;
        }
        this.loadingStructures = true;
        this.auth.listStructures().subscribe({
            next: (rows) => {
                this.loadingStructures = false;
                this.structures = rows;
                const selectedDiscountStructureId = this.discountCodeCreateForm.controls.structureId.value;
                if (!selectedDiscountStructureId && rows.length) {
                    this.discountCodeCreateForm.controls.structureId.setValue(rows[0].id);
                }
                else if (selectedDiscountStructureId && !rows.some((item) => item.id === selectedDiscountStructureId)) {
                    this.discountCodeCreateForm.controls.structureId.setValue(rows[0]?.id || '');
                }
                if (this.editingStructureId && !rows.some((structure) => structure.id === this.editingStructureId)) {
                    this.cancelStructureEdit();
                }
                if (this.selectedUsersStructureFilterId &&
                    !rows.some((structure) => structure.id === this.selectedUsersStructureFilterId)) {
                    this.selectedUsersStructureFilterId = null;
                }
                if (this.selectedPaymentsStructureId && !rows.some((structure) => structure.id === this.selectedPaymentsStructureId)) {
                    this.selectedPaymentsStructureId = '';
                }
                if (this.activeSection === 'discounts' || this.activeSection === 'structures') {
                    this.loadDiscountCodes();
                }
            },
            error: (error) => {
                this.loadingStructures = false;
                const message = error?.error?.message || 'Errore caricamento strutture';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    loadAssociatedUsers() {
        if (!this.isFacilityManager || this.loadingAssociatedUsers) {
            return;
        }
        this.loadingAssociatedUsers = true;
        this.auth.listAssociatedUsers().subscribe({
            next: (rows) => {
                this.loadingAssociatedUsers = false;
                this.associatedUsers = rows;
            },
            error: (error) => {
                this.loadingAssociatedUsers = false;
                const message = error?.error?.message || 'Errore caricamento utenti associati';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    loadPayments() {
        if (!this.canAccessDashboard || this.loadingPayments) {
            return;
        }
        const structureIdFilter = this.canManageUsers ? this.selectedPaymentsStructureId || undefined : undefined;
        this.loadingPayments = true;
        this.auth.listPayments(structureIdFilter).subscribe({
            next: (response) => {
                this.loadingPayments = false;
                this.payments = response?.items || [];
                this.paymentsSummary = response?.summary || {
                    totalPayments: 0,
                    totalCollected: 0,
                    totalDiscountAmount: 0,
                    totalStructureEarnings: 0
                };
            },
            error: (error) => {
                this.loadingPayments = false;
                const message = error?.error?.message || 'Errore caricamento pagamenti';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    loadPartnerRequests() {
        if (!this.canManageUsers || this.loadingPartnerRequests) {
            return;
        }
        this.loadingPartnerRequests = true;
        this.auth.listPartnerRequests().subscribe({
            next: (rows) => {
                this.loadingPartnerRequests = false;
                this.partnerRequests = this.sortPartnerRequests(rows || []);
            },
            error: (error) => {
                this.loadingPartnerRequests = false;
                const message = error?.error?.message || 'Errore caricamento richieste partner';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    openPartnerRequestApproval(request) {
        if (!this.canManageUsers || !this.partnerRequestApprovalDialog) {
            return;
        }
        if (request.status === 'approved') {
            return;
        }
        if (!this.catalogCities.length && !this.loadingCatalogCities) {
            this.loadCatalogCities();
        }
        this.partnerRequestApprovalTarget = request;
        this.startPartnerRequestApproval(request);
        this.partnerRequestApprovalDialogRef?.close();
        this.partnerRequestApprovalDialogRef = this.dialog.open(this.partnerRequestApprovalDialog, {
            width: '760px',
            maxWidth: '95vw'
        });
        this.partnerRequestApprovalDialogRef.afterClosed().subscribe(() => {
            this.partnerRequestApprovalDialogRef = undefined;
            this.approvingPartnerRequestId = null;
            this.previewingPartnerRequestId = null;
            this.startPartnerRequestApproval();
        });
    }
    closePartnerRequestApprovalDialog() {
        this.partnerRequestApprovalDialogRef?.close();
        this.partnerRequestApprovalDialogRef = undefined;
        this.approvingPartnerRequestId = null;
        this.previewingPartnerRequestId = null;
        this.startPartnerRequestApproval();
    }
    startPartnerRequestApproval(request = null) {
        this.partnerRequestApprovalTarget = request;
        this.partnerRequestApprovalForm.reset({
            applyTo: 'bundle',
            cityIds: this.catalogCities[0]?.id ? [this.catalogCities[0].id] : [],
            code: '',
            userDiscountPercent: 0,
            structureFixedAmount: 0,
            expiresAt: this.defaultDiscountCodeExpiryInput()
        });
    }
    generateDiscountCodeForPartnerApproval() {
        if (!this.canManageUsers || this.approvingPartnerRequestId !== null) {
            return;
        }
        this.auth.generateStructureInviteCode().subscribe({
            next: (inviteCode) => {
                this.partnerRequestApprovalForm.controls.code.setValue(inviteCode);
                this.partnerRequestApprovalForm.controls.code.markAsDirty();
            },
            error: (error) => {
                const message = error?.error?.message || 'Errore generazione codice';
                this.snackBar.open(message, 'Chiudi', { duration: 3200 });
            }
        });
    }
    previewPartnerRequestPdf(request, payload) {
        if (!this.canManageUsers || this.previewingPartnerRequestId !== null) {
            return;
        }
        this.previewingPartnerRequestId = request.id;
        this.auth
            .previewPartnerRequestPdf(request.id, payload || { code: request.discountCode || 'SCONTO' })
            .subscribe({
            next: (blob) => {
                this.previewingPartnerRequestId = null;
                const objectUrl = URL.createObjectURL(blob);
                const previewLink = document.createElement('a');
                previewLink.href = objectUrl;
                previewLink.target = '_blank';
                previewLink.rel = 'noopener';
                previewLink.click();
                window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
            },
            error: (error) => {
                this.previewingPartnerRequestId = null;
                const message = error?.error?.message || 'Errore anteprima PDF';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    previewSelectedPartnerRequestPdf() {
        const request = this.partnerRequestApprovalTarget;
        if (!request) {
            return;
        }
        const { cityIds, code, userDiscountPercent, structureFixedAmount, expiresAt } = this.partnerRequestApprovalForm.getRawValue();
        const expiresAtIso = this.toIsoDateTime(expiresAt);
        this.previewPartnerRequestPdf(request, {
            cityIds: this.normalizeSelectedCityIds(cityIds),
            code: this.normalizeStructureInviteCode(code || '') || 'SCONTO',
            userDiscountPercent: this.normalizePercent(userDiscountPercent),
            structureFixedAmount: this.normalizeEuroAmount(structureFixedAmount),
            expiresAt: expiresAtIso
        });
    }
    approvePartnerRequest() {
        const request = this.partnerRequestApprovalTarget;
        if (!request || !this.canManageUsers || this.approvingPartnerRequestId !== null) {
            return;
        }
        if (this.partnerRequestApprovalForm.invalid) {
            this.partnerRequestApprovalForm.markAllAsTouched();
            return;
        }
        const { applyTo, cityIds, code, userDiscountPercent, structureFixedAmount, expiresAt } = this.partnerRequestApprovalForm.getRawValue();
        const normalizedCode = this.normalizeStructureInviteCode(code || '');
        if (!normalizedCode) {
            this.partnerRequestApprovalForm.controls.code.markAsTouched();
            this.snackBar.open('Codice obbligatorio', 'Chiudi', { duration: 2800 });
            return;
        }
        const expiresAtIso = this.toIsoDateTime(expiresAt);
        if (!expiresAtIso) {
            this.partnerRequestApprovalForm.controls.expiresAt.markAsTouched();
            this.snackBar.open('Scadenza non valida', 'Chiudi', { duration: 2800 });
            return;
        }
        const normalizedCityIds = this.normalizeSelectedCityIds(cityIds);
        if (!normalizedCityIds.length) {
            this.partnerRequestApprovalForm.controls.cityIds.markAsTouched();
            this.snackBar.open('Seleziona almeno una città', 'Chiudi', { duration: 2800 });
            return;
        }
        const payload = {
            applyTo,
            cityIds: normalizedCityIds,
            code: normalizedCode,
            userDiscountPercent: this.normalizePercent(userDiscountPercent),
            structureFixedAmount: this.normalizeEuroAmount(structureFixedAmount),
            expiresAt: expiresAtIso
        };
        this.approvingPartnerRequestId = request.id;
        this.auth.approvePartnerRequest(request.id, payload).subscribe({
            next: (updated) => {
                this.approvingPartnerRequestId = null;
                this.partnerRequests = this.sortPartnerRequests(this.partnerRequests.map((item) => (item.id === updated.id ? updated : item)));
                this.closePartnerRequestApprovalDialog();
                this.loadStructures();
                this.loadDiscountCodes();
                this.snackBar.open(`Richiesta ${updated.structureName} approvata e inviata via email`, 'OK', {
                    duration: 3200
                });
            },
            error: (error) => {
                this.approvingPartnerRequestId = null;
                const message = error?.error?.message || 'Errore approvazione richiesta partner';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    rejectPartnerRequest(request) {
        if (!this.canManageUsers || this.rejectingPartnerRequestId !== null || request.status === 'approved') {
            return;
        }
        const confirmed = window.confirm(`Negare la richiesta partner per "${request.structureName}"?`);
        if (!confirmed) {
            return;
        }
        this.rejectingPartnerRequestId = request.id;
        this.auth.rejectPartnerRequest(request.id).subscribe({
            next: (updated) => {
                this.rejectingPartnerRequestId = null;
                this.partnerRequests = this.sortPartnerRequests(this.partnerRequests.map((item) => (item.id === updated.id ? updated : item)));
                this.snackBar.open(`Richiesta ${updated.structureName} negata`, 'OK', { duration: 2600 });
            },
            error: (error) => {
                this.rejectingPartnerRequestId = null;
                const message = error?.error?.message || 'Errore aggiornamento richiesta partner';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    isPartnerRequestBusy(request) {
        return (this.approvingPartnerRequestId === request.id ||
            this.rejectingPartnerRequestId === request.id ||
            this.previewingPartnerRequestId === request.id);
    }
    partnerRequestStatusLabel(status) {
        if (status === 'approved') {
            return 'Approvata';
        }
        if (status === 'rejected') {
            return 'Negata';
        }
        return 'In attesa';
    }
    partnerRequestStatusClass(status) {
        if (status === 'approved') {
            return 'ok';
        }
        if (status === 'rejected') {
            return 'bad';
        }
        return 'warn';
    }
    partnerRequestPdfStatusLabel(status) {
        return status === 'sent' ? 'Inviato' : 'Da inviare';
    }
    partnerRequestPdfStatusClass(status) {
        return status === 'sent' ? 'ok' : 'warn';
    }
    loadPayPalSettings() {
        if (!this.canManagePayPal || this.loadingPayPalSettings) {
            return;
        }
        this.loadingPayPalSettings = true;
        this.auth.getPayPalSettings().subscribe({
            next: (settings) => {
                this.loadingPayPalSettings = false;
                this.payPalSettings = settings;
                this.payPalForm.reset({
                    isEnabled: settings.isEnabled,
                    mode: settings.mode,
                    clientId: settings.clientId || '',
                    clientSecret: settings.clientSecret || '',
                    merchantId: settings.merchantId || '',
                    merchantEmail: settings.merchantEmail || '',
                    brandName: settings.brandName || 'Walk Around',
                    webhookId: settings.webhookId || ''
                });
            },
            error: (error) => {
                this.loadingPayPalSettings = false;
                const message = error?.error?.message || 'Errore caricamento configurazione PayPal';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    savePayPalSettings() {
        if (!this.canSavePayPalSettings) {
            this.payPalForm.markAllAsTouched();
            return;
        }
        this.savingPayPalSettings = true;
        const payload = this.payPalForm.getRawValue();
        this.auth
            .updatePayPalSettings({
            isEnabled: payload.isEnabled,
            mode: payload.mode,
            clientId: payload.clientId.trim(),
            clientSecret: payload.clientSecret.trim(),
            merchantId: payload.merchantId.trim(),
            merchantEmail: payload.merchantEmail.trim(),
            brandName: payload.brandName.trim() || 'Walk Around',
            webhookId: payload.webhookId.trim(),
            currencyCode: 'EUR'
        })
            .subscribe({
            next: (settings) => {
                this.savingPayPalSettings = false;
                this.payPalSettings = settings;
                this.snackBar.open('Configurazione PayPal salvata', 'OK', { duration: 2400 });
            },
            error: (error) => {
                this.savingPayPalSettings = false;
                const message = error?.error?.message || 'Errore salvataggio configurazione PayPal';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    testPayPalSettings() {
        if (!this.canManagePayPal || this.testingPayPalSettings) {
            return;
        }
        this.testingPayPalSettings = true;
        this.auth.testPayPalSettings().subscribe({
            next: (response) => {
                this.testingPayPalSettings = false;
                if (response.settings) {
                    this.payPalSettings = response.settings;
                }
                this.snackBar.open('Connessione PayPal verificata', 'OK', { duration: 2600 });
            },
            error: (error) => {
                this.testingPayPalSettings = false;
                const message = error?.error?.message || 'Verifica PayPal non riuscita';
                if (this.payPalSettings) {
                    this.payPalSettings = {
                        ...this.payPalSettings,
                        lastVerificationStatus: 'invalid',
                        lastVerificationError: message
                    };
                }
                this.snackBar.open(message, 'Chiudi', { duration: 3600 });
            }
        });
    }
    ensureGptTranslationsLoaded() {
        if (!this.canManageGptTranslations) {
            return;
        }
        this.loadOpenAiTranslationSettings();
        if (!this.catalogCities.length && !this.loadingCatalogCities) {
            this.loadCatalogCities();
            return;
        }
        const cityId = this.ensureGptTranslationCitySelection();
        if (cityId) {
            this.loadCatalogPois(cityId);
            this.loadOpenAiTranslationStatus();
        }
    }
    loadOpenAiTranslationSettings(force = false) {
        if (!this.canManageGptTranslations || this.loadingOpenAiTranslationSettings) {
            return;
        }
        if (this.openAiTranslationSettings && !force) {
            return;
        }
        this.loadingOpenAiTranslationSettings = true;
        this.auth.getOpenAiTranslationSettings().subscribe({
            next: (settings) => {
                this.loadingOpenAiTranslationSettings = false;
                this.openAiTranslationSettings = settings;
                this.openAiTranslationSettingsForm.reset({
                    apiKey: '',
                    model: settings.model || 'gpt-4o-mini'
                });
            },
            error: (error) => {
                this.loadingOpenAiTranslationSettings = false;
                const message = error?.error?.message || 'Errore caricamento configurazione OpenAI';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    saveOpenAiTranslationSettings() {
        if (!this.canSaveOpenAiTranslationSettings) {
            this.openAiTranslationSettingsForm.markAllAsTouched();
            return;
        }
        const payload = this.openAiTranslationSettingsForm.getRawValue();
        this.savingOpenAiTranslationSettings = true;
        this.auth
            .saveOpenAiTranslationSettings({
            apiKey: payload.apiKey.trim(),
            model: payload.model.trim() || 'gpt-4o-mini'
        })
            .subscribe({
            next: (settings) => {
                this.savingOpenAiTranslationSettings = false;
                this.openAiTranslationSettings = settings;
                this.openAiTranslationSettingsForm.reset({
                    apiKey: '',
                    model: settings.model || 'gpt-4o-mini'
                });
                this.snackBar.open('Configurazione OpenAI salvata', 'OK', { duration: 2400 });
            },
            error: (error) => {
                this.savingOpenAiTranslationSettings = false;
                const message = error?.error?.message || 'Errore salvataggio configurazione OpenAI';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    onGptTranslationCityChanged(cityId) {
        this.gptTranslationForm.controls.cityId.setValue(cityId, { emitEvent: false });
        this.gptTranslationForm.controls.poiId.setValue('', { emitEvent: false });
        this.selectedGptTranslationPoiId = '';
        this.resetGptTranslationProgress();
        if (!cityId) {
            this.openAiTranslationStatusRows = [];
            this.catalogPois = [];
            return;
        }
        this.onCatalogCityFilterChange(cityId, { force: true });
        this.loadOpenAiTranslationStatus();
    }
    onGptTranslationLanguageChanged(language) {
        this.gptTranslationForm.controls.targetLanguage.setValue(language, { emitEvent: false });
        this.resetGptTranslationProgress();
        this.loadOpenAiTranslationStatus();
    }
    onGptTranslationPoiChanged(poiId) {
        this.selectedGptTranslationPoiId = poiId;
        this.gptTranslationForm.controls.poiId.setValue(poiId, { emitEvent: false });
    }
    loadOpenAiTranslationStatus() {
        if (!this.canManageGptTranslations) {
            return;
        }
        const cityId = this.gptTranslationForm.controls.cityId.value || this.ensureGptTranslationCitySelection();
        const targetLanguage = this.gptTranslationForm.controls.targetLanguage.value;
        if (!cityId || !targetLanguage) {
            this.openAiTranslationStatusRows = [];
            return;
        }
        const requestToken = ++this.openAiTranslationStatusRequestToken;
        this.loadingOpenAiTranslationStatus = true;
        this.auth.listOpenAiPoiTranslationStatus(cityId, targetLanguage).subscribe({
            next: (rows) => {
                if (requestToken !== this.openAiTranslationStatusRequestToken) {
                    return;
                }
                this.loadingOpenAiTranslationStatus = false;
                this.openAiTranslationStatusRows = rows;
                this.ensureSelectedGptTranslationPoi();
            },
            error: (error) => {
                if (requestToken !== this.openAiTranslationStatusRequestToken) {
                    return;
                }
                this.loadingOpenAiTranslationStatus = false;
                const message = error?.error?.message || 'Errore caricamento stato traduzioni';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    translateSelectedGptPoi() {
        const poi = this.selectedGptTranslationPoi;
        if (!this.canTranslateSelectedGptPoi || !poi) {
            return;
        }
        this.resetGptTranslationProgress(1);
        this.translatingPoiId = poi.id;
        this.auth
            .translateCatalogPoiWithOpenAi(poi.id, {
            cityId: this.gptTranslationForm.controls.cityId.value,
            targetLanguage: this.gptTranslationForm.controls.targetLanguage.value,
            overwrite: this.gptTranslationForm.controls.overwrite.value
        })
            .subscribe({
            next: (response) => {
                this.translatingPoiId = null;
                this.gptTranslationProgressDone = 1;
                this.applyOpenAiTranslationResponse(response);
                this.addGptTranslationUsage(response.usage);
                this.loadOpenAiTranslationStatus();
                this.snackBar.open(response.skipped ? 'POI gia tradotto' : 'Traduzione completata', 'OK', { duration: 2600 });
            },
            error: (error) => {
                this.translatingPoiId = null;
                const message = error?.error?.message || 'Traduzione non riuscita';
                this.snackBar.open(message, 'Chiudi', { duration: 4200 });
            }
        });
    }
    async translateMissingGptPoisForCity() {
        if (!this.canTranslateMissingGptPois) {
            return;
        }
        const cityId = this.gptTranslationForm.controls.cityId.value;
        const targetLanguage = this.gptTranslationForm.controls.targetLanguage.value;
        const overwrite = this.gptTranslationForm.controls.overwrite.value;
        const rowsToTranslate = this.openAiTranslationStatusRows.filter((row) => !row.isComplete);
        if (!cityId || !rowsToTranslate.length) {
            return;
        }
        this.bulkTranslatingPois = true;
        this.resetGptTranslationProgress(rowsToTranslate.length);
        this.gptTranslationLog = [];
        for (const row of rowsToTranslate) {
            this.translatingPoiId = row.poiId;
            try {
                const response = await firstValueFrom(this.auth.translateCatalogPoiWithOpenAi(row.poiId, {
                    cityId,
                    targetLanguage,
                    overwrite
                }));
                this.applyOpenAiTranslationResponse(response);
                this.addGptTranslationUsage(response.usage);
                this.gptTranslationProgressDone += 1;
                this.gptTranslationLog = [`${row.name}: ${response.skipped ? 'gia completo' : 'tradotto'}`, ...this.gptTranslationLog].slice(0, 8);
            }
            catch (error) {
                const message = this.dashboardErrorMessage(error, 'Traduzione interrotta');
                this.gptTranslationLog = [`${row.name}: ${message}`, ...this.gptTranslationLog].slice(0, 8);
                this.snackBar.open(message, 'Chiudi', { duration: 4500 });
                break;
            }
        }
        this.bulkTranslatingPois = false;
        this.translatingPoiId = null;
        this.loadOpenAiTranslationStatus();
        this.snackBar.open('Traduzione massiva terminata', 'OK', { duration: 2600 });
    }
    gptMissingFieldsLabel(fields) {
        if (!fields?.length) {
            return 'Completa';
        }
        const labels = {
            descriptionShort: 'descrizione breve',
            descriptionLong: 'descrizione lunga'
        };
        return fields.map((field) => labels[field] || field).join(', ');
    }
    partnerRequestContactName(request) {
        return `${request.contactFirstName || ''} ${request.contactLastName || ''}`.trim() || request.contactEmail;
    }
    partnerRequestAddress(request) {
        const line1 = [request.addressStreet, request.addressNumber].filter(Boolean).join(' ');
        const cityLine = [request.addressPostalCode, request.addressCity, request.addressProvince].filter(Boolean).join(' ');
        const areaLine = [request.addressRegion, request.addressCountry].filter(Boolean).join(', ');
        return [line1, cityLine, areaLine].filter(Boolean).join(' - ');
    }
    onPaymentsStructureFilterChange(structureId) {
        if (!this.canManageUsers) {
            return;
        }
        this.selectedPaymentsStructureId = String(structureId || '').trim();
        this.loadPayments();
    }
    registerStructure() {
        if (!this.canManageUsers) {
            return;
        }
        if (this.structureForm.invalid || this.creatingStructure) {
            this.structureForm.markAllAsTouched();
            return;
        }
        this.creatingStructure = true;
        const { name, street, streetNumber, city, postalCode, province, country } = this.structureForm.getRawValue();
        this.auth
            .createStructure(name.trim(), street.trim(), streetNumber.trim(), city.trim(), postalCode.trim(), province.trim() || null, country.trim() || null)
            .subscribe({
            next: () => {
                this.creatingStructure = false;
                this.structureForm.reset({
                    name: '',
                    street: '',
                    streetNumber: '',
                    city: '',
                    postalCode: '',
                    province: '',
                    country: 'Italia'
                });
                this.showStructureSection = false;
                this.snackBar.open('Struttura registrata con successo', 'OK', { duration: 3000 });
                this.loadStructures();
            },
            error: (error) => {
                this.creatingStructure = false;
                const message = error?.error?.message || 'Errore registrazione struttura';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    editStructure(structure) {
        this.editingStructureId = structure.id;
        this.structureEditForm.reset({
            name: structure.name || '',
            street: structure.street || '',
            streetNumber: structure.streetNumber || '',
            city: structure.city || '',
            postalCode: structure.postalCode || '',
            province: structure.province || '',
            country: structure.country || 'Italia'
        });
        this.showStructureSection = false;
    }
    cancelStructureEdit() {
        this.editingStructureId = null;
        this.updatingStructure = false;
        this.structureEditForm.reset({
            name: '',
            street: '',
            streetNumber: '',
            city: '',
            postalCode: '',
            province: '',
            country: 'Italia'
        });
    }
    updateStructure() {
        if (!this.canManageUsers || !this.editingStructureId || this.updatingStructure || this.structureEditForm.invalid) {
            this.structureEditForm.markAllAsTouched();
            return;
        }
        const { name, street, streetNumber, city, postalCode, province, country } = this.structureEditForm.getRawValue();
        this.updatingStructure = true;
        this.auth
            .updateStructure(this.editingStructureId, name.trim(), street.trim(), streetNumber.trim(), city.trim(), postalCode.trim(), province.trim() || null, country.trim() || null)
            .subscribe({
            next: () => {
                this.updatingStructure = false;
                this.snackBar.open('Struttura aggiornata con successo', 'OK', { duration: 2800 });
                this.cancelStructureEdit();
                this.loadStructures();
                this.loadUsers();
            },
            error: (error) => {
                this.updatingStructure = false;
                const message = error?.error?.message || 'Errore aggiornamento struttura';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    loadDiscountCodes() {
        if (!this.canViewDiscountCodes || this.loadingDiscountCodes) {
            return;
        }
        const structureIdFilter = this.canManageUsers ? undefined : this.managedStructureId || undefined;
        if (this.isFacilityManager && !structureIdFilter) {
            this.discountCodes = [];
            this.rebuildDiscountCodesIndex();
            return;
        }
        this.loadingDiscountCodes = true;
        this.auth.listDiscountCodes(structureIdFilter).subscribe({
            next: (rows) => {
                this.loadingDiscountCodes = false;
                this.discountCodes = rows.map((row) => this.normalizeDiscountCodeRow(row));
                this.rebuildDiscountCodesIndex();
            },
            error: (error) => {
                this.loadingDiscountCodes = false;
                const message = error?.error?.message || 'Errore caricamento codici sconto';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    toggleDiscountCodeCreateSection() {
        if (!this.canManageUsers || !this.createDiscountCodeDialog) {
            return;
        }
        if (!this.structures.length) {
            this.snackBar.open('Devi creare prima una struttura', 'Chiudi', { duration: 3000 });
            return;
        }
        if (!this.catalogCities.length && !this.loadingCatalogCities) {
            this.loadCatalogCities();
        }
        this.startCreateDiscountCode();
        this.createDiscountCodeDialogRef?.close();
        this.createDiscountCodeDialogRef = this.dialog.open(this.createDiscountCodeDialog, {
            width: '760px',
            maxWidth: '95vw'
        });
        this.createDiscountCodeDialogRef.afterClosed().subscribe(() => {
            this.createDiscountCodeDialogRef = undefined;
            this.creatingDiscountCode = false;
            this.startCreateDiscountCode();
        });
    }
    closeCreateDiscountCodeDialog() {
        this.createDiscountCodeDialogRef?.close();
        this.createDiscountCodeDialogRef = undefined;
        this.creatingDiscountCode = false;
        this.startCreateDiscountCode();
    }
    startCreateDiscountCode() {
        this.discountCodeCreateForm.reset({
            structureId: this.structures[0]?.id || '',
            applyTo: 'bundle',
            cityIds: this.catalogCities[0]?.id ? [this.catalogCities[0].id] : [],
            code: '',
            userDiscountPercent: 0,
            structureFixedAmount: 0,
            expiresAt: this.defaultDiscountCodeExpiryInput()
        });
    }
    generateDiscountCodeForCreate() {
        if (!this.canManageUsers || this.creatingDiscountCode) {
            return;
        }
        this.auth.generateStructureInviteCode().subscribe({
            next: (inviteCode) => {
                this.discountCodeCreateForm.controls.code.setValue(inviteCode);
                this.discountCodeCreateForm.controls.code.markAsDirty();
            },
            error: (error) => {
                const message = error?.error?.message || 'Errore generazione codice';
                this.snackBar.open(message, 'Chiudi', { duration: 3200 });
            }
        });
    }
    createDiscountCode() {
        if (!this.canManageUsers || this.creatingDiscountCode || this.discountCodeCreateForm.invalid) {
            this.discountCodeCreateForm.markAllAsTouched();
            return;
        }
        const { structureId, applyTo, cityIds, code, userDiscountPercent, structureFixedAmount, expiresAt } = this.discountCodeCreateForm.getRawValue();
        const normalizedCode = this.normalizeStructureInviteCode(code || '');
        if (!normalizedCode) {
            this.discountCodeCreateForm.controls.code.markAsTouched();
            this.snackBar.open('Codice obbligatorio', 'Chiudi', { duration: 2800 });
            return;
        }
        const expiresAtIso = this.toIsoDateTime(expiresAt);
        if (!expiresAtIso) {
            this.discountCodeCreateForm.controls.expiresAt.markAsTouched();
            this.snackBar.open('Scadenza non valida', 'Chiudi', { duration: 2800 });
            return;
        }
        const normalizedCityIds = this.normalizeSelectedCityIds(cityIds);
        if (!normalizedCityIds.length) {
            this.discountCodeCreateForm.controls.cityIds.markAsTouched();
            this.snackBar.open('Seleziona almeno una città', 'Chiudi', { duration: 2800 });
            return;
        }
        this.creatingDiscountCode = true;
        this.auth
            .createDiscountCode(structureId, applyTo, normalizedCityIds, this.normalizePercent(userDiscountPercent), this.normalizeEuroAmount(structureFixedAmount), expiresAtIso, normalizedCode)
            .subscribe({
            next: (created) => {
                this.creatingDiscountCode = false;
                this.discountCodes = [this.normalizeDiscountCodeRow(created), ...this.discountCodes];
                this.rebuildDiscountCodesIndex();
                this.snackBar.open(`Codice ${created.code} creato`, 'OK', { duration: 2600 });
                this.closeCreateDiscountCodeDialog();
                this.loadStructures();
            },
            error: (error) => {
                this.creatingDiscountCode = false;
                const message = error?.error?.message || 'Errore creazione codice sconto';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    editDiscountCode(discountCode) {
        if (!this.catalogCities.length && !this.loadingCatalogCities) {
            this.loadCatalogCities();
        }
        this.editingDiscountCodeId = discountCode.id;
        const selectedCityIds = this.normalizeSelectedCityIds(discountCode.cityIds || []);
        const fallbackCityId = discountCode.cityId || this.catalogCities[0]?.id || '';
        this.discountCodeEditForm.reset({
            applyTo: discountCode.applyTo || 'bundle',
            cityIds: selectedCityIds.length ? selectedCityIds : fallbackCityId ? [fallbackCityId] : [],
            userDiscountPercent: this.normalizePercent(discountCode.userDiscountPercentApplied),
            structureFixedAmount: this.normalizeEuroAmount(discountCode.structureFixedAmountApplied),
            expiresAt: this.isoToInputDateTime(discountCode.expiresAt)
        });
        if (!this.editDiscountCodeDialog) {
            return;
        }
        this.editDiscountCodeDialogRef?.close();
        this.editDiscountCodeDialogRef = this.dialog.open(this.editDiscountCodeDialog, {
            width: '760px',
            maxWidth: '95vw'
        });
    }
    closeEditDiscountCodeDialog() {
        this.editDiscountCodeDialogRef?.close();
        this.editDiscountCodeDialogRef = undefined;
        this.editingDiscountCodeId = null;
        this.updatingDiscountCode = false;
        this.discountCodeEditForm.reset({
            applyTo: 'bundle',
            cityIds: this.catalogCities[0]?.id ? [this.catalogCities[0].id] : [],
            userDiscountPercent: 0,
            structureFixedAmount: 0,
            expiresAt: ''
        });
    }
    saveDiscountCodeEdit() {
        if (!this.canManageUsers || !this.editingDiscountCodeId || this.updatingDiscountCode || this.discountCodeEditForm.invalid) {
            this.discountCodeEditForm.markAllAsTouched();
            return;
        }
        const { applyTo, cityIds, userDiscountPercent, structureFixedAmount, expiresAt } = this.discountCodeEditForm.getRawValue();
        const expiresAtIso = this.toIsoDateTime(expiresAt);
        if (!expiresAtIso) {
            this.discountCodeEditForm.controls.expiresAt.markAsTouched();
            this.snackBar.open('Scadenza non valida', 'Chiudi', { duration: 2800 });
            return;
        }
        const normalizedCityIds = this.normalizeSelectedCityIds(cityIds);
        if (!normalizedCityIds.length) {
            this.discountCodeEditForm.controls.cityIds.markAsTouched();
            this.snackBar.open('Seleziona almeno una città', 'Chiudi', { duration: 2800 });
            return;
        }
        this.updatingDiscountCode = true;
        this.savingDiscountCodeId = this.editingDiscountCodeId;
        this.auth
            .updateDiscountCode(this.editingDiscountCodeId, applyTo, normalizedCityIds, this.normalizePercent(userDiscountPercent), this.normalizeEuroAmount(structureFixedAmount), expiresAtIso)
            .subscribe({
            next: (updated) => {
                this.updatingDiscountCode = false;
                this.savingDiscountCodeId = null;
                this.discountCodes = this.discountCodes.map((item) => item.id === updated.id ? this.normalizeDiscountCodeRow(updated) : item);
                this.rebuildDiscountCodesIndex();
                this.snackBar.open(`Codice ${updated.code} aggiornato`, 'OK', { duration: 2600 });
                this.closeEditDiscountCodeDialog();
            },
            error: (error) => {
                this.updatingDiscountCode = false;
                this.savingDiscountCodeId = null;
                const message = error?.error?.message || 'Errore aggiornamento codice sconto';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    deleteDiscountCode(discountCode) {
        if (!this.canManageUsers || this.deletingDiscountCodeId !== null) {
            return;
        }
        const confirmed = window.confirm(`Eliminare il codice ${discountCode.code}?`);
        if (!confirmed) {
            return;
        }
        this.deletingDiscountCodeId = discountCode.id;
        this.auth.deleteDiscountCode(discountCode.id).subscribe({
            next: () => {
                this.deletingDiscountCodeId = null;
                this.discountCodes = this.discountCodes.filter((item) => item.id !== discountCode.id);
                this.rebuildDiscountCodesIndex();
                this.snackBar.open(`Codice ${discountCode.code} eliminato`, 'OK', { duration: 2400 });
            },
            error: (error) => {
                this.deletingDiscountCodeId = null;
                const message = error?.error?.message || 'Errore eliminazione codice sconto';
                this.snackBar.open(message, 'Chiudi', { duration: 3200 });
            }
        });
    }
    ensureCatalogLoaded() {
        if (!this.catalogCities.length && !this.loadingCatalogCities) {
            this.loadCatalogCities();
            return;
        }
        if (!this.ensureCatalogSelectedCity()) {
            return;
        }
        if (this.selectedCatalogCityId &&
            !this.loadingCatalogPois &&
            (this.lastLoadedCatalogPoisCityId !== this.selectedCatalogCityId || !this.catalogPois.length)) {
            this.loadCatalogPois(this.selectedCatalogCityId);
        }
    }
    loadCatalogCities() {
        if (!this.canManageCatalog || this.loadingCatalogCities) {
            return;
        }
        this.loadingCatalogCities = true;
        this.auth.listCatalogCities().subscribe({
            next: (rows) => {
                this.loadingCatalogCities = false;
                this.hasLoadedCatalogCitiesOnce = true;
                this.catalogCities = rows;
                const firstCityId = this.catalogCities[0]?.id || '';
                const createCityIds = this.normalizeSelectedCityIds(this.discountCodeCreateForm.controls.cityIds.value);
                const nextCreateCityIds = createCityIds.filter((cityId) => this.catalogCities.some((city) => city.id === cityId));
                if (!nextCreateCityIds.length && firstCityId) {
                    this.discountCodeCreateForm.controls.cityIds.setValue([firstCityId]);
                }
                else if (nextCreateCityIds.length !== createCityIds.length) {
                    this.discountCodeCreateForm.controls.cityIds.setValue(nextCreateCityIds);
                }
                const editCityIds = this.normalizeSelectedCityIds(this.discountCodeEditForm.controls.cityIds.value);
                const nextEditCityIds = editCityIds.filter((cityId) => this.catalogCities.some((city) => city.id === cityId));
                if (!nextEditCityIds.length && firstCityId) {
                    this.discountCodeEditForm.controls.cityIds.setValue([firstCityId]);
                }
                else if (nextEditCityIds.length !== editCityIds.length) {
                    this.discountCodeEditForm.controls.cityIds.setValue(nextEditCityIds);
                }
                const partnerCityIds = this.normalizeSelectedCityIds(this.partnerRequestApprovalForm.controls.cityIds.value);
                const nextPartnerCityIds = partnerCityIds.filter((cityId) => this.catalogCities.some((city) => city.id === cityId));
                if (!nextPartnerCityIds.length && firstCityId) {
                    this.partnerRequestApprovalForm.controls.cityIds.setValue([firstCityId]);
                }
                else if (nextPartnerCityIds.length !== partnerCityIds.length) {
                    this.partnerRequestApprovalForm.controls.cityIds.setValue(nextPartnerCityIds);
                }
                const hasSelection = this.ensureCatalogSelectedCity();
                if (hasSelection) {
                    this.loadCatalogPois(this.selectedCatalogCityId, { force: true });
                }
                if (this.activeSection === 'gptTranslations') {
                    this.ensureGptTranslationCitySelection();
                    this.loadOpenAiTranslationStatus();
                }
            },
            error: (error) => {
                this.loadingCatalogCities = false;
                const message = error?.error?.message || 'Errore caricamento città';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    loadCatalogPois(cityId, options = {}) {
        if (!this.canManageCatalog || !cityId) {
            return;
        }
        const force = Boolean(options.force);
        if (!force && this.lastLoadedCatalogPoisCityId === cityId && this.catalogPois.length) {
            return;
        }
        const requestToken = ++this.catalogPoisRequestToken;
        this.loadingCatalogPois = true;
        this.auth.listCatalogPoisByCity(cityId).subscribe({
            next: (rows) => {
                if (requestToken !== this.catalogPoisRequestToken) {
                    return;
                }
                this.loadingCatalogPois = false;
                this.lastLoadedCatalogPoisCityId = cityId;
                const dedupedById = new Map();
                rows.forEach((row) => {
                    if (!dedupedById.has(row.id)) {
                        dedupedById.set(row.id, row);
                    }
                });
                this.catalogPois = Array.from(dedupedById.values());
                this.preloadAudioDurationsForPois(this.catalogPois);
            },
            error: (error) => {
                if (requestToken !== this.catalogPoisRequestToken) {
                    return;
                }
                this.loadingCatalogPois = false;
                const message = error?.error?.message || 'Errore caricamento luoghi di interesse';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    onCatalogCityFilterChange(cityId, options = {}) {
        this.selectedCatalogCityId = cityId;
        if (!cityId) {
            this.catalogPois = [];
            this.lastLoadedCatalogPoisCityId = '';
            this.catalogPoisRequestToken += 1;
            this.loadingCatalogPois = false;
            return;
        }
        if (!this.editingCatalogPoiId) {
            this.catalogPoiForm.controls.cityId.setValue(cityId);
        }
        this.loadCatalogPois(cityId, { force: Boolean(options.force) });
    }
    startCreateCatalogCity() {
        this.editingCatalogCityId = null;
        this.editingCatalogCityIsDefault = false;
        this.catalogCityForm.reset({
            name: '',
            region: this.fixedCreateCityRegion,
            bundlePrice: 0,
            heroImage: '',
            translations: this.emptyCatalogCityTranslationsFormValue()
        });
        this.catalogCityForm.controls.region.disable({ emitEvent: false });
    }
    editCatalogCity(city) {
        this.editingCatalogCityId = city.id;
        this.editingCatalogCityIsDefault = city.isDefault;
        this.catalogCityEditForm.reset({
            name: city.name,
            region: city.region,
            bundlePrice: city.bundlePrice,
            heroImage: city.heroImage,
            translations: this.catalogCityTranslationsFormValue(city.translations)
        });
        if (!this.editCatalogCityDialog) {
            return;
        }
        this.editCatalogCityDialogRef?.close();
        this.editCatalogCityDialogRef = this.dialog.open(this.editCatalogCityDialog, {
            width: '900px',
            maxWidth: '95vw'
        });
    }
    saveCatalogCity() {
        if (!this.canManageCatalog || this.savingCatalogCity || this.catalogCityForm.invalid) {
            this.catalogCityForm.markAllAsTouched();
            return;
        }
        const payload = this.toCatalogCityPayload(this.catalogCityForm.getRawValue(), false);
        this.savingCatalogCity = true;
        this.auth.createCatalogCity(payload).subscribe({
            next: (city) => {
                this.savingCatalogCity = false;
                this.selectedCatalogCityId = city.id;
                this.snackBar.open('Città creata', 'OK', { duration: 2400 });
                this.closeCreateCatalogCityDialog();
                this.loadCatalogCities();
            },
            error: (error) => {
                this.savingCatalogCity = false;
                const message = error?.error?.message || 'Errore salvataggio città';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    closeCatalogCityEditDialog() {
        this.editCatalogCityDialogRef?.close();
        this.editCatalogCityDialogRef = undefined;
        this.editingCatalogCityId = null;
        this.uploadingCatalogCityEditImage = false;
        this.catalogCityEditForm.reset({
            name: '',
            region: '',
            bundlePrice: 0,
            heroImage: '',
            translations: this.emptyCatalogCityTranslationsFormValue()
        });
    }
    saveCatalogCityEdit() {
        if (!this.canManageCatalog || !this.editingCatalogCityId || this.savingCatalogCity || this.catalogCityEditForm.invalid) {
            this.catalogCityEditForm.markAllAsTouched();
            return;
        }
        const payload = this.toCatalogCityPayload(this.catalogCityEditForm.getRawValue(), this.editingCatalogCityIsDefault);
        this.savingCatalogCity = true;
        this.auth.updateCatalogCity(this.editingCatalogCityId, payload).subscribe({
            next: () => {
                this.savingCatalogCity = false;
                this.snackBar.open('Città aggiornata', 'OK', { duration: 2400 });
                this.closeCatalogCityEditDialog();
                this.loadCatalogCities();
            },
            error: (error) => {
                this.savingCatalogCity = false;
                const message = error?.error?.message || 'Errore aggiornamento città';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    deleteCatalogCity(city) {
        if (!this.canManageCatalog || this.deletingCatalogCityId) {
            return;
        }
        const confirmed = window.confirm(`Eliminare la città "${city.name}"? Verranno eliminati anche i luoghi di interesse collegati.`);
        if (!confirmed) {
            return;
        }
        this.deletingCatalogCityId = city.id;
        this.auth.deleteCatalogCity(city.id).subscribe({
            next: () => {
                this.deletingCatalogCityId = null;
                if (this.editingCatalogCityId === city.id) {
                    this.closeCatalogCityEditDialog();
                }
                if (this.selectedCatalogCityId === city.id) {
                    this.selectedCatalogCityId = '';
                    this.catalogPois = [];
                    this.lastLoadedCatalogPoisCityId = '';
                    this.catalogPoisRequestToken += 1;
                    this.loadingCatalogPois = false;
                }
                this.snackBar.open('Città eliminata', 'OK', { duration: 2400 });
                this.loadCatalogCities();
            },
            error: (error) => {
                this.deletingCatalogCityId = null;
                const message = error?.error?.message || 'Errore eliminazione città';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    startCreateCatalogPoi() {
        this.editingCatalogPoiId = null;
        this.resetCatalogPoiTranslationAudioUploadState('create');
        this.catalogPoiForm.reset({
            cityId: this.selectedCatalogCityId || '',
            name: '',
            address: '',
            lat: 0,
            lng: 0,
            category: this.poiCategoryOptions[0],
            descriptionShort: '',
            descriptionLong: '',
            imageUrl: '',
            audioUrl: '',
            priceSingle: 0,
            durationSec: 60,
            translations: this.emptyCatalogPoiTranslationsFormValue()
        });
    }
    editCatalogPoi(poi) {
        this.editingCatalogPoiId = poi.id;
        this.resetCatalogPoiTranslationAudioUploadState('edit');
        if (this.selectedCatalogCityId !== poi.cityId) {
            this.selectedCatalogCityId = poi.cityId;
            this.loadCatalogPois(poi.cityId);
        }
        this.catalogPoiEditForm.reset({
            cityId: poi.cityId,
            name: poi.name,
            address: poi.address || '',
            lat: poi.lat,
            lng: poi.lng,
            category: poi.category,
            descriptionShort: poi.descriptionShort,
            descriptionLong: poi.descriptionLong,
            imageUrl: poi.imageUrl,
            audioUrl: poi.audioUrl || '',
            priceSingle: poi.priceSingle,
            durationSec: poi.durationSec,
            translations: this.catalogPoiTranslationsFormValue(poi.translations)
        });
        if (!this.editCatalogPoiDialog) {
            return;
        }
        this.editCatalogPoiDialogRef?.close();
        this.editCatalogPoiDialogRef = this.dialog.open(this.editCatalogPoiDialog, {
            width: '980px',
            maxWidth: '96vw'
        });
    }
    saveCatalogPoi() {
        if (!this.canManageCatalog || this.savingCatalogPoi || this.catalogPoiForm.invalid) {
            this.catalogPoiForm.markAllAsTouched();
            return;
        }
        const payload = this.toCatalogPoiPayload(this.catalogPoiForm.getRawValue());
        this.savingCatalogPoi = true;
        this.auth.createCatalogPoi(payload).subscribe({
            next: (poi) => {
                this.savingCatalogPoi = false;
                this.snackBar.open('Punto interesse creato', 'OK', { duration: 2400 });
                this.selectedCatalogCityId = poi.cityId;
                this.closeCreateCatalogPoiDialog();
                this.loadCatalogCities();
                this.loadCatalogPois(poi.cityId, { force: true });
            },
            error: (error) => {
                this.savingCatalogPoi = false;
                const message = error?.error?.message || 'Errore salvataggio luogo di interesse';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    closeCatalogPoiEditDialog() {
        this.editCatalogPoiDialogRef?.close();
        this.editCatalogPoiDialogRef = undefined;
        this.editingCatalogPoiId = null;
        this.uploadingCatalogPoiEditImage = false;
        this.uploadingCatalogPoiEditAudio = false;
        this.resetCatalogPoiTranslationAudioUploadState('edit');
        this.catalogPoiEditForm.reset({
            cityId: this.selectedCatalogCityId || '',
            name: '',
            address: '',
            lat: 0,
            lng: 0,
            category: this.poiCategoryOptions[0],
            descriptionShort: '',
            descriptionLong: '',
            imageUrl: '',
            audioUrl: '',
            priceSingle: 0,
            durationSec: 60,
            translations: this.emptyCatalogPoiTranslationsFormValue()
        });
    }
    saveCatalogPoiEdit() {
        if (!this.canManageCatalog || !this.editingCatalogPoiId || this.savingCatalogPoi || this.catalogPoiEditForm.invalid) {
            this.catalogPoiEditForm.markAllAsTouched();
            return;
        }
        const payload = this.toCatalogPoiPayload(this.catalogPoiEditForm.getRawValue());
        this.savingCatalogPoi = true;
        this.auth.updateCatalogPoi(this.editingCatalogPoiId, payload).subscribe({
            next: (poi) => {
                this.savingCatalogPoi = false;
                this.snackBar.open('Punto interesse aggiornato', 'OK', { duration: 2400 });
                this.selectedCatalogCityId = poi.cityId;
                this.closeCatalogPoiEditDialog();
                this.loadCatalogCities();
                this.loadCatalogPois(poi.cityId, { force: true });
            },
            error: (error) => {
                this.savingCatalogPoi = false;
                const message = error?.error?.message || 'Errore aggiornamento luogo di interesse';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    deleteCatalogPoi(poi) {
        if (!this.canManageCatalog || this.deletingCatalogPoiId) {
            return;
        }
        const confirmed = window.confirm(`Eliminare il luogo di interesse "${poi.name}"?`);
        if (!confirmed) {
            return;
        }
        this.deletingCatalogPoiId = poi.id;
        this.auth.deleteCatalogPoi(poi.id).subscribe({
            next: () => {
                this.deletingCatalogPoiId = null;
                if (this.editingCatalogPoiId === poi.id) {
                    this.closeCatalogPoiEditDialog();
                }
                this.snackBar.open('Luogo di interesse eliminato', 'OK', { duration: 2400 });
                this.loadCatalogCities();
                this.loadCatalogPois(poi.cityId, { force: true });
            },
            error: (error) => {
                this.deletingCatalogPoiId = null;
                const message = error?.error?.message || 'Errore eliminazione luogo di interesse';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    onCatalogAudioFileSelected(event) {
        const target = event.target;
        const file = target?.files?.[0];
        if (!file) {
            return;
        }
        if (this.isFileLargerThan(file, this.maxCatalogAudioUploadBytes, 'audio')) {
            target.value = '';
            return;
        }
        const fileDurationPromise = this.readAudioDurationFromFile(file);
        const mediaTarget = this.resolvePoiMediaTarget(this.catalogPoiForm.controls.cityId.value);
        if (!mediaTarget) {
            this.snackBar.open('Seleziona prima una città per caricare l audio', 'Chiudi', { duration: 3200 });
            target.value = '';
            return;
        }
        this.uploadCatalogPoiAudio(file, mediaTarget, (audioUrl) => {
            this.catalogPoiForm.controls.audioUrl.setValue(audioUrl);
            this.catalogPoiForm.controls.audioUrl.markAsDirty();
            this.applyDetectedDurationToControl(fileDurationPromise, this.catalogPoiForm.controls.durationSec, this.catalogPoiForm.controls.audioUrl.value);
        }, () => {
            this.uploadingCatalogAudio = true;
        }, () => {
            this.uploadingCatalogAudio = false;
            target.value = '';
        });
    }
    onCatalogImageFileSelected(event) {
        const target = event.target;
        const file = target?.files?.[0];
        if (!file) {
            return;
        }
        if (this.isFileLargerThan(file, this.maxCatalogImageUploadBytes, 'immagine')) {
            target.value = '';
            return;
        }
        const mediaTarget = this.resolvePoiMediaTarget(this.catalogPoiForm.controls.cityId.value);
        if (!mediaTarget) {
            this.snackBar.open('Seleziona prima una città per caricare l immagine', 'Chiudi', { duration: 3200 });
            target.value = '';
            return;
        }
        this.uploadCatalogImage(file, mediaTarget, (imageUrl) => {
            this.catalogPoiForm.controls.imageUrl.setValue(imageUrl);
            this.catalogPoiForm.controls.imageUrl.markAsDirty();
        }, () => {
            this.uploadingCatalogImage = true;
        }, () => {
            this.uploadingCatalogImage = false;
            target.value = '';
        });
    }
    onCatalogCityImageFileSelected(event) {
        const target = event.target;
        const file = target?.files?.[0];
        if (!file) {
            return;
        }
        if (this.isFileLargerThan(file, this.maxCatalogImageUploadBytes, 'immagine')) {
            target.value = '';
            return;
        }
        const cityName = this.catalogCityForm.controls.name.value.trim();
        if (!cityName) {
            this.snackBar.open('Inserisci prima il nome città', 'Chiudi', { duration: 3200 });
            target.value = '';
            return;
        }
        this.uploadCatalogImage(file, { cityName }, (imageUrl) => {
            this.catalogCityForm.controls.heroImage.setValue(imageUrl);
            this.catalogCityForm.controls.heroImage.markAsDirty();
        }, () => {
            this.uploadingCatalogCityImage = true;
        }, () => {
            this.uploadingCatalogCityImage = false;
            target.value = '';
        });
    }
    onCatalogCityEditImageFileSelected(event) {
        const target = event.target;
        const file = target?.files?.[0];
        if (!file) {
            return;
        }
        if (this.isFileLargerThan(file, this.maxCatalogImageUploadBytes, 'immagine')) {
            target.value = '';
            return;
        }
        const cityName = this.catalogCityEditForm.controls.name.value.trim();
        const mediaTarget = this.editingCatalogCityId
            ? { cityId: this.editingCatalogCityId }
            : { cityName };
        if (!mediaTarget.cityId && !mediaTarget.cityName) {
            this.snackBar.open('Nome città non valido per upload immagine', 'Chiudi', { duration: 3200 });
            target.value = '';
            return;
        }
        this.uploadCatalogImage(file, mediaTarget, (imageUrl) => {
            this.catalogCityEditForm.controls.heroImage.setValue(imageUrl);
            this.catalogCityEditForm.controls.heroImage.markAsDirty();
        }, () => {
            this.uploadingCatalogCityEditImage = true;
        }, () => {
            this.uploadingCatalogCityEditImage = false;
            target.value = '';
        });
    }
    onCatalogPoiEditImageFileSelected(event) {
        const target = event.target;
        const file = target?.files?.[0];
        if (!file) {
            return;
        }
        if (this.isFileLargerThan(file, this.maxCatalogImageUploadBytes, 'immagine')) {
            target.value = '';
            return;
        }
        const mediaTarget = this.resolvePoiMediaTarget(this.catalogPoiEditForm.controls.cityId.value);
        if (!mediaTarget) {
            this.snackBar.open('Seleziona prima una città per caricare l immagine', 'Chiudi', { duration: 3200 });
            target.value = '';
            return;
        }
        this.uploadCatalogImage(file, mediaTarget, (imageUrl) => {
            this.catalogPoiEditForm.controls.imageUrl.setValue(imageUrl);
            this.catalogPoiEditForm.controls.imageUrl.markAsDirty();
        }, () => {
            this.uploadingCatalogPoiEditImage = true;
        }, () => {
            this.uploadingCatalogPoiEditImage = false;
            target.value = '';
        });
    }
    onCatalogPoiEditAudioFileSelected(event) {
        const target = event.target;
        const file = target?.files?.[0];
        if (!file) {
            return;
        }
        if (this.isFileLargerThan(file, this.maxCatalogAudioUploadBytes, 'audio')) {
            target.value = '';
            return;
        }
        const fileDurationPromise = this.readAudioDurationFromFile(file);
        const mediaTarget = this.resolvePoiMediaTarget(this.catalogPoiEditForm.controls.cityId.value);
        if (!mediaTarget) {
            this.snackBar.open('Seleziona prima una città per caricare l audio', 'Chiudi', { duration: 3200 });
            target.value = '';
            return;
        }
        this.uploadCatalogPoiAudio(file, mediaTarget, (audioUrl) => {
            this.catalogPoiEditForm.controls.audioUrl.setValue(audioUrl);
            this.catalogPoiEditForm.controls.audioUrl.markAsDirty();
            this.applyDetectedDurationToControl(fileDurationPromise, this.catalogPoiEditForm.controls.durationSec, this.catalogPoiEditForm.controls.audioUrl.value);
        }, () => {
            this.uploadingCatalogPoiEditAudio = true;
        }, () => {
            this.uploadingCatalogPoiEditAudio = false;
            target.value = '';
        });
    }
    onCatalogPoiTranslationAudioFileSelected(event, language, target) {
        const input = event.target;
        const file = input?.files?.[0];
        if (!file) {
            return;
        }
        if (this.isFileLargerThan(file, this.maxCatalogAudioUploadBytes, 'audio')) {
            input.value = '';
            return;
        }
        const form = this.catalogPoiFormForTarget(target);
        const fileDurationPromise = this.readAudioDurationFromFile(file);
        const mediaTarget = this.resolvePoiMediaTarget(form.controls.cityId.value);
        if (!mediaTarget) {
            this.snackBar.open('Seleziona prima una città per caricare l audio', 'Chiudi', { duration: 3200 });
            input.value = '';
            return;
        }
        this.uploadCatalogPoiAudio(file, mediaTarget, (audioUrl) => {
            const audioControl = this.catalogPoiTranslationAudioControl(target, language);
            audioControl.setValue(audioUrl);
            audioControl.markAsDirty();
            this.applyDetectedDurationToControl(fileDurationPromise, form.controls.durationSec, audioUrl);
        }, () => {
            this.setCatalogPoiTranslationAudioUploading(target, language, true);
        }, () => {
            this.setCatalogPoiTranslationAudioUploading(target, language, false);
            input.value = '';
        });
    }
    clearCatalogCityImage() {
        this.catalogCityForm.controls.heroImage.setValue('');
        this.catalogCityForm.controls.heroImage.markAsDirty();
    }
    clearCatalogCityEditImage() {
        this.catalogCityEditForm.controls.heroImage.setValue('');
        this.catalogCityEditForm.controls.heroImage.markAsDirty();
    }
    clearCatalogPoiImage() {
        this.catalogPoiForm.controls.imageUrl.setValue('');
        this.catalogPoiForm.controls.imageUrl.markAsDirty();
    }
    clearCatalogPoiEditImage() {
        this.catalogPoiEditForm.controls.imageUrl.setValue('');
        this.catalogPoiEditForm.controls.imageUrl.markAsDirty();
    }
    clearCatalogPoiAudio() {
        this.catalogPoiForm.controls.audioUrl.setValue('');
        this.catalogPoiForm.controls.audioUrl.markAsDirty();
    }
    clearCatalogPoiEditAudio() {
        this.catalogPoiEditForm.controls.audioUrl.setValue('');
        this.catalogPoiEditForm.controls.audioUrl.markAsDirty();
    }
    clearCatalogPoiTranslationAudio(language, target) {
        const audioControl = this.catalogPoiTranslationAudioControl(target, language);
        audioControl.setValue('');
        audioControl.markAsDirty();
    }
    catalogPoiTranslationAudioUrl(language, target) {
        return this.catalogPoiTranslationAudioControl(target, language).value;
    }
    isCatalogPoiTranslationAudioUploading(language, target) {
        return target === 'edit'
            ? this.uploadingCatalogPoiEditTranslationAudio[language]
            : this.uploadingCatalogPoiTranslationAudio[language];
    }
    hasUserDraftChanges(user) {
        if (this.isReadOnlyAppUser(user)) {
            return false;
        }
        if (user.role === 'admin') {
            return false;
        }
        const nextInviteCode = this.getNextInviteCodeForSave(user);
        const currentInviteCode = this.getCurrentInviteCode(user);
        return nextInviteCode !== currentInviteCode;
    }
    canSaveUser(user) {
        if (this.isReadOnlyAppUser(user)) {
            return false;
        }
        if (!this.canManageUsers) {
            return false;
        }
        if (this.savingUserId !== null) {
            return false;
        }
        if (!this.hasUserDraftChanges(user)) {
            return false;
        }
        const nextInviteCode = this.getNextInviteCodeForSave(user);
        if (nextInviteCode !== null && nextInviteCode.length !== 6) {
            return false;
        }
        if (this.roleNeedsStructure(user.role) && !nextInviteCode) {
            return false;
        }
        return true;
    }
    saveUserChanges(user) {
        if (this.isReadOnlyAppUser(user)) {
            return;
        }
        if (!this.canManageUsers || this.savingUserId) {
            return;
        }
        const nextInviteCode = this.getNextInviteCodeForSave(user);
        if (nextInviteCode !== null && nextInviteCode.length !== 6) {
            this.snackBar.open('Il codice struttura deve avere 6 caratteri alfanumerici', 'Chiudi', { duration: 3200 });
            return;
        }
        if (this.roleNeedsStructure(user.role) && !nextInviteCode) {
            this.snackBar.open('Per un gestore devi inserire un codice struttura valido', 'Chiudi', { duration: 3200 });
            return;
        }
        if (!this.hasUserDraftChanges(user)) {
            return;
        }
        this.savingUserId = user.id;
        this.auth.updateUserStructure(user.id, null, nextInviteCode).subscribe({
            next: (updated) => {
                this.savingUserId = null;
                this.users = this.users.map((item) => (item.id === updated.id ? updated : item));
                this.structureInviteCodeDraftByUserId[updated.id] = updated.structureInviteCode || '';
                this.snackBar.open(`Utente aggiornato: ${this.displayName(updated.firstName, updated.lastName, updated.email)}`, 'OK', {
                    duration: 2400
                });
                this.loadStructures();
            },
            error: (error) => {
                this.savingUserId = null;
                this.structureInviteCodeDraftByUserId[user.id] = user.structureInviteCode || '';
                const message = error?.error?.message || 'Errore durante il salvataggio utente';
                this.snackBar.open(message, 'Chiudi', { duration: 3200 });
            }
        });
    }
    sendPasswordReset(user) {
        if (this.isReadOnlyAppUser(user)) {
            return;
        }
        if (!this.canManageUsers || this.resettingPasswordUserId || !user.isRegistered) {
            return;
        }
        this.resettingPasswordUserId = user.id;
        this.auth.sendUserPasswordReset(user.id, window.location.origin).subscribe({
            next: () => {
                this.resettingPasswordUserId = null;
                this.snackBar.open(`Email reset password inviata a ${user.email}`, 'OK', {
                    duration: 3200
                });
            },
            error: (error) => {
                this.resettingPasswordUserId = null;
                const message = error?.error?.message || 'Errore invio reset password';
                this.snackBar.open(message, 'Chiudi', { duration: 3500 });
            }
        });
    }
    deleteUser(user) {
        if (this.isReadOnlyAppUser(user)) {
            return;
        }
        if (!this.canManageUsers || this.deletingUserId) {
            return;
        }
        const confirmed = window.confirm(`Eliminare l'utente ${this.displayName(user.firstName, user.lastName, user.email)}?`);
        if (!confirmed) {
            return;
        }
        this.deletingUserId = user.id;
        this.auth.deleteUser(user.id).subscribe({
            next: () => {
                this.deletingUserId = null;
                this.users = this.users.filter((item) => item.id !== user.id);
                delete this.structureInviteCodeDraftByUserId[user.id];
                this.snackBar.open('Utente eliminato', 'OK', { duration: 2400 });
                this.loadStructures();
            },
            error: (error) => {
                this.deletingUserId = null;
                const message = error?.error?.message || 'Errore eliminazione utente';
                this.snackBar.open(message, 'Chiudi', { duration: 3200 });
            }
        });
    }
    impersonate(user) {
        if (this.isReadOnlyAppUser(user)) {
            return;
        }
        if (!this.canManageUsers || this.impersonatingUserId) {
            return;
        }
        this.impersonatingUserId = user.id;
        this.auth.impersonateUser(user.id).subscribe({
            next: () => {
                this.impersonatingUserId = null;
                this.syncDashboardDataForCurrentRole();
                this.snackBar.open(`Stai navigando come ${this.displayName(user.firstName, user.lastName, user.email)}`, 'OK', {
                    duration: 2400
                });
            },
            error: (error) => {
                this.impersonatingUserId = null;
                const message = error?.error?.message || 'Errore durante impersonazione';
                this.snackBar.open(message, 'Chiudi', { duration: 3200 });
            }
        });
    }
    exitImpersonation() {
        this.auth.exitImpersonation().subscribe({
            next: () => {
                this.syncDashboardDataForCurrentRole();
                this.snackBar.open('Tornato all account admin', 'OK', { duration: 2400 });
            },
            error: (error) => {
                const message = error?.error?.message || 'Impossibile uscire dalla modalita impersonazione';
                this.snackBar.open(message, 'Chiudi', { duration: 3200 });
            }
        });
    }
    logout() {
        this.auth.logout().subscribe(() => {
            this.isAuthenticated = false;
            this.users = [];
            this.structures = [];
            this.discountCodes = [];
            this.discountCodesByStructureId = {};
            this.discountCodeGroups = [];
            this.associatedUsers = [];
            this.payments = [];
            this.partnerRequests = [];
            this.payPalSettings = null;
            this.openAiTranslationSettings = null;
            this.openAiTranslationStatusRows = [];
            this.selectedGptTranslationPoiId = '';
            this.resetGptTranslationProgress();
            this.paymentsSummary = {
                totalPayments: 0,
                totalCollected: 0,
                totalDiscountAmount: 0,
                totalStructureEarnings: 0
            };
            this.catalogCities = [];
            this.hasLoadedCatalogCitiesOnce = false;
            this.catalogPois = [];
            this.selectedCatalogCityId = '';
            this.lastLoadedCatalogPoisCityId = '';
            this.catalogPoisRequestToken = 0;
            this.openAiTranslationStatusRequestToken = 0;
            this.catalogTab = 'cities';
            this.editingCatalogCityId = null;
            this.editingCatalogPoiId = null;
            this.editingCatalogCityIsDefault = false;
            this.createCatalogCityDialogRef?.close();
            this.createCatalogPoiDialogRef?.close();
            this.editCatalogCityDialogRef?.close();
            this.editCatalogPoiDialogRef?.close();
            this.createDiscountCodeDialogRef?.close();
            this.editDiscountCodeDialogRef?.close();
            this.partnerRequestApprovalDialogRef?.close();
            this.catalogPoiAudioPlayerDialogRef?.close();
            this.poiMapPickerDialogRef?.close();
            this.createCatalogCityDialogRef = undefined;
            this.createCatalogPoiDialogRef = undefined;
            this.editCatalogCityDialogRef = undefined;
            this.editCatalogPoiDialogRef = undefined;
            this.createDiscountCodeDialogRef = undefined;
            this.editDiscountCodeDialogRef = undefined;
            this.partnerRequestApprovalDialogRef = undefined;
            this.catalogPoiAudioPlayerDialogRef = undefined;
            this.poiMapPickerDialogRef = undefined;
            this.audioPlayerPoiName = '';
            this.audioPlayerFileName = '';
            this.audioPlayerUrl = '';
            this.mapPickerTarget = null;
            this.mapPickerTargetLabel = '';
            this.mapPickerLoading = false;
            this.mapPickerMapReady = false;
            this.mapPickerResults = [];
            this.mapPickerSelectedLat = null;
            this.mapPickerSelectedLng = null;
            this.destroyPoiMap();
            this.lastInvite = null;
            this.loggingIn = false;
            this.inviting = false;
            this.creatingUser = false;
            this.loadingUsers = false;
            this.loadingStructures = false;
            this.loadingAssociatedUsers = false;
            this.loadingPayments = false;
            this.loadingPartnerRequests = false;
            this.loadingPayPalSettings = false;
            this.loadingOpenAiTranslationSettings = false;
            this.loadingOpenAiTranslationStatus = false;
            this.creatingStructure = false;
            this.updatingStructure = false;
            this.loadingDiscountCodes = false;
            this.creatingDiscountCode = false;
            this.updatingDiscountCode = false;
            this.savingPayPalSettings = false;
            this.savingOpenAiTranslationSettings = false;
            this.bulkTranslatingPois = false;
            this.testingPayPalSettings = false;
            this.loadingCatalogCities = false;
            this.loadingCatalogPois = false;
            this.savingCatalogCity = false;
            this.savingCatalogPoi = false;
            this.uploadingCatalogAudio = false;
            this.uploadingCatalogCityImage = false;
            this.uploadingCatalogImage = false;
            this.resetCatalogPoiTranslationAudioUploadState('create');
            this.uploadingCatalogCityEditImage = false;
            this.uploadingCatalogPoiEditImage = false;
            this.uploadingCatalogPoiEditAudio = false;
            this.resetCatalogPoiTranslationAudioUploadState('edit');
            this.deletingCatalogCityId = null;
            this.deletingCatalogPoiId = null;
            this.partnerRequestApprovalTarget = null;
            this.approvingPartnerRequestId = null;
            this.rejectingPartnerRequestId = null;
            this.previewingPartnerRequestId = null;
            this.savingUserId = null;
            this.savingDiscountCodeId = null;
            this.deletingDiscountCodeId = null;
            this.resettingPasswordUserId = null;
            this.deletingUserId = null;
            this.impersonatingUserId = null;
            this.translatingPoiId = null;
            this.activeSection = 'users';
            this.showInviteSection = false;
            this.showCreateUserSection = false;
            this.showStructureSection = false;
            this.editingStructureId = null;
            this.editingDiscountCodeId = null;
            Object.keys(this.audioDurationByUrl).forEach((audioUrl) => {
                delete this.audioDurationByUrl[audioUrl];
            });
            this.pendingAudioDurationUrls.clear();
            this.invalidAudioDurationUrls.clear();
            Object.keys(this.structureInviteCodeDraftByUserId).forEach((userId) => {
                delete this.structureInviteCodeDraftByUserId[userId];
            });
            this.loginForm.reset();
            this.inviteForm.reset({
                firstName: '',
                lastName: '',
                email: '',
                role: 'facility_manager',
                structureId: this.noStructureValue
            });
            this.createUserForm.reset({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'user',
                structureId: this.noStructureValue
            });
            this.structureForm.reset({
                name: '',
                street: '',
                streetNumber: '',
                city: '',
                postalCode: '',
                province: '',
                country: 'Italia'
            });
            this.structureEditForm.reset({
                name: '',
                street: '',
                streetNumber: '',
                city: '',
                postalCode: '',
                province: '',
                country: 'Italia'
            });
            this.catalogCityForm.reset({
                name: '',
                region: this.fixedCreateCityRegion,
                bundlePrice: 0,
                heroImage: '',
                translations: this.emptyCatalogCityTranslationsFormValue()
            });
            this.catalogCityForm.controls.region.disable({ emitEvent: false });
            this.discountCodeCreateForm.reset({
                structureId: '',
                applyTo: 'bundle',
                cityIds: [],
                code: '',
                userDiscountPercent: 0,
                structureFixedAmount: 0,
                expiresAt: ''
            });
            this.discountCodeEditForm.reset({
                applyTo: 'bundle',
                cityIds: [],
                userDiscountPercent: 0,
                structureFixedAmount: 0,
                expiresAt: ''
            });
            this.payPalForm.reset({
                isEnabled: false,
                mode: 'sandbox',
                clientId: '',
                clientSecret: '',
                merchantId: '',
                merchantEmail: '',
                brandName: 'Walk Around',
                webhookId: ''
            });
            this.openAiTranslationSettingsForm.reset({
                apiKey: '',
                model: 'gpt-4o-mini'
            });
            this.gptTranslationForm.reset({
                cityId: '',
                targetLanguage: 'en',
                poiId: '',
                overwrite: false
            });
            this.catalogCityEditForm.reset({
                name: '',
                region: '',
                bundlePrice: 0,
                heroImage: '',
                translations: this.emptyCatalogCityTranslationsFormValue()
            });
            this.catalogPoiForm.reset({
                cityId: '',
                name: '',
                lat: 0,
                lng: 0,
                category: this.poiCategoryOptions[0],
                descriptionShort: '',
                descriptionLong: '',
                imageUrl: '',
                audioUrl: '',
                priceSingle: 0,
                durationSec: 60,
                translations: this.emptyCatalogPoiTranslationsFormValue()
            });
            this.catalogPoiEditForm.reset({
                cityId: '',
                name: '',
                lat: 0,
                lng: 0,
                category: this.poiCategoryOptions[0],
                descriptionShort: '',
                descriptionLong: '',
                imageUrl: '',
                audioUrl: '',
                priceSingle: 0,
                durationSec: 60,
                translations: this.emptyCatalogPoiTranslationsFormValue()
            });
            this.poiMapSearchForm.reset({
                query: ''
            });
            void this.router.navigate(['/dashboard']);
        });
    }
    roleLabel(role) {
        if (role === 'admin') {
            return 'Admin';
        }
        if (role === 'facility_manager') {
            return 'Gestore struttura';
        }
        return 'Utente normale';
    }
    isReadOnlyAppUser(user) {
        return user.accountType === 'app';
    }
    userAssociations(user) {
        const associations = Array.isArray(user.associatedStructures) ? user.associatedStructures : [];
        if (associations.length) {
            return associations;
        }
        if (user.structureId || user.structureName) {
            return [
                {
                    structureId: user.structureId || '',
                    structureName: user.structureName || null,
                    structureAddress: user.structureAddress || null,
                    inviteCode: user.structureInviteCode || null,
                    status: 'assigned',
                    associatedAt: user.createdAt || null,
                    usedAt: null,
                    updatedAt: user.updatedAt || null
                }
            ];
        }
        return [];
    }
    userUnlockedCities(user) {
        return Array.isArray(user.unlockedCities) ? user.unlockedCities : [];
    }
    userUnlockedPois(user) {
        return Array.isArray(user.unlockedPois) ? user.unlockedPois : [];
    }
    userAssociationStatusLabel(status) {
        if (status === 'active') {
            return 'Attivo';
        }
        if (status === 'used') {
            return 'Usato';
        }
        if (status === 'expired') {
            return 'Scaduto';
        }
        if (status === 'assigned') {
            return 'Assegnata';
        }
        return 'Non valido';
    }
    userAssociationStatusClass(status) {
        if (status === 'active' || status === 'assigned') {
            return 'association-status association-status-active';
        }
        if (status === 'used') {
            return 'association-status association-status-used';
        }
        if (status === 'expired') {
            return 'association-status association-status-expired';
        }
        return 'association-status association-status-invalid';
    }
    userAssociationStatusTooltip(status) {
        if (status === 'assigned') {
            return 'Assegnata: il codice è collegato all\'utente ma non è ancora stato riscattato.';
        }
        if (status === 'used') {
            return 'Usato: il codice è già stato riscattato e ha già generato lo sblocco.';
        }
        if (status === 'active') {
            return 'Attivo: codice valido e disponibile.';
        }
        if (status === 'expired') {
            return 'Scaduto: codice non più utilizzabile.';
        }
        return 'Non valido: codice non riconosciuto o non associabile.';
    }
    openUsersForStructure(structure) {
        if (!this.canManageUsers) {
            return;
        }
        this.selectedUsersStructureFilterId = structure.id;
        this.selectSection('users');
    }
    clearUsersStructureFilter() {
        this.selectedUsersStructureFilterId = null;
    }
    displayName(firstName, lastName, email = '') {
        const fullName = `${firstName || ''} ${lastName || ''}`.trim();
        return fullName || email;
    }
    formatStructureAddress(structure) {
        if (structure.street && structure.streetNumber && structure.city && structure.postalCode) {
            const provincePart = structure.province ? ` (${structure.province})` : '';
            const countryPart = structure.country ? `, ${structure.country}` : '';
            return `${structure.street} ${structure.streetNumber}, ${structure.postalCode} ${structure.city}${provincePart}${countryPart}`;
        }
        return structure.address;
    }
    formatDateTime(value) {
        if (!value) {
            return '-';
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '-';
        }
        return this.italianDateTimeFormatter.format(date);
    }
    discountCodeExpiryStatus(value) {
        if (!value) {
            return 'unknown';
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return 'unknown';
        }
        return date.getTime() > Date.now() ? 'active' : 'expired';
    }
    formatCurrency(value) {
        const amount = Number(value);
        if (!Number.isFinite(amount)) {
            return '-';
        }
        return this.italianCurrencyFormatter.format(amount);
    }
    audioFileNameFromUrl(audioUrl) {
        const normalized = this.normalizeAudioUrl(audioUrl);
        if (!normalized) {
            return '-';
        }
        const cleanPath = normalized.split('?')[0].split('#')[0];
        const segments = cleanPath.split('/').filter(Boolean);
        const fileName = segments.length ? segments[segments.length - 1] : cleanPath;
        if (!fileName) {
            return '-';
        }
        try {
            return decodeURIComponent(fileName);
        }
        catch {
            return fileName;
        }
    }
    formatCatalogPoiDuration(poi) {
        const normalizedAudioUrl = this.normalizeAudioUrl(poi.audioUrl);
        if (!normalizedAudioUrl) {
            return '-';
        }
        if (normalizedAudioUrl && this.invalidAudioDurationUrls.has(normalizedAudioUrl)) {
            return 'Audio non valido';
        }
        if (this.pendingAudioDurationUrls.has(normalizedAudioUrl)) {
            return '...';
        }
        const durationSec = this.resolvePoiDurationSeconds(poi);
        if (!Number.isFinite(durationSec) || durationSec === null || durationSec <= 0) {
            return '-';
        }
        const safeSeconds = Math.round(durationSec);
        const minutes = Math.floor(safeSeconds / 60);
        const seconds = safeSeconds % 60;
        return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
    }
    openCatalogPoiAudioPlayer(poi) {
        const normalizedAudioUrl = this.normalizeAudioUrl(poi.audioUrl);
        if (!normalizedAudioUrl || !this.catalogPoiAudioPlayerDialog) {
            this.snackBar.open('Nessun audio disponibile per questo luogo', 'Chiudi', { duration: 2600 });
            return;
        }
        this.audioPlayerPoiName = poi.name;
        this.audioPlayerUrl = normalizedAudioUrl;
        this.audioPlayerFileName = this.audioFileNameFromUrl(normalizedAudioUrl);
        this.catalogPoiAudioPlayerDialogRef?.close();
        this.catalogPoiAudioPlayerDialogRef = this.dialog.open(this.catalogPoiAudioPlayerDialog, {
            width: '640px',
            maxWidth: '95vw'
        });
        this.catalogPoiAudioPlayerDialogRef.afterClosed().subscribe(() => {
            this.audioPlayerPoiName = '';
            this.audioPlayerFileName = '';
            this.audioPlayerUrl = '';
        });
    }
    closeCatalogPoiAudioPlayer() {
        this.catalogPoiAudioPlayerDialogRef?.close();
        this.catalogPoiAudioPlayerDialogRef = undefined;
        this.audioPlayerPoiName = '';
        this.audioPlayerFileName = '';
        this.audioPlayerUrl = '';
    }
    cityDisplayName(cityId) {
        const city = this.catalogCities.find((item) => item.id === cityId);
        return city ? city.name : cityId;
    }
    poiCategoryOptionsFor(currentValue) {
        const current = String(currentValue || '').trim();
        if (!current || this.poiCategoryOptions.includes(current)) {
            return this.poiCategoryOptions;
        }
        return [...this.poiCategoryOptions, current];
    }
    paymentTargetLabel(payment) {
        if (payment.targetName) {
            return payment.targetName;
        }
        if (payment.type === 'bundle') {
            return payment.cityName || payment.cityId || 'Città';
        }
        return payment.poiName || payment.poiId || 'Luogo';
    }
    trackByPaymentId(_index, payment) {
        return payment.id;
    }
    trackByCatalogPoiId(_index, poi) {
        return poi.id;
    }
    trackByPartnerRequestId(_index, request) {
        return request.id;
    }
    structureCodes(structureId) {
        return this.discountCodesByStructureId[structureId] || [];
    }
    discountCodeApplyToLabel(applyTo) {
        return applyTo === 'bundle' ? 'Pacchetto città' : 'Luogo singolo';
    }
    discountCodeCitiesLabel(discountCode) {
        const names = Array.isArray(discountCode.cityNames) ? discountCode.cityNames.filter(Boolean) : [];
        if (names.length) {
            return names.join(', ');
        }
        const ids = Array.isArray(discountCode.cityIds) ? discountCode.cityIds.filter(Boolean) : [];
        if (ids.length) {
            return ids.map((cityId) => this.cityDisplayName(cityId) || cityId).join(', ');
        }
        if (discountCode.cityName) {
            return discountCode.cityName;
        }
        if (discountCode.cityId) {
            return this.cityDisplayName(discountCode.cityId) || discountCode.cityId;
        }
        return 'Tutte';
    }
    refreshAll() {
        this.loadStructures();
        this.loadUsers();
        if (this.activeSection === 'discounts' || this.activeSection === 'structures') {
            this.loadDiscountCodes();
        }
        if (this.activeSection === 'partnerRequests' && this.canManageUsers) {
            this.loadPartnerRequests();
        }
        if (this.activeSection === 'payments') {
            this.loadPayments();
        }
        if (this.activeSection === 'paypal') {
            this.loadPayPalSettings();
        }
        if (this.activeSection === 'gptTranslations') {
            this.ensureGptTranslationsLoaded();
        }
        if (this.activeSection === 'catalog') {
            this.loadCatalogCities();
        }
    }
    showDashboardMessagesFromQuery() {
        const query = this.route.snapshot.queryParamMap;
        let consumed = false;
        if (query.get('alreadyRegistered') === '1') {
            this.snackBar.open('Utente gia registrato. Effettua il login.', 'OK', { duration: 3200 });
            consumed = true;
        }
        else if (query.get('registered') === '1') {
            this.snackBar.open('Registrazione completata. Ora effettua il login.', 'OK', { duration: 3200 });
            consumed = true;
        }
        else if (query.get('passwordReset') === '1') {
            this.snackBar.open('Password aggiornata. Effettua il login.', 'OK', { duration: 3200 });
            consumed = true;
        }
        if (consumed) {
            void this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {},
                replaceUrl: true
            });
        }
    }
    toCatalogCityPayload(value, isDefault) {
        return {
            name: value.name.trim(),
            region: value.region.trim(),
            bundlePrice: Number(value.bundlePrice),
            heroImage: value.heroImage.trim(),
            isDefault: Boolean(isDefault),
            translations: this.buildCatalogCityTranslationsPayload(value.translations)
        };
    }
    toCatalogPoiPayload(value) {
        const normalizedAudioUrl = value.audioUrl.trim();
        const cachedDuration = this.audioDurationByUrl[normalizedAudioUrl];
        const resolvedDuration = Number.isFinite(cachedDuration) && cachedDuration > 0
            ? cachedDuration
            : Number(value.durationSec);
        return {
            cityId: value.cityId,
            name: value.name.trim(),
            address: value.address.trim(),
            lat: Number(value.lat),
            lng: Number(value.lng),
            category: value.category.trim(),
            descriptionShort: value.descriptionShort.trim(),
            descriptionLong: value.descriptionLong.trim(),
            imageUrl: value.imageUrl.trim(),
            audioUrl: normalizedAudioUrl,
            priceSingle: Number(value.priceSingle),
            durationSec: Math.max(1, Math.round(resolvedDuration)),
            translations: this.buildCatalogPoiTranslationsPayload(value.translations)
        };
    }
    emptyCatalogCityTranslationsFormValue() {
        return {
            en: { name: '' },
            fr: { name: '' },
            es: { name: '' }
        };
    }
    emptyCatalogPoiTranslationsFormValue() {
        return {
            en: {
                descriptionShort: '',
                descriptionLong: '',
                audioUrl: ''
            },
            fr: {
                descriptionShort: '',
                descriptionLong: '',
                audioUrl: ''
            },
            es: {
                descriptionShort: '',
                descriptionLong: '',
                audioUrl: ''
            }
        };
    }
    catalogCityTranslationsFormValue(translations) {
        return {
            en: { name: String(translations?.en?.name || '') },
            fr: { name: String(translations?.fr?.name || '') },
            es: { name: String(translations?.es?.name || '') }
        };
    }
    catalogPoiTranslationsFormValue(translations) {
        return {
            en: {
                descriptionShort: String(translations?.en?.descriptionShort || ''),
                descriptionLong: String(translations?.en?.descriptionLong || ''),
                audioUrl: String(translations?.en?.audioUrl || '')
            },
            fr: {
                descriptionShort: String(translations?.fr?.descriptionShort || ''),
                descriptionLong: String(translations?.fr?.descriptionLong || ''),
                audioUrl: String(translations?.fr?.audioUrl || '')
            },
            es: {
                descriptionShort: String(translations?.es?.descriptionShort || ''),
                descriptionLong: String(translations?.es?.descriptionLong || ''),
                audioUrl: String(translations?.es?.audioUrl || '')
            }
        };
    }
    buildCatalogCityTranslationsPayload(value) {
        const translations = {};
        this.contentLanguages.forEach(({ code }) => {
            const name = this.normalizeTranslationValue(value?.[code]?.name);
            if (name) {
                translations[code] = { name };
            }
        });
        return Object.keys(translations).length ? translations : undefined;
    }
    buildCatalogPoiTranslationsPayload(value) {
        const translations = {};
        this.contentLanguages.forEach(({ code }) => {
            const descriptionShort = this.normalizeTranslationValue(value?.[code]?.descriptionShort);
            const descriptionLong = this.normalizeTranslationValue(value?.[code]?.descriptionLong);
            const audioUrl = this.normalizeTranslationValue(value?.[code]?.audioUrl);
            if (descriptionShort || descriptionLong || audioUrl) {
                translations[code] = {
                    ...(descriptionShort ? { descriptionShort } : {}),
                    ...(descriptionLong ? { descriptionLong } : {}),
                    ...(audioUrl ? { audioUrl } : {})
                };
            }
        });
        return Object.keys(translations).length ? translations : undefined;
    }
    normalizeTranslationValue(value) {
        const normalized = String(value || '').trim();
        return normalized || undefined;
    }
    ensureGptTranslationCitySelection() {
        if (!this.catalogCities.length) {
            this.gptTranslationForm.controls.cityId.setValue('', { emitEvent: false });
            return '';
        }
        const currentCityId = this.gptTranslationForm.controls.cityId.value;
        const currentIsValid = Boolean(currentCityId && this.catalogCities.some((city) => city.id === currentCityId));
        const selectedCatalogCityIsValid = Boolean(this.selectedCatalogCityId && this.catalogCities.some((city) => city.id === this.selectedCatalogCityId));
        const nextCityId = currentIsValid
            ? currentCityId
            : selectedCatalogCityIsValid
                ? this.selectedCatalogCityId
                : this.catalogCities[0]?.id || '';
        if (nextCityId !== currentCityId) {
            this.gptTranslationForm.controls.cityId.setValue(nextCityId, { emitEvent: false });
        }
        if (nextCityId && this.selectedCatalogCityId !== nextCityId) {
            this.selectedCatalogCityId = nextCityId;
        }
        return nextCityId;
    }
    ensureSelectedGptTranslationPoi() {
        const selectedPoiId = this.gptTranslationForm.controls.poiId.value;
        const selectedStillExists = Boolean(selectedPoiId && this.openAiTranslationStatusRows.some((row) => row.poiId === selectedPoiId));
        if (selectedStillExists) {
            this.selectedGptTranslationPoiId = selectedPoiId;
            return;
        }
        const firstMissing = this.openAiTranslationStatusRows.find((row) => !row.isComplete);
        const nextPoiId = firstMissing?.poiId || this.openAiTranslationStatusRows[0]?.poiId || '';
        this.selectedGptTranslationPoiId = nextPoiId;
        this.gptTranslationForm.controls.poiId.setValue(nextPoiId, { emitEvent: false });
    }
    resetGptTranslationProgress(total = 0) {
        this.gptTranslationProgressTotal = total;
        this.gptTranslationProgressDone = 0;
        this.gptTranslationUsage = {
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0
        };
        this.gptTranslationLog = [];
    }
    applyOpenAiTranslationResponse(response) {
        const index = this.catalogPois.findIndex((poi) => poi.id === response.poi.id);
        if (index < 0) {
            return;
        }
        const nextPois = [...this.catalogPois];
        nextPois[index] = response.poi;
        this.catalogPois = nextPois;
    }
    addGptTranslationUsage(usage) {
        this.gptTranslationUsage = {
            inputTokens: this.gptTranslationUsage.inputTokens + Number(usage?.inputTokens || 0),
            outputTokens: this.gptTranslationUsage.outputTokens + Number(usage?.outputTokens || 0),
            totalTokens: this.gptTranslationUsage.totalTokens + Number(usage?.totalTokens || 0)
        };
    }
    dashboardErrorMessage(error, fallback) {
        const candidate = error;
        return candidate?.error?.message || candidate?.message || fallback;
    }
    sortPartnerRequests(rows) {
        return [...rows].sort((left, right) => {
            const priority = (status) => {
                if (status === 'pending') {
                    return 0;
                }
                if (status === 'approved') {
                    return 1;
                }
                if (status === 'rejected') {
                    return 2;
                }
                return 3;
            };
            const byStatus = priority(left.status) - priority(right.status);
            if (byStatus !== 0) {
                return byStatus;
            }
            const rightDate = Date.parse(right.createdAt || '');
            const leftDate = Date.parse(left.createdAt || '');
            if (Number.isFinite(rightDate) && Number.isFinite(leftDate) && rightDate !== leftDate) {
                return rightDate - leftDate;
            }
            return right.id - left.id;
        });
    }
    catalogPoiFormForTarget(target) {
        return target === 'edit' ? this.catalogPoiEditForm : this.catalogPoiForm;
    }
    catalogPoiTranslationAudioControl(target, language) {
        return this.catalogPoiFormForTarget(target).controls.translations.controls[language].controls.audioUrl;
    }
    hasCatalogPoiTranslationAudioUploadInProgress(target) {
        return this.contentLanguages.some(({ code }) => this.isCatalogPoiTranslationAudioUploading(code, target));
    }
    resetCatalogPoiTranslationAudioUploadState(target) {
        this.contentLanguages.forEach(({ code }) => {
            this.setCatalogPoiTranslationAudioUploading(target, code, false);
        });
    }
    setCatalogPoiTranslationAudioUploading(target, language, value) {
        if (target === 'edit') {
            this.uploadingCatalogPoiEditTranslationAudio[language] = value;
            return;
        }
        this.uploadingCatalogPoiTranslationAudio[language] = value;
    }
    async initializePoiMap() {
        try {
            await this.ensureLeafletLoaded();
        }
        catch (_error) {
            this.mapPickerMapReady = false;
            this.snackBar.open('Impossibile caricare la mappa interattiva', 'Chiudi', { duration: 3500 });
            return;
        }
        const mapElement = this.poiMapCanvas?.nativeElement;
        const leaflet = window.L;
        if (!mapElement || !leaflet) {
            this.mapPickerMapReady = false;
            return;
        }
        this.destroyPoiMap();
        this.poiMapInstance = leaflet.map(mapElement, {
            zoomControl: true,
            attributionControl: true
        });
        leaflet
            .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        })
            .addTo(this.poiMapInstance);
        const markerIcon = leaflet.divIcon({
            className: 'poi-map-pin',
            html: '<span style="display:block;width:16px;height:16px;border-radius:50%;background:#d7302f;border:2px solid #fff;box-shadow:0 0 0 2px rgba(125,26,26,.36);"></span>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        this.poiMapMarker = leaflet.marker([this.mapPickerSelectedLat ?? 41.902782, this.mapPickerSelectedLng ?? 12.496366], {
            draggable: true,
            icon: markerIcon
        });
        this.poiMapMarker.addTo(this.poiMapInstance);
        this.poiMapMarker.on('dragend', () => {
            const position = this.poiMapMarker.getLatLng();
            this.mapPickerSelectedLat = Number(position.lat);
            this.mapPickerSelectedLng = Number(position.lng);
        });
        this.poiMapInstance.on('click', (event) => {
            if (!event?.latlng) {
                return;
            }
            this.updatePoiMapMarker(event.latlng.lat, event.latlng.lng, false);
        });
        this.updatePoiMapMarker(this.mapPickerSelectedLat ?? 41.902782, this.mapPickerSelectedLng ?? 12.496366, true);
        this.mapPickerMapReady = true;
        setTimeout(() => {
            this.poiMapInstance?.invalidateSize();
        }, 80);
    }
    updatePoiMapMarker(lat, lng, centerMap) {
        this.mapPickerSelectedLat = Number(lat);
        this.mapPickerSelectedLng = Number(lng);
        if (this.poiMapMarker) {
            this.poiMapMarker.setLatLng([lat, lng]);
        }
        if (centerMap && this.poiMapInstance) {
            this.poiMapInstance.setView([lat, lng], 16);
        }
    }
    destroyPoiMap() {
        if (this.poiMapInstance) {
            this.poiMapInstance.off();
            this.poiMapInstance.remove();
        }
        this.poiMapInstance = null;
        this.poiMapMarker = null;
        this.mapPickerMapReady = false;
    }
    ensureLeafletLoaded() {
        const leafletFromWindow = window.L;
        if (leafletFromWindow) {
            return Promise.resolve();
        }
        if (this.leafletLoaderPromise) {
            return this.leafletLoaderPromise;
        }
        this.leafletLoaderPromise = new Promise((resolve, reject) => {
            const existingScript = document.querySelector('script[data-leaflet-script="1"]');
            const onResolve = () => resolve();
            const onReject = () => reject(new Error('Leaflet non disponibile'));
            if (!document.querySelector('link[data-leaflet-css="1"]')) {
                const leafletCss = document.createElement('link');
                leafletCss.setAttribute('data-leaflet-css', '1');
                leafletCss.rel = 'stylesheet';
                leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(leafletCss);
            }
            if (existingScript) {
                if (window.L) {
                    onResolve();
                    return;
                }
                existingScript.addEventListener('load', onResolve, { once: true });
                existingScript.addEventListener('error', onReject, { once: true });
                return;
            }
            const leafletScript = document.createElement('script');
            leafletScript.setAttribute('data-leaflet-script', '1');
            leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            leafletScript.async = true;
            leafletScript.defer = true;
            leafletScript.addEventListener('load', onResolve, { once: true });
            leafletScript.addEventListener('error', onReject, { once: true });
            document.body.appendChild(leafletScript);
        });
        return this.leafletLoaderPromise;
    }
    uploadCatalogImage(file, target, onSuccess, onStart, onFinally) {
        onStart();
        this.readFileAsDataUrl(file)
            .then((dataUrl) => {
            const base64 = String(dataUrl).split(',')[1] || '';
            return firstValueFrom(this.auth.uploadCatalogPoiImage(file.name, file.type || 'image/jpeg', base64, target));
        })
            .then((response) => {
            if (!response?.imageUrl) {
                throw new Error('Upload immagine non riuscito');
            }
            onSuccess(response.imageUrl);
        })
            .catch((error) => {
            const message = error?.error?.message || error?.message || 'Errore upload immagine';
            this.snackBar.open(message, 'Chiudi', { duration: 3500 });
        })
            .finally(onFinally);
    }
    uploadCatalogPoiAudio(file, target, onSuccess, onStart, onFinally) {
        onStart();
        this.readFileAsDataUrl(file)
            .then((dataUrl) => {
            const base64 = String(dataUrl).split(',')[1] || '';
            return firstValueFrom(this.auth.uploadCatalogPoiAudio(file.name, file.type || 'audio/mpeg', base64, target));
        })
            .then((response) => {
            if (!response?.audioUrl) {
                throw new Error('Upload audio non riuscito');
            }
            onSuccess(response.audioUrl);
        })
            .catch((error) => {
            const message = error?.error?.message || error?.message || 'Errore upload audio';
            this.snackBar.open(message, 'Chiudi', { duration: 3500 });
        })
            .finally(onFinally);
    }
    readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('Impossibile leggere il file selezionato'));
            reader.readAsDataURL(file);
        });
    }
    isFileLargerThan(file, maxBytes, mediaLabel) {
        if (file.size <= maxBytes) {
            return false;
        }
        const maxMb = Math.round((maxBytes / (1024 * 1024)) * 10) / 10;
        this.snackBar.open(`File ${mediaLabel} troppo grande (max ${maxMb}MB)`, 'Chiudi', { duration: 3500 });
        return true;
    }
    normalizeAudioUrl(audioUrl) {
        return String(audioUrl || '').trim();
    }
    resolvePoiDurationSeconds(poi) {
        const normalizedAudioUrl = this.normalizeAudioUrl(poi.audioUrl);
        if (!normalizedAudioUrl) {
            return null;
        }
        if (this.invalidAudioDurationUrls.has(normalizedAudioUrl)) {
            return null;
        }
        const cachedDuration = this.audioDurationByUrl[normalizedAudioUrl];
        if (Number.isFinite(cachedDuration) && cachedDuration > 0) {
            return Math.round(cachedDuration);
        }
        return null;
    }
    preloadAudioDurationsForPois(pois) {
        const uniqueAudioUrls = new Set();
        pois.forEach((poi) => {
            const normalizedAudioUrl = this.normalizeAudioUrl(poi.audioUrl);
            if (normalizedAudioUrl) {
                uniqueAudioUrls.add(normalizedAudioUrl);
            }
        });
        uniqueAudioUrls.forEach((audioUrl) => {
            if (this.pendingAudioDurationUrls.has(audioUrl)) {
                return;
            }
            if (this.invalidAudioDurationUrls.has(audioUrl)) {
                return;
            }
            const cachedDuration = this.audioDurationByUrl[audioUrl];
            if (Number.isFinite(cachedDuration) && cachedDuration > 0) {
                return;
            }
            this.pendingAudioDurationUrls.add(audioUrl);
            this.readAudioDurationFromUrl(audioUrl)
                .then((durationSec) => {
                if (!durationSec || !Number.isFinite(durationSec) || durationSec <= 0) {
                    this.invalidAudioDurationUrls.add(audioUrl);
                    delete this.audioDurationByUrl[audioUrl];
                    return;
                }
                this.invalidAudioDurationUrls.delete(audioUrl);
                this.audioDurationByUrl[audioUrl] = Math.round(durationSec);
            })
                .finally(() => {
                this.pendingAudioDurationUrls.delete(audioUrl);
            });
        });
    }
    applyDetectedDurationToControl(durationPromise, control, audioUrl) {
        durationPromise
            .then((durationSec) => {
            if (!durationSec || !Number.isFinite(durationSec) || durationSec <= 0) {
                return;
            }
            const roundedDuration = Math.max(1, Math.round(durationSec));
            control.setValue(roundedDuration);
            control.markAsDirty();
            const normalizedAudioUrl = this.normalizeAudioUrl(audioUrl);
            if (normalizedAudioUrl) {
                this.invalidAudioDurationUrls.delete(normalizedAudioUrl);
                this.audioDurationByUrl[normalizedAudioUrl] = roundedDuration;
            }
        })
            .catch(() => {
            // Ignore local metadata read errors: upload result remains valid.
        });
    }
    readAudioDurationFromFile(file) {
        return new Promise((resolve) => {
            const objectUrl = URL.createObjectURL(file);
            const audioElement = new Audio();
            const cleanup = (result) => {
                audioElement.onloadedmetadata = null;
                audioElement.onerror = null;
                URL.revokeObjectURL(objectUrl);
                resolve(result);
            };
            audioElement.preload = 'metadata';
            audioElement.onloadedmetadata = () => {
                cleanup(Number(audioElement.duration || 0));
            };
            audioElement.onerror = () => cleanup(null);
            audioElement.src = objectUrl;
        });
    }
    readAudioDurationFromUrl(audioUrl) {
        return new Promise((resolve) => {
            const audioElement = new Audio();
            const onDone = (duration) => {
                audioElement.onloadedmetadata = null;
                audioElement.onerror = null;
                resolve(duration);
            };
            audioElement.preload = 'metadata';
            audioElement.onloadedmetadata = () => {
                onDone(Number(audioElement.duration || 0));
            };
            audioElement.onerror = () => onDone(null);
            audioElement.src = audioUrl;
        });
    }
    onStructureInviteCodeDraftChange(userId, value) {
        this.structureInviteCodeDraftByUserId[userId] = this.normalizeStructureInviteCode(value);
    }
    getCurrentInviteCode(user) {
        const currentCode = (user.structureInviteCode || '').trim().toUpperCase();
        return currentCode || null;
    }
    getNextInviteCodeForSave(user) {
        const draft = this.normalizeStructureInviteCode(this.structureInviteCodeDraftByUserId[user.id] || '');
        return draft || null;
    }
    normalizeStructureInviteCode(value) {
        return (value || '')
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase()
            .slice(0, 6);
    }
    roleNeedsStructure(role) {
        return role === 'facility_manager';
    }
    userHasStructureAssociation(user, structureId) {
        if (!structureId) {
            return true;
        }
        if (user.structureId === structureId) {
            return true;
        }
        const associations = Array.isArray(user.associatedStructures) ? user.associatedStructures : [];
        return associations.some((item) => item.structureId === structureId);
    }
    ensureCatalogSelectedCity() {
        if (!this.catalogCities.length) {
            this.selectedCatalogCityId = '';
            this.catalogPoiForm.controls.cityId.setValue('');
            this.catalogPois = [];
            this.lastLoadedCatalogPoisCityId = '';
            this.catalogPoisRequestToken += 1;
            this.loadingCatalogPois = false;
            return false;
        }
        const selectedStillValid = this.catalogCities.some((city) => city.id === this.selectedCatalogCityId);
        if (!selectedStillValid) {
            this.selectedCatalogCityId = this.catalogCities[0]?.id || '';
        }
        this.catalogPoiForm.controls.cityId.setValue(this.selectedCatalogCityId);
        return !!this.selectedCatalogCityId;
    }
    resolvePoiMediaTarget(cityIdRaw) {
        const cityId = String(cityIdRaw || '').trim();
        if (!cityId) {
            return null;
        }
        return { cityId };
    }
    rebuildDiscountCodesIndex() {
        const groupedMap = this.discountCodes.reduce((acc, item) => {
            if (!acc[item.structureId]) {
                acc[item.structureId] = {
                    structureId: item.structureId,
                    structureName: item.structureName || null,
                    structureAddress: item.structureAddress || null,
                    codes: []
                };
            }
            acc[item.structureId].codes.push(item);
            return acc;
        }, {});
        this.discountCodeGroups = Object.values(groupedMap).sort((a, b) => String(a.structureName || '').localeCompare(String(b.structureName || ''), 'it-IT'));
        this.discountCodesByStructureId = this.discountCodeGroups.reduce((acc, group) => {
            acc[group.structureId] = group.codes;
            return acc;
        }, {});
    }
    normalizeSelectedCityIds(cityIdsRaw) {
        if (!Array.isArray(cityIdsRaw)) {
            return [];
        }
        const deduped = new Set();
        cityIdsRaw.forEach((cityIdRaw) => {
            const cityId = String(cityIdRaw || '').trim();
            if (cityId) {
                deduped.add(cityId);
            }
        });
        return Array.from(deduped);
    }
    normalizeDiscountCodeRow(row) {
        const cityIds = this.normalizeSelectedCityIds(row.cityIds || []);
        const cityNames = Array.isArray(row.cityNames)
            ? row.cityNames.map((name) => String(name || '').trim()).filter(Boolean)
            : [];
        const fallbackCityId = row.cityId ? String(row.cityId).trim() : '';
        const fallbackCityName = row.cityName ? String(row.cityName).trim() : '';
        const normalizedCityIds = cityIds.length ? cityIds : fallbackCityId ? [fallbackCityId] : [];
        const normalizedCityNames = cityNames.length ? cityNames : fallbackCityName ? [fallbackCityName] : [];
        return {
            ...row,
            cityId: normalizedCityIds[0] || null,
            cityName: normalizedCityNames[0] || null,
            cityIds: normalizedCityIds,
            cityNames: normalizedCityNames
        };
    }
    defaultDiscountCodeExpiryInput() {
        const date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        return this.isoToInputDateTime(date.toISOString());
    }
    isoToInputDateTime(value) {
        if (!value) {
            return '';
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '';
        }
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().slice(0, 16);
    }
    toIsoDateTime(value) {
        const normalized = String(value || '').trim();
        if (!normalized) {
            return null;
        }
        const date = new Date(normalized);
        if (Number.isNaN(date.getTime())) {
            return null;
        }
        return date.toISOString();
    }
    openNativeDateTimePicker(input) {
        if (!input) {
            return;
        }
        const pickerInput = input;
        if (typeof pickerInput.showPicker === 'function') {
            pickerInput.showPicker();
            return;
        }
        input.focus();
        input.click();
    }
    normalizePercent(value) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
            return 0;
        }
        const clamped = Math.max(0, Math.min(100, numericValue));
        return Math.round(clamped * 100) / 100;
    }
    normalizeEuroAmount(value) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
            return 0;
        }
        const clamped = Math.max(0, Math.min(10000, numericValue));
        return Math.round(clamped * 100) / 100;
    }
    static { this.ɵfac = function AdminDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdminDashboardComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.AdminAuthService), i0.ɵɵdirectiveInject(i3.MatDialog), i0.ɵɵdirectiveInject(i4.Router), i0.ɵɵdirectiveInject(i4.ActivatedRoute), i0.ɵɵdirectiveInject(i5.MatSnackBar)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AdminDashboardComponent, selectors: [["app-admin-dashboard"]], viewQuery: function AdminDashboardComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
            i0.ɵɵviewQuery(_c1, 5);
            i0.ɵɵviewQuery(_c2, 5);
            i0.ɵɵviewQuery(_c3, 5);
            i0.ɵɵviewQuery(_c4, 5);
            i0.ɵɵviewQuery(_c5, 5);
            i0.ɵɵviewQuery(_c6, 5);
            i0.ɵɵviewQuery(_c7, 5);
            i0.ɵɵviewQuery(_c8, 5);
            i0.ɵɵviewQuery(_c9, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.createCatalogCityDialog = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.createCatalogPoiDialog = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.editCatalogCityDialog = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.editCatalogPoiDialog = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.createDiscountCodeDialog = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.editDiscountCodeDialog = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.partnerRequestApprovalDialog = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.catalogPoiAudioPlayerDialog = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.poiMapPickerDialog = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.poiMapCanvas = _t.first);
        } }, standalone: false, decls: 4, vars: 3, consts: [["createCatalogCityDialog", ""], ["createCatalogPoiDialog", ""], ["editCatalogCityDialog", ""], ["editCatalogPoiDialog", ""], ["catalogPoiAudioPlayerDialog", ""], ["poiMapPickerDialog", ""], ["createDiscountCodeDialog", ""], ["partnerRequestApprovalDialog", ""], ["editDiscountCodeDialog", ""], ["associatedUsersLoadingStat", ""], ["managerPaymentsLoadingStat", ""], ["managerEarningsLoadingStat", ""], ["usersLoadingStat", ""], ["structuresLoadingStat", ""], ["noUserAssociations", ""], ["adminUnlockedAll", ""], ["noUnlockedItems", ""], ["discountReadOnlyActions", ""], ["partnerRequestsLoadingStat", ""], ["partnerPendingLoadingStat", ""], ["partnerApprovedLoadingStat", ""], ["partnerPdfLoadingStat", ""], ["adminPaymentsLoadingStat", ""], ["adminCollectedLoadingStat", ""], ["adminDiscountLoadingStat", ""], ["adminEarningsLoadingStat", ""], ["payPalStatusLoading", ""], ["payPalModeLoading", ""], ["gptMissingLoading", ""], ["gptCompleteLoading", ""], ["catalogCitiesLoadingStat", ""], ["catalogPoisLoadingStat", ""], ["createCityImageEmpty", ""], ["createCatalogCityImageInput", ""], ["createPoiImageEmpty", ""], ["createCatalogPoiImageInput", ""], ["createPoiAudioEmpty", ""], ["createCatalogPoiAudioInput", ""], ["createPoiTranslationAudioEmpty", ""], ["createPoiTranslationAudioInput", ""], ["cityEditImageEmpty", ""], ["catalogCityEditImageInput", ""], ["poiEditImageEmpty", ""], ["catalogPoiEditImageInput", ""], ["poiEditAudioEmpty", ""], ["catalogPoiEditAudioInput", ""], ["editPoiTranslationAudioEmpty", ""], ["editPoiTranslationAudioInput", ""], ["poiMapCanvas", ""], ["createDiscountExpiresInput", ""], ["partnerApprovalExpiresInput", ""], ["editDiscountExpiresInput", ""], ["noStructureCodes", ""], [1, "page-shell", "admin-shell"], ["class", "card login-card", 4, "ngIf"], ["class", "dashboard-layout", 4, "ngIf"], [1, "card", "login-card"], [1, "loading-state"], ["diameter", "34"], [1, "page-title"], [1, "page-subtitle"], [1, "form-grid", 3, "ngSubmit", "formGroup"], ["appearance", "outline"], ["matInput", "", "type", "email", "formControlName", "email", "autocomplete", "username"], ["matInput", "", "type", "password", "formControlName", "password", "autocomplete", "current-password"], ["mat-flat-button", "", "color", "primary", "type", "submit", 1, "big-cta", 3, "disabled"], [1, "dashboard-layout"], [1, "sidebar"], [1, "brand"], [1, "brand-mark"], ["src", "/assets/logo.png", "alt", "Logo Walk Around", "loading", "eager", "decoding", "sync", "fetchpriority", "high"], ["class", "sidebar-nav", 4, "ngIf"], [1, "sidebar-footer"], ["mat-stroked-button", "", "color", "primary", "class", "sidebar-action", 3, "click", 4, "ngIf"], ["mat-stroked-button", "", "color", "primary", 1, "sidebar-action", 3, "click"], [1, "dashboard-main"], ["class", "dashboard-topbar card", 4, "ngIf"], ["class", "card", 4, "ngIf"], [4, "ngIf"], [1, "sidebar-nav"], ["type", "button", "class", "nav-item", 3, "active", "click", 4, "ngFor", "ngForOf"], ["type", "button", 1, "nav-item", 3, "click"], [1, "dashboard-topbar", "card"], ["class", "page-subtitle", 4, "ngIf"], [1, "card"], [1, "stats-grid"], [1, "stat-card"], [4, "ngIf", "ngIfElse"], [1, "card", "table-card"], [1, "table-head"], [1, "table-subtitle"], ["class", "inline-note", 4, "ngIf"], ["class", "table-wrap", 4, "ngIf"], [1, "stat-spinner"], ["diameter", "24"], [1, "inline-note"], [1, "table-wrap"], [1, "modern-table", "users-table", "payments-table", "compact-table"], ["colspan", "6", 1, "empty-cell", "spinner-cell"], ["diameter", "28"], ["colspan", "6", 1, "empty-cell"], [4, "ngFor", "ngForOf"], [1, "associated-code-status-cell"], [1, "association-status"], [1, "stats-grid", "manager-payments-stats"], [1, "modern-table", "users-table"], ["colspan", "11", 1, "empty-cell", "spinner-cell"], ["colspan", "11", 1, "empty-cell"], [4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "payment-user-cell"], [1, "payment-method-cell"], [1, "payment-content-cell"], [1, "payment-type-badge"], [1, "table-actions"], ["type", "button", 1, "toggle-panel-btn", 3, "click"], [1, "toggle-panel-icon"], ["class", "inline-panel", 4, "ngIf"], ["class", "users-structure-filter", 4, "ngIf"], [1, "inline-panel"], ["matInput", "", "type", "text", "formControlName", "firstName", "autocomplete", "given-name"], ["matInput", "", "type", "text", "formControlName", "lastName", "autocomplete", "family-name"], ["matInput", "", "type", "email", "formControlName", "email", "autocomplete", "email"], ["formControlName", "role"], ["value", "facility_manager"], ["value", "admin"], ["appearance", "outline", 4, "ngIf"], ["class", "inline-loader", 4, "ngIf"], ["class", "invite-result", 4, "ngIf"], ["formControlName", "structureId", 3, "disabled"], [3, "value", "disabled"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "inline-loader"], [1, "invite-result"], ["matInput", "", "type", "password", "formControlName", "password", "autocomplete", "new-password"], ["value", "user"], [1, "users-structure-filter"], ["type", "button", 1, "ghost-btn", 3, "click"], ["class", "structure-name muted", 4, "ngIf"], [1, "structure-cell"], ["class", "association-list", 4, "ngIf", "ngIfElse"], ["class", "unlocked-cell", 4, "ngIf", "ngIfElse"], ["class", "action-buttons user-row-actions", 4, "ngIf"], [1, "structure-name", "muted"], [1, "association-list"], ["class", "association-item", 4, "ngFor", "ngForOf"], [1, "association-item"], [1, "association-head"], [1, "structure-name"], [3, "matTooltip"], ["class", "structure-code", 4, "ngIf"], [1, "structure-code"], [1, "unlocked-cell"], ["class", "unlocked-counts", 4, "ngIf", "ngIfElse"], ["class", "unlocked-tags", 4, "ngIf"], ["class", "unlocked-pois", 4, "ngIf"], [1, "unlocked-counts"], [1, "unlocked-tags"], ["class", "status-pill ok", 4, "ngFor", "ngForOf"], [1, "status-pill", "ok"], [1, "unlocked-pois"], ["class", "unlocked-poi-item", 4, "ngFor", "ngForOf"], [1, "unlocked-poi-item"], [1, "action-buttons", "user-row-actions"], [1, "user-row-actions-top"], ["mat-stroked-button", "", "color", "primary", 3, "click", "disabled"], ["mat-stroked-button", "", "color", "warn", 3, "click", "disabled"], ["mat-flat-button", "", "color", "accent", "matTooltipPosition", "above", 1, "user-row-impersonate-btn", 3, "click", "disabled", "matTooltip"], ["class", "table-subtitle", 4, "ngIf"], ["class", "table-actions", 4, "ngIf"], [1, "modern-table", "structures-table", "payments-table", "compact-table"], ["colspan", "2", 1, "empty-cell", "spinner-cell"], ["colspan", "2", 1, "empty-cell"], [1, "discount-group-list"], ["class", "discount-group-item", 4, "ngFor", "ngForOf"], [1, "discount-group-item"], [1, "discount-group-main"], [1, "discount-group-meta"], [1, "expiry-badge", 3, "ngClass"], ["class", "action-buttons", 4, "ngIf", "ngIfElse"], [1, "action-buttons"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click", "disabled"], ["mat-stroked-button", "", "color", "warn", "type", "button", 3, "click", "disabled"], [1, "modern-table", "partner-requests-table"], [1, "partner-request-main-cell"], [1, "partner-request-contact-cell"], [1, "partner-request-address-cell"], [1, "partner-request-status-cell"], [1, "status-pill", 3, "ngClass"], [1, "partner-request-message-cell"], [1, "partner-request-notes"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "click", "disabled"], ["appearance", "outline", 1, "compact-filter"], [3, "selectionChange", "value"], ["value", ""], [1, "modern-table", "structures-table"], ["colspan", "12", 1, "empty-cell", "spinner-cell"], ["colspan", "12", 1, "empty-cell"], [1, "paypal-settings-form", 3, "ngSubmit", "formGroup"], ["class", "paypal-status-strip", 4, "ngIf"], [1, "form-grid"], ["formControlName", "mode"], ["value", "sandbox"], ["value", "live"], ["matInput", "", "formControlName", "brandName"], ["appearance", "outline", 1, "full-span"], ["matInput", "", "formControlName", "clientId", "autocomplete", "off"], ["matInput", "", "formControlName", "clientSecret", "autocomplete", "off"], ["matInput", "", "formControlName", "merchantId", "autocomplete", "off"], ["matInput", "", "formControlName", "merchantEmail", "autocomplete", "off"], ["matInput", "", "formControlName", "webhookId", "autocomplete", "off"], ["formControlName", "isEnabled"], [1, "paypal-actions"], ["mat-flat-button", "", "color", "primary", "type", "submit", 3, "disabled"], [1, "paypal-status-strip"], [1, "gpt-settings-form", 3, "ngSubmit", "formGroup"], ["matInput", "", "type", "password", "formControlName", "apiKey", "autocomplete", "off", 3, "placeholder"], ["matInput", "", "type", "text", "formControlName", "model", "autocomplete", "off"], [1, "gpt-controls-grid", 3, "formGroup"], ["formControlName", "cityId", 3, "selectionChange"], ["formControlName", "targetLanguage", 3, "selectionChange"], ["formControlName", "poiId", 3, "selectionChange"], [3, "value", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["formControlName", "overwrite"], ["class", "gpt-progress-panel", 4, "ngIf"], ["class", "gpt-preview-grid", 4, "ngIf"], [1, "table-wrap", "compact-wrap"], [1, "modern-table", "compact-table"], [1, "gpt-progress-panel"], [1, "gpt-progress-head"], ["aria-hidden", "true", 1, "gpt-progress-track"], [1, "gpt-progress-bar"], [1, "gpt-token-strip"], ["class", "gpt-log", 4, "ngIf"], [1, "gpt-log"], [1, "gpt-preview-grid"], [1, "translation-card"], ["colspan", "3", 1, "empty-cell"], ["role", "tablist", "aria-label", "Gestione catalogo", 1, "catalog-tabs"], ["type", "button", 1, "catalog-tab", 3, "click"], ["class", "catalog-stack", 4, "ngIf"], [1, "catalog-stack"], [1, "catalog-panel-head"], [1, "catalog-list-head"], ["colspan", "4", 1, "empty-cell", "spinner-cell"], ["colspan", "4", 1, "empty-cell"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click"], ["appearance", "outline", 1, "catalog-city-filter", "compact-filter"], [1, "modern-table"], ["type", "button", 1, "audio-link-btn", 3, "click", "disabled"], ["mat-dialog-title", ""], [1, "form-grid", "dialog-form", 3, "ngSubmit", "formGroup"], ["mat-dialog-content", "", 1, "dialog-body"], ["matInput", "", "type", "text", "formControlName", "name"], ["matInput", "", "type", "text", "formControlName", "region", "readonly", ""], ["matInput", "", "type", "number", "min", "0", "step", "0.01", "formControlName", "bundlePrice"], ["formGroupName", "translations", 1, "translation-panel"], [1, "translation-panel-head"], [1, "translation-grid"], ["class", "translation-card", 3, "formGroupName", 4, "ngFor", "ngForOf"], ["type", "hidden", "formControlName", "heroImage"], [1, "media-block"], [1, "media-block-head"], ["class", "media-preview", 4, "ngIf", "ngIfElse"], [1, "media-upload-actions"], ["type", "file", "accept", ".jpg,.jpeg,.png,.webp,.gif,.avif,image/*", "hidden", "", 3, "change"], ["type", "button", 1, "generate-code-btn", 3, "click", "disabled"], ["type", "button", "class", "ghost-btn", 3, "disabled", "click", 4, "ngIf"], ["mat-dialog-actions", "", "align", "end", 1, "dialog-actions"], ["type", "button", 1, "row-save-btn", "secondary", 3, "click", "disabled"], [1, "translation-card", 3, "formGroupName"], [1, "media-preview"], ["alt", "Anteprima immagine citt\u00E0", 3, "src"], [1, "media-preview", "placeholder"], ["type", "button", 1, "ghost-btn", 3, "click", "disabled"], ["matInput", "", "type", "text", "formControlName", "address"], ["formControlName", "category"], [1, "coords-grid"], ["matInput", "", "type", "number", "step", "0.000001", "formControlName", "lat"], ["matInput", "", "type", "number", "step", "0.000001", "formControlName", "lng"], [1, "map-picker-row"], ["type", "button", 1, "toggle-panel-btn", "subtle", 3, "click"], ["matInput", "", "rows", "2", "formControlName", "descriptionShort"], ["matInput", "", "rows", "5", "formControlName", "descriptionLong"], ["type", "hidden", "formControlName", "imageUrl"], ["type", "hidden", "formControlName", "audioUrl"], ["class", "audio-file-pill", 4, "ngIf", "ngIfElse"], ["type", "file", "accept", ".mp3,.m4a,.wav,.ogg,.aac,audio/*", "hidden", "", 3, "change"], ["class", "media-player", "controls", "", "preload", "none", 3, "src", 4, "ngIf"], ["matInput", "", "type", "number", "step", "0.01", "min", "0", "formControlName", "priceSingle"], [1, "audio-file-pill"], [1, "audio-file-label"], ["controls", "", "preload", "none", 1, "media-player", 3, "src"], ["alt", "Anteprima immagine luogo", 3, "src"], ["matInput", "", "type", "text", "formControlName", "region"], ["formControlName", "cityId"], ["mat-dialog-content", "", 1, "dialog-body", "map-dialog-body"], ["controls", "", "autoplay", "", "preload", "metadata", 1, "media-player", 3, "src"], ["type", "button", 1, "row-save-btn", "secondary", 3, "click"], [1, "map-search-form", 3, "ngSubmit", "formGroup"], ["matInput", "", "type", "text", "formControlName", "query", "autocomplete", "off"], ["type", "submit", 1, "generate-code-btn", 3, "disabled"], ["class", "map-selected-coords", 4, "ngIf"], ["class", "map-results", 4, "ngIf"], [1, "map-preview-panel"], [1, "map-preview-head"], [1, "poi-map-canvas"], ["type", "button", 1, "row-save-btn", 3, "click", "disabled"], [1, "map-selected-coords"], [1, "map-results"], ["class", "map-result-card", 4, "ngFor", "ngForOf"], [1, "map-result-card"], ["type", "button", 1, "row-save-btn", 3, "click"], ["mat-stroked-button", "", "type", "button", 3, "click"], ["formControlName", "structureId"], [1, "invite-code-row"], ["appearance", "outline", 1, "invite-code-field"], ["matInput", "", "type", "text", "formControlName", "code", "maxlength", "6", "autocomplete", "off"], [1, "discount-scope-group"], ["formControlName", "applyTo", 1, "discount-scope-radio"], ["value", "single"], ["value", "bundle"], ["formControlName", "cityIds", "multiple", ""], ["matInput", "", "type", "number", "min", "0", "max", "100", "step", "0.01", "formControlName", "userDiscountPercent"], ["matInput", "", "type", "number", "min", "0", "max", "10000", "step", "0.01", "formControlName", "structureFixedAmount"], ["matInput", "", "type", "datetime-local", "step", "60", "formControlName", "expiresAt"], ["matSuffix", "", "type", "button", "aria-label", "Apri calendario e ora", 1, "date-picker-suffix-btn", 3, "click"], ["aria-hidden", "true", 1, "calendar-icon-glyph"], ["type", "submit", 1, "row-save-btn", 3, "disabled"], ["diameter", "22"], ["matInput", "", "type", "text", "formControlName", "name", "autocomplete", "organization"], [1, "address-grid"], ["appearance", "outline", 1, "address-span-2"], ["matInput", "", "type", "text", "formControlName", "street", "autocomplete", "street-address"], ["matInput", "", "type", "text", "formControlName", "streetNumber"], ["matInput", "", "type", "text", "formControlName", "postalCode", "maxlength", "5", "inputmode", "numeric"], ["matInput", "", "type", "text", "formControlName", "city", "autocomplete", "address-level2"], ["matInput", "", "type", "text", "formControlName", "province", "autocomplete", "address-level1"], ["matInput", "", "type", "text", "formControlName", "country", "autocomplete", "country-name"], ["colspan", "7", 1, "empty-cell", "spinner-cell"], ["colspan", "7", 1, "empty-cell"], ["class", "structure-codes-list", 4, "ngIf", "ngIfElse"], ["type", "button", 1, "table-link-btn", 3, "click", "disabled"], [1, "structure-codes-list"], ["class", "structure-code-item", 4, "ngFor", "ngForOf"], [1, "structure-code-item"]], template: function AdminDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 53);
            i0.ɵɵtemplate(1, AdminDashboardComponent_mat_card_1_Template, 5, 0, "mat-card", 54)(2, AdminDashboardComponent_mat_card_2_Template, 16, 3, "mat-card", 54)(3, AdminDashboardComponent_div_3_Template, 48, 15, "div", 55);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.authChecked);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.authChecked && !ctx.isAuthenticated);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.authChecked && ctx.isAuthenticated);
        } }, dependencies: [i6.NgClass, i6.NgForOf, i6.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.MaxLengthValidator, i1.MinValidator, i1.MaxValidator, i1.FormGroupDirective, i1.FormControlName, i1.FormGroupName, i7.MatButton, i8.MatCard, i3.MatDialogTitle, i3.MatDialogActions, i3.MatDialogContent, i9.MatFormField, i9.MatLabel, i9.MatHint, i9.MatError, i9.MatSuffix, i10.MatInput, i11.MatProgressSpinner, i12.MatRadioGroup, i12.MatRadioButton, i13.MatSelect, i13.MatOption, i14.MatSlideToggle, i15.MatTooltip, i6.SlicePipe, i6.DecimalPipe, i6.DatePipe], styles: [".admin-shell[_ngcontent-%COMP%] {\n  padding: 0;\n  margin: 0;\n  max-width: none;\n  width: 100%;\n  min-height: 100vh;\n}\n\n.login-card[_ngcontent-%COMP%] {\n  width: min(460px, calc(100% - 32px));\n  padding: 24px;\n  margin: 28px auto;\n}\n\n.form-grid[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  display: grid;\n  gap: 12px;\n}\n\n.full-span[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n}\n\n.paypal-settings-form[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 14px;\n}\n\n.paypal-settings-form[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%], \n.gpt-settings-form[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n}\n\n.gpt-settings-form[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 14px;\n}\n\n.paypal-status-strip[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 4px;\n  padding: 12px 14px;\n  border-radius: 12px;\n  border: 1px solid #d8e4f4;\n  background: #f7fbff;\n  color: #2f4764;\n}\n\n.paypal-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}\n\n.gpt-controls-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 12px;\n  align-items: center;\n  margin-bottom: 14px;\n}\n\n.gpt-progress-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 9px;\n  border: 1px solid #dbe7fb;\n  border-radius: 12px;\n  background: #f8fbff;\n  padding: 12px;\n  margin-bottom: 14px;\n}\n\n.gpt-progress-head[_ngcontent-%COMP%], \n.gpt-token-strip[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  gap: 10px;\n  color: #2f4764;\n}\n\n.gpt-progress-track[_ngcontent-%COMP%] {\n  height: 10px;\n  border-radius: 999px;\n  background: #dfe9f8;\n  overflow: hidden;\n}\n\n.gpt-progress-bar[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background: linear-gradient(135deg, #1b75d0, #1fa463);\n  transition: width 0.2s ease;\n}\n\n.gpt-token-strip[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  font-size: 0.88rem;\n}\n\n.gpt-log[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 4px;\n  color: #526b8d;\n  font-size: 0.84rem;\n}\n\n.gpt-preview-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 12px;\n  margin-bottom: 14px;\n}\n\n.gpt-preview-grid[_ngcontent-%COMP%]   .translation-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #435f84;\n  line-height: 1.45;\n}\n\n.dashboard-layout[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  background: linear-gradient(140deg, #eef2f8 0%, #f8fbff 55%, #f4f7fb 100%);\n}\n\n.sidebar[_ngcontent-%COMP%] {\n  background: linear-gradient(175deg, #091733 0%, #0b214b 100%);\n  color: #dfe9ff;\n  padding: 18px 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  position: sticky;\n  top: 0;\n  align-self: start;\n  height: 100vh;\n  overflow-y: auto;\n}\n\n.brand[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 4px 6px 12px;\n  border-bottom: 1px solid rgba(168, 189, 235, 0.22);\n}\n\n.brand-mark[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 9px;\n  overflow: hidden;\n  border: 1px solid rgba(174, 198, 240, 0.36);\n  background: #fff;\n}\n\n.brand-mark[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n\n.brand[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  opacity: 0.8;\n  font-size: 0.85rem;\n}\n\n.sidebar-nav[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n}\n\n.nav-item[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 12px;\n  color: #e7efff;\n  background: transparent;\n  padding: 12px;\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  cursor: pointer;\n  text-align: left;\n}\n\n.nav-item[_ngcontent-%COMP%]::before {\n  content: '';\n  width: 8px;\n  height: 8px;\n  border-radius: 999px;\n  background: rgba(197, 218, 255, 0.72);\n  flex: 0 0 8px;\n}\n\n.nav-item[_ngcontent-%COMP%]:hover {\n  background: rgba(202, 221, 255, 0.14);\n}\n\n.nav-item.active[_ngcontent-%COMP%] {\n  background: rgba(50, 124, 255, 0.35);\n  box-shadow: inset 0 0 0 1px rgba(153, 195, 255, 0.45);\n}\n\n.nav-item.active[_ngcontent-%COMP%]::before {\n  background: #7fd2ff;\n}\n\n.sidebar-footer[_ngcontent-%COMP%] {\n  margin-top: auto;\n  border-top: 1px solid rgba(168, 189, 235, 0.22);\n  padding: 12px 6px 0;\n  display: grid;\n  gap: 8px;\n}\n\n.sidebar-footer[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  opacity: 0.85;\n  font-size: 0.9rem;\n  word-break: break-all;\n}\n\n.sidebar-action[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.dashboard-main[_ngcontent-%COMP%] {\n  padding: 20px;\n  display: grid;\n  align-content: start;\n  grid-auto-rows: max-content;\n  gap: 16px;\n  min-width: 0;\n  overflow-x: hidden;\n}\n\n.dashboard-topbar[_ngcontent-%COMP%] {\n  padding: 18px;\n}\n\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 12px;\n}\n\n.manager-payments-stats[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n}\n\n.stat-card[_ngcontent-%COMP%] {\n  border-radius: 14px;\n  border: 1px solid #dce5f7;\n  box-shadow: none;\n  padding: 14px;\n  display: grid;\n  gap: 2px;\n}\n\n.stat-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #6f7f99;\n}\n\n.stat-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.55rem;\n  color: #152949;\n}\n\n.stat-spinner[_ngcontent-%COMP%] {\n  min-height: 38px;\n  display: flex;\n  align-items: center;\n}\n\n.stat-spinner[_ngcontent-%COMP%]   .mat-mdc-progress-spinner[_ngcontent-%COMP%] {\n  --mdc-circular-progress-active-indicator-color: #1c7be0;\n}\n\n.modern-cta[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 12px;\n  background: linear-gradient(135deg, #1b75d0, #0d4e9d);\n  color: #fff;\n  padding: 11px 16px;\n  font-size: 0.98rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n\n.modern-cta[_ngcontent-%COMP%]:hover {\n  filter: brightness(1.06);\n}\n\n.modern-cta.secondary[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #2d6c3a, #1f552d);\n}\n\n.table-card[_ngcontent-%COMP%] {\n  padding: 18px;\n  min-width: 0;\n}\n\n.table-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n}\n\n.inline-note[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #a24f28;\n  font-size: 0.92rem;\n}\n\n.invite-result[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  display: grid;\n  gap: 5px;\n  color: #1d3153;\n}\n\n.table-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n\n.table-subtitle[_ngcontent-%COMP%] {\n  margin: 4px 0 0;\n  color: #6a7f9f;\n  font-size: 0.92rem;\n}\n\n.table-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  justify-content: flex-end;\n}\n\n.toggle-panel-btn[_ngcontent-%COMP%] {\n  border: 1px solid #c6d7f3;\n  border-radius: 12px;\n  background: #fff;\n  color: #174074;\n  padding: 9px 12px;\n  font-size: 0.9rem;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;\n}\n\n.toggle-panel-btn[_ngcontent-%COMP%]:hover {\n  background: #f3f8ff;\n}\n\n.toggle-panel-btn.active[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #1b75d0, #0d4e9d);\n  border-color: #0d4e9d;\n  color: #fff;\n}\n\n.toggle-panel-btn.subtle[_ngcontent-%COMP%] {\n  border-style: dashed;\n  background: #f6f9ff;\n  color: #204674;\n}\n\n.toggle-panel-icon[_ngcontent-%COMP%] {\n  width: 19px;\n  height: 19px;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.95rem;\n  line-height: 1;\n  font-weight: 800;\n  color: #0c468a;\n  background: #dfeaff;\n}\n\n.toggle-panel-btn.active[_ngcontent-%COMP%]   .toggle-panel-icon[_ngcontent-%COMP%] {\n  color: #fff;\n  background: rgba(255, 255, 255, 0.26);\n}\n\n.inline-panel[_ngcontent-%COMP%] {\n  border: 1px solid #dfe8f8;\n  border-radius: 12px;\n  background: #f9fcff;\n  padding: 14px;\n  margin-bottom: 12px;\n}\n\n.inline-panel[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.02rem;\n  color: #163157;\n}\n\n.inline-panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 6px 0 0;\n  color: #617694;\n}\n\n.address-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n\n.address-span-2[_ngcontent-%COMP%] {\n  grid-column: span 2;\n}\n\n.invite-code-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 10px;\n}\n\n.invite-code-field[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n\n.invite-code-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n}\n\n.generate-code-btn[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 10px;\n  background: linear-gradient(135deg, #1f7a45, #0f5f31);\n  color: #fff;\n  padding: 11px 14px;\n  font-size: 0.9rem;\n  font-weight: 600;\n  min-width: 130px;\n  cursor: pointer;\n}\n\n.generate-code-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n}\n\n.generate-code-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  filter: brightness(1.07);\n}\n\n.field-note[_ngcontent-%COMP%] {\n  margin: -4px 0 0;\n  font-size: 0.82rem;\n  color: #5f7598;\n}\n\n.discount-code-note[_ngcontent-%COMP%] {\n  padding-left: 2px;\n}\n\n.discount-scope-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n  padding: 10px 12px;\n  border: 1px solid #dce7f8;\n  border-radius: 10px;\n  background: #f7fbff;\n}\n\n.discount-scope-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.82rem;\n  font-weight: 700;\n  color: #20436f;\n}\n\n.discount-scope-radio[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n\n.users-structure-filter[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  margin: 10px 0 12px;\n  padding: 10px 12px;\n  border: 1px solid #dce8f8;\n  border-radius: 10px;\n  background: #f7fbff;\n  color: #20436f;\n}\n\n.users-structure-filter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #0f4f98;\n}\n\n.table-link-btn[_ngcontent-%COMP%] {\n  border: 1px solid #c6d7f3;\n  border-radius: 8px;\n  background: #f4f8ff;\n  color: #174074;\n  font-weight: 700;\n  min-width: 44px;\n  padding: 4px 10px;\n  cursor: pointer;\n}\n\n.table-link-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #e9f1ff;\n}\n\n.table-link-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n\n.date-picker-suffix-btn[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  margin-right: 6px;\n  border: 1px solid #c6d7f3;\n  border-radius: 8px;\n  background: #f6faff;\n  color: #1d4d87;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n\n.date-picker-suffix-btn[_ngcontent-%COMP%]:hover {\n  background: #ebf4ff;\n}\n\n.calendar-icon-glyph[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  border: 2px solid currentColor;\n  border-radius: 3px;\n  position: relative;\n  display: inline-block;\n  box-sizing: border-box;\n}\n\n.calendar-icon-glyph[_ngcontent-%COMP%]::before, \n.calendar-icon-glyph[_ngcontent-%COMP%]::after {\n  content: '';\n  position: absolute;\n  top: -4px;\n  width: 2px;\n  height: 4px;\n  border-radius: 2px;\n  background: currentColor;\n}\n\n.calendar-icon-glyph[_ngcontent-%COMP%]::before {\n  left: 2px;\n}\n\n.calendar-icon-glyph[_ngcontent-%COMP%]::after {\n  right: 2px;\n}\n\n.table-wrap[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  overflow-x: auto;\n  border: 1px solid #e1e8f7;\n  border-radius: 12px;\n}\n\n.modern-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 980px;\n}\n\n.modern-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  text-align: left;\n  font-size: 0.86rem;\n  letter-spacing: 0.02em;\n  color: #5d6f8d;\n  background: #f4f8ff;\n  padding: 12px;\n  border-bottom: 1px solid #e1e8f7;\n}\n\n.modern-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 12px;\n  border-bottom: 1px solid #edf2fb;\n  vertical-align: top;\n  color: #213459;\n}\n\n.modern-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: 0;\n}\n\n.modern-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr.row-dirty[_ngcontent-%COMP%] {\n  background: linear-gradient(90deg, rgba(23, 117, 208, 0.06), rgba(23, 117, 208, 0.01));\n}\n\n.modern-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.modern-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 3px;\n  line-height: 1.32;\n  color: #6f7f99;\n}\n\n.cell-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.table-field[_ngcontent-%COMP%] {\n  min-width: 170px;\n  width: 100%;\n}\n\n.percent-field[_ngcontent-%COMP%] {\n  min-width: 140px;\n  max-width: 160px;\n}\n\n.structure-cell[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 4px;\n}\n\n.association-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 7px;\n}\n\n.association-item[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 3px;\n  padding: 6px 8px;\n  border: 1px solid #dce7f7;\n  border-radius: 8px;\n  background: #f8fbff;\n}\n\n.association-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n\n.structure-name[_ngcontent-%COMP%] {\n  color: #1f355c;\n  font-size: 0.84rem;\n}\n\n.structure-code[_ngcontent-%COMP%] {\n  color: #3a5074;\n  font-size: 0.8rem;\n}\n\n.structure-name.muted[_ngcontent-%COMP%], \n.structure-code.muted[_ngcontent-%COMP%] {\n  color: #6f7f99;\n}\n\n.association-status[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  min-height: 20px;\n  padding: 1px 8px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n}\n\n.association-status-active[_ngcontent-%COMP%] {\n  color: #0f6b3f;\n  background: #e8f7ef;\n  border-color: #b8e4cb;\n}\n\n.association-status-used[_ngcontent-%COMP%] {\n  color: #9a3412;\n  background: #fff4e5;\n  border-color: #f6cf9b;\n}\n\n.association-status-expired[_ngcontent-%COMP%] {\n  color: #b42318;\n  background: #fff1f1;\n  border-color: #f5c2c2;\n}\n\n.association-status-invalid[_ngcontent-%COMP%] {\n  color: #4b5565;\n  background: #edf1f6;\n  border-color: #d3dce8;\n}\n\n.unlocked-cell[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 6px;\n  min-width: 210px;\n}\n\n.unlocked-counts[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px 12px;\n}\n\n.unlocked-tags[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n\n.unlocked-pois[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 2px;\n}\n\n.unlocked-poi-item[_ngcontent-%COMP%] {\n  color: #4a5f80;\n}\n\n.associated-code-status-cell[_ngcontent-%COMP%] {\n  min-width: 130px;\n}\n\n.associated-code-status-cell[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 4px;\n  color: #5b6f90;\n  font-size: 0.72rem;\n}\n\n.structure-codes-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 6px;\n}\n\n.structure-code-item[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 2px;\n}\n\n.discount-group-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n}\n\n.discount-group-item[_ngcontent-%COMP%] {\n  border: 1px solid #dfe8f8;\n  border-radius: 10px;\n  background: #f9fcff;\n  padding: 10px;\n  display: grid;\n  gap: 8px;\n}\n\n.discount-group-main[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 12px;\n}\n\n.discount-group-main[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  background: #ecf3ff;\n  border: 1px solid #cfe0fb;\n  border-radius: 8px;\n  padding: 3px 8px;\n  color: #113b6e;\n  font-weight: 700;\n}\n\n.discount-group-meta[_ngcontent-%COMP%] {\n  color: #486286;\n  font-size: 0.86rem;\n}\n\n.discount-group-meta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1f355c;\n}\n\n.expiry-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  min-height: 21px;\n  margin-left: 8px;\n  padding: 1px 8px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1;\n}\n\n.expiry-badge-active[_ngcontent-%COMP%] {\n  color: #0f6b3f;\n  background: #e8f7ef;\n  border-color: #b8e4cb;\n}\n\n.expiry-badge-expired[_ngcontent-%COMP%] {\n  color: #b42318;\n  background: #fff1f1;\n  border-color: #f5c2c2;\n}\n\n.expiry-badge-unknown[_ngcontent-%COMP%] {\n  color: #4b5565;\n  background: #edf1f6;\n  border-color: #d3dce8;\n}\n\n.payment-user-cell[_ngcontent-%COMP%] {\n  min-width: 240px;\n}\n\n.payment-method-cell[_ngcontent-%COMP%] {\n  min-width: 200px;\n}\n\n.payment-content-cell[_ngcontent-%COMP%] {\n  min-width: 180px;\n}\n\n.payments-table[_ngcontent-%COMP%] {\n  min-width: 860px;\n  table-layout: fixed;\n}\n\n.payments-table[_ngcontent-%COMP%]   .payment-user-cell[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 220px;\n}\n\n.payments-table[_ngcontent-%COMP%]   .payment-method-cell[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 130px;\n}\n\n.payments-table[_ngcontent-%COMP%]   .payment-content-cell[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 170px;\n}\n\n.payments-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.payments-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 9px 8px;\n}\n\n.payments-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n\n.payments-table[_ngcontent-%COMP%]   .payment-user-cell[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.payments-table[_ngcontent-%COMP%]   .payment-method-cell[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 100%;\n}\n\n.payment-type-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  padding: 2px 9px;\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1.2;\n}\n\n.payment-type-badge.bundle[_ngcontent-%COMP%] {\n  color: #0f4f98;\n  background: #e8f1ff;\n  border-color: #c6dbfb;\n}\n\n.payment-type-badge.single[_ngcontent-%COMP%] {\n  color: #196a3a;\n  background: #e9f8ef;\n  border-color: #bde5cc;\n}\n\n.catalog-stack[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n}\n\n.catalog-tabs[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 8px;\n  margin-bottom: 12px;\n  padding: 6px;\n  border-radius: 12px;\n  background: #eef4ff;\n  border: 1px solid #d9e5f9;\n}\n\n.catalog-tab[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 9px;\n  padding: 9px 14px;\n  font-size: 0.92rem;\n  font-weight: 700;\n  color: #355179;\n  background: transparent;\n  cursor: pointer;\n}\n\n.catalog-tab.active[_ngcontent-%COMP%] {\n  color: #fff;\n  background: linear-gradient(135deg, #1b75d0, #0d4e9d);\n  box-shadow: 0 2px 10px rgba(10, 63, 126, 0.28);\n}\n\n.catalog-panel-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n\n.catalog-list-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 8px;\n}\n\n.ghost-btn[_ngcontent-%COMP%] {\n  border: 1px solid #c6d7f3;\n  border-radius: 10px;\n  background: #fff;\n  color: #174074;\n  padding: 8px 11px;\n  font-weight: 600;\n  cursor: pointer;\n}\n\n.catalog-city-filter[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.compact-filter[_ngcontent-%COMP%] {\n  max-width: 340px;\n}\n\n.coords-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 10px;\n}\n\n.map-picker-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-start;\n}\n\n.media-upload-row[_ngcontent-%COMP%], \n.audio-upload-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n\n.media-block[_ngcontent-%COMP%] {\n  border: 1px solid #dbe7fb;\n  border-radius: 12px;\n  background: #fff;\n  padding: 12px;\n  display: grid;\n  gap: 10px;\n}\n\n.media-block-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.media-block-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #17345b;\n}\n\n.media-block-head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #5e7497;\n  font-size: 0.84rem;\n}\n\n.media-preview[_ngcontent-%COMP%] {\n  border-radius: 10px;\n  border: 1px solid #d8e5f9;\n  overflow: hidden;\n  background: #f2f7ff;\n  min-height: 180px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.media-preview.placeholder[_ngcontent-%COMP%] {\n  color: #5f7598;\n  font-size: 0.9rem;\n  text-align: center;\n  padding: 10px;\n}\n\n.media-preview[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  max-height: 240px;\n  object-fit: cover;\n  display: block;\n}\n\n.media-upload-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n\n.translation-panel[_ngcontent-%COMP%] {\n  border: 1px solid #dbe7fb;\n  border-radius: 12px;\n  background: #f8fbff;\n  padding: 14px;\n  display: grid;\n  gap: 12px;\n}\n\n.translation-panel-head[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 4px;\n}\n\n.translation-panel-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #17345b;\n}\n\n.translation-panel-head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #5e7497;\n  font-size: 0.88rem;\n}\n\n.translation-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 12px;\n}\n\n.translation-card[_ngcontent-%COMP%] {\n  border: 1px solid #d6e2f8;\n  border-radius: 12px;\n  background: #fff;\n  padding: 12px;\n  display: grid;\n  gap: 10px;\n}\n\n.translation-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #163a67;\n  font-size: 1rem;\n}\n\n.media-player[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.audio-file-pill[_ngcontent-%COMP%] {\n  border: 1px solid #dbe7fb;\n  border-radius: 10px;\n  background: #f6faff;\n  padding: 10px 12px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  color: #1c3f6f;\n}\n\n.audio-file-label[_ngcontent-%COMP%] {\n  color: #5f7598;\n  font-size: 0.86rem;\n}\n\n.audio-link-btn[_ngcontent-%COMP%] {\n  border: 1px solid #c9daf7;\n  border-radius: 10px;\n  background: #f7fbff;\n  color: #12427a;\n  padding: 6px 10px;\n  font-size: 0.85rem;\n  font-weight: 600;\n  cursor: pointer;\n  text-align: left;\n  max-width: 100%;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.audio-link-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #ebf4ff;\n}\n\n.audio-link-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.media-url-field[_ngcontent-%COMP%], \n.audio-url-field[_ngcontent-%COMP%] {\n  flex: 1;\n}\n\n.compact-wrap[_ngcontent-%COMP%]   .modern-table[_ngcontent-%COMP%] {\n  min-width: 620px;\n}\n\n.compact-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.compact-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 10px;\n}\n\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n\n.user-row-actions[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  gap: 8px;\n  align-items: stretch;\n}\n\n.user-row-actions-top[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 8px;\n}\n\n.user-row-actions-top[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.user-row-impersonate-btn[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.row-save-btn[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 10px;\n  background: linear-gradient(135deg, #0f4f98, #1c7be0);\n  color: #fff;\n  padding: 8px 12px;\n  font-size: 0.85rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: transform 0.15s ease, filter 0.15s ease, opacity 0.15s ease;\n}\n\n.row-save-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  filter: brightness(1.05);\n  transform: translateY(-1px);\n}\n\n.row-save-btn[_ngcontent-%COMP%]:disabled {\n  background: #e3eaf8;\n  color: #5f7294;\n  cursor: not-allowed;\n  transform: none;\n}\n\n.row-save-btn.secondary[_ngcontent-%COMP%] {\n  background: #e7eefb;\n  color: #2b456d;\n}\n\n.dialog-form[_ngcontent-%COMP%] {\n  margin-top: 0;\n  width: 100%;\n  min-width: 0;\n}\n\n.dialog-body[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 14px;\n  padding-top: 6px;\n  overflow-x: hidden;\n}\n\n.dialog-body[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n\n.dialog-body[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%], \n.dialog-body[_ngcontent-%COMP%]   .coords-grid[_ngcontent-%COMP%], \n.dialog-body[_ngcontent-%COMP%]   .map-picker-row[_ngcontent-%COMP%], \n.dialog-body[_ngcontent-%COMP%]   .media-block[_ngcontent-%COMP%], \n.dialog-body[_ngcontent-%COMP%]   .translation-panel[_ngcontent-%COMP%], \n.dialog-body[_ngcontent-%COMP%]   .media-upload-row[_ngcontent-%COMP%], \n.dialog-body[_ngcontent-%COMP%]   .media-player[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n}\n\n.dialog-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  padding: 0 24px 18px;\n}\n\n.map-dialog-body[_ngcontent-%COMP%] {\n  grid-template-columns: 1fr;\n}\n\n.map-search-form[_ngcontent-%COMP%] {\n  margin-top: 0;\n  display: grid;\n  gap: 10px;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n}\n\n.map-search-form[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.map-results[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n  max-height: min(52vh, 420px);\n  overflow: auto;\n}\n\n.map-selected-coords[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 8px 10px;\n  border-radius: 10px;\n  border: 1px solid #dbe7fb;\n  background: #f6faff;\n  color: #21446f;\n  font-size: 0.9rem;\n}\n\n.map-result-card[_ngcontent-%COMP%] {\n  border: 1px solid #dbe7fb;\n  border-radius: 12px;\n  background: #fff;\n  padding: 12px;\n  display: grid;\n  gap: 6px;\n}\n\n.map-result-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #17345b;\n}\n\n.map-result-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #5f7598;\n  word-break: break-word;\n}\n\n.map-preview-panel[_ngcontent-%COMP%] {\n  border: 1px solid #dbe7fb;\n  border-radius: 12px;\n  background: #fff;\n  padding: 10px;\n  display: grid;\n  gap: 8px;\n}\n\n.map-preview-head[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 2px;\n}\n\n.map-preview-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #17345b;\n}\n\n.map-preview-head[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #5f7598;\n}\n\n.poi-map-canvas[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 340px;\n  border-radius: 10px;\n  overflow: hidden;\n  border: 1px solid #d6e3f8;\n  background: linear-gradient(140deg, #e8eef9, #f4f8ff);\n}\n\n.poi-map-canvas.ready[_ngcontent-%COMP%] {\n  background: #e8eef9;\n}\n\n.status-pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 4px 10px;\n  font-size: 0.78rem;\n  font-weight: 600;\n}\n\n.status-pill.ok[_ngcontent-%COMP%] {\n  color: #17653d;\n  background: #e7f7ee;\n}\n\n.status-pill.warn[_ngcontent-%COMP%] {\n  color: #915b00;\n  background: #fef6dd;\n}\n\n.status-pill.bad[_ngcontent-%COMP%] {\n  color: #b42318;\n  background: #feeceb;\n}\n\n.partner-requests-table[_ngcontent-%COMP%] {\n  min-width: 1220px;\n}\n\n.partner-request-main-cell[_ngcontent-%COMP%] {\n  min-width: 220px;\n}\n\n.partner-request-contact-cell[_ngcontent-%COMP%] {\n  min-width: 180px;\n}\n\n.partner-request-address-cell[_ngcontent-%COMP%] {\n  min-width: 240px;\n}\n\n.partner-request-status-cell[_ngcontent-%COMP%] {\n  min-width: 170px;\n  display: grid;\n  gap: 6px;\n}\n\n.partner-request-message-cell[_ngcontent-%COMP%] {\n  min-width: 260px;\n}\n\n.partner-request-notes[_ngcontent-%COMP%] {\n  white-space: pre-line;\n}\n\n.partner-request-empty-note[_ngcontent-%COMP%] {\n  color: #6b7d98;\n  font-style: italic;\n}\n\n.empty-cell[_ngcontent-%COMP%] {\n  color: #6b7d98;\n  text-align: center;\n  font-style: italic;\n}\n\n.spinner-cell[_ngcontent-%COMP%] {\n  padding: 16px 10px;\n}\n\n.spinner-cell[_ngcontent-%COMP%]   .mat-mdc-progress-spinner[_ngcontent-%COMP%], \n.inline-loader[_ngcontent-%COMP%]   .mat-mdc-progress-spinner[_ngcontent-%COMP%] {\n  --mdc-circular-progress-active-indicator-color: #1c7be0;\n  margin: 0 auto;\n}\n\n.inline-loader[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 8px 0;\n}\n\ncode[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #24406c;\n  border-radius: 6px;\n  padding: 3px 7px;\n}\n\n@media (max-width: 1100px) {\n  .dashboard-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 220px 1fr;\n  }\n\n  .brand[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n   .brand[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .brand[_ngcontent-%COMP%] {\n    justify-content: center;\n    border-bottom: 0;\n    padding-bottom: 0;\n  }\n}\n\n@media (max-width: 860px) {\n  .dashboard-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .sidebar[_ngcontent-%COMP%] {\n    padding: 12px;\n    gap: 12px;\n    position: static;\n    top: auto;\n    align-self: auto;\n    height: auto;\n    overflow: visible;\n  }\n\n  .sidebar-nav[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .nav-item[_ngcontent-%COMP%] {\n    justify-content: center;\n  }\n\n  .dashboard-main[_ngcontent-%COMP%] {\n    padding: 14px;\n  }\n\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .table-head[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n\n  .table-actions[_ngcontent-%COMP%] {\n    width: 100%;\n    flex-direction: column;\n    align-items: stretch;\n  }\n\n  .toggle-panel-btn[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: center;\n  }\n\n  .catalog-list-head[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n\n  .catalog-tabs[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    width: 100%;\n  }\n\n  .invite-code-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .address-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .coords-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .map-search-form[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .address-span-2[_ngcontent-%COMP%] {\n    grid-column: auto;\n  }\n\n  .generate-code-btn[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n\n  .media-upload-row[_ngcontent-%COMP%], \n   .media-upload-actions[_ngcontent-%COMP%], \n   .audio-upload-row[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n\n  .modern-table[_ngcontent-%COMP%] {\n    min-width: 700px;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdminDashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-admin-dashboard', template: "<section class=\"page-shell admin-shell\">\n  <mat-card class=\"card login-card\" *ngIf=\"!authChecked\">\n    <div class=\"loading-state\">\n      <mat-spinner diameter=\"34\"></mat-spinner>\n      <p>Controllo sessione dashboard...</p>\n    </div>\n  </mat-card>\n\n  <mat-card class=\"card login-card\" *ngIf=\"authChecked && !isAuthenticated\">\n    <h1 class=\"page-title\">Dashboard</h1>\n    <p class=\"page-subtitle\">Accedi per entrare nella dashboard.</p>\n\n    <form [formGroup]=\"loginForm\" (ngSubmit)=\"login()\" class=\"form-grid\">\n      <mat-form-field appearance=\"outline\">\n        <mat-label>Email</mat-label>\n        <input matInput type=\"email\" formControlName=\"email\" autocomplete=\"username\" />\n      </mat-form-field>\n\n      <mat-form-field appearance=\"outline\">\n        <mat-label>Password</mat-label>\n        <input matInput type=\"password\" formControlName=\"password\" autocomplete=\"current-password\" />\n      </mat-form-field>\n\n      <button mat-flat-button color=\"primary\" class=\"big-cta\" [disabled]=\"loggingIn\" type=\"submit\">\n        {{ loggingIn ? 'Accesso...' : 'Accedi' }}\n      </button>\n    </form>\n  </mat-card>\n\n  <div class=\"dashboard-layout\" *ngIf=\"authChecked && isAuthenticated\">\n    <aside class=\"sidebar\">\n      <div class=\"brand\">\n        <div class=\"brand-mark\">\n          <img src=\"/assets/logo.png\" alt=\"Logo Walk Around\" loading=\"eager\" decoding=\"sync\" fetchpriority=\"high\" />\n        </div>\n        <div>\n          <strong>Walk Around</strong>\n          <p>Dashboard</p>\n        </div>\n      </div>\n\n      <nav class=\"sidebar-nav\" *ngIf=\"canAccessDashboard && visibleSections.length\">\n        <button\n          type=\"button\"\n          class=\"nav-item\"\n          *ngFor=\"let section of visibleSections\"\n          [class.active]=\"activeSection === section.id\"\n          (click)=\"selectSection(section.id)\"\n        >\n          <span>{{ section.label }}</span>\n        </button>\n      </nav>\n\n      <div class=\"sidebar-footer\">\n        <span>{{ currentEmail }}</span>\n        <button mat-stroked-button color=\"primary\" class=\"sidebar-action\" *ngIf=\"isImpersonating\" (click)=\"exitImpersonation()\">\n          Torna ad admin\n        </button>\n        <button mat-stroked-button color=\"primary\" class=\"sidebar-action\" (click)=\"logout()\">Logout</button>\n      </div>\n    </aside>\n\n    <main class=\"dashboard-main\">\n      <header class=\"dashboard-topbar card\" *ngIf=\"activeSection === 'users'\">\n        <div>\n          <h1 class=\"page-title\">Utenti</h1>\n          <p class=\"page-subtitle\">\n            Connesso come <strong>{{ currentName || currentEmail }}</strong> - {{ roleLabel(currentRole) }}\n          </p>\n          <p class=\"page-subtitle\" *ngIf=\"isImpersonating\">\n            Modalita impersonazione attiva (origine: {{ impersonatedByEmail }})\n          </p>\n        </div>\n      </header>\n\n      <mat-card class=\"card\" *ngIf=\"!canAccessDashboard\">\n        <h2>Accesso dashboard non consentito</h2>\n        <p>Solo admin e gestori struttura possono accedere alla dashboard.</p>\n      </mat-card>\n\n      <ng-container *ngIf=\"isFacilityManager && activeSection === 'users'\">\n        <div class=\"stats-grid\">\n          <mat-card class=\"stat-card\">\n            <span>Utenti associati</span>\n            <strong *ngIf=\"!loadingAssociatedUsers; else associatedUsersLoadingStat\">{{ totalAssociatedUsers }}</strong>\n            <ng-template #associatedUsersLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>Struttura</span>\n            <strong>{{ managerStructureName }}</strong>\n          </mat-card>\n        </div>\n\n        <mat-card class=\"card table-card\">\n          <div class=\"table-head\">\n            <div>\n              <h2>Utenti associati alla struttura</h2>\n              <p class=\"table-subtitle\">Vista sola lettura: non puoi modificare ruoli o permessi.</p>\n            </div>\n          </div>\n\n          <p class=\"inline-note\" *ngIf=\"!managedStructureId\">\n            Il tuo account gestore non ha una struttura assegnata.\n          </p>\n\n          <div class=\"table-wrap\" *ngIf=\"managedStructureId\">\n            <table class=\"modern-table users-table payments-table compact-table\">\n              <thead>\n                <tr>\n                  <th>ID Utente App</th>\n                  <th>Registrato il</th>\n                  <th>Codice associato</th>\n                  <th>Stato codice</th>\n                  <th>Acquisti</th>\n                  <th>Spesa totale</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr *ngIf=\"loadingAssociatedUsers\">\n                  <td colspan=\"6\" class=\"empty-cell spinner-cell\">\n                    <mat-spinner diameter=\"28\"></mat-spinner>\n                  </td>\n                </tr>\n                <tr *ngIf=\"!loadingAssociatedUsers && !associatedUsers.length\">\n                  <td colspan=\"6\" class=\"empty-cell\">Nessun utente associato alla tua struttura.</td>\n                </tr>\n                <ng-container *ngIf=\"!loadingAssociatedUsers\">\n                  <tr *ngFor=\"let associatedUser of associatedUsers\">\n                    <td><code>{{ associatedUser.userId }}</code></td>\n                    <td>{{ formatDateTime(associatedUser.associatedAt) }}</td>\n                    <td><code>{{ associatedUser.inviteCode || '-' }}</code></td>\n                    <td class=\"associated-code-status-cell\">\n                      <span\n                        class=\"association-status\"\n                        [class.association-status-used]=\"associatedUser.inviteCodeUsed\"\n                        [class.association-status-active]=\"!associatedUser.inviteCodeUsed\"\n                      >\n                        {{ associatedUser.inviteCodeUsed ? 'Usato' : 'Non usato' }}\n                      </span>\n                      <small *ngIf=\"associatedUser.inviteCodeUsedAt\">{{ formatDateTime(associatedUser.inviteCodeUsedAt) }}</small>\n                    </td>\n                    <td>{{ associatedUser.purchasesCount }}</td>\n                    <td>{{ formatCurrency(associatedUser.totalSpent) }}</td>\n                  </tr>\n                </ng-container>\n              </tbody>\n            </table>\n          </div>\n        </mat-card>\n      </ng-container>\n\n      <ng-container *ngIf=\"isFacilityManager && activeSection === 'payments'\">\n        <mat-card class=\"card table-card\">\n          <div class=\"table-head\">\n            <div>\n              <h2>Pagamenti struttura</h2>\n              <p class=\"table-subtitle\">Visualizzi solo i pagamenti collegati alla tua struttura.</p>\n            </div>\n          </div>\n\n          <div class=\"stats-grid manager-payments-stats\">\n            <mat-card class=\"stat-card\">\n              <span>Pagamenti registrati</span>\n              <strong *ngIf=\"!loadingPayments; else managerPaymentsLoadingStat\">{{ totalPayments }}</strong>\n              <ng-template #managerPaymentsLoadingStat>\n                <div class=\"stat-spinner\">\n                  <mat-spinner diameter=\"24\"></mat-spinner>\n                </div>\n              </ng-template>\n            </mat-card>\n            <mat-card class=\"stat-card\">\n              <span>Guadagno struttura</span>\n              <strong *ngIf=\"!loadingPayments; else managerEarningsLoadingStat\">{{ formatCurrency(totalStructureEarnings) }}</strong>\n              <ng-template #managerEarningsLoadingStat>\n                <div class=\"stat-spinner\">\n                  <mat-spinner diameter=\"24\"></mat-spinner>\n                </div>\n              </ng-template>\n            </mat-card>\n          </div>\n\n          <div class=\"table-wrap\">\n            <table class=\"modern-table users-table\">\n              <thead>\n                <tr>\n                  <th>Data</th>\n                  <th>Utente</th>\n                  <th>Data nascita</th>\n                  <th>Metodo pagamento</th>\n                  <th>Contenuto</th>\n                  <th>Prezzo base</th>\n                  <th>Sconto</th>\n                  <th>Pagato</th>\n                  <th>Stato pagamento</th>\n                  <th>Codice</th>\n                  <th>Quota struttura</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr *ngIf=\"loadingPayments\">\n                  <td colspan=\"11\" class=\"empty-cell spinner-cell\">\n                    <mat-spinner diameter=\"28\"></mat-spinner>\n                  </td>\n                </tr>\n                <tr *ngIf=\"!loadingPayments && !payments.length\">\n                  <td colspan=\"11\" class=\"empty-cell\">Nessun pagamento registrato per la tua struttura.</td>\n                </tr>\n                <ng-container *ngIf=\"!loadingPayments\">\n                  <tr *ngFor=\"let payment of payments; trackBy: trackByPaymentId\">\n                    <td>{{ formatDateTime(payment.purchasedAt) }}</td>\n                    <td class=\"payment-user-cell\">\n                      <strong>{{ payment.customerFirstName }} {{ payment.customerLastName }}</strong>\n                      <small>{{ payment.customerEmail }}</small>\n                      <small>{{ payment.customerPhone }}</small>\n                      <small>{{ payment.customerAddress }}</small>\n                      <small>ID app: <code>{{ payment.customerId }}</code></small>\n                    </td>\n                    <td>{{ payment.customerBirthDate | date: 'dd/MM/yyyy':'':'it-IT' }}</td>\n                    <td class=\"payment-method-cell\">\n                      <strong>{{ payment.paymentMethod }}</strong>\n                      <small>{{ payment.paymentProvider }}</small>\n                    </td>\n                    <td class=\"payment-content-cell\">\n                      <small>{{ paymentTargetLabel(payment) }}</small>\n                      <span class=\"payment-type-badge\" [class.bundle]=\"payment.type === 'bundle'\" [class.single]=\"payment.type === 'single'\">\n                        {{ payment.type === 'bundle' ? 'Pacchetto citt\u00E0' : 'Luogo singolo' }}\n                      </span>\n                    </td>\n                    <td>{{ formatCurrency(payment.baseAmount) }}</td>\n                    <td>{{ formatCurrency(payment.discountAmount) }} ({{ payment.discountPercent }}%)</td>\n                    <td>{{ formatCurrency(payment.paidAmount) }}</td>\n                    <td>{{ payment.paymentStatus }}</td>\n                    <td><code>{{ payment.inviteCode || '-' }}</code></td>\n                    <td>{{ formatCurrency(payment.structureEarningAmount) }}</td>\n                  </tr>\n                </ng-container>\n              </tbody>\n            </table>\n          </div>\n        </mat-card>\n      </ng-container>\n\n      <ng-container *ngIf=\"canManageUsers && activeSection === 'users'\">\n        <div class=\"stats-grid\">\n          <mat-card class=\"stat-card\">\n            <span>Utenti</span>\n            <strong *ngIf=\"!loadingUsers; else usersLoadingStat\">{{ totalUsers }}</strong>\n            <ng-template #usersLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>Strutture</span>\n            <strong *ngIf=\"!loadingStructures; else structuresLoadingStat\">{{ totalStructures }}</strong>\n            <ng-template #structuresLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n        </div>\n\n        <mat-card class=\"card table-card\">\n          <div class=\"table-head\">\n            <div>\n              <h2>Lista utenti</h2>\n              <p class=\"table-subtitle\">Gestisci struttura utente e operazioni rapide.</p>\n            </div>\n            <div class=\"table-actions\">\n              <button type=\"button\" class=\"toggle-panel-btn\" [class.active]=\"showCreateUserSection\" (click)=\"toggleCreateUserSection()\">\n                <span class=\"toggle-panel-icon\">{{ showCreateUserSection ? '-' : '+' }}</span>\n                <span>{{ showCreateUserSection ? 'Chiudi aggiunta utente' : 'Aggiungi utente' }}</span>\n              </button>\n              <button type=\"button\" class=\"toggle-panel-btn\" [class.active]=\"showInviteSection\" (click)=\"toggleInviteSection()\">\n                <span class=\"toggle-panel-icon\">{{ showInviteSection ? '-' : '+' }}</span>\n                <span>{{ showInviteSection ? 'Chiudi invito' : 'Invita utente' }}</span>\n              </button>\n            </div>\n          </div>\n\n          <section class=\"inline-panel\" *ngIf=\"showInviteSection\">\n            <h3>Nuovo invito utente</h3>\n            <p>Compila i dati, scegli ruolo e struttura se il ruolo e gestore.</p>\n\n            <form [formGroup]=\"inviteForm\" (ngSubmit)=\"invite()\" class=\"form-grid\">\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Nome</mat-label>\n                <input matInput type=\"text\" formControlName=\"firstName\" autocomplete=\"given-name\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Cognome</mat-label>\n                <input matInput type=\"text\" formControlName=\"lastName\" autocomplete=\"family-name\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Email utente</mat-label>\n                <input matInput type=\"email\" formControlName=\"email\" autocomplete=\"email\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Permesso</mat-label>\n                <mat-select formControlName=\"role\">\n                  <mat-option value=\"facility_manager\">Gestore struttura</mat-option>\n                  <mat-option value=\"admin\">Admin</mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\" *ngIf=\"isInviteStructureRequired\">\n                <mat-label>Struttura</mat-label>\n                <mat-select formControlName=\"structureId\" [disabled]=\"!structures.length\">\n                  <mat-option [value]=\"noStructureValue\" [disabled]=\"true\">Seleziona struttura</mat-option>\n                  <mat-option *ngFor=\"let structure of structures\" [value]=\"structure.id\">\n                    {{ structure.name }}\n                  </mat-option>\n                </mat-select>\n                <mat-error *ngIf=\"isInviteStructureMissing && inviteForm.controls.structureId.touched\">\n                  La struttura e obbligatoria per il gestore\n                </mat-error>\n              </mat-form-field>\n\n              <p class=\"inline-note\" *ngIf=\"isInviteStructureRequired && !structures.length && !loadingStructures\">\n                Nessuna struttura registrata: crea prima una struttura nella sezione dedicata.\n              </p>\n              <div class=\"inline-loader\" *ngIf=\"isInviteStructureRequired && loadingStructures\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n\n              <button mat-flat-button color=\"primary\" class=\"big-cta\" [disabled]=\"!canSubmitInvite\" type=\"submit\">\n                {{ inviting ? 'Invio...' : 'Invia invito' }}\n              </button>\n            </form>\n\n            <div class=\"invite-result\" *ngIf=\"lastInvite as invite\">\n              <strong>Ultimo invito:</strong>\n              <span>{{ displayName(invite.firstName, invite.lastName, invite.email) }} ({{ invite.email }})</span>\n              <span *ngIf=\"invite.structureName\">Struttura: {{ invite.structureName }}</span>\n              <span>Scadenza: {{ formatDateTime(invite.expiresAt) }}</span>\n            </div>\n          </section>\n\n          <section class=\"inline-panel\" *ngIf=\"showCreateUserSection\">\n            <h3>Aggiungi utente dashboard</h3>\n            <p>Crea direttamente un utente con password. Ruolo non modificabile dopo la creazione.</p>\n\n            <form [formGroup]=\"createUserForm\" (ngSubmit)=\"createUser()\" class=\"form-grid\">\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Nome</mat-label>\n                <input matInput type=\"text\" formControlName=\"firstName\" autocomplete=\"given-name\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Cognome</mat-label>\n                <input matInput type=\"text\" formControlName=\"lastName\" autocomplete=\"family-name\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Email utente</mat-label>\n                <input matInput type=\"email\" formControlName=\"email\" autocomplete=\"email\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Password iniziale</mat-label>\n                <input matInput type=\"password\" formControlName=\"password\" autocomplete=\"new-password\" />\n                <mat-hint>Minimo 8 caratteri</mat-hint>\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Ruolo</mat-label>\n                <mat-select formControlName=\"role\">\n                  <mat-option value=\"user\">Utente normale</mat-option>\n                  <mat-option value=\"facility_manager\">Gestore struttura</mat-option>\n                  <mat-option value=\"admin\">Admin</mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\" *ngIf=\"isCreateUserStructureVisible\">\n                <mat-label>{{ isCreateUserStructureRequired ? 'Struttura (obbligatoria)' : 'Struttura (opzionale)' }}</mat-label>\n                <mat-select formControlName=\"structureId\" [disabled]=\"!structures.length\">\n                  <mat-option [value]=\"noStructureValue\" [disabled]=\"isCreateUserStructureRequired\">\n                    {{ isCreateUserStructureRequired ? 'Seleziona struttura' : 'Nessuna struttura' }}\n                  </mat-option>\n                  <mat-option *ngFor=\"let structure of structures\" [value]=\"structure.id\">\n                    {{ structure.name }}\n                  </mat-option>\n                </mat-select>\n                <mat-error *ngIf=\"isCreateUserStructureMissing && createUserForm.controls.structureId.touched\">\n                  La struttura e obbligatoria per il gestore\n                </mat-error>\n              </mat-form-field>\n\n              <p class=\"inline-note\" *ngIf=\"isCreateUserStructureVisible && !structures.length && !loadingStructures\">\n                Nessuna struttura registrata: crea prima una struttura nella sezione dedicata.\n              </p>\n              <div class=\"inline-loader\" *ngIf=\"isCreateUserStructureVisible && loadingStructures\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n\n              <button mat-flat-button color=\"primary\" class=\"big-cta\" [disabled]=\"!canSubmitCreateUser\" type=\"submit\">\n                {{ creatingUser ? 'Creazione...' : 'Crea utente' }}\n              </button>\n            </form>\n          </section>\n\n          <div class=\"users-structure-filter\" *ngIf=\"isUsersStructureFilterActive\">\n            <span>\n              Filtro struttura attivo:\n              <strong>{{ usersStructureFilterName }}</strong>\n            </span>\n            <button type=\"button\" class=\"ghost-btn\" (click)=\"clearUsersStructureFilter()\">Rimuovi filtro</button>\n          </div>\n\n          <div class=\"table-wrap\">\n            <table class=\"modern-table users-table\">\n              <thead>\n                <tr>\n                  <th>Utente</th>\n                  <th>Ruolo</th>\n                  <th>Strutture associate</th>\n                  <th>Sbloccati</th>\n                  <th>Data registrazione</th>\n                  <th>Azioni</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr *ngIf=\"loadingUsers\">\n                  <td colspan=\"6\" class=\"empty-cell spinner-cell\">\n                    <mat-spinner diameter=\"28\"></mat-spinner>\n                  </td>\n                </tr>\n                <tr *ngIf=\"!loadingUsers && !usersForDisplay.length\">\n                  <td colspan=\"6\" class=\"empty-cell\">Nessun utente disponibile.</td>\n                </tr>\n                <ng-container *ngIf=\"!loadingUsers\">\n                  <tr *ngFor=\"let user of usersForDisplay\">\n                    <td>\n                      <strong>{{ displayName(user.firstName, user.lastName, user.email) }}</strong>\n                      <small>{{ user.email }}</small>\n                      <small class=\"structure-name muted\" *ngIf=\"isReadOnlyAppUser(user)\">\n                        Utente app associato da codice invito/sconto\n                      </small>\n                    </td>\n                    <td>{{ roleLabel(user.role) }}</td>\n                    <td>\n                      <div class=\"structure-cell\">\n                        <div class=\"association-list\" *ngIf=\"userAssociations(user).length; else noUserAssociations\">\n                          <div class=\"association-item\" *ngFor=\"let association of userAssociations(user)\">\n                            <div class=\"association-head\">\n                              <small class=\"structure-name\">{{ association.structureName || association.structureId }}</small>\n                              <span [class]=\"userAssociationStatusClass(association.status)\" [matTooltip]=\"userAssociationStatusTooltip(association.status)\">\n                                {{ userAssociationStatusLabel(association.status) }}\n                              </span>\n                            </div>\n                            <small class=\"structure-code\" *ngIf=\"association.inviteCode\">\n                              Codice: <code>{{ association.inviteCode }}</code>\n                            </small>\n                          </div>\n                        </div>\n                        <ng-template #noUserAssociations>\n                          <small class=\"structure-name muted\">Nessuna struttura associata</small>\n                        </ng-template>\n                      </div>\n                    </td>\n                    <td>\n                      <div class=\"unlocked-cell\" *ngIf=\"user.role !== 'admin'; else adminUnlockedAll\">\n                        <div class=\"unlocked-counts\" *ngIf=\"user.unlockedCitiesCount || user.unlockedPoisCount; else noUnlockedItems\">\n                          <small><strong>Citt\u00E0:</strong> {{ user.unlockedCitiesCount }}</small>\n                          <small><strong>Luoghi:</strong> {{ user.unlockedPoisCount }}</small>\n                        </div>\n                        <div class=\"unlocked-tags\" *ngIf=\"userUnlockedCities(user).length\">\n                          <span class=\"status-pill ok\" *ngFor=\"let city of userUnlockedCities(user) | slice: 0 : 3\">\n                            {{ city.cityName || city.cityId }}\n                          </span>\n                        </div>\n                        <div class=\"unlocked-pois\" *ngIf=\"userUnlockedPois(user).length\">\n                          <small class=\"unlocked-poi-item\" *ngFor=\"let poi of userUnlockedPois(user) | slice: 0 : 3\">\n                            {{ poi.poiName || poi.poiId }}\n                            <span *ngIf=\"poi.cityName\">({{ poi.cityName }})</span>\n                          </small>\n                        </div>\n                        <small class=\"structure-name muted\" *ngIf=\"user.unlockedCitiesCount > 3 || user.unlockedPoisCount > 3\">\n                          + altri contenuti sbloccati\n                        </small>\n                        <ng-template #noUnlockedItems>\n                          <small class=\"structure-name muted\">Nessun contenuto sbloccato</small>\n                        </ng-template>\n                      </div>\n                      <ng-template #adminUnlockedAll>\n                        <div class=\"unlocked-cell\">\n                          <span class=\"status-pill ok\">Tutti</span>\n                          <small class=\"structure-name muted\">Accesso completo (profilo admin)</small>\n                        </div>\n                      </ng-template>\n                    </td>\n                    <td>{{ formatDateTime(user.createdAt) }}</td>\n                    <td>\n                      <div class=\"action-buttons user-row-actions\" *ngIf=\"user.id !== currentUserId && !isReadOnlyAppUser(user)\">\n                        <div class=\"user-row-actions-top\">\n                          <button\n                            mat-stroked-button\n                            color=\"primary\"\n                            (click)=\"sendPasswordReset(user)\"\n                            [disabled]=\"resettingPasswordUserId === user.id || !user.isRegistered\"\n                          >\n                            {{ resettingPasswordUserId === user.id ? 'Invio reset...' : 'Reset password' }}\n                          </button>\n\n                          <button\n                            mat-stroked-button\n                            color=\"warn\"\n                            (click)=\"deleteUser(user)\"\n                            [disabled]=\"deletingUserId === user.id || savingUserId === user.id\"\n                          >\n                            {{ deletingUserId === user.id ? 'Elimino...' : 'Elimina' }}\n                          </button>\n                        </div>\n\n                        <button\n                          mat-flat-button\n                          color=\"accent\"\n                          class=\"user-row-impersonate-btn\"\n                          (click)=\"impersonate(user)\"\n                          [disabled]=\"impersonatingUserId === user.id || !user.isRegistered\"\n                          [matTooltip]=\"'Entra come questo utente per verificare esattamente cosa puo vedere nella dashboard.'\"\n                          matTooltipPosition=\"above\"\n                        >\n                          {{\n                            impersonatingUserId === user.id\n                              ? 'Accesso...'\n                              : 'Entra come questo utente'\n                          }}\n                        </button>\n                      </div>\n                    </td>\n                  </tr>\n                </ng-container>\n              </tbody>\n            </table>\n          </div>\n        </mat-card>\n      </ng-container>\n\n      <ng-container *ngIf=\"canViewDiscountCodes && activeSection === 'discounts'\">\n        <mat-card class=\"card table-card\">\n          <div class=\"table-head\">\n            <div>\n              <h2>Codici invito e sconto</h2>\n              <p class=\"table-subtitle\" *ngIf=\"canManageUsers\">\n                Ogni struttura puo avere piu codici con regole diverse e scadenza dedicata.\n              </p>\n              <p class=\"table-subtitle\" *ngIf=\"!canManageUsers\">\n                Vista sola lettura dei codici sconto della tua struttura.\n              </p>\n            </div>\n            <div class=\"table-actions\" *ngIf=\"canManageUsers\">\n              <button type=\"button\" class=\"toggle-panel-btn\" (click)=\"toggleDiscountCodeCreateSection()\">\n                <span class=\"toggle-panel-icon\">+</span>\n                <span>Aggiungi codice sconto/struttura</span>\n              </button>\n            </div>\n          </div>\n\n          <div class=\"table-wrap\">\n            <table class=\"modern-table structures-table payments-table compact-table\">\n              <thead>\n                <tr>\n                  <th>Struttura</th>\n                  <th>Codici sconto associati</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr *ngIf=\"loadingDiscountCodes || loadingStructures\">\n                  <td colspan=\"2\" class=\"empty-cell spinner-cell\">\n                    <mat-spinner diameter=\"28\"></mat-spinner>\n                  </td>\n                </tr>\n                <tr *ngIf=\"!loadingDiscountCodes && !loadingStructures && !discountCodeGroups.length\">\n                  <td colspan=\"2\" class=\"empty-cell\">Nessun codice sconto registrato.</td>\n                </tr>\n                <ng-container *ngIf=\"!loadingDiscountCodes && !loadingStructures\">\n                  <tr *ngFor=\"let group of discountCodeGroups\">\n                    <td>\n                      <strong>{{ group.structureName || '-' }}</strong>\n                      <small *ngIf=\"group.structureAddress\">{{ group.structureAddress }}</small>\n                      <small>{{ group.codes.length }} {{ group.codes.length === 1 ? 'codice' : 'codici' }}</small>\n                    </td>\n                    <td>\n                      <div class=\"discount-group-list\">\n                        <div class=\"discount-group-item\" *ngFor=\"let discountCode of group.codes\">\n                          <div class=\"discount-group-main\">\n                            <code>{{ discountCode.code }}</code>\n                            <span class=\"discount-group-meta\">\n                              Applicabile a:\n                              <strong>{{ discountCodeApplyToLabel(discountCode.applyTo) }}</strong>\n                            </span>\n                            <span class=\"discount-group-meta\">\n                              Citt\u00E0:\n                              <strong>{{ discountCodeCitiesLabel(discountCode) }}</strong>\n                            </span>\n                            <span class=\"discount-group-meta\">\n                              Sconto/Incasso:\n                              <strong>{{ discountCode.userDiscountPercentApplied }}%</strong>\n                              / {{ formatCurrency(discountCode.structureFixedAmountApplied) }}\n                            </span>\n                            <span class=\"discount-group-meta\">\n                              Scadenza: <strong>{{ formatDateTime(discountCode.expiresAt) }}</strong>\n                              <span\n                                class=\"expiry-badge\"\n                                [ngClass]=\"{\n                                  'expiry-badge-active': discountCodeExpiryStatus(discountCode.expiresAt) === 'active',\n                                  'expiry-badge-expired': discountCodeExpiryStatus(discountCode.expiresAt) === 'expired',\n                                  'expiry-badge-unknown': discountCodeExpiryStatus(discountCode.expiresAt) === 'unknown'\n                                }\"\n                              >\n                                {{\n                                  discountCodeExpiryStatus(discountCode.expiresAt) === 'active'\n                                    ? 'Attivo'\n                                    : discountCodeExpiryStatus(discountCode.expiresAt) === 'expired'\n                                      ? 'Scaduto'\n                                      : 'Da verificare'\n                                }}\n                              </span>\n                            </span>\n                          </div>\n                          <div class=\"action-buttons\" *ngIf=\"canManageUsers; else discountReadOnlyActions\">\n                            <button\n                              mat-stroked-button\n                              color=\"primary\"\n                              type=\"button\"\n                              (click)=\"editDiscountCode(discountCode)\"\n                              [disabled]=\"savingDiscountCodeId === discountCode.id || deletingDiscountCodeId === discountCode.id\"\n                            >\n                              Modifica\n                            </button>\n                            <button\n                              mat-stroked-button\n                              color=\"warn\"\n                              type=\"button\"\n                              (click)=\"deleteDiscountCode(discountCode)\"\n                              [disabled]=\"savingDiscountCodeId === discountCode.id || deletingDiscountCodeId === discountCode.id\"\n                            >\n                              {{ deletingDiscountCodeId === discountCode.id ? 'Elimino...' : 'Elimina' }}\n                            </button>\n                          </div>\n                          <ng-template #discountReadOnlyActions></ng-template>\n                        </div>\n                      </div>\n                    </td>\n                  </tr>\n                </ng-container>\n              </tbody>\n            </table>\n          </div>\n        </mat-card>\n      </ng-container>\n\n      <ng-container *ngIf=\"canManageUsers && activeSection === 'partnerRequests'\">\n        <div class=\"stats-grid\">\n          <mat-card class=\"stat-card\">\n            <span>Richieste totali</span>\n            <strong *ngIf=\"!loadingPartnerRequests; else partnerRequestsLoadingStat\">{{ totalPartnerRequests }}</strong>\n            <ng-template #partnerRequestsLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>In attesa</span>\n            <strong *ngIf=\"!loadingPartnerRequests; else partnerPendingLoadingStat\">{{ pendingPartnerRequests }}</strong>\n            <ng-template #partnerPendingLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>Approvate</span>\n            <strong *ngIf=\"!loadingPartnerRequests; else partnerApprovedLoadingStat\">{{ approvedPartnerRequests }}</strong>\n            <ng-template #partnerApprovedLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>PDF inviati</span>\n            <strong *ngIf=\"!loadingPartnerRequests; else partnerPdfLoadingStat\">{{ sentPartnerRequestPdfs }}</strong>\n            <ng-template #partnerPdfLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n        </div>\n\n        <mat-card class=\"card table-card\">\n          <div class=\"table-head\">\n            <div>\n              <h2>Richieste partner</h2>              \n              <p class=\"table-subtitle\">Approva o nega le richieste partner e genera il PDF promozionale da inviare alla struttura.</p>\n            </div>\n            <div class=\"table-actions\">\n              <button\n                mat-stroked-button\n                color=\"primary\"\n                type=\"button\"\n                (click)=\"loadPartnerRequests()\"\n                [disabled]=\"loadingPartnerRequests\"\n              >\n                {{ loadingPartnerRequests ? 'Aggiorno...' : 'Aggiorna elenco' }}\n              </button>\n            </div>\n          </div>\n\n          <div class=\"table-wrap\">\n            <table class=\"modern-table partner-requests-table\">\n              <thead>\n                <tr>\n                  <th>Struttura</th>\n                  <th>Referente</th>\n                  <th>Indirizzo</th>\n                  <th>Stato</th>\n                  <th>Messaggio</th>\n                  <th>Azioni</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr *ngIf=\"loadingPartnerRequests\">\n                  <td colspan=\"6\" class=\"empty-cell spinner-cell\">\n                    <mat-spinner diameter=\"28\"></mat-spinner>\n                  </td>\n                </tr>\n                <tr *ngIf=\"!loadingPartnerRequests && !partnerRequests.length\">\n                  <td colspan=\"6\" class=\"empty-cell\">Nessuna richiesta partner registrata.</td>\n                </tr>\n                <ng-container *ngIf=\"!loadingPartnerRequests\">\n                  <tr *ngFor=\"let request of partnerRequests; trackBy: trackByPartnerRequestId\">\n                    <td class=\"partner-request-main-cell\">\n                      <strong>#{{ request.id }} - {{ request.structureName }}</strong>\n                      <small *ngIf=\"request.structureType\">Tipologia: {{ request.structureType }}</small>\n                      <small *ngIf=\"request.roomsCount !== null\">Camere: {{ request.roomsCount }}</small>\n                      <small *ngIf=\"request.vatNumber\">P.IVA: {{ request.vatNumber }}</small>\n                      <small *ngIf=\"request.website\">Sito: {{ request.website }}</small>\n                      <small>Inviata il {{ formatDateTime(request.createdAt) }}</small>\n                    </td>\n                    <td class=\"partner-request-contact-cell\">\n                      <strong>{{ partnerRequestContactName(request) }}</strong>\n                      <small>{{ request.contactEmail }}</small>\n                      <small>{{ request.contactPhone }}</small>\n                    </td>\n                    <td class=\"partner-request-address-cell\">\n                      <small>{{ partnerRequestAddress(request) || '-' }}</small>\n                    </td>\n                    <td class=\"partner-request-status-cell\">\n                      <span class=\"status-pill\" [ngClass]=\"partnerRequestStatusClass(request.status)\">\n                        {{ partnerRequestStatusLabel(request.status) }}\n                      </span>\n                      <span class=\"status-pill\" [ngClass]=\"partnerRequestPdfStatusClass(request.pdfReleaseStatus)\">\n                        PDF: {{ partnerRequestPdfStatusLabel(request.pdfReleaseStatus) }}\n                      </span>\n                      <small *ngIf=\"request.discountCode\">Codice: <code>{{ request.discountCode }}</code></small>\n                      <small>Aggiornata {{ formatDateTime(request.updatedAt) }}</small>\n                    </td>\n                    <td class=\"partner-request-message-cell\">\n                      <small class=\"partner-request-notes\" [class.partner-request-empty-note]=\"!request.notes\">\n                        {{ request.notes || 'Nessun messaggio aggiuntivo.' }}\n                      </small>\n                    </td>\n                    <td>\n                      <div class=\"action-buttons\">\n                        <button\n                          mat-stroked-button\n                          color=\"primary\"\n                          type=\"button\"\n                          (click)=\"previewPartnerRequestPdf(request)\"\n                          [disabled]=\"isPartnerRequestBusy(request)\"\n                        >\n                          {{ previewingPartnerRequestId === request.id ? 'Apro...' : 'Anteprima PDF' }}\n                        </button>\n                        <button\n                          mat-flat-button\n                          color=\"primary\"\n                          type=\"button\"\n                          (click)=\"openPartnerRequestApproval(request)\"\n                          [disabled]=\"isPartnerRequestBusy(request) || request.status === 'approved'\"\n                        >\n                          {{ approvingPartnerRequestId === request.id ? 'Invio...' : 'Approva' }}\n                        </button>\n                        <button\n                          mat-stroked-button\n                          color=\"warn\"\n                          type=\"button\"\n                          (click)=\"rejectPartnerRequest(request)\"\n                          [disabled]=\"isPartnerRequestBusy(request) || request.status !== 'pending'\"\n                        >\n                          {{ rejectingPartnerRequestId === request.id ? 'Nego...' : 'Nega' }}\n                        </button>\n                      </div>\n                    </td>\n                  </tr>\n                </ng-container>\n              </tbody>\n            </table>\n          </div>\n        </mat-card>\n      </ng-container>\n\n      <ng-container *ngIf=\"canManageUsers && activeSection === 'payments'\">\n        <div class=\"stats-grid\">\n          <mat-card class=\"stat-card\">\n            <span>Pagamenti totali</span>\n            <strong *ngIf=\"!loadingPayments; else adminPaymentsLoadingStat\">{{ paymentsSummary.totalPayments }}</strong>\n            <ng-template #adminPaymentsLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>Incasso totale</span>\n            <strong *ngIf=\"!loadingPayments; else adminCollectedLoadingStat\">{{ formatCurrency(paymentsSummary.totalCollected) }}</strong>\n            <ng-template #adminCollectedLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>Sconti applicati</span>\n            <strong *ngIf=\"!loadingPayments; else adminDiscountLoadingStat\">{{ formatCurrency(paymentsSummary.totalDiscountAmount) }}</strong>\n            <ng-template #adminDiscountLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>Totale quota strutture</span>\n            <strong *ngIf=\"!loadingPayments; else adminEarningsLoadingStat\">{{ formatCurrency(paymentsSummary.totalStructureEarnings) }}</strong>\n            <ng-template #adminEarningsLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n        </div>\n\n        <mat-card class=\"card table-card\">\n          <div class=\"table-head\">\n            <div>\n              <h2>Pagamenti</h2>\n              <p class=\"table-subtitle\">Storico acquisti con eventuale codice sconto e quota struttura.</p>\n            </div>\n            <div class=\"table-actions\">\n              <mat-form-field appearance=\"outline\" class=\"compact-filter\">\n                <mat-label>Filtra per struttura</mat-label>\n                <mat-select\n                  [value]=\"selectedPaymentsStructureId\"\n                  (selectionChange)=\"onPaymentsStructureFilterChange($event.value)\"\n                >\n                  <mat-option value=\"\">Tutte le strutture</mat-option>\n                  <mat-option *ngFor=\"let structure of structures\" [value]=\"structure.id\">\n                    {{ structure.name }}\n                  </mat-option>\n                </mat-select>\n              </mat-form-field>\n            </div>\n          </div>\n\n          <div class=\"table-wrap\">\n            <table class=\"modern-table structures-table\">\n              <thead>\n                <tr>\n                  <th>Data</th>\n                  <th>Utente</th>\n                  <th>Data nascita</th>\n                  <th>Metodo pagamento</th>\n                  <th>Contenuto</th>\n                  <th>Prezzo base</th>\n                  <th>Sconto</th>\n                  <th>Pagato</th>\n                  <th>Stato pagamento</th>\n                  <th>Struttura</th>\n                  <th>Codice</th>\n                  <th>Quota struttura</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr *ngIf=\"loadingPayments\">\n                  <td colspan=\"12\" class=\"empty-cell spinner-cell\">\n                    <mat-spinner diameter=\"28\"></mat-spinner>\n                  </td>\n                </tr>\n                <tr *ngIf=\"!loadingPayments && !payments.length\">\n                  <td colspan=\"12\" class=\"empty-cell\">Nessun pagamento registrato.</td>\n                </tr>\n                <ng-container *ngIf=\"!loadingPayments\">\n                  <tr *ngFor=\"let payment of payments; trackBy: trackByPaymentId\">\n                    <td>{{ formatDateTime(payment.purchasedAt) }}</td>\n                    <td class=\"payment-user-cell\">\n                      <strong>{{ payment.customerFirstName }} {{ payment.customerLastName }}</strong>\n                      <small>{{ payment.customerEmail }}</small>\n                      <small>{{ payment.customerPhone }}</small>\n                      <small>{{ payment.customerAddress }}</small>\n                      <small>ID app: <code>{{ payment.customerId }}</code></small>\n                    </td>\n                    <td>{{ payment.customerBirthDate | date: 'dd/MM/yyyy':'':'it-IT' }}</td>\n                    <td class=\"payment-method-cell\">\n                      <strong>{{ payment.paymentMethod }}</strong>\n                      <small>{{ payment.paymentProvider }}</small>\n                    </td>\n                    <td class=\"payment-content-cell\">\n                      <small>{{ paymentTargetLabel(payment) }}</small>\n                      <span class=\"payment-type-badge\" [class.bundle]=\"payment.type === 'bundle'\" [class.single]=\"payment.type === 'single'\">\n                        {{ payment.type === 'bundle' ? 'Pacchetto citt\u00E0' : 'Luogo singolo' }}\n                      </span>\n                    </td>\n                    <td>{{ formatCurrency(payment.baseAmount) }}</td>\n                    <td>{{ formatCurrency(payment.discountAmount) }} ({{ payment.discountPercent }}%)</td>\n                    <td>{{ formatCurrency(payment.paidAmount) }}</td>\n                    <td>{{ payment.paymentStatus }}</td>\n                    <td>{{ payment.structureName || '-' }}</td>\n                    <td><code>{{ payment.inviteCode || '-' }}</code></td>\n                    <td>{{ formatCurrency(payment.structureEarningAmount) }}</td>\n                  </tr>\n                </ng-container>\n              </tbody>\n            </table>\n          </div>\n        </mat-card>\n      </ng-container>\n\n      <ng-container *ngIf=\"canManagePayPal && activeSection === 'paypal'\">\n        <div class=\"stats-grid\">\n          <mat-card class=\"stat-card\">\n            <span>Stato connessione</span>\n            <strong *ngIf=\"!loadingPayPalSettings; else payPalStatusLoading\">{{ payPalStatusLabel }}</strong>\n            <ng-template #payPalStatusLoading>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>Ambiente</span>\n            <strong *ngIf=\"!loadingPayPalSettings; else payPalModeLoading\">\n              {{ payPalSettings?.mode === 'live' ? 'Live' : 'Sandbox' }}\n            </strong>\n            <ng-template #payPalModeLoading>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n        </div>\n\n        <mat-card class=\"card table-card\">\n          <div class=\"table-head\">\n            <div>\n              <h2>Configurazione PayPal</h2>\n              <p class=\"table-subtitle\">Client ID, secret, ambiente e dati merchant usati dal checkout reale lato utente.</p>\n            </div>\n            <div class=\"table-actions\">\n              <button mat-stroked-button color=\"primary\" type=\"button\" (click)=\"testPayPalSettings()\" [disabled]=\"testingPayPalSettings || loadingPayPalSettings\">\n                {{ testingPayPalSettings ? 'Verifico...' : 'Verifica connessione' }}\n              </button>\n            </div>\n          </div>\n\n          <form class=\"paypal-settings-form\" [formGroup]=\"payPalForm\" (ngSubmit)=\"savePayPalSettings()\">\n            <div class=\"paypal-status-strip\" *ngIf=\"payPalSettings\">\n              <strong>{{ payPalStatusLabel }}</strong>\n              <span *ngIf=\"payPalSettings.lastVerifiedAt\">Ultima verifica: {{ formatDateTime(payPalSettings.lastVerifiedAt) }}</span>\n              <span *ngIf=\"payPalSettings.lastVerificationError\">{{ payPalSettings.lastVerificationError }}</span>\n            </div>\n\n            <div class=\"form-grid\">\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Ambiente PayPal</mat-label>\n                <mat-select formControlName=\"mode\">\n                  <mat-option value=\"sandbox\">Sandbox</mat-option>\n                  <mat-option value=\"live\">Live</mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Brand name</mat-label>\n                <input matInput formControlName=\"brandName\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\" class=\"full-span\">\n                <mat-label>Client ID</mat-label>\n                <input matInput formControlName=\"clientId\" autocomplete=\"off\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\" class=\"full-span\">\n                <mat-label>Client secret</mat-label>\n                <input matInput formControlName=\"clientSecret\" autocomplete=\"off\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Merchant ID</mat-label>\n                <input matInput formControlName=\"merchantId\" autocomplete=\"off\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Merchant email</mat-label>\n                <input matInput formControlName=\"merchantEmail\" autocomplete=\"off\" />\n                <mat-error *ngIf=\"payPalForm.controls.merchantEmail.invalid && payPalForm.controls.merchantEmail.touched\">\n                  Email PayPal non valida\n                </mat-error>\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Webhook ID</mat-label>\n                <input matInput formControlName=\"webhookId\" autocomplete=\"off\" />\n              </mat-form-field>\n            </div>\n\n            <mat-slide-toggle formControlName=\"isEnabled\">Attiva PayPal per tutti i checkout utente</mat-slide-toggle>\n\n            <div class=\"paypal-actions\">\n              <button mat-flat-button color=\"primary\" type=\"submit\" [disabled]=\"!canSavePayPalSettings\">\n                {{ savingPayPalSettings ? 'Salvo...' : 'Salva configurazione' }}\n              </button>\n            </div>\n          </form>\n        </mat-card>\n      </ng-container>\n\n      <ng-container *ngIf=\"canManageGptTranslations && activeSection === 'gptTranslations'\">\n        <div class=\"stats-grid\">\n          <mat-card class=\"stat-card\">\n            <span>Da tradurre</span>\n            <strong *ngIf=\"!loadingOpenAiTranslationStatus; else gptMissingLoading\">{{ gptTranslationMissingCount }}</strong>\n            <ng-template #gptMissingLoading>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>Completi</span>\n            <strong *ngIf=\"!loadingOpenAiTranslationStatus; else gptCompleteLoading\">{{ gptTranslationCompleteCount }}</strong>\n            <ng-template #gptCompleteLoading>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>Token usati</span>\n            <strong>{{ gptTranslationUsage.totalTokens }}</strong>\n          </mat-card>\n        </div>\n\n        <mat-card class=\"card table-card\">\n          <div class=\"table-head\">\n            <div>\n              <h2>Configurazione OpenAI</h2>\n              <p class=\"table-subtitle\">API key e modello usati solo dalle rotte admin per tradurre i luoghi di interesse.</p>\n            </div>\n          </div>\n\n          <form class=\"gpt-settings-form\" [formGroup]=\"openAiTranslationSettingsForm\" (ngSubmit)=\"saveOpenAiTranslationSettings()\">\n            <div class=\"paypal-status-strip\" *ngIf=\"openAiTranslationSettings\">\n              <strong>{{ openAiTranslationSettings.hasApiKey ? 'API key configurata' : 'API key non configurata' }}</strong>\n              <span *ngIf=\"openAiTranslationSettings.maskedApiKey\">{{ openAiTranslationSettings.maskedApiKey }}</span>\n              <span *ngIf=\"openAiTranslationSettings.updatedAt\">Ultimo aggiornamento: {{ formatDateTime(openAiTranslationSettings.updatedAt) }}</span>\n            </div>\n\n            <div class=\"form-grid\">\n              <mat-form-field appearance=\"outline\" class=\"full-span\">\n                <mat-label>API key OpenAI</mat-label>\n                <input\n                  matInput\n                  type=\"password\"\n                  formControlName=\"apiKey\"\n                  autocomplete=\"off\"\n                  [placeholder]=\"openAiTranslationSettings?.maskedApiKey || 'sk-...'\"\n                />\n                <mat-hint>Lascia vuoto per mantenere quella salvata.</mat-hint>\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Modello</mat-label>\n                <input matInput type=\"text\" formControlName=\"model\" autocomplete=\"off\" />\n              </mat-form-field>\n            </div>\n\n            <div class=\"paypal-actions\">\n              <button mat-flat-button color=\"primary\" type=\"submit\" [disabled]=\"!canSaveOpenAiTranslationSettings\">\n                {{ savingOpenAiTranslationSettings ? 'Salvo...' : 'Salva configurazione' }}\n              </button>\n            </div>\n          </form>\n        </mat-card>\n\n        <mat-card class=\"card table-card\">\n          <div class=\"table-head\">\n            <div>\n              <h2>Traduzioni luoghi di interesse</h2>\n              <p class=\"table-subtitle\">Seleziona una citt\u00E0 e traduci un singolo punto oppure tutti quelli incompleti.</p>\n            </div>\n            <div class=\"table-actions\">\n              <button\n                mat-flat-button\n                color=\"primary\"\n                type=\"button\"\n                (click)=\"translateMissingGptPoisForCity()\"\n                [disabled]=\"!canTranslateMissingGptPois\"\n              >\n                {{ bulkTranslatingPois ? 'Traduco...' : 'Traduci i luoghi mancanti della citt\u00E0' }}\n              </button>\n            </div>\n          </div>\n\n          <p class=\"inline-note\" *ngIf=\"openAiTranslationSettings && !openAiTranslationSettings.hasApiKey\">\n            Salva una API key OpenAI prima di avviare le traduzioni.\n          </p>\n\n          <form class=\"gpt-controls-grid\" [formGroup]=\"gptTranslationForm\">\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Citt\u00E0</mat-label>\n              <mat-select formControlName=\"cityId\" (selectionChange)=\"onGptTranslationCityChanged($event.value)\">\n                <mat-option *ngFor=\"let city of catalogCities\" [value]=\"city.id\">{{ city.name }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Lingua destinazione</mat-label>\n              <mat-select formControlName=\"targetLanguage\" (selectionChange)=\"onGptTranslationLanguageChanged($event.value)\">\n                <mat-option *ngFor=\"let language of contentLanguages\" [value]=\"language.code\">{{ language.label }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Luogo singolo</mat-label>\n              <mat-select formControlName=\"poiId\" (selectionChange)=\"onGptTranslationPoiChanged($event.value)\">\n                <mat-option value=\"\">Seleziona un luogo</mat-option>\n                <mat-option *ngFor=\"let poi of catalogPois; trackBy: trackByCatalogPoiId\" [value]=\"poi.id\">\n                  {{ poi.name }}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <mat-slide-toggle formControlName=\"overwrite\">Sovrascrivi traduzioni esistenti</mat-slide-toggle>\n          </form>\n\n          <div class=\"gpt-progress-panel\" *ngIf=\"gptTranslationProgressTotal\">\n            <div class=\"gpt-progress-head\">\n              <strong>{{ gptTranslationProgressDone }} / {{ gptTranslationProgressTotal }}</strong>\n              <span>{{ gptTranslationProgressPercent }}%</span>\n            </div>\n            <div class=\"gpt-progress-track\" aria-hidden=\"true\">\n              <span class=\"gpt-progress-bar\" [style.width.%]=\"gptTranslationProgressPercent\"></span>\n            </div>\n            <div class=\"gpt-token-strip\">\n              <span>Input: {{ gptTranslationUsage.inputTokens }}</span>\n              <span>Output: {{ gptTranslationUsage.outputTokens }}</span>\n              <span>Totale: {{ gptTranslationUsage.totalTokens }}</span>\n            </div>\n            <div class=\"gpt-log\" *ngIf=\"gptTranslationLog.length\">\n              <span *ngFor=\"let item of gptTranslationLog\">{{ item }}</span>\n            </div>\n          </div>\n\n          <div class=\"inline-loader\" *ngIf=\"loadingCatalogCities || loadingCatalogPois || loadingOpenAiTranslationStatus\">\n            <mat-spinner diameter=\"24\"></mat-spinner>\n          </div>\n\n          <div class=\"gpt-preview-grid\" *ngIf=\"selectedGptTranslationPoi as poi\">\n            <section class=\"translation-card\">\n              <h3>Italiano</h3>\n              <strong>{{ poi.name }}</strong>\n              <p>{{ poi.descriptionShort }}</p>\n              <p>{{ poi.descriptionLong }}</p>\n            </section>\n\n            <section class=\"translation-card\">\n              <h3>{{ selectedGptTranslationLanguageLabel }}</h3>\n              <strong>{{ poi.name }}</strong>\n              <p>{{ selectedGptTranslationPoiTargetFields.descriptionShort || 'Descrizione breve mancante' }}</p>\n              <p>{{ selectedGptTranslationPoiTargetFields.descriptionLong || 'Descrizione lunga mancante' }}</p>\n              <button\n                mat-flat-button\n                color=\"primary\"\n                type=\"button\"\n                (click)=\"translateSelectedGptPoi()\"\n                [disabled]=\"!canTranslateSelectedGptPoi\"\n              >\n                {{ translatingPoiId === poi.id ? 'Traduco...' : 'Traduci luogo selezionato' }}\n              </button>\n            </section>\n          </div>\n\n          <div class=\"table-wrap compact-wrap\">\n            <table class=\"modern-table compact-table\">\n              <thead>\n                <tr>\n                  <th>Luogo</th>\n                  <th>Stato</th>\n                  <th>Campi mancanti</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr *ngIf=\"!loadingOpenAiTranslationStatus && !openAiTranslationStatusRows.length\">\n                  <td colspan=\"3\" class=\"empty-cell\">Nessun luogo disponibile per la citt\u00E0 selezionata.</td>\n                </tr>\n                <tr *ngFor=\"let row of openAiTranslationStatusRows\">\n                  <td>\n                    <strong>{{ row.name }}</strong>\n                    <small>{{ row.cityName }}</small>\n                  </td>\n                  <td>\n                    <span class=\"association-status\" [class.association-status-active]=\"row.isComplete\" [class.association-status-used]=\"!row.isComplete\">\n                      {{ row.isComplete ? 'Completa' : 'Incompleta' }}\n                    </span>\n                  </td>\n                  <td>{{ gptMissingFieldsLabel(row.missingFields) }}</td>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n        </mat-card>\n      </ng-container>\n\n      <ng-container *ngIf=\"canManageCatalog && activeSection === 'catalog'\">\n        <div class=\"stats-grid\">\n          <mat-card class=\"stat-card\">\n            <span>Citt\u00E0 totali</span>\n            <strong *ngIf=\"!loadingCatalogCities; else catalogCitiesLoadingStat\">{{ catalogCities.length }}</strong>\n            <ng-template #catalogCitiesLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n          <mat-card class=\"stat-card\">\n            <span>Luoghi nella citt\u00E0 selezionata</span>\n            <strong *ngIf=\"!loadingCatalogPois; else catalogPoisLoadingStat\">{{ catalogPois.length }}</strong>\n            <ng-template #catalogPoisLoadingStat>\n              <div class=\"stat-spinner\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n            </ng-template>\n          </mat-card>\n        </div>\n\n        <mat-card class=\"card table-card\">\n          <div class=\"table-head\">\n            <div>\n              <h2>Gestione Citt\u00E0 e Luoghi di interesse</h2>\n              <p class=\"table-subtitle\">Catalogo admin con tab dedicati e modifica tramite modali.</p>\n            </div>\n          </div>\n\n          <div class=\"catalog-tabs\" role=\"tablist\" aria-label=\"Gestione catalogo\">\n            <button\n              type=\"button\"\n              class=\"catalog-tab\"\n              [class.active]=\"catalogTab === 'cities'\"\n              (click)=\"selectCatalogTab('cities')\"\n            >\n              Citt\u00E0\n            </button>\n            <button\n              type=\"button\"\n              class=\"catalog-tab\"\n              [class.active]=\"catalogTab === 'pois'\"\n              (click)=\"selectCatalogTab('pois')\"\n            >\n              Luoghi interesse\n            </button>\n          </div>\n\n          <div class=\"catalog-stack\" *ngIf=\"catalogTab === 'cities'\">\n            <section class=\"inline-panel\">\n              <div class=\"catalog-panel-head\">\n                <h3>Nuova citt\u00E0</h3>\n                <button type=\"button\" class=\"toggle-panel-btn\" (click)=\"toggleCatalogCityCreateSection()\">\n                  <span class=\"toggle-panel-icon\">+</span>\n                  <span>Nuova citt\u00E0</span>\n                </button>\n              </div>\n            </section>\n\n            <section class=\"inline-panel\">\n              <div class=\"catalog-list-head\">\n                <div>\n                  <h3>Lista citt\u00E0</h3>\n                  <p class=\"table-subtitle\">Modifica da modale e gestisci i luoghi dalla tab dedicata.</p>\n                </div>\n              </div>\n\n              <div class=\"table-wrap compact-wrap\">\n                <table class=\"modern-table compact-table\">\n                  <thead>\n                    <tr>\n                      <th>Citt\u00E0</th>\n                      <th>Regione</th>\n                      <th>Luoghi</th>\n                      <th>Azioni</th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    <tr *ngIf=\"loadingCatalogCities\">\n                      <td colspan=\"4\" class=\"empty-cell spinner-cell\">\n                        <mat-spinner diameter=\"28\"></mat-spinner>\n                      </td>\n                    </tr>\n                    <tr *ngIf=\"!loadingCatalogCities && !catalogCities.length\">\n                      <td colspan=\"4\" class=\"empty-cell\">Nessuna citt\u00E0 disponibile.</td>\n                    </tr>\n                    <ng-container *ngIf=\"!loadingCatalogCities\">\n                      <tr *ngFor=\"let city of catalogCities\">\n                        <td>\n                          <strong>{{ city.name }}</strong>\n                          <small *ngIf=\"city.isDefault\">Predefinita</small>\n                        </td>\n                        <td>{{ city.region }}</td>\n                        <td>{{ city.poiCount }}</td>\n                        <td>\n                          <div class=\"action-buttons\">\n                            <button mat-stroked-button color=\"primary\" type=\"button\" (click)=\"editCatalogCity(city)\">Modifica</button>\n                            <button\n                              mat-stroked-button\n                              color=\"warn\"\n                              type=\"button\"\n                              (click)=\"deleteCatalogCity(city)\"\n                              [disabled]=\"deletingCatalogCityId === city.id\"\n                            >\n                              {{ deletingCatalogCityId === city.id ? 'Elimino...' : 'Elimina' }}\n                            </button>\n                          </div>\n                        </td>\n                      </tr>\n                    </ng-container>\n                  </tbody>\n                </table>\n              </div>\n            </section>\n          </div>\n\n          <div class=\"catalog-stack\" *ngIf=\"catalogTab === 'pois'\">\n            <section class=\"inline-panel\">\n              <div class=\"catalog-panel-head\">\n                <h3>Nuovo luogo di interesse</h3>\n                <button type=\"button\" class=\"toggle-panel-btn\" (click)=\"toggleCatalogPoiCreateSection()\">\n                  <span class=\"toggle-panel-icon\">+</span>\n                  <span>Nuovo luogo interesse</span>\n                </button>\n              </div>\n            </section>\n\n            <section class=\"inline-panel\">\n              <div class=\"catalog-list-head\">\n                <div>\n                  <h3>Lista luoghi di interesse</h3>\n                  <p class=\"table-subtitle\">Sezione in colonna unica per mantenere la lettura pulita.</p>\n                </div>\n                <mat-form-field appearance=\"outline\" class=\"catalog-city-filter compact-filter\">\n                  <mat-label>Filtro citt\u00E0</mat-label>\n                  <mat-select [value]=\"selectedCatalogCityId\" (selectionChange)=\"onCatalogCityFilterChange($event.value)\">\n                    <mat-option *ngFor=\"let city of catalogCities\" [value]=\"city.id\">{{ city.name }}</mat-option>\n                  </mat-select>\n                </mat-form-field>\n              </div>\n\n              <p class=\"inline-note\" *ngIf=\"!loadingCatalogCities && !catalogCities.length\">Crea una citt\u00E0 per iniziare a gestire i POI.</p>\n              <div class=\"inline-loader\" *ngIf=\"loadingCatalogCities\">\n                <mat-spinner diameter=\"24\"></mat-spinner>\n              </div>\n              <p class=\"inline-note\" *ngIf=\"!loadingCatalogCities && catalogCities.length && !selectedCatalogCityId\">\n                Seleziona una citt\u00E0 per vedere la lista dei punti di interesse.\n              </p>\n\n              <div class=\"table-wrap\" *ngIf=\"selectedCatalogCityId\">\n                <table class=\"modern-table\">\n                  <thead>\n                    <tr>\n                      <th>Luogo</th>\n                      <th>Categoria</th>\n                      <th>Prezzo</th>\n                      <th>Durata</th>\n                      <th>Audio</th>\n                      <th>Azioni</th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    <tr *ngIf=\"loadingCatalogPois\">\n                      <td colspan=\"6\" class=\"empty-cell spinner-cell\">\n                        <mat-spinner diameter=\"28\"></mat-spinner>\n                      </td>\n                    </tr>\n                    <tr *ngIf=\"!loadingCatalogPois && !catalogPois.length\">\n                      <td colspan=\"6\" class=\"empty-cell\">Nessun luogo nella citt\u00E0 selezionata.</td>\n                    </tr>\n                    <ng-container *ngIf=\"!loadingCatalogPois\">\n                      <tr *ngFor=\"let poi of catalogPois; trackBy: trackByCatalogPoiId\">\n                        <td><strong>{{ poi.name }}</strong></td>\n                        <td>{{ poi.category }}</td>\n                        <td>{{ formatCurrency(poi.priceSingle) }}</td>\n                        <td>{{ formatCatalogPoiDuration(poi) }}</td>\n                        <td>\n                          <button\n                            type=\"button\"\n                            class=\"audio-link-btn\"\n                            [disabled]=\"!poi.audioUrl\"\n                            (click)=\"openCatalogPoiAudioPlayer(poi)\"\n                          >\n                            {{ poi.audioUrl ? audioFileNameFromUrl(poi.audioUrl) : 'Nessun audio' }}\n                          </button>\n                        </td>\n                        <td>\n                          <div class=\"action-buttons\">\n                            <button mat-stroked-button color=\"primary\" type=\"button\" (click)=\"editCatalogPoi(poi)\">Modifica</button>\n                            <button\n                              mat-stroked-button\n                              color=\"warn\"\n                              type=\"button\"\n                              (click)=\"deleteCatalogPoi(poi)\"\n                              [disabled]=\"deletingCatalogPoiId === poi.id\"\n                            >\n                              {{ deletingCatalogPoiId === poi.id ? 'Elimino...' : 'Elimina' }}\n                            </button>\n                          </div>\n                        </td>\n                      </tr>\n                    </ng-container>\n                  </tbody>\n                </table>\n              </div>\n            </section>\n          </div>\n        </mat-card>\n      </ng-container>\n\n      <ng-template #createCatalogCityDialog>\n        <h2 mat-dialog-title>Nuova citt\u00E0</h2>\n        <form [formGroup]=\"catalogCityForm\" (ngSubmit)=\"saveCatalogCity()\" class=\"form-grid dialog-form\">\n          <div mat-dialog-content class=\"dialog-body\">\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Nome citt\u00E0</mat-label>\n              <input matInput type=\"text\" formControlName=\"name\" />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Regione (fissa)</mat-label>\n              <input matInput type=\"text\" formControlName=\"region\" readonly />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Prezzo bundle (EUR)</mat-label>\n              <input matInput type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"bundlePrice\" />\n            </mat-form-field>\n\n            <div class=\"translation-panel\" formGroupName=\"translations\">\n              <div class=\"translation-panel-head\">\n                <strong>Traduzioni app utente</strong>\n                <span>Compila le lingue disponibili. Se un campo resta vuoto, l'app mostra l'italiano principale.</span>\n              </div>\n\n              <div class=\"translation-grid\">\n                <section class=\"translation-card\" *ngFor=\"let language of contentLanguages\" [formGroupName]=\"language.code\">\n                  <h3>{{ language.label }}</h3>\n\n                  <mat-form-field appearance=\"outline\">\n                    <mat-label>Nome citt\u00E0 {{ language.label }}</mat-label>\n                    <input matInput type=\"text\" formControlName=\"name\" />\n                  </mat-form-field>\n                </section>\n              </div>\n            </div>\n\n            <input type=\"hidden\" formControlName=\"heroImage\" />\n            <div class=\"media-block\">\n              <div class=\"media-block-head\">\n                <strong>Immagine citt\u00E0</strong>\n                <span>{{ catalogCityForm.controls.heroImage.value ? 'Pronta' : 'Nessuna immagine' }}</span>\n              </div>\n\n              <div class=\"media-preview\" *ngIf=\"catalogCityForm.controls.heroImage.value; else createCityImageEmpty\">\n                <img [src]=\"catalogCityForm.controls.heroImage.value\" alt=\"Anteprima immagine citt\u00E0\" />\n              </div>\n              <ng-template #createCityImageEmpty>\n                <div class=\"media-preview placeholder\">Carica un'immagine per la citt\u00E0.</div>\n              </ng-template>\n\n              <div class=\"media-upload-actions\">\n                <input\n                  #createCatalogCityImageInput\n                  type=\"file\"\n                  accept=\".jpg,.jpeg,.png,.webp,.gif,.avif,image/*\"\n                  hidden\n                  (change)=\"onCatalogCityImageFileSelected($event)\"\n                />\n                <button\n                  type=\"button\"\n                  class=\"generate-code-btn\"\n                  (click)=\"createCatalogCityImageInput.click()\"\n                  [disabled]=\"uploadingCatalogCityImage || savingCatalogCity\"\n                >\n                  {{\n                    uploadingCatalogCityImage\n                      ? 'Upload...'\n                      : catalogCityForm.controls.heroImage.value\n                        ? 'Sostituisci immagine'\n                        : 'Carica immagine'\n                  }}\n                </button>\n                <button\n                  type=\"button\"\n                  class=\"ghost-btn\"\n                  *ngIf=\"catalogCityForm.controls.heroImage.value\"\n                  (click)=\"clearCatalogCityImage()\"\n                  [disabled]=\"uploadingCatalogCityImage || savingCatalogCity\"\n                >\n                  Rimuovi immagine\n                </button>\n              </div>\n            </div>\n          </div>\n\n          <div mat-dialog-actions align=\"end\" class=\"dialog-actions\">\n            <button type=\"button\" class=\"row-save-btn secondary\" (click)=\"closeCreateCatalogCityDialog()\" [disabled]=\"savingCatalogCity\">\n              Annulla\n            </button>\n            <button mat-flat-button color=\"primary\" type=\"submit\" [disabled]=\"!canSaveCatalogCity\">\n              {{ savingCatalogCity ? 'Salvataggio...' : 'Crea citt\u00E0' }}\n            </button>\n          </div>\n        </form>\n      </ng-template>\n\n      <ng-template #createCatalogPoiDialog>\n        <h2 mat-dialog-title>Nuovo luogo di interesse</h2>\n        <form [formGroup]=\"catalogPoiForm\" (ngSubmit)=\"saveCatalogPoi()\" class=\"form-grid dialog-form\">\n          <div mat-dialog-content class=\"dialog-body\">\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Citt\u00E0</mat-label>\n              <mat-select [value]=\"selectedCatalogCityId\" (selectionChange)=\"onCatalogCityFilterChange($event.value)\">\n                <mat-option *ngFor=\"let city of catalogCities\" [value]=\"city.id\">{{ city.name }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <p class=\"inline-note\" *ngIf=\"!loadingCatalogCities && !catalogCities.length\">Crea prima almeno una citt\u00E0.</p>\n            <div class=\"inline-loader\" *ngIf=\"loadingCatalogCities\">\n              <mat-spinner diameter=\"24\"></mat-spinner>\n            </div>\n\n            <ng-container *ngIf=\"!loadingCatalogCities && catalogCities.length\">\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Nome luogo</mat-label>\n                <input matInput type=\"text\" formControlName=\"name\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Indirizzo</mat-label>\n                <input matInput type=\"text\" formControlName=\"address\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Categoria</mat-label>\n                <mat-select formControlName=\"category\">\n                  <mat-option *ngFor=\"let category of poiCategoryOptionsFor(catalogPoiForm.controls.category.value)\" [value]=\"category\">\n                    {{ category }}\n                  </mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <div class=\"coords-grid\">\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>Latitudine</mat-label>\n                  <input matInput type=\"number\" step=\"0.000001\" formControlName=\"lat\" />\n                </mat-form-field>\n\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>Longitudine</mat-label>\n                  <input matInput type=\"number\" step=\"0.000001\" formControlName=\"lng\" />\n                </mat-form-field>\n              </div>\n\n              <div class=\"map-picker-row\">\n                <button type=\"button\" class=\"toggle-panel-btn subtle\" (click)=\"openPoiMapPicker('create')\">\n                  <span class=\"toggle-panel-icon\">+</span>\n                  <span>Apri mappa e cerca coordinate</span>\n                </button>\n              </div>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Descrizione breve</mat-label>\n                <textarea matInput rows=\"2\" formControlName=\"descriptionShort\"></textarea>\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Descrizione lunga</mat-label>\n                <textarea matInput rows=\"5\" formControlName=\"descriptionLong\"></textarea>\n              </mat-form-field>\n\n              <div class=\"translation-panel\" formGroupName=\"translations\">\n                <div class=\"translation-panel-head\">\n                  <strong>Traduzioni app utente</strong>\n                  <span>Questi contenuti vengono mostrati nell'app utente in base alla lingua selezionata.</span>\n                </div>\n\n                <div class=\"translation-grid\">\n                  <section class=\"translation-card\" *ngFor=\"let language of contentLanguages\" [formGroupName]=\"language.code\">\n                    <h3>{{ language.label }}</h3>\n\n                    <mat-form-field appearance=\"outline\">\n                      <mat-label>Descrizione breve {{ language.label }}</mat-label>\n                      <textarea matInput rows=\"2\" formControlName=\"descriptionShort\"></textarea>\n                    </mat-form-field>\n\n                    <mat-form-field appearance=\"outline\">\n                      <mat-label>Descrizione lunga {{ language.label }}</mat-label>\n                      <textarea matInput rows=\"5\" formControlName=\"descriptionLong\"></textarea>\n                    </mat-form-field>\n\n                    <input type=\"hidden\" formControlName=\"audioUrl\" />\n                    <div class=\"media-block\">\n                      <div class=\"media-block-head\">\n                        <strong>Audioguida {{ language.label }}</strong>\n                        <span>{{ catalogPoiTranslationAudioUrl(language.code, 'create') ? 'Pronta' : 'Nessun audio' }}</span>\n                      </div>\n\n                      <div class=\"audio-file-pill\" *ngIf=\"catalogPoiTranslationAudioUrl(language.code, 'create'); else createPoiTranslationAudioEmpty\">\n                        <span class=\"audio-file-label\">File:</span>\n                        <strong>{{ audioFileNameFromUrl(catalogPoiTranslationAudioUrl(language.code, 'create')) }}</strong>\n                      </div>\n                      <ng-template #createPoiTranslationAudioEmpty>\n                        <div class=\"media-preview placeholder\">Audio opzionale: puoi caricarlo ora o dopo.</div>\n                      </ng-template>\n\n                      <div class=\"media-upload-actions\">\n                        <input\n                          #createPoiTranslationAudioInput\n                          type=\"file\"\n                          accept=\".mp3,.m4a,.wav,.ogg,.aac,audio/*\"\n                          hidden\n                          (change)=\"onCatalogPoiTranslationAudioFileSelected($event, language.code, 'create')\"\n                        />\n                        <button\n                          type=\"button\"\n                          class=\"generate-code-btn\"\n                          (click)=\"createPoiTranslationAudioInput.click()\"\n                          [disabled]=\"isCatalogPoiTranslationAudioUploading(language.code, 'create') || savingCatalogPoi\"\n                        >\n                          {{\n                            isCatalogPoiTranslationAudioUploading(language.code, 'create')\n                              ? 'Upload...'\n                              : catalogPoiTranslationAudioUrl(language.code, 'create')\n                                ? 'Sostituisci audio'\n                                : 'Carica audio'\n                          }}\n                        </button>\n                        <button\n                          type=\"button\"\n                          class=\"ghost-btn\"\n                          *ngIf=\"catalogPoiTranslationAudioUrl(language.code, 'create')\"\n                          (click)=\"clearCatalogPoiTranslationAudio(language.code, 'create')\"\n                          [disabled]=\"isCatalogPoiTranslationAudioUploading(language.code, 'create') || savingCatalogPoi\"\n                        >\n                          Rimuovi audio\n                        </button>\n                      </div>\n\n                      <audio\n                        class=\"media-player\"\n                        controls\n                        preload=\"none\"\n                        *ngIf=\"catalogPoiTranslationAudioUrl(language.code, 'create')\"\n                        [src]=\"catalogPoiTranslationAudioUrl(language.code, 'create')\"\n                      ></audio>\n                    </div>\n                  </section>\n                </div>\n              </div>\n\n              <input type=\"hidden\" formControlName=\"imageUrl\" />\n              <div class=\"media-block\">\n                <div class=\"media-block-head\">\n                  <strong>Immagine luogo</strong>\n                  <span>{{ catalogPoiForm.controls.imageUrl.value ? 'Pronta' : 'Nessuna immagine' }}</span>\n                </div>\n\n                <div class=\"media-preview\" *ngIf=\"catalogPoiForm.controls.imageUrl.value; else createPoiImageEmpty\">\n                  <img [src]=\"catalogPoiForm.controls.imageUrl.value\" alt=\"Anteprima immagine luogo\" />\n                </div>\n                <ng-template #createPoiImageEmpty>\n                  <div class=\"media-preview placeholder\">Carica un'immagine per il luogo.</div>\n                </ng-template>\n\n                <div class=\"media-upload-actions\">\n                  <input\n                    #createCatalogPoiImageInput\n                    type=\"file\"\n                    accept=\".jpg,.jpeg,.png,.webp,.gif,.avif,image/*\"\n                    hidden\n                    (change)=\"onCatalogImageFileSelected($event)\"\n                  />\n                  <button\n                    type=\"button\"\n                    class=\"generate-code-btn\"\n                    (click)=\"createCatalogPoiImageInput.click()\"\n                    [disabled]=\"uploadingCatalogImage || savingCatalogPoi\"\n                  >\n                    {{ uploadingCatalogImage ? 'Upload...' : catalogPoiForm.controls.imageUrl.value ? 'Sostituisci immagine' : 'Carica immagine' }}\n                  </button>\n                  <button\n                    type=\"button\"\n                    class=\"ghost-btn\"\n                    *ngIf=\"catalogPoiForm.controls.imageUrl.value\"\n                    (click)=\"clearCatalogPoiImage()\"\n                    [disabled]=\"uploadingCatalogImage || savingCatalogPoi\"\n                  >\n                    Rimuovi immagine\n                  </button>\n                </div>\n              </div>\n\n              <input type=\"hidden\" formControlName=\"audioUrl\" />\n              <div class=\"media-block\">\n                <div class=\"media-block-head\">\n                  <strong>Audioguida</strong>\n                  <span>{{ catalogPoiForm.controls.audioUrl.value ? 'Pronta' : 'Nessun audio' }}</span>\n                </div>\n\n                <div class=\"audio-file-pill\" *ngIf=\"catalogPoiForm.controls.audioUrl.value; else createPoiAudioEmpty\">\n                  <span class=\"audio-file-label\">File:</span>\n                  <strong>{{ audioFileNameFromUrl(catalogPoiForm.controls.audioUrl.value) }}</strong>\n                </div>\n                <ng-template #createPoiAudioEmpty>\n                  <div class=\"media-preview placeholder\">Audio opzionale: puoi caricarlo ora o dopo.</div>\n                </ng-template>\n\n                <div class=\"media-upload-actions\">\n                  <input\n                    #createCatalogPoiAudioInput\n                    type=\"file\"\n                    accept=\".mp3,.m4a,.wav,.ogg,.aac,audio/*\"\n                    hidden\n                    (change)=\"onCatalogAudioFileSelected($event)\"\n                  />\n                  <button\n                    type=\"button\"\n                    class=\"generate-code-btn\"\n                    (click)=\"createCatalogPoiAudioInput.click()\"\n                    [disabled]=\"uploadingCatalogAudio || savingCatalogPoi\"\n                  >\n                    {{ uploadingCatalogAudio ? 'Upload...' : catalogPoiForm.controls.audioUrl.value ? 'Sostituisci audio' : 'Carica audio' }}\n                  </button>\n                  <button\n                    type=\"button\"\n                    class=\"ghost-btn\"\n                    *ngIf=\"catalogPoiForm.controls.audioUrl.value\"\n                    (click)=\"clearCatalogPoiAudio()\"\n                    [disabled]=\"uploadingCatalogAudio || savingCatalogPoi\"\n                  >\n                    Rimuovi audio\n                  </button>\n                </div>\n\n                <audio\n                  class=\"media-player\"\n                  controls\n                  preload=\"none\"\n                  *ngIf=\"catalogPoiForm.controls.audioUrl.value\"\n                  [src]=\"catalogPoiForm.controls.audioUrl.value\"\n                ></audio>\n              </div>\n\n              <div class=\"coords-grid\">\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>Prezzo singolo (EUR)</mat-label>\n                  <input matInput type=\"number\" step=\"0.01\" min=\"0\" formControlName=\"priceSingle\" />\n                </mat-form-field>\n              </div>\n            </ng-container>\n          </div>\n\n          <div mat-dialog-actions align=\"end\" class=\"dialog-actions\">\n            <button type=\"button\" class=\"row-save-btn secondary\" (click)=\"closeCreateCatalogPoiDialog()\" [disabled]=\"savingCatalogPoi\">\n              Annulla\n            </button>\n            <button mat-flat-button color=\"primary\" type=\"submit\" [disabled]=\"!canSaveCatalogPoi\">\n              {{ savingCatalogPoi ? 'Salvataggio...' : 'Crea luogo di interesse' }}\n            </button>\n          </div>\n        </form>\n      </ng-template>\n\n      <ng-template #editCatalogCityDialog>\n        <h2 mat-dialog-title>Modifica citt\u00E0</h2>\n        <form [formGroup]=\"catalogCityEditForm\" (ngSubmit)=\"saveCatalogCityEdit()\" class=\"form-grid dialog-form\">\n          <div mat-dialog-content class=\"dialog-body\">\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Nome citt\u00E0</mat-label>\n              <input matInput type=\"text\" formControlName=\"name\" />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Regione</mat-label>\n              <input matInput type=\"text\" formControlName=\"region\" />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Prezzo bundle (EUR)</mat-label>\n              <input matInput type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"bundlePrice\" />\n            </mat-form-field>\n\n            <div class=\"translation-panel\" formGroupName=\"translations\">\n              <div class=\"translation-panel-head\">\n                <strong>Traduzioni app utente</strong>\n                <span>Compila le lingue disponibili. Se un campo resta vuoto, l'app mostra l'italiano principale.</span>\n              </div>\n\n              <div class=\"translation-grid\">\n                <section class=\"translation-card\" *ngFor=\"let language of contentLanguages\" [formGroupName]=\"language.code\">\n                  <h3>{{ language.label }}</h3>\n\n                  <mat-form-field appearance=\"outline\">\n                    <mat-label>Nome citt\u00E0 {{ language.label }}</mat-label>\n                    <input matInput type=\"text\" formControlName=\"name\" />\n                  </mat-form-field>\n                </section>\n              </div>\n            </div>\n\n            <input type=\"hidden\" formControlName=\"heroImage\" />\n            <div class=\"media-block\">\n              <div class=\"media-block-head\">\n                <strong>Immagine citt\u00E0</strong>\n                <span>{{ catalogCityEditForm.controls.heroImage.value ? 'Pronta' : 'Nessuna immagine' }}</span>\n              </div>\n\n              <div class=\"media-preview\" *ngIf=\"catalogCityEditForm.controls.heroImage.value; else cityEditImageEmpty\">\n                <img [src]=\"catalogCityEditForm.controls.heroImage.value\" alt=\"Anteprima immagine citt\u00E0\" />\n              </div>\n              <ng-template #cityEditImageEmpty>\n                <div class=\"media-preview placeholder\">Carica un'immagine per la citt\u00E0.</div>\n              </ng-template>\n\n              <div class=\"media-upload-actions\">\n                <input\n                  #catalogCityEditImageInput\n                  type=\"file\"\n                  accept=\".jpg,.jpeg,.png,.webp,.gif,.avif,image/*\"\n                  hidden\n                  (change)=\"onCatalogCityEditImageFileSelected($event)\"\n                />\n                <button\n                  type=\"button\"\n                  class=\"generate-code-btn\"\n                  (click)=\"catalogCityEditImageInput.click()\"\n                  [disabled]=\"uploadingCatalogCityEditImage || savingCatalogCity\"\n                >\n                  {{\n                    uploadingCatalogCityEditImage\n                      ? 'Upload...'\n                      : catalogCityEditForm.controls.heroImage.value\n                        ? 'Sostituisci immagine'\n                        : 'Carica immagine'\n                  }}\n                </button>\n                <button\n                  type=\"button\"\n                  class=\"ghost-btn\"\n                  *ngIf=\"catalogCityEditForm.controls.heroImage.value\"\n                  (click)=\"clearCatalogCityEditImage()\"\n                  [disabled]=\"uploadingCatalogCityEditImage || savingCatalogCity\"\n                >\n                  Rimuovi immagine\n                </button>\n              </div>\n            </div>\n          </div>\n\n          <div mat-dialog-actions align=\"end\" class=\"dialog-actions\">\n            <button type=\"button\" class=\"row-save-btn secondary\" (click)=\"closeCatalogCityEditDialog()\" [disabled]=\"savingCatalogCity\">\n              Annulla\n            </button>\n            <button mat-flat-button color=\"primary\" type=\"submit\" [disabled]=\"!canSaveCatalogCityEdit\">\n              {{ savingCatalogCity ? 'Salvataggio...' : 'Salva citt\u00E0' }}\n            </button>\n          </div>\n        </form>\n      </ng-template>\n\n      <ng-template #editCatalogPoiDialog>\n        <h2 mat-dialog-title>Modifica luogo di interesse</h2>\n        <form [formGroup]=\"catalogPoiEditForm\" (ngSubmit)=\"saveCatalogPoiEdit()\" class=\"form-grid dialog-form\">\n          <div mat-dialog-content class=\"dialog-body\">\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Citt\u00E0</mat-label>\n              <mat-select formControlName=\"cityId\">\n                <mat-option *ngFor=\"let city of catalogCities\" [value]=\"city.id\">{{ city.name }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Nome luogo</mat-label>\n              <input matInput type=\"text\" formControlName=\"name\" />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Indirizzo</mat-label>\n              <input matInput type=\"text\" formControlName=\"address\" />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Categoria</mat-label>\n              <mat-select formControlName=\"category\">\n                <mat-option *ngFor=\"let category of poiCategoryOptionsFor(catalogPoiEditForm.controls.category.value)\" [value]=\"category\">\n                  {{ category }}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <div class=\"coords-grid\">\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Latitudine</mat-label>\n                <input matInput type=\"number\" step=\"0.000001\" formControlName=\"lat\" />\n              </mat-form-field>\n\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Longitudine</mat-label>\n                <input matInput type=\"number\" step=\"0.000001\" formControlName=\"lng\" />\n              </mat-form-field>\n            </div>\n\n            <div class=\"map-picker-row\">\n              <button type=\"button\" class=\"toggle-panel-btn subtle\" (click)=\"openPoiMapPicker('edit')\">\n                <span class=\"toggle-panel-icon\">+</span>\n                <span>Apri mappa e cerca coordinate</span>\n              </button>\n            </div>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Descrizione breve</mat-label>\n              <textarea matInput rows=\"2\" formControlName=\"descriptionShort\"></textarea>\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Descrizione lunga</mat-label>\n              <textarea matInput rows=\"5\" formControlName=\"descriptionLong\"></textarea>\n            </mat-form-field>\n\n            <div class=\"translation-panel\" formGroupName=\"translations\">\n              <div class=\"translation-panel-head\">\n                <strong>Traduzioni app utente</strong>\n                <span>Questi contenuti vengono mostrati nell'app utente in base alla lingua selezionata.</span>\n              </div>\n\n              <div class=\"translation-grid\">\n                <section class=\"translation-card\" *ngFor=\"let language of contentLanguages\" [formGroupName]=\"language.code\">\n                  <h3>{{ language.label }}</h3>\n\n                  <mat-form-field appearance=\"outline\">\n                    <mat-label>Descrizione breve {{ language.label }}</mat-label>\n                    <textarea matInput rows=\"2\" formControlName=\"descriptionShort\"></textarea>\n                  </mat-form-field>\n\n                  <mat-form-field appearance=\"outline\">\n                    <mat-label>Descrizione lunga {{ language.label }}</mat-label>\n                    <textarea matInput rows=\"5\" formControlName=\"descriptionLong\"></textarea>\n                  </mat-form-field>\n\n                  <input type=\"hidden\" formControlName=\"audioUrl\" />\n                  <div class=\"media-block\">\n                    <div class=\"media-block-head\">\n                      <strong>Audioguida {{ language.label }}</strong>\n                      <span>{{ catalogPoiTranslationAudioUrl(language.code, 'edit') ? 'Pronta' : 'Nessun audio' }}</span>\n                    </div>\n\n                    <div class=\"audio-file-pill\" *ngIf=\"catalogPoiTranslationAudioUrl(language.code, 'edit'); else editPoiTranslationAudioEmpty\">\n                      <span class=\"audio-file-label\">File:</span>\n                      <strong>{{ audioFileNameFromUrl(catalogPoiTranslationAudioUrl(language.code, 'edit')) }}</strong>\n                    </div>\n                    <ng-template #editPoiTranslationAudioEmpty>\n                      <div class=\"media-preview placeholder\">Audio opzionale: puoi caricarlo ora o dopo.</div>\n                    </ng-template>\n\n                    <div class=\"media-upload-actions\">\n                      <input\n                        #editPoiTranslationAudioInput\n                        type=\"file\"\n                        accept=\".mp3,.m4a,.wav,.ogg,.aac,audio/*\"\n                        hidden\n                        (change)=\"onCatalogPoiTranslationAudioFileSelected($event, language.code, 'edit')\"\n                      />\n                      <button\n                        type=\"button\"\n                        class=\"generate-code-btn\"\n                        (click)=\"editPoiTranslationAudioInput.click()\"\n                        [disabled]=\"isCatalogPoiTranslationAudioUploading(language.code, 'edit') || savingCatalogPoi\"\n                      >\n                        {{\n                          isCatalogPoiTranslationAudioUploading(language.code, 'edit')\n                            ? 'Upload...'\n                            : catalogPoiTranslationAudioUrl(language.code, 'edit')\n                              ? 'Sostituisci audio'\n                              : 'Carica audio'\n                        }}\n                      </button>\n                      <button\n                        type=\"button\"\n                        class=\"ghost-btn\"\n                        *ngIf=\"catalogPoiTranslationAudioUrl(language.code, 'edit')\"\n                        (click)=\"clearCatalogPoiTranslationAudio(language.code, 'edit')\"\n                        [disabled]=\"isCatalogPoiTranslationAudioUploading(language.code, 'edit') || savingCatalogPoi\"\n                      >\n                        Rimuovi audio\n                      </button>\n                    </div>\n\n                    <audio\n                      class=\"media-player\"\n                      controls\n                      preload=\"none\"\n                      *ngIf=\"catalogPoiTranslationAudioUrl(language.code, 'edit')\"\n                      [src]=\"catalogPoiTranslationAudioUrl(language.code, 'edit')\"\n                    ></audio>\n                  </div>\n                </section>\n              </div>\n            </div>\n\n            <input type=\"hidden\" formControlName=\"imageUrl\" />\n            <div class=\"media-block\">\n              <div class=\"media-block-head\">\n                <strong>Immagine luogo</strong>\n                <span>{{ catalogPoiEditForm.controls.imageUrl.value ? 'Pronta' : 'Nessuna immagine' }}</span>\n              </div>\n\n              <div class=\"media-preview\" *ngIf=\"catalogPoiEditForm.controls.imageUrl.value; else poiEditImageEmpty\">\n                <img [src]=\"catalogPoiEditForm.controls.imageUrl.value\" alt=\"Anteprima immagine luogo\" />\n              </div>\n              <ng-template #poiEditImageEmpty>\n                <div class=\"media-preview placeholder\">Carica un'immagine per il luogo.</div>\n              </ng-template>\n\n              <div class=\"media-upload-actions\">\n                <input\n                  #catalogPoiEditImageInput\n                  type=\"file\"\n                  accept=\".jpg,.jpeg,.png,.webp,.gif,.avif,image/*\"\n                  hidden\n                  (change)=\"onCatalogPoiEditImageFileSelected($event)\"\n                />\n                <button\n                  type=\"button\"\n                  class=\"generate-code-btn\"\n                  (click)=\"catalogPoiEditImageInput.click()\"\n                  [disabled]=\"uploadingCatalogPoiEditImage || savingCatalogPoi\"\n                >\n                  {{\n                    uploadingCatalogPoiEditImage\n                      ? 'Upload...'\n                      : catalogPoiEditForm.controls.imageUrl.value\n                        ? 'Sostituisci immagine'\n                        : 'Carica immagine'\n                  }}\n                </button>\n                <button\n                  type=\"button\"\n                  class=\"ghost-btn\"\n                  *ngIf=\"catalogPoiEditForm.controls.imageUrl.value\"\n                  (click)=\"clearCatalogPoiEditImage()\"\n                  [disabled]=\"uploadingCatalogPoiEditImage || savingCatalogPoi\"\n                >\n                  Rimuovi immagine\n                </button>\n              </div>\n            </div>\n\n            <input type=\"hidden\" formControlName=\"audioUrl\" />\n            <div class=\"media-block\">\n              <div class=\"media-block-head\">\n                <strong>Audioguida</strong>\n                <span>{{ catalogPoiEditForm.controls.audioUrl.value ? 'Pronta' : 'Nessun audio' }}</span>\n              </div>\n\n              <div class=\"audio-file-pill\" *ngIf=\"catalogPoiEditForm.controls.audioUrl.value; else poiEditAudioEmpty\">\n                <span class=\"audio-file-label\">File:</span>\n                <strong>{{ audioFileNameFromUrl(catalogPoiEditForm.controls.audioUrl.value) }}</strong>\n              </div>\n              <ng-template #poiEditAudioEmpty>\n                <div class=\"media-preview placeholder\">Audio opzionale: puoi caricarlo ora o dopo.</div>\n              </ng-template>\n\n              <div class=\"media-upload-actions\">\n                <input\n                  #catalogPoiEditAudioInput\n                  type=\"file\"\n                  accept=\".mp3,.m4a,.wav,.ogg,.aac,audio/*\"\n                  hidden\n                  (change)=\"onCatalogPoiEditAudioFileSelected($event)\"\n                />\n                <button\n                  type=\"button\"\n                  class=\"generate-code-btn\"\n                  (click)=\"catalogPoiEditAudioInput.click()\"\n                  [disabled]=\"uploadingCatalogPoiEditAudio || savingCatalogPoi\"\n                >\n                  {{\n                    uploadingCatalogPoiEditAudio\n                      ? 'Upload...'\n                      : catalogPoiEditForm.controls.audioUrl.value\n                        ? 'Sostituisci audio'\n                        : 'Carica audio'\n                  }}\n                </button>\n                <button\n                  type=\"button\"\n                  class=\"ghost-btn\"\n                  *ngIf=\"catalogPoiEditForm.controls.audioUrl.value\"\n                  (click)=\"clearCatalogPoiEditAudio()\"\n                  [disabled]=\"uploadingCatalogPoiEditAudio || savingCatalogPoi\"\n                >\n                  Rimuovi audio\n                </button>\n              </div>\n\n              <audio\n                class=\"media-player\"\n                controls\n                preload=\"none\"\n                *ngIf=\"catalogPoiEditForm.controls.audioUrl.value\"\n                [src]=\"catalogPoiEditForm.controls.audioUrl.value\"\n              ></audio>\n            </div>\n\n            <div class=\"coords-grid\">\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Prezzo singolo (EUR)</mat-label>\n                <input matInput type=\"number\" step=\"0.01\" min=\"0\" formControlName=\"priceSingle\" />\n              </mat-form-field>\n            </div>\n          </div>\n\n          <div mat-dialog-actions align=\"end\" class=\"dialog-actions\">\n            <button type=\"button\" class=\"row-save-btn secondary\" (click)=\"closeCatalogPoiEditDialog()\" [disabled]=\"savingCatalogPoi\">\n              Annulla\n            </button>\n            <button mat-flat-button color=\"primary\" type=\"submit\" [disabled]=\"!canSaveCatalogPoiEdit\">\n              {{ savingCatalogPoi ? 'Salvataggio...' : 'Salva luogo' }}\n            </button>\n          </div>\n        </form>\n      </ng-template>\n\n      <ng-template #catalogPoiAudioPlayerDialog>\n        <h2 mat-dialog-title>{{ audioPlayerPoiName || 'Anteprima audioguida' }}</h2>\n        <div mat-dialog-content class=\"dialog-body map-dialog-body\">\n          <p class=\"table-subtitle\">\n            File audio: <strong>{{ audioPlayerFileName || '-' }}</strong>\n          </p>\n          <audio class=\"media-player\" controls autoplay preload=\"metadata\" [src]=\"audioPlayerUrl\"></audio>\n        </div>\n        <div mat-dialog-actions align=\"end\" class=\"dialog-actions\">\n          <button type=\"button\" class=\"row-save-btn secondary\" (click)=\"closeCatalogPoiAudioPlayer()\">Chiudi</button>\n        </div>\n      </ng-template>\n\n      <ng-template #poiMapPickerDialog>\n        <h2 mat-dialog-title>Cerca luogo e seleziona coordinate</h2>\n        <div mat-dialog-content class=\"dialog-body map-dialog-body\">\n          <form [formGroup]=\"poiMapSearchForm\" (ngSubmit)=\"searchPoiMap()\" class=\"map-search-form\">\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Cerca luogo o indirizzo</mat-label>\n              <input matInput type=\"text\" formControlName=\"query\" autocomplete=\"off\" />\n              <mat-hint>Ricerca gratuita tramite OpenStreetMap</mat-hint>\n            </mat-form-field>\n            <button type=\"submit\" class=\"generate-code-btn\" [disabled]=\"mapPickerLoading\">\n              {{ mapPickerLoading ? 'Ricerca...' : 'Cerca' }}\n            </button>\n          </form>\n\n          <p class=\"inline-note\" *ngIf=\"!mapPickerLoading && !mapPickerResults.length\">\n            Cerca un luogo: le coordinate trovate vengono selezionate subito. Poi rifinisci trascinando il marker rosso sulla mappa.\n          </p>\n\n          <p class=\"map-selected-coords\" *ngIf=\"hasPoiMapSelection\">\n            Lat: <strong>{{ mapPickerSelectedLat | number: '1.4-6' }}</strong> |\n            Lng: <strong>{{ mapPickerSelectedLng | number: '1.4-6' }}</strong>\n          </p>\n\n          <div class=\"map-results\" *ngIf=\"mapPickerResults.length\">\n            <article class=\"map-result-card\" *ngFor=\"let result of mapPickerResults\">\n              <strong>{{ result.displayName }}</strong>\n              <small>Lat: {{ result.lat | number: '1.4-6' }} | Lng: {{ result.lng | number: '1.4-6' }}</small>\n              <div class=\"action-buttons\">\n                <button type=\"button\" class=\"row-save-btn\" (click)=\"selectPoiMapResult(result)\">Evidenzia su mappa</button>\n                <button mat-stroked-button type=\"button\" (click)=\"usePoiMapResult(result)\">Usa subito</button>\n              </div>\n            </article>\n          </div>\n\n          <section class=\"map-preview-panel\">\n            <div class=\"map-preview-head\">\n              <strong>Anteprima mappa</strong>\n              <small *ngIf=\"mapPickerTargetLabel\">{{ mapPickerTargetLabel }}</small>\n              <small *ngIf=\"!mapPickerTargetLabel\">Clicca o trascina il marker rosso per precisione.</small>\n            </div>\n            <div #poiMapCanvas class=\"poi-map-canvas\" [class.ready]=\"mapPickerMapReady\"></div>\n          </section>\n        </div>\n\n        <div mat-dialog-actions align=\"end\" class=\"dialog-actions\">\n          <button type=\"button\" class=\"row-save-btn secondary\" (click)=\"closePoiMapPicker()\" [disabled]=\"mapPickerLoading\">\n            Chiudi\n          </button>\n          <button type=\"button\" class=\"row-save-btn\" (click)=\"confirmPoiMapSelection()\" [disabled]=\"!hasPoiMapSelection || mapPickerLoading\">\n            Usa coordinate selezionate\n          </button>\n        </div>\n      </ng-template>\n\n      <ng-template #createDiscountCodeDialog>\n        <h2 mat-dialog-title>Aggiungi codice sconto/struttura</h2>\n        <form [formGroup]=\"discountCodeCreateForm\" (ngSubmit)=\"createDiscountCode()\" class=\"form-grid dialog-form\">\n          <div mat-dialog-content class=\"dialog-body\">\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Struttura</mat-label>\n              <mat-select formControlName=\"structureId\">\n                <mat-option *ngFor=\"let structure of structures\" [value]=\"structure.id\">{{ structure.name }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n\n            <div class=\"invite-code-row\">\n              <mat-form-field appearance=\"outline\" class=\"invite-code-field\">\n                <mat-label>Codice</mat-label>\n                <input matInput type=\"text\" formControlName=\"code\" maxlength=\"6\" autocomplete=\"off\" />\n              </mat-form-field>\n\n              <button type=\"button\" class=\"generate-code-btn\" (click)=\"generateDiscountCodeForCreate()\" [disabled]=\"creatingDiscountCode\">\n                Genera codice\n              </button>\n            </div>\n\n            <div class=\"discount-scope-group\">\n              <label>Applicabile a</label>\n              <mat-radio-group formControlName=\"applyTo\" class=\"discount-scope-radio\">\n                <mat-radio-button value=\"single\">Luogo singolo</mat-radio-button>\n                <mat-radio-button value=\"bundle\">Pacchetto citt\u00E0</mat-radio-button>\n              </mat-radio-group>\n            </div>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Citt\u00E0 applicabili</mat-label>\n              <mat-select formControlName=\"cityIds\" multiple>\n                <mat-option *ngFor=\"let city of catalogCities\" [value]=\"city.id\">{{ city.name }}</mat-option>\n              </mat-select>\n              <mat-hint>Seleziona una o piu citt\u00E0</mat-hint>\n            </mat-form-field>\n            <p class=\"inline-note\" *ngIf=\"!catalogCities.length && !loadingCatalogCities\">\n              Nessuna citt\u00E0 disponibile. Crea prima una citt\u00E0 nella sezione catalogo.\n            </p>\n            <div class=\"inline-loader\" *ngIf=\"loadingCatalogCities\">\n              <mat-spinner diameter=\"22\"></mat-spinner>\n            </div>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Sconto utente {{ discountCodeCreateScopeLabel }} (%)</mat-label>\n              <input matInput type=\"number\" min=\"0\" max=\"100\" step=\"0.01\" formControlName=\"userDiscountPercent\" />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Incasso struttura {{ discountCodeCreateScopeLabel }} (EUR)</mat-label>\n              <input matInput type=\"number\" min=\"0\" max=\"10000\" step=\"0.01\" formControlName=\"structureFixedAmount\" />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Scadenza</mat-label>\n              <input #createDiscountExpiresInput matInput type=\"datetime-local\" step=\"60\" formControlName=\"expiresAt\" />\n              <button\n                class=\"date-picker-suffix-btn\"\n                matSuffix\n                type=\"button\"\n                aria-label=\"Apri calendario e ora\"\n                (click)=\"openNativeDateTimePicker(createDiscountExpiresInput)\"\n              >\n                <span class=\"calendar-icon-glyph\" aria-hidden=\"true\"></span>\n              </button>\n              <mat-hint>Seleziona data e ora</mat-hint>\n            </mat-form-field>\n          </div>\n\n          <div mat-dialog-actions align=\"end\" class=\"dialog-actions\">\n            <button type=\"button\" class=\"row-save-btn secondary\" (click)=\"closeCreateDiscountCodeDialog()\" [disabled]=\"creatingDiscountCode\">\n              Annulla\n            </button>\n            <button type=\"submit\" class=\"row-save-btn\" [disabled]=\"creatingDiscountCode || discountCodeCreateForm.invalid\">\n              {{ creatingDiscountCode ? 'Salvataggio...' : 'Crea codice' }}\n            </button>\n          </div>\n        </form>\n      </ng-template>\n\n      <ng-template #partnerRequestApprovalDialog>\n        <h2 mat-dialog-title>Approva richiesta partner</h2>\n        <form [formGroup]=\"partnerRequestApprovalForm\" (ngSubmit)=\"approvePartnerRequest()\" class=\"form-grid dialog-form\">\n          <div mat-dialog-content class=\"dialog-body\">\n            <p class=\"inline-note\" *ngIf=\"partnerRequestApprovalTarget as request\">\n              Verranno creati automaticamente la struttura <strong>{{ request.structureName }}</strong>, il codice sconto e il PDF da inviare a\n              <strong>{{ request.contactEmail }}</strong>.\n            </p>\n\n            <div class=\"invite-code-row\">\n              <mat-form-field appearance=\"outline\" class=\"invite-code-field\">\n                <mat-label>Codice</mat-label>\n                <input matInput type=\"text\" formControlName=\"code\" maxlength=\"6\" autocomplete=\"off\" />\n              </mat-form-field>\n\n              <button type=\"button\" class=\"generate-code-btn\" (click)=\"generateDiscountCodeForPartnerApproval()\" [disabled]=\"approvingPartnerRequestId !== null\">\n                Genera codice\n              </button>\n            </div>\n\n            <div class=\"discount-scope-group\">\n              <label>Applicabile a</label>\n              <mat-radio-group formControlName=\"applyTo\" class=\"discount-scope-radio\">\n                <mat-radio-button value=\"single\">Luogo singolo</mat-radio-button>\n                <mat-radio-button value=\"bundle\">Pacchetto citt\u00E0</mat-radio-button>\n              </mat-radio-group>\n            </div>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Citt\u00E0 applicabili</mat-label>\n              <mat-select formControlName=\"cityIds\" multiple>\n                <mat-option *ngFor=\"let city of catalogCities\" [value]=\"city.id\">{{ city.name }}</mat-option>\n              </mat-select>\n              <mat-hint>Seleziona una o piu citt\u00E0</mat-hint>\n            </mat-form-field>\n            <p class=\"inline-note\" *ngIf=\"!catalogCities.length && !loadingCatalogCities\">\n              Nessuna citt\u00E0 disponibile. Crea prima una citt\u00E0 nella sezione catalogo.\n            </p>\n            <div class=\"inline-loader\" *ngIf=\"loadingCatalogCities\">\n              <mat-spinner diameter=\"22\"></mat-spinner>\n            </div>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Sconto utente {{ partnerRequestApprovalForm.controls.applyTo.value === 'bundle' ? 'citt\u00E0' : 'luogo' }} (%)</mat-label>\n              <input matInput type=\"number\" min=\"0\" max=\"100\" step=\"0.01\" formControlName=\"userDiscountPercent\" />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Incasso struttura {{ partnerRequestApprovalForm.controls.applyTo.value === 'bundle' ? 'citt\u00E0' : 'luogo' }} (EUR)</mat-label>\n              <input matInput type=\"number\" min=\"0\" max=\"10000\" step=\"0.01\" formControlName=\"structureFixedAmount\" />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Scadenza</mat-label>\n              <input #partnerApprovalExpiresInput matInput type=\"datetime-local\" step=\"60\" formControlName=\"expiresAt\" />\n              <button\n                class=\"date-picker-suffix-btn\"\n                matSuffix\n                type=\"button\"\n                aria-label=\"Apri calendario e ora\"\n                (click)=\"openNativeDateTimePicker(partnerApprovalExpiresInput)\"\n              >\n                <span class=\"calendar-icon-glyph\" aria-hidden=\"true\"></span>\n              </button>\n              <mat-hint>Seleziona data e ora</mat-hint>\n            </mat-form-field>\n          </div>\n\n          <div mat-dialog-actions align=\"end\" class=\"dialog-actions\">\n            <button type=\"button\" class=\"row-save-btn secondary\" (click)=\"closePartnerRequestApprovalDialog()\" [disabled]=\"approvingPartnerRequestId !== null\">\n              Annulla\n            </button>\n            <button\n              type=\"button\"\n              class=\"row-save-btn secondary\"\n              (click)=\"previewSelectedPartnerRequestPdf()\"\n              [disabled]=\"previewingPartnerRequestId === partnerRequestApprovalTarget?.id\"\n            >\n              {{ previewingPartnerRequestId === partnerRequestApprovalTarget?.id ? 'Apro anteprima...' : 'Anteprima PDF' }}\n            </button>\n            <button type=\"submit\" class=\"row-save-btn\" [disabled]=\"approvingPartnerRequestId !== null || partnerRequestApprovalForm.invalid\">\n              {{ approvingPartnerRequestId !== null ? 'Invio approvazione...' : 'Approva e invia' }}\n            </button>\n          </div>\n        </form>\n      </ng-template>\n\n      <ng-template #editDiscountCodeDialog>\n        <h2 mat-dialog-title>Modifica codice sconto</h2>\n        <form [formGroup]=\"discountCodeEditForm\" (ngSubmit)=\"saveDiscountCodeEdit()\" class=\"form-grid dialog-form\">\n          <div mat-dialog-content class=\"dialog-body\">\n            <p class=\"inline-note\" *ngIf=\"editingDiscountCode\">\n              Codice: <code>{{ editingDiscountCode.code }}</code> - Struttura: <strong>{{ editingDiscountCode.structureName }}</strong>\n            </p>\n\n            <div class=\"discount-scope-group\">\n              <label>Applicabile a</label>\n              <mat-radio-group formControlName=\"applyTo\" class=\"discount-scope-radio\">\n                <mat-radio-button value=\"single\">Luogo singolo</mat-radio-button>\n                <mat-radio-button value=\"bundle\">Pacchetto citt\u00E0</mat-radio-button>\n              </mat-radio-group>\n            </div>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Citt\u00E0 applicabili</mat-label>\n              <mat-select formControlName=\"cityIds\" multiple>\n                <mat-option *ngFor=\"let city of catalogCities\" [value]=\"city.id\">{{ city.name }}</mat-option>\n              </mat-select>\n              <mat-hint>Seleziona una o piu citt\u00E0</mat-hint>\n            </mat-form-field>\n            <p class=\"inline-note\" *ngIf=\"!catalogCities.length && !loadingCatalogCities\">\n              Nessuna citt\u00E0 disponibile. Crea prima una citt\u00E0 nella sezione catalogo.\n            </p>\n            <div class=\"inline-loader\" *ngIf=\"loadingCatalogCities\">\n              <mat-spinner diameter=\"22\"></mat-spinner>\n            </div>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Sconto utente {{ discountCodeEditScopeLabel }} (%)</mat-label>\n              <input matInput type=\"number\" min=\"0\" max=\"100\" step=\"0.01\" formControlName=\"userDiscountPercent\" />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Incasso struttura {{ discountCodeEditScopeLabel }} (EUR)</mat-label>\n              <input matInput type=\"number\" min=\"0\" max=\"10000\" step=\"0.01\" formControlName=\"structureFixedAmount\" />\n            </mat-form-field>\n\n            <mat-form-field appearance=\"outline\">\n              <mat-label>Scadenza</mat-label>\n              <input #editDiscountExpiresInput matInput type=\"datetime-local\" step=\"60\" formControlName=\"expiresAt\" />\n              <button\n                class=\"date-picker-suffix-btn\"\n                matSuffix\n                type=\"button\"\n                aria-label=\"Apri calendario e ora\"\n                (click)=\"openNativeDateTimePicker(editDiscountExpiresInput)\"\n              >\n                <span class=\"calendar-icon-glyph\" aria-hidden=\"true\"></span>\n              </button>\n              <mat-hint>Seleziona data e ora</mat-hint>\n            </mat-form-field>\n          </div>\n\n          <div mat-dialog-actions align=\"end\" class=\"dialog-actions\">\n            <button type=\"button\" class=\"row-save-btn secondary\" (click)=\"closeEditDiscountCodeDialog()\" [disabled]=\"updatingDiscountCode\">\n              Annulla\n            </button>\n            <button type=\"submit\" class=\"row-save-btn\" [disabled]=\"updatingDiscountCode || discountCodeEditForm.invalid\">\n              {{ updatingDiscountCode ? 'Salvataggio...' : 'Salva modifiche' }}\n            </button>\n          </div>\n        </form>\n      </ng-template>\n      <ng-container *ngIf=\"canManageUsers && activeSection === 'structures'\">\n        <mat-card class=\"card table-card\">\n          <div class=\"table-head\">\n            <div>\n              <h2>Lista strutture</h2>\n              <p class=\"table-subtitle\">Gestisci dati struttura. I codici invito/sconto sono gestiti nella sezione dedicata.</p>\n            </div>\n            <div class=\"table-actions\">\n              <button type=\"button\" class=\"toggle-panel-btn\" [class.active]=\"showStructureSection\" (click)=\"toggleStructureSection()\">\n                <span class=\"toggle-panel-icon\">{{ showStructureSection ? '-' : '+' }}</span>\n                <span>{{ showStructureSection ? 'Chiudi aggiunta struttura' : 'Aggiungi struttura' }}</span>\n              </button>\n            </div>\n          </div>\n\n          <section class=\"inline-panel\" *ngIf=\"showStructureSection\">\n            <h3>Nuova struttura</h3>\n            <p>Inserisci nome struttura, via, civico, citt\u00E0 e CAP. I codici sconto si gestiscono nella sezione dedicata.</p>\n\n            <form [formGroup]=\"structureForm\" (ngSubmit)=\"registerStructure()\" class=\"form-grid\">\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Nome struttura</mat-label>\n                <input matInput type=\"text\" formControlName=\"name\" autocomplete=\"organization\" />\n              </mat-form-field>\n\n              <div class=\"address-grid\">\n                <mat-form-field appearance=\"outline\" class=\"address-span-2\">\n                  <mat-label>Via/Piazza</mat-label>\n                  <input matInput type=\"text\" formControlName=\"street\" autocomplete=\"street-address\" />\n                </mat-form-field>\n\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>Civico</mat-label>\n                  <input matInput type=\"text\" formControlName=\"streetNumber\" />\n                </mat-form-field>\n\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>CAP</mat-label>\n                  <input matInput type=\"text\" formControlName=\"postalCode\" maxlength=\"5\" inputmode=\"numeric\" />\n                  <mat-error *ngIf=\"structureForm.controls.postalCode.hasError('pattern')\">Inserisci un CAP valido a 5 cifre</mat-error>\n                </mat-form-field>\n\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>Citt\u00E0</mat-label>\n                  <input matInput type=\"text\" formControlName=\"city\" autocomplete=\"address-level2\" />\n                </mat-form-field>\n\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>Provincia (opzionale)</mat-label>\n                  <input matInput type=\"text\" formControlName=\"province\" autocomplete=\"address-level1\" />\n                </mat-form-field>\n\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>Nazione (opzionale)</mat-label>\n                  <input matInput type=\"text\" formControlName=\"country\" autocomplete=\"country-name\" />\n                </mat-form-field>\n              </div>\n\n              <button mat-flat-button color=\"primary\" class=\"big-cta\" [disabled]=\"creatingStructure\" type=\"submit\">\n                {{ creatingStructure ? 'Salvataggio...' : 'Registra struttura' }}\n              </button>\n            </form>\n          </section>\n\n          <section class=\"inline-panel\" *ngIf=\"editingStructureId\">\n            <h3>Modifica struttura</h3>\n            <p>Aggiorna nome e indirizzo. Il codice invito resta invariato.</p>\n\n            <form [formGroup]=\"structureEditForm\" (ngSubmit)=\"updateStructure()\" class=\"form-grid\">\n              <mat-form-field appearance=\"outline\">\n                <mat-label>Nome struttura</mat-label>\n                <input matInput type=\"text\" formControlName=\"name\" autocomplete=\"organization\" />\n              </mat-form-field>\n\n              <div class=\"address-grid\">\n                <mat-form-field appearance=\"outline\" class=\"address-span-2\">\n                  <mat-label>Via/Piazza</mat-label>\n                  <input matInput type=\"text\" formControlName=\"street\" autocomplete=\"street-address\" />\n                </mat-form-field>\n\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>Civico</mat-label>\n                  <input matInput type=\"text\" formControlName=\"streetNumber\" />\n                </mat-form-field>\n\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>CAP</mat-label>\n                  <input matInput type=\"text\" formControlName=\"postalCode\" maxlength=\"5\" inputmode=\"numeric\" />\n                  <mat-error *ngIf=\"structureEditForm.controls.postalCode.hasError('pattern')\">\n                    Inserisci un CAP valido a 5 cifre\n                  </mat-error>\n                </mat-form-field>\n\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>Citt\u00E0</mat-label>\n                  <input matInput type=\"text\" formControlName=\"city\" autocomplete=\"address-level2\" />\n                </mat-form-field>\n\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>Provincia (opzionale)</mat-label>\n                  <input matInput type=\"text\" formControlName=\"province\" autocomplete=\"address-level1\" />\n                </mat-form-field>\n\n                <mat-form-field appearance=\"outline\">\n                  <mat-label>Nazione (opzionale)</mat-label>\n                  <input matInput type=\"text\" formControlName=\"country\" autocomplete=\"country-name\" />\n                </mat-form-field>\n              </div>\n\n              <div class=\"action-buttons\">\n                <button mat-flat-button color=\"primary\" class=\"big-cta\" [disabled]=\"!canSaveStructureEdit\" type=\"submit\">\n                  {{ updatingStructure ? 'Salvataggio...' : 'Salva modifiche struttura' }}\n                </button>\n                <button type=\"button\" class=\"row-save-btn\" (click)=\"cancelStructureEdit()\" [disabled]=\"updatingStructure\">\n                  Annulla\n                </button>\n              </div>\n            </form>\n          </section>\n\n          <div class=\"table-wrap\">\n            <table class=\"modern-table structures-table\">\n              <thead>\n                <tr>\n                  <th>Struttura</th>\n                  <th>Indirizzo</th>\n                  <th>Codici sconto</th>\n                  <th>Utenti associati</th>\n                  <th>Guadagno maturato</th>\n                  <th>Creata il</th>\n                  <th>Azioni</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr *ngIf=\"loadingStructures\">\n                  <td colspan=\"7\" class=\"empty-cell spinner-cell\">\n                    <mat-spinner diameter=\"28\"></mat-spinner>\n                  </td>\n                </tr>\n                <tr *ngIf=\"!structures.length && !loadingStructures\">\n                  <td colspan=\"7\" class=\"empty-cell\">Nessuna struttura registrata.</td>\n                </tr>\n                <ng-container *ngIf=\"!loadingStructures\">\n                  <tr *ngFor=\"let structure of structures\">\n                    <td><strong>{{ structure.name }}</strong></td>\n                    <td>{{ formatStructureAddress(structure) }}</td>\n                    <td>\n                      <div class=\"structure-codes-list\" *ngIf=\"structureCodes(structure.id).length; else noStructureCodes\">\n                        <div class=\"structure-code-item\" *ngFor=\"let discountCode of structureCodes(structure.id)\">\n                          <code>{{ discountCode.code }}</code>\n                          <small>Scade: {{ formatDateTime(discountCode.expiresAt) }}</small>\n                        </div>\n                      </div>\n                      <ng-template #noStructureCodes>-</ng-template>\n                    </td>\n                    <td>\n                      <button\n                        type=\"button\"\n                        class=\"table-link-btn\"\n                        (click)=\"openUsersForStructure(structure)\"\n                        [disabled]=\"structure.usersCount <= 0\"\n                      >\n                        {{ structure.usersCount }}\n                      </button>\n                    </td>\n                    <td>{{ formatCurrency(structure.totalStructureEarnings) }}</td>\n                    <td>{{ formatDateTime(structure.createdAt) }}</td>\n                    <td>\n                      <button mat-stroked-button color=\"primary\" type=\"button\" (click)=\"editStructure(structure)\">\n                        Modifica\n                      </button>\n                    </td>\n                  </tr>\n                </ng-container>\n              </tbody>\n            </table>\n          </div>\n        </mat-card>\n      </ng-container>\n    </main>\n  </div>\n</section>\n", styles: [".admin-shell {\n  padding: 0;\n  margin: 0;\n  max-width: none;\n  width: 100%;\n  min-height: 100vh;\n}\n\n.login-card {\n  width: min(460px, calc(100% - 32px));\n  padding: 24px;\n  margin: 28px auto;\n}\n\n.form-grid {\n  margin-top: 14px;\n  display: grid;\n  gap: 12px;\n}\n\n.full-span {\n  grid-column: 1 / -1;\n}\n\n.paypal-settings-form {\n  display: grid;\n  gap: 14px;\n}\n\n.paypal-settings-form .form-grid,\n.gpt-settings-form .form-grid {\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n}\n\n.gpt-settings-form {\n  display: grid;\n  gap: 14px;\n}\n\n.paypal-status-strip {\n  display: grid;\n  gap: 4px;\n  padding: 12px 14px;\n  border-radius: 12px;\n  border: 1px solid #d8e4f4;\n  background: #f7fbff;\n  color: #2f4764;\n}\n\n.paypal-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}\n\n.gpt-controls-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 12px;\n  align-items: center;\n  margin-bottom: 14px;\n}\n\n.gpt-progress-panel {\n  display: grid;\n  gap: 9px;\n  border: 1px solid #dbe7fb;\n  border-radius: 12px;\n  background: #f8fbff;\n  padding: 12px;\n  margin-bottom: 14px;\n}\n\n.gpt-progress-head,\n.gpt-token-strip {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  gap: 10px;\n  color: #2f4764;\n}\n\n.gpt-progress-track {\n  height: 10px;\n  border-radius: 999px;\n  background: #dfe9f8;\n  overflow: hidden;\n}\n\n.gpt-progress-bar {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background: linear-gradient(135deg, #1b75d0, #1fa463);\n  transition: width 0.2s ease;\n}\n\n.gpt-token-strip {\n  justify-content: flex-start;\n  font-size: 0.88rem;\n}\n\n.gpt-log {\n  display: grid;\n  gap: 4px;\n  color: #526b8d;\n  font-size: 0.84rem;\n}\n\n.gpt-preview-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 12px;\n  margin-bottom: 14px;\n}\n\n.gpt-preview-grid .translation-card p {\n  margin: 0;\n  color: #435f84;\n  line-height: 1.45;\n}\n\n.dashboard-layout {\n  min-height: 100vh;\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  background: linear-gradient(140deg, #eef2f8 0%, #f8fbff 55%, #f4f7fb 100%);\n}\n\n.sidebar {\n  background: linear-gradient(175deg, #091733 0%, #0b214b 100%);\n  color: #dfe9ff;\n  padding: 18px 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  position: sticky;\n  top: 0;\n  align-self: start;\n  height: 100vh;\n  overflow-y: auto;\n}\n\n.brand {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 4px 6px 12px;\n  border-bottom: 1px solid rgba(168, 189, 235, 0.22);\n}\n\n.brand-mark {\n  width: 34px;\n  height: 34px;\n  border-radius: 9px;\n  overflow: hidden;\n  border: 1px solid rgba(174, 198, 240, 0.36);\n  background: #fff;\n}\n\n.brand-mark img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n\n.brand p {\n  margin: 0;\n  opacity: 0.8;\n  font-size: 0.85rem;\n}\n\n.sidebar-nav {\n  display: grid;\n  gap: 8px;\n}\n\n.nav-item {\n  border: 0;\n  border-radius: 12px;\n  color: #e7efff;\n  background: transparent;\n  padding: 12px;\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  cursor: pointer;\n  text-align: left;\n}\n\n.nav-item::before {\n  content: '';\n  width: 8px;\n  height: 8px;\n  border-radius: 999px;\n  background: rgba(197, 218, 255, 0.72);\n  flex: 0 0 8px;\n}\n\n.nav-item:hover {\n  background: rgba(202, 221, 255, 0.14);\n}\n\n.nav-item.active {\n  background: rgba(50, 124, 255, 0.35);\n  box-shadow: inset 0 0 0 1px rgba(153, 195, 255, 0.45);\n}\n\n.nav-item.active::before {\n  background: #7fd2ff;\n}\n\n.sidebar-footer {\n  margin-top: auto;\n  border-top: 1px solid rgba(168, 189, 235, 0.22);\n  padding: 12px 6px 0;\n  display: grid;\n  gap: 8px;\n}\n\n.sidebar-footer span {\n  opacity: 0.85;\n  font-size: 0.9rem;\n  word-break: break-all;\n}\n\n.sidebar-action {\n  width: 100%;\n}\n\n.dashboard-main {\n  padding: 20px;\n  display: grid;\n  align-content: start;\n  grid-auto-rows: max-content;\n  gap: 16px;\n  min-width: 0;\n  overflow-x: hidden;\n}\n\n.dashboard-topbar {\n  padding: 18px;\n}\n\n.stats-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 12px;\n}\n\n.manager-payments-stats {\n  margin-bottom: 12px;\n}\n\n.stat-card {\n  border-radius: 14px;\n  border: 1px solid #dce5f7;\n  box-shadow: none;\n  padding: 14px;\n  display: grid;\n  gap: 2px;\n}\n\n.stat-card span {\n  color: #6f7f99;\n}\n\n.stat-card strong {\n  font-size: 1.55rem;\n  color: #152949;\n}\n\n.stat-spinner {\n  min-height: 38px;\n  display: flex;\n  align-items: center;\n}\n\n.stat-spinner .mat-mdc-progress-spinner {\n  --mdc-circular-progress-active-indicator-color: #1c7be0;\n}\n\n.modern-cta {\n  border: 0;\n  border-radius: 12px;\n  background: linear-gradient(135deg, #1b75d0, #0d4e9d);\n  color: #fff;\n  padding: 11px 16px;\n  font-size: 0.98rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n\n.modern-cta:hover {\n  filter: brightness(1.06);\n}\n\n.modern-cta.secondary {\n  background: linear-gradient(135deg, #2d6c3a, #1f552d);\n}\n\n.table-card {\n  padding: 18px;\n  min-width: 0;\n}\n\n.table-card h2 {\n  margin: 0;\n}\n\n.inline-note {\n  margin: 0;\n  color: #a24f28;\n  font-size: 0.92rem;\n}\n\n.invite-result {\n  margin-top: 14px;\n  display: grid;\n  gap: 5px;\n  color: #1d3153;\n}\n\n.table-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n\n.table-subtitle {\n  margin: 4px 0 0;\n  color: #6a7f9f;\n  font-size: 0.92rem;\n}\n\n.table-actions {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  justify-content: flex-end;\n}\n\n.toggle-panel-btn {\n  border: 1px solid #c6d7f3;\n  border-radius: 12px;\n  background: #fff;\n  color: #174074;\n  padding: 9px 12px;\n  font-size: 0.9rem;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;\n}\n\n.toggle-panel-btn:hover {\n  background: #f3f8ff;\n}\n\n.toggle-panel-btn.active {\n  background: linear-gradient(135deg, #1b75d0, #0d4e9d);\n  border-color: #0d4e9d;\n  color: #fff;\n}\n\n.toggle-panel-btn.subtle {\n  border-style: dashed;\n  background: #f6f9ff;\n  color: #204674;\n}\n\n.toggle-panel-icon {\n  width: 19px;\n  height: 19px;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.95rem;\n  line-height: 1;\n  font-weight: 800;\n  color: #0c468a;\n  background: #dfeaff;\n}\n\n.toggle-panel-btn.active .toggle-panel-icon {\n  color: #fff;\n  background: rgba(255, 255, 255, 0.26);\n}\n\n.inline-panel {\n  border: 1px solid #dfe8f8;\n  border-radius: 12px;\n  background: #f9fcff;\n  padding: 14px;\n  margin-bottom: 12px;\n}\n\n.inline-panel h3 {\n  margin: 0;\n  font-size: 1.02rem;\n  color: #163157;\n}\n\n.inline-panel p {\n  margin: 6px 0 0;\n  color: #617694;\n}\n\n.address-grid {\n  display: grid;\n  gap: 10px;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n\n.address-span-2 {\n  grid-column: span 2;\n}\n\n.invite-code-row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 10px;\n}\n\n.invite-code-field {\n  flex: 1;\n  min-width: 0;\n}\n\n.invite-code-field input {\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n}\n\n.generate-code-btn {\n  border: 0;\n  border-radius: 10px;\n  background: linear-gradient(135deg, #1f7a45, #0f5f31);\n  color: #fff;\n  padding: 11px 14px;\n  font-size: 0.9rem;\n  font-weight: 600;\n  min-width: 130px;\n  cursor: pointer;\n}\n\n.generate-code-btn:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n}\n\n.generate-code-btn:hover:not(:disabled) {\n  filter: brightness(1.07);\n}\n\n.field-note {\n  margin: -4px 0 0;\n  font-size: 0.82rem;\n  color: #5f7598;\n}\n\n.discount-code-note {\n  padding-left: 2px;\n}\n\n.discount-scope-group {\n  display: grid;\n  gap: 8px;\n  padding: 10px 12px;\n  border: 1px solid #dce7f8;\n  border-radius: 10px;\n  background: #f7fbff;\n}\n\n.discount-scope-group label {\n  margin: 0;\n  font-size: 0.82rem;\n  font-weight: 700;\n  color: #20436f;\n}\n\n.discount-scope-radio {\n  display: flex;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n\n.users-structure-filter {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  margin: 10px 0 12px;\n  padding: 10px 12px;\n  border: 1px solid #dce8f8;\n  border-radius: 10px;\n  background: #f7fbff;\n  color: #20436f;\n}\n\n.users-structure-filter strong {\n  color: #0f4f98;\n}\n\n.table-link-btn {\n  border: 1px solid #c6d7f3;\n  border-radius: 8px;\n  background: #f4f8ff;\n  color: #174074;\n  font-weight: 700;\n  min-width: 44px;\n  padding: 4px 10px;\n  cursor: pointer;\n}\n\n.table-link-btn:hover:not(:disabled) {\n  background: #e9f1ff;\n}\n\n.table-link-btn:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n\n.date-picker-suffix-btn {\n  width: 30px;\n  height: 30px;\n  margin-right: 6px;\n  border: 1px solid #c6d7f3;\n  border-radius: 8px;\n  background: #f6faff;\n  color: #1d4d87;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n\n.date-picker-suffix-btn:hover {\n  background: #ebf4ff;\n}\n\n.calendar-icon-glyph {\n  width: 14px;\n  height: 14px;\n  border: 2px solid currentColor;\n  border-radius: 3px;\n  position: relative;\n  display: inline-block;\n  box-sizing: border-box;\n}\n\n.calendar-icon-glyph::before,\n.calendar-icon-glyph::after {\n  content: '';\n  position: absolute;\n  top: -4px;\n  width: 2px;\n  height: 4px;\n  border-radius: 2px;\n  background: currentColor;\n}\n\n.calendar-icon-glyph::before {\n  left: 2px;\n}\n\n.calendar-icon-glyph::after {\n  right: 2px;\n}\n\n.table-wrap {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  overflow-x: auto;\n  border: 1px solid #e1e8f7;\n  border-radius: 12px;\n}\n\n.modern-table {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 980px;\n}\n\n.modern-table th {\n  text-align: left;\n  font-size: 0.86rem;\n  letter-spacing: 0.02em;\n  color: #5d6f8d;\n  background: #f4f8ff;\n  padding: 12px;\n  border-bottom: 1px solid #e1e8f7;\n}\n\n.modern-table td {\n  padding: 12px;\n  border-bottom: 1px solid #edf2fb;\n  vertical-align: top;\n  color: #213459;\n}\n\n.modern-table tbody tr:last-child td {\n  border-bottom: 0;\n}\n\n.modern-table tbody tr.row-dirty {\n  background: linear-gradient(90deg, rgba(23, 117, 208, 0.06), rgba(23, 117, 208, 0.01));\n}\n\n.modern-table td strong {\n  display: block;\n}\n\n.modern-table td small {\n  display: block;\n  margin-top: 3px;\n  line-height: 1.32;\n  color: #6f7f99;\n}\n\n.cell-controls {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.table-field {\n  min-width: 170px;\n  width: 100%;\n}\n\n.percent-field {\n  min-width: 140px;\n  max-width: 160px;\n}\n\n.structure-cell {\n  display: grid;\n  gap: 4px;\n}\n\n.association-list {\n  display: grid;\n  gap: 7px;\n}\n\n.association-item {\n  display: grid;\n  gap: 3px;\n  padding: 6px 8px;\n  border: 1px solid #dce7f7;\n  border-radius: 8px;\n  background: #f8fbff;\n}\n\n.association-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n\n.structure-name {\n  color: #1f355c;\n  font-size: 0.84rem;\n}\n\n.structure-code {\n  color: #3a5074;\n  font-size: 0.8rem;\n}\n\n.structure-name.muted,\n.structure-code.muted {\n  color: #6f7f99;\n}\n\n.association-status {\n  display: inline-flex;\n  align-items: center;\n  min-height: 20px;\n  padding: 1px 8px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n}\n\n.association-status-active {\n  color: #0f6b3f;\n  background: #e8f7ef;\n  border-color: #b8e4cb;\n}\n\n.association-status-used {\n  color: #9a3412;\n  background: #fff4e5;\n  border-color: #f6cf9b;\n}\n\n.association-status-expired {\n  color: #b42318;\n  background: #fff1f1;\n  border-color: #f5c2c2;\n}\n\n.association-status-invalid {\n  color: #4b5565;\n  background: #edf1f6;\n  border-color: #d3dce8;\n}\n\n.unlocked-cell {\n  display: grid;\n  gap: 6px;\n  min-width: 210px;\n}\n\n.unlocked-counts {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px 12px;\n}\n\n.unlocked-tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n\n.unlocked-pois {\n  display: grid;\n  gap: 2px;\n}\n\n.unlocked-poi-item {\n  color: #4a5f80;\n}\n\n.associated-code-status-cell {\n  min-width: 130px;\n}\n\n.associated-code-status-cell small {\n  display: block;\n  margin-top: 4px;\n  color: #5b6f90;\n  font-size: 0.72rem;\n}\n\n.structure-codes-list {\n  display: grid;\n  gap: 6px;\n}\n\n.structure-code-item {\n  display: grid;\n  gap: 2px;\n}\n\n.discount-group-list {\n  display: grid;\n  gap: 10px;\n}\n\n.discount-group-item {\n  border: 1px solid #dfe8f8;\n  border-radius: 10px;\n  background: #f9fcff;\n  padding: 10px;\n  display: grid;\n  gap: 8px;\n}\n\n.discount-group-main {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 12px;\n}\n\n.discount-group-main code {\n  background: #ecf3ff;\n  border: 1px solid #cfe0fb;\n  border-radius: 8px;\n  padding: 3px 8px;\n  color: #113b6e;\n  font-weight: 700;\n}\n\n.discount-group-meta {\n  color: #486286;\n  font-size: 0.86rem;\n}\n\n.discount-group-meta strong {\n  color: #1f355c;\n}\n\n.expiry-badge {\n  display: inline-flex;\n  align-items: center;\n  min-height: 21px;\n  margin-left: 8px;\n  padding: 1px 8px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1;\n}\n\n.expiry-badge-active {\n  color: #0f6b3f;\n  background: #e8f7ef;\n  border-color: #b8e4cb;\n}\n\n.expiry-badge-expired {\n  color: #b42318;\n  background: #fff1f1;\n  border-color: #f5c2c2;\n}\n\n.expiry-badge-unknown {\n  color: #4b5565;\n  background: #edf1f6;\n  border-color: #d3dce8;\n}\n\n.payment-user-cell {\n  min-width: 240px;\n}\n\n.payment-method-cell {\n  min-width: 200px;\n}\n\n.payment-content-cell {\n  min-width: 180px;\n}\n\n.payments-table {\n  min-width: 860px;\n  table-layout: fixed;\n}\n\n.payments-table .payment-user-cell {\n  min-width: 0;\n  width: 220px;\n}\n\n.payments-table .payment-method-cell {\n  min-width: 0;\n  width: 130px;\n}\n\n.payments-table .payment-content-cell {\n  min-width: 0;\n  width: 170px;\n}\n\n.payments-table th,\n.payments-table td {\n  padding: 9px 8px;\n}\n\n.payments-table td {\n  overflow-wrap: anywhere;\n}\n\n.payments-table .payment-user-cell small,\n.payments-table .payment-method-cell small {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 100%;\n}\n\n.payment-type-badge {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  padding: 2px 9px;\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1.2;\n}\n\n.payment-type-badge.bundle {\n  color: #0f4f98;\n  background: #e8f1ff;\n  border-color: #c6dbfb;\n}\n\n.payment-type-badge.single {\n  color: #196a3a;\n  background: #e9f8ef;\n  border-color: #bde5cc;\n}\n\n.catalog-stack {\n  display: grid;\n  gap: 12px;\n}\n\n.catalog-tabs {\n  display: inline-flex;\n  gap: 8px;\n  margin-bottom: 12px;\n  padding: 6px;\n  border-radius: 12px;\n  background: #eef4ff;\n  border: 1px solid #d9e5f9;\n}\n\n.catalog-tab {\n  border: 0;\n  border-radius: 9px;\n  padding: 9px 14px;\n  font-size: 0.92rem;\n  font-weight: 700;\n  color: #355179;\n  background: transparent;\n  cursor: pointer;\n}\n\n.catalog-tab.active {\n  color: #fff;\n  background: linear-gradient(135deg, #1b75d0, #0d4e9d);\n  box-shadow: 0 2px 10px rgba(10, 63, 126, 0.28);\n}\n\n.catalog-panel-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n\n.catalog-list-head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 8px;\n}\n\n.ghost-btn {\n  border: 1px solid #c6d7f3;\n  border-radius: 10px;\n  background: #fff;\n  color: #174074;\n  padding: 8px 11px;\n  font-weight: 600;\n  cursor: pointer;\n}\n\n.catalog-city-filter {\n  width: 100%;\n}\n\n.compact-filter {\n  max-width: 340px;\n}\n\n.coords-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 10px;\n}\n\n.map-picker-row {\n  display: flex;\n  justify-content: flex-start;\n}\n\n.media-upload-row,\n.audio-upload-row {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n\n.media-block {\n  border: 1px solid #dbe7fb;\n  border-radius: 12px;\n  background: #fff;\n  padding: 12px;\n  display: grid;\n  gap: 10px;\n}\n\n.media-block-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.media-block-head strong {\n  color: #17345b;\n}\n\n.media-block-head span {\n  color: #5e7497;\n  font-size: 0.84rem;\n}\n\n.media-preview {\n  border-radius: 10px;\n  border: 1px solid #d8e5f9;\n  overflow: hidden;\n  background: #f2f7ff;\n  min-height: 180px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.media-preview.placeholder {\n  color: #5f7598;\n  font-size: 0.9rem;\n  text-align: center;\n  padding: 10px;\n}\n\n.media-preview img {\n  width: 100%;\n  max-height: 240px;\n  object-fit: cover;\n  display: block;\n}\n\n.media-upload-actions {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n\n.translation-panel {\n  border: 1px solid #dbe7fb;\n  border-radius: 12px;\n  background: #f8fbff;\n  padding: 14px;\n  display: grid;\n  gap: 12px;\n}\n\n.translation-panel-head {\n  display: grid;\n  gap: 4px;\n}\n\n.translation-panel-head strong {\n  color: #17345b;\n}\n\n.translation-panel-head span {\n  color: #5e7497;\n  font-size: 0.88rem;\n}\n\n.translation-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 12px;\n}\n\n.translation-card {\n  border: 1px solid #d6e2f8;\n  border-radius: 12px;\n  background: #fff;\n  padding: 12px;\n  display: grid;\n  gap: 10px;\n}\n\n.translation-card h3 {\n  margin: 0;\n  color: #163a67;\n  font-size: 1rem;\n}\n\n.media-player {\n  width: 100%;\n}\n\n.audio-file-pill {\n  border: 1px solid #dbe7fb;\n  border-radius: 10px;\n  background: #f6faff;\n  padding: 10px 12px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  color: #1c3f6f;\n}\n\n.audio-file-label {\n  color: #5f7598;\n  font-size: 0.86rem;\n}\n\n.audio-link-btn {\n  border: 1px solid #c9daf7;\n  border-radius: 10px;\n  background: #f7fbff;\n  color: #12427a;\n  padding: 6px 10px;\n  font-size: 0.85rem;\n  font-weight: 600;\n  cursor: pointer;\n  text-align: left;\n  max-width: 100%;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.audio-link-btn:hover:not(:disabled) {\n  background: #ebf4ff;\n}\n\n.audio-link-btn:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.media-url-field,\n.audio-url-field {\n  flex: 1;\n}\n\n.compact-wrap .modern-table {\n  min-width: 620px;\n}\n\n.compact-table th,\n.compact-table td {\n  padding: 10px;\n}\n\n.action-buttons {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n\n.user-row-actions {\n  width: 100%;\n  display: grid;\n  gap: 8px;\n  align-items: stretch;\n}\n\n.user-row-actions-top {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 8px;\n}\n\n.user-row-actions-top button,\n.user-row-impersonate-btn {\n  width: 100%;\n}\n\n.row-save-btn {\n  border: 0;\n  border-radius: 10px;\n  background: linear-gradient(135deg, #0f4f98, #1c7be0);\n  color: #fff;\n  padding: 8px 12px;\n  font-size: 0.85rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: transform 0.15s ease, filter 0.15s ease, opacity 0.15s ease;\n}\n\n.row-save-btn:hover:not(:disabled) {\n  filter: brightness(1.05);\n  transform: translateY(-1px);\n}\n\n.row-save-btn:disabled {\n  background: #e3eaf8;\n  color: #5f7294;\n  cursor: not-allowed;\n  transform: none;\n}\n\n.row-save-btn.secondary {\n  background: #e7eefb;\n  color: #2b456d;\n}\n\n.dialog-form {\n  margin-top: 0;\n  width: 100%;\n  min-width: 0;\n}\n\n.dialog-body {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 14px;\n  padding-top: 6px;\n  overflow-x: hidden;\n}\n\n.dialog-body > * {\n  min-width: 0;\n}\n\n.dialog-body mat-form-field,\n.dialog-body .coords-grid,\n.dialog-body .map-picker-row,\n.dialog-body .media-block,\n.dialog-body .translation-panel,\n.dialog-body .media-upload-row,\n.dialog-body .media-player {\n  grid-column: 1 / -1;\n}\n\n.dialog-actions {\n  display: flex;\n  gap: 10px;\n  padding: 0 24px 18px;\n}\n\n.map-dialog-body {\n  grid-template-columns: 1fr;\n}\n\n.map-search-form {\n  margin-top: 0;\n  display: grid;\n  gap: 10px;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n}\n\n.map-search-form mat-form-field {\n  width: 100%;\n}\n\n.map-results {\n  display: grid;\n  gap: 10px;\n  max-height: min(52vh, 420px);\n  overflow: auto;\n}\n\n.map-selected-coords {\n  margin: 0;\n  padding: 8px 10px;\n  border-radius: 10px;\n  border: 1px solid #dbe7fb;\n  background: #f6faff;\n  color: #21446f;\n  font-size: 0.9rem;\n}\n\n.map-result-card {\n  border: 1px solid #dbe7fb;\n  border-radius: 12px;\n  background: #fff;\n  padding: 12px;\n  display: grid;\n  gap: 6px;\n}\n\n.map-result-card strong {\n  color: #17345b;\n}\n\n.map-result-card small {\n  color: #5f7598;\n  word-break: break-word;\n}\n\n.map-preview-panel {\n  border: 1px solid #dbe7fb;\n  border-radius: 12px;\n  background: #fff;\n  padding: 10px;\n  display: grid;\n  gap: 8px;\n}\n\n.map-preview-head {\n  display: grid;\n  gap: 2px;\n}\n\n.map-preview-head strong {\n  color: #17345b;\n}\n\n.map-preview-head small {\n  color: #5f7598;\n}\n\n.poi-map-canvas {\n  width: 100%;\n  height: 340px;\n  border-radius: 10px;\n  overflow: hidden;\n  border: 1px solid #d6e3f8;\n  background: linear-gradient(140deg, #e8eef9, #f4f8ff);\n}\n\n.poi-map-canvas.ready {\n  background: #e8eef9;\n}\n\n.status-pill {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 4px 10px;\n  font-size: 0.78rem;\n  font-weight: 600;\n}\n\n.status-pill.ok {\n  color: #17653d;\n  background: #e7f7ee;\n}\n\n.status-pill.warn {\n  color: #915b00;\n  background: #fef6dd;\n}\n\n.status-pill.bad {\n  color: #b42318;\n  background: #feeceb;\n}\n\n.partner-requests-table {\n  min-width: 1220px;\n}\n\n.partner-request-main-cell {\n  min-width: 220px;\n}\n\n.partner-request-contact-cell {\n  min-width: 180px;\n}\n\n.partner-request-address-cell {\n  min-width: 240px;\n}\n\n.partner-request-status-cell {\n  min-width: 170px;\n  display: grid;\n  gap: 6px;\n}\n\n.partner-request-message-cell {\n  min-width: 260px;\n}\n\n.partner-request-notes {\n  white-space: pre-line;\n}\n\n.partner-request-empty-note {\n  color: #6b7d98;\n  font-style: italic;\n}\n\n.empty-cell {\n  color: #6b7d98;\n  text-align: center;\n  font-style: italic;\n}\n\n.spinner-cell {\n  padding: 16px 10px;\n}\n\n.spinner-cell .mat-mdc-progress-spinner,\n.inline-loader .mat-mdc-progress-spinner {\n  --mdc-circular-progress-active-indicator-color: #1c7be0;\n  margin: 0 auto;\n}\n\n.inline-loader {\n  display: flex;\n  justify-content: center;\n  padding: 8px 0;\n}\n\ncode {\n  background: #eef4ff;\n  color: #24406c;\n  border-radius: 6px;\n  padding: 3px 7px;\n}\n\n@media (max-width: 1100px) {\n  .dashboard-layout {\n    grid-template-columns: 220px 1fr;\n  }\n\n  .brand strong,\n  .brand p {\n    display: none;\n  }\n\n  .brand {\n    justify-content: center;\n    border-bottom: 0;\n    padding-bottom: 0;\n  }\n}\n\n@media (max-width: 860px) {\n  .dashboard-layout {\n    grid-template-columns: 1fr;\n  }\n\n  .sidebar {\n    padding: 12px;\n    gap: 12px;\n    position: static;\n    top: auto;\n    align-self: auto;\n    height: auto;\n    overflow: visible;\n  }\n\n  .sidebar-nav {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .nav-item {\n    justify-content: center;\n  }\n\n  .dashboard-main {\n    padding: 14px;\n  }\n\n  .stats-grid {\n    grid-template-columns: 1fr;\n  }\n\n  .table-head {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n\n  .table-actions {\n    width: 100%;\n    flex-direction: column;\n    align-items: stretch;\n  }\n\n  .toggle-panel-btn {\n    width: 100%;\n    justify-content: center;\n  }\n\n  .catalog-list-head {\n    flex-direction: column;\n    align-items: stretch;\n  }\n\n  .catalog-tabs {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    width: 100%;\n  }\n\n  .invite-code-row {\n    grid-template-columns: 1fr;\n  }\n\n  .address-grid {\n    grid-template-columns: 1fr;\n  }\n\n  .coords-grid {\n    grid-template-columns: 1fr;\n  }\n\n  .map-search-form {\n    grid-template-columns: 1fr;\n  }\n\n  .address-span-2 {\n    grid-column: auto;\n  }\n\n  .generate-code-btn {\n    width: 100%;\n  }\n\n  .media-upload-row,\n  .media-upload-actions,\n  .audio-upload-row {\n    flex-direction: column;\n    align-items: stretch;\n  }\n\n  .modern-table {\n    min-width: 700px;\n  }\n}\n"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.AdminAuthService }, { type: i3.MatDialog }, { type: i4.Router }, { type: i4.ActivatedRoute }, { type: i5.MatSnackBar }], { createCatalogCityDialog: [{
            type: ViewChild,
            args: ['createCatalogCityDialog']
        }], createCatalogPoiDialog: [{
            type: ViewChild,
            args: ['createCatalogPoiDialog']
        }], editCatalogCityDialog: [{
            type: ViewChild,
            args: ['editCatalogCityDialog']
        }], editCatalogPoiDialog: [{
            type: ViewChild,
            args: ['editCatalogPoiDialog']
        }], createDiscountCodeDialog: [{
            type: ViewChild,
            args: ['createDiscountCodeDialog']
        }], editDiscountCodeDialog: [{
            type: ViewChild,
            args: ['editDiscountCodeDialog']
        }], partnerRequestApprovalDialog: [{
            type: ViewChild,
            args: ['partnerRequestApprovalDialog']
        }], catalogPoiAudioPlayerDialog: [{
            type: ViewChild,
            args: ['catalogPoiAudioPlayerDialog']
        }], poiMapPickerDialog: [{
            type: ViewChild,
            args: ['poiMapPickerDialog']
        }], poiMapCanvas: [{
            type: ViewChild,
            args: ['poiMapCanvas']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AdminDashboardComponent, { className: "AdminDashboardComponent", filePath: "src/app/features/admin-dashboard/admin-dashboard.component.ts", lineNumber: 75 }); })();
