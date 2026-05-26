import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/db/pool.js';
import {
  DEFAULT_OPENAI_TTS_INSTRUCTIONS,
  OpenAITranslationError,
  generateSpeechWithOpenAI,
  normalizeOpenAITtsInstructions,
  normalizeOpenAITtsModel,
  normalizeOpenAITtsVoice
} from '../src/services/openai-translations.js';

const TARGET_LANGUAGES = [
  { code: 'en', label: 'Inglese' },
  { code: 'fr', label: 'Francese' },
  { code: 'es', label: 'Spagnolo' },
  { code: 'de', label: 'Tedesco' },
  { code: 'pl', label: 'Polacco' }
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicAudioRootDir = path.resolve(__dirname, '../public/audio');
const audioManifestPath = path.resolve(__dirname, '../media-manifests/poi-audio-manifest.json');

const TTS_MODEL = 'gpt-4o-mini-tts';
const TTS_VOICE = 'marin';
const MAX_CONSECUTIVE_FETCH_FAILURES = 5;

const args = new Set(process.argv.slice(2));
const help = args.has('--help') || args.has('-h');
const dryRun = args.has('--dry-run');
const overwrite = args.has('--overwrite');

if (help) {
  console.log(`Uso:
  node scripts/generate-missing-poi-audios.js [opzioni]

Opzioni:
  --dry-run     Mostra gli audio mancanti senza chiamare OpenAI
  --overwrite   Rigenera anche audio gia presenti
  --help        Mostra questo messaggio
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

function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function buildTranslatedPoiSpeechInput(translation) {
  const descriptionLong = String(translation?.descriptionLong || '').trim();
  const descriptionShort = String(translation?.descriptionShort || '').trim();
  return descriptionLong || descriptionShort;
}

function audioUrlForLanguage(translations, language) {
  const languageFields = parseTranslations(translations)[language] || {};
  return String(languageFields.audioUrl || '').trim();
}

function speechInputForLanguage(translations, language) {
  const languageFields = parseTranslations(translations)[language] || {};
  return buildTranslatedPoiSpeechInput(languageFields);
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

function emptyAudioManifest() {
  return {
    version: 1,
    updatedAt: null,
    items: []
  };
}

async function readAudioManifest() {
  try {
    const raw = await fs.readFile(audioManifestPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.items)) {
      return emptyAudioManifest();
    }
    return {
      version: 1,
      updatedAt: parsed.updatedAt || null,
      items: parsed.items
    };
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return emptyAudioManifest();
    }
    throw error;
  }
}

async function writeAudioManifest(manifest) {
  const items = [...manifest.items].sort((left, right) => {
    const leftKey = `${left.cityName || ''}|${left.poiName || ''}|${left.language || ''}`;
    const rightKey = `${right.cityName || ''}|${right.poiName || ''}|${right.language || ''}`;
    return leftKey.localeCompare(rightKey);
  });
  const nextManifest = {
    version: 1,
    updatedAt: new Date().toISOString(),
    items
  };

  await fs.mkdir(path.dirname(audioManifestPath), { recursive: true });
  await fs.writeFile(audioManifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`);
}

async function recordAudioManifestItem(item) {
  const manifest = await readAudioManifest();
  const itemsByKey = new Map(manifest.items.map((manifestItem) => [`${manifestItem.poiId}:${manifestItem.language}`, manifestItem]));
  itemsByKey.set(`${item.poiId}:${item.language}`, item);
  await writeAudioManifest({
    ...manifest,
    items: Array.from(itemsByKey.values())
  });
}

async function getOpenAiAudioSettings() {
  const result = await pool.query(`
    SELECT api_key, tts_instructions
    FROM dashboard_openai_translation_settings
    WHERE id = 1
    LIMIT 1
  `);

  const row = result.rows[0] || {};
  return {
    apiKey: String(row.api_key || '').trim(),
    model: normalizeOpenAITtsModel(TTS_MODEL),
    voice: normalizeOpenAITtsVoice(TTS_VOICE),
    instructions: normalizeOpenAITtsInstructions(row.tts_instructions || DEFAULT_OPENAI_TTS_INSTRUCTIONS)
  };
}

async function fetchPois() {
  const result = await pool.query(`
    SELECT
      p.id,
      p.city_id,
      c.name AS city_name,
      p.name,
      p.translations
    FROM pois p
    JOIN cities c ON c.id = p.city_id
    ORDER BY c.name ASC, p.name ASC
  `);

  return result.rows;
}

function buildJobs(pois) {
  const jobs = [];
  const skippedWithoutText = [];

  pois.forEach((poi) => {
    TARGET_LANGUAGES.forEach((language) => {
      const existingAudioUrl = audioUrlForLanguage(poi.translations, language.code);
      if (existingAudioUrl && !overwrite) {
        return;
      }

      const speechInput = speechInputForLanguage(poi.translations, language.code);
      const job = { poi, language, existingAudioUrl, speechInput };
      if (!speechInput) {
        skippedWithoutText.push(job);
        return;
      }

      jobs.push(job);
    });
  });

  return { jobs, skippedWithoutText };
}

async function storeGeneratedPoiAudio({ cityName, cityId, poiName, targetLanguage, audioBuffer }) {
  const cityFolderSlug = slugify(cityName) || slugify(cityId) || 'citta';
  const cityAudioDir = path.join(publicAudioRootDir, cityFolderSlug);
  await fs.mkdir(cityAudioDir, { recursive: true });

  const baseName = slugify(`${poiName}-${targetLanguage}`) || `audio-${targetLanguage}`;
  const storedFileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${baseName}.mp3`;
  const absolutePath = path.join(cityAudioDir, storedFileName);
  await fs.writeFile(absolutePath, audioBuffer);

  return `/public/audio/${cityFolderSlug}/${storedFileName}`;
}

function errorMessage(error) {
  if (error instanceof OpenAITranslationError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Errore sconosciuto';
}

async function run() {
  const settings = await getOpenAiAudioSettings();
  if (!settings.apiKey) {
    throw new Error('API key OpenAI non configurata nella dashboard.');
  }

  const pois = await fetchPois();
  const { jobs, skippedWithoutText } = buildJobs(pois);

  console.log(`POI totali: ${pois.length}`);
  console.log(`Audio da generare: ${jobs.length}`);
  console.log(`Audio non generabili per testo tradotto mancante: ${skippedWithoutText.length}`);
  console.log(`Modello audio: ${settings.model}`);
  console.log(`Voce audio: ${settings.voice}`);
  console.log(`Overwrite: ${overwrite ? 'si' : 'no'}`);

  if (dryRun) {
    console.log('Dry run: nessun audio verra generato.');
    jobs.forEach((job, index) => {
      const action = job.existingAudioUrl ? 'rigenera' : 'manca audio';
      console.log(`[${index + 1}/${jobs.length}] ${job.poi.city_name} - ${job.language.label} - ${job.poi.name} (${action})`);
    });
    if (skippedWithoutText.length) {
      console.log('---');
      console.log('Saltati per testo tradotto mancante:');
      skippedWithoutText.forEach((job) => {
        console.log(`${job.poi.city_name} - ${job.language.label} - ${job.poi.name}`);
      });
    }
    return;
  }

  let completed = 0;
  let failed = 0;
  let consecutiveFetchFailures = 0;

  for (const job of jobs) {
    const prefix = `[${completed + failed + 1}/${jobs.length}] ${job.poi.city_name} - ${job.language.label} - ${job.poi.name}`;
    console.log(`${prefix} - avvio`);

    try {
      const latestPoiResult = await pool.query('SELECT * FROM pois WHERE id = $1 LIMIT 1', [job.poi.id]);
      const latestPoi = latestPoiResult.rows[0] || job.poi;
      const existingAudioUrl = audioUrlForLanguage(latestPoi.translations, job.language.code);
      if (existingAudioUrl && !overwrite) {
        completed += 1;
        console.log(`${prefix} - gia presente`);
        continue;
      }

      const speechInput = speechInputForLanguage(latestPoi.translations, job.language.code);
      if (!speechInput) {
        failed += 1;
        console.log(`${prefix} - errore: testo tradotto mancante`);
        continue;
      }

      const { audioBuffer } = await generateSpeechWithOpenAI({
        apiKey: settings.apiKey,
        model: settings.model,
        voice: settings.voice,
        instructions: settings.instructions,
        input: speechInput
      });

      const audioUrl = await storeGeneratedPoiAudio({
        cityName: job.poi.city_name,
        cityId: job.poi.city_id,
        poiName: job.poi.name,
        targetLanguage: job.language.code,
        audioBuffer
      });

      const refreshedPoiResult = await pool.query('SELECT translations FROM pois WHERE id = $1 LIMIT 1', [job.poi.id]);
      const refreshedPoi = refreshedPoiResult.rows[0] || latestPoi;
      const mergedTranslations = mergeAudioUrl(refreshedPoi.translations, job.language.code, audioUrl);
      await pool.query('UPDATE pois SET translations = $1::jsonb WHERE id = $2', [JSON.stringify(mergedTranslations), job.poi.id]);
      await recordAudioManifestItem({
        poiId: job.poi.id,
        poiName: job.poi.name,
        cityId: job.poi.city_id,
        cityName: job.poi.city_name,
        language: job.language.code,
        audioUrl,
        model: settings.model,
        voice: settings.voice,
        generatedAt: new Date().toISOString()
      });

      completed += 1;
      consecutiveFetchFailures = 0;
      console.log(`${prefix} - ok (${audioUrl})`);
    } catch (error) {
      failed += 1;
      const message = errorMessage(error);
      console.log(`${prefix} - errore: ${message}`);

      if (message === 'fetch failed') {
        consecutiveFetchFailures += 1;
        if (consecutiveFetchFailures >= MAX_CONSECUTIVE_FETCH_FAILURES) {
          console.log(`Interrotto: ${MAX_CONSECUTIVE_FETCH_FAILURES} errori di rete consecutivi verso OpenAI.`);
          break;
        }
      } else {
        consecutiveFetchFailures = 0;
      }
    }
  }

  console.log('---');
  console.log(`Completati: ${completed}`);
  console.log(`Errori: ${failed}`);
  console.log(`Saltati per testo tradotto mancante: ${skippedWithoutText.length}`);
  if (completed > 0) {
    console.log(`Manifest aggiornato: ${path.relative(process.cwd(), audioManifestPath)}`);
  }
}

run()
  .catch((error) => {
    console.error(errorMessage(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
