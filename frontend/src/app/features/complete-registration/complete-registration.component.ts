import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAuthService, InvitationStatusResponse } from '../../core/services/admin-auth.service';

type RegistrationState = 'loading' | 'valid' | 'expired' | 'already_registered' | 'invalid' | 'completed';

@Component({
  standalone: false,
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit, OnDestroy {
  state: RegistrationState = 'loading';
  email = '';
  token = '';
  submitting = false;

  private redirectTimeoutId?: number;

  readonly form = this.formBuilder.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly auth: AdminAuthService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = String(this.route.snapshot.queryParamMap.get('token') || '').trim();
    if (!this.token) {
      this.state = 'invalid';
      return;
    }

    this.checkStatus();
  }

  ngOnDestroy(): void {
    if (this.redirectTimeoutId) {
      clearTimeout(this.redirectTimeoutId);
    }
  }

  submit(): void {
    if (this.state !== 'valid' || this.submitting || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.snackBar.open('Le password non coincidono', 'Chiudi', { duration: 2800 });
      return;
    }

    this.submitting = true;
    this.auth.completeInvitation(this.token, password).subscribe({
      next: () => {
        this.submitting = false;
        this.state = 'completed';
        this.snackBar.open('Registrazione completata', 'OK', { duration: 2200 });
        this.redirectTimeoutId = window.setTimeout(() => {
          void this.router.navigate(['/dashboard'], { queryParams: { registered: 1 } });
        }, 1100);
      },
      error: (error: { error?: { status?: RegistrationState; message?: string } }) => {
        this.submitting = false;
        const status = error?.error?.status;
        if (status === 'already_registered') {
          this.state = 'already_registered';
          this.redirectTimeoutId = window.setTimeout(() => {
            void this.router.navigate(['/dashboard'], { queryParams: { alreadyRegistered: 1 } });
          }, 1200);
          return;
        }

        if (status === 'expired') {
          this.state = 'expired';
          return;
        }

        this.state = 'invalid';
        this.snackBar.open(error?.error?.message || 'Impossibile completare registrazione', 'Chiudi', {
          duration: 3200
        });
      }
    });
  }

  goToLogin(): void {
    void this.router.navigate(['/dashboard']);
  }

  private checkStatus(): void {
    this.state = 'loading';
    this.auth.getInvitationStatus(this.token).subscribe({
      next: (status) => {
        this.applyStatus(status);
      },
      error: () => {
        this.state = 'invalid';
      }
    });
  }

  private applyStatus(status: InvitationStatusResponse): void {
    this.email = status.email || '';

    if (status.status === 'valid') {
      this.state = 'valid';
      return;
    }

    if (status.status === 'already_registered') {
      this.state = 'already_registered';
      this.redirectTimeoutId = window.setTimeout(() => {
        void this.router.navigate(['/dashboard'], { queryParams: { alreadyRegistered: 1 } });
      }, 1200);
      return;
    }

    if (status.status === 'expired') {
      this.state = 'expired';
      return;
    }

    this.state = 'invalid';
  }
}
