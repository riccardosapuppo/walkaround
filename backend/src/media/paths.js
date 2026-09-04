/**
 * Dove finisce davvero un percorso chiesto da fuori.
 *
 * Questo file esiste perché la stessa funzione era scritta due volte — in
 * `routes/api.js` e in `routes/admin.js`, identiche — mentre il punto in cui
 * contava di più, il blocco dell'audio in `server.js`, faceva un'altra cosa:
 * confrontava stringhe.
 *
 *     if (percorso.startsWith('audio/')) return 403;
 *
 * E non funzionava, per un motivo che si vede solo sapendo come Express tratta
 * le due proprietà: `req.path` NON è decodificato, mentre `express.static` più
 * sotto decodifica `req.url` prima di risolvere. Quindi
 *
 *     GET /public/%61udio/catania/qualsiasi-cosa.mp3
 *
 * non cominciava per `audio/`, passava il controllo, e veniva servito
 * dall'archivio statico — che nel frattempo aveva decodificato `%61` in `a`.
 * L'intera libreria a pagamento era raggiungibile senza sessione e senza
 * acquisto, con una lettera scritta in un altro modo.
 *
 * La lezione, che vale oltre a questo caso: **un controllo di sicurezza non si
 * fa sulla forma testuale di un percorso.** Le forme sono infinite — la
 * percentuale, la barra rovesciata, il punto punto, la maiuscola su un
 * filesystem che non distingue. Si risolve il percorso e si guarda dove è
 * finito, perché di posti ce n'è uno solo.
 */

import path from 'node:path';

/**
 * Il figlio sta dentro il genitore?
 *
 * Con `path.relative` e non con `startsWith` su stringhe: `/public/audio-x`
 * comincia per `/public/audio` e non ci sta dentro.
 *
 * @param {string} parentDir
 * @param {string} childPath
 * @returns {boolean} falso anche quando sono lo stesso percorso
 */
export function isInsideDirectory(parentDir, childPath) {
  const relative = path.relative(parentDir, childPath);
  return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative);
}

/**
 * Decodifica un percorso arrivato da una richiesta, o dice di no.
 *
 * @param {string} requestPath tipicamente `req.path`
 * @returns {string|null} il percorso relativo decodificato, o null se non è utilizzabile
 */
export function decodeRequestPath(requestPath) {
  const raw = String(requestPath || '').replace(/^\/+/, '');
  if (!raw) {
    return null;
  }

  let decoded;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    // Percentuale malformata: non è un percorso, e indovinare cosa intendesse
    // è esattamente il genere di gentilezza che apre i buchi.
    return null;
  }

  // Un byte nullo tronca il nome del file negli strati più in basso.
  if (decoded.includes('\0')) {
    return null;
  }

  return decoded.replace(/\\/g, '/');
}

/**
 * Il percorso assoluto di una richiesta sotto una radice, se ci sta dentro.
 *
 * @param {string} rootDir la radice consentita
 * @param {string} requestPath `req.path`
 * @returns {string|null} il percorso assoluto, oppure null: non decodificabile, o fuori
 */
export function resolveInside(rootDir, requestPath) {
  const decoded = decodeRequestPath(requestPath);
  if (decoded === null) {
    return null;
  }

  const resolved = path.resolve(rootDir, decoded);
  return isInsideDirectory(rootDir, resolved) ? resolved : null;
}

const PREFISSO_AUDIO = 'public/audio/';

/**
 * Il file su disco che corrisponde a un `audio_url` del catalogo.
 *
 * Un `audio_url` non arriva da una richiesta: sta in una colonna, e lo scrive
 * l'amministratore. Ma «scritto da noi» non vuol dire «sicuro» — vuol dire
 * solo che chi lo sbaglia ha le credenziali — e comunque il valore fa la
 * stessa strada di un percorso qualunque, quindi tanto vale trattarlo come
 * tale.
 *
 * ESISTEVA IN DUE COPIE, in `api.js` e in `admin.js`, e tutte e due facevano
 * due cose in ordine sbagliato: normalizzavano le barre rovesciate PRIMA di
 * controllare il prefisso e decodificavano DOPO. Con quell'ordine
 * `/public/%61udio/x.mp3` non cominciava per `/public/audio/` e veniva
 * rifiutato pur essendo lo stesso file, mentre un `%00` decodificato passava
 * dentro `path.resolve` e faceva sollevare `fs.stat` piu' in basso. Qui si
 * decodifica prima e si guarda dopo: la stessa lezione del blocco in
 * `server.js`, che e' il motivo per cui questo file esiste.
 *
 * @param {string} audioRootDir la cartella `public/audio` sul disco
 * @param {string} audioUrl il valore della colonna, tipo `/public/audio/catania/x.mp3`
 * @returns {string|null} il percorso assoluto, oppure null se non e' un audio nostro
 */
export function resolvePublicAudioUrl(audioRootDir, audioUrl) {
  const senzaCoda = String(audioUrl || '').split('?')[0].split('#')[0];

  const decoded = decodeRequestPath(senzaCoda);
  if (decoded === null || !decoded.startsWith(PREFISSO_AUDIO)) {
    return null;
  }

  const resolved = path.resolve(audioRootDir, decoded.slice(PREFISSO_AUDIO.length));
  return isInsideDirectory(audioRootDir, resolved) ? resolved : null;
}
