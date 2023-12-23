import AggregateRoot from '../../@shared/domain/entity/aggregate-root.interface';
import BaseEntity from '../../@shared/domain/entity/base.entity';
import ID from '../../@shared/domain/value-object/id.value-object';

type CreateTransaction = {
  id?: ID;
  amount: number;
  orderId: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Transaction extends BaseEntity implements AggregateRoot {
  private readonly _amount: number;
  private readonly _orderId: string;
  private _status: string;

  constructor(props: CreateTransaction) {
    super(props.id, props.createdAt, props.updatedAt);
    this._amount = props.amount;
    this._orderId = props.orderId;
    this._status = props.status ?? 'pending';

    this.validate();
  }

  validate(): void {
    if (this._amount <= 0) {
      throw new Error('Transaction amount must be greater than zero');
    }

    if (this._orderId === '') {
      throw new Error('Transaction order id is required');
    }
  }

  approve(): void {
    this._status = 'approved';
  }

  decline(): void {
    this._status = 'declined';
  }

  process(): void {
    this._amount >= 100 ? this.approve() : this.decline();
  }

  get amount(): number {
    return this._amount;
  }

  get orderId(): string {
    return this._orderId;
  }

  get status(): string {
    return this._status;
  }
}
