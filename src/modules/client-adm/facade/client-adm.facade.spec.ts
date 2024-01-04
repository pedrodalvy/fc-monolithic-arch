import { randomUUID } from 'node:crypto';

import SequelizeHelper from '../../../infrastructure/database/sequelize/test/sequelize.helper';
import ClientAdmFacadeFactory from '../factory/client-adm-facade.factory';
import ClientModel from '../repository/client.model';

describe('ClientAdmFacade integration test', () => {
  const clientAdmFacade = ClientAdmFacadeFactory.create();

  beforeEach(async () => {
    await SequelizeHelper.createDatabase([ClientModel]);
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  it('should add a client', async () => {
    // Arrange
    const client = {
      id: randomUUID(),
      name: 'Client 1',
      email: 'a@a.com',
      document: '123456789',
      street: 'street 1',
      number: '123',
      complement: 'complement 1',
      city: 'city 1',
      state: 'state 1',
      zipCode: '12345678',
    };

    // Act
    await clientAdmFacade.addClient(client);

    // Assert
    const createdClientDB = await ClientModel.findOne({ where: { id: client.id } });

    expect(createdClientDB.toJSON()).toStrictEqual({
      id: expect.any(String),
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should find a client', async () => {
    // Arrange
    const client = {
      id: randomUUID(),
      name: 'Client 1',
      email: 'a@a.com',
      document: '123456789',
      street: 'street 1',
      number: '123',
      complement: 'complement 1',
      city: 'city 1',
      state: 'state 1',
      zipCode: '12345678',
    };

    await ClientModel.create({
      id: client.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const response = await clientAdmFacade.findClient({ id: client.id });

    // Assert
    expect(response).toStrictEqual({
      id: client.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
