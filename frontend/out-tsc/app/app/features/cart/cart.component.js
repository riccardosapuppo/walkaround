import { Component, ViewChild } from '@angular/core';
import { catchError, forkJoin, of, Subject, takeUntil } from 'rxjs';
import { formatCityLabel } from '../../core/utils/city-label.util';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/cart.service";
import * as i2 from "../../core/services/purchase.service";
import * as i3 from "../../core/services/paypal-checkout.service";
import * as i4 from "../../core/services/app-state.service";
import * as i5 from "@angular/material/snack-bar";
import * as i6 from "../../core/services/poi.service";
import * as i7 from "../../core/services/i18n.service";
import * as i8 from "@angular/common";
import * as i9 from "@angular/material/button";
import * as i10 from "@angular/material/card";
import * as i11 from "@angular/material/icon";
import * as i12 from "@angular/material/progress-spinner";
import * as i13 from "../../shared/pipes/translate.pipe";
const _c0 = ["paypalButtonsContainer"];
function CartComponent_div_13_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 15)(1, "div")(2, "p", 16);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 17);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "button", 18);
    i0.ɵɵpipe(7, "t");
    i0.ɵɵlistener("click", function CartComponent_div_13_div_1_Template_button_click_6_listener() { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.removeCartItem(item_r2.key)); });
    i0.ɵɵelementStart(8, "mat-icon", 19);
    i0.ɵɵtext(9, "delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r2.itemLabel(item_r2));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r2.itemCityName(item_r2), " - ", ctx_r2.itemAmountLabel(item_r2), "");
    i0.ɵɵadvance();
    i0.ɵɵattribute("aria-label", i0.ɵɵpipeBind1(7, 4, "cart.removeAria"));
} }
function CartComponent_div_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13);
    i0.ɵɵtemplate(1, CartComponent_div_13_div_1_Template, 10, 6, "div", 14);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r2.cartItems);
} }
function CartComponent_ng_template_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "t");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, "cart.empty"));
} }
function CartComponent_div_16_p_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 24)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(3, 2, "cart.discount"), ":");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" -", ctx_r2.quotedDiscountLabel(), " ");
} }
function CartComponent_div_16_p_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 25)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(3, 2, "cart.paypalTotal"), ":");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.quotedFinalLabel(), " ");
} }
function CartComponent_div_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20)(1, "p", 21)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, CartComponent_div_16_p_6_Template, 5, 4, "p", 22)(7, CartComponent_div_16_p_7_Template, 5, 4, "p", 23);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind1(4, 4, "cart.total"), ":");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.cartTotalLabel(), "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.quote && (ctx_r2.quote.discountAmount || 0) > 0);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.quote);
} }
function CartComponent_div_17_div_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 32);
    i0.ɵɵelement(1, "mat-spinner", 33);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 1, "cart.loadingQuote"));
} }
function CartComponent_div_17_p_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 34);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.paymentError);
} }
function CartComponent_div_17_div_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 35, 1);
} }
function CartComponent_div_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26)(1, "p", 27)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "t");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "p", 28);
    i0.ɵɵtext(6);
    i0.ɵɵpipe(7, "t");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, CartComponent_div_17_div_8_Template, 5, 3, "div", 29)(9, CartComponent_div_17_p_9_Template, 2, 1, "p", 30)(10, CartComponent_div_17_div_10_Template, 2, 0, "div", 31);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 5, "cart.paymentMethod"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 7, "cart.paymentNote"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r2.loadingQuote);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.paymentError);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r2.loadingQuote && !ctx_r2.paymentError && ctx_r2.quote);
} }
function CartComponent_div_18_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 36)(1, "button", 37);
    i0.ɵɵlistener("click", function CartComponent_div_18_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.clearCart()); });
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.cartPaying || ctx_r2.loadingQuote);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(3, 2, "cart.clear"));
} }
export class CartComponent {
    constructor(cartService, purchaseService, paypalCheckout, appState, snackBar, poiService, i18n) {
        this.cartService = cartService;
        this.purchaseService = purchaseService;
        this.paypalCheckout = paypalCheckout;
        this.appState = appState;
        this.snackBar = snackBar;
        this.poiService = poiService;
        this.i18n = i18n;
        this.cartItems = [];
        this.cartPaying = false;
        this.loadingQuote = false;
        this.paymentError = '';
        this.quote = null;
        this.poiById = {};
        this.destroy$ = new Subject();
        this.lastPayPalRenderSignature = '';
    }
    ngOnInit() {
        this.purchaseService.refresh();
        this.cartService.items$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
            this.cartItems = items;
            this.loadItemDetails();
            this.loadQuote();
        });
    }
    ngAfterViewChecked() {
        const container = this.paypalButtonsContainer?.nativeElement;
        if (!container || !this.cartItems.length || this.loadingQuote || this.cartPaying || !this.quote || this.paymentError) {
            return;
        }
        const signature = this.buildPayPalRenderSignature();
        if (!signature || signature === this.lastPayPalRenderSignature) {
            return;
        }
        this.lastPayPalRenderSignature = signature;
        void this.renderPayPalButtons();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.clearPayPalButtons();
    }
    cartTotalAmount() {
        return this.cartItems.reduce((total, item) => total + Number(item.amount || 0), 0);
    }
    cartTotalLabel() {
        return this.i18n.formatCurrency(this.cartTotalAmount());
    }
    quotedFinalLabel() {
        return this.i18n.formatCurrency(Number(this.quote?.finalAmount || 0));
    }
    quotedDiscountLabel() {
        return this.i18n.formatCurrency(Number(this.quote?.discountAmount || 0));
    }
    itemAmountLabel(item) {
        return this.i18n.formatCurrency(Number(item.amount || 0));
    }
    itemLabel(item) {
        const poi = this.poiById[item.poiId];
        return poi ? this.i18n.resolvePoiField(poi.name, poi.translations, 'name') : item.label;
    }
    itemCityName(item) {
        const poi = this.poiById[item.poiId];
        if (poi) {
            return formatCityLabel(poi.cityId, [], this.i18n.language);
        }
        return formatCityLabel(item.cityId, [], this.i18n.language) || item.cityName;
    }
    removeCartItem(itemKey) {
        this.cartService.removeItem(itemKey);
    }
    clearCart() {
        this.cartService.clear();
    }
    loadQuote() {
        this.resetPayPalRenderState();
        if (!this.cartItems.length) {
            this.quote = null;
            this.paymentError = '';
            return;
        }
        this.loadingQuote = true;
        this.paymentError = '';
        this.quote = null;
        this.paypalCheckout
            .getQuote({
            userId: this.appState.userId,
            checkoutContext: 'cart',
            poiIds: this.cartItems.map((item) => item.poiId),
            ignoreDiscountCode: false
        })
            .subscribe({
            next: (quote) => {
                this.loadingQuote = false;
                this.quote = quote;
                if (Number(quote.finalAmount || 0) <= 0) {
                    this.paymentError = this.i18n.t('paypal.invalidOrder');
                }
            },
            error: (error) => {
                this.loadingQuote = false;
                this.quote = null;
                this.paymentError = this.i18n.t('cart.quoteError');
            }
        });
    }
    loadItemDetails() {
        if (!this.cartItems.length) {
            this.poiById = {};
            return;
        }
        forkJoin(this.cartItems.map((item) => this.poiService.getPoiById(item.poiId).pipe(takeUntil(this.destroy$), 
        // Keep item label fallback when a POI is not reachable.
        // `of(null)` lets the list stay usable even with partial backend failures.
        catchError(() => of(null))))).subscribe((pois) => {
            this.poiById = pois.reduce((acc, poi) => {
                if (poi?.id) {
                    acc[poi.id] = poi;
                }
                return acc;
            }, {});
        });
    }
    buildPayPalRenderSignature() {
        if (!this.quote || !this.cartItems.length) {
            return '';
        }
        return [
            this.cartItems.map((item) => item.key).join(','),
            Number(this.quote.finalAmount || 0).toFixed(2),
            Number(this.quote.discountAmount || 0).toFixed(2)
        ].join('|');
    }
    async renderPayPalButtons() {
        const container = this.paypalButtonsContainer?.nativeElement;
        if (!container || !this.cartItems.length) {
            return;
        }
        this.paymentError = '';
        try {
            await this.paypalCheckout.renderButtons(container, {
                userId: this.appState.userId,
                checkoutContext: 'cart',
                poiIds: this.cartItems.map((item) => item.poiId),
                ignoreDiscountCode: false
            }, {
                onStart: () => {
                    this.cartPaying = true;
                    this.paymentError = '';
                },
                onSuccess: (response) => {
                    this.cartPaying = false;
                    const purchasedPoiIds = new Set(response.purchases
                        .map((purchase) => String(purchase.poiId || '').trim())
                        .filter(Boolean));
                    this.cartItems.forEach((item) => {
                        if (purchasedPoiIds.has(item.poiId)) {
                            this.cartService.removeItem(item.key);
                        }
                    });
                    this.purchaseService.refresh();
                    this.snackBar.open(this.i18n.t('cart.paypalCompletedCount', { count: response.purchases.length }), this.i18n.t('common.ok'), { duration: 2800 });
                },
                onCancel: () => {
                    this.cartPaying = false;
                },
                onError: (message) => {
                    this.cartPaying = false;
                    this.paymentError = message;
                }
            });
        }
        catch (error) {
            this.cartPaying = false;
            this.paymentError = error instanceof Error ? error.message : this.i18n.t('paypal.loadError');
            this.clearPayPalButtons();
        }
    }
    resetPayPalRenderState() {
        this.lastPayPalRenderSignature = '';
        this.cartPaying = false;
        this.clearPayPalButtons();
    }
    clearPayPalButtons() {
        this.paypalCheckout.clearButtons(this.paypalButtonsContainer?.nativeElement);
    }
    static { this.ɵfac = function CartComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CartComponent)(i0.ɵɵdirectiveInject(i1.CartService), i0.ɵɵdirectiveInject(i2.PurchaseService), i0.ɵɵdirectiveInject(i3.PayPalCheckoutService), i0.ɵɵdirectiveInject(i4.AppStateService), i0.ɵɵdirectiveInject(i5.MatSnackBar), i0.ɵɵdirectiveInject(i6.PoiService), i0.ɵɵdirectiveInject(i7.I18nService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CartComponent, selectors: [["app-cart"]], viewQuery: function CartComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.paypalButtonsContainer = _t.first);
        } }, standalone: false, decls: 19, vars: 14, consts: [["emptyCart", ""], ["paypalButtonsContainer", ""], [1, "page-shell", "cart-page"], [1, "brand-hero"], [1, "brand-hero-stage"], ["src", "/assets/logo.png", "loading", "eager", "decoding", "sync", "fetchpriority", "high", 1, "brand-hero-logo"], [1, "brand-hero-footer"], [1, "brand-hero-slogan"], [1, "card", "section"], ["class", "cart-list", 4, "ngIf", "ngIfElse"], ["class", "cart-total-block", 4, "ngIf"], ["class", "paypal-panel", 4, "ngIf"], ["class", "cart-actions", 4, "ngIf"], [1, "cart-list"], ["class", "cart-item", 4, "ngFor", "ngForOf"], [1, "cart-item"], [1, "cart-item-title"], [1, "cart-item-sub"], ["mat-icon-button", "", "color", "warn", 3, "click"], ["fontSet", "material-icons-round"], [1, "cart-total-block"], [1, "cart-total"], ["class", "cart-total discount-line", 4, "ngIf"], ["class", "cart-total final-line", 4, "ngIf"], [1, "cart-total", "discount-line"], [1, "cart-total", "final-line"], [1, "paypal-panel"], [1, "paypal-title"], [1, "payment-note"], ["class", "paypal-loading", 4, "ngIf"], ["class", "payment-error", 4, "ngIf"], ["class", "paypal-buttons", 4, "ngIf"], [1, "paypal-loading"], ["diameter", "24"], [1, "payment-error"], [1, "paypal-buttons"], [1, "cart-actions"], ["mat-stroked-button", "", "color", "warn", 3, "click", "disabled"]], template: function CartComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 2)(1, "header", 3)(2, "div", 4);
            i0.ɵɵelement(3, "img", 5);
            i0.ɵɵpipe(4, "t");
            i0.ɵɵelementStart(5, "div", 6)(6, "p", 7);
            i0.ɵɵtext(7);
            i0.ɵɵpipe(8, "t");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(9, "mat-card", 8)(10, "h3");
            i0.ɵɵtext(11);
            i0.ɵɵpipe(12, "t");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(13, CartComponent_div_13_Template, 2, 1, "div", 9)(14, CartComponent_ng_template_14_Template, 3, 3, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor)(16, CartComponent_div_16_Template, 8, 6, "div", 10)(17, CartComponent_div_17_Template, 11, 9, "div", 11)(18, CartComponent_div_18_Template, 4, 4, "div", 12);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            const emptyCart_r5 = i0.ɵɵreference(15);
            i0.ɵɵadvance(3);
            i0.ɵɵattribute("alt", i0.ɵɵpipeBind1(4, 8, "common.appName"));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 10, "common.brandTagline"));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(12, 12, "cart.placesInCart"));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.cartItems.length)("ngIfElse", emptyCart_r5);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngIf", ctx.cartItems.length);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.cartItems.length);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.cartItems.length);
        } }, dependencies: [i8.NgForOf, i8.NgIf, i9.MatButton, i9.MatIconButton, i10.MatCard, i11.MatIcon, i12.MatProgressSpinner, i13.TranslatePipe], styles: [".cart-page[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n  align-items: start;\n}\n\n.section[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n  align-self: start;\n\n  h3 {\n    margin: 0;\n    font-size: 1.05rem;\n  }\n\n  p {\n    margin: 0;\n    color: #677790;\n  }\n}\n\n.cart-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n}\n\n.cart-item[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 10px;\n  border: 1px solid #d9e3f2;\n  background: #f8fbff;\n  border-radius: 10px;\n  padding: 8px 10px;\n}\n\nbody.app-user-theme[_nghost-%COMP%]   .cart-item[_ngcontent-%COMP%], body.app-user-theme   [_nghost-%COMP%]   .cart-item[_ngcontent-%COMP%] {\n  border-color: rgba(182, 164, 129, 0.18);\n  background: linear-gradient(180deg, rgba(246, 250, 254, 0.94) 0%, rgba(250, 246, 239, 0.92) 100%);\n}\n\n.cart-item-title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 600;\n  color: #213a58;\n}\n\n.cart-item-sub[_ngcontent-%COMP%] {\n  margin: 2px 0 0;\n  color: #6b7d95;\n  font-size: 0.84rem;\n}\n\n.cart-total[_ngcontent-%COMP%] {\n  color: #1f3753 !important;\n}\n\n.cart-total-block[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 4px;\n}\n\n.discount-line[_ngcontent-%COMP%] {\n  color: #0f6b3f !important;\n}\n\n.final-line[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n}\n\n.paypal-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n  padding: 12px;\n  border: 1px solid #d9e3f2;\n  background: #f8fbff;\n  border-radius: 12px;\n}\n\nbody.app-user-theme[_nghost-%COMP%]   .paypal-panel[_ngcontent-%COMP%], body.app-user-theme   [_nghost-%COMP%]   .paypal-panel[_ngcontent-%COMP%] {\n  border-color: rgba(182, 164, 129, 0.2);\n  background: linear-gradient(180deg, rgba(247, 250, 253, 0.96) 0%, rgba(250, 246, 239, 0.94) 100%);\n}\n\n.paypal-title[_ngcontent-%COMP%] {\n  color: #1f3753 !important;\n}\n\n.payment-note[_ngcontent-%COMP%] {\n  color: #4b6583 !important;\n  font-size: 0.86rem;\n}\n\n.paypal-loading[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  color: #16365a;\n  font-size: 0.88rem;\n  font-weight: 600;\n}\n\n.payment-error[_ngcontent-%COMP%] {\n  color: #c62828 !important;\n  font-size: 0.88rem;\n}\n\n.paypal-buttons[_ngcontent-%COMP%] {\n  min-height: 44px;\n}\n\n.cart-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CartComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-cart', template: "<section class=\"page-shell cart-page\">\n  <header class=\"brand-hero\">\n    <div class=\"brand-hero-stage\">\n      <img\n        class=\"brand-hero-logo\"\n        src=\"/assets/logo.png\"\n        [attr.alt]=\"'common.appName' | t\"\n        loading=\"eager\"\n        decoding=\"sync\"\n        fetchpriority=\"high\"\n      />\n      <div class=\"brand-hero-footer\">\n        <p class=\"brand-hero-slogan\">{{ 'common.brandTagline' | t }}</p>\n      </div>\n    </div>\n  </header>\n\n  <mat-card class=\"card section\">\n    <h3>{{ 'cart.placesInCart' | t }}</h3>\n\n    <div class=\"cart-list\" *ngIf=\"cartItems.length; else emptyCart\">\n      <div class=\"cart-item\" *ngFor=\"let item of cartItems\">\n        <div>\n          <p class=\"cart-item-title\">{{ itemLabel(item) }}</p>\n          <p class=\"cart-item-sub\">{{ itemCityName(item) }} - {{ itemAmountLabel(item) }}</p>\n        </div>\n        <button mat-icon-button color=\"warn\" (click)=\"removeCartItem(item.key)\" [attr.aria-label]=\"'cart.removeAria' | t\">\n          <mat-icon fontSet=\"material-icons-round\">delete</mat-icon>\n        </button>\n      </div>\n    </div>\n    <ng-template #emptyCart>\n      <p>{{ 'cart.empty' | t }}</p>\n    </ng-template>\n\n    <div class=\"cart-total-block\" *ngIf=\"cartItems.length\">\n      <p class=\"cart-total\"><strong>{{ 'cart.total' | t }}:</strong> {{ cartTotalLabel() }}</p>\n      <p class=\"cart-total discount-line\" *ngIf=\"quote && (quote.discountAmount || 0) > 0\">\n        <strong>{{ 'cart.discount' | t }}:</strong> -{{ quotedDiscountLabel() }}\n      </p>\n      <p class=\"cart-total final-line\" *ngIf=\"quote\">\n        <strong>{{ 'cart.paypalTotal' | t }}:</strong> {{ quotedFinalLabel() }}\n      </p>\n    </div>\n\n    <div class=\"paypal-panel\" *ngIf=\"cartItems.length\">\n      <p class=\"paypal-title\"><strong>{{ 'cart.paymentMethod' | t }}</strong></p>\n      <p class=\"payment-note\">{{ 'cart.paymentNote' | t }}</p>\n\n      <div class=\"paypal-loading\" *ngIf=\"loadingQuote\">\n        <mat-spinner diameter=\"24\"></mat-spinner>\n        <span>{{ 'cart.loadingQuote' | t }}</span>\n      </div>\n\n      <p class=\"payment-error\" *ngIf=\"paymentError\">{{ paymentError }}</p>\n      <div #paypalButtonsContainer class=\"paypal-buttons\" *ngIf=\"!loadingQuote && !paymentError && quote\"></div>\n    </div>\n\n    <div class=\"cart-actions\" *ngIf=\"cartItems.length\">\n      <button mat-stroked-button color=\"warn\" (click)=\"clearCart()\" [disabled]=\"cartPaying || loadingQuote\">{{ 'cart.clear' | t }}</button>\n    </div>\n  </mat-card>\n</section>\n", styles: [".cart-page {\n  display: grid;\n  gap: 12px;\n  align-content: start;\n  align-items: start;\n}\n\n.section {\n  padding: 14px;\n  display: grid;\n  gap: 10px;\n  align-self: start;\n\n  h3 {\n    margin: 0;\n    font-size: 1.05rem;\n  }\n\n  p {\n    margin: 0;\n    color: #677790;\n  }\n}\n\n.cart-list {\n  display: grid;\n  gap: 8px;\n}\n\n.cart-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 10px;\n  border: 1px solid #d9e3f2;\n  background: #f8fbff;\n  border-radius: 10px;\n  padding: 8px 10px;\n}\n\n:host-context(body.app-user-theme) .cart-item {\n  border-color: rgba(182, 164, 129, 0.18);\n  background: linear-gradient(180deg, rgba(246, 250, 254, 0.94) 0%, rgba(250, 246, 239, 0.92) 100%);\n}\n\n.cart-item-title {\n  margin: 0;\n  font-weight: 600;\n  color: #213a58;\n}\n\n.cart-item-sub {\n  margin: 2px 0 0;\n  color: #6b7d95;\n  font-size: 0.84rem;\n}\n\n.cart-total {\n  color: #1f3753 !important;\n}\n\n.cart-total-block {\n  display: grid;\n  gap: 4px;\n}\n\n.discount-line {\n  color: #0f6b3f !important;\n}\n\n.final-line {\n  font-size: 0.96rem;\n}\n\n.paypal-panel {\n  display: grid;\n  gap: 10px;\n  padding: 12px;\n  border: 1px solid #d9e3f2;\n  background: #f8fbff;\n  border-radius: 12px;\n}\n\n:host-context(body.app-user-theme) .paypal-panel {\n  border-color: rgba(182, 164, 129, 0.2);\n  background: linear-gradient(180deg, rgba(247, 250, 253, 0.96) 0%, rgba(250, 246, 239, 0.94) 100%);\n}\n\n.paypal-title {\n  color: #1f3753 !important;\n}\n\n.payment-note {\n  color: #4b6583 !important;\n  font-size: 0.86rem;\n}\n\n.paypal-loading {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  color: #16365a;\n  font-size: 0.88rem;\n  font-weight: 600;\n}\n\n.payment-error {\n  color: #c62828 !important;\n  font-size: 0.88rem;\n}\n\n.paypal-buttons {\n  min-height: 44px;\n}\n\n.cart-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n"] }]
    }], () => [{ type: i1.CartService }, { type: i2.PurchaseService }, { type: i3.PayPalCheckoutService }, { type: i4.AppStateService }, { type: i5.MatSnackBar }, { type: i6.PoiService }, { type: i7.I18nService }], { paypalButtonsContainer: [{
            type: ViewChild,
            args: ['paypalButtonsContainer']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CartComponent, { className: "CartComponent", filePath: "frontend/src/app/features/cart/cart.component.ts", lineNumber: 20 }); })();
