import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AdminAuthService,
  DashboardUserRow,
  InviteResponse,
  UserRole
} from '../../core/services/admin-auth.service';

@Component({
  standalone: false,
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  authChecked = false;
  isAuthenticated = false;
  loggingIn = false;
  inviting = false;
  loadingUsers = false;
  updatingRoleUserId: string | null = null;
  impersonatingUserId: string | null = null;
  lastInvite: InviteResponse | null = null;
  users: DashboardUserRow[] = [];
  readonly roleDraftByUserId: Record<string, UserRole> = {};

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  readonly inviteForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['facility_manager' as UserRole, [Validators.required]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: AdminAuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.showDashboardMessagesFromQuery();
    this.auth.ensureAuthenticated().subscribe((isAuthenticated) => {
      this.authChecked = true;
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated && this.canManageUsers) {
        this.loadUsers();
      }
    });
  }

  get currentEmail(): string {
    return this.auth.user?.email || '';
  }

  get currentUserId(): string {
    return this.auth.user?.id || '';
  }

  get currentRole(): UserRole {
    return this.auth.user?.role || 'facility_manager';
  }

  get canManageUsers(): boolean {
    return this.isAuthenticated && this.auth.isAdmin;
  }

  get isImpersonating(): boolean {
    return this.isAuthenticated && this.auth.isImpersonating;
  }

  get impersonatedByEmail(): string {
    return this.auth.session?.session.impersonatedBy?.email || '';
  }

  login(): void {
    if (this.loginForm.invalid || this.loggingIn) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loggingIn = true;
    const { email, password } = this.loginForm.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loggingIn = false;
        this.isAuthenticated = true;
        this.authChecked = true;
        this.loginForm.reset();
        if (this.canManageUsers) {
          this.loadUsers();
        }
      },
      error: (error: { error?: { message?: string } }) => {
        this.loggingIn = false;
        const message = error?.error?.message || 'Login non riuscito';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  invite(): void {
    if (!this.canManageUsers) {
      return;
    }

    if (this.inviteForm.invalid || this.inviting) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    this.inviting = true;
    const { email, role } = this.inviteForm.getRawValue();
    this.auth.inviteUser(email, role, window.location.origin).subscribe({
      next: (response) => {
        this.inviting = false;
        this.lastInvite = response;
        this.inviteForm.reset({ email: '', role: 'facility_manager' });
        this.snackBar.open(`Invito inviato a ${response.email}`, 'OK', { duration: 3200 });
        this.loadUsers();
      },
      error: (error: { error?: { message?: string } }) => {
        this.inviting = false;
        const message = error?.error?.message || 'Errore durante invio invito';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  loadUsers(): void {
    if (!this.canManageUsers || this.loadingUsers) {
      return;
    }

    this.loadingUsers = true;
    this.auth.listUsers().subscribe({
      next: (rows) => {
        this.loadingUsers = false;
        this.users = rows;
        rows.forEach((row) => {
          this.roleDraftByUserId[row.id] = row.role;
        });
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingUsers = false;
        const message = error?.error?.message || 'Errore caricamento utenti';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  saveRole(user: DashboardUserRow): void {
    if (!this.canManageUsers || this.updatingRoleUserId) {
      return;
    }

    const nextRole = this.roleDraftByUserId[user.id];
    if (!nextRole || nextRole === user.role) {
      return;
    }

    this.updatingRoleUserId = user.id;
    this.auth.updateUserRole(user.id, nextRole).subscribe({
      next: (updated) => {
        this.updatingRoleUserId = null;
        this.users = this.users.map((item) => (item.id === updated.id ? { ...item, role: updated.role } : item));
        this.snackBar.open(`Ruolo aggiornato per ${updated.email}`, 'OK', { duration: 2400 });
      },
      error: (error: { error?: { message?: string } }) => {
        this.updatingRoleUserId = null;
        this.roleDraftByUserId[user.id] = user.role;
        const message = error?.error?.message || 'Errore aggiornamento ruolo';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  impersonate(user: DashboardUserRow): void {
    if (!this.canManageUsers || this.impersonatingUserId) {
      return;
    }

    this.impersonatingUserId = user.id;
    this.auth.impersonateUser(user.id).subscribe({
      next: () => {
        this.impersonatingUserId = null;
        this.snackBar.open(`Stai navigando come ${user.email}`, 'OK', { duration: 2400 });
        void this.router.navigate(['/dashboard']);
      },
      error: (error: { error?: { message?: string } }) => {
        this.impersonatingUserId = null;
        const message = error?.error?.message || 'Errore durante impersonazione';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  exitImpersonation(): void {
    this.auth.exitImpersonation().subscribe({
      next: () => {
        this.snackBar.open('Tornato all account admin', 'OK', { duration: 2400 });
        void this.router.navigate(['/dashboard']);
      },
      error: (error: { error?: { message?: string } }) => {
        const message = error?.error?.message || 'Impossibile uscire dalla modalita impersonazione';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.isAuthenticated = false;
      this.users = [];
      this.lastInvite = null;
      this.loginForm.reset();
      this.inviteForm.reset({ email: '', role: 'facility_manager' });
      void this.router.navigate(['/dashboard']);
    });
  }

  roleLabel(role: UserRole): string {
    return role === 'admin' ? 'Admin' : 'Gestore struttura';
  }

  private showDashboardMessagesFromQuery(): void {
    const query = this.route.snapshot.queryParamMap;
    let consumed = false;
    if (query.get('alreadyRegistered') === '1') {
      this.snackBar.open('Utente gia registrato. Effettua il login.', 'OK', { duration: 3200 });
      consumed = true;
    } else if (query.get('registered') === '1') {
      this.snackBar.open('Registrazione completata. Ora effettua il login.', 'OK', { duration: 3200 });
      consumed = true;
    }

    if (consumed) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    }
  }
}
