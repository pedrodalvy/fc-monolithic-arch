import { mock } from 'jest-mock-extended';

import ID from '../../../@shared/domain/value-object/id.value-object';
import Product from '../../domain/product.entity';
import ProductGateway from '../../gateway/product.gateway';
import FindAllProductsUseCase from './find-all-products.usecase';

describe('FindAllProductsUseCase unit test', () => {
  const productRepository = mock<ProductGateway>();
  const useCase = new FindAllProductsUseCase(productRepository);

  it('should get all products', async () => {
    // Arrange
    const productA = new Product({ id: new ID('product-a'), name: 'Product A', description: 'A', salesPrice: 100 });
    const productB = new Product({ id: new ID('product-b'), name: 'Product B', description: 'B', salesPrice: 200 });

    productRepository.findAll.mockResolvedValue([productA, productB]);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(productRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result.products).toHaveLength(2);

    expect(result.products[0].id).toBe(productA.id.value);
    expect(result.products[0].name).toBe(productA.name);
    expect(result.products[0].description).toBe(productA.description);
    expect(result.products[0].salesPrice).toBe(productA.salesPrice);

    expect(result.products[1].id).toBe(productB.id.value);
    expect(result.products[1].name).toBe(productB.name);
    expect(result.products[1].description).toBe(productB.description);
    expect(result.products[1].salesPrice).toBe(productB.salesPrice);
  });
});
