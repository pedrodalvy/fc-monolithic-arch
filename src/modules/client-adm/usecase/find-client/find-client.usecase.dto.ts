export interface FindClientInputDTO {
  id: string;
}

export interface FindClientOutputDTO {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
