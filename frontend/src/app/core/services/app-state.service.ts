import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  userId: 'tourism.userId',
  activeCityId: 'tourism.activeCityId',
  hotelCode: 'tourism.hotelCode',
  favorites: 'tourism.favorites',
  language: 'tourism.language'
} as const;

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly userIdValue = this.ensureUserId();

  private readonly activeCityIdSubject = new BehaviorSubject<string>(
    localStorage.getItem(STORAGE_KEYS.activeCityId) || 'catania'
  );

  private readonly hotelCodeSubject = new BehaviorSubject<string>(localStorage.getItem(STORAGE_KEYS.hotelCode) || '');

  private readonly favoritesSubject = new BehaviorSubject<string[]>(this.readArray(STORAGE_KEYS.favorites));

  private readonly languageSubject = new BehaviorSubject<'it' | 'en'>(
    (localStorage.getItem(STORAGE_KEYS.language) as 'it' | 'en') || 'it'
  );

  readonly userId = this.userIdValue;
  readonly activeCityId$ = this.activeCityIdSubject.asObservable();
  readonly hotelCode$ = this.hotelCodeSubject.asObservable();
  readonly favorites$ = this.favoritesSubject.asObservable();
  readonly language$ = this.languageSubject.asObservable();

  get activeCityId(): string {
    return this.activeCityIdSubject.value;
  }

  get hotelCode(): string {
    return this.hotelCodeSubject.value;
  }

  get favoriteIds(): string[] {
    return this.favoritesSubject.value;
  }

  setActiveCity(cityId: string): void {
    localStorage.setItem(STORAGE_KEYS.activeCityId, cityId);
    this.activeCityIdSubject.next(cityId);
  }

  setHotelCode(code: string): void {
    localStorage.setItem(STORAGE_KEYS.hotelCode, code);
    this.hotelCodeSubject.next(code);
  }

  setLanguage(language: 'it' | 'en'): void {
    localStorage.setItem(STORAGE_KEYS.language, language);
    this.languageSubject.next(language);
  }

  toggleFavorite(poiId: string): void {
    const current = new Set(this.favoritesSubject.value);
    if (current.has(poiId)) {
      current.delete(poiId);
    } else {
      current.add(poiId);
    }

    const next = Array.from(current);
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(next));
    this.favoritesSubject.next(next);
  }

  isFavorite(poiId: string): boolean {
    return this.favoritesSubject.value.includes(poiId);
  }

  private ensureUserId(): string {
    const existing = localStorage.getItem(STORAGE_KEYS.userId);
    if (existing) {
      return existing;
    }

    const created = uuidv4();
    localStorage.setItem(STORAGE_KEYS.userId, created);
    return created;
  }

  private readArray(key: string): string[] {
    const value = localStorage.getItem(key);
    if (!value) {
      return [];
    }

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

