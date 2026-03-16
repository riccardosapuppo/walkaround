import { Component } from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/poi.service";
import * as i2 from "../../core/services/app-state.service";
import * as i3 from "../../core/services/purchase.service";
import * as i4 from "@angular/material/snack-bar";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/card";
import * as i8 from "@angular/material/form-field";
import * as i9 from "@angular/material/progress-spinner";
import * as i10 from "@angular/material/select";
function ProfileComponent_section_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 8);
    i0.ɵɵelement(1, "mat-progress-spinner", 9);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Caricamento profilo...");
    i0.ɵɵelementEnd()();
} }
function ProfileComponent_ng_container_7_mat_option_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const city_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", city_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(city_r3.name);
} }
function ProfileComponent_ng_container_7_p_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Scadenza codice attivo: ");
    i0.ɵɵelementStart(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.inviteCodeExpiresAt);
} }
function ProfileComponent_ng_container_7_p_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, " Struttura associata: ");
    i0.ɵɵelementStart(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.hotelAssociation.structureName);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" (", ctx_r1.hotelAssociation.structureAddress, ") ");
} }
function ProfileComponent_ng_container_7_ng_template_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Nessuna struttura associata al codice attivo.");
    i0.ɵɵelementEnd();
} }
function ProfileComponent_ng_container_7_div_26_div_5_small_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const entry_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Scadenza: ", i0.ɵɵpipeBind4(2, 1, entry_r4.expiresAt, "dd/MM/yyyy HH:mm", "", "it-IT"), "");
} }
function ProfileComponent_ng_container_7_div_26_div_5_small_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const entry_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Usato il: ", i0.ɵɵpipeBind4(2, 1, entry_r4.usedAt, "dd/MM/yyyy HH:mm", "", "it-IT"), "");
} }
function ProfileComponent_ng_container_7_div_26_div_5_button_15_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 34);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_7_div_26_div_5_button_15_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const entry_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.removeInviteCodeAssociation(entry_r4)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.removingInviteCode ? "Rimozione..." : "Rimuovi codice", " ");
} }
function ProfileComponent_ng_container_7_div_26_div_5_ng_template_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 35);
    i0.ɵɵtext(1, "Codice usato o non attivo: non rimovibile");
    i0.ɵɵelementEnd();
} }
function ProfileComponent_ng_container_7_div_26_div_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30)(1, "div", 31)(2, "code");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "small");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "small");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "small");
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(12, ProfileComponent_ng_container_7_div_26_div_5_small_12_Template, 3, 6, "small", 7)(13, ProfileComponent_ng_container_7_div_26_div_5_small_13_Template, 3, 6, "small", 7);
    i0.ɵɵelementStart(14, "div", 32);
    i0.ɵɵtemplate(15, ProfileComponent_ng_container_7_div_26_div_5_button_15_Template, 2, 1, "button", 33)(16, ProfileComponent_ng_container_7_div_26_div_5_ng_template_16_Template, 2, 0, "ng-template", null, 2, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const entry_r4 = ctx.$implicit;
    const codeNotRemovable_r6 = i0.ɵɵreference(17);
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(entry_r4.inviteCode);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.codeEntryStatusClass(entry_r4));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.codeEntryStatusLabel(entry_r4));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Struttura: ", entry_r4.structureName || "Struttura non disponibile", "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Ambito: ", ctx_r1.codeEntryScopeLabel(entry_r4), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Citt\u00E0: ", ctx_r1.codeEntryCitiesLabel(entry_r4), "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", entry_r4.expiresAt);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", entry_r4.usedAt);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.canRemoveCodeEntry(entry_r4))("ngIfElse", codeNotRemovable_r6);
} }
function ProfileComponent_ng_container_7_div_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 27)(1, "p")(2, "strong");
    i0.ɵɵtext(3, "Lista codici:");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "div", 28);
    i0.ɵɵtemplate(5, ProfileComponent_ng_container_7_div_26_div_5_Template, 18, 11, "div", 29);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngForOf", ctx_r1.hotelCodeEntries);
} }
function ProfileComponent_ng_container_7_ng_template_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Nessun codice attivato o usato.");
    i0.ɵɵelementEnd();
} }
function ProfileComponent_ng_container_7_span_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 36);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "titlecase");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cityId_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, cityId_r7));
} }
function ProfileComponent_ng_container_7_span_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 37);
    i0.ɵɵtext(1, "Nessuna citt\u00E0 sbloccata");
    i0.ɵɵelementEnd();
} }
function ProfileComponent_ng_container_7_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "mat-card", 10)(2, "h3");
    i0.ɵɵtext(3, "Citt\u00E0 attiva");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "mat-form-field", 11)(5, "mat-label");
    i0.ɵɵtext(6, "Citt\u00E0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "mat-select", 12);
    i0.ɵɵlistener("selectionChange", function ProfileComponent_ng_container_7_Template_mat_select_selectionChange_7_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setCity($event.value)); });
    i0.ɵɵtemplate(8, ProfileComponent_ng_container_7_mat_option_8_Template, 2, 2, "mat-option", 13);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(9, "mat-card", 10)(10, "h3");
    i0.ɵɵtext(11, "Codici invito/sconto");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "p");
    i0.ɵɵtext(13, "Gestisci i codici associati al tuo profilo.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "p");
    i0.ɵɵtext(15, "Codice attivo: ");
    i0.ɵɵelementStart(16, "strong");
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "p");
    i0.ɵɵtext(19, "Stato codice attivo: ");
    i0.ɵɵelementStart(20, "strong");
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(22, ProfileComponent_ng_container_7_p_22_Template, 4, 1, "p", 7)(23, ProfileComponent_ng_container_7_p_23_Template, 5, 2, "p", 14)(24, ProfileComponent_ng_container_7_ng_template_24_Template, 2, 0, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor)(26, ProfileComponent_ng_container_7_div_26_Template, 6, 1, "div", 15)(27, ProfileComponent_ng_container_7_ng_template_27_Template, 2, 0, "ng-template", null, 1, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "mat-card", 10)(30, "h3");
    i0.ɵɵtext(31, "Citt\u00E0 sbloccate");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div", 16);
    i0.ɵɵtemplate(33, ProfileComponent_ng_container_7_span_33_Template, 3, 3, "span", 17)(34, ProfileComponent_ng_container_7_span_34_Template, 2, 0, "span", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "div", 19)(36, "button", 20);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_7_Template_button_click_36_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.restorePurchases()); });
    i0.ɵɵtext(37, "Ripristina acquisti");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "button", 21);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_7_Template_button_click_38_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.resetUserSession()); });
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(40, "mat-card", 10)(41, "h3");
    i0.ɵɵtext(42, "Lingua");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "div", 19)(44, "button", 22);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_7_Template_button_click_44_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setLanguage("it")); });
    i0.ɵɵtext(45, " IT ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "button", 22);
    i0.ɵɵlistener("click", function ProfileComponent_ng_container_7_Template_button_click_46_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setLanguage("en")); });
    i0.ɵɵtext(47, " EN ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(48, "mat-card", 23)(49, "a", 24);
    i0.ɵɵtext(50, "Supporto");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "a", 25);
    i0.ɵɵtext(52, "Privacy");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const noAssociation_r8 = i0.ɵɵreference(25);
    const noCodeHistory_r9 = i0.ɵɵreference(28);
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("value", ctx_r1.activeCityId);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.cities);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate(ctx_r1.hotelCode);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.inviteCodeStatusText);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.hotelAssociation);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.hotelAssociation)("ngIfElse", noAssociation_r8);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.hotelCodeEntries.length)("ngIfElse", noCodeHistory_r9);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngForOf", ctx_r1.unlockedCityIds);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.unlockedCityIds.length);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.resettingUserSession);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.resettingUserSession ? "Reset in corso..." : "Reset utente", " ");
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("color", ctx_r1.language === "it" ? "primary" : undefined);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("color", ctx_r1.language === "en" ? "primary" : undefined);
} }
export class ProfileComponent {
    constructor(poiService, appState, purchaseService, snackBar) {
        this.poiService = poiService;
        this.appState = appState;
        this.purchaseService = purchaseService;
        this.snackBar = snackBar;
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
        this.snackBar.open(`Lingua impostata: ${language.toUpperCase()}`, 'OK', { duration: 1800 });
    }
    get hasStoredInviteCode() {
        return this.hotelCode !== '-' || !!this.hotelAssociation;
    }
    get inviteCodeStatusText() {
        const status = this.hotelAssociation?.codeStatus || (this.hasStoredInviteCode ? 'invalid' : null);
        if (status === 'valid') {
            return 'Attivato (non usato)';
        }
        if (status === 'used') {
            return 'Usato';
        }
        if (status === 'expired') {
            return 'Scaduto';
        }
        if (status === 'invalid') {
            return 'Non valido';
        }
        return 'Nessun codice';
    }
    get inviteCodeExpiresAt() {
        const value = this.hotelAssociation?.expiresAt || '';
        if (!value) {
            return '-';
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '-';
        }
        return new Intl.DateTimeFormat('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
    removeInviteCodeAssociation(entry) {
        if (this.removingInviteCode) {
            return;
        }
        if (entry && !this.canRemoveCodeEntry(entry)) {
            this.snackBar.open('Questo codice e gia usato e non puo essere rimosso', 'Chiudi', { duration: 2500 });
            return;
        }
        if (!entry && !this.hasStoredInviteCode) {
            return;
        }
        const codeLabel = entry?.inviteCode || this.hotelAssociation?.inviteCode || this.hotelCode;
        const confirmed = window.confirm(`Rimuovere il codice ${codeLabel || 'selezionato'}?`);
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
                this.snackBar.open('Codice invito/sconto rimosso', 'OK', { duration: 2200 });
            },
            error: (error) => {
                this.removingInviteCode = false;
                const message = error?.error?.message || 'Impossibile rimuovere il codice in questo momento';
                this.snackBar.open(message, 'Chiudi', { duration: 3200 });
            }
        });
    }
    restorePurchases() {
        this.purchaseService.refresh();
        this.snackBar.open('Acquisti ripristinati (simulato)', 'OK', { duration: 2200 });
    }
    codeEntryStatusLabel(entry) {
        if (entry.status === 'activated') {
            return 'Attivato';
        }
        if (entry.status === 'used') {
            return 'Usato';
        }
        if (entry.status === 'expired') {
            return 'Scaduto';
        }
        return 'Non valido';
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
            return 'Pacchetto citta';
        }
        if (entry.appliesTo === 'single') {
            return 'Luogo singolo';
        }
        return '-';
    }
    codeEntryCitiesLabel(entry) {
        const names = Array.isArray(entry.cityNames) ? entry.cityNames.map((name) => String(name || '').trim()).filter(Boolean) : [];
        if (names.length) {
            return names.join(', ');
        }
        if (entry.cityName) {
            return entry.cityName;
        }
        const ids = Array.isArray(entry.cityIds) ? entry.cityIds.map((id) => String(id || '').trim()).filter(Boolean) : [];
        if (ids.length) {
            return ids.join(', ');
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
        const confirmed = window.confirm('Vuoi avviare una nuova sessione utente? Verranno rimossi codice invito/sconto e dati locali del profilo.');
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
            this.snackBar.open('Sessione utente resettata', 'OK', { duration: 2400 });
        };
        finalizeReset();
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
    static { this.ɵfac = function ProfileComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ProfileComponent)(i0.ɵɵdirectiveInject(i1.PoiService), i0.ɵɵdirectiveInject(i2.AppStateService), i0.ɵɵdirectiveInject(i3.PurchaseService), i0.ɵɵdirectiveInject(i4.MatSnackBar)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ProfileComponent, selectors: [["app-profile"]], standalone: false, decls: 8, vars: 2, consts: [["noAssociation", ""], ["noCodeHistory", ""], ["codeNotRemovable", ""], [1, "page-shell", "profile"], [1, "page-title"], [1, "page-subtitle"], ["class", "loading-shell", 4, "ngIf"], [4, "ngIf"], [1, "loading-shell"], ["mode", "indeterminate", "diameter", "44"], [1, "card", "section"], ["appearance", "outline", 1, "full-width"], [3, "selectionChange", "value"], [3, "value", 4, "ngFor", "ngForOf"], [4, "ngIf", "ngIfElse"], ["class", "code-history", 4, "ngIf", "ngIfElse"], [1, "chips"], ["class", "status-chip unlocked", 4, "ngFor", "ngForOf"], ["class", "status-chip locked", 4, "ngIf"], [1, "language-row"], ["mat-stroked-button", "", "color", "primary", 3, "click"], ["mat-stroked-button", "", "color", "warn", "type", "button", 3, "click", "disabled"], ["mat-stroked-button", "", 3, "click", "color"], [1, "card", "section", "links"], ["href", "mailto:support@tourism-guide-demo.app"], ["href", "https://example.com/privacy", "target", "_blank", "rel", "noopener"], [3, "value"], [1, "code-history"], [1, "code-history-list"], ["class", "code-history-item", 4, "ngFor", "ngForOf"], [1, "code-history-item"], [1, "code-history-row"], [1, "code-entry-actions"], ["mat-stroked-button", "", "color", "warn", "type", "button", 3, "click", 4, "ngIf", "ngIfElse"], ["mat-stroked-button", "", "color", "warn", "type", "button", 3, "click"], [1, "code-entry-locked"], [1, "status-chip", "unlocked"], [1, "status-chip", "locked"]], template: function ProfileComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 3)(1, "header")(2, "h1", 4);
            i0.ɵɵtext(3, "Profilo e impostazioni");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p", 5);
            i0.ɵɵtext(5, "Gestione citt\u00E0, lingua e supporto");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(6, ProfileComponent_section_6_Template, 4, 0, "section", 6)(7, ProfileComponent_ng_container_7_Template, 53, 15, "ng-container", 7);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading);
        } }, dependencies: [i5.NgForOf, i5.NgIf, i6.MatButton, i7.MatCard, i8.MatFormField, i8.MatLabel, i9.MatProgressSpinner, i10.MatSelect, i10.MatOption, i5.TitleCasePipe, i5.DatePipe], styles: [".profile[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n}\n\n.section[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  h3 {\n    margin: 0;\n    font-size: 1.05rem;\n  }\n\n  p {\n    margin: 0;\n    color: #677790;\n  }\n}\n\n.full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.chips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.language-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n}\n\n.code-history[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n}\n\n.code-history-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n}\n\n.code-history-item[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 4px;\n  padding: 8px 10px;\n  border-radius: 10px;\n  border: 1px solid #d9e3f2;\n  background: #f8fbff;\n}\n\n.code-history-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.code-history-item[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 0.9rem;\n}\n\n.code-entry-actions[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  display: flex;\n  justify-content: flex-end;\n}\n\n.code-entry-locked[_ngcontent-%COMP%] {\n  color: #7a879c;\n  font-size: 0.8rem;\n}\n\n.status-chip.pending[_ngcontent-%COMP%] {\n  color: #9a3412;\n  background: #fff4e5;\n  border: 1px solid #f6cf9b;\n}\n\n.links[_ngcontent-%COMP%] {\n  a {\n    color: #1769aa;\n    font-weight: 600;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ProfileComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-profile', template: "<section class=\"page-shell profile\">\n  <header>\n    <h1 class=\"page-title\">Profilo e impostazioni</h1>\n    <p class=\"page-subtitle\">Gestione citt\u00E0, lingua e supporto</p>\n  </header>\n\n  <section class=\"loading-shell\" *ngIf=\"loading\">\n    <mat-progress-spinner mode=\"indeterminate\" diameter=\"44\"></mat-progress-spinner>\n    <p>Caricamento profilo...</p>\n  </section>\n\n  <ng-container *ngIf=\"!loading\">\n    <mat-card class=\"card section\">\n      <h3>Citt\u00E0 attiva</h3>\n      <mat-form-field appearance=\"outline\" class=\"full-width\">\n        <mat-label>Citt\u00E0</mat-label>\n        <mat-select [value]=\"activeCityId\" (selectionChange)=\"setCity($event.value)\">\n          <mat-option *ngFor=\"let city of cities\" [value]=\"city.id\">{{ city.name }}</mat-option>\n        </mat-select>\n      </mat-form-field>\n    </mat-card>\n\n    <mat-card class=\"card section\">\n      <h3>Codici invito/sconto</h3>\n      <p>Gestisci i codici associati al tuo profilo.</p>\n      <p>Codice attivo: <strong>{{ hotelCode }}</strong></p>\n      <p>Stato codice attivo: <strong>{{ inviteCodeStatusText }}</strong></p>\n      <p *ngIf=\"hotelAssociation\">Scadenza codice attivo: <strong>{{ inviteCodeExpiresAt }}</strong></p>\n      <p *ngIf=\"hotelAssociation; else noAssociation\">\n        Struttura associata: <strong>{{ hotelAssociation.structureName }}</strong>\n        ({{ hotelAssociation.structureAddress }})\n      </p>\n      <ng-template #noAssociation>\n        <p>Nessuna struttura associata al codice attivo.</p>\n      </ng-template>\n\n      <div class=\"code-history\" *ngIf=\"hotelCodeEntries.length; else noCodeHistory\">\n        <p><strong>Lista codici:</strong></p>\n        <div class=\"code-history-list\">\n          <div class=\"code-history-item\" *ngFor=\"let entry of hotelCodeEntries\">\n            <div class=\"code-history-row\">\n              <code>{{ entry.inviteCode }}</code>\n              <span [class]=\"codeEntryStatusClass(entry)\">{{ codeEntryStatusLabel(entry) }}</span>\n            </div>\n            <small>Struttura: {{ entry.structureName || 'Struttura non disponibile' }}</small>\n            <small>Ambito: {{ codeEntryScopeLabel(entry) }}</small>\n            <small>Citt\u00E0: {{ codeEntryCitiesLabel(entry) }}</small>\n            <small *ngIf=\"entry.expiresAt\">Scadenza: {{ entry.expiresAt | date: 'dd/MM/yyyy HH:mm':'':'it-IT' }}</small>\n            <small *ngIf=\"entry.usedAt\">Usato il: {{ entry.usedAt | date: 'dd/MM/yyyy HH:mm':'':'it-IT' }}</small>\n            <div class=\"code-entry-actions\">\n              <button\n                mat-stroked-button\n                color=\"warn\"\n                type=\"button\"\n                *ngIf=\"canRemoveCodeEntry(entry); else codeNotRemovable\"\n                (click)=\"removeInviteCodeAssociation(entry)\"\n              >\n                {{ removingInviteCode ? 'Rimozione...' : 'Rimuovi codice' }}\n              </button>\n              <ng-template #codeNotRemovable>\n                <small class=\"code-entry-locked\">Codice usato o non attivo: non rimovibile</small>\n              </ng-template>\n            </div>\n          </div>\n        </div>\n      </div>\n      <ng-template #noCodeHistory>\n        <p>Nessun codice attivato o usato.</p>\n      </ng-template>\n    </mat-card>\n\n    <mat-card class=\"card section\">\n      <h3>Citt\u00E0 sbloccate</h3>\n      <div class=\"chips\">\n        <span class=\"status-chip unlocked\" *ngFor=\"let cityId of unlockedCityIds\">{{ cityId | titlecase }}</span>\n        <span class=\"status-chip locked\" *ngIf=\"!unlockedCityIds.length\">Nessuna citt\u00E0 sbloccata</span>\n      </div>\n\n      <div class=\"language-row\">\n        <button mat-stroked-button color=\"primary\" (click)=\"restorePurchases()\">Ripristina acquisti</button>\n        <button\n          mat-stroked-button\n          color=\"warn\"\n          type=\"button\"\n          [disabled]=\"resettingUserSession\"\n          (click)=\"resetUserSession()\"\n        >\n          {{ resettingUserSession ? 'Reset in corso...' : 'Reset utente' }}\n        </button>\n      </div>\n    </mat-card>\n\n    <mat-card class=\"card section\">\n      <h3>Lingua</h3>\n      <div class=\"language-row\">\n        <button mat-stroked-button [color]=\"language === 'it' ? 'primary' : undefined\" (click)=\"setLanguage('it')\">\n          IT\n        </button>\n        <button mat-stroked-button [color]=\"language === 'en' ? 'primary' : undefined\" (click)=\"setLanguage('en')\">\n          EN\n        </button>\n      </div>\n    </mat-card>\n\n    <mat-card class=\"card section links\">\n      <a href=\"mailto:support@tourism-guide-demo.app\">Supporto</a>\n      <a href=\"https://example.com/privacy\" target=\"_blank\" rel=\"noopener\">Privacy</a>\n    </mat-card>\n  </ng-container>\n</section>\n", styles: [".profile {\n  display: grid;\n  gap: 12px;\n}\n\n.section {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  h3 {\n    margin: 0;\n    font-size: 1.05rem;\n  }\n\n  p {\n    margin: 0;\n    color: #677790;\n  }\n}\n\n.full-width {\n  width: 100%;\n}\n\n.chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.language-row {\n  display: flex;\n  gap: 8px;\n}\n\n.code-history {\n  display: grid;\n  gap: 8px;\n}\n\n.code-history-list {\n  display: grid;\n  gap: 8px;\n}\n\n.code-history-item {\n  display: grid;\n  gap: 4px;\n  padding: 8px 10px;\n  border-radius: 10px;\n  border: 1px solid #d9e3f2;\n  background: #f8fbff;\n}\n\n.code-history-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.code-history-item code {\n  font-weight: 700;\n  font-size: 0.9rem;\n}\n\n.code-entry-actions {\n  margin-top: 6px;\n  display: flex;\n  justify-content: flex-end;\n}\n\n.code-entry-locked {\n  color: #7a879c;\n  font-size: 0.8rem;\n}\n\n.status-chip.pending {\n  color: #9a3412;\n  background: #fff4e5;\n  border: 1px solid #f6cf9b;\n}\n\n.links {\n  a {\n    color: #1769aa;\n    font-weight: 600;\n  }\n}\r\n"] }]
    }], () => [{ type: i1.PoiService }, { type: i2.AppStateService }, { type: i3.PurchaseService }, { type: i4.MatSnackBar }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ProfileComponent, { className: "ProfileComponent", filePath: "frontend/src/app/features/profile/profile.component.ts", lineNumber: 15 }); })();
