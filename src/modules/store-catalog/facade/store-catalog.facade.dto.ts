export interface FindAllProductsFacadeOutputDTO {
  products: Array<{
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }>;
}

export interface FindProductFacadeInputDTO {
  id: string;
}

export interface FindProductFacadeOutputDTO {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}
