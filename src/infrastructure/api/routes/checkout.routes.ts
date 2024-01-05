import express, { Request, Response } from 'express';

import { PlaceOrderFacadeInputDTO } from '../../../modules/checkout/facade/checkout-facade.dto';
import CheckoutFacadeFactory from '../../../modules/checkout/factory/checkout-facade.factory';

const checkoutRouter = express.Router();

checkoutRouter.post('/', async (req: Request, res: Response) => {
  try {
    const facade = CheckoutFacadeFactory.create();

    const requestBody: PlaceOrderFacadeInputDTO = {
      clientId: req.body.clientId,
      products: req.body.products,
    };

    const output = await facade.placeOrder(requestBody);

    res.status(200).send(output);
  } catch (err) {
    console.error('checkoutRouter - POST', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export default checkoutRouter;
