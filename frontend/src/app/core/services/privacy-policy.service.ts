import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppLanguage } from '../i18n/app-language';

export interface PrivacyPolicyResponse {
  language: AppLanguage;
  requestedLanguage: AppLanguage;
  contentHtml: string;
  updatedAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyService {
  constructor(private readonly http: HttpClient) {}

  getPrivacyPolicy(language: AppLanguage): Observable<PrivacyPolicyResponse> {
    return this.http.get<PrivacyPolicyResponse>(
      `${environment.apiBaseUrl}/privacy-policy?language=${encodeURIComponent(language)}`
    );
  }
}
