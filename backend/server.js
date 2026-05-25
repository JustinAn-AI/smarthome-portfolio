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

// Bạn dán đè đoạn này từ dòng 29 đến dòng 34 cũ của file server.js nhé:
async function start() {
  await initDb();

  // --- ĐOẠN CODES CẤU HÌNH ĐỂ HIỂN THỊ GIAO DIỆN (FRONTEND) TRÊN RENDER ---
  const path = require('path');
  // 1. Chỉ định thư mục chứa các file static tĩnh (html, css, js) sau khi build Frontend
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // 2. Chuyển hướng mọi request truy cập giao diện (không phải API) về file index.html
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next(); // Nếu là gọi API thì bỏ qua để Backend xử lý
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
  // ----------------------------------------------------------------------

  app.listen(PORT, () => {
    console.log(`Sales Catalog API -> http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
