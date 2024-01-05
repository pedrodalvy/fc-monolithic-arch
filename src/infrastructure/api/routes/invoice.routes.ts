import express, { Request, Response } from 'express';

import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice-facade.factory';

const invoiceRouter = express.Router();

invoiceRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const facade = InvoiceFacadeFactory.create();
    const id = req.params.id;

    const output = await facade.find({ id });
    return res.status(200).send(output);
  } catch (err) {
    console.error('invoiceRouter - GET', err);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

export default invoiceRouter;
