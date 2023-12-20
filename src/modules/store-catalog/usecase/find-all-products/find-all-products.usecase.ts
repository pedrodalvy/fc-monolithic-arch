import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import ProductGateway from '../../gateway/product.gateway';
import { FindAllProductsOutputDTO as OutputDTO } from './find-all-products.dto';

export default class FindAllProductsUseCase implements UseCaseInterface<never, OutputDTO> {
  constructor(private readonly productRepository: ProductGateway) {}

  async execute(): Promise<OutputDTO> {
    const products = await this.productRepository.findAll();

    return {
      products: products.map(product => ({
        id: product.id.value,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
