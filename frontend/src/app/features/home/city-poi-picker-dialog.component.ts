import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CityPoiPickerItem {
  id: string;
  name: string;
  distanceLabel: string;
  durationSec: number;
  priceSingle: number;
  descriptionShort: string;
  unlocked: boolean;
}

export interface CityPoiPickerDialogData {
  cityId: string;
  cityName: string;
  cityUnlockPriceLabel: string;
  pois: CityPoiPickerItem[];
}

export type CityPoiPickerDialogResult =
  | { action: 'purchase-selection'; selectedPoiIds: string[] }
  | { action: 'purchase-city-bundle' };

@Component({
  standalone: false,
  selector: 'app-city-poi-picker-dialog',
  templateUrl: './city-poi-picker-dialog.component.html',
  styleUrls: ['./city-poi-picker-dialog.component.scss']
})
export class CityPoiPickerDialogComponent {
  private readonly selectedIds = new Set<string>();

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: CityPoiPickerDialogData,
    private readonly dialogRef: MatDialogRef<CityPoiPickerDialogComponent, CityPoiPickerDialogResult>
  ) {}

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  get selectedTotal(): number {
    let total = 0;
    for (const poi of this.data.pois) {
      if (this.selectedIds.has(poi.id)) {
        total += Number(poi.priceSingle || 0);
      }
    }
    return total;
  }

  get selectionCtaLabel(): string {
    if (!this.selectedCount) {
      return 'Acquista i selezionati';
    }

    return `Acquista i selezionati (\u20ac${this.formatPrice(this.selectedTotal)})`;
  }

  isSelected(poiId: string): boolean {
    return this.selectedIds.has(poiId);
  }

  togglePoi(poi: CityPoiPickerItem): void {
    if (poi.unlocked) {
      return;
    }

    if (this.selectedIds.has(poi.id)) {
      this.selectedIds.delete(poi.id);
      return;
    }

    this.selectedIds.add(poi.id);
  }

  selectAllLocked(): void {
    this.selectedIds.clear();
    this.data.pois.forEach((poi) => {
      if (!poi.unlocked) {
        this.selectedIds.add(poi.id);
      }
    });
  }

  clearSelection(): void {
    this.selectedIds.clear();
  }

  confirmSelection(): void {
    if (!this.selectedIds.size) {
      return;
    }

    this.dialogRef.close({
      action: 'purchase-selection',
      selectedPoiIds: Array.from(this.selectedIds)
    });
  }

  purchaseCityBundle(): void {
    this.dialogRef.close({
      action: 'purchase-city-bundle'
    });
  }

  formatPrice(amount: number): string {
    return Number(amount || 0)
      .toFixed(2)
      .replace('.', ',');
  }
}
