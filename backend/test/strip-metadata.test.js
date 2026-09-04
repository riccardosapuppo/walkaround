/**
 * Lo spoglio dei metadati: toglie quello che deve, e non tocca i pixel.
 *
 * La seconda proprieta' e' quella che conta ed e' la piu' facile da perdere:
 * la strada comoda per ripulire un'immagine e' passarla da un decodificatore
 * e un ricodificatore, e quella ricomprime. Su un caricamento non si vede;
 * dopo dieci passaggi si', e nessuno sa piu' da dove viene la sfocatura.
 *
 * Le immagini di prova sono costruite qui dentro byte per byte, senza
 * librerie e senza file di appoggio: un JPEG minimo valido e un PNG minimo
 * valido, con dentro i segmenti che vanno tolti.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import zlib from 'node:zlib';

import { stripImageMetadata, stripJpegMetadata, stripPngMetadata } from '../src/media/strip-metadata.js';

/** Un segmento JPEG: marcatore, lunghezza a due byte, contenuto. */
function segmento(marcatore, contenuto) {
  const corpo = Buffer.from(contenuto, 'latin1');
  const testa = Buffer.alloc(4);
  testa[0] = 0xff;
  testa[1] = marcatore;
  testa.writeUInt16BE(corpo.length + 2, 2);
  return Buffer.concat([testa, corpo]);
}

/** Un JPEG finto ma strutturalmente valido, con i segmenti che servono. */
function jpegConMetadati() {
  return Buffer.concat([
    Buffer.from([0xff, 0xd8]),
    segmento(0xe0, 'JFIF\0\0\0\0\0\0'), // APP0, resta
    segmento(0xe1, 'Exif\0\0MM\0*\0\0\0 Lorenzo Taccioli'), // APP1, via
    segmento(0xe2, 'ICC_PROFILE\0 profilo finto'), // APP2, resta
    segmento(0xed, 'Photoshop 3.0\0 8BIM by-line'), // APP13, via
    segmento(0xee, 'Adobe'), // APP14, RESTA: dice come si leggono i colori
    segmento(0xfe, 'CREATOR: gd-jpeg v1.0'), // commento, via
    segmento(0xdb, '\0'.repeat(65)), // tabella di quantizzazione, resta
    segmento(0xc0, '\0\0\0'), // SOF0 16x16
    segmento(0xda, '\0\0?\0'), // inizio scansione
    Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9a]), // "pixel"
    Buffer.from([0xff, 0xd9])
  ]);
}

test('il JPEG perde EXIF, IPTC e i commenti', () => {
  const prima = jpegConMetadati();
  const { buffer: dopo, removed } = stripJpegMetadata(prima);

  assert.deepEqual(removed.sort(), ['APP1', 'APP13', 'COM'].sort());
  assert.ok(dopo.length < prima.length);

  const testo = dopo.toString('latin1');
  assert.ok(!testo.includes('Lorenzo Taccioli'), 'il nome del fotografo e ancora li');
  assert.ok(!testo.includes('8BIM'), 'IPTC ancora li');
  assert.ok(!testo.includes('gd-jpeg'), 'il commento e ancora li');
});

test('il JPEG tiene JFIF, il profilo colore e la dichiarazione Adobe', () => {
  const { buffer: dopo, removed } = stripJpegMetadata(jpegConMetadati());
  const testo = dopo.toString('latin1');

  // Senza JFIF si perdono le proporzioni del pixel, senza ICC virano i colori.
  assert.ok(testo.includes('JFIF'), 'JFIF tolto per sbaglio');
  assert.ok(testo.includes('ICC_PROFILE'), 'profilo colore tolto per sbaglio');

  /*
   * APP14 "Adobe" era fra i buttati, E C'ERA UNA PROVA CHE LO PRETENDEVA.
   *
   * Dichiara lo spazio colore: se i tre canali sono YCbCr o RGB, e se un CMYK
   * e' memorizzato invertito alla maniera di Photoshop. Senza, chi decodifica
   * indovina, e un JPEG RGB letto come YCbCr esce coi colori sbagliati.
   *
   * Non e' un dato su chi ha scattato — e' un dato su come si leggono i
   * pixel, cioe' parte dell'immagine. La prova di prima fissava l'errore
   * esattamente come lo fissava il codice: una prova sbagliata non protegge,
   * sorveglia il difetto perche' non venga corretto.
   */
  assert.ok(testo.includes('Adobe'), 'APP14 tolto: i colori possono virare');
  assert.ok(!removed.includes('APP14'));
});

