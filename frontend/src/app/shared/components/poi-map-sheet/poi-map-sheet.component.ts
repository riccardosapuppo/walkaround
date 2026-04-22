import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Poi } from '../../../core/models/poi.model';
import { I18nService } from '../../../core/services/i18n.service';
import { formatCityLabel } from '../../../core/utils/city-label.util';

export interface PoiMapSheetData {
  poi: Poi;
  distanceLabel: string;
  unlocked: boolean;
  isNavigating: boolean;
  isFavorite: boolean;
  inCart: boolean;
}

export type PoiMapSheetAction =
  | { action: 'navigate'; poiId: string }
  | { action: 'play'; poiId: string; preview: boolean }
  | { action: 'add-to-cart'; poiId: string }
  | { action: 'purchase-city'; cityId: string }
  | { action: 'toggle-favorite'; poiId: string };

@Component({
  standalone: false,
  selector: 'app-poi-map-sheet',
  templateUrl: './poi-map-sheet.component.html',
  styleUrls: ['./poi-map-sheet.component.scss']
})
export class PoiMapSheetComponent {
  readonly cityUnlockPrice = 15;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) readonly data: PoiMapSheetData,
    private readonly bottomSheetRef: MatBottomSheetRef<PoiMapSheetComponent>,
    public readonly i18n: I18nService
  ) {}

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  navigate(): void {
    this.bottomSheetRef.dismiss({ action: 'navigate', poiId: this.data.poi.id } satisfies PoiMapSheetAction);
  }

  play(preview: boolean): void {
    if (!this.hasPlayableAudio(this.data.poi)) {
      return;
    }

    this.bottomSheetRef.dismiss({ action: 'play', poiId: this.data.poi.id, preview } satisfies PoiMapSheetAction);
  }

  addToCart(): void {
    this.bottomSheetRef.dismiss({
      action: 'add-to-cart',
      poiId: this.data.poi.id
    } satisfies PoiMapSheetAction);
  }

  purchaseCity(): void {
    this.bottomSheetRef.dismiss({
      action: 'purchase-city',
      cityId: this.data.poi.cityId
    } satisfies PoiMapSheetAction);
  }

  toggleFavorite(): void {
    this.bottomSheetRef.dismiss({
      action: 'toggle-favorite',
      poiId: this.data.poi.id
    } satisfies PoiMapSheetAction);
  }

  formatPrice(amount: number): string {
    return this.i18n.formatCurrency(Number(amount || 0));
  }

  cityName(cityId: string): string {
    return formatCityLabel(cityId, [], this.i18n.language);
  }

  poiAddress(): string {
    return String(this.data.poi.address || '').trim() || `${this.poiName()}, ${this.cityName(this.data.poi.cityId)}`;
  }

  hasPlayableAudio(poi: Poi | null | undefined): boolean {
    return Boolean(this.i18n.resolvePoiAudioUrl(poi));
  }

  poiName(): string {
    return this.i18n.resolvePoiField(this.data.poi.name, this.data.poi.translations, 'name');
  }

  poiDescription(): string {
    return this.i18n.resolvePoiField(this.data.poi.descriptionShort, this.data.poi.translations, 'descriptionShort');
  }
}
