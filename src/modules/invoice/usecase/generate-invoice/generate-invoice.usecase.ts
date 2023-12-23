import Address from '../../../@shared/domain/value-object/address.value-object';
import ID from '../../../@shared/domain/value-object/id.value-object';
import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import Invoice from '../../domain/invoice';
import InvoiceItem from '../../domain/invoice-item';
import { InvoiceGateway } from '../../gateway/invoice.gateway';
import {
  GenerateInvoiceUseCaseInputDTO as InputDTO,
  GenerateInvoiceUseCaseOutputDTO as OutputDTO,
} from './generate-invoice.dto';

export default class GenerateInvoiceUseCase implements UseCaseInterface<InputDTO, OutputDTO> {
  constructor(private readonly invoiceRepository: InvoiceGateway) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const items = input.items.map(item => {
      return new InvoiceItem({
        id: new ID(item.id),
        name: item.name,
        price: item.price,
      });
    });

    const address = new Address({
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
    });

    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address,
      items,
    });

    await this.invoiceRepository.save(invoice);

    return {
      id: invoice.id.value,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map(item => ({
        id: item.id.value,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total,
    };
  }
}
