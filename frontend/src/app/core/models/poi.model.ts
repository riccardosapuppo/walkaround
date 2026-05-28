import { PoiTranslations } from './localized-content.model';

export interface Poi {
  id: string;
  cityId: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  category: string;
  descriptionShort: string;
  descriptionLong: string;
  imageUrl: string;
  audioUrl: string;
  previewAudioUrl?: string;
  priceSingle: number;
  durationSec: number;
  distanceMeters?: number | null;
  translations?: PoiTranslations;
}

