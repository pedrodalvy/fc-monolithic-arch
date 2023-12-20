import { FindAllProductsFacadeOutputDTO } from './dto/find-all-products-output.dto';
import { FindProductFacadeInputDTO } from './dto/find-product-facade-input.dto';
import { FindProductFacadeOutputDTO } from './dto/find-product-facade-output.dto';

export default interface StoreCatalogFacadeInterface {
  find(input: FindProductFacadeInputDTO): Promise<FindProductFacadeOutputDTO>;
  findAll(): Promise<FindAllProductsFacadeOutputDTO>;
}
