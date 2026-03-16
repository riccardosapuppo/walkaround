import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import * as i0 from "@angular/core";
export class ProfileModule {
    static { this.ɵfac = function ProfileModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ProfileModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: ProfileModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, ProfileRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ProfileModule, [{
        type: NgModule,
        args: [{
                declarations: [ProfileComponent],
                imports: [SharedModule, ProfileRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(ProfileModule, { declarations: [ProfileComponent], imports: [SharedModule, ProfileRoutingModule] }); })();
