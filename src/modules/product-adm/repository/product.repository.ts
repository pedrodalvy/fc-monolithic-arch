import Product from '../domain/product.entity';
import ProductGateway from '../gateway/product.gateway';
import ProductModel from './product.model';
import ID from '../../@shared/domain/value-object/id.value-object';

export default class ProductRepository implements ProductGateway {
  async add(product: Product): Promise<void> {
    await ProductModel.create({
      id: product.id.value,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  async find(id: string): Promise<Product | undefined> {
    const product = await ProductModel.findOne({ where: { id } });

    if (!product) {
      return undefined;
    }

    return new Product({
      id: new ID(product.id),
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }
}
