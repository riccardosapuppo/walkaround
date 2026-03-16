import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FavoritesRoutingModule } from './favorites-routing.module';
import { FavoritesComponent } from './favorites.component';
import * as i0 from "@angular/core";
export class FavoritesModule {
    static { this.ɵfac = function FavoritesModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FavoritesModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: FavoritesModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, FavoritesRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FavoritesModule, [{
        type: NgModule,
        args: [{
                declarations: [FavoritesComponent],
                imports: [SharedModule, FavoritesRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(FavoritesModule, { declarations: [FavoritesComponent], imports: [SharedModule, FavoritesRoutingModule] }); })();
