import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/material/snack-bar";
import * as i3 from "../../core/services/app-state.service";
import * as i4 from "../../core/services/poi.service";
import * as i5 from "../../core/services/purchase.service";
import * as i6 from "../../core/services/i18n.service";
import * as i7 from "@angular/common";
import * as i8 from "@angular/forms";
import * as i9 from "@angular/material/button";
import * as i10 from "@angular/material/form-field";
import * as i11 from "@angular/material/icon";
import * as i12 from "@angular/material/input";
import * as i13 from "@angular/material/select";
import * as i14 from "../../shared/pipes/translate.pipe";
function WelcomeComponent_mat_option_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 22);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r1 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("value", city_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.cityName(city_r1));
} }
function WelcomeComponent_section_51_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 23)(1, "mat-form-field", 24)(2, "mat-label");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "input", 25);
    i0.ɵɵtwoWayListener("ngModelChange", function WelcomeComponent_section_51_Template_input_ngModelChange_5_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.hotelCode, $event) || (ctx_r1.hotelCode = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "button", 26);
    i0.ɵɵlistener("click", function WelcomeComponent_section_51_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.validateCode()); });
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
    constructor(router, snackBar, appState, poiService, purchaseService, i18n) {
        this.router = router;
        this.snackBar = snackBar;
        this.appState = appState;
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.i18n = i18n;
        this.hotelCode = '';
        this.isCheckingCode = false;
        this.showCodeInput = false;
        this.language = 'it';
        this.selectedCityId = 'catania';
        this.cities = [];
        this.loadingCities = false;
        this.destroy$ = new Subject();
        this.hotelCode = this.appState.hotelCode;
        this.language = this.appState.language;
        this.selectedCityId = this.appState.activeCityId || 'catania';
    }
    ngOnInit() {
        this.loadingCities = true;
        this.poiService
            .getCities()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
            next: (cities) => {
                this.loadingCities = false;
                this.cities = Array.isArray(cities) ? cities : [];
                this.ensureSelectedCity();
            },
            error: () => {
                this.loadingCities = false;
                this.cities = [];
            }
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    start() {
        this.appState.markOnboardingSeen();
        this.saveSelectedCity();
        this.purchaseService.refresh();
        void this.router.navigate(['/home']);
    }
    setLanguage(language) {
        this.language = language;
        this.appState.setLanguage(language);
    }
    setCity(cityId) {
        if (!cityId) {
            return;
        }
        this.selectedCityId = cityId;
        this.saveSelectedCity();
    }
    cityName(city) {
        return this.i18n.resolveCityField(city.name, city.translations, 'name') || city.name;
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
                this.saveSelectedCity();
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
    ensureSelectedCity() {
        if (!this.cities.length) {
            return;
        }
        const selectedStillExists = this.cities.some((city) => city.id === this.selectedCityId);
        if (selectedStillExists) {
            return;
        }
        const defaultCity = this.cities.find((city) => city.isDefault) || this.cities[0];
        this.selectedCityId = defaultCity.id;
    }
    saveSelectedCity() {
        const selectedCityId = String(this.selectedCityId || '').trim();
        if (!selectedCityId) {
            return;
        }
        this.appState.setActiveCity(selectedCityId);
    }
    static { this.ɵfac = function WelcomeComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WelcomeComponent)(i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.MatSnackBar), i0.ɵɵdirectiveInject(i3.AppStateService), i0.ɵɵdirectiveInject(i4.PoiService), i0.ɵɵdirectiveInject(i5.PurchaseService), i0.ɵɵdirectiveInject(i6.I18nService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: WelcomeComponent, selectors: [["app-welcome"]], standalone: false, decls: 52, vars: 43, consts: [[1, "welcome", "page-shell"], [1, "welcome-stage"], [1, "welcome-card", "card"], ["src", "/assets/logo.png", "loading", "eager", "decoding", "sync", "fetchpriority", "high", 1, "brand-logo"], [1, "brand-slogan"], ["appearance", "fill", 1, "welcome-select"], ["matPrefix", "", "fontSet", "material-icons-round", 1, "welcome-select-icon"], [3, "selectionChange", "value"], ["value", "it"], ["value", "en"], ["value", "fr"], ["value", "es"], [3, "selectionChange", "value", "disabled"], [3, "value", 4, "ngFor", "ngForOf"], [1, "welcome-description-card"], [1, "welcome-description"], [1, "welcome-actions"], ["mat-flat-button", "", "color", "primary", 1, "big-cta", "welcome-cta", "primary-cta", 3, "click"], ["mat-stroked-button", "", "color", "primary", 1, "big-cta", "welcome-cta", "secondary-cta", 3, "click"], [1, "invite-box"], ["mat-button", "", "type", "button", "color", "primary", 1, "invite-toggle", 3, "click"], ["class", "code-box card", 4, "ngIf"], [3, "value"], [1, "code-box", "card"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "autocomplete", "off", 3, "ngModelChange", "ngModel"], ["mat-stroked-button", "", "color", "primary", 3, "click", "disabled"]], template: function WelcomeComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
            i0.ɵɵelement(3, "img", 3);
            i0.ɵɵpipe(4, "t");
            i0.ɵɵelementStart(5, "p", 4);
            i0.ɵɵtext(6);
            i0.ɵɵpipe(7, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "mat-form-field", 5)(9, "mat-icon", 6);
            i0.ɵɵtext(10, "language");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "mat-label");
            i0.ɵɵtext(12);
            i0.ɵɵpipe(13, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "mat-select", 7);
            i0.ɵɵlistener("selectionChange", function WelcomeComponent_Template_mat_select_selectionChange_14_listener($event) { return ctx.setLanguage($event.value); });
            i0.ɵɵelementStart(15, "mat-option", 8);
            i0.ɵɵtext(16);
            i0.ɵɵpipe(17, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "mat-option", 9);
            i0.ɵɵtext(19);
            i0.ɵɵpipe(20, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "mat-option", 10);
            i0.ɵɵtext(22);
            i0.ɵɵpipe(23, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "mat-option", 11);
            i0.ɵɵtext(25);
            i0.ɵɵpipe(26, "t");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(27, "mat-form-field", 5)(28, "mat-icon", 6);
            i0.ɵɵtext(29, "location_city");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "mat-label");
            i0.ɵɵtext(31);
            i0.ɵɵpipe(32, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(33, "mat-select", 12);
            i0.ɵɵlistener("selectionChange", function WelcomeComponent_Template_mat_select_selectionChange_33_listener($event) { return ctx.setCity($event.value); });
            i0.ɵɵtemplate(34, WelcomeComponent_mat_option_34_Template, 2, 2, "mat-option", 13);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(35, "div", 14)(36, "p", 15);
            i0.ɵɵtext(37);
            i0.ɵɵpipe(38, "t");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(39, "div", 16)(40, "button", 17);
            i0.ɵɵlistener("click", function WelcomeComponent_Template_button_click_40_listener() { return ctx.start(); });
            i0.ɵɵtext(41);
            i0.ɵɵpipe(42, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "button", 18);
            i0.ɵɵlistener("click", function WelcomeComponent_Template_button_click_43_listener() { return ctx.goToPartnerRegistration(); });
            i0.ɵɵtext(44);
            i0.ɵɵpipe(45, "t");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(46, "div", 19)(47, "button", 20);
            i0.ɵɵlistener("click", function WelcomeComponent_Template_button_click_47_listener() { return ctx.showCodeInput = !ctx.showCodeInput; });
            i0.ɵɵtext(48);
            i0.ɵɵpipe(49, "t");
            i0.ɵɵpipe(50, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(51, WelcomeComponent_section_51_Template, 10, 10, "section", 21);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵattribute("alt", i0.ɵɵpipeBind1(4, 17, "common.appName"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 19, "common.brandTagline"));
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(13, 21, "common.language"));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", ctx.language);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(17, 23, "common.italian"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(20, 25, "common.english"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(23, 27, "common.french"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(26, 29, "common.spanish"));
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(32, 31, "home.city"));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", ctx.selectedCityId)("disabled", ctx.loadingCities || !ctx.cities.length);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.cities);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(38, 33, "welcome.description"));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(42, 35, "common.enter"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(45, 37, "common.becomePartner"), " ");
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate1(" ", ctx.showCodeInput ? i0.ɵɵpipeBind1(49, 39, "welcome.hideInviteQuestion") : i0.ɵɵpipeBind1(50, 41, "welcome.inviteQuestion"), " ");
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngIf", ctx.showCodeInput);
        } }, dependencies: [i7.NgForOf, i7.NgIf, i8.DefaultValueAccessor, i8.NgControlStatus, i8.NgModel, i9.MatButton, i10.MatFormField, i10.MatLabel, i10.MatPrefix, i11.MatIcon, i12.MatInput, i13.MatSelect, i13.MatOption, i14.TranslatePipe], styles: [".welcome[_ngcontent-%COMP%] {\n  display: grid;\n  align-content: start;\n  justify-items: center;\n  gap: 12px;\n  background: transparent;\n}\n\n.welcome-stage[_ngcontent-%COMP%] {\n  width: min(100%, 760px);\n  display: grid;\n  justify-items: center;\n  gap: 12px;\n}\n\n.welcome-card[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n  border-radius: 28px;\n  padding: 18px 18px 22px;\n  display: grid;\n  justify-items: center;\n  gap: 14px;\n  text-align: center;\n  background:\n    radial-gradient(circle at top left, rgba(87, 160, 217, 0.18) 0%, rgba(87, 160, 217, 0) 40%),\n    radial-gradient(circle at right 18% bottom 18%, rgba(32, 124, 87, 0.12) 0%, rgba(32, 124, 87, 0) 32%),\n    linear-gradient(145deg, #fbfcfb 0%, #f5f7f3 42%, #ffffff 100%);\n  border: 1px solid rgba(173, 154, 121, 0.16);\n  box-shadow:\n    0 20px 38px rgba(15, 47, 79, 0.08),\n    0 8px 18px rgba(123, 96, 55, 0.08);\n}\n\n.welcome-card[_ngcontent-%COMP%]::before, \n.welcome-card[_ngcontent-%COMP%]::after {\n  content: '';\n  position: absolute;\n  border-radius: 999px;\n  pointer-events: none;\n}\n\n.welcome-card[_ngcontent-%COMP%]::before {\n  width: 180px;\n  height: 180px;\n  top: -88px;\n  right: -56px;\n  background: rgba(31, 118, 180, 0.06);\n}\n\n.welcome-card[_ngcontent-%COMP%]::after {\n  width: 130px;\n  height: 130px;\n  left: -42px;\n  bottom: -48px;\n  background: rgba(201, 149, 42, 0.08);\n}\n\n.brand-logo[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  display: block;\n  width: 100%;\n  max-height: 112px;\n  height: auto;\n  object-fit: contain;\n}\n\n.brand-slogan[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  margin: 0;\n  max-width: 30ch;\n  font-size: 1.02rem;\n  font-weight: 700;\n  line-height: 1.45;\n  color: #17385c;\n}\n\n.welcome-select[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: min(360px, 100%);\n}\n\n.welcome-select-icon[_ngcontent-%COMP%] {\n  color: #4f6785;\n  margin-left: 14px;\n  margin-right: 8px;\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n\n.welcome-select[_ngcontent-%COMP%]     .mat-mdc-text-field-wrapper {\n  height: 44px;\n  border-radius: 16px;\n  background: rgba(235, 244, 255, 0.58);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);\n  backdrop-filter: blur(10px);\n}\n\n.welcome-select[_ngcontent-%COMP%]     .mat-mdc-form-field-flex {\n  height: 100%;\n  align-items: center;\n}\n\n.welcome-select[_ngcontent-%COMP%]     .mdc-line-ripple {\n  display: none;\n}\n\n.welcome-select[_ngcontent-%COMP%]     .mat-mdc-form-field-infix {\n  min-height: 44px;\n  padding: 0 14px 0 0;\n  display: flex;\n  align-items: center;\n}\n\n.welcome-select[_ngcontent-%COMP%]     .mat-mdc-select {\n  font-size: 0.98rem;\n  font-weight: 700;\n  color: #18375b;\n}\n\n.welcome-select[_ngcontent-%COMP%]     .mat-mdc-select-arrow {\n  color: #4c6481;\n}\n\n.welcome-select[_ngcontent-%COMP%]     .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n\n.welcome-select[_ngcontent-%COMP%]     .mdc-floating-label {\n  color: #60748f !important;\n  font-weight: 600;\n}\n\n.welcome-description-card[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  padding: 14px;\n  border-radius: var(--radius-main);\n  border: 1px solid var(--user-surface-border);\n  background: var(--user-surface-bg);\n  box-shadow: var(--user-surface-shadow);\n}\n\n.welcome-description[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #4d6481;\n  line-height: 1.5;\n  font-size: 0.96rem;\n  font-weight: 500;\n}\n\n.welcome-actions[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: min(420px, 100%);\n  display: grid;\n  gap: 10px;\n}\n\n.welcome-cta[_ngcontent-%COMP%] {\n  min-height: 52px;\n  border-radius: 14px !important;\n  font-size: 1.02rem;\n  font-weight: 600;\n  letter-spacing: 0;\n}\n\n.primary-cta[_ngcontent-%COMP%] {\n  box-shadow: 0 10px 20px rgba(23, 105, 170, 0.18);\n}\n\n.secondary-cta[_ngcontent-%COMP%] {\n  border-color: rgba(23, 105, 170, 0.34) !important;\n  color: #1769aa !important;\n  background: rgba(255, 255, 255, 0.78) !important;\n}\n\n.invite-box[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  justify-items: center;\n  gap: 10px;\n  padding-bottom: 34px;\n}\n\n.invite-toggle[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0 4px;\n  font-size: 0.94rem;\n  font-weight: 700;\n  color: #1769aa !important;\n}\n\n.code-box[_ngcontent-%COMP%] {\n  width: min(420px, 100%);\n  padding: 14px;\n  display: grid;\n  gap: 12px;\n}\n\n.full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n@media (max-width: 600px) {\n  .welcome-card[_ngcontent-%COMP%] {\n    border-radius: 24px;\n    padding: 14px 14px 18px;\n    gap: 12px;\n  }\n\n  .brand-logo[_ngcontent-%COMP%] {\n    max-height: 82px;\n  }\n\n  .brand-slogan[_ngcontent-%COMP%] {\n    font-size: 0.96rem;\n  }\n\n  .welcome-select[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WelcomeComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-welcome', template: "<section class=\"welcome page-shell\">\n  <div class=\"welcome-stage\">\n    <div class=\"welcome-card card\">\n      <img class=\"brand-logo\" src=\"/assets/logo.png\" [attr.alt]=\"'common.appName' | t\" loading=\"eager\" decoding=\"sync\" fetchpriority=\"high\" />\n      <p class=\"brand-slogan\">{{ 'common.brandTagline' | t }}</p>\n\n      <mat-form-field appearance=\"fill\" class=\"welcome-select\">\n        <mat-icon matPrefix fontSet=\"material-icons-round\" class=\"welcome-select-icon\">language</mat-icon>\n        <mat-label>{{ 'common.language' | t }}</mat-label>\n        <mat-select [value]=\"language\" (selectionChange)=\"setLanguage($event.value)\">\n          <mat-option value=\"it\">{{ 'common.italian' | t }}</mat-option>\n          <mat-option value=\"en\">{{ 'common.english' | t }}</mat-option>\n          <mat-option value=\"fr\">{{ 'common.french' | t }}</mat-option>\n          <mat-option value=\"es\">{{ 'common.spanish' | t }}</mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <mat-form-field appearance=\"fill\" class=\"welcome-select\">\n        <mat-icon matPrefix fontSet=\"material-icons-round\" class=\"welcome-select-icon\">location_city</mat-icon>\n        <mat-label>{{ 'home.city' | t }}</mat-label>\n        <mat-select [value]=\"selectedCityId\" (selectionChange)=\"setCity($event.value)\" [disabled]=\"loadingCities || !cities.length\">\n          <mat-option *ngFor=\"let city of cities\" [value]=\"city.id\">{{ cityName(city) }}</mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div class=\"welcome-description-card\">\n        <p class=\"welcome-description\">{{ 'welcome.description' | t }}</p>\n      </div>\n\n      <div class=\"welcome-actions\">\n        <button mat-flat-button color=\"primary\" class=\"big-cta welcome-cta primary-cta\" (click)=\"start()\">{{ 'common.enter' | t }}</button>\n        <button mat-stroked-button color=\"primary\" class=\"big-cta welcome-cta secondary-cta\" (click)=\"goToPartnerRegistration()\">\n          {{ 'common.becomePartner' | t }}\n        </button>\n      </div>\n    </div>\n\n    <div class=\"invite-box\">\n      <button mat-button type=\"button\" class=\"invite-toggle\" color=\"primary\" (click)=\"showCodeInput = !showCodeInput\">\n        {{ showCodeInput ? ('welcome.hideInviteQuestion' | t) : ('welcome.inviteQuestion' | t) }}\n      </button>\n\n      <section class=\"code-box card\" *ngIf=\"showCodeInput\">\n        <mat-form-field appearance=\"outline\" class=\"full-width\">\n          <mat-label>{{ 'welcome.inviteCodeLabel' | t }}</mat-label>\n          <input matInput [(ngModel)]=\"hotelCode\" autocomplete=\"off\" />\n        </mat-form-field>\n\n        <button mat-stroked-button color=\"primary\" [disabled]=\"isCheckingCode\" (click)=\"validateCode()\">\n          {{ isCheckingCode ? ('welcome.checkingCode' | t) : ('welcome.applyAndContinue' | t) }}\n        </button>\n      </section>\n    </div>\n  </div>\n</section>\n\r\n", styles: [".welcome {\n  display: grid;\n  align-content: start;\n  justify-items: center;\n  gap: 12px;\n  background: transparent;\n}\n\n.welcome-stage {\n  width: min(100%, 760px);\n  display: grid;\n  justify-items: center;\n  gap: 12px;\n}\n\n.welcome-card {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n  border-radius: 28px;\n  padding: 18px 18px 22px;\n  display: grid;\n  justify-items: center;\n  gap: 14px;\n  text-align: center;\n  background:\n    radial-gradient(circle at top left, rgba(87, 160, 217, 0.18) 0%, rgba(87, 160, 217, 0) 40%),\n    radial-gradient(circle at right 18% bottom 18%, rgba(32, 124, 87, 0.12) 0%, rgba(32, 124, 87, 0) 32%),\n    linear-gradient(145deg, #fbfcfb 0%, #f5f7f3 42%, #ffffff 100%);\n  border: 1px solid rgba(173, 154, 121, 0.16);\n  box-shadow:\n    0 20px 38px rgba(15, 47, 79, 0.08),\n    0 8px 18px rgba(123, 96, 55, 0.08);\n}\n\n.welcome-card::before,\n.welcome-card::after {\n  content: '';\n  position: absolute;\n  border-radius: 999px;\n  pointer-events: none;\n}\n\n.welcome-card::before {\n  width: 180px;\n  height: 180px;\n  top: -88px;\n  right: -56px;\n  background: rgba(31, 118, 180, 0.06);\n}\n\n.welcome-card::after {\n  width: 130px;\n  height: 130px;\n  left: -42px;\n  bottom: -48px;\n  background: rgba(201, 149, 42, 0.08);\n}\n\n.brand-logo {\n  position: relative;\n  z-index: 1;\n  display: block;\n  width: 100%;\n  max-height: 112px;\n  height: auto;\n  object-fit: contain;\n}\n\n.brand-slogan {\n  position: relative;\n  z-index: 1;\n  margin: 0;\n  max-width: 30ch;\n  font-size: 1.02rem;\n  font-weight: 700;\n  line-height: 1.45;\n  color: #17385c;\n}\n\n.welcome-select {\n  position: relative;\n  z-index: 1;\n  width: min(360px, 100%);\n}\n\n.welcome-select-icon {\n  color: #4f6785;\n  margin-left: 14px;\n  margin-right: 8px;\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n\n.welcome-select ::ng-deep .mat-mdc-text-field-wrapper {\n  height: 44px;\n  border-radius: 16px;\n  background: rgba(235, 244, 255, 0.58);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);\n  backdrop-filter: blur(10px);\n}\n\n.welcome-select ::ng-deep .mat-mdc-form-field-flex {\n  height: 100%;\n  align-items: center;\n}\n\n.welcome-select ::ng-deep .mdc-line-ripple {\n  display: none;\n}\n\n.welcome-select ::ng-deep .mat-mdc-form-field-infix {\n  min-height: 44px;\n  padding: 0 14px 0 0;\n  display: flex;\n  align-items: center;\n}\n\n.welcome-select ::ng-deep .mat-mdc-select {\n  font-size: 0.98rem;\n  font-weight: 700;\n  color: #18375b;\n}\n\n.welcome-select ::ng-deep .mat-mdc-select-arrow {\n  color: #4c6481;\n}\n\n.welcome-select ::ng-deep .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n\n.welcome-select ::ng-deep .mdc-floating-label {\n  color: #60748f !important;\n  font-weight: 600;\n}\n\n.welcome-description-card {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  padding: 14px;\n  border-radius: var(--radius-main);\n  border: 1px solid var(--user-surface-border);\n  background: var(--user-surface-bg);\n  box-shadow: var(--user-surface-shadow);\n}\n\n.welcome-description {\n  margin: 0;\n  color: #4d6481;\n  line-height: 1.5;\n  font-size: 0.96rem;\n  font-weight: 500;\n}\n\n.welcome-actions {\n  position: relative;\n  z-index: 1;\n  width: min(420px, 100%);\n  display: grid;\n  gap: 10px;\n}\n\n.welcome-cta {\n  min-height: 52px;\n  border-radius: 14px !important;\n  font-size: 1.02rem;\n  font-weight: 600;\n  letter-spacing: 0;\n}\n\n.primary-cta {\n  box-shadow: 0 10px 20px rgba(23, 105, 170, 0.18);\n}\n\n.secondary-cta {\n  border-color: rgba(23, 105, 170, 0.34) !important;\n  color: #1769aa !important;\n  background: rgba(255, 255, 255, 0.78) !important;\n}\n\n.invite-box {\n  width: 100%;\n  display: grid;\n  justify-items: center;\n  gap: 10px;\n  padding-bottom: 34px;\n}\n\n.invite-toggle {\n  min-width: 0;\n  padding: 0 4px;\n  font-size: 0.94rem;\n  font-weight: 700;\n  color: #1769aa !important;\n}\n\n.code-box {\n  width: min(420px, 100%);\n  padding: 14px;\n  display: grid;\n  gap: 12px;\n}\n\n.full-width {\n  width: 100%;\n}\n\n@media (max-width: 600px) {\n  .welcome-card {\n    border-radius: 24px;\n    padding: 14px 14px 18px;\n    gap: 12px;\n  }\n\n  .brand-logo {\n    max-height: 82px;\n  }\n\n  .brand-slogan {\n    font-size: 0.96rem;\n  }\n\n  .welcome-select {\n    width: 100%;\n  }\n}\n"] }]
    }], () => [{ type: i1.Router }, { type: i2.MatSnackBar }, { type: i3.AppStateService }, { type: i4.PoiService }, { type: i5.PurchaseService }, { type: i6.I18nService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(WelcomeComponent, { className: "WelcomeComponent", filePath: "src/app/features/welcome/welcome.component.ts", lineNumber: 18 }); })();
