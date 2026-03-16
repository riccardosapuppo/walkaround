import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';
import * as i0 from "@angular/core";
export class PlayerModule {
    static { this.ɵfac = function PlayerModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlayerModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: PlayerModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, PlayerRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlayerModule, [{
        type: NgModule,
        args: [{
                declarations: [PlayerComponent],
                imports: [SharedModule, PlayerRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(PlayerModule, { declarations: [PlayerComponent], imports: [SharedModule, PlayerRoutingModule] }); })();
