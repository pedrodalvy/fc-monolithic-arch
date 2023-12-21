export interface AddClientInputDTO {
  id?: string;
  name: string;
  email: string;
  address: string;
}

export interface AddClientOutputDTO {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
