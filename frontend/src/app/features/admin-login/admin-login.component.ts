import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAuthService } from '../../core/services/admin-auth.service';

@Component({
  standalone: false,
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  loading = false;

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: AdminAuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    void this.auth.ensureAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        void this.router.navigate(['/admin/dashboard']);
      }
    });

    const query = this.route.snapshot.queryParamMap;
    if (query.get('alreadyRegistered') === '1') {
      this.snackBar.open('Utente già registrato. Effettua il login.', 'OK', { duration: 3200 });
    } else if (query.get('registered') === '1') {
      this.snackBar.open('Registrazione completata. Ora effettua il login.', 'OK', { duration: 3200 });
    }
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/admin/dashboard']);
      },
      error: (error: { error?: { message?: string } }) => {
        this.loading = false;
        const message = error?.error?.message || 'Login non riuscito';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }
}
