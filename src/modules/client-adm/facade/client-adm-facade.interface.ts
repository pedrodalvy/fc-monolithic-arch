import { AddClientFacadeInputDTO, FindClientFacadeInputDTO, FindClientFacadeOutputDTO } from './client-adm-facade.dto';

export default interface ClientAdmFacadeInterface {
  addClient(input: AddClientFacadeInputDTO): Promise<void>;
  findClient(input: FindClientFacadeInputDTO): Promise<FindClientFacadeOutputDTO>;
}
