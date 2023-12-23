import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import { AddClientFacadeInputDTO, FindClientFacadeInputDTO, FindClientFacadeOutputDTO } from './client-adm-facade.dto';
import ClientAdmFacadeInterface from './client-adm-facade.interface';

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  constructor(
    private readonly addClientUseCase: UseCaseInterface<AddClientFacadeInputDTO>,
    private readonly findClientUseCase: UseCaseInterface<FindClientFacadeInputDTO, FindClientFacadeOutputDTO>,
  ) {}

  async addClient(input: AddClientFacadeInputDTO): Promise<void> {
    await this.addClientUseCase.execute(input);
  }

  async findClient(input: FindClientFacadeInputDTO): Promise<FindClientFacadeOutputDTO> {
    return this.findClientUseCase.execute(input);
  }
}
