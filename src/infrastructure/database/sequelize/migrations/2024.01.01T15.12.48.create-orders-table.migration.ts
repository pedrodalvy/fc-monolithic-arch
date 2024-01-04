import { DataTypes, Sequelize } from 'sequelize';
import type { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async params => {
  await params.context.getQueryInterface().createTable('orders', {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};

export const down: MigrationFn<Sequelize> = async params => {
  await params.context.getQueryInterface().dropTable('orders');
};
