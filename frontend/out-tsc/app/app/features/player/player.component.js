import { Component } from '@angular/core';
import { combineLatest, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../../core/services/poi.service";
import * as i3 from "../../core/services/purchase.service";
import * as i4 from "../../core/services/player.service";
import * as i5 from "../../core/services/offline.service";
import * as i6 from "@angular/common";
import * as i7 from "@angular/material/snack-bar";
import * as i8 from "@angular/forms";
import * as i9 from "@angular/material/button";
import * as i10 from "@angular/material/card";
import * as i11 from "@angular/material/icon";
import * as i12 from "@angular/material/progress-spinner";
import * as i13 from "@angular/material/slide-toggle";
import * as i14 from "../../shared/pipes/duration-label.pipe";
function PlayerComponent_section_0_section_10_mat_slide_toggle_17_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-slide-toggle", 19);
    i0.ɵɵlistener("ngModelChange", function PlayerComponent_section_0_section_10_mat_slide_toggle_17_Template_mat_slide_toggle_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleOffline($event)); });
    i0.ɵɵtext(1, " Scarica offline ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngModel", ctx_r1.offlineEnabled);
} }
function PlayerComponent_section_0_section_10_p_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 20);
    i0.ɵɵtext(1, "Preview terminata. Sblocca questo luogo o l'intera citt\u00E0 per ascolto completo.");
    i0.ɵɵelementEnd();
} }
function PlayerComponent_section_0_section_10_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 11)(1, "input", 12);
    i0.ɵɵlistener("input", function PlayerComponent_section_0_section_10_Template_input_input_1_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.seek($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 13)(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 14)(8, "button", 15);
    i0.ɵɵlistener("click", function PlayerComponent_section_0_section_10_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.skip(-15)); });
    i0.ɵɵelementStart(9, "mat-icon", 5);
    i0.ɵɵtext(10, "replay_10");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "button", 16);
    i0.ɵɵlistener("click", function PlayerComponent_section_0_section_10_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.togglePlay()); });
    i0.ɵɵelementStart(12, "mat-icon", 5);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "button", 15);
    i0.ɵɵlistener("click", function PlayerComponent_section_0_section_10_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.skip(15)); });
    i0.ɵɵelementStart(15, "mat-icon", 5);
    i0.ɵɵtext(16, "forward_10");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(17, PlayerComponent_section_0_section_10_mat_slide_toggle_17_Template, 2, 1, "mat-slide-toggle", 17)(18, PlayerComponent_section_0_section_10_p_18_Template, 2, 0, "p", 18);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const state_r5 = ctx.ngIf;
    const currentPoi_r6 = i0.ɵɵnextContext().ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("max", ctx_r1.previewMode ? ctx_r1.previewSeconds : state_r5.duration || currentPoi_r6.durationSec)("value", state_r5.currentTime);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.formatClock(state_r5.currentTime));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatClock(ctx_r1.previewMode ? ctx_r1.previewSeconds : state_r5.duration || currentPoi_r6.durationSec));
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(state_r5.isPlaying ? "pause" : "play_arrow");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r1.canToggleOffline);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", state_r5.previewEnded);
} }
function PlayerComponent_section_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 3)(1, "button", 4);
    i0.ɵɵlistener("click", function PlayerComponent_section_0_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBack()); });
    i0.ɵɵelementStart(2, "mat-icon", 5);
    i0.ɵɵtext(3, "arrow_back");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(4, "img", 6);
    i0.ɵɵelementStart(5, "h1", 7);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 8);
    i0.ɵɵtext(8);
    i0.ɵɵpipe(9, "durationLabel");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, PlayerComponent_section_0_section_10_Template, 19, 7, "section", 9);
    i0.ɵɵpipe(11, "async");
    i0.ɵɵelementStart(12, "p", 10);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const currentPoi_r6 = ctx.ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("src", currentPoi_r6.imageUrl, i0.ɵɵsanitizeUrl)("alt", currentPoi_r6.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(currentPoi_r6.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", ctx_r1.previewMode ? "Modalit\u00E0 preview " + ctx_r1.previewSeconds + "s" : "Audio completo", " \u00B7 ", i0.ɵɵpipeBind1(9, 7, currentPoi_r6.durationSec), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", i0.ɵɵpipeBind1(11, 9, ctx_r1.playerState$));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(currentPoi_r6.descriptionLong);
} }
function PlayerComponent_section_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 21);
    i0.ɵɵelement(1, "mat-progress-spinner", 22);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Caricamento audio guida...");
    i0.ɵɵelementEnd()();
} }
function PlayerComponent_section_2_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 23)(1, "mat-card", 24)(2, "p");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 25);
    i0.ɵɵlistener("click", function PlayerComponent_section_2_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBack()); });
    i0.ɵɵtext(5, "Torna indietro");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.loadError ? "Audio guida non disponibile o backend non raggiungibile." : "Contenuto non trovato.");
} }
export class PlayerComponent {
    constructor(route, router, poiService, purchaseService, playerService, offlineService, location, snackBar) {
        this.route = route;
        this.router = router;
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.playerService = playerService;
        this.offlineService = offlineService;
        this.location = location;
        this.snackBar = snackBar;
        this.previewMode = false;
        this.unlocked = false;
        this.offlineEnabled = false;
        this.loading = true;
        this.loadError = false;
        this.previewSeconds = environment.previewSeconds;
        this.playerState$ = this.playerService.state$;
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.purchaseService.refresh();
        combineLatest([
            this.route.paramMap.pipe(map((params) => String(params.get('id')))),
            this.route.queryParamMap.pipe(map((params) => params.get('preview') === 'true'))
        ])
            .pipe(tap(() => {
            this.loading = true;
            this.loadError = false;
            this.poi = undefined;
        }), switchMap(([poiId, preview]) => this.poiService.getPoiById(poiId).pipe(map((poi) => ({
            poi,
            preview
        })))), takeUntil(this.destroy$))
            .subscribe({
            next: async ({ poi, preview }) => {
                this.poi = poi;
                this.previewMode = preview;
                this.unlocked = this.purchaseService.isPoiUnlocked(poi.id, poi.cityId);
                if (!this.unlocked && !preview) {
                    this.snackBar.open('Contenuto bloccato. Avvio preview.', 'OK', { duration: 2400 });
                    this.previewMode = true;
                }
                this.playerService.loadTrack(poi.id, poi.audioUrl, this.previewMode);
                this.offlineEnabled = await this.offlineService.isPoiOffline(poi.id);
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.loadError = true;
                this.poi = undefined;
            }
        });
        this.purchaseService.purchases$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.poi) {
                this.unlocked = this.purchaseService.isPoiUnlocked(this.poi.id, this.poi.cityId);
            }
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.playerService.pause();
    }
    goBack() {
        if (window.history.length > 1) {
            this.location.back();
            return;
        }
        if (this.poi) {
            void this.router.navigate(['/poi', this.poi.id]);
            return;
        }
        void this.router.navigate(['/home']);
    }
    togglePlay() {
        this.playerService.togglePlayPause();
    }
    seek(event) {
        const value = Number(event.target.value);
        this.playerService.seek(value);
    }
    skip(deltaSeconds) {
        this.playerService.skipBy(deltaSeconds);
    }
    async toggleOffline(value) {
        if (!this.poi) {
            this.offlineEnabled = false;
            return;
        }
        if (!this.canToggleOffline) {
            this.offlineEnabled = false;
            this.snackBar.open('Download offline disponibile solo dopo sblocco completo.', 'OK', { duration: 2400 });
            return;
        }
        if (!value) {
            this.offlineEnabled = value;
            return;
        }
        await this.offlineService.cachePoiAssets(this.poi.id, [this.poi.audioUrl, this.poi.imageUrl]);
        this.offlineEnabled = true;
        this.snackBar.open('Disponibile offline', 'OK', { duration: 2200 });
    }
    get canToggleOffline() {
        return this.unlocked && !this.previewMode;
    }
    formatClock(value) {
        if (!Number.isFinite(value) || value <= 0) {
            return '0:00';
        }
        const minutes = Math.floor(value / 60);
        const seconds = Math.floor(value % 60)
            .toString()
            .padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
    static { this.ɵfac = function PlayerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlayerComponent)(i0.ɵɵdirectiveInject(i1.ActivatedRoute), i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.PoiService), i0.ɵɵdirectiveInject(i3.PurchaseService), i0.ɵɵdirectiveInject(i4.PlayerService), i0.ɵɵdirectiveInject(i5.OfflineService), i0.ɵɵdirectiveInject(i6.Location), i0.ɵɵdirectiveInject(i7.MatSnackBar)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlayerComponent, selectors: [["app-player"]], standalone: false, decls: 3, vars: 3, consts: [["class", "player-page page-shell", 4, "ngIf"], ["class", "page-shell loading-shell", 4, "ngIf"], ["class", "page-shell player-page", 4, "ngIf"], [1, "player-page", "page-shell"], ["mat-icon-button", "", 1, "back", 3, "click"], ["fontSet", "material-icons-round"], [1, "hero-image", 3, "src", "alt"], [1, "page-title"], [1, "page-subtitle"], ["class", "player card", 4, "ngIf"], [1, "description"], [1, "player", "card"], ["type", "range", 1, "progress", 3, "input", "max", "value"], [1, "time-row"], [1, "controls"], ["mat-mini-fab", "", "color", "primary", 3, "click"], ["mat-fab", "", "color", "primary", 3, "click"], [3, "ngModel", "ngModelChange", 4, "ngIf"], ["class", "preview-note", 4, "ngIf"], [3, "ngModelChange", "ngModel"], [1, "preview-note"], [1, "page-shell", "loading-shell"], ["mode", "indeterminate", "diameter", "48"], [1, "page-shell", "player-page"], [1, "card", "warning"], ["mat-stroked-button", "", "color", "primary", 3, "click"]], template: function PlayerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, PlayerComponent_section_0_Template, 14, 11, "section", 0)(1, PlayerComponent_section_1_Template, 4, 0, "section", 1)(2, PlayerComponent_section_2_Template, 6, 1, "section", 2);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.poi);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && !ctx.poi);
        } }, dependencies: [i6.NgIf, i8.NgControlStatus, i8.NgModel, i9.MatButton, i9.MatIconButton, i9.MatMiniFabButton, i9.MatFabButton, i10.MatCard, i11.MatIcon, i12.MatProgressSpinner, i13.MatSlideToggle, i6.AsyncPipe, i14.DurationLabelPipe], styles: [".player-page[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 14px;\n}\n\n.back[_ngcontent-%COMP%] {\n  width: fit-content;\n}\n\n.player[_ngcontent-%COMP%] {\n  padding: 16px;\n  display: grid;\n  gap: 12px;\n}\n\n.progress[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.time-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  color: #6c7a93;\n  font-size: 0.86rem;\n}\n\n.controls[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 18px;\n  margin: 8px 0;\n}\n\n.preview-note[_ngcontent-%COMP%], \n.description[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #5e6f88;\n  line-height: 1.5;\n  white-space: pre-line;\n}\n\n.warning[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5d6d86;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlayerComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-player', template: "<section class=\"player-page page-shell\" *ngIf=\"poi as currentPoi\">\n  <button mat-icon-button class=\"back\" (click)=\"goBack()\">\n    <mat-icon fontSet=\"material-icons-round\">arrow_back</mat-icon>\n  </button>\n\n  <img class=\"hero-image\" [src]=\"currentPoi.imageUrl\" [alt]=\"currentPoi.name\" />\n\n  <h1 class=\"page-title\">{{ currentPoi.name }}</h1>\n  <p class=\"page-subtitle\">\n    {{ previewMode ? ('Modalit\u00E0 preview ' + previewSeconds + 's') : 'Audio completo' }} \u00B7 {{ currentPoi.durationSec | durationLabel }}\n  </p>\n\n  <section class=\"player card\" *ngIf=\"playerState$ | async as state\">\n    <input\n      type=\"range\"\n      class=\"progress\"\n      [max]=\"previewMode ? previewSeconds : (state.duration || currentPoi.durationSec)\"\n      [value]=\"state.currentTime\"\n      (input)=\"seek($event)\"\n    />\n\n    <div class=\"time-row\">\n      <span>{{ formatClock(state.currentTime) }}</span>\n      <span>{{ formatClock(previewMode ? previewSeconds : (state.duration || currentPoi.durationSec)) }}</span>\n    </div>\n\n    <div class=\"controls\">\n      <button mat-mini-fab color=\"primary\" (click)=\"skip(-15)\">\n        <mat-icon fontSet=\"material-icons-round\">replay_10</mat-icon>\n      </button>\n\n      <button mat-fab color=\"primary\" (click)=\"togglePlay()\">\n        <mat-icon fontSet=\"material-icons-round\">{{ state.isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>\n      </button>\n\n      <button mat-mini-fab color=\"primary\" (click)=\"skip(15)\">\n        <mat-icon fontSet=\"material-icons-round\">forward_10</mat-icon>\n      </button>\n    </div>\n\n    <mat-slide-toggle *ngIf=\"canToggleOffline\" [ngModel]=\"offlineEnabled\" (ngModelChange)=\"toggleOffline($event)\">\n      Scarica offline\n    </mat-slide-toggle>\n\n    <p class=\"preview-note\" *ngIf=\"state.previewEnded\">Preview terminata. Sblocca questo luogo o l'intera citt\u00E0 per ascolto completo.</p>\n  </section>\n\n  <p class=\"description\">{{ currentPoi.descriptionLong }}</p>\n</section>\n\n<section class=\"page-shell loading-shell\" *ngIf=\"loading\">\n  <mat-progress-spinner mode=\"indeterminate\" diameter=\"48\"></mat-progress-spinner>\n  <p>Caricamento audio guida...</p>\n</section>\n\n<section class=\"page-shell player-page\" *ngIf=\"!loading && !poi\">\n  <mat-card class=\"card warning\">\n    <p>{{ loadError ? 'Audio guida non disponibile o backend non raggiungibile.' : 'Contenuto non trovato.' }}</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"goBack()\">Torna indietro</button>\n  </mat-card>\n</section>\n", styles: [".player-page {\n  display: grid;\n  gap: 14px;\n}\n\n.back {\n  width: fit-content;\n}\n\n.player {\n  padding: 16px;\n  display: grid;\n  gap: 12px;\n}\n\n.progress {\n  width: 100%;\n}\n\n.time-row {\n  display: flex;\n  justify-content: space-between;\n  color: #6c7a93;\n  font-size: 0.86rem;\n}\n\n.controls {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 18px;\n  margin: 8px 0;\n}\n\n.preview-note,\n.description {\n  margin: 0;\n  color: #5e6f88;\n  line-height: 1.5;\n  white-space: pre-line;\n}\n\n.warning {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5d6d86;\n  }\n}\r\n"] }]
    }], () => [{ type: i1.ActivatedRoute }, { type: i1.Router }, { type: i2.PoiService }, { type: i3.PurchaseService }, { type: i4.PlayerService }, { type: i5.OfflineService }, { type: i6.Location }, { type: i7.MatSnackBar }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlayerComponent, { className: "PlayerComponent", filePath: "frontend/src/app/features/player/player.component.ts", lineNumber: 19 }); })();
