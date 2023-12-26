import AggregateRoot from '../../@shared/domain/entity/aggregate-root.interface';
import BaseEntity from '../../@shared/domain/entity/base.entity';
import ID from '../../@shared/domain/value-object/id.value-object';

type CreateInvoiceItem = {
  id?: ID;
  name: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class InvoiceItem extends BaseEntity implements AggregateRoot {
  private readonly _name: string;
  private readonly _price: number;

  constructor(props: CreateInvoiceItem) {
    super(props.id, props.createdAt, props.updatedAt);

    this._name = props.name;
    this._price = props.price;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }
}
