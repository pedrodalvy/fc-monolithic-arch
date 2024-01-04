import { randomUUID } from 'node:crypto';

import SequelizeHelper from '../../../infrastructure/database/sequelize/test/sequelize.helper';
import ID from '../../@shared/domain/value-object/id.value-object';
import ClientModel from '../../client-adm/repository/client.model';
import ProductModel from '../../store-catalog/repository/product.model';
import Client from '../domain/client.entity';
import Order from '../domain/order.entity';
import Product from '../domain/product.entity';
import CheckoutRepository from './checkout.repository';
import OrderModel from './order.model';
import OrderProductModel from './order-product.model';

describe('CheckoutRepository integration test', () => {
  let checkoutRepository: CheckoutRepository;

  beforeEach(async () => {
    await SequelizeHelper.createDatabase([ClientModel, ProductModel, OrderProductModel, OrderModel]);
    checkoutRepository = new CheckoutRepository();
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  describe('addOrder', () => {
    it('should create a order', async () => {
      // Arrange
      const clientID = randomUUID();
      const productID = randomUUID();

      await ClientModel.create({
        id: clientID,
        name: 'Client 1',
        email: 'a@a.com',
        document: '123456789',
        street: 'Street',
        number: '123',
        complement: 'Complement',
        city: 'City',
        state: 'State',
        zipCode: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await ProductModel.create({
        id: productID,
        name: 'Product 1',
        description: 'Description',
        salesPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const order = new Order({
        id: new ID(),
        client: new Client({
          id: new ID(clientID),
          name: 'Client 1',
          document: '123456789',
          street: 'Street',
          number: '123',
          complement: 'Complement',
          city: 'City',
          state: 'State',
          zipCode: '12345678',
        }),
        products: [new Product({ id: new ID(productID), name: 'Product 1', salesPrice: 100 })],
        status: 'approved',
      });

      // Act
      await checkoutRepository.addOrder(order);

      // Assert
      const createdOrderDB = await OrderModel.findOne({
        where: { id: order.id.value },
        include: [{ model: ProductModel }],
      });

      expect(createdOrderDB.toJSON()).toStrictEqual({
        id: order.id.value,
        clientId: order.client.id.value,
        products: [expect.objectContaining({ id: productID })],
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      });
    });
  });

  describe('findOrder', () => {
    it('should find a order', async () => {
      // Arrange
      const clientID = randomUUID();
      const productID = randomUUID();
      const orderID = randomUUID();

      await ClientModel.create({
        id: clientID,
        name: 'Client 1',
        email: 'a@a.com',
        document: '123456789',
        street: 'Street',
        number: '123',
        complement: 'Complement',
        city: 'City',
        state: 'State',
        zipCode: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await ProductModel.create({
        id: productID,
        name: 'Product 1',
        description: 'Description',
        salesPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const orderDB = await OrderModel.create({
        id: orderID,
        clientId: clientID,
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await orderDB.$add('product', productID);

      // Act
      const order = await checkoutRepository.findOrder(orderID);

      // Assert
      expect(order).toBeInstanceOf(Order);
      expect(order.id.value).toBe(orderID);
      expect(order.client.id.value).toBe(clientID);
      expect(order.products).toHaveLength(1);
      expect(order.products[0].id.value).toBe(productID);
    });

    it('should not find a order', async () => {
      // Act
      const order = await checkoutRepository.findOrder(randomUUID());

      // Assert
      expect(order).toBeUndefined();
    });
  });
});
