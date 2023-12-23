import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import { AddProductInputDTO as AddProductInputUseCaseDTO } from '../usecase/add-product/add-product.dto';
import {
  AddProductFacadeInputDTO,
  CheckStockFacadeInputDTO,
  CheckStockFacadeOutputDTO,
} from './product-adm-facade.dto';
import ProductAdmFacadeInterface from './product-adm-facade.interface';

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  constructor(
    private readonly addProductUseCase: UseCaseInterface<AddProductInputUseCaseDTO>,
    private readonly checkStockUseCase: UseCaseInterface<CheckStockFacadeInputDTO, CheckStockFacadeOutputDTO>,
  ) {}

  async addProduct(input: AddProductFacadeInputDTO): Promise<void> {
    await this.addProductUseCase.execute(input);
  }

  checkStock(input: CheckStockFacadeInputDTO): Promise<CheckStockFacadeOutputDTO> {
    return this.checkStockUseCase.execute(input);
  }
}
