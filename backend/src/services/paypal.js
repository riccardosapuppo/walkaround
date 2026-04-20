import { pool } from '../db/pool.js';

class PayPalConfigurationError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'PayPalConfigurationError';
    this.status = status;
    this.details = details;
  }
}

function normalizePayPalMode(value) {
  return String(value || '').trim().toLowerCase() === 'live' ? 'live' : 'sandbox';
}

function normalizeText(value) {
  const text = String(value || '').trim();
  return text || null;
}

function mapPayPalSettingsRow(row) {
  if (!row) {
    return {
      id: 1,
      isEnabled: false,
      mode: 'sandbox',
      clientId: null,
      clientSecret: null,
      merchantId: null,
      merchantEmail: null,
      brandName: 'Walk Around',
      webhookId: null,
      currencyCode: 'EUR',
      lastVerifiedAt: null,
      lastVerificationStatus: 'incomplete',
      lastVerificationError: null,
      updatedAt: null,
      updatedBy: null
    };
  }

  const mode = normalizePayPalMode(row.mode);
  return {
    id: Number(row.id || 1),
    isEnabled: Boolean(row.is_enabled),
    mode,
    clientId: normalizeText(row.client_id),
    clientSecret: normalizeText(row.client_secret),
    merchantId: normalizeText(row.merchant_id),
    merchantEmail: normalizeText(row.merchant_email),
    brandName: normalizeText(row.brand_name) || 'Walk Around',
    webhookId: normalizeText(row.webhook_id),
    currencyCode: normalizeText(row.currency_code) || 'EUR',
    lastVerifiedAt: row.last_verified_at || null,
    lastVerificationStatus: normalizeText(row.last_verification_status) || 'incomplete',
    lastVerificationError: normalizeText(row.last_verification_error),
    updatedAt: row.updated_at || null,
    updatedBy: normalizeText(row.updated_by)
  };
}

function isPayPalSettingsComplete(settings) {
  return Boolean(settings?.isEnabled && settings?.clientId && settings?.clientSecret);
}

function paypalApiBaseUrl(mode) {
  return normalizePayPalMode(mode) === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

function paypalProviderLabel(mode) {
  return normalizePayPalMode(mode) === 'live' ? 'PayPal Live' : 'PayPal Sandbox';
}

async function getPayPalSettings(client = pool) {
  const result = await client.query(
    `
      SELECT
        id,
        is_enabled,
        mode,
        client_id,
        client_secret,
        merchant_id,
        merchant_email,
        brand_name,
        webhook_id,
        currency_code,
        last_verified_at,
        last_verification_status,
        last_verification_error,
        updated_at,
        updated_by
      FROM dashboard_paypal_settings
      WHERE id = 1
      LIMIT 1
    `
  );

  return mapPayPalSettingsRow(result.rows[0] || null);
}

function ensurePayPalSettingsReady(settings) {
  if (!settings?.isEnabled) {
    throw new PayPalConfigurationError('PayPal non e attivo nella dashboard.', 503);
  }
  if (!settings?.clientId || !settings?.clientSecret) {
    throw new PayPalConfigurationError('Configurazione PayPal incompleta: client ID o client secret mancanti.', 503);
  }
}

function parsePayPalErrorMessage(payload, fallback) {
  if (payload && typeof payload === 'object') {
    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message.trim();
    }

    if (Array.isArray(payload.details) && payload.details.length) {
      const firstIssue = payload.details[0];
      if (firstIssue && typeof firstIssue === 'object') {
        const description = typeof firstIssue.description === 'string' ? firstIssue.description.trim() : '';
        const issue = typeof firstIssue.issue === 'string' ? firstIssue.issue.trim() : '';
        if (description && issue) {
          return `${issue}: ${description}`;
        }
        if (description) {
          return description;
        }
        if (issue) {
          return issue;
        }
      }
    }
  }

  return fallback;
}

async function requestPayPalAccessToken(settings) {
  ensurePayPalSettingsReady(settings);

  const credentials = Buffer.from(`${settings.clientId}:${settings.clientSecret}`, 'utf8').toString('base64');
  const response = await fetch(`${paypalApiBaseUrl(settings.mode)}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = parsePayPalErrorMessage(payload, 'Impossibile autenticare le credenziali PayPal.');
    throw new PayPalConfigurationError(message, response.status || 502, payload);
  }

  if (!payload?.access_token) {
    throw new PayPalConfigurationError('PayPal non ha restituito un access token valido.', 502, payload);
  }

  return payload;
}

async function verifyPayPalConnection(settings) {
  const tokenPayload = await requestPayPalAccessToken(settings);
  return {
    valid: true,
    tokenType: tokenPayload.token_type || 'Bearer',
    expiresIn: Number(tokenPayload.expires_in || 0) || 0,
    scope: typeof tokenPayload.scope === 'string' ? tokenPayload.scope : ''
  };
}

async function paypalApiRequest(settings, accessToken, requestPath, options = {}) {
  const response = await fetch(`${paypalApiBaseUrl(settings.mode)}${requestPath}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = parsePayPalErrorMessage(payload, 'Richiesta PayPal non riuscita.');
    throw new PayPalConfigurationError(message, response.status || 502, payload);
  }

  return payload;
}

export {
  PayPalConfigurationError,
  getPayPalSettings,
  isPayPalSettingsComplete,
  mapPayPalSettingsRow,
  normalizePayPalMode,
  paypalApiBaseUrl,
  paypalApiRequest,
  paypalProviderLabel,
  requestPayPalAccessToken,
  verifyPayPalConnection
};
