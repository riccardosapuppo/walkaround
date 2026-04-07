import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[appImgFallback]',
  standalone: false
})
export class ImgFallbackDirective implements AfterViewInit {
  @Input('appImgFallback') set sourceUrl(value: string | null | undefined) {
    this.requestedSrc = String(value || '').trim();
    this.hasLoadError = false;
    this.applyCurrentSource();
  }
  @Input() imgFallbackSrc = '/assets/images/poi-placeholder.svg';

  private requestedSrc = '';
  private hasLoadError = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLImageElement>,
    private readonly renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.applyCurrentSource();
  }

  @HostListener('error')
  onError(): void {
    if (this.hasLoadError) {
      return;
    }

    this.hasLoadError = true;
    this.applyCurrentSource();
  }

  private applyCurrentSource(): void {
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
}
