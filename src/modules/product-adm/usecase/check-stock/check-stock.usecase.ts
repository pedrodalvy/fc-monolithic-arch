import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import { CheckStockInputDTO as InputDTO, CheckStockOutputDTO as OutputDTO } from './check-stock.dto';
import ProductGateway from '../../gateway/product.gateway';

export default class CheckStockUseCase implements UseCaseInterface<InputDTO, OutputDTO> {
  constructor(private readonly productRepository: ProductGateway) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const product = await this.productRepository.find(input.productId);

    if (!product) {
      throw new Error(`Product with id ${input.productId} not found`);
    }

    return {
      productId: product.id.value,
      stock: product.stock,
    };
  }
}
