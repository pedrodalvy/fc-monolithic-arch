import { Sequelize } from 'sequelize-typescript';
import ProductModel from './product.model';
import Product from '../domain/product.entity';
import ID from '../../@shared/domain/value-object/id.value-object';
import ProductRepository from './product.repository';

describe('ProductRepository integration test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
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

    const productRepository = new ProductRepository();

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
});
