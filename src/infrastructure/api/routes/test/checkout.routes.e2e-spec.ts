import { randomUUID } from 'node:crypto';

import request from 'supertest';

import ClientModel from '../../../../modules/client-adm/repository/client.model';
import ProductAdmModel from '../../../../modules/product-adm/repository/product.model';
import ProductStoreCatalogModel from '../../../../modules/store-catalog/repository/product.model';
import DatabaseConnection from '../../../database/sequelize/database.connection';
import { app } from '../../app';

describe('Checkout Routes - E2E tests', () => {
  beforeEach(async () => {
    await DatabaseConnection.connect(':memory:');
  });

  afterEach(async () => {
    await DatabaseConnection.disconnect();
  });

  it('should place an order', async () => {
    // Arrange
    const client = await ClientModel.create({
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

    const product = await ProductAdmModel.create({
      id: randomUUID(),
      name: 'Product Name',
      description: 'Product Description',
      purchasePrice: 200,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductStoreCatalogModel.update({ salesPrice: product.purchasePrice }, { where: { id: product.id } });

    const placeOrderRequestBody = {
      clientId: client.id,
      products: [{ productId: product.id }],
    };

    // Act
    const { status, body } = await request(app).post('/checkout').send(placeOrderRequestBody);

    // Assert
    expect(status).toBe(201);
    expect(body).toEqual({
      id: expect.any(String),
      invoiceId: expect.any(String),
      total: product.purchasePrice,
      status: 'approved',
      products: [{ productId: product.id }],
    });
  });
});
