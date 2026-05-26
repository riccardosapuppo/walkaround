import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/db/pool.js';

const TARGET_LANGUAGES = new Set(['en', 'fr', 'es', 'de', 'pl']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicRootDir = path.resolve(__dirname, '../public');
const defaultManifestPath = path.resolve(__dirname, '../media-manifests/poi-audio-manifest.json');

const args = new Set(process.argv.slice(2));
const help = args.has('--help') || args.has('-h');
const dryRun = args.has('--dry-run');
const overwrite = args.has('--overwrite');
const manifestArg = process.argv.slice(2).find((arg) => arg.startsWith('--manifest='));
const manifestPath = manifestArg ? path.resolve(process.cwd(), manifestArg.slice('--manifest='.length)) : defaultManifestPath;

if (help) {
  console.log(`Uso:
  node scripts/apply-poi-audio-manifest.js [opzioni]

Opzioni:
  --dry-run             Mostra cosa verrebbe aggiornato senza modificare il DB
  --overwrite           Sovrascrive audioUrl gia presenti nel DB
  --manifest=percorso   Usa un manifest diverso da media-manifests/poi-audio-manifest.json
  --help                Mostra questo messaggio
`);
  process.exit(0);
}

function parseTranslations(value) {
  if (!value) {
    return {};
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value;
  }
  try {
    const parsed = JSON.parse(String(value));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function audioUrlForLanguage(translations, language) {
  const languageFields = parseTranslations(translations)[language] || {};
  return String(languageFields.audioUrl || '').trim();
}

function mergeAudioUrl(existingTranslations, language, audioUrl) {
  const translations = parseTranslations(existingTranslations);
  const currentFields = translations[language] || {};
  translations[language] = {
    ...currentFields,
    audioUrl
  };
  return translations;
}

function absolutePathFromPublicUrl(publicUrl) {
  const normalizedUrl = String(publicUrl || '').trim();
  if (!normalizedUrl.startsWith('/public/audio/')) {
    return null;
  }

  const relativePath = normalizedUrl.slice('/public/'.length);
  const absolutePath = path.resolve(publicRootDir, relativePath);
  if (!absolutePath.startsWith(publicRootDir)) {
    return null;
  }
  return absolutePath;
}

async function pathExists(absolutePath) {
  try {
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

async function readManifest() {
  const raw = await fs.readFile(manifestPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.items)) {
    throw new Error('Manifest audio non valido.');
  }
  return parsed.items;
}

function errorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Errore sconosciuto';
}

async function run() {
  const items = await readManifest();
  console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)}`);
  console.log(`Record nel manifest: ${items.length}`);
  console.log(`Overwrite: ${overwrite ? 'si' : 'no'}`);
  if (dryRun) {
    console.log('Dry run: nessun aggiornamento DB verra eseguito.');
  }

  let applied = 0;
  let skippedExisting = 0;
  let skippedInvalid = 0;
  let missingFiles = 0;
  let missingPois = 0;

  for (const item of items) {
    const poiId = String(item.poiId || '').trim();
    const language = String(item.language || '').trim();
    const audioUrl = String(item.audioUrl || '').trim();
    const label = `${item.cityName || item.cityId || '-'} - ${language || '-'} - ${item.poiName || poiId || '-'}`;

    if (!poiId || !TARGET_LANGUAGES.has(language) || !audioUrl) {
      skippedInvalid += 1;
      console.log(`${label} - saltato: record manifest non valido`);
      continue;
    }

    const absoluteAudioPath = absolutePathFromPublicUrl(audioUrl);
    if (!absoluteAudioPath || !(await pathExists(absoluteAudioPath))) {
      missingFiles += 1;
      console.log(`${label} - saltato: file audio assente (${audioUrl})`);
      continue;
    }

    const result = await pool.query('SELECT id, translations FROM pois WHERE id = $1 LIMIT 1', [poiId]);
    const poi = result.rows[0];
    if (!poi) {
      missingPois += 1;
      console.log(`${label} - saltato: POI non trovato (${poiId})`);
      continue;
    }

    const existingAudioUrl = audioUrlForLanguage(poi.translations, language);
    if (existingAudioUrl && !overwrite) {
      skippedExisting += 1;
      console.log(`${label} - gia presente`);
      continue;
    }

    if (!dryRun) {
      const mergedTranslations = mergeAudioUrl(poi.translations, language, audioUrl);
      await pool.query('UPDATE pois SET translations = $1::jsonb WHERE id = $2', [JSON.stringify(mergedTranslations), poiId]);
    }

    applied += 1;
    console.log(`${label} - ${dryRun ? 'da applicare' : 'applicato'} (${audioUrl})`);
  }

  console.log('---');
  console.log(`${dryRun ? 'Da applicare' : 'Applicati'}: ${applied}`);
  console.log(`Gia presenti: ${skippedExisting}`);
  console.log(`Record invalidi: ${skippedInvalid}`);
  console.log(`File mancanti: ${missingFiles}`);
  console.log(`POI mancanti: ${missingPois}`);
}

run()
  .catch((error) => {
    console.error(errorMessage(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
