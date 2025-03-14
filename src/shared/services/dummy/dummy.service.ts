import { Injectable } from '@angular/core';
import { dummmyProducts } from '../../constants/dummyProducts';
import { Product } from '../../models/product';
import { search } from '../../helpers/search';

@Injectable({
  providedIn: 'root',
})
export class DummyService {
  getAllProducts(query?: string): Product[] {
    return query ? this.searchProducts(query) : dummmyProducts;
  }

  getProductById(id: number): Product | undefined {
    return dummmyProducts.find((product) => product.id === id);
  }

  searchProducts(query: string): Product[] {
    return search(query, dummmyProducts, ['name', 'price', 'category']);
  }
}
