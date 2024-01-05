import { randomUUID } from 'node:crypto';

import request from 'supertest';

import InvoiceModel from '../../../../modules/invoice/repository/invoice.model';
import { InvoiceItemModel } from '../../../../modules/invoice/repository/invoice-item.model';
import DatabaseConnection from '../../../database/sequelize/database.connection';
import { app } from '../../app';

describe('Invoice Routes - E2E tests', () => {
  beforeEach(async () => {
    await DatabaseConnection.connect(':memory:');
  });

  afterEach(async () => {
    await DatabaseConnection.disconnect();
  });

  it('should find an invoice', async () => {
    // Arrange
    const invoice = await InvoiceModel.create({
      id: randomUUID(),
      name: 'Client 1',
      document: '11111111111',
      street: 'Street 1',
      number: '1',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '11111111',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const invoiceItem = await InvoiceItemModel.create({
      id: randomUUID(),
      name: 'Product 1',
      price: 100,
      invoiceId: invoice.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const { status, body } = await request(app).get(`/invoice/${invoice.id}`).send();

    // Assert
    expect(status).toBe(200);
    expect(body).toEqual({
      id: invoice.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      },
      items: [
        {
          id: invoiceItem.id,
          name: invoiceItem.name,
          price: invoiceItem.price,
        },
      ],
      total: invoiceItem.price,
      createdAt: invoice.createdAt.toISOString(),
    });
  });
});
