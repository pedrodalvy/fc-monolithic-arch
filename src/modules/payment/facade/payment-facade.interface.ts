import { ProcessPaymentFacadeInputDTO, ProcessPaymentFacadeOutputDTO } from './payment-facade.dto';

export default interface PaymentFacadeInterface {
  process(input: ProcessPaymentFacadeInputDTO): Promise<ProcessPaymentFacadeOutputDTO>;
}
