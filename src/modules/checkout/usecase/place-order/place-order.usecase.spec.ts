import { mock, MockProxy } from 'jest-mock-extended';

import ID from '../../../@shared/domain/value-object/id.value-object';
import ClientAdmFacadeInterface from '../../../client-adm/facade/client-adm-facade.interface';
import InvoiceFacadeInterface from '../../../invoice/facade/invoice-facade.interface';
import PaymentFacadeInterface from '../../../payment/facade/payment-facade.interface';
import ProductAdmFacadeInterface from '../../../product-adm/facade/product-adm-facade.interface';
import StoreCatalogFacadeInterface from '../../../store-catalog/facade/store-catalog.facade.interface';
import Product from '../../domain/product.entity';
import CheckoutGateway from '../../gateway/checkout.gateway';
import {
  findClientFacadeMock,
  findProductFacadeMock,
  generateInvoiceFacadeMock,
  processPaymentFacadeMock,
} from './mock/place-order.mock';
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

    it('should place a rejected order', async () => {
      // Arrange
      const client = findClientFacadeMock();
      const products = findProductFacadeMock();
      const payment = processPaymentFacadeMock('rejected');

      jest.spyOn<any, any>(useCase, '_validateProducts').mockImplementationOnce(jest.fn());

      clientFacade.findClient.mockResolvedValueOnce(client);
      storeCatalogFacade.find.mockResolvedValueOnce(products[0]);
      storeCatalogFacade.find.mockResolvedValueOnce(products[1]);
      paymentFacade.process.mockResolvedValueOnce(payment);

      placeOrderInput.products = [{ productId: products[0].id }, { productId: products[1].id }];

      // Act
      const output = await useCase.execute(placeOrderInput);

      // Assert
      expect(output).toStrictEqual({
        id: expect.any(String),
        invoiceId: undefined,
        status: 'rejected',
        total: payment.amount,
        products: [{ productId: products[0].id }, { productId: products[1].id }],
      });

      expect(clientFacade.findClient).toHaveBeenCalledTimes(1);
      expect(clientFacade.findClient).toHaveBeenCalledWith({ id: client.id });

      expect(storeCatalogFacade.find).toHaveBeenCalledTimes(2);
      expect(storeCatalogFacade.find).toHaveBeenCalledWith({ id: products[0].id });
      expect(storeCatalogFacade.find).toHaveBeenCalledWith({ id: products[1].id });

      expect(paymentFacade.process).toHaveBeenCalledTimes(1);
      expect(paymentFacade.process).toHaveBeenCalledWith({ amount: payment.amount, orderId: expect.any(String) });

      expect(checkoutRepository.addOrder).toHaveBeenCalledTimes(1);

      expect(invoiceFacade.generate).not.toHaveBeenCalled();
    });

    it('should place an approved order', async () => {
      // Arrange
      const client = findClientFacadeMock();
      const products = findProductFacadeMock();
      const payment = processPaymentFacadeMock('approved');
      const invoice = generateInvoiceFacadeMock();

      jest.spyOn<any, any>(useCase, '_validateProducts').mockImplementationOnce(jest.fn());

      clientFacade.findClient.mockResolvedValueOnce(client);
      storeCatalogFacade.find.mockResolvedValueOnce(products[0]);
      storeCatalogFacade.find.mockResolvedValueOnce(products[1]);
      paymentFacade.process.mockResolvedValueOnce(payment);
      invoiceFacade.generate.mockResolvedValueOnce(invoice);

      placeOrderInput.products = [{ productId: products[0].id }, { productId: products[1].id }];

      // Act
      const output = await useCase.execute(placeOrderInput);

      expect(output).toStrictEqual({
        id: expect.any(String),
        invoiceId: invoice.id,
        status: 'approved',
        total: payment.amount,
        products: [{ productId: products[0].id }, { productId: products[1].id }],
      });

      expect(clientFacade.findClient).toHaveBeenCalledTimes(1);
      expect(clientFacade.findClient).toHaveBeenCalledWith({ id: client.id });

      expect(storeCatalogFacade.find).toHaveBeenCalledTimes(2);
      expect(storeCatalogFacade.find).toHaveBeenCalledWith({ id: products[0].id });
      expect(storeCatalogFacade.find).toHaveBeenCalledWith({ id: products[1].id });

      expect(paymentFacade.process).toHaveBeenCalledTimes(1);
      expect(paymentFacade.process).toHaveBeenCalledWith({ amount: payment.amount, orderId: expect.any(String) });

      expect(checkoutRepository.addOrder).toHaveBeenCalledTimes(1);

      expect(invoiceFacade.generate).toHaveBeenCalledTimes(1);
      expect(invoiceFacade.generate).toHaveBeenCalledWith({
        name: client.name,
        document: '',
        street: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        zipCode: '',
        items: [
          {
            id: products[0].id,
            name: products[0].name,
            price: products[0].salesPrice,
          },
          {
            id: products[1].id,
            name: products[1].name,
            price: products[1].salesPrice,
          },
        ],
      });
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

    it('should not throw an error when products are valid', async () => {
      // Arrange
      placeOrderInput.products = [{ productId: 'product-id-1' }, { productId: 'product-id-2' }];

      productFacade.checkStock.mockResolvedValueOnce({ productId: 'product-id-1', stock: 1 });
      productFacade.checkStock.mockResolvedValueOnce({ productId: 'product-id-2', stock: 1 });

      // Assert
      await expect(useCase['_validateProducts'](placeOrderInput)).resolves.not.toThrow();
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
          salesPrice: 10,
        }),
      );
    });
  });
});
