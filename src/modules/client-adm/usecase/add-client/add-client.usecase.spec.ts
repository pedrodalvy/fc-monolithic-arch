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
      document: '123456789',
      street: 'street 1',
      number: '123',
      complement: 'complement 1',
      city: 'city 1',
      state: 'state 1',
      zipCode: '12345678',
    };

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(clientRepository.add).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      email: input.email,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
