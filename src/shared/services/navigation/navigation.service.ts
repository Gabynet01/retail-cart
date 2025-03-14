import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../enums/routes';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  navigateToProducts() {
    this.router.navigate([`${APP_ROUTES.PRODUCTS}`]);
  }

  navigateToCart() {
    this.router.navigate([`${APP_ROUTES.CART}`]);
  }
}
