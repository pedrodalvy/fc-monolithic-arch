import { join } from 'path';
import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

export const migrator = (sequelize: Sequelize, logger: any) => {
  return new Umzug({
    migrations: {
      glob: [
        'src/infrastructure/sequelize/migrations/*.migration.{js,ts}',
        {
          cwd: join(__dirname, '../../../../../'),
          ignore: ['**/*.d.ts', '**/index.ts', '**/index.js'],
        },
      ],
    },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger,
  });
};
