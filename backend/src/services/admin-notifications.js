import { env } from '../config/env.js';
import { pool } from '../db/pool.js';
import { sendPartnerRegistrationNotificationEmail, sendPaymentNotificationEmail } from './mailer.js';

const maxNotificationRecipients = 50;

function defaultRecipients() {
  const email = String(env.auth.adminEmail || '').trim().toLowerCase();
  return email ? [email] : [];
}

export function normalizeNotificationRecipients(value) {
  const rawItems = Array.isArray(value) ? value : String(value || '').split(/[,\n;]+/);
  const unique = new Set();

  for (const item of rawItems) {
    const normalized = String(item || '').trim().toLowerCase();
    if (!normalized) {
      continue;
    }
    unique.add(normalized);
    if (unique.size >= maxNotificationRecipients) {
      break;
    }
  }

  return Array.from(unique);
}

export function normalizeDashboardNotificationSettings(row) {
  const partnerRequestRecipients = Array.isArray(row?.partner_request_recipients)
    ? normalizeNotificationRecipients(row.partner_request_recipients)
    : defaultRecipients();
  const paymentRecipients = Array.isArray(row?.payment_recipients)
    ? normalizeNotificationRecipients(row.payment_recipients)
    : defaultRecipients();

  return {
    partnerRequestEnabled: row?.partner_request_enabled !== false,
    partnerRequestRecipients,
    paymentEnabled: row?.payment_enabled !== false,
    paymentRecipients,
    updatedAt: row?.updated_at || null,
    updatedBy: row?.updated_by || null
  };
}

export async function getDashboardNotificationSettings(client = pool) {
  const result = await client.query(
    `
      SELECT
        id,
        partner_request_enabled,
        partner_request_recipients,
        payment_enabled,
        payment_recipients,
        updated_at,
        updated_by
      FROM dashboard_notification_settings
      WHERE id = 1
      LIMIT 1
    `
  );

  if (result.rowCount) {
    return normalizeDashboardNotificationSettings(result.rows[0]);
  }

  const recipients = defaultRecipients();
  const inserted = await client.query(
    `
      INSERT INTO dashboard_notification_settings (
        id,
        partner_request_enabled,
        partner_request_recipients,
        payment_enabled,
        payment_recipients
      )
      VALUES (1, TRUE, $1::TEXT[], TRUE, $1::TEXT[])
      ON CONFLICT (id) DO UPDATE SET
        partner_request_enabled = COALESCE(dashboard_notification_settings.partner_request_enabled, EXCLUDED.partner_request_enabled),
        partner_request_recipients = COALESCE(dashboard_notification_settings.partner_request_recipients, EXCLUDED.partner_request_recipients),
        payment_enabled = COALESCE(dashboard_notification_settings.payment_enabled, EXCLUDED.payment_enabled),
        payment_recipients = COALESCE(dashboard_notification_settings.payment_recipients, EXCLUDED.payment_recipients)
      RETURNING
        id,
        partner_request_enabled,
        partner_request_recipients,
        payment_enabled,
        payment_recipients,
        updated_at,
        updated_by
    `,
    [recipients]
  );

  return normalizeDashboardNotificationSettings(inserted.rows[0]);
}

export async function saveDashboardNotificationSettings(input, updatedBy, client = pool) {
  const partnerRequestRecipients = normalizeNotificationRecipients(input?.partnerRequestRecipients);
  const paymentRecipients = normalizeNotificationRecipients(input?.paymentRecipients);

  const saved = await client.query(
    `
      INSERT INTO dashboard_notification_settings (
        id,
        partner_request_enabled,
        partner_request_recipients,
        payment_enabled,
        payment_recipients,
        updated_by,
        updated_at
      )
      VALUES (1, $1, $2::TEXT[], $3, $4::TEXT[], $5, NOW())
      ON CONFLICT (id) DO UPDATE SET
        partner_request_enabled = EXCLUDED.partner_request_enabled,
        partner_request_recipients = EXCLUDED.partner_request_recipients,
        payment_enabled = EXCLUDED.payment_enabled,
        payment_recipients = EXCLUDED.payment_recipients,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW()
      RETURNING
        id,
        partner_request_enabled,
        partner_request_recipients,
        payment_enabled,
        payment_recipients,
        updated_at,
        updated_by
    `,
    [
      Boolean(input?.partnerRequestEnabled),
      partnerRequestRecipients,
      Boolean(input?.paymentEnabled),
      paymentRecipients,
      updatedBy || null
    ]
  );

  return normalizeDashboardNotificationSettings(saved.rows[0]);
}

export async function notifyPartnerRegistrationRequest(request) {
  const settings = await getDashboardNotificationSettings();
  if (!settings.partnerRequestEnabled || !settings.partnerRequestRecipients.length) {
    return;
  }

  await sendPartnerRegistrationNotificationEmail({
    to: settings.partnerRequestRecipients,
    request
  });
}

export async function notifyPaymentCompleted(notification) {
  const settings = await getDashboardNotificationSettings();
  if (!settings.paymentEnabled || !settings.paymentRecipients.length) {
    return;
  }

  await sendPaymentNotificationEmail({
    to: settings.paymentRecipients,
    ...notification
  });
}
