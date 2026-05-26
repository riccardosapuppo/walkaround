import { queryWithRetry } from '../db/pool.js';
import { hashToken } from './security.js';

const SESSION_BY_TOKEN_QUERY = `
  SELECT
    u.id,
    u.first_name,
    u.last_name,
    u.structure_id,
    us.name AS structure_name,
    u.email,
    u.role,
    s.token_hash,
    s.impersonated_by_user_id,
    ib.first_name AS impersonated_by_first_name,
    ib.last_name AS impersonated_by_last_name,
    ib.structure_id AS impersonated_by_structure_id,
    ibs.name AS impersonated_by_structure_name,
    ib.email AS impersonated_by_email
  FROM dashboard_sessions s
  JOIN dashboard_users u ON u.id = s.user_id AND u.deleted = 0
  LEFT JOIN dashboard_structures us ON us.id = u.structure_id AND us.deleted = 0
  LEFT JOIN dashboard_users ib ON ib.id = s.impersonated_by_user_id AND ib.deleted = 0
  LEFT JOIN dashboard_structures ibs ON ibs.id = ib.structure_id AND ibs.deleted = 0
  WHERE s.token_hash = $1
    AND s.expires_at > NOW()
  LIMIT 1
`;

async function querySessionByTokenHash(tokenHash) {
  return queryWithRetry(SESSION_BY_TOKEN_QUERY, [tokenHash], {
    label: 'dashboard session lookup'
  });
}

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
  const result = await querySessionByTokenHash(tokenHash);

  if (!result.rowCount) {
    return null;
  }

  const row = result.rows[0];
  return {
    tokenHash,
    user: {
      id: row.id,
      firstName: row.first_name || '',
      lastName: row.last_name || '',
      structureId: row.structure_id || null,
      structureName: row.structure_name || null,
      email: row.email,
      role: row.role
    },
    impersonatedBy: row.impersonated_by_user_id
      ? {
          id: row.impersonated_by_user_id,
          firstName: row.impersonated_by_first_name || '',
          lastName: row.impersonated_by_last_name || '',
          structureId: row.impersonated_by_structure_id || null,
          structureName: row.impersonated_by_structure_name || null,
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
