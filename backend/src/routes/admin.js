import crypto from 'crypto';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { env } from '../config/env.js';
import { requireAdmin, requireAuth, resolveSessionUser } from '../auth/middleware.js';
import { createOpaqueToken, hashPassword, hashToken } from '../auth/security.js';
import { pool } from '../db/pool.js';
import {
  getDashboardEmailSettings,
  mapDashboardEmailSettingsForResponse,
  markDashboardEmailSettingsTestResult,
  saveDashboardEmailSettings
} from '../services/email-settings.js';
import {
  getDashboardNotificationSettings,
  normalizeNotificationRecipients,
  saveDashboardNotificationSettings
} from '../services/admin-notifications.js';
import {
  sendDashboardEmailSettingsTestEmail,
  sendPartnerActivationEmail,
  sendInvitationEmail,
  sendPartnerApprovalEmail,
  sendPartnerRejectionEmail,
  sendPasswordResetEmail
} from '../services/mailer.js';
import { buildPartnerPromotionFileName, buildPartnerPromotionPdf } from '../services/partner-pdf.js';
import { DEFAULT_PARTNER_EMAIL_SETTINGS, PARTNER_EMAIL_TEMPLATE_PLACEHOLDERS } from '../services/partner-email-templates.js';
import {
  PayPalConfigurationError,
  getPayPalSettings,
  mapPayPalSettingsRow,
  normalizePayPalMode,
  paypalProviderLabel,
  verifyPayPalConnection
} from '../services/paypal.js';
import {
  DEFAULT_OPENAI_TRANSLATION_MODEL,
  DEFAULT_OPENAI_TTS_INSTRUCTIONS,
  DEFAULT_OPENAI_TTS_MODEL,
  DEFAULT_OPENAI_TTS_VOICE,
  OpenAITranslationError,
  normalizeOpenAITranslationModel,
  normalizeOpenAITtsInstructions,
  normalizeOpenAITtsModel,
  normalizeOpenAITtsVoice,
  generateSpeechWithOpenAI,
  translateHtmlWithOpenAI,
  translatePoiWithOpenAI
} from '../services/openai-translations.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicRootDir = path.resolve(__dirname, '../../public');
const publicAudioRootDir = path.resolve(__dirname, '../../public/audio');
const publicImagesRootDir = path.resolve(__dirname, '../../public/images');
const privacyPolicyLanguages = ['it', 'en', 'fr', 'es', 'de', 'pl'];
const privacyPolicyTargetLanguages = ['en', 'fr', 'es', 'de', 'pl'];
const privacyPolicyHtmlMaxLength = 120000;
const legalDocumentTypes = ['privacyPolicy', 'cookiePolicy', 'termsConditions'];
const legalDocumentDbTypes = {
  cookiePolicy: 'cookie_policy',
  termsConditions: 'terms_conditions'
};
const legalDocumentAdminLabels = {
  privacyPolicy: 'privacy policy',
  cookiePolicy: 'cookie policy',
  termsConditions: 'termini e condizioni'
};
const dashboardRoleSchema = z.enum(['admin', 'facility_manager', 'user']);
const inviteRoleSchema = z.enum(['admin', 'facility_manager']);

function isInsideDirectory(parentDir, childPath) {
  const relative = path.relative(parentDir, childPath);
  return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function resolveDashboardAudioPath(audioUrl) {
  const cleanUrl = String(audioUrl || '').split('?')[0].split('#')[0].replace(/\\/g, '/');
  if (!cleanUrl.startsWith('/public/audio/')) {
    return null;
  }

  let decodedUrl = cleanUrl;
  try {
    decodedUrl = decodeURIComponent(cleanUrl);
  } catch {
    decodedUrl = cleanUrl;
  }

  const relativeAudioPath = decodedUrl.replace(/^\/public\/audio\//, '');
  const absoluteAudioPath = path.resolve(publicAudioRootDir, relativeAudioPath);
  return isInsideDirectory(publicAudioRootDir, absoluteAudioPath) ? absoluteAudioPath : null;
}

function dashboardAudioContentType(audioPath) {
  const extension = path.extname(audioPath).toLowerCase();
  if (extension === '.m4a' || extension === '.mp4') {
    return 'audio/mp4';
  }
  if (extension === '.ogg' || extension === '.oga') {
    return 'audio/ogg';
  }
  if (extension === '.wav') {
    return 'audio/wav';
  }
  if (extension === '.webm') {
    return 'audio/webm';
  }
  return 'audio/mpeg';
}

async function resolveDashboardSessionFromMediaRequest(req) {
  const headerSession = await resolveSessionUser(req);
  if (headerSession) {
    return headerSession;
  }

  const accessToken = String(req.query.access_token || req.query.token || '').trim();
  if (!accessToken) {
    return null;
  }

  return resolveSessionUser({
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });
}

const inviteSchema = z.object({
  firstName: z.string().trim().min(1, 'Nome obbligatorio').max(120, 'Nome troppo lungo'),
  lastName: z.string().trim().min(1, 'Cognome obbligatorio').max(120, 'Cognome troppo lungo'),
  email: z.string().trim().email(),
  role: inviteRoleSchema,
  structureId: z.string().trim().min(1).optional(),
  origin: z.string().trim().url().optional()
});

const structureInviteCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{6}$/, 'Il codice invito deve avere 6 caratteri alfanumerici');

const structureCreateSchema = z.object({
  name: z.string().trim().min(1, 'Nome struttura obbligatorio').max(160, 'Nome struttura troppo lungo'),
  street: z.string().trim().min(1, 'Via obbligatoria').max(160, 'Via troppo lunga'),
  streetNumber: z.string().trim().min(1, 'Civico obbligatorio').max(20, 'Civico troppo lungo'),
  city: z.string().trim().min(1, 'Città obbligatoria').max(120, 'Città troppo lunga'),
  postalCode: z.string().trim().regex(/^\d{5}$/, 'CAP non valido (5 cifre)'),
  province: z.string().trim().max(80, 'Provincia troppo lunga').nullish(),
  country: z.string().trim().max(80, 'Nazione troppo lunga').nullish()
});

const structureUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Nome struttura obbligatorio').max(160, 'Nome struttura troppo lungo'),
  street: z.string().trim().min(1, 'Via obbligatoria').max(160, 'Via troppo lunga'),
  streetNumber: z.string().trim().min(1, 'Civico obbligatorio').max(20, 'Civico troppo lungo'),
  city: z.string().trim().min(1, 'Città obbligatoria').max(120, 'Città troppo lunga'),
  postalCode: z.string().trim().regex(/^\d{5}$/, 'CAP non valido (5 cifre)'),
  province: z.string().trim().max(80, 'Provincia troppo lunga').nullish(),
  country: z.string().trim().max(80, 'Nazione troppo lunga').nullish()
});

const structureDiscountUpdateSchema = z.object({
  userDiscountPercent: z.coerce.number().min(0, 'Sconto utente non valido').max(100, 'Sconto utente non valido'),
  structureFixedAmount: z.coerce.number().min(0, 'Importo struttura non valido').max(10000, 'Importo struttura non valido')
});

const discountCodeExpiresAtSchema = z.coerce
  .date()
  .refine((value) => value instanceof Date && !Number.isNaN(value.getTime()), 'Scadenza non valida');
const discountCodeApplyToSchema = z.enum(['single', 'bundle']);

const discountCodeCreateSchema = z.object({
  structureId: z.string().trim().min(1, 'Struttura obbligatoria'),
  applyTo: discountCodeApplyToSchema,
  cityIds: z.array(z.string().trim().min(1, 'Città non valida')).min(1, 'Seleziona almeno una città'),
  code: structureInviteCodeSchema,
  userDiscountPercent: z.coerce.number().min(0, 'Sconto utente non valido').max(100, 'Sconto utente non valido'),
  structureFixedAmount: z.coerce.number().min(0, 'Importo struttura non valido').max(10000, 'Importo struttura non valido'),
  expiresAt: discountCodeExpiresAtSchema
});

const discountCodeUpdateSchema = z.object({
  applyTo: discountCodeApplyToSchema,
  cityIds: z.array(z.string().trim().min(1, 'Città non valida')).min(1, 'Seleziona almeno una città'),
  userDiscountPercent: z.coerce.number().min(0, 'Sconto utente non valido').max(100, 'Sconto utente non valido'),
  structureFixedAmount: z.coerce.number().min(0, 'Importo struttura non valido').max(10000, 'Importo struttura non valido'),
  expiresAt: discountCodeExpiresAtSchema
});

const partnerRequestStatusSchema = z.enum(['pending', 'approved', 'rejected']);
const partnerRequestPdfReleaseStatusSchema = z.enum(['pending', 'sent']);
const partnerRequestApprovalSchema = z.object({
  applyTo: discountCodeApplyToSchema,
  cityIds: z.array(z.string().trim().min(1, 'Città non valida')).min(1, 'Seleziona almeno una città'),
  code: structureInviteCodeSchema,
  userDiscountPercent: z.coerce.number().min(0, 'Sconto utente non valido').max(100, 'Sconto utente non valido'),
  structureFixedAmount: z.coerce.number().min(0, 'Importo struttura non valido').max(10000, 'Importo struttura non valido'),
  expiresAt: discountCodeExpiresAtSchema,
  origin: z.string().trim().url().optional()
});
const partnerRequestPdfPreviewSchema = z.object({
  applyTo: discountCodeApplyToSchema.optional(),
  cityIds: z.array(z.string().trim().min(1, 'Città non valida')).optional().default([]),
  code: z.string().trim().max(32, 'Codice non valido').optional().default(''),
  userDiscountPercent: z.preprocess(
    (value) => (value === null || value === '' ? undefined : value),
    z.coerce.number().min(0, 'Sconto utente non valido').max(100, 'Sconto utente non valido').optional()
  ),
  structureFixedAmount: z.preprocess(
    (value) => (value === null || value === '' ? undefined : value),
    z.coerce.number().min(0, 'Importo struttura non valido').max(10000, 'Importo struttura non valido').optional()
  ),
  expiresAt: z.preprocess((value) => (value === null || value === '' ? undefined : value), discountCodeExpiresAtSchema.optional())
});
const partnerRequestActivationResendSchema = z.object({
  origin: z.string().trim().url().optional()
});

const partnerEmailSettingsSchema = z.object({
  approvalSubject: z.string().trim().min(1, 'Oggetto approvazione obbligatorio').max(200, 'Oggetto approvazione troppo lungo'),
  approvalBody: z.string().trim().min(1, 'Testo approvazione obbligatorio').max(10000, 'Testo approvazione troppo lungo'),
  rejectionSubject: z.string().trim().min(1, 'Oggetto rifiuto obbligatorio').max(200, 'Oggetto rifiuto troppo lungo'),
  rejectionBody: z.string().trim().min(1, 'Testo rifiuto obbligatorio').max(10000, 'Testo rifiuto troppo lungo'),
  activationSubject: z.string().trim().min(1, 'Oggetto reinvito obbligatorio').max(200, 'Oggetto reinvito troppo lungo'),
  activationBody: z.string().trim().min(1, 'Testo reinvito obbligatorio').max(10000, 'Testo reinvito troppo lungo')
});

const userStructureUpdateSchema = z
  .object({
    structureId: z.string().trim().min(1).nullable().optional(),
    inviteCode: structureInviteCodeSchema.nullish()
  })
  .refine((payload) => !(payload.structureId && payload.inviteCode), {
    message: 'Specifica structureId o inviteCode, non entrambi'
  });

const userAccessUpdateSchema = z.object({
  role: dashboardRoleSchema,
  structureId: z.string().trim().min(1).nullable()
});

const userCreateSchema = z.object({
  firstName: z.string().trim().min(1, 'Nome obbligatorio').max(120, 'Nome troppo lungo'),
  lastName: z.string().trim().min(1, 'Cognome obbligatorio').max(120, 'Cognome troppo lungo'),
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password minima 8 caratteri').max(120, 'Password troppo lunga'),
  role: dashboardRoleSchema,
  structureId: z.string().trim().min(1).optional()
});

const passwordResetRequestSchema = z.object({
  origin: z.string().trim().url().optional()
});

const paymentsQuerySchema = z.object({
  structureId: z.string().trim().min(1).optional(),
  includeHidden: z.preprocess((value) => {
    const normalized = String(value || '').trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
  }, z.boolean()).optional()
});

const paymentHiddenUpdateSchema = z.object({
  hidden: z.boolean()
});

const paymentsHiddenBulkUpdateSchema = paymentHiddenUpdateSchema.extend({
  paymentIds: z.array(z.coerce.number().int().positive()).min(1).max(500)
});

const paypalSettingsSchema = z.object({
  isEnabled: z.boolean().optional().default(false),
  mode: z.enum(['sandbox', 'live']).optional().default('sandbox'),
  clientId: z.string().trim().max(400).optional().default(''),
  clientSecret: z.string().trim().max(400).optional().default(''),
  merchantId: z.string().trim().max(180).optional().default(''),
  merchantEmail: z.string().trim().email().max(180).or(z.literal('')).optional().default(''),
  brandName: z.string().trim().max(127).optional().default('Walk Around'),
  webhookId: z.string().trim().max(180).optional().default(''),
  currencyCode: z.literal('EUR').optional().default('EUR')
});

const openAiTranslationTargetLanguageSchema = z.enum(['en', 'fr', 'es', 'de', 'pl']);
const openAiAudioTargetLanguageSchema = z.enum(['it', 'en', 'fr', 'es', 'de', 'pl']);
const openAiTtsVoiceSchema = z.enum(['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer', 'verse', 'marin', 'cedar']);
const openAiTranslationSettingsSchema = z.object({
  apiKey: z.string().trim().max(500).optional().default(''),
  model: z.string().trim().min(1, 'Modello obbligatorio').max(120, 'Modello troppo lungo').optional().default(DEFAULT_OPENAI_TRANSLATION_MODEL),
  ttsModel: z.string().trim().min(1, 'Modello audio obbligatorio').max(120, 'Modello audio troppo lungo').optional().default(DEFAULT_OPENAI_TTS_MODEL),
  ttsVoice: openAiTtsVoiceSchema.optional().default(DEFAULT_OPENAI_TTS_VOICE),
  ttsInstructions: z.string().trim().max(1200, 'Istruzioni voce troppo lunghe').optional().default(DEFAULT_OPENAI_TTS_INSTRUCTIONS),
  clearApiKey: z.boolean().optional().default(false)
});
const openAiAudioPreviewSchema = z.object({
  ttsModel: z.string().trim().min(1, 'Modello audio obbligatorio').max(120, 'Modello audio troppo lungo').optional().default(DEFAULT_OPENAI_TTS_MODEL),
  ttsVoice: openAiTtsVoiceSchema.optional().default(DEFAULT_OPENAI_TTS_VOICE),
  ttsInstructions: z.string().trim().max(1200, 'Istruzioni voce troppo lunghe').optional().default(DEFAULT_OPENAI_TTS_INSTRUCTIONS),
  previewText: z.string().trim().max(500, 'Testo anteprima troppo lungo').optional().default(
    'Benvenuto nella tua audioguida. Scopriamo insieme questo luogo, tra storia, dettagli e curiosita.'
  )
});
const openAiTranslationStatusQuerySchema = z.object({
  targetLanguage: openAiAudioTargetLanguageSchema
});
const openAiPoiTranslationSchema = z.object({
  cityId: z.string().trim().min(1, 'Città obbligatoria').optional(),
  targetLanguage: openAiTranslationTargetLanguageSchema,
  overwrite: z.boolean().optional().default(false)
});
const openAiPoiAudioGenerationSchema = z.object({
  cityId: z.string().trim().min(1, 'CittÃ  obbligatoria').optional(),
  targetLanguage: openAiAudioTargetLanguageSchema,
  overwrite: z.boolean().optional().default(false)
});

const discountCodesQuerySchema = z.object({
  structureId: z.string().trim().min(1).optional()
});

const contentLanguageSchema = z.enum(['it', 'en', 'fr', 'es', 'de', 'pl']);
const cityTranslationFieldsSchema = z.object({
  name: z.string().trim().max(120, 'Nome tradotto troppo lungo').optional()
}).partial();
const poiTranslationFieldsSchema = z.object({
  descriptionShort: z.string().trim().max(1000, 'Descrizione breve tradotta troppo lunga').optional(),
  descriptionLong: z.string().trim().max(10000, 'Descrizione lunga tradotta troppo lunga').optional(),
  audioUrl: z.string().trim().max(500, 'URL audio tradotto troppo lungo').optional()
}).partial();
const cityTranslationsSchema = z.record(contentLanguageSchema, cityTranslationFieldsSchema).default({});
const poiTranslationsSchema = z.record(contentLanguageSchema, poiTranslationFieldsSchema).default({});
const privacyPolicyTranslationsSchema = z.record(
  contentLanguageSchema,
  z.string().max(privacyPolicyHtmlMaxLength, 'Privacy policy troppo lunga')
).default({});
const privacyPolicySettingsSchema = z.object({
  translations: privacyPolicyTranslationsSchema.optional().default({})
});
const privacyPolicyTranslateSchema = z.object({
  sourceLanguage: z.literal('it').optional().default('it'),
  targetLanguages: z.array(openAiTranslationTargetLanguageSchema).optional().default(privacyPolicyTargetLanguages),
  overwrite: z.boolean().optional().default(false)
});
const legalDocumentTypeSchema = z.enum(legalDocumentTypes);
const legalDocumentParamsSchema = z.object({
  documentType: legalDocumentTypeSchema
});
const legalDocumentSettingsSchema = privacyPolicySettingsSchema;
const legalDocumentTranslateSchema = privacyPolicyTranslateSchema;
const notificationRecipientsSchema = z.preprocess(
  (value) => normalizeNotificationRecipients(value),
  z.array(z.string().email('Email destinatario non valida')).max(50, 'Massimo 50 destinatari')
);
const dashboardEmailSettingsSchema = z.object({
  host: z.string().trim().min(1, 'Host SMTP obbligatorio').max(253, 'Host SMTP troppo lungo'),
  port: z.coerce.number().int('Porta SMTP non valida').min(1, 'Porta SMTP non valida').max(65535, 'Porta SMTP non valida'),
  secure: z.boolean().optional().default(true),
  user: z.string().trim().max(320, 'Username SMTP troppo lungo').optional().default(''),
  password: z.string().max(1000, 'Password SMTP troppo lunga').optional().default(''),
  from: z.string().trim().min(1, 'Mittente obbligatorio').max(320, 'Mittente troppo lungo'),
  clearPassword: z.boolean().optional().default(false)
});
const dashboardEmailTestSchema = z.object({
  to: z.string().trim().email('Email test non valida').max(320, 'Email test troppo lunga')
});
const dashboardNotificationSettingsSchema = z
  .object({
    partnerRequestEnabled: z.boolean().optional().default(true),
    partnerRequestRecipients: notificationRecipientsSchema.optional().default([]),
    paymentEnabled: z.boolean().optional().default(true),
    paymentRecipients: notificationRecipientsSchema.optional().default([])
  })
  .superRefine((value, ctx) => {
    if (value.partnerRequestEnabled && !value.partnerRequestRecipients.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['partnerRequestRecipients'],
        message: 'Inserisci almeno una email per le notifiche partner attive'
      });
    }
    if (value.paymentEnabled && !value.paymentRecipients.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paymentRecipients'],
        message: 'Inserisci almeno una email per le notifiche pagamento attive'
      });
    }
  });
const publicationStatusSchema = z.enum(['published', 'draft']);

const catalogCitySchema = z.object({
  name: z.string().trim().min(1, 'Nome città obbligatorio').max(120, 'Nome città troppo lungo'),
  region: z.string().trim().min(1, 'Regione obbligatoria').max(120, 'Regione troppo lunga'),
  bundlePrice: z.coerce.number().min(0, 'Prezzo bundle non valido').max(10000, 'Prezzo bundle troppo alto'),
  heroImage: z.string().trim().min(1, 'Hero image obbligatoria').max(500, 'Hero image troppo lunga'),
  isDefault: z.boolean().optional().default(false),
  publicationStatus: publicationStatusSchema.optional().default('draft'),
  translations: cityTranslationsSchema.optional().default({})
});

const catalogPoiSchema = z.object({
  cityId: z.string().trim().min(1, 'Città obbligatoria'),
  name: z.string().trim().min(1, 'Nome POI obbligatorio').max(180, 'Nome POI troppo lungo'),
  address: z.string().trim().max(240, 'Indirizzo troppo lungo').default(''),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  category: z.string().trim().min(1, 'Categoria obbligatoria').max(120, 'Categoria troppo lunga'),
  descriptionShort: z.string().trim().min(1, 'Descrizione breve obbligatoria').max(1000, 'Descrizione breve troppo lunga'),
  descriptionLong: z.string().trim().min(1, 'Descrizione lunga obbligatoria').max(10000, 'Descrizione lunga troppo lunga'),
  imageUrl: z.string().trim().min(1, 'Immagine obbligatoria').max(500, 'URL immagine troppo lunga'),
  audioUrl: z.string().trim().max(500, 'URL audio troppo lungo').default(''),
  priceSingle: z.coerce.number().min(0, 'Prezzo singolo non valido').max(10000, 'Prezzo singolo troppo alto'),
  durationSec: z.coerce.number().int().min(1, 'Durata non valida').max(7200, 'Durata troppo lunga'),
  publicationStatus: publicationStatusSchema.optional().default('draft'),
  translations: poiTranslationsSchema.optional().default({})
});

const catalogAudioUploadSchema = z.object({
  fileName: z.string().trim().min(1, 'Nome file obbligatorio').max(180, 'Nome file troppo lungo'),
  mimeType: z.string().trim().max(120).optional(),
  base64Data: z.string().trim().min(16, 'Audio non valido'),
  cityId: z.string().trim().min(1).optional(),
  cityName: z.string().trim().min(1).max(120).optional()
}).refine((payload) => Boolean(payload.cityId || payload.cityName), {
  message: 'Specifica cityId o cityName',
  path: ['cityId']
});

