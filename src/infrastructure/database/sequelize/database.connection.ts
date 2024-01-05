import { Sequelize } from 'sequelize-typescript';

import OrderModel from '../../../modules/checkout/repository/order.model';
import OrderProductModel from '../../../modules/checkout/repository/order-product.model';
import ClientModel from '../../../modules/client-adm/repository/client.model';
import InvoiceModel from '../../../modules/invoice/repository/invoice.model';
import { InvoiceItemModel } from '../../../modules/invoice/repository/invoice-item.model';
import TransactionModel from '../../../modules/payment/repository/transaction.model';
import ProductAdmModel from '../../../modules/product-adm/repository/product.model';
import ProductStoreModel from '../../../modules/store-catalog/repository/product.model';
import { migrator } from './migrations/config/migrator';

export default class DatabaseConnection {
  static async connect() {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: 'database.sqlite',
      logging: false,
    });

    sequelize.addModels([
      ClientModel,
      ProductStoreModel,
      ProductAdmModel,
      OrderProductModel,
      OrderModel,
      TransactionModel,
      InvoiceModel,
      InvoiceItemModel,
    ]);

    await migrator(sequelize, undefined).up();
  }
}
