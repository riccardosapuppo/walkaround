import { Component } from '@angular/core';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/app-state.service";
import * as i2 from "../../core/services/poi.service";
import * as i3 from "@angular/router";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/card";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/progress-spinner";
function FavoritesComponent_section_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 6);
    i0.ɵɵelement(1, "mat-progress-spinner", 7);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Caricamento preferiti...");
    i0.ɵɵelementEnd()();
} }
function FavoritesComponent_mat_card_7_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card", 8)(1, "img", 9);
    i0.ɵɵlistener("click", function FavoritesComponent_mat_card_7_Template_img_click_1_listener() { const poi_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openPoi(poi_r2.id)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 10);
    i0.ɵɵlistener("click", function FavoritesComponent_mat_card_7_Template_div_click_2_listener() { const poi_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openPoi(poi_r2.id)); });
    i0.ɵɵelementStart(3, "h3");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "button", 11);
    i0.ɵɵlistener("click", function FavoritesComponent_mat_card_7_Template_button_click_7_listener() { const poi_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.playPreview(poi_r2.id)); });
    i0.ɵɵelementStart(8, "mat-icon", 12);
    i0.ɵɵtext(9, "play_circle");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const poi_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("hidden", ctx_r2.loading);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", poi_r2.imageUrl, i0.ɵɵsanitizeUrl)("alt", poi_r2.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(poi_r2.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(poi_r2.descriptionShort);
} }
function FavoritesComponent_mat_card_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 13)(1, "p");
    i0.ɵɵtext(2, "Non hai ancora preferiti.");
    i0.ɵɵelementEnd()();
} }
export class FavoritesComponent {
    constructor(appState, poiService, router) {
        this.appState = appState;
        this.poiService = poiService;
        this.router = router;
        this.favorites = [];
        this.loading = true;
        this.allPois = [];
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.poiService
            .getCities()
            .pipe(switchMap((cities) => forkJoin(cities.map((city) => this.poiService.getPoisByCity(city.id)))), takeUntil(this.destroy$))
            .subscribe({
            next: (groups) => {
                this.allPois = groups.flat();
                this.refreshFavorites();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.favorites = [];
            }
        });
        this.appState.favorites$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refreshFavorites());
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    openPoi(poiId) {
        void this.router.navigate(['/poi', poiId]);
    }
    playPreview(poiId) {
        void this.router.navigate(['/player', poiId], {
            queryParams: {
                preview: true
            }
        });
    }
    refreshFavorites() {
        const ids = new Set(this.appState.favoriteIds);
        this.favorites = this.allPois.filter((poi) => ids.has(poi.id));
    }
    static { this.ɵfac = function FavoritesComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FavoritesComponent)(i0.ɵɵdirectiveInject(i1.AppStateService), i0.ɵɵdirectiveInject(i2.PoiService), i0.ɵɵdirectiveInject(i3.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: FavoritesComponent, selectors: [["app-favorites"]], standalone: false, decls: 9, vars: 3, consts: [[1, "page-shell", "favorites"], [1, "page-title"], [1, "page-subtitle"], ["class", "loading-shell", 4, "ngIf"], ["class", "card poi-card", 3, "hidden", 4, "ngFor", "ngForOf"], ["class", "card empty", 4, "ngIf"], [1, "loading-shell"], ["mode", "indeterminate", "diameter", "44"], [1, "card", "poi-card"], [3, "click", "src", "alt"], [1, "meta", 3, "click"], ["mat-icon-button", "", "color", "primary", "aria-label", "Preview", 3, "click"], ["fontSet", "material-icons-round"], [1, "card", "empty"]], template: function FavoritesComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header")(2, "h1", 1);
            i0.ɵɵtext(3, "Preferiti");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p", 2);
            i0.ɵɵtext(5, "Accesso rapido ai tuoi punti di interesse salvati");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(6, FavoritesComponent_section_6_Template, 4, 0, "section", 3)(7, FavoritesComponent_mat_card_7_Template, 10, 6, "mat-card", 4)(8, FavoritesComponent_mat_card_8_Template, 3, 0, "mat-card", 5);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.favorites);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && !ctx.favorites.length);
        } }, dependencies: [i4.NgForOf, i4.NgIf, i5.MatIconButton, i6.MatCard, i7.MatIcon, i8.MatProgressSpinner], styles: [".favorites[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n}\n\n.hidden[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.poi-card[_ngcontent-%COMP%] {\n  padding: 10px;\n  display: grid;\n  grid-template-columns: 92px 1fr auto;\n  align-items: center;\n  gap: 10px;\n\n  img {\n    width: 92px;\n    height: 74px;\n    border-radius: 12px;\n    object-fit: cover;\n    cursor: pointer;\n  }\n}\n\n.meta[_ngcontent-%COMP%] {\n  cursor: pointer;\n\n  h3 {\n    margin: 0 0 4px;\n    font-size: 1.05rem;\n  }\n\n  p {\n    margin: 0;\n    color: #61728b;\n    line-height: 1.35;\n  }\n}\n\n.empty[_ngcontent-%COMP%] {\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #65758e;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FavoritesComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-favorites', template: "<section class=\"page-shell favorites\">\n  <header>\n    <h1 class=\"page-title\">Preferiti</h1>\n    <p class=\"page-subtitle\">Accesso rapido ai tuoi punti di interesse salvati</p>\n  </header>\n\n  <section class=\"loading-shell\" *ngIf=\"loading\">\n    <mat-progress-spinner mode=\"indeterminate\" diameter=\"44\"></mat-progress-spinner>\n    <p>Caricamento preferiti...</p>\n  </section>\n\n  <mat-card class=\"card poi-card\" *ngFor=\"let poi of favorites\" [class.hidden]=\"loading\">\n    <img [src]=\"poi.imageUrl\" [alt]=\"poi.name\" (click)=\"openPoi(poi.id)\" />\n\n    <div class=\"meta\" (click)=\"openPoi(poi.id)\">\n      <h3>{{ poi.name }}</h3>\n      <p>{{ poi.descriptionShort }}</p>\n    </div>\n\n    <button mat-icon-button color=\"primary\" (click)=\"playPreview(poi.id)\" aria-label=\"Preview\">\n      <mat-icon fontSet=\"material-icons-round\">play_circle</mat-icon>\n    </button>\n  </mat-card>\n\n  <mat-card class=\"card empty\" *ngIf=\"!loading && !favorites.length\">\n    <p>Non hai ancora preferiti.</p>\n  </mat-card>\n</section>\n", styles: [".favorites {\n  display: grid;\n  gap: 12px;\n}\n\n.hidden {\n  display: none;\n}\n\n.poi-card {\n  padding: 10px;\n  display: grid;\n  grid-template-columns: 92px 1fr auto;\n  align-items: center;\n  gap: 10px;\n\n  img {\n    width: 92px;\n    height: 74px;\n    border-radius: 12px;\n    object-fit: cover;\n    cursor: pointer;\n  }\n}\n\n.meta {\n  cursor: pointer;\n\n  h3 {\n    margin: 0 0 4px;\n    font-size: 1.05rem;\n  }\n\n  p {\n    margin: 0;\n    color: #61728b;\n    line-height: 1.35;\n  }\n}\n\n.empty {\n  padding: 14px;\n\n  p {\n    margin: 0;\n    color: #65758e;\n  }\n}\r\n"] }]
    }], () => [{ type: i1.AppStateService }, { type: i2.PoiService }, { type: i3.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(FavoritesComponent, { className: "FavoritesComponent", filePath: "frontend/src/app/features/favorites/favorites.component.ts", lineNumber: 14 }); })();
