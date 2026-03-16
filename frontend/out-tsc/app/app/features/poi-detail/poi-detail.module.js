import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PoiDetailRoutingModule } from './poi-detail-routing.module';
import { PoiDetailComponent } from './poi-detail.component';
import * as i0 from "@angular/core";
export class PoiDetailModule {
    static { this.ɵfac = function PoiDetailModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PoiDetailModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: PoiDetailModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, PoiDetailRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PoiDetailModule, [{
        type: NgModule,
        args: [{
                declarations: [PoiDetailComponent],
                imports: [SharedModule, PoiDetailRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(PoiDetailModule, { declarations: [PoiDetailComponent], imports: [SharedModule, PoiDetailRoutingModule] }); })();
