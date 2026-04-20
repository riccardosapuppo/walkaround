import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { PartnerRequestService } from '../../core/services/partner-request.service';

@Component({
  standalone: false,
  selector: 'app-partner-registration',
  templateUrl: './partner-registration.component.html',
  styleUrls: ['./partner-registration.component.scss']
})
export class PartnerRegistrationComponent {
  sending = false;
  completed = false;
  requestId: number | null = null;

  readonly form = this.formBuilder.group({
    structureName: ['', [Validators.required, Validators.maxLength(180)]],
    structureType: ['', [Validators.maxLength(120)]],
    vatNumber: ['', [Validators.maxLength(60)]],
    contactFirstName: ['', [Validators.required, Validators.maxLength(120)]],
    contactLastName: ['', [Validators.required, Validators.maxLength(120)]],
    contactEmail: ['', [Validators.required, Validators.email, Validators.maxLength(180)]],
    contactPhone: ['', [Validators.required, Validators.maxLength(80)]],
    website: ['', [Validators.maxLength(240)]],
    addressStreet: ['', [Validators.required, Validators.maxLength(180)]],
    addressNumber: ['', [Validators.maxLength(20)]],
    addressCity: ['', [Validators.required, Validators.maxLength(140)]],
    addressPostalCode: ['', [Validators.maxLength(20)]],
    addressProvince: ['', [Validators.maxLength(80)]],
    addressRegion: ['', [Validators.maxLength(120)]],
    addressCountry: ['Italia', [Validators.required, Validators.maxLength(120)]],
    roomsCount: [null as number | null, [Validators.min(0), Validators.max(10000)]],
    notes: ['', [Validators.maxLength(4000)]],
    privacyAccepted: [false, [Validators.requiredTrue]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly partnerRequestService: PartnerRequestService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    public readonly i18n: I18nService
  ) {
    this.form.controls.addressCountry.setValue(this.i18n.t('common.countryItaly'), { emitEvent: false });
  }

  submit(): void {
    if (this.sending || this.completed) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open(this.i18n.t('partner.validationError'), this.i18n.t('common.close'), {
        duration: 3200
      });
      return;
    }

    this.sending = true;
    const raw = this.form.getRawValue();
    const roomsCount = Number(raw.roomsCount);
    this.partnerRequestService
      .submit({
        structureName: String(raw.structureName || '').trim(),
        structureType: String(raw.structureType || '').trim(),
        vatNumber: String(raw.vatNumber || '').trim(),
        contactFirstName: String(raw.contactFirstName || '').trim(),
        contactLastName: String(raw.contactLastName || '').trim(),
        contactEmail: String(raw.contactEmail || '').trim(),
        contactPhone: String(raw.contactPhone || '').trim(),
        website: String(raw.website || '').trim(),
        addressStreet: String(raw.addressStreet || '').trim(),
        addressNumber: String(raw.addressNumber || '').trim(),
        addressCity: String(raw.addressCity || '').trim(),
        addressPostalCode: String(raw.addressPostalCode || '').trim(),
        addressProvince: String(raw.addressProvince || '').trim(),
        addressRegion: String(raw.addressRegion || '').trim(),
        addressCountry: String(raw.addressCountry || '').trim() || this.i18n.t('common.countryItaly'),
        roomsCount: Number.isFinite(roomsCount) ? roomsCount : null,
        notes: String(raw.notes || '').trim()
      })
      .subscribe({
        next: (response) => {
          this.sending = false;
          this.completed = true;
          this.requestId = response.requestId;
        },
        error: () => {
          this.sending = false;
          this.snackBar.open(this.i18n.t('partner.submitError'), this.i18n.t('common.close'), {
            duration: 3000
          });
        }
      });
  }

  hasControlError(controlName: string, errorCode?: string): boolean {
    const control = this.form.get(controlName);
    if (!control || !control.touched) {
      return false;
    }

    return errorCode ? control.hasError(errorCode) : control.invalid;
  }

  backToWelcome(): void {
    void this.router.navigate(['/welcome']);
  }
}
