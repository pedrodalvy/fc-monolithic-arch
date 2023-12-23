import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import Transaction from '../../domain/transaction';
import PaymentGateway from '../../gateway/payment.gateway';
import { ProcessPaymentInputDTO as InputDTO, ProcessPaymentOutputDTO as OutputDTO } from './process-payment.dto';

export default class ProcessPaymentUseCase implements UseCaseInterface<InputDTO, OutputDTO> {
  constructor(private readonly paymentRepository: PaymentGateway) {}

  async execute({ orderId, amount }: InputDTO): Promise<OutputDTO> {
    const transaction = new Transaction({ orderId, amount });
    transaction.process();

    await this.paymentRepository.save(transaction);

    return {
      transactionId: transaction.id.value,
      orderId: transaction.orderId,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}
