import BaseEntity from '../../@shared/domain/entity/base.entity';
import ID from '../../@shared/domain/value-object/id.value-object';
import Client from './client.entity';
import Product from './product.entity';

type CreateOrder = {
  id?: ID;
  client: Client;
  products: Product[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Order extends BaseEntity {
  private readonly _client: Client;
  private readonly _products: Product[];
  private _status: string;

  constructor(props: CreateOrder) {
    super(props.id, props.createdAt, props.updatedAt);

    this._client = props.client;
    this._products = props.products;
    this._status = props.status || 'pending';
  }

  get client(): Client {
    return this._client;
  }

  get products(): Product[] {
    return this._products;
  }

  get status(): string {
    return this._status;
  }

  approved(): void {
    this._status = 'approved';
  }

  rejected(): void {
    this._status = 'rejected';
  }

  get total(): number {
    return this._products.reduce((total, product) => total + product.salesPrice, 0);
  }
}
