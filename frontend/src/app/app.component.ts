import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly showBottomNav$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(null),
    map(() => !this.routeTreeHasHiddenNav(this.router.routerState.snapshot.root))
  );

  constructor(private readonly router: Router) {}

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
}

