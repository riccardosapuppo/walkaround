import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CheckoutPurchaseResponse } from './purchase.service';
import { I18nService } from './i18n.service';
import { AppAuthService } from './app-auth.service';

type PayPalCheckoutContext = 'single' | 'bundle' | 'cart';

interface PayPalButtonActions {
  isEligible?: () => boolean;
  render: (selectorOrElement: string | HTMLElement) => Promise<void>;
}

interface PayPalButtonsOptions {
  style?: {
    layout?: 'horizontal' | 'vertical';
    label?: string;
    shape?: 'pill' | 'rect';
    color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
    tagline?: boolean;
  };
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID?: string }) => Promise<void> | void;
  onCancel?: () => void;
  onError?: (error: unknown) => void;
}

interface PayPalNamespace {
  Buttons: (options: PayPalButtonsOptions) => PayPalButtonActions;
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

export type PayPalCheckoutRequest =
  | {
      userId: string;
      checkoutContext: 'bundle';
      cityId: string;
      ignoreDiscountCode?: boolean;
    }
  | {
      userId: string;
      checkoutContext: 'single';
      poiId: string;
      ignoreDiscountCode?: boolean;
    }
  | {
      userId: string;
      checkoutContext: 'cart';
      poiIds: string[];
      ignoreDiscountCode?: boolean;
    };

export interface PayPalSdkConfigResponse {
  ready: boolean;
  clientId?: string;
  currencyCode?: string;
  mode?: 'sandbox' | 'live';
  brandName?: string;
  message?: string;
}

export interface PayPalQuoteItem {
  purchaseType: 'single' | 'bundle';
  cityId: string | null;
  cityName: string | null;
  poiId: string | null;
  poiName: string | null;
  label: string;
  baseAmount: number;
  discountPercent: number;
  discountAmount: number;
  finalAmount: number;
  structureId?: string | null;
  inviteCode?: string | null;
  structureFixedAmount?: number;
  structureEarningAmount?: number;
}

export interface PayPalQuoteResponse {
  alreadyPurchased?: boolean;
  checkoutContext: PayPalCheckoutContext;
  currencyCode: string;
  cityId?: string;
  cityName?: string;
  poiId?: string;
  poiName?: string;
  baseAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  structureId?: string | null;
  inviteCode?: string | null;
  items: Array<PayPalQuoteItem | CheckoutPurchaseResponse>;
}

export interface PayPalCreateOrderResponse {
  orderId: string;
  status: string;
  checkout: PayPalQuoteResponse;
}

export interface PayPalCaptureOrderResponse {
  captured: boolean;
  orderId: string;
  purchases: CheckoutPurchaseResponse[];
}

export interface RenderPayPalButtonsCallbacks {
  onStart?: () => void;
  onCreate?: (response: PayPalCreateOrderResponse) => void;
  onSuccess: (response: PayPalCaptureOrderResponse) => void;
  onCancel?: () => void;
  onError: (message: string) => void;
}

@Injectable({ providedIn: 'root' })
export class PayPalCheckoutService {
  private loadedSdkKey = '';
  private sdkLoadPromise?: Promise<PayPalNamespace>;
  private sdkScript?: HTMLScriptElement;
  private readonly noServiceWorkerCacheHeaders = new HttpHeaders({ 'ngsw-bypass': 'true' });

  constructor(
    private readonly http: HttpClient,
    private readonly i18n: I18nService,
    private readonly appAuth: AppAuthService
  ) {}

  getSdkConfig() {
    return this.http.get<PayPalSdkConfigResponse>(`${environment.apiBaseUrl}/paypal/sdk-config`, {
      headers: this.noServiceWorkerCacheHeaders
    });
  }

  getQuote(payload: PayPalCheckoutRequest) {
    return this.http.post<PayPalQuoteResponse>(`${environment.apiBaseUrl}/paypal/checkout/quote`, payload, {
      headers: this.noServiceWorkerCacheHeaders
    });
  }

