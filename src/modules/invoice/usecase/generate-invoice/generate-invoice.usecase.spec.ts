import { mock } from 'jest-mock-extended';

import { InvoiceGateway } from '../../gateway/invoice.gateway';
import { GenerateInvoiceUseCaseInputDTO } from './generate-invoice.dto';
import GenerateInvoiceUseCase from './generate-invoice.usecase';

describe('GenerateInvoiceUseCase unit test', () => {
  const invoiceRepository = mock<InvoiceGateway>();
  const useCase = new GenerateInvoiceUseCase(invoiceRepository);

  it('should generate an invoice', async () => {
    // Arrange
    const input: GenerateInvoiceUseCaseInputDTO = {
      name: 'John Doe',
      document: '12345678910',
      street: 'Street',
      number: '123',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      zipCode: '12345678',
      items: [
        { id: '1', name: 'Item 1', price: 100 },
        { id: '2', name: 'Item 2', price: 200 },
      ],
    };

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(invoiceRepository.save).toHaveBeenCalledTimes(1);

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
      items: [
        { id: input.items[0].id, name: input.items[0].name, price: input.items[0].price },
        { id: input.items[1].id, name: input.items[1].name, price: input.items[1].price },
      ],
      total: 300,
    });
  });
});
