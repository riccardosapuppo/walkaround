import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FavoritesComponent } from './favorites.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: FavoritesComponent
    }
];
export class FavoritesRoutingModule {
    static { this.ɵfac = function FavoritesRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FavoritesRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: FavoritesRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FavoritesRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(FavoritesRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
