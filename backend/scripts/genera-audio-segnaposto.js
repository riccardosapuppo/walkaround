/**
 * Genera `backend/public/audio/segnaposto.mp3`: l'unico mp3 versionato.
 *
 * PERCHE' ESISTE. Il catalogo a pagamento non sta piu' in questo repository —
 * gli mp3 sono stati tolti da tutta la cronologia — e senza un file audio il
 * progetto non parte davvero: il seed nomina cinque tracce, e cinque nomi che
 * non esistono sono cinque 404 al primo clic. La prova
 * `test/seed-percorsi.test.js` pretende che ogni percorso nominato dai seed
 * esista con le maiuscole giuste, ed e' la prova che ha segnalato il problema
 * il giorno in cui gli mp3 sono spariti. Il segnaposto la lascia intatta: un
 * file che esiste davvero, non un controllo indebolito.
 *
 * PERCHE' GENERATO E NON SCARICATO. Un audio preso da qualche parte porta con
 * se' la domanda «di chi e'», che e' esattamente la domanda che il catalogo
 * delle immagini non sapeva rispondere (ventiquattro fotografie di altri, e
 * nessuna provenienza dichiarata). Qui la provenienza e' questo file: silenzio
 * costruito byte per byte, nessun diritto di nessuno, e chiunque puo' rifarlo
 * e ottenere lo stesso identico risultato.
 *
 * PERCHE' SILENZIO. Perche' un tono vero vorrebbe dire un encoder, cioe' una
 * dipendenza, e questo repository si e' appena tolto 2,4 GiB di peso: non e'
 * il momento di aggiungerne. Il silenzio si scrive senza codificare niente, ed
 * e' spiegato sotto.
 *
 * COM'E' FATTO. MPEG-1 Layer III, 44100 Hz, mono, 32 kbit/s costanti: la
 * combinazione che qualunque decodificatore degli ultimi trent'anni conosce.
 * Ogni frame e' l'intestazione di quattro byte e poi zeri. Gli zeri non sono
 * un riempimento a caso: nei diciassette byte di side info di un frame mono
 * ci sta `part2_3_length`, cioe' quanti bit di dati veri seguono. A zero, il
 * decodificatore non ha coefficienti da leggere e restituisce un blocco di
 * campioni nulli. Silenzio dichiarato nel formato, non un file rotto che per
 * caso non suona.
 *
 *   node scripts/genera-audio-segnaposto.js
 *
 * Riscrive il file e poi lo rilegge, contando i frame uno per uno: se quello
 * che e' finito su disco non e' un mp3 valido, questo comando fallisce qui
 * invece di lasciarlo scoprire a chi installa.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BACKEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DESTINAZIONE = path.join(BACKEND, 'public', 'audio', 'segnaposto.mp3');

/* MPEG-1 Layer III, 44100 Hz, mono, 32 kbit/s, senza CRC.

   0xFF 0xFB  sync (11 bit), versione MPEG-1, layer III, niente CRC
   0x10       bitrate 32 kbit/s, campionamento 44100 Hz, niente padding
   0xC4       mono, non copiato, originale, nessuna enfasi                    */
const INTESTAZIONE = Buffer.from([0xff, 0xfb, 0x10, 0xc4]);

const CAMPIONAMENTO = 44100;
const BITRATE = 32000;
const CAMPIONI_PER_FRAME = 1152;

/* La formula del formato: 144 * bitrate / campionamento. Fa 104,489, e i
   frame interi da 104 byte stanno tutti alla stessa lunghezza perche' il bit
   di padding resta a zero. La deriva e' mezzo byte per frame — un decimo di
   secondo ogni ora, su un file che dura cinque secondi. */
const BYTE_PER_FRAME = Math.floor((144 * BITRATE) / CAMPIONAMENTO);

/** Cinque secondi: abbastanza per sentire che la catena funziona, 20 KiB di peso. */
const FRAME = 192;

/** Il titolo che si legge aprendo il file, per chi lo trova fuori da qui. */
const TITOLO = 'Walk Around - segnaposto silenzioso, non e\' una audioguida';

/**
 * L'intestazione ID3v2.3 con dentro il titolo.
 *
 * La dimensione dell'intestazione si scrive «synchsafe»: sette bit per byte,
 * l'ottavo sempre a zero, perche' un byte con i bit alti accesi somiglierebbe
 * a un sync di frame e manderebbe fuori strada chi cerca l'inizio dell'audio.
 */
