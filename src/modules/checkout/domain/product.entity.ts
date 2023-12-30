import AggregateRoot from '../../@shared/domain/entity/aggregate-root.interface';
import BaseEntity from '../../@shared/domain/entity/base.entity';
import ID from '../../@shared/domain/value-object/id.value-object';

type CreateProduct = {
  id?: ID;
  name: string;
  salesPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Product extends BaseEntity implements AggregateRoot {
  private readonly _name: string;
  private readonly _salesPrice: number;

  constructor(props: CreateProduct) {
    super(props.id, props.createdAt, props.updatedAt);

    this._name = props.name;
    this._salesPrice = props.salesPrice;
  }

  get name(): string {
    return this._name;
  }

  get salesPrice(): number {
    return this._salesPrice;
  }
}
