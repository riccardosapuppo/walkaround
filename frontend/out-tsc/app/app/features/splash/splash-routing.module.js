import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SplashComponent } from './splash.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: SplashComponent
    }
];
export class SplashRoutingModule {
    static { this.ɵfac = function SplashRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SplashRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: SplashRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SplashRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SplashRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