  async renderButtons(
    container: HTMLElement,
    payload: PayPalCheckoutRequest,
    callbacks: RenderPayPalButtonsCallbacks
  ): Promise<void> {
    if (!container) {
      throw new Error(this.i18n.t('paypal.containerUnavailable'));
    }

    const sdkConfig = await firstValueFrom(this.getSdkConfig());
    if (!sdkConfig.ready || !sdkConfig.clientId) {
      throw new Error(sdkConfig.message || this.i18n.t('paypal.notConfigured'));
    }

    const paypal = await this.ensureSdkLoaded(sdkConfig);
    container.innerHTML = '';

    const buttons = paypal.Buttons({
      style: {
        layout: 'vertical',
        label: 'paypal',
        shape: 'pill',
        color: 'gold',
        tagline: false
      },
      createOrder: async () => {
        callbacks.onStart?.();
        try {
          const created = await firstValueFrom(
            this.http.post<PayPalCreateOrderResponse>(`${environment.apiBaseUrl}/paypal/checkout/create-order`, payload, {
              headers: this.appAuth.authHeaders()
            })
          );
          callbacks.onCreate?.(created);
          return created.orderId;
        } catch (error) {
          const message = this.extractHttpErrorMessage(error);
          callbacks.onError(message);
          throw error;
        }
      },
      onApprove: async (data) => {
        const orderId = String(data?.orderID || '').trim();
        if (!orderId) {
          callbacks.onError(this.i18n.t('paypal.invalidOrder'));
          return;
        }

        try {
          const captured = await firstValueFrom(
            this.http.post<PayPalCaptureOrderResponse>(`${environment.apiBaseUrl}/paypal/checkout/capture-order`, {
              orderId,
              userId: payload.userId
            }, {
              headers: this.appAuth.authHeaders()
            })
          );
          callbacks.onSuccess(captured);
        } catch (error) {
          callbacks.onError(this.extractHttpErrorMessage(error));
          throw error;
        }
      },
      onCancel: () => {
        callbacks.onCancel?.();
      },
      onError: (error) => {
        callbacks.onError(this.extractHttpErrorMessage(error));
      }
    });

    if (typeof buttons.isEligible === 'function' && !buttons.isEligible()) {
      throw new Error(this.i18n.t('paypal.buttonUnavailable'));
    }

    await buttons.render(container);
  }

  clearButtons(container: HTMLElement | null | undefined): void {
    if (container) {
      container.innerHTML = '';
    }
  }

  private async ensureSdkLoaded(config: PayPalSdkConfigResponse): Promise<PayPalNamespace> {
    const sdkKey = `${config.clientId}|${config.currencyCode || 'EUR'}|${config.mode || 'sandbox'}`;
    if (window.paypal && this.loadedSdkKey === sdkKey) {
      return window.paypal;
    }

    if (this.sdkScript) {
      this.sdkScript.remove();
      this.sdkScript = undefined;
      this.sdkLoadPromise = undefined;
      this.loadedSdkKey = '';
      delete window.paypal;
    }

    this.sdkLoadPromise =
      this.sdkLoadPromise ||
      new Promise<PayPalNamespace>((resolve, reject) => {
        const script = document.createElement('script');
        script.src =
          `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(config.clientId || '')}` +
          `&currency=${encodeURIComponent(config.currencyCode || 'EUR')}` +
          `&intent=capture&commit=true&components=buttons&disable-funding=card,credit&locale=${this.i18n.paypalLocale}`;
        script.async = true;
        script.onload = () => {
          if (!window.paypal?.Buttons) {
            reject(new Error(this.i18n.t('paypal.sdkUnavailable')));
            return;
          }

          this.loadedSdkKey = sdkKey;
          resolve(window.paypal);
        };
        script.onerror = () => {
          reject(new Error(this.i18n.t('paypal.loadError')));
        };

        this.sdkScript = script;
        document.head.appendChild(script);
      });

    try {
      return await this.sdkLoadPromise;
    } catch (error) {
      this.sdkLoadPromise = undefined;
      this.loadedSdkKey = '';
      throw error;
    }
  }

  private extractHttpErrorMessage(error: unknown): string {
    if (error && typeof error === 'object') {
      const record = error as {
        error?: { message?: string; details?: unknown };
        message?: string;
      };
      const backendMessage = String(record.error?.message || '').trim();
      if (backendMessage) {
        const detailMessage = this.extractPayPalDetailMessage(record.error?.details);
        if (detailMessage && detailMessage !== backendMessage) {
          return `${backendMessage}: ${detailMessage}`;
        }
        return backendMessage;
      }
      const directMessage = String(record.message || '').trim();
      if (directMessage) {
        return directMessage;
      }
    }

    return this.i18n.t('paypal.operationFailed');
  }

  private extractPayPalDetailMessage(details: unknown): string {
    if (!details || typeof details !== 'object') {
      return '';
    }

    const payload = details as {
      message?: unknown;
      details?: Array<{ issue?: unknown; description?: unknown }>;
      name?: unknown;
    };
    const directMessage = String(payload.message || '').trim();
    if (directMessage) {
      return directMessage;
    }

    const firstDetail = Array.isArray(payload.details) ? payload.details[0] : null;
    if (!firstDetail || typeof firstDetail !== 'object') {
      return String(payload.name || '').trim();
    }

    const issue = String(firstDetail.issue || '').trim();
    const description = String(firstDetail.description || '').trim();
    if (issue && description) {
      return `${issue}: ${description}`;
    }
    return description || issue;
  }
}
