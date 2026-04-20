import { Component } from '@angular/core';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { formatCityLabel } from '../../core/utils/city-label.util';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../../core/services/poi.service";
import * as i3 from "../../core/services/purchase.service";
import * as i4 from "../../core/services/app-state.service";
import * as i5 from "../../core/services/geo.service";
import * as i6 from "../../core/services/cart.service";
import * as i7 from "../../core/services/i18n.service";
import * as i8 from "@angular/common";
import * as i9 from "@angular/material/snack-bar";
import * as i10 from "@angular/material/button";
import * as i11 from "@angular/material/card";
import * as i12 from "@angular/material/icon";
import * as i13 from "@angular/material/progress-spinner";
import * as i14 from "../../shared/directives/img-fallback.directive";
import * as i15 from "../../shared/pipes/duration-label.pipe";
import * as i16 from "../../shared/pipes/translate.pipe";
const _c0 = a0 => ({ name: a0 });
const _c1 = a0 => ({ seconds: a0 });
const _c2 = a0 => ({ price: a0 });
const _c3 = (a0, a1) => ({ city: a0, price: a1 });
function PoiDetailComponent_section_0_button_26_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 23);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_button_26_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleDescription()); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.descriptionExpanded ? i0.ɵɵpipeBind1(2, 1, "common.showLess") : i0.ɵɵpipeBind1(3, 3, "common.showMore"), " ");
} }
function PoiDetailComponent_section_0_ng_container_31_p_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 26);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, "poiDetail.previewLimited", i0.ɵɵpureFunction1(4, _c1, ctx_r1.previewSeconds)));
} }
function PoiDetailComponent_section_0_ng_container_31_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "audio", 24);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵlistener("timeupdate", function PoiDetailComponent_section_0_ng_container_31_Template_audio_timeupdate_1_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onPreviewTimeUpdate($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, PoiDetailComponent_section_0_ng_container_31_p_3_Template, 3, 6, "p", 25);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const currentPoi_r5 = i0.ɵɵnextContext().ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r1.poiAudioUrl(currentPoi_r5), i0.ɵɵsanitizeUrl);
    i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind2(2, 3, "poiDetail.previewAria", i0.ɵɵpureFunction1(6, _c0, ctx_r1.poiName(currentPoi_r5))));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", !ctx_r1.unlocked);
} }
function PoiDetailComponent_section_0_ng_template_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 26);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "mapSheet.audioUnavailable"));
} }
function PoiDetailComponent_section_0_button_35_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 27);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_button_35_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.addPoiToCart()); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const currentPoi_r5 = i0.ɵɵnextContext().ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r1.isInCart());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isInCart() ? i0.ɵɵpipeBind1(2, 2, "common.inCart") : i0.ɵɵpipeBind2(3, 4, "poiDetail.unlockPlace", i0.ɵɵpureFunction1(7, _c2, ctx_r1.formatPrice(currentPoi_r5.priceSingle))), " ");
} }
function PoiDetailComponent_section_0_button_36_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 28);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_button_36_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.purchaseCity()); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const currentPoi_r5 = i0.ɵɵnextContext().ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(2, 1, "poiDetail.unlockCity", i0.ɵɵpureFunction2(4, _c3, ctx_r1.cityName(currentPoi_r5.cityId), ctx_r1.i18n.formatCurrency(ctx_r1.cityUnlockPrice))), " ");
} }
function PoiDetailComponent_section_0_button_37_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 29);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_button_37_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openFullPlayer()); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, "poiDetail.playFullAudio"), " ");
} }
function PoiDetailComponent_section_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 3)(1, "button", 4);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBack()); });
    i0.ɵɵelementStart(3, "mat-icon", 5);
    i0.ɵɵtext(4, "arrow_back");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(5, "img", 6);
    i0.ɵɵelementStart(6, "div", 7)(7, "div")(8, "h1", 8);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "p", 9);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "p", 10);
    i0.ɵɵtext(13);
    i0.ɵɵpipe(14, "durationLabel");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "button", 11);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleFavorite()); });
    i0.ɵɵelementStart(16, "mat-icon", 5);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(18, "button", 12);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_0_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.startNavigation()); });
    i0.ɵɵelementStart(19, "mat-icon", 5);
    i0.ɵɵtext(20, "near_me");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(21);
    i0.ɵɵpipe(22, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "div", 13)(24, "p", 14);
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(26, PoiDetailComponent_section_0_button_26_Template, 4, 5, "button", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "section", 16)(28, "p", 17);
    i0.ɵɵtext(29);
    i0.ɵɵpipe(30, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(31, PoiDetailComponent_section_0_ng_container_31_Template, 4, 8, "ng-container", 18)(32, PoiDetailComponent_section_0_ng_template_32_Template, 3, 3, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "section", 19);
    i0.ɵɵtemplate(35, PoiDetailComponent_section_0_button_35_Template, 4, 9, "button", 20)(36, PoiDetailComponent_section_0_button_36_Template, 3, 7, "button", 21)(37, PoiDetailComponent_section_0_button_37_Template, 3, 3, "button", 22);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const currentPoi_r5 = ctx.ngIf;
    const previewUnavailable_r9 = i0.ɵɵreference(33);
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(2, 17, "poiDetail.backAria"));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("appImgFallback", currentPoi_r5.imageUrl)("alt", ctx_r1.poiName(currentPoi_r5));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.poiName(currentPoi_r5));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.poiAddress(currentPoi_r5));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r1.distanceLabel, " - ", i0.ɵɵpipeBind1(14, 19, currentPoi_r5.durationSec), "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.isFavorite ? "favorite" : "favorite_border");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(22, 21, "poiDetail.startNavigation"), " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.descriptionText(currentPoi_r5));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.canExpandDescription(currentPoi_r5));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(30, 23, "poiDetail.previewTitle"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.hasPlayableAudio(currentPoi_r5))("ngIfElse", previewUnavailable_r9);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", !ctx_r1.unlocked);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.unlocked);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.unlocked);
} }
function PoiDetailComponent_section_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 30);
    i0.ɵɵelement(1, "mat-progress-spinner", 31);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 1, "poiDetail.loading"));
} }
function PoiDetailComponent_section_2_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 3)(1, "mat-card", 32)(2, "p");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵpipe(5, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 33);
    i0.ɵɵlistener("click", function PoiDetailComponent_section_2_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBack()); });
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "t");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.loadError ? i0.ɵɵpipeBind1(4, 2, "poiDetail.unavailable") : i0.ɵɵpipeBind1(5, 4, "poiDetail.notFound"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 6, "poiDetail.backHome"));
} }
const descriptionPreviewLength = 260;
export class PoiDetailComponent {
    constructor(route, router, poiService, purchaseService, appState, geoService, cartService, i18n, location, snackBar) {
        this.route = route;
        this.router = router;
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.appState = appState;
        this.geoService = geoService;
        this.cartService = cartService;
        this.i18n = i18n;
        this.location = location;
        this.snackBar = snackBar;
        this.distanceLabel = '--';
        this.unlocked = false;
        this.isFavorite = false;
        this.loading = true;
        this.loadError = false;
        this.descriptionExpanded = false;
        this.previewLimitReached = false;
        this.cityUnlockPrice = 15;
        this.previewSeconds = environment.previewSeconds;
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.purchaseService.refresh();
        this.route.paramMap
            .pipe(tap(() => {
            this.loading = true;
            this.loadError = false;
            this.poi = undefined;
            this.previewLimitReached = false;
            this.descriptionExpanded = false;
        }), switchMap((params) => this.poiService.getPoiById(String(params.get('id')))), takeUntil(this.destroy$))
            .subscribe({
            next: (poi) => {
                this.poi = poi;
                this.isFavorite = this.appState.isFavorite(poi.id);
                this.unlocked = this.purchaseService.isPoiUnlocked(poi.id, poi.cityId);
                this.updateDistanceLabel();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.loadError = true;
                this.poi = undefined;
            }
        });
        this.geoService.coordinates$.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateDistanceLabel());
        this.purchaseService.purchases$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.poi) {
                this.unlocked = this.purchaseService.isPoiUnlocked(this.poi.id, this.poi.cityId);
            }
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    openFullPlayer() {
        if (!this.poi) {
            return;
        }
        if (!this.hasPlayableAudio(this.poi)) {
            this.snackBar.open(this.i18n.t('map.noAudio'), this.i18n.t('common.ok'), { duration: 2400 });
            return;
        }
        if (!this.unlocked) {
            this.snackBar.open(this.i18n.t('poiDetail.listenPreviewFirst'), this.i18n.t('common.ok'), { duration: 2200 });
            return;
        }
        void this.router.navigate(['/player', this.poi.id], { queryParams: { preview: false } });
    }
    startNavigation() {
        if (!this.poi) {
            return;
        }
        this.appState.setActiveCity(this.poi.cityId);
        void this.router.navigate(['/map'], {
            queryParams: {
                poiId: this.poi.id,
                nav: 1
            }
        });
    }
    addPoiToCart() {
        if (!this.poi) {
            return;
        }
        if (this.unlocked) {
            this.snackBar.open(this.i18n.t('home.placeAlreadyUnlocked'), this.i18n.t('common.ok'), { duration: 2200 });
            return;
        }
        if (this.cartService.isPoiInCart(this.poi.id)) {
            this.snackBar.open(this.i18n.t('home.placeAlreadyInCart'), this.i18n.t('common.ok'), { duration: 2200 });
            return;
        }
        this.cartService.addPoi({
            poiId: this.poi.id,
            cityId: this.poi.cityId,
            cityName: this.cityName(this.poi.cityId),
            label: this.poiName(this.poi),
            amount: this.poi.priceSingle
        });
        this.snackBar.open(this.i18n.t('home.placeAdded', { name: this.poiName(this.poi) }), this.i18n.t('common.ok'), {
            duration: 2400
        });
    }
    purchaseCity() {
        if (!this.poi) {
            return;
        }
        this.purchaseService.purchaseCityBundle(this.poi.cityId, this.cityName(this.poi.cityId), this.cityUnlockPrice).subscribe({
            next: (result) => {
                if (result?.action === 'paid') {
                    this.unlocked = true;
                    this.snackBar.open(this.i18n.t('map.cityUnlocked', { city: this.cityName(this.poi?.cityId || '') }), this.i18n.t('common.ok'), { duration: 2400 });
                }
            },
            error: () => {
                this.snackBar.open(this.i18n.t('home.operationFailed'), this.i18n.t('common.close'), { duration: 2400 });
            }
        });
    }
    formatPrice(amount) {
        return this.i18n.formatCurrency(Number(amount || 0));
    }
    cityName(cityId) {
        return formatCityLabel(cityId, [], this.i18n.language);
    }
    hasPlayableAudio(poi) {
        return Boolean(this.poiAudioUrl(poi));
    }
    toggleFavorite() {
        if (!this.poi) {
            return;
        }
        this.appState.toggleFavorite(this.poi.id);
        this.isFavorite = this.appState.isFavorite(this.poi.id);
    }
    goBack() {
        if (window.history.length > 1) {
            this.location.back();
            return;
        }
        void this.router.navigate(['/home']);
    }
    poiAddress(poi) {
        return `${this.cityName(poi.cityId)} - ${this.i18n.t('common.coordinates')} ${poi.lat.toFixed(4)}, ${poi.lng.toFixed(4)}`;
    }
    descriptionText(poi) {
        const source = this.unlocked ? this.poiDescriptionLong(poi) : this.poiDescriptionShort(poi);
        if (!source) {
            return '';
        }
        if (this.descriptionExpanded || source.length <= descriptionPreviewLength) {
            return source;
        }
        return `${source.slice(0, descriptionPreviewLength).trimEnd()}...`;
    }
    canExpandDescription(poi) {
        const source = this.unlocked ? this.poiDescriptionLong(poi) : this.poiDescriptionShort(poi);
        return source.length > descriptionPreviewLength;
    }
    toggleDescription() {
        this.descriptionExpanded = !this.descriptionExpanded;
    }
    isInCart() {
        return this.poi ? this.cartService.isPoiInCart(this.poi.id) : false;
    }
    onPreviewTimeUpdate(event) {
        if (this.unlocked) {
            return;
        }
        const audio = event.target;
        if (!audio) {
            return;
        }
        if (audio.currentTime >= this.previewSeconds) {
            audio.pause();
            audio.currentTime = this.previewSeconds;
            if (!this.previewLimitReached) {
                this.previewLimitReached = true;
                this.snackBar.open(this.i18n.t('poiDetail.previewCompleted', { seconds: this.previewSeconds }), this.i18n.t('common.ok'), {
                    duration: 2600
                });
            }
        }
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
    poiAudioUrl(poi) {
        return this.i18n.resolvePoiAudioUrl(poi);
    }
    updateDistanceLabel() {
        if (!this.poi) {
            return;
        }
        const current = this.geoService.currentCoordinates;
        if (!current) {
            this.distanceLabel = this.i18n.t('common.positionUnavailable');
            return;
        }
        const distance = this.geoService.distanceInMeters(current, {
            lat: this.poi.lat,
            lng: this.poi.lng
        });
        this.distanceLabel = this.i18n.formatDistance(distance);
    }
    static { this.ɵfac = function PoiDetailComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PoiDetailComponent)(i0.ɵɵdirectiveInject(i1.ActivatedRoute), i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.PoiService), i0.ɵɵdirectiveInject(i3.PurchaseService), i0.ɵɵdirectiveInject(i4.AppStateService), i0.ɵɵdirectiveInject(i5.GeoService), i0.ɵɵdirectiveInject(i6.CartService), i0.ɵɵdirectiveInject(i7.I18nService), i0.ɵɵdirectiveInject(i8.Location), i0.ɵɵdirectiveInject(i9.MatSnackBar)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PoiDetailComponent, selectors: [["app-poi-detail"]], standalone: false, decls: 3, vars: 3, consts: [["previewUnavailable", ""], ["class", "page-shell poi-detail", 4, "ngIf"], ["class", "page-shell loading-shell", 4, "ngIf"], [1, "page-shell", "poi-detail"], ["mat-icon-button", "", 1, "back-btn", 3, "click"], ["fontSet", "material-icons-round"], [1, "hero-image", 3, "appImgFallback", "alt"], [1, "title-row"], [1, "page-title"], [1, "page-subtitle"], [1, "poi-distance"], ["mat-icon-button", "", "color", "primary", 3, "click"], ["mat-flat-button", "", "color", "accent", 1, "big-cta", "nav-cta", 3, "click"], [1, "description-wrap"], [1, "description-text"], ["mat-button", "", "type", "button", "class", "expand-inline-btn", 3, "click", 4, "ngIf"], [1, "preview-box", "card"], [1, "preview-title"], [4, "ngIf", "ngIfElse"], [1, "actions"], ["mat-flat-button", "", "color", "primary", "class", "big-cta", 3, "disabled", "click", 4, "ngIf"], ["mat-stroked-button", "", "color", "primary", "class", "big-cta", 3, "click", 4, "ngIf"], ["mat-flat-button", "", "color", "primary", "class", "big-cta", 3, "click", 4, "ngIf"], ["mat-button", "", "type", "button", 1, "expand-inline-btn", 3, "click"], ["controls", "", "preload", "none", 1, "preview-player", 3, "timeupdate", "src"], ["class", "preview-note", 4, "ngIf"], [1, "preview-note"], ["mat-flat-button", "", "color", "primary", 1, "big-cta", 3, "click", "disabled"], ["mat-stroked-button", "", "color", "primary", 1, "big-cta", 3, "click"], ["mat-flat-button", "", "color", "primary", 1, "big-cta", 3, "click"], [1, "page-shell", "loading-shell"], ["mode", "indeterminate", "diameter", "48"], [1, "card", "warning"], ["mat-stroked-button", "", "color", "primary", 3, "click"]], template: function PoiDetailComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, PoiDetailComponent_section_0_Template, 38, 25, "section", 1)(1, PoiDetailComponent_section_1_Template, 5, 3, "section", 2)(2, PoiDetailComponent_section_2_Template, 9, 8, "section", 1);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.poi);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && !ctx.poi);
        } }, dependencies: [i8.NgIf, i10.MatButton, i10.MatIconButton, i11.MatCard, i12.MatIcon, i13.MatProgressSpinner, i14.ImgFallbackDirective, i15.DurationLabelPipe, i16.TranslatePipe], styles: [".poi-detail[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 14px;\n  padding-bottom: calc(156px + env(safe-area-inset-bottom));\n}\n\n.back-btn[_ngcontent-%COMP%] {\n  width: fit-content;\n}\n\n.title-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.poi-distance[_ngcontent-%COMP%] {\n  margin: 4px 0 0;\n  color: #5f7290;\n  font-size: 0.88rem;\n}\n\n.nav-cta[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n\n.description-wrap[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 2px;\n}\n\n.description-text[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #4f607a;\n  line-height: 1.52;\n  white-space: pre-line;\n}\n\n.expand-inline-btn[_ngcontent-%COMP%] {\n  justify-self: start;\n  padding-inline: 4px;\n  color: #1769aa;\n  font-size: 0.8rem;\n}\n\n.preview-box[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 8px;\n}\n\n.preview-title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 700;\n  color: #173658;\n}\n\n.preview-player[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.preview-note[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #6b7c95;\n  font-size: 0.84rem;\n}\n\n.actions[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n  margin-top: 4px;\n}\n\n.warning[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5d6d86;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PoiDetailComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-poi-detail', template: "<section class=\"page-shell poi-detail\" *ngIf=\"poi as currentPoi\">\n  <button mat-icon-button class=\"back-btn\" (click)=\"goBack()\" [attr.aria-label]=\"'poiDetail.backAria' | t\">\n    <mat-icon fontSet=\"material-icons-round\">arrow_back</mat-icon>\n  </button>\n\n  <img class=\"hero-image\" [appImgFallback]=\"currentPoi.imageUrl\" [alt]=\"poiName(currentPoi)\" />\n\n  <div class=\"title-row\">\n    <div>\n      <h1 class=\"page-title\">{{ poiName(currentPoi) }}</h1>\n      <p class=\"page-subtitle\">{{ poiAddress(currentPoi) }}</p>\n      <p class=\"poi-distance\">{{ distanceLabel }} - {{ currentPoi.durationSec | durationLabel }}</p>\n    </div>\n\n    <button mat-icon-button color=\"primary\" (click)=\"toggleFavorite()\">\n      <mat-icon fontSet=\"material-icons-round\">{{ isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>\n    </button>\n  </div>\n\n  <button mat-flat-button color=\"accent\" class=\"big-cta nav-cta\" (click)=\"startNavigation()\">\n    <mat-icon fontSet=\"material-icons-round\">near_me</mat-icon>\n    {{ 'poiDetail.startNavigation' | t }}\n  </button>\n\n  <div class=\"description-wrap\">\n    <p class=\"description-text\">{{ descriptionText(currentPoi) }}</p>\n    <button mat-button type=\"button\" class=\"expand-inline-btn\" *ngIf=\"canExpandDescription(currentPoi)\" (click)=\"toggleDescription()\">\n      {{ descriptionExpanded ? ('common.showLess' | t) : ('common.showMore' | t) }}\n    </button>\n  </div>\n\n  <section class=\"preview-box card\">\n    <p class=\"preview-title\">{{ 'poiDetail.previewTitle' | t }}</p>\n    <ng-container *ngIf=\"hasPlayableAudio(currentPoi); else previewUnavailable\">\n      <audio\n        class=\"preview-player\"\n        controls\n        [src]=\"poiAudioUrl(currentPoi)\"\n        preload=\"none\"\n        (timeupdate)=\"onPreviewTimeUpdate($event)\"\n        [attr.aria-label]=\"'poiDetail.previewAria' | t:{ name: poiName(currentPoi) }\"\n      ></audio>\n      <p class=\"preview-note\" *ngIf=\"!unlocked\">{{ 'poiDetail.previewLimited' | t:{ seconds: previewSeconds } }}</p>\n    </ng-container>\n    <ng-template #previewUnavailable>\n      <p class=\"preview-note\">{{ 'mapSheet.audioUnavailable' | t }}</p>\n    </ng-template>\n  </section>\n\n  <section class=\"actions\">\n    <button mat-flat-button color=\"primary\" class=\"big-cta\" *ngIf=\"!unlocked\" (click)=\"addPoiToCart()\" [disabled]=\"isInCart()\">\n      {{ isInCart() ? ('common.inCart' | t) : ('poiDetail.unlockPlace' | t:{ price: formatPrice(currentPoi.priceSingle) }) }}\n    </button>\n\n    <button mat-stroked-button color=\"primary\" class=\"big-cta\" *ngIf=\"!unlocked\" (click)=\"purchaseCity()\">\n      {{ 'poiDetail.unlockCity' | t:{ city: cityName(currentPoi.cityId), price: i18n.formatCurrency(cityUnlockPrice) } }}\n    </button>\n\n    <button mat-flat-button color=\"primary\" class=\"big-cta\" *ngIf=\"unlocked\" (click)=\"openFullPlayer()\">\n      {{ 'poiDetail.playFullAudio' | t }}\n    </button>\n  </section>\n</section>\n\n<section class=\"page-shell loading-shell\" *ngIf=\"loading\">\n  <mat-progress-spinner mode=\"indeterminate\" diameter=\"48\"></mat-progress-spinner>\n  <p>{{ 'poiDetail.loading' | t }}</p>\n</section>\n\n<section class=\"page-shell poi-detail\" *ngIf=\"!loading && !poi\">\n  <mat-card class=\"card warning\">\n    <p>{{ loadError ? ('poiDetail.unavailable' | t) : ('poiDetail.notFound' | t) }}</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"goBack()\">{{ 'poiDetail.backHome' | t }}</button>\n  </mat-card>\n</section>\n", styles: [".poi-detail {\n  display: grid;\n  gap: 14px;\n  padding-bottom: calc(156px + env(safe-area-inset-bottom));\n}\n\n.back-btn {\n  width: fit-content;\n}\n\n.title-row {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.poi-distance {\n  margin: 4px 0 0;\n  color: #5f7290;\n  font-size: 0.88rem;\n}\n\n.nav-cta {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n\n.description-wrap {\n  display: grid;\n  gap: 2px;\n}\n\n.description-text {\n  margin: 0;\n  color: #4f607a;\n  line-height: 1.52;\n  white-space: pre-line;\n}\n\n.expand-inline-btn {\n  justify-self: start;\n  padding-inline: 4px;\n  color: #1769aa;\n  font-size: 0.8rem;\n}\n\n.preview-box {\n  padding: 14px;\n  display: grid;\n  gap: 8px;\n}\n\n.preview-title {\n  margin: 0;\n  font-weight: 700;\n  color: #173658;\n}\n\n.preview-player {\n  width: 100%;\n}\n\n.preview-note {\n  margin: 0;\n  color: #6b7c95;\n  font-size: 0.84rem;\n}\n\n.actions {\n  display: grid;\n  gap: 10px;\n  margin-top: 4px;\n}\n\n.warning {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5d6d86;\n  }\n}\n"] }]
    }], () => [{ type: i1.ActivatedRoute }, { type: i1.Router }, { type: i2.PoiService }, { type: i3.PurchaseService }, { type: i4.AppStateService }, { type: i5.GeoService }, { type: i6.CartService }, { type: i7.I18nService }, { type: i8.Location }, { type: i9.MatSnackBar }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PoiDetailComponent, { className: "PoiDetailComponent", filePath: "frontend/src/app/features/poi-detail/poi-detail.component.ts", lineNumber: 24 }); })();
