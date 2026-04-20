import { Directive, HostListener, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class ImgFallbackDirective {
    set sourceUrl(value) {
        this.requestedSrc = String(value || '').trim();
        this.hasLoadError = false;
        this.applyCurrentSource();
    }
    constructor(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.imgFallbackSrc = 'assets/images/poi-placeholder.svg';
        this.requestedSrc = '';
        this.hasLoadError = false;
    }
    ngAfterViewInit() {
        this.applyCurrentSource();
    }
    onError() {
        if (this.hasLoadError) {
            return;
        }
        this.hasLoadError = true;
        this.applyCurrentSource();
    }
    applyCurrentSource() {
        const image = this.elementRef.nativeElement;
        const fallback = String(this.imgFallbackSrc || '').trim();
        if (!fallback) {
            return;
        }
        const nextSource = !this.requestedSrc || this.hasLoadError ? fallback : this.requestedSrc;
        const currentSource = String(image.getAttribute('src') || image.src || '').trim();
        if (currentSource === nextSource || currentSource.endsWith(nextSource)) {
            return;
        }
        this.renderer.setAttribute(image, 'src', nextSource);
    }
    static { this.ɵfac = function ImgFallbackDirective_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ImgFallbackDirective)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.Renderer2)); }; }
    static { this.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: ImgFallbackDirective, selectors: [["img", "appImgFallback", ""]], hostBindings: function ImgFallbackDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("error", function ImgFallbackDirective_error_HostBindingHandler() { return ctx.onError(); });
        } }, inputs: { sourceUrl: [0, "appImgFallback", "sourceUrl"], imgFallbackSrc: "imgFallbackSrc" }, standalone: false }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ImgFallbackDirective, [{
        type: Directive,
        args: [{
                selector: 'img[appImgFallback]',
                standalone: false
            }]
    }], () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }], { sourceUrl: [{
            type: Input,
            args: ['appImgFallback']
        }], imgFallbackSrc: [{
            type: Input
        }], onError: [{
            type: HostListener,
            args: ['error']
        }] }); })();
