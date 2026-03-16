import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SplashRoutingModule } from './splash-routing.module';
import { SplashComponent } from './splash.component';
import * as i0 from "@angular/core";
export class SplashModule {
    static { this.ɵfac = function SplashModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SplashModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: SplashModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, SplashRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SplashModule, [{
        type: NgModule,
        args: [{
                declarations: [SplashComponent],
                imports: [SharedModule, SplashRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SplashModule, { declarations: [SplashComponent], imports: [SharedModule, SplashRoutingModule] }); })();
