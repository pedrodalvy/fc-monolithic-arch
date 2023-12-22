import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import ClientAdmFacadeInterface from './client-adm-facade.interface';
import { AddClientFacadeInputDTO } from './dto/add-client-facade-input.dto';
import { FindClientFacadeInputDTO } from './dto/find-client-facade-input.dto';
import { FindClientFacadeOutputDTO } from './dto/find-client-facade-output.dto';

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
