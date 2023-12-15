import ProductAdmFacadeInterface from './product-adm-facade.interface';
import AddProductInputDTO from './dto/add-product-input.dto';
import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import { AddProductInputDTO as AddProductInputUseCaseDTO } from '../usecase/add-product/add-product.dto';

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  constructor(private readonly addProductUseCase: UseCaseInterface<AddProductInputUseCaseDTO>) {}

  async addProduct(input: AddProductInputDTO): Promise<void> {
    await this.addProductUseCase.execute(input);
  }
}
