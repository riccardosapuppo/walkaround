import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: AdminDashboardComponent
    }
];
export class AdminDashboardRoutingModule {
    static { this.ɵfac = function AdminDashboardRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdminDashboardRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: AdminDashboardRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdminDashboardRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AdminDashboardRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
