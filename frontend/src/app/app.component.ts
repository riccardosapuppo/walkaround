import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, map, startWith, takeUntil } from 'rxjs';
import { AppAuthService } from './core/services/app-auth.service';
import { AppStateService } from './core/services/app-state.service';

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

  constructor(
    private readonly router: Router,
    private readonly appState: AppStateService,
    private readonly appAuth: AppAuthService
  ) {
    this.syncSurfaceTheme(this.router.url);
    this.appAuth.restoreSession().pipe(takeUntil(this.destroy$)).subscribe();

    this.appState.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => document.documentElement.setAttribute('lang', language));

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => this.syncSurfaceTheme(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
}

