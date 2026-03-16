import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: ProfileComponent
    }
];
export class ProfileRoutingModule {
    static { this.ɵfac = function ProfileRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ProfileRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: ProfileRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ProfileRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(ProfileRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
