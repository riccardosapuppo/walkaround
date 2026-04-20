import { Component } from '@angular/core';
import { combineLatest, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../../core/services/poi.service";
import * as i3 from "../../core/services/purchase.service";
import * as i4 from "../../core/services/player.service";
import * as i5 from "../../core/services/offline.service";
import * as i6 from "../../core/services/i18n.service";
import * as i7 from "@angular/common";
import * as i8 from "@angular/material/snack-bar";
import * as i9 from "@angular/forms";
import * as i10 from "@angular/material/button";
import * as i11 from "@angular/material/card";
import * as i12 from "@angular/material/icon";
import * as i13 from "@angular/material/progress-spinner";
import * as i14 from "@angular/material/slide-toggle";
import * as i15 from "../../shared/directives/img-fallback.directive";
import * as i16 from "../../shared/pipes/duration-label.pipe";
import * as i17 from "../../shared/pipes/translate.pipe";
const _c0 = a0 => ({ seconds: a0 });
function PlayerComponent_section_0_p_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const currentPoi_r3 = i0.ɵɵnextContext().ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.poiAudioLabel(currentPoi_r3));
} }
function PlayerComponent_section_0_section_15_ng_container_1_mat_slide_toggle_17_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-slide-toggle", 23);
    i0.ɵɵlistener("ngModelChange", function PlayerComponent_section_0_section_15_ng_container_1_mat_slide_toggle_17_Template_mat_slide_toggle_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.toggleOffline($event)); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("ngModel", ctx_r1.offlineEnabled);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 2, "player.downloadOffline"), " ");
} }
function PlayerComponent_section_0_section_15_ng_container_1_p_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 24);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, "player.previewEnded"), " ");
} }
function PlayerComponent_section_0_section_15_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "input", 16);
    i0.ɵɵlistener("input", function PlayerComponent_section_0_section_15_ng_container_1_Template_input_input_1_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.seek($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 17)(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 18)(8, "button", 19);
    i0.ɵɵlistener("click", function PlayerComponent_section_0_section_15_ng_container_1_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.skip(-15)); });
    i0.ɵɵelementStart(9, "mat-icon", 6);
    i0.ɵɵtext(10, "replay_10");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "button", 20);
    i0.ɵɵlistener("click", function PlayerComponent_section_0_section_15_ng_container_1_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.togglePlay()); });
    i0.ɵɵelementStart(12, "mat-icon", 6);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "button", 19);
    i0.ɵɵlistener("click", function PlayerComponent_section_0_section_15_ng_container_1_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.skip(15)); });
    i0.ɵɵelementStart(15, "mat-icon", 6);
    i0.ɵɵtext(16, "forward_10");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(17, PlayerComponent_section_0_section_15_ng_container_1_mat_slide_toggle_17_Template, 3, 4, "mat-slide-toggle", 21)(18, PlayerComponent_section_0_section_15_ng_container_1_p_18_Template, 3, 3, "p", 22);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const state_r6 = ctx.ngIf;
    const currentPoi_r3 = i0.ɵɵnextContext(2).ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("max", ctx_r1.previewMode ? ctx_r1.previewSeconds : state_r6.duration || currentPoi_r3.durationSec)("value", state_r6.currentTime);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.formatClock(state_r6.currentTime));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatClock(ctx_r1.previewMode ? ctx_r1.previewSeconds : state_r6.duration || currentPoi_r3.durationSec));
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(state_r6.isPlaying ? "pause" : "play_arrow");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r1.canToggleOffline);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", state_r6.previewEnded);
} }
function PlayerComponent_section_0_section_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 14);
    i0.ɵɵtemplate(1, PlayerComponent_section_0_section_15_ng_container_1_Template, 19, 7, "ng-container", 15);
    i0.ɵɵpipe(2, "async");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", i0.ɵɵpipeBind1(2, 1, ctx_r1.playerState$));
} }
function PlayerComponent_section_0_mat_card_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 25)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(3, 1, "player.noAudioTrack"));
} }
function PlayerComponent_section_0_p_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const currentPoi_r3 = i0.ɵɵnextContext().ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.poiDescriptionLong(currentPoi_r3));
} }
function PlayerComponent_section_0_ng_template_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const currentPoi_r3 = i0.ɵɵnextContext().ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.poiDescriptionShort(currentPoi_r3));
} }
function PlayerComponent_section_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 4)(1, "button", 5);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵlistener("click", function PlayerComponent_section_0_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBack()); });
    i0.ɵɵelementStart(3, "mat-icon", 6);
    i0.ɵɵtext(4, "arrow_back");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(5, "img", 7);
    i0.ɵɵelementStart(6, "h1", 8);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, PlayerComponent_section_0_p_8_Template, 2, 1, "p", 9);
    i0.ɵɵelementStart(9, "p", 10);
    i0.ɵɵtext(10);
    i0.ɵɵpipe(11, "t");
    i0.ɵɵpipe(12, "t");
    i0.ɵɵpipe(13, "t");
    i0.ɵɵpipe(14, "durationLabel");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(15, PlayerComponent_section_0_section_15_Template, 3, 3, "section", 11)(16, PlayerComponent_section_0_mat_card_16_Template, 4, 3, "mat-card", 12)(17, PlayerComponent_section_0_p_17_Template, 2, 1, "p", 13)(18, PlayerComponent_section_0_ng_template_18_Template, 2, 1, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const currentPoi_r3 = ctx.ngIf;
    const teaserDescription_r7 = i0.ɵɵreference(19);
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(2, 11, "common.goBack"));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("appImgFallback", currentPoi_r3.imageUrl)("alt", ctx_r1.poiName(currentPoi_r3));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.poiName(currentPoi_r3));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.poiAudioLabel(currentPoi_r3));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", ctx_r1.audioUnavailable ? i0.ɵɵpipeBind1(11, 13, "player.audioUnavailable") : ctx_r1.previewMode ? i0.ɵɵpipeBind2(12, 15, "player.previewLabel", i0.ɵɵpureFunction1(22, _c0, ctx_r1.previewSeconds)) : i0.ɵɵpipeBind1(13, 18, "player.fullAudio"), " - ", i0.ɵɵpipeBind1(14, 20, currentPoi_r3.durationSec), " ");
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", !ctx_r1.audioUnavailable);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.audioUnavailable);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.unlocked && !ctx_r1.previewMode)("ngIfElse", teaserDescription_r7);
} }
function PlayerComponent_section_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 27);
    i0.ɵɵelement(1, "mat-progress-spinner", 28);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 1, "player.loading"));
} }
function PlayerComponent_section_2_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 29)(1, "mat-card", 25)(2, "p");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵpipe(5, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 30);
    i0.ɵɵlistener("click", function PlayerComponent_section_2_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBack()); });
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "t");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.loadError ? i0.ɵɵpipeBind1(4, 2, "player.unavailable") : i0.ɵɵpipeBind1(5, 4, "player.notFound"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 6, "common.goBack"));
} }
export class PlayerComponent {
    constructor(route, router, poiService, purchaseService, playerService, offlineService, i18n, location, snackBar) {
        this.route = route;
        this.router = router;
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.playerService = playerService;
        this.offlineService = offlineService;
        this.i18n = i18n;
        this.location = location;
        this.snackBar = snackBar;
        this.previewMode = false;
        this.unlocked = false;
        this.offlineEnabled = false;
        this.audioUnavailable = false;
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
            this.audioUnavailable = false;
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
                if (!this.hasPlayableAudio(poi)) {
                    this.audioUnavailable = true;
                    this.offlineEnabled = false;
                    this.playerService.pause();
                    this.loading = false;
                    return;
                }
                if (!this.unlocked && !preview) {
                    this.snackBar.open(this.i18n.t('player.blockedPreview'), this.i18n.t('common.ok'), { duration: 2400 });
                    this.previewMode = true;
                }
                this.playerService.loadTrack(poi.id, this.poiAudioUrl(poi), this.previewMode);
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
        if (this.audioUnavailable) {
            return;
        }
        this.playerService.togglePlayPause();
    }
    seek(event) {
        if (this.audioUnavailable) {
            return;
        }
        const value = Number(event.target.value);
        this.playerService.seek(value);
    }
    skip(deltaSeconds) {
        if (this.audioUnavailable) {
            return;
        }
        this.playerService.skipBy(deltaSeconds);
    }
    async toggleOffline(value) {
        if (!this.poi || this.audioUnavailable) {
            this.offlineEnabled = false;
            return;
        }
        if (!this.canToggleOffline) {
            this.offlineEnabled = false;
            this.snackBar.open(this.i18n.t('player.offlineAfterUnlock'), this.i18n.t('common.ok'), { duration: 2400 });
            return;
        }
        if (!value) {
            this.offlineEnabled = value;
            return;
        }
        await this.offlineService.cachePoiAssets(this.poi.id, [this.poiAudioUrl(this.poi), this.poi.imageUrl]);
        this.offlineEnabled = true;
        this.snackBar.open(this.i18n.t('player.availableOffline'), this.i18n.t('common.ok'), { duration: 2200 });
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
    hasPlayableAudio(poi) {
        return Boolean(this.poiAudioUrl(poi));
    }
    poiName(poi) {
        return this.i18n.resolvePoiField(poi?.name, poi?.translations, 'name');
    }
    poiDescriptionShort(poi) {
        return this.i18n.resolvePoiField(poi?.descriptionShort, poi?.translations, 'descriptionShort');
    }
    poiDescriptionLong(poi) {
        return this.i18n.resolvePoiField(poi?.descriptionLong, poi?.translations, 'descriptionLong');
    }
    poiAudioLabel(poi) {
        const label = this.i18n.resolvePoiField(poi?.audioLabel, poi?.translations, 'audioLabel');
        return label && label !== this.poiName(poi) ? label : '';
    }
    poiAudioUrl(poi) {
        return this.i18n.resolvePoiAudioUrl(poi);
    }
    static { this.ɵfac = function PlayerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlayerComponent)(i0.ɵɵdirectiveInject(i1.ActivatedRoute), i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.PoiService), i0.ɵɵdirectiveInject(i3.PurchaseService), i0.ɵɵdirectiveInject(i4.PlayerService), i0.ɵɵdirectiveInject(i5.OfflineService), i0.ɵɵdirectiveInject(i6.I18nService), i0.ɵɵdirectiveInject(i7.Location), i0.ɵɵdirectiveInject(i8.MatSnackBar)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlayerComponent, selectors: [["app-player"]], standalone: false, decls: 3, vars: 3, consts: [["teaserDescription", ""], ["class", "player-page page-shell", 4, "ngIf"], ["class", "page-shell loading-shell", 4, "ngIf"], ["class", "page-shell player-page", 4, "ngIf"], [1, "player-page", "page-shell"], ["mat-icon-button", "", 1, "back", 3, "click"], ["fontSet", "material-icons-round"], [1, "hero-image", 3, "appImgFallback", "alt"], [1, "page-title"], ["class", "page-subtitle", 4, "ngIf"], [1, "page-subtitle"], ["class", "player card", 4, "ngIf"], ["class", "card warning", 4, "ngIf"], ["class", "description", 4, "ngIf", "ngIfElse"], [1, "player", "card"], [4, "ngIf"], ["type", "range", 1, "progress", 3, "input", "max", "value"], [1, "time-row"], [1, "controls"], ["mat-mini-fab", "", "color", "primary", 3, "click"], ["mat-fab", "", "color", "primary", 3, "click"], [3, "ngModel", "ngModelChange", 4, "ngIf"], ["class", "preview-note", 4, "ngIf"], [3, "ngModelChange", "ngModel"], [1, "preview-note"], [1, "card", "warning"], [1, "description"], [1, "page-shell", "loading-shell"], ["mode", "indeterminate", "diameter", "48"], [1, "page-shell", "player-page"], ["mat-stroked-button", "", "color", "primary", 3, "click"]], template: function PlayerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, PlayerComponent_section_0_Template, 20, 24, "section", 1)(1, PlayerComponent_section_1_Template, 5, 3, "section", 2)(2, PlayerComponent_section_2_Template, 9, 8, "section", 3);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.poi);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && !ctx.poi);
        } }, dependencies: [i7.NgIf, i9.NgControlStatus, i9.NgModel, i10.MatButton, i10.MatIconButton, i10.MatMiniFabButton, i10.MatFabButton, i11.MatCard, i12.MatIcon, i13.MatProgressSpinner, i14.MatSlideToggle, i15.ImgFallbackDirective, i7.AsyncPipe, i16.DurationLabelPipe, i17.TranslatePipe], styles: [".player-page[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 14px;\n}\n\n.back[_ngcontent-%COMP%] {\n  width: fit-content;\n}\n\n.player[_ngcontent-%COMP%] {\n  padding: 16px;\n  display: grid;\n  gap: 12px;\n}\n\n.progress[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.time-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  color: #6c7a93;\n  font-size: 0.86rem;\n}\n\n.controls[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 18px;\n  margin: 8px 0;\n}\n\n.preview-note[_ngcontent-%COMP%], \n.description[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #5e6f88;\n  line-height: 1.5;\n  white-space: pre-line;\n}\n\n.warning[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5d6d86;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlayerComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-player', template: "<section class=\"player-page page-shell\" *ngIf=\"poi as currentPoi\">\n  <button mat-icon-button class=\"back\" (click)=\"goBack()\" [attr.aria-label]=\"'common.goBack' | t\">\n    <mat-icon fontSet=\"material-icons-round\">arrow_back</mat-icon>\n  </button>\n\n  <img class=\"hero-image\" [appImgFallback]=\"currentPoi.imageUrl\" [alt]=\"poiName(currentPoi)\" />\n\n  <h1 class=\"page-title\">{{ poiName(currentPoi) }}</h1>\n  <p class=\"page-subtitle\" *ngIf=\"poiAudioLabel(currentPoi)\">{{ poiAudioLabel(currentPoi) }}</p>\n  <p class=\"page-subtitle\">\n    {{ audioUnavailable ? ('player.audioUnavailable' | t) : (previewMode ? ('player.previewLabel' | t:{ seconds: previewSeconds }) : ('player.fullAudio' | t)) }}\n    - {{ currentPoi.durationSec | durationLabel }}\n  </p>\n\n  <section class=\"player card\" *ngIf=\"!audioUnavailable\">\n    <ng-container *ngIf=\"playerState$ | async as state\">\n    <input\n      type=\"range\"\n      class=\"progress\"\n      [max]=\"previewMode ? previewSeconds : (state.duration || currentPoi.durationSec)\"\n      [value]=\"state.currentTime\"\n      (input)=\"seek($event)\"\n    />\n\n    <div class=\"time-row\">\n      <span>{{ formatClock(state.currentTime) }}</span>\n      <span>{{ formatClock(previewMode ? previewSeconds : (state.duration || currentPoi.durationSec)) }}</span>\n    </div>\n\n    <div class=\"controls\">\n      <button mat-mini-fab color=\"primary\" (click)=\"skip(-15)\">\n        <mat-icon fontSet=\"material-icons-round\">replay_10</mat-icon>\n      </button>\n\n      <button mat-fab color=\"primary\" (click)=\"togglePlay()\">\n        <mat-icon fontSet=\"material-icons-round\">{{ state.isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>\n      </button>\n\n      <button mat-mini-fab color=\"primary\" (click)=\"skip(15)\">\n        <mat-icon fontSet=\"material-icons-round\">forward_10</mat-icon>\n      </button>\n    </div>\n\n    <mat-slide-toggle *ngIf=\"canToggleOffline\" [ngModel]=\"offlineEnabled\" (ngModelChange)=\"toggleOffline($event)\">\n      {{ 'player.downloadOffline' | t }}\n    </mat-slide-toggle>\n\n    <p class=\"preview-note\" *ngIf=\"state.previewEnded\">\n      {{ 'player.previewEnded' | t }}\n    </p>\n    </ng-container>\n  </section>\n\n  <mat-card class=\"card warning\" *ngIf=\"audioUnavailable\">\n    <p>{{ 'player.noAudioTrack' | t }}</p>\n  </mat-card>\n\n  <p class=\"description\" *ngIf=\"unlocked && !previewMode; else teaserDescription\">{{ poiDescriptionLong(currentPoi) }}</p>\n  <ng-template #teaserDescription>\n    <p class=\"description\">{{ poiDescriptionShort(currentPoi) }}</p>\n  </ng-template>\n</section>\n\n<section class=\"page-shell loading-shell\" *ngIf=\"loading\">\n  <mat-progress-spinner mode=\"indeterminate\" diameter=\"48\"></mat-progress-spinner>\n  <p>{{ 'player.loading' | t }}</p>\n</section>\n\n<section class=\"page-shell player-page\" *ngIf=\"!loading && !poi\">\n  <mat-card class=\"card warning\">\n    <p>{{ loadError ? ('player.unavailable' | t) : ('player.notFound' | t) }}</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"goBack()\">{{ 'common.goBack' | t }}</button>\n  </mat-card>\n</section>\n\r\n", styles: [".player-page {\n  display: grid;\n  gap: 14px;\n}\n\n.back {\n  width: fit-content;\n}\n\n.player {\n  padding: 16px;\n  display: grid;\n  gap: 12px;\n}\n\n.progress {\n  width: 100%;\n}\n\n.time-row {\n  display: flex;\n  justify-content: space-between;\n  color: #6c7a93;\n  font-size: 0.86rem;\n}\n\n.controls {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 18px;\n  margin: 8px 0;\n}\n\n.preview-note,\n.description {\n  margin: 0;\n  color: #5e6f88;\n  line-height: 1.5;\n  white-space: pre-line;\n}\n\n.warning {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5d6d86;\n  }\n}\r\n"] }]
    }], () => [{ type: i1.ActivatedRoute }, { type: i1.Router }, { type: i2.PoiService }, { type: i3.PurchaseService }, { type: i4.PlayerService }, { type: i5.OfflineService }, { type: i6.I18nService }, { type: i7.Location }, { type: i8.MatSnackBar }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlayerComponent, { className: "PlayerComponent", filePath: "frontend/src/app/features/player/player.component.ts", lineNumber: 20 }); })();
