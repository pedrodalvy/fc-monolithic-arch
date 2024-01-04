import { randomUUID } from 'node:crypto';

import SequelizeHelper from '../../../infrastructure/database/sequelize/test/sequelize.helper';
import ProductModel from './product.model';
import ProductRepository from './product.repository';

describe('ProductRepository integration test', () => {
  let productRepository: ProductRepository;

  beforeEach(async () => {
    await SequelizeHelper.createDatabase([ProductModel]);
    productRepository = new ProductRepository();
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  it('should find all products', async () => {
    // Arrange
    const productA = { id: randomUUID(), name: 'Product A', description: 'A', salesPrice: 100 };
    const productB = { id: randomUUID(), name: 'Product B', description: 'B', salesPrice: 200 };
    await ProductModel.bulkCreate([productA, productB]);

    // Act
    const result = await productRepository.findAll();

    // Assert
    expect(result).toHaveLength(2);

    expect(result[0].id.value).toBe(productA.id);
    expect(result[0].name).toBe(productA.name);
    expect(result[0].description).toBe(productA.description);
    expect(result[0].salesPrice).toBe(productA.salesPrice);

    expect(result[1].id.value).toBe(productB.id);
    expect(result[1].name).toBe(productB.name);
    expect(result[1].description).toBe(productB.description);
    expect(result[1].salesPrice).toBe(productB.salesPrice);
  });

  it('should return an empty array if no products are found', async () => {
    // Act
    const result = await productRepository.findAll();

    // Assert
    expect(result).toHaveLength(0);
  });

  it('should find a product', async () => {
    // Arrange
    const productA = { id: randomUUID(), name: 'Product A', description: 'A', salesPrice: 100 };
    const productB = { id: randomUUID(), name: 'Product B', description: 'B', salesPrice: 200 };
    await ProductModel.bulkCreate([productA, productB]);

    // Act
    const result = await productRepository.find(productA.id);

    // Assert
    expect(result.id.value).toBe(productA.id);
    expect(result.name).toBe(productA.name);
    expect(result.description).toBe(productA.description);
    expect(result.salesPrice).toBe(productA.salesPrice);
  });

  it('should return undefined if the product is not found', async () => {
    // Act
    const result = await productRepository.find('not-found-id');

    // Assert
    expect(result).toBeUndefined();
  });
});