test('i dati compressi arrivano interi e identici', () => {
  const prima = jpegConMetadati();
  const { buffer: dopo } = stripJpegMetadata(prima);

  // Da SOS in poi non si tocca niente: e' li' che stanno i pixel, e li' dentro
  // un byte 0xFF non e' un marcatore.
  const codaPrima = prima.subarray(prima.indexOf(Buffer.from([0xff, 0xda])));
  const codaDopo = dopo.subarray(dopo.indexOf(Buffer.from([0xff, 0xda])));

  assert.deepEqual(codaDopo, codaPrima);
  assert.equal(dopo[dopo.length - 2], 0xff);
  assert.equal(dopo[dopo.length - 1], 0xd9);
});

test('rispogliare non cambia niente', () => {
  const una = stripJpegMetadata(jpegConMetadati()).buffer;
  const due = stripJpegMetadata(una);

  assert.deepEqual(due.buffer, una);
  assert.deepEqual(due.removed, []);
});

/** Un blocco PNG: lunghezza, tipo, contenuto, CRC. */
function blocco(tipo, contenuto) {
  const corpo = Buffer.from(contenuto, 'latin1');
  const lunghezza = Buffer.alloc(4);
  lunghezza.writeUInt32BE(corpo.length);
  const tipoEcorpo = Buffer.concat([Buffer.from(tipo, 'latin1'), corpo]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32 ? zlib.crc32(tipoEcorpo) : 0);
  return Buffer.concat([lunghezza, tipoEcorpo, crc]);
}

function pngConMetadati() {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(16, 0);
  ihdr.writeUInt32BE(16, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    blocco('IHDR', ihdr.toString('latin1')),
    blocco('tEXt', 'Author\0Lorenzo Taccioli'),
    blocco('tIME', 'ߪ\0\0\0'),
    blocco('IDAT', 'finti dati compressi'),
    blocco('IEND', '')
  ]);
}

test('il PNG perde i blocchi di testo e la data', () => {
  const prima = pngConMetadati();
  const { buffer: dopo, removed } = stripPngMetadata(prima);

  assert.deepEqual(removed.sort(), ['tEXt', 'tIME'].sort());
  assert.ok(!dopo.toString('latin1').includes('Lorenzo Taccioli'));
  assert.ok(dopo.toString('latin1').includes('IHDR'));
  assert.ok(dopo.toString('latin1').includes('IDAT'));
  assert.ok(dopo.toString('latin1').includes('IEND'));
});

test('quello che non si riconosce torna indietro intatto', () => {
  // Il caso peggiore deve essere "metadati ancora addosso", mai "file rotto":
  // qui passa di tutto, comprese le cose che non sono immagini.
  for (const roba of [
    Buffer.from('non sono un immagine'),
    Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00]), // GIF
    Buffer.alloc(0),
    Buffer.from([0xff])
  ]) {
    const { buffer, removed } = stripImageMetadata(roba, 'x.bin');
    assert.deepEqual(buffer, roba);
    assert.deepEqual(removed, []);
  }
});

test('un JPEG troncato torna indietro invece di essere accorciato', () => {
  // Un file rovinato a meta' non deve diventare un file rovinato di piu'.
  const intero = jpegConMetadati();
  const mozzo = intero.subarray(0, 24);

  const { buffer, removed } = stripJpegMetadata(mozzo);
  assert.deepEqual(buffer, mozzo);
  assert.deepEqual(removed, []);
});

