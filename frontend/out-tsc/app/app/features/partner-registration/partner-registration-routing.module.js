import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PartnerRegistrationComponent } from './partner-registration.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: PartnerRegistrationComponent
    }
];
export class PartnerRegistrationRoutingModule {
    static { this.ɵfac = function PartnerRegistrationRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PartnerRegistrationRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: PartnerRegistrationRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PartnerRegistrationRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(PartnerRegistrationRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
