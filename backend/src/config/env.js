/**
 * La configurazione, e che cosa succede quando manca.
 *
 * QUESTO FILE AVEVA LE PASSWORD DENTRO, come valori di ripiego:
 *
 *     password: process.env.DB_PASSWORD || '<la password vera>'
 *
 * Il ripiego era la parte pericolosa, più ancora del fatto che la stringa
 * fosse in chiaro. Una password scritta qui finisce in git e la si toglie; una
 * password scritta qui *come ripiego* fa anche un'altra cosa: se la variabile
 * d'ambiente non arriva — un .env dimenticato, una riga scritta male nel
 * compose, un container ricostruito senza — il programma parte lo stesso, si
 * collega, funziona, e nessuno si accorge di niente. Il guasto non fa rumore,
 * e il servizio resta in piedi sulla credenziale che sta nella storia del
 * repository.
 *
 * Adesso i segreti non hanno ripiego: se mancano, il programma si ferma e dice
 * quali. È scomodo apposta. Un avvio fallito è un problema che si vede, ed è la
 * categoria giusta in cui mettere questo.
 *
 * Restano con un default i valori non segreti — porta, host, origine CORS —
 * perché sbagliarli non espone niente.
 */

import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env');

dotenv.config({ path: envPath });

const missing = [];

/**
 * Un valore che non ha un default accettabile.
 *
 * Raccoglie invece di sollevare subito: chi ha appena clonato il progetto
 * vuole sapere che gliene mancano tre, non scoprirne una per volta a ogni
 * riavvio.
 */
function required(name) {
  const value = process.env[name];
  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }
  missing.push(name);
  return '';
}

/** Un valore che può non esserci, e la cui assenza spegne una funzione intera. */
function optional(name) {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

function parsePositiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseSeedMode(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'always' || normalized === 'if-empty' || normalized === 'never') {
    return normalized;
  }
  return 'if-empty';
}

const smtpHost = optional('SMTP_HOST');
const smtpUser = optional('SMTP_USER');
const smtpPassword = optional('SMTP_PASSWORD');

export const env = {
  port: Number(process.env.PORT || 3000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  appBaseOrigin: process.env.APP_BASE_ORIGIN || process.env.CORS_ORIGIN || 'http://localhost:4200',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'walkaround_db',
    user: process.env.DB_USER || 'walkaround',
    password: required('DB_PASSWORD'),
    seedMode: parseSeedMode(process.env.DB_SEED_MODE)
  },
  auth: {
    /*
     * L'amministratore non è più obbligatorio, ed è un cambiamento voluto.
     * Prima esisteva sempre, con una password di ripiego, e veniva riscritto a
     * ogni avvio: cambiarla dalla dashboard non serviva a niente, perché il
     * riavvio dopo la rimetteva com'era. Adesso, senza queste due, l'utente
     * non viene toccato — vedi `seedAdminUser` in db/init.js.
     */
    adminEmail: optional('ADMIN_EMAIL'),
    adminPassword: optional('ADMIN_PASSWORD'),
    sessionTtlHours: parsePositiveNumber(process.env.AUTH_SESSION_TTL_HOURS, 168),
    inviteTtlHours: parsePositiveNumber(process.env.AUTH_INVITE_TTL_HOURS, 720),
    passwordResetTtlHours: parsePositiveNumber(process.env.AUTH_PASSWORD_RESET_TTL_HOURS, 24)
  },
  smtp: {
    /*
     * La posta è tutta opzionale: un progetto che si rifiuta di partire
     * perché non sa mandare una email è un progetto che nessuno prova in
     * locale.
     *
     * `enabled` dice solo com'è messo L'AMBIENTE, e non è l'ultima parola:
     * le impostazioni email si cambiano anche dalla dashboard e vivono su una
     * tabella, quindi un'installazione senza SMTP_* può benissimo spedire.
     * Chi deve sapere se l'invio è possibile lo chiede a `getTransporter`
     * (services/mailer.js), che guarda le impostazioni vere e, se manca
     * l'host, solleva un errore che lo dice a parole.
     *
     * Questo campo serve ai seed e alla diagnostica: è la risposta a «di
     * default questa macchina sa spedire?», non a «adesso può?».
     */
    enabled: Boolean(smtpHost && smtpUser && smtpPassword),
    host: smtpHost,
    port: parsePositiveNumber(process.env.SMTP_PORT, 465),
    secure: String(process.env.SMTP_SECURE || 'true').toLowerCase() !== 'false',
    user: smtpUser,
    password: smtpPassword,
    from: process.env.SMTP_FROM || 'Walk Around <no-reply@localhost>'
  }
};

if (missing.length) {
  throw new Error(
    [
      '',
      'Manca la configurazione, e non parto senza.',
      '',
      ...missing.map((name) => `  ${name}`),
      '',
      '  cp backend/.env.example backend/.env   e riempilo.',
      '',
      "  Non c'è un valore di ripiego, apposta: prima c'era, e voleva dire che",
      '  una variabile dimenticata non si notava mai — il programma partiva',
      '  lo stesso, sulla password scritta nel codice.',
      ''
    ].join('\n')
  );
}
