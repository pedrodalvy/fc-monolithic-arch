import {
  FindOrderFacadeInputDTO,
  FindOrderFacadeOutputDTO,
  PlaceOrderFacadeInputDTO,
  PlaceOrderFacadeOutputDTO,
} from './checkout-facade.dto';

export default interface CheckoutFacadeInterface {
  placeOrder(input: PlaceOrderFacadeInputDTO): Promise<PlaceOrderFacadeOutputDTO>;
  findOrder(input: FindOrderFacadeInputDTO): Promise<FindOrderFacadeOutputDTO>;
}
