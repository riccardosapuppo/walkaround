export interface PurchaseItem {
  id: number;
  userId: string;
  type: 'single' | 'bundle';
  cityId: string | null;
  cityName?: string | null;
  poiId: string | null;
  poiName?: string | null;
  amount: number;
  baseAmount?: number;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount?: number;
  structureId?: string | null;
  inviteCode?: string | null;
  structureFixedAmount?: number;
  structureEarningAmount?: number;
  paymentMethod?: string | null;
  paymentProvider?: string | null;
  paymentStatus?: string | null;
  paymentOrderId?: string | null;
  purchasedAt: string;
  expiresAt?: string | null;
  isActive?: boolean;
}

export interface PurchasesResponse {
  items: PurchaseItem[];
  unlockedPoiIds: string[];
  unlockedCityIds: string[];
  adminUnlockSimulation?: boolean;
}
