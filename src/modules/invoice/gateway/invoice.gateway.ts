import Invoice from '../domain/invoice';

export interface InvoiceGateway {
  save(input: Invoice): Promise<void>;
  find(id: string): Promise<Invoice | undefined>;
}
