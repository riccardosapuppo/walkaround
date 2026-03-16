import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: WelcomeComponent
    }
];
export class WelcomeRoutingModule {
    static { this.ɵfac = function WelcomeRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WelcomeRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: WelcomeRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WelcomeRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(WelcomeRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
