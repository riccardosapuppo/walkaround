/**
 * Toglie i metadati da un'immagine, senza ricomprimerla.
 *
 * Serve perche' una fotografia porta addosso molto piu' di se stessa: il nome
 * dell'autore, il copyright, la posizione GPS dove e' stata scattata, il numero
 * di serie della macchina. In questo catalogo era gia' successo: ventiquattro
 * immagini portavano il copyright di sei fotografi diversi, e nessuno se ne era
 * accorto perche' quei campi non si vedono guardando la foto.
 *
 * IMPORTANTE, ed e' il motivo per cui questo file esiste invece di una
 * chiamata a una libreria: qui NON si ricomprime niente. Si tolgono i segmenti
 * di intestazione e si lascia il flusso di pixel esattamente com'e'. Passare
 * l'immagine da un decodificatore e un ricodificatore JPEG per ripulirla vuol
 * dire perdere qualita' a ogni giro, e il giro capita a ogni caricamento.
 *
 * Che cosa resta:
 *   - JPEG: APP0 (JFIF, sono le dimensioni del pixel) e APP2 (profilo ICC,
 *     senza il quale i colori cambiano). Tutto il resto degli APPn e i commenti
 *     vanno via.
 *   - PNG: le intestazioni e i dati. Via tEXt, iTXt, zTXt, eXIf e tIME.
 *
 * Che cosa NON fa: non tocca il contenuto. Un volto in una foto resta un volto
 * in una foto, e un'immagine di qualcun altro resta di qualcun altro — togliere
 * l'EXIF non la rende propria, cancella solo la traccia di chi l'ha fatta.
 * Questo modulo serve a non pubblicare per sbaglio la posizione di casa di
 * qualcuno, non a nascondere una provenienza.
 */

const JPEG_START = 0xd8;
const JPEG_END = 0xd9;
const SCAN_START = 0xda;
const COMMENT = 0xfe;

/** Gli unici segmenti applicativi che restano, e perche'. */
const KEEP_APP = new Set([
  0xe0, // APP0 JFIF: densita' e unita' di misura del pixel
  0xe2 // APP2 ICC_PROFILE: senza, i colori virano
]);

const isApp = (marker) => marker >= 0xe0 && marker <= 0xef;

/**
 * @param {Buffer} buffer immagine in ingresso
 * @returns {{ buffer: Buffer, removed: string[] }} immagine ripulita, e cosa e' stato tolto
 */
export function stripJpegMetadata(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== JPEG_START) {
    return { buffer, removed: [] };
  }

  const pieces = [buffer.subarray(0, 2)];
  const removed = [];
  let at = 2;

  while (at < buffer.length - 1) {
    if (buffer[at] !== 0xff) {
      // Fuori sincrono: meglio restituire l'originale che un file troncato.
      return { buffer, removed: [] };
    }

    const marker = buffer[at + 1];

    if (marker === JPEG_END) {
      pieces.push(buffer.subarray(at));
      at = buffer.length;
      break;
    }

    if (marker === 0xff) {
      // Riempimento fra segmenti: un solo byte, si porta dietro.
      pieces.push(buffer.subarray(at, at + 1));
      at += 1;
      continue;
    }

    if (at + 4 > buffer.length) {
      return { buffer, removed: [] };
    }

    const size = buffer.readUInt16BE(at + 2);
    if (size < 2 || at + 2 + size > buffer.length) {
      return { buffer, removed: [] };
    }

    const drop = (isApp(marker) && !KEEP_APP.has(marker)) || marker === COMMENT;

    if (drop) {
      removed.push(marker === COMMENT ? 'COM' : `APP${marker - 0xe0}`);
    } else {
      pieces.push(buffer.subarray(at, at + 2 + size));
    }

    at += 2 + size;

    if (marker === SCAN_START) {
      // Da qui in poi sono dati compressi fino alla fine: si copiano interi,
      // senza cercare marcatori dentro, perche' li' dentro i byte 0xFF non
      // sono marcatori.
      pieces.push(buffer.subarray(at));
      at = buffer.length;
      break;
    }
  }

  return { buffer: Buffer.concat(pieces), removed };
}

/** I blocchi PNG che portano testo o date, e che quindi vanno tolti. */
const PNG_DROP = new Set(['tEXt', 'iTXt', 'zTXt', 'eXIf', 'tIME']);

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * @param {Buffer} buffer immagine in ingresso
 * @returns {{ buffer: Buffer, removed: string[] }}
 */
export function stripPngMetadata(buffer) {
  if (buffer.length < 8 || !buffer.subarray(0, 8).equals(PNG_MAGIC)) {
    return { buffer, removed: [] };
  }

  const pieces = [buffer.subarray(0, 8)];
  const removed = [];
  let at = 8;

  while (at + 8 <= buffer.length) {
    const length = buffer.readUInt32BE(at);
    const kind = buffer.toString('latin1', at + 4, at + 8);
    const whole = 12 + length;

    if (at + whole > buffer.length) {
      return { buffer, removed: [] };
    }

    if (PNG_DROP.has(kind)) {
      removed.push(kind);
    } else {
      pieces.push(buffer.subarray(at, at + whole));
    }

    at += whole;

    if (kind === 'IEND') {
      break;
    }
  }

  return { buffer: Buffer.concat(pieces), removed };
}

/**
 * Ripulisce quello che riconosce e lascia stare il resto.
 *
 * Un formato che non conosce torna indietro identico invece di essere
 * rovinato: qui il caso peggiore e' un'immagine con i metadati ancora addosso,
 * non un'immagine rotta.
 *
 * @param {Buffer} buffer
 * @param {string} [fileName] solo per scegliere il ramo quando i magic byte non bastano
 * @returns {{ buffer: Buffer, removed: string[] }}
 */
export function stripImageMetadata(buffer, fileName = '') {
  if (!Buffer.isBuffer(buffer) || buffer.length < 8) {
    return { buffer, removed: [] };
  }

  if (buffer[0] === 0xff && buffer[1] === JPEG_START) {
    return stripJpegMetadata(buffer);
  }

  if (buffer.subarray(0, 8).equals(PNG_MAGIC)) {
    return stripPngMetadata(buffer);
  }

  void fileName;
  return { buffer, removed: [] };
}
