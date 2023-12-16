import AddProductInputDTO from './dto/add-product-input.dto';
import CheckStockInputDTO from './dto/check-stock-input.dto';
import CheckStockOutputDTO from './dto/check-stock-output.dto';

export default interface ProductAdmFacadeInterface {
  addProduct(input: AddProductInputDTO): Promise<void>;
  checkStock(input: CheckStockInputDTO): Promise<CheckStockOutputDTO>;
}
