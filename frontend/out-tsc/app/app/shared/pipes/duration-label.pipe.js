import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class DurationLabelPipe {
    transform(totalSeconds) {
        if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
            return '0:00';
        }
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60)
            .toString()
            .padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
    static { this.ɵfac = function DurationLabelPipe_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DurationLabelPipe)(); }; }
    static { this.ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "durationLabel", type: DurationLabelPipe, pure: true, standalone: false }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DurationLabelPipe, [{
        type: Pipe,
        args: [{
                standalone: false,
                name: 'durationLabel'
            }]
    }], null, null); })();
