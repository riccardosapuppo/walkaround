import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import {
  AdminAuthService,
  InvitationStatusResponse,
  PasswordResetStatusResponse
} from '../../core/services/admin-auth.service';
import { AppAuthService } from '../../core/services/app-auth.service';
import { I18nService } from '../../core/services/i18n.service';

type RegistrationState = 'loading' | 'valid' | 'expired' | 'already_registered' | 'invalid' | 'completed';
type CompletionMode = 'invite' | 'reset' | 'app-reset';

@Component({
  standalone: false,
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit, OnDestroy {
  state: RegistrationState = 'loading';
  mode: CompletionMode = 'invite';
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
    private readonly appAuth: AppAuthService,
    private readonly snackBar: MatSnackBar,
    public readonly i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.token = String(this.route.snapshot.queryParamMap.get('token') || '').trim();
    const modeParam = String(this.route.snapshot.queryParamMap.get('mode') || '').trim().toLowerCase();
    const isAppResetRoute = this.router.url.includes('/auth/app-password-reset');
    this.mode = isAppResetRoute || modeParam === 'app-reset' ? 'app-reset' : modeParam === 'reset' ? 'reset' : 'invite';
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
      this.snackBar.open(this.i18n.t('completeRegistration.passwordMismatch'), this.i18n.t('common.close'), { duration: 2800 });
      return;
    }

    this.submitting = true;
    const request$ =
      this.mode === 'app-reset'
        ? this.appAuth.completePasswordReset(this.token, password)
        : this.mode === 'reset'
        ? this.auth.completePasswordReset(this.token, password)
        : this.auth.completeInvitation(this.token, password);

    (request$ as Observable<unknown>).subscribe({
      next: () => {
        this.submitting = false;
        this.state = 'completed';
        const successMessage = this.mode === 'reset'
          ? this.i18n.t('completeRegistration.passwordUpdated')
          : this.i18n.t('completeRegistration.registrationCompleted');
        this.snackBar.open(successMessage, this.i18n.t('common.ok'), { duration: 2200 });
        this.redirectTimeoutId = window.setTimeout(() => {
          if (this.mode === 'app-reset') {
            void this.router.navigate(['/profile'], { queryParams: { passwordReset: 1 } });
            return;
          }
          const queryParams = this.mode === 'reset' ? { passwordReset: 1 } : { registered: 1 };
          void this.router.navigate(['/dashboard'], { queryParams });
        }, 1100);
      },
      error: (error: { error?: { status?: RegistrationState } }) => {
        this.submitting = false;
        const status = error?.error?.status;
        if (this.mode === 'invite' && status === 'already_registered') {
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
        const fallbackMessage = this.mode === 'reset'
          ? this.i18n.t('completeRegistration.updateError')
          : this.i18n.t('completeRegistration.completeError');
        this.snackBar.open(fallbackMessage, this.i18n.t('common.close'), {
          duration: 3200
        });
      }
    });
  }

  goToLogin(): void {
    void this.router.navigate([this.mode === 'app-reset' ? '/profile' : '/dashboard']);
  }

  private checkStatus(): void {
    this.state = 'loading';
    const request$ =
      this.mode === 'app-reset'
        ? this.appAuth.getPasswordResetStatus(this.token)
        : this.mode === 'reset'
          ? this.auth.getPasswordResetStatus(this.token)
          : this.auth.getInvitationStatus(this.token);

    request$.subscribe({
      next: (status) => {
        this.applyStatus(status);
      },
      error: () => {
        this.state = 'invalid';
      }
    });
  }

  private applyStatus(status: InvitationStatusResponse | PasswordResetStatusResponse): void {
    this.email = status.email || '';

    if (status.status === 'valid') {
      this.state = 'valid';
      return;
    }

    if (this.mode === 'invite' && status.status === 'already_registered') {
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

  get pageTitle(): string {
    return this.mode === 'reset'
      || this.mode === 'app-reset'
      ? this.i18n.t('completeRegistration.pageTitleReset')
      : this.i18n.t('completeRegistration.pageTitleInvite');
  }

  get submitLabel(): string {
    return this.mode === 'reset'
      || this.mode === 'app-reset'
      ? this.i18n.t('completeRegistration.submitReset')
      : this.i18n.t('completeRegistration.submitInvite');
  }

  get completedMessage(): string {
    return this.mode === 'reset'
      || this.mode === 'app-reset'
      ? this.i18n.t('completeRegistration.completedReset')
      : this.i18n.t('completeRegistration.completedInvite');
  }

  get expiredMessage(): string {
    return this.mode === 'reset'
      || this.mode === 'app-reset'
      ? this.i18n.t('completeRegistration.expiredReset')
      : this.i18n.t('completeRegistration.expiredInvite');
  }
}
