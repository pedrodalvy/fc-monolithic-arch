import { randomUUID } from 'node:crypto';

import request from 'supertest';

import DatabaseConnection from '../../../database/sequelize/database.connection';
import { app } from '../../app';

describe('Client Routes - E2E tests', () => {
  beforeEach(async () => {
    await DatabaseConnection.connect(':memory:');
  });

  afterEach(async () => {
    await DatabaseConnection.disconnect();
  });

  it('should create a client', async () => {
    // Arrange
    const requestBody = {
      id: randomUUID(),
      name: 'Client 1',
      email: 'a@a.com',
      document: '1111111111111',
      street: 'Street 1',
      number: '1',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '11111111',
    };

    // Act
    const { status, body } = await request(app).post('/clients').send(requestBody);

    expect(status).toBe(204);
    expect(body).toEqual({});
  });
});
