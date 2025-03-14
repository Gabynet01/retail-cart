import { Component, computed, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../shared/services/cart/cart.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ProductCardComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  showDiscountField = false;

  readonly discountForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]),
  });

  constructor(private readonly cartService: CartService) {
    // Computed property for discount state
    const discounted = computed(() => Boolean(this.cartService.discount()));

    // Effect to disable/enable discount input
    effect(() => {
      discounted()
        ? this.discountForm.get('code')?.disable()
        : this.discountForm.get('code')?.enable();
    });
  }

  get cart() {
    return this.cartService.cart();
  }

  toggleDiscount(hasDiscount: boolean) {
    this.showDiscountField = hasDiscount;
    if (!hasDiscount) this.discountForm.reset();
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  remove(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  applyDiscount() {
    this.errorMessage.set('');
    this.successMessage.set('');

    const code = this.discountForm.get('code')?.value?.trim() || '';
    if (this.discountForm.invalid) return;

    if (!this.cartService.applyDiscount(code)) {
      this.errorMessage.set('Invalid discount code');
    } else {
      this.successMessage.set('Discount Applied!');
    }
  }
}
