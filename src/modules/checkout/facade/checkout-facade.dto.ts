export interface PlaceOrderFacadeInputDTO {
  clientId: string;
  products: Array<{ productId: string }>;
}

export interface PlaceOrderFacadeOutputDTO {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: Array<{ productId: string }>;
}

export interface FindOrderFacadeInputDTO {
  id: string;
}

export interface FindOrderFacadeOutputDTO {
  id: string;
  client: {
    id: string;
    name: string;
  };
  products: Array<{
    id: string;
    name: string;
    salesPrice: number;
  }>;
  status: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
