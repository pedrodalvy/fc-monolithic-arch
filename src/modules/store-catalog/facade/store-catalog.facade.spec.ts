import { randomUUID } from 'node:crypto';

import SequelizeHelper from '../../../infrastructure/sequelize/test/sequelize.helper';
import StoreCatalogFacadeFactory from '../factory/store-catalog-facade.factory';
import ProductModel from '../repository/product.model';

describe('StoreCatalogFacade integration test', () => {
  const storeCatalogFacade = StoreCatalogFacadeFactory.create();

  beforeEach(async () => {
    await SequelizeHelper.createDatabase([ProductModel]);
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  it('should find a product', async () => {
    // Arrange
    const productA = { id: randomUUID(), name: 'Product A', description: 'A', salesPrice: 100 };
    const productB = { id: randomUUID(), name: 'Product B', description: 'B', salesPrice: 200 };
    await ProductModel.bulkCreate([productA, productB]);

    // Act
    const result = await storeCatalogFacade.find({ id: productA.id });

    // Assert
    expect(result.id).toBe(productA.id);
    expect(result.name).toBe(productA.name);
    expect(result.description).toBe(productA.description);
    expect(result.salesPrice).toBe(productA.salesPrice);
  });

  it('should find all products', async () => {
    // Arrange
    const productA = { id: randomUUID(), name: 'Product A', description: 'A', salesPrice: 100 };
    const productB = { id: randomUUID(), name: 'Product B', description: 'B', salesPrice: 200 };
    await ProductModel.bulkCreate([productA, productB]);

    // Act
    const result = await storeCatalogFacade.findAll();

    // Assert
    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe(productA.id);
    expect(result.products[0].name).toBe(productA.name);
    expect(result.products[0].description).toBe(productA.description);
    expect(result.products[0].salesPrice).toBe(productA.salesPrice);

    expect(result.products[1].id).toBe(productB.id);
    expect(result.products[1].name).toBe(productB.name);
    expect(result.products[1].description).toBe(productB.description);
    expect(result.products[1].salesPrice).toBe(productB.salesPrice);
  });
});
