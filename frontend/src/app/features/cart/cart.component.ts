import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, forkJoin, of, Subject, takeUntil } from 'rxjs';
import { CartItem } from '../../core/models/cart-item.model';
import { Poi } from '../../core/models/poi.model';
import { AppStateService } from '../../core/services/app-state.service';
import { I18nService } from '../../core/services/i18n.service';
import { PayPalCheckoutService, PayPalQuoteResponse } from '../../core/services/paypal-checkout.service';
import { CartService } from '../../core/services/cart.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';
import { formatCityLabel } from '../../core/utils/city-label.util';

@Component({
  standalone: false,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('paypalButtonsContainer') paypalButtonsContainer?: ElementRef<HTMLDivElement>;

  cartItems: CartItem[] = [];
  cartPaying = false;
  loadingQuote = false;
  paymentError = '';
  quote: PayPalQuoteResponse | null = null;
  poiById: Record<string, Poi> = {};

  private readonly destroy$ = new Subject<void>();
  private lastPayPalRenderSignature = '';

  constructor(
    private readonly cartService: CartService,
    private readonly purchaseService: PurchaseService,
    private readonly paypalCheckout: PayPalCheckoutService,
    private readonly appState: AppStateService,
    private readonly snackBar: MatSnackBar,
    private readonly poiService: PoiService,
    public readonly i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.purchaseService.refresh();
    this.cartService.items$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      this.cartItems = items;
      this.loadItemDetails();
      this.loadQuote();
    });
  }

  ngAfterViewChecked(): void {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearPayPalButtons();
  }

  cartTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + Number(item.amount || 0), 0);
  }

  cartTotalLabel(): string {
    return this.i18n.formatCurrency(this.cartTotalAmount());
  }

  quotedFinalLabel(): string {
    return this.i18n.formatCurrency(Number(this.quote?.finalAmount || 0));
  }

  quotedDiscountLabel(): string {
    return this.i18n.formatCurrency(Number(this.quote?.discountAmount || 0));
  }

  itemAmountLabel(item: CartItem): string {
    return this.i18n.formatCurrency(Number(item.amount || 0));
  }

  itemLabel(item: CartItem): string {
    const poi = this.poiById[item.poiId];
    return poi ? this.i18n.resolvePoiField(poi.name, poi.translations, 'name') : item.label;
  }

  itemCityName(item: CartItem): string {
    const poi = this.poiById[item.poiId];
    if (poi) {
      return formatCityLabel(poi.cityId, [], this.i18n.language);
    }
    return formatCityLabel(item.cityId, [], this.i18n.language) || item.cityName;
  }

  removeCartItem(itemKey: string): void {
    this.cartService.removeItem(itemKey);
  }

  clearCart(): void {
    this.cartService.clear();
  }

  private loadQuote(): void {
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
        error: (error: { error?: { message?: string } }) => {
          this.loadingQuote = false;
          this.quote = null;
          this.paymentError = this.i18n.t('cart.quoteError');
        }
      });
  }

  private loadItemDetails(): void {
    if (!this.cartItems.length) {
      this.poiById = {};
      return;
    }

    forkJoin(
      this.cartItems.map((item) =>
        this.poiService.getPoiById(item.poiId).pipe(
          takeUntil(this.destroy$),
          // Keep item label fallback when a POI is not reachable.
          // `of(null)` lets the list stay usable even with partial backend failures.
          catchError(() => of(null))
        )
      )
    ).subscribe((pois) => {
      this.poiById = pois.reduce(
        (acc, poi) => {
          if (poi?.id) {
            acc[poi.id] = poi;
          }
          return acc;
        },
        {} as Record<string, Poi>
      );
    });
  }

  private buildPayPalRenderSignature(): string {
    if (!this.quote || !this.cartItems.length) {
      return '';
    }

    return [
      this.cartItems.map((item) => item.key).join(','),
      Number(this.quote.finalAmount || 0).toFixed(2),
      Number(this.quote.discountAmount || 0).toFixed(2)
    ].join('|');
  }

  private async renderPayPalButtons(): Promise<void> {
    const container = this.paypalButtonsContainer?.nativeElement;
    if (!container || !this.cartItems.length) {
      return;
    }

    this.paymentError = '';

    try {
      await this.paypalCheckout.renderButtons(
        container,
        {
          userId: this.appState.userId,
          checkoutContext: 'cart',
          poiIds: this.cartItems.map((item) => item.poiId),
          ignoreDiscountCode: false
        },
        {
          onStart: () => {
            this.cartPaying = true;
            this.paymentError = '';
          },
          onSuccess: (response) => {
            this.cartPaying = false;
            const purchasedPoiIds = new Set(
              response.purchases
                .map((purchase) => String(purchase.poiId || '').trim())
                .filter(Boolean)
            );
            this.cartItems.forEach((item) => {
              if (purchasedPoiIds.has(item.poiId)) {
                this.cartService.removeItem(item.key);
              }
            });
            this.purchaseService.refresh();
            this.snackBar.open(
              this.i18n.t('cart.paypalCompletedCount', { count: response.purchases.length }),
              this.i18n.t('common.ok'),
              { duration: 2800 }
            );
          },
          onCancel: () => {
            this.cartPaying = false;
          },
          onError: (message) => {
            this.cartPaying = false;
            this.paymentError = message;
          }
        }
      );
    } catch (error) {
      this.cartPaying = false;
      this.paymentError = error instanceof Error ? error.message : this.i18n.t('paypal.loadError');
      this.clearPayPalButtons();
    }
  }

  private resetPayPalRenderState(): void {
    this.lastPayPalRenderSignature = '';
    this.cartPaying = false;
    this.clearPayPalButtons();
  }

  private clearPayPalButtons(): void {
    this.paypalCheckout.clearButtons(this.paypalButtonsContainer?.nativeElement);
  }
}
