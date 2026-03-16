import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { initDatabase } from './db/init.js';
import { pool } from './db/pool.js';
import { adminRouter } from './routes/admin.js';
import { apiRouter } from './routes/api.js';
import { authRouter } from './routes/auth.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, '../public');

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: false
  })
);
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '30mb' }));

app.use('/public', express.static(publicPath));
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api', apiRouter);

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error instanceof Error ? error.message : 'db error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message: 'Internal server error',
    error: error instanceof Error ? error.message : 'unknown error'
  });
});

async function bootstrap() {
  try {
    await initDatabase();
    app.listen(env.port, () => {
      console.log(`Backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Cannot start backend', error);
    process.exit(1);
  }
}

bootstrap();
