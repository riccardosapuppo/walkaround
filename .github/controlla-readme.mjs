/**
 * Ogni `npm run <x>` scritto nel README esiste nella cartella in cui il README
 * lo fa dare.
 *
 * PERCHE' SI LEGGE IL README invece di elencare i comandi qui: un elenco
 * scritto in due posti invecchia in uno dei due, in silenzio, e quello che
 * invecchia e' sempre la copia. Il README e' la fonte perche' e' quello che
 * legge chi arriva.
 *
 * LA CARTELLA CONTA. Il README alterna backend e frontend con dei `cd`, e i
 * due package.json hanno script diversi: `dev` esiste solo nel backend,
 * `watch` solo nel frontend. Un comando documentato nella cartella sbagliata
 * e' un comando che non funziona, e non lo dice nessuno finche' qualcuno non
 * lo prova. Quindi qui si tiene il conto dei `cd`, risolvendoli davvero — un
 * `cd ../frontend` dopo un `cd backend` deve dare `frontend`, non
 * `../frontend`.
 *
 * Si puo' dare anche a mano:  node .github/controlla-readme.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* fileURLToPath e non `new URL(...).pathname`: su Windows il secondo da'
   `/C:/Miei%20progetti/...`, con lo spazio ancora codificato e una barra
   davanti alla lettera dell'unita'. Sembra un percorso e non lo e'. */
const RADICE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const testo = fs.readFileSync(path.join(RADICE, 'README.md'), 'utf8');

/** I comandi trovati: { cartella, script, riga }. */
const trovati = [];
let dentroUnBlocco = false;
let cartella = '.';

testo.split('\n').forEach((riga, indice) => {
  if (riga.trimStart().startsWith('```')) {
    dentroUnBlocco = !dentroUnBlocco;
    // Ogni blocco riparte dalla radice: i `cd` di un blocco non si portano
    // dietro a quello dopo, perche' chi legge apre un terminale per volta.
    cartella = '.';
    return;
  }
  if (!dentroUnBlocco) {
    return;
  }

  const pezzi = riga.trim().split(/\s+/);

  if (pezzi[0] === 'cd' && pezzi[1]) {
    cartella = path.normalize(path.join(cartella, pezzi[1]));
    return;
  }

  for (let i = 0; i < pezzi.length - 1; i += 1) {
    if (pezzi[i] !== 'npm' && pezzi[i] !== 'npm.cmd') {
      continue;
    }

    if (pezzi[i + 1] === 'run' && pezzi[i + 2]) {
      trovati.push({ cartella, script: pezzi[i + 2], riga: indice + 1 });
      continue;
    }

    /* npm accetta anche la forma corta per una manciata di script, e il
       README la usa. Cercare solo `npm run` vuol dire non guardare proprio i
       due comandi che uno prova per primi: `npm test` e `npm start`. */
    if (['test', 'start', 'stop', 'restart'].includes(pezzi[i + 1])) {
      trovati.push({ cartella, script: pezzi[i + 1], riga: indice + 1 });
    }
  }
});

/* Un estrattore che smette di estrarre non fallisce: passa a vuoto. Quindi la
   prima cosa controllata e' che abbia trovato qualcosa. */
if (trovati.length < 2) {
  console.error(`Nel README si trovano solo ${trovati.length} comandi npm: il rotto e' probabilmente questo controllo.`);
  process.exit(1);
}

let male = 0;

for (const { cartella: dove, script, riga } of trovati) {
  const pacchetto = path.join(RADICE, dove, 'package.json');

  if (!fs.existsSync(pacchetto)) {
    console.error(`README:${riga}  «npm run ${script}» dentro ${dove}/, dove non c'e' nessun package.json.`);
    male += 1;
    continue;
  }

  const scripts = JSON.parse(fs.readFileSync(pacchetto, 'utf8')).scripts || {};
  if (!Object.hasOwn(scripts, script)) {
    console.error(`README:${riga}  «npm run ${script}» dentro ${dove}/, e li' quello script non esiste.`);
    male += 1;
  } else {
    console.log(`  ok  ${dove.padEnd(10)} npm run ${script}`);
  }
}

if (male) {
  process.exit(1);
}

console.log(`\nTutti e ${trovati.length} i comandi npm del README esistono dove il README li fa dare.`);
