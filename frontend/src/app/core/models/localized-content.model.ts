import { AppLanguage } from '../i18n/app-language';

export type SupportedContentLanguage = AppLanguage;

export interface CityTranslationFields {
  name?: string;
}

export interface PoiTranslationFields {
  name?: string;
  descriptionShort?: string;
  descriptionLong?: string;
  audioUrl?: string;
}

export type CityTranslations = Partial<Record<SupportedContentLanguage, CityTranslationFields>>;
export type PoiTranslations = Partial<Record<SupportedContentLanguage, PoiTranslationFields>>;
