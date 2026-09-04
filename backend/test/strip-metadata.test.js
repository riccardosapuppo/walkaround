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
    segmento(0xee, 'Adobe'), // APP14, via
    segmento(0xfe, 'CREATOR: gd-jpeg v1.0'), // commento, via
    segmento(0xdb, '\0'.repeat(65)), // tabella di quantizzazione, resta
    segmento(0xc0, '\0\0\0'), // SOF0 16x16
    segmento(0xda, '\0\0?\0'), // inizio scansione
    Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9a]), // "pixel"
    Buffer.from([0xff, 0xd9])
  ]);
}

test('il JPEG perde EXIF, IPTC, Adobe e i commenti', () => {
  const prima = jpegConMetadati();
  const { buffer: dopo, removed } = stripJpegMetadata(prima);

  assert.deepEqual(removed.sort(), ['APP1', 'APP13', 'APP14', 'COM'].sort());
  assert.ok(dopo.length < prima.length);

  const testo = dopo.toString('latin1');
  assert.ok(!testo.includes('Lorenzo Taccioli'), 'il nome del fotografo e ancora li');
  assert.ok(!testo.includes('8BIM'), 'IPTC ancora li');
  assert.ok(!testo.includes('gd-jpeg'), 'il commento e ancora li');
});

test('il JPEG tiene JFIF e il profilo colore', () => {
  const { buffer: dopo } = stripJpegMetadata(jpegConMetadati());
  const testo = dopo.toString('latin1');

  // Senza JFIF si perdono le proporzioni del pixel, senza ICC virano i colori.
  assert.ok(testo.includes('JFIF'), 'JFIF tolto per sbaglio');
  assert.ok(testo.includes('ICC_PROFILE'), 'profilo colore tolto per sbaglio');
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
