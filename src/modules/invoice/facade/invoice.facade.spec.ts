import { randomUUID } from 'node:crypto';

import Address from '../../@shared/domain/value-object/address.value-object';
import SequelizeHelper from '../../@shared/test/repository/sequelize.helper';
import Invoice from '../domain/invoice';
import InvoiceItem from '../domain/invoice-item';
import InvoiceFacadeFactory from '../factory/invoice-facade.factory';
import InvoiceModel from '../repository/invoice.model';
import { InvoiceItemModel } from '../repository/invoice-item.model';

describe('InvoiceFacade integration test', () => {
  const invoiceFacade = InvoiceFacadeFactory.create();

  beforeEach(async () => {
    await SequelizeHelper.createDatabase([InvoiceModel, InvoiceItemModel]);
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  it('should generate an invoice', async () => {
    // Arrange
    const input = {
      name: 'John Doe',
      document: '12345678910',
      street: 'Street',
      number: '123',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      zipCode: '12345678',
      items: [
        { id: randomUUID(), name: 'Item 1', price: 100 },
        { id: randomUUID(), name: 'Item 2', price: 200 },
      ],
    };

    // Act
    const output = await invoiceFacade.generate(input);

    // Assert
    expect(output).toStrictEqual({
      id: expect.any(String),
      name: input.name,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      items: input.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
      total: 300,
    });
  });

  it('should find an invoice', async () => {
    // Arrange
    const invoice = new Invoice({
      name: 'John Doe',
      document: '12345678910',
      address: new Address({
        street: 'Street',
        number: '123',
        complement: 'Complement',
        city: 'City',
        state: 'State',
        zipCode: '12345678',
      }),
      items: [new InvoiceItem({ name: 'Item 1', price: 100 })],
    });

    await InvoiceModel.create(
      {
        id: invoice.id.value,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: [
          {
            id: invoice.items[0].id.value,
            name: invoice.items[0].name,
            price: invoice.items[0].price,
            createdAt: invoice.items[0].createdAt,
            updatedAt: invoice.items[0].updatedAt,
          },
        ],
      },
      { include: [{ model: InvoiceItemModel }] },
    );

    // Act
    const output = await invoiceFacade.find({ id: invoice.id.value });

    // Assert
    expect(output).toStrictEqual({
      id: expect.any(String),
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map(item => ({
        id: item.id.value,
        name: item.name,
        price: item.price,
      })),
      total: 100,
      createdAt: invoice.createdAt,
    });
  });
});
