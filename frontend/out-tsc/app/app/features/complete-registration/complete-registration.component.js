import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@angular/router";
import * as i3 from "../../core/services/admin-auth.service";
import * as i4 from "@angular/material/snack-bar";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/card";
import * as i8 from "@angular/material/form-field";
import * as i9 from "@angular/material/input";
import * as i10 from "@angular/material/progress-spinner";
function CompleteRegistrationComponent_div_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6);
    i0.ɵɵelement(1, "mat-spinner", 7);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Verifica link in corso...");
    i0.ɵɵelementEnd()();
} }
function CompleteRegistrationComponent_ng_container_5_p_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 14);
    i0.ɵɵtext(1, "Imposta la password per: ");
    i0.ɵɵelementStart(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.email);
} }
function CompleteRegistrationComponent_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, CompleteRegistrationComponent_ng_container_5_p_1_Template, 4, 1, "p", 8);
    i0.ɵɵelementStart(2, "form", 9);
    i0.ɵɵlistener("ngSubmit", function CompleteRegistrationComponent_ng_container_5_Template_form_ngSubmit_2_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.submit()); });
    i0.ɵɵelementStart(3, "mat-form-field", 10)(4, "mat-label");
    i0.ɵɵtext(5, "Nuova password");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(6, "input", 11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "mat-form-field", 10)(8, "mat-label");
    i0.ɵɵtext(9, "Conferma password");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(10, "input", 12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 13);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.email);
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("disabled", ctx_r1.submitting);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.submitting ? "Salvataggio..." : ctx_r1.submitLabel, " ");
} }
function CompleteRegistrationComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.completedMessage, " ");
} }
function CompleteRegistrationComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵtext(1, " Utente gia registrato. Reindirizzamento al login... ");
    i0.ɵɵelementEnd();
} }
function CompleteRegistrationComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "button", 16);
    i0.ɵɵlistener("click", function CompleteRegistrationComponent_div_8_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goToLogin()); });
    i0.ɵɵtext(3, "Vai al login");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.expiredMessage, " ");
} }
function CompleteRegistrationComponent_div_9_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵtext(1, " Link non valido. ");
    i0.ɵɵelementStart(2, "button", 16);
    i0.ɵɵlistener("click", function CompleteRegistrationComponent_div_9_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goToLogin()); });
    i0.ɵɵtext(3, "Vai al login");
    i0.ɵɵelementEnd()();
} }
export class CompleteRegistrationComponent {
    constructor(formBuilder, route, router, auth, snackBar) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.auth = auth;
        this.snackBar = snackBar;
        this.state = 'loading';
        this.mode = 'invite';
        this.email = '';
        this.token = '';
        this.submitting = false;
        this.form = this.formBuilder.nonNullable.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]]
        });
    }
    ngOnInit() {
        this.token = String(this.route.snapshot.queryParamMap.get('token') || '').trim();
        const modeParam = String(this.route.snapshot.queryParamMap.get('mode') || '').trim().toLowerCase();
        this.mode = modeParam === 'reset' ? 'reset' : 'invite';
        if (!this.token) {
            this.state = 'invalid';
            return;
        }
        this.checkStatus();
    }
    ngOnDestroy() {
        if (this.redirectTimeoutId) {
            clearTimeout(this.redirectTimeoutId);
        }
    }
    submit() {
        if (this.state !== 'valid' || this.submitting || this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const { password, confirmPassword } = this.form.getRawValue();
        if (password !== confirmPassword) {
            this.snackBar.open('Le password non coincidono', 'Chiudi', { duration: 2800 });
            return;
        }
        this.submitting = true;
        const request$ = this.mode === 'reset'
            ? this.auth.completePasswordReset(this.token, password)
            : this.auth.completeInvitation(this.token, password);
        request$.subscribe({
            next: () => {
                this.submitting = false;
                this.state = 'completed';
                const successMessage = this.mode === 'reset' ? 'Password aggiornata' : 'Registrazione completata';
                this.snackBar.open(successMessage, 'OK', { duration: 2200 });
                this.redirectTimeoutId = window.setTimeout(() => {
                    const queryParams = this.mode === 'reset' ? { passwordReset: 1 } : { registered: 1 };
                    void this.router.navigate(['/dashboard'], { queryParams });
                }, 1100);
            },
            error: (error) => {
                this.submitting = false;
                const status = error?.error?.status;
                if (this.mode === 'invite' && status === 'already_registered') {
                    this.state = 'already_registered';
                    this.redirectTimeoutId = window.setTimeout(() => {
                        void this.router.navigate(['/dashboard'], { queryParams: { alreadyRegistered: 1 } });
                    }, 1200);
                    return;
                }
                if (status === 'expired') {
                    this.state = 'expired';
                    return;
                }
                this.state = 'invalid';
                const fallbackMessage = this.mode === 'reset' ? 'Impossibile aggiornare la password' : 'Impossibile completare registrazione';
                this.snackBar.open(error?.error?.message || fallbackMessage, 'Chiudi', {
                    duration: 3200
                });
            }
        });
    }
    goToLogin() {
        void this.router.navigate(['/dashboard']);
    }
    checkStatus() {
        this.state = 'loading';
        const request$ = this.mode === 'reset' ? this.auth.getPasswordResetStatus(this.token) : this.auth.getInvitationStatus(this.token);
        request$.subscribe({
            next: (status) => {
                this.applyStatus(status);
            },
            error: () => {
                this.state = 'invalid';
            }
        });
    }
    applyStatus(status) {
        this.email = status.email || '';
        if (status.status === 'valid') {
            this.state = 'valid';
            return;
        }
        if (this.mode === 'invite' && status.status === 'already_registered') {
            this.state = 'already_registered';
            this.redirectTimeoutId = window.setTimeout(() => {
                void this.router.navigate(['/dashboard'], { queryParams: { alreadyRegistered: 1 } });
            }, 1200);
            return;
        }
        if (status.status === 'expired') {
            this.state = 'expired';
            return;
        }
        this.state = 'invalid';
    }
    get pageTitle() {
        return this.mode === 'reset' ? 'Reset password' : 'Completa registrazione';
    }
    get submitLabel() {
        return this.mode === 'reset' ? 'Aggiorna password' : 'Completa registrazione';
    }
    get completedMessage() {
        return this.mode === 'reset'
            ? 'Password aggiornata. Reindirizzamento al login...'
            : 'Registrazione completata. Reindirizzamento al login...';
    }
    get expiredMessage() {
        return this.mode === 'reset'
            ? 'Link reset scaduto. Richiedi un nuovo reset password dalla dashboard admin.'
            : 'Link scaduto. Richiedi un nuovo invito dalla dashboard admin.';
    }
    static { this.ɵfac = function CompleteRegistrationComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CompleteRegistrationComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ActivatedRoute), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i3.AdminAuthService), i0.ɵɵdirectiveInject(i4.MatSnackBar)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CompleteRegistrationComponent, selectors: [["app-complete-registration"]], standalone: false, decls: 10, vars: 7, consts: [[1, "page-shell", "registration-shell"], [1, "card", "registration-card"], [1, "page-title"], ["class", "loading-state", 4, "ngIf"], [4, "ngIf"], ["class", "state-message", 4, "ngIf"], [1, "loading-state"], ["diameter", "34"], ["class", "page-subtitle", 4, "ngIf"], [1, "registration-form", 3, "ngSubmit", "formGroup"], ["appearance", "outline"], ["matInput", "", "type", "password", "formControlName", "password", "autocomplete", "new-password"], ["matInput", "", "type", "password", "formControlName", "confirmPassword", "autocomplete", "new-password"], ["mat-flat-button", "", "color", "primary", "type", "submit", 1, "big-cta", 3, "disabled"], [1, "page-subtitle"], [1, "state-message"], ["mat-stroked-button", "", "color", "primary", 3, "click"]], template: function CompleteRegistrationComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "mat-card", 1)(2, "h1", 2);
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(4, CompleteRegistrationComponent_div_4_Template, 4, 0, "div", 3)(5, CompleteRegistrationComponent_ng_container_5_Template, 13, 4, "ng-container", 4)(6, CompleteRegistrationComponent_div_6_Template, 2, 1, "div", 5)(7, CompleteRegistrationComponent_div_7_Template, 2, 0, "div", 5)(8, CompleteRegistrationComponent_div_8_Template, 4, 1, "div", 5)(9, CompleteRegistrationComponent_div_9_Template, 4, 0, "div", 5);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.pageTitle);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.state === "loading");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.state === "valid");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.state === "completed");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.state === "already_registered");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.state === "expired");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.state === "invalid");
        } }, dependencies: [i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i6.MatButton, i7.MatCard, i8.MatFormField, i8.MatLabel, i9.MatInput, i10.MatProgressSpinner], styles: [".registration-shell[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n}\n\n.registration-card[_ngcontent-%COMP%] {\n  width: min(520px, 100%);\n  padding: 24px;\n}\n\n.registration-form[_ngcontent-%COMP%] {\n  margin-top: 18px;\n  display: grid;\n  gap: 12px;\n}\n\n.state-message[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  display: grid;\n  gap: 12px;\n  color: #23314c;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CompleteRegistrationComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-complete-registration', template: "<section class=\"page-shell registration-shell\">\n  <mat-card class=\"card registration-card\">\n    <h1 class=\"page-title\">{{ pageTitle }}</h1>\n\n    <div class=\"loading-state\" *ngIf=\"state === 'loading'\">\n      <mat-spinner diameter=\"34\"></mat-spinner>\n      <p>Verifica link in corso...</p>\n    </div>\n\n    <ng-container *ngIf=\"state === 'valid'\">\n      <p class=\"page-subtitle\" *ngIf=\"email\">Imposta la password per: <strong>{{ email }}</strong></p>\n\n      <form [formGroup]=\"form\" (ngSubmit)=\"submit()\" class=\"registration-form\">\n        <mat-form-field appearance=\"outline\">\n          <mat-label>Nuova password</mat-label>\n          <input matInput type=\"password\" formControlName=\"password\" autocomplete=\"new-password\" />\n        </mat-form-field>\n\n        <mat-form-field appearance=\"outline\">\n          <mat-label>Conferma password</mat-label>\n          <input matInput type=\"password\" formControlName=\"confirmPassword\" autocomplete=\"new-password\" />\n        </mat-form-field>\n\n        <button mat-flat-button color=\"primary\" class=\"big-cta\" [disabled]=\"submitting\" type=\"submit\">\n          {{ submitting ? 'Salvataggio...' : submitLabel }}\n        </button>\n      </form>\n    </ng-container>\n\n    <div class=\"state-message\" *ngIf=\"state === 'completed'\">\n      {{ completedMessage }}\n    </div>\n\n    <div class=\"state-message\" *ngIf=\"state === 'already_registered'\">\n      Utente gia registrato. Reindirizzamento al login...\n    </div>\n\n    <div class=\"state-message\" *ngIf=\"state === 'expired'\">\n      {{ expiredMessage }}\n      <button mat-stroked-button color=\"primary\" (click)=\"goToLogin()\">Vai al login</button>\n    </div>\n\n    <div class=\"state-message\" *ngIf=\"state === 'invalid'\">\n      Link non valido.\n      <button mat-stroked-button color=\"primary\" (click)=\"goToLogin()\">Vai al login</button>\n    </div>\n  </mat-card>\n</section>\r\n", styles: [".registration-shell {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n}\n\n.registration-card {\n  width: min(520px, 100%);\n  padding: 24px;\n}\n\n.registration-form {\n  margin-top: 18px;\n  display: grid;\n  gap: 12px;\n}\n\n.state-message {\n  margin-top: 14px;\n  display: grid;\n  gap: 12px;\n  color: #23314c;\n}\n"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.AdminAuthService }, { type: i4.MatSnackBar }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CompleteRegistrationComponent, { className: "CompleteRegistrationComponent", filePath: "frontend/src/app/features/complete-registration/complete-registration.component.ts", lineNumber: 20 }); })();
