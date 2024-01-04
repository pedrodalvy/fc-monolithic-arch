import { DataTypes, Sequelize } from 'sequelize';
import type { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async params => {
  await params.context.getQueryInterface().createTable('orders_products', {
    orderId: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
  });
};

export const down: MigrationFn<Sequelize> = async params => {
  await params.context.getQueryInterface().dropTable('orders_products');
};
