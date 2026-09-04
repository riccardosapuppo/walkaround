import crypto from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream/promises';
import { fileURLToPath } from 'url';
import express from 'express';
import { z } from 'zod';
import { resolveAppSessionUser } from '../auth/app-middleware.js';
import { resolveSessionUser } from '../auth/middleware.js';
import { pool, queryWithRetry } from '../db/pool.js';
import { resolvePublicAudioUrl } from '../media/paths.js';
import { notifyPartnerRegistrationRequest, notifyPaymentCompleted } from '../services/admin-notifications.js';
import {
  PayPalConfigurationError,
  getPayPalSettings,
  paypalApiRequest,
  paypalProviderLabel,
  requestPayPalAccessToken
} from '../services/paypal.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicRootDir = path.resolve(__dirname, '../../public');
const publicAudioRootDir = path.join(publicRootDir, 'audio');
/**
 * Le anteprime NON stanno sotto `public/`, e la ragione e' una falla.
 *
 * Ci stavano. `public/` lo serve `express.static` per intero, e il blocco che
 * difende l'audio a pagamento guarda `public/audio/`: una cartella sorella
 * chiamata `public/audio-previews/` non la copriva nessuno. Bastava che il
 * ritaglio venisse lungo quanto il file — e piu' sotto si vede che era facile
 * — perche' la traccia intera diventasse scaricabile da chiunque, senza
 * sessione e senza acquisto, dalla porta accanto a quella sorvegliata.
 *
 * La rotta che le serve usa `res.sendFile`: legge dal disco e non ha mai
 * avuto bisogno che il file fosse raggiungibile via URL. Quindi non lo e'
 * piu'. E' il tipo di correzione che toglie la domanda invece di aggiungere
 * un controllo: qui sotto non c'e' niente da difendere perche' non c'e'
 * nessuna porta.
 *
 * `var/` e' materiale rigenerabile: si puo' cancellare a macchina spenta.
 */
const audioPreviewRootDir = path.resolve(__dirname, '../../var/audio-previews');
const audioPreviewSeconds = 30;

/**
 * Quanta parte del file l'anteprima puo' arrivare a essere, al massimo.
 *
 * Serve un tetto che non dipenda dai dati: `duration_sec` la scrive
 * l'amministratore e lo schema accetta 1. Con una durata di 1 secondo la
 * proporzione 30/1 veniva schiacciata a 1, e l'anteprima diventava una copia
 * integrale del file — cioe' il prodotto, gratis. Non serviva malafede: una
 * traccia corta, o un numero sbagliato a mano, e il paywall spariva per quel
 * luogo.
 *
 * Con il tetto, qualunque cosa dica il dato, quello che esce e' un pezzo.
 */
const anteprimaFrazioneMassima = 0.5;
const privacyPolicyLanguages = ['it', 'en', 'fr', 'es', 'de', 'pl'];
const legalDocumentTypes = ['privacyPolicy', 'cookiePolicy', 'termsConditions'];
const legalDocumentDbTypes = {
  cookiePolicy: 'cookie_policy',
  termsConditions: 'terms_conditions'
};
const audioLanguages = ['it', 'en', 'fr', 'es', 'de', 'pl'];
const privacyPolicyQuerySchema = z.object({
  language: z.enum(privacyPolicyLanguages).optional().default('it')
});
const legalDocumentParamsSchema = z.object({
  documentType: z.enum(legalDocumentTypes)
});

/**
 * Questo `userId` puo' chiederlo chi sta chiamando?
 *
 * ================================================================
 * IL DIFETTO
 * ================================================================
 *
 * Sei rotte prendevano lo `userId` dalla query o dal corpo e non guardavano
 * niente altro — fra queste `DELETE /me/purchases`, che cancella gli acquisti
 * di chiunque il chiamante nomini. Il controllo giusto esisteva gia', si
 * chiamava `requireCheckoutAppUser` e stava su due rotte di pagamento: il
 * nome diceva "checkout", e cosi' nessuno l'ha messo altrove.
 *
 * ================================================================
 * PERCHE' NON BASTA PRETENDERE UNA SESSIONE
 * ================================================================
 *
 * Qui dentro convivono due specie di identita', e non e' un difetto:
 *
 *   - CHI HA UN ACCOUNT. `userId` e' la chiave in `app_users`, e la prova di
 *     esserlo e' il token in `app_sessions`.
 *   - L'OSPITE. Il browser si genera un uuid al primo avvio e se lo tiene:
 *     e' l'unica cosa che ha. Chi arriva scansionando il QR di un albergo
 *     atterra su `/welcome`, e la prima cosa che l'applicazione fa e'
 *     chiedere se quel codice sconto vale — molto prima che esista un
 *     account, e per l'albergo quel momento e' tutto il modello di business.
 *
 * La prima versione di questo controllo pretendeva la sessione sempre, e
 * quindi spegneva il secondo caso: il QR del partner smetteva di funzionare.
 * Chiudere una porta rompe chi ci passava, e chi ci passava andava guardato
 * prima di chiuderla.
 *
 * ================================================================
 * LA REGOLA
 * ================================================================
 *
 *   sessione presente, e parla di se'      -> passa
 *   sessione presente, e parla di un altro -> 403
 *   nessuna sessione, e lo userId E' di    -> 401: quell'identita' appartiene
 *     un account registrato                        a qualcuno, e ha un token
 *   nessuna sessione, e non e' di nessuno  -> passa: e' un ospite
 *
 * Cioe': **non si puo' indossare un account senza il suo token**, che era
 * tutto il difetto. L'uuid dell'ospite resta autodichiarato, come e' sempre
 * stato: non c'e' niente da rubargli che non sia gia' suo, e l'unico modo di
 * cambiarlo sarebbe obbligare tutti a registrarsi prima di vedere un prezzo.
 *
 * Resta vero che quell'uuid non deve girare dove si scrive: viaggiava nelle
 * query string e finiva nel log di accesso, e la parte di query e' stata
 * tolta dal log (`server.js`).
 */
async function requireAppUser(req, userId) {
  const session = await resolveAppSessionUser(req);

  if (session) {
    if (session.user.id === userId) {
      return session.user;
    }
    const error = new Error('Sessione utente non valida per questa richiesta.');
    error.status = 403;
    throw error;
  }

  const registrato = await queryWithRetry('SELECT 1 FROM app_users WHERE id = $1 LIMIT 1', [userId], {
    label: 'app user lookup'
  });

  if (registrato.rowCount > 0) {
    const error = new Error('Accedi per continuare.');
    error.status = 401;
    throw error;
  }

  return null;
}

/**
 * Come sopra, ma risponde invece di sollevare.
 *
 * Serve perche' le rotte qui sotto hanno `catch` scritti in modi diversi:
 * alcuni guardano `error.status`, altri passano tutto a `next()`. Un
 * controllo di autorizzazione che dipende da come e' scritto il catch della
 * rotta e' un controllo che prima o poi diventa un 500 con dentro la risposta
 * giusta, o peggio.
 *
 * NON INGOIA GLI ALTRI ERRORI. Se il database non risponde, `requireAppUser`
 * solleva qualcosa che non ha `status`: quello si rilancia e diventa il 500
 * che e'. La prima versione rispondeva 401 a tutto — cioe' diceva "non sei
 * autorizzato" a chi lo era, gli faceva buttare la sessione, e ci infilava
 * dentro il messaggio interno di Postgres.
 *
 * @returns {Promise<boolean>} vero se ha gia' risposto e il chiamante deve fermarsi
 */
async function haRispostoPerchiNonAutorizzato(req, res, userId) {
  try {
    await requireAppUser(req, userId);
    return false;
  } catch (error) {
    if (!error?.status) {
      throw error;
    }
    res.status(error.status).json({ message: error.message || 'Non autorizzato.' });
    return true;
  }
}

function sanitizeText(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return value;
  }

  let text = value
    .replace(/Ã /g, '\u00E0')
    .replace(/Ã¨/g, '\u00E8')
    .replace(/Ã©/g, '\u00E9')
    .replace(/Ã¬/g, '\u00EC')
    .replace(/Ã²/g, '\u00F2')
    .replace(/Ã¹/g, '\u00F9')
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€\u009D/g, '"')
    .replace(/â€”/g, '-')
    .replace(/â€“/g, '-');

  if (!text.includes('\uFFFD')) {
    return text;
  }

  // Fix common elisions and contractions first.
  text = text
    .replace(/([A-Za-zÀ-ÿ])\uFFFD(?=[A-Za-zÀ-ÿ])/g, "$1'")
    .replace(/\b\uFFFD(?=[A-Za-zÀ-ÿ])/g, "'");

  const replacements = [
    ['citt\uFFFD', 'citt\u00E0'],
    ['pi\uFFFD', 'pi\u00F9'],
    ['Pi\uFFFD', 'Pi\u00F9'],
    ['per\uFFFD', 'per\u00F2'],
    ['bens\uFFFD', 'bens\u00EC'],
    ['cos\uFFFD', 'cos\u00EC'],
    ['ci\uFFFD', 'ci\u00F2'],
    ['gi\uFFFD', 'gi\u00E0'],
    ['pu\uFFFD', 'pu\u00F2'],
    ['s\uFFFD', 's\u00EC'],
    ['l\uFFFD', 'l\u00EC'],
    ['caff\uFFFD', 'caff\u00E8'],
    ['Caff\uFFFD', 'Caff\u00E8'],
    ['sub\uFFFD', 'sub\u00EC'],
    ['contribu\uFFFD', 'contribu\u00EC'],
    ['colp\uFFFD', 'colp\u00EC'],
    ['fior\uFFFD', 'fior\u00EC'],
    ['battezz\uFFFD', 'battezz\u00F2'],
    ['catalog\uFFFD', 'catalog\u00F2'],
    ['celebr\uFFFD', 'celebr\u00F2'],
    ['confront\uFFFD', 'confront\u00F2'],
    ['cur\uFFFD', 'cur\u00F2'],
    ['entr\uFFFD', 'entr\u00F2'],
    ['inizi\uFFFD', 'inizi\u00F2'],
    ['lasci\uFFFD', 'lasci\u00F2'],
    ['limit\uFFFD', 'limit\u00F2'],
    ['riconquist\uFFFD', 'riconquist\u00F2'],
    ['ridisegn\uFFFD', 'ridisegn\u00F2'],
    ['rivoluzion\uFFFD', 'rivoluzion\u00F2'],
    ['soggiorn\uFFFD', 'soggiorn\u00F2'],
    ['studi\uFFFD', 'studi\u00F2'],
    ['torn\uFFFD', 'torn\u00F2'],
    ['trasform\uFFFD', 'trasform\u00F2'],
    ['Mundi\uFFFD', 'Mundi'],
    ['Dionisio\uFFFD', 'Dionisio'],
    ['Maniace\uFFFD', 'Maniace'],
    ['Annunciata\uFFFD', 'Annunciata'],
    ['Vermexio\uFFFD', 'Vermexio'],
    ['cavalleresche\uFFFD', 'cavalleresche'],
    ['acustico\uFFFD', 'acustico'],
    ['S\uFFFD', 'S']
  ];

  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }

  text = text
    .replace(/([A-Za-zÀ-ÿ]+)it\uFFFD(?=[^A-Za-zÀ-ÿ]|$)/g, '$1it\u00E0')
    .replace(/([A-Za-zÀ-ÿ]+)et\uFFFD(?=[^A-Za-zÀ-ÿ]|$)/g, '$1et\u00E0')
    .replace(/([A-Za-zÀ-ÿ]+)t\uFFFD(?=[^A-Za-zÀ-ÿ]|$)/g, '$1t\u00E0')
    .replace(/\s\uFFFD\s/g, ' \u00E8 ')
    .replace(/\uFFFD/g, "'");

  return text;
}

