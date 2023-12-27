import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import ClientAdmFacadeInterface from '../../../client-adm/facade/client-adm-facade.interface';
import ProductAdmFacadeInterface from '../../../product-adm/facade/product-adm-facade.interface';
import { PlaceOrderInputDTO as InputDTO, PlaceOrderOutputDTO as OutputDTO } from './place-order.dto';

export default class PlaceOrderUseCase implements UseCaseInterface<InputDTO, OutputDTO> {
  constructor(
    private readonly clientFacade: ClientAdmFacadeInterface,
    private readonly productFacade: ProductAdmFacadeInterface,
  ) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const client = await this.clientFacade.findClient({ id: input.clientId });
    if (!client) throw new Error('Client not found');

    await this._validateProducts(input);

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
}
