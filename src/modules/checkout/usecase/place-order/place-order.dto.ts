export interface PlaceOrderInputDTO {
  clientId: string;
  products: Array<{ productId: string }>;
}

export interface PlaceOrderOutputDTO {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: Array<{ productId: string }>;
}
