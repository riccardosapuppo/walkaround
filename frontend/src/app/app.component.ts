import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, finalize, map, startWith, takeUntil } from 'rxjs';
import { environment } from '../environments/environment';
import { AppLanguage } from './core/i18n/app-language';
import { AppAuthService } from './core/services/app-auth.service';
import { AppCacheService } from './core/services/app-cache.service';
import { AppStateService } from './core/services/app-state.service';
import { LegalDocumentsService, LegalDocumentType } from './core/services/legal-documents.service';

const COOKIE_CONSENT_STORAGE_KEY = 'walkaround.cookieConsent.v1';

/*
 * Chiuso per la sessione e non per sempre, di proposito.
 *
 * Chi apre questa copia sente silenzio dove dovrebbe esserci una guida, e
 * quel silenzio senza una riga accanto si legge come un difetto. Ricordarsi
 * per sempre che l'avviso e' stato letto vuol dire che alla visita successiva
 * -- o al collega a cui viene passato il link -- il silenzio torna senza
 * spiegazione. `sessionStorage` lo fa sparire finche' la scheda resta aperta,
 * che e' esattamente quanto dura il fastidio.
 */
const DEMO_AUDIO_DISMISSED_KEY = 'walkaround.demoAudioNotice.v1';

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

  /** Se questa copia ha solo il segnaposto al posto delle audioguide. */
  showDemoAudioNotice = false;
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
    private readonly dialog: MatDialog,
    private readonly http: HttpClient
  ) {
    this.syncSurfaceTheme(this.router.url);
    this.syncCookieBannerVisibility(this.router.url);
    this.appAuth.restoreSession().pipe(takeUntil(this.destroy$)).subscribe();
    this.appCache.startMonitoring();
    this.checkTheAudioCatalogue();

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

  /**
   * Chiede al backend se le audioguide vere ci sono.
   *
   * Chiesto e non dichiarato: il backend conta gli mp3 dentro `public/audio/`,
   * quindi su walkaround.cloud la risposta e' falsa da sola. Il Dockerfile di
   * questo repository fa `build:prod`, cioe' esattamente la build del sito in
   * esercizio -- una bandierina scritta a mano nell'ambiente sarebbe una cosa
   * da ricordarsi di spegnere, e quindi una cosa che prima o poi resta accesa
   * in produzione.
   *
   * Se la domanda non riceve risposta non si mostra niente: un avviso che
   * compare perche' una richiesta e' fallita e' peggio di nessun avviso.
   */
  private checkTheAudioCatalogue(): void {
    if (sessionStorage.getItem(DEMO_AUDIO_DISMISSED_KEY)) {
      return;
    }

    this.http
      .get<{ placeholderOnly?: boolean }>(`${environment.apiBaseUrl}/audio-catalogue-state`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stato) => (this.showDemoAudioNotice = stato?.placeholderOnly === true),
        error: () => (this.showDemoAudioNotice = false)
      });
  }

  /** Nascondi l'avviso, per questa scheda. */
  dismissDemoAudioNotice(): void {
    sessionStorage.setItem(DEMO_AUDIO_DISMISSED_KEY, '1');
    this.showDemoAudioNotice = false;
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

