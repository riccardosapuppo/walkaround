import { queryWithRetry } from '../db/pool.js';
import { hashToken } from './security.js';

const APP_SESSION_BY_TOKEN_QUERY = `
  SELECT
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    s.token_hash
  FROM app_sessions s
  JOIN app_users u ON u.id = s.user_id
  WHERE s.token_hash = $1
    AND s.expires_at > NOW()
  LIMIT 1
`;

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

export async function resolveAppSessionUser(req) {
  const token = readBearerToken(req);
  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);
  const result = await queryWithRetry(APP_SESSION_BY_TOKEN_QUERY, [tokenHash], {
    label: 'app session lookup'
  });
  if (!result.rowCount) {
    return null;
  }

  const row = result.rows[0];
  return {
    tokenHash,
    user: {
      id: row.id,
      email: row.email,
      firstName: row.first_name || '',
      lastName: row.last_name || ''
    }
  };
}

export async function requireAppAuth(req, res, next) {
  try {
    const session = await resolveAppSessionUser(req);
    if (!session) {
      return res.status(401).json({ message: 'Accesso utente richiesto' });
    }

    req.appAuthSession = session;
    return next();
  } catch (error) {
    return next(error);
  }
}
