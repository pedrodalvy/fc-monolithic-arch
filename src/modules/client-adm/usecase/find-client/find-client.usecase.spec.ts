import { mock } from 'jest-mock-extended';

import ID from '../../../@shared/domain/value-object/id.value-object';
import Client from '../../domain/client.entity';
import ClientGateway from '../../gateway/client.gateway';
import FindClientUseCase from './find-client.usecase';

describe('FindClientUseCase unit test', () => {
  const clientRepository = mock<ClientGateway>();
  const useCase = new FindClientUseCase(clientRepository);

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

    clientRepository.find.mockResolvedValue(client);

    // Act
    const output = await useCase.execute({ id: client.id.value });

    // Assert
    expect(clientRepository.find).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      id: client.id.value,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  });

  it('should throw an error when client is not found', async () => {
    // Arrange
    clientRepository.find.mockResolvedValue(null);

    // Assert
    await expect(useCase.execute({ id: 'client-1' })).rejects.toThrow('Client not found');
  });
});
