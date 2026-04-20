import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class PartnerRequestService {
    constructor(http) {
        this.http = http;
    }
    submit(payload) {
        return this.http.post(`${environment.apiBaseUrl}/partner-registration-requests`, payload);
    }
    static { this.ɵfac = function PartnerRequestService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PartnerRequestService)(i0.ɵɵinject(i1.HttpClient)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PartnerRequestService, factory: PartnerRequestService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PartnerRequestService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }], null); })();
