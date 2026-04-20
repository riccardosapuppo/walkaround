import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';

const CART_STORAGE_KEY = 'walkaround.cart.items';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.readStoredItems());

  readonly items$ = this.itemsSubject.asObservable();

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  get count(): number {
    return this.items.length;
  }

  get totalAmount(): number {
    return this.items.reduce((acc, item) => acc + Number(item.amount || 0), 0);
  }

  addPoi(item: { poiId: string; cityId: string; cityName: string; label: string; amount: number }): boolean {
    const poiId = String(item.poiId || '').trim();
    if (!poiId || this.isPoiInCart(poiId)) {
      return false;
    }

    const nextItem: CartItem = {
      key: `single:${poiId}`,
      type: 'single',
      poiId,
      cityId: String(item.cityId || '').trim(),
      cityName: String(item.cityName || '').trim(),
      label: String(item.label || '').trim(),
      amount: Number(item.amount || 0),
      addedAt: new Date().toISOString()
    };

    this.persistItems([nextItem, ...this.items]);
    return true;
  }

  removeItem(key: string): void {
    const normalized = String(key || '').trim();
    if (!normalized) {
      return;
    }
    this.persistItems(this.items.filter((item) => item.key !== normalized));
  }

  clear(): void {
    this.persistItems([]);
  }

  isPoiInCart(poiId: string): boolean {
    const normalized = String(poiId || '').trim();
    if (!normalized) {
      return false;
    }
    return this.items.some((item) => item.poiId === normalized);
  }

  private persistItems(items: CartItem[]): void {
    this.itemsSubject.next(items);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }

  private readStoredItems(): CartItem[] {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map((entry) => ({
          key: String(entry?.key || '').trim(),
          type: 'single' as const,
          poiId: String(entry?.poiId || '').trim(),
          cityId: String(entry?.cityId || '').trim(),
          cityName: String(entry?.cityName || '').trim(),
          label: String(entry?.label || '').trim(),
          amount: Number(entry?.amount || 0),
          addedAt: String(entry?.addedAt || '').trim() || new Date().toISOString()
        }))
        .filter((entry) => Boolean(entry.key && entry.poiId));
    } catch {
      return [];
    }
  }
}
