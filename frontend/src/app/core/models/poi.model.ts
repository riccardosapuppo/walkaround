export interface Poi {
  id: string;
  cityId: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  descriptionShort: string;
  descriptionLong: string;
  imageUrl: string;
  audioUrl: string;
  priceSingle: number;
  durationSec: number;
  distanceMeters?: number;
}

