import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import { InvoiceGateway } from '../../gateway/invoice.gateway';
import { FindInvoiceUseCaseInputDTO as InputDTO, FindInvoiceUseCaseOutputDTO as OutputDTO } from './find-invoice.dto';

export default class FindInvoiceUseCase implements UseCaseInterface<InputDTO, OutputDTO> {
  constructor(private readonly invoiceRepository: InvoiceGateway) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const invoice = await this.invoiceRepository.find(input.id);

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return {
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
      items: invoice.items.map(item => ({
        id: item.id.value,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total,
      createdAt: invoice.createdAt,
    };
  }
}
