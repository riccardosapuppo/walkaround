import dotenv from 'dotenv';

dotenv.config();

function parsePositiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
  port: Number(process.env.PORT || 3000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  appBaseOrigin: process.env.APP_BASE_ORIGIN || process.env.CORS_ORIGIN || 'http://localhost:4200',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 25432),
    database: process.env.DB_NAME || 'turismo_db_dev',
    user: process.env.DB_USER || 'tourism',
    password: process.env.DB_PASSWORD || ''
  },
  auth: {
    adminEmail: process.env.ADMIN_EMAIL || 'riccardo.sapuppo.9@gmail.com',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    sessionTtlHours: parsePositiveNumber(process.env.AUTH_SESSION_TTL_HOURS, 168),
    inviteTtlHours: parsePositiveNumber(process.env.AUTH_INVITE_TTL_HOURS, 24)
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parsePositiveNumber(process.env.SMTP_PORT, 465),
    secure: String(process.env.SMTP_SECURE || 'true').toLowerCase() !== 'false',
    user: process.env.SMTP_USER || 'info@walkaround.cloud',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'TourApp <info@walkaround.cloud>'
  }
};
