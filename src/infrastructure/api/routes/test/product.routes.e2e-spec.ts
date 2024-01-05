import { randomUUID } from 'node:crypto';

import request from 'supertest';

import DatabaseConnection from '../../../database/sequelize/database.connection';
import { app } from '../../app';

describe('Product Routes - E2E tests', () => {
  beforeEach(async () => {
    await DatabaseConnection.connect(':memory:');
  });

  afterEach(async () => {
    await DatabaseConnection.disconnect();
  });

  it('should create a product', async () => {
    // Arrange
    const requestBody = {
      id: randomUUID(),
      name: 'Client 1',
      description: 'Description 1',
      purchasePrice: 100,
      stock: 10,
    };

    // Act
    const { status, body } = await request(app).post('/products').send(requestBody);

    expect(status).toBe(204);
    expect(body).toEqual({});
  });
});
