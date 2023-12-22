import { randomUUID } from 'node:crypto';

import SequelizeHelper from '../../@shared/test/repository/sequelize.helper';
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
      address: 'address 1',
    };

    // Act
    await clientAdmFacade.addClient(client);

    // Assert
    const createdClientDB = await ClientModel.findOne({ where: { id: client.id } });

    expect(createdClientDB.toJSON()).toStrictEqual({
      id: expect.any(String),
      name: client.name,
      email: client.email,
      address: client.address,
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
      address: 'address 1',
    };

    await ClientModel.create({
      id: client.id,
      name: client.name,
      email: client.email,
      address: client.address,
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
      address: client.address,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
