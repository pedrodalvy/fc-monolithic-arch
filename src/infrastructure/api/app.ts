import express from 'express';

import clientRoutes from './routes/client.routes';
import productRouter from './routes/product.routes';

export const app = express();

app.use(express.json());
app.use('/clients', clientRoutes);
app.use('/products', productRouter);
