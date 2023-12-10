import { AddProductInputDTO, AddProductOutputDTO } from './add-product.dto';
import ProductGateway from '../../gateway/product.gateway';
import Product from '../../domain/product.entity';
import ID from '../../../@shared/domain/value-object/id.value-object';

export default class AddProductUseCase {
  constructor(private readonly productRepository: ProductGateway) {}

  async execute(input: AddProductInputDTO): Promise<AddProductOutputDTO> {
    const product = new Product({
      id: new ID(input.id),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    });

    await this.productRepository.add(product);

    return {
      id: product.id.value,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
