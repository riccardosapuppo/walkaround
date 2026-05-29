import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppLanguage } from '../i18n/app-language';

export type LegalDocumentType = 'privacyPolicy' | 'cookiePolicy' | 'termsConditions';

export interface LegalDocumentResponse {
  type: LegalDocumentType;
  language: AppLanguage;
  requestedLanguage: AppLanguage;
  contentHtml: string;
  updatedAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class LegalDocumentsService {
  constructor(private readonly http: HttpClient) {}

  getLegalDocument(type: LegalDocumentType, language: AppLanguage): Observable<LegalDocumentResponse> {
    return this.http.get<LegalDocumentResponse>(
      `${environment.apiBaseUrl}/legal-documents/${encodeURIComponent(type)}?language=${encodeURIComponent(language)}`
    );
  }
}
