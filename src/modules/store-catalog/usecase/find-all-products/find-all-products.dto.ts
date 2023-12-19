interface Product {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}

export interface FindAllProductsResponseDTO {
  products: Product[];
}
