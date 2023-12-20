export interface FindProductInputDTO {
  id: string;
}

export interface FindProductOutputDTO {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}
