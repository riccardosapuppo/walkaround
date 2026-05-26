import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, interval, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OfflineService } from './offline.service';

interface AppCacheSettingsResponse {
  cacheVersion: string;
  updatedAt: string | null;
}

const APP_CACHE_VERSION_KEY = 'walkaround.appCacheVersion';
const CACHE_CHECK_INTERVAL_MS = 5 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AppCacheService {
  private readonly bypassHeaders = new HttpHeaders({ 'ngsw-bypass': 'true' });
  private monitoringSubscription: Subscription | null = null;
  private checking = false;

  constructor(
    private readonly http: HttpClient,
    private readonly offlineService: OfflineService
  ) {}

  startMonitoring(): void {
    if (this.monitoringSubscription) {
      return;
    }

    void this.checkForCacheVersionChange();
    this.monitoringSubscription = interval(CACHE_CHECK_INTERVAL_MS).subscribe(() => {
      void this.checkForCacheVersionChange();
    });
  }

  async checkForCacheVersionChange(): Promise<void> {
    if (this.checking) {
      return;
    }

    this.checking = true;
    try {
      const settings = await firstValueFrom(
        this.http.get<AppCacheSettingsResponse>(`${environment.apiBaseUrl}/app-cache-settings`, {
          headers: this.bypassHeaders
        })
      );
      const nextVersion = String(settings?.cacheVersion || '').trim();
      if (!nextVersion) {
        return;
      }

      const currentVersion = localStorage.getItem(APP_CACHE_VERSION_KEY);
      if (!currentVersion) {
        localStorage.setItem(APP_CACHE_VERSION_KEY, nextVersion);
        return;
      }
      if (currentVersion === nextVersion) {
        return;
      }

      await this.clearBrowserCaches();
      localStorage.setItem(APP_CACHE_VERSION_KEY, nextVersion);
      window.location.reload();
    } catch (error) {
      console.warn('Cache version check failed', error);
    } finally {
      this.checking = false;
    }
  }

  private async clearBrowserCaches(): Promise<void> {
    try {
      await this.offlineService.clearAll();
    } catch (error) {
      console.warn('Offline cache cleanup failed', error);
    }

    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
      } catch (error) {
        console.warn('Cache Storage cleanup failed', error);
      }
    }

    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      } catch (error) {
        console.warn('Service worker cleanup failed', error);
      }
    }
  }
}
