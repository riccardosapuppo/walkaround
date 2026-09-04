/**
 * Su quale indirizzo si costruisce un link che finisce dentro una email.
 *
 * IL PROBLEMA CHE QUESTO FILE RISOLVE, per esteso, perche' e' istruttivo.
 *
 * La rotta di reset password accettava l'origine dal corpo della richiesta e
 * controllava soltanto che lo schema fosse http o https:
 *
 *     POST /api/app-auth/password-reset
 *     { "email": "vittima@esempio.it", "origin": "https://sito-di-chi-attacca" }
 *
 * Il servizio mandava alla vittima una email vera, dal dominio giusto, con
 * dentro un token di reset valido — puntato al server di chi attacca. Un clic
 * e l'account cambiava padrone. Non serviva essere autenticati, e la vittima
 * vedeva un messaggio legittimo perche' lo era.
 *
 * Il difetto non e' "mancava una validazione". E' che **la domanda era
 * sbagliata**: si chiedeva "questa stringa e' una URL ben formata?", che e'
 * una domanda sulla forma, quando quella che conta e' "questo indirizzo e'
 * uno dei nostri?", che e' una domanda sull'identita' e a cui si puo'
 * rispondere solo con un elenco. Non esiste una regola che distingua il
 * proprio dominio da quello di un altro: bisogna averlo scritto.
 */

/**
 * Normalizza un elenco di origini in un insieme confrontabile.
 *
 * Quello che arriva puo' essere `https://esempio.it/`, con la barra finale, o
 * con la porta di default scritta per esteso. `new URL(...).origin` riduce
 * tutte queste alla stessa forma, che e' l'unico modo perche' il confronto
 * dopo abbia senso.
 *
 * @param {Array<string|null|undefined>} values
 * @returns {Set<string>}
 */
export function toOriginSet(values) {
  const origins = new Set();

  for (const value of values || []) {
    for (const piece of String(value || '').split(',')) {
      const trimmed = piece.trim();
      if (!trimmed) {
        continue;
      }
      try {
        origins.add(new URL(trimmed).origin);
      } catch {
        // Una voce di configurazione scritta male non e' un'origine
        // consentita: si scarta invece di provare a raddrizzarla.
      }
    }
  }

  return origins;
}

/**
 * Quali origini sono nostre, secondo la configurazione.
 *
 * Sta qui e non nelle rotte perche' l'elenco era stato costruito in un file
 * solo. `app-auth.js` chiedeva "e' una delle nostre?", `admin.js` continuava a
 * chiedere "e' una URL ben formata?" — e sono quattro rotte che spediscono un
 * token di invito o di reset dentro una email. Una regola applicata in un
 * posto e non nel suo gemello e' una regola che qualcuno deve ricordarsi:
 * meglio una funzione che tutti e due chiamano.
 *
 * `env` arriva come parametro invece di essere importato: cosi' questo file
 * non dipende dalla configurazione e le prove possono passargli quello che
 * vogliono.
 *
 * @param {{ appBaseOrigin?: string, corsOrigin?: string }} env
 * @param {string|undefined} extra origini in piu', separate da virgola
 * @returns {{ own: string, allowed: Set<string> }}
 */
export function origniDelSito(env, extra = process.env.APP_ALLOWED_ORIGINS) {
  return {
    own: env.appBaseOrigin || env.corsOrigin || 'http://localhost:4200',
    allowed: toOriginSet([env.appBaseOrigin, env.corsOrigin, extra])
  };
}

/**
 * L'origine da usare per un link: quella proposta se e' fra le nostre, la
 * nostra altrimenti.
 *
 * Non solleva mai e non distingue i casi nel valore di ritorno. È voluto: chi
 * chiama e' la rotta di reset, che deve rispondere la stessa cosa a
 * qualunque richiesta — se rifiutasse l'origine con un errore, quell'errore
 * direbbe a chi prova che l'indirizzo email esiste.
 *
 * @param {unknown} proposed l'origine arrivata da fuori
 * @param {{ own: string, allowed: Set<string> }} where
 * @returns {string}
 */
export function pickOrigin(proposed, { own, allowed }) {
  if (!proposed) {
    return own;
  }

  let url;
  try {
    url = new URL(String(proposed));
  } catch {
    return own;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return own;
  }

  return allowed.has(url.origin) ? url.origin : own;
}
