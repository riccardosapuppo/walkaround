import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PartnerRegistrationPayload {
  structureName: string;
  structureType?: string;
  vatNumber?: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  addressStreet: string;
  addressNumber?: string;
  addressCity: string;
  addressPostalCode?: string;
  addressProvince?: string;
  addressRegion?: string;
  addressCountry?: string;
  roomsCount?: number | null;
  notes?: string;
}

export interface PartnerRegistrationResponse {
  submitted: boolean;
  requestId: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class PartnerRequestService {
  constructor(private readonly http: HttpClient) {}

  submit(payload: PartnerRegistrationPayload): Observable<PartnerRegistrationResponse> {
    return this.http.post<PartnerRegistrationResponse>(`${environment.apiBaseUrl}/partner-registration-requests`, payload);
  }
}
