import { computed, effect, Injectable, signal } from '@angular/core';
import { CartItem } from '../../models/cart';
import { Discount } from '../../models/discount';
import { Product } from '../../models/product';
import {
  DISCOUNT_PERCENT,
  DISCOUNT_CODE,
  DISCOUNT_FIXED,
  DISCOUNT_TYPE,
} from '../../enums/discount';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Holds the list of items in the cart
  private cartItems = signal<CartItem[]>([]);

  // Stores the currently applied discount, if any
  discount = signal<Discount | null>(null);

  constructor(private storageService: StorageService) {
    // Load cart items from storage on initialization
    const storedItems = this.storageService.getItem(this.storageService.keys.cart);
    if (storedItems) this.cartItems.set(JSON.parse(storedItems));
  }

  /**
   * Retrieves all available discount codes and their respective discount values.
   */
  private get validDiscounts(): Map<DISCOUNT_CODE, Discount> {
    const discounts: [DISCOUNT_CODE, Discount][] = [];

    // Populate discount map with percentage-based discounts
    Object.entries(DISCOUNT_PERCENT).forEach(([code, value]) => {
      discounts.push([
        code as DISCOUNT_CODE,
        { type: DISCOUNT_TYPE.PERCENT, value: value as number },
      ]);
    });

    // Populate discount map with fixed-amount discounts
    Object.entries(DISCOUNT_FIXED).forEach(([code, value]) => {
      discounts.push([
        code as DISCOUNT_CODE,
        { type: DISCOUNT_TYPE.FIXED, value: value as number },
      ]);
    });

    return new Map<DISCOUNT_CODE, Discount>(discounts);
  }

  /**
   * Computes the total number of items in the cart.
   */
  totalItems = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));

  /**
   * Computes the total price of all items in the cart, before applying discounts.
   */
  grandTotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

  /**
   * Computes the total price after applying a discount (if any).
   */
  discountedTotal = computed(() => {
    const total = this.grandTotal();
    const discount = this.discount();

    if (!discount) return total;

    const newTotal =
      discount.type === DISCOUNT_TYPE.PERCENT
        ? total * (1 - discount.value / 100)
        : Math.max(0, total - discount.value);

    return parseFloat(newTotal.toFixed(2));
  });

  /**
   * Provides a snapshot of the current cart state, including items, total, and discount.
   */
  cart = computed(() => ({
    items: this.cartItems(),
    total: this.discountedTotal(),
    discount: this.discount(),
  }));

  /**
   * Automatically syncs the cart with local storage whenever it changes.
   */
  cartEffect = effect(() => {
    this.storageService.setItem(this.storageService.keys.cart, JSON.stringify(this.cart().items));
  });

  /**
   * Adds a product to the cart. If it already exists, increments its quantity.
   * @param product The product to add.
   */
  addToCart(product: Product) {
    this.cartItems.update((items) => {
      const index = items.findIndex((item) => item.product.id === product.id);

      if (index !== -1) {
        return items.map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...items, { product, quantity: 1 }];
    });
  }

  /**
   * Removes a product from the cart based on its ID.
   * @param productId The ID of the product to remove.
   */
  removeFromCart(productId: Product['id']) {
    this.cartItems.update((items) => items.filter((item) => item.product.id !== productId));
  }

  /**
   * Updates the quantity of a specific product in the cart.
   * If the quantity is zero or negative, the item is removed.
   * @param productId The ID of the product to update.
   * @param quantity The new quantity of the product.
   */
  updateQuantity(productId: Product['id'], quantity: number) {
    if (quantity <= 0) return this.removeFromCart(productId);

    this.cartItems.update((items) =>
      items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  }

  /**
   * Applies a discount code to the cart if it's valid.
   * @param code The discount code to apply.
   * @returns `true` if the discount was applied successfully, otherwise `false`.
   */
  applyDiscount(code: string): boolean {
    const discount = this.validDiscounts.get(code as DISCOUNT_CODE);
    if (!discount) return false;

    this.discount.set(discount);
    return true;
  }

  /**
   * Checks whether a specific product exists in the cart.
   * @param id The ID of the product to check.
   * @returns `true` if the product is in the cart, otherwise `false`.
   */
  itemExistsInCart(id: Product['id']): boolean {
    return this.cartItems().some((item) => item.product.id === id);
  }

  /**
   * Gets the subtotal price for a specific product in the cart.
   * @param id The ID of the product.
   * @returns The subtotal cost of the product in the cart.
   */
  getSubTotal(id: Product['id']): number {
    const item = this.cartItems().find((item) => item.product.id === id);
    return item ? parseFloat((item.product.price * item.quantity).toFixed(2)) : 0;
  }
}
