import { CityTranslations } from './localized-content.model';

export interface City {
  id: string;
  name: string;
  region: string;
  bundlePrice: number;
  heroImage: string;
  isDefault: boolean;
  poiCount?: number;
  translations?: CityTranslations;
}

