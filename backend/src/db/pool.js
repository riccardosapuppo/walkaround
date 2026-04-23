import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  max: 10,
  idleTimeoutMillis: 15000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

pool.on('error', (error) => {
  console.error('PostgreSQL pool error', error);
});

const TRANSIENT_DB_ERROR_CODES = new Set([
  'ECONNRESET',
  'EPIPE',
  'ETIMEDOUT',
  'ECONNREFUSED',
  '08000',
  '08001',
  '08003',
  '08004',
  '08006',
  '57P01',
  '57P02',
  '57P03'
]);

export function isTransientDbError(error) {
  if (TRANSIENT_DB_ERROR_CODES.has(error?.code)) {
    return true;
  }

  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('connection terminated unexpectedly') ||
    message.includes('server closed the connection unexpectedly') ||
    message.includes('connection reset') ||
    message.includes('read econnreset') ||
    message.includes('write epipe')
  );
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function queryWithRetry(text, params = [], options = {}) {
  const retries = Number.isInteger(options.retries) ? options.retries : 1;
  const retryDelayMs = Number.isFinite(options.retryDelayMs) ? options.retryDelayMs : 120;
  const label = options.label || 'query';

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    let client = null;
    let destroyClient = false;
    let shouldRetry = false;

    try {
      client = await pool.connect();
      return await client.query(text, params);
    } catch (error) {
      const transient = isTransientDbError(error);
      destroyClient = transient;

      if (!transient || attempt >= retries) {
        throw error;
      }

      console.warn('[db] transient PostgreSQL error, retrying once', {
        label,
        code: error.code,
        message: error.message
      });

      shouldRetry = true;
    } finally {
      if (client) {
        client.release(destroyClient);
      }
    }

    if (shouldRetry && retryDelayMs > 0) {
      await wait(retryDelayMs);
    }
  }

  throw new Error('Database query retry loop exhausted unexpectedly');
}
