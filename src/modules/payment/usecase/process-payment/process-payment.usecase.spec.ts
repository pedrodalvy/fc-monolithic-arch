import { mock } from 'jest-mock-extended';

import PaymentGateway from '../../gateway/payment.gateway';
import ProcessPaymentUseCase from './process-payment.usecase';

describe('ProcessPaymentUseCase unit test', () => {
  const paymentRepository = mock<PaymentGateway>();
  const useCase = new ProcessPaymentUseCase(paymentRepository);

  it('should process a payment', async () => {
    // Arrange
    const input = { orderId: '1', amount: 100 };

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(paymentRepository.save).toHaveBeenCalledTimes(1);
    expect(output.transactionId).toEqual(expect.any(String));
    expect(output.orderId).toEqual(input.orderId);
    expect(output.amount).toEqual(input.amount);
    expect(output.status).toEqual('approved');
    expect(output.createdAt).toEqual(expect.any(Date));
    expect(output.updatedAt).toEqual(expect.any(Date));
  });
});