const catalogImageUploadSchema = z.object({
  fileName: z.string().trim().min(1, 'Nome file obbligatorio').max(180, 'Nome file troppo lungo'),
  mimeType: z.string().trim().max(120).optional(),
  base64Data: z.string().trim().min(16, 'Immagine non valida'),
  cityId: z.string().trim().min(1).optional(),
  cityName: z.string().trim().min(1).max(120).optional()
}).refine((payload) => Boolean(payload.cityId || payload.cityName), {
  message: 'Specifica cityId o cityName',
  path: ['cityId']
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

function roleNeedsStructure(role) {
  return role === 'facility_manager';
}

function roleCanHaveStructure(role) {
  return role === 'facility_manager' || role === 'user';
}

function canViewPayments(role) {
  return role === 'admin' || role === 'facility_manager';
}

function canViewDiscountCodes(role) {
  return role === 'admin' || role === 'facility_manager';
}

function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function cityFolderSlug(cityName, cityId = '') {
  return slugify(cityName) || slugify(cityId) || 'citta';
}

async function pathExists(absolutePath) {
  try {
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

function absolutePathFromPublicUrl(publicUrl) {
  const normalizedUrl = String(publicUrl || '').trim();
  if (!normalizedUrl.startsWith('/public/')) {
    return null;
  }

  const relativePath = normalizedUrl.slice('/public/'.length);
  const absolutePath = path.resolve(publicRootDir, relativePath);
  if (!absolutePath.startsWith(publicRootDir)) {
    return null;
  }

  return absolutePath;
}

async function resolveExistingPublicSourcePath(publicUrl) {
  const primaryAbsolutePath = absolutePathFromPublicUrl(publicUrl);
  if (!primaryAbsolutePath) {
    return null;
  }

  if (await pathExists(primaryAbsolutePath)) {
    return primaryAbsolutePath;
  }

  const normalizedUrl = String(publicUrl || '').trim();
  if (normalizedUrl.startsWith('/public/images/')) {
    const fileName = path.basename(primaryAbsolutePath);
    const legacyImageAbsolutePath = path.join(publicImagesRootDir, 'old', fileName);
    if (await pathExists(legacyImageAbsolutePath)) {
      return legacyImageAbsolutePath;
    }
  }

  return primaryAbsolutePath;
}

function requiresMediaMigration(publicUrl, basePublicPrefix, targetFolderSlug) {
  const normalizedUrl = String(publicUrl || '').trim();
  if (!normalizedUrl.startsWith(basePublicPrefix)) {
    return false;
  }

  const relativePath = normalizedUrl.slice(basePublicPrefix.length).replace(/^\/+/, '');
  if (!relativePath) {
    return false;
  }

  const segments = relativePath.split('/').filter(Boolean);
  if (segments.length === 1) {
    return true;
  }

  const currentFolder = String(segments[0] || '').trim();
  if (!currentFolder) {
    return true;
  }
  if (currentFolder === 'uploads') {
    return true;
  }

  const normalizedTargetFolder = String(targetFolderSlug || '').trim();
  if (!normalizedTargetFolder) {
    return false;
  }
  return currentFolder !== normalizedTargetFolder;
}

function requiresImageMigration(imageUrl, targetFolderSlug) {
  return requiresMediaMigration(imageUrl, '/public/images/', targetFolderSlug);
}

function requiresAudioMigration(audioUrl, targetFolderSlug) {
  return requiresMediaMigration(audioUrl, '/public/audio/', targetFolderSlug);
}

async function movePublicFileToCityFolder(currentPublicUrl, targetFolderAbsolutePath, targetBasePublicUrl) {
  const sourceAbsolutePath = await resolveExistingPublicSourcePath(currentPublicUrl);
  if (!sourceAbsolutePath) {
    return currentPublicUrl;
  }

  const originalFileName = path.basename(sourceAbsolutePath);
  if (!originalFileName) {
    return currentPublicUrl;
  }

  await fs.mkdir(targetFolderAbsolutePath, { recursive: true });
  const defaultTargetFileName = originalFileName;
  const defaultTargetAbsolutePath = path.join(targetFolderAbsolutePath, defaultTargetFileName);
  const defaultTargetPublicUrl = `${targetBasePublicUrl}/${defaultTargetFileName}`;
  let targetFileName = defaultTargetFileName;
  let targetAbsolutePath = defaultTargetAbsolutePath;
  let targetPublicUrl = defaultTargetPublicUrl;

  if (sourceAbsolutePath === targetAbsolutePath) {
    return targetPublicUrl;
  }

  const sourceExists = await pathExists(sourceAbsolutePath);
  const targetExists = await pathExists(targetAbsolutePath);

  if (!sourceExists && targetExists) {
    return targetPublicUrl;
  }
  if (!sourceExists && !targetExists) {
    return currentPublicUrl;
  }

  if (targetExists && sourceExists) {
    const originalExt = path.extname(originalFileName);
    const originalBaseName = path.basename(originalFileName, originalExt);
    const safeBaseName = slugify(originalBaseName) || 'media';

    let nextTargetFound = false;
    while (!nextTargetFound) {
      targetFileName = `${safeBaseName}-${crypto.randomUUID().slice(0, 8)}${originalExt}`;
      targetAbsolutePath = path.join(targetFolderAbsolutePath, targetFileName);
      targetPublicUrl = `${targetBasePublicUrl}/${targetFileName}`;
      nextTargetFound = !(await pathExists(targetAbsolutePath));
    }
  }

  if (!targetExists || (targetExists && sourceExists)) {
    try {
      await fs.rename(sourceAbsolutePath, targetAbsolutePath);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'EXDEV') {
        await fs.copyFile(sourceAbsolutePath, targetAbsolutePath);
        await fs.unlink(sourceAbsolutePath);
      } else if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        const defaultTargetExists = await pathExists(defaultTargetAbsolutePath);
        if (defaultTargetExists) {
          return defaultTargetPublicUrl;
        }
        const chosenTargetExists = await pathExists(targetAbsolutePath);
        if (chosenTargetExists) {
          return targetPublicUrl;
        }
        return currentPublicUrl;
      } else {
        throw error;
      }
    }
  }

  return targetPublicUrl;
}

async function resolveCityFolder(payload, client = pool) {
  const requestedCityId = String(payload.cityId || '').trim();
  if (requestedCityId) {
    const city = await fetchCityById(requestedCityId, client);
    if (!city) {
      return null;
    }
    return {
      cityId: city.id,
      cityName: city.name,
      folderSlug: cityFolderSlug(city.name, city.id)
    };
  }

  const requestedCityName = String(payload.cityName || '').trim();
  if (requestedCityName) {
    return {
      cityId: null,
      cityName: requestedCityName,
      folderSlug: cityFolderSlug(requestedCityName)
    };
  }

  return null;
}

async function maybeMigrateCityHeroImage(row, client = pool) {
  const folderSlug = cityFolderSlug(row.name, row.id);
  if (!requiresImageMigration(row.hero_image, folderSlug)) {
    return row.hero_image;
  }

  const migratedUrl = await movePublicFileToCityFolder(
    row.hero_image,
    path.join(publicImagesRootDir, folderSlug),
    `/public/images/${folderSlug}`
  );

  if (migratedUrl !== row.hero_image) {
    await client.query(
      `
        UPDATE cities
        SET hero_image = $1
        WHERE id = $2
      `,
      [migratedUrl, row.id]
    );
  }

  return migratedUrl;
}

async function maybeMigratePoiMedia(row, client = pool) {
  const folderSlug = cityFolderSlug(row.city_name, row.city_id);
  const imageNeedsMigration = requiresImageMigration(row.image_url, folderSlug);
  const audioNeedsMigration = requiresAudioMigration(row.audio_url, folderSlug);

  if (!imageNeedsMigration && !audioNeedsMigration) {
    return {
      ...row,
      image_url: row.image_url,
      audio_url: row.audio_url
    };
  }

  let nextImageUrl = row.image_url;
  let nextAudioUrl = row.audio_url;

  if (imageNeedsMigration) {
    nextImageUrl = await movePublicFileToCityFolder(
      nextImageUrl,
      path.join(publicImagesRootDir, folderSlug),
      `/public/images/${folderSlug}`
    );
  }

  if (audioNeedsMigration) {
    nextAudioUrl = await movePublicFileToCityFolder(
      nextAudioUrl,
      path.join(publicAudioRootDir, folderSlug),
      `/public/audio/${folderSlug}`
    );
  }

  if (nextImageUrl !== row.image_url || nextAudioUrl !== row.audio_url) {
    await client.query(
      `
        UPDATE pois
        SET image_url = $1,
            audio_url = $2
        WHERE id = $3
      `,
      [nextImageUrl, nextAudioUrl, row.id]
    );
  }

  return {
    ...row,
    image_url: nextImageUrl,
    audio_url: nextAudioUrl
  };
}

function mapCatalogCityRow(row) {
  return {
    id: row.id,
    name: sanitizeCatalogText(row.name),
    region: sanitizeCatalogText(row.region),
    bundlePrice: Number(row.bundle_price),
    heroImage: row.hero_image,
    isDefault: row.is_default,
    publicationStatus: row.publication_status === 'draft' ? 'draft' : 'published',
    translations: sanitizeCatalogCityTranslations(row.translations),
    poiCount: Number(row.poi_count || 0),
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null
  };
}

function mapCatalogPoiRow(row) {
  return {
    id: row.id,
    cityId: row.city_id,
    cityName: row.city_name ? sanitizeCatalogText(row.city_name) : null,
    name: sanitizeCatalogText(row.name),
    address: sanitizeCatalogText(row.address),
    lat: Number(row.lat),
    lng: Number(row.lng),
    category: sanitizeCatalogText(row.category),
    descriptionShort: sanitizeCatalogText(row.description_short),
    descriptionLong: sanitizeCatalogText(row.description_long),
    imageUrl: row.image_url,
    audioUrl: row.audio_url,
    priceSingle: Number(row.price_single),
    durationSec: Number(row.duration_sec),
    publicationStatus: row.publication_status === 'draft' ? 'draft' : 'published',
    translations: sanitizeCatalogPoiTranslations(row.translations)
  };
}

function sanitizeCatalogCityTranslations(_value) {
  return {};
}

function sanitizeCatalogPoiTranslations(value) {
  return sanitizeCatalogTranslations(value, ['descriptionShort', 'descriptionLong', 'audioUrl']);
}

function sanitizeCatalogTranslations(value, allowedFields) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const supportedLanguages = ['it', 'en', 'fr', 'es', 'de', 'pl'];
  const sanitized = {};

  supportedLanguages.forEach((language) => {
    const fields = value?.[language];
    if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
      return;
    }

    const nextFields = {};
    allowedFields.forEach((field) => {
      const rawValue = fields?.[field];
      const normalizedValue = typeof rawValue === 'string' ? sanitizeCatalogText(rawValue.trim()) : '';
      if (normalizedValue) {
        nextFields[field] = normalizedValue;
      }
    });

    if (Object.keys(nextFields).length) {
      sanitized[language] = nextFields;
    }
  });

  return sanitized;
}

function sanitizeCatalogText(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return value;
  }

  let text = value
    .replace(/ÃƒÂ /g, '\u00E0')
    .replace(/ÃƒÂ¨/g, '\u00E8')
    .replace(/ÃƒÂ©/g, '\u00E9')
    .replace(/ÃƒÂ¬/g, '\u00EC')
    .replace(/ÃƒÂ²/g, '\u00F2')
    .replace(/ÃƒÂ¹/g, '\u00F9')
    .replace(/Ã¢â‚¬â„¢/g, "'")
    .replace(/Ã¢â‚¬Ëœ/g, "'")
    .replace(/Ã¢â‚¬Å“/g, '"')
    .replace(/Ã¢â‚¬\u009D/g, '"')
    .replace(/Ã¢â‚¬â€/g, '-')
    .replace(/Ã¢â‚¬â€œ/g, '-');

  text = text
    .replace(/Ã /g, '\u00E0')
    .replace(/Ã¨/g, '\u00E8')
    .replace(/Ã©/g, '\u00E9')
    .replace(/Ã¬/g, '\u00EC')
    .replace(/Ã²/g, '\u00F2')
    .replace(/Ã¹/g, '\u00F9')
    .replace(/Ã€/g, '\u00C0')
    .replace(/Ãˆ/g, '\u00C8')
    .replace(/Ã‰/g, '\u00C9')
    .replace(/ÃŒ/g, '\u00CC')
    .replace(/Ã’/g, '\u00D2')
    .replace(/Ã™/g, '\u00D9')
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€“/g, '-')
    .replace(/â€”/g, '-')
    .replace(/â€¦/g, '...');

  if (!text.includes('\uFFFD')) {
    return text;
  }

  text = text
    .replace(/([\p{L}])\uFFFD(?=[\p{L}])/gu, "$1'")
    .replace(/\b\uFFFD(?=[\p{L}])/gu, "'");

  return text
    .replace(/([\p{L}]+)it\uFFFD(?=[^\p{L}]|$)/gu, '$1it\u00E0')
    .replace(/([\p{L}]+)et\uFFFD(?=[^\p{L}]|$)/gu, '$1et\u00E0')
    .replace(/([\p{L}]+)t\uFFFD(?=[^\p{L}]|$)/gu, '$1t\u00E0')
    .replace(/\s\uFFFD\s/g, ' \u00E8 ')
    .replace(/\uFFFD/g, "'");
}

function normalizeTextArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  const unique = new Set();
  for (const item of value) {
    const normalized = String(item || '').trim();
    if (normalized) {
      unique.add(normalized);
    }
  }
  return Array.from(unique);
}

function normalizeJsonArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeCityIdsSelection(cityIdsRaw) {
  if (!Array.isArray(cityIdsRaw)) {
    return [];
  }
  const unique = new Set();
  for (const cityIdRaw of cityIdsRaw) {
    const cityId = String(cityIdRaw || '').trim();
    if (cityId) {
      unique.add(cityId);
    }
  }
  return Array.from(unique);
}

function mapDiscountCodeRow(row) {
  const userDiscountPercentSingle = Number(row.user_discount_percent_single ?? row.user_discount_percent ?? 0);
  const userDiscountPercentBundle = Number(row.user_discount_percent_bundle ?? row.user_discount_percent ?? 0);
  const structureFixedAmountSingle = Number(row.structure_fixed_amount_single ?? row.structure_fixed_amount ?? 0);
  const structureFixedAmountBundle = Number(row.structure_fixed_amount_bundle ?? row.structure_fixed_amount ?? 0);
  const applyTo = row.apply_to === 'single' ? 'single' : 'bundle';
  const userDiscountPercentApplied = applyTo === 'single' ? userDiscountPercentSingle : userDiscountPercentBundle;
  const structureFixedAmountApplied = applyTo === 'single' ? structureFixedAmountSingle : structureFixedAmountBundle;
  const cityIds = normalizeTextArray(row.city_ids);
  const cityNames = normalizeTextArray(row.city_names);
  const primaryCityId = cityIds[0] || (row.city_id ? String(row.city_id).trim() : '') || null;
  const primaryCityName = cityNames[0] || (row.city_name ? String(row.city_name).trim() : '') || null;

  return {
    id: Number(row.id),
    structureId: row.structure_id,
    structureName: row.structure_name || null,
    structureAddress: row.structure_address || null,
    applyTo,
    cityId: primaryCityId,
    cityName: primaryCityName,
    cityIds,
    cityNames,
    code: row.code,
    userDiscountPercent: userDiscountPercentApplied,
    userDiscountPercentApplied,
    userDiscountPercentSingle,
    userDiscountPercentBundle,
    structureFixedAmount: structureFixedAmountApplied,
    structureFixedAmountApplied,
    structureFixedAmountSingle,
    structureFixedAmountBundle,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function safeNumber(value, fallback = 0) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }
  return numericValue;
}

function optionalNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function resolveDiscountRowValue(row, applyTo, fieldBase) {
  const scopedField = applyTo === 'single' ? `${fieldBase}_single` : `${fieldBase}_bundle`;
  return row?.[scopedField] ?? row?.[fieldBase] ?? null;
}

function normalizePaymentStatusLabel(value) {
  const normalized = String(value || '').trim().toUpperCase();
  if (!normalized) {
    return 'Non disponibile';
  }
  if (normalized === 'COMPLETED') {
    return 'Completato';
  }
  if (normalized === 'CREATED') {
    return 'Creato';
  }
  if (normalized === 'APPROVED') {
    return 'Approvato';
  }
  if (normalized === 'PAYER_ACTION_REQUIRED') {
    return 'Azione utente richiesta';
  }
  if (normalized === 'VOIDED') {
    return 'Annullato';
  }
  if (normalized === 'FAILED') {
    return 'Fallito';
  }
  if (normalized === 'LEGACY') {
    return 'Storico legacy';
  }
  return normalized;
}

function buildPaymentCustomerProfile(row) {
  const firstName = String(row.payer_first_name || '').trim();
  const lastName = String(row.payer_last_name || '').trim();
  const payerEmail = String(row.payer_email || '').trim();
  const payerPhone = String(row.payer_phone || '').trim();
  const payerAddress = String(row.payer_address || '').trim();
  const payerId = String(row.payer_id || '').trim();

  return {
    customerId: payerId || row.user_id,
    customerFirstName: firstName || 'PayPal',
    customerLastName: lastName || 'Acquirente',
    customerBirthDate: null,
    customerEmail: payerEmail || null,
    customerPhone: payerPhone || null,
    customerAddress: payerAddress || null
  };
}

function mapPayPalSettingsForResponse(row) {
  const settings = row && Object.prototype.hasOwnProperty.call(row, 'clientId') ? row : mapPayPalSettingsRow(row);
  return {
    id: settings.id,
    isEnabled: settings.isEnabled,
    mode: settings.mode,
    clientId: settings.clientId || '',
    clientSecret: settings.clientSecret || '',
    merchantId: settings.merchantId || '',
    merchantEmail: settings.merchantEmail || '',
    brandName: settings.brandName || 'Walk Around',
    webhookId: settings.webhookId || '',
    currencyCode: settings.currencyCode || 'EUR',
    lastVerifiedAt: settings.lastVerifiedAt,
    lastVerificationStatus: settings.lastVerificationStatus || 'incomplete',
    lastVerificationError: settings.lastVerificationError || null,
    updatedAt: settings.updatedAt,
    updatedBy: settings.updatedBy
  };
}

function mapOpenAiTranslationSettingsForResponse(row) {
  return {
    hasApiKey: Boolean(row?.api_key),
    maskedApiKey: maskOpenAiApiKey(row?.api_key),
    model: normalizeOpenAITranslationModel(row?.model),
    ttsModel: normalizeOpenAITtsModel(row?.tts_model),
    ttsVoice: normalizeOpenAITtsVoice(row?.tts_voice),
    ttsInstructions: normalizeOpenAITtsInstructions(row?.tts_instructions),
    updatedAt: row?.updated_at || null,
    updatedBy: row?.updated_by || null
  };
}

function normalizePartnerEmailSettings(row) {
  return {
    approvalSubject: String(row?.approval_subject || DEFAULT_PARTNER_EMAIL_SETTINGS.approvalSubject),
    approvalBody: String(row?.approval_body || DEFAULT_PARTNER_EMAIL_SETTINGS.approvalBody),
    rejectionSubject: String(row?.rejection_subject || DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionSubject),
    rejectionBody: String(row?.rejection_body || DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionBody),
    activationSubject: String(row?.activation_subject || DEFAULT_PARTNER_EMAIL_SETTINGS.activationSubject),
    activationBody: String(row?.activation_body || DEFAULT_PARTNER_EMAIL_SETTINGS.activationBody),
    updatedAt: row?.updated_at || null,
    updatedBy: row?.updated_by || null
  };
}

function isPartnerEmailDeliveryError(error) {
  return Boolean(error && typeof error === 'object' && error.partnerEmailDelivery);
}

function mapPartnerEmailSettingsForResponse(row) {
  return {
    ...normalizePartnerEmailSettings(row),
    placeholders: PARTNER_EMAIL_TEMPLATE_PLACEHOLDERS
  };
}

function mapPrivacyPolicySettingsForResponse(row) {
  return {
    translations: sanitizePrivacyPolicyTranslations(row?.translations),
    updatedAt: row?.updated_at || null,
    updatedBy: row?.updated_by || null
  };
}

function mapLegalDocumentSettingsForResponse(documentType, row) {
  return {
    type: documentType,
    translations: sanitizePrivacyPolicyTranslations(row?.translations),
    updatedAt: row?.updated_at || null,
    updatedBy: row?.updated_by || null
  };
}

function mapAppCacheSettingsForResponse(row) {
  return {
    cacheVersion: String(row?.cache_version || '1'),
    updatedAt: row?.updated_at || null,
    updatedBy: row?.updated_by || null
  };
}

function mapDashboardNotificationSettingsForResponse(settings) {
  return {
    partnerRequestEnabled: Boolean(settings?.partnerRequestEnabled),
    partnerRequestRecipients: normalizeNotificationRecipients(settings?.partnerRequestRecipients),
    paymentEnabled: Boolean(settings?.paymentEnabled),
    paymentRecipients: normalizeNotificationRecipients(settings?.paymentRecipients),
    updatedAt: settings?.updatedAt || null,
    updatedBy: settings?.updatedBy || null
  };
}

function sanitizePrivacyPolicyTranslations(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const sanitized = {};
  privacyPolicyLanguages.forEach((language) => {
    const html = normalizePrivacyPolicyHtml(value?.[language]);
    if (html) {
      sanitized[language] = html;
    }
  });
  return sanitized;
}

function normalizePrivacyPolicyHtml(value) {
  const rawValue = String(value || '').trim();
  if (!rawValue) {
    return '';
  }

  const html = /<\/?[a-z][\s\S]*>/i.test(rawValue) ? rawValue : plainTextToHtml(rawValue);
  return stripUnsafePrivacyHtml(html).slice(0, privacyPolicyHtmlMaxLength);
}

function plainTextToHtml(value) {
  return String(value || '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function stripUnsafePrivacyHtml(value) {
  return String(value || '')
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|base)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|base)[^>]*\/?\s*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, '')
    .replace(/\s+(href|src)\s*=\s*"javascript:[^"]*"/gi, ' $1="#"')
    .replace(/\s+(href|src)\s*=\s*'javascript:[^']*'/gi, " $1='#'")
    .replace(/\s+(href|src)\s*=\s*javascript:[^\s>]+/gi, ' $1="#"');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function maskOpenAiApiKey(value) {
  const key = String(value || '').trim();
  if (!key) {
    return null;
  }
  if (key.length <= 12) {
    return `${key.slice(0, 4)}...`;
  }
  return `${key.slice(0, 7)}...${key.slice(-4)}`;
}

function buildPoiTranslationStatus(row, targetLanguage) {
  const translations = sanitizeCatalogPoiTranslations(row?.translations);
  const translation =
    targetLanguage === 'it'
      ? {
          descriptionShort: sanitizeCatalogText(row?.description_short),
          descriptionLong: sanitizeCatalogText(row?.description_long),
          audioUrl: String(row?.audio_url || '').trim()
        }
      : translations[targetLanguage] || {};
  const missingFields = ['descriptionShort', 'descriptionLong'].filter((field) => {
    return !String(translation?.[field] || '').trim();
  });
  const audioUrl = String(translation?.audioUrl || '').trim();

  return {
    poiId: row.id,
    cityId: row.city_id,
    cityName: row.city_name ? sanitizeCatalogText(row.city_name) : null,
    name: sanitizeCatalogText(row.name),
    targetLanguage,
    isComplete: missingFields.length === 0,
    textComplete: missingFields.length === 0,
    hasAudio: Boolean(audioUrl),
    audioUrl,
    missingFields,
    translation
  };
}

function buildPoiTranslationSummary(rows, targetLanguage) {
  const summary = {
    targetLanguage,
    totalPois: 0,
    textMissingPois: 0,
    textCompletePois: 0,
    audioMissingPois: 0,
    audioGenerableMissingPois: 0,
    audioReadyPois: 0
  };
  const citySummariesById = {};

  rows.forEach((row) => {
    const status = buildPoiTranslationStatus(row, targetLanguage);
    const cityId = status.cityId;
    if (!citySummariesById[cityId]) {
      citySummariesById[cityId] = {
        cityId,
        cityName: status.cityName,
        totalPois: 0,
        textMissingPois: 0,
        textCompletePois: 0,
        audioMissingPois: 0,
        audioGenerableMissingPois: 0,
        audioReadyPois: 0
      };
    }

    const citySummary = citySummariesById[cityId];
    summary.totalPois += 1;
    citySummary.totalPois += 1;

    const canGenerateAudio = Boolean(buildTranslatedPoiSpeechInput(status.translation));

    if (status.hasAudio) {
      summary.audioReadyPois += 1;
      citySummary.audioReadyPois += 1;
    } else {
      summary.audioMissingPois += 1;
      citySummary.audioMissingPois += 1;
    }

    if (!status.hasAudio && canGenerateAudio) {
      summary.audioGenerableMissingPois += 1;
      citySummary.audioGenerableMissingPois += 1;
    }

    if (status.isComplete) {
      summary.textCompletePois += 1;
      citySummary.textCompletePois += 1;
    } else {
      summary.textMissingPois += 1;
      citySummary.textMissingPois += 1;
    }
  });

  return {
    ...summary,
    cities: Object.values(citySummariesById).sort((left, right) =>
      String(left.cityName || '').localeCompare(String(right.cityName || ''), 'it-IT')
    )
  };
}

function mergePoiTranslationFields(existingTranslations, targetLanguage, translatedFields, options = {}) {
  const overwrite = Boolean(options.overwrite);
  const translations = sanitizeCatalogPoiTranslations(existingTranslations);
  const currentFields = translations[targetLanguage] || {};
  const nextFields = { ...currentFields };

  ['descriptionShort', 'descriptionLong', 'audioUrl'].forEach((field) => {
    const value = String(translatedFields?.[field] || '').trim();
    if (!value) {
      return;
    }
    if (overwrite || !String(nextFields[field] || '').trim()) {
      nextFields[field] = value;
    }
  });

  translations[targetLanguage] = nextFields;
  return translations;
}

function normalizePartnerRequestStatus(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'approved' || normalized === 'rejected') {
    return normalized;
  }
  return 'pending';
}

function normalizePartnerRequestPdfReleaseStatus(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'sent' ? 'sent' : 'pending';
}

function normalizePartnerPreviewCode(value) {
  const normalized = String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  return normalized.slice(0, 16);
}

