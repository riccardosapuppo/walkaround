import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "@angular/common/http";
import * as i3 from "../../../core/services/paypal-checkout.service";
import * as i4 from "../../../core/services/app-state.service";
import * as i5 from "../../../core/services/i18n.service";
import * as i6 from "@angular/common";
import * as i7 from "@angular/forms";
import * as i8 from "@angular/material/form-field";
import * as i9 from "@angular/material/input";
import * as i10 from "@angular/material/button";
import * as i11 from "@angular/material/icon";
import * as i12 from "@angular/material/progress-spinner";
const _c0 = ["paypalButtonsContainer"];
const _c1 = (a0, a1, a2, a3) => ({ "status-chip-valid": a0, "status-chip-used": a1, "status-chip-expired": a2, "status-chip-invalid": a3 });
function UnlockCodeDialogComponent_div_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 17);
    i0.ɵɵelement(1, "mat-spinner", 18);
    i0.ɵɵelementStart(2, "p", 19);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.checkingStoredCode"));
} }
function UnlockCodeDialogComponent_div_12_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26)(1, "p", 27);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 28)(4, "strong");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "code");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.storedCodeDetected"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.code"), ":");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.storedCode);
} }
function UnlockCodeDialogComponent_div_12_p_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 29);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.validationError);
} }
function UnlockCodeDialogComponent_div_12_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 30);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_div_12_button_4_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.useStoredCode()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r0.validating);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.i18n.t("unlock.useStoredCode"), " ");
} }
function UnlockCodeDialogComponent_div_12_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 20);
    i0.ɵɵtemplate(1, UnlockCodeDialogComponent_div_12_div_1_Template, 8, 3, "div", 21)(2, UnlockCodeDialogComponent_div_12_p_2_Template, 2, 1, "p", 22);
    i0.ɵɵelementStart(3, "div", 23);
    i0.ɵɵtemplate(4, UnlockCodeDialogComponent_div_12_button_4_Template, 2, 2, "button", 24);
    i0.ɵɵelementStart(5, "button", 25);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_div_12_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.chooseHasInviteCode()); });
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 25);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_div_12_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.chooseNoInviteCode()); });
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.hasStoredCode);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.validationError);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r0.hasStoredCode);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.hasStoredCode ? ctx_r0.i18n.t("unlock.enterNewCode") : ctx_r0.i18n.t("unlock.haveInviteCode"), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.i18n.t("unlock.noCodePaypal"), " ");
} }
function UnlockCodeDialogComponent_div_13_mat_error_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.enterValidCode"));
} }
function UnlockCodeDialogComponent_div_13_p_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 29);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.validationError);
} }
function UnlockCodeDialogComponent_div_13_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 20)(1, "mat-form-field", 31)(2, "mat-label");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 32);
    i0.ɵɵlistener("input", function UnlockCodeDialogComponent_div_13_Template_input_input_4_listener() { i0.ɵɵrestoreView(_r4); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.normalizeCodeInput()); })("keyup.enter", function UnlockCodeDialogComponent_div_13_Template_input_keyup_enter_4_listener() { i0.ɵɵrestoreView(_r4); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.validateCode()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "mat-hint");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, UnlockCodeDialogComponent_div_13_mat_error_7_Template, 2, 1, "mat-error", 33);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, UnlockCodeDialogComponent_div_13_p_8_Template, 2, 1, "p", 22);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.inviteCode"));
    i0.ɵɵadvance();
    i0.ɵɵproperty("formControl", ctx_r0.codeControl);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.codeHint"));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.codeControl.invalid && ctx_r0.codeControl.touched);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.validationError);
} }
function UnlockCodeDialogComponent_div_14_div_1_p_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 28)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const association_r5 = i0.ɵɵnextContext().ngIf;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.applicableTo"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.applicableToLabel(association_r5.appliesTo), " ");
} }
function UnlockCodeDialogComponent_div_14_div_1_p_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 28)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const association_r5 = i0.ɵɵnextContext().ngIf;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.city"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.associationCitiesLabel(association_r5), " ");
} }
function UnlockCodeDialogComponent_div_14_div_1_p_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 28)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const association_r5 = i0.ɵɵnextContext().ngIf;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.expiry"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.formatDateTime(association_r5.expiresAt), " ");
} }
function UnlockCodeDialogComponent_div_14_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 38)(1, "p", 27);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 28)(4, "strong");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "code");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "p", 28)(9, "strong");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(12, UnlockCodeDialogComponent_div_14_div_1_p_12_Template, 4, 2, "p", 39)(13, UnlockCodeDialogComponent_div_14_div_1_p_13_Template, 4, 2, "p", 39);
    i0.ɵɵelementStart(14, "p", 40)(15, "strong");
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "span", 41);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(19, UnlockCodeDialogComponent_div_14_div_1_p_19_Template, 4, 2, "p", 39);
    i0.ɵɵelementStart(20, "p", 28)(21, "strong");
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "p", 28)(25, "strong");
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "p", 28)(29, "strong");
    i0.ɵɵtext(30);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "p", 42)(33, "strong");
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(35);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const association_r5 = ctx.ngIf;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.discountCodeApplied"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.code"), ":");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.appliedCode || association_r5.inviteCode);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.structure"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", association_r5.structureName, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", association_r5.appliesTo);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.associationCitiesLabel(association_r5));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.codeStatus"), ":");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction4(19, _c1, association_r5.codeStatus === "valid", association_r5.codeStatus === "used", association_r5.codeStatus === "expired", association_r5.codeStatus !== "valid" && association_r5.codeStatus !== "expired" && association_r5.codeStatus !== "used"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.codeStatusLabel(association_r5.codeStatus), " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", association_r5.expiresAt);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.discount"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.discountPercent, "%");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.basePrice"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.formatAmount(ctx_r0.baseAmount), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.discountApplied"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" -", ctx_r0.formatAmount(ctx_r0.discountAmount), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.finalPrice"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.formatAmount(ctx_r0.finalAmount), "");
} }
function UnlockCodeDialogComponent_div_14_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 38)(1, "p", 27);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 28);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 28)(6, "strong");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 28)(10, "strong");
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "p", 42)(14, "strong");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.paypalPayment"));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.noCodeSummary"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.basePrice"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.formatAmount(ctx_r0.baseAmount), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.discountApplied"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" -", ctx_r0.formatAmount(0), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.totalToPay"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.formatAmount(ctx_r0.finalAmount), "");
} }
function UnlockCodeDialogComponent_div_14_div_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 43);
    i0.ɵɵelement(1, "mat-spinner", 44);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.paypalInit"));
} }
function UnlockCodeDialogComponent_div_14_p_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 29);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.paymentError);
} }
function UnlockCodeDialogComponent_div_14_div_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 45, 1);
} }
function UnlockCodeDialogComponent_div_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20);
    i0.ɵɵtemplate(1, UnlockCodeDialogComponent_div_14_div_1_Template, 36, 24, "div", 34)(2, UnlockCodeDialogComponent_div_14_ng_template_2_Template, 17, 8, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementStart(4, "div", 35)(5, "p", 27);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 28);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, UnlockCodeDialogComponent_div_14_div_9_Template, 4, 1, "div", 36)(10, UnlockCodeDialogComponent_div_14_p_10_Template, 2, 1, "p", 22)(11, UnlockCodeDialogComponent_div_14_div_11_Template, 2, 0, "div", 37);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const noCodeSummary_r6 = i0.ɵɵreference(3);
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.appliedAssociation)("ngIfElse", noCodeSummary_r6);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.paymentMethod"));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.paymentNote"));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.paypalLoading && !ctx_r0.processingPayment);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.paymentError);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r0.processingPayment && !ctx_r0.paymentCompleted);
} }
function UnlockCodeDialogComponent_div_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 17);
    i0.ɵɵelement(1, "mat-spinner", 46);
    i0.ɵɵelementStart(2, "p", 19);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 47);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.processingPayment"));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.processingSubtitle"));
} }
function UnlockCodeDialogComponent_div_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 48)(1, "p", 27);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 28);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 42)(6, "strong");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.paymentConfirmed"));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.paymentResultMessage);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r0.i18n.t("unlock.totalPaid"), ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.formatAmount(ctx_r0.finalAmount), "");
} }
function UnlockCodeDialogComponent_button_18_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 49);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_18_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.close()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("common.cancel"));
} }
function UnlockCodeDialogComponent_button_19_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 49);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_19_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.backToChoice()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("common.back"));
} }
function UnlockCodeDialogComponent_button_20_span_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.i18n.t("unlock.verifyCode"));
} }
function UnlockCodeDialogComponent_button_20_span_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 52);
    i0.ɵɵelement(1, "mat-spinner", 53);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.i18n.t("unlock.checking"), " ");
} }
function UnlockCodeDialogComponent_button_20_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 50);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_20_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r9); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.validateCode()); });
    i0.ɵɵtemplate(1, UnlockCodeDialogComponent_button_20_span_1_Template, 2, 1, "span", 33)(2, UnlockCodeDialogComponent_button_20_span_2_Template, 3, 1, "span", 51);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r0.validating);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r0.validating);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.validating);
} }
function UnlockCodeDialogComponent_button_21_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 54);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_21_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.proceedWithoutCode()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r0.validating);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.i18n.t("unlock.payWithoutCode"), " ");
} }
function UnlockCodeDialogComponent_button_22_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 55);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_22_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r11); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.useDifferentCode()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.i18n.t("unlock.changeCode"), " ");
} }
function UnlockCodeDialogComponent_button_23_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 55);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_23_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.backToChoice()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.i18n.t("common.goBack"), " ");
} }
function UnlockCodeDialogComponent_button_24_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 56);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_24_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.closeAfterPayment()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.i18n.t("common.ok"), " ");
} }
export class UnlockCodeDialogComponent {
    constructor(dialogRef, http, paypalCheckout, appState, i18n, data) {
        this.dialogRef = dialogRef;
        this.http = http;
        this.paypalCheckout = paypalCheckout;
        this.appState = appState;
        this.i18n = i18n;
        this.data = data;
        this.codeControl = new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[A-Z0-9]{6}$/)]
        });
        this.step = 'choice';
        this.syncingAssociation = false;
        this.validating = false;
        this.validationError = '';
        this.processingPayment = false;
        this.paymentCompleted = false;
        this.paymentError = '';
        this.paypalLoading = false;
        this.appliedAssociation = null;
        this.appliedCode = '';
        this.completedPurchase = null;
        this.storedCode = '';
        this.hasStoredCode = false;
        this.destroyed = false;
        this.lastPayPalRenderSignature = '';
        this.storedCode = this.resolveStoredCode();
        this.hasStoredCode = this.storedCode.length === 6;
        this.codeControl.setValue('');
        this.appliedCode = '';
        this.appliedAssociation = null;
        this.step = 'choice';
        if (this.hasStoredCode) {
            this.syncingAssociation = true;
            this.validateCodeByValue(this.storedCode, { fromStoredCode: true, preserveStepOnError: 'choice' });
        }
    }
    ngAfterViewChecked() {
        if (this.step !== 'summary' || this.paymentCompleted) {
            return;
        }
        const container = this.paypalButtonsContainer?.nativeElement;
        if (!container) {
            return;
        }
        const signature = this.buildPayPalRenderSignature();
        if (!signature || signature === this.lastPayPalRenderSignature) {
            return;
        }
        this.lastPayPalRenderSignature = signature;
        void this.renderPayPalButtons();
    }
    ngOnDestroy() {
        this.destroyed = true;
        this.clearPayPalButtons();
    }
    get targetLabel() {
        return this.data?.target?.label || this.applicableToLabel(this.data?.target?.type === 'bundle' ? 'bundle' : 'single');
    }
    get baseAmount() {
        return Number(this.data?.target?.baseAmount || 0);
    }
    get discountPercent() {
        const association = this.appliedAssociation;
        if (!this.isAssociationApplicableToTarget(association)) {
            return 0;
        }
        const value = Number(this.data.target.type === 'bundle'
            ? association?.userDiscountPercentBundle ?? association?.userDiscountPercent ?? 0
            : association?.userDiscountPercentSingle ?? association?.userDiscountPercent ?? 0);
        if (!Number.isFinite(value)) {
            return 0;
        }
        return Math.max(0, Math.min(100, value));
    }
    get discountAmount() {
        return this.roundMoney((this.baseAmount * this.discountPercent) / 100);
    }
    get finalAmount() {
        return this.roundMoney(Math.max(0, this.baseAmount - this.discountAmount));
    }
    associationCitiesLabel(association) {
        if (!association) {
            return '';
        }
        const cityNames = this.associationCityNames(association);
        if (cityNames.length) {
            return cityNames.join(', ');
        }
        if (association.cityName) {
            return association.cityName;
        }
        return '';
    }
    chooseHasInviteCode() {
        this.validationError = '';
        this.resetPayPalRenderState();
        this.step = 'input';
    }
    chooseNoInviteCode() {
        this.openPayPalSummaryWithoutCode();
    }
    useStoredCode() {
        if (!this.hasStoredCode || this.validating || this.syncingAssociation) {
            return;
        }
        this.validationError = '';
        this.validateCodeByValue(this.storedCode, { fromStoredCode: true, preserveStepOnError: 'choice' });
    }
    backToChoice() {
        this.resetPayPalRenderState();
        this.step = 'choice';
    }
    close() {
        if (this.processingPayment) {
            return;
        }
        this.dialogRef.close({ action: 'cancel' });
    }
    normalizeCodeInput() {
        const current = String(this.codeControl.value || '');
        const normalized = current.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
        if (normalized !== current) {
            this.codeControl.setValue(normalized);
        }
    }
    validateCode() {
        this.normalizeCodeInput();
        if (this.codeControl.invalid) {
            this.codeControl.markAsTouched();
            return;
        }
        const code = this.codeControl.value.trim().toUpperCase();
        this.validateCodeByValue(code, { fromStoredCode: false, preserveStepOnError: 'input' });
    }
    useDifferentCode() {
        this.resetPayPalRenderState();
        this.step = 'input';
        this.validationError = '';
    }
    proceedWithoutCode() {
        this.openPayPalSummaryWithoutCode();
    }
    closeAfterPayment() {
        this.dialogRef.close({
            action: 'paid',
            association: this.appliedAssociation,
            pricing: {
                baseAmount: this.baseAmount,
                discountPercent: this.discountPercent,
                discountAmount: this.discountAmount,
                finalAmount: this.finalAmount
            },
            purchase: this.completedPurchase || undefined
        });
    }
    get paymentResultMessage() {
        if (!this.completedPurchase) {
            return this.i18n.t('unlock.paymentDone');
        }
        if (this.completedPurchase.alreadyPurchased) {
            return this.i18n.t('unlock.alreadyPurchased');
        }
        return this.i18n.t('unlock.paymentSuccess');
    }
    formatAmount(value) {
        return this.i18n.formatCurrency(this.roundMoney(value));
    }
    formatDateTime(value) {
        return this.i18n.formatDateTime(value);
    }
    codeStatusLabel(status) {
        if (status === 'valid') {
            return this.i18n.t('common.status.valid');
        }
        if (status === 'used') {
            return this.i18n.t('common.status.used');
        }
        if (status === 'expired') {
            return this.i18n.t('common.status.expired');
        }
        return this.i18n.t('common.status.invalid');
    }
    applicableToLabel(value) {
        return value === 'bundle' ? this.i18n.t('unlock.applicableBundle') : this.i18n.t('unlock.applicableSingle');
    }
    roundMoney(value) {
        const normalized = Number(value);
        if (!Number.isFinite(normalized)) {
            return 0;
        }
        return Math.round(normalized * 100) / 100;
    }
    resolveStoredCode() {
        const fromAssociation = String(this.data?.existingAssociation?.inviteCode || '').trim().toUpperCase();
        if (/^[A-Z0-9]{6}$/.test(fromAssociation)) {
            return fromAssociation;
        }
        const fromCode = String(this.data?.existingCode || '').trim().toUpperCase();
        if (/^[A-Z0-9]{6}$/.test(fromCode)) {
            return fromCode;
        }
        return '';
    }
    validateCodeByValue(code, options) {
        if (this.validating) {
            return;
        }
        this.validating = true;
        if (options.fromStoredCode) {
            this.syncingAssociation = true;
        }
        this.validationError = '';
        this.http
            .post(`${environment.apiBaseUrl}/hotel/validate`, {
            code,
            userId: this.data.userId,
            targetType: this.data.target.type,
            cityId: this.data.target.cityId
        })
            .subscribe({
            next: (response) => {
                this.validating = false;
                this.syncingAssociation = false;
                if (!response.valid || !response.association) {
                    this.appliedAssociation = null;
                    this.appliedCode = '';
                    this.resetPayPalRenderState();
                    this.step = options.preserveStepOnError;
                    this.validationError = this.fallbackValidationError(options.fromStoredCode);
                    return;
                }
                const normalizedAssociation = this.normalizeAssociationStatus(response.association);
                if (!this.isAssociationValid(normalizedAssociation)) {
                    this.appliedAssociation = null;
                    this.appliedCode = '';
                    this.resetPayPalRenderState();
                    this.step = options.preserveStepOnError;
                    this.validationError = this.getInvalidCodeMessage(normalizedAssociation.codeStatus, options.fromStoredCode);
                    return;
                }
                if (!this.isAssociationApplicableToTarget(normalizedAssociation)) {
                    this.appliedAssociation = null;
                    this.appliedCode = '';
                    this.resetPayPalRenderState();
                    this.step = options.preserveStepOnError;
                    this.validationError = options.fromStoredCode
                        ? `${this.getInvalidTargetMessage(normalizedAssociation)} ${this.i18n.t('unlock.proceedWithoutOrChangeCode')}`
                        : this.getInvalidTargetMessage(normalizedAssociation);
                    return;
                }
                this.appliedCode = code;
                this.appliedAssociation = normalizedAssociation;
                this.appState.setHotelCode(code);
                this.appState.setHotelAssociation(this.appliedAssociation);
                this.step = 'summary';
                this.paymentError = '';
                this.resetPayPalRenderState();
            },
            error: (error) => {
                this.validating = false;
                this.syncingAssociation = false;
                this.appliedAssociation = null;
                this.appliedCode = '';
                this.resetPayPalRenderState();
                this.step = options.preserveStepOnError;
                const status = error?.error?.codeStatus;
                const backendMessage = String(error?.error?.message || '').trim();
                if (options.fromStoredCode && backendMessage === 'Il codice non e applicabile a questo acquisto') {
                    this.validationError = `${this.getStoredCodeApplicabilityMessage()} ${this.i18n.t('unlock.proceedWithoutOrChangeCode')}`;
                    return;
                }
                if (status === 'expired' || status === 'used' || status === 'invalid') {
                    this.validationError = this.getInvalidCodeMessage(status, options.fromStoredCode);
                    return;
                }
                this.validationError = this.fallbackValidationError(options.fromStoredCode);
            }
        });
    }
    fallbackValidationError(fromStoredCode) {
        return fromStoredCode ? this.i18n.t('unlock.invalidStoredCode') : this.i18n.t('unlock.invalidCode');
    }
    getStoredCodeApplicabilityMessage() {
        const appliesTo = this.data?.existingAssociation?.appliesTo;
        if (appliesTo === 'bundle' && this.data.target.type === 'single') {
            return this.i18n.t('unlock.savedCodeBundleNotSingle');
        }
        if (appliesTo === 'single' && this.data.target.type === 'bundle') {
            return this.i18n.t('unlock.savedCodeSingleNotBundle');
        }
        if (appliesTo === 'bundle') {
            return this.i18n.t('unlock.savedCodeBundleOnly');
        }
        if (appliesTo === 'single') {
            return this.i18n.t('unlock.savedCodeSingleOnly');
        }
        return this.i18n.t('unlock.storedCodeNotApplicable');
    }
    isAssociationValid(association) {
        if (!association?.structureId) {
            return false;
        }
        return association.codeStatus === 'valid';
    }
    isAssociationApplicableToTarget(association) {
        if (!association?.structureId) {
            return false;
        }
        const appliesTo = association.appliesTo;
        if ((appliesTo === 'single' || appliesTo === 'bundle') && appliesTo !== this.data.target.type) {
            return false;
        }
        const codeCityIds = this.associationCityIds(association);
        if (codeCityIds.length && !codeCityIds.includes(this.data.target.cityId)) {
            return false;
        }
        return true;
    }
    getInvalidTargetMessage(association) {
        const targetLabel = this.applicableToLabel(this.data.target.type);
        const appliesTo = association.appliesTo;
        if (appliesTo === 'single' || appliesTo === 'bundle') {
            const codeLabel = this.applicableToLabel(appliesTo);
            if (appliesTo !== this.data.target.type) {
                return this.i18n.t('unlock.codeValidOnlyFor', { codeLabel, targetLabel });
            }
        }
        const cityNames = this.associationCityNames(association);
        if (cityNames.length) {
            return this.i18n.t('unlock.codeValidOnlyForCities', { cities: cityNames.join(', ') });
        }
        if (association.cityName) {
            return this.i18n.t('unlock.codeValidOnlyForCity', { city: association.cityName });
        }
        return this.i18n.t('unlock.codeNotApplicable');
    }
    associationCityIds(association) {
        const ids = Array.isArray(association?.cityIds)
            ? association?.cityIds
            : association?.cityId
                ? [association.cityId]
                : [];
        return ids
            .map((value) => String(value || '').trim())
            .filter((value) => Boolean(value));
    }
    associationCityNames(association) {
        const names = Array.isArray(association?.cityNames)
            ? association?.cityNames
            : association?.cityName
                ? [association.cityName]
                : [];
        return names
            .map((value) => String(value || '').trim())
            .filter((value) => Boolean(value));
    }
    normalizeAssociationStatus(association) {
        const status = association.codeStatus;
        if (status === 'valid' || status === 'expired' || status === 'invalid' || status === 'used') {
            return association;
        }
        const expiresAtValue = String(association.expiresAt || '').trim();
        if (expiresAtValue) {
            const expiresAtDate = new Date(expiresAtValue);
            if (!Number.isNaN(expiresAtDate.getTime())) {
                return {
                    ...association,
                    codeStatus: expiresAtDate.getTime() > Date.now() ? 'valid' : 'expired'
                };
            }
        }
        return {
            ...association,
            codeStatus: 'invalid'
        };
    }
    getInvalidCodeMessage(status, fromStoredCode) {
        if (status === 'expired') {
            return fromStoredCode ? this.i18n.t('unlock.storedCodeExpired') : this.i18n.t('unlock.codeExpired');
        }
        if (status === 'used') {
            return fromStoredCode ? this.i18n.t('unlock.storedCodeUsed') : this.i18n.t('unlock.codeUsed');
        }
        return fromStoredCode ? this.i18n.t('unlock.storedCodeInvalid') : this.i18n.t('unlock.codeInvalid');
    }
    openPayPalSummaryWithoutCode() {
        if (this.processingPayment || this.paymentCompleted) {
            return;
        }
        this.appliedAssociation = null;
        this.appliedCode = '';
        this.validationError = '';
        this.paymentError = '';
        this.step = 'summary';
        this.resetPayPalRenderState();
    }
    buildPayPalRenderSignature() {
        if (this.step !== 'summary' || this.processingPayment || this.paymentCompleted) {
            return '';
        }
        const associationKey = this.appliedAssociation?.inviteCode || this.appliedAssociation?.structureId || 'no-code';
        return [this.data.target.type, this.data.target.cityId, this.data.target.poiId || '', associationKey].join('|');
    }
    buildPayPalPayload() {
        if (this.data.target.type === 'bundle') {
            return {
                userId: this.data.userId,
                checkoutContext: 'bundle',
                cityId: this.data.target.cityId,
                ignoreDiscountCode: !this.appliedAssociation?.structureId
            };
        }
        return {
            userId: this.data.userId,
            checkoutContext: 'single',
            poiId: this.data.target.poiId || '',
            ignoreDiscountCode: !this.appliedAssociation?.structureId
        };
    }
    async renderPayPalButtons() {
        const container = this.paypalButtonsContainer?.nativeElement;
        if (!container || this.destroyed) {
            return;
        }
        this.paypalLoading = true;
        this.paymentError = '';
        this.clearPayPalButtons();
        try {
            await this.paypalCheckout.renderButtons(container, this.buildPayPalPayload(), {
                onStart: () => {
                    this.processingPayment = true;
                    this.paymentError = '';
                },
                onSuccess: (response) => {
                    if (this.destroyed) {
                        return;
                    }
                    this.processingPayment = false;
                    this.paypalLoading = false;
                    this.paymentCompleted = true;
                    this.completedPurchase = response.purchases[0] || null;
                    this.clearPayPalButtons();
                },
                onCancel: () => {
                    this.processingPayment = false;
                },
                onError: (message) => {
                    if (this.destroyed) {
                        return;
                    }
                    this.processingPayment = false;
                    this.paypalLoading = false;
                    this.paymentError = message;
                }
            });
            this.paypalLoading = false;
        }
        catch (error) {
            if (this.destroyed) {
                return;
            }
            this.processingPayment = false;
            this.paypalLoading = false;
            this.paymentError = error instanceof Error ? error.message : this.i18n.t('paypal.loadError');
            this.clearPayPalButtons();
        }
    }
    resetPayPalRenderState() {
        this.lastPayPalRenderSignature = '';
        this.processingPayment = false;
        this.paypalLoading = false;
        this.clearPayPalButtons();
    }
    clearPayPalButtons() {
        this.paypalCheckout.clearButtons(this.paypalButtonsContainer?.nativeElement);
    }
    static { this.ɵfac = function UnlockCodeDialogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || UnlockCodeDialogComponent)(i0.ɵɵdirectiveInject(i1.MatDialogRef), i0.ɵɵdirectiveInject(i2.HttpClient), i0.ɵɵdirectiveInject(i3.PayPalCheckoutService), i0.ɵɵdirectiveInject(i4.AppStateService), i0.ɵɵdirectiveInject(i5.I18nService), i0.ɵɵdirectiveInject(MAT_DIALOG_DATA)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: UnlockCodeDialogComponent, selectors: [["app-unlock-code-dialog"]], viewQuery: function UnlockCodeDialogComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.paypalButtonsContainer = _t.first);
        } }, decls: 25, vars: 15, consts: [["noCodeSummary", ""], ["paypalButtonsContainer", ""], [1, "unlock-dialog"], [1, "dialog-top"], ["aria-hidden", "true", 1, "dialog-icon"], ["fontSet", "material-icons-round"], ["mat-dialog-title", ""], [1, "dialog-subtitle"], ["class", "processing-card", "aria-live", "polite", 4, "ngIf"], ["class", "step-block", 4, "ngIf"], ["class", "summary-card success-card", "aria-live", "polite", 4, "ngIf"], ["align", "end"], ["mat-button", "", "type", "button", 3, "click", 4, "ngIf"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "disabled", "click", 4, "ngIf"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "disabled", "click", 4, "ngIf"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click", 4, "ngIf"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "click", 4, "ngIf"], ["aria-live", "polite", 1, "processing-card"], ["diameter", "30"], [1, "processing-title"], [1, "step-block"], ["class", "summary-card stored-code-card", 4, "ngIf"], ["class", "error-text", 4, "ngIf"], [1, "choice-grid"], ["type", "button", "mat-flat-button", "", "color", "primary", "class", "choice-btn", 3, "disabled", "click", 4, "ngIf"], ["type", "button", "mat-stroked-button", "", "color", "primary", 1, "choice-btn", 3, "click"], [1, "summary-card", "stored-code-card"], [1, "summary-title"], [1, "summary-line"], [1, "error-text"], ["type", "button", "mat-flat-button", "", "color", "primary", 1, "choice-btn", 3, "click", "disabled"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "maxlength", "6", "autocomplete", "off", "autocapitalize", "characters", "spellcheck", "false", 3, "input", "keyup.enter", "formControl"], [4, "ngIf"], ["class", "summary-card", 4, "ngIf", "ngIfElse"], [1, "summary-card", "paypal-card"], ["class", "paypal-loading", 4, "ngIf"], ["class", "paypal-buttons", 4, "ngIf"], [1, "summary-card"], ["class", "summary-line", 4, "ngIf"], [1, "summary-line", "status-line"], [1, "status-chip", 3, "ngClass"], [1, "summary-line", "summary-total"], [1, "paypal-loading"], ["diameter", "24"], [1, "paypal-buttons"], ["diameter", "34"], [1, "processing-subtitle"], ["aria-live", "polite", 1, "summary-card", "success-card"], ["mat-button", "", "type", "button", 3, "click"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "click", "disabled"], ["class", "btn-progress", 4, "ngIf"], [1, "btn-progress"], ["diameter", "16"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click", "disabled"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "click"]], template: function UnlockCodeDialogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "mat-icon", 5);
            i0.ɵɵtext(4, "vpn_key");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(5, "div")(6, "h2", 6);
            i0.ɵɵtext(7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 7);
            i0.ɵɵtext(9);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(10, "mat-dialog-content");
            i0.ɵɵtemplate(11, UnlockCodeDialogComponent_div_11_Template, 4, 1, "div", 8)(12, UnlockCodeDialogComponent_div_12_Template, 9, 5, "div", 9)(13, UnlockCodeDialogComponent_div_13_Template, 9, 5, "div", 9)(14, UnlockCodeDialogComponent_div_14_Template, 12, 7, "div", 9)(15, UnlockCodeDialogComponent_div_15_Template, 6, 2, "div", 8)(16, UnlockCodeDialogComponent_div_16_Template, 9, 4, "div", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "mat-dialog-actions", 11);
            i0.ɵɵtemplate(18, UnlockCodeDialogComponent_button_18_Template, 2, 1, "button", 12)(19, UnlockCodeDialogComponent_button_19_Template, 2, 1, "button", 12)(20, UnlockCodeDialogComponent_button_20_Template, 3, 3, "button", 13)(21, UnlockCodeDialogComponent_button_21_Template, 2, 2, "button", 14)(22, UnlockCodeDialogComponent_button_22_Template, 2, 1, "button", 15)(23, UnlockCodeDialogComponent_button_23_Template, 2, 1, "button", 15)(24, UnlockCodeDialogComponent_button_24_Template, 2, 1, "button", 16);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵtextInterpolate(ctx.i18n.t("unlock.title"));
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.targetLabel);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.syncingAssociation && !ctx.processingPayment && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "choice" && !ctx.syncingAssociation && !ctx.processingPayment && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "input" && !ctx.syncingAssociation && !ctx.processingPayment && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "summary" && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.processingPayment);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.paymentCompleted);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", !ctx.processingPayment && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "input");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "input");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "input" && !ctx.processingPayment && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "summary" && !ctx.processingPayment && !ctx.paymentCompleted && ctx.appliedAssociation);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "summary" && !ctx.processingPayment && !ctx.paymentCompleted && !ctx.appliedAssociation);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.paymentCompleted);
        } }, dependencies: [CommonModule, i6.NgClass, i6.NgIf, ReactiveFormsModule, i7.DefaultValueAccessor, i7.NgControlStatus, i7.MaxLengthValidator, i7.FormControlDirective, MatDialogModule, i1.MatDialogTitle, i1.MatDialogActions, i1.MatDialogContent, MatFormFieldModule, i8.MatFormField, i8.MatLabel, i8.MatHint, i8.MatError, MatInputModule, i9.MatInput, MatButtonModule, i10.MatButton, MatIconModule, i11.MatIcon, MatProgressSpinnerModule, i12.MatProgressSpinner], styles: [".unlock-dialog[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  overflow-x: hidden;\n  padding: 12px 12px 8px;\n}\n\n.dialog-top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 10px;\n  padding-right: 2px;\n}\n\n.dialog-icon[_ngcontent-%COMP%] {\n  width: 38px;\n  height: 38px;\n  flex: 0 0 38px;\n  border-radius: 10px;\n  display: grid;\n  place-items: center;\n  color: #fff;\n  background: linear-gradient(145deg, #1769aa 0%, #2f86c8 100%);\n  box-shadow: 0 8px 14px rgba(23, 105, 170, 0.24);\n\n  mat-icon {\n    width: 20px;\n    height: 20px;\n    font-size: 20px;\n  }\n}\n\nh2[mat-dialog-title][_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.08rem;\n  font-weight: 700;\n  color: #132844;\n}\n\n.dialog-subtitle[_ngcontent-%COMP%] {\n  margin: 4px 0 0;\n  color: #5a6f8b;\n  font-size: 0.9rem;\n}\n\n.choice-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n}\n\n.choice-btn[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  min-height: 44px;\n}\n\n.step-block[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n}\n\n.full-width[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 4px;\n}\n\n.summary-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  border: 1px solid #d6e2f2;\n  background: #f7fbff;\n  padding: 12px;\n}\n\n.stored-code-card[_ngcontent-%COMP%] {\n  background: #f4f9ff;\n}\n\n.processing-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  border: 1px solid #d6e2f2;\n  background: #f7fbff;\n  padding: 16px 12px;\n  display: grid;\n  justify-items: center;\n  gap: 8px;\n  text-align: center;\n}\n\n.processing-title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.95rem;\n  font-weight: 700;\n  color: #16365a;\n}\n\n.processing-subtitle[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #5a6f8b;\n  font-size: 0.88rem;\n}\n\n.paypal-card[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n}\n\n.paypal-loading[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  color: #16365a;\n  font-size: 0.88rem;\n  font-weight: 600;\n}\n\n.paypal-buttons[_ngcontent-%COMP%] {\n  min-height: 44px;\n}\n\n.success-card[_ngcontent-%COMP%] {\n  border-color: #c6e7cf;\n  background: #f5fcf6;\n}\n\n.summary-title[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  font-size: 0.95rem;\n  font-weight: 700;\n  color: #16365a;\n}\n\n.summary-line[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #2a3b55;\n  font-size: 0.9rem;\n  line-height: 1.4;\n}\n\n.status-line[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.status-chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  min-height: 24px;\n  padding: 2px 10px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  font-size: 0.78rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n}\n\n.status-chip-valid[_ngcontent-%COMP%] {\n  color: #0f6b3f;\n  background: #e8f7ef;\n  border-color: #b8e4cb;\n}\n\n.status-chip-expired[_ngcontent-%COMP%] {\n  color: #b42318;\n  background: #fff1f1;\n  border-color: #f5c2c2;\n}\n\n.status-chip-used[_ngcontent-%COMP%] {\n  color: #9a3412;\n  background: #fff4e5;\n  border-color: #fbd19a;\n}\n\n.status-chip-invalid[_ngcontent-%COMP%] {\n  color: #4b5565;\n  background: #edf1f6;\n  border-color: #d3dce8;\n}\n\n.summary-total[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  padding-top: 6px;\n  border-top: 1px dashed #b8cbdf;\n  font-size: 0.95rem;\n}\n\n.error-text[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #c62828;\n  font-size: 0.88rem;\n}\n\nmat-dialog-content[_ngcontent-%COMP%] {\n  margin: 0 !important;\n  padding: 8px 0 0 !important;\n  overflow: visible;\n}\n\nmat-dialog-actions[_ngcontent-%COMP%] {\n  margin: 0 !important;\n  padding: 10px 0 0 !important;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.btn-progress[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UnlockCodeDialogComponent, [{
        type: Component,
        args: [{ selector: 'app-unlock-code-dialog', standalone: true, imports: [
                    CommonModule,
                    ReactiveFormsModule,
                    MatDialogModule,
                    MatFormFieldModule,
                    MatInputModule,
                    MatButtonModule,
                    MatIconModule,
                    MatProgressSpinnerModule
                ], template: "<div class=\"unlock-dialog\">\n  <div class=\"dialog-top\">\n    <div class=\"dialog-icon\" aria-hidden=\"true\">\n      <mat-icon fontSet=\"material-icons-round\">vpn_key</mat-icon>\n    </div>\n    <div>\n      <h2 mat-dialog-title>{{ i18n.t('unlock.title') }}</h2>\n      <p class=\"dialog-subtitle\">{{ targetLabel }}</p>\n    </div>\n  </div>\n\n  <mat-dialog-content>\n    <div *ngIf=\"syncingAssociation && !processingPayment && !paymentCompleted\" class=\"processing-card\" aria-live=\"polite\">\n      <mat-spinner diameter=\"30\"></mat-spinner>\n      <p class=\"processing-title\">{{ i18n.t('unlock.checkingStoredCode') }}</p>\n    </div>\n\n    <div class=\"step-block\" *ngIf=\"step === 'choice' && !syncingAssociation && !processingPayment && !paymentCompleted\">\n      <div class=\"summary-card stored-code-card\" *ngIf=\"hasStoredCode\">\n        <p class=\"summary-title\">{{ i18n.t('unlock.storedCodeDetected') }}</p>\n        <p class=\"summary-line\">\n          <strong>{{ i18n.t('unlock.code') }}:</strong> <code>{{ storedCode }}</code>\n        </p>\n      </div>\n      <p class=\"error-text\" *ngIf=\"validationError\">{{ validationError }}</p>\n\n      <div class=\"choice-grid\">\n        <button\n          type=\"button\"\n          mat-flat-button\n          color=\"primary\"\n          class=\"choice-btn\"\n          *ngIf=\"hasStoredCode\"\n          (click)=\"useStoredCode()\"\n          [disabled]=\"validating\"\n        >\n          {{ i18n.t('unlock.useStoredCode') }}\n        </button>\n        <button type=\"button\" mat-stroked-button color=\"primary\" class=\"choice-btn\" (click)=\"chooseHasInviteCode()\">\n          {{ hasStoredCode ? i18n.t('unlock.enterNewCode') : i18n.t('unlock.haveInviteCode') }}\n        </button>\n        <button type=\"button\" mat-stroked-button color=\"primary\" class=\"choice-btn\" (click)=\"chooseNoInviteCode()\">\n          {{ i18n.t('unlock.noCodePaypal') }}\n        </button>\n      </div>\n    </div>\n\n    <div *ngIf=\"step === 'input' && !syncingAssociation && !processingPayment && !paymentCompleted\" class=\"step-block\">\n      <mat-form-field appearance=\"outline\" class=\"full-width\">\n        <mat-label>{{ i18n.t('unlock.inviteCode') }}</mat-label>\n        <input\n          matInput\n          [formControl]=\"codeControl\"\n          maxlength=\"6\"\n          autocomplete=\"off\"\n          autocapitalize=\"characters\"\n          spellcheck=\"false\"\n          (input)=\"normalizeCodeInput()\"\n          (keyup.enter)=\"validateCode()\"\n        />\n        <mat-hint>{{ i18n.t('unlock.codeHint') }}</mat-hint>\n        <mat-error *ngIf=\"codeControl.invalid && codeControl.touched\">{{ i18n.t('unlock.enterValidCode') }}</mat-error>\n      </mat-form-field>\n\n      <p class=\"error-text\" *ngIf=\"validationError\">{{ validationError }}</p>\n    </div>\n\n    <div *ngIf=\"step === 'summary' && !paymentCompleted\" class=\"step-block\">\n      <div class=\"summary-card\" *ngIf=\"appliedAssociation as association; else noCodeSummary\">\n        <p class=\"summary-title\">{{ i18n.t('unlock.discountCodeApplied') }}</p>\n        <p class=\"summary-line\">\n          <strong>{{ i18n.t('unlock.code') }}:</strong> <code>{{ appliedCode || association.inviteCode }}</code>\n        </p>\n        <p class=\"summary-line\"><strong>{{ i18n.t('unlock.structure') }}:</strong> {{ association.structureName }}</p>\n        <p class=\"summary-line\" *ngIf=\"association.appliesTo\">\n          <strong>{{ i18n.t('unlock.applicableTo') }}:</strong> {{ applicableToLabel(association.appliesTo) }}\n        </p>\n        <p class=\"summary-line\" *ngIf=\"associationCitiesLabel(association)\">\n          <strong>{{ i18n.t('unlock.city') }}:</strong> {{ associationCitiesLabel(association) }}\n        </p>\n        <p class=\"summary-line status-line\">\n          <strong>{{ i18n.t('unlock.codeStatus') }}:</strong>\n          <span\n            class=\"status-chip\"\n            [ngClass]=\"{\n              'status-chip-valid': association.codeStatus === 'valid',\n              'status-chip-used': association.codeStatus === 'used',\n              'status-chip-expired': association.codeStatus === 'expired',\n              'status-chip-invalid': association.codeStatus !== 'valid' && association.codeStatus !== 'expired' && association.codeStatus !== 'used'\n            }\"\n          >\n            {{ codeStatusLabel(association.codeStatus) }}\n          </span>\n        </p>\n        <p class=\"summary-line\" *ngIf=\"association.expiresAt\">\n          <strong>{{ i18n.t('unlock.expiry') }}:</strong> {{ formatDateTime(association.expiresAt) }}\n        </p>\n        <p class=\"summary-line\"><strong>{{ i18n.t('unlock.discount') }}:</strong> {{ discountPercent }}%</p>\n        <p class=\"summary-line\"><strong>{{ i18n.t('unlock.basePrice') }}:</strong> {{ formatAmount(baseAmount) }}</p>\n        <p class=\"summary-line\"><strong>{{ i18n.t('unlock.discountApplied') }}:</strong> -{{ formatAmount(discountAmount) }}</p>\n        <p class=\"summary-line summary-total\"><strong>{{ i18n.t('unlock.finalPrice') }}:</strong> {{ formatAmount(finalAmount) }}</p>\n      </div>\n\n      <ng-template #noCodeSummary>\n        <div class=\"summary-card\">\n          <p class=\"summary-title\">{{ i18n.t('unlock.paypalPayment') }}</p>\n          <p class=\"summary-line\">{{ i18n.t('unlock.noCodeSummary') }}</p>\n          <p class=\"summary-line\"><strong>{{ i18n.t('unlock.basePrice') }}:</strong> {{ formatAmount(baseAmount) }}</p>\n          <p class=\"summary-line\"><strong>{{ i18n.t('unlock.discountApplied') }}:</strong> -{{ formatAmount(0) }}</p>\n          <p class=\"summary-line summary-total\"><strong>{{ i18n.t('unlock.totalToPay') }}:</strong> {{ formatAmount(finalAmount) }}</p>\n        </div>\n      </ng-template>\n\n      <div class=\"summary-card paypal-card\">\n        <p class=\"summary-title\">{{ i18n.t('unlock.paymentMethod') }}</p>\n        <p class=\"summary-line\">{{ i18n.t('unlock.paymentNote') }}</p>\n\n        <div class=\"paypal-loading\" *ngIf=\"paypalLoading && !processingPayment\">\n          <mat-spinner diameter=\"24\"></mat-spinner>\n          <span>{{ i18n.t('unlock.paypalInit') }}</span>\n        </div>\n\n        <p class=\"error-text\" *ngIf=\"paymentError\">{{ paymentError }}</p>\n        <div #paypalButtonsContainer class=\"paypal-buttons\" *ngIf=\"!processingPayment && !paymentCompleted\"></div>\n      </div>\n    </div>\n\n    <div *ngIf=\"processingPayment\" class=\"processing-card\" aria-live=\"polite\">\n      <mat-spinner diameter=\"34\"></mat-spinner>\n      <p class=\"processing-title\">{{ i18n.t('unlock.processingPayment') }}</p>\n      <p class=\"processing-subtitle\">{{ i18n.t('unlock.processingSubtitle') }}</p>\n    </div>\n\n    <div *ngIf=\"paymentCompleted\" class=\"summary-card success-card\" aria-live=\"polite\">\n      <p class=\"summary-title\">{{ i18n.t('unlock.paymentConfirmed') }}</p>\n      <p class=\"summary-line\">{{ paymentResultMessage }}</p>\n      <p class=\"summary-line summary-total\"><strong>{{ i18n.t('unlock.totalPaid') }}:</strong> {{ formatAmount(finalAmount) }}</p>\n    </div>\n  </mat-dialog-content>\n\n  <mat-dialog-actions align=\"end\">\n    <button mat-button type=\"button\" (click)=\"close()\" *ngIf=\"!processingPayment && !paymentCompleted\">{{ i18n.t('common.cancel') }}</button>\n    <button mat-button type=\"button\" *ngIf=\"step === 'input'\" (click)=\"backToChoice()\">{{ i18n.t('common.back') }}</button>\n    <button\n      mat-flat-button\n      color=\"primary\"\n      type=\"button\"\n      *ngIf=\"step === 'input'\"\n      (click)=\"validateCode()\"\n      [disabled]=\"validating\"\n    >\n      <span *ngIf=\"!validating\">{{ i18n.t('unlock.verifyCode') }}</span>\n      <span class=\"btn-progress\" *ngIf=\"validating\">\n        <mat-spinner diameter=\"16\"></mat-spinner>\n        {{ i18n.t('unlock.checking') }}\n      </span>\n    </button>\n    <button\n      mat-stroked-button\n      color=\"primary\"\n      type=\"button\"\n      *ngIf=\"step === 'input' && !processingPayment && !paymentCompleted\"\n      (click)=\"proceedWithoutCode()\"\n      [disabled]=\"validating\"\n    >\n      {{ i18n.t('unlock.payWithoutCode') }}\n    </button>\n    <button\n      mat-stroked-button\n      color=\"primary\"\n      type=\"button\"\n      *ngIf=\"step === 'summary' && !processingPayment && !paymentCompleted && appliedAssociation\"\n      (click)=\"useDifferentCode()\"\n    >\n      {{ i18n.t('unlock.changeCode') }}\n    </button>\n    <button\n      mat-stroked-button\n      color=\"primary\"\n      type=\"button\"\n      *ngIf=\"step === 'summary' && !processingPayment && !paymentCompleted && !appliedAssociation\"\n      (click)=\"backToChoice()\"\n    >\n      {{ i18n.t('common.goBack') }}\n    </button>\n    <button mat-flat-button color=\"primary\" type=\"button\" *ngIf=\"paymentCompleted\" (click)=\"closeAfterPayment()\">\n      {{ i18n.t('common.ok') }}\n    </button>\n  </mat-dialog-actions>\n</div>\n", styles: [".unlock-dialog {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  overflow-x: hidden;\n  padding: 12px 12px 8px;\n}\n\n.dialog-top {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 10px;\n  padding-right: 2px;\n}\n\n.dialog-icon {\n  width: 38px;\n  height: 38px;\n  flex: 0 0 38px;\n  border-radius: 10px;\n  display: grid;\n  place-items: center;\n  color: #fff;\n  background: linear-gradient(145deg, #1769aa 0%, #2f86c8 100%);\n  box-shadow: 0 8px 14px rgba(23, 105, 170, 0.24);\n\n  mat-icon {\n    width: 20px;\n    height: 20px;\n    font-size: 20px;\n  }\n}\n\nh2[mat-dialog-title] {\n  margin: 0;\n  font-size: 1.08rem;\n  font-weight: 700;\n  color: #132844;\n}\n\n.dialog-subtitle {\n  margin: 4px 0 0;\n  color: #5a6f8b;\n  font-size: 0.9rem;\n}\n\n.choice-grid {\n  display: grid;\n  gap: 10px;\n}\n\n.choice-btn {\n  justify-content: flex-start;\n  min-height: 44px;\n}\n\n.step-block {\n  display: grid;\n  gap: 8px;\n}\n\n.full-width {\n  width: 100%;\n  margin-top: 4px;\n}\n\n.summary-card {\n  border-radius: 12px;\n  border: 1px solid #d6e2f2;\n  background: #f7fbff;\n  padding: 12px;\n}\n\n.stored-code-card {\n  background: #f4f9ff;\n}\n\n.processing-card {\n  border-radius: 12px;\n  border: 1px solid #d6e2f2;\n  background: #f7fbff;\n  padding: 16px 12px;\n  display: grid;\n  justify-items: center;\n  gap: 8px;\n  text-align: center;\n}\n\n.processing-title {\n  margin: 0;\n  font-size: 0.95rem;\n  font-weight: 700;\n  color: #16365a;\n}\n\n.processing-subtitle {\n  margin: 0;\n  color: #5a6f8b;\n  font-size: 0.88rem;\n}\n\n.paypal-card {\n  display: grid;\n  gap: 12px;\n}\n\n.paypal-loading {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  color: #16365a;\n  font-size: 0.88rem;\n  font-weight: 600;\n}\n\n.paypal-buttons {\n  min-height: 44px;\n}\n\n.success-card {\n  border-color: #c6e7cf;\n  background: #f5fcf6;\n}\n\n.summary-title {\n  margin: 0 0 8px;\n  font-size: 0.95rem;\n  font-weight: 700;\n  color: #16365a;\n}\n\n.summary-line {\n  margin: 0;\n  color: #2a3b55;\n  font-size: 0.9rem;\n  line-height: 1.4;\n}\n\n.status-line {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.status-chip {\n  display: inline-flex;\n  align-items: center;\n  min-height: 24px;\n  padding: 2px 10px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  font-size: 0.78rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n}\n\n.status-chip-valid {\n  color: #0f6b3f;\n  background: #e8f7ef;\n  border-color: #b8e4cb;\n}\n\n.status-chip-expired {\n  color: #b42318;\n  background: #fff1f1;\n  border-color: #f5c2c2;\n}\n\n.status-chip-used {\n  color: #9a3412;\n  background: #fff4e5;\n  border-color: #fbd19a;\n}\n\n.status-chip-invalid {\n  color: #4b5565;\n  background: #edf1f6;\n  border-color: #d3dce8;\n}\n\n.summary-total {\n  margin-top: 6px;\n  padding-top: 6px;\n  border-top: 1px dashed #b8cbdf;\n  font-size: 0.95rem;\n}\n\n.error-text {\n  margin: 0;\n  color: #c62828;\n  font-size: 0.88rem;\n}\n\nmat-dialog-content {\n  margin: 0 !important;\n  padding: 8px 0 0 !important;\n  overflow: visible;\n}\n\nmat-dialog-actions {\n  margin: 0 !important;\n  padding: 10px 0 0 !important;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.btn-progress {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n}\n"] }]
    }], () => [{ type: i1.MatDialogRef }, { type: i2.HttpClient }, { type: i3.PayPalCheckoutService }, { type: i4.AppStateService }, { type: i5.I18nService }, { type: undefined, decorators: [{
                type: Inject,
                args: [MAT_DIALOG_DATA]
            }] }], { paypalButtonsContainer: [{
            type: ViewChild,
            args: ['paypalButtonsContainer']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(UnlockCodeDialogComponent, { className: "UnlockCodeDialogComponent", filePath: "frontend/src/app/shared/components/unlock-code-dialog/unlock-code-dialog.component.ts", lineNumber: 90 }); })();
