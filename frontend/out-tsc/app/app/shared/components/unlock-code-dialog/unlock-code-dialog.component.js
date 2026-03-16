import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
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
import * as i3 from "../../../core/services/app-state.service";
import * as i4 from "@angular/common";
import * as i5 from "@angular/forms";
import * as i6 from "@angular/material/form-field";
import * as i7 from "@angular/material/input";
import * as i8 from "@angular/material/button";
import * as i9 from "@angular/material/icon";
import * as i10 from "@angular/material/progress-spinner";
const _c0 = (a0, a1, a2, a3) => ({ "status-chip-valid": a0, "status-chip-used": a1, "status-chip-expired": a2, "status-chip-invalid": a3 });
function UnlockCodeDialogComponent_div_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵelement(1, "mat-spinner", 16);
    i0.ɵɵelementStart(2, "p", 17);
    i0.ɵɵtext(3, "Controllo codice salvato...");
    i0.ɵɵelementEnd()();
} }
function UnlockCodeDialogComponent_div_12_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 24)(1, "p", 25);
    i0.ɵɵtext(2, "Codice salvato rilevato");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 26)(4, "strong");
    i0.ɵɵtext(5, "Codice:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "code");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.storedCode);
} }
function UnlockCodeDialogComponent_div_12_p_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.validationError);
} }
function UnlockCodeDialogComponent_div_12_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 28);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_div_12_button_4_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.useStoredCode()); });
    i0.ɵɵtext(1, " Utilizza codice salvato ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r1.validating);
} }
function UnlockCodeDialogComponent_div_12_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 18);
    i0.ɵɵtemplate(1, UnlockCodeDialogComponent_div_12_div_1_Template, 8, 1, "div", 19)(2, UnlockCodeDialogComponent_div_12_p_2_Template, 2, 1, "p", 20);
    i0.ɵɵelementStart(3, "div", 21);
    i0.ɵɵtemplate(4, UnlockCodeDialogComponent_div_12_button_4_Template, 2, 1, "button", 22);
    i0.ɵɵelementStart(5, "button", 23);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_div_12_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.chooseHasInviteCode()); });
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 23);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_div_12_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.chooseNoInviteCode()); });
    i0.ɵɵtext(8, " Procedi senza codice ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.hasStoredCode);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.validationError);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.hasStoredCode);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.hasStoredCode ? "Inserisci nuovo codice" : "Ho un codice invito", " ");
} }
function UnlockCodeDialogComponent_div_13_mat_error_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Inserisci un codice valido.");
    i0.ɵɵelementEnd();
} }
function UnlockCodeDialogComponent_div_13_p_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.validationError);
} }
function UnlockCodeDialogComponent_div_13_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 18)(1, "mat-form-field", 29)(2, "mat-label");
    i0.ɵɵtext(3, "Codice invito");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 30);
    i0.ɵɵlistener("input", function UnlockCodeDialogComponent_div_13_Template_input_input_4_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.normalizeCodeInput()); })("keyup.enter", function UnlockCodeDialogComponent_div_13_Template_input_keyup_enter_4_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.validateCode()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "mat-hint");
    i0.ɵɵtext(6, "6 caratteri alfanumerici");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, UnlockCodeDialogComponent_div_13_mat_error_7_Template, 2, 0, "mat-error", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, UnlockCodeDialogComponent_div_13_p_8_Template, 2, 1, "p", 20);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formControl", ctx_r1.codeControl);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.codeControl.invalid && ctx_r1.codeControl.touched);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.validationError);
} }
function UnlockCodeDialogComponent_div_14_div_1_p_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 26)(1, "strong");
    i0.ɵɵtext(2, "Applicabile a:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const association_r5 = i0.ɵɵnextContext().ngIf;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", association_r5.appliesTo === "bundle" ? "Pacchetto citta" : "Luogo singolo", " ");
} }
function UnlockCodeDialogComponent_div_14_div_1_p_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 26)(1, "strong");
    i0.ɵɵtext(2, "Citta:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const association_r5 = i0.ɵɵnextContext().ngIf;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.associationCitiesLabel(association_r5), " ");
} }
function UnlockCodeDialogComponent_div_14_div_1_p_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 26)(1, "strong");
    i0.ɵɵtext(2, "Scadenza:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const association_r5 = i0.ɵɵnextContext().ngIf;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind4(4, 1, association_r5.expiresAt, "dd/MM/yyyy HH:mm", "", "it-IT"), " ");
} }
function UnlockCodeDialogComponent_div_14_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 33)(1, "p", 25);
    i0.ɵɵtext(2, "Codice sconto applicato");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 26)(4, "strong");
    i0.ɵɵtext(5, "Codice:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "code");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "p", 26)(9, "strong");
    i0.ɵɵtext(10, "Struttura:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(12, UnlockCodeDialogComponent_div_14_div_1_p_12_Template, 4, 1, "p", 34)(13, UnlockCodeDialogComponent_div_14_div_1_p_13_Template, 4, 1, "p", 34);
    i0.ɵɵelementStart(14, "p", 35)(15, "strong");
    i0.ɵɵtext(16, "Stato codice:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "span", 36);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(19, UnlockCodeDialogComponent_div_14_div_1_p_19_Template, 5, 6, "p", 34);
    i0.ɵɵelementStart(20, "p", 26)(21, "strong");
    i0.ɵɵtext(22, "Sconto:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "p", 26)(25, "strong");
    i0.ɵɵtext(26, "Prezzo base:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "p", 26)(29, "strong");
    i0.ɵɵtext(30, "Sconto applicato:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "p", 37)(33, "strong");
    i0.ɵɵtext(34, "Prezzo finale:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(35);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const association_r5 = ctx.ngIf;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.appliedCode || association_r5.inviteCode);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", association_r5.structureName, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", association_r5.appliesTo);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.associationCitiesLabel(association_r5));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction4(11, _c0, association_r5.codeStatus === "valid", association_r5.codeStatus === "used", association_r5.codeStatus === "expired", association_r5.codeStatus !== "valid" && association_r5.codeStatus !== "expired" && association_r5.codeStatus !== "used"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", association_r5.codeStatus === "valid" ? "Valido" : association_r5.codeStatus === "used" ? "Gia usato" : association_r5.codeStatus === "expired" ? "Scaduto" : "Non valido", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", association_r5.expiresAt);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.discountPercent, "%");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.formatAmount(ctx_r1.baseAmount), "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" -", ctx_r1.formatAmount(ctx_r1.discountAmount), "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.formatAmount(ctx_r1.finalAmount), "");
} }
function UnlockCodeDialogComponent_div_14_p_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.paymentError);
} }
function UnlockCodeDialogComponent_div_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18);
    i0.ɵɵtemplate(1, UnlockCodeDialogComponent_div_14_div_1_Template, 36, 16, "div", 32)(2, UnlockCodeDialogComponent_div_14_p_2_Template, 2, 1, "p", 20);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.appliedAssociation);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.paymentError);
} }
function UnlockCodeDialogComponent_div_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵelement(1, "mat-spinner", 38);
    i0.ɵɵelementStart(2, "p", 17);
    i0.ɵɵtext(3, "Pagamento in corso...");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 39);
    i0.ɵɵtext(5, "Attendi qualche secondo, stiamo confermando la transazione.");
    i0.ɵɵelementEnd()();
} }
function UnlockCodeDialogComponent_div_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 40)(1, "p", 25);
    i0.ɵɵtext(2, "Pagamento confermato");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 26);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 37)(6, "strong");
    i0.ɵɵtext(7, "Totale pagato:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.paymentResultMessage);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.formatAmount(ctx_r1.finalAmount), "");
} }
function UnlockCodeDialogComponent_button_18_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 41);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_18_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.close()); });
    i0.ɵɵtext(1, "Annulla");
    i0.ɵɵelementEnd();
} }
function UnlockCodeDialogComponent_button_19_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 41);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_19_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.backToChoice()); });
    i0.ɵɵtext(1, "Indietro");
    i0.ɵɵelementEnd();
} }
function UnlockCodeDialogComponent_button_20_span_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "Verifica codice");
    i0.ɵɵelementEnd();
} }
function UnlockCodeDialogComponent_button_20_span_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 44);
    i0.ɵɵelement(1, "mat-spinner", 45);
    i0.ɵɵtext(2, " Controllo... ");
    i0.ɵɵelementEnd();
} }
function UnlockCodeDialogComponent_button_20_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 42);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_20_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.validateCode()); });
    i0.ɵɵtemplate(1, UnlockCodeDialogComponent_button_20_span_1_Template, 2, 0, "span", 31)(2, UnlockCodeDialogComponent_button_20_span_2_Template, 3, 0, "span", 43);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r1.validating);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.validating);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.validating);
} }
function UnlockCodeDialogComponent_button_21_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 46);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_21_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.proceedWithoutCode()); });
    i0.ɵɵtext(1, " Procedi senza codice ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r1.validating);
} }
function UnlockCodeDialogComponent_button_22_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 47);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_22_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.useDifferentCode()); });
    i0.ɵɵtext(1, " Cambia codice ");
    i0.ɵɵelementEnd();
} }
function UnlockCodeDialogComponent_button_23_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 42);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_23_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.proceedWithPayment()); });
    i0.ɵɵtext(1, " Procedi con il pagamento ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", !ctx_r1.canProceed);
} }
function UnlockCodeDialogComponent_button_24_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 47);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_24_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.proceedWithoutCode()); });
    i0.ɵɵtext(1, " Procedi senza codice ");
    i0.ɵɵelementEnd();
} }
function UnlockCodeDialogComponent_button_25_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 48);
    i0.ɵɵlistener("click", function UnlockCodeDialogComponent_button_25_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeAfterPayment()); });
    i0.ɵɵtext(1, "OK");
    i0.ɵɵelementEnd();
} }
export class UnlockCodeDialogComponent {
    constructor(dialogRef, http, appState, data) {
        this.dialogRef = dialogRef;
        this.http = http;
        this.appState = appState;
        this.data = data;
        this.codeControl = new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[A-Z0-9]{6}$/)]
        });
        this.amountFormatter = new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        this.step = 'choice';
        this.syncingAssociation = false;
        this.validating = false;
        this.validationError = '';
        this.processingPayment = false;
        this.paymentCompleted = false;
        this.paymentError = '';
        this.appliedAssociation = null;
        this.appliedCode = '';
        this.completedPurchase = null;
        this.storedCode = '';
        this.hasStoredCode = false;
        this.storedCode = this.resolveStoredCode();
        this.hasStoredCode = this.storedCode.length === 6;
        // Keep manual input empty by default to avoid stale prefill.
        this.codeControl.setValue('');
        this.appliedCode = '';
        this.appliedAssociation = null;
        this.step = 'choice';
        if (this.hasStoredCode) {
            this.syncingAssociation = true;
            this.validateCodeByValue(this.storedCode, { fromStoredCode: true, preserveStepOnError: 'choice' });
        }
    }
    get targetLabel() {
        return this.data?.target?.label || (this.data?.target?.type === 'bundle' ? 'citta' : 'luogo');
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
    get canProceed() {
        return (Boolean(this.appliedAssociation?.structureId) &&
            this.isAssociationValid(this.appliedAssociation) &&
            this.isAssociationApplicableToTarget(this.appliedAssociation) &&
            !this.syncingAssociation &&
            !this.processingPayment &&
            !this.paymentCompleted);
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
        this.step = 'input';
    }
    chooseNoInviteCode() {
        this.proceedWithoutCode();
    }
    useStoredCode() {
        if (!this.hasStoredCode || this.validating || this.syncingAssociation) {
            return;
        }
        this.validationError = '';
        this.validateCodeByValue(this.storedCode, { fromStoredCode: true, preserveStepOnError: 'choice' });
    }
    backToChoice() {
        if (this.appliedAssociation) {
            this.step = 'summary';
            return;
        }
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
        this.step = 'input';
        this.validationError = '';
    }
    proceedWithoutCode() {
        if (this.processingPayment || this.paymentCompleted) {
            return;
        }
        this.appliedAssociation = null;
        this.appliedCode = '';
        this.validationError = '';
        this.proceedWithPayment({ withoutCode: true });
    }
    proceedWithPayment(options = {}) {
        const withoutCode = Boolean(options.withoutCode);
        if (!withoutCode && !this.appliedAssociation?.structureId) {
            return;
        }
        if (this.processingPayment || this.paymentCompleted) {
            return;
        }
        this.processingPayment = true;
        this.paymentError = '';
        if (this.data.target.type === 'single' && !this.data.target.poiId) {
            this.processingPayment = false;
            this.paymentError = 'Punto di interesse non valido per il pagamento.';
            return;
        }
        const payload = this.data.target.type === 'bundle'
            ? {
                userId: this.data.userId,
                type: 'bundle',
                cityId: this.data.target.cityId,
                ignoreDiscountCode: withoutCode
            }
            : {
                userId: this.data.userId,
                type: 'single',
                poiId: this.data.target.poiId || '',
                ignoreDiscountCode: withoutCode
            };
        const startedAt = Date.now();
        this.http.post(`${environment.apiBaseUrl}/purchase`, payload).subscribe({
            next: (response) => {
                const delay = Math.max(0, 900 - (Date.now() - startedAt));
                setTimeout(() => {
                    this.processingPayment = false;
                    this.paymentCompleted = true;
                    this.completedPurchase = response;
                }, delay);
            },
            error: (error) => {
                const delay = Math.max(0, 900 - (Date.now() - startedAt));
                setTimeout(() => {
                    this.processingPayment = false;
                    this.paymentError = error?.error?.message || 'Pagamento non riuscito. Riprova.';
                }, delay);
            }
        });
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
            return 'Pagamento completato.';
        }
        if (this.completedPurchase.alreadyPurchased) {
            return 'Contenuto già acquistato in precedenza.';
        }
        return 'Pagamento completato con successo.';
    }
    formatAmount(value) {
        return this.amountFormatter.format(this.roundMoney(value));
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
                    this.step = options.preserveStepOnError;
                    this.validationError = response.message || this.fallbackValidationError(options.fromStoredCode);
                    return;
                }
                const normalizedAssociation = this.normalizeAssociationStatus(response.association);
                if (!this.isAssociationValid(normalizedAssociation)) {
                    this.appliedAssociation = null;
                    this.appliedCode = '';
                    this.step = options.preserveStepOnError;
                    this.validationError = this.getInvalidCodeMessage(normalizedAssociation.codeStatus, options.fromStoredCode);
                    return;
                }
                if (!this.isAssociationApplicableToTarget(normalizedAssociation)) {
                    this.appliedAssociation = null;
                    this.appliedCode = '';
                    this.step = options.preserveStepOnError;
                    this.validationError = options.fromStoredCode
                        ? `${this.getInvalidTargetMessage(normalizedAssociation)} Puoi proseguire senza codice oppure inserirne uno nuovo.`
                        : this.getInvalidTargetMessage(normalizedAssociation);
                    return;
                }
                this.appliedCode = code;
                this.appliedAssociation = normalizedAssociation;
                this.appState.setHotelCode(code);
                this.appState.setHotelAssociation(this.appliedAssociation);
                this.step = 'summary';
            },
            error: (error) => {
                this.validating = false;
                this.syncingAssociation = false;
                this.appliedAssociation = null;
                this.appliedCode = '';
                this.step = options.preserveStepOnError;
                const status = error?.error?.codeStatus;
                const backendMessage = String(error?.error?.message || '').trim();
                if (options.fromStoredCode && backendMessage === 'Il codice non e applicabile a questo acquisto') {
                    this.validationError = `${this.getStoredCodeApplicabilityMessage()} Puoi proseguire senza codice oppure inserirne uno nuovo.`;
                    return;
                }
                if (status === 'expired' || status === 'used' || status === 'invalid') {
                    this.validationError = this.getInvalidCodeMessage(status, options.fromStoredCode);
                    return;
                }
                if (options.fromStoredCode && backendMessage) {
                    this.validationError =
                        backendMessage === 'Il codice non e applicabile a questo acquisto'
                            ? 'Il codice salvato non e applicabile a questo acquisto. Puoi proseguire senza codice oppure inserirne uno nuovo.'
                            : backendMessage;
                    return;
                }
                this.validationError = backendMessage || this.fallbackValidationError(options.fromStoredCode);
            }
        });
    }
    fallbackValidationError(fromStoredCode) {
        return fromStoredCode ? 'Il codice salvato non e valido per questo acquisto.' : 'Codice invito non valido';
    }
    getStoredCodeApplicabilityMessage() {
        const appliesTo = this.data?.existingAssociation?.appliesTo;
        if (appliesTo === 'bundle' && this.data.target.type === 'single') {
            return 'Il codice salvato e applicabile per pacchetto citta, non per luogo singolo.';
        }
        if (appliesTo === 'single' && this.data.target.type === 'bundle') {
            return 'Il codice salvato e applicabile per luogo singolo, non per pacchetto citta.';
        }
        if (appliesTo === 'bundle') {
            return 'Il codice salvato e applicabile solo per pacchetto citta.';
        }
        if (appliesTo === 'single') {
            return 'Il codice salvato e applicabile solo per luogo singolo.';
        }
        return 'Il codice salvato non e applicabile a questo acquisto.';
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
        const targetLabel = this.data.target.type === 'bundle' ? 'pacchetto citta' : 'luogo singolo';
        const appliesTo = association.appliesTo;
        if (appliesTo === 'single' || appliesTo === 'bundle') {
            const codeLabel = appliesTo === 'bundle' ? 'pacchetto citta' : 'luogo singolo';
            if (appliesTo !== this.data.target.type) {
                return `Questo codice e valido solo per ${codeLabel}, non per ${targetLabel}.`;
            }
        }
        const cityNames = this.associationCityNames(association);
        if (cityNames.length) {
            return `Questo codice e valido solo per le citta: ${cityNames.join(', ')}.`;
        }
        if (association.cityName) {
            return `Questo codice e valido solo per la citta ${association.cityName}.`;
        }
        return 'Questo codice non e applicabile a questo acquisto.';
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
            return fromStoredCode ? 'Il codice salvato e scaduto. Inserisci un nuovo codice.' : 'Il codice inserito e scaduto';
        }
        if (status === 'used') {
            return fromStoredCode
                ? 'Il codice salvato è già stato utilizzato. Inserisci un nuovo codice.'
                : 'Il codice inserito è già stato utilizzato per questo utente';
        }
        return fromStoredCode
            ? 'Il codice salvato non è più valido. Inserisci un nuovo codice.'
            : 'Il codice inserito non è più valido';
    }
    static { this.ɵfac = function UnlockCodeDialogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || UnlockCodeDialogComponent)(i0.ɵɵdirectiveInject(i1.MatDialogRef), i0.ɵɵdirectiveInject(i2.HttpClient), i0.ɵɵdirectiveInject(i3.AppStateService), i0.ɵɵdirectiveInject(MAT_DIALOG_DATA)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: UnlockCodeDialogComponent, selectors: [["app-unlock-code-dialog"]], decls: 26, vars: 15, consts: [[1, "unlock-dialog"], [1, "dialog-top"], ["aria-hidden", "true", 1, "dialog-icon"], ["fontSet", "material-icons-round"], ["mat-dialog-title", ""], [1, "dialog-subtitle"], ["class", "processing-card", "aria-live", "polite", 4, "ngIf"], ["class", "step-block", 4, "ngIf"], ["class", "summary-card success-card", "aria-live", "polite", 4, "ngIf"], ["align", "end"], ["mat-button", "", "type", "button", 3, "click", 4, "ngIf"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "disabled", "click", 4, "ngIf"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "disabled", "click", 4, "ngIf"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click", 4, "ngIf"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "click", 4, "ngIf"], ["aria-live", "polite", 1, "processing-card"], ["diameter", "30"], [1, "processing-title"], [1, "step-block"], ["class", "summary-card stored-code-card", 4, "ngIf"], ["class", "error-text", 4, "ngIf"], [1, "choice-grid"], ["type", "button", "mat-flat-button", "", "color", "primary", "class", "choice-btn", 3, "disabled", "click", 4, "ngIf"], ["type", "button", "mat-stroked-button", "", "color", "primary", 1, "choice-btn", 3, "click"], [1, "summary-card", "stored-code-card"], [1, "summary-title"], [1, "summary-line"], [1, "error-text"], ["type", "button", "mat-flat-button", "", "color", "primary", 1, "choice-btn", 3, "click", "disabled"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "maxlength", "6", "autocomplete", "off", "autocapitalize", "characters", "spellcheck", "false", 3, "input", "keyup.enter", "formControl"], [4, "ngIf"], ["class", "summary-card", 4, "ngIf"], [1, "summary-card"], ["class", "summary-line", 4, "ngIf"], [1, "summary-line", "status-line"], [1, "status-chip", 3, "ngClass"], [1, "summary-line", "summary-total"], ["diameter", "34"], [1, "processing-subtitle"], ["aria-live", "polite", 1, "summary-card", "success-card"], ["mat-button", "", "type", "button", 3, "click"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "click", "disabled"], ["class", "btn-progress", 4, "ngIf"], [1, "btn-progress"], ["diameter", "16"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click", "disabled"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "click"]], template: function UnlockCodeDialogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "mat-icon", 3);
            i0.ɵɵtext(4, "vpn_key");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(5, "div")(6, "h2", 4);
            i0.ɵɵtext(7, "Sblocco contenuto");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 5);
            i0.ɵɵtext(9);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(10, "mat-dialog-content");
            i0.ɵɵtemplate(11, UnlockCodeDialogComponent_div_11_Template, 4, 0, "div", 6)(12, UnlockCodeDialogComponent_div_12_Template, 9, 4, "div", 7)(13, UnlockCodeDialogComponent_div_13_Template, 9, 3, "div", 7)(14, UnlockCodeDialogComponent_div_14_Template, 3, 2, "div", 7)(15, UnlockCodeDialogComponent_div_15_Template, 6, 0, "div", 6)(16, UnlockCodeDialogComponent_div_16_Template, 9, 2, "div", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "mat-dialog-actions", 9);
            i0.ɵɵtemplate(18, UnlockCodeDialogComponent_button_18_Template, 2, 0, "button", 10)(19, UnlockCodeDialogComponent_button_19_Template, 2, 0, "button", 10)(20, UnlockCodeDialogComponent_button_20_Template, 3, 3, "button", 11)(21, UnlockCodeDialogComponent_button_21_Template, 2, 1, "button", 12)(22, UnlockCodeDialogComponent_button_22_Template, 2, 0, "button", 13)(23, UnlockCodeDialogComponent_button_23_Template, 2, 1, "button", 11)(24, UnlockCodeDialogComponent_button_24_Template, 2, 0, "button", 13)(25, UnlockCodeDialogComponent_button_25_Template, 2, 0, "button", 14);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate(ctx.targetLabel);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.syncingAssociation && !ctx.processingPayment && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "choice" && !ctx.syncingAssociation && !ctx.processingPayment && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "input" && !ctx.syncingAssociation && !ctx.processingPayment && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "summary" && !ctx.syncingAssociation && !ctx.processingPayment && !ctx.paymentCompleted);
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
            i0.ɵɵproperty("ngIf", ctx.step === "summary" && !ctx.processingPayment && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "summary" && !ctx.processingPayment && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step === "summary" && !ctx.processingPayment && !ctx.paymentCompleted);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.paymentCompleted);
        } }, dependencies: [CommonModule, i4.NgClass, i4.NgIf, i4.DatePipe, ReactiveFormsModule, i5.DefaultValueAccessor, i5.NgControlStatus, i5.MaxLengthValidator, i5.FormControlDirective, MatDialogModule, i1.MatDialogTitle, i1.MatDialogActions, i1.MatDialogContent, MatFormFieldModule, i6.MatFormField, i6.MatLabel, i6.MatHint, i6.MatError, MatInputModule, i7.MatInput, MatButtonModule, i8.MatButton, MatIconModule, i9.MatIcon, MatProgressSpinnerModule, i10.MatProgressSpinner], styles: [".unlock-dialog[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  overflow-x: hidden;\n  padding: 12px 12px 8px;\n}\n\n.dialog-top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 10px;\n  padding-right: 2px;\n}\n\n.dialog-icon[_ngcontent-%COMP%] {\n  width: 38px;\n  height: 38px;\n  flex: 0 0 38px;\n  border-radius: 10px;\n  display: grid;\n  place-items: center;\n  color: #fff;\n  background: linear-gradient(145deg, #1769aa 0%, #2f86c8 100%);\n  box-shadow: 0 8px 14px rgba(23, 105, 170, 0.24);\n\n  mat-icon {\n    width: 20px;\n    height: 20px;\n    font-size: 20px;\n  }\n}\n\nh2[mat-dialog-title][_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.08rem;\n  font-weight: 700;\n  color: #132844;\n}\n\n.dialog-subtitle[_ngcontent-%COMP%] {\n  margin: 4px 0 0;\n  color: #5a6f8b;\n  font-size: 0.9rem;\n}\n\n.choice-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n}\n\n.choice-btn[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  min-height: 44px;\n}\n\n.step-block[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n}\n\n.full-width[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 4px;\n}\n\n.summary-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  border: 1px solid #d6e2f2;\n  background: #f7fbff;\n  padding: 12px;\n}\n\n.stored-code-card[_ngcontent-%COMP%] {\n  background: #f4f9ff;\n}\n\n.processing-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  border: 1px solid #d6e2f2;\n  background: #f7fbff;\n  padding: 16px 12px;\n  display: grid;\n  justify-items: center;\n  gap: 8px;\n  text-align: center;\n}\n\n.processing-title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.95rem;\n  font-weight: 700;\n  color: #16365a;\n}\n\n.processing-subtitle[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #5a6f8b;\n  font-size: 0.88rem;\n}\n\n.success-card[_ngcontent-%COMP%] {\n  border-color: #c6e7cf;\n  background: #f5fcf6;\n}\n\n.summary-title[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  font-size: 0.95rem;\n  font-weight: 700;\n  color: #16365a;\n}\n\n.summary-line[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #2a3b55;\n  font-size: 0.9rem;\n  line-height: 1.4;\n}\n\n.status-line[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.status-chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  min-height: 24px;\n  padding: 2px 10px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  font-size: 0.78rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n}\n\n.status-chip-valid[_ngcontent-%COMP%] {\n  color: #0f6b3f;\n  background: #e8f7ef;\n  border-color: #b8e4cb;\n}\n\n.status-chip-expired[_ngcontent-%COMP%] {\n  color: #b42318;\n  background: #fff1f1;\n  border-color: #f5c2c2;\n}\n\n.status-chip-used[_ngcontent-%COMP%] {\n  color: #9a3412;\n  background: #fff4e5;\n  border-color: #fbd19a;\n}\n\n.status-chip-invalid[_ngcontent-%COMP%] {\n  color: #4b5565;\n  background: #edf1f6;\n  border-color: #d3dce8;\n}\n\n.summary-total[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  padding-top: 6px;\n  border-top: 1px dashed #b8cbdf;\n  font-size: 0.95rem;\n}\n\n.error-text[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #c62828;\n  font-size: 0.88rem;\n}\n\nmat-dialog-content[_ngcontent-%COMP%] {\n  margin: 0 !important;\n  padding: 8px 0 0 !important;\n  overflow: visible;\n}\n\nmat-dialog-actions[_ngcontent-%COMP%] {\n  margin: 0 !important;\n  padding: 10px 0 0 !important;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.btn-progress[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n}"] }); }
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
                ], template: "<div class=\"unlock-dialog\">\n  <div class=\"dialog-top\">\n    <div class=\"dialog-icon\" aria-hidden=\"true\">\n      <mat-icon fontSet=\"material-icons-round\">vpn_key</mat-icon>\n    </div>\n    <div>\n      <h2 mat-dialog-title>Sblocco contenuto</h2>\n      <p class=\"dialog-subtitle\">{{ targetLabel }}</p>\n    </div>\n  </div>\n\n  <mat-dialog-content>\n    <div *ngIf=\"syncingAssociation && !processingPayment && !paymentCompleted\" class=\"processing-card\" aria-live=\"polite\">\n      <mat-spinner diameter=\"30\"></mat-spinner>\n      <p class=\"processing-title\">Controllo codice salvato...</p>\n    </div>\n\n    <div class=\"step-block\" *ngIf=\"step === 'choice' && !syncingAssociation && !processingPayment && !paymentCompleted\">\n      <div class=\"summary-card stored-code-card\" *ngIf=\"hasStoredCode\">\n        <p class=\"summary-title\">Codice salvato rilevato</p>\n        <p class=\"summary-line\">\n          <strong>Codice:</strong> <code>{{ storedCode }}</code>\n        </p>\n      </div>\n      <p class=\"error-text\" *ngIf=\"validationError\">{{ validationError }}</p>\n\n      <div class=\"choice-grid\">\n        <button\n          type=\"button\"\n          mat-flat-button\n          color=\"primary\"\n          class=\"choice-btn\"\n          *ngIf=\"hasStoredCode\"\n          (click)=\"useStoredCode()\"\n          [disabled]=\"validating\"\n        >\n          Utilizza codice salvato\n        </button>\n        <button type=\"button\" mat-stroked-button color=\"primary\" class=\"choice-btn\" (click)=\"chooseHasInviteCode()\">\n          {{ hasStoredCode ? 'Inserisci nuovo codice' : 'Ho un codice invito' }}\n        </button>\n        <button type=\"button\" mat-stroked-button color=\"primary\" class=\"choice-btn\" (click)=\"chooseNoInviteCode()\">\n          Procedi senza codice\n        </button>\n      </div>\n    </div>\n\n    <div *ngIf=\"step === 'input' && !syncingAssociation && !processingPayment && !paymentCompleted\" class=\"step-block\">\n      <mat-form-field appearance=\"outline\" class=\"full-width\">\n        <mat-label>Codice invito</mat-label>\n        <input\n          matInput\n          [formControl]=\"codeControl\"\n          maxlength=\"6\"\n          autocomplete=\"off\"\n          autocapitalize=\"characters\"\n          spellcheck=\"false\"\n          (input)=\"normalizeCodeInput()\"\n          (keyup.enter)=\"validateCode()\"\n        />\n        <mat-hint>6 caratteri alfanumerici</mat-hint>\n        <mat-error *ngIf=\"codeControl.invalid && codeControl.touched\">Inserisci un codice valido.</mat-error>\n      </mat-form-field>\n\n      <p class=\"error-text\" *ngIf=\"validationError\">{{ validationError }}</p>\n    </div>\n\n    <div *ngIf=\"step === 'summary' && !syncingAssociation && !processingPayment && !paymentCompleted\" class=\"step-block\">\n      <div class=\"summary-card\" *ngIf=\"appliedAssociation as association\">\n        <p class=\"summary-title\">Codice sconto applicato</p>\n        <p class=\"summary-line\">\n          <strong>Codice:</strong> <code>{{ appliedCode || association.inviteCode }}</code>\n        </p>\n        <p class=\"summary-line\"><strong>Struttura:</strong> {{ association.structureName }}</p>\n        <p class=\"summary-line\" *ngIf=\"association.appliesTo\">\n          <strong>Applicabile a:</strong> {{ association.appliesTo === 'bundle' ? 'Pacchetto citta' : 'Luogo singolo' }}\n        </p>\n        <p class=\"summary-line\" *ngIf=\"associationCitiesLabel(association)\">\n          <strong>Citta:</strong> {{ associationCitiesLabel(association) }}\n        </p>\n        <p class=\"summary-line status-line\">\n          <strong>Stato codice:</strong>\n          <span\n            class=\"status-chip\"\n            [ngClass]=\"{\n              'status-chip-valid': association.codeStatus === 'valid',\n              'status-chip-used': association.codeStatus === 'used',\n              'status-chip-expired': association.codeStatus === 'expired',\n              'status-chip-invalid': association.codeStatus !== 'valid' && association.codeStatus !== 'expired' && association.codeStatus !== 'used'\n            }\"\n          >\n            {{\n              association.codeStatus === 'valid'\n                ? 'Valido'\n                : association.codeStatus === 'used'\n                  ? 'Gia usato'\n                : association.codeStatus === 'expired'\n                  ? 'Scaduto'\n                  : 'Non valido'\n            }}\n          </span>\n        </p>\n        <p class=\"summary-line\" *ngIf=\"association.expiresAt\">\n          <strong>Scadenza:</strong> {{ association.expiresAt | date: 'dd/MM/yyyy HH:mm':'':'it-IT' }}\n        </p>\n        <p class=\"summary-line\"><strong>Sconto:</strong> {{ discountPercent }}%</p>\n        <p class=\"summary-line\"><strong>Prezzo base:</strong> {{ formatAmount(baseAmount) }}</p>\n        <p class=\"summary-line\"><strong>Sconto applicato:</strong> -{{ formatAmount(discountAmount) }}</p>\n        <p class=\"summary-line summary-total\"><strong>Prezzo finale:</strong> {{ formatAmount(finalAmount) }}</p>\n      </div>\n      <p class=\"error-text\" *ngIf=\"paymentError\">{{ paymentError }}</p>\n    </div>\n\n    <div *ngIf=\"processingPayment\" class=\"processing-card\" aria-live=\"polite\">\n      <mat-spinner diameter=\"34\"></mat-spinner>\n      <p class=\"processing-title\">Pagamento in corso...</p>\n      <p class=\"processing-subtitle\">Attendi qualche secondo, stiamo confermando la transazione.</p>\n    </div>\n\n    <div *ngIf=\"paymentCompleted\" class=\"summary-card success-card\" aria-live=\"polite\">\n      <p class=\"summary-title\">Pagamento confermato</p>\n      <p class=\"summary-line\">{{ paymentResultMessage }}</p>\n      <p class=\"summary-line summary-total\"><strong>Totale pagato:</strong> {{ formatAmount(finalAmount) }}</p>\n    </div>\n  </mat-dialog-content>\n\n  <mat-dialog-actions align=\"end\">\n    <button mat-button type=\"button\" (click)=\"close()\" *ngIf=\"!processingPayment && !paymentCompleted\">Annulla</button>\n    <button mat-button type=\"button\" *ngIf=\"step === 'input'\" (click)=\"backToChoice()\">Indietro</button>\n    <button\n      mat-flat-button\n      color=\"primary\"\n      type=\"button\"\n      *ngIf=\"step === 'input'\"\n      (click)=\"validateCode()\"\n      [disabled]=\"validating\"\n    >\n      <span *ngIf=\"!validating\">Verifica codice</span>\n      <span class=\"btn-progress\" *ngIf=\"validating\">\n        <mat-spinner diameter=\"16\"></mat-spinner>\n        Controllo...\n      </span>\n    </button>\n    <button\n      mat-stroked-button\n      color=\"primary\"\n      type=\"button\"\n      *ngIf=\"step === 'input' && !processingPayment && !paymentCompleted\"\n      (click)=\"proceedWithoutCode()\"\n      [disabled]=\"validating\"\n    >\n      Procedi senza codice\n    </button>\n    <button\n      mat-stroked-button\n      color=\"primary\"\n      type=\"button\"\n      *ngIf=\"step === 'summary' && !processingPayment && !paymentCompleted\"\n      (click)=\"useDifferentCode()\"\n    >\n      Cambia codice\n    </button>\n    <button\n      mat-flat-button\n      color=\"primary\"\n      type=\"button\"\n      *ngIf=\"step === 'summary' && !processingPayment && !paymentCompleted\"\n      (click)=\"proceedWithPayment()\"\n      [disabled]=\"!canProceed\"\n    >\n      Procedi con il pagamento\n    </button>\n    <button\n      mat-stroked-button\n      color=\"primary\"\n      type=\"button\"\n      *ngIf=\"step === 'summary' && !processingPayment && !paymentCompleted\"\n      (click)=\"proceedWithoutCode()\"\n    >\n      Procedi senza codice\n    </button>\n    <button mat-flat-button color=\"primary\" type=\"button\" *ngIf=\"paymentCompleted\" (click)=\"closeAfterPayment()\">OK</button>\n  </mat-dialog-actions>\n</div>\n", styles: [".unlock-dialog {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  overflow-x: hidden;\n  padding: 12px 12px 8px;\n}\n\n.dialog-top {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 10px;\n  padding-right: 2px;\n}\n\n.dialog-icon {\n  width: 38px;\n  height: 38px;\n  flex: 0 0 38px;\n  border-radius: 10px;\n  display: grid;\n  place-items: center;\n  color: #fff;\n  background: linear-gradient(145deg, #1769aa 0%, #2f86c8 100%);\n  box-shadow: 0 8px 14px rgba(23, 105, 170, 0.24);\n\n  mat-icon {\n    width: 20px;\n    height: 20px;\n    font-size: 20px;\n  }\n}\n\nh2[mat-dialog-title] {\n  margin: 0;\n  font-size: 1.08rem;\n  font-weight: 700;\n  color: #132844;\n}\n\n.dialog-subtitle {\n  margin: 4px 0 0;\n  color: #5a6f8b;\n  font-size: 0.9rem;\n}\n\n.choice-grid {\n  display: grid;\n  gap: 10px;\n}\n\n.choice-btn {\n  justify-content: flex-start;\n  min-height: 44px;\n}\n\n.step-block {\n  display: grid;\n  gap: 8px;\n}\n\n.full-width {\n  width: 100%;\n  margin-top: 4px;\n}\n\n.summary-card {\n  border-radius: 12px;\n  border: 1px solid #d6e2f2;\n  background: #f7fbff;\n  padding: 12px;\n}\n\n.stored-code-card {\n  background: #f4f9ff;\n}\n\n.processing-card {\n  border-radius: 12px;\n  border: 1px solid #d6e2f2;\n  background: #f7fbff;\n  padding: 16px 12px;\n  display: grid;\n  justify-items: center;\n  gap: 8px;\n  text-align: center;\n}\n\n.processing-title {\n  margin: 0;\n  font-size: 0.95rem;\n  font-weight: 700;\n  color: #16365a;\n}\n\n.processing-subtitle {\n  margin: 0;\n  color: #5a6f8b;\n  font-size: 0.88rem;\n}\n\n.success-card {\n  border-color: #c6e7cf;\n  background: #f5fcf6;\n}\n\n.summary-title {\n  margin: 0 0 8px;\n  font-size: 0.95rem;\n  font-weight: 700;\n  color: #16365a;\n}\n\n.summary-line {\n  margin: 0;\n  color: #2a3b55;\n  font-size: 0.9rem;\n  line-height: 1.4;\n}\n\n.status-line {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.status-chip {\n  display: inline-flex;\n  align-items: center;\n  min-height: 24px;\n  padding: 2px 10px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  font-size: 0.78rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n}\n\n.status-chip-valid {\n  color: #0f6b3f;\n  background: #e8f7ef;\n  border-color: #b8e4cb;\n}\n\n.status-chip-expired {\n  color: #b42318;\n  background: #fff1f1;\n  border-color: #f5c2c2;\n}\n\n.status-chip-used {\n  color: #9a3412;\n  background: #fff4e5;\n  border-color: #fbd19a;\n}\n\n.status-chip-invalid {\n  color: #4b5565;\n  background: #edf1f6;\n  border-color: #d3dce8;\n}\n\n.summary-total {\n  margin-top: 6px;\n  padding-top: 6px;\n  border-top: 1px dashed #b8cbdf;\n  font-size: 0.95rem;\n}\n\n.error-text {\n  margin: 0;\n  color: #c62828;\n  font-size: 0.88rem;\n}\n\nmat-dialog-content {\n  margin: 0 !important;\n  padding: 8px 0 0 !important;\n  overflow: visible;\n}\n\nmat-dialog-actions {\n  margin: 0 !important;\n  padding: 10px 0 0 !important;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.btn-progress {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n}\n"] }]
    }], () => [{ type: i1.MatDialogRef }, { type: i2.HttpClient }, { type: i3.AppStateService }, { type: undefined, decorators: [{
                type: Inject,
                args: [MAT_DIALOG_DATA]
            }] }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(UnlockCodeDialogComponent, { className: "UnlockCodeDialogComponent", filePath: "src/app/shared/components/unlock-code-dialog/unlock-code-dialog.component.ts", lineNumber: 88 }); })();
