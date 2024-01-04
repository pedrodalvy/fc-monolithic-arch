import SequelizeHelper from '../../../infrastructure/database/sequelize/test/sequelize.helper';
import PaymentFacadeFactory from '../factory/payment-facade.factory';
import TransactionModel from '../repository/transaction.model';

describe('PaymentFacade integration test', () => {
  const paymentFacade = PaymentFacadeFactory.create();

  beforeEach(async () => {
    await SequelizeHelper.createDatabase([TransactionModel]);
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  it('should process a payment', async () => {
    // Arrange
    const input = { orderId: '1', amount: 100 };

    // Act
    const output = await paymentFacade.process(input);

    // Assert
    const transactionDb = await TransactionModel.findOne({
      where: { id: output.transactionId, amount: input.amount, orderId: input.orderId },
    });

    expect(output.transactionId).toEqual(transactionDb.id);
    expect(output.orderId).toEqual(transactionDb.orderId);
    expect(output.amount).toEqual(transactionDb.amount);
    expect(output.status).toEqual(transactionDb.status);
    expect(output.createdAt).toEqual(transactionDb.createdAt);
    expect(output.updatedAt).toEqual(transactionDb.updatedAt);
  });
});
