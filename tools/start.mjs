#!/usr/bin/env node
/**
 * One command: the whole stack, and the page it serves.
 *
 *     npm start
 *     npm start -- --no-open        leave the browser alone
 *     WEB_PORT=8090 npm start       the ports the compose file already honours
 *
 * ── What this replaces ───────────────────────────────────────────────────────
 *
 * The instructions were three lines, and the first of them asked the reader to
 * pipe twenty-four random bytes out of openssl into a .env file -- which is a
 * manoeuvre, and a manoeuvre does not get performed. It also does not run on
 * Windows without a POSIX shell and an openssl on the path, so the first thing
 * this project asked of a reader was something a third of them could not do.
 * The password is made here, by the crypto that ships with Node, on any
 * machine.
 *
 * (That line used to be quoted here in full, and the secret scanner stopped it:
 * it sees a variable being assigned a value and cannot know it is a quotation.
 * A scanner that reads comments is doing its job -- the comment is the thing
 * that had to change.)
 *
 * Then `docker compose up`, and then the reader was asked to open an address
 * by hand. That is the step where a first start goes wrong: compose output
 * does not end, so there is no moment that says "now", and opening too early
 * shows an application whose database is still being seeded.
 *
 * ── What it waits for ────────────────────────────────────────────────────────
 *
 * The API's /health answers only once a query has actually reached PostgreSQL,
 * and the frontend has to be answering too, since that is where the browser is
 * sent. Both, and not before compose says it has attached: the ports say
 * "something is answering", and only compose knows whether it is the something
 * this command started -- on a machine where an older stack was still up, the
 * first version of this in another project answered in zero seconds and opened
 * the browser on the instance it was in the middle of replacing.
 */
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const WEB_PORT = process.env.WEB_PORT ?? '8080';
const API_PORT = process.env.API_PORT ?? '3001';
const SITE = `http://localhost:${WEB_PORT}`;
const HEALTH = `http://localhost:${API_PORT}/health`;

/**
 * The password, made once and then left alone.
 *
 * Never rewritten, and that is the important half. The database keeps the
 * password it was created with, inside a volume that outlives the containers:
 * a fresh `.env` beside an old `walkaround_pgdata` is an authentication
 * failure with a confusing message, and the fix would be deleting somebody's
 * data. If the file is there, whatever is in it is the truth.
 */
function makeThePasswordIfThereIsNone() {
  const file = path.join(root, '.env');

  if (fs.existsSync(file)) return false;

  // 24 bytes, the length the instructions used to ask openssl for. base64url
  // rather than base64 so nothing in it needs quoting in a compose file.
  fs.writeFileSync(file, `DB_PASSWORD=${randomBytes(24).toString('base64url')}\n`, 'utf8');

  return true;
}

/**
 * One request, one socket, closed before this returns.
 *
 * `fetch` keeps its connections alive for reuse, and one still open when the
 * process exits aborts inside libuv on Windows instead of returning an exit
 * code. `agent: false` leaves nothing behind to close.
 */
function ask(url) {
  return new Promise((done) => {
    const request = http.get(url, { agent: false }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => (body += chunk));
      response.on('end', () => done({ status: response.statusCode, body }));
    });

    request.setTimeout(2000, () => request.destroy());
    request.on('error', () => done(undefined));
  });
}

/**
 * Open the page, unless one of four things says not to.
 *
 * A program that opens a browser when nobody is watching is worse than one
 * that never does: on a runner the launcher can block instead of failing, and
 * a green job becomes one that hangs for six hours and is quietly cancelled.
 */
function whyNotToOpen() {
  if (process.argv.includes('--no-open')) return '--no-open was given';
  if (process.env.NO_OPEN && process.env.NO_OPEN !== '0') return 'NO_OPEN is set';
  if (process.env.CI && process.env.CI !== 'false') return 'this is CI';
  if (!process.stdout.isTTY) return 'nothing is attached to this terminal';

  return null;
}

function openInBrowser(url) {
  const [command, args] =
    process.platform === 'win32'
      ? ['cmd', ['/c', 'start', '', url]]
      : process.platform === 'darwin'
        ? ['open', [url]]
        : ['xdg-open', [url]];

  // Detached and unwatched: the browser outlives this process, and a machine
  // without one must not take the stack down with it. The failure arrives on
  // the next turn of the loop rather than as a throw, so it is reported from
  // the handler and not from a try/catch that would never see it.
  const child = spawn(command, args, { detached: true, stdio: 'ignore' });

  child.on('error', (wrong) => {
    console.log(`  No browser opened here (${wrong.code ?? wrong.message}). ${url} is waiting.`);
  });

  child.unref();
}

const made = makeThePasswordIfThereIsNone();

if (made) {
  console.log('');
  console.log('  Made a database password and wrote it to .env, which is not versioned.');
  console.log('  It is never rewritten: the database keeps the one it was created with.');
  console.log('');
}

const compose = spawn('docker', ['compose', 'up', '--build'], {
  cwd: root,
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: process.platform === 'win32',
});

compose.on('error', (wrong) => {
  console.error('');
  console.error(`  docker compose would not start: ${wrong.code ?? wrong.message}`);
  console.error('  This needs Docker running. Everything else about the project is in the README.');
  console.error('');
  process.exit(1);
});

/* Compose prints this once, after the containers are up and before their logs
   start. It is the only moment in the whole output that means "from here on,
   what answers is mine". */
let attached = false;

const watch = (chunk) => {
  process.stdout.write(chunk);
  if (!attached && /Attaching to/.test(String(chunk))) attached = true;
};

compose.stdout.on('data', watch);
compose.stderr.on('data', watch);

let over = false;

compose.on('close', (code, signal) => {
  over = true;
  process.exit(code ?? (signal ? 1 : 0));
});

/* A cold machine builds two images and seeds a catalogue, so the wait is
   minutes rather than seconds. It ends when the API has reached the database,
   not when a port opens. */
(async () => {
  const started = Date.now();
  const deadline = started + 15 * 60 * 1000;

  while (!over && Date.now() < deadline) {
    if (!attached) {
      await new Promise((again) => setTimeout(again, 500));
      continue;
    }

    const health = await ask(HEALTH);
    const site = health?.status === 200 ? await ask(`${SITE}/`) : undefined;

    if (site && site.status < 400) {
      const seconds = Math.round((Date.now() - started) / 1000);
      const refused = whyNotToOpen();

      console.log('');
      console.log(`  Ready in ${seconds}s: the guides are on ${SITE}`);
      console.log(refused ? `  Not opening a browser: ${refused}.` : '  Opening it. Ctrl+C stops everything.');
      console.log('');

      if (!refused) openInBrowser(SITE);

      return;
    }

    await new Promise((again) => setTimeout(again, 1500));
  }

  if (!over) {
    console.log('');
    console.log(`  Still nothing on ${HEALTH} after 15 minutes.`);
    console.log('  Compose is left running: its output above says what it is doing.');
    console.log('');
  }
})();
