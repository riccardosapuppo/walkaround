import express from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { requireAppAuth } from '../auth/app-middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { createOpaqueToken, hashPassword, hashToken, verifyPassword } from '../auth/security.js';
import { pool } from '../db/pool.js';
import { createSession as createDashboardSession } from './auth.js';
import { sendPasswordResetEmail } from '../services/mailer.js';
import { origniDelSito, pickOrigin } from '../auth/origins.js';

const router = express.Router();

const passwordSchema = z
  .string()
  .min(8, 'La password deve avere almeno 8 caratteri')
  .max(120, 'La password è troppo lunga');

const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1, 'Il cognome è obbligatorio').max(80),
  email: z.string().trim().email(),
  password: passwordSchema,
  clientUserId: z.string().trim().min(1).max(120).optional()
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  clientUserId: z.string().trim().min(1).max(120).optional()
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
  origin: z.string().trim().min(1).max(300).optional()
});

const completeResetSchema = z.object({
  password: passwordSchema
});

function appSessionExpiryDate() {
  return new Date(Date.now() + env.auth.sessionTtlHours * 60 * 60 * 1000);
}

function appPasswordResetExpiryDate() {
  return new Date(Date.now() + env.auth.passwordResetTtlHours * 60 * 60 * 1000);
}

/**
 * L'origine su cui costruire un link mandato per posta.
 *
 * Prendeva l'origine dal corpo della richiesta e controllava solo lo schema:
 * chi voleva si faceva mandare dalla vittima un token di reset valido
 * puntato al proprio server. Vedi auth/origins.js, che spiega perche' la
 * domanda giusta non e' 'e' una URL ben formata' ma 'e' una delle nostre'.
 */
const dove = origniDelSito(env);

function normalizeOrigin(value) {
  return pickOrigin(value, dove);
}

function appUserPayload(row) {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name || row.firstName || '',
    lastName: row.last_name || row.lastName || ''
  };
}

function dashboardAuthPayload(user, session) {
  return {
    token: session.token,
    expiresAt: session.expiresAt,
    user: {
      id: user.id,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      structureId: user.structure_id || null,
      structureName: user.structure_name || null,
      email: user.email,
      role: user.role
    },
    session: {
      isImpersonating: false,
      impersonatedBy: null
    }
  };
}

function canAccessDashboard(role) {
  return role === 'admin' || role === 'facility_manager';
}

async function createDashboardSessionForAppLogin(email, password) {
  const dashboardUser = await fetchDashboardUserByEmail(email);
  if (!dashboardUser || !dashboardUser.is_registered || !canAccessDashboard(dashboardUser.role)) {
    return null;
  }

  const isDashboardPasswordValid = await verifyPassword(password, dashboardUser.password_hash);
  if (!isDashboardPasswordValid) {
    return null;
  }

  const dashboardSession = await createDashboardSession(dashboardUser.id);
  return dashboardAuthPayload(dashboardUser, dashboardSession);
}

async function upsertAppUserFromDashboardUser(dashboardUser, client = pool) {
  const existing = await client.query(
    `
      SELECT id, email, first_name, last_name
      FROM app_users
      WHERE email = $1
      LIMIT 1
    `,
    [dashboardUser.email]
  );

  if (existing.rowCount) {
    const updated = await client.query(
      `
        UPDATE app_users
        SET first_name = $2,
            last_name = $3,
            password_hash = $4,
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, email, first_name, last_name
      `,
      [
        existing.rows[0].id,
        dashboardUser.first_name || dashboardUser.firstName || '',
        dashboardUser.last_name || dashboardUser.lastName || '',
        dashboardUser.password_hash
      ]
    );
    return updated.rows[0];
  }

  const inserted = await client.query(
    `
      INSERT INTO app_users (id, email, first_name, last_name, password_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name
    `,
    [
      dashboardUser.id,
      dashboardUser.email,
      dashboardUser.first_name || dashboardUser.firstName || '',
      dashboardUser.last_name || dashboardUser.lastName || '',
      dashboardUser.password_hash
    ]
  );

  return inserted.rows[0];
}

