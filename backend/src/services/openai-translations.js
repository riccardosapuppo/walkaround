export const DEFAULT_OPENAI_TRANSLATION_MODEL = 'gpt-4o-mini';
export const DEFAULT_OPENAI_TTS_MODEL = 'gpt-4o-mini-tts';
export const DEFAULT_OPENAI_TTS_VOICE = 'alloy';
export const DEFAULT_OPENAI_TTS_INSTRUCTIONS =
  'Narrazione chiara, naturale e professionale per una audioguida turistica. Ritmo medio, tono coinvolgente e pronuncia curata dei nomi propri italiani.';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const OPENAI_SPEECH_URL = 'https://api.openai.com/v1/audio/speech';
const REQUEST_TIMEOUT_MS = 90_000;
const SPEECH_REQUEST_TIMEOUT_MS = 120_000;
const SPEECH_INPUT_MAX_CHARS = 4096;
const TTS_VOICES = new Set(['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer', 'verse', 'marin', 'cedar']);
const TARGET_LANGUAGE_LABELS = {
  en: 'inglese',
  fr: 'francese',
  es: 'spagnolo',
  de: 'tedesco',
  pl: 'polacco'
};

export class OpenAITranslationError extends Error {
  constructor(message, status = 502, details = null) {
    super(message);
    this.name = 'OpenAITranslationError';
    this.status = status;
    this.details = details;
  }
}

export function normalizeOpenAITranslationModel(value) {
  const normalized = String(value || '').trim();
  return normalized || DEFAULT_OPENAI_TRANSLATION_MODEL;
}

export function normalizeOpenAITtsModel(value) {
  const normalized = String(value || '').trim();
  return normalized || DEFAULT_OPENAI_TTS_MODEL;
}

export function normalizeOpenAITtsVoice(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return TTS_VOICES.has(normalized) ? normalized : DEFAULT_OPENAI_TTS_VOICE;
}

export function normalizeOpenAITtsInstructions(value) {
  const normalized = String(value || '').trim();
  return normalized || DEFAULT_OPENAI_TTS_INSTRUCTIONS;
}

export function normalizeOpenAIUsage(usage) {
  const inputTokens = safeUsageNumber(usage?.input_tokens ?? usage?.inputTokens ?? usage?.prompt_tokens);
  const outputTokens = safeUsageNumber(usage?.output_tokens ?? usage?.outputTokens ?? usage?.completion_tokens);
  const totalTokens = safeUsageNumber(usage?.total_tokens ?? usage?.totalTokens) || inputTokens + outputTokens;

  return {
    inputTokens,
    outputTokens,
    totalTokens
  };
}

