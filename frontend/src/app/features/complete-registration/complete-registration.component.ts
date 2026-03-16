import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AdminAuthService,
  InvitationStatusResponse,
  PasswordResetStatusResponse
} from '../../core/services/admin-auth.service';

type RegistrationState = 'loading' | 'valid' | 'expired' | 'already_registered' | 'invalid' | 'completed';
type CompletionMode = 'invite' | 'reset';

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
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = String(this.route.snapshot.queryParamMap.get('token') || '').trim();
    const modeParam = String(this.route.snapshot.queryParamMap.get('mode') || '').trim().toLowerCase();
    this.mode = modeParam === 'reset' ? 'reset' : 'invite';
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
    const request$ =
      this.mode === 'reset'
        ? this.auth.completePasswordReset(this.token, password)
        : this.auth.completeInvitation(this.token, password);

    request$.subscribe({
      next: () => {
        this.submitting = false;
        this.state = 'completed';
        const successMessage = this.mode === 'reset' ? 'Password aggiornata' : 'Registrazione completata';
        this.snackBar.open(successMessage, 'OK', { duration: 2200 });
        this.redirectTimeoutId = window.setTimeout(() => {
          const queryParams = this.mode === 'reset' ? { passwordReset: 1 } : { registered: 1 };
          void this.router.navigate(['/dashboard'], { queryParams });
        }, 1100);
      },
      error: (error: { error?: { status?: RegistrationState; message?: string } }) => {
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
        const fallbackMessage =
          this.mode === 'reset' ? 'Impossibile aggiornare la password' : 'Impossibile completare registrazione';
        this.snackBar.open(error?.error?.message || fallbackMessage, 'Chiudi', {
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
    const request$ =
      this.mode === 'reset' ? this.auth.getPasswordResetStatus(this.token) : this.auth.getInvitationStatus(this.token);

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
    return this.mode === 'reset' ? 'Reset password' : 'Completa registrazione';
  }

  get submitLabel(): string {
    return this.mode === 'reset' ? 'Aggiorna password' : 'Completa registrazione';
  }

  get completedMessage(): string {
    return this.mode === 'reset'
      ? 'Password aggiornata. Reindirizzamento al login...'
      : 'Registrazione completata. Reindirizzamento al login...';
  }

  get expiredMessage(): string {
    return this.mode === 'reset'
      ? 'Link reset scaduto. Richiedi un nuovo reset password dalla dashboard admin.'
      : 'Link scaduto. Richiedi un nuovo invito dalla dashboard admin.';
  }
}
