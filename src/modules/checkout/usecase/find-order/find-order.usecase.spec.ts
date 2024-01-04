import { mock, MockProxy } from 'jest-mock-extended';

import ID from '../../../@shared/domain/value-object/id.value-object';
import Client from '../../domain/client.entity';
import Order from '../../domain/order.entity';
import Product from '../../domain/product.entity';
import CheckoutGateway from '../../gateway/checkout.gateway';
import FindOrderUseCase from './find-order.usecase';

describe('FindOrderUseCase unit test', () => {
  let useCase: FindOrderUseCase;
  let checkoutRepository: MockProxy<CheckoutGateway>;

  beforeEach(() => {
    checkoutRepository = mock<CheckoutGateway>();
    useCase = new FindOrderUseCase(checkoutRepository);
  });

  it('should throw an error when order is not found', async () => {
    // Arrange
    checkoutRepository.findOrder.mockResolvedValueOnce(undefined);

    // Assert
    await expect(useCase.execute({ id: 'order-id' })).rejects.toThrow('Order not found');
  });

  it('should return an order', async () => {
    // Arrange
    const client = new Client({
      id: new ID(),
      name: 'client-name',
      document: 'client-document',
      street: 'client-street',
      number: 'client-number',
      complement: 'client-complement',
      city: 'client-city',
      state: 'client-state',
      zipCode: 'client-zipcode',
    });

    const products = [
      new Product({ id: new ID(), name: 'product-a', salesPrice: 10 }),
      new Product({ id: new ID(), name: 'product-b', salesPrice: 20 }),
    ];

    const order = new Order({
      id: new ID(),
      client,
      products,
      status: 'approved',
    });

    checkoutRepository.findOrder.mockResolvedValueOnce(order);

    // Act
    const output = await useCase.execute({ id: order.id.value });

    // Assert
    expect(checkoutRepository.findOrder).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: order.id.value,
      client: {
        id: client.id.value,
        name: client.name,
      },
      products: products.map(product => ({
        id: product.id.value,
        name: product.name,
        salesPrice: product.salesPrice,
      })),
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  });
});