function encodeUrlPathPart(value) {
  return encodeURIComponent(String(value || '').trim());
}

function buildProtectedPoiAudioUrl(poiId) {
  return `/api/pois/${encodeUrlPathPart(poiId)}/audio`;
}

function buildPoiPreviewAudioUrl(poiId) {
  return `/api/pois/${encodeUrlPathPart(poiId)}/audio-preview`;
}

function mapCity(row) {
  return {
    id: row.id,
    name: sanitizeText(row.name),
    region: sanitizeText(row.region),
    bundlePrice: Number(row.bundle_price),
    heroImage: row.hero_image,
    isDefault: row.is_default,
    translations: sanitizeCityTranslations(row.translations)
  };
}

function mapPoi(row) {
  return {
    id: row.id,
    cityId: row.city_id,
    name: sanitizeText(row.name),
    address: sanitizeText(row.address),
    lat: Number(row.lat),
    lng: Number(row.lng),
    category: sanitizeText(row.category),
    descriptionShort: sanitizeText(row.description_short),
    descriptionLong: sanitizeText(row.description_long),
    imageUrl: row.image_url,
    audioUrl: buildProtectedPoiAudioUrl(row.id),
    previewAudioUrl: buildPoiPreviewAudioUrl(row.id),
    priceSingle: Number(row.price_single),
    durationSec: row.duration_sec,
    translations: sanitizePoiTranslations(row.translations)
  };
}

function mapPoiListItem(row) {
  return {
    id: row.id,
    cityId: row.city_id,
    name: sanitizeText(row.name),
    address: sanitizeText(row.address),
    lat: Number(row.lat),
    lng: Number(row.lng),
    category: sanitizeText(row.category),
    descriptionShort: sanitizeText(row.description_short),
    descriptionLong: '',
    imageUrl: row.image_url,
    audioUrl: buildProtectedPoiAudioUrl(row.id),
    previewAudioUrl: buildPoiPreviewAudioUrl(row.id),
    priceSingle: Number(row.price_single),
    durationSec: row.duration_sec,
    translations: sanitizePoiListTranslations(row.translations)
  };
}

function sanitizeCityTranslations(_value) {
  return {};
}

function sanitizePoiTranslations(value) {
  return sanitizeTranslations(value, ['descriptionShort', 'descriptionLong']);
}

function sanitizePoiListTranslations(value) {
  return sanitizeTranslations(value, ['descriptionShort']);
}

function sanitizeTranslations(value, allowedFields) {
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
      const normalizedValue = typeof rawValue === 'string' ? sanitizeText(rawValue.trim()) : '';
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

function normalizeAudioLanguage(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return audioLanguages.includes(normalized) ? normalized : 'it';
}

function selectPoiAudioUrl(row, language) {
  const normalizedLanguage = normalizeAudioLanguage(language);
  if (normalizedLanguage !== 'it' && row?.translations && typeof row.translations === 'object' && !Array.isArray(row.translations)) {
    const translatedAudioUrl = String(row.translations?.[normalizedLanguage]?.audioUrl || '').trim();
    if (translatedAudioUrl) {
      return translatedAudioUrl;
    }
  }

  return String(row?.audio_url || '').trim();
}

/* La copia locale di `isInsideDirectory` e quella di questa funzione stavano
   qui e, identiche, anche in `admin.js`. Ora stanno in `media/paths.js`, che
   e' anche dove le usa il blocco dell'audio in `server.js`: tre punti che
   devono rispondere la stessa cosa sullo stesso percorso, e che rispondevano
   la stessa cosa solo finche' nessuno correggeva una copia sola. */
function resolveLocalPublicAudioPath(audioUrl) {
  return resolvePublicAudioUrl(publicAudioRootDir, audioUrl);
}

function contentTypeForAudioPath(audioPath) {
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

function safePreviewFilePart(value) {
  return String(value || 'audio')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'audio';
}

async function fetchPublishedPoiAudioSource(poiId, language) {
  const result = await queryWithRetry(
    `
      SELECT
        p.id,
        p.city_id,
        p.audio_url,
        p.duration_sec,
        p.translations
      FROM pois p
      JOIN cities c ON c.id = p.city_id
      WHERE p.id = $1
        AND p.publication_status = 'published'
        AND c.publication_status = 'published'
      LIMIT 1
    `,
    [poiId],
    { label: 'public poi audio source' }
  );

  if (!result.rowCount) {
    return null;
  }

  const row = result.rows[0];
  const audioUrl = selectPoiAudioUrl(row, language);
  const audioPath = resolveLocalPublicAudioPath(audioUrl);
  if (!audioPath) {
    return {
      ...row,
      audioUrl,
      audioPath: null
    };
  }

  return {
    ...row,
    audioUrl,
    audioPath
  };
}

async function ensureAudioPreviewFile({ poiId, language, sourcePath, durationSec }) {
  const sourceStat = await fs.stat(sourcePath);
  if (!sourceStat.isFile() || sourceStat.size <= 0) {
    const error = new Error('Audio source unavailable');
    error.status = 404;
    throw error;
  }

  await fs.mkdir(audioPreviewRootDir, { recursive: true });
  const duration = Number(durationSec);
  /* Il tetto entra nell'impronta apposta. Le anteprime gia' ritagliate col
     vecchio calcolo stanno ancora su disco, e alcune sono copie integrali:
     senza cambiare il nome del file, questa funzione le ritroverebbe e le
     servirebbe per sempre, perche' la prima cosa che fa e' guardare se
     esistono gia'. Cambiare il calcolo senza cambiare l'impronta correggerebbe
     solo le anteprime future. */
  const sourceHash = crypto
    .createHash('sha1')
    .update(
      `${sourcePath}:${sourceStat.size}:${sourceStat.mtimeMs}:${duration || 0}:${audioPreviewSeconds}:${anteprimaFrazioneMassima}`
    )
    .digest('hex')
    .slice(0, 16);
  const extension = path.extname(sourcePath).toLowerCase() || '.mp3';
  const previewFileName = `${safePreviewFilePart(poiId)}-${safePreviewFilePart(language)}-${sourceHash}${extension}`;
  const previewPath = path.join(audioPreviewRootDir, previewFileName);

  try {
    const existing = await fs.stat(previewPath);
    if (existing.isFile() && existing.size > 0) {
      return previewPath;
    }
  } catch {
    // Preview is generated on demand.
  }

  /* La proporzione fra i trenta secondi e la durata dichiarata, con due
     protezioni. Una durata assente o assurda non vale 1 — cioe' "tutto" — ma
     il tetto; e il tetto vince comunque, anche quando la durata e' scritta
     bene ma la traccia e' corta. Il 1.15 e' il margine che serve perche' un
     mp3 non ha un bitrate perfettamente costante e il taglio va a byte. */
  const proporzione =
    Number.isFinite(duration) && duration > 0
      ? Math.min(audioPreviewSeconds / duration, anteprimaFrazioneMassima)
      : anteprimaFrazioneMassima;

  const tetto = Math.floor(sourceStat.size * anteprimaFrazioneMassima);
  const voluti = Math.max(96 * 1024, Math.ceil(sourceStat.size * proporzione * 1.15));
  const targetBytes = Math.max(1, Math.min(voluti, tetto));
  const tempPreviewPath = `${previewPath}.${process.pid}.${Date.now()}.tmp`;

  await pipeline(
    createReadStream(sourcePath, { start: 0, end: Math.max(0, targetBytes - 1) }),
    createWriteStream(tempPreviewPath)
  );

  try {
    await fs.rename(tempPreviewPath, previewPath);
  } catch (error) {
    await fs.rm(tempPreviewPath, { force: true }).catch(() => {});
    try {
      const existing = await fs.stat(previewPath);
      if (existing.isFile() && existing.size > 0) {
        return previewPath;
      }
    } catch {
      // Preserve the original error below.
    }
    throw error;
  }

  return previewPath;
}

async function resolveAudioAppSessionUser(req) {
  const headerSession = await resolveAppSessionUser(req);
  if (headerSession) {
    return headerSession;
  }

  const accessToken = String(req.query.access_token || req.query.token || '').trim();
  if (!accessToken) {
    return null;
  }

  return resolveAppSessionUser({
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });
}

async function resolveAudioDashboardSession(req) {
  const headerSession = await resolveSessionUser(req);
  if (headerSession) {
    return headerSession;
  }

  const accessToken = String(req.query.admin_token || '').trim();
  if (!accessToken) {
    return null;
  }

  return resolveSessionUser({
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });
}

async function userCanAccessPoiAudio(userId, poiId, cityId) {
  const result = await queryWithRetry(
    `
      SELECT purchased_at
      FROM purchases
      WHERE user_id = $1
        AND (
          (type = 'single' AND poi_id = $2)
          OR (type = 'bundle' AND city_id = $3)
        )
      ORDER BY purchased_at DESC, id DESC
      LIMIT 1
    `,
    [userId, poiId, cityId],
    { label: 'poi audio purchase check' }
  );

  return result.rows.some((row) => isPurchaseStillActive(row.purchased_at));
}

function sanitizePrivacyPolicyTranslations(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const sanitized = {};
  privacyPolicyLanguages.forEach((language) => {
    const html = stripUnsafePrivacyHtml(value?.[language]);
    if (html) {
      sanitized[language] = html;
    }
  });
  return sanitized;
}

function stripUnsafePrivacyHtml(value) {
  return String(value || '')
    .trim()
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|base)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|base)[^>]*\/?\s*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, '')
    .replace(/\s+(href|src)\s*=\s*"javascript:[^"]*"/gi, ' $1="#"')
    .replace(/\s+(href|src)\s*=\s*'javascript:[^']*'/gi, " $1='#'")
    .replace(/\s+(href|src)\s*=\s*javascript:[^\s>]+/gi, ' $1="#"');
}

function selectLegalDocumentTranslation(translations, requestedLanguage) {
  const fallbackLanguage = translations[requestedLanguage]
    ? requestedLanguage
    : translations.it
    ? 'it'
    : privacyPolicyLanguages.find((language) => translations[language]) || requestedLanguage;

  return {
    language: fallbackLanguage,
    contentHtml: translations[fallbackLanguage] || ''
  };
}

const purchaseSchema = z.discriminatedUnion('type', [
  z.object({
    userId: z.string().min(2),
    type: z.literal('bundle'),
    cityId: z.string().min(2),
    ignoreDiscountCode: z.boolean().optional()
  }),
  z.object({
    userId: z.string().min(2),
    type: z.literal('single'),
    poiId: z.string().min(2),
    ignoreDiscountCode: z.boolean().optional()
  })
]);

const paypalCheckoutSchema = z.discriminatedUnion('checkoutContext', [
  z.object({
    userId: z.string().min(2),
    checkoutContext: z.literal('bundle'),
    cityId: z.string().min(2),
    ignoreDiscountCode: z.boolean().optional()
  }),
  z.object({
    userId: z.string().min(2),
    checkoutContext: z.literal('single'),
    poiId: z.string().min(2),
    ignoreDiscountCode: z.boolean().optional()
  }),
  z.object({
    userId: z.string().min(2),
    checkoutContext: z.literal('cart'),
    poiIds: z.array(z.string().min(2)).min(1),
    ignoreDiscountCode: z.boolean().optional()
  })
]);

const paypalCaptureSchema = z.object({
  orderId: z.string().min(2),
  userId: z.string().min(2)
});

const unlockValidateSchema = z.discriminatedUnion('type', [
  z.object({
    code: z.string().min(1),
    userId: z.string().min(2),
    type: z.literal('bundle'),
    cityId: z.string().min(2)
  }),
  z.object({
    code: z.string().min(1),
    userId: z.string().min(2),
    type: z.literal('single'),
    poiId: z.string().min(2)
  })
]);

