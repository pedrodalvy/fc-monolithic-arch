import ID from '../../../@shared/domain/value-object/id.value-object';
import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import ClientAdmFacadeInterface from '../../../client-adm/facade/client-adm-facade.interface';
import InvoiceFacadeInterface from '../../../invoice/facade/invoice-facade.interface';
import PaymentFacadeInterface from '../../../payment/facade/payment-facade.interface';
import ProductAdmFacadeInterface from '../../../product-adm/facade/product-adm-facade.interface';
import StoreCatalogFacadeInterface from '../../../store-catalog/facade/store-catalog.facade.interface';
import Client from '../../domain/client.entity';
import Order from '../../domain/order.entity';
import Product from '../../domain/product.entity';
import CheckoutGateway from '../../gateway/checkout.gateway';
import { PlaceOrderInputDTO as InputDTO, PlaceOrderOutputDTO as OutputDTO } from './place-order.dto';

export default class PlaceOrderUseCase implements UseCaseInterface<InputDTO, OutputDTO> {
  constructor(
    private readonly clientFacade: ClientAdmFacadeInterface,
    private readonly productFacade: ProductAdmFacadeInterface,
    private readonly storeCatalogFacade: StoreCatalogFacadeInterface,
    private readonly paymentFacade: PaymentFacadeInterface,
    private readonly invoiceFacade: InvoiceFacadeInterface,
    private readonly checkoutRepository: CheckoutGateway,
  ) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const client = await this.clientFacade.findClient({ id: input.clientId });
    if (!client) throw new Error('Client not found');

    await this._validateProducts(input);

    const orderProducts = await Promise.all(input.products.map(product => this._getProduct(product.productId)));
    const orderClient = new Client({
      id: new ID(client.id),
      name: client.name,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });

    const order = new Order({
      client: orderClient,
      products: orderProducts,
    });

    const payment = await this.paymentFacade.process({
      orderId: order.id.value,
      amount: order.total,
    });

    const invoice =
      payment.status === 'approved'
        ? await this.invoiceFacade.generate({
            name: order.client.name,
            document: '',
            street: '',
            number: '',
            complement: '',
            city: '',
            state: '',
            zipCode: '',
            items: order.products.map(product => ({
              id: product.id.value,
              name: product.name,
              price: product.salesPrice,
            })),
          })
        : undefined;

    payment.status === 'approved' ? order.approved() : order.rejected();
    await this.checkoutRepository.addOrder(order);

    return {
      id: order.id.value,
      invoiceId: invoice?.id,
      status: order.status,
      total: order.total,
      products: order.products.map(product => ({
        productId: product.id.value,
      })),
    };
  }

  private async _validateProducts(input: InputDTO): Promise<void> {
    if (!input.products.length) {
      throw new Error('No products selected');
    }

    for (const product of input.products) {
      const productFound = await this.productFacade.checkStock({ productId: product.productId });
      if (productFound.stock <= 0) {
        throw new Error(`Product ${product.productId} is not available in stock`);
      }
    }
  }

  private async _getProduct(productId: string): Promise<Product> {
    const product = await this.storeCatalogFacade.find({ id: productId });
    if (!product) throw new Error('Product not found');

    return new Product({
      id: new ID(product.id),
      name: product.name,
      salesPrice: product.salesPrice,
    });
  }
}
