/**
 * Nessun segreto in chiaro fra i file versionati.
 *
 * NON E' UN ANTIVIRUS e non prova a esserlo. Cerca le forme che in questo
 * repository ci sono state davvero, fino a poco fa:
 *
 *   - un indirizzo IP pubblico dentro un comando `ssh`, che era la riga con
 *     cui si apriva il tunnel verso il server di esercizio;
 *   - una riga che assegna una password a qualcosa che non sia un segnaposto
 *     o una variabile;
 *   - le chiavi che i fornitori scrivono con un prefisso riconoscibile.
 *
 * Il README ne conteneva tre — indirizzo del server, utente per l'accesso
 * remoto, password del database — e ci sono rimaste per mesi, perche' un
 * segreto scritto in un file di testo non fa fallire niente. Questo controllo
 * e' il «niente» che adesso fallisce.
 *
 * COSA NON PUO' FARE: guardare la storia. I segreti che stanno nei commit
 * vecchi restano li' finche' non si riscrive la storia, e l'unica correzione
 * vera e' ruotarli. Questo passo impedisce che ne entrino di nuovi.
 *
 * Si puo' dare anche a mano:  node .github/controlla-segreti.mjs
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* fileURLToPath e non `new URL(...).pathname`: su Windows il secondo da'
   `/C:/Miei%20progetti/...`, con lo spazio ancora codificato e una barra
   davanti alla lettera dell'unita'. Sembra un percorso e non lo e'. */
const RADICE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Le estensioni che vale la pena leggere. Un mp3 non contiene password. */
const DA_GUARDARE = /\.(js|mjs|cjs|ts|json|yml|yaml|md|env|example|sh|ps1|sql|html|scss|css|conf|txt|Dockerfile)$/i;

/** Quello che non deve comparire, e come si chiama quando compare. */
const SOSPETTI = [
  {
    nome: 'un indirizzo IP pubblico in un comando ssh',
    regola: /ssh\s[^\n]*@\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
  },
  {
    nome: 'una password scritta come stringa letterale',
    /*
     * LE VIRGOLETTE SONO OBBLIGATORIE, ed e' tutta la differenza.
     *
     * La prima versione cercava `password` seguito dai due punti e da
     * qualunque cosa lunga otto caratteri. Segnalava ventisette righe, e
     * tutte e ventisette erano codice normale: `password: env.db.password`,
     * `password: z.string().min(8, ...)`, `this.showLoginPassword = !this…`.
     *
     * Un controllo che grida a ogni riga che nomina la parola non lo guarda
     * piu' nessuno dopo la seconda volta: e' un modo di non avere un
     * controllo che costa anche la fatica di scriverlo.
     *
     * Un segreto vero e' un VALORE, e un valore sta fra virgolette.
     * `password: qualcosa` e' un rimando a un valore che sta altrove, e
     * altrove e' esattamente il posto giusto.
     */
    regola:
      /(?:password|passwd|pwd)\s*[:=]\s*['"`](?!(?:\$|<|\.\.\.|xxx|placeholder|esempio|example|changeme|tua|your|password['"`]))[^\s'"`]{8,}['"`]/i
  },
  {
    nome: 'una chiave che si riconosce dal prefisso',
    regola: /\b(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AIza[A-Za-z0-9_-]{30,})\b/
  },
  {
    nome: 'una stringa di connessione con dentro le credenziali',
    regola: /(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[^\s:'"]+:(?!(?:\$|password|<))[^\s@'"]{6,}@/i
  }
];

/* I file che possono nominare queste cose per parlarne: la propria
   documentazione e i propri controlli. Un elenco corto e scritto a mano —
   allungarlo e' una decisione, non una scorciatoia. */
/**
 * L'ELENCO E' CORTO PER FORZA, E STA PER DIVENTARE PIU' CORTO.
 *
 * Ci stava anche `README.md`, e quella era una falla vera: il README e' IL
 * FILE che conteneva l'indirizzo del server, l'utente SSH e la password del
 * database. Metterlo qui dentro voleva dire che questo controllo, scritto
 * apposta per quel genere di errore, sul caso concreto non guardava. Passava
 * dicendo «nessun segreto in 176 file» e i 176 non lo comprendevano.
 *
 * E ci stava per una ragione che sembrava buona: il README parla di
 * credenziali, quindi «e' normale che scatti». Ma se un file fa scattare il
 * controllo, o il controllo e' troppo largo — e allora si stringe il modello —
 * o il file ha davvero qualcosa dentro. Scusarlo e' la terza strada, ed e' la
 * sola che non risponde alla domanda.
 *
 * Stretto il modello (si pretendono le virgolette e si escludono i rimandi),
 * il README passa da solo, e questo elenco puo' restare a un nome: il file che
 * per funzionare deve contenere i modelli e i propri casi di prova.
 */
const AMMESSI = new Set([
  '.github/controlla-segreti.mjs'
]);

const versionati = execFileSync('git', ['ls-files'], { cwd: RADICE, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  .split('\n')
  .filter(Boolean);

let guardati = 0;
const colpe = [];

for (const relativo of versionati) {
  if (AMMESSI.has(relativo) || !DA_GUARDARE.test(relativo)) {
    continue;
  }

  const assoluto = path.join(RADICE, relativo);
  let contenuto;
  try {
    if (fs.statSync(assoluto).size > 2 * 1024 * 1024) {
      continue;
    }
    contenuto = fs.readFileSync(assoluto, 'utf8');
  } catch {
    continue;
  }

  guardati += 1;

  contenuto.split('\n').forEach((riga, indice) => {
    for (const { nome, regola } of SOSPETTI) {
      if (regola.test(riga)) {
        colpe.push(`${relativo}:${indice + 1}  ${nome}\n    ${riga.trim().slice(0, 100)}`);
      }
    }
  });
}

/* Un controllo che gira su un insieme vuoto passa senza guardare niente. */
if (guardati < 20) {
  console.error(`Guardati solo ${guardati} file: il rotto e' probabilmente questo controllo.`);
  process.exit(1);
}

/* E un controllo che non trova mai niente e' un controllo che nessuno sa se
   funziona. Il caso positivo si costruisce qui, e non su disco. */
const finto = [
  'ssh -N -L 25432:127.0.0.1:5433 utente@203.0.113.10',
  "password: 'unaPasswordFinta42'",
  'DATABASE_URL=postgres://walkaround:unaPasswordVera@db.example:5432/x'
];
for (const riga of finto) {
  if (!SOSPETTI.some(({ regola }) => regola.test(riga))) {
    console.error('La ricerca non riconosce piu un caso che dovrebbe riconoscere:\n    ' + riga);
    process.exit(1);
  }
}
for (const riga of ["password: process.env.DB_PASSWORD", "password: '<la tua password>'", 'DB_PASSWORD=${DB_PASSWORD:?serve}']) {
  if (SOSPETTI.some(({ regola }) => regola.test(riga))) {
    console.error('La ricerca segnala una riga che va benissimo:\n    ' + riga);
    process.exit(1);
  }
}

if (colpe.length) {
  console.error(`\nSegreti in chiaro fra i file versionati (${colpe.length}):\n`);
  console.error(colpe.join('\n'));
  console.error('\nSe e un falso allarme, cambiare la riga o aggiungere il file agli AMMESSI, dicendo perche.');
  process.exit(1);
}

console.log(`Nessun segreto in chiaro in ${guardati} file versionati.`);
