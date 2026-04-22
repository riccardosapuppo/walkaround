import { AppLanguage } from '../i18n/app-language';
import { CityTranslations } from '../models/localized-content.model';

const cityNameMap: Record<string, Record<AppLanguage, string>> = {
  catania: { it: 'Catania', en: 'Catania', fr: 'Catane', es: 'Catania' },
  siracusa: { it: 'Siracusa', en: 'Syracuse', fr: 'Syracuse', es: 'Siracusa' },
  taormina: { it: 'Taormina e dintorni', en: 'Taormina and surroundings', fr: 'Taormine et environs', es: 'Taormina y alrededores' },
  ragusa: { it: 'Ragusa', en: 'Ragusa', fr: 'Raguse', es: 'Ragusa' }
};

interface CityLike {
  id?: string | null;
  name?: string | null;
  translations?: CityTranslations | null;
}

export function formatCityLabel(cityId: string, cities: CityLike[] = [], language: AppLanguage = 'it'): string {
  const rawCityId = String(cityId || '').trim();
  if (!rawCityId) {
    return language === 'en' ? 'City' : language === 'fr' ? 'Ville' : language === 'es' ? 'Ciudad' : 'Città';
  }

  const normalizedCityId = rawCityId.toLowerCase();
  if (cityNameMap[normalizedCityId]) {
    return cityNameMap[normalizedCityId][language];
  }

  const matchedCity = cities.find((city) => String(city?.id || '').trim().toLowerCase() === normalizedCityId);
  const translatedMatchedName = String(matchedCity?.translations?.[language]?.name || '').trim();
  if (translatedMatchedName) {
    return translatedMatchedName;
  }
  const matchedName = String(matchedCity?.name || '').trim();
  if (matchedName) {
    return matchedName;
  }

  const withoutGeneratedSuffix = rawCityId.replace(/-[a-z0-9]{6,}$/i, '');
  const normalizedWords = withoutGeneratedSuffix.replace(/[_-]+/g, ' ').trim();
  if (!normalizedWords) {
    return rawCityId;
  }

  return normalizedWords
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
