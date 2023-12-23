import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import { ProcessPaymentFacadeInputDTO } from './dto/process-payment-facade-input.dto';
import { ProcessPaymentFacadeOutputDTO } from './dto/process-payment-facade-output.dto';
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
