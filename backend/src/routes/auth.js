import express from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { pool } from '../db/pool.js';
import { requireAuth } from '../auth/middleware.js';
import { createOpaqueToken, hashPassword, hashToken, verifyPassword } from '../auth/security.js';

const router = express.Router();

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

const completeRegistrationSchema = z.object({
  password: z
    .string()
    .min(8, 'La password deve avere almeno 8 caratteri')
    .max(120, 'La password è troppo lunga')
});

function sessionExpiryDate() {
  const now = Date.now();
  return new Date(now + env.auth.sessionTtlHours * 60 * 60 * 1000);
}

export async function createSession(userId, options = {}) {
  const token = createOpaqueToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = sessionExpiryDate();
  const impersonatedByUserId = options.impersonatedByUserId || null;

  await pool.query(
    `
      INSERT INTO dashboard_sessions (token_hash, user_id, impersonated_by_user_id, expires_at)
      VALUES ($1, $2, $3, $4)
    `,
    [tokenHash, userId, impersonatedByUserId, expiresAt.toISOString()]
  );

  return {
    token,
    expiresAt: expiresAt.toISOString()
  };
}

function authPayload(user, impersonatedBy = null) {
  return {
    user: {
      id: user.id,
      firstName: user.first_name || user.firstName || '',
      lastName: user.last_name || user.lastName || '',
      structureId: user.structure_id || user.structureId || null,
      structureName: user.structure_name || user.structureName || user.facility_name || user.facilityName || null,
      email: user.email,
      role: user.role
    },
    session: {
      isImpersonating: Boolean(impersonatedBy),
      impersonatedBy: impersonatedBy
        ? {
            id: impersonatedBy.id,
            firstName: impersonatedBy.first_name || impersonatedBy.firstName || '',
            lastName: impersonatedBy.last_name || impersonatedBy.lastName || '',
            structureId: impersonatedBy.structure_id || impersonatedBy.structureId || null,
            structureName:
              impersonatedBy.structure_name || impersonatedBy.structureName || impersonatedBy.facility_name || null,
            email: impersonatedBy.email
          }
        : null
    }
  };
}

async function fetchInviteByToken(token, client = pool) {
  const tokenHash = hashToken(token);
  const result = await client.query(
    `
      SELECT
        i.id,
        i.email,
        i.user_id,
        i.expires_at,
        i.used_at,
        u.is_registered
      FROM dashboard_invites i
      JOIN dashboard_users u ON u.id = i.user_id AND u.deleted = 0
      WHERE i.token_hash = $1
      LIMIT 1
    `,
    [tokenHash]
  );

  if (!result.rowCount) {
    return null;
  }

  return result.rows[0];
}

function mapInviteStatus(inviteRow) {
  if (!inviteRow) {
    return { status: 'invalid' };
  }

  if (inviteRow.is_registered) {
    return {
      status: 'already_registered',
      email: inviteRow.email
    };
  }

  if (inviteRow.used_at || new Date(inviteRow.expires_at).getTime() <= Date.now()) {
    return {
      status: 'expired',
      email: inviteRow.email,
      expiresAt: inviteRow.expires_at
    };
  }

  return {
    status: 'valid',
    email: inviteRow.email,
    expiresAt: inviteRow.expires_at
  };
}

async function fetchPasswordResetByToken(token, client = pool) {
  const tokenHash = hashToken(token);
  const result = await client.query(
    `
      SELECT
        r.id,
        r.user_id,
        r.expires_at,
        r.used_at,
        u.email
      FROM dashboard_password_resets r
      JOIN dashboard_users u ON u.id = r.user_id AND u.deleted = 0
      WHERE r.token_hash = $1
      LIMIT 1
    `,
    [tokenHash]
  );

  if (!result.rowCount) {
    return null;
  }

  return result.rows[0];
}

function mapPasswordResetStatus(resetRow) {
  if (!resetRow) {
    return { status: 'invalid' };
  }

  if (resetRow.used_at || new Date(resetRow.expires_at).getTime() <= Date.now()) {
    return {
      status: 'expired',
      email: resetRow.email,
      expiresAt: resetRow.expires_at
    };
  }

  return {
    status: 'valid',
    email: resetRow.email,
    expiresAt: resetRow.expires_at
  };
}

function canAccessDashboard(role) {
  return role === 'admin' || role === 'facility_manager';
}

