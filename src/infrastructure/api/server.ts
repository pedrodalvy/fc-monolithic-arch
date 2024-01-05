import DatabaseConnection from '../database/sequelize/database.connection';
import { app } from './app';

DatabaseConnection.connect().then(() => {
  console.log('Database connected');

  app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
});
