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
 *   - JPEG: APP0 (JFIF), APP2 (profilo ICC), APP14 (Adobe) e, se serviva, un
 *     APP1 ricostruito col solo orientamento. Il perche' di ognuno sta sotto.
 *   - PNG: le intestazioni e i dati. Via tEXt, iTXt, zTXt, eXIf e tIME.
 *
 * Che cosa NON fa: non tocca il contenuto. Un volto in una foto resta un volto
 * in una foto, e un'immagine di qualcun altro resta di qualcun altro — togliere
 * l'EXIF non la rende propria, cancella solo la traccia di chi l'ha fatta.
 * Questo modulo serve a non pubblicare per sbaglio la posizione di casa di
 * qualcuno, non a nascondere una provenienza.
 *
 * ================================================================
 * LA CODA: IL DIFETTO CHE QUESTO FILE AVEVA
 * ================================================================
 *
 * La prima versione, arrivata al segmento dei dati compressi, copiava tutto
 * il resto del buffer senza guardarci dentro — «da qui in poi sono dati fino
 * alla fine». Non e' vero. Dopo la fine della prima immagine ci puo' stare
 * una SECONDA immagine intera, con la propria intestazione EXIF: e' come
 * scrivono i telefoni (MPO per il 3D, la mappa di profondita' del ritratto,
 * la gain map dell'HDR). Quella seconda immagine passava intatta, GPS
 * compreso, e la funzione dichiarava di aver tolto l'APP1.
 *
 * Cioe': il modulo esiste per non pubblicare dove abita qualcuno, e lo
 * pubblicava lo stesso, dicendo di no. **Un controllo che si ferma al primo
 * risultato utile non e' un controllo, e' un campione.**
 *
 * Adesso i dati compressi si attraversano davvero, riconoscendo il
 * riempimento `FF 00` e i marcatori di riavvio, fino a EOI; quello che sta
 * dopo EOI si butta e compare fra le cose tolte come `coda`.
 */

const JPEG_START = 0xd8;
const JPEG_END = 0xd9;
const SCAN_START = 0xda;
const COMMENT = 0xfe;
const APP1 = 0xe1;

/** Gli unici segmenti applicativi che restano, e perche'. */
const KEEP_APP = new Set([
  0xe0, // APP0 JFIF: densita' e unita' di misura del pixel
  0xe2, // APP2 ICC_PROFILE: senza, i colori virano
  /*
   * APP14 "Adobe": dichiara lo spazio colore, e buttarlo faceva danno.
   *
   * E' il segmento che dice se i tre canali sono YCbCr o RGB, e se un CMYK e'
   * memorizzato invertito alla maniera di Photoshop. Senza, il decodificatore
   * deve indovinare: un JPEG RGB letto come YCbCr esce coi colori sbagliati, e
   * un CMYK esce col negativo. Non e' un dato su chi ha scattato, e' un dato
   * su come si leggono i pixel — cioe' parte dell'immagine.
   *
   * Stava fra i buttati, e c'era pure una prova che lo pretendeva: il difetto
   * era sorvegliato invece che trovato. Una prova puo' fissare un errore
   * quanto una riga di codice.
   */
  0xee
]);

const isApp = (marker) => marker >= 0xe0 && marker <= 0xef;

/* ------------------------------------------------------------------ */
/* L'orientamento                                                      */
/* ------------------------------------------------------------------ */

/**
 * L'identificatore che apre un APP1 Exif: le quattro lettere e DUE BYTE ZERO.
 *
 * Scritto per byte e non dentro una stringa. Uno zero in mezzo a un letterale
 * e' il genere di carattere che si perde per strada — a incollarlo, a
 * riscriverlo, a salvare il file in un'altra codifica — e sparirebbe in
 * silenzio: il confronto smetterebbe di riconoscere qualunque EXIF, e questa
 * funzione risponderebbe sempre "orientamento 1" senza che niente fallisca.
 * In un editor quei due byte non si vedono nemmeno.
 */
const EXIF_ID = Buffer.from([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]);

/**
 * L'orientamento dichiarato dentro un APP1 Exif, se c'e'.
 *
 * PERCHE' SI VA A CERCARLO. Una foto scattata col telefono in verticale e'
 * memorizzata coricata, e a raddrizzarla e' un unico numero scritto
 * nell'EXIF. Toglierlo insieme a tutto il resto e' lecito solo se si ruotano
 * i pixel — che qui non si fa, e non si vuole fare, perche' vorrebbe dire
 * ricomprimere. Buttando l'EXIF e basta, ogni futura foto verticale sarebbe
 * finita nel catalogo girata di novanta gradi.
 *
 * Le 105 immagini gia' in repository non lo mostravano: sono state ripulite
 * quando l'orientamento se n'era gia' andato, quindi il difetto non era
 * visibile guardando il risultato — solo leggendo la strada del caricamento.
 *
 * @param {Buffer} segmento il contenuto dell'APP1, compresi i due byte di lunghezza
 * @returns {number} 1..8, oppure 1 se non si capisce
 */

function orientamentoDentroExif(segmento) {
  // L'identificatore sta subito dopo i due byte di lunghezza.
  if (segmento.length < 20 || !segmento.subarray(2, 8).equals(EXIF_ID)) {
    return 1;
  }

  const tiff = segmento.subarray(8);
  if (tiff.length < 14) {
    return 1;
  }

  const ordine = tiff.toString('latin1', 0, 2);
  const piccolo = ordine === 'II';
  if (!piccolo && ordine !== 'MM') {
    return 1;
  }

  const u16 = (at) => (piccolo ? tiff.readUInt16LE(at) : tiff.readUInt16BE(at));
  const u32 = (at) => (piccolo ? tiff.readUInt32LE(at) : tiff.readUInt32BE(at));

  if (u16(2) !== 0x2a) {
    return 1;
  }

  const ifd = u32(4);
  if (ifd + 2 > tiff.length) {
    return 1;
  }

  const quante = u16(ifd);
  for (let i = 0; i < quante; i += 1) {
    const voce = ifd + 2 + i * 12;
    if (voce + 12 > tiff.length) {
      return 1;
    }
    // 0x0112 = Orientation, tipo 3 (SHORT). Il valore sta nei primi due byte
    // del campo da quattro, perche' ci entra.
    if (u16(voce) === 0x0112 && u16(voce + 2) === 3) {
      const valore = u16(voce + 8);
      return valore >= 1 && valore <= 8 ? valore : 1;
    }
  }

  return 1;
}

/**
 * Un APP1 Exif nuovo che contiene SOLO l'orientamento.
 *
 * Non si conserva quello originale: dentro ci sarebbero anche il GPS, il
 * modello della macchina, la data, il numero di serie. Si ricostruisce il
 * minimo indispensabile, cosi' l'unica cosa che sopravvive e' quella che
 * serve a mostrare la foto dritta.
 *
 * @param {number} orientamento 2..8 (per 1 non serve niente)
 * @returns {Buffer} il segmento completo, marcatore compreso
 */
function app1SoloOrientamento(orientamento) {
  const tiff = Buffer.alloc(26);
  tiff.write('II', 0, 'latin1'); // little endian
  tiff.writeUInt16LE(0x2a, 2);
  tiff.writeUInt32LE(8, 4); // la IFD0 comincia subito dopo l'intestazione
  tiff.writeUInt16LE(1, 8); // una voce sola
  tiff.writeUInt16LE(0x0112, 10); // Orientation
  tiff.writeUInt16LE(3, 12); // SHORT
  tiff.writeUInt32LE(1, 14); // una
  tiff.writeUInt16LE(orientamento, 18);
  tiff.writeUInt32LE(0, 22); // nessuna IFD dopo

  const dentro = Buffer.concat([EXIF_ID, tiff]);
  const testa = Buffer.alloc(4);
  testa[0] = 0xff;
  testa[1] = APP1;
  testa.writeUInt16BE(dentro.length + 2, 2);

  return Buffer.concat([testa, dentro]);
}

/* ------------------------------------------------------------------ */
/* I dati compressi                                                    */
/* ------------------------------------------------------------------ */

/**
 * Attraversa i dati compressi da `from` e restituisce dove comincia il
 * prossimo marcatore vero.
 *
 * Dentro il flusso compresso un byte 0xFF che fa parte dei dati e' scritto
 * `FF 00`, e ogni tanto compaiono i marcatori di riavvio `FF D0`..`FF D7`, che
 * non sono la fine di niente. Tutto il resto — `FF` seguito da qualunque altra
 * cosa — e' un marcatore vero: EOI se l'immagine finisce li', un altro
 * segmento se il JPEG e' progressivo e i passaggi sono piu' d'uno.
 *
 * @returns {number} l'indice del marcatore, oppure -1 se il file finisce prima
 */
function prossimoMarcatore(buffer, from) {
  let i = from;

  while (i < buffer.length - 1) {
    if (buffer[i] !== 0xff) {
      i += 1;
      continue;
    }

    const dopo = buffer[i + 1];

    if (dopo === 0x00) {
      i += 2; // 0xFF che fa parte dei dati
      continue;
    }
    if (dopo === 0xff) {
      i += 1; // riempimento
      continue;
    }
    if (dopo >= 0xd0 && dopo <= 0xd7) {
      i += 2; // riavvio
      continue;
    }

    return i;
  }

  return -1;
}

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
  let orientamento = 1;
  let at = 2;

  while (at < buffer.length - 1) {
    if (buffer[at] !== 0xff) {
      // Fuori sincrono: meglio restituire l'originale che un file troncato.
      return { buffer, removed: [] };
    }

    const marker = buffer[at + 1];

    if (marker === JPEG_END) {
      pieces.push(buffer.subarray(at, at + 2));
      if (at + 2 < buffer.length) {
        // Qui sta il difetto che questo file racconta in testa: dopo la fine
        // della prima immagine ce n'era un'altra, con dentro il suo EXIF.
        removed.push('coda');
      }
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
      if (marker === APP1) {
        // Prima di buttarlo, gli si chiede l'unica cosa che vale la pena
        // salvare. Il segmento se ne va comunque: quello che resta e' un APP1
        // nuovo, con dentro un numero solo.
        orientamento = Math.max(orientamento, orientamentoDentroExif(buffer.subarray(at + 2, at + 2 + size)));
      }
      removed.push(marker === COMMENT ? 'COM' : `APP${marker - 0xe0}`);
    } else {
      pieces.push(buffer.subarray(at, at + 2 + size));
    }

    at += 2 + size;

    if (marker === SCAN_START) {
      const prossimo = prossimoMarcatore(buffer, at);
      if (prossimo < 0) {
        // Dati compressi che non finiscono: il file e' troncato. Si torna
        // indietro con l'originale invece di accorciarlo ancora.
        return { buffer, removed: [] };
      }
      pieces.push(buffer.subarray(at, prossimo));
      at = prossimo;
    }
  }

  if (orientamento !== 1) {
    // Subito dopo SOI, che e' dove un APP1 puo' stare.
    pieces.splice(1, 0, app1SoloOrientamento(orientamento));
    removed.push(`APP1 sostituito con il solo orientamento ${orientamento}`);
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
      // Anche qui: quello che sta dopo IEND non e' l'immagine, e non deve
      // venire dietro. Stessa ragione della coda dei JPEG.
      if (at < buffer.length) {
        removed.push('coda');
      }
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
