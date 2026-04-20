import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
const DB_NAME = 'walkaround-offline-db';
const STORE_NAME = 'offline_pois';
const DB_VERSION = 1;
const CACHE_NAME = 'walkaround-audio-cache-v1';
export class OfflineService {
    async cachePoiAssets(poiId, urls) {
        const uniqueUrls = Array.from(new Set(urls));
        const cache = await caches.open(CACHE_NAME);
        for (const url of uniqueUrls) {
            try {
                const response = await fetch(url, { mode: 'cors' });
                if (response.ok) {
                    await cache.put(url, response.clone());
                }
            }
            catch (error) {
                console.warn('Offline caching failed for', url, error);
            }
        }
        await this.putRecord({
            id: poiId,
            assets: uniqueUrls,
            updatedAt: Date.now()
        });
    }
    async cacheBatch(items) {
        for (const item of items) {
            await this.cachePoiAssets(item.poiId, item.urls);
        }
    }
    async isPoiOffline(poiId) {
        const record = await this.getRecord(poiId);
        return Boolean(record);
    }
    async getOfflinePoiIds() {
        const db = await this.openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const request = tx.objectStore(STORE_NAME).getAllKeys();
            request.onsuccess = () => resolve(request.result.map(String));
            request.onerror = () => reject(request.error);
        });
    }
    async putRecord(record) {
        const db = await this.openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put(record);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }
    async getRecord(id) {
        const db = await this.openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const request = tx.objectStore(STORE_NAME).get(id);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }
    openDb() {
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
    static { this.ɵfac = function OfflineService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || OfflineService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: OfflineService, factory: OfflineService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(OfflineService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
