import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../repository/product.model';
import { randomUUID } from 'node:crypto';
import ProductAdmFacadeFactory from '../factory/product-adm-facade.factory';

describe('ProductAdmFacade integration test', () => {
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
});
