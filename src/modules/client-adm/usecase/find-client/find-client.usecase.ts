import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import ClientGateway from '../../gateway/client.gateway';
import { FindClientInputDTO as InputDTO, FindClientOutputDTO as OutputDTO } from './find-client.usecase.dto';

export default class FindClientUseCase implements UseCaseInterface<InputDTO, OutputDTO> {
  constructor(private readonly clientRepository: ClientGateway) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const client = await this.clientRepository.find(input.id);

    if (!client) throw new Error('Client not found');

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
