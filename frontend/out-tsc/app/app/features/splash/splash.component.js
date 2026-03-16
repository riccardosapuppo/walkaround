import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/material/icon";
export class SplashComponent {
    constructor(router) {
        this.router = router;
    }
    ngOnInit() {
        this.timeoutId = window.setTimeout(() => {
            void this.router.navigate(['/welcome']);
        }, 1400);
    }
    ngOnDestroy() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    static { this.ɵfac = function SplashComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SplashComponent)(i0.ɵɵdirectiveInject(i1.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SplashComponent, selectors: [["app-splash"]], standalone: false, decls: 10, vars: 0, consts: [[1, "splash"], [1, "logo-wrap"], [1, "logo-circle"], ["fontSet", "material-icons-round"], ["src", "/public/images/catania/piazza-duomo-ct.jpg", "alt", "Illustrazione Catania"]], template: function SplashComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "mat-icon", 3);
            i0.ɵɵtext(4, "travel_explore");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(5, "h1");
            i0.ɵɵtext(6, "Tourism Audio Guide");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p");
            i0.ɵɵtext(8, "Catania e Sicilia orientale in cuffia");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(9, "img", 4);
            i0.ɵɵelementEnd();
        } }, dependencies: [i2.MatIcon], styles: [".splash[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding: 36px 22px;\n  display: grid;\n  align-content: center;\n  gap: 36px;\n  background: linear-gradient(170deg, #f6fbff 0%, #eaf2fd 100%);\n}\n\n.logo-wrap[_ngcontent-%COMP%] {\n  text-align: center;\n\n  h1 {\n    margin: 16px 0 8px;\n    font-size: 1.8rem;\n    font-weight: 700;\n    color: #123256;\n  }\n\n  p {\n    margin: 0;\n    color: #4a6283;\n  }\n}\n\n.logo-circle[_ngcontent-%COMP%] {\n  margin: 0 auto;\n  width: 88px;\n  height: 88px;\n  border-radius: 50%;\n  background: #1769aa;\n  display: grid;\n  place-items: center;\n  color: white;\n\n  mat-icon {\n    font-size: 2.1rem;\n    width: 2.1rem;\n    height: 2.1rem;\n  }\n}\n\nimg[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 26px;\n  box-shadow: 0 12px 30px rgba(18, 50, 86, 0.14);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SplashComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-splash', template: "<section class=\"splash\">\n  <div class=\"logo-wrap\">\n    <div class=\"logo-circle\">\n      <mat-icon fontSet=\"material-icons-round\">travel_explore</mat-icon>\n    </div>\n    <h1>Tourism Audio Guide</h1>\n    <p>Catania e Sicilia orientale in cuffia</p>\n  </div>\n\n  <img src=\"/public/images/catania/piazza-duomo-ct.jpg\" alt=\"Illustrazione Catania\" />\n</section>\r\n", styles: [".splash {\n  min-height: 100vh;\n  padding: 36px 22px;\n  display: grid;\n  align-content: center;\n  gap: 36px;\n  background: linear-gradient(170deg, #f6fbff 0%, #eaf2fd 100%);\n}\n\n.logo-wrap {\n  text-align: center;\n\n  h1 {\n    margin: 16px 0 8px;\n    font-size: 1.8rem;\n    font-weight: 700;\n    color: #123256;\n  }\n\n  p {\n    margin: 0;\n    color: #4a6283;\n  }\n}\n\n.logo-circle {\n  margin: 0 auto;\n  width: 88px;\n  height: 88px;\n  border-radius: 50%;\n  background: #1769aa;\n  display: grid;\n  place-items: center;\n  color: white;\n\n  mat-icon {\n    font-size: 2.1rem;\n    width: 2.1rem;\n    height: 2.1rem;\n  }\n}\n\nimg {\n  width: 100%;\n  border-radius: 26px;\n  box-shadow: 0 12px 30px rgba(18, 50, 86, 0.14);\n}\r\n"] }]
    }], () => [{ type: i1.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SplashComponent, { className: "SplashComponent", filePath: "frontend/src/app/features/splash/splash.component.ts", lineNumber: 10 }); })();
