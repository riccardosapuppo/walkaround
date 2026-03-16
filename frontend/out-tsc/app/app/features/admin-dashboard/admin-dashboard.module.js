import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import * as i0 from "@angular/core";
export class AdminDashboardModule {
    static { this.ɵfac = function AdminDashboardModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdminDashboardModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: AdminDashboardModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [SharedModule, AdminDashboardRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdminDashboardModule, [{
        type: NgModule,
        args: [{
                declarations: [AdminDashboardComponent],
                imports: [SharedModule, AdminDashboardRoutingModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AdminDashboardModule, { declarations: [AdminDashboardComponent], imports: [SharedModule, AdminDashboardRoutingModule] }); })();
