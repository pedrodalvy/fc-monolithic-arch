import ID from '../../@shared/domain/value-object/id.value-object';
import SequelizeHelper from '../../@shared/test/repository/sequelize.helper';
import Product from '../domain/product.entity';
import ProductGateway from '../gateway/product.gateway';
import ProductModel from './product.model';
import ProductRepository from './product.repository';

describe('ProductRepository integration test', () => {
  let productRepository: ProductGateway;

  beforeEach(async () => {
    await SequelizeHelper.createDatabase([ProductModel]);
    productRepository = new ProductRepository();
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  it('should create a product', async () => {
    // Arrange
    const product = new Product({
      id: new ID(),
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    });

    // Act
    await productRepository.add(product);

    // Assert
    const createdProductDB = await ProductModel.findOne({ where: { id: product.id.value } });

    expect(createdProductDB.toJSON()).toStrictEqual({
      id: product.id.value,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  });

  it('should find a product', async () => {
    // Arrange
    const product = new Product({
      id: new ID(),
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    });

    await productRepository.add(product);

    // Act
    const result = await productRepository.find(product.id.value);

    // Assert
    expect(result).toStrictEqual(product);
  });

  it('should return undefined when product is not found', async () => {
    // Act
    const result = await productRepository.find('not-found-id');

    // Assert
    expect(result).toBeUndefined();
  });
});
