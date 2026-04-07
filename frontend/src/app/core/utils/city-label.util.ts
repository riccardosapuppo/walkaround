const cityNameMap: Record<string, string> = {
  catania: 'Catania',
  siracusa: 'Siracusa',
  taormina: 'Taormina',
  ragusa: 'Ragusa'
};

interface CityLike {
  id?: string | null;
  name?: string | null;
}

export function formatCityLabel(cityId: string, cities: CityLike[] = []): string {
  const rawCityId = String(cityId || '').trim();
  if (!rawCityId) {
    return 'Citta';
  }

  const normalizedCityId = rawCityId.toLowerCase();
  const matchedCity = cities.find((city) => String(city?.id || '').trim().toLowerCase() === normalizedCityId);
  const matchedName = String(matchedCity?.name || '').trim();
  if (matchedName) {
    return matchedName;
  }

  if (cityNameMap[normalizedCityId]) {
    return cityNameMap[normalizedCityId];
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
