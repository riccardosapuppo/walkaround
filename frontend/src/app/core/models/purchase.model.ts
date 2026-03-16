export interface PurchaseItem {
  id: number;
  userId: string;
  type: 'single' | 'bundle';
  cityId: string | null;
  poiId: string | null;
  amount: number;
  baseAmount?: number;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount?: number;
  structureId?: string | null;
  inviteCode?: string | null;
  structureFixedAmount?: number;
  structureEarningAmount?: number;
  purchasedAt: string;
}

export interface PurchasesResponse {
  items: PurchaseItem[];
  unlockedPoiIds: string[];
  unlockedCityIds: string[];
}
