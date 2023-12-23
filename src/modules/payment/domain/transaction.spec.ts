import ID from '../../@shared/domain/value-object/id.value-object';
import Transaction from './transaction';

describe('Transaction unit test', () => {
  it('should create transaction', () => {
    // Act
    const transaction = new Transaction({ amount: 1, orderId: '1' });

    // Assert
    expect(transaction.id).toBeInstanceOf(ID);
    expect(transaction.amount).toBe(1);
    expect(transaction.orderId).toBe('1');
    expect(transaction.status).toBe('pending');
    expect(transaction.createdAt).toBeInstanceOf(Date);
    expect(transaction.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a transaction with a custom status', () => {
    // Act
    const transaction = new Transaction({ amount: 1, orderId: '1', status: 'other' });

    // Assert
    expect(transaction.status).toBe('other');
  });

  it('should throw error when amount is less than zero', () => {
    // Assert
    expect(() => new Transaction({ amount: -1, orderId: '1' })).toThrow('Transaction amount must be greater than zero');
  });

  it('should throw error when order id is empty', () => {
    // Assert
    expect(() => new Transaction({ amount: 1, orderId: '' })).toThrow('Transaction order id is required');
  });

  it('should approve transaction', () => {
    // Arrange
    const transaction = new Transaction({ amount: 1, orderId: '1' });

    // Act
    transaction.approve();

    // Assert
    expect(transaction.status).toBe('approved');
  });

  it('should decline transaction', () => {
    // Arrange
    const transaction = new Transaction({ amount: 1, orderId: '1' });

    // Act
    transaction.decline();

    // Assert
    expect(transaction.status).toBe('declined');
  });

  it('should approve when process a transaction', () => {
    // Arrange
    const transaction = new Transaction({ amount: 100, orderId: '1' });

    // Act
    transaction.process();

    // Assert
    expect(transaction.status).toBe('approved');
  });

  it('should decline when process a transaction', () => {
    // Arrange
    const transaction = new Transaction({ amount: 99, orderId: '1' });

    // Act
    transaction.process();

    // Assert
    expect(transaction.status).toBe('declined');
  });
});
