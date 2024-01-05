import express, { Request, Response } from 'express';

import { AddClientFacadeInputDTO } from '../../../modules/client-adm/facade/client-adm-facade.dto';
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/client-adm-facade.factory';

const clientRouter = express.Router();

clientRouter.post('/', async (req: Request, res: Response) => {
  try {
    const facade = ClientAdmFacadeFactory.create();

    const requestBody: AddClientFacadeInputDTO = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
    };

    await facade.addClient(requestBody);

    res.status(204).send();
  } catch (err) {
    console.error('clientRouter - POST', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export default clientRouter;