function buildPartnerRequestPdfPayload(requestRow, options = {}) {
  const applyTo = options.applyTo || requestRow.apply_to || 'bundle';
  const optionCityNames = Array.isArray(options.cityNames) ? options.cityNames : null;
  const rowCityNames = normalizeTextArray(requestRow.city_names);
  const discountCode = normalizePartnerPreviewCode(
    options.discountCode !== undefined && options.discountCode !== null ? options.discountCode : requestRow.discount_code || ''
  );
  const userDiscountPercent =
    options.userDiscountPercent !== undefined && options.userDiscountPercent !== null
      ? optionalNumber(options.userDiscountPercent)
      : optionalNumber(resolveDiscountRowValue(requestRow, applyTo, 'user_discount_percent'));
  const structureFixedAmount =
    options.structureFixedAmount !== undefined && options.structureFixedAmount !== null
      ? optionalNumber(options.structureFixedAmount)
      : optionalNumber(resolveDiscountRowValue(requestRow, applyTo, 'structure_fixed_amount'));

  return {
    structureName: requestRow.structure_name,
    structureType: requestRow.structure_type,
    contactName: [requestRow.contact_first_name, requestRow.contact_last_name].filter(Boolean).join(' '),
    addressStreet: requestRow.address_street,
    addressNumber: requestRow.address_number,
    addressCity: requestRow.address_city,
    addressPostalCode: requestRow.address_postal_code,
    addressProvince: requestRow.address_province,
    addressRegion: requestRow.address_region,
    addressCountry: requestRow.address_country,
    website: requestRow.website,
    contactPhone: requestRow.contact_phone,
    contactEmail: requestRow.contact_email,
    applyTo,
    cityNames: optionCityNames || rowCityNames,
    discountCode,
    expiresAt: options.expiresAt || requestRow.expires_at || null,
    userDiscountPercent,
    structureFixedAmount
  };
}

function buildDiscountCodePdfPayload(discountCodeRow) {
  const applyTo = discountCodeRow.apply_to === 'single' ? 'single' : 'bundle';
  return {
    structureName: discountCodeRow.structure_name,
    structureType: '',
    contactName: '',
    addressStreet: discountCodeRow.address_street,
    addressNumber: discountCodeRow.address_number,
    addressCity: discountCodeRow.address_city,
    addressPostalCode: discountCodeRow.address_postal_code,
    addressProvince: discountCodeRow.address_province,
    addressRegion: '',
    addressCountry: discountCodeRow.address_country,
    website: '',
    contactPhone: '',
    contactEmail: '',
    applyTo,
    cityNames: normalizeTextArray(discountCodeRow.city_names),
    discountCode: normalizePartnerPreviewCode(discountCodeRow.discount_code || ''),
    expiresAt: discountCodeRow.expires_at || null,
    userDiscountPercent: optionalNumber(resolveDiscountRowValue(discountCodeRow, applyTo, 'user_discount_percent')),
    structureFixedAmount: optionalNumber(resolveDiscountRowValue(discountCodeRow, applyTo, 'structure_fixed_amount'))
  };
}

function mapPartnerRequestRow(row) {
  const approvedDiscountCodeId = row.approved_discount_code_id == null ? null : Number(row.approved_discount_code_id);
  const discountApplyTo = row.apply_to === 'single' || row.apply_to === 'bundle' ? row.apply_to : null;
  const discountCityIds = normalizeTextArray(row.city_ids);
  const discountCityNames = normalizeTextArray(row.city_names);
  const discountUserDiscountPercentSingle = optionalNumber(row.user_discount_percent_single ?? row.user_discount_percent);
  const discountUserDiscountPercentBundle = optionalNumber(row.user_discount_percent_bundle ?? row.user_discount_percent);
  const discountStructureFixedAmountSingle = optionalNumber(row.structure_fixed_amount_single ?? row.structure_fixed_amount);
  const discountStructureFixedAmountBundle = optionalNumber(row.structure_fixed_amount_bundle ?? row.structure_fixed_amount);
  const discountUserDiscountPercent =
    discountApplyTo === 'single' ? discountUserDiscountPercentSingle : discountUserDiscountPercentBundle;
  const discountStructureFixedAmount =
    discountApplyTo === 'single' ? discountStructureFixedAmountSingle : discountStructureFixedAmountBundle;
  const discountCode = row.discount_code ? sanitizeCatalogText(row.discount_code) : null;

  return {
    id: Number(row.id),
    structureName: sanitizeCatalogText(row.structure_name),
    structureType: row.structure_type ? sanitizeCatalogText(row.structure_type) : null,
    vatNumber: row.vat_number ? sanitizeCatalogText(row.vat_number) : null,
    contactFirstName: sanitizeCatalogText(row.contact_first_name),
    contactLastName: sanitizeCatalogText(row.contact_last_name),
    contactEmail: sanitizeCatalogText(row.contact_email),
    contactPhone: sanitizeCatalogText(row.contact_phone),
    website: row.website ? sanitizeCatalogText(row.website) : null,
    addressStreet: sanitizeCatalogText(row.address_street),
    addressNumber: row.address_number ? sanitizeCatalogText(row.address_number) : null,
    addressCity: sanitizeCatalogText(row.address_city),
    addressPostalCode: row.address_postal_code ? sanitizeCatalogText(row.address_postal_code) : null,
    addressProvince: row.address_province ? sanitizeCatalogText(row.address_province) : null,
    addressRegion: row.address_region ? sanitizeCatalogText(row.address_region) : null,
    addressCountry: row.address_country ? sanitizeCatalogText(row.address_country) : null,
    roomsCount: row.rooms_count == null ? null : Number(row.rooms_count),
    notes: row.notes ? sanitizeCatalogText(row.notes) : null,
    status: normalizePartnerRequestStatus(row.status),
    pdfReleaseStatus: normalizePartnerRequestPdfReleaseStatus(row.pdf_release_status),
    approvedStructureId: row.approved_structure_id || null,
    approvedDiscountCodeId,
    partnerUserId: row.partner_user_id || null,
    partnerUserEmail: row.partner_user_email ? sanitizeCatalogText(row.partner_user_email) : null,
    partnerUserFirstName: row.partner_user_first_name ? sanitizeCatalogText(row.partner_user_first_name) : null,
    partnerUserLastName: row.partner_user_last_name ? sanitizeCatalogText(row.partner_user_last_name) : null,
    partnerUserIsRegistered: row.partner_user_is_registered == null ? null : Boolean(row.partner_user_is_registered),
    partnerInviteExpiresAt: row.partner_invite_expires_at || null,
    partnerInviteUsedAt: row.partner_invite_used_at || null,
    partnerInviteCreatedAt: row.partner_invite_created_at || null,
    discountCode,
    discount:
      discountCode && approvedDiscountCodeId
        ? {
            id: approvedDiscountCodeId,
            code: discountCode,
            applyTo: discountApplyTo || 'bundle',
            cityId: discountCityIds[0] || (row.city_id ? String(row.city_id).trim() : '') || null,
            cityName: discountCityNames[0] || (row.city_name ? sanitizeCatalogText(row.city_name) : null),
            cityIds: discountCityIds,
            cityNames: discountCityNames,
            userDiscountPercent: discountUserDiscountPercent ?? 0,
            structureFixedAmount: discountStructureFixedAmount ?? 0,
            expiresAt: row.expires_at || null
          }
        : null,
    approvalEmailSentAt: row.approval_email_sent_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function inferAudioExtension(fileName = '', mimeType = '') {
  const extFromName = path.extname(fileName).toLowerCase().replace('.', '');
  const allowed = new Set(['mp3', 'm4a', 'wav', 'ogg', 'aac']);
  if (allowed.has(extFromName)) {
    return extFromName;
  }

  const normalizedMime = String(mimeType || '').toLowerCase();
  if (normalizedMime.includes('mpeg') || normalizedMime.includes('mp3')) {
    return 'mp3';
  }
  if (normalizedMime.includes('mp4') || normalizedMime.includes('m4a')) {
    return 'm4a';
  }
  if (normalizedMime.includes('wav')) {
    return 'wav';
  }
  if (normalizedMime.includes('ogg')) {
    return 'ogg';
  }
  if (normalizedMime.includes('aac')) {
    return 'aac';
  }
  return 'mp3';
}

function buildTranslatedPoiSpeechInput(translation) {
  const descriptionLong = String(translation?.descriptionLong || '').trim();
  const descriptionShort = String(translation?.descriptionShort || '').trim();
  return descriptionLong || descriptionShort;
}

async function storeGeneratedPoiAudio({ cityId, poiName, targetLanguage, audioBuffer }) {
  const cityFolder = await resolveCityFolder({ cityId });
  if (!cityFolder) {
    return null;
  }

  const cityAudioDir = path.join(publicAudioRootDir, cityFolder.folderSlug);
  await fs.mkdir(cityAudioDir, { recursive: true });
  const baseName = slugify(`${poiName}-${targetLanguage}`) || `audio-${targetLanguage}`;
  const storedFileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${baseName}.mp3`;
  const absolutePath = path.join(cityAudioDir, storedFileName);
  await fs.writeFile(absolutePath, audioBuffer);

  return `/public/audio/${cityFolder.folderSlug}/${storedFileName}`;
}

function inferImageExtension(fileName = '', mimeType = '') {
  const extFromName = path.extname(fileName).toLowerCase().replace('.', '');
  const allowed = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']);
  if (allowed.has(extFromName)) {
    return extFromName === 'jpeg' ? 'jpg' : extFromName;
  }

  const normalizedMime = String(mimeType || '').toLowerCase();
  if (normalizedMime.includes('jpeg') || normalizedMime.includes('jpg')) {
    return 'jpg';
  }
  if (normalizedMime.includes('png')) {
    return 'png';
  }
  if (normalizedMime.includes('webp')) {
    return 'webp';
  }
  if (normalizedMime.includes('gif')) {
    return 'gif';
  }
  if (normalizedMime.includes('avif')) {
    return 'avif';
  }
  return 'jpg';
}

function buildStructureAddress({ street, streetNumber, city, postalCode, province, country }) {
  const normalizedProvince = province ? province.trim().toUpperCase() : '';
  const normalizedCountry = country ? country.trim() : '';
  const line1 = `${street.trim()} ${streetNumber.trim()}`.trim();
  const cityTokens = [postalCode.trim(), city.trim()];
  if (normalizedProvince) {
    cityTokens.push(`(${normalizedProvince})`);
  }
  const line2 = cityTokens.filter(Boolean).join(' ');
  return [line1, line2, normalizedCountry].filter(Boolean).join(', ');
}

function generateInviteCode(length = 6) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let index = 0; index < length; index += 1) {
    const position = crypto.randomInt(0, alphabet.length);
    code += alphabet[position];
  }
  return code;
}

async function structureInviteCodeExists(inviteCode, client = pool) {
  const result = await client.query(
    `
      SELECT 1
      FROM dashboard_structure_discount_codes
      WHERE UPPER(code) = $1
      UNION
      SELECT 1
      FROM dashboard_structures
      WHERE invite_code IS NOT NULL
        AND UPPER(invite_code) = $1
      LIMIT 1
    `,
    [inviteCode.toUpperCase()]
  );

  return result.rowCount > 0;
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

async function fetchStructureById(structureId, client = pool) {
  const result = await client.query(
    `
      SELECT
        id,
        name,
        address,
        address_street,
        address_number,
        address_city,
        address_postal_code,
        address_province,
        address_country,
        invite_code,
        user_discount_percent,
        structure_fixed_amount,
        created_at,
        updated_at
      FROM dashboard_structures
      WHERE id = $1
        AND deleted = 0
      LIMIT 1
    `,
    [structureId]
  );

  return result.rowCount ? result.rows[0] : null;
}

async function fetchPartnerRequestById(requestId, client = pool, options = {}) {
  const lockSql = options.forUpdate ? 'FOR UPDATE OF pr' : '';
  const deletedFilterSql = options.includeDeleted ? '' : 'AND pr.deleted = 0';
  const result = await client.query(
    `
      SELECT
        pr.id,
        pr.structure_name,
        pr.structure_type,
        pr.vat_number,
        pr.contact_first_name,
        pr.contact_last_name,
        pr.contact_email,
        pr.contact_phone,
        pr.website,
        pr.address_street,
        pr.address_number,
        pr.address_city,
        pr.address_postal_code,
        pr.address_province,
        pr.address_region,
        pr.address_country,
        pr.rooms_count,
        pr.notes,
        pr.status,
        pr.pdf_release_status,
        pr.deleted,
        pr.approved_structure_id,
        pr.approved_discount_code_id,
        pr.approval_email_sent_at,
        partner_user.id AS partner_user_id,
        partner_user.email AS partner_user_email,
        partner_user.first_name AS partner_user_first_name,
        partner_user.last_name AS partner_user_last_name,
        partner_user.is_registered AS partner_user_is_registered,
        partner_user.invite_expires_at AS partner_invite_expires_at,
        partner_user.invite_used_at AS partner_invite_used_at,
        partner_user.invite_created_at AS partner_invite_created_at,
        dc.code AS discount_code,
        dc.apply_to,
        dc.city_id,
        legacy_city.name AS city_name,
        COALESCE(city_links.city_ids, CASE WHEN dc.city_id IS NOT NULL THEN ARRAY[dc.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
        COALESCE(city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
        dc.user_discount_percent,
        dc.user_discount_percent_single,
        dc.user_discount_percent_bundle,
        dc.structure_fixed_amount,
        dc.structure_fixed_amount_single,
        dc.structure_fixed_amount_bundle,
        dc.expires_at,
        pr.created_at,
        pr.updated_at
      FROM partner_registration_requests pr
      LEFT JOIN dashboard_structure_discount_codes dc ON dc.id = pr.approved_discount_code_id
      LEFT JOIN cities legacy_city ON legacy_city.id = dc.city_id
      LEFT JOIN LATERAL (
        SELECT
          ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
          ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
        FROM dashboard_structure_discount_code_cities dcc
        JOIN cities c ON c.id = dcc.city_id
        WHERE dcc.discount_code_id = dc.id
      ) city_links ON TRUE
      LEFT JOIN LATERAL (
        SELECT
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          u.is_registered,
          latest_invite.expires_at AS invite_expires_at,
          latest_invite.used_at AS invite_used_at,
          latest_invite.created_at AS invite_created_at
        FROM dashboard_users u
        LEFT JOIN LATERAL (
          SELECT i.expires_at, i.used_at, i.created_at
          FROM dashboard_invites i
          WHERE i.user_id = u.id
          ORDER BY i.created_at DESC, i.id DESC
          LIMIT 1
        ) latest_invite ON TRUE
        WHERE u.deleted = 0
          AND u.structure_id = pr.approved_structure_id
          AND LOWER(u.email) = LOWER(pr.contact_email)
        ORDER BY u.is_registered DESC, u.updated_at DESC
        LIMIT 1
      ) partner_user ON TRUE
      WHERE pr.id = $1
        ${deletedFilterSql}
      LIMIT 1
      ${lockSql}
    `,
    [requestId]
  );

  return result.rowCount ? result.rows[0] : null;
}

async function createPartnerActivationInvite({ client, requestRow, structureId, invitedByUserId, origin }) {
  const partnerEmail = String(requestRow.contact_email || '').trim().toLowerCase();
  if (!partnerEmail) {
    return { error: { status: 400, message: 'Email referente partner mancante' } };
  }

  const structureName = String(requestRow.structure_name || '').trim();
  const partnerFirstName = String(requestRow.contact_first_name || '').trim();
  const partnerLastName = String(requestRow.contact_last_name || '').trim();
  const partnerName = [partnerFirstName, partnerLastName].filter(Boolean).join(' ') || partnerEmail;
  const partnerUserResult = await client.query(
    `
      SELECT id, email, is_registered
      FROM dashboard_users
      WHERE email = $1
      FOR UPDATE
    `,
    [partnerEmail]
  );

  let partnerUserId;
  if (!partnerUserResult.rowCount) {
    partnerUserId = `usr_${crypto.randomUUID()}`;
    const placeholderHash = await hashPassword(createOpaqueToken(24));
    await client.query(
      `
        INSERT INTO dashboard_users (
          id,
          name,
          first_name,
          last_name,
          facility_name,
          structure_id,
          email,
          password_hash,
          role,
          is_registered,
          invited_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'facility_manager', FALSE, $9)
      `,
      [
        partnerUserId,
        partnerName,
        partnerFirstName,
        partnerLastName,
        structureName,
        structureId,
        partnerEmail,
        placeholderHash,
        invitedByUserId
      ]
    );
  } else {
    const existingPartnerUser = partnerUserResult.rows[0];
    if (existingPartnerUser.is_registered) {
      return {
        error: {
          status: 409,
          message: 'Esiste gia un utente dashboard registrato con questa email. Associa manualmente la struttura o usa un altro referente.'
        }
      };
    }

    partnerUserId = existingPartnerUser.id;
    await client.query(
      `
        UPDATE dashboard_users
        SET invited_by = $1,
            role = 'facility_manager',
            name = $2,
            first_name = $3,
            last_name = $4,
            facility_name = $5,
            structure_id = $6,
            updated_at = NOW()
        WHERE id = $7
      `,
      [invitedByUserId, partnerName, partnerFirstName, partnerLastName, structureName, structureId, partnerUserId]
    );
  }

  await client.query('UPDATE dashboard_invites SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL', [partnerUserId]);

  const rawActivationToken = createOpaqueToken(32);
  const activationTokenHash = hashToken(rawActivationToken);
  const activationExpiresAt = inviteExpiryDate();
  await client.query(
    `
      INSERT INTO dashboard_invites (email, user_id, token_hash, invited_by, expires_at)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [partnerEmail, partnerUserId, activationTokenHash, invitedByUserId, activationExpiresAt.toISOString()]
  );

  const activationOrigin = normalizedOrigin(origin);
  return {
    partnerUserId,
    activationUrl: `${activationOrigin}/auth/complete-registration?token=${encodeURIComponent(rawActivationToken)}`,
    activationExpiresAt: activationExpiresAt.toISOString()
  };
}

async function fetchDiscountCodeByIdForPdf(discountCodeId, client = pool, options = {}) {
  const params = [discountCodeId];
  const structureFilter = options.structureId ? 'AND dc.structure_id = $2' : '';
  if (options.structureId) {
    params.push(options.structureId);
  }

  const result = await client.query(
    `
      SELECT
        dc.id,
        dc.structure_id,
        s.name AS structure_name,
        s.address,
        s.address_street,
        s.address_number,
        s.address_city,
        s.address_postal_code,
        s.address_province,
        s.address_country,
        dc.code AS discount_code,
        dc.apply_to,
        dc.city_id,
        legacy_city.name AS city_name,
        COALESCE(city_links.city_ids, CASE WHEN dc.city_id IS NOT NULL THEN ARRAY[dc.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
        COALESCE(city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
        dc.user_discount_percent,
        dc.user_discount_percent_single,
        dc.user_discount_percent_bundle,
        dc.structure_fixed_amount,
        dc.structure_fixed_amount_single,
        dc.structure_fixed_amount_bundle,
        dc.expires_at,
        dc.created_at,
        dc.updated_at
      FROM dashboard_structure_discount_codes dc
      JOIN dashboard_structures s ON s.id = dc.structure_id AND s.deleted = 0
      LEFT JOIN cities legacy_city ON legacy_city.id = dc.city_id
      LEFT JOIN LATERAL (
        SELECT
          ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
          ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
        FROM dashboard_structure_discount_code_cities dcc
        JOIN cities c ON c.id = dcc.city_id
        WHERE dcc.discount_code_id = dc.id
      ) city_links ON TRUE
      WHERE dc.id = $1
        ${structureFilter}
      LIMIT 1
    `,
    params
  );

  return result.rowCount ? result.rows[0] : null;
}

async function fetchCitiesByIds(cityIds, client = pool) {
  if (!Array.isArray(cityIds) || !cityIds.length) {
    return [];
  }

  const result = await client.query(
    `
      SELECT id, name
      FROM cities
      WHERE id = ANY($1::TEXT[])
    `,
    [cityIds]
  );

  return result.rows;
}

async function fetchStructureByInviteCode(inviteCode, client = pool) {
  const result = await client.query(
    `
      SELECT
        id,
        name,
        address,
        address_street,
        address_number,
        address_city,
        address_postal_code,
        address_province,
        address_country,
        (
          SELECT dc.code
          FROM dashboard_structure_discount_codes dc
          WHERE dc.structure_id = s.id
          ORDER BY (dc.expires_at > NOW()) DESC, dc.expires_at ASC, dc.created_at ASC
          LIMIT 1
        ) AS invite_code,
        user_discount_percent,
        structure_fixed_amount,
        created_at,
        updated_at
      FROM dashboard_structures s
      JOIN dashboard_structure_discount_codes d ON d.structure_id = s.id
      WHERE UPPER(d.code) = $1
        AND s.deleted = 0
      LIMIT 1
    `,
    [inviteCode.toUpperCase()]
  );

  return result.rowCount ? result.rows[0] : null;
}

async function fetchCityById(cityId, client = pool) {
  const result = await client.query(
    `
      SELECT id, name, region, bundle_price, hero_image, is_default, publication_status, translations
      FROM cities
      WHERE id = $1
      LIMIT 1
    `,
    [cityId]
  );
  return result.rowCount ? result.rows[0] : null;
}

async function fetchPoiById(poiId, client = pool) {
  const result = await client.query(
    `
      SELECT
        p.id,
        p.city_id,
        c.name AS city_name,
        p.name,
        p.address,
        p.lat,
        p.lng,
        p.category,
        p.description_short,
        p.description_long,
        p.image_url,
        p.audio_url,
        p.price_single,
        p.duration_sec,
        p.publication_status,
        p.translations
      FROM pois p
      JOIN cities c ON c.id = p.city_id
      WHERE p.id = $1
      LIMIT 1
    `,
    [poiId]
  );
  return result.rowCount ? result.rows[0] : null;
}

async function getOpenAiTranslationSettings(client = pool) {
  const result = await client.query(
    `
      SELECT id, api_key, model, tts_model, tts_voice, tts_instructions, updated_at, updated_by
      FROM dashboard_openai_translation_settings
      WHERE id = 1
      LIMIT 1
    `
  );

  if (result.rowCount) {
    return result.rows[0];
  }

  const inserted = await client.query(
    `
      INSERT INTO dashboard_openai_translation_settings (id, model, tts_model, tts_voice, tts_instructions)
      VALUES (1, $1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET
        model = COALESCE(dashboard_openai_translation_settings.model, EXCLUDED.model),
        tts_model = COALESCE(dashboard_openai_translation_settings.tts_model, EXCLUDED.tts_model),
        tts_voice = COALESCE(dashboard_openai_translation_settings.tts_voice, EXCLUDED.tts_voice),
        tts_instructions = COALESCE(dashboard_openai_translation_settings.tts_instructions, EXCLUDED.tts_instructions)
      RETURNING id, api_key, model, tts_model, tts_voice, tts_instructions, updated_at, updated_by
    `,
    [DEFAULT_OPENAI_TRANSLATION_MODEL, DEFAULT_OPENAI_TTS_MODEL, DEFAULT_OPENAI_TTS_VOICE, DEFAULT_OPENAI_TTS_INSTRUCTIONS]
  );

  return inserted.rows[0];
}

async function getPartnerEmailSettings(client = pool) {
  const result = await client.query(
    `
      SELECT
        id,
        approval_subject,
        approval_body,
        rejection_subject,
        rejection_body,
        activation_subject,
        activation_body,
        updated_at,
        updated_by
      FROM dashboard_partner_email_settings
      WHERE id = 1
      LIMIT 1
    `
  );

  if (result.rowCount) {
    return result.rows[0];
  }

  const inserted = await client.query(
    `
      INSERT INTO dashboard_partner_email_settings (
        id,
        approval_subject,
        approval_body,
        rejection_subject,
        rejection_body,
        activation_subject,
        activation_body
      )
      VALUES (1, $1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        approval_subject = COALESCE(dashboard_partner_email_settings.approval_subject, EXCLUDED.approval_subject),
        approval_body = COALESCE(dashboard_partner_email_settings.approval_body, EXCLUDED.approval_body),
        rejection_subject = COALESCE(dashboard_partner_email_settings.rejection_subject, EXCLUDED.rejection_subject),
        rejection_body = COALESCE(dashboard_partner_email_settings.rejection_body, EXCLUDED.rejection_body),
        activation_subject = COALESCE(dashboard_partner_email_settings.activation_subject, EXCLUDED.activation_subject),
        activation_body = COALESCE(dashboard_partner_email_settings.activation_body, EXCLUDED.activation_body)
      RETURNING
        id,
        approval_subject,
        approval_body,
        rejection_subject,
        rejection_body,
        activation_subject,
        activation_body,
        updated_at,
        updated_by
    `,
    [
      DEFAULT_PARTNER_EMAIL_SETTINGS.approvalSubject,
      DEFAULT_PARTNER_EMAIL_SETTINGS.approvalBody,
      DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionSubject,
      DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionBody,
      DEFAULT_PARTNER_EMAIL_SETTINGS.activationSubject,
      DEFAULT_PARTNER_EMAIL_SETTINGS.activationBody
    ]
  );

  return inserted.rows[0];
}

async function getPrivacyPolicySettings(client = pool) {
  const result = await client.query(
    `
      SELECT id, translations, updated_at, updated_by
      FROM dashboard_privacy_policy_settings
      WHERE id = 1
      LIMIT 1
    `
  );

  if (result.rowCount) {
    return result.rows[0];
  }

  const inserted = await client.query(
    `
      INSERT INTO dashboard_privacy_policy_settings (id, translations)
      VALUES (1, '{}'::jsonb)
      ON CONFLICT (id) DO UPDATE SET translations = COALESCE(dashboard_privacy_policy_settings.translations, EXCLUDED.translations)
      RETURNING id, translations, updated_at, updated_by
    `
  );

  return inserted.rows[0];
}

async function getLegalDocumentSettings(documentType, client = pool) {
  if (documentType === 'privacyPolicy') {
    return getPrivacyPolicySettings(client);
  }

  const documentDbType = legalDocumentDbTypes[documentType];
  const result = await client.query(
    `
      SELECT document_type, translations, updated_at, updated_by
      FROM dashboard_legal_document_settings
      WHERE document_type = $1
      LIMIT 1
    `,
    [documentDbType]
  );

  if (result.rowCount) {
    return result.rows[0];
  }

  const inserted = await client.query(
    `
      INSERT INTO dashboard_legal_document_settings (document_type, translations)
      VALUES ($1, '{}'::jsonb)
      ON CONFLICT (document_type) DO UPDATE SET
        translations = COALESCE(dashboard_legal_document_settings.translations, EXCLUDED.translations)
      RETURNING document_type, translations, updated_at, updated_by
    `,
    [documentDbType]
  );

  return inserted.rows[0];
}

async function getAllLegalDocumentSettings(client = pool) {
  const documents = {};
  for (const documentType of legalDocumentTypes) {
    const row = await getLegalDocumentSettings(documentType, client);
    documents[documentType] = mapLegalDocumentSettingsForResponse(documentType, row);
  }
  return documents;
}

async function saveLegalDocumentSettings(documentType, translations, updatedBy, client = pool) {
  if (documentType === 'privacyPolicy') {
    const saved = await client.query(
      `
        INSERT INTO dashboard_privacy_policy_settings (
          id,
          translations,
          updated_by,
          updated_at
        )
        VALUES (1, $1::jsonb, $2, NOW())
        ON CONFLICT (id) DO UPDATE SET
          translations = EXCLUDED.translations,
          updated_by = EXCLUDED.updated_by,
          updated_at = NOW()
        RETURNING id, translations, updated_at, updated_by
      `,
      [JSON.stringify(translations), updatedBy]
    );

    return saved.rows[0];
  }

  const documentDbType = legalDocumentDbTypes[documentType];
  const saved = await client.query(
    `
      INSERT INTO dashboard_legal_document_settings (
        document_type,
        translations,
        updated_by,
        updated_at
      )
      VALUES ($1, $2::jsonb, $3, NOW())
      ON CONFLICT (document_type) DO UPDATE SET
        translations = EXCLUDED.translations,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW()
      RETURNING document_type, translations, updated_at, updated_by
    `,
    [documentDbType, JSON.stringify(translations), updatedBy]
  );

  return saved.rows[0];
}

async function getAppCacheSettings(client = pool) {
  const result = await client.query(
    `
      SELECT id, cache_version, updated_at, updated_by
      FROM dashboard_app_cache_settings
      WHERE id = 1
      LIMIT 1
    `
  );

  if (result.rowCount) {
    return result.rows[0];
  }

  const inserted = await client.query(
    `
      INSERT INTO dashboard_app_cache_settings (id, cache_version)
      VALUES (1, '1')
      ON CONFLICT (id) DO UPDATE SET cache_version = COALESCE(dashboard_app_cache_settings.cache_version, EXCLUDED.cache_version)
      RETURNING id, cache_version, updated_at, updated_by
    `
  );

  return inserted.rows[0];
}

async function fetchUserRow(userId, client = pool) {
  const result = await client.query(
    `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.role,
        u.is_registered,
        u.structure_id,
        s.name AS structure_name,
        s.address AS structure_address,
        (
          SELECT dc.code
          FROM dashboard_structure_discount_codes dc
          WHERE dc.structure_id = u.structure_id
          ORDER BY (dc.expires_at > NOW()) DESC, dc.expires_at ASC, dc.created_at ASC
          LIMIT 1
        ) AS structure_invite_code,
        u.created_at,
        u.updated_at
      FROM dashboard_users u
      LEFT JOIN dashboard_structures s ON s.id = u.structure_id AND s.deleted = 0
      WHERE u.id = $1
        AND u.deleted = 0
      LIMIT 1
    `,
    [userId]
  );

  if (!result.rowCount) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    email: row.email,
    role: row.role,
    isRegistered: row.is_registered,
    structureId: row.structure_id || null,
    structureName: row.structure_name || null,
    structureAddress: row.structure_address || null,
    structureInviteCode: row.structure_invite_code || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

router.get('/structures', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const result = await pool.query(
      `
        SELECT
          s.id,
          s.name,
          s.address,
          s.address_street,
          s.address_number,
          s.address_city,
          s.address_postal_code,
          s.address_province,
          s.address_country,
          (
            SELECT dc.code
            FROM dashboard_structure_discount_codes dc
            WHERE dc.structure_id = s.id
            ORDER BY (dc.expires_at > NOW()) DESC, dc.expires_at ASC, dc.created_at ASC
            LIMIT 1
          ) AS invite_code,
          s.user_discount_percent,
          s.structure_fixed_amount,
          s.created_at,
          s.updated_at,
          (
            SELECT COUNT(*)::INT
            FROM (
              SELECT u.id AS user_id
              FROM dashboard_users u
              WHERE u.structure_id = s.id
                AND u.deleted = 0
              UNION
              SELECT l.user_id
              FROM app_user_structure_links l
              WHERE l.structure_id = s.id
              UNION
              SELECT p.user_id
              FROM purchases p
              WHERE p.structure_id = s.id
                AND p.hidden = 0
            ) linked_users
          ) AS users_count,
          (
            SELECT COALESCE(SUM(p.structure_earning_amount), 0)::NUMERIC
            FROM purchases p
            WHERE p.structure_id = s.id
              AND p.hidden = 0
          ) AS total_structure_earnings
        FROM dashboard_structures s
        WHERE s.deleted = 0
        ORDER BY s.created_at ASC
      `
    );

    return res.json(
      result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        address: row.address,
        street: row.address_street || null,
        streetNumber: row.address_number || null,
        city: row.address_city || null,
        postalCode: row.address_postal_code || null,
        province: row.address_province || null,
        country: row.address_country || null,
        inviteCode: row.invite_code,
        userDiscountPercent: Number(row.user_discount_percent || 0),
        structureFixedAmount: Number(row.structure_fixed_amount || 0),
        usersCount: Number(row.users_count || 0),
        totalStructureEarnings: Number(row.total_structure_earnings || 0),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
    );
  } catch (error) {
    return next(error);
  }
});

router.post('/structures/invite-code', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const maxAttempts = 30;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const inviteCode = generateInviteCode(6);
      const alreadyUsed = await structureInviteCodeExists(inviteCode);
      if (!alreadyUsed) {
        return res.status(201).json({ inviteCode });
      }
    }

    return res.status(503).json({ message: 'Impossibile generare un codice univoco, riprova tra poco' });
  } catch (error) {
    return next(error);
  }
});

