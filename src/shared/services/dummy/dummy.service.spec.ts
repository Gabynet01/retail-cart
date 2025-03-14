import { TestBed } from '@angular/core/testing';
import { DummyService } from './dummy.service';
import { dummmyProducts } from '../../constants/dummyProducts';
import { Product } from '../../models/product';
import { search } from '../../helpers/search';

jest.mock('../../helpers/search');

describe('DummyService', () => {
  let service: DummyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DummyService],
    });
    service = TestBed.inject(DummyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProducts', () => {
    it('should return all products when no query is provided', () => {
      expect(service.getAllProducts()).toEqual(dummmyProducts);
    });

    it('should return a filtered list of products when a query is provided', () => {
      const query = 'test';
      const filteredProducts: Product[] = [dummmyProducts[0]];
      (search as jest.Mock).mockReturnValue(filteredProducts);

      expect(service.getAllProducts(query)).toEqual(filteredProducts);
      expect(search).toHaveBeenCalledWith(query, dummmyProducts, [
        'name',
        'price',
        'category',
      ] as any[]);
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', () => {
      expect(service.getProductById(dummmyProducts[0].id)).toEqual(dummmyProducts[0]);
    });

    it('should return undefined if product ID does not exist', () => {
      expect(service.getProductById(999)).toBeUndefined();
    });
  });
});
