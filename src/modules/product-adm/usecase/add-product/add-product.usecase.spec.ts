import { mock } from 'jest-mock-extended';

import ProductGateway from '../../gateway/product.gateway';
import AddProductUseCase from './add-product.usecase';

describe('AddProductUseCase unit test', () => {
  const productRepository = mock<ProductGateway>();
  const useCase = new AddProductUseCase(productRepository);

  it('should add a product', async () => {
    // Arrange
    const input = {
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(productRepository.add).toHaveBeenCalled();
    expect(result).toEqual({
      id: expect.any(String),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
