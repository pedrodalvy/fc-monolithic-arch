import ClientAdmFacadeFactory from '../../client-adm/factory/client-adm-facade.factory';
import InvoiceFacadeFactory from '../../invoice/factory/invoice-facade.factory';
import PaymentFacadeFactory from '../../payment/factory/payment-facade.factory';
import ProductAdmFacadeFactory from '../../product-adm/factory/product-adm-facade.factory';
import StoreCatalogFacadeFactory from '../../store-catalog/factory/store-catalog-facade.factory';
import CheckoutFacade from '../facade/checkout.facade';
import CheckoutFacadeInterface from '../facade/checkout-facade.interface';
import CheckoutRepository from '../repository/checkout.repository';
import FindOrderUseCase from '../usecase/find-order/find-order.usecase';
import PlaceOrderUseCase from '../usecase/place-order/place-order.usecase';

export default class CheckoutFacadeFactory {
  static create(): CheckoutFacadeInterface {
    const checkoutRepository = new CheckoutRepository();
    const findOrderUseCase = new FindOrderUseCase(checkoutRepository);
    const placeOrderUseCase = new PlaceOrderUseCase(
      ClientAdmFacadeFactory.create(),
      ProductAdmFacadeFactory.create(),
      StoreCatalogFacadeFactory.create(),
      PaymentFacadeFactory.create(),
      InvoiceFacadeFactory.create(),
      checkoutRepository,
    );

    return new CheckoutFacade(placeOrderUseCase, findOrderUseCase);
  }
}
