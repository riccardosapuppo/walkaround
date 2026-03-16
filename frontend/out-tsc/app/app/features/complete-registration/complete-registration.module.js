import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CompleteRegistrationRoutingModule } from './complete-registration-routing.module';
import { CompleteRegistrationComponent } from './complete-registration.component';
import * as i0 from "@angular/core";
export class CompleteRegistrationModule {
    static { this.ɵfac = function CompleteRegistrationModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CompleteRegistrationModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: CompleteRegistrationModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, CompleteRegistrationRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CompleteRegistrationModule, [{
        type: NgModule,
        args: [{
                declarations: [CompleteRegistrationComponent],
                imports: [SharedModule, CompleteRegistrationRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(CompleteRegistrationModule, { declarations: [CompleteRegistrationComponent], imports: [SharedModule, CompleteRegistrationRoutingModule] }); })();
