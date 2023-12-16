import { mock } from 'jest-mock-extended';
import ProductGateway from '../../gateway/product.gateway';
import CheckStockUseCase from './check-stock.usecase';
import Product from '../../domain/product.entity';

describe('CheckStockUseCase unit test', () => {
  const productRepository = mock<ProductGateway>();
  const useCase = new CheckStockUseCase(productRepository);

  it('should check stock', async () => {
    // Arrange
    const product = new Product({
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    });

    productRepository.find.mockResolvedValue(product);

    // Act
    const result = await useCase.execute({ productId: product.id.value });

    // Assert
    expect(result.productId).toBe(product.id.value);
    expect(result.stock).toBe(product.stock);
  });

  it('should throw an error when product is not found', async () => {
    // Arrange
    productRepository.find.mockResolvedValue(undefined);

    // Assert
    await expect(useCase.execute({ productId: 'any-id' })).rejects.toThrow('Product with id any-id not found');
  });
});
