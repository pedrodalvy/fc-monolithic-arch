export interface ProcessPaymentInputDTO {
  orderId: string;
  amount: number;
}

export interface ProcessPaymentOutputDTO {
  transactionId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