function intestazioneId3(titolo) {
  const testo = Buffer.concat([
    Buffer.from([0x00]), // ISO-8859-1
    Buffer.from(titolo, 'latin1')
  ]);

  const frame = Buffer.alloc(10 + testo.length);
  frame.write('TIT2', 0, 'latin1');
  frame.writeUInt32BE(testo.length, 4); // in ID3v2.3 e' una dimensione normale
  frame.writeUInt16BE(0x0000, 8);
  testo.copy(frame, 10);

  const testa = Buffer.alloc(10);
  testa.write('ID3', 0, 'latin1');
  testa[3] = 0x03; // versione 2.3.0
  testa[4] = 0x00;
  testa[5] = 0x00; // nessun flag
  for (let i = 0; i < 4; i += 1) {
    testa[9 - i] = (frame.length >> (7 * i)) & 0x7f;
  }

  return Buffer.concat([testa, frame]);
}

/** Un frame: intestazione e poi zeri, cioe' `part2_3_length` a zero. */
function frameDiSilenzio() {
  const frame = Buffer.alloc(BYTE_PER_FRAME);
  INTESTAZIONE.copy(frame, 0);
  return frame;
}

/**
 * Rilegge il file e cammina i frame uno per uno.
 *
 * Non si fida di quello che ha appena scritto: salta l'ID3 leggendone la
 * dimensione dichiarata, e da li' in poi pretende a ogni passo il sync, la
 * versione, il layer e gli indici giusti. Se il conto dei frame o dei byte non
 * torna, il file non e' quello che questo file dice di essere.
 */
function verifica(percorso) {
  const dati = fs.readFileSync(percorso);

  let posizione = 0;
  if (dati.subarray(0, 3).toString('latin1') === 'ID3') {
    const dimensione =
      (dati[6] << 21) | (dati[7] << 14) | (dati[8] << 7) | dati[9];
    posizione = 10 + dimensione;
  }

  const inizioAudio = posizione;
  let frame = 0;

  while (posizione + 4 <= dati.length) {
    if (dati[posizione] !== 0xff || (dati[posizione + 1] & 0xe0) !== 0xe0) {
      throw new Error(`byte ${posizione}: qui doveva cominciare un frame e non comincia`);
    }
    if (((dati[posizione + 1] >> 3) & 0x03) !== 0x03) {
      throw new Error(`frame ${frame}: non e' MPEG-1`);
    }
    if (((dati[posizione + 1] >> 1) & 0x03) !== 0x01) {
      throw new Error(`frame ${frame}: non e' Layer III`);
    }
    if (((dati[posizione + 2] >> 4) & 0x0f) !== 0x01) {
      throw new Error(`frame ${frame}: non e' a 32 kbit/s`);
    }
    if (((dati[posizione + 2] >> 2) & 0x03) !== 0x00) {
      throw new Error(`frame ${frame}: non e' a 44100 Hz`);
    }
    if (((dati[posizione + 3] >> 6) & 0x03) !== 0x03) {
      throw new Error(`frame ${frame}: non e' mono`);
    }

    const padding = (dati[posizione + 2] >> 1) & 0x01;
    posizione += BYTE_PER_FRAME + padding;
    frame += 1;
  }

  if (posizione !== dati.length) {
    throw new Error(`avanzano ${dati.length - posizione} byte dopo l'ultimo frame`);
  }
  if (frame !== FRAME) {
    throw new Error(`frame contati ${frame}, attesi ${FRAME}`);
  }

  return {
    byte: dati.length,
    byteDiTag: inizioAudio,
    frame,
    secondi: (frame * CAMPIONI_PER_FRAME) / CAMPIONAMENTO
  };
}

fs.mkdirSync(path.dirname(DESTINAZIONE), { recursive: true });
fs.writeFileSync(
  DESTINAZIONE,
  Buffer.concat([
    intestazioneId3(TITOLO),
    ...Array.from({ length: FRAME }, frameDiSilenzio)
  ])
);

const conto = verifica(DESTINAZIONE);
console.log(
  `${path.relative(BACKEND, DESTINAZIONE)}: ${conto.frame} frame, ` +
    `${conto.secondi.toFixed(2)} s, ${conto.byte} byte (${conto.byteDiTag} di tag ID3).`
);
