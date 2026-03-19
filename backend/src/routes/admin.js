import crypto from 'crypto';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { env } from '../config/env.js';
import { requireAdmin, requireAuth } from '../auth/middleware.js';
import { createOpaqueToken, hashPassword, hashToken } from '../auth/security.js';
import { pool } from '../db/pool.js';
import { sendInvitationEmail, sendPasswordResetEmail } from '../services/mailer.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicRootDir = path.resolve(__dirname, '../../public');
const publicAudioRootDir = path.resolve(__dirname, '../../public/audio');
const publicImagesRootDir = path.resolve(__dirname, '../../public/images');
const dashboardRoleSchema = z.enum(['admin', 'facility_manager', 'user']);
const inviteRoleSchema = z.enum(['admin', 'facility_manager']);

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
  city: z.string().trim().min(1, 'Citta obbligatoria').max(120, 'Citta troppo lunga'),
  postalCode: z.string().trim().regex(/^\d{5}$/, 'CAP non valido (5 cifre)'),
  province: z.string().trim().max(80, 'Provincia troppo lunga').nullish(),
  country: z.string().trim().max(80, 'Nazione troppo lunga').nullish()
});

const structureUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Nome struttura obbligatorio').max(160, 'Nome struttura troppo lungo'),
  street: z.string().trim().min(1, 'Via obbligatoria').max(160, 'Via troppo lunga'),
  streetNumber: z.string().trim().min(1, 'Civico obbligatorio').max(20, 'Civico troppo lungo'),
  city: z.string().trim().min(1, 'Citta obbligatoria').max(120, 'Citta troppo lunga'),
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
  cityIds: z.array(z.string().trim().min(1, 'Citta non valida')).min(1, 'Seleziona almeno una citta'),
  code: structureInviteCodeSchema,
  userDiscountPercent: z.coerce.number().min(0, 'Sconto utente non valido').max(100, 'Sconto utente non valido'),
  structureFixedAmount: z.coerce.number().min(0, 'Importo struttura non valido').max(10000, 'Importo struttura non valido'),
  expiresAt: discountCodeExpiresAtSchema
});

const discountCodeUpdateSchema = z.object({
  applyTo: discountCodeApplyToSchema,
  cityIds: z.array(z.string().trim().min(1, 'Citta non valida')).min(1, 'Seleziona almeno una citta'),
  userDiscountPercent: z.coerce.number().min(0, 'Sconto utente non valido').max(100, 'Sconto utente non valido'),
  structureFixedAmount: z.coerce.number().min(0, 'Importo struttura non valido').max(10000, 'Importo struttura non valido'),
  expiresAt: discountCodeExpiresAtSchema
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
  structureId: z.string().trim().min(1).optional()
});

const discountCodesQuerySchema = z.object({
  structureId: z.string().trim().min(1).optional()
});

const catalogCitySchema = z.object({
  name: z.string().trim().min(1, 'Nome citta obbligatorio').max(120, 'Nome citta troppo lungo'),
  region: z.string().trim().min(1, 'Regione obbligatoria').max(120, 'Regione troppo lunga'),
  bundlePrice: z.coerce.number().min(0, 'Prezzo bundle non valido').max(10000, 'Prezzo bundle troppo alto'),
  heroImage: z.string().trim().min(1, 'Hero image obbligatoria').max(500, 'Hero image troppo lunga'),
  isDefault: z.boolean().optional().default(false)
});

