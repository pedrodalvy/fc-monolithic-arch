import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  ForeignKey,
  IsUUID,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import ClientModel from '../../client-adm/repository/client.model';
import ProductModel from '../../store-catalog/repository/product.model';
import OrderProductModel from './order-product.model';

@Table({ tableName: 'orders', timestamps: false })
export default class OrderModel extends Model {
  @IsUUID(4)
  @Column({ allowNull: false, primaryKey: true })
  id: string;

  @ForeignKey(() => ClientModel)
  clientId: string;

  @BelongsTo(() => ClientModel)
  client: ClientModel;

  @BelongsToMany(() => ProductModel, () => OrderProductModel)
  products: ProductModel[];

  @Column({ allowNull: false })
  status: string;

  @CreatedAt
  @Column({ allowNull: false })
  createdAt: Date;

  @UpdatedAt
  @Column({ allowNull: false })
  updatedAt: Date;
}
