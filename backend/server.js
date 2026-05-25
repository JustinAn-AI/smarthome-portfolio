import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// Import các router của bạn ở đây, ví dụ:
// import metaRouter from './routes/meta.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// 1. Cấu hình phục vụ giao diện tĩnh (Frontend đã build)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 2. Định nghĩa các API routes của bạn tại đây
// app.use('/api/meta', metaRouter);

// 3. Điều hướng fallback để React Router hoạt động
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

  async function start() {
    await initDb();
  
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
  
    // 1. Cấu hình phục vụ file tĩnh
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
    // 2. Điều hướng fallback cho React Router
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });
  
    app.listen(PORT, () => {
      console.log(`Sales Catalog API -> http://localhost:${PORT}`);
    });
  }
start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});