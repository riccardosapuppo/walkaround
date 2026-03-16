import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Coordinates } from './geo.service';

type RouteProvider = 'osrm' | 'fallback';

interface OsrmManeuver {
  type: string;
  modifier?: string;
  location?: [number, number];
  exit?: number;
}

interface OsrmStep {
  distance: number;
  duration: number;
  name?: string;
  maneuver?: OsrmManeuver;
}

interface OsrmLeg {
  steps?: OsrmStep[];
}

interface OsrmRoute {
  distance: number;
  duration: number;
  geometry?: {
    coordinates?: [number, number][];
  };
  legs?: OsrmLeg[];
}

interface OsrmResponse {
  code?: string;
  routes?: OsrmRoute[];
}

export interface NavigationStep {
  instruction: string;
  distanceMeters: number;
  durationSec: number;
  location: Coordinates;
}

export interface NavigationRoute {
  provider: RouteProvider;
  distanceMeters: number;
  durationSec: number;
  points: Coordinates[];
  steps: NavigationStep[];
}

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/foot/';
const FALLBACK_WALKING_METERS_PER_SEC = 1.25;

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private readonly http: HttpClient) {}

  getWalkingRoute(from: Coordinates, to: Coordinates): Observable<NavigationRoute> {
    return this.fetchOsrmRoute(from, to).pipe(catchError(() => of(this.buildFallbackRoute(from, to))));
  }

  private fetchOsrmRoute(from: Coordinates, to: Coordinates): Observable<NavigationRoute> {
    const fromParam = `${from.lng},${from.lat}`;
    const toParam = `${to.lng},${to.lat}`;
    const url = `${OSRM_BASE_URL}${fromParam};${toParam}?overview=full&geometries=geojson&steps=true`;

    return this.http.get<OsrmResponse>(url).pipe(
      map((response) => {
        const route = response.routes?.[0];
        if (!route || response.code !== 'Ok') {
          throw new Error('No route');
        }

        const points = (route.geometry?.coordinates || [])
          .map((coord) => this.toCoordinates(coord))
          .filter((coord): coord is Coordinates => Boolean(coord));

        if (!points.length) {
          throw new Error('No geometry');
        }

        const steps = this.mapSteps(route, points);
        return {
          provider: 'osrm',
          distanceMeters: route.distance || 0,
          durationSec: route.duration || 0,
          points,
          steps
        } satisfies NavigationRoute;
      })
    );
  }

  private mapSteps(route: OsrmRoute, points: Coordinates[]): NavigationStep[] {
    const sourceSteps = (route.legs || []).flatMap((leg) => leg.steps || []);
    const mapped = sourceSteps
      .map((step, index) => this.mapSingleStep(step, index, sourceSteps.length))
      .filter((step): step is NavigationStep => Boolean(step));

    if (!mapped.length) {
      return [
        {
          instruction: 'Raggiungi la destinazione',
          distanceMeters: route.distance || 0,
          durationSec: route.duration || 0,
          location: points[0] || points[points.length - 1]
        }
      ];
    }

    return mapped;
  }

  private mapSingleStep(step: OsrmStep, index: number, totalSteps: number): NavigationStep | null {
    const location = this.toCoordinates(step.maneuver?.location);
    if (!location) {
      return null;
    }

    const instruction = this.buildInstruction(step, index, totalSteps);
    return {
      instruction,
      distanceMeters: step.distance || 0,
      durationSec: step.duration || 0,
      location
    };
  }

  private buildInstruction(step: OsrmStep, index: number, totalSteps: number): string {
    const maneuverType = step.maneuver?.type || '';
    const modifier = this.toItalianModifier(step.maneuver?.modifier);
    const roadName = this.cleanRoadName(step.name);

    if (maneuverType === 'arrive' || index === totalSteps - 1) {
      return 'Arriva alla destinazione';
    }

    if (maneuverType === 'depart') {
      return roadName ? `Parti e prosegui su ${roadName}` : 'Parti e prosegui dritto';
    }

    if (maneuverType === 'roundabout' || maneuverType === 'rotary') {
      const exit = step.maneuver?.exit;
      if (exit) {
        return `Alla rotonda prendi la ${exit}a uscita${roadName ? ` verso ${roadName}` : ''}`;
      }
      return roadName ? `Alla rotonda prosegui verso ${roadName}` : 'Alla rotonda prosegui';
    }

    if (maneuverType === 'turn' || maneuverType === 'fork' || maneuverType === 'merge') {
      return roadName
        ? `Svolta ${modifier} su ${roadName}`
        : `Svolta ${modifier}`;
    }

    if (maneuverType === 'continue' || maneuverType === 'new name') {
      return roadName ? `Continua su ${roadName}` : 'Continua dritto';
    }

    if (maneuverType === 'uturn') {
      return 'Effettua inversione a U';
    }

    if (maneuverType === 'end of road') {
      return roadName ? `Alla fine della strada, svolta ${modifier} su ${roadName}` : `Alla fine della strada, svolta ${modifier}`;
    }

    return roadName ? `Prosegui su ${roadName}` : 'Prosegui verso la destinazione';
  }

  private toItalianModifier(modifier: string | undefined): string {
    switch ((modifier || '').toLowerCase()) {
      case 'left':
        return 'a sinistra';
      case 'right':
        return 'a destra';
      case 'slight left':
        return 'leggermente a sinistra';
      case 'slight right':
        return 'leggermente a destra';
      case 'sharp left':
        return 'decisamente a sinistra';
      case 'sharp right':
        return 'decisamente a destra';
      case 'uturn':
        return 'indietro';
      case 'straight':
      default:
        return 'dritto';
    }
  }

  private cleanRoadName(name: string | undefined): string {
    const trimmed = String(name || '').trim();
    return trimmed || '';
  }

  private buildFallbackRoute(from: Coordinates, to: Coordinates): NavigationRoute {
    const distanceMeters = this.distanceInMeters(from, to);
    const durationSec = Math.max(30, Math.round(distanceMeters / FALLBACK_WALKING_METERS_PER_SEC));

    return {
      provider: 'fallback',
      distanceMeters,
      durationSec,
      points: [from, to],
      steps: [
        {
          instruction: 'Prosegui verso la destinazione',
          distanceMeters,
          durationSec,
          location: from
        },
        {
          instruction: 'Arriva alla destinazione',
          distanceMeters: 0,
          durationSec: 0,
          location: to
        }
      ]
    };
  }

  private toCoordinates(coord: [number, number] | undefined): Coordinates | null {
    if (!coord || coord.length < 2) {
      return null;
    }

    const lng = Number(coord[0]);
    const lat = Number(coord[1]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return null;
    }

    return { lat, lng };
  }

  private distanceInMeters(from: Coordinates, to: Coordinates): number {
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
