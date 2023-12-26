import { Column, CreatedAt, HasMany, IsUUID, Model, Table, UpdatedAt } from 'sequelize-typescript';

import { InvoiceItemModel } from './invoice-item.model';

@Table({ tableName: 'invoices', timestamps: false })
export default class InvoiceModel extends Model {
  @IsUUID(4)
  @Column({ allowNull: false, primaryKey: true })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  document: string;

  @Column({ allowNull: false })
  street: string;

  @Column({ allowNull: false })
  number: string;

  @Column({ allowNull: false })
  complement: string;

  @Column({ allowNull: false })
  city: string;

  @Column({ allowNull: false })
  state: string;

  @Column({ allowNull: false })
  zipCode: string;

  @HasMany(() => InvoiceItemModel, 'invoiceId')
  items: InvoiceItemModel[];

  @CreatedAt
  @Column({ allowNull: false })
  createdAt: Date;

  @UpdatedAt
  @Column({ allowNull: false })
  updatedAt: Date;
}
