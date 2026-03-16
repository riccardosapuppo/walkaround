import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerComponent } from './player.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: PlayerComponent
    }
];
export class PlayerRoutingModule {
    static { this.ɵfac = function PlayerRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlayerRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: PlayerRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlayerRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(PlayerRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
