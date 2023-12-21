import { mock } from 'jest-mock-extended';

import ClientGateway from '../../gateway/client.gateway';
import AddClientUseCase from './add-client.usecase';

describe('AddClientUseCase unit test', () => {
  const clientRepository = mock<ClientGateway>();
  const useCase = new AddClientUseCase(clientRepository);

  it('should add a new client', async () => {
    // Arrange
    const input = {
      name: 'Client 1',
      email: 'a@a.com',
      address: 'address 1',
    };

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(clientRepository.add).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      email: input.email,
      address: input.address,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
