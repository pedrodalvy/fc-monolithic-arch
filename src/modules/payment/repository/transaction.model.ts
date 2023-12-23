import { Column, CreatedAt, IsUUID, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'transactions', timestamps: false })
export default class TransactionModel extends Model {
  @IsUUID(4)
  @Column({ allowNull: false, primaryKey: true })
  id: string;

  @Column({ allowNull: false })
  amount: number;

  @Column({ allowNull: false })
  orderId: string;

  @Column({ allowNull: false })
  status: string;

  @CreatedAt
  @Column({ allowNull: false })
  createdAt: Date;

  @UpdatedAt
  @Column({ allowNull: false })
  updatedAt: Date;
}
