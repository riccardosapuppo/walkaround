import { env } from '../config/env.js';
import { pool } from '../db/pool.js';

const defaultLastTestStatus = 'untested';

function normalizeEmailText(value, fallback = '') {
  return String(value ?? fallback ?? '').trim();
}

function normalizeEmailPassword(value, fallback = '') {
  return String(value ?? fallback ?? '');
}

function normalizeEmailPort(value, fallback = env.smtp.port) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 65535 ? parsed : fallback;
}

function defaultEmailSettings() {
  return {
    host: normalizeEmailText(env.smtp.host),
    port: normalizeEmailPort(env.smtp.port),
    secure: Boolean(env.smtp.secure),
    user: normalizeEmailText(env.smtp.user),
    password: normalizeEmailPassword(env.smtp.password),
    from: normalizeEmailText(env.smtp.from),
    lastTestedAt: null,
    lastTestStatus: defaultLastTestStatus,
    lastTestError: null,
    updatedAt: null,
    updatedBy: null
  };
}

export function normalizeDashboardEmailSettings(row) {
  const defaults = defaultEmailSettings();
  const secureValue = row?.secure ?? row?.smtp_secure;
  return {
    host: normalizeEmailText(row?.host ?? row?.smtp_host, defaults.host),
    port: normalizeEmailPort(row?.port ?? row?.smtp_port, defaults.port),
    secure: secureValue == null ? defaults.secure : secureValue !== false,
    user: normalizeEmailText(row?.user ?? row?.smtp_user, defaults.user),
    password: normalizeEmailPassword(row?.password ?? row?.smtp_password, defaults.password),
    from: normalizeEmailText(row?.from ?? row?.smtp_from, defaults.from),
    lastTestedAt: row?.lastTestedAt ?? row?.last_tested_at ?? null,
    lastTestStatus: normalizeEmailText(row?.lastTestStatus ?? row?.last_test_status, defaultLastTestStatus) || defaultLastTestStatus,
    lastTestError: row?.lastTestError ?? row?.last_test_error ?? null,
    updatedAt: row?.updatedAt ?? row?.updated_at ?? null,
    updatedBy: row?.updatedBy ?? row?.updated_by ?? null
  };
}

export function mapDashboardEmailSettingsForResponse(settings) {
  const normalized = normalizeDashboardEmailSettings(settings);
  return {
    host: normalized.host,
    port: normalized.port,
    secure: normalized.secure,
    user: normalized.user,
    hasPassword: Boolean(normalized.password),
    from: normalized.from,
    lastTestedAt: normalized.lastTestedAt,
    lastTestStatus: normalized.lastTestStatus,
    lastTestError: normalized.lastTestError,
    updatedAt: normalized.updatedAt,
    updatedBy: normalized.updatedBy
  };
}

export async function getDashboardEmailSettings(client = pool) {
  const result = await client.query(
    `
      SELECT
        id,
        smtp_host,
        smtp_port,
        smtp_secure,
        smtp_user,
        smtp_password,
        smtp_from,
        last_tested_at,
        last_test_status,
        last_test_error,
        updated_at,
        updated_by
      FROM dashboard_email_settings
      WHERE id = 1
      LIMIT 1
    `
  );

  if (result.rowCount) {
    return normalizeDashboardEmailSettings(result.rows[0]);
  }

  const defaults = defaultEmailSettings();
  const inserted = await client.query(
    `
      INSERT INTO dashboard_email_settings (
        id,
        smtp_host,
        smtp_port,
        smtp_secure,
        smtp_user,
        smtp_password,
        smtp_from
      )
      VALUES (1, $1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        smtp_host = COALESCE(dashboard_email_settings.smtp_host, EXCLUDED.smtp_host),
        smtp_port = COALESCE(dashboard_email_settings.smtp_port, EXCLUDED.smtp_port),
        smtp_secure = COALESCE(dashboard_email_settings.smtp_secure, EXCLUDED.smtp_secure),
        smtp_user = COALESCE(dashboard_email_settings.smtp_user, EXCLUDED.smtp_user),
        smtp_password = COALESCE(dashboard_email_settings.smtp_password, EXCLUDED.smtp_password),
        smtp_from = COALESCE(dashboard_email_settings.smtp_from, EXCLUDED.smtp_from)
      RETURNING
        id,
        smtp_host,
        smtp_port,
        smtp_secure,
        smtp_user,
        smtp_password,
        smtp_from,
        last_tested_at,
        last_test_status,
        last_test_error,
        updated_at,
        updated_by
    `,
    [defaults.host, defaults.port, defaults.secure, defaults.user, defaults.password, defaults.from]
  );

  return normalizeDashboardEmailSettings(inserted.rows[0]);
}

export async function saveDashboardEmailSettings(input, updatedBy, client = pool) {
  const current = await getDashboardEmailSettings(client);
  const passwordInput = Object.prototype.hasOwnProperty.call(input || {}, 'password') ? normalizeEmailPassword(input.password) : '';
  const password = input?.clearPassword ? '' : passwordInput || current.password;

  const saved = await client.query(
    `
      INSERT INTO dashboard_email_settings (
        id,
        smtp_host,
        smtp_port,
        smtp_secure,
        smtp_user,
        smtp_password,
        smtp_from,
        last_test_status,
        last_test_error,
        updated_by,
        updated_at
      )
      VALUES (1, $1, $2, $3, $4, $5, $6, 'untested', NULL, $7, NOW())
      ON CONFLICT (id) DO UPDATE SET
        smtp_host = EXCLUDED.smtp_host,
        smtp_port = EXCLUDED.smtp_port,
        smtp_secure = EXCLUDED.smtp_secure,
        smtp_user = EXCLUDED.smtp_user,
        smtp_password = EXCLUDED.smtp_password,
        smtp_from = EXCLUDED.smtp_from,
        last_test_status = 'untested',
        last_test_error = NULL,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW()
      RETURNING
        id,
        smtp_host,
        smtp_port,
        smtp_secure,
        smtp_user,
        smtp_password,
        smtp_from,
        last_tested_at,
        last_test_status,
        last_test_error,
        updated_at,
        updated_by
    `,
    [
      normalizeEmailText(input?.host),
      normalizeEmailPort(input?.port),
      input?.secure !== false,
      normalizeEmailText(input?.user),
      password,
      normalizeEmailText(input?.from),
      updatedBy || null
    ]
  );

  return normalizeDashboardEmailSettings(saved.rows[0]);
}

export async function markDashboardEmailSettingsTestResult({ valid, error }, client = pool) {
  const saved = await client.query(
    `
      UPDATE dashboard_email_settings
      SET last_tested_at = NOW(),
          last_test_status = $1,
          last_test_error = $2,
          updated_at = NOW()
      WHERE id = 1
      RETURNING
        id,
        smtp_host,
        smtp_port,
        smtp_secure,
        smtp_user,
        smtp_password,
        smtp_from,
        last_tested_at,
        last_test_status,
        last_test_error,
        updated_at,
        updated_by
    `,
    [valid ? 'valid' : 'invalid', valid ? null : normalizeEmailText(error, 'Invio email di test non riuscito.')]
  );

  if (saved.rowCount) {
    return normalizeDashboardEmailSettings(saved.rows[0]);
  }

  return getDashboardEmailSettings(client);
}
