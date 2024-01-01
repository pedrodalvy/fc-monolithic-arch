import SequelizeHelper from '../../../infrastructure/sequelize/test/sequelize.helper';
import Address from '../../@shared/domain/value-object/address.value-object';
import Invoice from '../domain/invoice';
import InvoiceItem from '../domain/invoice-item';
import InvoiceModel from './invoice.model';
import InvoiceRepository from './invoice.repository';
import { InvoiceItemModel } from './invoice-item.model';

describe('InvoiceRepository integration test', () => {
  let invoiceRepository: InvoiceRepository;
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
    items: [
      new InvoiceItem({
        name: 'Item 1',
        price: 100,
      }),
      new InvoiceItem({
        name: 'Item 2',
        price: 200,
      }),
    ],
  });

  beforeEach(async () => {
    await SequelizeHelper.createDatabase([InvoiceModel, InvoiceItemModel]);
    invoiceRepository = new InvoiceRepository();
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  it('should save an invoice', async () => {
    // Act
    await invoiceRepository.save(invoice);

    // Assert
    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoice.id.value },
      include: { model: InvoiceItemModel, required: true },
    });

    expect(invoiceDb.id).toEqual(invoice.id.value);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode);
    expect(invoiceDb.createdAt).toEqual(invoice.createdAt);
    expect(invoiceDb.updatedAt).toEqual(invoice.updatedAt);

    expect(invoiceDb.items).toHaveLength(2);
    expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.value);
    expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price);
    expect(invoiceDb.items[1].id).toEqual(invoice.items[1].id.value);
    expect(invoiceDb.items[1].name).toEqual(invoice.items[1].name);
    expect(invoiceDb.items[1].price).toEqual(invoice.items[1].price);
  });

  it('should find an invoice', async () => {
    // Arrange
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
          {
            id: invoice.items[1].id.value,
            name: invoice.items[1].name,
            price: invoice.items[1].price,
            createdAt: invoice.items[1].createdAt,
            updatedAt: invoice.items[1].updatedAt,
          },
        ],
      },
      { include: [{ model: InvoiceItemModel }] },
    );

    // Act
    const output = await invoiceRepository.find(invoice.id.value);

    // Assert
    expect(output).toStrictEqual(invoice);
  });

  it('should return undefined when invoice is not found', async () => {
    // Act
    const result = await invoiceRepository.find('invalid-id');

    // Assert
    expect(result).toBeUndefined();
  });
});
