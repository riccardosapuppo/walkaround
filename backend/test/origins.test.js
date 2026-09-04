/**
 * L'origine di un link mandato per posta.
 *
 * La prova che conta e' la prima: chiedere il reset per l'email di un altro
 * indicando il proprio sito come origine faceva partire una email vera, dal
 * dominio giusto, con dentro un token valido puntato al server di chi
 * chiedeva. Non serviva essere autenticati.
 */

import assert from 'node:assert/strict';
import test from 'node:test';

import { pickOrigin, toOriginSet } from '../src/auth/origins.js';

const nostre = toOriginSet(['https://walkaround.cloud', 'http://localhost:4200']);
const dove = { own: 'https://walkaround.cloud', allowed: nostre };

test('un origine di chi attacca non finisce nel link', () => {
  for (const tentativo of [
    'https://sito-di-chi-attacca.example',
    'http://walkaround.cloud.altro.example',
    'https://walkaround.cloud.example',
    'https://xn--walkarund-6za.cloud',
    'https://user:pass@sito-di-chi-attacca.example',
    'https://walkaround.cloud@sito-di-chi-attacca.example'
  ]) {
    assert.equal(pickOrigin(tentativo, dove), 'https://walkaround.cloud', tentativo);
  }
});

test('un sottodominio non e il dominio', () => {
  // Nessuna scorciatoia su endsWith: 'evil.walkaround.cloud' finisce per
  // 'walkaround.cloud' e non e' nostro finche' non lo scriviamo nell'elenco.
  assert.equal(pickOrigin('https://evil.walkaround.cloud', dove), 'https://walkaround.cloud');
});

test('le origini nostre passano, anche scritte in altro modo', () => {
  assert.equal(pickOrigin('https://walkaround.cloud', dove), 'https://walkaround.cloud');
  assert.equal(pickOrigin('https://walkaround.cloud/', dove), 'https://walkaround.cloud');
  assert.equal(pickOrigin('https://walkaround.cloud:443/', dove), 'https://walkaround.cloud');
  assert.equal(pickOrigin('https://walkaround.cloud/qualcosa?x=1', dove), 'https://walkaround.cloud');
  assert.equal(pickOrigin('http://localhost:4200', dove), 'http://localhost:4200');
});

test('la porta fa parte dell identita', () => {
  // localhost:4200 e' nostro, localhost:9999 no: sono due origini diverse per
  // il browser e devono esserlo anche qui.
  assert.equal(pickOrigin('http://localhost:9999', dove), 'https://walkaround.cloud');
});

test('schemi che non sono http ricadono sulla nostra', () => {
  for (const tentativo of [
    'javascript:alert(1)',
    'data:text/html,<script>',
    'file:///etc/passwd',
    'ftp://walkaround.cloud'
  ]) {
    assert.equal(pickOrigin(tentativo, dove), 'https://walkaround.cloud', tentativo);
  }
});

test('niente e non-stringhe ricadono sulla nostra, senza sollevare', () => {
  // Questa rotta non deve mai fallire in modo diverso a seconda dell input:
  // un errore direbbe a chi prova che qualcosa e cambiato.
  for (const tentativo of [undefined, null, '', '   ', 'non una url', 42, {}, []]) {
    assert.equal(pickOrigin(tentativo, dove), 'https://walkaround.cloud');
  }
});

test('l elenco si costruisce anche da una stringa con le virgole', () => {
  const insieme = toOriginSet(['https://a.example, https://b.example', 'https://c.example/']);

  assert.equal(insieme.size, 3);
  assert.ok(insieme.has('https://a.example'));
  assert.ok(insieme.has('https://b.example'));
  assert.ok(insieme.has('https://c.example'));
});

test('una voce di configurazione scritta male viene scartata, non raddrizzata', () => {
  const insieme = toOriginSet(['non-una-url', '', null, undefined, 'https://buona.example']);

  assert.equal(insieme.size, 1);
  assert.ok(insieme.has('https://buona.example'));
});

test('con un elenco vuoto tutto ricade sulla nostra', () => {
  const senza = { own: 'https://walkaround.cloud', allowed: toOriginSet([]) };

  assert.equal(pickOrigin('https://walkaround.cloud', senza), 'https://walkaround.cloud');
  assert.equal(pickOrigin('https://altro.example', senza), 'https://walkaround.cloud');
});
