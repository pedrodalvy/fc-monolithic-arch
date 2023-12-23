import { ProcessPaymentFacadeInputDTO } from './dto/process-payment-facade-input.dto';
import { ProcessPaymentFacadeOutputDTO } from './dto/process-payment-facade-output.dto';

export default interface PaymentFacadeInterface {
  process(input: ProcessPaymentFacadeInputDTO): Promise<ProcessPaymentFacadeOutputDTO>;
}
