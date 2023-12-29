import ID from '../../../@shared/domain/value-object/id.value-object';
import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import ClientAdmFacadeInterface from '../../../client-adm/facade/client-adm-facade.interface';
import ProductAdmFacadeInterface from '../../../product-adm/facade/product-adm-facade.interface';
import StoreCatalogFacadeInterface from '../../../store-catalog/facade/store-catalog.facade.interface';
import Product from '../../domain/product.entity';
import { PlaceOrderInputDTO as InputDTO, PlaceOrderOutputDTO as OutputDTO } from './place-order.dto';

export default class PlaceOrderUseCase implements UseCaseInterface<InputDTO, OutputDTO> {
  constructor(
    private readonly clientFacade: ClientAdmFacadeInterface,
    private readonly productFacade: ProductAdmFacadeInterface,
    private readonly storeCatalogFacade: StoreCatalogFacadeInterface,
  ) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const client = await this.clientFacade.findClient({ id: input.clientId });
    if (!client) throw new Error('Client not found');

    await this._validateProducts(input);

    const orderProducts = await Promise.all(input.products.map(product => this._getProduct(product.productId)));

    return undefined;
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
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
