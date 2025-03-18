export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: string;
  rating: {
    rate: number;
    count: number;
  };
}
