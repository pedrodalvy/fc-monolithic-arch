import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import CheckoutGateway from '../../gateway/checkout.gateway';
import { FindOrderInputDTO as InputDTO, FindOrderOutputDTO as OutputDTO } from './find-order.dto';

export default class FindOrderUseCase implements UseCaseInterface<InputDTO, OutputDTO> {
  constructor(private readonly checkoutRepository: CheckoutGateway) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const order = await this.checkoutRepository.findOrder(input.id);

    if (!order) {
      throw new Error('Order not found');
    }

    return {
      id: order.id.value,
      client: {
        id: order.client.id.value,
        name: order.client.name,
      },
      products: order.products.map(product => ({
        id: product.id.value,
        name: product.name,
        salesPrice: product.salesPrice,
      })),
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
