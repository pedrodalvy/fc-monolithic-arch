import { Sequelize } from 'sequelize-typescript';

import ProductModel from './product.model';
import ProductRepository from './product.repository';

describe('ProductRepository integration test', () => {
  let sequelize: Sequelize;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();

    productRepository = new ProductRepository();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should find all products', async () => {
    // Arrange
    await ProductModel.bulkCreate([
      { id: 'product-a', name: 'Product A', description: 'A', salesPrice: 100 },
      { id: 'product-b', name: 'Product B', description: 'B', salesPrice: 200 },
    ]);

    // Act
    const result = await productRepository.findAll();

    // Assert
    expect(result).toHaveLength(2);

    expect(result[0].id.value).toBe('product-a');
    expect(result[0].name).toBe('Product A');
    expect(result[0].description).toBe('A');
    expect(result[0].salesPrice).toBe(100);

    expect(result[1].id.value).toBe('product-b');
    expect(result[1].name).toBe('Product B');
    expect(result[1].description).toBe('B');
    expect(result[1].salesPrice).toBe(200);
  });

  it('should return an empty array if no products are found', async () => {
    // Act
    const result = await productRepository.findAll();

    // Assert
    expect(result).toHaveLength(0);
  });

  it('should find a product', async () => {
    // Arrange
    await ProductModel.bulkCreate([
      { id: 'product-a', name: 'Product A', description: 'A', salesPrice: 100 },
      { id: 'product-b', name: 'Product B', description: 'B', salesPrice: 200 },
    ]);

    // Act
    const result = await productRepository.find('product-a');

    // Assert
    expect(result.id.value).toBe('product-a');
    expect(result.name).toBe('Product A');
    expect(result.description).toBe('A');
    expect(result.salesPrice).toBe(100);
  });

  it('should return undefined if the product is not found', async () => {
    // Act
    const result = await productRepository.find('not-found-id');

    // Assert
    expect(result).toBeUndefined();
  });
});
