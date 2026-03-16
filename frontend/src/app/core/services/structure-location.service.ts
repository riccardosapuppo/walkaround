import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HotelAssociation } from './app-state.service';
import { Coordinates } from './geo.service';

interface NominatimResult {
  lat?: string;
  lon?: string;
}

@Injectable({ providedIn: 'root' })
export class StructureLocationService {
  private readonly geocodeCache = new Map<string, Coordinates | null>();

  constructor(private readonly http: HttpClient) {}

  resolveAssociationCoordinates(association: HotelAssociation | null | undefined): Observable<Coordinates | null> {
    if (!association?.structureId) {
      return of(null);
    }

    const fromAssociation = this.coerceCoordinates(association.lat, association.lng);
    if (fromAssociation) {
      return of(fromAssociation);
    }

    const query = this.associationQuery(association);
    if (!query) {
      return of(null);
    }

    const cacheKey = query.toLowerCase();
    if (this.geocodeCache.has(cacheKey)) {
      return of(this.geocodeCache.get(cacheKey) || null);
    }

    const params = new HttpParams().set('format', 'jsonv2').set('limit', '1').set('q', query);
    return this.http.get<NominatimResult[]>('https://nominatim.openstreetmap.org/search', { params }).pipe(
      map((rows) => {
        const first = Array.isArray(rows) ? rows[0] : null;
        if (!first) {
          return null;
        }
        return this.coerceCoordinates(first.lat, first.lon);
      }),
      tap((coordinates) => {
        this.geocodeCache.set(cacheKey, coordinates);
      }),
      catchError(() => {
        this.geocodeCache.set(cacheKey, null);
        return of(null);
      })
    );
  }

  buildExternalDirectionsUrl(
    association: HotelAssociation | null | undefined,
    coordinates?: Coordinates | null
  ): string | null {
    if (!association?.structureId) {
      return null;
    }

    const destination = coordinates
      ? `${coordinates.lat},${coordinates.lng}`
      : this.associationQuery(association) || association.structureName || association.structureAddress;
    if (!destination) {
      return null;
    }

    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=walking`;
  }

  private associationQuery(association: HotelAssociation): string {
    const parts = [association.structureName, association.structureAddress].map((value) => String(value || '').trim()).filter(Boolean);
    return parts.join(', ');
  }

  private coerceCoordinates(latRaw: unknown, lngRaw: unknown): Coordinates | null {
    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return null;
    }
    return { lat, lng };
  }
}

