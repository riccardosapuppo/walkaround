export type CartItemType = 'single';

export interface CartItem {
  key: string;
  type: CartItemType;
  poiId: string;
  cityId: string;
  cityName: string;
  label: string;
  amount: number;
  addedAt: string;
}