router.post('/structures', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = structureCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const normalizedStreet = payload.street.trim();
  const normalizedStreetNumber = payload.streetNumber.trim();
  const normalizedCity = payload.city.trim();
  const normalizedPostalCode = payload.postalCode.trim();
  const normalizedProvince = payload.province?.trim().toUpperCase() || null;
  const normalizedCountry = payload.country?.trim() || 'Italia';
  const normalizedAddress = buildStructureAddress({
    street: normalizedStreet,
    streetNumber: normalizedStreetNumber,
    city: normalizedCity,
    postalCode: normalizedPostalCode,
    province: normalizedProvince,
    country: normalizedCountry
  });

  try {
    const result = await pool.query(
      `
        INSERT INTO dashboard_structures (
          id,
          name,
          address,
          address_street,
          address_number,
          address_city,
          address_postal_code,
          address_province,
          address_country
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING
          id,
          name,
          address,
          address_street,
          address_number,
          address_city,
          address_postal_code,
          address_province,
          address_country,
          invite_code,
          user_discount_percent,
          structure_fixed_amount,
          created_at,
          updated_at
      `,
      [
        `str_${crypto.randomUUID()}`,
        payload.name,
        normalizedAddress,
        normalizedStreet,
        normalizedStreetNumber,
        normalizedCity,
        normalizedPostalCode,
        normalizedProvince,
        normalizedCountry
      ]
    );

    const row = result.rows[0];
    return res.status(201).json({
      id: row.id,
      name: row.name,
      address: row.address,
      street: row.address_street || null,
      streetNumber: row.address_number || null,
      city: row.address_city || null,
      postalCode: row.address_postal_code || null,
      province: row.address_province || null,
      country: row.address_country || null,
      inviteCode: row.invite_code || null,
      userDiscountPercent: Number(row.user_discount_percent || 0),
      structureFixedAmount: Number(row.structure_fixed_amount || 0),
      usersCount: 0,
      totalStructureEarnings: 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    return next(error);
  }
});

router.patch('/structures/:structureId', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = structureUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const structureId = String(req.params.structureId || '').trim();
  if (!structureId) {
    return res.status(400).json({ message: 'Struttura non valida' });
  }

  const payload = parsed.data;
  const normalizedStreet = payload.street.trim();
  const normalizedStreetNumber = payload.streetNumber.trim();
  const normalizedCity = payload.city.trim();
  const normalizedPostalCode = payload.postalCode.trim();
  const normalizedProvince = payload.province?.trim().toUpperCase() || null;
  const normalizedCountry = payload.country?.trim() || 'Italia';
  const normalizedAddress = buildStructureAddress({
    street: normalizedStreet,
    streetNumber: normalizedStreetNumber,
    city: normalizedCity,
    postalCode: normalizedPostalCode,
    province: normalizedProvince,
    country: normalizedCountry
  });

  try {
    const updateResult = await pool.query(
      `
        UPDATE dashboard_structures
        SET name = $1,
            address = $2,
            address_street = $3,
            address_number = $4,
            address_city = $5,
            address_postal_code = $6,
            address_province = $7,
            address_country = $8,
            updated_at = NOW()
        WHERE id = $9
          AND deleted = 0
        RETURNING
          id,
          name,
          address,
          address_street,
          address_number,
          address_city,
          address_postal_code,
          address_province,
          address_country,
          invite_code,
          user_discount_percent,
          structure_fixed_amount,
          created_at,
          updated_at
      `,
      [
        payload.name,
        normalizedAddress,
        normalizedStreet,
        normalizedStreetNumber,
        normalizedCity,
        normalizedPostalCode,
        normalizedProvince,
        normalizedCountry,
        structureId
      ]
    );

    if (!updateResult.rowCount) {
      return res.status(404).json({ message: 'Struttura non trovata' });
    }

    const usersCountResult = await pool.query(
      `
        SELECT COUNT(*)::INT AS users_count
        FROM (
          SELECT u.id AS user_id
          FROM dashboard_users u
          WHERE u.structure_id = $1
            AND u.deleted = 0
          UNION
          SELECT l.user_id
          FROM app_user_structure_links l
          WHERE l.structure_id = $1
          UNION
          SELECT p.user_id
          FROM purchases p
          WHERE p.structure_id = $1
            AND p.hidden = 0
        ) linked_users
      `,
      [structureId]
    );
    const earningsResult = await pool.query(
      `
        SELECT COALESCE(SUM(structure_earning_amount), 0)::NUMERIC AS total_structure_earnings
        FROM purchases
        WHERE structure_id = $1
          AND hidden = 0
      `,
      [structureId]
    );
    const usersCount = usersCountResult.rows[0]?.users_count || 0;
    const totalStructureEarnings = earningsResult.rows[0]?.total_structure_earnings || 0;
    const row = updateResult.rows[0];

    return res.json({
      id: row.id,
      name: row.name,
      address: row.address,
      street: row.address_street || null,
      streetNumber: row.address_number || null,
      city: row.address_city || null,
      postalCode: row.address_postal_code || null,
      province: row.address_province || null,
      country: row.address_country || null,
      inviteCode: row.invite_code || null,
      userDiscountPercent: Number(row.user_discount_percent || 0),
      structureFixedAmount: Number(row.structure_fixed_amount || 0),
      usersCount: Number(usersCount),
      totalStructureEarnings: Number(totalStructureEarnings || 0),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    return next(error);
  }
});

router.patch('/structures/:structureId/discounts', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = structureDiscountUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const structureId = String(req.params.structureId || '').trim();
  if (!structureId) {
    return res.status(400).json({ message: 'Struttura non valida' });
  }

  const payload = parsed.data;
  try {
    const updateResult = await pool.query(
      `
        UPDATE dashboard_structures
        SET user_discount_percent = $1,
            structure_fixed_amount = $2,
            updated_at = NOW()
        WHERE id = $3
          AND deleted = 0
        RETURNING
          id,
          name,
          address,
          address_street,
          address_number,
          address_city,
          address_postal_code,
          address_province,
          address_country,
          invite_code,
          user_discount_percent,
          structure_fixed_amount,
          created_at,
          updated_at
      `,
      [payload.userDiscountPercent, payload.structureFixedAmount, structureId]
    );

    if (!updateResult.rowCount) {
      return res.status(404).json({ message: 'Struttura non trovata' });
    }

    const usersCountResult = await pool.query(
      `
        SELECT COUNT(*)::INT AS users_count
        FROM (
          SELECT u.id AS user_id
          FROM dashboard_users u
          WHERE u.structure_id = $1
            AND u.deleted = 0
          UNION
          SELECT l.user_id
          FROM app_user_structure_links l
          WHERE l.structure_id = $1
          UNION
          SELECT p.user_id
          FROM purchases p
          WHERE p.structure_id = $1
            AND p.hidden = 0
        ) linked_users
      `,
      [structureId]
    );
    const earningsResult = await pool.query(
      `
        SELECT COALESCE(SUM(structure_earning_amount), 0)::NUMERIC AS total_structure_earnings
        FROM purchases
        WHERE structure_id = $1
          AND hidden = 0
      `,
      [structureId]
    );
    const usersCount = usersCountResult.rows[0]?.users_count || 0;
    const totalStructureEarnings = earningsResult.rows[0]?.total_structure_earnings || 0;
    const row = updateResult.rows[0];

    return res.json({
      id: row.id,
      name: row.name,
      address: row.address,
      street: row.address_street || null,
      streetNumber: row.address_number || null,
      city: row.address_city || null,
      postalCode: row.address_postal_code || null,
      province: row.address_province || null,
      country: row.address_country || null,
      inviteCode: row.invite_code,
      userDiscountPercent: Number(row.user_discount_percent || 0),
      structureFixedAmount: Number(row.structure_fixed_amount || 0),
      usersCount: Number(usersCount),
      totalStructureEarnings: Number(totalStructureEarnings || 0),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/structures/:structureId', requireAuth, requireAdmin, async (req, res, next) => {
  const structureId = String(req.params.structureId || '').trim();
  if (!structureId) {
    return res.status(400).json({ message: 'Struttura non valida' });
  }

  try {
    const deleted = await pool.query(
      `
        UPDATE dashboard_structures
        SET deleted = 1,
            updated_at = NOW()
        WHERE id = $1
          AND deleted = 0
        RETURNING id
      `,
      [structureId]
    );
    if (!deleted.rowCount) {
      return res.status(404).json({ message: 'Struttura non trovata' });
    }

    return res.json({ deleted: true, structureId });
  } catch (error) {
    return next(error);
  }
});

router.get('/discount-codes', requireAuth, async (req, res, next) => {
  const role = req.authSession?.user?.role;
  if (!canViewDiscountCodes(role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const parsed = discountCodesQuerySchema.safeParse({
    structureId: String(req.query.structureId || '').trim() || undefined
  });
  if (!parsed.success) {
    return res.status(400).json({ message: 'Query non valida', errors: parsed.error.flatten() });
  }

  const managerStructureId = req.authSession?.user?.structureId || null;
  const requestedStructureId = parsed.data.structureId || null;
  const structureId = role === 'facility_manager' ? managerStructureId : requestedStructureId;
  if (role === 'facility_manager' && !structureId) {
    return res.json([]);
  }

  const params = [];
  let whereSql = '';
  if (structureId) {
    params.push(structureId);
    whereSql = 'WHERE dc.structure_id = $1';
  }

  try {
    const result = await pool.query(
      `
        SELECT
          dc.id,
          dc.structure_id,
          s.name AS structure_name,
          s.address AS structure_address,
          dc.apply_to,
          dc.city_id,
          legacy_city.name AS city_name,
          COALESCE(city_links.city_ids, CASE WHEN dc.city_id IS NOT NULL THEN ARRAY[dc.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
          COALESCE(city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
          dc.code,
          dc.user_discount_percent,
          dc.user_discount_percent_single,
          dc.user_discount_percent_bundle,
          dc.structure_fixed_amount,
          dc.structure_fixed_amount_single,
          dc.structure_fixed_amount_bundle,
          dc.expires_at,
          dc.created_at,
          dc.updated_at
        FROM dashboard_structure_discount_codes dc
        JOIN dashboard_structures s ON s.id = dc.structure_id AND s.deleted = 0
        LEFT JOIN cities legacy_city ON legacy_city.id = dc.city_id
        LEFT JOIN LATERAL (
          SELECT
            ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
            ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
          FROM dashboard_structure_discount_code_cities dcc
          JOIN cities c ON c.id = dcc.city_id
          WHERE dcc.discount_code_id = dc.id
        ) city_links ON TRUE
        ${whereSql}
        ORDER BY s.name ASC, dc.created_at DESC, dc.id DESC
      `,
      params
    );

    return res.json(result.rows.map(mapDiscountCodeRow));
  } catch (error) {
    return next(error);
  }
});

router.get('/discount-codes/:discountCodeId/pdf-preview', requireAuth, async (req, res, next) => {
  const role = req.authSession?.user?.role;
  if (!canViewDiscountCodes(role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const discountCodeId = Number(req.params.discountCodeId);
  if (!Number.isInteger(discountCodeId) || discountCodeId <= 0) {
    return res.status(400).json({ message: 'Codice sconto non valido' });
  }

  const managerStructureId = req.authSession?.user?.structureId || null;
  if (role === 'facility_manager' && !managerStructureId) {
    return res.status(404).json({ message: 'Codice sconto non trovato' });
  }

  try {
    const discountCodeRow = await fetchDiscountCodeByIdForPdf(discountCodeId, pool, {
      structureId: role === 'facility_manager' ? managerStructureId : null
    });
    if (!discountCodeRow) {
      return res.status(404).json({ message: 'Codice sconto non trovato' });
    }

    const pdfPayload = buildDiscountCodePdfPayload(discountCodeRow);
    const pdfBuffer = buildPartnerPromotionPdf(pdfPayload);
    const fileName = buildPartnerPromotionFileName(discountCodeRow.structure_name, discountCodeRow.discount_code);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    return res.send(pdfBuffer);
  } catch (error) {
    return next(error);
  }
});

router.post('/discount-codes', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = discountCodeCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const structure = await fetchStructureById(payload.structureId);
  if (!structure) {
    return res.status(404).json({ message: 'Struttura non trovata' });
  }
  const selectedCityIds = normalizeCityIdsSelection(payload.cityIds);
  if (!selectedCityIds.length) {
    return res.status(400).json({ message: 'Seleziona almeno una città' });
  }

  const expiresAtDate = payload.expiresAt;
  if (expiresAtDate.getTime() <= Date.now()) {
    return res.status(400).json({ message: 'La scadenza deve essere futura' });
  }

  const normalizedCode = String(payload.code || '')
    .trim()
    .toUpperCase();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const citiesResult = await client.query(
      `
        SELECT id, name
        FROM cities
        WHERE id = ANY($1::TEXT[])
      `,
      [selectedCityIds]
    );
    if (citiesResult.rowCount !== selectedCityIds.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Una o piu città selezionate non esistono' });
    }

    const alreadyUsed = await structureInviteCodeExists(normalizedCode, client);
    if (alreadyUsed) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Codice gia in uso' });
    }

    const applyTo = payload.applyTo === 'single' ? 'single' : 'bundle';
    const userDiscountPercentSingle = applyTo === 'single' ? payload.userDiscountPercent : 0;
    const userDiscountPercentBundle = applyTo === 'bundle' ? payload.userDiscountPercent : 0;
    const structureFixedAmountSingle = applyTo === 'single' ? payload.structureFixedAmount : 0;
    const structureFixedAmountBundle = applyTo === 'bundle' ? payload.structureFixedAmount : 0;

    const result = await client.query(
      `
        INSERT INTO dashboard_structure_discount_codes (
          structure_id,
          code,
          apply_to,
          city_id,
          user_discount_percent,
          user_discount_percent_single,
          user_discount_percent_bundle,
          structure_fixed_amount,
          structure_fixed_amount_single,
          structure_fixed_amount_bundle,
          expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING
          id,
          structure_id,
          apply_to,
          city_id,
          code,
          user_discount_percent,
          user_discount_percent_single,
          user_discount_percent_bundle,
          structure_fixed_amount,
          structure_fixed_amount_single,
          structure_fixed_amount_bundle,
          expires_at,
          created_at,
          updated_at
      `,
      [
        payload.structureId,
        normalizedCode,
        applyTo,
        selectedCityIds[0],
        payload.userDiscountPercent,
        userDiscountPercentSingle,
        userDiscountPercentBundle,
        payload.structureFixedAmount,
        structureFixedAmountSingle,
        structureFixedAmountBundle,
        expiresAtDate.toISOString()
      ]
    );

    const created = result.rows[0];
    await client.query(
      `
        INSERT INTO dashboard_structure_discount_code_cities (discount_code_id, city_id)
        SELECT $1::BIGINT, city_id
        FROM UNNEST($2::TEXT[]) AS selected(city_id)
        ON CONFLICT (discount_code_id, city_id) DO NOTHING
      `,
      [created.id, selectedCityIds]
    );
    await client.query('COMMIT');

    const cityNameById = new Map(citiesResult.rows.map((row) => [row.id, row.name]));
    const orderedCityNames = selectedCityIds.map((cityId) => cityNameById.get(cityId)).filter(Boolean);

    return res.status(201).json(
      mapDiscountCodeRow({
        ...created,
        structure_name: structure.name,
        structure_address: structure.address,
        city_name: orderedCityNames[0] || null,
        city_ids: selectedCityIds,
        city_names: orderedCityNames
      })
    );
  } catch (error) {
    await client.query('ROLLBACK');
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return res.status(409).json({ message: 'Codice gia in uso' });
    }
    return next(error);
  } finally {
    client.release();
  }
});

router.patch('/discount-codes/:discountCodeId', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = discountCodeUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const discountCodeId = Number(req.params.discountCodeId);
  if (!Number.isInteger(discountCodeId) || discountCodeId <= 0) {
    return res.status(400).json({ message: 'Codice sconto non valido' });
  }

  const selectedCityIds = normalizeCityIdsSelection(parsed.data.cityIds);
  if (!selectedCityIds.length) {
    return res.status(400).json({ message: 'Seleziona almeno una città' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const citiesResult = await client.query(
      `
        SELECT id, name
        FROM cities
        WHERE id = ANY($1::TEXT[])
      `,
      [selectedCityIds]
    );
    if (citiesResult.rowCount !== selectedCityIds.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Una o piu città selezionate non esistono' });
    }

    const applyTo = parsed.data.applyTo === 'single' ? 'single' : 'bundle';
    const userDiscountPercentSingle = applyTo === 'single' ? parsed.data.userDiscountPercent : 0;
    const userDiscountPercentBundle = applyTo === 'bundle' ? parsed.data.userDiscountPercent : 0;
    const structureFixedAmountSingle = applyTo === 'single' ? parsed.data.structureFixedAmount : 0;
    const structureFixedAmountBundle = applyTo === 'bundle' ? parsed.data.structureFixedAmount : 0;

    const result = await client.query(
      `
        WITH updated AS (
          UPDATE dashboard_structure_discount_codes
          SET apply_to = $1,
              city_id = $2,
              user_discount_percent = $3,
              user_discount_percent_single = $4,
              user_discount_percent_bundle = $5,
              structure_fixed_amount = $6,
              structure_fixed_amount_single = $7,
              structure_fixed_amount_bundle = $8,
              expires_at = $9,
              updated_at = NOW()
          WHERE id = $10
            AND EXISTS (
              SELECT 1
              FROM dashboard_structures active_structure
              WHERE active_structure.id = dashboard_structure_discount_codes.structure_id
                AND active_structure.deleted = 0
            )
          RETURNING *
        )
        SELECT
          updated.id,
          updated.structure_id,
          s.name AS structure_name,
          s.address AS structure_address,
          updated.apply_to,
          updated.city_id,
          c.name AS city_name,
          updated.code,
          updated.user_discount_percent,
          updated.user_discount_percent_single,
          updated.user_discount_percent_bundle,
          updated.structure_fixed_amount,
          updated.structure_fixed_amount_single,
          updated.structure_fixed_amount_bundle,
          updated.expires_at,
          updated.created_at,
          updated.updated_at
        FROM updated
        JOIN dashboard_structures s ON s.id = updated.structure_id AND s.deleted = 0
        LEFT JOIN cities c ON c.id = updated.city_id
      `,
      [
        applyTo,
        selectedCityIds[0],
        parsed.data.userDiscountPercent,
        userDiscountPercentSingle,
        userDiscountPercentBundle,
        parsed.data.structureFixedAmount,
        structureFixedAmountSingle,
        structureFixedAmountBundle,
        parsed.data.expiresAt.toISOString(),
        discountCodeId
      ]
    );

    if (!result.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Codice sconto non trovato' });
    }

    await client.query(
      `
        DELETE FROM dashboard_structure_discount_code_cities
        WHERE discount_code_id = $1
      `,
      [discountCodeId]
    );
    await client.query(
      `
        INSERT INTO dashboard_structure_discount_code_cities (discount_code_id, city_id)
        SELECT $1::BIGINT, city_id
        FROM UNNEST($2::TEXT[]) AS selected(city_id)
        ON CONFLICT (discount_code_id, city_id) DO NOTHING
      `,
      [discountCodeId, selectedCityIds]
    );
    await client.query('COMMIT');

    const cityNameById = new Map(citiesResult.rows.map((row) => [row.id, row.name]));
    const orderedCityNames = selectedCityIds.map((cityId) => cityNameById.get(cityId)).filter(Boolean);
    return res.json(
      mapDiscountCodeRow({
        ...result.rows[0],
        city_ids: selectedCityIds,
        city_names: orderedCityNames,
        city_name: orderedCityNames[0] || result.rows[0].city_name || null
      })
    );
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.delete('/discount-codes/:discountCodeId', requireAuth, requireAdmin, async (req, res, next) => {
  const discountCodeId = Number(req.params.discountCodeId);
  if (!Number.isInteger(discountCodeId) || discountCodeId <= 0) {
    return res.status(400).json({ message: 'Codice sconto non valido' });
  }

  try {
    const deleted = await pool.query(
      `
        DELETE FROM dashboard_structure_discount_codes
        WHERE id = $1
        RETURNING id, code
      `,
      [discountCodeId]
    );

    if (!deleted.rowCount) {
      return res.status(404).json({ message: 'Codice sconto non trovato' });
    }

    return res.json({
      deleted: true,
      id: Number(deleted.rows[0].id),
      code: deleted.rows[0].code
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/invitations', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = inviteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const invitedFirstName = payload.firstName;
  const invitedLastName = payload.lastName;
  const invitedName = `${invitedFirstName} ${invitedLastName}`.trim();
  const invitedEmail = payload.email.toLowerCase();
  const requestedStructureId = payload.role === 'admin' ? null : payload.structureId || null;

  if (invitedEmail === req.authSession.user.email) {
    return res.status(400).json({ message: 'Non puoi invitare il tuo stesso account' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let invitedStructure = null;
    if (requestedStructureId) {
      invitedStructure = await fetchStructureById(requestedStructureId, client);
      if (!invitedStructure) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Struttura non trovata' });
      }
    } else if (payload.role !== 'admin') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Seleziona una struttura per il gestore' });
    }

    const userResult = await client.query(
      `
        SELECT id, email, is_registered
        FROM dashboard_users
        WHERE email = $1
        FOR UPDATE
      `,
      [invitedEmail]
    );

    const structureId = invitedStructure?.id || null;
    const legacyFacilityName = invitedStructure?.name || null;

    let userId;
    if (!userResult.rowCount) {
      userId = `usr_${crypto.randomUUID()}`;
      const placeholderHash = await hashPassword(createOpaqueToken(24));
      await client.query(
        `
          INSERT INTO dashboard_users (
            id,
            name,
            first_name,
            last_name,
            facility_name,
            structure_id,
            email,
            password_hash,
            role,
            is_registered,
            invited_by
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, FALSE, $10)
        `,
        [
          userId,
          invitedName,
          invitedFirstName,
          invitedLastName,
          legacyFacilityName,
          structureId,
          invitedEmail,
          placeholderHash,
          payload.role,
          req.authSession.user.id
        ]
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
              name = $3,
              first_name = $4,
              last_name = $5,
              facility_name = $6,
              structure_id = $7,
              updated_at = NOW()
          WHERE id = $8
        `,
        [req.authSession.user.id, payload.role, invitedName, invitedFirstName, invitedLastName, legacyFacilityName, structureId, userId]
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
      firstName: invitedFirstName,
      lastName: invitedLastName,
      structureId,
      structureName: invitedStructure?.name || null,
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
    const baseUsersResult = await pool.query(
      `
        WITH dashboard_rows AS (
          SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.role,
            u.is_registered,
            u.created_at,
            u.updated_at,
            u.structure_id,
            s.name AS structure_name,
            s.address AS structure_address,
            (
              SELECT dc.code
              FROM dashboard_structure_discount_codes dc
              WHERE dc.structure_id = u.structure_id
              ORDER BY (dc.expires_at > NOW()) DESC, dc.expires_at ASC, dc.created_at ASC
              LIMIT 1
            ) AS structure_invite_code,
            inviter.email AS invited_by_email,
            'dashboard'::TEXT AS account_type
          FROM dashboard_users u
          LEFT JOIN dashboard_users inviter ON inviter.id = u.invited_by AND inviter.deleted = 0
          LEFT JOIN dashboard_structures s ON s.id = u.structure_id AND s.deleted = 0
          WHERE u.deleted = 0
        ),
        app_link_rows AS (
          SELECT
            l.user_id AS id,
            COALESCE(NULLIF(au.first_name, ''), 'Utente') AS first_name,
            COALESCE(NULLIF(au.last_name, ''), CONCAT('App ', LEFT(l.user_id, 8))) AS last_name,
            COALESCE(au.email, CONCAT('utente+', LEFT(l.user_id, 12), '@app.local')) AS email,
            'user'::TEXT AS role,
            (au.id IS NOT NULL) AS is_registered,
            COALESCE(au.created_at, l.associated_at) AS created_at,
            COALESCE(au.updated_at, l.updated_at) AS updated_at,
            l.structure_id,
            s.name AS structure_name,
            s.address AS structure_address,
            l.invite_code AS structure_invite_code,
            NULL::TEXT AS invited_by_email,
            'app'::TEXT AS account_type
          FROM app_user_structure_links l
          JOIN dashboard_structures s ON s.id = l.structure_id AND s.deleted = 0
          LEFT JOIN app_users au ON au.id = l.user_id
          LEFT JOIN dashboard_users u ON u.id = l.user_id
          WHERE u.id IS NULL
        ),
        app_purchase_rows AS (
          SELECT DISTINCT ON (p.user_id)
            p.user_id AS id,
            COALESCE(NULLIF(au.first_name, ''), 'Utente') AS first_name,
            COALESCE(NULLIF(au.last_name, ''), CONCAT('App ', LEFT(p.user_id, 8))) AS last_name,
            COALESCE(au.email, CONCAT('utente+', LEFT(p.user_id, 12), '@app.local')) AS email,
            'user'::TEXT AS role,
            (au.id IS NOT NULL) AS is_registered,
            COALESCE(au.created_at, p.purchased_at) AS created_at,
            COALESCE(au.updated_at, p.purchased_at) AS updated_at,
            p.structure_id,
            s.name AS structure_name,
            s.address AS structure_address,
            p.invite_code AS structure_invite_code,
            NULL::TEXT AS invited_by_email,
            'app'::TEXT AS account_type
          FROM purchases p
          JOIN dashboard_structures s ON s.id = p.structure_id AND s.deleted = 0
          LEFT JOIN app_users au ON au.id = p.user_id
          LEFT JOIN dashboard_users u ON u.id = p.user_id
          LEFT JOIN app_user_structure_links l ON l.user_id = p.user_id
          WHERE u.id IS NULL
            AND l.user_id IS NULL
            AND p.structure_id IS NOT NULL
            AND p.hidden = 0
          ORDER BY p.user_id, p.purchased_at DESC, p.id DESC
        ),
        app_rows AS (
          SELECT * FROM app_link_rows
          UNION ALL
          SELECT * FROM app_purchase_rows
        )
        SELECT *
        FROM dashboard_rows
        UNION ALL
        SELECT *
        FROM app_rows
        ORDER BY created_at ASC
      `
    );

    const baseRows = baseUsersResult.rows;
    if (!baseRows.length) {
      return res.json([]);
    }

    const userIds = baseRows.map((row) => row.id);
    const associationsResult = await pool.query(
      `
        WITH selected_users AS (
          SELECT UNNEST($1::TEXT[]) AS user_id
        ),
        link_source AS (
          SELECT
            l.user_id,
            l.structure_id,
            NULLIF(UPPER(TRIM(COALESCE(dc.code, l.invite_code))), '') AS invite_code,
            CASE
              WHEN dc.id IS NULL THEN 'invalid'
              WHEN usage.used_at IS NOT NULL THEN 'used'
              WHEN dc.expires_at > NOW() THEN 'active'
              ELSE 'expired'
            END AS status,
            l.associated_at,
            usage.used_at,
            l.updated_at,
            CASE
              WHEN dc.id IS NULL THEN 45
              WHEN usage.used_at IS NOT NULL THEN 25
              WHEN dc.expires_at > NOW() THEN 10
              ELSE 35
            END AS sort_weight
          FROM app_user_structure_links l
          JOIN selected_users su ON su.user_id = l.user_id
          LEFT JOIN LATERAL (
            SELECT
              d.id,
              d.code,
              d.expires_at,
              d.updated_at
            FROM dashboard_structure_discount_codes d
            WHERE (
              (l.discount_code_id IS NOT NULL AND d.id = l.discount_code_id)
              OR (l.discount_code_id IS NULL AND UPPER(d.code) = UPPER(l.invite_code))
            )
            ORDER BY
              CASE WHEN l.discount_code_id IS NOT NULL AND d.id = l.discount_code_id THEN 0 ELSE 1 END,
              d.updated_at DESC,
              d.id DESC
            LIMIT 1
          ) dc ON TRUE
          LEFT JOIN LATERAL (
            SELECT u.used_at
            FROM app_user_discount_code_uses u
            WHERE u.user_id = l.user_id
              AND u.invite_code = UPPER(COALESCE(dc.code, l.invite_code))
            ORDER BY u.used_at DESC, u.id DESC
            LIMIT 1
          ) usage ON TRUE
        ),
        usage_source AS (
          SELECT
            u.user_id,
            COALESCE(u.structure_id, dc.structure_id) AS structure_id,
            NULLIF(UPPER(TRIM(u.invite_code)), '') AS invite_code,
            'used'::TEXT AS status,
            NULL::TIMESTAMPTZ AS associated_at,
            u.used_at,
            u.used_at AS updated_at,
            30 AS sort_weight
          FROM app_user_discount_code_uses u
          JOIN selected_users su ON su.user_id = u.user_id
          LEFT JOIN dashboard_structure_discount_codes dc ON dc.id = u.discount_code_id
        ),
        dashboard_assigned_source AS (
          SELECT
            u.id AS user_id,
            u.structure_id,
            NULL::TEXT AS invite_code,
            'assigned'::TEXT AS status,
            u.created_at AS associated_at,
            NULL::TIMESTAMPTZ AS used_at,
            u.updated_at,
            20 AS sort_weight
          FROM dashboard_users u
          JOIN selected_users su ON su.user_id = u.id
          WHERE u.structure_id IS NOT NULL
            AND u.deleted = 0
        ),
        combined AS (
          SELECT * FROM link_source
          UNION ALL
          SELECT * FROM usage_source
          UNION ALL
          SELECT * FROM dashboard_assigned_source
        ),
        dedup AS (
          SELECT DISTINCT ON (
            c.user_id,
            COALESCE(c.invite_code, CONCAT('assigned:', COALESCE(c.structure_id, '')))
          )
            c.user_id,
            c.structure_id,
            c.invite_code,
            c.status,
            c.associated_at,
            c.used_at,
            c.updated_at,
            c.sort_weight
          FROM combined c
          WHERE c.structure_id IS NOT NULL
          ORDER BY
            c.user_id,
            COALESCE(c.invite_code, CONCAT('assigned:', COALESCE(c.structure_id, ''))),
            c.sort_weight ASC,
            COALESCE(c.updated_at, c.used_at, c.associated_at) DESC
        )
        SELECT
          d.user_id,
          d.structure_id,
          s.name AS structure_name,
          s.address AS structure_address,
          d.invite_code,
          d.status,
          d.associated_at,
          d.used_at,
          d.updated_at,
          d.sort_weight
        FROM dedup d
        JOIN dashboard_structures s ON s.id = d.structure_id AND s.deleted = 0
        ORDER BY
          d.user_id ASC,
          d.sort_weight ASC,
          COALESCE(d.updated_at, d.used_at, d.associated_at) DESC,
          d.structure_id ASC,
          d.invite_code ASC
      `,
      [userIds]
    );

    const associationsByUser = new Map();
    for (const row of associationsResult.rows) {
      const userId = row.user_id;
      if (!associationsByUser.has(userId)) {
        associationsByUser.set(userId, []);
      }
      associationsByUser.get(userId).push({
        structureId: row.structure_id,
        structureName: row.structure_name || null,
        structureAddress: row.structure_address || null,
        inviteCode: row.invite_code || null,
        status: row.status || 'invalid',
        associatedAt: row.associated_at || null,
        usedAt: row.used_at || null,
        updatedAt: row.updated_at || null
      });
    }

    const unlocksResult = await pool.query(
      `
        WITH selected_users AS (
          SELECT DISTINCT UNNEST($1::TEXT[]) AS user_id
        ),
        city_unlocks AS (
          SELECT
            p.user_id,
            c.id AS city_id,
            c.name AS city_name,
            MAX(p.purchased_at) AS unlocked_at
          FROM purchases p
          JOIN selected_users su ON su.user_id = p.user_id
          JOIN cities c ON c.id = p.city_id
          WHERE p.type = 'bundle'
            AND p.city_id IS NOT NULL
            AND p.hidden = 0
          GROUP BY p.user_id, c.id, c.name
        ),
        poi_unlocks AS (
          SELECT
            p.user_id,
            poi.id AS poi_id,
            poi.name AS poi_name,
            poi.city_id AS city_id,
            c.name AS city_name,
            MAX(p.purchased_at) AS unlocked_at
          FROM purchases p
          JOIN selected_users su ON su.user_id = p.user_id
          JOIN pois poi ON poi.id = p.poi_id
          JOIN cities c ON c.id = poi.city_id
          WHERE p.type = 'single'
            AND p.poi_id IS NOT NULL
            AND p.hidden = 0
          GROUP BY p.user_id, poi.id, poi.name, poi.city_id, c.name
        )
        SELECT
          su.user_id,
          COALESCE(
            (
              SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'cityId', cu.city_id,
                  'cityName', cu.city_name,
                  'unlockedAt', cu.unlocked_at
                )
                ORDER BY cu.city_name ASC
              )
              FROM city_unlocks cu
              WHERE cu.user_id = su.user_id
            ),
            '[]'::JSON
          ) AS unlocked_cities,
          COALESCE(
            (
              SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'poiId', pu.poi_id,
                  'poiName', pu.poi_name,
                  'cityId', pu.city_id,
                  'cityName', pu.city_name,
                  'unlockedAt', pu.unlocked_at
                )
                ORDER BY pu.city_name ASC, pu.poi_name ASC
              )
              FROM poi_unlocks pu
              WHERE pu.user_id = su.user_id
            ),
            '[]'::JSON
          ) AS unlocked_pois,
          COALESCE((SELECT COUNT(*)::INT FROM city_unlocks cu WHERE cu.user_id = su.user_id), 0)::INT AS unlocked_cities_count,
          COALESCE((SELECT COUNT(*)::INT FROM poi_unlocks pu WHERE pu.user_id = su.user_id), 0)::INT AS unlocked_pois_count
        FROM selected_users su
      `,
      [userIds]
    );

    const unlocksByUser = new Map();
    for (const row of unlocksResult.rows) {
      const unlockedCitiesRaw = normalizeJsonArray(row.unlocked_cities);
      const unlockedPoisRaw = normalizeJsonArray(row.unlocked_pois);
      unlocksByUser.set(row.user_id, {
        unlockedCities: unlockedCitiesRaw
          .map((item) => ({
            cityId: String(item?.cityId || '').trim(),
            cityName: String(item?.cityName || '').trim() || null,
            unlockedAt: item?.unlockedAt || null
          }))
          .filter((item) => Boolean(item.cityId)),
        unlockedPois: unlockedPoisRaw
          .map((item) => ({
            poiId: String(item?.poiId || '').trim(),
            poiName: String(item?.poiName || '').trim() || null,
            cityId: String(item?.cityId || '').trim(),
            cityName: String(item?.cityName || '').trim() || null,
            unlockedAt: item?.unlockedAt || null
          }))
          .filter((item) => Boolean(item.poiId)),
        unlockedCitiesCount: Number(row.unlocked_cities_count || 0),
        unlockedPoisCount: Number(row.unlocked_pois_count || 0)
      });
    }

    return res.json(
      baseRows.map((row) => {
        const associations = associationsByUser.get(row.id) || [];
        const primary = associations[0] || null;
        const unlocks = unlocksByUser.get(row.id) || {
          unlockedCities: [],
          unlockedPois: [],
          unlockedCitiesCount: 0,
          unlockedPoisCount: 0
        };
        return {
          id: row.id,
          firstName: row.first_name || '',
          lastName: row.last_name || '',
          email: row.email,
          role: row.role,
          isRegistered: row.is_registered,
          structureId: primary?.structureId || row.structure_id || null,
          structureName: primary?.structureName || row.structure_name || null,
          structureAddress: primary?.structureAddress || row.structure_address || null,
          structureInviteCode: primary?.inviteCode || row.structure_invite_code || null,
          associatedStructures: associations,
          invitedByEmail: row.invited_by_email,
          accountType: row.account_type === 'app' ? 'app' : 'dashboard',
          unlockedCities: unlocks.unlockedCities,
          unlockedPois: unlocks.unlockedPois,
          unlockedCitiesCount: unlocks.unlockedCitiesCount,
          unlockedPoisCount: unlocks.unlockedPoisCount,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        };
      })
    );
  } catch (error) {
    return next(error);
  }
});

router.get('/associated-users', requireAuth, async (req, res, next) => {
  const role = req.authSession?.user?.role;
  if (role !== 'admin' && role !== 'facility_manager') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const currentStructureId = req.authSession?.user?.structureId || null;
  if (role === 'facility_manager' && !currentStructureId) {
    return res.json([]);
  }

  const requestedStructureId =
    role === 'admin' ? String(req.query.structureId || '').trim() || null : currentStructureId;
  const queryParams = requestedStructureId ? [requestedStructureId] : [];

  try {
    const result = await pool.query(
      `
        WITH link_events AS (
          SELECT
            l.user_id,
            l.structure_id,
            NULLIF(UPPER(TRIM(l.invite_code)), '') AS invite_code,
            l.associated_at AS associated_at,
            l.updated_at AS updated_at
          FROM app_user_structure_links l
        ),
        usage_events AS (
          SELECT
            u.user_id,
            COALESCE(u.structure_id, dc.structure_id) AS structure_id,
            NULLIF(UPPER(TRIM(u.invite_code)), '') AS invite_code,
            u.used_at AS associated_at,
            u.used_at AS updated_at
          FROM app_user_discount_code_uses u
          LEFT JOIN dashboard_structure_discount_codes dc ON dc.id = u.discount_code_id
        ),
        purchase_events AS (
          SELECT
            p.user_id,
            p.structure_id,
            NULLIF(UPPER(TRIM(p.invite_code)), '') AS invite_code,
            p.purchased_at AS associated_at,
            p.purchased_at AS updated_at
          FROM purchases p
          WHERE p.structure_id IS NOT NULL
            AND p.hidden = 0
        ),
        all_events AS (
          SELECT * FROM link_events
          UNION ALL
          SELECT * FROM usage_events
          UNION ALL
          SELECT * FROM purchase_events
        ),
        user_structure_pairs AS (
          SELECT DISTINCT ON (e.user_id, e.structure_id)
            e.user_id,
            e.structure_id,
            e.invite_code,
            e.associated_at,
            e.updated_at
          FROM all_events e
          WHERE e.structure_id IS NOT NULL
            ${requestedStructureId ? 'AND e.structure_id = $1' : ''}
          ORDER BY
            e.user_id,
            e.structure_id,
            COALESCE(e.updated_at, e.associated_at) DESC
        )
        SELECT
          usp.user_id,
          usp.structure_id,
          s.name AS structure_name,
          s.address AS structure_address,
          COALESCE(link.current_invite_code, usp.invite_code) AS invite_code,
          usp.associated_at,
          usp.updated_at,
          COALESCE(payments.purchases_count, 0)::INT AS purchases_count,
          COALESCE(payments.total_spent, 0)::NUMERIC AS total_spent,
          payments.last_purchase_at,
          (code_usage.last_used_at IS NOT NULL) AS invite_code_used,
          code_usage.last_used_at AS invite_code_used_at
        FROM user_structure_pairs usp
        JOIN dashboard_structures s ON s.id = usp.structure_id AND s.deleted = 0
        LEFT JOIN LATERAL (
          SELECT NULLIF(UPPER(TRIM(l.invite_code)), '') AS current_invite_code
          FROM app_user_structure_links l
          WHERE l.user_id = usp.user_id
            AND l.structure_id = usp.structure_id
          ORDER BY COALESCE(l.updated_at, l.associated_at) DESC
          LIMIT 1
        ) link ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(p.id)::INT AS purchases_count,
            COALESCE(SUM(p.amount), 0)::NUMERIC AS total_spent,
            MAX(p.purchased_at) AS last_purchase_at
          FROM purchases p
          WHERE p.user_id = usp.user_id
            AND p.structure_id = usp.structure_id
            AND p.hidden = 0
        ) payments ON TRUE
        LEFT JOIN LATERAL (
          SELECT MAX(u.used_at) AS last_used_at
          FROM app_user_discount_code_uses u
          LEFT JOIN dashboard_structure_discount_codes dc ON dc.id = u.discount_code_id
          WHERE u.user_id = usp.user_id
            AND COALESCE(u.structure_id, dc.structure_id) = usp.structure_id
            AND COALESCE(link.current_invite_code, usp.invite_code) IS NOT NULL
            AND NULLIF(UPPER(TRIM(u.invite_code)), '') = COALESCE(link.current_invite_code, usp.invite_code)
        ) code_usage ON TRUE
        ORDER BY COALESCE(usp.updated_at, usp.associated_at) DESC
      `,
      queryParams
    );

    return res.json(
      result.rows.map((row) => ({
        userId: row.user_id,
        structureId: row.structure_id,
        structureName: row.structure_name,
        structureAddress: row.structure_address,
        inviteCode: row.invite_code || null,
        inviteCodeUsed: Boolean(row.invite_code_used),
        inviteCodeUsedAt: row.invite_code_used_at || null,
        associatedAt: row.associated_at,
        updatedAt: row.updated_at,
        purchasesCount: Number(row.purchases_count || 0),
        totalSpent: Number(row.total_spent || 0),
        lastPurchaseAt: row.last_purchase_at || null
      }))
    );
  } catch (error) {
    return next(error);
  }
});

router.get('/paypal-settings', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const settings = await getPayPalSettings();
    return res.json(mapPayPalSettingsForResponse(settings));
  } catch (error) {
    return next(error);
  }
});

router.put('/paypal-settings', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = paypalSettingsSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const mode = normalizePayPalMode(payload.mode);
  const clientId = String(payload.clientId || '').trim() || null;
  const clientSecret = String(payload.clientSecret || '').trim() || null;
  const merchantId = String(payload.merchantId || '').trim() || null;
  const merchantEmail = String(payload.merchantEmail || '').trim().toLowerCase() || null;
  const brandName = String(payload.brandName || '').trim() || 'Walk Around';
  const webhookId = String(payload.webhookId || '').trim() || null;
  const isEnabled = Boolean(payload.isEnabled);
  const lastVerificationStatus = isEnabled && clientId && clientSecret ? 'pending' : 'incomplete';
  const lastVerificationError =
    lastVerificationStatus === 'incomplete' ? 'Configurazione incompleta o PayPal non attivo.' : null;

  try {
    const saved = await pool.query(
      `
        INSERT INTO dashboard_paypal_settings (
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
          updated_by,
          updated_at
        )
        VALUES (
          1,
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          'EUR',
          NULL,
          $9,
          $10,
          $11,
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          is_enabled = EXCLUDED.is_enabled,
          mode = EXCLUDED.mode,
          client_id = EXCLUDED.client_id,
          client_secret = EXCLUDED.client_secret,
          merchant_id = EXCLUDED.merchant_id,
          merchant_email = EXCLUDED.merchant_email,
          brand_name = EXCLUDED.brand_name,
          webhook_id = EXCLUDED.webhook_id,
          currency_code = EXCLUDED.currency_code,
          last_verified_at = NULL,
          last_verification_status = EXCLUDED.last_verification_status,
          last_verification_error = EXCLUDED.last_verification_error,
          updated_by = EXCLUDED.updated_by,
          updated_at = NOW()
        RETURNING
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
      `,
      [
        isEnabled,
        mode,
        clientId,
        clientSecret,
        merchantId,
        merchantEmail,
        brandName,
        webhookId,
        lastVerificationStatus,
        lastVerificationError,
        req.authSession.user.id
      ]
    );

    return res.json(mapPayPalSettingsForResponse(saved.rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.post('/paypal-settings/test', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const settings = await getPayPalSettings();
    const verification = await verifyPayPalConnection(settings);
    const updated = await pool.query(
      `
        UPDATE dashboard_paypal_settings
        SET last_verified_at = NOW(),
            last_verification_status = 'valid',
            last_verification_error = NULL,
            updated_at = NOW()
        WHERE id = 1
        RETURNING
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
      `
    );

    return res.json({
      valid: true,
      verification,
      settings: mapPayPalSettingsForResponse(updated.rows[0] || settings)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Connessione PayPal non valida.';

    try {
      await pool.query(
        `
          UPDATE dashboard_paypal_settings
          SET last_verified_at = NOW(),
              last_verification_status = 'invalid',
              last_verification_error = $1,
              updated_at = NOW()
          WHERE id = 1
        `,
        [message]
      );
    } catch {
      // Ignore secondary update failures.
    }

    if (error instanceof PayPalConfigurationError) {
      return res.status(error.status || 502).json({
        valid: false,
        message
      });
    }

    return next(error);
  }
});

router.get('/partner-email-settings', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const settings = await getPartnerEmailSettings();
    return res.json(mapPartnerEmailSettingsForResponse(settings));
  } catch (error) {
    return next(error);
  }
});

router.put('/partner-email-settings', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = partnerEmailSettingsSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;

  try {
    const saved = await pool.query(
      `
        INSERT INTO dashboard_partner_email_settings (
          id,
          approval_subject,
          approval_body,
          rejection_subject,
          rejection_body,
          activation_subject,
          activation_body,
          updated_by,
          updated_at
        )
        VALUES (1, $1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (id) DO UPDATE SET
          approval_subject = EXCLUDED.approval_subject,
          approval_body = EXCLUDED.approval_body,
          rejection_subject = EXCLUDED.rejection_subject,
          rejection_body = EXCLUDED.rejection_body,
          activation_subject = EXCLUDED.activation_subject,
          activation_body = EXCLUDED.activation_body,
          updated_by = EXCLUDED.updated_by,
          updated_at = NOW()
        RETURNING
          id,
          approval_subject,
          approval_body,
          rejection_subject,
          rejection_body,
          activation_subject,
          activation_body,
          updated_at,
          updated_by
      `,
      [
        payload.approvalSubject,
        payload.approvalBody,
        payload.rejectionSubject,
        payload.rejectionBody,
        payload.activationSubject,
        payload.activationBody,
        req.authSession.user.id
      ]
    );

    return res.json(mapPartnerEmailSettingsForResponse(saved.rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.get('/privacy-policy', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const settings = await getPrivacyPolicySettings();
    return res.json(mapPrivacyPolicySettingsForResponse(settings));
  } catch (error) {
    return next(error);
  }
});

router.put('/privacy-policy', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = privacyPolicySettingsSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const translations = sanitizePrivacyPolicyTranslations(parsed.data.translations);

  try {
    const saved = await pool.query(
      `
        INSERT INTO dashboard_privacy_policy_settings (
          id,
          translations,
          updated_by,
          updated_at
        )
        VALUES (1, $1::jsonb, $2, NOW())
        ON CONFLICT (id) DO UPDATE SET
          translations = EXCLUDED.translations,
          updated_by = EXCLUDED.updated_by,
          updated_at = NOW()
        RETURNING id, translations, updated_at, updated_by
      `,
      [JSON.stringify(translations), req.authSession.user.id]
    );

    return res.json(mapPrivacyPolicySettingsForResponse(saved.rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.get('/legal-documents', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const documents = await getAllLegalDocumentSettings();
    return res.json({ documents });
  } catch (error) {
    return next(error);
  }
});

router.get('/legal-documents/:documentType', requireAuth, requireAdmin, async (req, res, next) => {
  const parsedParams = legalDocumentParamsSchema.safeParse(req.params || {});
  if (!parsedParams.success) {
    return res.status(400).json({ message: 'Documento legale non valido', errors: parsedParams.error.flatten() });
  }

  const documentType = parsedParams.data.documentType;

  try {
    const settings = await getLegalDocumentSettings(documentType);
    return res.json(mapLegalDocumentSettingsForResponse(documentType, settings));
  } catch (error) {
    return next(error);
  }
});

router.put('/legal-documents/:documentType', requireAuth, requireAdmin, async (req, res, next) => {
  const parsedParams = legalDocumentParamsSchema.safeParse(req.params || {});
  if (!parsedParams.success) {
    return res.status(400).json({ message: 'Documento legale non valido', errors: parsedParams.error.flatten() });
  }

  const parsedBody = legalDocumentSettingsSchema.safeParse(req.body || {});
  if (!parsedBody.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsedBody.error.flatten() });
  }

  const documentType = parsedParams.data.documentType;
  const translations = sanitizePrivacyPolicyTranslations(parsedBody.data.translations);

  try {
    const saved = await saveLegalDocumentSettings(documentType, translations, req.authSession.user.id);
    return res.json(mapLegalDocumentSettingsForResponse(documentType, saved));
  } catch (error) {
    return next(error);
  }
});

router.get('/app-cache-settings', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const settings = await getAppCacheSettings();
    return res.json(mapAppCacheSettingsForResponse(settings));
  } catch (error) {
    return next(error);
  }
});

router.get('/media/audio', async (req, res, next) => {
  try {
    const session = await resolveDashboardSessionFromMediaRequest(req);
    if (!session || session.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accesso admin richiesto' });
    }

    const audioPath = resolveDashboardAudioPath(req.query.path);
    if (!audioPath) {
      return res.status(400).json({ message: 'Percorso audio non valido' });
    }

    const stat = await fs.stat(audioPath);
    if (!stat.isFile()) {
      return res.status(404).json({ message: 'Audio non trovato' });
    }

    res.set({
      'Cache-Control': 'private, no-store',
      'Content-Type': dashboardAudioContentType(audioPath),
      'Content-Disposition': `inline; filename="${path.basename(audioPath).replace(/"/g, '')}"`
    });
    return res.sendFile(audioPath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return res.status(404).json({ message: 'Audio non trovato' });
    }
    return next(error);
  }
});

router.get('/email-settings', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const settings = await getDashboardEmailSettings();
    return res.json(mapDashboardEmailSettingsForResponse(settings));
  } catch (error) {
    return next(error);
  }
});

router.put('/email-settings', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = dashboardEmailSettingsSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  try {
    const settings = await saveDashboardEmailSettings(parsed.data, req.authSession.user.id);
    return res.json(mapDashboardEmailSettingsForResponse(settings));
  } catch (error) {
    return next(error);
  }
});

router.post('/email-settings/test', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = dashboardEmailTestSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  try {
    await sendDashboardEmailSettingsTestEmail({
      to: parsed.data.to,
      requestedByEmail: req.authSession.user.email
    });
    const settings = await markDashboardEmailSettingsTestResult({ valid: true });
    return res.json({
      valid: true,
      settings: mapDashboardEmailSettingsForResponse(settings)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invio email di test non riuscito.';
    let settings = null;

    try {
      settings = await markDashboardEmailSettingsTestResult({ valid: false, error: message });
    } catch {
      // Ignore secondary update failures.
    }

    if (settings) {
      return res.status(502).json({
        valid: false,
        message,
        settings: mapDashboardEmailSettingsForResponse(settings)
      });
    }

    return next(error);
  }
});

router.get('/notification-settings', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const settings = await getDashboardNotificationSettings();
    return res.json(mapDashboardNotificationSettingsForResponse(settings));
  } catch (error) {
    return next(error);
  }
});

router.put('/notification-settings', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = dashboardNotificationSettingsSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  try {
    const settings = await saveDashboardNotificationSettings(parsed.data, req.authSession.user.id);
    return res.json(mapDashboardNotificationSettingsForResponse(settings));
  } catch (error) {
    return next(error);
  }
});

router.post('/app-cache-settings/bump', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const nextCacheVersion = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const saved = await pool.query(
      `
        INSERT INTO dashboard_app_cache_settings (
          id,
          cache_version,
          updated_by,
          updated_at
        )
        VALUES (1, $1, $2, NOW())
        ON CONFLICT (id) DO UPDATE SET
          cache_version = EXCLUDED.cache_version,
          updated_by = EXCLUDED.updated_by,
          updated_at = NOW()
        RETURNING id, cache_version, updated_at, updated_by
      `,
      [nextCacheVersion, req.authSession.user.id]
    );

    return res.json(mapAppCacheSettingsForResponse(saved.rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.post('/privacy-policy/translate', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = privacyPolicyTranslateSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const uniqueTargetLanguages = Array.from(new Set(payload.targetLanguages)).filter((language) =>
    privacyPolicyTargetLanguages.includes(language)
  );

  try {
    const settings = await getOpenAiTranslationSettings();
    const privacySettings = await getPrivacyPolicySettings();
    const translations = sanitizePrivacyPolicyTranslations(privacySettings.translations);
    const sourceHtml = translations[payload.sourceLanguage] || '';
    if (!sourceHtml) {
      return res.status(400).json({ message: 'Carica prima la privacy policy in italiano.' });
    }

    const translatedLanguages = [];
    const skippedLanguages = [];
    const usage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

    for (const targetLanguage of uniqueTargetLanguages) {
      if (!payload.overwrite && translations[targetLanguage]) {
        skippedLanguages.push(targetLanguage);
        continue;
      }

      const result = await translateHtmlWithOpenAI({
        apiKey: settings.api_key,
        model: settings.model,
        sourceLanguage: 'italiano',
        targetLanguage,
        html: sourceHtml
      });

      translations[targetLanguage] = normalizePrivacyPolicyHtml(result.html);
      translatedLanguages.push(targetLanguage);
      usage.inputTokens += Number(result.usage?.inputTokens || 0);
      usage.outputTokens += Number(result.usage?.outputTokens || 0);
      usage.totalTokens += Number(result.usage?.totalTokens || 0);
    }

    const saved = await pool.query(
      `
        UPDATE dashboard_privacy_policy_settings
        SET translations = $1::jsonb,
            updated_by = $2,
            updated_at = NOW()
        WHERE id = 1
        RETURNING id, translations, updated_at, updated_by
      `,
      [JSON.stringify(translations), req.authSession.user.id]
    );

    return res.json({
      settings: mapPrivacyPolicySettingsForResponse(saved.rows[0] || { translations }),
      translatedLanguages,
      skippedLanguages,
      usage
    });
  } catch (error) {
    if (error instanceof OpenAITranslationError) {
      const status = error.status === 429 ? 429 : error.status === 400 ? 400 : 502;
      return res.status(status).json({ message: error.message });
    }
    return next(error);
  }
});

router.post('/legal-documents/:documentType/translate', requireAuth, requireAdmin, async (req, res, next) => {
  const parsedParams = legalDocumentParamsSchema.safeParse(req.params || {});
  if (!parsedParams.success) {
    return res.status(400).json({ message: 'Documento legale non valido', errors: parsedParams.error.flatten() });
  }

  const parsedBody = legalDocumentTranslateSchema.safeParse(req.body || {});
  if (!parsedBody.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsedBody.error.flatten() });
  }

  const documentType = parsedParams.data.documentType;
  const payload = parsedBody.data;
  const uniqueTargetLanguages = Array.from(new Set(payload.targetLanguages)).filter((language) =>
    privacyPolicyTargetLanguages.includes(language)
  );

  try {
    const settings = await getOpenAiTranslationSettings();
    const legalDocumentSettings = await getLegalDocumentSettings(documentType);
    const translations = sanitizePrivacyPolicyTranslations(legalDocumentSettings.translations);
    const sourceHtml = translations[payload.sourceLanguage] || '';
    if (!sourceHtml) {
      return res.status(400).json({ message: `Carica prima ${legalDocumentAdminLabels[documentType]} in italiano.` });
    }

    const translatedLanguages = [];
    const skippedLanguages = [];
    const usage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

    for (const targetLanguage of uniqueTargetLanguages) {
      if (!payload.overwrite && translations[targetLanguage]) {
        skippedLanguages.push(targetLanguage);
        continue;
      }

      const result = await translateHtmlWithOpenAI({
        apiKey: settings.api_key,
        model: settings.model,
        sourceLanguage: 'italiano',
        targetLanguage,
        html: sourceHtml
      });

      translations[targetLanguage] = normalizePrivacyPolicyHtml(result.html);
      translatedLanguages.push(targetLanguage);
      usage.inputTokens += Number(result.usage?.inputTokens || 0);
      usage.outputTokens += Number(result.usage?.outputTokens || 0);
      usage.totalTokens += Number(result.usage?.totalTokens || 0);
    }

    const saved = await saveLegalDocumentSettings(documentType, translations, req.authSession.user.id);

    return res.json({
      settings: mapLegalDocumentSettingsForResponse(documentType, saved),
      translatedLanguages,
      skippedLanguages,
      usage
    });
  } catch (error) {
    if (error instanceof OpenAITranslationError) {
      const status = error.status === 429 ? 429 : error.status === 400 ? 400 : 502;
      return res.status(status).json({ message: error.message });
    }
    return next(error);
  }
});

router.get('/openai-translations/settings', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const settings = await getOpenAiTranslationSettings();
    return res.json(mapOpenAiTranslationSettingsForResponse(settings));
  } catch (error) {
    return next(error);
  }
});

