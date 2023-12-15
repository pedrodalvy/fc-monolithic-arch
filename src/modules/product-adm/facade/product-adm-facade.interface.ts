import AddProductInputDTO from './dto/add-product-input.dto';

export default interface ProductAdmFacadeInterface {
  addProduct(input: AddProductInputDTO): Promise<void>;
}
