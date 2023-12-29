import { mock, MockProxy } from 'jest-mock-extended';

import ID from '../../../@shared/domain/value-object/id.value-object';
import ClientAdmFacadeInterface from '../../../client-adm/facade/client-adm-facade.interface';
import ProductAdmFacadeInterface from '../../../product-adm/facade/product-adm-facade.interface';
import StoreCatalogFacadeInterface from '../../../store-catalog/facade/store-catalog.facade.interface';
import Product from '../../domain/product.entity';
import { PlaceOrderInputDTO } from './place-order.dto';
import PlaceOrderUseCase from './place-order.usecase';

describe('PlaceOrderUseCase unit test', () => {
  let useCase: PlaceOrderUseCase;

  let clientFacade: MockProxy<ClientAdmFacadeInterface>;
  let productFacade: MockProxy<ProductAdmFacadeInterface>;
  let storeCatalogFacade: MockProxy<StoreCatalogFacadeInterface>;

  let placeOrderInput: PlaceOrderInputDTO;

  beforeEach(() => {
    clientFacade = mock<ClientAdmFacadeInterface>();
    productFacade = mock<ProductAdmFacadeInterface>();
    storeCatalogFacade = mock<StoreCatalogFacadeInterface>();

    useCase = new PlaceOrderUseCase(clientFacade, productFacade, storeCatalogFacade);

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

    it('should throw an error when product is not found', async () => {
      // Arrange
      clientFacade.findClient.mockResolvedValueOnce(true as any);
      jest.spyOn<any, any>(useCase, '_validateProducts').mockImplementationOnce(jest.fn());

      const getProductSpy = jest.spyOn<any, any>(useCase, '_getProduct').mockRejectedValueOnce(new Error('An error'));

      // Assert
      await expect(useCase.execute(placeOrderInput)).rejects.toThrow(new Error('An error'));
      expect(getProductSpy).toHaveBeenCalled();
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

  describe('_getProduct method', () => {
    it('should throw an error when product is not found', async () => {
      // Arrange
      storeCatalogFacade.find.mockResolvedValueOnce(undefined);

      // Assert
      await expect(useCase['_getProduct']('invalid-id')).rejects.toThrow('Product not found');
    });

    it('should return a product', async () => {
      // Arrange
      storeCatalogFacade.find.mockResolvedValueOnce({
        id: 'product-id',
        name: 'Product 1',
        description: 'Product 1',
        salesPrice: 10,
      });

      // Assert
      const product = await useCase['_getProduct']('product-id');

      expect(storeCatalogFacade.find).toHaveBeenCalledTimes(1);
      expect(product).toEqual(
        new Product({
          id: new ID('product-id'),
          name: 'Product 1',
          description: 'Product 1',
          salesPrice: 10,
        }),
      );
    });
  });
});
