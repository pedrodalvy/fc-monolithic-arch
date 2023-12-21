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
      address: input.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.clientRepository.add(client);

    return {
      id: client.id.value,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
