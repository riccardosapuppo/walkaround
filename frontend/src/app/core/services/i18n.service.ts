import { Injectable } from '@angular/core';
import { AppLanguage } from '../i18n/app-language';
import { translations } from '../i18n/translations';
import { CityTranslationFields, CityTranslations, PoiTranslationFields, PoiTranslations } from '../models/localized-content.model';
import { AppStateService } from './app-state.service';

const localeMap: Record<AppLanguage, string> = {
  it: 'it-IT',
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES'
};

const paypalLocaleMap: Record<AppLanguage, string> = {
  it: 'it_IT',
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES'
};

const cityNameMap: Record<string, Record<AppLanguage, string>> = {
  catania: { it: 'Catania', en: 'Catania', fr: 'Catane', es: 'Catania' },
  siracusa: { it: 'Siracusa', en: 'Syracuse', fr: 'Syracuse', es: 'Siracusa' },
  taormina: { it: 'Taormina e dintorni', en: 'Taormina and surroundings', fr: 'Taormine et environs', es: 'Taormina y alrededores' },
  ragusa: { it: 'Ragusa', en: 'Ragusa', fr: 'Raguse', es: 'Ragusa' }
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  constructor(private readonly appState: AppStateService) {}

  get language(): AppLanguage {
    return this.appState.language;
  }

  get locale(): string {
    return localeMap[this.language];
  }

  get paypalLocale(): string {
    return paypalLocaleMap[this.language];
  }

  t(key: string, params?: Record<string, string | number | null | undefined>): string {
    const dictionary = translations[this.language];
    const fallbackDictionary = translations.it;
    const template = dictionary[key] ?? fallbackDictionary[key] ?? key;
    if (!params) {
      return template;
    }

    return Object.entries(params).reduce((result, [paramKey, rawValue]) => {
      const value = rawValue == null ? '' : String(rawValue);
      return result.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), value);
    }, template);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number.isFinite(value) ? value : 0);
  }

  formatDateTime(value: string | Date | null | undefined): string {
    if (!value) {
      return '-';
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat(this.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  translateCityById(cityId: string, fallback = ''): string {
    const normalizedCityId = String(cityId || '').trim().toLowerCase();
    if (cityNameMap[normalizedCityId]) {
      return cityNameMap[normalizedCityId][this.language];
    }
    return String(fallback || '').trim();
  }

  translateRegion(region: string | null | undefined): string {
    const normalized = String(region || '').trim().toLowerCase();
    if (!normalized) {
      return '';
    }
    const key = `regions.${normalized}`;
    const translated = this.t(key);
    return translated === key ? String(region || '').trim() : translated;
  }

  resolveCityField(fallback: string | null | undefined, translationsMap: CityTranslations | null | undefined, field: keyof CityTranslationFields): string {
    return this.resolveTranslatedField(fallback, translationsMap, field);
  }

  resolvePoiField(fallback: string | null | undefined, translationsMap: PoiTranslations | null | undefined, field: keyof PoiTranslationFields): string {
    return this.resolveTranslatedField(fallback, translationsMap, field);
  }

  resolvePoiAudioUrl(
    poi: { audioUrl?: string | null; translations?: PoiTranslations | null } | null | undefined
  ): string {
    return this.resolveTranslatedField(poi?.audioUrl, poi?.translations, 'audioUrl');
  }

  formatDistance(distanceMeters: number | null | undefined): string {
    const numeric = Number(distanceMeters);
    if (!Number.isFinite(numeric)) {
      return this.t('common.positionUnavailable');
    }

    if (numeric < 1000) {
      return `${Math.round(numeric)} m`;
    }

    return `${(numeric / 1000).toFixed(1)} km`;
  }

  languageLabel(language: AppLanguage): string {
    if (language === 'en') {
      return this.t('common.english');
    }
    if (language === 'fr') {
      return this.t('common.french');
    }
    if (language === 'es') {
      return this.t('common.spanish');
    }
    return this.t('common.italian');
  }

  private resolveTranslatedField<T extends string>(
    fallback: string | null | undefined,
    translationsMap: Partial<Record<AppLanguage, Partial<Record<T, string>>>> | null | undefined,
    field: T
  ): string {
    const currentLanguageValue = String(translationsMap?.[this.language]?.[field] || '').trim();
    if (currentLanguageValue) {
      return currentLanguageValue;
    }

    const italianValue = String(translationsMap?.it?.[field] || '').trim();
    if (italianValue) {
      return italianValue;
    }

    return String(fallback || '').trim();
  }
}
