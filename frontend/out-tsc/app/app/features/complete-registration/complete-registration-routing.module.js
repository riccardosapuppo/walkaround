import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompleteRegistrationComponent } from './complete-registration.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: CompleteRegistrationComponent
    }
];
export class CompleteRegistrationRoutingModule {
    static { this.ɵfac = function CompleteRegistrationRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CompleteRegistrationRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: CompleteRegistrationRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CompleteRegistrationRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(CompleteRegistrationRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
