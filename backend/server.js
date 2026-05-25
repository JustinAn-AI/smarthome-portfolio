import express from 'express';
import cors from 'cors';
import { initDb } from './services/db.js';
import productsRouter from './routes/products.js';
import serialsRouter from './routes/serials.js';
import dashboardRouter from './routes/dashboard.js';
import metaRouter from './routes/meta.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
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

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Sales Catalog API -> http://localhost:${PORT}`);
  });
} // <--- Đảm bảo có dấu ngoặc này để đóng hàm start()

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});

  app.listen(PORT, () => {
    console.log(`Sales Catalog API -> http://localhost:${PORT}`);
  });
}

  app.listen(PORT, () => {
    console.log(`Sales Catalog API -> http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
