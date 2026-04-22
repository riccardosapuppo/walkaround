import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../core/services/partner-request.service";
import * as i3 from "@angular/material/snack-bar";
import * as i4 from "@angular/router";
import * as i5 from "../../core/services/i18n.service";
import * as i6 from "@angular/common";
import * as i7 from "@angular/material/button";
import * as i8 from "@angular/material/card";
import * as i9 from "@angular/material/checkbox";
import * as i10 from "@angular/material/form-field";
import * as i11 from "@angular/material/input";
import * as i12 from "../../shared/pipes/translate.pipe";
function PartnerRegistrationComponent_mat_card_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 8)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(3, 1, "partner.intro"));
} }
function PartnerRegistrationComponent_mat_card_12_p_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(2, 2, "partner.requestNumber"), ": ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("#", ctx_r1.requestId, "");
} }
function PartnerRegistrationComponent_mat_card_12_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 9)(1, "h2");
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, PartnerRegistrationComponent_mat_card_12_p_7_Template, 5, 4, "p", 10);
    i0.ɵɵelementStart(8, "p");
    i0.ɵɵtext(9);
    i0.ɵɵpipe(10, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 11);
    i0.ɵɵlistener("click", function PartnerRegistrationComponent_mat_card_12_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.backToWelcome()); });
    i0.ɵɵtext(12);
    i0.ɵɵpipe(13, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(3, 5, "partner.requestSent"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(6, 7, "partner.requestReceived"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.requestId !== null);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(10, 9, "partner.pendingApproval"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(13, 11, "partner.backToWelcome"));
} }
function PartnerRegistrationComponent_form_13_mat_error_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "partner.requiredField"));
} }
function PartnerRegistrationComponent_form_13_mat_error_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, "partner.invalidNumber"), " ");
} }
function PartnerRegistrationComponent_form_13_mat_error_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "partner.requiredField"));
} }
function PartnerRegistrationComponent_form_13_mat_error_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "partner.requiredField"));
} }
function PartnerRegistrationComponent_form_13_mat_error_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "partner.requiredField"));
} }
function PartnerRegistrationComponent_form_13_mat_error_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "partner.invalidEmail"));
} }
function PartnerRegistrationComponent_form_13_mat_error_61_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "partner.requiredField"));
} }
function PartnerRegistrationComponent_form_13_mat_error_71_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "partner.requiredField"));
} }
function PartnerRegistrationComponent_form_13_mat_error_82_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "partner.requiredField"));
} }
function PartnerRegistrationComponent_form_13_mat_error_103_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "partner.requiredField"));
} }
function PartnerRegistrationComponent_form_13_p_116_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 37);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "partner.privacyRequired"));
} }
function PartnerRegistrationComponent_form_13_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "form", 12);
    i0.ɵɵlistener("ngSubmit", function PartnerRegistrationComponent_form_13_Template_form_ngSubmit_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.submit()); });
    i0.ɵɵelementStart(1, "mat-card", 13)(2, "h3");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "mat-form-field", 14)(6, "mat-label");
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "input", 15);
    i0.ɵɵtemplate(10, PartnerRegistrationComponent_form_13_mat_error_10_Template, 3, 3, "mat-error", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "mat-form-field", 14)(12, "mat-label");
    i0.ɵɵtext(13);
    i0.ɵɵpipe(14, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(15, "input", 16);
    i0.ɵɵpipe(16, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "mat-form-field", 14)(18, "mat-label");
    i0.ɵɵtext(19);
    i0.ɵɵpipe(20, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(21, "input", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "mat-form-field", 14)(23, "mat-label");
    i0.ɵɵtext(24);
    i0.ɵɵpipe(25, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(26, "input", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "mat-form-field", 14)(28, "mat-label");
    i0.ɵɵtext(29);
    i0.ɵɵpipe(30, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(31, "input", 19);
    i0.ɵɵtemplate(32, PartnerRegistrationComponent_form_13_mat_error_32_Template, 3, 3, "mat-error", 10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "mat-card", 13)(34, "h3");
    i0.ɵɵtext(35);
    i0.ɵɵpipe(36, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "mat-form-field", 14)(38, "mat-label");
    i0.ɵɵtext(39);
    i0.ɵɵpipe(40, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(41, "input", 20);
    i0.ɵɵtemplate(42, PartnerRegistrationComponent_form_13_mat_error_42_Template, 3, 3, "mat-error", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "mat-form-field", 14)(44, "mat-label");
    i0.ɵɵtext(45);
    i0.ɵɵpipe(46, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(47, "input", 21);
    i0.ɵɵtemplate(48, PartnerRegistrationComponent_form_13_mat_error_48_Template, 3, 3, "mat-error", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "mat-form-field", 14)(50, "mat-label");
    i0.ɵɵtext(51);
    i0.ɵɵpipe(52, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(53, "input", 22);
    i0.ɵɵtemplate(54, PartnerRegistrationComponent_form_13_mat_error_54_Template, 3, 3, "mat-error", 10)(55, PartnerRegistrationComponent_form_13_mat_error_55_Template, 3, 3, "mat-error", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "mat-form-field", 14)(57, "mat-label");
    i0.ɵɵtext(58);
    i0.ɵɵpipe(59, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(60, "input", 23);
    i0.ɵɵtemplate(61, PartnerRegistrationComponent_form_13_mat_error_61_Template, 3, 3, "mat-error", 10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(62, "mat-card", 13)(63, "h3");
    i0.ɵɵtext(64);
    i0.ɵɵpipe(65, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(66, "mat-form-field", 14)(67, "mat-label");
    i0.ɵɵtext(68);
    i0.ɵɵpipe(69, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(70, "input", 24);
    i0.ɵɵtemplate(71, PartnerRegistrationComponent_form_13_mat_error_71_Template, 3, 3, "mat-error", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(72, "mat-form-field", 14)(73, "mat-label");
    i0.ɵɵtext(74);
    i0.ɵɵpipe(75, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(76, "input", 25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(77, "mat-form-field", 14)(78, "mat-label");
    i0.ɵɵtext(79);
    i0.ɵɵpipe(80, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(81, "input", 26);
    i0.ɵɵtemplate(82, PartnerRegistrationComponent_form_13_mat_error_82_Template, 3, 3, "mat-error", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(83, "mat-form-field", 14)(84, "mat-label");
    i0.ɵɵtext(85);
    i0.ɵɵpipe(86, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(87, "input", 27);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(88, "mat-form-field", 14)(89, "mat-label");
    i0.ɵɵtext(90);
    i0.ɵɵpipe(91, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(92, "input", 28);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(93, "mat-form-field", 14)(94, "mat-label");
    i0.ɵɵtext(95);
    i0.ɵɵpipe(96, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(97, "input", 29);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(98, "mat-form-field", 14)(99, "mat-label");
    i0.ɵɵtext(100);
    i0.ɵɵpipe(101, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(102, "input", 30);
    i0.ɵɵtemplate(103, PartnerRegistrationComponent_form_13_mat_error_103_Template, 3, 3, "mat-error", 10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(104, "mat-card", 13)(105, "h3");
    i0.ɵɵtext(106);
    i0.ɵɵpipe(107, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(108, "mat-form-field", 14)(109, "mat-label");
    i0.ɵɵtext(110);
    i0.ɵɵpipe(111, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(112, "textarea", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(113, "mat-checkbox", 32);
    i0.ɵɵtext(114);
    i0.ɵɵpipe(115, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(116, PartnerRegistrationComponent_form_13_p_116_Template, 3, 3, "p", 33);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(117, "div", 34)(118, "button", 35);
    i0.ɵɵtext(119);
    i0.ɵɵpipe(120, "t");
    i0.ɵɵpipe(121, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(122, "button", 36);
    i0.ɵɵlistener("click", function PartnerRegistrationComponent_form_13_Template_button_click_122_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.backToWelcome()); });
    i0.ɵɵtext(123);
    i0.ɵɵpipe(124, "t");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 38, "partner.structureData"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 40, "partner.structureName"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.hasControlError("structureName", "required"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(14, 42, "partner.structureType"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("placeholder", i0.ɵɵpipeBind1(16, 44, "partner.structureTypePlaceholder"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(20, 46, "partner.vatNumber"));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(25, 48, "partner.website"));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(30, 50, "partner.roomsCount"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.hasControlError("roomsCount", "min") || ctx_r1.hasControlError("roomsCount", "max"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(36, 52, "partner.contactPerson"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(40, 54, "partner.name"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.hasControlError("contactFirstName", "required"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(46, 56, "partner.surname"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.hasControlError("contactLastName", "required"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(52, 58, "partner.email"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.hasControlError("contactEmail", "required"));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.hasControlError("contactEmail", "email"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(59, 60, "partner.phone"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.hasControlError("contactPhone", "required"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(65, 62, "partner.address"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(69, 64, "partner.street"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.hasControlError("addressStreet", "required"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(75, 66, "partner.streetNumber"));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(80, 68, "partner.city"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.hasControlError("addressCity", "required"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(86, 70, "partner.postalCode"));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(91, 72, "partner.province"));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(96, 74, "partner.region"));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(101, 76, "partner.country"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.hasControlError("addressCountry", "required"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(107, 78, "partner.notes"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(111, 80, "partner.message"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(115, 82, "partner.privacy"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.hasControlError("privacyAccepted", "required"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.sending);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.sending ? i0.ɵɵpipeBind1(120, 84, "partner.submitting") : i0.ɵɵpipeBind1(121, 86, "partner.submit"), " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(124, 88, "partner.cancel"));
} }
export class PartnerRegistrationComponent {
    constructor(formBuilder, partnerRequestService, snackBar, router, i18n) {
        this.formBuilder = formBuilder;
        this.partnerRequestService = partnerRequestService;
        this.snackBar = snackBar;
        this.router = router;
        this.i18n = i18n;
        this.sending = false;
        this.completed = false;
        this.requestId = null;
        this.form = this.formBuilder.group({
            structureName: ['', [Validators.required, Validators.maxLength(180)]],
            structureType: ['', [Validators.maxLength(120)]],
            vatNumber: ['', [Validators.maxLength(60)]],
            contactFirstName: ['', [Validators.required, Validators.maxLength(120)]],
            contactLastName: ['', [Validators.required, Validators.maxLength(120)]],
            contactEmail: ['', [Validators.required, Validators.email, Validators.maxLength(180)]],
            contactPhone: ['', [Validators.required, Validators.maxLength(80)]],
            website: ['', [Validators.maxLength(240)]],
            addressStreet: ['', [Validators.required, Validators.maxLength(180)]],
            addressNumber: ['', [Validators.maxLength(20)]],
            addressCity: ['', [Validators.required, Validators.maxLength(140)]],
            addressPostalCode: ['', [Validators.maxLength(20)]],
            addressProvince: ['', [Validators.maxLength(80)]],
            addressRegion: ['', [Validators.maxLength(120)]],
            addressCountry: ['Italia', [Validators.required, Validators.maxLength(120)]],
            roomsCount: [null, [Validators.min(0), Validators.max(10000)]],
            notes: ['', [Validators.maxLength(4000)]],
            privacyAccepted: [false, [Validators.requiredTrue]]
        });
        this.form.controls.addressCountry.setValue(this.i18n.t('common.countryItaly'), { emitEvent: false });
    }
    submit() {
        if (this.sending || this.completed) {
            return;
        }
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.snackBar.open(this.i18n.t('partner.validationError'), this.i18n.t('common.close'), {
                duration: 3200
            });
            return;
        }
        this.sending = true;
        const raw = this.form.getRawValue();
        const roomsCount = Number(raw.roomsCount);
        this.partnerRequestService
            .submit({
            structureName: String(raw.structureName || '').trim(),
            structureType: String(raw.structureType || '').trim(),
            vatNumber: String(raw.vatNumber || '').trim(),
            contactFirstName: String(raw.contactFirstName || '').trim(),
            contactLastName: String(raw.contactLastName || '').trim(),
            contactEmail: String(raw.contactEmail || '').trim(),
            contactPhone: String(raw.contactPhone || '').trim(),
            website: String(raw.website || '').trim(),
            addressStreet: String(raw.addressStreet || '').trim(),
            addressNumber: String(raw.addressNumber || '').trim(),
            addressCity: String(raw.addressCity || '').trim(),
            addressPostalCode: String(raw.addressPostalCode || '').trim(),
            addressProvince: String(raw.addressProvince || '').trim(),
            addressRegion: String(raw.addressRegion || '').trim(),
            addressCountry: String(raw.addressCountry || '').trim() || this.i18n.t('common.countryItaly'),
            roomsCount: Number.isFinite(roomsCount) ? roomsCount : null,
            notes: String(raw.notes || '').trim()
        })
            .subscribe({
            next: (response) => {
                this.sending = false;
                this.completed = true;
                this.requestId = response.requestId;
            },
            error: () => {
                this.sending = false;
                this.snackBar.open(this.i18n.t('partner.submitError'), this.i18n.t('common.close'), {
                    duration: 3000
                });
            }
        });
    }
    hasControlError(controlName, errorCode) {
        const control = this.form.get(controlName);
        if (!control || !control.touched) {
            return false;
        }
        return errorCode ? control.hasError(errorCode) : control.invalid;
    }
    backToWelcome() {
        void this.router.navigate(['/welcome']);
    }
    static { this.ɵfac = function PartnerRegistrationComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PartnerRegistrationComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.PartnerRequestService), i0.ɵɵdirectiveInject(i3.MatSnackBar), i0.ɵɵdirectiveInject(i4.Router), i0.ɵɵdirectiveInject(i5.I18nService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PartnerRegistrationComponent, selectors: [["app-partner-registration"]], standalone: false, decls: 14, vars: 12, consts: [[1, "page-shell", "partner-registration"], [1, "brand-head", "card"], ["src", "/assets/logo.png", "loading", "eager", "decoding", "sync", "fetchpriority", "high", 1, "brand-logo"], [1, "page-title"], [1, "page-subtitle"], ["class", "card intro", 4, "ngIf"], ["class", "card success-box", 4, "ngIf"], ["class", "form-grid", 3, "formGroup", "ngSubmit", 4, "ngIf"], [1, "card", "intro"], [1, "card", "success-box"], [4, "ngIf"], ["mat-stroked-button", "", "color", "primary", 3, "click"], [1, "form-grid", 3, "ngSubmit", "formGroup"], [1, "card", "section"], ["appearance", "outline"], ["matInput", "", "formControlName", "structureName"], ["matInput", "", "formControlName", "structureType", 3, "placeholder"], ["matInput", "", "formControlName", "vatNumber"], ["matInput", "", "formControlName", "website"], ["matInput", "", "type", "number", "formControlName", "roomsCount", "min", "0"], ["matInput", "", "formControlName", "contactFirstName"], ["matInput", "", "formControlName", "contactLastName"], ["matInput", "", "type", "email", "formControlName", "contactEmail"], ["matInput", "", "formControlName", "contactPhone"], ["matInput", "", "formControlName", "addressStreet"], ["matInput", "", "formControlName", "addressNumber"], ["matInput", "", "formControlName", "addressCity"], ["matInput", "", "formControlName", "addressPostalCode"], ["matInput", "", "formControlName", "addressProvince"], ["matInput", "", "formControlName", "addressRegion"], ["matInput", "", "formControlName", "addressCountry"], ["matInput", "", "rows", "5", "formControlName", "notes"], ["formControlName", "privacyAccepted", 1, "privacy-check"], ["class", "form-error", 4, "ngIf"], [1, "submit-row"], ["mat-flat-button", "", "color", "primary", "type", "submit", 1, "big-cta", 3, "disabled"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click"], [1, "form-error"]], template: function PartnerRegistrationComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1);
            i0.ɵɵelement(2, "img", 2);
            i0.ɵɵpipe(3, "t");
            i0.ɵɵelementStart(4, "div")(5, "h1", 3);
            i0.ɵɵtext(6);
            i0.ɵɵpipe(7, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 4);
            i0.ɵɵtext(9);
            i0.ɵɵpipe(10, "t");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(11, PartnerRegistrationComponent_mat_card_11_Template, 4, 3, "mat-card", 5)(12, PartnerRegistrationComponent_mat_card_12_Template, 14, 13, "mat-card", 6)(13, PartnerRegistrationComponent_form_13_Template, 125, 90, "form", 7);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵattribute("alt", i0.ɵɵpipeBind1(3, 6, "common.appName"));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 8, "partner.title"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(10, 10, "common.brandTagline"));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", !ctx.completed);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.completed);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.completed);
        } }, dependencies: [i6.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.MinValidator, i1.FormGroupDirective, i1.FormControlName, i7.MatButton, i8.MatCard, i9.MatCheckbox, i10.MatFormField, i10.MatLabel, i10.MatError, i11.MatInput, i12.TranslatePipe], styles: [".partner-registration[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n}\n\n.brand-head[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.brand-logo[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  border-radius: 14px;\n  object-fit: cover;\n}\n\n.intro[_ngcontent-%COMP%] {\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #516783;\n    line-height: 1.45;\n  }\n}\n\n.form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n}\n\n.section[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  h3 {\n    margin: 0;\n    font-size: 1rem;\n    color: #163250;\n  }\n}\n\n.privacy-check[_ngcontent-%COMP%] {\n  margin-top: 4px;\n}\n\n.form-error[_ngcontent-%COMP%] {\n  margin: -2px 0 0;\n  color: #b42318;\n  font-size: 0.86rem;\n  line-height: 1.4;\n}\n\n.submit-row[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n}\n\n.success-box[_ngcontent-%COMP%] {\n  padding: 16px;\n  display: grid;\n  gap: 10px;\n\n  h2,\n  p {\n    margin: 0;\n  }\n\n  p {\n    color: #4f6684;\n    line-height: 1.45;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PartnerRegistrationComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-partner-registration', template: "<section class=\"page-shell partner-registration\">\n  <header class=\"brand-head card\">\n    <img class=\"brand-logo\" src=\"/assets/logo.png\" [attr.alt]=\"'common.appName' | t\" loading=\"eager\" decoding=\"sync\" fetchpriority=\"high\" />\n    <div>\n      <h1 class=\"page-title\">{{ 'partner.title' | t }}</h1>\n      <p class=\"page-subtitle\">{{ 'common.brandTagline' | t }}</p>\n    </div>\n  </header>\n\n  <mat-card class=\"card intro\" *ngIf=\"!completed\">\n    <p>{{ 'partner.intro' | t }}</p>\n  </mat-card>\n\n  <mat-card class=\"card success-box\" *ngIf=\"completed\">\n    <h2>{{ 'partner.requestSent' | t }}</h2>\n    <p>{{ 'partner.requestReceived' | t }}</p>\n    <p *ngIf=\"requestId !== null\">{{ 'partner.requestNumber' | t }}: <strong>#{{ requestId }}</strong></p>\n    <p>{{ 'partner.pendingApproval' | t }}</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"backToWelcome()\">{{ 'partner.backToWelcome' | t }}</button>\n  </mat-card>\n\n  <form *ngIf=\"!completed\" [formGroup]=\"form\" (ngSubmit)=\"submit()\" class=\"form-grid\">\n    <mat-card class=\"card section\">\n      <h3>{{ 'partner.structureData' | t }}</h3>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.structureName' | t }}</mat-label>\n        <input matInput formControlName=\"structureName\" />\n        <mat-error *ngIf=\"hasControlError('structureName', 'required')\">{{ 'partner.requiredField' | t }}</mat-error>\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.structureType' | t }}</mat-label>\n        <input matInput formControlName=\"structureType\" [placeholder]=\"'partner.structureTypePlaceholder' | t\" />\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.vatNumber' | t }}</mat-label>\n        <input matInput formControlName=\"vatNumber\" />\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.website' | t }}</mat-label>\n        <input matInput formControlName=\"website\" />\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.roomsCount' | t }}</mat-label>\n        <input matInput type=\"number\" formControlName=\"roomsCount\" min=\"0\" />\n        <mat-error *ngIf=\"hasControlError('roomsCount', 'min') || hasControlError('roomsCount', 'max')\">\n          {{ 'partner.invalidNumber' | t }}\n        </mat-error>\n      </mat-form-field>\n    </mat-card>\n\n    <mat-card class=\"card section\">\n      <h3>{{ 'partner.contactPerson' | t }}</h3>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.name' | t }}</mat-label>\n        <input matInput formControlName=\"contactFirstName\" />\n        <mat-error *ngIf=\"hasControlError('contactFirstName', 'required')\">{{ 'partner.requiredField' | t }}</mat-error>\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.surname' | t }}</mat-label>\n        <input matInput formControlName=\"contactLastName\" />\n        <mat-error *ngIf=\"hasControlError('contactLastName', 'required')\">{{ 'partner.requiredField' | t }}</mat-error>\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.email' | t }}</mat-label>\n        <input matInput type=\"email\" formControlName=\"contactEmail\" />\n        <mat-error *ngIf=\"hasControlError('contactEmail', 'required')\">{{ 'partner.requiredField' | t }}</mat-error>\n        <mat-error *ngIf=\"hasControlError('contactEmail', 'email')\">{{ 'partner.invalidEmail' | t }}</mat-error>\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.phone' | t }}</mat-label>\n        <input matInput formControlName=\"contactPhone\" />\n        <mat-error *ngIf=\"hasControlError('contactPhone', 'required')\">{{ 'partner.requiredField' | t }}</mat-error>\n      </mat-form-field>\n    </mat-card>\n\n    <mat-card class=\"card section\">\n      <h3>{{ 'partner.address' | t }}</h3>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.street' | t }}</mat-label>\n        <input matInput formControlName=\"addressStreet\" />\n        <mat-error *ngIf=\"hasControlError('addressStreet', 'required')\">{{ 'partner.requiredField' | t }}</mat-error>\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.streetNumber' | t }}</mat-label>\n        <input matInput formControlName=\"addressNumber\" />\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.city' | t }}</mat-label>\n        <input matInput formControlName=\"addressCity\" />\n        <mat-error *ngIf=\"hasControlError('addressCity', 'required')\">{{ 'partner.requiredField' | t }}</mat-error>\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.postalCode' | t }}</mat-label>\n        <input matInput formControlName=\"addressPostalCode\" />\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.province' | t }}</mat-label>\n        <input matInput formControlName=\"addressProvince\" />\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.region' | t }}</mat-label>\n        <input matInput formControlName=\"addressRegion\" />\n      </mat-form-field>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.country' | t }}</mat-label>\n        <input matInput formControlName=\"addressCountry\" />\n        <mat-error *ngIf=\"hasControlError('addressCountry', 'required')\">{{ 'partner.requiredField' | t }}</mat-error>\n      </mat-form-field>\n    </mat-card>\n\n    <mat-card class=\"card section\">\n      <h3>{{ 'partner.notes' | t }}</h3>\n      <mat-form-field appearance=\"outline\">\n        <mat-label>{{ 'partner.message' | t }}</mat-label>\n        <textarea matInput rows=\"5\" formControlName=\"notes\"></textarea>\n      </mat-form-field>\n      <mat-checkbox class=\"privacy-check\" formControlName=\"privacyAccepted\">{{ 'partner.privacy' | t }}</mat-checkbox>\n      <p class=\"form-error\" *ngIf=\"hasControlError('privacyAccepted', 'required')\">{{ 'partner.privacyRequired' | t }}</p>\n    </mat-card>\n\n    <div class=\"submit-row\">\n      <button mat-flat-button color=\"primary\" class=\"big-cta\" type=\"submit\" [disabled]=\"sending\">\n        {{ sending ? ('partner.submitting' | t) : ('partner.submit' | t) }}\n      </button>\n      <button mat-stroked-button color=\"primary\" type=\"button\" (click)=\"backToWelcome()\">{{ 'partner.cancel' | t }}</button>\n    </div>\n  </form>\n</section>\n", styles: [".partner-registration {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n}\n\n.brand-head {\n  padding: 14px;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.brand-logo {\n  width: 64px;\n  height: 64px;\n  border-radius: 14px;\n  object-fit: cover;\n}\n\n.intro {\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #516783;\n    line-height: 1.45;\n  }\n}\n\n.form-grid {\n  display: grid;\n  gap: 12px;\n}\n\n.section {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  h3 {\n    margin: 0;\n    font-size: 1rem;\n    color: #163250;\n  }\n}\n\n.privacy-check {\n  margin-top: 4px;\n}\n\n.form-error {\n  margin: -2px 0 0;\n  color: #b42318;\n  font-size: 0.86rem;\n  line-height: 1.4;\n}\n\n.submit-row {\n  display: grid;\n  gap: 8px;\n}\n\n.success-box {\n  padding: 16px;\n  display: grid;\n  gap: 10px;\n\n  h2,\n  p {\n    margin: 0;\n  }\n\n  p {\n    color: #4f6684;\n    line-height: 1.45;\n  }\n}\n"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.PartnerRequestService }, { type: i3.MatSnackBar }, { type: i4.Router }, { type: i5.I18nService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PartnerRegistrationComponent, { className: "PartnerRegistrationComponent", filePath: "src/app/features/partner-registration/partner-registration.component.ts", lineNumber: 14 }); })();
