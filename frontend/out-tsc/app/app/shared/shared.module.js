import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { PoiMapSheetComponent } from './components/poi-map-sheet/poi-map-sheet.component';
import { DurationLabelPipe } from './pipes/duration-label.pipe';
import { ImgFallbackDirective } from './directives/img-fallback.directive';
import { TranslatePipe } from './pipes/translate.pipe';
import * as i0 from "@angular/core";
export class SharedModule {
    static { this.ɵfac = function SharedModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SharedModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: SharedModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MaterialModule, CommonModule,
            FormsModule,
            ReactiveFormsModule,
            RouterModule,
            MaterialModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SharedModule, [{
        type: NgModule,
        args: [{
                declarations: [PoiMapSheetComponent, DurationLabelPipe, ImgFallbackDirective],
                imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MaterialModule, TranslatePipe],
                exports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    RouterModule,
                    MaterialModule,
                    PoiMapSheetComponent,
                    DurationLabelPipe,
                    ImgFallbackDirective,
                    TranslatePipe
                ]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SharedModule, { declarations: [PoiMapSheetComponent, DurationLabelPipe, ImgFallbackDirective], imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MaterialModule, TranslatePipe], exports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule,
        PoiMapSheetComponent,
        DurationLabelPipe,
        ImgFallbackDirective,
        TranslatePipe] }); })();
