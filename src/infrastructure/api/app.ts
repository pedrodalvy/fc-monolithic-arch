import express from 'express';

import checkoutRouter from './routes/checkout.routes';
import clientRoutes from './routes/client.routes';
import productRouter from './routes/product.routes';

export const app = express();

app.use(express.json());
app.use('/clients', clientRoutes);
app.use('/products', productRouter);
app.use('/checkout', checkoutRouter);
