import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyAudioComponent } from './my-audio.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: MyAudioComponent
    }
];
export class MyAudioRoutingModule {
    static { this.ɵfac = function MyAudioRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MyAudioRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: MyAudioRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MyAudioRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyAudioRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