function getDailyUnlockCode(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome',
    day: '2-digit',
    month: '2-digit'
  }).formatToParts(now);

  const day = parts.find((part) => part.type === 'day')?.value || '01';
  const month = parts.find((part) => part.type === 'month')?.value || '01';

  return `tour${day}${month}`;
}

function roundMoney(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.round(numeric * 100) / 100;
}

function toIsoDateOrNull(value) {
  if (!value) {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

function purchaseExpiresAt() {
  return null;
}

function isPurchaseStillActive(purchasedAt) {
  return Boolean(toIsoDateOrNull(purchasedAt));
}

function clamp(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return min;
  }
  return Math.max(min, Math.min(max, numeric));
}

function normalizeInviteCode(value) {
  return String(value || '')
    .trim()
    .toUpperCase();
}

function normalizeDiscountApplyTo(value) {
  if (value === 'single' || value === 'bundle') {
    return value;
  }
  return null;
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

function discountCodeCityIds(row) {
  const normalizedArray = normalizeTextArray(row.city_ids);
  if (normalizedArray.length) {
    return normalizedArray;
  }
  const legacyCityId = String(row.city_id || '').trim();
  return legacyCityId ? [legacyCityId] : [];
}

function discountCodeCityNames(row) {
  const normalizedArray = normalizeTextArray(row.city_names);
  if (normalizedArray.length) {
    return normalizedArray;
  }
  const legacyCityName = String(row.city_name || '').trim();
  return legacyCityName ? [legacyCityName] : [];
}

function isDiscountCodeApplicableToTarget(row, purchaseType, targetCityId) {
  const applyTo = normalizeDiscountApplyTo(row.apply_to);
  if (applyTo && applyTo !== purchaseType) {
    return false;
  }

  const codeCityIds = discountCodeCityIds(row);
  if (codeCityIds.length && !codeCityIds.includes(String(targetCityId || '').trim())) {
    return false;
  }

  return true;
}

function resolveStructureDiscountValues(row, purchaseType) {
  const isBundle = purchaseType === 'bundle';
  const percentRaw = isBundle ? row.user_discount_percent_bundle : row.user_discount_percent_single;
  const fixedRaw = isBundle ? row.structure_fixed_amount_bundle : row.structure_fixed_amount_single;

  return {
    userDiscountPercent: clamp(percentRaw ?? row.user_discount_percent, 0, 100),
    structureFixedAmount: Math.max(0, roundMoney(fixedRaw ?? row.structure_fixed_amount))
  };
}

async function fetchUserStructurePricingContext(userId, purchaseType, targetCityId, client) {
  const result = await client.query(
    `
    SELECT
      l.structure_id,
      l.invite_code,
      dc.id AS discount_code_id,
      dc.code AS discount_code,
      dc.apply_to,
      dc.city_id,
      dc.city_name,
      dc.city_ids,
      dc.city_names,
      dc.user_discount_percent,
      dc.user_discount_percent_single,
      dc.user_discount_percent_bundle,
      dc.structure_fixed_amount,
      dc.structure_fixed_amount_single,
      dc.structure_fixed_amount_bundle
    FROM app_user_structure_links l
    LEFT JOIN LATERAL (
      SELECT
        d.id,
        d.code,
        d.apply_to,
        d.city_id,
        legacy_city.name AS city_name,
        COALESCE(city_links.city_ids, CASE WHEN legacy_city.id IS NOT NULL THEN ARRAY[d.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
        COALESCE(city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
        d.user_discount_percent,
        d.user_discount_percent_single,
        d.user_discount_percent_bundle,
        d.structure_fixed_amount,
        d.structure_fixed_amount_single,
        d.structure_fixed_amount_bundle,
        d.updated_at
      FROM dashboard_structure_discount_codes d
      LEFT JOIN cities legacy_city ON legacy_city.id = d.city_id AND legacy_city.publication_status = 'published'
      LEFT JOIN LATERAL (
        SELECT
          ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
          ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
        FROM dashboard_structure_discount_code_cities dcc
        JOIN cities c ON c.id = dcc.city_id AND c.publication_status = 'published'
        WHERE dcc.discount_code_id = d.id
      ) city_links ON TRUE
      WHERE (
        (l.discount_code_id IS NOT NULL AND d.id = l.discount_code_id)
        OR (l.discount_code_id IS NULL AND UPPER(d.code) = UPPER(l.invite_code))
      )
        AND d.expires_at > NOW()
      ORDER BY
        CASE WHEN l.discount_code_id IS NOT NULL AND d.id = l.discount_code_id THEN 0 ELSE 1 END,
        d.updated_at DESC,
        d.id DESC
      LIMIT 1
    ) dc ON TRUE
    WHERE l.user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  if (!result.rowCount) {
    return null;
  }

  const row = result.rows[0];
  if (!row.discount_code) {
    return null;
  }
  if (!isDiscountCodeApplicableToTarget(row, purchaseType, targetCityId)) {
    return null;
  }

  const inviteCode = normalizeInviteCode(row.discount_code || row.invite_code);
  if (!inviteCode) {
    return null;
  }

  const alreadyUsed = await client.query(
    `
    SELECT 1
    FROM app_user_discount_code_uses
    WHERE user_id = $1
      AND invite_code = $2
    LIMIT 1
    `,
    [userId, inviteCode]
  );
  if (alreadyUsed.rowCount) {
    return null;
  }

  const discountValues = resolveStructureDiscountValues(row, purchaseType);

  return {
    discountCodeId: row.discount_code_id ? Number(row.discount_code_id) : null,
    structureId: row.structure_id,
    applyTo: normalizeDiscountApplyTo(row.apply_to),
    cityId: discountCodeCityIds(row)[0] || null,
    cityName: discountCodeCityNames(row)[0] || null,
    cityIds: discountCodeCityIds(row),
    cityNames: discountCodeCityNames(row),
    inviteCode,
    userDiscountPercent: discountValues.userDiscountPercent,
    structureFixedAmount: discountValues.structureFixedAmount
  };
}

async function reserveDiscountCodeUsage(userId, purchaseType, structureContext, client) {
  if (!structureContext?.inviteCode) {
    return null;
  }

  const inviteCode = normalizeInviteCode(structureContext.inviteCode);
  if (!inviteCode) {
    return null;
  }

  const reserve = await client.query(
    `
    INSERT INTO app_user_discount_code_uses (
      user_id,
      discount_code_id,
      structure_id,
      invite_code,
      purchase_type,
      used_at
    )
    VALUES ($1, $2, $3, $4, $5, NOW())
    ON CONFLICT (user_id, invite_code) DO NOTHING
    RETURNING id
    `,
    [userId, structureContext.discountCodeId || null, structureContext.structureId || null, inviteCode, purchaseType]
  );

  if (!reserve.rowCount) {
    return null;
  }

  return {
    ...structureContext,
    inviteCode
  };
}

function buildPurchasePricing(baseAmountRaw, structureContext) {
  const baseAmount = Math.max(0, roundMoney(baseAmountRaw));
  const discountPercent = structureContext ? clamp(structureContext.userDiscountPercent, 0, 100) : 0;
  const discountAmount = roundMoney((baseAmount * discountPercent) / 100);
  const finalAmount = Math.max(0, roundMoney(baseAmount - discountAmount));
  const structureFixedAmount = structureContext ? Math.max(0, roundMoney(structureContext.structureFixedAmount)) : 0;
  const structureEarningAmount = structureContext ? structureFixedAmount : 0;

  return {
    baseAmount,
    discountPercent,
    discountAmount,
    finalAmount,
    structureFixedAmount,
    structureEarningAmount
  };
}

function createHttpError(status, message, details = null) {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  return error;
}

function moneyToString(value) {
  return roundMoney(value).toFixed(2);
}

function purchaseRowToResponse(row) {
  return {
    purchased: true,
    alreadyPurchased: false,
    type: row.type,
    cityId: row.city_id || null,
    cityName: row.city_name || null,
    poiId: row.poi_id || null,
    poiName: row.poi_name || null,
    amount: Number(row.amount || 0),
    baseAmount: Number(row.base_amount || row.amount || 0),
    discountPercent: Number(row.discount_percent || 0),
    discountAmount: Number(row.discount_amount || 0),
    finalAmount: Number(row.final_amount || row.amount || 0),
    structureId: row.structure_id || null,
    inviteCode: row.invite_code || null,
    structureFixedAmount: Number(row.structure_fixed_amount || 0),
    structureEarningAmount: Number(row.structure_earning_amount || 0),
    paymentMethod: row.payment_method || null,
    paymentProvider: row.payment_provider || null,
    paymentStatus: row.payment_status || null,
    paymentOrderId: row.payment_order_id || null,
    purchasedAt: toIsoDateOrNull(row.purchased_at),
    expiresAt: toIsoDateOrNull(purchaseExpiresAt(row.purchased_at))
  };
}

function buildPayerAddressText(payer) {
  const parts = [];
  const address = payer?.address;
  if (address?.address_line_1) {
    parts.push(String(address.address_line_1).trim());
  }
  if (address?.address_line_2) {
    parts.push(String(address.address_line_2).trim());
  }
  const localityParts = [address?.admin_area_2, address?.admin_area_1, address?.postal_code]
    .map((value) => String(value || '').trim())
    .filter(Boolean);
  if (localityParts.length) {
    parts.push(localityParts.join(' '));
  }
  if (address?.country_code) {
    parts.push(String(address.country_code).trim());
  }
  return parts.join(', ') || null;
}

function extractPayPalPayer(payload) {
  const payer = payload?.payer || {};
  const purchaseUnit = Array.isArray(payload?.purchase_units) ? payload.purchase_units[0] : null;
  const shipping = purchaseUnit?.shipping || {};

  return {
    payerEmail: String(payer.email_address || '').trim() || null,
    payerId: String(payer.payer_id || '').trim() || null,
    payerFirstName:
      String(payer.name?.given_name || shipping.name?.full_name || '').trim().split(/\s+/).filter(Boolean)[0] || null,
    payerLastName: String(payer.name?.surname || '').trim() || null,
    payerCountryCode: String(payer.address?.country_code || '').trim() || null,
    payerPhone: String(payer.phone?.phone_number?.national_number || '').trim() || null,
    payerAddress: buildPayerAddressText(payer) || buildPayerAddressText({ address: shipping.address })
  };
}

async function markExpiredPayPalOrders(client) {
  await client.query(
    `
      UPDATE paypal_checkout_orders
      SET status = 'expired',
          updated_at = NOW()
      WHERE status IN ('created', 'approved')
        AND expires_at IS NOT NULL
        AND expires_at <= NOW()
    `
  );
}

async function buildPayPalCheckoutPreview(payload, client) {
  const ignoreDiscountCode = Boolean(payload.ignoreDiscountCode);

  if (payload.checkoutContext === 'bundle') {
    const cityResult = await client.query(
      `
        SELECT id, name, bundle_price
        FROM cities
        WHERE id = $1
          AND publication_status = 'published'
        LIMIT 1
      `,
      [payload.cityId]
    );
    if (!cityResult.rowCount) {
      throw createHttpError(404, 'Città non trovata.');
    }

    const city = cityResult.rows[0];
    const existingBundle = await client.query(
      `
        SELECT *
        FROM purchases
        WHERE user_id = $1
          AND type = 'bundle'
          AND city_id = $2
        ORDER BY purchased_at DESC, id DESC
        LIMIT 1
      `,
      [payload.userId, city.id]
    );
    if (existingBundle.rowCount) {
      return {
        alreadyPurchased: true,
        checkoutContext: 'bundle',
        currencyCode: 'EUR',
        items: [purchaseRowToResponse(existingBundle.rows[0])]
      };
    }

    const structureContext = ignoreDiscountCode
      ? null
      : await fetchUserStructurePricingContext(payload.userId, 'bundle', city.id, client);
    const pricing = buildPurchasePricing(city.bundle_price, structureContext);

    return {
      alreadyPurchased: false,
      checkoutContext: 'bundle',
      currencyCode: 'EUR',
      cityId: city.id,
      cityName: sanitizeText(city.name),
      baseAmount: pricing.baseAmount,
      discountAmount: pricing.discountAmount,
      finalAmount: pricing.finalAmount,
      structureId: structureContext?.structureId || null,
      inviteCode: structureContext?.inviteCode || null,
      items: [
        {
          purchaseType: 'bundle',
          cityId: city.id,
          cityName: sanitizeText(city.name),
          poiId: null,
          poiName: null,
          label: `Pacchetto città - ${sanitizeText(city.name)}`,
          ...pricing,
          structureId: structureContext?.structureId || null,
          inviteCode: structureContext?.inviteCode || null
        }
      ]
    };
  }

  if (payload.checkoutContext === 'single') {
    const poiResult = await client.query(
      `
        SELECT
          p.id,
          p.city_id,
          p.name,
          p.price_single,
          c.name AS city_name
        FROM pois p
        JOIN cities c ON c.id = p.city_id
        WHERE p.id = $1
          AND p.publication_status = 'published'
          AND c.publication_status = 'published'
        LIMIT 1
      `,
      [payload.poiId]
    );
    if (!poiResult.rowCount) {
      throw createHttpError(404, 'Luogo non trovato.');
    }

    const poi = poiResult.rows[0];
    const activePurchase = await client.query(
      `
        SELECT *
        FROM purchases
        WHERE user_id = $1
          AND (
            (type = 'bundle' AND city_id = $2)
            OR (type = 'single' AND poi_id = $3)
          )
        ORDER BY purchased_at DESC, id DESC
        LIMIT 1
      `,
      [payload.userId, poi.city_id, poi.id]
    );
    if (activePurchase.rowCount) {
      return {
        alreadyPurchased: true,
        checkoutContext: 'single',
        currencyCode: 'EUR',
        items: [purchaseRowToResponse(activePurchase.rows[0])]
      };
    }

    const structureContext = ignoreDiscountCode
      ? null
      : await fetchUserStructurePricingContext(payload.userId, 'single', poi.city_id, client);
    const pricing = buildPurchasePricing(poi.price_single, structureContext);

    return {
      alreadyPurchased: false,
      checkoutContext: 'single',
      currencyCode: 'EUR',
      cityId: poi.city_id,
      cityName: sanitizeText(poi.city_name),
      poiId: poi.id,
      poiName: sanitizeText(poi.name),
      baseAmount: pricing.baseAmount,
      discountAmount: pricing.discountAmount,
      finalAmount: pricing.finalAmount,
      structureId: structureContext?.structureId || null,
      inviteCode: structureContext?.inviteCode || null,
      items: [
        {
          purchaseType: 'single',
          cityId: poi.city_id,
          cityName: sanitizeText(poi.city_name),
          poiId: poi.id,
          poiName: sanitizeText(poi.name),
          label: sanitizeText(poi.name),
          ...pricing,
          structureId: structureContext?.structureId || null,
          inviteCode: structureContext?.inviteCode || null
        }
      ]
    };
  }

  const requestedPoiIds = Array.from(
    new Set(
      payload.poiIds
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    )
  );
  if (!requestedPoiIds.length) {
    throw createHttpError(400, 'Carrello PayPal vuoto.');
  }

  const poisResult = await client.query(
    `
      SELECT
        p.id,
        p.city_id,
        p.name,
        p.price_single,
        c.name AS city_name
      FROM pois p
      JOIN cities c ON c.id = p.city_id
      WHERE p.id = ANY($1::TEXT[])
        AND p.publication_status = 'published'
        AND c.publication_status = 'published'
    `,
    [requestedPoiIds]
  );
  if (poisResult.rowCount !== requestedPoiIds.length) {
    throw createHttpError(404, 'Uno o piu luoghi del carrello non esistono piu.');
  }

  const poiById = new Map(poisResult.rows.map((row) => [row.id, row]));
  const orderedPois = requestedPoiIds.map((poiId) => poiById.get(poiId)).filter(Boolean);
  const cityIds = Array.from(new Set(orderedPois.map((row) => row.city_id)));
  const activePurchases = await client.query(
    `
      SELECT type, city_id, poi_id
      FROM purchases
      WHERE user_id = $1
        AND (
          (type = 'bundle' AND city_id = ANY($2::TEXT[]))
          OR (type = 'single' AND poi_id = ANY($3::TEXT[]))
        )
    `,
    [payload.userId, cityIds, requestedPoiIds]
  );

  const unlockedCityIds = new Set(activePurchases.rows.filter((row) => row.type === 'bundle').map((row) => row.city_id));
  const unlockedPoiIds = new Set(activePurchases.rows.filter((row) => row.type === 'single').map((row) => row.poi_id));
  const blockedPoi = orderedPois.find((poi) => unlockedCityIds.has(poi.city_id) || unlockedPoiIds.has(poi.id));
  if (blockedPoi) {
    throw createHttpError(409, `Il luogo ${sanitizeText(blockedPoi.name)} e gia sbloccato e non puo essere pagato di nuovo.`);
  }

  const items = [];
  let discountAlreadyAssigned = false;
  for (const poi of orderedPois) {
    let structureContext = null;
    if (!ignoreDiscountCode && !discountAlreadyAssigned) {
      structureContext = await fetchUserStructurePricingContext(payload.userId, 'single', poi.city_id, client);
      if (structureContext?.inviteCode) {
        discountAlreadyAssigned = true;
      }
    }

    const pricing = buildPurchasePricing(poi.price_single, structureContext);
    items.push({
      purchaseType: 'single',
      cityId: poi.city_id,
      cityName: sanitizeText(poi.city_name),
      poiId: poi.id,
      poiName: sanitizeText(poi.name),
      label: sanitizeText(poi.name),
      ...pricing,
      structureId: structureContext?.structureId || null,
      inviteCode: structureContext?.inviteCode || null
    });
  }

  return {
    alreadyPurchased: false,
    checkoutContext: 'cart',
    currencyCode: 'EUR',
    baseAmount: roundMoney(items.reduce((sum, item) => sum + Number(item.baseAmount || 0), 0)),
    discountAmount: roundMoney(items.reduce((sum, item) => sum + Number(item.discountAmount || 0), 0)),
    finalAmount: roundMoney(items.reduce((sum, item) => sum + Number(item.finalAmount || 0), 0)),
    structureId: items.find((item) => item.structureId)?.structureId || null,
    inviteCode: items.find((item) => item.inviteCode)?.inviteCode || null,
    items
  };
}

function buildPayPalItemName(item) {
  if (item.purchaseType === 'bundle') {
    return item.cityName ? `Pacchetto città ${item.cityName}` : 'Pacchetto città';
  }
  return item.poiName || item.label || 'Luogo';
}

function buildPayPalOrderBody(checkoutPreview, settings, localReference) {
  const items = checkoutPreview.items.map((item) => ({
    name: buildPayPalItemName(item).slice(0, 127),
    unit_amount: {
      currency_code: checkoutPreview.currencyCode || 'EUR',
      value: moneyToString(item.finalAmount)
    },
    quantity: '1',
    category: 'DIGITAL_GOODS'
  }));

  const description =
    checkoutPreview.checkoutContext === 'bundle'
      ? `Sblocco città ${checkoutPreview.cityName || ''}`.trim()
      : checkoutPreview.checkoutContext === 'single'
        ? `Sblocco luogo ${checkoutPreview.poiName || ''}`.trim()
        : `Carrello audio guide (${checkoutPreview.items.length})`;

  return {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: String(localReference),
        custom_id: String(localReference),
        description: description.slice(0, 127),
        amount: {
          currency_code: checkoutPreview.currencyCode || 'EUR',
          value: moneyToString(checkoutPreview.finalAmount),
          breakdown: {
            item_total: {
              currency_code: checkoutPreview.currencyCode || 'EUR',
              value: moneyToString(checkoutPreview.finalAmount)
            }
          }
        },
        items
      }
    ],
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
          landing_page: 'LOGIN',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
          brand_name: settings.brandName || 'Walk Around',
          locale: 'it-IT'
        }
      }
    }
  };
}

const partnerRegistrationSchema = z.object({
  structureName: z.string().trim().min(2).max(180),
  structureType: z.string().trim().max(120).optional().default(''),
  vatNumber: z.string().trim().max(60).optional().default(''),
  contactFirstName: z.string().trim().min(1).max(120),
  contactLastName: z.string().trim().min(1).max(120),
  contactEmail: z.string().trim().email().max(180),
  contactPhone: z.string().trim().min(6).max(80),
  website: z.string().trim().max(240).optional().default(''),
  addressStreet: z.string().trim().min(2).max(180),
  addressNumber: z.string().trim().max(20).optional().default(''),
  addressCity: z.string().trim().min(2).max(140),
  addressPostalCode: z.string().trim().max(20).optional().default(''),
  addressProvince: z.string().trim().max(80).optional().default(''),
  addressRegion: z.string().trim().max(120).optional().default(''),
  addressCountry: z.string().trim().max(120).optional().default('Italia'),
  roomsCount: z.number().int().min(0).max(10000).nullable().optional().default(null),
  notes: z.string().trim().max(4000).optional().default('')
});

router.post('/partner-registration-requests', async (req, res, next) => {
  const parsed = partnerRegistrationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const normalizedContactEmail = payload.contactEmail.toLowerCase();

  try {
    const existingDashboardUser = await pool.query(
      `
        SELECT id
        FROM dashboard_users
        WHERE LOWER(email) = LOWER($1)
          AND deleted = 0
          AND is_registered = TRUE
        LIMIT 1
      `,
      [normalizedContactEmail]
    );

    if (existingDashboardUser.rowCount) {
      return res.status(409).json({
        code: 'DASHBOARD_EMAIL_ALREADY_REGISTERED',
        field: 'contactEmail',
        message: 'Questa email e gia registrata. Usa un altra email o contattaci per associare la struttura.'
      });
    }

    const insert = await pool.query(
      `
      INSERT INTO partner_registration_requests (
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
        notes
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, $17
      )
      RETURNING id, created_at
      `,
      [
        payload.structureName,
        payload.structureType || null,
        payload.vatNumber || null,
        payload.contactFirstName,
        payload.contactLastName,
        normalizedContactEmail,
        payload.contactPhone,
        payload.website || null,
        payload.addressStreet,
        payload.addressNumber || null,
        payload.addressCity,
        payload.addressPostalCode || null,
        payload.addressProvince || null,
        payload.addressRegion || null,
        payload.addressCountry || 'Italia',
        payload.roomsCount ?? null,
        payload.notes || null
      ]
    );

    const row = insert.rows[0];
    const requestNotification = {
      id: Number(row.id),
      createdAt: row.created_at,
      ...payload,
      contactEmail: normalizedContactEmail
    };

    notifyPartnerRegistrationRequest(requestNotification).catch((error) => {
      console.error('Failed to send partner registration notification', error);
    });

    return res.status(201).json({
      submitted: true,
      requestId: Number(row.id),
      createdAt: row.created_at
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/privacy-policy', async (req, res, next) => {
  const parsed = privacyPolicyQuerySchema.safeParse(req.query || {});
  if (!parsed.success) {
    return res.status(400).json({ message: 'Lingua non valida', errors: parsed.error.flatten() });
  }

  try {
    const result = await pool.query(
      `
        SELECT translations, updated_at
        FROM dashboard_privacy_policy_settings
        WHERE id = 1
        LIMIT 1
      `
    );
    const row = result.rows[0] || {};
    const translations = sanitizePrivacyPolicyTranslations(row.translations);
    const requestedLanguage = parsed.data.language;
    const fallbackLanguage = translations[requestedLanguage]
      ? requestedLanguage
      : translations.it
      ? 'it'
      : privacyPolicyLanguages.find((language) => translations[language]) || requestedLanguage;

    return res.json({
      language: fallbackLanguage,
      requestedLanguage,
      contentHtml: translations[fallbackLanguage] || '',
      updatedAt: row.updated_at || null
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/legal-documents/:documentType', async (req, res, next) => {
  const parsedParams = legalDocumentParamsSchema.safeParse(req.params || {});
  if (!parsedParams.success) {
    return res.status(400).json({ message: 'Documento legale non valido', errors: parsedParams.error.flatten() });
  }

  const parsedQuery = privacyPolicyQuerySchema.safeParse(req.query || {});
  if (!parsedQuery.success) {
    return res.status(400).json({ message: 'Lingua non valida', errors: parsedQuery.error.flatten() });
  }

  const documentType = parsedParams.data.documentType;

  try {
    const result =
      documentType === 'privacyPolicy'
        ? await pool.query(
            `
              SELECT translations, updated_at
              FROM dashboard_privacy_policy_settings
              WHERE id = 1
              LIMIT 1
            `
          )
        : await pool.query(
            `
              SELECT translations, updated_at
              FROM dashboard_legal_document_settings
              WHERE document_type = $1
              LIMIT 1
            `,
            [legalDocumentDbTypes[documentType]]
          );

    const row = result.rows[0] || {};
    const translations = sanitizePrivacyPolicyTranslations(row.translations);
    const requestedLanguage = parsedQuery.data.language;
    const selected = selectLegalDocumentTranslation(translations, requestedLanguage);

    return res.json({
      type: documentType,
      language: selected.language,
      requestedLanguage,
      contentHtml: selected.contentHtml,
      updatedAt: row.updated_at || null
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/app-cache-settings', async (_req, res, next) => {
  try {
    const result = await pool.query(
      `
        SELECT cache_version, updated_at
        FROM dashboard_app_cache_settings
        WHERE id = 1
        LIMIT 1
      `
    );
    const row = result.rows[0] || {};
    res.set('Cache-Control', 'no-store');
    return res.json({
      cacheVersion: String(row.cache_version || '1'),
      updatedAt: row.updated_at || null
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/cities', async (_req, res, next) => {
  try {
    const result = await queryWithRetry(
      `
      SELECT c.*, COUNT(p.id)::int AS poi_count
      FROM cities c
      LEFT JOIN pois p ON p.city_id = c.id AND p.publication_status = 'published'
      WHERE c.publication_status = 'published'
      GROUP BY c.id
      ORDER BY c.is_default DESC, c.name ASC
      `,
      [],
      { label: 'public cities list' }
    );

    const data = result.rows.map((row) => ({
      ...mapCity(row),
      poiCount: row.poi_count
    }));

    res.set('Cache-Control', 'no-store');
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/cities/:cityId/pois', async (req, res, next) => {
  const { cityId } = req.params;

  try {
    const result = await queryWithRetry(
      `
      SELECT
        p.id,
        p.city_id,
        p.name,
        p.address,
        p.lat,
        p.lng,
        p.category,
        p.description_short,
        p.image_url,
        p.audio_url,
        p.price_single,
        p.duration_sec,
        COALESCE(p.translations, '{}'::jsonb)
          #- '{it,descriptionLong}'
          #- '{en,descriptionLong}'
          #- '{fr,descriptionLong}'
          #- '{es,descriptionLong}'
          #- '{de,descriptionLong}'
          #- '{pl,descriptionLong}' AS translations
      FROM pois p
      WHERE p.city_id = $1
        AND p.publication_status = 'published'
        AND EXISTS (
          SELECT 1
          FROM cities c
          WHERE c.id = p.city_id
            AND c.publication_status = 'published'
        )
      ORDER BY p.name ASC
      `,
      [cityId],
      { label: 'public city pois list' }
    );

    res.json(result.rows.map(mapPoiListItem));
  } catch (error) {
    next(error);
  }
});

router.get('/pois/:poiId/audio-preview', async (req, res, next) => {
  const { poiId } = req.params;
  const language = normalizeAudioLanguage(req.query.language);

  try {
    const source = await fetchPublishedPoiAudioSource(poiId, language);
    if (!source) {
      return res.status(404).json({ message: 'POI not found' });
    }
    if (!source.audioPath) {
      return res.status(404).json({ message: 'Audio preview unavailable' });
    }

    const previewPath = await ensureAudioPreviewFile({
      poiId: source.id,
      language,
      sourcePath: source.audioPath,
      durationSec: source.duration_sec
    });

    res.set({
      'Cache-Control': 'public, max-age=2592000, immutable',
      'Content-Type': contentTypeForAudioPath(previewPath),
      'Content-Disposition': `inline; filename="${path.basename(previewPath).replace(/"/g, '')}"`
    });
    return res.sendFile(previewPath);
  } catch (error) {
    return next(error);
  }
});