async function fetchDashboardUserByEmail(email, client = pool) {
  const result = await client.query(
    `
      SELECT
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.password_hash,
        u.role,
        u.structure_id,
        s.name AS structure_name,
        u.is_registered
      FROM dashboard_users u
      LEFT JOIN dashboard_structures s ON s.id = u.structure_id AND s.deleted = 0
      WHERE u.email = $1
        AND u.deleted = 0
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0] || null;
}

async function fetchDashboardUserById(userId, client = pool) {
  const result = await client.query(
    `
      SELECT
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.password_hash,
        u.role,
        u.structure_id,
        s.name AS structure_name,
        u.is_registered
      FROM dashboard_users u
      LEFT JOIN dashboard_structures s ON s.id = u.structure_id AND s.deleted = 0
      WHERE u.id = $1
        AND u.deleted = 0
      LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] || null;
}

async function createAppSession(userId, client = pool) {
  const token = createOpaqueToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = appSessionExpiryDate();

  await client.query(
    `
      INSERT INTO app_sessions (token_hash, user_id, expires_at)
      VALUES ($1, $2, $3)
    `,
    [tokenHash, userId, expiresAt.toISOString()]
  );

  return {
    token,
    expiresAt: expiresAt.toISOString()
  };
}

/**
 * Sposta su un account gli acquisti fatti da ospite.
 *
 * QUESTA FUNZIONE SI FIDA DELLO `userId` CHE ARRIVA NEL CORPO DELLA
 * RICHIESTA, ed e' una scelta, non una svista. Va scritta perche' e' l'unico
 * punto del progetto dove un dato non verificato decide di chi sono dei soldi.
 *
 * Chi compra senza registrarsi e' identificato da un uuid che il browser si
 * genera al primo avvio e si tiene in locale. Non c'e' nessun token da
 * chiedere, perche' quell'uuid E' tutto quello che l'ospite ha: pretendere
 * una prova vorrebbe dire non far comprare nessuno senza account, che e' una
 * decisione di prodotto e non una correzione.
 *
 * Il danno e' limitato da due cose, e nessuna delle due e' una difesa:
 *   - le righe di partenza vengono SPOSTATE, non copiate, quindi di fatto la
 *     migrazione riesce una volta sola per ogni uuid;
 *   - un uuid v4 non si indovina.
 *
 * Ma chi lo VEDESSE — e fino a poco fa viaggiava nelle query string, quindi
 * nei log di ogni proxy davanti — potrebbe registrarsi e rivendicare gli
 * acquisti di quell'ospite. La query string e' stata tolta dal log
 * dell'applicazione (`server.js`), il che riduce la superficie e non la
 * chiude.
 *
 * IL MODO GIUSTO, non fatto: legare l'uuid alla sessione che l'ha creato —
 * un cookie firmato dal server al primo contatto, che l'ospite non sceglie e
 * non puo' presentare per conto di un altro. Vuol dire toccare il flusso di
 * acquisto degli ospiti, che e' la parte che porta i soldi, e non si fa senza
 * poterla provare davvero. E' dichiarato fra i limiti nel README.
 */
async function migrateClientUserDataToAppUser(clientUserId, appUserId, client = pool) {
  const sourceUserId = String(clientUserId || '').trim();
  const targetUserId = String(appUserId || '').trim();
  if (!sourceUserId || !targetUserId || sourceUserId === targetUserId) {
    return;
  }

  const sourceRegisteredUser = await client.query('SELECT 1 FROM app_users WHERE id = $1 LIMIT 1', [sourceUserId]);
  if (sourceRegisteredUser.rowCount) {
    return;
  }

  const sourceStructureLink = await client.query(
    `
      SELECT structure_id, discount_code_id, invite_code, associated_at
      FROM app_user_structure_links
      WHERE user_id = $1
      LIMIT 1
    `,
    [sourceUserId]
  );
  if (sourceStructureLink.rowCount) {
    const link = sourceStructureLink.rows[0];
    await client.query(
      `
        INSERT INTO app_user_structure_links (
          user_id,
          structure_id,
          discount_code_id,
          invite_code,
          associated_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          structure_id = EXCLUDED.structure_id,
          discount_code_id = EXCLUDED.discount_code_id,
          invite_code = EXCLUDED.invite_code,
          updated_at = NOW()
      `,
      [targetUserId, link.structure_id, link.discount_code_id || null, link.invite_code, link.associated_at]
    );
    await client.query('DELETE FROM app_user_structure_links WHERE user_id = $1', [sourceUserId]);
  }

  await client.query(
    `
      INSERT INTO app_user_discount_code_uses (
        user_id,
        discount_code_id,
        structure_id,
        invite_code,
        purchase_type,
        used_at
      )
      SELECT
        $2,
        discount_code_id,
        structure_id,
        invite_code,
        purchase_type,
        used_at
      FROM app_user_discount_code_uses
      WHERE user_id = $1
      ON CONFLICT (user_id, invite_code) DO NOTHING
    `,
    [sourceUserId, targetUserId]
  );
  await client.query('DELETE FROM app_user_discount_code_uses WHERE user_id = $1', [sourceUserId]);
  await client.query('UPDATE purchases SET user_id = $2 WHERE user_id = $1', [sourceUserId, targetUserId]);
  await client.query('UPDATE paypal_checkout_orders SET user_id = $2 WHERE user_id = $1', [sourceUserId, targetUserId]);
}

