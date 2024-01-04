export interface FindOrderInputDTO {
  id: string;
}

export interface FindOrderOutputDTO {
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
