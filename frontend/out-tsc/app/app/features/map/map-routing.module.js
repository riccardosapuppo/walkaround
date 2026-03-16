import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: MapComponent
    }
];
export class MapRoutingModule {
    static { this.ɵfac = function MapRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MapRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: MapRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MapRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MapRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
