import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "@angular/material/icon";
const _c0 = () => ({ exact: true });
function BottomNavComponent_a_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 2)(1, "mat-icon", 3);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r1 = ctx.$implicit;
    i0.ɵɵproperty("routerLink", item_r1.route)("routerLinkActiveOptions", i0.ɵɵpureFunction0(4, _c0));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r1.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r1.label);
} }
export class BottomNavComponent {
    constructor() {
        this.items = [
            { route: '/home', icon: 'home', label: 'Home' },
            { route: '/map', icon: 'map', label: 'Mappa' },
            { route: '/my-audio', icon: 'library_music', label: 'I miei audio' },
            { route: '/favorites', icon: 'favorite', label: 'Preferiti' },
            { route: '/profile', icon: 'person', label: 'Profilo' }
        ];
    }
    static { this.ɵfac = function BottomNavComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BottomNavComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BottomNavComponent, selectors: [["app-bottom-nav"]], standalone: false, decls: 2, vars: 1, consts: [["aria-label", "Navigazione principale", 1, "bottom-nav", "card"], ["routerLinkActive", "active", "class", "bottom-nav-item", 3, "routerLink", "routerLinkActiveOptions", 4, "ngFor", "ngForOf"], ["routerLinkActive", "active", 1, "bottom-nav-item", 3, "routerLink", "routerLinkActiveOptions"], ["fontSet", "material-icons-round"]], template: function BottomNavComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "nav", 0);
            i0.ɵɵtemplate(1, BottomNavComponent_a_1_Template, 5, 5, "a", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.items);
        } }, dependencies: [i1.NgForOf, i2.RouterLink, i2.RouterLinkActive, i3.MatIcon], styles: [".bottom-nav[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 12px;\n  right: 12px;\n  bottom: calc(10px + env(safe-area-inset-bottom));\n  z-index: 1200;\n  min-height: 68px;\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  border-radius: 24px;\n  padding: 8px 4px;\n  isolation: isolate;\n}\n\n.bottom-nav-item[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 3px;\n  color: #33455f;\n  font-size: 0.73rem;\n  font-weight: 500;\n  padding: 4px 2px;\n\n  mat-icon {\n    font-size: 1.3rem;\n    width: 1.3rem;\n    height: 1.3rem;\n  }\n}\n\n.bottom-nav-item.active[_ngcontent-%COMP%] {\n  color: #1769aa;\n}\n\n@media (min-width: 900px) {\n  .bottom-nav[_ngcontent-%COMP%] {\n    max-width: 760px;\n    left: 50%;\n    right: auto;\n    transform: translateX(-50%);\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BottomNavComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-bottom-nav', template: "<nav class=\"bottom-nav card\" aria-label=\"Navigazione principale\">\n  <a\n    *ngFor=\"let item of items\"\n    [routerLink]=\"item.route\"\n    routerLinkActive=\"active\"\n    [routerLinkActiveOptions]=\"{ exact: true }\"\n    class=\"bottom-nav-item\"\n  >\n    <mat-icon fontSet=\"material-icons-round\">{{ item.icon }}</mat-icon>\n    <span>{{ item.label }}</span>\n  </a>\n</nav>\r\n", styles: [".bottom-nav {\n  position: fixed;\n  left: 12px;\n  right: 12px;\n  bottom: calc(10px + env(safe-area-inset-bottom));\n  z-index: 1200;\n  min-height: 68px;\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  border-radius: 24px;\n  padding: 8px 4px;\n  isolation: isolate;\n}\n\n.bottom-nav-item {\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 3px;\n  color: #33455f;\n  font-size: 0.73rem;\n  font-weight: 500;\n  padding: 4px 2px;\n\n  mat-icon {\n    font-size: 1.3rem;\n    width: 1.3rem;\n    height: 1.3rem;\n  }\n}\n\n.bottom-nav-item.active {\n  color: #1769aa;\n}\n\n@media (min-width: 900px) {\n  .bottom-nav {\n    max-width: 760px;\n    left: 50%;\n    right: auto;\n    transform: translateX(-50%);\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BottomNavComponent, { className: "BottomNavComponent", filePath: "src/app/layout/bottom-nav/bottom-nav.component.ts", lineNumber: 15 }); })();
