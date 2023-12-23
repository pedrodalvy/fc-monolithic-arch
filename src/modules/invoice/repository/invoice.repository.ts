import Address from '../../@shared/domain/value-object/address.value-object';
import ID from '../../@shared/domain/value-object/id.value-object';
import Invoice from '../domain/invoice';
import InvoiceItem from '../domain/invoice-item';
import { InvoiceGateway } from '../gateway/invoice.gateway';
import InvoiceModel from './invoice.model';
import { InvoiceItemModel } from './invoice-item.model';

export default class InvoiceRepository implements InvoiceGateway {
  async save(invoice: Invoice): Promise<void> {
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
        items: invoice.items.map(item => ({
          id: item.id.value,
          name: item.name,
          price: item.price,
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
        })),
      },
      { include: [{ model: InvoiceItemModel }] },
    );
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [{ model: InvoiceItemModel }],
    });

    if (!invoice) return undefined;

    return new Invoice({
      id: new ID(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      }),
      items: invoice.items.map(item => {
        return new InvoiceItem({
          id: new ID(item.id),
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      }),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
}
