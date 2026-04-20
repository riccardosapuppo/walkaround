import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/i18n.service";
export class TranslatePipe {
    constructor(i18n) {
        this.i18n = i18n;
    }
    transform(key, params) {
        return this.i18n.t(key, params);
    }
    static { this.ɵfac = function TranslatePipe_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TranslatePipe)(i0.ɵɵdirectiveInject(i1.I18nService, 16)); }; }
    static { this.ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "t", type: TranslatePipe, pure: false }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TranslatePipe, [{
        type: Pipe,
        args: [{
                name: 't',
                standalone: true,
                pure: false
            }]
    }], () => [{ type: i1.I18nService }], null); })();
