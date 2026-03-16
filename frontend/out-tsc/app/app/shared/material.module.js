import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import * as i0 from "@angular/core";
const modules = [
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatToolbarModule
];
export class MaterialModule {
    static { this.ɵfac = function MaterialModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MaterialModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: MaterialModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [modules, MatBottomSheetModule,
            MatButtonModule,
            MatCardModule,
            MatDividerModule,
            MatDialogModule,
            MatFormFieldModule,
            MatIconModule,
            MatInputModule,
            MatListModule,
            MatMenuModule,
            MatProgressBarModule,
            MatProgressSpinnerModule,
            MatRadioModule,
            MatSelectModule,
            MatSlideToggleModule,
            MatSliderModule,
            MatSnackBarModule,
            MatToolbarModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MaterialModule, [{
        type: NgModule,
        args: [{
                imports: modules,
                exports: modules
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MaterialModule, { imports: [MatBottomSheetModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSnackBarModule,
        MatToolbarModule], exports: [MatBottomSheetModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSnackBarModule,
        MatToolbarModule] }); })();
