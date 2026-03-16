import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: HomeComponent
    }
];
export class HomeRoutingModule {
    static { this.ɵfac = function HomeRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HomeRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: HomeRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HomeRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(HomeRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
