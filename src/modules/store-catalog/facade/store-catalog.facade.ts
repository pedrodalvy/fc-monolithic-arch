import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import { FindProductInputDTO, FindProductOutputDTO } from '../usecase/find-product/find-product.dto';
import { FindAllProductsFacadeOutputDTO } from './dto/find-all-products-output.dto';
import { FindProductFacadeInputDTO } from './dto/find-product-facade-input.dto';
import { FindProductFacadeOutputDTO } from './dto/find-product-facade-output.dto';
import StoreCatalogFacadeInterface from './store-catalog.facade.interface';

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  constructor(
    private readonly findProductUseCase: UseCaseInterface<FindProductInputDTO, FindProductOutputDTO>,
    private readonly findAllProductsUseCase: UseCaseInterface<never, FindAllProductsFacadeOutputDTO>,
  ) {}

  find(input: FindProductFacadeInputDTO): Promise<FindProductFacadeOutputDTO> {
    return this.findProductUseCase.execute(input);
  }

  findAll(): Promise<FindAllProductsFacadeOutputDTO> {
    return this.findAllProductsUseCase.execute();
  }
}
