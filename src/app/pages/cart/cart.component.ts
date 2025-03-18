import { Component, computed, effect, signal } from '@angular/core';
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
  readonly message = signal('');
  discountStatus = signal<'success' | 'error' | null>(null);
  showDiscountField = false;

  readonly discountForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]),
  });

  discounted = computed(() => Boolean(this.cartService.discount()));

  constructor(private readonly cartService: CartService) {
    // Effect to disable/enable discount input
    effect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.discounted()
        ? this.discountForm.get('code')?.disable()
        : this.discountForm.get('code')?.enable();
    });
    if (this.cartService.discount()) {
      this.discountForm.get('code')?.setValue(this.cartService.getDiscountCode());
      this.showDiscountField = true;
    }
  }

  get cart() {
    return this.cartService.cart();
  }

  resetDiscount() {
    this.cartService.removeDiscount();
    this.discountForm.reset();
    this.message.set('');
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
    this.message.set('');
    this.discountStatus.set(null);

    const code = this.discountForm.get('code')?.value?.trim() || '';
    if (this.discountForm.invalid) return;

    if (!this.cartService.applyDiscount(code)) {
      this.message.set('Invalid discount code');
      this.discountStatus.set('error');
      this.discountForm.reset();
    } else {
      this.message.set('Discount Applied!');
      this.discountStatus.set('success');
    }
  }
}
