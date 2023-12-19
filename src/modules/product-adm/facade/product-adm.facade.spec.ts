import { randomUUID } from 'node:crypto';

import SequelizeHelper from '../../@shared/test/repository/sequelize.helper';
import Product from '../domain/product.entity';
import ProductAdmFacadeFactory from '../factory/product-adm-facade.factory';
import ProductModel from '../repository/product.model';

describe('ProductAdmFacade integration test', () => {
  beforeEach(async () => {
    await SequelizeHelper.createDatabase([ProductModel]);
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  it('should add a product', async () => {
    // Arrange
    const productAdmFacade = ProductAdmFacadeFactory.create();

    const input = {
      id: randomUUID(),
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    };

    // Act
    await productAdmFacade.addProduct(input);

    // Assert
    const product = await ProductModel.findOne({ where: { id: input.id } });

    expect(product.toJSON()).toStrictEqual({
      id: input.id,
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should check stock', async () => {
    // Arrange
    const productAdmFacade = ProductAdmFacadeFactory.create();

    const product = new Product({
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    });

    await ProductModel.create({
      id: product.id.value,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });

    // Act
    const result = await productAdmFacade.checkStock({ productId: product.id.value });

    // Assert
    expect(result.productId).toBe(product.id.value);
    expect(result.stock).toBe(product.stock);
  });
});
