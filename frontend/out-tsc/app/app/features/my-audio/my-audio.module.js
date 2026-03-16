import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MyAudioRoutingModule } from './my-audio-routing.module';
import { MyAudioComponent } from './my-audio.component';
import * as i0 from "@angular/core";
export class MyAudioModule {
    static { this.ɵfac = function MyAudioModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MyAudioModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: MyAudioModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, MyAudioRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MyAudioModule, [{
        type: NgModule,
        args: [{
                declarations: [MyAudioComponent],
                imports: [SharedModule, MyAudioRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyAudioModule, { declarations: [MyAudioComponent], imports: [SharedModule, MyAudioRoutingModule] }); })();
