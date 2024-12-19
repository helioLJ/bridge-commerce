export interface Product {
  id: number;
  name: string;
  price: number;
  featured: boolean;
}

export interface Order {
  id: number;
  status: string;
  total: number;
} 