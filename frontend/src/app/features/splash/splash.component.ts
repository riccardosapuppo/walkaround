import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit, OnDestroy {
  private timeoutId?: number;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.timeoutId = window.setTimeout(() => {
      void this.router.navigate(['/welcome']);
    }, 1400);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

