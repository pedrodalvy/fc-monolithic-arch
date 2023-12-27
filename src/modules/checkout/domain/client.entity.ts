import AggregateRoot from '../../@shared/domain/entity/aggregate-root.interface';
import BaseEntity from '../../@shared/domain/entity/base.entity';
import ID from '../../@shared/domain/value-object/id.value-object';

type CreateClient = {
  id?: ID;
  name: string;
  address: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Client extends BaseEntity implements AggregateRoot {
  private readonly _name: string;
  private readonly _address: string;
  private readonly _email: string;

  constructor(props: CreateClient) {
    super(props.id, props.createdAt, props.updatedAt);

    this._name = props.name;
    this._address = props.address;
    this._email = props.email;
  }

  get name(): string {
    return this._name;
  }

  get address(): string {
    return this._address;
  }

  get email(): string {
    return this._email;
  }
}
