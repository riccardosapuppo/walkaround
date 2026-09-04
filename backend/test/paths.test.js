/**
 * Il percorso chiesto da fuori, e dove finisce.
 *
 * La prima prova di questo progetto, e non e' un caso che sia questa: qui
 * c'era il difetto peggiore che il codice avesse, e non era in una parte
 * complicata. Il blocco dell'audio a pagamento confrontava stringhe
 * (`startsWith('audio/')`) su un valore che Express non decodifica, mentre lo
 * strato sotto lo decodificava. Una lettera scritta come `%61` e l'intera
 * libreria a pagamento usciva senza sessione e senza acquisto.
 *
 * Le prove qui sotto sono scritte per fallire su quel codice: se qualcuno
 * rimette un controllo testuale, `il paywall non si aggira scrivendo la a in
 * un altro modo` diventa rossa.
 */

import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import { decodeRequestPath, isInsideDirectory, resolveInside, resolvePublicAudioUrl } from '../src/media/paths.js';

const PUBLIC = path.resolve('/srv/app/public');
const AUDIO = path.resolve(PUBLIC, 'audio');

const dentroAudio = (richiesta) => {
  const risolto = resolveInside(PUBLIC, richiesta);
  return risolto !== null && (risolto === AUDIO || isInsideDirectory(AUDIO, risolto));
};

test('il paywall non si aggira scrivendo la a in un altro modo', () => {
  // Questa e' la richiesta che passava.
  assert.equal(dentroAudio('/%61udio/catania/anfiteatro.mp3'), true);

  // E queste sono le sue parenti: la barra, la doppia codifica del punto, la
  // codifica di un pezzo qualsiasi del nome.
  assert.equal(dentroAudio('/audio%2Fcatania%2Fanfiteatro.mp3'), true);
  assert.equal(dentroAudio('/aud%69o/catania/anfiteatro.mp3'), true);
  assert.equal(dentroAudio('/%61%75%64%69%6f/catania/anfiteatro.mp3'), true);
});

test('la forma normale resta bloccata', () => {
  assert.equal(dentroAudio('/audio/catania/anfiteatro.mp3'), true);
  assert.equal(dentroAudio('/audio'), true);
  assert.equal(dentroAudio('/audio/'), true);
});

test('le immagini passano', () => {
  assert.equal(dentroAudio('/images/catania/duomo.jpg'), false);
  assert.equal(dentroAudio('/assets/logo.png'), false);

  const risolto = resolveInside(PUBLIC, '/images/catania/duomo.jpg');
  assert.equal(risolto, path.resolve(PUBLIC, 'images/catania/duomo.jpg'));
});

test('una cartella che comincia per audio non e la cartella audio', () => {
  // Il motivo per cui il confronto e' su path.relative e non su startsWith:
  // 'audio-vecchio' comincia per 'audio' e non ci sta dentro.
  assert.equal(dentroAudio('/audio-vecchio/x.mp3'), false);
  assert.equal(dentroAudio('/audiolibri/x.mp3'), false);
});

test('non si esce dalla radice pubblica', () => {
  assert.equal(resolveInside(PUBLIC, '/../../etc/passwd'), null);
  assert.equal(resolveInside(PUBLIC, '/images/../../../etc/passwd'), null);
  assert.equal(resolveInside(PUBLIC, '/%2e%2e/%2e%2e/etc/passwd'), null);
});

test('e si torna dentro passando per audio', () => {
  // Questa e' consentita e deve restarlo: risolve dentro images, non dentro
  // audio, quindi non e' il paywall a doverla fermare.
  assert.equal(dentroAudio('/audio/../images/catania/duomo.jpg'), false);
  assert.equal(
    resolveInside(PUBLIC, '/audio/../images/catania/duomo.jpg'),
    path.resolve(PUBLIC, 'images/catania/duomo.jpg')
  );
});

test('una percentuale malformata non e un percorso', () => {
  // Non si indovina cosa intendesse: si rifiuta. Provare a ripararla e'
  // esattamente la gentilezza che apre i buchi.
  assert.equal(decodeRequestPath('/%'), null);
  assert.equal(decodeRequestPath('/%zz'), null);
  assert.equal(decodeRequestPath('/audio/%e0%a4%a'), null);
  assert.equal(resolveInside(PUBLIC, '/%'), null);
});

test('un byte nullo tronca il nome piu in basso, quindi si rifiuta qui', () => {
  assert.equal(decodeRequestPath('/images/x.jpg%00.mp3'), null);
  assert.equal(resolveInside(PUBLIC, '/images/x.jpg%00.mp3'), null);
});

