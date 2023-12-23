import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import { ProcessPaymentFacadeInputDTO, ProcessPaymentFacadeOutputDTO } from './payment-facade.dto';
import PaymentFacadeInterface from './payment-facade.interface';

export default class PaymentFacade implements PaymentFacadeInterface {
  constructor(
    private readonly processPaymentUseCase: UseCaseInterface<
      ProcessPaymentFacadeInputDTO,
      ProcessPaymentFacadeOutputDTO
    >,
  ) {}

  async process(input: ProcessPaymentFacadeInputDTO): Promise<ProcessPaymentFacadeOutputDTO> {
    return this.processPaymentUseCase.execute(input);
  }
}
