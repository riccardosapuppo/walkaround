import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BottomNavComponent } from './layout/bottom-nav/bottom-nav.component';
import { MaterialModule } from './shared/material.module';
import { environment } from '../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/service-worker";
registerLocaleData(localeIt);
export class AppModule {
    static { this.ɵfac = function AppModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: AppModule, bootstrap: [AppComponent] }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ providers: [{ provide: LOCALE_ID, useValue: 'it-IT' }], imports: [BrowserModule,
            BrowserAnimationsModule,
            HttpClientModule,
            AppRoutingModule,
            MaterialModule,
            ServiceWorkerModule.register('ngsw-worker.js', {
                enabled: environment.production,
                registrationStrategy: 'registerWhenStable:30000'
            })] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppModule, [{
        type: NgModule,
        args: [{
                declarations: [AppComponent, BottomNavComponent],
                imports: [
                    BrowserModule,
                    BrowserAnimationsModule,
                    HttpClientModule,
                    AppRoutingModule,
                    MaterialModule,
                    ServiceWorkerModule.register('ngsw-worker.js', {
                        enabled: environment.production,
                        registrationStrategy: 'registerWhenStable:30000'
                    })
                ],
                providers: [{ provide: LOCALE_ID, useValue: 'it-IT' }],
                bootstrap: [AppComponent]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AppModule, { declarations: [AppComponent, BottomNavComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        MaterialModule, i1.ServiceWorkerModule] }); })();