test('stripImageMetadata sceglie il ramo dai byte, non dal nome', () => {
  // Il nome del file mente: e' un JPEG chiamato .png, e va trattato da JPEG.
  const { removed } = stripImageMetadata(jpegConMetadati(), 'bugiardo.png');
  assert.ok(removed.includes('APP1'));
});

/* ------------------------------------------------------------------ */
/* La coda: quello che sta DOPO la fine dell'immagine                   */
/* ------------------------------------------------------------------ */

/**
 * Un APP1 Exif vero, costruito qui, con le voci che si chiedono.
 *
 * Serve perche' i due difetti qui sotto si vedono solo con un EXIF che si
 * possa leggere davvero: uno finto fatto di lettere non ha ne' orientamento
 * ne' struttura.
 *
 * @param {number} orientamento 1..8
 * @param {string} descrizione finisce in ImageDescription, e non deve sopravvivere
 */
function app1Exif(orientamento, descrizione) {
  const testo = Buffer.from(descrizione + String.fromCharCode(0), 'latin1');
  const DATI = 38; // dove comincia il testo, dopo le due voci e il puntatore

  const tiff = Buffer.alloc(DATI + testo.length);
  tiff.write('II', 0, 'latin1');
  tiff.writeUInt16LE(0x2a, 2);
  tiff.writeUInt32LE(8, 4);

  tiff.writeUInt16LE(2, 8); // due voci

  tiff.writeUInt16LE(0x0112, 10); // Orientation
  tiff.writeUInt16LE(3, 12); // SHORT
  tiff.writeUInt32LE(1, 14);
  tiff.writeUInt16LE(orientamento, 18);

  tiff.writeUInt16LE(0x010e, 22); // ImageDescription
  tiff.writeUInt16LE(2, 24); // ASCII
  tiff.writeUInt32LE(testo.length, 26);
  tiff.writeUInt32LE(DATI, 30); // non ci sta dentro: e' un rimando

  tiff.writeUInt32LE(0, 34); // nessuna IFD dopo
  testo.copy(tiff, DATI);

  const dentro = Buffer.concat([Buffer.from([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]), tiff]);
  const testa = Buffer.alloc(4);
  testa[0] = 0xff;
  testa[1] = 0xe1;
  testa.writeUInt16BE(dentro.length + 2, 2);

  return Buffer.concat([testa, dentro]);
}

/** Un JPEG minimo con dentro l'APP1 che gli si passa. */
function jpegCon(app1) {
  return Buffer.concat([
    Buffer.from([0xff, 0xd8]),
    app1,
    segmento(0xdb, String.fromCharCode(0).repeat(65)),
    segmento(0xc0, String.fromCharCode(0).repeat(3)),
    segmento(0xda, String.fromCharCode(0, 0, 63, 0)),
    Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9a]),
    Buffer.from([0xff, 0xd9])
  ]);
}

test('quello che sta dopo la fine dell immagine non passa', () => {
  /*
   * IL DIFETTO, per esteso, perche' e' quello che questo modulo esisteva per
   * impedire e faceva lo stesso.
   *
   * Arrivati al segmento dei dati compressi la vecchia versione copiava
   * «tutto il resto», convinta che da li' in poi ci fossero solo pixel. Ma i
   * telefoni ci attaccano dietro una SECONDA immagine intera — MPO per il 3D,
   * la mappa di profondita' del ritratto, la gain map dell'HDR — e quella si
   * porta il proprio EXIF, col proprio GPS.
   *
   * Risultato: la funzione dichiarava «tolto APP1» e pubblicava lo stesso la
   * posizione. Un controllo che si ferma al primo risultato utile non e' un
   * controllo, e' un campione.
   */
  const prima = jpegCon(app1Exif(1, 'prima immagine'));
  const seconda = jpegCon(app1Exif(1, 'GPS-DI-CASA-37.5N-15.1E'));
  const attaccate = Buffer.concat([prima, seconda]);

  const { buffer: dopo, removed } = stripJpegMetadata(attaccate);
  const testo = dopo.toString('latin1');

  assert.ok(!testo.includes('GPS-DI-CASA'), 'la posizione della seconda immagine e ancora li');
  assert.ok(!testo.includes('prima immagine'), 'anche il primo EXIF doveva sparire');
  assert.ok(removed.includes('coda'), 'la coda non e stata segnalata');

  // E quello che resta e' un JPEG che finisce dove deve.
  assert.equal(dopo[dopo.length - 2], 0xff);
  assert.equal(dopo[dopo.length - 1], 0xd9);
  assert.ok(dopo.length < attaccate.length / 2 + 200);
});

