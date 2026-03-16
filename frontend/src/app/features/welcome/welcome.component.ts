import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStateService } from '../../core/services/app-state.service';
import { PurchaseService } from '../../core/services/purchase.service';

@Component({
  standalone: false,
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  hotelCode = '';
  isCheckingCode = false;
  showCodeInput = false;

  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly appState: AppStateService,
    private readonly purchaseService: PurchaseService
  ) {
    this.hotelCode = this.appState.hotelCode;
  }

  start(): void {
    this.appState.markOnboardingSeen();
    this.appState.setActiveCity('catania');
    this.purchaseService.refresh();
    void this.router.navigate(['/home']);
  }

  validateCode(): void {
    const trimmed = this.hotelCode.trim();
    if (!trimmed) {
      this.snackBar.open('Inserisci un codice invito/sconto', 'Chiudi', { duration: 2200 });
      return;
    }

    this.isCheckingCode = true;
    this.purchaseService.validateHotelCode(trimmed).subscribe({
      next: (response) => {
        this.isCheckingCode = false;
        if (!response.valid || !response.association) {
          this.snackBar.open(response.message || 'Il codice inserito non esiste', 'OK', { duration: 2800 });
          return;
        }

        if (response.association.codeStatus !== 'valid') {
          const invalidMessage =
            response.association.codeStatus === 'expired'
              ? 'Il codice inserito e scaduto'
              : response.association.codeStatus === 'used'
                ? 'Il codice inserito e gia stato utilizzato'
              : 'Il codice inserito non e piu valido';
          this.snackBar.open(invalidMessage, 'OK', { duration: 2800 });
          return;
        }

        const normalizedCode = (response.association.inviteCode || trimmed).toUpperCase();
        this.appState.markOnboardingSeen();
        this.appState.setHotelCode(normalizedCode);
        this.appState.setHotelAssociation(response.association);
        this.appState.setActiveCity('catania');
        this.purchaseService.refresh();
        void this.router.navigate(['/home']);
      },
      error: (error: { error?: { message?: string } }) => {
        this.isCheckingCode = false;
        const message = error?.error?.message || 'Errore validazione codice';
        this.snackBar.open(message, 'Chiudi', { duration: 2800 });
      }
    });
  }
}

