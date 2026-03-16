import { Component } from '@angular/core';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/poi.service";
import * as i2 from "../../core/services/purchase.service";
import * as i3 from "../../core/services/offline.service";
import * as i4 from "@angular/material/snack-bar";
import * as i5 from "@angular/router";
import * as i6 from "@angular/common";
import * as i7 from "@angular/material/button";
import * as i8 from "@angular/material/card";
import * as i9 from "@angular/material/icon";
import * as i10 from "@angular/material/progress-spinner";
import * as i11 from "../../shared/pipes/duration-label.pipe";
function MyAudioComponent_mat_card_6_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 7)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 8);
    i0.ɵɵlistener("click", function MyAudioComponent_mat_card_6_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.downloadAll()); });
    i0.ɵɵtext(4, "Scarica tutti");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Audio disponibili offline: ", ctx_r1.offlineMinutes, " min");
} }
function MyAudioComponent_section_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 9);
    i0.ɵɵelement(1, "mat-progress-spinner", 10);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Caricamento audio sbloccati...");
    i0.ɵɵelementEnd()();
} }
function MyAudioComponent_mat_card_8_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 11);
    i0.ɵɵelement(1, "img", 12);
    i0.ɵɵelementStart(2, "div", 13)(3, "h3");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6);
    i0.ɵɵpipe(7, "durationLabel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "span", 14);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "button", 15);
    i0.ɵɵlistener("click", function MyAudioComponent_mat_card_8_Template_button_click_10_listener() { const item_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.play(item_r4.id)); });
    i0.ɵɵelementStart(11, "mat-icon", 16);
    i0.ɵɵtext(12, "play_circle");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", item_r4.imageUrl, i0.ɵɵsanitizeUrl)("alt", item_r4.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r4.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 6, item_r4.durationSec));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", item_r4.offline ? "unlocked" : "near");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r4.offline ? "Offline" : "Online", " ");
} }
function MyAudioComponent_mat_card_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 17)(1, "p");
    i0.ɵɵtext(2, "Non hai ancora audio sbloccati.");
    i0.ɵɵelementEnd()();
} }
export class MyAudioComponent {
    constructor(poiService, purchaseService, offlineService, snackBar, router) {
        this.poiService = poiService;
        this.purchaseService = purchaseService;
        this.offlineService = offlineService;
        this.snackBar = snackBar;
        this.router = router;
        this.audioItems = [];
        this.offlineMinutes = 0;
        this.loading = true;
        this.allPois = [];
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.purchaseService.refresh();
        this.poiService
            .getCities()
            .pipe(switchMap((cities) => forkJoin(cities.map((city) => this.poiService.getPoisByCity(city.id)))), takeUntil(this.destroy$))
            .subscribe({
            next: async (allGroups) => {
                this.allPois = allGroups.flat();
                await this.rebuildList();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
        this.purchaseService.purchases$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            void this.rebuildList();
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    async downloadAll() {
        const toCache = this.audioItems.map((item) => ({
            poiId: item.id,
            urls: [item.audioUrl, item.imageUrl]
        }));
        await this.offlineService.cacheBatch(toCache);
        await this.rebuildList();
        this.snackBar.open('Download offline completato', 'OK', { duration: 2400 });
    }
    play(poiId) {
        void this.router.navigate(['/player', poiId], {
            queryParams: { preview: false }
        });
    }
    async rebuildList() {
        if (!this.allPois.length) {
            this.audioItems = [];
            return;
        }
        const offlineIds = await this.offlineService.getOfflinePoiIds();
        const unlocked = this.allPois.filter((poi) => this.purchaseService.isPoiUnlocked(poi.id, poi.cityId));
        this.audioItems = unlocked
            .map((poi) => ({
            ...poi,
            offline: offlineIds.includes(poi.id)
        }))
            .sort((a, b) => a.name.localeCompare(b.name));
        this.offlineMinutes = Math.round(this.audioItems
            .filter((item) => item.offline)
            .reduce((acc, item) => acc + item.durationSec, 0) / 60);
    }
    static { this.ɵfac = function MyAudioComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MyAudioComponent)(i0.ɵɵdirectiveInject(i1.PoiService), i0.ɵɵdirectiveInject(i2.PurchaseService), i0.ɵɵdirectiveInject(i3.OfflineService), i0.ɵɵdirectiveInject(i4.MatSnackBar), i0.ɵɵdirectiveInject(i5.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MyAudioComponent, selectors: [["app-my-audio"]], standalone: false, decls: 10, vars: 4, consts: [[1, "page-shell", "my-audio"], [1, "page-title"], [1, "page-subtitle"], ["class", "card download-box", 4, "ngIf"], ["class", "loading-shell", 4, "ngIf"], ["class", "card audio-card", 4, "ngFor", "ngForOf"], ["class", "card empty", 4, "ngIf"], [1, "card", "download-box"], ["mat-stroked-button", "", "color", "primary", 3, "click"], [1, "loading-shell"], ["mode", "indeterminate", "diameter", "44"], [1, "card", "audio-card"], [3, "src", "alt"], [1, "meta"], [1, "status-chip", 3, "ngClass"], ["mat-icon-button", "", "color", "primary", "aria-label", "Riproduci", 3, "click"], ["fontSet", "material-icons-round"], [1, "card", "empty"]], template: function MyAudioComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header")(2, "h1", 1);
            i0.ɵɵtext(3, "I miei audio");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p", 2);
            i0.ɵɵtext(5, "Guide acquistate o sbloccate da codice hotel");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(6, MyAudioComponent_mat_card_6_Template, 5, 1, "mat-card", 3)(7, MyAudioComponent_section_7_Template, 4, 0, "section", 4)(8, MyAudioComponent_mat_card_8_Template, 13, 8, "mat-card", 5)(9, MyAudioComponent_mat_card_9_Template, 3, 0, "mat-card", 6);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngIf", ctx.audioItems.length);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.audioItems);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && !ctx.audioItems.length);
        } }, dependencies: [i6.NgClass, i6.NgForOf, i6.NgIf, i7.MatButton, i7.MatIconButton, i8.MatCard, i9.MatIcon, i10.MatProgressSpinner, i11.DurationLabelPipe], styles: [".my-audio[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n}\n\n.download-box[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5f6e87;\n  }\n}\n\n.audio-card[_ngcontent-%COMP%] {\n  padding: 12px;\n  display: grid;\n  gap: 10px;\n  align-items: center;\n  grid-template-columns: 78px 1fr auto;\n\n  img {\n    width: 78px;\n    height: 78px;\n    border-radius: 12px;\n    object-fit: cover;\n  }\n}\n\n.meta[_ngcontent-%COMP%] {\n  h3 {\n    margin: 0;\n    font-size: 1.03rem;\n  }\n\n  p {\n    margin: 4px 0 8px;\n    color: #6d7b93;\n  }\n}\n\n.empty[_ngcontent-%COMP%] {\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #6b7a94;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MyAudioComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-my-audio', template: "<section class=\"page-shell my-audio\">\n  <header>\n    <h1 class=\"page-title\">I miei audio</h1>\n    <p class=\"page-subtitle\">Guide acquistate o sbloccate da codice hotel</p>\n  </header>\n\n  <mat-card class=\"card download-box\" *ngIf=\"audioItems.length\">\n    <p>Audio disponibili offline: {{ offlineMinutes }} min</p>\n    <button mat-stroked-button color=\"primary\" (click)=\"downloadAll()\">Scarica tutti</button>\n  </mat-card>\n\n  <section class=\"loading-shell\" *ngIf=\"loading\">\n    <mat-progress-spinner mode=\"indeterminate\" diameter=\"44\"></mat-progress-spinner>\n    <p>Caricamento audio sbloccati...</p>\n  </section>\n\n  <mat-card class=\"card audio-card\" *ngFor=\"let item of audioItems\">\n    <img [src]=\"item.imageUrl\" [alt]=\"item.name\" />\n\n    <div class=\"meta\">\n      <h3>{{ item.name }}</h3>\n      <p>{{ item.durationSec | durationLabel }}</p>\n      <span class=\"status-chip\" [ngClass]=\"item.offline ? 'unlocked' : 'near'\">\n        {{ item.offline ? 'Offline' : 'Online' }}\n      </span>\n    </div>\n\n    <button mat-icon-button color=\"primary\" (click)=\"play(item.id)\" aria-label=\"Riproduci\">\n      <mat-icon fontSet=\"material-icons-round\">play_circle</mat-icon>\n    </button>\n  </mat-card>\n\n  <mat-card class=\"card empty\" *ngIf=\"!loading && !audioItems.length\">\n    <p>Non hai ancora audio sbloccati.</p>\n  </mat-card>\n</section>\r\n", styles: [".my-audio {\n  display: grid;\n  gap: 12px;\n}\n\n.download-box {\n  padding: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n\n  p {\n    margin: 0;\n    color: #5f6e87;\n  }\n}\n\n.audio-card {\n  padding: 12px;\n  display: grid;\n  gap: 10px;\n  align-items: center;\n  grid-template-columns: 78px 1fr auto;\n\n  img {\n    width: 78px;\n    height: 78px;\n    border-radius: 12px;\n    object-fit: cover;\n  }\n}\n\n.meta {\n  h3 {\n    margin: 0;\n    font-size: 1.03rem;\n  }\n\n  p {\n    margin: 4px 0 8px;\n    color: #6d7b93;\n  }\n}\n\n.empty {\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #6b7a94;\n  }\n}\r\n"] }]
    }], () => [{ type: i1.PoiService }, { type: i2.PurchaseService }, { type: i3.OfflineService }, { type: i4.MatSnackBar }, { type: i5.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MyAudioComponent, { className: "MyAudioComponent", filePath: "frontend/src/app/features/my-audio/my-audio.component.ts", lineNumber: 21 }); })();
