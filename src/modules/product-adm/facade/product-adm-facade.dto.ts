export interface AddProductFacadeInputDTO {
  id?: string;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
}

export interface CheckStockFacadeInputDTO {
  productId: string;
}

export interface CheckStockFacadeOutputDTO {
  productId: string;
  stock: number;
}
