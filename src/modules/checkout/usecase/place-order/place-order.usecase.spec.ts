import { mock, MockProxy } from 'jest-mock-extended';

import ClientAdmFacadeInterface from '../../../client-adm/facade/client-adm-facade.interface';
import ProductAdmFacadeInterface from '../../../product-adm/facade/product-adm-facade.interface';
import { PlaceOrderInputDTO } from './place-order.dto';
import PlaceOrderUseCase from './place-order.usecase';

describe('PlaceOrderUseCase unit test', () => {
  let useCase: PlaceOrderUseCase;

  let clientFacade: MockProxy<ClientAdmFacadeInterface>;
  let productFacade: MockProxy<ProductAdmFacadeInterface>;

  let placeOrderInput: PlaceOrderInputDTO;

  beforeEach(() => {
    clientFacade = mock<ClientAdmFacadeInterface>();
    productFacade = mock<ProductAdmFacadeInterface>();

    useCase = new PlaceOrderUseCase(clientFacade, productFacade);

    placeOrderInput = { clientId: 'client-id', products: [{ productId: 'product-id' }] };
  });

  describe('execute method', () => {
    it('should throw an error when client is not found', async () => {
      // Arrange
      clientFacade.findClient.mockResolvedValueOnce(undefined);

      // Assert
      await expect(useCase.execute(placeOrderInput)).rejects.toThrow('Client not found');
    });

    it('should throw an error when products are invalid', async () => {
      // Arrange
      placeOrderInput.products = [];

      clientFacade.findClient.mockResolvedValueOnce(true as any);

      const validateProductsSpy = jest
        .spyOn<any, any>(useCase, '_validateProducts')
        .mockRejectedValueOnce(new Error('An error'));

      // Assert
      await expect(useCase.execute(placeOrderInput)).rejects.toThrow(new Error('An error'));
      expect(validateProductsSpy).toHaveBeenCalled();
    });
  });

  describe('_validateProducts method', () => {
    it('should throw an error if no products are selected', async () => {
      // Arrange
      placeOrderInput.products = [];

      // Assert
      await expect(useCase['_validateProducts'](placeOrderInput)).rejects.toThrow('No products selected');
    });

    it('should throw and error when product is out of stock', async () => {
      // Arrange
      placeOrderInput.products = [{ productId: 'product-id-1' }, { productId: 'product-id-2' }];

      productFacade.checkStock.mockResolvedValueOnce({ productId: 'product-id-1', stock: 1 });
      productFacade.checkStock.mockResolvedValueOnce({ productId: 'product-id-2', stock: 0 });

      // Assert
      await expect(useCase['_validateProducts'](placeOrderInput)).rejects.toThrow(
        'Product product-id-2 is not available in stock',
      );

      expect(productFacade.checkStock).toHaveBeenCalledTimes(2);
      expect(productFacade.checkStock).toHaveBeenNthCalledWith(1, { productId: 'product-id-1' });
      expect(productFacade.checkStock).toHaveBeenNthCalledWith(2, { productId: 'product-id-2' });
    });
  });
});
