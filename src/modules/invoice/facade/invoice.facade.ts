import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import {
  FindInvoiceFacadeInputDTO as FindInvoiceInputDTO,
  FindInvoiceFacadeOutputDTO as FindInvoiceOutputDTO,
  GenerateInvoiceFacadeInputDTO as GenerateInvoiceInputDTO,
  GenerateInvoiceFacadeOutputDTO as GenerateInvoiceOutputDTO,
} from './invoice-facade.dto';
import InvoiceFacadeInterface from './invoice-facade.interface';

export default class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(
    private readonly generateInvoiceUseCase: UseCaseInterface<GenerateInvoiceInputDTO, GenerateInvoiceOutputDTO>,
    private readonly findInvoiceUseCase: UseCaseInterface<FindInvoiceInputDTO, FindInvoiceOutputDTO>,
  ) {}

  generate(input: GenerateInvoiceInputDTO): Promise<GenerateInvoiceOutputDTO> {
    return this.generateInvoiceUseCase.execute(input);
  }

  find(input: FindInvoiceInputDTO): Promise<FindInvoiceOutputDTO> {
    return this.findInvoiceUseCase.execute(input);
  }
}
