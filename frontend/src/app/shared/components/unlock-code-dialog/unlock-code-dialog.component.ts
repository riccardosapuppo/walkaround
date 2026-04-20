import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment';
import { AppStateService, HotelAssociation } from '../../../core/services/app-state.service';
import { I18nService } from '../../../core/services/i18n.service';
import { PayPalCheckoutRequest, PayPalCheckoutService } from '../../../core/services/paypal-checkout.service';

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
export class UnlockCodeDialogComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('paypalButtonsContainer') paypalButtonsContainer?: ElementRef<HTMLDivElement>;

  readonly codeControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[A-Z0-9]{6}$/)]
  });

  step: UnlockDialogStep = 'choice';
  syncingAssociation = false;
  validating = false;
  validationError = '';
  processingPayment = false;
  paymentCompleted = false;
  paymentError = '';
  paypalLoading = false;
  appliedAssociation: HotelAssociation | null = null;
  appliedCode = '';
  completedPurchase: PurchaseCheckoutResponse | null = null;
  storedCode = '';
  hasStoredCode = false;

  private destroyed = false;
  private lastPayPalRenderSignature = '';

  constructor(
    private readonly dialogRef: MatDialogRef<UnlockCodeDialogComponent, UnlockCodeDialogResult | null>,
    private readonly http: HttpClient,
    private readonly paypalCheckout: PayPalCheckoutService,
    private readonly appState: AppStateService,
    public readonly i18n: I18nService,
    @Inject(MAT_DIALOG_DATA) readonly data: UnlockCodeDialogData
  ) {
    this.storedCode = this.resolveStoredCode();
    this.hasStoredCode = this.storedCode.length === 6;

    this.codeControl.setValue('');
    this.appliedCode = '';
    this.appliedAssociation = null;
    this.step = 'choice';

    if (this.hasStoredCode) {
      this.syncingAssociation = true;
      this.validateCodeByValue(this.storedCode, { fromStoredCode: true, preserveStepOnError: 'choice' });
    }
  }

  ngAfterViewChecked(): void {
    if (this.step !== 'summary' || this.paymentCompleted) {
      return;
    }

    const container = this.paypalButtonsContainer?.nativeElement;
    if (!container) {
      return;
    }

    const signature = this.buildPayPalRenderSignature();
    if (!signature || signature === this.lastPayPalRenderSignature) {
      return;
    }

    this.lastPayPalRenderSignature = signature;
    void this.renderPayPalButtons();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.clearPayPalButtons();
  }

  get targetLabel(): string {
    return this.data?.target?.label || this.applicableToLabel(this.data?.target?.type === 'bundle' ? 'bundle' : 'single');
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
    this.resetPayPalRenderState();
    this.step = 'input';
  }

  chooseNoInviteCode(): void {
    this.openPayPalSummaryWithoutCode();
  }

  useStoredCode(): void {
    if (!this.hasStoredCode || this.validating || this.syncingAssociation) {
      return;
    }
    this.validationError = '';
    this.validateCodeByValue(this.storedCode, { fromStoredCode: true, preserveStepOnError: 'choice' });
  }

  backToChoice(): void {
    this.resetPayPalRenderState();
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
    this.resetPayPalRenderState();
    this.step = 'input';
    this.validationError = '';
  }

  proceedWithoutCode(): void {
    this.openPayPalSummaryWithoutCode();
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
      return this.i18n.t('unlock.paymentDone');
    }
    if (this.completedPurchase.alreadyPurchased) {
      return this.i18n.t('unlock.alreadyPurchased');
    }
    return this.i18n.t('unlock.paymentSuccess');
  }

  formatAmount(value: number): string {
    return this.i18n.formatCurrency(this.roundMoney(value));
  }

  formatDateTime(value: string | Date | null | undefined): string {
    return this.i18n.formatDateTime(value);
  }

  codeStatusLabel(status: HotelAssociation['codeStatus'] | undefined): string {
    if (status === 'valid') {
      return this.i18n.t('common.status.valid');
    }
    if (status === 'used') {
      return this.i18n.t('common.status.used');
    }
    if (status === 'expired') {
      return this.i18n.t('common.status.expired');
    }
    return this.i18n.t('common.status.invalid');
  }

  applicableToLabel(value: 'bundle' | 'single' | null | undefined): string {
    return value === 'bundle' ? this.i18n.t('unlock.applicableBundle') : this.i18n.t('unlock.applicableSingle');
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
            this.resetPayPalRenderState();
            this.step = options.preserveStepOnError;
            this.validationError = this.fallbackValidationError(options.fromStoredCode);
            return;
          }

          const normalizedAssociation = this.normalizeAssociationStatus(response.association);
          if (!this.isAssociationValid(normalizedAssociation)) {
            this.appliedAssociation = null;
            this.appliedCode = '';
            this.resetPayPalRenderState();
            this.step = options.preserveStepOnError;
            this.validationError = this.getInvalidCodeMessage(normalizedAssociation.codeStatus, options.fromStoredCode);
            return;
          }
          if (!this.isAssociationApplicableToTarget(normalizedAssociation)) {
            this.appliedAssociation = null;
            this.appliedCode = '';
            this.resetPayPalRenderState();
            this.step = options.preserveStepOnError;
            this.validationError = options.fromStoredCode
              ? `${this.getInvalidTargetMessage(normalizedAssociation)} ${this.i18n.t('unlock.proceedWithoutOrChangeCode')}`
              : this.getInvalidTargetMessage(normalizedAssociation);
            return;
          }

          this.appliedCode = code;
          this.appliedAssociation = normalizedAssociation;
          this.appState.setHotelCode(code);
          this.appState.setHotelAssociation(this.appliedAssociation);
          this.step = 'summary';
          this.paymentError = '';
          this.resetPayPalRenderState();
        },
        error: (error: { error?: HotelValidationErrorPayload }) => {
          this.validating = false;
          this.syncingAssociation = false;
          this.appliedAssociation = null;
          this.appliedCode = '';
          this.resetPayPalRenderState();
          this.step = options.preserveStepOnError;
          const status = error?.error?.codeStatus;
          const backendMessage = String(error?.error?.message || '').trim();
          if (options.fromStoredCode && backendMessage === 'Il codice non e applicabile a questo acquisto') {
            this.validationError = `${this.getStoredCodeApplicabilityMessage()} ${this.i18n.t('unlock.proceedWithoutOrChangeCode')}`;
            return;
          }
          if (status === 'expired' || status === 'used' || status === 'invalid') {
            this.validationError = this.getInvalidCodeMessage(status, options.fromStoredCode);
            return;
          }
          this.validationError = this.fallbackValidationError(options.fromStoredCode);
        }
      });
  }

  private fallbackValidationError(fromStoredCode: boolean): string {
    return fromStoredCode ? this.i18n.t('unlock.invalidStoredCode') : this.i18n.t('unlock.invalidCode');
  }

  private getStoredCodeApplicabilityMessage(): string {
    const appliesTo = this.data?.existingAssociation?.appliesTo;
    if (appliesTo === 'bundle' && this.data.target.type === 'single') {
      return this.i18n.t('unlock.savedCodeBundleNotSingle');
    }
    if (appliesTo === 'single' && this.data.target.type === 'bundle') {
      return this.i18n.t('unlock.savedCodeSingleNotBundle');
    }
    if (appliesTo === 'bundle') {
      return this.i18n.t('unlock.savedCodeBundleOnly');
    }
    if (appliesTo === 'single') {
      return this.i18n.t('unlock.savedCodeSingleOnly');
    }
    return this.i18n.t('unlock.storedCodeNotApplicable');
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
    const targetLabel = this.applicableToLabel(this.data.target.type);
    const appliesTo = association.appliesTo;
    if (appliesTo === 'single' || appliesTo === 'bundle') {
      const codeLabel = this.applicableToLabel(appliesTo);
      if (appliesTo !== this.data.target.type) {
        return this.i18n.t('unlock.codeValidOnlyFor', { codeLabel, targetLabel });
      }
    }

    const cityNames = this.associationCityNames(association);
    if (cityNames.length) {
      return this.i18n.t('unlock.codeValidOnlyForCities', { cities: cityNames.join(', ') });
    }
    if (association.cityName) {
      return this.i18n.t('unlock.codeValidOnlyForCity', { city: association.cityName });
    }
    return this.i18n.t('unlock.codeNotApplicable');
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
      return fromStoredCode ? this.i18n.t('unlock.storedCodeExpired') : this.i18n.t('unlock.codeExpired');
    }
    if (status === 'used') {
      return fromStoredCode ? this.i18n.t('unlock.storedCodeUsed') : this.i18n.t('unlock.codeUsed');
    }
    return fromStoredCode ? this.i18n.t('unlock.storedCodeInvalid') : this.i18n.t('unlock.codeInvalid');
  }

  private openPayPalSummaryWithoutCode(): void {
    if (this.processingPayment || this.paymentCompleted) {
      return;
    }

    this.appliedAssociation = null;
    this.appliedCode = '';
    this.validationError = '';
    this.paymentError = '';
    this.step = 'summary';
    this.resetPayPalRenderState();
  }

  private buildPayPalRenderSignature(): string {
    if (this.step !== 'summary' || this.processingPayment || this.paymentCompleted) {
      return '';
    }

    const associationKey = this.appliedAssociation?.inviteCode || this.appliedAssociation?.structureId || 'no-code';
    return [this.data.target.type, this.data.target.cityId, this.data.target.poiId || '', associationKey].join('|');
  }

  private buildPayPalPayload(): PayPalCheckoutRequest {
    if (this.data.target.type === 'bundle') {
      return {
        userId: this.data.userId,
        checkoutContext: 'bundle',
        cityId: this.data.target.cityId,
        ignoreDiscountCode: !this.appliedAssociation?.structureId
      };
    }

    return {
      userId: this.data.userId,
      checkoutContext: 'single',
      poiId: this.data.target.poiId || '',
      ignoreDiscountCode: !this.appliedAssociation?.structureId
    };
  }

  private async renderPayPalButtons(): Promise<void> {
    const container = this.paypalButtonsContainer?.nativeElement;
    if (!container || this.destroyed) {
      return;
    }

    this.paypalLoading = true;
    this.paymentError = '';
    this.clearPayPalButtons();

    try {
      await this.paypalCheckout.renderButtons(container, this.buildPayPalPayload(), {
        onStart: () => {
          this.processingPayment = true;
          this.paymentError = '';
        },
        onSuccess: (response) => {
          if (this.destroyed) {
            return;
          }

          this.processingPayment = false;
          this.paypalLoading = false;
          this.paymentCompleted = true;
          this.completedPurchase = response.purchases[0] || null;
          this.clearPayPalButtons();
        },
        onCancel: () => {
          this.processingPayment = false;
        },
        onError: (message) => {
          if (this.destroyed) {
            return;
          }

          this.processingPayment = false;
          this.paypalLoading = false;
          this.paymentError = message;
        }
      });

      this.paypalLoading = false;
    } catch (error) {
      if (this.destroyed) {
        return;
      }

      this.processingPayment = false;
      this.paypalLoading = false;
      this.paymentError = error instanceof Error ? error.message : this.i18n.t('paypal.loadError');
      this.clearPayPalButtons();
    }
  }

  private resetPayPalRenderState(): void {
    this.lastPayPalRenderSignature = '';
    this.processingPayment = false;
    this.paypalLoading = false;
    this.clearPayPalButtons();
  }

  private clearPayPalButtons(): void {
    this.paypalCheckout.clearButtons(this.paypalButtonsContainer?.nativeElement);
  }
}
