import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppLanguage } from '../../core/i18n/app-language';
import { AppStateService } from '../../core/services/app-state.service';
import { I18nService } from '../../core/services/i18n.service';
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
  language: AppLanguage = 'it';

  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly appState: AppStateService,
    private readonly purchaseService: PurchaseService,
    public readonly i18n: I18nService
  ) {
    this.hotelCode = this.appState.hotelCode;
    this.language = this.appState.language;
  }

  start(): void {
    this.appState.markOnboardingSeen();
    this.appState.setActiveCity('catania');
    this.purchaseService.refresh();
    void this.router.navigate(['/home']);
  }

  setLanguage(language: AppLanguage): void {
    this.language = language;
    this.appState.setLanguage(language);
  }

  goToPartnerRegistration(): void {
    void this.router.navigate(['/partner-registration']);
  }

  validateCode(): void {
    const trimmed = this.hotelCode.trim();
    if (!trimmed) {
      this.snackBar.open(this.i18n.t('welcome.insertInviteCode'), this.i18n.t('common.close'), { duration: 2200 });
      return;
    }

    this.isCheckingCode = true;
    this.purchaseService.validateHotelCode(trimmed).subscribe({
      next: (response) => {
        this.isCheckingCode = false;
        if (!response.valid || !response.association) {
          this.snackBar.open(this.i18n.t('welcome.codeNotFound'), this.i18n.t('common.ok'), { duration: 2800 });
          return;
        }

        if (response.association.codeStatus !== 'valid') {
          const invalidMessage =
            response.association.codeStatus === 'expired'
              ? this.i18n.t('welcome.codeExpired')
              : response.association.codeStatus === 'used'
                ? this.i18n.t('welcome.codeUsed')
                : this.i18n.t('welcome.codeNotValid');
          this.snackBar.open(invalidMessage, this.i18n.t('common.ok'), { duration: 2800 });
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
      error: (error: { error?: { codeStatus?: 'expired' | 'used' | 'invalid'; message?: string } }) => {
        this.isCheckingCode = false;
        const message =
          error?.error?.codeStatus === 'expired'
            ? this.i18n.t('welcome.codeExpired')
            : error?.error?.codeStatus === 'used'
              ? this.i18n.t('welcome.codeUsed')
              : error?.error?.codeStatus === 'invalid'
                ? this.i18n.t('welcome.codeNotValid')
                : this.i18n.t('welcome.validationError');
        this.snackBar.open(message, this.i18n.t('common.close'), { duration: 2800 });
      }
    });
  }
}
