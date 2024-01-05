import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import {
  FindOrderFacadeInputDTO,
  FindOrderFacadeOutputDTO,
  PlaceOrderFacadeInputDTO,
  PlaceOrderFacadeOutputDTO,
} from './checkout-facade.dto';
import CheckoutFacadeInterface from './checkout-facade.interface';

export default class CheckoutFacade implements CheckoutFacadeInterface {
  constructor(
    private readonly placeOrderUseCase: UseCaseInterface<PlaceOrderFacadeInputDTO, PlaceOrderFacadeOutputDTO>,
    private readonly findOrderUseCase: UseCaseInterface<FindOrderFacadeInputDTO, FindOrderFacadeOutputDTO>,
  ) {}

  placeOrder(input: PlaceOrderFacadeInputDTO): Promise<PlaceOrderFacadeOutputDTO> {
    return this.placeOrderUseCase.execute(input);
  }

  findOrder(input: FindOrderFacadeInputDTO): Promise<FindOrderFacadeOutputDTO> {
    return this.findOrderUseCase.execute(input);
  }
}
