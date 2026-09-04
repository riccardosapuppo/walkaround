/**
 * Nessun commento JavaScript dentro una stringa SQL.
 *
 * Questa prova esiste per un errore fatto mentre si sistemava proprio la
 * gestione degli errori di PayPal: dei commenti `//` di spiegazione sono
 * finiti dentro il template literal invece che sopra, cioe' dentro la query.
 *
 *     await pool.query(`
 *       // Che cosa si scrive qui dipende da...      <- dentro l'SQL
 *       UPDATE paypal_checkout_orders ...
 *     `)
 *
 * `node --check` passava, perche' e' JavaScript perfettamente valido: dice
 * soltanto che la stringa e' una stringa. Postgres invece si sarebbe fermato
 * su `//`, che in SQL non e' un commento (lo e' `--`). E la query sbagliata
 * stava dentro un `catch` con dentro un altro `catch` vuoto, quindi il guasto
 * non sarebbe arrivato da nessuna parte: la riga semplicemente non veniva
 * aggiornata, per sempre.
 *
 * La lezione: **un controllo di sintassi sul linguaggio esterno non dice
 * niente sulla lingua che sta dentro le stringhe.** Qui dentro di lingue ce ne
 * sono due, e la seconda non la guardava nessuno.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');

/** Le parole con cui comincia una query, in maiuscolo a inizio riga. */
const INIZIO_SQL = /^\s*(SELECT|INSERT|UPDATE|DELETE|WITH|CREATE|ALTER|DROP|TRUNCATE)\b/im;

function* sorgenti(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* sorgenti(full);
    } else if (entry.name.endsWith('.js')) {
      yield full;
    }
  }
}

/**
 * I template literal di un file, alla buona.
 *
 * Non e' un parser e non prova a esserlo: cerca i backtick e prende quello che
 * c'e' in mezzo. Basta, perche' quello che si cerca — righe che cominciano per
 * `//` dentro una query — non ha bisogno di sapere altro.
 */
function stringheACapo(testo) {
  const trovate = [];
  let da = testo.indexOf('`');

  while (da >= 0) {
    let a = da + 1;
    while (a < testo.length) {
      if (testo[a] === '\\') {
        a += 2;
        continue;
      }
      if (testo[a] === '`') {
        break;
      }
      a += 1;
    }
    if (a >= testo.length) {
      break;
    }
    trovate.push({ testo: testo.slice(da + 1, a), riga: testo.slice(0, da).split('\n').length });
    da = testo.indexOf('`', a + 1);
  }

  return trovate;
}

test('nessun commento JavaScript dentro una query', () => {
  const colpevoli = [];

  for (const file of sorgenti(SRC)) {
    const testo = fs.readFileSync(file, 'utf8');

    for (const { testo: dentro, riga } of stringheACapo(testo)) {
      if (!INIZIO_SQL.test(dentro)) {
        continue;
      }
      for (const linea of dentro.split('\n')) {
        if (linea.trim().startsWith('//')) {
          colpevoli.push(`${path.relative(SRC, file)}:${riga}  ${linea.trim().slice(0, 60)}`);
        }
      }
    }
  }

  assert.deepEqual(
    colpevoli,
    [],
    'commento // dentro una query: in SQL il commento e --, e questo la rompe\n' + colpevoli.join('\n')
  );
});

test('la ricerca funziona davvero, su un caso piantato apposta', () => {
  // Regola: un controllo che non trova mai niente e un controllo che nessuno
  // sa se funziona. Qui il caso positivo si costruisce a mano.
  const finto = [
    'await pool.query(`',
    '  // questo non ci deve stare',
    '  UPDATE tabella SET x = 1',
    '`);'
  ].join('\n');

  const stringhe = stringheACapo(finto);
  assert.equal(stringhe.length, 1);
  assert.ok(INIZIO_SQL.test(stringhe[0].testo), 'non riconosciuta come query');
  assert.ok(
    stringhe[0].testo.split('\n').some((l) => l.trim().startsWith('//')),
    'il commento non e stato trovato'
  );
});

test('una stringa che non e una query non interessa', () => {
  const finto = 'const messaggio = `\n  // questo va benissimo\n  ciao\n`;';
  const stringhe = stringheACapo(finto);

  assert.equal(stringhe.length, 1);
  assert.equal(INIZIO_SQL.test(stringhe[0].testo), false);
});
