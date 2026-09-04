/**
 * Ogni file che i seed nominano deve esistere, con le maiuscole giuste.
 *
 * DUE DIFETTI, TROVATI INSIEME, ED ERANO LO STESSO DIFETTO: nessuno aveva mai
 * confrontato quello che i seed dicono con quello che c'e' su disco.
 *
 * 1. `seed-data.js` puntava a `/public/audio/catania-guide.mp3`, alla radice
 *    della cartella audio. I file stanno una cartella piu' sotto, per citta'.
 *    Su un'installazione nuova ventiquattro punti di interesse su sessantasei
 *    — Catania intera, che e' anche la citta' predefinita — rispondevano 404
 *    sia in anteprima sia a pagamento.
 *
 * 2. Le immagini di Ragusa stavano in `images/Ragusa/` con la maiuscola, e i
 *    seed cercavano `images/ragusa/`. Su Windows funziona, perche' il
 *    filesystem non distingue; nel container Alpine no, e Ragusa era una
 *    citta' senza fotografie.
 *
 * PERCHE' QUESTA PROVA NON USA `existsSync`: perche' su Windows direbbe di si'
 * anche a `Ragusa` scritto `ragusa`, cioe' passerebbe qui e fallirebbe in
 * esercizio — la stessa asimmetria che ha nascosto il difetto per mesi. Si
 * legge la cartella e si confronta il nome esatto, che e' l'unico modo di
 * fare una domanda sensibile alle maiuscole su un filesystem che non lo e'.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const BACKEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DB = path.join(BACKEND, 'src', 'db');
const PUBLIC = path.join(BACKEND, 'public');

/** I nomi di una cartella, in cache: i seed nominano lo stesso posto molte volte. */
const elencoCache = new Map();

function nomiIn(dir) {
  if (!elencoCache.has(dir)) {
    try {
      elencoCache.set(dir, new Set(fs.readdirSync(dir)));
    } catch {
      elencoCache.set(dir, null);
    }
  }
  return elencoCache.get(dir);
}

/**
 * Il file esiste, con esattamente queste maiuscole?
 *
 * Cammina il percorso un pezzo per volta e a ogni passo controlla che il nome
 * sia fra quelli che la cartella elenca davvero.
 */
function esisteConLeMaiuscoleGiuste(relativo) {
  const pezzi = relativo.split('/').filter(Boolean);
  let dir = PUBLIC;

  for (let i = 0; i < pezzi.length; i += 1) {
    const nomi = nomiIn(dir);
    if (!nomi || !nomi.has(pezzi[i])) {
      return false;
    }
    dir = path.join(dir, pezzi[i]);
  }

  return true;
}

/** Ogni URL /public/... nominato dai file di seed, con il file da cui viene. */
function percorsiNeiSeed() {
  const trovati = [];

  for (const nome of fs.readdirSync(DB)) {
    if (!nome.includes('seed') || !nome.endsWith('.js')) {
      continue;
    }
    const testo = fs.readFileSync(path.join(DB, nome), 'utf8');
    for (const [url] of testo.matchAll(/\/public\/(?:images|audio)\/[^'"`\s,)]+/g)) {
      trovati.push({ seed: nome, url: url.replace(/[",]+$/, '') });
    }
  }

  return trovati;
}

test('i seed nominano dei file, e i file ci sono', () => {
  const percorsi = percorsiNeiSeed();

  // Regola: un controllo che gira su un insieme vuoto passa senza guardare
  // niente. Se l'estrazione smette di funzionare, deve accorgersene questa
  // riga e non l'utente che installa.
  assert.ok(percorsi.length > 40, `trovati solo ${percorsi.length} percorsi nei seed: probabile che sia rotta l'estrazione`);

  const mancanti = percorsi
    .filter(({ url }) => !esisteConLeMaiuscoleGiuste(url.replace(/^\/public\//, '')))
    .map(({ seed, url }) => `${seed}  ->  ${url}`);

  assert.deepEqual([...new Set(mancanti)], [], 'percorsi che non esistono:\n' + [...new Set(mancanti)].join('\n'));
});

test('il controllo delle maiuscole funziona davvero', () => {
  // Su Windows existsSync direbbe di si' a tutte e due. Se questa prova
  // fallisce, il controllo sopra e' diventato insensibile alle maiuscole e
  // non protegge piu' da niente.
  const unaCartella = fs.readdirSync(PUBLIC).find((n) => fs.statSync(path.join(PUBLIC, n)).isDirectory());
  assert.ok(unaCartella, 'niente cartelle sotto public/');

  assert.equal(esisteConLeMaiuscoleGiuste(unaCartella), true);
  assert.equal(esisteConLeMaiuscoleGiuste(unaCartella.toUpperCase() + 'ZZ'), false);

  const girata = unaCartella === unaCartella.toLowerCase() ? unaCartella.toUpperCase() : unaCartella.toLowerCase();
  if (girata !== unaCartella) {
    assert.equal(esisteConLeMaiuscoleGiuste(girata), false, `${girata} non dovrebbe risultare esistente`);
  }
});

test('le citta hanno tutte la cartella audio e quella immagini, in minuscolo', () => {
  // Le cartelle per citta' si chiamano tutte in minuscolo. Ragusa era
  // l'eccezione, e l'eccezione era il difetto.
  for (const dove of ['audio', 'images']) {
    const nomi = [...(nomiIn(path.join(PUBLIC, dove)) || [])].filter((n) =>
      fs.statSync(path.join(PUBLIC, dove, n)).isDirectory()
    );

    const conMaiuscole = nomi.filter((n) => n !== n.toLowerCase());
    assert.deepEqual(conMaiuscole, [], `cartelle con maiuscole sotto public/${dove}: ${conMaiuscole.join(', ')}`);
  }
});
