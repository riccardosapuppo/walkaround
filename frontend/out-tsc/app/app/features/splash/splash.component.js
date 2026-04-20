import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../../core/services/app-state.service";
import * as i3 from "../../shared/pipes/translate.pipe";
export class SplashComponent {
    constructor(router, appState) {
        this.router = router;
        this.appState = appState;
    }
    ngOnInit() {
        this.timeoutId = window.setTimeout(() => {
            if (this.appState.shouldShowWelcomeOnLaunch()) {
                this.appState.markOnboardingSeen();
                void this.router.navigate(['/welcome']);
                return;
            }
            void this.router.navigate(['/home']);
        }, 1400);
    }
    ngOnDestroy() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    static { this.ɵfac = function SplashComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SplashComponent)(i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.AppStateService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SplashComponent, selectors: [["app-splash"]], standalone: false, decls: 13, vars: 12, consts: [[1, "splash"], [1, "logo-wrap"], [1, "logo-circle"], ["src", "/assets/logo.png", "loading", "eager", "decoding", "sync", "fetchpriority", "high"], ["src", "/public/images/catania/piazza-duomo-ct.jpg"]], template: function SplashComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
            i0.ɵɵelement(3, "img", 3);
            i0.ɵɵpipe(4, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h1");
            i0.ɵɵtext(6);
            i0.ɵɵpipe(7, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p");
            i0.ɵɵtext(9);
            i0.ɵɵpipe(10, "t");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(11, "img", 4);
            i0.ɵɵpipe(12, "t");
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵattribute("alt", i0.ɵɵpipeBind1(4, 4, "common.appName"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 6, "common.appName"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(10, 8, "splash.tagline"));
            i0.ɵɵadvance(2);
            i0.ɵɵattribute("alt", i0.ɵɵpipeBind1(12, 10, "splash.heroAlt"));
        } }, dependencies: [i3.TranslatePipe], styles: [".splash[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding: 36px 22px;\n  display: grid;\n  align-content: center;\n  gap: 36px;\n  background: linear-gradient(170deg, #f6fbff 0%, #eaf2fd 100%);\n}\n\n.logo-wrap[_ngcontent-%COMP%] {\n  text-align: center;\n\n  h1 {\n    margin: 16px 0 8px;\n    font-size: 1.8rem;\n    font-weight: 700;\n    color: #123256;\n  }\n\n  p {\n    margin: 0;\n    color: #4a6283;\n  }\n}\n\n.logo-circle[_ngcontent-%COMP%] {\n  margin: 0 auto;\n  width: 88px;\n  height: 88px;\n  border-radius: 20px;\n  overflow: hidden;\n  border: 1px solid rgba(18, 50, 86, 0.12);\n  box-shadow: 0 12px 26px rgba(18, 50, 86, 0.16);\n\n  img {\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n    display: block;\n  }\n}\n\nimg[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 26px;\n  box-shadow: 0 12px 30px rgba(18, 50, 86, 0.14);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SplashComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-splash', template: "<section class=\"splash\">\n  <div class=\"logo-wrap\">\n    <div class=\"logo-circle\">\n      <img src=\"/assets/logo.png\" [attr.alt]=\"'common.appName' | t\" loading=\"eager\" decoding=\"sync\" fetchpriority=\"high\" />\n    </div>\n    <h1>{{ 'common.appName' | t }}</h1>\n    <p>{{ 'splash.tagline' | t }}</p>\n  </div>\n\n  <img src=\"/public/images/catania/piazza-duomo-ct.jpg\" [attr.alt]=\"'splash.heroAlt' | t\" />\n</section>\n\r\n", styles: [".splash {\n  min-height: 100vh;\n  padding: 36px 22px;\n  display: grid;\n  align-content: center;\n  gap: 36px;\n  background: linear-gradient(170deg, #f6fbff 0%, #eaf2fd 100%);\n}\n\n.logo-wrap {\n  text-align: center;\n\n  h1 {\n    margin: 16px 0 8px;\n    font-size: 1.8rem;\n    font-weight: 700;\n    color: #123256;\n  }\n\n  p {\n    margin: 0;\n    color: #4a6283;\n  }\n}\n\n.logo-circle {\n  margin: 0 auto;\n  width: 88px;\n  height: 88px;\n  border-radius: 20px;\n  overflow: hidden;\n  border: 1px solid rgba(18, 50, 86, 0.12);\n  box-shadow: 0 12px 26px rgba(18, 50, 86, 0.16);\n\n  img {\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n    display: block;\n  }\n}\n\nimg {\n  width: 100%;\n  border-radius: 26px;\n  box-shadow: 0 12px 30px rgba(18, 50, 86, 0.14);\n}\r\n"] }]
    }], () => [{ type: i1.Router }, { type: i2.AppStateService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SplashComponent, { className: "SplashComponent", filePath: "frontend/src/app/features/splash/splash.component.ts", lineNumber: 11 }); })();
