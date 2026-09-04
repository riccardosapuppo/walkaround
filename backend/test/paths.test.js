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

import { decodeRequestPath, isInsideDirectory, resolveInside } from '../src/media/paths.js';

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