router.put('/openai-translations/settings', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = openAiTranslationSettingsSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const apiKey = String(payload.apiKey || '').trim();
  const model = normalizeOpenAITranslationModel(payload.model);
  const ttsModel = normalizeOpenAITtsModel(payload.ttsModel);
  const ttsVoice = normalizeOpenAITtsVoice(payload.ttsVoice);
  const ttsInstructions = normalizeOpenAITtsInstructions(payload.ttsInstructions);

  try {
    const current = await getOpenAiTranslationSettings();
    const nextApiKey = payload.clearApiKey ? null : apiKey || current?.api_key || null;
    const saved = await pool.query(
      `
        INSERT INTO dashboard_openai_translation_settings (
          id,
          api_key,
          model,
          tts_model,
          tts_voice,
          tts_instructions,
          updated_by,
          updated_at
        )
        VALUES (1, $1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (id) DO UPDATE SET
          api_key = EXCLUDED.api_key,
          model = EXCLUDED.model,
          tts_model = EXCLUDED.tts_model,
          tts_voice = EXCLUDED.tts_voice,
          tts_instructions = EXCLUDED.tts_instructions,
          updated_by = EXCLUDED.updated_by,
          updated_at = NOW()
        RETURNING id, api_key, model, tts_model, tts_voice, tts_instructions, updated_at, updated_by
      `,
      [nextApiKey, model, ttsModel, ttsVoice, ttsInstructions, req.authSession.user.id]
    );

    return res.json(mapOpenAiTranslationSettingsForResponse(saved.rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.post('/openai-translations/audio-preview', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = openAiAudioPreviewSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;

  try {
    const settings = await getOpenAiTranslationSettings();
    const { audioBuffer, contentType } = await generateSpeechWithOpenAI({
      apiKey: settings.api_key,
      model: payload.ttsModel,
      voice: payload.ttsVoice,
      instructions: payload.ttsInstructions,
      input: payload.previewText
    });

    res.setHeader('Content-Type', contentType || 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Length', audioBuffer.length);
    return res.send(audioBuffer);
  } catch (error) {
    if (error instanceof OpenAITranslationError) {
      const status = error.status === 429 ? 429 : error.status === 400 ? 400 : 502;
      return res.status(status).json({ message: error.message });
    }
    return next(error);
  }
});

router.get('/openai-translations/status-summary', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = openAiTranslationStatusQuerySchema.safeParse(req.query || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Query non valida', errors: parsed.error.flatten() });
  }

  try {
    const result = await pool.query(
      `
        SELECT
          p.id,
          p.city_id,
          c.name AS city_name,
          p.name,
          p.description_short,
          p.description_long,
          p.audio_url,
          p.translations
        FROM pois p
        JOIN cities c ON c.id = p.city_id
        ORDER BY c.name ASC, p.name ASC
      `
    );

    return res.json(buildPoiTranslationSummary(result.rows, parsed.data.targetLanguage));
  } catch (error) {
    return next(error);
  }
});

router.get('/openai-translations/cities/:cityId/status', requireAuth, requireAdmin, async (req, res, next) => {
  const cityId = String(req.params.cityId || '').trim();
  if (!cityId) {
    return res.status(400).json({ message: 'Città non valida' });
  }

  const parsed = openAiTranslationStatusQuerySchema.safeParse(req.query || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Query non valida', errors: parsed.error.flatten() });
  }

  try {
    const city = await fetchCityById(cityId);
    if (!city) {
      return res.status(404).json({ message: 'Città non trovata' });
    }

    const result = await pool.query(
      `
        SELECT
          p.id,
          p.city_id,
          c.name AS city_name,
          p.name,
          p.description_short,
          p.description_long,
          p.audio_url,
          p.translations
        FROM pois p
        JOIN cities c ON c.id = p.city_id
        WHERE p.city_id = $1
        ORDER BY p.name ASC
      `,
      [cityId]
    );

    return res.json(result.rows.map((row) => buildPoiTranslationStatus(row, parsed.data.targetLanguage)));
  } catch (error) {
    return next(error);
  }
});

router.post('/openai-translations/pois/:poiId/translate', requireAuth, requireAdmin, async (req, res, next) => {
  const poiId = String(req.params.poiId || '').trim();
  if (!poiId) {
    return res.status(400).json({ message: 'POI non valido' });
  }

  const parsed = openAiPoiTranslationSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;

  try {
    const poi = await fetchPoiById(poiId);
    if (!poi) {
      return res.status(404).json({ message: 'POI non trovato' });
    }
    if (payload.cityId && payload.cityId !== poi.city_id) {
      return res.status(400).json({ message: 'Il POI non appartiene alla città selezionata' });
    }

    const currentStatus = buildPoiTranslationStatus(poi, payload.targetLanguage);
    if (currentStatus.isComplete && !payload.overwrite) {
      return res.json({
        poi: mapCatalogPoiRow(poi),
        translation: currentStatus.translation,
        usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        skipped: true
      });
    }

    const settings = await getOpenAiTranslationSettings();
    const { translation, usage } = await translatePoiWithOpenAI({
      apiKey: settings.api_key,
      model: settings.model,
      targetLanguage: payload.targetLanguage,
      poi
    });

    const latestPoi = (await fetchPoiById(poiId)) || poi;
    const mergedTranslations = mergePoiTranslationFields(latestPoi.translations, payload.targetLanguage, translation, {
      overwrite: payload.overwrite
    });

    const updated = await pool.query(
      `
        UPDATE pois
        SET translations = $1::jsonb
        WHERE id = $2
        RETURNING id
      `,
      [JSON.stringify(mergedTranslations), poiId]
    );
    if (!updated.rowCount) {
      return res.status(404).json({ message: 'POI non trovato' });
    }

    const updatedPoi = await fetchPoiById(poiId);
    return res.json({
      poi: mapCatalogPoiRow(updatedPoi),
      translation,
      usage,
      skipped: false
    });
  } catch (error) {
    if (error instanceof OpenAITranslationError) {
      const status = error.status === 429 ? 429 : error.status === 400 ? 400 : 502;
      return res.status(status).json({ message: error.message });
    }
    return next(error);
  }
});

router.post('/openai-translations/pois/:poiId/audio', requireAuth, requireAdmin, async (req, res, next) => {
  const poiId = String(req.params.poiId || '').trim();
  if (!poiId) {
    return res.status(400).json({ message: 'POI non valido' });
  }

  const parsed = openAiPoiAudioGenerationSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;

  try {
    const poi = await fetchPoiById(poiId);
    if (!poi) {
      return res.status(404).json({ message: 'POI non trovato' });
    }
    if (payload.cityId && payload.cityId !== poi.city_id) {
      return res.status(400).json({ message: 'Il POI non appartiene alla cittÃ  selezionata' });
    }

    const isItalianAudio = payload.targetLanguage === 'it';
    const translations = sanitizeCatalogPoiTranslations(poi.translations);
    const translation = isItalianAudio
      ? {
          descriptionShort: sanitizeCatalogText(poi.description_short),
          descriptionLong: sanitizeCatalogText(poi.description_long),
          audioUrl: String(poi.audio_url || '').trim()
        }
      : translations[payload.targetLanguage] || {};
    const existingAudioUrl = String(isItalianAudio ? poi.audio_url : translation.audioUrl || '').trim();
    if (existingAudioUrl && !payload.overwrite) {
      return res.json({
        poi: mapCatalogPoiRow(poi),
        audioUrl: existingAudioUrl,
        skipped: true
      });
    }

    const speechInput = buildTranslatedPoiSpeechInput(translation);
    if (!speechInput) {
      return res.status(400).json({
        message: isItalianAudio ? 'Inserisci prima la descrizione italiana del POI.' : 'Genera prima il testo tradotto per questa lingua.'
      });
    }

    const settings = await getOpenAiTranslationSettings();
    const { audioBuffer } = await generateSpeechWithOpenAI({
      apiKey: settings.api_key,
      model: settings.tts_model,
      voice: settings.tts_voice,
      instructions: settings.tts_instructions,
      input: speechInput
    });

    const audioUrl = await storeGeneratedPoiAudio({
      cityId: poi.city_id,
      poiName: poi.name,
      targetLanguage: payload.targetLanguage,
      audioBuffer
    });
    if (!audioUrl) {
      return res.status(404).json({ message: 'CittÃ  non trovata' });
    }

    const latestPoi = (await fetchPoiById(poiId)) || poi;
    const mergedTranslations = isItalianAudio
      ? null
      : mergePoiTranslationFields(latestPoi.translations, payload.targetLanguage, { audioUrl }, { overwrite: true });

    const updated = await pool.query(
      isItalianAudio
        ? `
          UPDATE pois
          SET audio_url = $1
          WHERE id = $2
          RETURNING id
        `
        : `
          UPDATE pois
          SET translations = $1::jsonb
          WHERE id = $2
          RETURNING id
        `,
      isItalianAudio ? [audioUrl, poiId] : [JSON.stringify(mergedTranslations), poiId]
    );
    if (!updated.rowCount) {
      return res.status(404).json({ message: 'POI non trovato' });
    }

    const updatedPoi = await fetchPoiById(poiId);
    return res.json({
      poi: mapCatalogPoiRow(updatedPoi),
      audioUrl,
      skipped: false
    });
  } catch (error) {
    if (error instanceof OpenAITranslationError) {
      const status = error.status === 429 ? 429 : error.status === 400 ? 400 : 502;
      return res.status(status).json({ message: error.message });
    }
    return next(error);
  }
});

router.get('/payments', requireAuth, async (req, res, next) => {
  const role = req.authSession?.user?.role;
  if (!canViewPayments(role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const parsed = paymentsQuerySchema.safeParse({
    structureId: String(req.query.structureId || '').trim() || undefined,
    includeHidden: req.query.includeHidden
  });
  if (!parsed.success) {
    return res.status(400).json({ message: 'Query non valida', errors: parsed.error.flatten() });
  }

  const managerStructureId = req.authSession?.user?.structureId || null;
  const requestedStructureId = parsed.data.structureId || null;
  const structureIdFilter = role === 'facility_manager' ? managerStructureId : requestedStructureId;
  const includeHidden = role === 'admin' && Boolean(parsed.data.includeHidden);

  if (role === 'facility_manager' && !structureIdFilter) {
    return res.json({
      summary: {
        totalPayments: 0,
        totalCollected: 0,
        totalDiscountAmount: 0,
        totalStructureEarnings: 0
      },
      items: []
    });
  }

  const queryParams = [];
  const whereParts = [];
  if (structureIdFilter) {
    queryParams.push(structureIdFilter);
    whereParts.push(`p.structure_id = $${queryParams.length}`);
  }
  if (!includeHidden) {
    whereParts.push('p.hidden = 0');
  }
  const whereSql = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

  try {
    const result = await pool.query(
      `
        SELECT
          p.id,
          p.user_id,
          p.type,
          p.city_id,
          c.name AS city_name,
          p.poi_id,
          poi.name AS poi_name,
          p.base_amount,
          p.discount_percent,
          p.discount_amount,
          p.final_amount,
          p.amount,
          p.structure_id,
          s.name AS structure_name,
          p.invite_code,
          p.structure_fixed_amount,
          p.structure_earning_amount,
          p.payment_method,
          p.payment_provider,
          p.payment_status,
          p.payment_order_id,
          p.payment_capture_id,
          p.payment_environment,
          p.payer_email,
          p.payer_id,
          p.payer_first_name,
          p.payer_last_name,
          p.payer_country_code,
          p.payer_phone,
          p.payer_address,
          p.hidden,
          p.purchased_at
        FROM purchases p
        LEFT JOIN cities c ON c.id = p.city_id
        LEFT JOIN pois poi ON poi.id = p.poi_id
        LEFT JOIN dashboard_structures s ON s.id = p.structure_id
        ${whereSql}
        ORDER BY p.purchased_at DESC, p.id DESC
      `,
      queryParams
    );

    const items = result.rows.map((row) => {
      const baseAmount = safeNumber(row.base_amount, safeNumber(row.amount, 0));
      const discountPercent = safeNumber(row.discount_percent, 0);
      const discountAmount = safeNumber(row.discount_amount, 0);
      const finalAmount = safeNumber(row.final_amount, safeNumber(row.amount, 0));
      const structureFixedAmount = safeNumber(row.structure_fixed_amount, 0);
      const structureEarningAmount = safeNumber(row.structure_earning_amount, 0);
      const customerProfile = buildPaymentCustomerProfile(row);
      const paymentMethod = String(row.payment_method || '').trim() || 'Non disponibile';
      const paymentProvider =
        String(row.payment_provider || '').trim() ||
        paypalProviderLabel(row.payment_environment || 'sandbox');
      const paymentStatus = normalizePaymentStatusLabel(row.payment_status);

      return {
        id: Number(row.id),
        userId: row.user_id,
        ...customerProfile,
        type: row.type,
        cityId: row.city_id || null,
        cityName: row.city_name || null,
        poiId: row.poi_id || null,
        poiName: row.poi_name || null,
        targetName: row.type === 'bundle' ? row.city_name || row.city_id : row.poi_name || row.poi_id,
        baseAmount,
        discountPercent,
        discountAmount,
        finalAmount,
        paidAmount: safeNumber(row.amount, finalAmount),
        structureId: row.structure_id || null,
        structureName: row.structure_name || null,
        inviteCode: row.invite_code || null,
        structureFixedAmount,
        structureEarningAmount,
        paymentMethod,
        paymentProvider,
        paymentStatus,
        paymentOrderId: row.payment_order_id || null,
        paymentCaptureId: row.payment_capture_id || null,
        paymentEnvironment: row.payment_environment || null,
        hidden: Number(row.hidden || 0) === 1,
        purchasedAt: row.purchased_at
      };
    });

    const summary = items.reduce(
      (acc, item) => {
        acc.totalPayments += 1;
        acc.totalCollected += item.paidAmount;
        acc.totalDiscountAmount += item.discountAmount;
        acc.totalStructureEarnings += item.structureEarningAmount;
        return acc;
      },
      {
        totalPayments: 0,
        totalCollected: 0,
        totalDiscountAmount: 0,
        totalStructureEarnings: 0
      }
    );

    summary.totalCollected = Number(summary.totalCollected.toFixed(2));
    summary.totalDiscountAmount = Number(summary.totalDiscountAmount.toFixed(2));
    summary.totalStructureEarnings = Number(summary.totalStructureEarnings.toFixed(2));

    return res.json({
      summary,
      items
    });
  } catch (error) {
    return next(error);
  }
});

router.patch('/payments/hidden', requireAuth, async (req, res, next) => {
  const role = req.authSession?.user?.role;
  if (!canViewPayments(role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const parsed = paymentsHiddenBulkUpdateSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const paymentIds = Array.from(new Set(parsed.data.paymentIds));
  const managerStructureId = req.authSession?.user?.structureId || null;
  if (role === 'facility_manager' && !managerStructureId) {
    return res.status(403).json({ message: 'Gestore senza struttura assegnata' });
  }

  const params = [parsed.data.hidden ? 1 : 0, paymentIds];
  const structureFilter = role === 'facility_manager' ? 'AND structure_id = $3' : '';
  if (role === 'facility_manager') {
    params.push(managerStructureId);
  }

  try {
    const updated = await pool.query(
      `
        UPDATE purchases
        SET hidden = $1
        WHERE id = ANY($2::BIGINT[])
          ${structureFilter}
        RETURNING id, hidden
      `,
      params
    );

    if (!updated.rowCount) {
      return res.status(404).json({ message: 'Nessun pagamento trovato' });
    }

    return res.json({
      paymentIds: updated.rows.map((row) => Number(row.id)),
      hidden: parsed.data.hidden,
      updatedCount: updated.rowCount
    });
  } catch (error) {
    return next(error);
  }
});

router.patch('/payments/:paymentId/hidden', requireAuth, async (req, res, next) => {
  const role = req.authSession?.user?.role;
  if (!canViewPayments(role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const paymentId = Number(req.params.paymentId);
  if (!Number.isInteger(paymentId) || paymentId <= 0) {
    return res.status(400).json({ message: 'Pagamento non valido' });
  }

  const parsed = paymentHiddenUpdateSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const managerStructureId = req.authSession?.user?.structureId || null;
  if (role === 'facility_manager' && !managerStructureId) {
    return res.status(403).json({ message: 'Gestore senza struttura assegnata' });
  }

  const params = [parsed.data.hidden ? 1 : 0, paymentId];
  const structureFilter = role === 'facility_manager' ? 'AND structure_id = $3' : '';
  if (role === 'facility_manager') {
    params.push(managerStructureId);
  }

  try {
    const updated = await pool.query(
      `
        UPDATE purchases
        SET hidden = $1
        WHERE id = $2
          ${structureFilter}
        RETURNING id, hidden
      `,
      params
    );

    if (!updated.rowCount) {
      return res.status(404).json({ message: 'Pagamento non trovato' });
    }

    return res.json({
      paymentId: Number(updated.rows[0].id),
      hidden: Number(updated.rows[0].hidden || 0) === 1
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/partner-requests', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const result = await pool.query(
      `
        SELECT
          pr.id,
          pr.structure_name,
          pr.structure_type,
          pr.vat_number,
          pr.contact_first_name,
          pr.contact_last_name,
          pr.contact_email,
          pr.contact_phone,
          pr.website,
          pr.address_street,
          pr.address_number,
          pr.address_city,
          pr.address_postal_code,
          pr.address_province,
          pr.address_region,
          pr.address_country,
          pr.rooms_count,
          pr.notes,
          pr.status,
          pr.pdf_release_status,
          pr.approved_structure_id,
          pr.approved_discount_code_id,
          pr.approval_email_sent_at,
          partner_user.id AS partner_user_id,
          partner_user.email AS partner_user_email,
          partner_user.first_name AS partner_user_first_name,
          partner_user.last_name AS partner_user_last_name,
          partner_user.is_registered AS partner_user_is_registered,
          partner_user.invite_expires_at AS partner_invite_expires_at,
          partner_user.invite_used_at AS partner_invite_used_at,
          partner_user.invite_created_at AS partner_invite_created_at,
          dc.code AS discount_code,
          dc.apply_to,
          dc.city_id,
          legacy_city.name AS city_name,
          COALESCE(city_links.city_ids, CASE WHEN dc.city_id IS NOT NULL THEN ARRAY[dc.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
          COALESCE(city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
          dc.user_discount_percent,
          dc.user_discount_percent_single,
          dc.user_discount_percent_bundle,
          dc.structure_fixed_amount,
          dc.structure_fixed_amount_single,
          dc.structure_fixed_amount_bundle,
          dc.expires_at,
          pr.created_at,
          pr.updated_at
        FROM partner_registration_requests pr
        LEFT JOIN dashboard_structure_discount_codes dc ON dc.id = pr.approved_discount_code_id
        LEFT JOIN cities legacy_city ON legacy_city.id = dc.city_id
        LEFT JOIN LATERAL (
          SELECT
            ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
            ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
          FROM dashboard_structure_discount_code_cities dcc
          JOIN cities c ON c.id = dcc.city_id
          WHERE dcc.discount_code_id = dc.id
        ) city_links ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            u.id,
            u.email,
            u.first_name,
            u.last_name,
            u.is_registered,
            latest_invite.expires_at AS invite_expires_at,
            latest_invite.used_at AS invite_used_at,
            latest_invite.created_at AS invite_created_at
          FROM dashboard_users u
          LEFT JOIN LATERAL (
            SELECT i.expires_at, i.used_at, i.created_at
            FROM dashboard_invites i
            WHERE i.user_id = u.id
            ORDER BY i.created_at DESC, i.id DESC
            LIMIT 1
          ) latest_invite ON TRUE
          WHERE u.deleted = 0
            AND u.structure_id = pr.approved_structure_id
            AND LOWER(u.email) = LOWER(pr.contact_email)
          ORDER BY u.is_registered DESC, u.updated_at DESC
          LIMIT 1
        ) partner_user ON TRUE
        WHERE pr.deleted = 0
        ORDER BY
          CASE
            WHEN pr.status = 'pending' THEN 0
            WHEN pr.status = 'approved' THEN 1
            WHEN pr.status = 'rejected' THEN 2
            ELSE 3
          END,
          pr.created_at DESC,
          pr.id DESC
      `
    );

    return res.json(result.rows.map(mapPartnerRequestRow));
  } catch (error) {
    return next(error);
  }
});

router.post('/partner-requests/:requestId/pdf-preview', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = partnerRequestPdfPreviewSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const requestId = Number(req.params.requestId);
  if (!Number.isInteger(requestId) || requestId <= 0) {
    return res.status(400).json({ message: 'Richiesta partner non valida' });
  }

  try {
    const requestRow = await fetchPartnerRequestById(requestId);
    if (!requestRow) {
      return res.status(404).json({ message: 'Richiesta partner non trovata' });
    }

    const selectedCityIds = normalizeCityIdsSelection(parsed.data.cityIds);
    const cityRows = await fetchCitiesByIds(selectedCityIds);
    if (selectedCityIds.length && cityRows.length !== selectedCityIds.length) {
      return res.status(404).json({ message: 'Una o piu città selezionate non esistono' });
    }
    const cityNames = cityRows.map((row) => sanitizeCatalogText(row.name)).filter(Boolean);
    const requestedDiscountCode = normalizePartnerPreviewCode(parsed.data.code || '');
    const discountCode = requestedDiscountCode || normalizePartnerPreviewCode(requestRow.discount_code || '');
    const pdfOptions = {
      applyTo: parsed.data.applyTo,
      discountCode
    };
    if (selectedCityIds.length) {
      pdfOptions.cityNames = cityNames;
    }
    if (parsed.data.expiresAt) {
      pdfOptions.expiresAt = parsed.data.expiresAt.toISOString();
    }
    if (parsed.data.userDiscountPercent !== undefined && parsed.data.userDiscountPercent !== null) {
      pdfOptions.userDiscountPercent = parsed.data.userDiscountPercent;
    }
    if (parsed.data.structureFixedAmount !== undefined && parsed.data.structureFixedAmount !== null) {
      pdfOptions.structureFixedAmount = parsed.data.structureFixedAmount;
    }
    const pdfPayload = buildPartnerRequestPdfPayload(requestRow, pdfOptions);
    const pdfBuffer = buildPartnerPromotionPdf(pdfPayload);
    const fileName = buildPartnerPromotionFileName(requestRow.structure_name, discountCode);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    return res.send(pdfBuffer);
  } catch (error) {
    return next(error);
  }
});

router.post('/partner-requests/:requestId/reject', requireAuth, requireAdmin, async (req, res, next) => {
  const requestId = Number(req.params.requestId);
  if (!Number.isInteger(requestId) || requestId <= 0) {
    return res.status(400).json({ message: 'Richiesta partner non valida' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await fetchPartnerRequestById(requestId, client, { forUpdate: true });
    if (!current) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Richiesta partner non trovata' });
    }

    const currentStatus = normalizePartnerRequestStatus(current.status);
    if (currentStatus === 'approved') {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'La richiesta e gia approvata e non puo essere negata' });
    }
    if (currentStatus === 'rejected') {
      await client.query('ROLLBACK');
      return res.json(mapPartnerRequestRow(current));
    }

    const emailSettings = normalizePartnerEmailSettings(await getPartnerEmailSettings(client));
    await sendPartnerRejectionEmail({
      requestId: current.id,
      to: current.contact_email,
      contactName: [current.contact_first_name, current.contact_last_name].filter(Boolean).join(' '),
      structureName: current.structure_name,
      structureType: current.structure_type,
      contactEmail: current.contact_email,
      addressCity: current.address_city,
      subjectTemplate: emailSettings.rejectionSubject,
      bodyTemplate: emailSettings.rejectionBody
    });

    const updated = await client.query(
      `
        UPDATE partner_registration_requests
        SET status = $1,
            pdf_release_status = $2,
            updated_at = NOW()
        WHERE id = $3
        RETURNING
          id,
          structure_name,
          structure_type,
          vat_number,
          contact_first_name,
          contact_last_name,
          contact_email,
          contact_phone,
          website,
          address_street,
          address_number,
          address_city,
          address_postal_code,
          address_province,
          address_region,
          address_country,
          rooms_count,
          notes,
          status,
          pdf_release_status,
          approved_structure_id,
          approved_discount_code_id,
          approval_email_sent_at,
          created_at,
          updated_at
      `,
      ['rejected', 'pending', requestId]
    );

    await client.query('COMMIT');

    return res.json(
      mapPartnerRequestRow({
        ...updated.rows[0],
        discount_code: current.discount_code || null
      })
    );
  } catch (error) {
    await client.query('ROLLBACK');
    if (isPartnerEmailDeliveryError(error)) {
      return res.status(502).json({
        message: 'Email partner non inviata dal server SMTP. Controlla destinatario, spam/provider e log backend.'
      });
    }
    return next(error);
  } finally {
    client.release();
  }
});

router.delete('/partner-requests/:requestId', requireAuth, requireAdmin, async (req, res, next) => {
  const requestId = Number(req.params.requestId);
  if (!Number.isInteger(requestId) || requestId <= 0) {
    return res.status(400).json({ message: 'Richiesta partner non valida' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await fetchPartnerRequestById(requestId, client, { forUpdate: true, includeDeleted: true });
    if (!current || Number(current.deleted || 0) === 1) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Richiesta partner non trovata' });
    }

    await client.query(
      `
        UPDATE partner_registration_requests
        SET deleted = 1,
            updated_at = NOW()
        WHERE id = $1
      `,
      [requestId]
    );

    await client.query('COMMIT');
    return res.json({ deleted: true, requestId });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.post('/partner-requests/:requestId/approve', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = partnerRequestApprovalSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const requestId = Number(req.params.requestId);
  if (!Number.isInteger(requestId) || requestId <= 0) {
    return res.status(400).json({ message: 'Richiesta partner non valida' });
  }

  const payload = parsed.data;
  const selectedCityIds = normalizeCityIdsSelection(payload.cityIds);
  if (!selectedCityIds.length) {
    return res.status(400).json({ message: 'Seleziona almeno una città' });
  }
  if (payload.expiresAt.getTime() <= Date.now()) {
    return res.status(400).json({ message: 'La scadenza deve essere futura' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const requestRow = await fetchPartnerRequestById(requestId, client, { forUpdate: true });
    if (!requestRow) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Richiesta partner non trovata' });
    }

    if (normalizePartnerRequestStatus(requestRow.status) === 'approved') {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'La richiesta partner e gia stata approvata' });
    }

    const cityRows = await fetchCitiesByIds(selectedCityIds, client);
    if (cityRows.length !== selectedCityIds.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Una o piu città selezionate non esistono' });
    }

    const normalizedCode = String(payload.code || '')
      .trim()
      .toUpperCase();
    const alreadyUsed = await structureInviteCodeExists(normalizedCode, client);
    if (alreadyUsed) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Codice gia in uso' });
    }

    const normalizedStreet = String(requestRow.address_street || '').trim();
    const normalizedStreetNumber = String(requestRow.address_number || '').trim();
    const normalizedCity = String(requestRow.address_city || '').trim();
    const normalizedPostalCode = String(requestRow.address_postal_code || '').trim();
    const normalizedProvince = String(requestRow.address_province || '').trim().toUpperCase() || null;
    const normalizedCountry = String(requestRow.address_country || '').trim() || 'Italia';
    const normalizedAddress = buildStructureAddress({
      street: normalizedStreet,
      streetNumber: normalizedStreetNumber,
      city: normalizedCity,
      postalCode: normalizedPostalCode,
      province: normalizedProvince,
      country: normalizedCountry
    });
    const structureId = `str_${crypto.randomUUID()}`;

    await client.query(
      `
        INSERT INTO dashboard_structures (
          id,
          name,
          address,
          address_street,
          address_number,
          address_city,
          address_postal_code,
          address_province,
          address_country
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
      [
        structureId,
        String(requestRow.structure_name || '').trim(),
        normalizedAddress,
        normalizedStreet,
        normalizedStreetNumber || null,
        normalizedCity,
        normalizedPostalCode || null,
        normalizedProvince,
        normalizedCountry
      ]
    );

    const activationInvite = await createPartnerActivationInvite({
      client,
      requestRow,
      structureId,
      invitedByUserId: req.authSession.user.id,
      origin: payload.origin
    });
    if (activationInvite.error) {
      await client.query('ROLLBACK');
      return res.status(activationInvite.error.status).json({ message: activationInvite.error.message });
    }
    const activationUrl = activationInvite.activationUrl;

    const applyTo = payload.applyTo === 'single' ? 'single' : 'bundle';
    const userDiscountPercentSingle = applyTo === 'single' ? payload.userDiscountPercent : 0;
    const userDiscountPercentBundle = applyTo === 'bundle' ? payload.userDiscountPercent : 0;
    const structureFixedAmountSingle = applyTo === 'single' ? payload.structureFixedAmount : 0;
    const structureFixedAmountBundle = applyTo === 'bundle' ? payload.structureFixedAmount : 0;

    const createdDiscountCode = await client.query(
      `
        INSERT INTO dashboard_structure_discount_codes (
          structure_id,
          code,
          apply_to,
          city_id,
          user_discount_percent,
          user_discount_percent_single,
          user_discount_percent_bundle,
          structure_fixed_amount,
          structure_fixed_amount_single,
          structure_fixed_amount_bundle,
          expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `,
      [
        structureId,
        normalizedCode,
        applyTo,
        selectedCityIds[0],
        payload.userDiscountPercent,
        userDiscountPercentSingle,
        userDiscountPercentBundle,
        payload.structureFixedAmount,
        structureFixedAmountSingle,
        structureFixedAmountBundle,
        payload.expiresAt.toISOString()
      ]
    );
    const discountCodeId = Number(createdDiscountCode.rows[0].id);

    await client.query(
      `
        INSERT INTO dashboard_structure_discount_code_cities (discount_code_id, city_id)
        SELECT $1::BIGINT, city_id
        FROM UNNEST($2::TEXT[]) AS selected(city_id)
        ON CONFLICT (discount_code_id, city_id) DO NOTHING
      `,
      [discountCodeId, selectedCityIds]
    );

    const cityNameById = new Map(cityRows.map((row) => [String(row.id), sanitizeCatalogText(row.name)]));
    const orderedCityNames = selectedCityIds.map((cityId) => cityNameById.get(cityId)).filter(Boolean);
    const pdfPayload = buildPartnerRequestPdfPayload(requestRow, {
      applyTo,
      cityNames: orderedCityNames,
      discountCode: normalizedCode,
      expiresAt: payload.expiresAt.toISOString(),
      userDiscountPercent: payload.userDiscountPercent,
      structureFixedAmount: payload.structureFixedAmount
    });
    const pdfBuffer = buildPartnerPromotionPdf(pdfPayload);
    const pdfFileName = buildPartnerPromotionFileName(requestRow.structure_name, normalizedCode);
    const emailSettings = normalizePartnerEmailSettings(await getPartnerEmailSettings(client));

    await sendPartnerApprovalEmail({
      requestId: requestRow.id,
      to: requestRow.contact_email,
      contactName: [requestRow.contact_first_name, requestRow.contact_last_name].filter(Boolean).join(' '),
      structureName: requestRow.structure_name,
      structureType: requestRow.structure_type,
      contactEmail: requestRow.contact_email,
      addressCity: requestRow.address_city,
      discountCode: normalizedCode,
      cityNames: orderedCityNames,
      expiresAt: payload.expiresAt.toISOString(),
      userDiscountPercent: payload.userDiscountPercent,
      structureFixedAmount: payload.structureFixedAmount,
      activationUrl,
      pdfBuffer,
      pdfFileName,
      subjectTemplate: emailSettings.approvalSubject,
      bodyTemplate: emailSettings.approvalBody
    });

    const updated = await client.query(
      `
        UPDATE partner_registration_requests
        SET status = $1,
            pdf_release_status = $2,
            approved_structure_id = $3,
            approved_discount_code_id = $4,
            approval_email_sent_at = NOW(),
            updated_at = NOW()
        WHERE id = $5
        RETURNING
          id,
          structure_name,
          structure_type,
          vat_number,
          contact_first_name,
          contact_last_name,
          contact_email,
          contact_phone,
          website,
          address_street,
          address_number,
          address_city,
          address_postal_code,
          address_province,
          address_region,
          address_country,
          rooms_count,
          notes,
          status,
          pdf_release_status,
          approved_structure_id,
          approved_discount_code_id,
          approval_email_sent_at,
          created_at,
          updated_at
      `,
      ['approved', 'sent', structureId, discountCodeId, requestId]
    );

    await client.query('COMMIT');

    return res.json(
      mapPartnerRequestRow({
        ...updated.rows[0],
        discount_code: normalizedCode,
        apply_to: applyTo,
        city_id: selectedCityIds[0] || null,
        city_ids: selectedCityIds,
        city_names: orderedCityNames,
        user_discount_percent: payload.userDiscountPercent,
        user_discount_percent_single: userDiscountPercentSingle,
        user_discount_percent_bundle: userDiscountPercentBundle,
        structure_fixed_amount: payload.structureFixedAmount,
        structure_fixed_amount_single: structureFixedAmountSingle,
        structure_fixed_amount_bundle: structureFixedAmountBundle,
        expires_at: payload.expiresAt.toISOString(),
        partner_user_id: activationInvite.partnerUserId,
        partner_user_email: requestRow.contact_email,
        partner_user_first_name: requestRow.contact_first_name,
        partner_user_last_name: requestRow.contact_last_name,
        partner_user_is_registered: false,
        partner_invite_expires_at: activationInvite.activationExpiresAt,
        partner_invite_used_at: null,
        partner_invite_created_at: new Date().toISOString()
      })
    );
  } catch (error) {
    await client.query('ROLLBACK');
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_MODULE_NOT_FOUND') {
      return res.status(500).json({ message: 'Nodemailer non installato. Esegui npm install nel backend.' });
    }
    if (isPartnerEmailDeliveryError(error)) {
      return res.status(502).json({
        message: 'Email partner non inviata dal server SMTP. Controlla destinatario, spam/provider e log backend.'
      });
    }
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return res.status(409).json({ message: 'Codice gia in uso' });
    }
    return next(error);
  } finally {
    client.release();
  }
});

router.post('/partner-requests/:requestId/resend-activation', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = partnerRequestActivationResendSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const requestId = Number(req.params.requestId);
  if (!Number.isInteger(requestId) || requestId <= 0) {
    return res.status(400).json({ message: 'Richiesta partner non valida' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const current = await fetchPartnerRequestById(requestId, client, { forUpdate: true });
    if (!current) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Richiesta partner non trovata' });
    }
    if (normalizePartnerRequestStatus(current.status) !== 'approved' || !current.approved_structure_id) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Puoi reinviare l invito solo per richieste partner approvate' });
    }
    if (current.partner_user_is_registered) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'La struttura ha gia un utente dashboard registrato' });
    }

    const activationInvite = await createPartnerActivationInvite({
      client,
      requestRow: current,
      structureId: current.approved_structure_id,
      invitedByUserId: req.authSession.user.id,
      origin: parsed.data.origin
    });
    if (activationInvite.error) {
      await client.query('ROLLBACK');
      return res.status(activationInvite.error.status).json({ message: activationInvite.error.message });
    }

    const emailSettings = normalizePartnerEmailSettings(await getPartnerEmailSettings(client));
    const applyTo = current.apply_to === 'single' ? 'single' : 'bundle';
    await sendPartnerActivationEmail({
      requestId: current.id,
      to: current.contact_email,
      contactName: [current.contact_first_name, current.contact_last_name].filter(Boolean).join(' '),
      structureName: current.structure_name,
      structureType: current.structure_type,
      contactEmail: current.contact_email,
      addressCity: current.address_city,
      discountCode: current.discount_code || '',
      cityNames: normalizeTextArray(current.city_names),
      expiresAt: current.expires_at || null,
      userDiscountPercent: optionalNumber(resolveDiscountRowValue(current, applyTo, 'user_discount_percent')),
      structureFixedAmount: optionalNumber(resolveDiscountRowValue(current, applyTo, 'structure_fixed_amount')),
      activationUrl: activationInvite.activationUrl,
      subjectTemplate: emailSettings.activationSubject,
      bodyTemplate: emailSettings.activationBody
    });

    const updated = await fetchPartnerRequestById(requestId, client);
    await client.query('COMMIT');
    return res.json(mapPartnerRequestRow(updated || current));
  } catch (error) {
    await client.query('ROLLBACK');
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_MODULE_NOT_FOUND') {
      return res.status(500).json({ message: 'Nodemailer non installato. Esegui npm install nel backend.' });
    }
    if (isPartnerEmailDeliveryError(error)) {
      return res.status(502).json({
        message: 'Email partner non inviata dal server SMTP. Controlla destinatario, spam/provider e log backend.'
      });
    }
    return next(error);
  } finally {
    client.release();
  }
});

router.get('/catalog/cities', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const result = await pool.query(
      `
        SELECT
          c.id,
          c.name,
          c.region,
          c.bundle_price,
          c.hero_image,
          c.is_default,
          c.publication_status,
          c.translations,
          COUNT(p.id)::INT AS poi_count
        FROM cities c
        LEFT JOIN pois p ON p.city_id = c.id
        GROUP BY c.id
        ORDER BY c.is_default DESC, c.name ASC
      `
    );

    const migratedRows = [];
    for (const row of result.rows) {
      migratedRows.push({
        ...row,
        hero_image: await maybeMigrateCityHeroImage(row)
      });
    }

    return res.json(migratedRows.map(mapCatalogCityRow));
  } catch (error) {
    return next(error);
  }
});

router.post('/catalog/cities', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = catalogCitySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const citySlug = slugify(payload.name) || 'citta';
  const cityId = `${citySlug}-${crypto.randomUUID().slice(0, 8)}`;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (payload.isDefault) {
      await client.query('UPDATE cities SET is_default = FALSE WHERE is_default = TRUE');
    }

    const created = await client.query(
      `
        INSERT INTO cities (id, name, region, bundle_price, hero_image, is_default, publication_status, translations)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
        RETURNING id, name, region, bundle_price, hero_image, is_default, publication_status, translations
      `,
      [
        cityId,
        payload.name,
        payload.region,
        payload.bundlePrice,
        payload.heroImage,
        payload.isDefault,
        payload.publicationStatus,
        JSON.stringify({})
      ]
    );

    await client.query('COMMIT');
    return res.status(201).json(mapCatalogCityRow(created.rows[0]));
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.patch('/catalog/cities/:cityId', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = catalogCitySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const cityId = String(req.params.cityId || '').trim();
  if (!cityId) {
    return res.status(400).json({ message: 'Città non valida' });
  }

  const payload = parsed.data;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await fetchCityById(cityId, client);
    if (!existing) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Città non trovata' });
    }

    if (payload.isDefault) {
      await client.query('UPDATE cities SET is_default = FALSE WHERE id <> $1 AND is_default = TRUE', [cityId]);
    }

    const updated = await client.query(
      `
        UPDATE cities
        SET name = $1,
            region = $2,
            bundle_price = $3,
            hero_image = $4,
            is_default = $5,
            publication_status = $6,
            translations = $7::jsonb
        WHERE id = $8
        RETURNING id, name, region, bundle_price, hero_image, is_default, publication_status, translations
      `,
      [
        payload.name,
        payload.region,
        payload.bundlePrice,
        payload.heroImage,
        payload.isDefault,
        payload.publicationStatus,
        JSON.stringify({}),
        cityId
      ]
    );

    await client.query('COMMIT');
    return res.json(mapCatalogCityRow(updated.rows[0]));
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.delete('/catalog/cities/:cityId', requireAuth, requireAdmin, async (req, res, next) => {
  const cityId = String(req.params.cityId || '').trim();
  if (!cityId) {
    return res.status(400).json({ message: 'Città non valida' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cityResult = await client.query(
      `
        SELECT id, is_default
        FROM cities
        WHERE id = $1
        FOR UPDATE
      `,
      [cityId]
    );
    if (!cityResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Città non trovata' });
    }

    const wasDefault = Boolean(cityResult.rows[0].is_default);
    await client.query('DELETE FROM cities WHERE id = $1', [cityId]);

    if (wasDefault) {
      const fallback = await client.query(
        `
          SELECT id
          FROM cities
          ORDER BY name ASC
          LIMIT 1
        `
      );
      if (fallback.rowCount) {
        await client.query('UPDATE cities SET is_default = TRUE WHERE id = $1', [fallback.rows[0].id]);
      }
    }

    await client.query('COMMIT');
    return res.json({ deleted: true, cityId });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.get('/catalog/cities/:cityId/pois', requireAuth, requireAdmin, async (req, res, next) => {
  const cityId = String(req.params.cityId || '').trim();
  if (!cityId) {
    return res.status(400).json({ message: 'Città non valida' });
  }

  try {
    const city = await fetchCityById(cityId);
    if (!city) {
      return res.status(404).json({ message: 'Città non trovata' });
    }

    const result = await pool.query(
      `
        SELECT
          p.id,
          p.city_id,
          c.name AS city_name,
          p.name,
          p.address,
          p.lat,
          p.lng,
          p.category,
          p.description_short,
          p.description_long,
          p.image_url,
          p.audio_url,
          p.price_single,
          p.duration_sec,
          p.publication_status,
          p.translations
        FROM pois p
        JOIN cities c ON c.id = p.city_id
        WHERE p.city_id = $1
        ORDER BY p.name ASC
      `,
      [cityId]
    );

    const migratedRows = [];
    for (const row of result.rows) {
      migratedRows.push(await maybeMigratePoiMedia(row));
    }
    return res.json(migratedRows.map(mapCatalogPoiRow));
  } catch (error) {
    return next(error);
  }
});

router.post('/catalog/pois', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = catalogPoiSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  try {
    const city = await fetchCityById(payload.cityId);
    if (!city) {
      return res.status(404).json({ message: 'Città non trovata' });
    }

    const poiId = `poi_${crypto.randomUUID()}`;
    const inserted = await pool.query(
      `
        INSERT INTO pois (
          id,
          city_id,
          name,
          address,
          lat,
          lng,
          category,
          description_short,
          description_long,
          image_url,
          audio_url,
          price_single,
          duration_sec,
          publication_status,
          translations
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15::jsonb)
        RETURNING id
      `,
      [
        poiId,
        payload.cityId,
        payload.name,
        payload.address,
        payload.lat,
        payload.lng,
        payload.category,
        payload.descriptionShort,
        payload.descriptionLong,
        payload.imageUrl,
        payload.audioUrl,
        payload.priceSingle,
        payload.durationSec,
        payload.publicationStatus,
        JSON.stringify(payload.translations || {})
      ]
    );

    const poi = await fetchPoiById(inserted.rows[0].id);
    return res.status(201).json(mapCatalogPoiRow(poi));
  } catch (error) {
    return next(error);
  }
});

router.patch('/catalog/pois/:poiId', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = catalogPoiSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const poiId = String(req.params.poiId || '').trim();
  if (!poiId) {
    return res.status(400).json({ message: 'POI non valido' });
  }

  const payload = parsed.data;
  try {
    const city = await fetchCityById(payload.cityId);
    if (!city) {
      return res.status(404).json({ message: 'Città non trovata' });
    }

    const updated = await pool.query(
      `
        UPDATE pois
        SET city_id = $1,
            name = $2,
            address = $3,
            lat = $4,
            lng = $5,
            category = $6,
            description_short = $7,
            description_long = $8,
            image_url = $9,
            audio_url = $10,
            price_single = $11,
            duration_sec = $12,
            publication_status = $13,
            translations = $14::jsonb
        WHERE id = $15
        RETURNING id
      `,
      [
        payload.cityId,
        payload.name,
        payload.address,
        payload.lat,
        payload.lng,
        payload.category,
        payload.descriptionShort,
        payload.descriptionLong,
        payload.imageUrl,
        payload.audioUrl,
        payload.priceSingle,
        payload.durationSec,
        payload.publicationStatus,
        JSON.stringify(payload.translations || {}),
        poiId
      ]
    );
    if (!updated.rowCount) {
      return res.status(404).json({ message: 'POI non trovato' });
    }

    const poi = await fetchPoiById(poiId);
    return res.json(mapCatalogPoiRow(poi));
  } catch (error) {
    return next(error);
  }
});

router.delete('/catalog/pois/:poiId', requireAuth, requireAdmin, async (req, res, next) => {
  const poiId = String(req.params.poiId || '').trim();
  if (!poiId) {
    return res.status(400).json({ message: 'POI non valido' });
  }

  try {
    const deleted = await pool.query('DELETE FROM pois WHERE id = $1 RETURNING id, city_id', [poiId]);
    if (!deleted.rowCount) {
      return res.status(404).json({ message: 'POI non trovato' });
    }

    return res.json({ deleted: true, poiId, cityId: deleted.rows[0].city_id });
  } catch (error) {
    return next(error);
  }
});

router.post('/catalog/upload-image', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = catalogImageUploadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  try {
    const cityFolder = await resolveCityFolder(payload);
    if (!cityFolder) {
      return res.status(404).json({ message: 'Città non trovata' });
    }

    let normalizedBase64 = payload.base64Data.trim();
    const dataUriMatch = normalizedBase64.match(/^data:[^;]+;base64,(.+)$/i);
    if (dataUriMatch) {
      normalizedBase64 = dataUriMatch[1];
    }
    normalizedBase64 = normalizedBase64.replace(/\s+/g, '');

    if (!/^[A-Za-z0-9+/=]+$/.test(normalizedBase64)) {
      return res.status(400).json({ message: 'Immagine base64 non valida' });
    }

    const buffer = Buffer.from(normalizedBase64, 'base64');
    if (!buffer.length) {
      return res.status(400).json({ message: 'File immagine vuoto' });
    }
    const maxBytes = 10 * 1024 * 1024;
    if (buffer.length > maxBytes) {
      return res.status(413).json({ message: 'File immagine troppo grande (max 10MB)' });
    }

    const cityImagesDir = path.join(publicImagesRootDir, cityFolder.folderSlug);
    await fs.mkdir(cityImagesDir, { recursive: true });
    const extension = inferImageExtension(payload.fileName, payload.mimeType || '');
    const baseName = slugify(path.basename(payload.fileName, path.extname(payload.fileName))) || 'city-image';
    const storedFileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${baseName}.${extension}`;
    const absolutePath = path.join(cityImagesDir, storedFileName);
    await fs.writeFile(absolutePath, buffer);

    return res.status(201).json({
      uploaded: true,
      imageUrl: `/public/images/${cityFolder.folderSlug}/${storedFileName}`,
      fileName: storedFileName,
      sizeBytes: buffer.length
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/catalog/upload-audio', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = catalogAudioUploadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  try {
    const cityFolder = await resolveCityFolder(payload);
    if (!cityFolder) {
      return res.status(404).json({ message: 'Città non trovata' });
    }

    let normalizedBase64 = payload.base64Data.trim();
    const dataUriMatch = normalizedBase64.match(/^data:[^;]+;base64,(.+)$/i);
    if (dataUriMatch) {
      normalizedBase64 = dataUriMatch[1];
    }
    normalizedBase64 = normalizedBase64.replace(/\s+/g, '');

    if (!/^[A-Za-z0-9+/=]+$/.test(normalizedBase64)) {
      return res.status(400).json({ message: 'Audio base64 non valido' });
    }

    const buffer = Buffer.from(normalizedBase64, 'base64');
    if (!buffer.length) {
      return res.status(400).json({ message: 'File audio vuoto' });
    }
    const maxBytes = 15 * 1024 * 1024;
    if (buffer.length > maxBytes) {
      return res.status(413).json({ message: 'File audio troppo grande (max 15MB)' });
    }

    const cityAudioDir = path.join(publicAudioRootDir, cityFolder.folderSlug);
    await fs.mkdir(cityAudioDir, { recursive: true });
    const extension = inferAudioExtension(payload.fileName, payload.mimeType || '');
    const baseName = slugify(path.basename(payload.fileName, path.extname(payload.fileName))) || 'audio-guida';
    const storedFileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${baseName}.${extension}`;
    const absolutePath = path.join(cityAudioDir, storedFileName);
    await fs.writeFile(absolutePath, buffer);

    return res.status(201).json({
      uploaded: true,
      audioUrl: `/public/audio/${cityFolder.folderSlug}/${storedFileName}`,
      fileName: storedFileName,
      sizeBytes: buffer.length
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/users', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = userCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const email = payload.email.toLowerCase();
  const userRole = payload.role;
  const requestedStructureId = payload.structureId || null;

  try {
    let structure = null;
    if (requestedStructureId && !roleCanHaveStructure(userRole)) {
      return res.status(400).json({ message: 'Il ruolo selezionato non puo avere una struttura associata' });
    }

    if (requestedStructureId) {
      structure = await fetchStructureById(requestedStructureId);
      if (!structure) {
        return res.status(404).json({ message: 'Struttura non trovata' });
      }
    }

    if (roleNeedsStructure(userRole)) {
      if (!requestedStructureId) {
        return res.status(400).json({ message: 'Per un gestore devi selezionare una struttura' });
      }
    }

    const existing = await pool.query(
      `
        SELECT id
        FROM dashboard_users
        WHERE email = $1
        LIMIT 1
      `,
      [email]
    );
    if (existing.rowCount) {
      return res.status(409).json({ message: 'Esiste gia un utente con questa email' });
    }

    const userId = `usr_${crypto.randomUUID()}`;
    const passwordHash = await hashPassword(payload.password);
    const fullName = `${payload.firstName} ${payload.lastName}`.trim();
    await pool.query(
      `
        INSERT INTO dashboard_users (
          id,
          email,
          name,
          first_name,
          last_name,
          facility_name,
          structure_id,
          password_hash,
          role,
          is_registered,
          invited_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, $10)
      `,
      [
        userId,
        email,
        fullName,
        payload.firstName,
        payload.lastName,
        roleCanHaveStructure(userRole) ? structure?.name || null : null,
        roleCanHaveStructure(userRole) ? requestedStructureId : null,
        passwordHash,
        userRole,
        req.authSession.user.id
      ]
    );

    const user = await fetchUserRow(userId);
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
});

router.post('/users/:userId/password-reset', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = passwordResetRequestSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const userId = String(req.params.userId || '').trim();
  if (!userId) {
    return res.status(400).json({ message: 'User non valido' });
  }

  try {
    const targetResult = await pool.query(
      `
        SELECT id, email, is_registered
        FROM dashboard_users
        WHERE id = $1
          AND deleted = 0
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

    const rawToken = createOpaqueToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = inviteExpiryDate();
    await pool.query(
      `
        INSERT INTO dashboard_password_resets (user_id, token_hash, requested_by, expires_at)
        VALUES ($1, $2, $3, $4)
      `,
      [target.id, tokenHash, req.authSession.user.id, expiresAt.toISOString()]
    );

    const origin = normalizedOrigin(parsed.data.origin);
    const resetLink = `${origin}/auth/complete-registration?token=${encodeURIComponent(rawToken)}&mode=reset`;
    await sendPasswordResetEmail({
      to: target.email,
      resetLink,
      requestedByEmail: req.authSession.user.email,
      expiresAt: expiresAt.toISOString()
    });

    return res.json({ sent: true, userId: target.id, email: target.email, expiresAt: expiresAt.toISOString() });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_MODULE_NOT_FOUND') {
      return res.status(500).json({ message: 'Nodemailer non installato. Esegui npm install nel backend.' });
    }

    return next(error);
  }
});

router.patch('/users/:userId/role', requireAuth, requireAdmin, async (req, res, next) => {
  return res.status(409).json({ message: 'Il ruolo utente non e modificabile dalla dashboard' });
});

router.patch('/users/:userId/access', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = userAccessUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const userId = String(req.params.userId || '').trim();
  if (!userId) {
    return res.status(400).json({ message: 'User non valido' });
  }

  const nextRole = parsed.data.role;
  const requestedStructureId = parsed.data.structureId || null;

  try {
    const userResult = await pool.query(
      `
        SELECT id, role
        FROM dashboard_users
        WHERE id = $1
          AND deleted = 0
        LIMIT 1
      `,
      [userId]
    );
    if (!userResult.rowCount) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const currentRole = userResult.rows[0].role;
    if (nextRole !== currentRole) {
      return res.status(409).json({ message: 'Il ruolo utente non e modificabile dalla dashboard' });
    }

    let structure = null;
    if (roleNeedsStructure(currentRole)) {
      if (!requestedStructureId) {
        return res.status(400).json({ message: 'Per un gestore devi selezionare una struttura' });
      }
      structure = await fetchStructureById(requestedStructureId);
      if (!structure) {
        return res.status(404).json({ message: 'Struttura non trovata' });
      }
    } else if (requestedStructureId) {
      return res.status(400).json({ message: 'Solo un gestore puo essere associato a una struttura' });
    }

    const targetStructureId = roleNeedsStructure(currentRole) ? requestedStructureId : null;
    const targetFacilityName = roleNeedsStructure(currentRole) ? structure?.name || null : null;

    const update = await pool.query(
      `
        UPDATE dashboard_users
        SET structure_id = $1,
            facility_name = $2,
            updated_at = NOW()
        WHERE id = $3
          AND deleted = 0
        RETURNING id
      `,
      [targetStructureId, targetFacilityName, userId]
    );

    if (!update.rowCount) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const user = await fetchUserRow(userId);
    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.patch('/users/:userId/structure', requireAuth, requireAdmin, async (req, res, next) => {
  const parsed = userStructureUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload non valido', errors: parsed.error.flatten() });
  }

  const userId = String(req.params.userId || '').trim();
  if (!userId) {
    return res.status(400).json({ message: 'User non valido' });
  }

  try {
    const userResult = await pool.query(
      `
        SELECT id, role
        FROM dashboard_users
        WHERE id = $1
          AND deleted = 0
        LIMIT 1
      `,
      [userId]
    );

    if (!userResult.rowCount) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const targetRole = userResult.rows[0].role;
    const structureId = parsed.data.structureId || null;
    const inviteCode = parsed.data.inviteCode || null;
    let structure = null;
    if (structureId) {
      structure = await fetchStructureById(structureId);
      if (!structure) {
        return res.status(404).json({ message: 'Struttura non trovata' });
      }
    } else if (inviteCode) {
      structure = await fetchStructureByInviteCode(inviteCode);
      if (!structure) {
        return res.status(404).json({ message: 'Codice struttura non valido' });
      }
    }

    const targetStructureId = structure?.id || null;

    if (targetRole === 'admin' && targetStructureId) {
      return res.status(400).json({ message: 'Un admin non puo essere associato a una struttura' });
    }
    if (targetRole === 'facility_manager' && !targetStructureId) {
      return res.status(400).json({ message: 'Per un gestore devi selezionare una struttura' });
    }

    await pool.query(
      `
        UPDATE dashboard_users
        SET structure_id = $1,
            facility_name = $2,
            updated_at = NOW()
        WHERE id = $3
          AND deleted = 0
      `,
      [targetStructureId, structure?.name || null, userId]
    );

    const user = await fetchUserRow(userId);
    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.delete('/users/:userId', requireAuth, requireAdmin, async (req, res, next) => {
  const userId = String(req.params.userId || '').trim();
  if (!userId) {
    return res.status(400).json({ message: 'User non valido' });
  }

  if (userId === req.authSession.user.id) {
    return res.status(400).json({ message: 'Non puoi eliminare il tuo account admin' });
  }

  try {
    const deleted = await pool.query(
      `
        UPDATE dashboard_users
        SET deleted = 1,
            updated_at = NOW()
        WHERE id = $1
          AND deleted = 0
        RETURNING id
      `,
      [userId]
    );
    if (!deleted.rowCount) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    await pool.query('DELETE FROM dashboard_sessions WHERE user_id = $1 OR impersonated_by_user_id = $1', [userId]);
    return res.json({ deleted: true, userId });
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
      [userId]
    );

    if (!targetResult.rowCount) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const target = targetResult.rows[0];
    if (!target.is_registered) {
      return res.status(409).json({ message: 'Utente non ancora registrato' });
    }
    if (target.role !== 'admin' && target.role !== 'facility_manager') {
      return res.status(409).json({ message: 'Utente non abilitato alla dashboard' });
    }

    await pool.query('DELETE FROM dashboard_sessions WHERE expires_at <= NOW()');
    await pool.query('DELETE FROM dashboard_sessions WHERE token_hash = $1', [req.authSession.tokenHash]);
    const session = await createImpersonatedSession(target.id, req.authSession.user.id);

    return res.json({
      token: session.token,
      expiresAt: session.expiresAt,
      user: {
        id: target.id,
        firstName: target.first_name || '',
        lastName: target.last_name || '',
        structureId: target.structure_id || null,
        structureName: target.structure_name || null,
        email: target.email,
        role: target.role
      },
      session: {
        isImpersonating: true,
        impersonatedBy: {
          id: req.authSession.user.id,
          firstName: req.authSession.user.firstName,
          lastName: req.authSession.user.lastName,
          structureId: req.authSession.user.structureId || null,
          structureName: req.authSession.user.structureName || null,
          email: req.authSession.user.email
        }
      }
    });
  } catch (error) {
    return next(error);
  }
});

export { router as adminRouter };


