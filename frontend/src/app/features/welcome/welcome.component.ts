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
    this.appState.setActiveCity('catania');
    this.purchaseService.refresh();
    void this.router.navigate(['/home']);
  }

  validateCode(): void {
    const trimmed = this.hotelCode.trim();
    if (!trimmed) {
      this.snackBar.open('Inserisci un codice hotel', 'Chiudi', { duration: 2200 });
      return;
    }

    this.isCheckingCode = true;
    this.purchaseService.validateHotelCode(trimmed).subscribe({
      next: (response) => {
        this.isCheckingCode = false;
        if (!response.valid || !response.unlocked) {
          this.snackBar.open('Codice non valido', 'OK', { duration: 2500 });
          return;
        }

        this.appState.setHotelCode(trimmed.toUpperCase());
        this.appState.setActiveCity(response.unlocked.cityId);
        this.snackBar.open(`Bundle ${response.unlocked.cityName} sbloccato`, 'Perfetto', { duration: 2600 });
      },
      error: () => {
        this.isCheckingCode = false;
        this.snackBar.open('Errore validazione codice', 'Chiudi', { duration: 2800 });
      }
    });
  }
}

