import { Component } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/common";
import * as i3 from "./layout/bottom-nav/bottom-nav.component";
function AppComponent_app_bottom_nav_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-bottom-nav");
} }
export class AppComponent {
    constructor(router) {
        this.router = router;
        this.showBottomNav$ = this.router.events.pipe(filter((event) => event instanceof NavigationEnd), startWith(null), map(() => !this.routeTreeHasHiddenNav(this.router.routerState.snapshot.root)));
    }
    routeTreeHasHiddenNav(snapshot) {
        let current = snapshot;
        while (current) {
            if (current.data['hideBottomNav']) {
                return true;
            }
            current = current.firstChild;
        }
        return false;
    }
    static { this.ɵfac = function AppComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppComponent)(i0.ɵɵdirectiveInject(i1.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppComponent, selectors: [["app-root"]], standalone: false, decls: 3, vars: 3, consts: [[4, "ngIf"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelement(0, "router-outlet");
            i0.ɵɵtemplate(1, AppComponent_app_bottom_nav_1_Template, 1, 0, "app-bottom-nav", 0);
            i0.ɵɵpipe(2, "async");
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", i0.ɵɵpipeBind1(2, 1, ctx.showBottomNav$));
        } }, dependencies: [i2.NgIf, i1.RouterOutlet, i3.BottomNavComponent, i2.AsyncPipe], styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-root', template: "<router-outlet></router-outlet>\n<app-bottom-nav *ngIf=\"showBottomNav$ | async\"></app-bottom-nav>\r\n", styles: [":host {\n  display: block;\n  min-height: 100vh;\n}\r\n"] }]
    }], () => [{ type: i1.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "frontend/src/app/app.component.ts", lineNumber: 11 }); })();
