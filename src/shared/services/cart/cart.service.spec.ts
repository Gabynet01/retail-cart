import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { StorageService } from '../storage/storage.service';
import { Product } from '../../models/product';
import { DISCOUNT_TYPE } from '../../enums/discount';

const mockStorageService = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  keys: { cart: 'cart' },
};

describe('CartService', () => {
  let service: CartService;
  let product: Product;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService, { provide: StorageService, useValue: mockStorageService }],
    });

    service = TestBed.inject(CartService);

    product = {
      id: 1,
      name: 'Fjallraven Backpack',
      price: 109.95,
      description: 'A stylish and functional backpack.',
      category: "men's clothing",
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      rating: { rate: 3.9, count: 120 },
    };
  });

  describe('Cart Operations', () => {
    it('should add a product to the cart', () => {
      service.addToCart(product);
      expect(service.totalItems()).toBe(1);
    });

    it('should increment product quantity when adding the same product', () => {
      service.addToCart(product);
      service.addToCart(product);
      expect(service.totalItems()).toBe(2);
    });

    it('should remove a product from the cart', () => {
      service.addToCart(product);
      service.removeFromCart(product.id);
      expect(service.totalItems()).toBe(0);
    });

    it('should update the quantity of a product', () => {
      service.addToCart(product);
      service.updateQuantity(product.id, 5);
      expect(service.totalItems()).toBe(5);
    });

    it('should remove an item if updated quantity is zero', () => {
      service.addToCart(product);
      service.updateQuantity(product.id, 0);
      expect(service.totalItems()).toBe(0);
    });

    it('should check if a product exists in the cart', () => {
      expect(service.itemExistsInCart(product.id)).toBe(false);
      service.addToCart(product);
      expect(service.itemExistsInCart(product.id)).toBe(true);
    });
  });

  describe('Price Calculations', () => {
    it('should calculate the correct grand total', () => {
      service.addToCart(product);
      expect(service.grandTotal()).toBe(109.95);

      service.addToCart(product);
      expect(service.grandTotal()).toBe(219.9);
    });

    it('should get the correct subtotal for a product', () => {
      service.addToCart(product);
      expect(service.getSubTotal(product.id)).toBe(109.95);

      service.addToCart(product);
      expect(service.getSubTotal(product.id)).toBe(219.9);
    });
  });

  describe('Discounts', () => {
    it('should apply a valid discount', () => {
      service.addToCart(product);

      jest
        .spyOn(service as any, 'validDiscounts', 'get')
        .mockReturnValue(new Map([['SAVE10', { type: DISCOUNT_TYPE.PERCENT, value: 10 }]]));

      const applied = service.applyDiscount('SAVE10');
      expect(applied).toBe(true);
      expect(service.discountedTotal()).toBe(98.95);
    });

    it('should not apply an invalid discount', () => {
      const applied = service.applyDiscount('INVALID');
      expect(applied).toBe(false);
      expect(service.discount()).toBeNull();
    });
  });
});