router.get('/pois/:poiId/audio', async (req, res, next) => {
  const { poiId } = req.params;
  const language = normalizeAudioLanguage(req.query.language);

  try {
    const source = await fetchPublishedPoiAudioSource(poiId, language);
    if (!source) {
      return res.status(404).json({ message: 'POI not found' });
    }
    if (!source.audioPath) {
      return res.status(404).json({ message: 'Audio unavailable' });
    }

    const dashboardSession = await resolveAudioDashboardSession(req);
    const isAdminAudioAccess = dashboardSession?.user?.role === 'admin';
    if (!isAdminAudioAccess) {
      const appSession = await resolveAudioAppSessionUser(req);
      if (!appSession) {
        return res.status(401).json({ message: 'Accesso utente richiesto per audio completo' });
      }

      const canAccess = await userCanAccessPoiAudio(appSession.user.id, source.id, source.city_id);
      if (!canAccess) {
        return res.status(403).json({ message: 'Acquista questo contenuto per ascoltare l audio completo' });
      }
    }

    res.set({
      'Cache-Control': 'private, no-store',
      'Content-Type': contentTypeForAudioPath(source.audioPath),
      'Content-Disposition': `inline; filename="${path.basename(source.audioPath).replace(/"/g, '')}"`
    });
    return res.sendFile(source.audioPath);
  } catch (error) {
    return next(error);
  }
});

