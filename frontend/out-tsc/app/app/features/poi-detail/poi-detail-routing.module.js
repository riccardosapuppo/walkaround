import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PoiDetailComponent } from './poi-detail.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: PoiDetailComponent
    }
];
export class PoiDetailRoutingModule {
    static { this.ɵfac = function PoiDetailRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PoiDetailRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: PoiDetailRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PoiDetailRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(PoiDetailRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
