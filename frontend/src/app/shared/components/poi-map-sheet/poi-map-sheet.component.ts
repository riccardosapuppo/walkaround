import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Poi } from '../../../core/models/poi.model';

const cityNameMap: Record<string, string> = {
  catania: 'Catania',
  siracusa: 'Siracusa',
  taormina: 'Taormina'
};

export interface PoiMapSheetData {
  poi: Poi;
  distanceLabel: string;
  unlocked: boolean;
}

export type PoiMapSheetAction =
  | { action: 'open-detail'; poiId: string }
  | { action: 'play'; poiId: string; preview: boolean }
  | { action: 'purchase'; cityId: string };

@Component({
  standalone: false,
  selector: 'app-poi-map-sheet',
  templateUrl: './poi-map-sheet.component.html',
  styleUrls: ['./poi-map-sheet.component.scss']
})
export class PoiMapSheetComponent {
  readonly cityUnlockPriceLabel = '14,99';

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) readonly data: PoiMapSheetData,
    private readonly bottomSheetRef: MatBottomSheetRef<PoiMapSheetComponent>
  ) {}

  openDetail(): void {
    this.bottomSheetRef.dismiss({ action: 'open-detail', poiId: this.data.poi.id } satisfies PoiMapSheetAction);
  }

  play(preview: boolean): void {
    this.bottomSheetRef.dismiss({ action: 'play', poiId: this.data.poi.id, preview } satisfies PoiMapSheetAction);
  }

  purchase(): void {
    this.bottomSheetRef.dismiss({
      action: 'purchase',
      cityId: this.data.poi.cityId
    } satisfies PoiMapSheetAction);
  }

  cityName(cityId: string): string {
    return cityNameMap[cityId] || cityId;
  }
}

