import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/material/snack-bar";
import * as i3 from "../../core/services/app-state.service";
import * as i4 from "../../core/services/purchase.service";
import * as i5 from "../../core/services/i18n.service";
import * as i6 from "@angular/common";
import * as i7 from "@angular/forms";
import * as i8 from "@angular/material/button";
import * as i9 from "@angular/material/form-field";
import * as i10 from "@angular/material/input";
import * as i11 from "@angular/material/select";
import * as i12 from "../../shared/pipes/translate.pipe";
function WelcomeComponent_section_43_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 21)(1, "mat-form-field", 22)(2, "mat-label");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "input", 23);
    i0.ɵɵtwoWayListener("ngModelChange", function WelcomeComponent_section_43_Template_input_ngModelChange_5_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.hotelCode, $event) || (ctx_r1.hotelCode = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "button", 24);
    i0.ɵɵlistener("click", function WelcomeComponent_section_43_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.validateCode()); });
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "t");
    i0.ɵɵpipe(9, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 4, "welcome.inviteCodeLabel"));
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.hotelCode);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isCheckingCode);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isCheckingCode ? i0.ɵɵpipeBind1(8, 6, "welcome.checkingCode") : i0.ɵɵpipeBind1(9, 8, "welcome.applyAndContinue"), " ");
} }
export class WelcomeComponent {
    constructor(router, snackBar, appState, purchaseService, i18n) {
        this.router = router;
        this.snackBar = snackBar;
        this.appState = appState;
        this.purchaseService = purchaseService;
        this.i18n = i18n;
        this.hotelCode = '';
        this.isCheckingCode = false;
        this.showCodeInput = false;
        this.language = 'it';
        this.hotelCode = this.appState.hotelCode;
        this.language = this.appState.language;
    }
    start() {
        this.appState.markOnboardingSeen();
        this.appState.setActiveCity('catania');
        this.purchaseService.refresh();
        void this.router.navigate(['/home']);
    }
    setLanguage(language) {
        this.language = language;
        this.appState.setLanguage(language);
    }
    goToPartnerRegistration() {
        void this.router.navigate(['/partner-registration']);
    }
    validateCode() {
        const trimmed = this.hotelCode.trim();
        if (!trimmed) {
            this.snackBar.open(this.i18n.t('welcome.insertInviteCode'), this.i18n.t('common.close'), { duration: 2200 });
            return;
        }
        this.isCheckingCode = true;
        this.purchaseService.validateHotelCode(trimmed).subscribe({
            next: (response) => {
                this.isCheckingCode = false;
                if (!response.valid || !response.association) {
                    this.snackBar.open(this.i18n.t('welcome.codeNotFound'), this.i18n.t('common.ok'), { duration: 2800 });
                    return;
                }
                if (response.association.codeStatus !== 'valid') {
                    const invalidMessage = response.association.codeStatus === 'expired'
                        ? this.i18n.t('welcome.codeExpired')
                        : response.association.codeStatus === 'used'
                            ? this.i18n.t('welcome.codeUsed')
                            : this.i18n.t('welcome.codeNotValid');
                    this.snackBar.open(invalidMessage, this.i18n.t('common.ok'), { duration: 2800 });
                    return;
                }
                const normalizedCode = (response.association.inviteCode || trimmed).toUpperCase();
                this.appState.markOnboardingSeen();
                this.appState.setHotelCode(normalizedCode);
                this.appState.setHotelAssociation(response.association);
                this.appState.setActiveCity('catania');
                this.purchaseService.refresh();
                void this.router.navigate(['/home']);
            },
            error: (error) => {
                this.isCheckingCode = false;
                const message = error?.error?.codeStatus === 'expired'
                    ? this.i18n.t('welcome.codeExpired')
                    : error?.error?.codeStatus === 'used'
                        ? this.i18n.t('welcome.codeUsed')
                        : error?.error?.codeStatus === 'invalid'
                            ? this.i18n.t('welcome.codeNotValid')
                            : this.i18n.t('welcome.validationError');
                this.snackBar.open(message, this.i18n.t('common.close'), { duration: 2800 });
            }
        });
    }
    static { this.ɵfac = function WelcomeComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WelcomeComponent)(i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.MatSnackBar), i0.ɵɵdirectiveInject(i3.AppStateService), i0.ɵɵdirectiveInject(i4.PurchaseService), i0.ɵɵdirectiveInject(i5.I18nService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: WelcomeComponent, selectors: [["app-welcome"]], standalone: false, decls: 44, vars: 37, consts: [[1, "welcome", "page-shell"], [1, "welcome-stage"], ["aria-hidden", "true", 1, "welcome-ornament", "welcome-ornament-bottom"], [1, "welcome-card", "card"], ["aria-hidden", "true", 1, "welcome-card-ornament"], ["src", "/assets/logo.png", "loading", "eager", "decoding", "sync", "fetchpriority", "high", 1, "brand-logo"], [1, "brand-slogan"], ["appearance", "outline", 1, "language-select"], [3, "selectionChange", "value"], ["value", "it"], ["value", "en"], ["value", "fr"], ["value", "es"], [1, "welcome-description-card"], [1, "welcome-description"], [1, "welcome-actions"], ["mat-flat-button", "", "color", "primary", 1, "big-cta", "welcome-cta", "primary-cta", 3, "click"], ["mat-stroked-button", "", "color", "primary", 1, "big-cta", "welcome-cta", "secondary-cta", 3, "click"], [1, "invite-box"], ["mat-button", "", "type", "button", "color", "primary", 1, "invite-toggle", 3, "click"], ["class", "code-box card", 4, "ngIf"], [1, "code-box", "card"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "autocomplete", "off", 3, "ngModelChange", "ngModel"], ["mat-stroked-button", "", "color", "primary", 3, "click", "disabled"]], template: function WelcomeComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "div", 1);
            i0.ɵɵelement(2, "span", 2);
            i0.ɵɵelementStart(3, "div", 3);
            i0.ɵɵelement(4, "span", 4)(5, "img", 5);
            i0.ɵɵpipe(6, "t");
            i0.ɵɵelementStart(7, "p", 6);
            i0.ɵɵtext(8);
            i0.ɵɵpipe(9, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "mat-form-field", 7)(11, "mat-label");
            i0.ɵɵtext(12);
            i0.ɵɵpipe(13, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "mat-select", 8);
            i0.ɵɵlistener("selectionChange", function WelcomeComponent_Template_mat_select_selectionChange_14_listener($event) { return ctx.setLanguage($event.value); });
            i0.ɵɵelementStart(15, "mat-option", 9);
            i0.ɵɵtext(16);
            i0.ɵɵpipe(17, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "mat-option", 10);
            i0.ɵɵtext(19);
            i0.ɵɵpipe(20, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "mat-option", 11);
            i0.ɵɵtext(22);
            i0.ɵɵpipe(23, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "mat-option", 12);
            i0.ɵɵtext(25);
            i0.ɵɵpipe(26, "t");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(27, "div", 13)(28, "p", 14);
            i0.ɵɵtext(29);
            i0.ɵɵpipe(30, "t");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(31, "div", 15)(32, "button", 16);
            i0.ɵɵlistener("click", function WelcomeComponent_Template_button_click_32_listener() { return ctx.start(); });
            i0.ɵɵtext(33);
            i0.ɵɵpipe(34, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "button", 17);
            i0.ɵɵlistener("click", function WelcomeComponent_Template_button_click_35_listener() { return ctx.goToPartnerRegistration(); });
            i0.ɵɵtext(36);
            i0.ɵɵpipe(37, "t");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(38, "div", 18)(39, "button", 19);
            i0.ɵɵlistener("click", function WelcomeComponent_Template_button_click_39_listener() { return ctx.showCodeInput = !ctx.showCodeInput; });
            i0.ɵɵtext(40);
            i0.ɵɵpipe(41, "t");
            i0.ɵɵpipe(42, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(43, WelcomeComponent_section_43_Template, 10, 10, "section", 20);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(5);
            i0.ɵɵattribute("alt", i0.ɵɵpipeBind1(6, 13, "common.appName"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(9, 15, "common.brandTagline"));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(13, 17, "common.language"));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", ctx.language);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(17, 19, "common.italian"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(20, 21, "common.english"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(23, 23, "common.french"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(26, 25, "common.spanish"));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(30, 27, "welcome.description"));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(34, 29, "common.enter"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(37, 31, "common.becomePartner"), " ");
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate1(" ", ctx.showCodeInput ? i0.ɵɵpipeBind1(41, 33, "welcome.hideInviteQuestion") : i0.ɵɵpipeBind1(42, 35, "welcome.inviteQuestion"), " ");
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngIf", ctx.showCodeInput);
        } }, dependencies: [i6.NgIf, i7.DefaultValueAccessor, i7.NgControlStatus, i7.NgModel, i8.MatButton, i9.MatFormField, i9.MatLabel, i10.MatInput, i11.MatSelect, i11.MatOption, i12.TranslatePipe], styles: [".welcome[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  align-content: start;\n  justify-items: center;\n  padding-top: 24px;\n  gap: 22px;\n  overflow: hidden;\n  background:\n    radial-gradient(circle at top, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0) 54%),\n    linear-gradient(180deg, #f7f4ee 0%, #f4efe7 100%);\n}\n\n.welcome-stage[_ngcontent-%COMP%] {\n  position: relative;\n  width: min(438px, 100%);\n  display: grid;\n  justify-items: center;\n  gap: 22px;\n  z-index: 1;\n}\n\n.welcome-card[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  padding: 24px 16px 28px;\n  display: grid;\n  justify-items: center;\n  gap: 18px;\n  text-align: center;\n  border-radius: 26px;\n  overflow: hidden;\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(251, 248, 242, 0.98) 100%);\n  box-shadow:\n    0 18px 36px rgba(84, 70, 48, 0.12),\n    0 4px 8px rgba(84, 70, 48, 0.08);\n}\n\n.welcome-card[_ngcontent-%COMP%]::before {\n  content: '';\n  position: absolute;\n  inset: 0;\n  background:\n    radial-gradient(circle at top right, rgba(224, 229, 235, 0.46) 0%, rgba(224, 229, 235, 0) 24%),\n    linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(245, 240, 232, 0.5) 100%);\n  pointer-events: none;\n}\n\n.welcome-ornament[_ngcontent-%COMP%] {\n  position: absolute;\n  pointer-events: none;\n  z-index: 0;\n  background: center / contain no-repeat url('/assets/images/welcome-corner-ornament.svg');\n  opacity: 0.94;\n}\n\n.welcome-card-ornament[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  left: -24px;\n  width: 166px;\n  height: 180px;\n  pointer-events: none;\n  z-index: 0;\n  background: center / contain no-repeat url('/assets/images/welcome-corner-ornament.svg');\n  opacity: 0.96;\n}\n\n.welcome-ornament-bottom[_ngcontent-%COMP%] {\n  right: -30px;\n  bottom: -110px;\n  width: 170px;\n  height: 188px;\n  transform: rotate(180deg);\n}\n\n.brand-logo[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: min(320px, 100%);\n  max-width: 332px;\n  height: auto;\n  filter: drop-shadow(0 10px 14px rgba(31, 55, 88, 0.18));\n}\n\n.brand-slogan[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  margin: 0;\n  font-size: 1.08rem;\n  font-weight: 700;\n  color: #171f28;\n  letter-spacing: 0.01em;\n}\n\n.language-select[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: min(300px, 100%);\n}\n\n.language-select[_ngcontent-%COMP%]     .mat-mdc-text-field-wrapper {\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.96);\n}\n\n.language-select[_ngcontent-%COMP%]     .mat-mdc-form-field-infix {\n  min-height: 62px;\n  padding-top: 20px;\n  padding-bottom: 12px;\n}\n\n.language-select[_ngcontent-%COMP%]     .mat-mdc-select {\n  font-size: 1rem;\n  color: #1a1f28;\n}\n\n.language-select[_ngcontent-%COMP%]     .mdc-notched-outline__leading, \n.language-select[_ngcontent-%COMP%]     .mdc-notched-outline__notch, \n.language-select[_ngcontent-%COMP%]     .mdc-notched-outline__trailing {\n  border-color: rgba(132, 133, 138, 0.52) !important;\n  border-width: 1.4px !important;\n}\n\n.language-select[_ngcontent-%COMP%]     .mdc-floating-label {\n  color: #7d786f !important;\n  font-weight: 500;\n}\n\n.welcome-description-card[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  padding: 18px 18px 16px;\n  border-radius: 10px;\n  border: 1px solid rgba(166, 135, 79, 0.36);\n  background:\n    radial-gradient(circle at top left, rgba(247, 237, 208, 0.78) 0%, rgba(247, 237, 208, 0) 34%),\n    radial-gradient(circle at bottom right, rgba(216, 195, 144, 0.42) 0%, rgba(216, 195, 144, 0) 28%),\n    linear-gradient(180deg, #f7eecf 0%, #efe1bb 100%);\n  box-shadow:\n    inset 0 0 0 1px rgba(244, 229, 189, 0.7),\n    0 10px 20px rgba(93, 73, 35, 0.2);\n}\n\n.welcome-description-card[_ngcontent-%COMP%]::before, \n.welcome-description-card[_ngcontent-%COMP%]::after {\n  content: '';\n  position: absolute;\n  inset: 6px;\n  border-radius: 8px;\n  pointer-events: none;\n}\n\n.welcome-description-card[_ngcontent-%COMP%]::before {\n  border: 1px solid rgba(170, 139, 82, 0.22);\n}\n\n.welcome-description-card[_ngcontent-%COMP%]::after {\n  background:\n    radial-gradient(circle at top left, rgba(161, 122, 58, 0.18) 0 12px, transparent 13px),\n    radial-gradient(circle at top right, rgba(161, 122, 58, 0.18) 0 12px, transparent 13px),\n    radial-gradient(circle at bottom left, rgba(161, 122, 58, 0.18) 0 12px, transparent 13px),\n    radial-gradient(circle at bottom right, rgba(161, 122, 58, 0.18) 0 12px, transparent 13px);\n  opacity: 0.56;\n}\n\n.welcome-description[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  margin: 0;\n  color: #25211c;\n  line-height: 1.68;\n  font-size: clamp(1rem, 0.92rem + 0.42vw, 1.14rem);\n  font-weight: 500;\n}\n\n.welcome-actions[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  display: grid;\n  gap: 14px;\n}\n\n.welcome-cta[_ngcontent-%COMP%] {\n  height: 46px;\n  border-radius: 18px !important;\n  font-size: 1rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n}\n\n.primary-cta[_ngcontent-%COMP%] {\n  background: linear-gradient(180deg, #2f82cf 0%, #2f73bf 100%) !important;\n  box-shadow: 0 8px 18px rgba(48, 113, 191, 0.28);\n}\n\n.secondary-cta[_ngcontent-%COMP%] {\n  border-width: 1.5px !important;\n  color: #2f5f90 !important;\n  background: rgba(255, 255, 255, 0.94) !important;\n}\n\n.invite-box[_ngcontent-%COMP%] {\n  display: grid;\n  justify-items: center;\n  gap: 10px;\n  position: relative;\n  z-index: 1;\n  padding-bottom: 34px;\n}\n\n.invite-toggle[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0;\n  font-size: 1rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  color: #3a6f9f !important;\n}\n\n.code-box[_ngcontent-%COMP%] {\n  padding: 16px;\n  display: grid;\n  gap: 12px;\n  width: min(460px, 100%);\n  border-radius: 20px;\n  background: rgba(255, 255, 255, 0.96);\n}\n\n.full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n@media (max-width: 600px) {\n  .welcome[_ngcontent-%COMP%] {\n    padding-top: 16px;\n    gap: 18px;\n  }\n\n  .welcome-stage[_ngcontent-%COMP%] {\n    gap: 18px;\n  }\n\n  .welcome-card[_ngcontent-%COMP%] {\n    padding: 20px 16px 24px;\n    gap: 16px;\n    border-radius: 22px;\n  }\n\n  .welcome-card-ornament[_ngcontent-%COMP%] {\n    top: -10px;\n    left: -28px;\n    width: 148px;\n    height: 162px;\n  }\n\n  .welcome-ornament-bottom[_ngcontent-%COMP%] {\n    right: -36px;\n    bottom: -116px;\n    width: 150px;\n    height: 168px;\n  }\n\n  .brand-logo[_ngcontent-%COMP%] {\n    width: min(312px, 100%);\n  }\n\n  .brand-slogan[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n\n  .language-select[_ngcontent-%COMP%] {\n    width: min(300px, 100%);\n  }\n\n  .welcome-description-card[_ngcontent-%COMP%] {\n    padding: 16px 14px 14px;\n  }\n\n  .welcome-description[_ngcontent-%COMP%] {\n    line-height: 1.62;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WelcomeComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-welcome', template: "<section class=\"welcome page-shell\">\n  <div class=\"welcome-stage\">\n    <span class=\"welcome-ornament welcome-ornament-bottom\" aria-hidden=\"true\"></span>\n\n    <div class=\"welcome-card card\">\n      <span class=\"welcome-card-ornament\" aria-hidden=\"true\"></span>\n      <img class=\"brand-logo\" src=\"/assets/logo.png\" [attr.alt]=\"'common.appName' | t\" loading=\"eager\" decoding=\"sync\" fetchpriority=\"high\" />\n      <p class=\"brand-slogan\">{{ 'common.brandTagline' | t }}</p>\n\n      <mat-form-field appearance=\"outline\" class=\"language-select\">\n        <mat-label>{{ 'common.language' | t }}</mat-label>\n        <mat-select [value]=\"language\" (selectionChange)=\"setLanguage($event.value)\">\n          <mat-option value=\"it\">{{ 'common.italian' | t }}</mat-option>\n          <mat-option value=\"en\">{{ 'common.english' | t }}</mat-option>\n          <mat-option value=\"fr\">{{ 'common.french' | t }}</mat-option>\n          <mat-option value=\"es\">{{ 'common.spanish' | t }}</mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div class=\"welcome-description-card\">\n        <p class=\"welcome-description\">{{ 'welcome.description' | t }}</p>\n      </div>\n\n      <div class=\"welcome-actions\">\n        <button mat-flat-button color=\"primary\" class=\"big-cta welcome-cta primary-cta\" (click)=\"start()\">{{ 'common.enter' | t }}</button>\n        <button mat-stroked-button color=\"primary\" class=\"big-cta welcome-cta secondary-cta\" (click)=\"goToPartnerRegistration()\">\n          {{ 'common.becomePartner' | t }}\n        </button>\n      </div>\n    </div>\n\n    <div class=\"invite-box\">\n      <button mat-button type=\"button\" class=\"invite-toggle\" color=\"primary\" (click)=\"showCodeInput = !showCodeInput\">\n        {{ showCodeInput ? ('welcome.hideInviteQuestion' | t) : ('welcome.inviteQuestion' | t) }}\n      </button>\n\n      <section class=\"code-box card\" *ngIf=\"showCodeInput\">\n        <mat-form-field appearance=\"outline\" class=\"full-width\">\n          <mat-label>{{ 'welcome.inviteCodeLabel' | t }}</mat-label>\n          <input matInput [(ngModel)]=\"hotelCode\" autocomplete=\"off\" />\n        </mat-form-field>\n\n        <button mat-stroked-button color=\"primary\" [disabled]=\"isCheckingCode\" (click)=\"validateCode()\">\n          {{ isCheckingCode ? ('welcome.checkingCode' | t) : ('welcome.applyAndContinue' | t) }}\n        </button>\n      </section>\n    </div>\n  </div>\n</section>\n\r\n", styles: [".welcome {\n  position: relative;\n  display: grid;\n  align-content: start;\n  justify-items: center;\n  padding-top: 24px;\n  gap: 22px;\n  overflow: hidden;\n  background:\n    radial-gradient(circle at top, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0) 54%),\n    linear-gradient(180deg, #f7f4ee 0%, #f4efe7 100%);\n}\n\n.welcome-stage {\n  position: relative;\n  width: min(438px, 100%);\n  display: grid;\n  justify-items: center;\n  gap: 22px;\n  z-index: 1;\n}\n\n.welcome-card {\n  position: relative;\n  width: 100%;\n  padding: 24px 16px 28px;\n  display: grid;\n  justify-items: center;\n  gap: 18px;\n  text-align: center;\n  border-radius: 26px;\n  overflow: hidden;\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(251, 248, 242, 0.98) 100%);\n  box-shadow:\n    0 18px 36px rgba(84, 70, 48, 0.12),\n    0 4px 8px rgba(84, 70, 48, 0.08);\n}\n\n.welcome-card::before {\n  content: '';\n  position: absolute;\n  inset: 0;\n  background:\n    radial-gradient(circle at top right, rgba(224, 229, 235, 0.46) 0%, rgba(224, 229, 235, 0) 24%),\n    linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(245, 240, 232, 0.5) 100%);\n  pointer-events: none;\n}\n\n.welcome-ornament {\n  position: absolute;\n  pointer-events: none;\n  z-index: 0;\n  background: center / contain no-repeat url('/assets/images/welcome-corner-ornament.svg');\n  opacity: 0.94;\n}\n\n.welcome-card-ornament {\n  position: absolute;\n  top: -8px;\n  left: -24px;\n  width: 166px;\n  height: 180px;\n  pointer-events: none;\n  z-index: 0;\n  background: center / contain no-repeat url('/assets/images/welcome-corner-ornament.svg');\n  opacity: 0.96;\n}\n\n.welcome-ornament-bottom {\n  right: -30px;\n  bottom: -110px;\n  width: 170px;\n  height: 188px;\n  transform: rotate(180deg);\n}\n\n.brand-logo {\n  position: relative;\n  z-index: 1;\n  width: min(320px, 100%);\n  max-width: 332px;\n  height: auto;\n  filter: drop-shadow(0 10px 14px rgba(31, 55, 88, 0.18));\n}\n\n.brand-slogan {\n  position: relative;\n  z-index: 1;\n  margin: 0;\n  font-size: 1.08rem;\n  font-weight: 700;\n  color: #171f28;\n  letter-spacing: 0.01em;\n}\n\n.language-select {\n  position: relative;\n  z-index: 1;\n  width: min(300px, 100%);\n}\n\n.language-select ::ng-deep .mat-mdc-text-field-wrapper {\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.96);\n}\n\n.language-select ::ng-deep .mat-mdc-form-field-infix {\n  min-height: 62px;\n  padding-top: 20px;\n  padding-bottom: 12px;\n}\n\n.language-select ::ng-deep .mat-mdc-select {\n  font-size: 1rem;\n  color: #1a1f28;\n}\n\n.language-select ::ng-deep .mdc-notched-outline__leading,\n.language-select ::ng-deep .mdc-notched-outline__notch,\n.language-select ::ng-deep .mdc-notched-outline__trailing {\n  border-color: rgba(132, 133, 138, 0.52) !important;\n  border-width: 1.4px !important;\n}\n\n.language-select ::ng-deep .mdc-floating-label {\n  color: #7d786f !important;\n  font-weight: 500;\n}\n\n.welcome-description-card {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  padding: 18px 18px 16px;\n  border-radius: 10px;\n  border: 1px solid rgba(166, 135, 79, 0.36);\n  background:\n    radial-gradient(circle at top left, rgba(247, 237, 208, 0.78) 0%, rgba(247, 237, 208, 0) 34%),\n    radial-gradient(circle at bottom right, rgba(216, 195, 144, 0.42) 0%, rgba(216, 195, 144, 0) 28%),\n    linear-gradient(180deg, #f7eecf 0%, #efe1bb 100%);\n  box-shadow:\n    inset 0 0 0 1px rgba(244, 229, 189, 0.7),\n    0 10px 20px rgba(93, 73, 35, 0.2);\n}\n\n.welcome-description-card::before,\n.welcome-description-card::after {\n  content: '';\n  position: absolute;\n  inset: 6px;\n  border-radius: 8px;\n  pointer-events: none;\n}\n\n.welcome-description-card::before {\n  border: 1px solid rgba(170, 139, 82, 0.22);\n}\n\n.welcome-description-card::after {\n  background:\n    radial-gradient(circle at top left, rgba(161, 122, 58, 0.18) 0 12px, transparent 13px),\n    radial-gradient(circle at top right, rgba(161, 122, 58, 0.18) 0 12px, transparent 13px),\n    radial-gradient(circle at bottom left, rgba(161, 122, 58, 0.18) 0 12px, transparent 13px),\n    radial-gradient(circle at bottom right, rgba(161, 122, 58, 0.18) 0 12px, transparent 13px);\n  opacity: 0.56;\n}\n\n.welcome-description {\n  position: relative;\n  z-index: 1;\n  margin: 0;\n  color: #25211c;\n  line-height: 1.68;\n  font-size: clamp(1rem, 0.92rem + 0.42vw, 1.14rem);\n  font-weight: 500;\n}\n\n.welcome-actions {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  display: grid;\n  gap: 14px;\n}\n\n.welcome-cta {\n  height: 46px;\n  border-radius: 18px !important;\n  font-size: 1rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n}\n\n.primary-cta {\n  background: linear-gradient(180deg, #2f82cf 0%, #2f73bf 100%) !important;\n  box-shadow: 0 8px 18px rgba(48, 113, 191, 0.28);\n}\n\n.secondary-cta {\n  border-width: 1.5px !important;\n  color: #2f5f90 !important;\n  background: rgba(255, 255, 255, 0.94) !important;\n}\n\n.invite-box {\n  display: grid;\n  justify-items: center;\n  gap: 10px;\n  position: relative;\n  z-index: 1;\n  padding-bottom: 34px;\n}\n\n.invite-toggle {\n  min-width: 0;\n  padding: 0;\n  font-size: 1rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  color: #3a6f9f !important;\n}\n\n.code-box {\n  padding: 16px;\n  display: grid;\n  gap: 12px;\n  width: min(460px, 100%);\n  border-radius: 20px;\n  background: rgba(255, 255, 255, 0.96);\n}\n\n.full-width {\n  width: 100%;\n}\n\n@media (max-width: 600px) {\n  .welcome {\n    padding-top: 16px;\n    gap: 18px;\n  }\n\n  .welcome-stage {\n    gap: 18px;\n  }\n\n  .welcome-card {\n    padding: 20px 16px 24px;\n    gap: 16px;\n    border-radius: 22px;\n  }\n\n  .welcome-card-ornament {\n    top: -10px;\n    left: -28px;\n    width: 148px;\n    height: 162px;\n  }\n\n  .welcome-ornament-bottom {\n    right: -36px;\n    bottom: -116px;\n    width: 150px;\n    height: 168px;\n  }\n\n  .brand-logo {\n    width: min(312px, 100%);\n  }\n\n  .brand-slogan {\n    font-size: 1rem;\n  }\n\n  .language-select {\n    width: min(300px, 100%);\n  }\n\n  .welcome-description-card {\n    padding: 16px 14px 14px;\n  }\n\n  .welcome-description {\n    line-height: 1.62;\n  }\n}\n"] }]
    }], () => [{ type: i1.Router }, { type: i2.MatSnackBar }, { type: i3.AppStateService }, { type: i4.PurchaseService }, { type: i5.I18nService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(WelcomeComponent, { className: "WelcomeComponent", filePath: "frontend/src/app/features/welcome/welcome.component.ts", lineNumber: 15 }); })();
