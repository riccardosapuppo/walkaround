import crypto from 'crypto';
import express from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { requireAdmin, requireAuth } from '../auth/middleware.js';
import { createOpaqueToken, hashPassword, hashToken } from '../auth/security.js';
import { pool } from '../db/pool.js';
import { sendInvitationEmail } from '../services/mailer.js';

const router = express.Router();
const roleSchema = z.enum(['admin', 'facility_manager']);

const inviteSchema = z.object({
  email: z.string().trim().email(),
  role: roleSchema,
  origin: z.string().trim().url().optional()
});

const roleUpdateSchema = z.object({
  role: roleSchema
});

function normalizedOrigin(origin) {
  const fallback = new URL(env.appBaseOrigin);
  if (!origin) {
    return fallback.origin;
  }

  try {
    const parsed = new URL(origin);
    return parsed.origin;
  } catch {
    return fallback.origin;
  }
}

function inviteExpiryDate() {
  return new Date(Date.now() + env.auth.inviteTtlHours * 60 * 60 * 1000);
}

function sessionExpiryDate() {
  return new Date(Date.now() + env.auth.sessionTtlHours * 60 * 60 * 1000);
}

async function createImpersonatedSession(userId, impersonatedByUserId) {
  const token = createOpaqueToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = sessionExpiryDate();

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

router.post('/invitations', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = inviteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const invitedEmail = payload.email.toLowerCase();

  if (invitedEmail === req.authSession.user.email) {
    return res.status(400).json({ message: 'Non puoi invitare il tuo stesso account' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `
        SELECT id, email, is_registered
        FROM dashboard_users
        WHERE email = $1
        FOR UPDATE
      `,
      [invitedEmail]
    );

    let userId;
    if (!userResult.rowCount) {
      userId = `usr_${crypto.randomUUID()}`;
      const placeholderHash = await hashPassword(createOpaqueToken(24));
      await client.query(
        `
          INSERT INTO dashboard_users (id, email, password_hash, role, is_registered, invited_by)
          VALUES ($1, $2, $3, $4, FALSE, $5)
        `,
        [userId, invitedEmail, placeholderHash, payload.role, req.authSession.user.id]
      );
    } else {
      const existing = userResult.rows[0];
      if (existing.is_registered) {
        await client.query('ROLLBACK');
        return res.status(409).json({ message: 'Utente gia registrato' });
      }

      userId = existing.id;
      await client.query(
        `
          UPDATE dashboard_users
          SET invited_by = $1,
              role = $2,
              updated_at = NOW()
          WHERE id = $3
        `,
        [req.authSession.user.id, payload.role, userId]
      );
    }

    const rawToken = createOpaqueToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = inviteExpiryDate();

    await client.query(
      `
        INSERT INTO dashboard_invites (email, user_id, token_hash, invited_by, expires_at)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [invitedEmail, userId, tokenHash, req.authSession.user.id, expiresAt.toISOString()]
    );

    const origin = normalizedOrigin(payload.origin);
    const invitationLink = `${origin}/auth/complete-registration?token=${encodeURIComponent(rawToken)}`;

    await sendInvitationEmail({
      to: invitedEmail,
      invitationLink,
      invitedByEmail: req.authSession.user.email,
      expiresAt: expiresAt.toISOString()
    });

    await client.query('COMMIT');

    return res.json({
      invited: true,
      email: invitedEmail,
      role: payload.role,
      expiresAt: expiresAt.toISOString()
    });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_MODULE_NOT_FOUND') {
      return res.status(500).json({ message: 'Nodemailer non installato. Esegui npm install nel backend.' });
    }

    return next(error);
  } finally {
    client.release();
  }
});

router.get('/users', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const result = await pool.query(
      `
        SELECT
          u.id,
          u.email,
          u.role,
          u.is_registered,
          u.created_at,
          u.updated_at,
          inviter.email AS invited_by_email
        FROM dashboard_users u
        LEFT JOIN dashboard_users inviter ON inviter.id = u.invited_by
        ORDER BY u.created_at ASC
      `
    );

    return res.json(
      result.rows.map((row) => ({
        id: row.id,
        email: row.email,
        role: row.role,
        isRegistered: row.is_registered,
        invitedByEmail: row.invited_by_email,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
    );
  } catch (error) {
    return next(error);
  }
});

router.patch('/users/:userId/role', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = roleUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const userId = String(req.params.userId || '').trim();
  if (!userId) {
    return res.status(400).json({ message: 'User non valido' });
  }

  if (userId === req.authSession.user.id && parsed.data.role !== 'admin') {
    return res.status(400).json({ message: 'Non puoi rimuovere il tuo ruolo admin' });
  }

  try {
    const update = await pool.query(
      `
        UPDATE dashboard_users
        SET role = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING id, email, role, is_registered, updated_at
      `,
      [parsed.data.role, userId]
    );

    if (!update.rowCount) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const row = update.rows[0];
    return res.json({
      id: row.id,
      email: row.email,
      role: row.role,
      isRegistered: row.is_registered,
      updatedAt: row.updated_at
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/users/:userId/impersonate', requireAuth, requireAdmin, async (req, res, next) => {
  const userId = String(req.params.userId || '').trim();
  if (!userId) {
    return res.status(400).json({ message: 'User non valido' });
  }

  if (userId === req.authSession.user.id) {
    return res.status(400).json({ message: 'Sei gia questo utente' });
  }

  try {
    const targetResult = await pool.query(
      `
        SELECT id, email, role, is_registered
        FROM dashboard_users
        WHERE id = $1
        LIMIT 1
      `,
      [userId]
    );

    if (!targetResult.rowCount) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const target = targetResult.rows[0];
    if (!target.is_registered) {
      return res.status(409).json({ message: 'Utente non ancora registrato' });
    }

    await pool.query('DELETE FROM dashboard_sessions WHERE expires_at <= NOW()');
    await pool.query('DELETE FROM dashboard_sessions WHERE token_hash = $1', [req.authSession.tokenHash]);
    const session = await createImpersonatedSession(target.id, req.authSession.user.id);

    return res.json({
      token: session.token,
      expiresAt: session.expiresAt,
      user: {
        id: target.id,
        email: target.email,
        role: target.role
      },
      session: {
        isImpersonating: true,
        impersonatedBy: {
          id: req.authSession.user.id,
          email: req.authSession.user.email
        }
      }
    });
  } catch (error) {
    return next(error);
  }
});

export { router as adminRouter };
