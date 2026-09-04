#!/usr/bin/env node
/**
 * Toglie i metadati dalle immagini gia' in archivio.
 *
 *     node backend/scripts/clean-image-metadata.js            # dice cosa farebbe
 *     node backend/scripts/clean-image-metadata.js --write    # lo fa
 *
 * L'upload passa gia' da `stripImageMetadata` (routes/admin.js), quindi da qui
 * in avanti non entra piu' niente di sporco. Questo serve per quello che era
 * entrato prima, e per essere rieseguito senza pensarci: su un archivio gia'
 * pulito non cambia un byte, quindi si puo' lanciare quando si vuole.
 *
 * Non ricomprime. Toglie i segmenti di intestazione e lascia i pixel dove
 * sono, quindi eseguirlo dieci volte non degrada niente — che e' il motivo per
 * cui non usa una libreria di immagini.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { stripImageMetadata } from '../src/media/strip-metadata.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.join(here, '..', 'public', 'images');

const READABLE = new Set(['.jpg', '.jpeg', '.png']);

const write = process.argv.includes('--write');

async function* walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (READABLE.has(path.extname(entry.name).toLowerCase())) {
      yield full;
    }
  }
}

let looked = 0;
let touched = 0;
let saved = 0;
const kinds = new Map();

for await (const file of walk(IMAGES)) {
  looked += 1;

  const before = await fs.readFile(file);
  const { buffer: after, removed } = stripImageMetadata(before, path.basename(file));

  if (!removed.length || after.length === before.length) {
    continue;
  }

  touched += 1;
  saved += before.length - after.length;

  for (const kind of removed) {
    kinds.set(kind, (kinds.get(kind) || 0) + 1);
  }

  const shown = path.relative(IMAGES, file).replace(/\\/g, '/');
  console.log(
    `  ${write ? 'ripulita' : 'da ripulire'}  ${shown}` +
      `  (${removed.join(', ')}, -${Math.round((before.length - after.length) / 1024)}K)`
  );

  if (write) {
    await fs.writeFile(file, after);
  }
}

console.log('');
console.log(`  immagini guardate : ${looked}`);
console.log(`  con metadati      : ${touched}`);
console.log(`  spazio recuperato : ${Math.round(saved / 1024)} K`);

if (kinds.size) {
  console.log(`  segmenti tolti    : ${[...kinds].map(([k, n]) => `${k} x${n}`).join(', ')}`);
}

if (!write && touched) {
  console.log('');
  console.log('  Nessun file e stato toccato. Rilancia con --write.');
}
