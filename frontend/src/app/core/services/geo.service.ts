import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type GeoPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface Coordinates {
  lat: number;
  lng: number;
}

@Injectable({ providedIn: 'root' })
export class GeoService {
  private readonly permissionSubject = new BehaviorSubject<GeoPermissionState>('prompt');
  private readonly coordinatesSubject = new BehaviorSubject<Coordinates | null>(null);
  private watchId: number | null = null;

  readonly permission$ = this.permissionSubject.asObservable();
  readonly coordinates$ = this.coordinatesSubject.asObservable();

  get currentCoordinates(): Coordinates | null {
    return this.coordinatesSubject.value;
  }

  async requestPermissionAndTrack(): Promise<void> {
    if (!('geolocation' in navigator)) {
      this.permissionSubject.next('unsupported');
      return;
    }

    if ('permissions' in navigator && navigator.permissions?.query) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        this.permissionSubject.next(result.state as GeoPermissionState);
        result.onchange = () => this.permissionSubject.next(result.state as GeoPermissionState);
      } catch {
        this.permissionSubject.next('prompt');
      }
    }

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.permissionSubject.next('granted');
        this.coordinatesSubject.next({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        this.permissionSubject.next('denied');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
        timeout: 8_000
      }
    );
  }

  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  distanceInMeters(from: Coordinates, to: Coordinates): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const earthRadius = 6371e3;

    const deltaLat = toRad(to.lat - from.lat);
    const deltaLng = toRad(to.lng - from.lng);
    const lat1 = toRad(from.lat);
    const lat2 = toRad(to.lat);

    const haversine =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
    return earthRadius * c;
  }
}

