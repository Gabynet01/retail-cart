import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';
import { APP_ROUTES } from '../../enums/routes';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [NavigationService, { provide: Router, useValue: routerMock }],
    });

    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to products', () => {
    service.navigateToProducts();
    expect(routerMock.navigate).toHaveBeenCalledWith([`${APP_ROUTES.PRODUCTS}`]);
  });

  it('should navigate to cart', () => {
    service.navigateToCart();
    expect(routerMock.navigate).toHaveBeenCalledWith([`${APP_ROUTES.CART}`]);
  });
});
