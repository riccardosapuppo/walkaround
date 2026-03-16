import { NgModule } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { SharedModule } from '../../shared/shared.module';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import * as i0 from "@angular/core";
export class MapModule {
    static { this.ɵfac = function MapModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MapModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: MapModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, LeafletModule, MapRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MapModule, [{
        type: NgModule,
        args: [{
                declarations: [MapComponent],
                imports: [SharedModule, LeafletModule, MapRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MapModule, { declarations: [MapComponent], imports: [SharedModule, LeafletModule, MapRoutingModule] }); })();
