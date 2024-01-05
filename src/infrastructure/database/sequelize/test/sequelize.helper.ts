import { Sequelize } from 'sequelize-typescript';
import { ModelCtor } from 'sequelize-typescript/dist/model/model/model';
import { Umzug } from 'umzug';

import { migrator } from '../migrations/config/migrator';

export default class SequelizeHelper {
  private static _sequelize: Sequelize;
  private static _migrator: Umzug<any>;

  static async createDatabase(models: ModelCtor[]) {
    this._sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });
    this._sequelize.addModels(models);

    this._migrator = migrator(this._sequelize, undefined);
    await this._migrator.up();
  }

  static async destroyDatabase() {
    if (this._sequelize && this._migrator) {
      await this._migrator.down();
      await this._sequelize.close();
    }
  }

  static get sequelize() {
    return this._sequelize;
  }
}
