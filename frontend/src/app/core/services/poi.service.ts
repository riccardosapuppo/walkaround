import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { City } from '../models/city.model';
import { Poi } from '../models/poi.model';

@Injectable({ providedIn: 'root' })
export class PoiService {
  private readonly citiesUrl = `${environment.apiBaseUrl}/cities`;
  private citiesRequest$?: Observable<City[]>;
  private poisByCityCache = new Map<string, Poi[]>();

  constructor(private readonly http: HttpClient) {}

  getCities(): Observable<City[]> {
    if (!this.citiesRequest$) {
      this.citiesRequest$ = this.http.get<City[]>(this.citiesUrl).pipe(shareReplay(1));
    }

    return this.citiesRequest$;
  }

  getPoisByCity(cityId: string, forceRefresh = false): Observable<Poi[]> {
    if (!forceRefresh && this.poisByCityCache.has(cityId)) {
      return of(this.poisByCityCache.get(cityId) || []);
    }

    return this.http
      .get<Poi[]>(`${environment.apiBaseUrl}/cities/${cityId}/pois`)
      .pipe(tap((pois) => this.poisByCityCache.set(cityId, pois)));
  }

  getPoiById(poiId: string): Observable<Poi> {
    const fromCache = Array.from(this.poisByCityCache.values())
      .flat()
      .find((poi) => poi.id === poiId);

    if (fromCache) {
      return of(fromCache);
    }

    return this.http.get<Poi>(`${environment.apiBaseUrl}/pois/${poiId}`);
  }
}

