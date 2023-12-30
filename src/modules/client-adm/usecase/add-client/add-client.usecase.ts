import ID from '../../../@shared/domain/value-object/id.value-object';
import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import Client from '../../domain/client.entity';
import ClientGateway from '../../gateway/client.gateway';
import { AddClientInputDTO as InputDTO, AddClientOutputDTO as OutputDTO } from './add-client.usecase.dto';

export default class AddClientUseCase implements UseCaseInterface<InputDTO, OutputDTO> {
  constructor(private readonly clientRepository: ClientGateway) {}

  async execute(input?: InputDTO): Promise<OutputDTO> {
    const client = new Client({
      id: new ID(input.id),
      name: input.name,
      email: input.email,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.clientRepository.add(client);

    return {
      id: client.id.value,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
