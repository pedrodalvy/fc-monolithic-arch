export interface ProcessPaymentFacadeInputDTO {
  orderId: string;
  amount: number;
}

export interface ProcessPaymentFacadeOutputDTO {
  transactionId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
