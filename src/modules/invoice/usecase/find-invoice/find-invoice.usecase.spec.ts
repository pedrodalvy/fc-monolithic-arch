import { mock } from 'jest-mock-extended';

import Address from '../../../@shared/domain/value-object/address.value-object';
import Invoice from '../../domain/invoice';
import InvoiceItem from '../../domain/invoice-item';
import { InvoiceGateway } from '../../gateway/invoice.gateway';
import FindInvoiceUseCase from './find-invoice.usecase';

describe('FindInvoiceUseCase unit test', () => {
  const invoiceRepository = mock<InvoiceGateway>();
  const useCase = new FindInvoiceUseCase(invoiceRepository);

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

    invoiceRepository.find.mockResolvedValueOnce(invoice);

    // Act
    const output = await useCase.execute({ id: '1' });

    // Assert
    expect(invoiceRepository.find).toHaveBeenCalledTimes(1);

    expect(output).toStrictEqual({
      id: invoice.id.value,
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
      items: [
        { id: invoice.items[0].id.value, name: invoice.items[0].name, price: invoice.items[0].price },
        { id: invoice.items[1].id.value, name: invoice.items[1].name, price: invoice.items[1].price },
      ],
      total: invoice.total,
      createdAt: invoice.createdAt,
    });
  });

  it('should throw an error when invoice is not found', async () => {
    // Assert
    await expect(useCase.execute({ id: 'not-found' })).rejects.toThrow('Invoice not found');
  });
});
