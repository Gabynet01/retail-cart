import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { CartService } from '../../services/cart/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../models/product';
import { By } from '@angular/platform-browser';
import { dummmyProducts } from '../../constants/dummyProducts';
import { StorageService } from '../../services/storage/storage.service';

jest.mock('../../services/cart/cart.service');

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let cartServiceMock: jest.Mocked<CartService>;
  let storageServiceMock: jest.Mocked<StorageService>;

  const mockProduct: Product = dummmyProducts[0];

  beforeEach(async () => {
    storageServiceMock = new StorageService() as jest.Mocked<StorageService>;
    cartServiceMock = new CartService(storageServiceMock) as jest.Mocked<CartService>;

    cartServiceMock.itemExistsInCart = jest.fn().mockReturnValue(false);
    cartServiceMock.removeFromCart = jest.fn();
    cartServiceMock.getSubTotal = jest.fn().mockReturnValue(100);

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, MatIconModule],
      providers: [{ provide: CartService, useValue: cartServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product name and price', () => {
    const nameElement = fixture.debugElement.query(By.css('.name')).nativeElement;
    const priceElement = fixture.debugElement.query(By.css('.price')).nativeElement;
    expect(nameElement.textContent).toContain(mockProduct.name);
    expect(priceElement.textContent).toContain(`$${mockProduct.price}`);
  });

  it('should emit addPressed event when add-to-cart button is clicked', () => {
    jest.spyOn(component.addPressed, 'emit');
    const button = fixture.debugElement.query(By.css('.add-to-cart'));
    button.triggerEventHandler('click', null);
    expect(component.addPressed.emit).toHaveBeenCalled();
  });

  it('should emit removePressed event when remove button is clicked', () => {
    jest.spyOn(component.removePressed, 'emit');
    cartServiceMock.itemExistsInCart.mockReturnValue(true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.plus-minus:last-child'));
    button.triggerEventHandler('click', null);
    expect(component.removePressed.emit).toHaveBeenCalled();
  });

  it('should call removeFromCart when remove-item button is clicked', () => {
    component.type = 'cart';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.remove-item'));
    button.triggerEventHandler('click', null);
    expect(cartServiceMock.removeFromCart).toHaveBeenCalledWith(mockProduct.id);
  });
});
