import ID from '../../@shared/domain/value-object/id.value-object';
import Product from '../domain/product.entity';
import ProductGateway from '../gateway/product.gateway';
import ProductModel from './product.model';

export default class ProductRepository implements ProductGateway {
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.findAll();

    return products.map(product => {
      return new Product({
        id: new ID(product.id),
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      });
    });
  }

  async find(id: string): Promise<Product | undefined> {
    const product = await ProductModel.findOne({ where: { id } });

    if (!product) return undefined;

    return new Product({
      id: new ID(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
