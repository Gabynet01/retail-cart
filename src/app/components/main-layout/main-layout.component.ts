import { Component } from '@angular/core';
import { CartService } from '../../../shared/services/cart/cart.service';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from '../../../shared/services/navigation/navigation.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [SearchComponent, RouterModule, MatIconModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  constructor(
    public cartService: CartService,
    private navigationService: NavigationService,
  ) {}

  // Navigate to Products page
  navigateToProducts() {
    this.navigationService.navigateToProducts();
  }

  // Navigate to Cart page (with empty cart check)
  navigateToCart() {
    this.navigationService.navigateToCart();
  }
}
