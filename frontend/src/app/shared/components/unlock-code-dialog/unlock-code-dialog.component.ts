import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment';
import { AppStateService, HotelAssociation } from '../../../core/services/app-state.service';

export interface UnlockCodeDialogTarget {
  type: 'bundle' | 'single';
  cityId: string;
  poiId?: string;
  label: string;
  baseAmount: number;
}

export interface UnlockCodeDialogData {
  userId: string;
  existingCode?: string;
  existingAssociation?: HotelAssociation | null;
  target: UnlockCodeDialogTarget;
}

interface HotelValidationResponse {
  valid: boolean;
  association?: HotelAssociation;
  codeStatus?: 'valid' | 'expired' | 'invalid' | 'used';
  message?: string;
}

interface HotelValidationErrorPayload {
  message?: string;
  codeStatus?: 'valid' | 'expired' | 'invalid' | 'used';
}

interface PurchaseCheckoutResponse {
  purchased: boolean;
  alreadyPurchased?: boolean;
  type: 'bundle' | 'single';
  cityId?: string;
  poiId?: string;
  amount?: number;
  baseAmount?: number;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount?: number;
  structureId?: string | null;
  inviteCode?: string | null;
  structureFixedAmount?: number;
  structureEarningAmount?: number;
}

export interface UnlockCodeDialogResult {
  action: 'cancel' | 'no_code' | 'paid';
  association?: HotelAssociation | null;
  pricing?: {
    baseAmount: number;
    discountPercent: number;
    discountAmount: number;
    finalAmount: number;
  };
  purchase?: PurchaseCheckoutResponse;
}

type UnlockDialogStep = 'choice' | 'input' | 'summary';

