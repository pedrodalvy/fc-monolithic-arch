import { mock } from 'jest-mock-extended';

import ID from '../../../@shared/domain/value-object/id.value-object';
import Product from '../../domain/product.entity';
import ProductGateway from '../../gateway/product.gateway';
import FindProductUseCase from './find-product.usecase';

describe('FindProductUseCase unit test', () => {
  const productRepository = mock<ProductGateway>();
  const useCase = new FindProductUseCase(productRepository);

  it('should find a product', async () => {
    // Arrange
    const product = new Product({ id: new ID('product-id'), name: 'Any Name', description: 'Any', salesPrice: 100 });

    productRepository.find.mockResolvedValueOnce(product);

    // Act
    const result = await useCase.execute({ id: product.id.value });

    // Assert
    expect(productRepository.find).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(product.id.value);
    expect(result.name).toBe(product.name);
    expect(result.description).toBe(product.description);
    expect(result.salesPrice).toBe(product.salesPrice);
  });

  it('should throw an error when product is not found', async () => {
    // Arrange
    productRepository.find.mockResolvedValueOnce(undefined);

    // Assert
    await expect(useCase.execute({ id: 'product-id' })).rejects.toThrow('Product not found');
  });
});
