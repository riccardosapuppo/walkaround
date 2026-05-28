import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { City } from '../models/city.model';
import { Poi } from '../models/poi.model';
import { AdminAuthService } from './admin-auth.service';
import { AppAuthService } from './app-auth.service';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class PoiService {
  private readonly citiesUrl = `${environment.apiBaseUrl}/cities`;
  private citiesCache: City[] | null = null;
  private citiesRequest$?: Observable<City[]>;
  private poisByCityCache = new Map<string, Poi[]>();
  private poisByCityRequests = new Map<string, Observable<Poi[]>>();

  constructor(
    private readonly http: HttpClient,
    private readonly appAuth: AppAuthService,
    private readonly adminAuth: AdminAuthService,
    private readonly i18n: I18nService
  ) {}

  getCities(forceRefresh = false): Observable<City[]> {
    if (!forceRefresh && this.citiesCache) {
      return of(this.citiesCache);
    }

    if (!forceRefresh && this.citiesRequest$) {
      return this.citiesRequest$;
    }

    const request$ = this.http.get<City[]>(this.citiesUrl).pipe(
      tap((cities) => {
        this.citiesCache = Array.isArray(cities) ? cities : [];
      }),
      finalize(() => {
        if (this.citiesRequest$ === request$) {
          this.citiesRequest$ = undefined;
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
    this.citiesRequest$ = request$;
    return request$;
  }

  getPoisByCity(cityId: string, forceRefresh = false): Observable<Poi[]> {
    const normalizedCityId = String(cityId || '').trim();
    if (!normalizedCityId) {
      return of([]);
    }

    if (!forceRefresh && this.poisByCityCache.has(normalizedCityId)) {
      return of(this.poisByCityCache.get(normalizedCityId) || []);
    }

    const pendingRequest = this.poisByCityRequests.get(normalizedCityId);
    if (!forceRefresh && pendingRequest) {
      return pendingRequest;
    }

    const request$ = this.http
      .get<Poi[]>(`${environment.apiBaseUrl}/cities/${encodeURIComponent(normalizedCityId)}/pois`)
      .pipe(
        tap((pois) => this.poisByCityCache.set(normalizedCityId, Array.isArray(pois) ? pois : [])),
        finalize(() => {
          if (this.poisByCityRequests.get(normalizedCityId) === request$) {
            this.poisByCityRequests.delete(normalizedCityId);
          }
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    this.poisByCityRequests.set(normalizedCityId, request$);
    return request$;
  }

  getPoiById(poiId: string, requireFullDetails = true): Observable<Poi> {
    const normalizedPoiId = String(poiId || '').trim();
    const fromCache = Array.from(this.poisByCityCache.values())
      .flat()
      .find((poi) => poi.id === normalizedPoiId);

    if (fromCache && (!requireFullDetails || this.hasFullPoiDetails(fromCache))) {
      return of(fromCache);
    }

    return this.http
      .get<Poi>(`${environment.apiBaseUrl}/pois/${encodeURIComponent(normalizedPoiId)}`)
      .pipe(tap((poi) => this.updateCachedPoi(poi)));
  }

  getPoiPreviewAudioUrl(poi: Poi | null | undefined): string {
    const poiId = String(poi?.id || '').trim();
    if (!poiId) {
      return '';
    }

    return this.withAudioLanguage(poi?.previewAudioUrl || `${environment.apiBaseUrl}/pois/${encodeURIComponent(poiId)}/audio-preview`);
  }

  getPoiFullAudioUrl(poi: Poi | null | undefined): string {
    const poiId = String(poi?.id || '').trim();
    if (!poiId) {
      return '';
    }

    const params: Record<string, string> = {};
    const appToken = this.appAuth.session?.token || '';
    if (appToken) {
      params['access_token'] = appToken;
    }

    const adminToken = this.adminAuth.isAdmin ? this.adminAuth.session?.token || '' : '';
    if (adminToken) {
      params['admin_token'] = adminToken;
    }

    return this.withAudioLanguage(poi?.audioUrl || `${environment.apiBaseUrl}/pois/${encodeURIComponent(poiId)}/audio`, params);
  }

  hasPreviewAudio(poi: Poi | null | undefined): boolean {
    return Boolean(this.getPoiPreviewAudioUrl(poi));
  }

  hasFullAudio(poi: Poi | null | undefined): boolean {
    return Boolean(this.getPoiFullAudioUrl(poi));
  }

  private hasFullPoiDetails(poi: Poi): boolean {
    if (String(poi.descriptionLong || '').trim()) {
      return true;
    }

    return Object.values(poi.translations || {}).some((fields) => Boolean(String(fields?.descriptionLong || '').trim()));
  }

  private updateCachedPoi(poi: Poi): void {
    const cityId = String(poi?.cityId || '').trim();
    const poiId = String(poi?.id || '').trim();
    if (!cityId || !poiId || !this.poisByCityCache.has(cityId)) {
      return;
    }

    const cachedPois = this.poisByCityCache.get(cityId) || [];
    const nextPois = cachedPois.map((cachedPoi) => (cachedPoi.id === poiId ? poi : cachedPoi));
    this.poisByCityCache.set(cityId, nextPois);
  }

  private withAudioLanguage(url: string, extraParams: Record<string, string> = {}): string {
    const normalizedUrl = String(url || '').trim();
    if (!normalizedUrl) {
      return '';
    }

    const separator = normalizedUrl.includes('?') ? '&' : '?';
    const params = new URLSearchParams({
      language: this.i18n.language,
      ...extraParams
    });
    return `${normalizedUrl}${separator}${params.toString()}`;
  }
}

