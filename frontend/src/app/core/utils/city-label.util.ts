import { AppLanguage } from '../i18n/app-language';

const cityNameMap: Record<string, string> = {
  catania: 'Catania',
  siracusa: 'Siracusa',
  taormina: 'Taormina e dintorni',
  ragusa: 'Ragusa'
};

interface CityLike {
  id?: string | null;
  name?: string | null;
}

export function formatCityLabel(cityId: string, cities: CityLike[] = [], language: AppLanguage = 'it'): string {
  const rawCityId = String(cityId || '').trim();
  if (!rawCityId) {
    return language === 'en'
      ? 'City'
      : language === 'fr'
      ? 'Ville'
      : language === 'es'
      ? 'Ciudad'
      : language === 'de'
      ? 'Stadt'
      : language === 'pl'
      ? 'Miasto'
      : 'Città';
  }

  const normalizedCityId = rawCityId.toLowerCase();
  if (cityNameMap[normalizedCityId]) {
    return cityNameMap[normalizedCityId];
  }

  const matchedCity = cities.find((city) => String(city?.id || '').trim().toLowerCase() === normalizedCityId);
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
