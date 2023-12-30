import { FindClientFacadeOutputDTO } from '../../../../client-adm/facade/client-adm-facade.dto';
import { GenerateInvoiceFacadeOutputDTO } from '../../../../invoice/facade/invoice-facade.dto';
import { FindProductFacadeOutputDTO } from '../../../../store-catalog/facade/store-catalog.facade.dto';
import { ProcessPaymentFacadeOutputDTO } from './../../../../payment/facade/payment-facade.dto';

export const findClientFacadeMock: () => FindClientFacadeOutputDTO = () => ({
  id: 'client-id',
  name: 'client-name',
  email: 'client-email',
  address: 'client-address',
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const findProductFacadeMock: () => FindProductFacadeOutputDTO[] = () => [
  { id: 'id-1', name: 'name-1', description: 'description-1', salesPrice: 10 },
  { id: 'id-2', name: 'name-2', description: 'description-2', salesPrice: 20 },
];

export const processPaymentFacadeMock: (status: string) => ProcessPaymentFacadeOutputDTO = (status: string) => ({
  status,
  orderId: 'order-id',
  transactionId: 'transaction-id',
  amount: 30,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const generateInvoiceFacadeMock: () => GenerateInvoiceFacadeOutputDTO = () => ({
  id: 'id',
  name: 'name',
  document: 'document',
  street: 'street',
  number: 'number',
  complement: 'complement',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  items: [
    { id: 'id', name: 'name', price: 10 },
    { id: 'id', name: 'name', price: 20 },
  ],
  total: 30,
  createdAt: new Date(),
  updatedAt: new Date(),
});
