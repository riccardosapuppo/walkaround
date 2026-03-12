import { pool } from '../db/pool.js';
import { hashToken } from './security.js';

function readBearerToken(req) {
  const raw = req.headers.authorization;
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const [scheme, token] = raw.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token.trim();
}

export async function resolveSessionUser(req) {
  const token = readBearerToken(req);
  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);
  const result = await pool.query(
    `
      SELECT
        u.id,
        u.email,
        u.role,
        s.token_hash,
        s.impersonated_by_user_id,
        ib.email AS impersonated_by_email
      FROM dashboard_sessions s
      JOIN dashboard_users u ON u.id = s.user_id
      LEFT JOIN dashboard_users ib ON ib.id = s.impersonated_by_user_id
      WHERE s.token_hash = $1
        AND s.expires_at > NOW()
      LIMIT 1
    `,
    [tokenHash]
  );

  if (!result.rowCount) {
    return null;
  }

  const row = result.rows[0];
  return {
    tokenHash,
    user: {
      id: row.id,
      email: row.email,
      role: row.role
    },
    impersonatedBy: row.impersonated_by_user_id
      ? {
          id: row.impersonated_by_user_id,
          email: row.impersonated_by_email || ''
        }
      : null
  };
}

export async function requireAuth(req, res, next) {
  try {
    const session = await resolveSessionUser(req);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.authSession = session;
    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireAdmin(req, res, next) {
  const role = req.authSession?.user?.role;
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return next();
}
