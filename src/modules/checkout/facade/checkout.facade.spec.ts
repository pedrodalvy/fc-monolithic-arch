import { randomUUID } from 'node:crypto';

import { QueryTypes } from 'sequelize';

import SequelizeHelper from '../../../infrastructure/database/sequelize/test/sequelize.helper';
import ClientModel from '../../client-adm/repository/client.model';
import InvoiceModel from '../../invoice/repository/invoice.model';
import { InvoiceItemModel } from '../../invoice/repository/invoice-item.model';
import TransactionModel from '../../payment/repository/transaction.model';
import ProductAdmModel from '../../product-adm/repository/product.model';
import ProductStoreModel from '../../store-catalog/repository/product.model';
import CheckoutFacadeFactory from '../factory/checkout-facade.factory';
import OrderModel from '../repository/order.model';
import OrderProductModel from '../repository/order-product.model';
import CheckoutFacadeInterface from './checkout-facade.interface';

describe('CheckoutFacade integration test', () => {
  let facade: CheckoutFacadeInterface;

  beforeEach(async () => {
    await SequelizeHelper.createDatabase([
      ClientModel,
      ProductStoreModel,
      ProductAdmModel,
      OrderProductModel,
      OrderModel,
      TransactionModel,
      InvoiceModel,
      InvoiceItemModel,
    ]);

    facade = CheckoutFacadeFactory.create();
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  it('should place an order', async () => {
    // Arrange
    const client = await createClient();
    const product = await createProduct();

    // Act
    const output = await facade.placeOrder({
      clientId: client.id,
      products: [{ productId: product.id }],
    });

    // Assert
    expect(output.invoiceId).toBeDefined();
    expect(output).toStrictEqual({
      id: expect.any(String),
      invoiceId: expect.any(String),
      total: product.salesPrice,
      status: 'approved',
      products: [{ productId: product.id }],
    });
  });

  it('should find an order', async () => {
    // Arrange
    const client = await createClient();
    const product = await createProduct();

    const orderDB = await OrderModel.create({
      id: randomUUID(),
      clientId: client.id,
      status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await orderDB.$add('product', product.id);

    // Act
    const output = await facade.findOrder({ id: orderDB.id });

    // Assert
    expect(output).toStrictEqual({
      id: orderDB.id,
      client: {
        id: client.id,
        name: client.name,
      },
      products: [
        {
          id: product.id,
          name: product.name,
          salesPrice: product.salesPrice,
        },
      ],
      status: orderDB.status,
      total: product.salesPrice,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});

const createClient = async () => {
  return ClientModel.create({
    id: randomUUID(),
    name: 'Client Name',
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
};

const createProduct = async () => {
  const query = `
      INSERT INTO products (id, name, description, salesPrice, purchasePrice, stock, createdAt, updatedAt)
      VALUES (:id, :name, :description, :salesPrice, :purchasePrice, :stock, :createdAt, :updatedAt)
    `;

  const replacements = {
    id: randomUUID(),
    name: 'Product Name',
    description: 'Product Description',
    salesPrice: 300,
    purchasePrice: 200,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await SequelizeHelper.sequelize.query(query, { replacements, type: QueryTypes.INSERT });

  return replacements;
};
