import express from 'express';

import DatabaseConnection from '../database/sequelize/database.connection';

const app = express();
app.use(express.json());

DatabaseConnection.connect().then(() => {
  console.log('Database connected');

  app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
});
