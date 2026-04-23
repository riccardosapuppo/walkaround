import { pool } from '../src/db/pool.js';
import {
  DEFAULT_OPENAI_TRANSLATION_MODEL,
  OpenAITranslationError,
  normalizeOpenAITranslationModel,
  translatePoiWithOpenAI
} from '../src/services/openai-translations.js';

const TARGET_LANGUAGES = [
  { code: 'en', label: 'Inglese' },
  { code: 'fr', label: 'Francese' },
  { code: 'es', label: 'Spagnolo' },
  { code: 'de', label: 'Tedesco' },
  { code: 'pl', label: 'Polacco' }
];

const args = new Set(process.argv.slice(2));
const help = args.has('--help') || args.has('-h');
const dryRun = args.has('--dry-run');
const overwrite = args.has('--overwrite');
const MAX_CONSECUTIVE_FETCH_FAILURES = 5;

if (help) {
  console.log(`Uso:
  node scripts/translate-missing-pois.js [opzioni]

Opzioni:
  --dry-run     Mostra le traduzioni mancanti senza chiamare OpenAI
  --overwrite   Rigenera anche traduzioni gia presenti
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

function missingFieldsForLanguage(translations, language) {
  const languageFields = parseTranslations(translations)[language] || {};
  return ['descriptionShort', 'descriptionLong'].filter((field) => !String(languageFields[field] || '').trim());
}

function mergeTranslationFields(existingTranslations, language, translatedFields) {
  const translations = parseTranslations(existingTranslations);
  const currentFields = translations[language] || {};
  const nextFields = { ...currentFields };

  ['descriptionShort', 'descriptionLong'].forEach((field) => {
    const value = String(translatedFields?.[field] || '').trim();
    if (!value) {
      return;
    }
    if (overwrite || !String(nextFields[field] || '').trim()) {
      nextFields[field] = value;
    }
  });

  translations[language] = nextFields;
  return translations;
}

async function getOpenAiTranslationSettings() {
  const result = await pool.query(`
    SELECT api_key, model
    FROM dashboard_openai_translation_settings
    WHERE id = 1
    LIMIT 1
  `);

  const row = result.rows[0] || {};
  return {
    apiKey: String(row.api_key || '').trim(),
    model: normalizeOpenAITranslationModel(row.model || DEFAULT_OPENAI_TRANSLATION_MODEL)
  };
}

async function fetchPois() {
  const result = await pool.query(`
    SELECT
      p.id,
      p.city_id,
      c.name AS city_name,
      p.name,
      p.description_short,
      p.description_long,
      p.translations
    FROM pois p
    JOIN cities c ON c.id = p.city_id
    ORDER BY c.name ASC, p.name ASC
  `);

  return result.rows;
}

function buildJobs(pois) {
  const jobs = [];

  pois.forEach((poi) => {
    TARGET_LANGUAGES.forEach((language) => {
      const missingFields = overwrite ? ['descriptionShort', 'descriptionLong'] : missingFieldsForLanguage(poi.translations, language.code);
      if (!missingFields.length) {
        return;
      }
      jobs.push({ poi, language, missingFields });
    });
  });

  return jobs;
}

function formatUsage(usage) {
  const inputTokens = Number(usage?.inputTokens || 0);
  const outputTokens = Number(usage?.outputTokens || 0);
  const totalTokens = Number(usage?.totalTokens || 0);
  return `input ${inputTokens}, output ${outputTokens}, totale ${totalTokens}`;
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
  const settings = await getOpenAiTranslationSettings();
  if (!settings.apiKey) {
    throw new Error('API key OpenAI non configurata nella dashboard.');
  }

  const pois = await fetchPois();
  const jobs = buildJobs(pois);

  console.log(`POI totali: ${pois.length}`);
  console.log(`Traduzioni da completare: ${jobs.length}`);
  console.log(`Modello: ${settings.model}`);
  console.log(`Overwrite: ${overwrite ? 'si' : 'no'}`);
  if (dryRun) {
    console.log('Dry run: nessuna traduzione verra eseguita.');
    jobs.forEach((job, index) => {
      console.log(
        `[${index + 1}/${jobs.length}] ${job.poi.city_name} - ${job.language.label} - ${job.poi.name} ` +
          `(mancano: ${job.missingFields.join(', ')})`
      );
    });
    return;
  }

  let completed = 0;
  let failed = 0;
  let consecutiveFetchFailures = 0;
  const usageTotal = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

  for (const job of jobs) {
    const prefix = `[${completed + failed + 1}/${jobs.length}] ${job.poi.city_name} - ${job.language.label} - ${job.poi.name}`;
    console.log(`${prefix} - avvio`);

    try {
      const latestPoiResult = await pool.query('SELECT * FROM pois WHERE id = $1 LIMIT 1', [job.poi.id]);
      const latestPoi = latestPoiResult.rows[0] || job.poi;
      const latestMissingFields = overwrite ? ['descriptionShort', 'descriptionLong'] : missingFieldsForLanguage(latestPoi.translations, job.language.code);
      if (!latestMissingFields.length) {
        completed += 1;
        console.log(`${prefix} - gia completa`);
        continue;
      }

      const response = await translatePoiWithOpenAI({
        apiKey: settings.apiKey,
        model: settings.model,
        targetLanguage: job.language.code,
        poi: latestPoi
      });

      const mergedTranslations = mergeTranslationFields(latestPoi.translations, job.language.code, response.translation);
      await pool.query('UPDATE pois SET translations = $1::jsonb WHERE id = $2', [JSON.stringify(mergedTranslations), job.poi.id]);

      usageTotal.inputTokens += Number(response.usage?.inputTokens || 0);
      usageTotal.outputTokens += Number(response.usage?.outputTokens || 0);
      usageTotal.totalTokens += Number(response.usage?.totalTokens || 0);
      completed += 1;
      consecutiveFetchFailures = 0;

      console.log(`${prefix} - ok (${formatUsage(response.usage)})`);
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
  console.log(`Completate: ${completed}`);
  console.log(`Errori: ${failed}`);
  console.log(`Token totali: ${formatUsage(usageTotal)}`);
}

run()
  .catch((error) => {
    console.error(errorMessage(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
