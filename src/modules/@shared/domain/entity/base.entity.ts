import ID from '../value-object/id.value-object';

export default class BaseEntity {
  private readonly _id: ID;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(id?: ID, createdAt?: Date, updatedAt?: Date) {
    this._id = id ?? new ID();
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  get id(): ID {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
