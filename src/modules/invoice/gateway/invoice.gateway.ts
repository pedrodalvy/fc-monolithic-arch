import Invoice from '../domain/invoice';

export interface InvoiceGateway {
  save(input: Invoice): Promise<void>;
}
