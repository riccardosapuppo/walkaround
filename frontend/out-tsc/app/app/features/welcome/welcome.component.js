import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/material/snack-bar";
import * as i3 from "../../core/services/app-state.service";
import * as i4 from "../../core/services/purchase.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/forms";
import * as i7 from "@angular/material/button";
import * as i8 from "@angular/material/form-field";
import * as i9 from "@angular/material/input";
function WelcomeComponent_section_11_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 8)(1, "mat-form-field", 9)(2, "mat-label");
    i0.ɵɵtext(3, "Codice invito/sconto");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 10);
    i0.ɵɵtwoWayListener("ngModelChange", function WelcomeComponent_section_11_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.hotelCode, $event) || (ctx_r1.hotelCode = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "button", 11);
    i0.ɵɵlistener("click", function WelcomeComponent_section_11_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.validateCode()); });
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.hotelCode);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isCheckingCode);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isCheckingCode ? "Controllo in corso..." : "Applica e continua", " ");
} }
export class WelcomeComponent {
    constructor(router, snackBar, appState, purchaseService) {
        this.router = router;
        this.snackBar = snackBar;
        this.appState = appState;
        this.purchaseService = purchaseService;
        this.hotelCode = '';
        this.isCheckingCode = false;
        this.showCodeInput = false;
        this.hotelCode = this.appState.hotelCode;
    }
    start() {
        this.appState.markOnboardingSeen();
        this.appState.setActiveCity('catania');
        this.purchaseService.refresh();
        void this.router.navigate(['/home']);
    }
    validateCode() {
        const trimmed = this.hotelCode.trim();
        if (!trimmed) {
            this.snackBar.open('Inserisci un codice invito/sconto', 'Chiudi', { duration: 2200 });
            return;
        }
        this.isCheckingCode = true;
        this.purchaseService.validateHotelCode(trimmed).subscribe({
            next: (response) => {
                this.isCheckingCode = false;
                if (!response.valid || !response.association) {
                    this.snackBar.open(response.message || 'Il codice inserito non esiste', 'OK', { duration: 2800 });
                    return;
                }
                if (response.association.codeStatus !== 'valid') {
                    const invalidMessage = response.association.codeStatus === 'expired'
                        ? 'Il codice inserito e scaduto'
                        : response.association.codeStatus === 'used'
                            ? 'Il codice inserito è già stato utilizzato'
                            : 'Il codice inserito non è piu valido';
                    this.snackBar.open(invalidMessage, 'OK', { duration: 2800 });
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
                const message = error?.error?.message || 'Errore validazione codice';
                this.snackBar.open(message, 'Chiudi', { duration: 2800 });
            }
        });
    }
    static { this.ɵfac = function WelcomeComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WelcomeComponent)(i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.MatSnackBar), i0.ɵɵdirectiveInject(i3.AppStateService), i0.ɵɵdirectiveInject(i4.PurchaseService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: WelcomeComponent, selectors: [["app-welcome"]], standalone: false, decls: 12, vars: 1, consts: [[1, "welcome", "page-shell"], ["src", "/public/images/catania/piazza-duomo-ct.jpg", "alt", "Catania e Etna", 1, "hero"], [1, "page-title"], [1, "page-subtitle"], [1, "welcome-actions"], ["mat-flat-button", "", "color", "primary", 1, "big-cta", 3, "click"], ["mat-button", "", "color", "primary", 3, "click"], ["class", "code-box card", 4, "ngIf"], [1, "code-box", "card"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "autocomplete", "off", 3, "ngModelChange", "ngModel"], ["mat-stroked-button", "", "color", "primary", 3, "click", "disabled"]], template: function WelcomeComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0);
            i0.ɵɵelement(1, "img", 1);
            i0.ɵɵelementStart(2, "h1", 2);
            i0.ɵɵtext(3, "Scopri la citt\u00E0 intorno a te");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p", 3);
            i0.ɵɵtext(5, "Audio guide automatiche nei luoghi che visiti");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div", 4)(7, "button", 5);
            i0.ɵɵlistener("click", function WelcomeComponent_Template_button_click_7_listener() { return ctx.start(); });
            i0.ɵɵtext(8, "Inizia");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "button", 6);
            i0.ɵɵlistener("click", function WelcomeComponent_Template_button_click_9_listener() { return ctx.showCodeInput = !ctx.showCodeInput; });
            i0.ɵɵtext(10, " Inserisci codice invito/sconto ");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(11, WelcomeComponent_section_11_Template, 7, 3, "section", 7);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(11);
            i0.ɵɵproperty("ngIf", ctx.showCodeInput);
        } }, dependencies: [i5.NgIf, i6.DefaultValueAccessor, i6.NgControlStatus, i6.NgModel, i7.MatButton, i8.MatFormField, i8.MatLabel, i9.MatInput], styles: [".welcome[_ngcontent-%COMP%] {\n  display: grid;\n  align-content: start;\n  gap: 20px;\n}\n\n.hero[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 22px;\n  box-shadow: 0 10px 28px rgba(17, 42, 73, 0.12);\n}\n\n.welcome-actions[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n}\n\n.code-box[_ngcontent-%COMP%] {\n  padding: 16px;\n  display: grid;\n  gap: 12px;\n}\n\n.full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WelcomeComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-welcome', template: "<section class=\"welcome page-shell\">\n  <img class=\"hero\" src=\"/public/images/catania/piazza-duomo-ct.jpg\" alt=\"Catania e Etna\" />\n\n  <h1 class=\"page-title\">Scopri la citt\u00E0 intorno a te</h1>\n  <p class=\"page-subtitle\">Audio guide automatiche nei luoghi che visiti</p>\n\n  <div class=\"welcome-actions\">\n    <button mat-flat-button color=\"primary\" class=\"big-cta\" (click)=\"start()\">Inizia</button>\n\n    <button mat-button color=\"primary\" (click)=\"showCodeInput = !showCodeInput\">\n      Inserisci codice invito/sconto\n    </button>\n  </div>\n\n  <section class=\"code-box card\" *ngIf=\"showCodeInput\">\n    <mat-form-field appearance=\"outline\" class=\"full-width\">\n      <mat-label>Codice invito/sconto</mat-label>\n      <input matInput [(ngModel)]=\"hotelCode\" autocomplete=\"off\" />\n    </mat-form-field>\n\n    <button mat-stroked-button color=\"primary\" [disabled]=\"isCheckingCode\" (click)=\"validateCode()\">\n      {{ isCheckingCode ? 'Controllo in corso...' : 'Applica e continua' }}\n    </button>\n  </section>\n</section>\n", styles: [".welcome {\n  display: grid;\n  align-content: start;\n  gap: 20px;\n}\n\n.hero {\n  width: 100%;\n  border-radius: 22px;\n  box-shadow: 0 10px 28px rgba(17, 42, 73, 0.12);\n}\n\n.welcome-actions {\n  display: grid;\n  gap: 8px;\n}\n\n.code-box {\n  padding: 16px;\n  display: grid;\n  gap: 12px;\n}\n\n.full-width {\n  width: 100%;\n}\r\n"] }]
    }], () => [{ type: i1.Router }, { type: i2.MatSnackBar }, { type: i3.AppStateService }, { type: i4.PurchaseService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(WelcomeComponent, { className: "WelcomeComponent", filePath: "src/app/features/welcome/welcome.component.ts", lineNumber: 13 }); })();
