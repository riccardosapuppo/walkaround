import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, finalize, map, startWith, takeUntil } from 'rxjs';
import { AppLanguage } from './core/i18n/app-language';
import { AppAuthService } from './core/services/app-auth.service';
import { AppCacheService } from './core/services/app-cache.service';
import { AppStateService } from './core/services/app-state.service';
import { LegalDocumentsService, LegalDocumentType } from './core/services/legal-documents.service';

const COOKIE_CONSENT_STORAGE_KEY = 'walkaround.cookieConsent.v1';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  readonly showBottomNav$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.shouldShowBottomNav())
  );

  private readonly destroy$ = new Subject<void>();
  showCookieBanner = false;
  legalDocumentLoading = false;
  legalDocumentHtml = '';
  legalDocumentDialogTitleKey = 'common.cookiePolicy';

  @ViewChild('legalDocumentDialog') private legalDocumentDialog?: TemplateRef<unknown>;

  constructor(
    private readonly router: Router,
    private readonly appState: AppStateService,
    private readonly appAuth: AppAuthService,
    private readonly appCache: AppCacheService,
    private readonly legalDocumentsService: LegalDocumentsService,
    private readonly dialog: MatDialog
  ) {
    this.syncSurfaceTheme(this.router.url);
    this.syncCookieBannerVisibility(this.router.url);
    this.appAuth.restoreSession().pipe(takeUntil(this.destroy$)).subscribe();
    this.appCache.startMonitoring();

    this.appState.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => document.documentElement.setAttribute('lang', language));

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        this.syncSurfaceTheme(event.urlAfterRedirects);
        this.syncCookieBannerVisibility(event.urlAfterRedirects);
        this.redirectDiscountLinkToWelcome(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  acceptCookieConsent(): void {
    localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify({
        choice: 'technical',
        acceptedAt: new Date().toISOString()
      })
    );
    this.showCookieBanner = false;
  }

  openLegalDocumentDialog(documentType: LegalDocumentType): void {
    if (!this.legalDocumentDialog || this.legalDocumentLoading) {
      return;
    }

    this.legalDocumentDialogTitleKey = this.legalDocumentTitleKey(documentType);
    this.legalDocumentHtml = '';
    this.legalDocumentLoading = true;
    this.dialog.open(this.legalDocumentDialog, {
      autoFocus: false,
      restoreFocus: true,
      width: '92vw',
      maxWidth: '760px'
    });

    this.legalDocumentsService
      .getLegalDocument(documentType, this.currentLanguage())
      .pipe(
        finalize(() => {
          this.legalDocumentLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.legalDocumentHtml = response.contentHtml || '';
        },
        error: () => {
          this.legalDocumentHtml = '';
        }
      });
  }

  private routeTreeHasHiddenNav(snapshot: import('@angular/router').ActivatedRouteSnapshot): boolean {
    let current: import('@angular/router').ActivatedRouteSnapshot | null = snapshot;
    while (current) {
      if (current.data['hideBottomNav']) {
        return true;
      }

      current = current.firstChild;
    }

    return false;
  }

  private shouldShowBottomNav(): boolean {
    return !this.urlHasHiddenNav(this.router.url) && !this.routeTreeHasHiddenNav(this.router.routerState.snapshot.root);
  }

  private urlHasHiddenNav(rawUrl: string): boolean {
    const path = String(rawUrl || '').split('?')[0].split('#')[0].toLowerCase();
    return (
      path === '/dashboard' ||
      path.startsWith('/dashboard/') ||
      path.startsWith('/admin/') ||
      path.startsWith('/auth/') ||
      path === '/welcome' ||
      path.startsWith('/partner-registration') ||
      path.startsWith('/player/')
    );
  }

  private syncSurfaceTheme(rawUrl: string): void {
    const url = String(rawUrl || '').toLowerCase();
    const isDashboardSurface =
      url === '/dashboard' ||
      url.startsWith('/dashboard/') ||
      url.startsWith('/admin/') ||
      url.startsWith('/auth/login');

    document.body.classList.toggle('app-user-theme', !isDashboardSurface);
    document.body.classList.toggle('app-admin-theme', isDashboardSurface);
  }

  private syncCookieBannerVisibility(rawUrl: string): void {
    this.showCookieBanner = !this.hasCookieConsent() && this.urlCanShowCookieBanner(rawUrl);
  }

  private hasCookieConsent(): boolean {
    return Boolean(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
  }

  private urlCanShowCookieBanner(rawUrl: string): boolean {
    const path = String(rawUrl || '').split('?')[0].split('#')[0].toLowerCase();
    if (
      path === '/dashboard' ||
      path.startsWith('/dashboard/') ||
      path.startsWith('/admin/') ||
      path.startsWith('/auth/') ||
      path === '/welcome' ||
      path.startsWith('/partner-registration') ||
      path.startsWith('/player/')
    ) {
      return false;
    }

    return true;
  }

  private legalDocumentTitleKey(documentType: LegalDocumentType): string {
    if (documentType === 'termsConditions') {
      return 'common.termsConditions';
    }
    if (documentType === 'privacyPolicy') {
      return 'common.privacy';
    }
    return 'common.cookiePolicy';
  }

  private currentLanguage(): AppLanguage {
    return this.appState.language;
  }

  private redirectDiscountLinkToWelcome(rawUrl: string): void {
    const tree = this.router.parseUrl(rawUrl || '');
    const code = this.extractDiscountCode(tree.queryParams);
    if (!code) {
      return;
    }

    const path = `/${tree.root.children['primary']?.segments.map((segment) => segment.path).join('/') || ''}`;
    if (path === '/welcome') {
      return;
    }

    void this.router.navigate(['/welcome'], {
      queryParams: { code },
      replaceUrl: true
    });
  }

  private extractDiscountCode(queryParams: Record<string, unknown>): string {
    const keys = ['code', 'discountCode', 'codice', 'promo'];
    for (const key of keys) {
      const normalizedCode = this.appState.normalizeHotelCodeInput(queryParams[key]);
      if (normalizedCode) {
        return normalizedCode;
      }
    }
    return '';
  }
}

