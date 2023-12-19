import { Sequelize } from 'sequelize-typescript';
import { ModelCtor } from 'sequelize-typescript/dist/model/model/model';

export default class SequelizeHelper {
  private static _sequelize: Sequelize;

  static async createDatabase(models: ModelCtor[]) {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels(models);
    await sequelize.sync();

    this._sequelize = sequelize;
  }

  static async destroyDatabase() {
    if (this._sequelize) {
      await this._sequelize.close();
    }
  }
}
