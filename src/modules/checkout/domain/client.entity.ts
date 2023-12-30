import AggregateRoot from '../../@shared/domain/entity/aggregate-root.interface';
import BaseEntity from '../../@shared/domain/entity/base.entity';
import ID from '../../@shared/domain/value-object/id.value-object';

type CreateClient = {
  id?: ID;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Client extends BaseEntity implements AggregateRoot {
  private readonly _name: string;

  constructor(props: CreateClient) {
    super(props.id, props.createdAt, props.updatedAt);

    this._name = props.name;
  }

  get name(): string {
    return this._name;
  }
}
