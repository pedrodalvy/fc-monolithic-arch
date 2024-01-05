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
  private static _sequelize: Sequelize;

  static async connect(storagePath = 'database.sqlite') {
    this._sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: storagePath,
      logging: false,
    });

    this._sequelize.addModels([
      ClientModel,
      ProductStoreModel,
      ProductAdmModel,
      OrderProductModel,
      OrderModel,
      TransactionModel,
      InvoiceModel,
      InvoiceItemModel,
    ]);

    await migrator(this._sequelize, undefined).up();
  }

  static async disconnect() {
    if (this._sequelize) {
      await this._sequelize.close();
    }
  }
}
