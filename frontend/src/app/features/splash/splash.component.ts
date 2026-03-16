import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from '../../core/services/app-state.service';

@Component({
  standalone: false,
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit, OnDestroy {
  private timeoutId?: number;

  constructor(
    private readonly router: Router,
    private readonly appState: AppStateService
  ) {}

  ngOnInit(): void {
    this.timeoutId = window.setTimeout(() => {
      if (this.appState.shouldShowWelcomeOnLaunch()) {
        this.appState.markOnboardingSeen();
        void this.router.navigate(['/welcome']);
        return;
      }

      void this.router.navigate(['/home']);
    }, 1400);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
