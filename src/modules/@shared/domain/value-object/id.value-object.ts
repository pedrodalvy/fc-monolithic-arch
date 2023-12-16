import { randomUUID } from 'node:crypto';

import ValueObject from './value-object.interface';

export default class ID implements ValueObject {
  private readonly _id: string;

  constructor(id?: string) {
    this._id = id ?? randomUUID();
  }

  get value(): string {
    return this._id;
  }
}