router.get('/pois/:poiId', async (req, res, next) => {
  const { poiId } = req.params;

  try {
    const result = await queryWithRetry(
      `
      SELECT p.*
      FROM pois p
      JOIN cities c ON c.id = p.city_id
      WHERE p.id = $1
        AND p.publication_status = 'published'
        AND c.publication_status = 'published'
      LIMIT 1
      `,
      [poiId],
      { label: 'public poi detail' }
    );
    if (!result.rowCount) {
      return res.status(404).json({ message: 'POI not found' });
    }

    return res.json(mapPoi(result.rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.post('/unlock/validate', async (req, res, next) => {
  const parsed = unlockValidateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ valid: false, message: 'Invalid payload', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const expectedCode = getDailyUnlockCode();
  const normalizedCode = payload.code.trim().toLowerCase();

  if (normalizedCode !== expectedCode) {
    return res.status(403).json({ valid: false, message: 'Codice sblocco non valido' });
  }

  try {
    if (payload.type === 'bundle') {
      const cityResult = await pool.query(
        `
        SELECT id, name, bundle_price
        FROM cities
        WHERE id = $1
          AND publication_status = 'published'
        LIMIT 1
        `,
        [payload.cityId]
      );
      if (!cityResult.rowCount) {
        return res.status(404).json({ valid: false, message: 'City not found' });
      }

      const city = cityResult.rows[0];
      return res.json({
        valid: true,
        unlocked: {
          type: 'bundle',
          cityId: city.id,
          cityName: sanitizeText(city.name),
          amount: Number(city.bundle_price)
        }
      });
    }

    const poiResult = await pool.query(
      `
      SELECT p.id, p.city_id, p.name, p.price_single
      FROM pois p
      JOIN cities c ON c.id = p.city_id
      WHERE p.id = $1
        AND p.publication_status = 'published'
        AND c.publication_status = 'published'
      LIMIT 1
      `,
      [payload.poiId]
    );
    if (!poiResult.rowCount) {
      return res.status(404).json({ valid: false, message: 'POI not found' });
    }

    const poi = poiResult.rows[0];
    return res.json({
      valid: true,
      unlocked: {
        type: 'single',
        cityId: poi.city_id,
        poiId: poi.id,
        poiName: sanitizeText(poi.name),
        amount: Number(poi.price_single)
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/paypal/sdk-config', async (_req, res, next) => {
  try {
    const settings = await getPayPalSettings();
    await requestPayPalAccessToken(settings);
    return res.json({
      ready: true,
      clientId: settings.clientId,
      currencyCode: settings.currencyCode || 'EUR',
      mode: settings.mode,
      brandName: settings.brandName || 'Walk Around'
    });
  } catch (error) {
    if (error instanceof PayPalConfigurationError) {
      return res.status(error.status || 503).json({
        ready: false,
        message: error.message
      });
    }
    return next(error);
  }
});

router.post('/paypal/checkout/quote', async (req, res, next) => {
  const parsed = paypalCheckoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload PayPal non valido', errors: parsed.error.flatten() });
  }

  if (await haRispostoPerchiNonAutorizzato(req, res, parsed.data.userId)) {
    return;
  }

  const client = await pool.connect();
  try {
    await markExpiredPayPalOrders(client);
    const preview = await buildPayPalCheckoutPreview(parsed.data, client);
    return res.json(preview);
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).json({ message: error.message, details: error.details || null });
    }
    return next(error);
  } finally {
    client.release();
  }
});

router.post('/paypal/checkout/create-order', async (req, res, next) => {
  const parsed = paypalCheckoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload PayPal non valido', errors: parsed.error.flatten() });
  }

  const client = await pool.connect();
  try {
    await requireAppUser(req, parsed.data.userId);
    await markExpiredPayPalOrders(client);
    const settings = await getPayPalSettings(client);
    const checkoutPreview = await buildPayPalCheckoutPreview(parsed.data, client);
    if (checkoutPreview.alreadyPurchased) {
      return res.status(409).json({ message: 'Contenuto gia acquistato.', checkout: checkoutPreview });
    }
    if (Number(checkoutPreview.finalAmount || 0) <= 0) {
      return res.status(409).json({ message: 'Il totale da pagare deve essere maggiore di zero per usare PayPal.' });
    }

    const accessToken = await requestPayPalAccessToken(settings);
    const provisionalRef = `${parsed.data.userId}-${Date.now()}`;
    const paypalOrder = await paypalApiRequest(
      settings,
      accessToken,
      '/v2/checkout/orders',
      {
        method: 'POST',
        body: buildPayPalOrderBody(checkoutPreview, settings, provisionalRef)
      }
    );

    const orderStatus = String(paypalOrder.status || 'CREATED').trim().toLowerCase() || 'created';
    const storedItems = JSON.stringify(checkoutPreview.items);
    const firstDiscountedItem = checkoutPreview.items.find((item) => item.inviteCode);
    const totalStructureFixedAmount = roundMoney(
      checkoutPreview.items.reduce((sum, item) => sum + Number(item.structureFixedAmount || 0), 0)
    );
    const totalStructureEarningAmount = roundMoney(
      checkoutPreview.items.reduce((sum, item) => sum + Number(item.structureEarningAmount || 0), 0)
    );

    await client.query(
      `
        INSERT INTO paypal_checkout_orders (
          paypal_order_id,
          user_id,
          checkout_context,
          status,
          currency_code,
          mode,
          city_id,
          poi_id,
          base_amount,
          discount_percent,
          discount_amount,
          final_amount,
          structure_id,
          invite_code,
          structure_fixed_amount,
          structure_earning_amount,
          purchase_items,
          expires_at,
          created_at,
          updated_at
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          $16,
          $17::jsonb,
          NOW() + INTERVAL '6 hours',
          NOW(),
          NOW()
        )
      `,
      [
        paypalOrder.id,
        parsed.data.userId,
        parsed.data.checkoutContext,
        orderStatus,
        checkoutPreview.currencyCode || 'EUR',
        settings.mode,
        checkoutPreview.checkoutContext === 'cart' ? null : checkoutPreview.cityId || null,
        checkoutPreview.checkoutContext === 'single' ? checkoutPreview.poiId || null : null,
        Number(checkoutPreview.baseAmount || 0),
        Number(firstDiscountedItem?.discountPercent || 0),
        Number(checkoutPreview.discountAmount || 0),
        Number(checkoutPreview.finalAmount || 0),
        checkoutPreview.structureId || null,
        checkoutPreview.inviteCode || null,
        totalStructureFixedAmount,
        totalStructureEarningAmount,
        storedItems
      ]
    );

    return res.status(201).json({
      orderId: paypalOrder.id,
      status: paypalOrder.status || 'CREATED',
      checkout: checkoutPreview
    });
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).json({ message: error.message, details: error.details || null });
    }
    if (error instanceof PayPalConfigurationError) {
      return res.status(error.status || 502).json({ message: error.message });
    }
    if (error?.status) {
      return res.status(error.status).json({ message: error.message, details: error.details || null });
    }
    return next(error);
  } finally {
    client.release();
  }
});

router.post('/paypal/checkout/capture-order', async (req, res, next) => {
  const parsed = paypalCaptureSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Payload PayPal non valido', errors: parsed.error.flatten() });
  }

  const { orderId, userId } = parsed.data;
  const client = await pool.connect();
  let pendingOrder = null;

  /**
   * A che punto e' l'incasso. Tre stati, non due.
   *
   * La versione con un booleano `incassoAvvenuto` copriva un caso solo: PayPal
   * ha risposto, e la risposta diceva qualcosa di diverso da COMPLETED. Ma il
   * modo piu' comune di incassare senza registrare e' un altro — **la chiamata
   * che non torna**: timeout, connessione chiusa, 502 del proxy davanti. Li'
   * la riga che accende il booleano non viene mai eseguita, e il catch scrive
   * 'failed' su un ordine i cui soldi sono stati presi davvero.
   *
   *   'da-fare'    non si e' ancora chiamato niente: nessun rischio.
   *   'ignoto'     si e' chiesta la capture e non si e' letta la risposta.
   *                Vale come incasso: **quando non si sa, si sceglie l'errore
   *                dalla parte in cui qualcuno guarda**, perche' una riga che
   *                dice il falso ("failed") chiude il caso per sempre, mentre
   *                una che dice "guardami" costa una verifica a mano.
   *   'incassato'  COMPLETED, letto.
   *   'rifiutato'  PayPal ha risposto, e ha detto di no. Nessun incasso.
   */
  let esitoCattura = 'da-fare';

  /* Dichiarati qui e non dentro il try: senza, il catch scrive lo stato ma
     non l'identificativo della capture, e la persona che deve riconciliare si
     ritrova un ordine PayPal e nient'altro — niente con cui cercare il
     movimento nel pannello o emettere il rimborso. */
  let capturePayload = null;
  let captureId = null;

  try {
    await requireAppUser(req, userId);
    await markExpiredPayPalOrders(client);
    const pendingQuery = await client.query(
      `
        SELECT *
        FROM paypal_checkout_orders
        WHERE paypal_order_id = $1
          AND user_id = $2
        LIMIT 1
      `,
      [orderId, userId]
    );
    if (!pendingQuery.rowCount) {
      return res.status(404).json({ message: 'Ordine PayPal non trovato.' });
    }

    pendingOrder = pendingQuery.rows[0];
    if (pendingOrder.status === 'completed') {
      const existingPurchases = await client.query(
        `
          SELECT *
          FROM purchases
          WHERE payment_order_id = $1
          ORDER BY id ASC
        `,
        [orderId]
      );
      return res.json({
        captured: true,
        orderId,
        purchases: existingPurchases.rows.map(purchaseRowToResponse)
      });
    }
    if (pendingOrder.status === 'expired') {
      return res.status(409).json({ message: 'L ordine PayPal e scaduto. Crea un nuovo checkout.' });
    }

    const pendingInviteCode = normalizeInviteCode(pendingOrder.invite_code);
    if (pendingInviteCode) {
      const usedCode = await client.query(
        `
        SELECT 1
        FROM app_user_discount_code_uses
        WHERE user_id = $1
          AND invite_code = $2
        LIMIT 1
        `,
        [userId, pendingInviteCode]
      );
      if (usedCode.rowCount) {
        return res.status(409).json({
          codeStatus: 'used',
          message: 'Questo codice sconto e gia stato utilizzato. Crea un nuovo checkout senza questo codice.'
        });
      }
    }

    // Letto PRIMA della capture, e non dopo.
    //
    // Questo JSON.parse puo' sollevare: purchase_items arriva da una colonna
    // e non e' garantito che sia leggibile. Stava sotto la chiamata a PayPal,
    // cioe' dopo che i soldi erano stati presi — e un'eccezione li' dentro
    // faceva rollback lasciando un incasso senza acquisto e senza rimborso.
    //
    // Regola generale: tutto quello che puo' fallire va fatto prima del punto
    // in cui non si torna indietro.
    const rawItems = Array.isArray(pendingOrder.purchase_items)
      ? pendingOrder.purchase_items
      : JSON.parse(String(pendingOrder.purchase_items || '[]'));

    const settings = await getPayPalSettings(client);
    const accessToken = await requestPayPalAccessToken(settings);

    /* Segnato PRIMA della chiamata, non dopo. Da questa riga in poi i soldi
       possono essere gia' partiti anche se qui non arriva niente. */
    esitoCattura = 'ignoto';

    capturePayload = await paypalApiRequest(
      settings,
      accessToken,
      `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      {
        method: 'POST',
        body: {}
      }
    );

    const captureStatus = String(capturePayload.status || '').trim().toUpperCase() || 'UNKNOWN';

    // Adesso si sa, perche' la risposta e' stata letta.
    esitoCattura = captureStatus === 'COMPLETED' ? 'incassato' : 'rifiutato';

    const captureUnit = Array.isArray(capturePayload.purchase_units) ? capturePayload.purchase_units[0] : null;
    const capture = Array.isArray(captureUnit?.payments?.captures) ? captureUnit.payments.captures[0] : null;
    captureId = String(capture?.id || '').trim() || null;
    const payer = extractPayPalPayer(capturePayload);
    await client.query('BEGIN');

    const lockedOrder = await client.query(
      `
        SELECT *
        FROM paypal_checkout_orders
        WHERE paypal_order_id = $1
          AND user_id = $2
        LIMIT 1
        FOR UPDATE
      `,
      [orderId, userId]
    );
    if (!lockedOrder.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Ordine PayPal non trovato.' });
    }

    pendingOrder = lockedOrder.rows[0];
    if (pendingOrder.status === 'completed') {
      await client.query('COMMIT');
      const existingPurchases = await pool.query(
        `
          SELECT *
          FROM purchases
          WHERE payment_order_id = $1
          ORDER BY id ASC
        `,
        [orderId]
      );
      return res.json({
        captured: true,
        orderId,
        purchases: existingPurchases.rows.map(purchaseRowToResponse)
      });
    }

    if (captureStatus !== 'COMPLETED') {
      await client.query(
        `
          UPDATE paypal_checkout_orders
          SET status = $2,
              capture_payload = $3::jsonb,
              capture_id = $4,
              error_message = $5,
              updated_at = NOW()
          WHERE paypal_order_id = $1
        `,
        [orderId, String(captureStatus || 'failed').toLowerCase(), JSON.stringify(capturePayload), captureId, captureStatus]
      );
      await client.query('COMMIT');
      return res.status(409).json({ message: `PayPal ha restituito stato ${captureStatus}.` });
    }

    const firstDiscountedItem = rawItems.find((item) => item?.inviteCode);
    if (firstDiscountedItem?.inviteCode) {
      const discountUse = await client.query(
        `
          INSERT INTO app_user_discount_code_uses (
            user_id,
            discount_code_id,
            structure_id,
            invite_code,
            purchase_type,
            used_at
          )
          VALUES ($1, NULL, $2, $3, $4, NOW())
          ON CONFLICT (user_id, invite_code) DO NOTHING
          RETURNING id
        `,
        [userId, firstDiscountedItem.structureId || null, firstDiscountedItem.inviteCode, firstDiscountedItem.purchaseType]
      );
      if (!discountUse.rowCount) {
        throw createHttpError(409, 'Questo codice sconto e gia stato utilizzato.', { codeStatus: 'used' });
      }
    }

    const insertedPurchases = [];
    for (const item of rawItems) {
      const purchaseType = item.purchaseType === 'bundle' ? 'bundle' : 'single';
      const inserted = await client.query(
        `
          INSERT INTO purchases (
            user_id,
            type,
            city_id,
            poi_id,
            amount,
            base_amount,
            discount_percent,
            discount_amount,
            final_amount,
            structure_id,
            invite_code,
            structure_fixed_amount,
            structure_earning_amount,
            payment_method,
            payment_provider,
            payment_status,
            payment_order_id,
            payment_capture_id,
            payment_environment,
            payer_email,
            payer_id,
            payer_first_name,
            payer_last_name,
            payer_country_code,
            payer_phone,
            payer_address,
            purchased_at
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            'PayPal',
            $14,
            $15,
            $16,
            $17,
            $18,
            $19,
            $20,
            $21,
            $22,
            $23,
            $24,
            $25,
            NOW()
          )
          RETURNING *
        `,
        [
          userId,
          purchaseType,
          item.cityId || null,
          item.poiId || null,
          Number(item.finalAmount || 0),
          Number(item.baseAmount || item.finalAmount || 0),
          Number(item.discountPercent || 0),
          Number(item.discountAmount || 0),
          Number(item.finalAmount || 0),
          item.structureId || null,
          item.inviteCode || null,
          Number(item.structureFixedAmount || 0),
          Number(item.structureEarningAmount || 0),
          paypalProviderLabel(settings.mode),
          captureStatus.toLowerCase(),
          orderId,
          captureId,
          settings.mode,
          payer.payerEmail,
          payer.payerId || userId,
          payer.payerFirstName,
          payer.payerLastName,
          payer.payerCountryCode,
          payer.payerPhone,
          payer.payerAddress
        ]
      );

      insertedPurchases.push(purchaseRowToResponse(inserted.rows[0]));
    }

    await client.query(
      `
        UPDATE paypal_checkout_orders
        SET status = 'completed',
            capture_payload = $2::jsonb,
            payer_email = $3,
            payer_id = $4,
            payer_first_name = $5,
            payer_last_name = $6,
            payer_country_code = $7,
            payer_phone = $8,
            payer_address = $9,
            capture_id = $10,
            captured_at = NOW(),
            error_message = NULL,
            updated_at = NOW()
        WHERE paypal_order_id = $1
      `,
      [
        orderId,
        JSON.stringify(capturePayload),
        payer.payerEmail,
        payer.payerId || userId,
        payer.payerFirstName,
        payer.payerLastName,
        payer.payerCountryCode,
        payer.payerPhone,
        payer.payerAddress,
        captureId
      ]
    );

    await client.query('COMMIT');
    notifyPaymentCompleted({
      orderId,
      captureId,
      payer,
      purchases: insertedPurchases,
      paymentProvider: paypalProviderLabel(settings.mode),
      paymentEnvironment: settings.mode
    }).catch((error) => {
      console.error('Failed to send payment notification', error);
    });

    return res.json({
      captured: true,
      orderId,
      purchases: insertedPurchases
    });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Ignore rollback errors.
    }

    if (pendingOrder?.paypal_order_id) {
      try {
        // Che cosa si scrive qui dipende da una cosa sola: se i soldi sono
        // stati presi.
        //
        // Prima scriveva sempre 'failed', e senza guardare lo stato di
        // partenza. Due conseguenze: una richiesta parallela che aveva gia'
        // scritto 'completed' se la vedeva sovrascrivere — e con lei la
        // riproduzione idempotente, che da quel momento non ritrovava piu'
        // l'ordine gia' pagato — e un incasso riuscito con la registrazione
        // fallita spariva sotto la stessa parola di un pagamento mai
        // avvenuto.
        //
        // 'captured_unreconciled' non e' uno stato che il programma sa
        // gestire, ed e' voluto: vuol dire che c'e' un incasso senza
        // acquisto e che ci deve guardare una persona. Meglio una riga che
        // chiede aiuto che una che dice il falso.
        //
        // La clausola in fondo protegge DUE stati e non uno. Proteggeva solo
        // 'completed', e quindi un ordine gia' marcato 'captured_unreconciled'
        // si lasciava riscrivere da 'failed' al tentativo successivo: PayPal
        // risponde 422 ORDER_ALREADY_CAPTURED, si finisce qui, e l'unico
        // segnale che diceva "c'e' un incasso senza acquisto" spariva. Uno
        // stato che chiede aiuto deve sopravvivere ai tentativi seguenti,
        // altrimenti non chiede aiuto: lo chiede una volta e poi tace.
        const nonRiconciliato = esitoCattura === 'incassato' || esitoCattura === 'ignoto';

        await pool.query(
          `
          UPDATE paypal_checkout_orders
            SET status = $3,
                error_message = $2,
                capture_id = COALESCE($4, capture_id),
                capture_payload = COALESCE($5::jsonb, capture_payload),
                updated_at = NOW()
            WHERE paypal_order_id = $1
              AND status NOT IN ('completed', 'captured_unreconciled')
          `,
          [
            pendingOrder.paypal_order_id,
            error instanceof Error ? error.message : 'Errore PayPal',
            nonRiconciliato ? 'captured_unreconciled' : 'failed',
            captureId,
            capturePayload ? JSON.stringify(capturePayload) : null
          ]
        );
      } catch {
        // Ignore secondary failures while saving PayPal state.
      }
    }

    if (error instanceof PayPalConfigurationError) {
      return res.status(error.status || 502).json({ message: error.message });
    }
    if (error?.status) {
      return res.status(error.status).json({
        message: error.message,
        details: error.details || null,
        codeStatus: error.details?.codeStatus
      });
    }
    return next(error);
  } finally {
    client.release();
  }
});

router.post('/purchase', async (req, res) => {
  const parsed = purchaseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });
  }

  return res.status(409).json({
    message: 'I pagamenti diretti sono disabilitati. Usa il checkout PayPal.'
  });
});

router.get('/me/purchases', async (req, res, next) => {
  const userId = String(req.query.userId || '').trim();
  if (!userId) {
    return res.status(400).json({ message: 'Missing userId query parameter' });
  }

  if (await haRispostoPerchiNonAutorizzato(req, res, userId)) {
    return;
  }

  const adminUnlockSimulationRequested = String(req.query.adminUnlockSimulation || '').trim() === '1';

  try {
    let adminUnlockSimulation = false;
    if (adminUnlockSimulationRequested) {
      const session = await resolveSessionUser(req);
      if (!session || session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Simulazione sblocco disponibile solo per admin' });
      }
      adminUnlockSimulation = true;
    }

    const cityUnlockSimulationQuery = adminUnlockSimulation
      ? queryWithRetry(
          `
          SELECT id
          FROM cities
          WHERE publication_status = 'published'
          ORDER BY name ASC
          `,
          [],
          { label: 'admin simulated unlocked cities' }
        )
      : Promise.resolve({ rows: [] });

    const [purchases, unlockedPois, simulatedUnlockedCities] = await Promise.all([
      queryWithRetry(
        `
        SELECT
          pu.id,
          pu.user_id,
          pu.type,
          pu.city_id,
          c.name AS city_name,
          pu.poi_id,
          p.name AS poi_name,
          pu.amount,
          pu.base_amount,
          pu.discount_percent,
          pu.discount_amount,
          pu.final_amount,
          pu.structure_id,
          pu.invite_code,
          pu.structure_fixed_amount,
          pu.structure_earning_amount,
          pu.payment_method,
          pu.payment_provider,
          pu.payment_status,
          pu.payment_order_id,
          pu.purchased_at,
          c.publication_status AS city_publication_status
        FROM purchases pu
        LEFT JOIN pois p ON p.id = pu.poi_id
        LEFT JOIN cities c ON c.id = pu.city_id
        WHERE pu.user_id = $1
        ORDER BY pu.purchased_at DESC
        `,
        [userId],
        { label: 'user purchases list' }
      ),
      queryWithRetry(
        `
        SELECT DISTINCT poi_id AS id
        FROM purchases
        JOIN pois single_poi ON single_poi.id = purchases.poi_id
        JOIN cities single_city ON single_city.id = single_poi.city_id
        WHERE user_id = $1
          AND type = 'single'
          AND poi_id IS NOT NULL
          AND single_poi.publication_status = 'published'
          AND single_city.publication_status = 'published'
        UNION
        SELECT DISTINCT p.id
        FROM pois p
        JOIN cities c ON c.id = p.city_id
        JOIN purchases b
          ON b.user_id = $1
         AND b.type = 'bundle'
         AND b.city_id = p.city_id
        WHERE p.publication_status = 'published'
          AND c.publication_status = 'published'
        `,
        [userId],
        { label: 'user unlocked pois list' }
      ),
      cityUnlockSimulationQuery
    ]);

    const raw = purchases.rows.map((row) => ({
      id: Number(row.id),
      userId: row.user_id,
      type: row.type,
      cityId: row.city_id,
      cityName: row.city_name || null,
      poiId: row.poi_id,
      poiName: row.poi_name || null,
      amount: Number(row.amount),
      baseAmount: Number(row.base_amount || row.amount || 0),
      discountPercent: Number(row.discount_percent || 0),
      discountAmount: Number(row.discount_amount || 0),
      finalAmount: Number(row.final_amount || row.amount || 0),
      structureId: row.structure_id || null,
      inviteCode: row.invite_code || null,
      structureFixedAmount: Number(row.structure_fixed_amount || 0),
      structureEarningAmount: Number(row.structure_earning_amount || 0),
      paymentMethod: row.payment_method || null,
      paymentProvider: row.payment_provider || null,
      paymentStatus: row.payment_status || null,
      paymentOrderId: row.payment_order_id || null,
      purchasedAt: row.purchased_at,
      expiresAt: toIsoDateOrNull(purchaseExpiresAt(row.purchased_at)),
      isActive: isPurchaseStillActive(row.purchased_at)
    }));

    const unlockedPoiIds = unlockedPois.rows.map((row) => row.id);
    const purchasedCityIds = purchases.rows
      .filter(
        (row) =>
          row.type === 'bundle' &&
          row.city_id &&
          row.city_publication_status === 'published' &&
          isPurchaseStillActive(row.purchased_at)
      )
      .map((row) => row.city_id);
    const simulatedCityIds = adminUnlockSimulation ? simulatedUnlockedCities.rows.map((row) => row.id) : [];
    const unlockedCityIds = Array.from(new Set([...purchasedCityIds, ...simulatedCityIds].filter(Boolean)));

    return res.json({
      items: raw,
      unlockedPoiIds,
      unlockedCityIds,
      adminUnlockSimulation
    });
  } catch (error) {
    return next(error);
  }
});

const clearPurchasesSchema = z.object({
  userId: z.string().min(2)
});

router.delete('/me/purchases', async (req, res, next) => {
  const parsed = clearPurchasesSchema.safeParse({ userId: String(req.query.userId || '').trim() });
  if (!parsed.success) {
    return res.status(400).json({ message: 'Missing userId query parameter' });
  }

  if (await haRispostoPerchiNonAutorizzato(req, res, parsed.data.userId)) {
    return;
  }

  try {
    const deleted = await pool.query(
      `
      DELETE FROM purchases
      WHERE user_id = $1
      RETURNING id
      `,
      [parsed.data.userId]
    );

    return res.json({
      cleared: true,
      deletedCount: deleted.rowCount || 0
    });
  } catch (error) {
    return next(error);
  }
});

const hotelValidateSchema = z
  .object({
    code: z.string().min(2),
    userId: z.string().min(2),
    targetType: z.enum(['single', 'bundle']).optional(),
    cityId: z.string().min(2).optional()
  })
  .refine((value) => !(value.targetType && !value.cityId), {
    message: 'cityId obbligatoria quando specifichi il target',
    path: ['cityId']
  });

const hotelAssociationQuerySchema = z.object({
  userId: z.string().min(2)
});

const hotelAssociationDeleteSchema = z.object({
  userId: z.string().min(2)
});

router.post('/hotel/validate', async (req, res, next) => {
  const parsed = hotelValidateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;

  if (await haRispostoPerchiNonAutorizzato(req, res, payload.userId)) {
    return;
  }

  const normalizedCode = payload.code.trim().toUpperCase();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const discountCodeResult = await client.query(
      `
      SELECT
        dc.id,
        dc.code,
        dc.apply_to,
        dc.city_id,
        legacy_city.name AS city_name,
        COALESCE(city_links.city_ids, CASE WHEN legacy_city.id IS NOT NULL THEN ARRAY[dc.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
        COALESCE(city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
        dc.user_discount_percent,
        dc.user_discount_percent_single,
        dc.user_discount_percent_bundle,
        dc.structure_fixed_amount,
        dc.structure_fixed_amount_single,
        dc.structure_fixed_amount_bundle,
        dc.expires_at,
        (dc.expires_at > NOW()) AS is_active,
        s.id AS structure_id,
        s.name AS structure_name,
        s.address AS structure_address
      FROM dashboard_structure_discount_codes dc
      JOIN dashboard_structures s ON s.id = dc.structure_id AND s.deleted = 0
      LEFT JOIN cities legacy_city ON legacy_city.id = dc.city_id AND legacy_city.publication_status = 'published'
      LEFT JOIN LATERAL (
        SELECT
          ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
          ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
        FROM dashboard_structure_discount_code_cities dcc
        JOIN cities c ON c.id = dcc.city_id AND c.publication_status = 'published'
        WHERE dcc.discount_code_id = dc.id
      ) city_links ON TRUE
      WHERE UPPER(dc.code) = $1
      LIMIT 1
      `,
      [normalizedCode]
    );

    if (!discountCodeResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ valid: false, message: 'Il codice inserito non esiste' });
    }

    const discountCode = discountCodeResult.rows[0];
    const normalizedDiscountCode = normalizeInviteCode(discountCode.code);
    const usedByUser = await client.query(
      `
      SELECT 1
      FROM app_user_discount_code_uses
      WHERE user_id = $1
        AND invite_code = $2
      LIMIT 1
      `,
      [payload.userId, normalizedDiscountCode]
    );
    if (usedByUser.rowCount) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        valid: false,
        codeStatus: 'used',
        message: 'Questo codice e già stato utilizzato per questo utente'
      });
    }

    if (!discountCode.is_active) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        valid: false,
        codeStatus: 'expired',
        message: 'Il codice inserito e scaduto'
      });
    }

    if (payload.targetType && payload.cityId) {
      const applicable = isDiscountCodeApplicableToTarget(discountCode, payload.targetType, payload.cityId);
      if (!applicable) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          valid: false,
          codeStatus: 'invalid',
          message: 'Il codice non e applicabile a questo acquisto'
        });
      }
    }

    const existingAssociation = await client.query(
      `
      SELECT
        l.invite_code,
        dc.code AS discount_code
      FROM app_user_structure_links l
      LEFT JOIN dashboard_structure_discount_codes dc ON dc.id = l.discount_code_id
      WHERE l.user_id = $1
      LIMIT 1
      FOR UPDATE OF l
      `,
      [payload.userId]
    );
    const alreadyAssociated =
      existingAssociation.rowCount > 0 &&
      normalizeInviteCode(existingAssociation.rows[0].discount_code || existingAssociation.rows[0].invite_code) ===
        normalizedDiscountCode;

    await client.query(
      `
      INSERT INTO app_user_structure_links (user_id, structure_id, discount_code_id, invite_code, associated_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        structure_id = EXCLUDED.structure_id,
        discount_code_id = EXCLUDED.discount_code_id,
        invite_code = EXCLUDED.invite_code,
        updated_at = NOW()
      `,
      [payload.userId, discountCode.structure_id, discountCode.id, normalizedDiscountCode]
    );

    await client.query('COMMIT');

    return res.json({
      valid: true,
      applied: true,
      alreadyAssociated,
      message: 'Codice applicato',
      association: {
        structureId: discountCode.structure_id,
        structureName: discountCode.structure_name,
        structureAddress: discountCode.structure_address,
        inviteCode: normalizedDiscountCode,
        appliesTo: normalizeDiscountApplyTo(discountCode.apply_to) || 'bundle',
        cityId: discountCodeCityIds(discountCode)[0] || null,
        cityName: discountCodeCityNames(discountCode)[0] || null,
        cityIds: discountCodeCityIds(discountCode),
        cityNames: discountCodeCityNames(discountCode),
        userDiscountPercent: Number(
          (discountCode.apply_to === 'single'
            ? discountCode.user_discount_percent_single
            : discountCode.user_discount_percent_bundle) ||
            discountCode.user_discount_percent ||
            0
        ),
        userDiscountPercentSingle: Number(discountCode.user_discount_percent_single || discountCode.user_discount_percent || 0),
        userDiscountPercentBundle: Number(discountCode.user_discount_percent_bundle || discountCode.user_discount_percent || 0),
        structureFixedAmount: Number(
          (discountCode.apply_to === 'single'
            ? discountCode.structure_fixed_amount_single
            : discountCode.structure_fixed_amount_bundle) ||
            discountCode.structure_fixed_amount ||
            0
        ),
        structureFixedAmountSingle: Number(discountCode.structure_fixed_amount_single || discountCode.structure_fixed_amount || 0),
        structureFixedAmountBundle: Number(discountCode.structure_fixed_amount_bundle || discountCode.structure_fixed_amount || 0),
        codeStatus: 'valid',
        expiresAt: discountCode.expires_at
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.get('/me/hotel-association', async (req, res, next) => {
  const parsed = hotelAssociationQuerySchema.safeParse({ userId: String(req.query.userId || '').trim() });
  if (!parsed.success) {
    return res.status(400).json({ message: 'Missing userId query parameter' });
  }

  if (await haRispostoPerchiNonAutorizzato(req, res, parsed.data.userId)) {
    return;
  }

  const userId = parsed.data.userId;
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT
        l.user_id,
        l.structure_id,
        s.name AS structure_name,
        s.address AS structure_address,
        l.invite_code AS stored_invite_code,
        dc.id AS discount_code_id,
        dc.code AS discount_code,
        dc.apply_to,
        dc.city_id,
        dc.city_name,
        dc.city_ids,
        dc.city_names,
        dc.user_discount_percent,
        dc.user_discount_percent_single,
        dc.user_discount_percent_bundle,
        dc.structure_fixed_amount,
        dc.structure_fixed_amount_single,
        dc.structure_fixed_amount_bundle,
        dc.expires_at,
        usage.used_at AS code_used_at,
        CASE
          WHEN dc.id IS NULL THEN 'invalid'
          WHEN usage.used_at IS NOT NULL THEN 'used'
          WHEN dc.expires_at > NOW() THEN 'valid'
          ELSE 'expired'
        END AS code_status,
        l.associated_at,
        l.updated_at
      FROM app_user_structure_links l
      JOIN dashboard_structures s ON s.id = l.structure_id AND s.deleted = 0
      LEFT JOIN LATERAL (
        SELECT
          d.id,
          d.code,
          d.apply_to,
          d.city_id,
          legacy_city.name AS city_name,
          COALESCE(city_links.city_ids, CASE WHEN legacy_city.id IS NOT NULL THEN ARRAY[d.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
          COALESCE(city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
          d.user_discount_percent,
          d.user_discount_percent_single,
          d.user_discount_percent_bundle,
          d.structure_fixed_amount,
          d.structure_fixed_amount_single,
          d.structure_fixed_amount_bundle,
          d.expires_at,
          d.updated_at
        FROM dashboard_structure_discount_codes d
        LEFT JOIN cities legacy_city ON legacy_city.id = d.city_id AND legacy_city.publication_status = 'published'
        LEFT JOIN LATERAL (
          SELECT
            ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
            ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
          FROM dashboard_structure_discount_code_cities dcc
          JOIN cities c ON c.id = dcc.city_id AND c.publication_status = 'published'
          WHERE dcc.discount_code_id = d.id
        ) city_links ON TRUE
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
      WHERE l.user_id = $1
      LIMIT 1
      `,
      [userId]
    );

    const usedCodesResult = await client.query(
      `
      SELECT
        u.invite_code,
        COALESCE(u.structure_id, dc.structure_id) AS structure_id,
        COALESCE(s.name, ds.name) AS structure_name,
        COALESCE(s.address, ds.address) AS structure_address,
        dc.apply_to,
        dc.city_id,
        COALESCE(code_city_links.city_ids, CASE WHEN legacy_city.id IS NOT NULL THEN ARRAY[dc.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
        COALESCE(code_city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
        legacy_city.name AS city_name,
        dc.expires_at,
        u.used_at
      FROM app_user_discount_code_uses u
      LEFT JOIN dashboard_structure_discount_codes dc ON dc.id = u.discount_code_id
      LEFT JOIN dashboard_structures s ON s.id = u.structure_id
      LEFT JOIN dashboard_structures ds ON ds.id = dc.structure_id
      LEFT JOIN cities legacy_city ON legacy_city.id = dc.city_id AND legacy_city.publication_status = 'published'
      LEFT JOIN LATERAL (
        SELECT
          ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
          ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
        FROM dashboard_structure_discount_code_cities dcc
        JOIN cities c ON c.id = dcc.city_id AND c.publication_status = 'published'
        WHERE dcc.discount_code_id = dc.id
      ) code_city_links ON TRUE
      WHERE u.user_id = $1
      ORDER BY u.used_at DESC, u.id DESC
      `,
      [userId]
    );

    const codeHistory = usedCodesResult.rows.map((row) => ({
      inviteCode: normalizeInviteCode(row.invite_code),
      structureId: row.structure_id || null,
      structureName: row.structure_name || null,
      structureAddress: row.structure_address || null,
      appliesTo: normalizeDiscountApplyTo(row.apply_to) || null,
      cityId: discountCodeCityIds(row)[0] || null,
      cityName: discountCodeCityNames(row)[0] || null,
      cityIds: discountCodeCityIds(row),
      cityNames: discountCodeCityNames(row),
      status: 'used',
      expiresAt: row.expires_at || null,
      activatedAt: null,
      usedAt: row.used_at || null
    }));

    if (!result.rowCount) {
      return res.json({ associated: false, codes: codeHistory });
    }

    const row = result.rows[0];
    const inviteCode = normalizeInviteCode(row.stored_invite_code || row.discount_code || '');
    const currentStatus = row.code_status || 'invalid';

    if (inviteCode && !codeHistory.some((item) => item.inviteCode === inviteCode)) {
      codeHistory.unshift({
        inviteCode,
        structureId: row.structure_id || null,
        structureName: row.structure_name || null,
        structureAddress: row.structure_address || null,
        appliesTo: normalizeDiscountApplyTo(row.apply_to) || null,
        cityId: discountCodeCityIds(row)[0] || null,
        cityName: discountCodeCityNames(row)[0] || null,
        cityIds: discountCodeCityIds(row),
        cityNames: discountCodeCityNames(row),
        status: currentStatus === 'valid' ? 'activated' : currentStatus,
        expiresAt: row.expires_at || null,
        activatedAt: row.associated_at || null,
        usedAt: row.code_used_at || null
      });
    }

    return res.json({
      associated: true,
      association: {
        userId: row.user_id,
        structureId: row.structure_id,
        structureName: row.structure_name,
        structureAddress: row.structure_address,
        inviteCode,
        appliesTo: normalizeDiscountApplyTo(row.apply_to) || 'bundle',
        cityId: discountCodeCityIds(row)[0] || null,
        cityName: discountCodeCityNames(row)[0] || null,
        cityIds: discountCodeCityIds(row),
        cityNames: discountCodeCityNames(row),
        userDiscountPercent: Number(
          (row.apply_to === 'single' ? row.user_discount_percent_single : row.user_discount_percent_bundle) ||
            row.user_discount_percent ||
            0
        ),
        userDiscountPercentSingle: Number(row.user_discount_percent_single || row.user_discount_percent || 0),
        userDiscountPercentBundle: Number(row.user_discount_percent_bundle || row.user_discount_percent || 0),
        structureFixedAmount: Number(
          (row.apply_to === 'single' ? row.structure_fixed_amount_single : row.structure_fixed_amount_bundle) ||
            row.structure_fixed_amount ||
            0
        ),
        structureFixedAmountSingle: Number(row.structure_fixed_amount_single || row.structure_fixed_amount || 0),
        structureFixedAmountBundle: Number(row.structure_fixed_amount_bundle || row.structure_fixed_amount || 0),
        codeStatus: currentStatus,
        expiresAt: row.expires_at || null,
        associatedAt: row.associated_at,
        updatedAt: row.updated_at,
        codeUsedAt: row.code_used_at || null
      },
      codes: codeHistory
    });
  } catch (error) {
    return next(error);
  } finally {
    client.release();
  }
});

router.delete('/hotel/association', async (req, res, next) => {
  const parsed = hotelAssociationDeleteSchema.safeParse({ userId: String(req.query.userId || '').trim() });
  if (!parsed.success) {
    return res.status(400).json({ message: 'Missing userId query parameter' });
  }

  if (await haRispostoPerchiNonAutorizzato(req, res, parsed.data.userId)) {
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const associationResult = await client.query(
      `
      SELECT
        l.user_id,
        UPPER(COALESCE(dc.code, l.invite_code)) AS invite_code
      FROM app_user_structure_links l
      LEFT JOIN dashboard_structure_discount_codes dc ON dc.id = l.discount_code_id
      WHERE user_id = $1
      LIMIT 1
      FOR UPDATE OF l
      `,
      [parsed.data.userId]
    );

    if (!associationResult.rowCount) {
      await client.query('COMMIT');
      return res.json({
        removed: true,
        hadAssociation: false
      });
    }

    const currentInviteCode = normalizeInviteCode(associationResult.rows[0].invite_code);
    if (currentInviteCode) {
      const usedResult = await client.query(
        `
        SELECT 1
        FROM app_user_discount_code_uses
        WHERE user_id = $1
          AND invite_code = $2
        LIMIT 1
        `,
        [parsed.data.userId, currentInviteCode]
      );

      if (usedResult.rowCount) {
        await client.query('COMMIT');
        return res.status(409).json({
          removed: false,
          hadAssociation: true,
          message: 'Il codice è già stato usato e non può essere rimosso'
        });
      }
    }

    const deleteResult = await client.query(
      `
      DELETE FROM app_user_structure_links
      WHERE user_id = $1
      RETURNING user_id
      `,
      [parsed.data.userId]
    );

    await client.query('COMMIT');
    return res.json({
      removed: true,
      hadAssociation: deleteResult.rowCount > 0
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

export { router as apiRouter };
