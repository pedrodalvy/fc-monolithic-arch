import { Column, CreatedAt, ForeignKey, IsUUID, Model, Table, UpdatedAt } from 'sequelize-typescript';

import InvoiceModel from './invoice.model';

@Table({ tableName: 'invoice_items', timestamps: false })
export class InvoiceItemModel extends Model {
  @IsUUID(4)
  @Column({ allowNull: false, primaryKey: true })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  price: number;

  @ForeignKey(() => InvoiceModel)
  invoiceId: string;

  @CreatedAt
  @Column({ allowNull: false })
  createdAt: Date;

  @UpdatedAt
  @Column({ allowNull: false })
  updatedAt: Date;
}
