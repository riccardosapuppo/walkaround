import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 25432),
    database: process.env.DB_NAME || 'turismo_db_dev',
    user: process.env.DB_USER || 'tourism',
    password: process.env.DB_PASSWORD || ''
  }
};
