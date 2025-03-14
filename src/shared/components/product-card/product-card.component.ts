import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart/cart.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() type: 'normal' | 'cart' = 'normal';
  @Input() quantity = 0;

  @Output() addPressed = new EventEmitter<void>();
  @Output() removePressed = new EventEmitter<void>();

  constructor(public cartService: CartService) {}

  get existsInCart() {
    return this.cartService.itemExistsInCart(this.product.id);
  }
}