test('la ricerca della fine attraversa i dati senza inciamparci', () => {
  /*
   * Dentro i dati compressi un byte 0xFF che fa parte dell'immagine e'
   * scritto `FF 00`, e ogni tanto compaiono i marcatori di riavvio
   * `FF D0`..`FF D7`. Nessuno dei due e' la fine di niente: una ricerca
   * ingenua di `FF D9` andrebbe bene lo stesso, ma una che si fermasse al
   * primo `FF` qualunque taglierebbe l'immagine a meta'.
   *
   * Qui i pixel contengono apposta tutte e tre le cose.
   */
  const pixelDifficili = Buffer.from([
    0x11,
    0xff, 0x00, // 0xFF che fa parte dei dati
    0x22,
    0xff, 0xd0, // riavvio
    0x33,
    0xff, 0xd7, // riavvio
    0x44
  ]);

  const jpeg = Buffer.concat([
    Buffer.from([0xff, 0xd8]),
    app1Exif(1, 'via'),
    segmento(0xda, String.fromCharCode(0, 0, 63, 0)),
    pixelDifficili,
    Buffer.from([0xff, 0xd9]),
    Buffer.from('coda da buttare', 'latin1')
  ]);

  const { buffer: dopo, removed } = stripJpegMetadata(jpeg);

  assert.ok(removed.includes('coda'));
  assert.ok(!dopo.toString('latin1').includes('coda da buttare'));

  // I pixel ci sono tutti: nessun taglio anticipato su un FF interno.
  assert.ok(dopo.includes(pixelDifficili), 'i dati compressi sono stati tagliati');
});

test('l orientamento sopravvive, e da solo', () => {
  /*
   * Una foto verticale e' memorizzata coricata, e a raddrizzarla e' un numero
   * dentro l'EXIF. Toglierlo insieme al resto — senza ruotare i pixel, che
   * qui non si fa perche' vorrebbe dire ricomprimere — vuol dire pubblicare
   * ogni foto verticale girata di novanta gradi.
   *
   * Quindi l'APP1 originale se ne va per intero, e al suo posto ne compare
   * uno nuovo che contiene UNA voce sola. Non si conserva il vecchio: dentro
   * ci sarebbero anche GPS, modello, data e numero di serie.
   */
  const { buffer: dopo, removed } = stripJpegMetadata(jpegCon(app1Exif(6, 'CASA-MIA-37.5N')));
  const testo = dopo.toString('latin1');

  assert.ok(!testo.includes('CASA-MIA'), 'la descrizione e sopravvissuta insieme all orientamento');
  assert.ok(removed.includes('APP1'));

  // Il nuovo APP1 c'e', ed e' minuscolo: identificatore, intestazione TIFF,
  // una voce. Se fosse rimasto quello di prima sarebbe molto piu' lungo.
  const dove = dopo.indexOf(Buffer.from([0xff, 0xe1]));
  assert.ok(dove > 0, 'l orientamento non e stato conservato');
  assert.equal(dopo.readUInt16BE(dove + 2), 34);

  // E dice sei.
  const rispogliato = stripJpegMetadata(dopo);
  assert.deepEqual(rispogliato.buffer, dopo, 'rispogliare deve essere a vuoto');
});

test('con orientamento 1 non si aggiunge niente', () => {
  // Uno vuol dire "gia' dritta": conservarlo sarebbe rumore.
  const { buffer: dopo } = stripJpegMetadata(jpegCon(app1Exif(1, 'niente di che')));

  assert.equal(dopo.indexOf(Buffer.from([0xff, 0xe1])), -1, 'aggiunto un APP1 che non serviva');
});
