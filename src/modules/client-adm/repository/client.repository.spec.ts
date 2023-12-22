import ID from '../../@shared/domain/value-object/id.value-object';
import SequelizeHelper from '../../@shared/test/repository/sequelize.helper';
import Client from '../domain/client.entity';
import ClientGateway from '../gateway/client.gateway';
import ClientModel from './client.model';
import ClientRepository from './client.repository';

describe('ClientRepository integration test', () => {
  let clientRepository: ClientGateway;

  beforeEach(async () => {
    await SequelizeHelper.createDatabase([ClientModel]);
    clientRepository = new ClientRepository();
  });

  afterEach(async () => {
    await SequelizeHelper.destroyDatabase();
  });

  it('should create a client', async () => {
    // Arrange
    const client = new Client({
      id: new ID(),
      name: 'Client 1',
      email: 'a@a.com',
      address: 'address 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    await clientRepository.add(client);

    // Assert
    const createdClientDB = await ClientModel.findOne({ where: { id: client.id.value } });

    expect(createdClientDB.toJSON()).toStrictEqual({
      id: client.id.value,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  });

  it('should find a client', async () => {
    // Arrange
    const client = new Client({
      id: new ID(),
      name: 'Client 1',
      email: 'a@a.com',
      address: 'address 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await clientRepository.add(client);

    // Act
    const result = await clientRepository.find(client.id.value);

    // Assert
    expect(result).toStrictEqual(client);
  });

  it('should return undefined when client is not found', async () => {
    // Act
    const result = await clientRepository.find('not-found-id');

    // Assert
    expect(result).toBeUndefined();
  });
});
