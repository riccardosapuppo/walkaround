import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AppLanguage, isAppLanguage } from '../i18n/app-language';

const STORAGE_KEYS = {
  userId: 'walkaround.userId',
  activeCityId: 'walkaround.activeCityId',
  hotelCode: 'walkaround.hotelCode',
  hotelAssociation: 'walkaround.hotelAssociation',
  onboardingSeen: 'walkaround.onboardingSeen',
  favorites: 'walkaround.favorites',
  language: 'walkaround.language'
} as const;

export interface HotelAssociation {
  structureId: string;
  structureName: string;
  structureAddress: string;
  lat?: number | null;
  lng?: number | null;
  inviteCode: string;
  appliesTo?: 'single' | 'bundle' | null;
  cityId?: string | null;
  cityName?: string | null;
  cityIds?: string[];
  cityNames?: string[];
  userDiscountPercent?: number;
  userDiscountPercentSingle?: number;
  userDiscountPercentBundle?: number;
  structureFixedAmount?: number;
  structureFixedAmountSingle?: number;
  structureFixedAmountBundle?: number;
  codeStatus?: 'valid' | 'expired' | 'invalid' | 'used';
  expiresAt?: string | null;
  associatedAt?: string;
  updatedAt?: string;
  codeUsedAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly userIdSubject = new BehaviorSubject<string>(this.ensureUserId());

  private readonly activeCityIdSubject = new BehaviorSubject<string>(
    localStorage.getItem(STORAGE_KEYS.activeCityId) || 'catania'
  );

  private readonly hotelCodeSubject = new BehaviorSubject<string>(localStorage.getItem(STORAGE_KEYS.hotelCode) || '');
  private readonly hotelAssociationSubject = new BehaviorSubject<HotelAssociation | null>(
    this.readObject<HotelAssociation>(STORAGE_KEYS.hotelAssociation)
  );

  private readonly favoritesSubject = new BehaviorSubject<string[]>(this.readArray(STORAGE_KEYS.favorites));

  private readonly languageSubject = new BehaviorSubject<AppLanguage>(this.readLanguage());

  readonly userId$ = this.userIdSubject.asObservable();
  readonly activeCityId$ = this.activeCityIdSubject.asObservable();
  readonly hotelCode$ = this.hotelCodeSubject.asObservable();
  readonly hotelAssociation$ = this.hotelAssociationSubject.asObservable();
  readonly favorites$ = this.favoritesSubject.asObservable();
  readonly language$ = this.languageSubject.asObservable();

  get userId(): string {
    return this.userIdSubject.value;
  }

  get activeCityId(): string {
    return this.activeCityIdSubject.value;
  }

  get hotelCode(): string {
    return this.hotelCodeSubject.value;
  }

  get hotelAssociation(): HotelAssociation | null {
    return this.hotelAssociationSubject.value;
  }

  get favoriteIds(): string[] {
    return this.favoritesSubject.value;
  }

  get language(): AppLanguage {
    return this.languageSubject.value;
  }

  get hasSeenOnboarding(): boolean {
    return localStorage.getItem(STORAGE_KEYS.onboardingSeen) === '1';
  }

  get hasActiveDiscountCode(): boolean {
    const code = this.hotelCodeSubject.value.trim();
    if (!code) {
      return false;
    }

    const association = this.hotelAssociationSubject.value;
    if (!association || !association.codeStatus) {
      return true;
    }

    return association.codeStatus === 'valid';
  }

  shouldShowWelcomeOnLaunch(): boolean {
    return !this.hasSeenOnboarding && !this.hasActiveDiscountCode;
  }

  markOnboardingSeen(): void {
    localStorage.setItem(STORAGE_KEYS.onboardingSeen, '1');
  }

  setActiveCity(cityId: string): void {
    localStorage.setItem(STORAGE_KEYS.activeCityId, cityId);
    this.activeCityIdSubject.next(cityId);
  }

  setUserId(userId: string): void {
    const normalized = String(userId || '').trim();
    if (!normalized) {
      return;
    }

    localStorage.setItem(STORAGE_KEYS.userId, normalized);
    this.userIdSubject.next(normalized);
  }

  setHotelCode(code: string): void {
    localStorage.setItem(STORAGE_KEYS.hotelCode, code);
    this.hotelCodeSubject.next(code);
  }

  normalizeHotelCodeInput(value: unknown): string {
    const rawValue = Array.isArray(value) ? value[0] : value;
    return String(rawValue || '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 6);
  }

  setPendingHotelCode(value: unknown): string {
    const normalizedCode = this.normalizeHotelCodeInput(value);
    if (!normalizedCode) {
      return '';
    }

    const currentAssociationCode = this.normalizeHotelCodeInput(this.hotelAssociationSubject.value?.inviteCode || '');
    if (currentAssociationCode && currentAssociationCode !== normalizedCode) {
      this.setHotelAssociation(null);
    }

    this.setHotelCode(normalizedCode);
    return normalizedCode;
  }

  setHotelAssociation(association: HotelAssociation | null): void {
    if (!association) {
      localStorage.removeItem(STORAGE_KEYS.hotelAssociation);
      this.hotelAssociationSubject.next(null);
      return;
    }

    localStorage.setItem(STORAGE_KEYS.hotelAssociation, JSON.stringify(association));
    this.hotelAssociationSubject.next(association);
  }

  setLanguage(language: AppLanguage): void {
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

  resetUserSession(): string {
    const nextUserId = uuidv4();
    const defaultCityId = 'catania';

    localStorage.setItem(STORAGE_KEYS.userId, nextUserId);
    localStorage.setItem(STORAGE_KEYS.activeCityId, defaultCityId);
    localStorage.removeItem(STORAGE_KEYS.hotelCode);
    localStorage.removeItem(STORAGE_KEYS.hotelAssociation);
    localStorage.removeItem(STORAGE_KEYS.onboardingSeen);
    localStorage.removeItem(STORAGE_KEYS.favorites);

    this.userIdSubject.next(nextUserId);
    this.activeCityIdSubject.next(defaultCityId);
    this.hotelCodeSubject.next('');
    this.hotelAssociationSubject.next(null);
    this.favoritesSubject.next([]);

    return nextUserId;
  }

  startGuestSession(): string {
    const nextUserId = uuidv4();

    localStorage.setItem(STORAGE_KEYS.userId, nextUserId);
    localStorage.removeItem(STORAGE_KEYS.hotelCode);
    localStorage.removeItem(STORAGE_KEYS.hotelAssociation);
    localStorage.removeItem(STORAGE_KEYS.favorites);

    this.userIdSubject.next(nextUserId);
    this.hotelCodeSubject.next('');
    this.hotelAssociationSubject.next(null);
    this.favoritesSubject.next([]);

    return nextUserId;
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

  private readObject<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  private readLanguage(): AppLanguage {
    const stored = localStorage.getItem(STORAGE_KEYS.language);
    return isAppLanguage(stored) ? stored : 'it';
  }
}



