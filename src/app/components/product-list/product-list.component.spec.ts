import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { CartService } from '../../../shared/services/cart/cart.service';
import { ProductService } from '../../../shared/services/product/product.service';
import { SearchService } from '../../../shared/services/search/search.service';
import { DummyService } from '../../../shared/services/dummy/dummy.service';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { dummmyProducts } from '../../../shared/constants/dummyProducts';
import { Product } from '../../../shared/models/product';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

jest.mock('../../../shared/services/product/product.service');
jest.mock('../../../shared/services/cart/cart.service');
jest.mock('../../../shared/services/search/search.service');
jest.mock('../../../shared/services/dummy/dummy.service');

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: jest.Mocked<ProductService>;
  let cartServiceMock: jest.Mocked<CartService>;
  let searchServiceMock: jest.Mocked<SearchService>;
  let dummyServiceMock: jest.Mocked<DummyService>;
  let storageServiceMock: jest.Mocked<StorageService>;

  const mockProducts: Product[] = [...dummmyProducts];

  beforeEach(async () => {
    productServiceMock = new ProductService(
      searchServiceMock,
      dummyServiceMock,
    ) as jest.Mocked<ProductService>;
    cartServiceMock = new CartService(storageServiceMock) as jest.Mocked<CartService>;
    searchServiceMock = new SearchService() as jest.Mocked<SearchService>;
    dummyServiceMock = new DummyService() as jest.Mocked<DummyService>;
    storageServiceMock = new StorageService() as jest.Mocked<StorageService>;

    productServiceMock.getAllProducts.mockReturnValue(mockProducts);
    searchServiceMock.searchValue$ = of('');
    dummyServiceMock.getAllProducts.mockReturnValue(mockProducts);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, ProductCardComponent, NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: DummyService, useValue: dummyServiceMock },
        { provide: StorageService, useValue: storageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Product Display', () => {
    it('should display the initial set of products', () => {
      const productCards = fixture.debugElement.queryAll(By.css('app-product-card'));
      expect(productCards.length).toBe(component['initialLoadCount']);
    });

    it('should load more products when "Load More" button is clicked', () => {
      fixture.debugElement.query(By.css('.load-more-button')).triggerEventHandler('click', null);
      fixture.detectChanges();

      const productCards = fixture.debugElement.queryAll(By.css('app-product-card'));
      expect(productCards.length).toBe(component['initialLoadCount'] + component['loadMoreCount']);
    });
  });

  describe('Cart Operations', () => {
    it('should add a product to the cart when "addPressed" is triggered', () => {
      const productCard = fixture.debugElement.query(By.directive(ProductCardComponent));

      productCard.triggerEventHandler('addPressed', mockProducts[0]);

      expect(cartServiceMock.addToCart).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('should remove a product from the cart when "removePressed" is triggered', () => {
      const productCard = fixture.debugElement.query(By.directive(ProductCardComponent));

      productCard.triggerEventHandler('removePressed', mockProducts[0].id);

      expect(cartServiceMock.removeFromCart).toHaveBeenCalledWith(mockProducts[0].id);
    });
  });
});
