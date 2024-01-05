import express from 'express';

import clientRoutes from './routes/client.routes';

export const app = express();

app.use(express.json());
app.use('/clients', clientRoutes);
