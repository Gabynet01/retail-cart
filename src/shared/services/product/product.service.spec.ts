import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { SearchService } from '../search/search.service';
import { DummyService } from '../dummy/dummy.service';
import { dummmyProducts } from '../../constants/dummyProducts';
import { Product } from '../../models/product';

jest.mock('../search/search.service');
jest.mock('../dummy/dummy.service');

describe('ProductService', () => {
  let service: ProductService;
  let searchService: jest.Mocked<SearchService>;
  let dummyService: jest.Mocked<DummyService>;

  beforeEach(() => {
    searchService = new SearchService() as jest.Mocked<SearchService>;
    dummyService = new DummyService() as jest.Mocked<DummyService>;

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: SearchService, useValue: searchService },
        { provide: DummyService, useValue: dummyService },
      ],
    });

    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProducts', () => {
    it('should return all products when search value is empty', () => {
      searchService.getSearchValue.mockReturnValue('');
      dummyService.getAllProducts.mockReturnValue(dummmyProducts);

      expect(service.getAllProducts()).toEqual(dummmyProducts);
      expect(dummyService.getAllProducts).toHaveBeenCalledWith();
    });

    it('should return filtered products when search value is provided', () => {
      const query = 'test';
      const filteredProducts: Product[] = [dummmyProducts[0]];
      searchService.getSearchValue.mockReturnValue(query);
      dummyService.getAllProducts.mockReturnValue(filteredProducts);

      expect(service.getAllProducts()).toEqual(filteredProducts);
      expect(dummyService.getAllProducts).toHaveBeenCalledWith(query);
    });
  });

  describe('getSingleProduct', () => {
    it('should return a single product by ID', () => {
      const productId = dummmyProducts[0].id;
      dummyService.getProductById.mockReturnValue(dummmyProducts[0]);

      expect(service.getSingleProduct(productId)).toEqual(dummmyProducts[0]);
      expect(dummyService.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should return null if product ID does not exist', () => {
      dummyService.getProductById.mockReturnValue(undefined);

      expect(service.getSingleProduct(999)).toBeNull();
      expect(dummyService.getProductById).toHaveBeenCalledWith(999);
    });
  });
});
