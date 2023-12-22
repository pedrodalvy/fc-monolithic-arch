import { AddClientFacadeInputDTO } from './dto/add-client-facade-input.dto';
import { FindClientFacadeInputDTO } from './dto/find-client-facade-input.dto';
import { FindClientFacadeOutputDTO } from './dto/find-client-facade-output.dto';

export default interface ClientAdmFacadeInterface {
  addClient(input: AddClientFacadeInputDTO): Promise<void>;
  findClient(input: FindClientFacadeInputDTO): Promise<FindClientFacadeOutputDTO>;
}
