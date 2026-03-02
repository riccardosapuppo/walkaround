export interface PurchaseItem {
  id: number;
  userId: string;
  type: 'single' | 'bundle';
  cityId: string | null;
  poiId: string | null;
  amount: number;
  purchasedAt: string;
}

export interface PurchasesResponse {
  items: PurchaseItem[];
  unlockedPoiIds: string[];
  unlockedCityIds: string[];
}

