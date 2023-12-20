import SequelizeHelper from '../../@shared/test/repository/sequelize.helper';
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
    await ProductModel.bulkCreate([
      { id: 'product-a', name: 'Product A', description: 'A', salesPrice: 100 },
      { id: 'product-b', name: 'Product B', description: 'B', salesPrice: 200 },
    ]);

    // Act
    const result = await storeCatalogFacade.find({ id: 'product-a' });

    // Assert
    expect(result.id).toBe('product-a');
    expect(result.name).toBe('Product A');
    expect(result.description).toBe('A');
    expect(result.salesPrice).toBe(100);
  });

  it('should find all products', async () => {
    // Arrange
    await ProductModel.bulkCreate([
      { id: 'product-a', name: 'Product A', description: 'A', salesPrice: 100 },
      { id: 'product-b', name: 'Product B', description: 'B', salesPrice: 200 },
    ]);

    // Act
    const result = await storeCatalogFacade.findAll();

    // Assert
    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe('product-a');
    expect(result.products[0].name).toBe('Product A');
    expect(result.products[0].description).toBe('A');
    expect(result.products[0].salesPrice).toBe(100);

    expect(result.products[1].id).toBe('product-b');
    expect(result.products[1].name).toBe('Product B');
    expect(result.products[1].description).toBe('B');
    expect(result.products[1].salesPrice).toBe(200);
  });
});
