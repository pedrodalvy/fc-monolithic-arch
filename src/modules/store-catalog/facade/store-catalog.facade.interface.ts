import {
  FindAllProductsFacadeOutputDTO,
  FindProductFacadeInputDTO,
  FindProductFacadeOutputDTO,
} from './store-catalog.facade.dto';

export default interface StoreCatalogFacadeInterface {
  find(input: FindProductFacadeInputDTO): Promise<FindProductFacadeOutputDTO>;
  findAll(): Promise<FindAllProductsFacadeOutputDTO>;
}
