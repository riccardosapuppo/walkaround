import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "@angular/material/icon";
import * as i4 from "../../shared/pipes/translate.pipe";
const _c0 = () => ({ exact: true });
function BottomNavComponent_a_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 2)(1, "mat-icon", 3);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r1 = ctx.$implicit;
    i0.ɵɵproperty("routerLink", item_r1.route)("routerLinkActiveOptions", i0.ɵɵpureFunction0(6, _c0));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r1.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(5, 4, item_r1.labelKey));
} }
export class BottomNavComponent {
    constructor() {
        this.items = [
            { route: '/home', icon: 'home', labelKey: 'bottomNav.home' },
            { route: '/map', icon: 'map', labelKey: 'bottomNav.map' },
            { route: '/my-audio', icon: 'library_music', labelKey: 'bottomNav.audio' },
            { route: '/favorites', icon: 'favorite', labelKey: 'bottomNav.favorites' },
            { route: '/cart', icon: 'shopping_cart', labelKey: 'bottomNav.cart' },
            { route: '/profile', icon: 'person', labelKey: 'bottomNav.profile' }
        ];
    }
    static { this.ɵfac = function BottomNavComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BottomNavComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BottomNavComponent, selectors: [["app-bottom-nav"]], standalone: false, decls: 3, vars: 4, consts: [[1, "bottom-nav", "card"], ["routerLinkActive", "active", "class", "bottom-nav-item", 3, "routerLink", "routerLinkActiveOptions", 4, "ngFor", "ngForOf"], ["routerLinkActive", "active", 1, "bottom-nav-item", 3, "routerLink", "routerLinkActiveOptions"], ["fontSet", "material-icons-round"]], template: function BottomNavComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "nav", 0);
            i0.ɵɵpipe(1, "t");
            i0.ɵɵtemplate(2, BottomNavComponent_a_2_Template, 6, 7, "a", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(1, 2, "bottomNav.aria"));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngForOf", ctx.items);
        } }, dependencies: [i1.NgForOf, i2.RouterLink, i2.RouterLinkActive, i3.MatIcon, i4.TranslatePipe], styles: [".bottom-nav[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 12px;\n  right: 12px;\n  bottom: calc(10px + env(safe-area-inset-bottom));\n  z-index: 900;\n  min-height: 68px;\n  display: grid;\n  grid-template-columns: repeat(6, minmax(0, 1fr));\n  border-radius: 24px;\n  padding: 8px 4px;\n  isolation: isolate;\n  overflow: hidden;\n}\n\n.bottom-nav-item[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 3px;\n  color: #33455f;\n  font-size: 0.66rem;\n  font-weight: 500;\n  padding: 4px 2px;\n  text-align: center;\n\n  span {\n    display: block;\n    line-height: 1.1;\n    white-space: nowrap;\n  }\n\n  mat-icon {\n    font-size: 1.22rem;\n    width: 1.22rem;\n    height: 1.22rem;\n  }\n}\n\n.bottom-nav-item.active[_ngcontent-%COMP%] {\n  color: #1769aa;\n}\n\nbody.app-user-theme[_nghost-%COMP%]   .bottom-nav[_ngcontent-%COMP%], body.app-user-theme   [_nghost-%COMP%]   .bottom-nav[_ngcontent-%COMP%] {\n  border: 1px solid rgba(181, 162, 126, 0.18);\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(249, 245, 237, 0.94) 100%);\n  box-shadow:\n    0 18px 34px rgba(25, 46, 76, 0.12),\n    0 8px 18px rgba(115, 93, 57, 0.08);\n  backdrop-filter: blur(16px);\n}\n\nbody.app-user-theme[_nghost-%COMP%]   .bottom-nav[_ngcontent-%COMP%]::before, body.app-user-theme   [_nghost-%COMP%]   .bottom-nav[_ngcontent-%COMP%]::before {\n  content: '';\n  position: absolute;\n  inset: 1px;\n  border-radius: 23px;\n  background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.86) 0%, rgba(255, 255, 255, 0) 34%),\n    radial-gradient(circle at top left, rgba(216, 194, 149, 0.12) 0%, rgba(216, 194, 149, 0) 28%);\n  pointer-events: none;\n  z-index: -1;\n}\n\nbody.app-user-theme[_nghost-%COMP%]   .bottom-nav-item[_ngcontent-%COMP%], body.app-user-theme   [_nghost-%COMP%]   .bottom-nav-item[_ngcontent-%COMP%] {\n  color: #425776;\n}\n\nbody.app-user-theme[_nghost-%COMP%]   .bottom-nav-item.active[_ngcontent-%COMP%], body.app-user-theme   [_nghost-%COMP%]   .bottom-nav-item.active[_ngcontent-%COMP%] {\n  color: #1a67a9;\n}\n\n@media (min-width: 900px) {\n  .bottom-nav[_ngcontent-%COMP%] {\n    max-width: 760px;\n    left: 50%;\n    right: auto;\n    transform: translateX(-50%);\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BottomNavComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-bottom-nav', template: "<nav class=\"bottom-nav card\" [attr.aria-label]=\"'bottomNav.aria' | t\">\n  <a\n    *ngFor=\"let item of items\"\n    [routerLink]=\"item.route\"\n    routerLinkActive=\"active\"\n    [routerLinkActiveOptions]=\"{ exact: true }\"\n    class=\"bottom-nav-item\"\n  >\n    <mat-icon fontSet=\"material-icons-round\">{{ item.icon }}</mat-icon>\n    <span>{{ item.labelKey | t }}</span>\n  </a>\n</nav>\n", styles: [".bottom-nav {\n  position: fixed;\n  left: 12px;\n  right: 12px;\n  bottom: calc(10px + env(safe-area-inset-bottom));\n  z-index: 900;\n  min-height: 68px;\n  display: grid;\n  grid-template-columns: repeat(6, minmax(0, 1fr));\n  border-radius: 24px;\n  padding: 8px 4px;\n  isolation: isolate;\n  overflow: hidden;\n}\n\n.bottom-nav-item {\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 3px;\n  color: #33455f;\n  font-size: 0.66rem;\n  font-weight: 500;\n  padding: 4px 2px;\n  text-align: center;\n\n  span {\n    display: block;\n    line-height: 1.1;\n    white-space: nowrap;\n  }\n\n  mat-icon {\n    font-size: 1.22rem;\n    width: 1.22rem;\n    height: 1.22rem;\n  }\n}\n\n.bottom-nav-item.active {\n  color: #1769aa;\n}\n\n:host-context(body.app-user-theme) .bottom-nav {\n  border: 1px solid rgba(181, 162, 126, 0.18);\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(249, 245, 237, 0.94) 100%);\n  box-shadow:\n    0 18px 34px rgba(25, 46, 76, 0.12),\n    0 8px 18px rgba(115, 93, 57, 0.08);\n  backdrop-filter: blur(16px);\n}\n\n:host-context(body.app-user-theme) .bottom-nav::before {\n  content: '';\n  position: absolute;\n  inset: 1px;\n  border-radius: 23px;\n  background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.86) 0%, rgba(255, 255, 255, 0) 34%),\n    radial-gradient(circle at top left, rgba(216, 194, 149, 0.12) 0%, rgba(216, 194, 149, 0) 28%);\n  pointer-events: none;\n  z-index: -1;\n}\n\n:host-context(body.app-user-theme) .bottom-nav-item {\n  color: #425776;\n}\n\n:host-context(body.app-user-theme) .bottom-nav-item.active {\n  color: #1a67a9;\n}\n\n@media (min-width: 900px) {\n  .bottom-nav {\n    max-width: 760px;\n    left: 50%;\n    right: auto;\n    transform: translateX(-50%);\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BottomNavComponent, { className: "BottomNavComponent", filePath: "frontend/src/app/layout/bottom-nav/bottom-nav.component.ts", lineNumber: 15 }); })();
