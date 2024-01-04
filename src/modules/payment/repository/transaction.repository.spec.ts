import SequelizeHelper from '../../../infrastructure/database/sequelize/test/sequelize.helper';
import Transaction from '../domain/transaction';
import TransactionModel from './transaction.model';
import TransactionRepository from './transaction.repository';

describe('TransactionRepository integration test', () => {
  let transactionRepository: TransactionRepository;

  beforeEach(async () => {
    await SequelizeHelper.createDatabase([TransactionModel]);
    transactionRepository = new TransactionRepository();
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  it('should save a transaction', async () => {
    // Arrange
    const transaction = new Transaction({ amount: 1, orderId: '1' });

    // Act
    await transactionRepository.save(transaction);

    // Assert
    const transactionDb = await TransactionModel.findOne({ where: { id: transaction.id.value } });

    expect(transactionDb.id).toBe(transaction.id.value);
    expect(transactionDb.amount).toBe(transaction.amount);
    expect(transactionDb.orderId).toBe(transaction.orderId);
    expect(transactionDb.status).toBe(transaction.status);
    expect(transactionDb.createdAt).toBeInstanceOf(Date);
    expect(transactionDb.updatedAt).toBeInstanceOf(Date);
  });
});
