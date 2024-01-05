import express, { Request, Response } from 'express';

import { AddProductFacadeInputDTO } from '../../../modules/product-adm/facade/product-adm-facade.dto';
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/product-adm-facade.factory';

const productRouter = express.Router();

productRouter.post('/', async (req: Request, res: Response) => {
  try {
    const facade = ProductAdmFacadeFactory.create();

    const requestBody: AddProductFacadeInputDTO = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };

    await facade.addProduct(requestBody);

    res.status(201).send();
  } catch (err) {
    console.error('productRouter - POST', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export default productRouter;
