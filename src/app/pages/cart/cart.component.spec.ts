import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../../shared/services/cart/cart.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { dummmyProducts } from '../../../shared/constants/dummyProducts';

const mockCartService = {
  cart: signal({
    items: [
      { product: dummmyProducts[0], quantity: 2 },
      { product: dummmyProducts[1], quantity: 1 },
    ],
    total: dummmyProducts[0].price * 2 + dummmyProducts[1].price,
  }),
  discount: signal<string | null>(null),
  updateQuantity: jest.fn(),
  removeFromCart: jest.fn(),
  applyDiscount: jest.fn().mockReturnValue(true),
  getSubTotal: jest.fn(() => dummmyProducts[0].price * 2 + dummmyProducts[1].price),
};

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CartComponent, ProductCardComponent],
      providers: [{ provide: CartService, useValue: mockCartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize component correctly', () => {
    expect(component).toBeTruthy();
    expect(component.cart).toBeDefined();
    expect(component.discountForm).toBeDefined();
  });

  it('should display correct number of cart items', () => {
    const productCards = fixture.debugElement.queryAll(By.css('app-product-card'));
    expect(productCards.length).toBe(2);
  });

  it('should display correct product details', () => {
    const productCards = fixture.debugElement.queryAll(By.css('app-product-card'));
    const [firstProduct, secondProduct] = productCards.map((card) => card.componentInstance);

    expect(firstProduct.product).toEqual(dummmyProducts[0]);
    expect(firstProduct.quantity).toBe(2);
    expect(firstProduct.type).toBe('cart');

    expect(secondProduct.product).toEqual(dummmyProducts[1]);
    expect(secondProduct.quantity).toBe(1);
  });

  it('should calculate and display correct total price', () => {
    const expectedTotal = dummmyProducts[0].price * 2 + dummmyProducts[1].price;
    const totalEl = fixture.debugElement.query(By.css('.total-amount'));
    expect(totalEl.nativeElement.textContent).toContain(`$${expectedTotal.toFixed(2)}`);
  });

  it('should update product quantity when add/remove is triggered', () => {
    const productCards = fixture.debugElement.queryAll(By.css('app-product-card'));

    productCards[0].triggerEventHandler('addPressed', null);
    expect(cartService.updateQuantity).toHaveBeenCalledWith(dummmyProducts[0].id, 3);

    productCards[1].triggerEventHandler('removePressed', null);
    expect(cartService.updateQuantity).toHaveBeenCalledWith(dummmyProducts[1].id, 0);
  });

  it('should remove product from cart when remove is triggered', () => {
    component.remove(dummmyProducts[0].id);
    expect(cartService.removeFromCart).toHaveBeenCalledWith(dummmyProducts[0].id);
  });

  describe('Discount Form', () => {
    it('should toggle visibility of discount field', () => {
      const yesButton = fixture.debugElement.query(By.css('.toggle-button:nth-child(1)'));
      const noButton = fixture.debugElement.query(By.css('.toggle-button:nth-child(2)'));

      expect(component.showDiscountField).toBeFalsy();

      yesButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.showDiscountField).toBeTruthy();

      noButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.showDiscountField).toBeTruthy();
    });

    it('should show error message for invalid discount code', () => {
      const input = component.discountForm.controls.code;
      input.setValue('!@#invalid');
      fixture.detectChanges();

      expect(input.invalid).toBeTruthy();
      const errorMessage = fixture.debugElement.query(By.css('.error-message'));
      expect(errorMessage.nativeElement.textContent).toContain('Invalid format');
    });

    it('should apply discount successfully', () => {
      jest.spyOn(cartService, 'applyDiscount').mockReturnValue(true);

      component.discountForm.controls.code.setValue('SAVE10');
      component.applyDiscount();
      fixture.detectChanges();

      expect(cartService.applyDiscount).toHaveBeenCalledWith('SAVE10');
      expect(component.message()).toBe('Discount Applied!');
    });

    it('should show error message when discount application fails', () => {
      jest.spyOn(cartService, 'applyDiscount').mockReturnValue(false);

      component.discountForm.controls.code.setValue('INVALIDCODE');
      component.applyDiscount();
      fixture.detectChanges();

      expect(cartService.applyDiscount).toHaveBeenCalledWith('INVALIDCODE');
      expect(component.message()).toBe('Invalid discount code');
    });

    it('should enable/disable discount input field based on discount availability', fakeAsync(() => {
      expect(component.discountForm.controls.code.enabled).toBeTruthy();

      mockCartService.discount.set('SAVE10');
      tick();
      fixture.detectChanges();
      expect(component.discountForm.controls.code.disabled).toBeTruthy();

      mockCartService.discount.set(null);
      tick();
      fixture.detectChanges();
      expect(component.discountForm.controls.code.enabled).toBeTruthy();
    }));
  });
});