test('il percorso vuoto non e un errore, e non e niente', () => {
  assert.equal(decodeRequestPath(''), null);
  assert.equal(decodeRequestPath('/'), null);
  assert.equal(decodeRequestPath(null), null);
});

test('isInsideDirectory non considera una cartella dentro se stessa', () => {
  // Il chiamante deve decidere cosa fare del caso 'e' proprio quella': qui
  // /public/audio non e' "dentro" /public/audio, e il blocco lo tratta a
  // parte. Se questa cambiasse, il 403 su /public/audio sparirebbe.
  assert.equal(isInsideDirectory(AUDIO, AUDIO), false);
  assert.equal(isInsideDirectory(AUDIO, path.resolve(AUDIO, 'catania')), true);
  assert.equal(isInsideDirectory(AUDIO, path.resolve(PUBLIC, 'images')), false);
});

/* ------------------------------------------------------------------ */
/* L'audio_url del catalogo                                            */
/* ------------------------------------------------------------------ */

const RADICE_AUDIO = path.resolve('/srv/app/public/audio');

test('un audio_url normale trova il suo file', () => {
  assert.equal(
    resolvePublicAudioUrl(RADICE_AUDIO, '/public/audio/catania/duomo.mp3'),
    path.join(RADICE_AUDIO, 'catania', 'duomo.mp3')
  );
});

test('la coda della URL non fa parte del nome del file', () => {
  for (const url of [
    '/public/audio/catania/duomo.mp3?v=2',
    '/public/audio/catania/duomo.mp3#inizio',
    '/public/audio/catania/duomo.mp3?v=2#inizio'
  ]) {
    assert.equal(resolvePublicAudioUrl(RADICE_AUDIO, url), path.join(RADICE_AUDIO, 'catania', 'duomo.mp3'), url);
  }
});

test('si decodifica PRIMA di guardare il prefisso', () => {
  /*
   * Le due copie di questa funzione facevano il contrario: normalizzavano le
   * barre rovesciate, controllavano il prefisso, e solo dopo decodificavano.
   * Con quell'ordine `%61udio` non cominciava per `/public/audio/` e veniva
   * rifiutato pur essendo lo stesso identico file.
   *
   * E' l'ordine sbagliato che, nel blocco di `server.js`, apriva il paywall:
   * li' rifiutare per la forma voleva dire lasciar passare, qui vuol dire
   * rifiutare un file buono. Lo stesso errore rende l'esito opposto a
   * seconda di che cosa protegge — motivo in piu' per non ripeterlo in tre
   * posti con tre correzioni separate.
   */
  const atteso = path.join(RADICE_AUDIO, 'catania', 'duomo.mp3');

  assert.equal(resolvePublicAudioUrl(RADICE_AUDIO, '/public/%61udio/catania/duomo.mp3'), atteso);
  assert.equal(resolvePublicAudioUrl(RADICE_AUDIO, '/public/audio/catania/duomo.mp3'), atteso);
  assert.equal(resolvePublicAudioUrl(RADICE_AUDIO, '/public/audio/catania/duomo%2Emp3'), atteso);
});

test('un audio_url che punta fuori non da un percorso', () => {
  for (const url of [
    '/public/audio/../../../etc/passwd',
    '/public/audio/%2e%2e/%2e%2e/segreti.txt',
    '/public/images/catania/foto.jpg',
    '/etc/passwd',
    'https://altro-sito.example/audio/x.mp3',
    '',
    null,
    undefined
  ]) {
    assert.equal(resolvePublicAudioUrl(RADICE_AUDIO, url), null, String(url));
  }
});

test('un byte nullo nell audio_url si rifiuta qui e non piu in basso', () => {
  // Con la vecchia versione il NUL arrivava dentro path.resolve e faceva
  // sollevare fs.stat molto piu' tardi, in un punto che non sa spiegarlo.
  assert.equal(resolvePublicAudioUrl(RADICE_AUDIO, '/public/audio/catania/duomo.mp3%00.txt'), null);
});

test('una percentuale malformata non viene raddrizzata', () => {
  // La vecchia versione, se decodeURIComponent sollevava, teneva la stringa
  // grezza e tirava avanti: indovinare che cosa intendeva chi scrive e' il
  // genere di gentilezza che apre i buchi.
  assert.equal(resolvePublicAudioUrl(RADICE_AUDIO, '/public/audio/%zz/x.mp3'), null);
});

test('la cartella sorella non e la cartella', () => {
  // `public/audio-previews` comincia per `public/audio` e non ci sta dentro:
  // e' esattamente la distinzione che startsWith non sa fare, ed e' la
  // cartella da cui usciva l'audio intero.
  assert.equal(resolvePublicAudioUrl(RADICE_AUDIO, '/public/audio-previews/x.mp3'), null);
});
