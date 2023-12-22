import { Column, CreatedAt, IsUUID, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'clients', timestamps: false })
export default class ClientModel extends Model {
  @IsUUID(4)
  @Column({ allowNull: false, primaryKey: true })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  address: string;

  @CreatedAt
  @Column({ allowNull: false })
  createdAt: Date;

  @UpdatedAt
  @Column({ allowNull: false })
  updatedAt: Date;
}