export async function translatePoiWithOpenAI({ apiKey, model, targetLanguage, poi }) {
  const normalizedApiKey = String(apiKey || '').trim();
  if (!normalizedApiKey) {
    throw new OpenAITranslationError('Configura una API key OpenAI prima di avviare la traduzione.', 400);
  }

  const languageLabel = TARGET_LANGUAGE_LABELS[targetLanguage];
  if (!languageLabel) {
    throw new OpenAITranslationError('Lingua di destinazione non supportata.', 400);
  }

  const source = {
    descriptionShort: String(poi?.description_short || poi?.descriptionShort || '').trim(),
    descriptionLong: String(poi?.description_long || poi?.descriptionLong || '').trim()
  };

  if (!source.descriptionShort && !source.descriptionLong) {
    throw new OpenAITranslationError('Il luogo non contiene testo italiano da tradurre.', 400);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${normalizedApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: normalizeOpenAITranslationModel(model),
        input: [
          {
            role: 'system',
            content:
              'Sei un traduttore professionale per contenuti turistici. Traduci dall italiano mantenendo i nomi propri in italiano, tono naturale e informazioni fattuali. Non tradurre mai il nome del punto di interesse. Rispondi solo con JSON valido conforme allo schema.'
          },
          {
            role: 'user',
            content: JSON.stringify({
              sourceLanguage: 'italiano',
              targetLanguage: languageLabel,
              fields: source
            })
          }
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'poi_translation',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: ['descriptionShort', 'descriptionLong'],
              properties: {
                descriptionShort: { type: 'string' },
                descriptionLong: { type: 'string' }
              }
            }
          }
        }
      }),
      signal: controller.signal
    });

    const payload = await parseOpenAIResponseBody(response);
    if (!response.ok) {
      const message = payload?.error?.message || payload?.message || 'Errore durante la chiamata OpenAI.';
      throw new OpenAITranslationError(`OpenAI: ${message}`, response.status, payload);
    }

    const outputText = extractOutputText(payload);
    if (!outputText) {
      throw new OpenAITranslationError('OpenAI non ha restituito testo traducibile.', 502, payload);
    }

    const parsed = parseJsonObject(outputText);
    const translation = {
      descriptionShort: normalizeTranslationText(parsed.descriptionShort, 1000),
      descriptionLong: normalizeTranslationText(parsed.descriptionLong, 10000)
    };

    if (!translation.descriptionShort && !translation.descriptionLong) {
      throw new OpenAITranslationError('OpenAI ha restituito una traduzione vuota.', 502, payload);
    }

    return {
      translation,
      usage: normalizeOpenAIUsage(payload?.usage)
    };
  } catch (error) {
    if (error instanceof OpenAITranslationError) {
      throw error;
    }
    if (error?.name === 'AbortError') {
      throw new OpenAITranslationError('La richiesta OpenAI ha superato il tempo massimo.', 504);
    }
    throw new OpenAITranslationError(error instanceof Error ? error.message : 'Errore chiamata OpenAI.', 502);
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateSpeechWithOpenAI({ apiKey, model, voice, instructions, input }) {
  const normalizedApiKey = String(apiKey || '').trim();
  if (!normalizedApiKey) {
    throw new OpenAITranslationError('Configura una API key OpenAI prima di generare l audio.', 400);
  }

  const speechInput = normalizeSpeechInput(input);
  if (!speechInput) {
    throw new OpenAITranslationError('Il testo tradotto non contiene contenuto da trasformare in audio.', 400);
  }

  const speechModel = normalizeOpenAITtsModel(model);
  const requestBody = {
    model: speechModel,
    voice: normalizeOpenAITtsVoice(voice),
    input: speechInput,
    response_format: 'mp3'
  };

  const normalizedInstructions = normalizeOpenAITtsInstructions(instructions);
  if (supportsTtsInstructions(speechModel) && normalizedInstructions) {
    requestBody.instructions = normalizedInstructions;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SPEECH_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_SPEECH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${normalizedApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    if (!response.ok) {
      const payload = await parseOpenAIErrorBody(response);
      const message = payload?.error?.message || payload?.message || 'Errore durante la generazione audio OpenAI.';
      throw new OpenAITranslationError(`OpenAI: ${message}`, response.status, payload);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    if (!audioBuffer.length) {
      throw new OpenAITranslationError('OpenAI ha restituito un audio vuoto.', 502);
    }

    return {
      audioBuffer,
      contentType: response.headers.get('content-type') || 'audio/mpeg'
    };
  } catch (error) {
    if (error instanceof OpenAITranslationError) {
      throw error;
    }
    if (error?.name === 'AbortError') {
      throw new OpenAITranslationError('La generazione audio OpenAI ha superato il tempo massimo.', 504);
    }
    throw new OpenAITranslationError(error instanceof Error ? error.message : 'Errore generazione audio OpenAI.', 502);
  } finally {
    clearTimeout(timeout);
  }
}

export async function translateHtmlWithOpenAI({ apiKey, model, sourceLanguage = 'italiano', targetLanguage, html }) {
  const normalizedApiKey = String(apiKey || '').trim();
  if (!normalizedApiKey) {
    throw new OpenAITranslationError('Configura una API key OpenAI prima di avviare la traduzione.', 400);
  }

  const languageLabel = TARGET_LANGUAGE_LABELS[targetLanguage];
  if (!languageLabel) {
    throw new OpenAITranslationError('Lingua di destinazione non supportata.', 400);
  }

  const sourceHtml = String(html || '').trim();
  if (!sourceHtml) {
    throw new OpenAITranslationError('La privacy policy non contiene testo da tradurre.', 400);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${normalizedApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: normalizeOpenAITranslationModel(model),
        input: [
          {
            role: 'system',
            content:
              'Sei un traduttore professionale di privacy policy e testi legali per applicazioni turistiche. Traduci solo il testo leggibile. Mantieni intatti struttura HTML, tag, attributi, grassetti, corsivi, liste, titoli, link e ordine dei paragrafi. Non aggiungere Markdown. Rispondi solo con JSON valido conforme allo schema.'
          },
          {
            role: 'user',
            content: JSON.stringify({
              sourceLanguage,
              targetLanguage: languageLabel,
              html: sourceHtml
            })
          }
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'html_translation',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: ['html'],
              properties: {
                html: { type: 'string' }
              }
            }
          }
        }
      }),
      signal: controller.signal
    });

    const payload = await parseOpenAIResponseBody(response);
    if (!response.ok) {
      const message = payload?.error?.message || payload?.message || 'Errore durante la chiamata OpenAI.';
      throw new OpenAITranslationError(`OpenAI: ${message}`, response.status, payload);
    }

    const outputText = extractOutputText(payload);
    if (!outputText) {
      throw new OpenAITranslationError('OpenAI non ha restituito testo traducibile.', 502, payload);
    }

    const parsed = parseJsonObject(outputText);
    const translatedHtml = normalizeTranslationText(parsed.html, 120000);
    if (!translatedHtml) {
      throw new OpenAITranslationError('OpenAI ha restituito una traduzione vuota.', 502, payload);
    }

    return {
      html: translatedHtml,
      usage: normalizeOpenAIUsage(payload?.usage)
    };
  } catch (error) {
    if (error instanceof OpenAITranslationError) {
      throw error;
    }
    if (error?.name === 'AbortError') {
      throw new OpenAITranslationError('La richiesta OpenAI ha superato il tempo massimo.', 504);
    }
    throw new OpenAITranslationError(error instanceof Error ? error.message : 'Errore chiamata OpenAI.', 502);
  } finally {
    clearTimeout(timeout);
  }
}

async function parseOpenAIErrorBody(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function parseOpenAIResponseBody(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const chunks = [];
  if (Array.isArray(payload?.output)) {
    payload.output.forEach((item) => {
      if (!Array.isArray(item?.content)) {
        return;
      }
      item.content.forEach((content) => {
        if (typeof content?.text === 'string') {
          chunks.push(content.text);
        }
      });
    });
  }

  return chunks.join('').trim();
}

function parseJsonObject(text) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw new OpenAITranslationError('Risposta OpenAI non valida: JSON assente.', 502);
  }
}

function normalizeTranslationText(value, maxLength) {
  const normalized = String(value || '').trim();
  return maxLength > 0 ? normalized.slice(0, maxLength) : normalized;
}

function normalizeSpeechInput(value) {
  const normalized = String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (normalized.length <= SPEECH_INPUT_MAX_CHARS) {
    return normalized;
  }

  return `${normalized.slice(0, SPEECH_INPUT_MAX_CHARS - 3).trimEnd()}...`;
}

function supportsTtsInstructions(model) {
  return normalizeOpenAITtsModel(model).startsWith('gpt-4o-mini-tts');
}

function safeUsageNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.round(number) : 0;
}