const catalogPoiSchema = z.object({
  cityId: z.string().trim().min(1, 'Citta obbligatoria'),
  name: z.string().trim().min(1, 'Nome POI obbligatorio').max(180, 'Nome POI troppo lungo'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  category: z.string().trim().min(1, 'Categoria obbligatoria').max(120, 'Categoria troppo lunga'),
  descriptionShort: z.string().trim().min(1, 'Descrizione breve obbligatoria').max(1000, 'Descrizione breve troppo lunga'),
  descriptionLong: z.string().trim().min(1, 'Descrizione lunga obbligatoria').max(10000, 'Descrizione lunga troppo lunga'),
  imageUrl: z.string().trim().min(1, 'Immagine obbligatoria').max(500, 'URL immagine troppo lunga'),
  audioUrl: z.string().trim().max(500, 'URL audio troppo lungo').default(''),
  priceSingle: z.coerce.number().min(0, 'Prezzo singolo non valido').max(10000, 'Prezzo singolo troppo alto'),
  durationSec: z.coerce.number().int().min(1, 'Durata non valida').max(7200, 'Durata troppo lunga')
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
    lat: Number(row.lat),
    lng: Number(row.lng),
    category: sanitizeCatalogText(row.category),
    descriptionShort: sanitizeCatalogText(row.description_short),
    descriptionLong: sanitizeCatalogText(row.description_long),
    imageUrl: row.image_url,
    audioUrl: row.audio_url,
    priceSingle: Number(row.price_single),
    durationSec: Number(row.duration_sec)
  };
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

function debugPaymentUserProfile(userId) {
  return {
    customerId: userId,
    customerFirstName: 'Prova',
    customerLastName: 'Prova',
    customerBirthDate: '1900-01-01',
    customerEmail: 'prova.prova@example.com',
    customerPhone: '+39 000 000 0000',
    customerAddress: 'Via Prova 1, Citta Prova',
    paymentMethod: 'Carta di credito (simulato)',
    paymentProvider: 'Gateway test',
    paymentStatus: 'Completato (simulato)'
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
      LIMIT 1
    `,
    [structureId]
  );

  return result.rowCount ? result.rows[0] : null;
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
      LIMIT 1
    `,
    [inviteCode.toUpperCase()]
  );

  return result.rowCount ? result.rows[0] : null;
}

async function fetchCityById(cityId, client = pool) {
  const result = await client.query(
    `
      SELECT id, name, region, bundle_price, hero_image, is_default
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
        p.lat,
        p.lng,
        p.category,
        p.description_short,
        p.description_long,
        p.image_url,
        p.audio_url,
        p.price_single,
        p.duration_sec
      FROM pois p
      JOIN cities c ON c.id = p.city_id
      WHERE p.id = $1
      LIMIT 1
    `,
    [poiId]
  );
  return result.rowCount ? result.rows[0] : null;
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
      LEFT JOIN dashboard_structures s ON s.id = u.structure_id
      WHERE u.id = $1
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
              UNION
              SELECT l.user_id
              FROM app_user_structure_links l
              WHERE l.structure_id = s.id
              UNION
              SELECT p.user_id
              FROM purchases p
              WHERE p.structure_id = s.id
            ) linked_users
          ) AS users_count,
          (
            SELECT COALESCE(SUM(p.structure_earning_amount), 0)::NUMERIC
            FROM purchases p
            WHERE p.structure_id = s.id
          ) AS total_structure_earnings
        FROM dashboard_structures s
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
          UNION
          SELECT l.user_id
          FROM app_user_structure_links l
          WHERE l.structure_id = $1
          UNION
          SELECT p.user_id
          FROM purchases p
          WHERE p.structure_id = $1
        ) linked_users
      `,
      [structureId]
    );
    const earningsResult = await pool.query(
      `
        SELECT COALESCE(SUM(structure_earning_amount), 0)::NUMERIC AS total_structure_earnings
        FROM purchases
        WHERE structure_id = $1
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
          UNION
          SELECT l.user_id
          FROM app_user_structure_links l
          WHERE l.structure_id = $1
          UNION
          SELECT p.user_id
          FROM purchases p
          WHERE p.structure_id = $1
        ) linked_users
      `,
      [structureId]
    );
    const earningsResult = await pool.query(
      `
        SELECT COALESCE(SUM(structure_earning_amount), 0)::NUMERIC AS total_structure_earnings
        FROM purchases
        WHERE structure_id = $1
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
        JOIN dashboard_structures s ON s.id = dc.structure_id
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
    return res.status(400).json({ message: 'Seleziona almeno una citta' });
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
      return res.status(404).json({ message: 'Una o piu citta selezionate non esistono' });
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
    return res.status(400).json({ message: 'Seleziona almeno una citta' });
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
      return res.status(404).json({ message: 'Una o piu citta selezionate non esistono' });
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
        JOIN dashboard_structures s ON s.id = updated.structure_id
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
          LEFT JOIN dashboard_users inviter ON inviter.id = u.invited_by
          LEFT JOIN dashboard_structures s ON s.id = u.structure_id
        ),
        app_link_rows AS (
          SELECT
            l.user_id AS id,
            'Utente'::TEXT AS first_name,
            CONCAT('App ', LEFT(l.user_id, 8)) AS last_name,
            CONCAT('utente+', LEFT(l.user_id, 12), '@app.local') AS email,
            'user'::TEXT AS role,
            TRUE AS is_registered,
            l.associated_at AS created_at,
            l.updated_at AS updated_at,
            l.structure_id,
            s.name AS structure_name,
            s.address AS structure_address,
            l.invite_code AS structure_invite_code,
            NULL::TEXT AS invited_by_email,
            'app'::TEXT AS account_type
          FROM app_user_structure_links l
          JOIN dashboard_structures s ON s.id = l.structure_id
          LEFT JOIN dashboard_users u ON u.id = l.user_id
          WHERE u.id IS NULL
        ),
        app_purchase_rows AS (
          SELECT DISTINCT ON (p.user_id)
            p.user_id AS id,
            'Utente'::TEXT AS first_name,
            CONCAT('App ', LEFT(p.user_id, 8)) AS last_name,
            CONCAT('utente+', LEFT(p.user_id, 12), '@app.local') AS email,
            'user'::TEXT AS role,
            TRUE AS is_registered,
            p.purchased_at AS created_at,
            p.purchased_at AS updated_at,
            p.structure_id,
            s.name AS structure_name,
            s.address AS structure_address,
            p.invite_code AS structure_invite_code,
            NULL::TEXT AS invited_by_email,
            'app'::TEXT AS account_type
          FROM purchases p
          JOIN dashboard_structures s ON s.id = p.structure_id
          LEFT JOIN dashboard_users u ON u.id = p.user_id
          LEFT JOIN app_user_structure_links l ON l.user_id = p.user_id
          WHERE u.id IS NULL
            AND l.user_id IS NULL
            AND p.structure_id IS NOT NULL
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
        LEFT JOIN dashboard_structures s ON s.id = d.structure_id
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
        JOIN dashboard_structures s ON s.id = usp.structure_id
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

router.get('/payments', requireAuth, async (req, res, next) => {
  const role = req.authSession?.user?.role;
  if (!canViewPayments(role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const parsed = paymentsQuerySchema.safeParse({ structureId: String(req.query.structureId || '').trim() || undefined });
  if (!parsed.success) {
    return res.status(400).json({ message: 'Query non valida', errors: parsed.error.flatten() });
  }

  const managerStructureId = req.authSession?.user?.structureId || null;
  const requestedStructureId = parsed.data.structureId || null;
  const structureIdFilter = role === 'facility_manager' ? managerStructureId : requestedStructureId;

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
  let whereSql = '';
  if (structureIdFilter) {
    queryParams.push(structureIdFilter);
    whereSql = 'WHERE p.structure_id = $1';
  }

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
      const debugUser = debugPaymentUserProfile(row.user_id);

      return {
        id: Number(row.id),
        userId: row.user_id,
        ...debugUser,
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
        INSERT INTO cities (id, name, region, bundle_price, hero_image, is_default)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, region, bundle_price, hero_image, is_default
      `,
      [cityId, payload.name, payload.region, payload.bundlePrice, payload.heroImage, payload.isDefault]
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
    return res.status(400).json({ message: 'Citta non valida' });
  }

  const payload = parsed.data;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await fetchCityById(cityId, client);
    if (!existing) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Citta non trovata' });
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
            is_default = $5
        WHERE id = $6
        RETURNING id, name, region, bundle_price, hero_image, is_default
      `,
      [payload.name, payload.region, payload.bundlePrice, payload.heroImage, payload.isDefault, cityId]
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
    return res.status(400).json({ message: 'Citta non valida' });
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
      return res.status(404).json({ message: 'Citta non trovata' });
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
    return res.status(400).json({ message: 'Citta non valida' });
  }

  try {
    const city = await fetchCityById(cityId);
    if (!city) {
      return res.status(404).json({ message: 'Citta non trovata' });
    }

    const result = await pool.query(
      `
        SELECT
          p.id,
          p.city_id,
          c.name AS city_name,
          p.name,
          p.lat,
          p.lng,
          p.category,
          p.description_short,
          p.description_long,
          p.image_url,
          p.audio_url,
          p.price_single,
          p.duration_sec
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
      return res.status(404).json({ message: 'Citta non trovata' });
    }

    const poiId = `poi_${crypto.randomUUID()}`;
    const inserted = await pool.query(
      `
        INSERT INTO pois (
          id,
          city_id,
          name,
          lat,
          lng,
          category,
          description_short,
          description_long,
          image_url,
          audio_url,
          price_single,
          duration_sec
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
      `,
      [
        poiId,
        payload.cityId,
        payload.name,
        payload.lat,
        payload.lng,
        payload.category,
        payload.descriptionShort,
        payload.descriptionLong,
        payload.imageUrl,
        payload.audioUrl,
        payload.priceSingle,
        payload.durationSec
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
      return res.status(404).json({ message: 'Citta non trovata' });
    }

    const updated = await pool.query(
      `
        UPDATE pois
        SET city_id = $1,
            name = $2,
            lat = $3,
            lng = $4,
            category = $5,
            description_short = $6,
            description_long = $7,
            image_url = $8,
            audio_url = $9,
            price_single = $10,
            duration_sec = $11
        WHERE id = $12
        RETURNING id
      `,
      [
        payload.cityId,
        payload.name,
        payload.lat,
        payload.lng,
        payload.category,
        payload.descriptionShort,
        payload.descriptionLong,
        payload.imageUrl,
        payload.audioUrl,
        payload.priceSingle,
        payload.durationSec,
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
      return res.status(404).json({ message: 'Citta non trovata' });
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
      return res.status(404).json({ message: 'Citta non trovata' });
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
    const deleted = await pool.query('DELETE FROM dashboard_users WHERE id = $1 RETURNING id', [userId]);
    if (!deleted.rowCount) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

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
        LEFT JOIN dashboard_structures s ON s.id = u.structure_id
        WHERE u.id = $1
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


