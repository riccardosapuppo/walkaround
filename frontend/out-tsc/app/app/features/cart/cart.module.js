import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import * as i0 from "@angular/core";
export class CartModule {
    static { this.ɵfac = function CartModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CartModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: CartModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, CartRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CartModule, [{
        type: NgModule,
        args: [{
                declarations: [CartComponent],
                imports: [SharedModule, CartRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(CartModule, { declarations: [CartComponent], imports: [SharedModule, CartRoutingModule] }); })();