async function fetchResetByToken(token, client = pool) {
  const tokenHash = hashToken(token);
  const result = await client.query(
    `
      SELECT
        r.id,
        r.user_id,
        r.expires_at,
        r.used_at,
        u.email
      FROM app_password_resets r
      JOIN app_users u ON u.id = r.user_id
      WHERE r.token_hash = $1
      LIMIT 1
    `,
    [tokenHash]
  );

  return result.rows[0] || null;
}

function mapResetStatus(row) {
  if (!row) {
    return { status: 'invalid' };
  }
  if (row.used_at || new Date(row.expires_at).getTime() <= Date.now()) {
    return {
      status: 'expired',
      email: row.email,
      expiresAt: row.expires_at
    };
  }
  return {
    status: 'valid',
    email: row.email,
    expiresAt: row.expires_at
  };
}

router.post('/register', async (req, res, next) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const email = payload.email.toLowerCase();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id FROM app_users WHERE email = $1 LIMIT 1', [email]);
    if (existing.rowCount) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Email già registrata' });
    }

    const passwordHash = await hashPassword(payload.password);
    const id = `app_${createOpaqueToken(12)}`;
    const inserted = await client.query(
      `
        INSERT INTO app_users (id, email, first_name, last_name, password_hash)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, first_name, last_name
      `,
      [id, email, payload.firstName, payload.lastName || '', passwordHash]
    );

    await migrateClientUserDataToAppUser(payload.clientUserId, id, client);
    const session = await createAppSession(id, client);
    await client.query('COMMIT');

    return res.status(201).json({
      token: session.token,
      expiresAt: session.expiresAt,
      user: appUserPayload(inserted.rows[0])
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.post('/login', async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const result = await pool.query(
      `
        SELECT id, email, first_name, last_name, password_hash
        FROM app_users
        WHERE email = $1
        LIMIT 1
      `,
      [email]
    );
    const user = result.rows[0] || null;
    if (user && (await verifyPassword(parsed.data.password, user.password_hash))) {
      const client = await pool.connect();
      let session;
      try {
        await client.query('BEGIN');
        await migrateClientUserDataToAppUser(parsed.data.clientUserId, user.id, client);
        await client.query('DELETE FROM app_sessions WHERE expires_at <= NOW()');
        session = await createAppSession(user.id, client);
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
      const dashboardSession = await createDashboardSessionForAppLogin(email, parsed.data.password);
      return res.json({
        token: session.token,
        expiresAt: session.expiresAt,
        user: appUserPayload(user),
        dashboardSession
      });
    }

    const dashboardUser = await fetchDashboardUserByEmail(email);
    if (
      !dashboardUser ||
      !dashboardUser.is_registered ||
      !(await verifyPassword(parsed.data.password, dashboardUser.password_hash))
    ) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const client = await pool.connect();
    let syncedAppUser;
    let session;
    try {
      await client.query('BEGIN');
      syncedAppUser = await upsertAppUserFromDashboardUser(dashboardUser, client);
      await migrateClientUserDataToAppUser(parsed.data.clientUserId, syncedAppUser.id, client);
      await client.query('DELETE FROM app_sessions WHERE expires_at <= NOW()');
      session = await createAppSession(syncedAppUser.id, client);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    const dashboardSession =
      canAccessDashboard(dashboardUser.role)
        ? await createDashboardSession(dashboardUser.id)
        : null;

    return res.json({
      token: session.token,
      expiresAt: session.expiresAt,
      user: appUserPayload(syncedAppUser),
      dashboardSession: dashboardSession ? dashboardAuthPayload(dashboardUser, dashboardSession) : null
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/dashboard-session', requireAuth, async (req, res, next) => {
  try {
    const dashboardUser = await fetchDashboardUserById(req.authSession.user.id);
    if (!dashboardUser || !dashboardUser.is_registered) {
      return res.status(404).json({ message: 'Account dashboard non disponibile' });
    }

    const appUser = await upsertAppUserFromDashboardUser(dashboardUser);
    await pool.query('DELETE FROM app_sessions WHERE expires_at <= NOW()');
    const session = await createAppSession(appUser.id);

    return res.json({
      token: session.token,
      expiresAt: session.expiresAt,
      user: appUserPayload(appUser)
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireAppAuth, async (req, res) => {
  return res.json({ user: req.appAuthSession.user });
});

router.post('/logout', requireAppAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM app_sessions WHERE token_hash = $1', [req.appAuthSession.tokenHash]);
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

router.post('/password-reset', async (req, res, next) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const email = parsed.data.email.toLowerCase();
  const origin = normalizeOrigin(parsed.data.origin);

  try {
    const userResult = await pool.query('SELECT id, email FROM app_users WHERE email = $1 LIMIT 1', [email]);
    if (userResult.rowCount) {
      const user = userResult.rows[0];
      const token = createOpaqueToken(32);
      const tokenHash = hashToken(token);
      const expiresAt = appPasswordResetExpiryDate();

      await pool.query(
        `
          INSERT INTO app_password_resets (user_id, token_hash, expires_at)
          VALUES ($1, $2, $3)
        `,
        [user.id, tokenHash, expiresAt.toISOString()]
      );

      const resetLink = `${origin}/auth/app-password-reset?token=${encodeURIComponent(token)}`;

      /**
       * Se l'invio fallisce, questa rotta risponde 200 lo stesso.
       *
       * Non e' indulgenza verso un guasto: e' l'unica risposta che non dice
       * niente. Questa rotta la chiama chiunque, senza autenticarsi, con
       * qualunque indirizzo. Se un'email inesistente da' 200 e una vera da'
       * 500 — perche' solo per quella si prova a spedire, e la posta puo' non
       * essere configurata — la coppia di risposte diventa un elenco degli
       * iscritti consultabile a piacere, una email per volta.
       *
       * E' lo stesso ragionamento per cui `pickOrigin` (`auth/origins.js`) non
       * solleva mai: quel file spiega che la rotta deve rispondere sempre
       * uguale, e poi la rotta lo faceva per l'origine e non per l'invio.
       *
       * Il guasto non sparisce: va nel log del server, dove lo legge chi
       * gestisce la macchina e non chi sta provando gli indirizzi.
       */
      try {
        await sendPasswordResetEmail({
          to: user.email,
          resetLink,
          requestedByEmail: user.email,
          expiresAt: expiresAt.toISOString()
        });
      } catch (error) {
        console.error('[app-auth] invio del reset password fallito:', error instanceof Error ? error.message : error);
      }
    }

    return res.json({ sent: true });
  } catch (error) {
    return next(error);
  }
});

router.get('/password-resets/:token', async (req, res, next) => {
  const token = String(req.params.token || '').trim();
  if (!token) {
    return res.status(400).json({ status: 'invalid' });
  }

  try {
    return res.json(mapResetStatus(await fetchResetByToken(token)));
  } catch (error) {
    return next(error);
  }
});

router.post('/password-resets/:token/complete', async (req, res, next) => {
  const token = String(req.params.token || '').trim();
  if (!token) {
    return res.status(400).json({ status: 'invalid', message: 'Token mancante' });
  }

  const parsed = completeResetSchema.safeParse(req.body);
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
        FROM app_password_resets r
        JOIN app_users u ON u.id = r.user_id
        WHERE r.token_hash = $1
        FOR UPDATE
      `,
      [tokenHash]
    );

    const reset = resetResult.rows[0] || null;
    const status = mapResetStatus(reset);
    if (status.status !== 'valid') {
      await client.query('ROLLBACK');
      return res.status(409).json({ ...status, message: 'Link reset non utilizzabile' });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    await client.query(
      `
        UPDATE app_users
        SET password_hash = $1,
            updated_at = NOW()
        WHERE id = $2
      `,
      [passwordHash, reset.user_id]
    );
    await client.query('UPDATE app_password_resets SET used_at = NOW() WHERE id = $1', [reset.id]);
    await client.query('DELETE FROM app_sessions WHERE user_id = $1', [reset.user_id]);
    await client.query('COMMIT');

    return res.json({ completed: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

export { router as appAuthRouter };
