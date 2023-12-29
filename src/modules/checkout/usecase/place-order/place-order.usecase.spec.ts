import { mock, MockProxy } from 'jest-mock-extended';

import ID from '../../../@shared/domain/value-object/id.value-object';
import { FindClientFacadeOutputDTO } from '../../../client-adm/facade/client-adm-facade.dto';
import ClientAdmFacadeInterface from '../../../client-adm/facade/client-adm-facade.interface';
import InvoiceFacadeInterface from '../../../invoice/facade/invoice-facade.interface';
import { ProcessPaymentFacadeOutputDTO } from '../../../payment/facade/payment-facade.dto';
import PaymentFacadeInterface from '../../../payment/facade/payment-facade.interface';
import ProductAdmFacadeInterface from '../../../product-adm/facade/product-adm-facade.interface';
import { FindProductFacadeOutputDTO } from '../../../store-catalog/facade/store-catalog.facade.dto';
import StoreCatalogFacadeInterface from '../../../store-catalog/facade/store-catalog.facade.interface';
import Product from '../../domain/product.entity';
import CheckoutGateway from '../../gateway/checkout.gateway';
import { PlaceOrderInputDTO } from './place-order.dto';
import PlaceOrderUseCase from './place-order.usecase';

describe('PlaceOrderUseCase unit test', () => {
  let useCase: PlaceOrderUseCase;

  let clientFacade: MockProxy<ClientAdmFacadeInterface>;
  let productFacade: MockProxy<ProductAdmFacadeInterface>;
  let storeCatalogFacade: MockProxy<StoreCatalogFacadeInterface>;
  let paymentFacade: MockProxy<PaymentFacadeInterface>;
  let invoiceFacade: MockProxy<InvoiceFacadeInterface>;
  let checkoutRepository: MockProxy<CheckoutGateway>;

  let placeOrderInput: PlaceOrderInputDTO;

  const mockDate = new Date(2000, 1, 1);

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    clientFacade = mock<ClientAdmFacadeInterface>();
    productFacade = mock<ProductAdmFacadeInterface>();
    storeCatalogFacade = mock<StoreCatalogFacadeInterface>();
    paymentFacade = mock<PaymentFacadeInterface>();
    invoiceFacade = mock<InvoiceFacadeInterface>();
    checkoutRepository = mock<CheckoutGateway>();

    useCase = new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      storeCatalogFacade,
      paymentFacade,
      invoiceFacade,
      checkoutRepository,
    );

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

    it('should not generate an invoice when payment is not approved', async () => {
      // Arrange
      const client: FindClientFacadeOutputDTO = {
        id: 'client-id',
        name: 'client-name',
        email: 'client-email',
        address: 'client-address',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const products: FindProductFacadeOutputDTO[] = [
        { id: 'id-1', name: 'name-1', description: 'description-1', salesPrice: 10 },
        { id: 'id-2', name: 'name-2', description: 'description-2', salesPrice: 20 },
      ];

      const payment: ProcessPaymentFacadeOutputDTO = {
        status: 'rejected',
        orderId: 'order-id',
        transactionId: 'transaction-id',
        amount: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn<any, any>(useCase, '_validateProducts').mockImplementationOnce(jest.fn());

      clientFacade.findClient.mockResolvedValueOnce(client);
      storeCatalogFacade.find.mockResolvedValueOnce(products[0]);
      storeCatalogFacade.find.mockResolvedValueOnce(products[1]);
      paymentFacade.process.mockResolvedValueOnce(payment);

      placeOrderInput.products = [{ productId: 'id-1' }, { productId: 'id-2' }];

      // Act
      const output = await useCase.execute(placeOrderInput);

      // Assert
      expect(output).toStrictEqual({
        id: expect.any(String),
        invoiceId: undefined,
        status: 'rejected',
        total: 30,
        products: [{ productId: 'id-1' }, { productId: 'id-2' }],
      });

      expect(clientFacade.findClient).toHaveBeenCalledTimes(1);
      expect(clientFacade.findClient).toHaveBeenCalledWith({ id: 'client-id' });

      expect(storeCatalogFacade.find).toHaveBeenCalledTimes(2);
      expect(storeCatalogFacade.find).toHaveBeenCalledWith({ id: 'id-1' });
      expect(storeCatalogFacade.find).toHaveBeenCalledWith({ id: 'id-2' });

      expect(paymentFacade.process).toHaveBeenCalledTimes(1);
      expect(paymentFacade.process).toHaveBeenCalledWith({ amount: 30, orderId: expect.any(String) });

      expect(checkoutRepository.addOrder).toHaveBeenCalledTimes(1);

      expect(invoiceFacade.generate).not.toHaveBeenCalled();
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
