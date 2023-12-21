import Client from '../domain/client.entity';

export default interface ClientGateway {
  add(client: Client): Promise<void>;
}