@Component({
  selector: 'app-unlock-code-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './unlock-code-dialog.component.html',
  styleUrls: ['./unlock-code-dialog.component.scss']
})
export class UnlockCodeDialogComponent {
  readonly codeControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[A-Z0-9]{6}$/)]
  });
  readonly amountFormatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  step: UnlockDialogStep = 'choice';
  syncingAssociation = false;
  validating = false;
  validationError = '';
  processingPayment = false;
  paymentCompleted = false;
  paymentError = '';
  appliedAssociation: HotelAssociation | null = null;
  appliedCode = '';
  completedPurchase: PurchaseCheckoutResponse | null = null;
  storedCode = '';
  hasStoredCode = false;

  constructor(
    private readonly dialogRef: MatDialogRef<UnlockCodeDialogComponent, UnlockCodeDialogResult | null>,
    private readonly http: HttpClient,
    private readonly appState: AppStateService,
    @Inject(MAT_DIALOG_DATA) readonly data: UnlockCodeDialogData
  ) {
    this.storedCode = this.resolveStoredCode();
    this.hasStoredCode = this.storedCode.length === 6;

    // Keep manual input empty by default to avoid stale prefill.
    this.codeControl.setValue('');
    this.appliedCode = '';
    this.appliedAssociation = null;
    this.step = 'choice';

    if (this.hasStoredCode) {
      this.syncingAssociation = true;
      this.validateCodeByValue(this.storedCode, { fromStoredCode: true, preserveStepOnError: 'choice' });
    }
  }

  get targetLabel(): string {
    return this.data?.target?.label || (this.data?.target?.type === 'bundle' ? 'citta' : 'luogo');
  }

  get baseAmount(): number {
    return Number(this.data?.target?.baseAmount || 0);
  }

  get discountPercent(): number {
    const association = this.appliedAssociation;
    if (!this.isAssociationApplicableToTarget(association)) {
      return 0;
    }
    const value = Number(
      this.data.target.type === 'bundle'
        ? association?.userDiscountPercentBundle ?? association?.userDiscountPercent ?? 0
        : association?.userDiscountPercentSingle ?? association?.userDiscountPercent ?? 0
    );
    if (!Number.isFinite(value)) {
      return 0;
    }
    return Math.max(0, Math.min(100, value));
  }

  get discountAmount(): number {
    return this.roundMoney((this.baseAmount * this.discountPercent) / 100);
  }

  get finalAmount(): number {
    return this.roundMoney(Math.max(0, this.baseAmount - this.discountAmount));
  }

  get canProceed(): boolean {
    return (
      Boolean(this.appliedAssociation?.structureId) &&
      this.isAssociationValid(this.appliedAssociation) &&
      this.isAssociationApplicableToTarget(this.appliedAssociation) &&
      !this.syncingAssociation &&
      !this.processingPayment &&
      !this.paymentCompleted
    );
  }

  associationCitiesLabel(association: HotelAssociation | null | undefined): string {
    if (!association) {
      return '';
    }
    const cityNames = this.associationCityNames(association);
    if (cityNames.length) {
      return cityNames.join(', ');
    }
    if (association.cityName) {
      return association.cityName;
    }
    return '';
  }

  chooseHasInviteCode(): void {
    this.validationError = '';
    this.step = 'input';
  }

  chooseNoInviteCode(): void {
    this.proceedWithoutCode();
  }

  useStoredCode(): void {
    if (!this.hasStoredCode || this.validating || this.syncingAssociation) {
      return;
    }
    this.validationError = '';
    this.validateCodeByValue(this.storedCode, { fromStoredCode: true, preserveStepOnError: 'choice' });
  }

  backToChoice(): void {
    if (this.appliedAssociation) {
      this.step = 'summary';
      return;
    }
    this.step = 'choice';
  }

  close(): void {
    if (this.processingPayment) {
      return;
    }
    this.dialogRef.close({ action: 'cancel' });
  }

  normalizeCodeInput(): void {
    const current = String(this.codeControl.value || '');
    const normalized = current.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
    if (normalized !== current) {
      this.codeControl.setValue(normalized);
    }
  }

  validateCode(): void {
    this.normalizeCodeInput();
    if (this.codeControl.invalid) {
      this.codeControl.markAsTouched();
      return;
    }

    const code = this.codeControl.value.trim().toUpperCase();
    this.validateCodeByValue(code, { fromStoredCode: false, preserveStepOnError: 'input' });
  }

  useDifferentCode(): void {
    this.step = 'input';
    this.validationError = '';
  }

  proceedWithoutCode(): void {
    if (this.processingPayment || this.paymentCompleted) {
      return;
    }
    this.appliedAssociation = null;
    this.appliedCode = '';
    this.validationError = '';
    this.proceedWithPayment({ withoutCode: true });
  }

  proceedWithPayment(options: { withoutCode?: boolean } = {}): void {
    const withoutCode = Boolean(options.withoutCode);
    if (!withoutCode && !this.appliedAssociation?.structureId) {
      return;
    }
    if (this.processingPayment || this.paymentCompleted) {
      return;
    }

    this.processingPayment = true;
    this.paymentError = '';

    if (this.data.target.type === 'single' && !this.data.target.poiId) {
      this.processingPayment = false;
      this.paymentError = 'Punto di interesse non valido per il pagamento.';
      return;
    }

    const payload =
      this.data.target.type === 'bundle'
        ? {
            userId: this.data.userId,
            type: 'bundle' as const,
            cityId: this.data.target.cityId,
            ignoreDiscountCode: withoutCode
          }
        : {
            userId: this.data.userId,
            type: 'single' as const,
            poiId: this.data.target.poiId || '',
            ignoreDiscountCode: withoutCode
          };

    const startedAt = Date.now();
    this.http.post<PurchaseCheckoutResponse>(`${environment.apiBaseUrl}/purchase`, payload).subscribe({
      next: (response) => {
        const delay = Math.max(0, 900 - (Date.now() - startedAt));
        setTimeout(() => {
          this.processingPayment = false;
          this.paymentCompleted = true;
          this.completedPurchase = response;
        }, delay);
      },
      error: (error: { error?: { message?: string } }) => {
        const delay = Math.max(0, 900 - (Date.now() - startedAt));
        setTimeout(() => {
          this.processingPayment = false;
          this.paymentError = error?.error?.message || 'Pagamento non riuscito. Riprova.';
        }, delay);
      }
    });
  }

  closeAfterPayment(): void {
    this.dialogRef.close({
      action: 'paid',
      association: this.appliedAssociation,
      pricing: {
        baseAmount: this.baseAmount,
        discountPercent: this.discountPercent,
        discountAmount: this.discountAmount,
        finalAmount: this.finalAmount
      },
      purchase: this.completedPurchase || undefined
    });
  }

  get paymentResultMessage(): string {
    if (!this.completedPurchase) {
      return 'Pagamento completato.';
    }
    if (this.completedPurchase.alreadyPurchased) {
      return 'Contenuto già acquistato in precedenza.';
    }
    return 'Pagamento completato con successo.';
  }

  formatAmount(value: number): string {
    return this.amountFormatter.format(this.roundMoney(value));
  }

  private roundMoney(value: number): number {
    const normalized = Number(value);
    if (!Number.isFinite(normalized)) {
      return 0;
    }
    return Math.round(normalized * 100) / 100;
  }

  private resolveStoredCode(): string {
    const fromAssociation = String(this.data?.existingAssociation?.inviteCode || '').trim().toUpperCase();
    if (/^[A-Z0-9]{6}$/.test(fromAssociation)) {
      return fromAssociation;
    }
    const fromCode = String(this.data?.existingCode || '').trim().toUpperCase();
    if (/^[A-Z0-9]{6}$/.test(fromCode)) {
      return fromCode;
    }
    return '';
  }

  private validateCodeByValue(
    code: string,
    options: { fromStoredCode: boolean; preserveStepOnError: UnlockDialogStep }
  ): void {
    if (this.validating) {
      return;
    }

    this.validating = true;
    if (options.fromStoredCode) {
      this.syncingAssociation = true;
    }
    this.validationError = '';

    this.http
      .post<HotelValidationResponse>(`${environment.apiBaseUrl}/hotel/validate`, {
        code,
        userId: this.data.userId,
        targetType: this.data.target.type,
        cityId: this.data.target.cityId
      })
      .subscribe({
        next: (response) => {
          this.validating = false;
          this.syncingAssociation = false;
          if (!response.valid || !response.association) {
            this.appliedAssociation = null;
            this.appliedCode = '';
            this.step = options.preserveStepOnError;
            this.validationError = response.message || this.fallbackValidationError(options.fromStoredCode);
            return;
          }

          const normalizedAssociation = this.normalizeAssociationStatus(response.association);
          if (!this.isAssociationValid(normalizedAssociation)) {
            this.appliedAssociation = null;
            this.appliedCode = '';
            this.step = options.preserveStepOnError;
            this.validationError = this.getInvalidCodeMessage(normalizedAssociation.codeStatus, options.fromStoredCode);
            return;
          }
          if (!this.isAssociationApplicableToTarget(normalizedAssociation)) {
            this.appliedAssociation = null;
            this.appliedCode = '';
            this.step = options.preserveStepOnError;
            this.validationError = options.fromStoredCode
              ? `${this.getInvalidTargetMessage(normalizedAssociation)} Puoi proseguire senza codice oppure inserirne uno nuovo.`
              : this.getInvalidTargetMessage(normalizedAssociation);
            return;
          }

          this.appliedCode = code;
          this.appliedAssociation = normalizedAssociation;
          this.appState.setHotelCode(code);
          this.appState.setHotelAssociation(this.appliedAssociation);
          this.step = 'summary';
        },
        error: (error: { error?: HotelValidationErrorPayload }) => {
          this.validating = false;
          this.syncingAssociation = false;
          this.appliedAssociation = null;
          this.appliedCode = '';
          this.step = options.preserveStepOnError;
          const status = error?.error?.codeStatus;
          const backendMessage = String(error?.error?.message || '').trim();
          if (options.fromStoredCode && backendMessage === 'Il codice non e applicabile a questo acquisto') {
            this.validationError = `${this.getStoredCodeApplicabilityMessage()} Puoi proseguire senza codice oppure inserirne uno nuovo.`;
            return;
          }
          if (status === 'expired' || status === 'used' || status === 'invalid') {
            this.validationError = this.getInvalidCodeMessage(status, options.fromStoredCode);
            return;
          }
          if (options.fromStoredCode && backendMessage) {
            this.validationError =
              backendMessage === 'Il codice non e applicabile a questo acquisto'
                ? 'Il codice salvato non e applicabile a questo acquisto. Puoi proseguire senza codice oppure inserirne uno nuovo.'
                : backendMessage;
            return;
          }
          this.validationError = backendMessage || this.fallbackValidationError(options.fromStoredCode);
        }
      });
  }

  private fallbackValidationError(fromStoredCode: boolean): string {
    return fromStoredCode ? 'Il codice salvato non e valido per questo acquisto.' : 'Codice invito non valido';
  }

  private getStoredCodeApplicabilityMessage(): string {
    const appliesTo = this.data?.existingAssociation?.appliesTo;
    if (appliesTo === 'bundle' && this.data.target.type === 'single') {
      return 'Il codice salvato e applicabile per pacchetto citta, non per luogo singolo.';
    }
    if (appliesTo === 'single' && this.data.target.type === 'bundle') {
      return 'Il codice salvato e applicabile per luogo singolo, non per pacchetto citta.';
    }
    if (appliesTo === 'bundle') {
      return 'Il codice salvato e applicabile solo per pacchetto citta.';
    }
    if (appliesTo === 'single') {
      return 'Il codice salvato e applicabile solo per luogo singolo.';
    }
    return 'Il codice salvato non e applicabile a questo acquisto.';
  }

  private isAssociationValid(association: HotelAssociation | null | undefined): boolean {
    if (!association?.structureId) {
      return false;
    }

    return association.codeStatus === 'valid';
  }

  private isAssociationApplicableToTarget(association: HotelAssociation | null | undefined): boolean {
    if (!association?.structureId) {
      return false;
    }

    const appliesTo = association.appliesTo;
    if ((appliesTo === 'single' || appliesTo === 'bundle') && appliesTo !== this.data.target.type) {
      return false;
    }

    const codeCityIds = this.associationCityIds(association);
    if (codeCityIds.length && !codeCityIds.includes(this.data.target.cityId)) {
      return false;
    }

    return true;
  }

  private getInvalidTargetMessage(association: HotelAssociation): string {
    const targetLabel = this.data.target.type === 'bundle' ? 'pacchetto citta' : 'luogo singolo';
    const appliesTo = association.appliesTo;
    if (appliesTo === 'single' || appliesTo === 'bundle') {
      const codeLabel = appliesTo === 'bundle' ? 'pacchetto citta' : 'luogo singolo';
      if (appliesTo !== this.data.target.type) {
        return `Questo codice e valido solo per ${codeLabel}, non per ${targetLabel}.`;
      }
    }

    const cityNames = this.associationCityNames(association);
    if (cityNames.length) {
      return `Questo codice e valido solo per le citta: ${cityNames.join(', ')}.`;
    }
    if (association.cityName) {
      return `Questo codice e valido solo per la citta ${association.cityName}.`;
    }
    return 'Questo codice non e applicabile a questo acquisto.';
  }

  private associationCityIds(association: HotelAssociation | null | undefined): string[] {
    const ids = Array.isArray(association?.cityIds)
      ? association?.cityIds
      : association?.cityId
        ? [association.cityId]
        : [];
    return ids
      .map((value) => String(value || '').trim())
      .filter((value): value is string => Boolean(value));
  }

  private associationCityNames(association: HotelAssociation | null | undefined): string[] {
    const names = Array.isArray(association?.cityNames)
      ? association?.cityNames
      : association?.cityName
        ? [association.cityName]
        : [];
    return names
      .map((value) => String(value || '').trim())
      .filter((value): value is string => Boolean(value));
  }

  private normalizeAssociationStatus(association: HotelAssociation): HotelAssociation {
    const status = association.codeStatus;
    if (status === 'valid' || status === 'expired' || status === 'invalid' || status === 'used') {
      return association;
    }

    const expiresAtValue = String(association.expiresAt || '').trim();
    if (expiresAtValue) {
      const expiresAtDate = new Date(expiresAtValue);
      if (!Number.isNaN(expiresAtDate.getTime())) {
        return {
          ...association,
          codeStatus: expiresAtDate.getTime() > Date.now() ? 'valid' : 'expired'
        };
      }
    }

    return {
      ...association,
      codeStatus: 'invalid'
    };
  }

  private getInvalidCodeMessage(status: HotelAssociation['codeStatus'] | undefined, fromStoredCode: boolean): string {
    if (status === 'expired') {
      return fromStoredCode ? 'Il codice salvato e scaduto. Inserisci un nuovo codice.' : 'Il codice inserito e scaduto';
    }
    if (status === 'used') {
      return fromStoredCode
        ? 'Il codice salvato e gia stato utilizzato. Inserisci un nuovo codice.'
        : 'Il codice inserito e gia stato utilizzato per questo utente';
    }
    return fromStoredCode
      ? 'Il codice salvato non e piu valido. Inserisci un nuovo codice.'
      : 'Il codice inserito non e piu valido';
  }
}


