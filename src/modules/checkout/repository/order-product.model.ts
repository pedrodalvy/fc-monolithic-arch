import { ForeignKey, Model, Table } from 'sequelize-typescript';

import ProductModel from '../../store-catalog/repository/product.model';
import OrderModel from './order.model';

@Table({ tableName: 'orders_products', timestamps: false })
export default class OrderProductModel extends Model {
  @ForeignKey(() => OrderModel)
  orderId: string;

  @ForeignKey(() => ProductModel)
  productId: string;
}
