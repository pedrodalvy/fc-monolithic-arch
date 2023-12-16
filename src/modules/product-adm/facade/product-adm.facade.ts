import ProductAdmFacadeInterface from './product-adm-facade.interface';
import AddProductInputDTO from './dto/add-product-input.dto';
import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import { AddProductInputDTO as AddProductInputUseCaseDTO } from '../usecase/add-product/add-product.dto';
import CheckStockInputDTO from './dto/check-stock-input.dto';
import CheckStockOutputDTO from './dto/check-stock-output.dto';

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  constructor(
    private readonly addProductUseCase: UseCaseInterface<AddProductInputUseCaseDTO>,
    private readonly checkStockUseCase: UseCaseInterface<CheckStockInputDTO, CheckStockOutputDTO>,
  ) {}

  async addProduct(input: AddProductInputDTO): Promise<void> {
    await this.addProductUseCase.execute(input);
  }

  checkStock(input: CheckStockInputDTO): Promise<CheckStockOutputDTO> {
    return this.checkStockUseCase.execute(input);
  }
}
