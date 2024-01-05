import express from 'express';

import DatabaseConnection from '../database/sequelize/database.connection';
import clientRoutes from './routes/client.routes';

const app = express();
app.use(express.json());

app.use('/clients', clientRoutes);

DatabaseConnection.connect().then(() => {
  console.log('Database connected');

  app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
});
