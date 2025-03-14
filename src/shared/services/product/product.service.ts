import { Injectable } from '@angular/core';
import { Product } from '../../models/product';
import { SearchService } from '../search/search.service';
import { DummyService } from '../dummy/dummy.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private endpoint = 'products';
  constructor(
    private searchService: SearchService,
    private dummyService: DummyService,
  ) {}

  getAllProducts(): Product[] {
    const search = this.searchService.getSearchValue().trim();
    return search !== ''
      ? this.dummyService.getAllProducts(search)
      : this.dummyService.getAllProducts();
  }

  getSingleProduct(id: Product['id']): Product | null {
    const item = this.dummyService.getProductById(id);
    return item ? item : null;
  }
}
