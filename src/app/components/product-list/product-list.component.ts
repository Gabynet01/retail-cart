import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { Product } from '../../../shared/models/product';
import { CartService } from '../../../shared/services/cart/cart.service';
import { ProductService } from '../../../shared/services/product/product.service';
import { SearchService } from '../../../shared/services/search/search.service';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  products = signal<Product[]>([]); // All products
  visibleProducts = signal<Product[]>([]); // Products currently visible
  private initialLoadCount = 10; // Number of items to load initially
  private loadMoreCount = 10; // Number of additional items to load each time

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private searchService: SearchService,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit() {
    // Fetch all products
    this.products.set(this.productService.getAllProducts());
    this.updateVisibleProducts(); // Show initial set of products

    // Update products when search value changes
    this.searchService.searchValue$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.products.set(this.productService.getAllProducts());
      this.updateVisibleProducts(); // Reset visible products on search
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Add a product to the cart
  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.snackbar.success(`Added to cart successfully`);
  }

  // Remove a product from the cart
  removeFromCart(id: Product['id']) {
    this.cartService.removeFromCart(id);
    this.snackbar.info(`Removed from cart`);
  }

  // Load more products
  loadMore() {
    const currentCount = this.visibleProducts().length;
    const newCount = currentCount + this.loadMoreCount;
    this.visibleProducts.set(this.products().slice(0, newCount));
  }

  // Update visible products based on the current count
  private updateVisibleProducts() {
    this.visibleProducts.set(this.products().slice(0, this.initialLoadCount));
  }
}
