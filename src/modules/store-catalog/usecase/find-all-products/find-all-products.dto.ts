interface Product {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}

export interface FindAllProductsOutputDTO {
  products: Product[];
}
