import express from 'express';
import cors from 'cors';
import { initDb } from './services/db.js';
import productsRouter from './routes/products.js';
import serialsRouter from './routes/serials.js';
import dashboardRouter from './routes/dashboard.js';
import metaRouter from './routes/meta.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Smart Home Sales Catalog API' });
});

app.use('/api/meta', metaRouter);
app.use('/api/products', productsRouter);
app.use('/api/serials', serialsRouter);
app.use('/api/dashboard', dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Sales Catalog API → http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
