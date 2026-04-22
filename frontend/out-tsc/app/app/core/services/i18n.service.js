import { Injectable } from '@angular/core';
import { translations } from '../i18n/translations';
import * as i0 from "@angular/core";
import * as i1 from "./app-state.service";
const localeMap = {
    it: 'it-IT',
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES'
};
const paypalLocaleMap = {
    it: 'it_IT',
    en: 'en_US',
    fr: 'fr_FR',
    es: 'es_ES'
};
const cityNameMap = {
    catania: { it: 'Catania', en: 'Catania', fr: 'Catane', es: 'Catania' },
    siracusa: { it: 'Siracusa', en: 'Syracuse', fr: 'Syracuse', es: 'Siracusa' },
    taormina: { it: 'Taormina e dintorni', en: 'Taormina and surroundings', fr: 'Taormine et environs', es: 'Taormina y alrededores' },
    ragusa: { it: 'Ragusa', en: 'Ragusa', fr: 'Raguse', es: 'Ragusa' }
};
export class I18nService {
    constructor(appState) {
        this.appState = appState;
    }
    get language() {
        return this.appState.language;
    }
    get locale() {
        return localeMap[this.language];
    }
    get paypalLocale() {
        return paypalLocaleMap[this.language];
    }
    t(key, params) {
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
    formatCurrency(value) {
        return new Intl.NumberFormat(this.locale, {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number.isFinite(value) ? value : 0);
    }
    formatDateTime(value) {
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
    translateCityById(cityId, fallback = '') {
        const normalizedCityId = String(cityId || '').trim().toLowerCase();
        if (cityNameMap[normalizedCityId]) {
            return cityNameMap[normalizedCityId][this.language];
        }
        return String(fallback || '').trim();
    }
    translateRegion(region) {
        const normalized = String(region || '').trim().toLowerCase();
        if (!normalized) {
            return '';
        }
        const key = `regions.${normalized}`;
        const translated = this.t(key);
        return translated === key ? String(region || '').trim() : translated;
    }
    resolveCityField(fallback, translationsMap, field) {
        return this.resolveTranslatedField(fallback, translationsMap, field);
    }
    resolvePoiField(fallback, translationsMap, field) {
        if (field === 'name') {
            return String(fallback || '').trim();
        }
        return this.resolveTranslatedField(fallback, translationsMap, field);
    }
    resolvePoiAudioUrl(poi) {
        return this.resolveTranslatedField(poi?.audioUrl, poi?.translations, 'audioUrl');
    }
    formatDistance(distanceMeters) {
        const numeric = Number(distanceMeters);
        if (!Number.isFinite(numeric)) {
            return this.t('common.positionUnavailable');
        }
        if (numeric < 1000) {
            return `${Math.round(numeric)} m`;
        }
        return `${(numeric / 1000).toFixed(1)} km`;
    }
    languageLabel(language) {
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
    resolveTranslatedField(fallback, translationsMap, field) {
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
    static { this.ɵfac = function I18nService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || I18nService)(i0.ɵɵinject(i1.AppStateService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: I18nService, factory: I18nService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(I18nService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.AppStateService }], null); })();
