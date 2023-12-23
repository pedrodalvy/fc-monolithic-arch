import Transaction from '../domain/transaction';
import PaymentGateway from '../gateway/payment.gateway';
import TransactionModel from './transaction.model';

export default class TransactionRepository implements PaymentGateway {
  async save(transaction: Transaction): Promise<void> {
    await TransactionModel.create({
      id: transaction.id.value,
      amount: transaction.amount,
      orderId: transaction.orderId,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }
}
