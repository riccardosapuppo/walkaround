import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PartnerRegistrationRoutingModule } from './partner-registration-routing.module';
import { PartnerRegistrationComponent } from './partner-registration.component';
import * as i0 from "@angular/core";
export class PartnerRegistrationModule {
    static { this.ɵfac = function PartnerRegistrationModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PartnerRegistrationModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: PartnerRegistrationModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, PartnerRegistrationRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PartnerRegistrationModule, [{
        type: NgModule,
        args: [{
                declarations: [PartnerRegistrationComponent],
                imports: [SharedModule, PartnerRegistrationRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(PartnerRegistrationModule, { declarations: [PartnerRegistrationComponent], imports: [SharedModule, PartnerRegistrationRoutingModule] }); })();
