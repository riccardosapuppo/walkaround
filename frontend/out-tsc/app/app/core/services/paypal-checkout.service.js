import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./i18n.service";
export class PayPalCheckoutService {
    constructor(http, i18n) {
        this.http = http;
        this.i18n = i18n;
        this.loadedSdkKey = '';
    }
    getSdkConfig() {
        return this.http.get(`${environment.apiBaseUrl}/paypal/sdk-config`);
    }
    getQuote(payload) {
        return this.http.post(`${environment.apiBaseUrl}/paypal/checkout/quote`, payload);
    }
    async renderButtons(container, payload, callbacks) {
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
                    const created = await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/paypal/checkout/create-order`, payload));
                    callbacks.onCreate?.(created);
                    return created.orderId;
                }
                catch (error) {
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
                    const captured = await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/paypal/checkout/capture-order`, {
                        orderId,
                        userId: payload.userId
                    }));
                    callbacks.onSuccess(captured);
                }
                catch (error) {
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
    clearButtons(container) {
        if (container) {
            container.innerHTML = '';
        }
    }
    async ensureSdkLoaded(config) {
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
                new Promise((resolve, reject) => {
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
        }
        catch (error) {
            this.sdkLoadPromise = undefined;
            this.loadedSdkKey = '';
            throw error;
        }
    }
    extractHttpErrorMessage(error) {
        if (error && typeof error === 'object') {
            const record = error;
            const backendMessage = String(record.error?.message || '').trim();
            if (backendMessage) {
                return backendMessage;
            }
            const directMessage = String(record.message || '').trim();
            if (directMessage) {
                return directMessage;
            }
        }
        return this.i18n.t('paypal.operationFailed');
    }
    static { this.ɵfac = function PayPalCheckoutService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PayPalCheckoutService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.I18nService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PayPalCheckoutService, factory: PayPalCheckoutService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PayPalCheckoutService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }, { type: i2.I18nService }], null); })();
