import { Injectable } from '@angular/core';

interface OfflineRecord {
  id: string;
  assets: string[];
  updatedAt: number;
}

const DB_NAME = 'tourism-offline-db';
const STORE_NAME = 'offline_pois';
const DB_VERSION = 1;
const CACHE_NAME = 'tourism-audio-cache-v1';

@Injectable({ providedIn: 'root' })
export class OfflineService {
  async cachePoiAssets(poiId: string, urls: string[]): Promise<void> {
    const uniqueUrls = Array.from(new Set(urls));
    const cache = await caches.open(CACHE_NAME);

    for (const url of uniqueUrls) {
      try {
        const response = await fetch(url, { mode: 'cors' });
        if (response.ok) {
          await cache.put(url, response.clone());
        }
      } catch (error) {
        console.warn('Offline caching failed for', url, error);
      }
    }

    await this.putRecord({
      id: poiId,
      assets: uniqueUrls,
      updatedAt: Date.now()
    });
  }

  async cacheBatch(items: { poiId: string; urls: string[] }[]): Promise<void> {
    for (const item of items) {
      await this.cachePoiAssets(item.poiId, item.urls);
    }
  }

  async isPoiOffline(poiId: string): Promise<boolean> {
    const record = await this.getRecord(poiId);
    return Boolean(record);
  }

  async getOfflinePoiIds(): Promise<string[]> {
    const db = await this.openDb();
    return new Promise<string[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).getAllKeys();
      request.onsuccess = () => resolve((request.result as IDBValidKey[]).map(String));
      request.onerror = () => reject(request.error);
    });
  }

  private async putRecord(record: OfflineRecord): Promise<void> {
    const db = await this.openDb();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private async getRecord(id: string): Promise<OfflineRecord | null> {
    const db = await this.openDb();
    return new Promise<OfflineRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(id);
      request.onsuccess = () => resolve((request.result as OfflineRecord | undefined) || null);
      request.onerror = () => reject(request.error);
    });
  }

  private openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

