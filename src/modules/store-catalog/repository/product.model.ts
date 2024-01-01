import { Column, CreatedAt, IsUUID, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'products',
  timestamps: false,
})
export default class ProductModel extends Model {
  @IsUUID(4)
  @Column({ allowNull: false, primaryKey: true })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  salesPrice: number;

  @CreatedAt
  @Column({ defaultValue: new Date() })
  createdAt: Date;

  @UpdatedAt
  @Column({ defaultValue: new Date() })
  updatedAt: Date;
}
