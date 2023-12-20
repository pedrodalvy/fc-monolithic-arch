import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import ProductGateway from '../../gateway/product.gateway';
import { FindProductInputDTO as InputDTO, FindProductOutputDTO as OutputDTO } from './find-product.dto';

export default class FindProductUseCase implements UseCaseInterface<InputDTO, OutputDTO> {
  constructor(private readonly productRepository: ProductGateway) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const product = await this.productRepository.find(input.id);

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      id: product.id.value,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}