router.post('/login', async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const email = payload.email.toLowerCase();

  try {
    const result = await pool.query(
      `
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.structure_id,
          s.name AS structure_name,
          u.email,
          u.role,
          u.password_hash,
          u.is_registered
        FROM dashboard_users u
        LEFT JOIN dashboard_structures s ON s.id = u.structure_id AND s.deleted = 0
        WHERE u.email = $1
          AND u.deleted = 0
        LIMIT 1
      `,
      [email]
    );

    if (!result.rowCount) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const user = result.rows[0];
    if (!user.is_registered) {
      return res.status(403).json({ message: 'Utente non ancora registrato' });
    }

    const isValid = await verifyPassword(payload.password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    if (!canAccessDashboard(user.role)) {
      return res.status(403).json({ message: 'Questo account non puo accedere alla dashboard' });
    }

    await pool.query('DELETE FROM dashboard_sessions WHERE expires_at <= NOW()');
    const session = await createSession(user.id);

    return res.json({
      token: session.token,
      expiresAt: session.expiresAt,
      ...authPayload(user)
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireAuth, async (req, res) => {
  if (!canAccessDashboard(req.authSession.user.role)) {
    return res.status(403).json({ message: 'Questo account non puo accedere alla dashboard' });
  }
  return res.json(authPayload(req.authSession.user, req.authSession.impersonatedBy));
});

router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM dashboard_sessions WHERE token_hash = $1', [req.authSession.tokenHash]);
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

router.post('/impersonation/exit', requireAuth, async (req, res, next) => {
  const impersonatedBy = req.authSession.impersonatedBy;
  if (!impersonatedBy) {
    return res.status(400).json({ message: 'Sessione non in impersonazione' });
  }

  try {
    const userResult = await pool.query(
      `
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.structure_id,
          s.name AS structure_name,
          u.email,
          u.role,
          u.is_registered
        FROM dashboard_users u
        LEFT JOIN dashboard_structures s ON s.id = u.structure_id AND s.deleted = 0
        WHERE u.id = $1
          AND u.deleted = 0
        LIMIT 1
      `,
      [impersonatedBy.id]
    );

    if (!userResult.rowCount || !userResult.rows[0].is_registered) {
      return res.status(404).json({ message: 'Utente admin non disponibile' });
    }

    await pool.query('DELETE FROM dashboard_sessions WHERE token_hash = $1', [req.authSession.tokenHash]);
    const session = await createSession(impersonatedBy.id);
    const user = userResult.rows[0];
    if (!canAccessDashboard(user.role)) {
      return res.status(403).json({ message: 'Questo account non puo accedere alla dashboard' });
    }

    return res.json({
      token: session.token,
      expiresAt: session.expiresAt,
      ...authPayload(user)
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/invitations/:token', async (req, res, next) => {
  const token = String(req.params.token || '').trim();
  if (!token) {
    return res.status(400).json({ status: 'invalid' });
  }

  try {
    const invite = await fetchInviteByToken(token);
    const status = mapInviteStatus(invite);
    return res.json(status);
  } catch (error) {
    return next(error);
  }
});

router.post('/invitations/:token/complete', async (req, res, next) => {
  const token = String(req.params.token || '').trim();
  if (!token) {
    return res.status(400).json({ message: 'Token mancante' });
  }

  const parsed = completeRegistrationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const tokenHash = hashToken(token);
    const inviteResult = await client.query(
      `
        SELECT
          i.id,
          i.email,
          i.user_id,
          i.expires_at,
          i.used_at,
          u.is_registered
        FROM dashboard_invites i
        JOIN dashboard_users u ON u.id = i.user_id AND u.deleted = 0
        WHERE i.token_hash = $1
        FOR UPDATE
      `,
      [tokenHash]
    );

    if (!inviteResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'invalid', message: 'Invito non valido' });
    }

    const invite = inviteResult.rows[0];
    const inviteStatus = mapInviteStatus(invite);
    if (inviteStatus.status !== 'valid') {
      await client.query('ROLLBACK');
      return res.status(409).json({ ...inviteStatus, message: 'Invito non utilizzabile' });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    await client.query(
      `
        UPDATE dashboard_users
        SET password_hash = $1,
            is_registered = TRUE,
            updated_at = NOW()
        WHERE id = $2
      `,
      [passwordHash, invite.user_id]
    );

    await client.query(
      `
        UPDATE dashboard_invites
        SET used_at = NOW()
        WHERE id = $1
      `,
      [invite.id]
    );

    await client.query('COMMIT');

    const session = await createSession(invite.user_id);
    return res.json({
      completed: true,
      token: session.token,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.get('/password-resets/:token', async (req, res, next) => {
  const token = String(req.params.token || '').trim();
  if (!token) {
    return res.status(400).json({ status: 'invalid' });
  }

  try {
    const reset = await fetchPasswordResetByToken(token);
    const status = mapPasswordResetStatus(reset);
    return res.json(status);
  } catch (error) {
    return next(error);
  }
});

router.post('/password-resets/:token/complete', async (req, res, next) => {
  const token = String(req.params.token || '').trim();
  if (!token) {
    return res.status(400).json({ message: 'Token mancante' });
  }

  const parsed = completeRegistrationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const tokenHash = hashToken(token);
    const resetResult = await client.query(
      `
        SELECT
          r.id,
          r.user_id,
          r.expires_at,
          r.used_at,
          u.email
        FROM dashboard_password_resets r
        JOIN dashboard_users u ON u.id = r.user_id AND u.deleted = 0
        WHERE r.token_hash = $1
        FOR UPDATE
      `,
      [tokenHash]
    );

    if (!resetResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'invalid', message: 'Link reset non valido' });
    }

    const reset = resetResult.rows[0];
    const resetStatus = mapPasswordResetStatus(reset);
    if (resetStatus.status !== 'valid') {
      await client.query('ROLLBACK');
      return res.status(409).json({ ...resetStatus, message: 'Link reset non utilizzabile' });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    await client.query(
      `
        UPDATE dashboard_users
        SET password_hash = $1,
            is_registered = TRUE,
            updated_at = NOW()
        WHERE id = $2
      `,
      [passwordHash, reset.user_id]
    );

    await client.query(
      `
        UPDATE dashboard_password_resets
        SET used_at = NOW()
        WHERE id = $1
      `,
      [reset.id]
    );

    await client.query('COMMIT');

    return res.json({
      completed: true
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

export { router as authRouter };
