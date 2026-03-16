import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import * as i0 from "@angular/core";
export class WelcomeModule {
    static { this.ɵfac = function WelcomeModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WelcomeModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: WelcomeModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, WelcomeRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WelcomeModule, [{
        type: NgModule,
        args: [{
                declarations: [WelcomeComponent],
                imports: [SharedModule, WelcomeRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(WelcomeModule, { declarations: [WelcomeComponent], imports: [SharedModule, WelcomeRoutingModule] }); })();
