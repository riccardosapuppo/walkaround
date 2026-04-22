import { poisSeed } from './seed-data.js';

export const poiAddressesById = {
  'ct-piazza-duomo': 'Piazza del Duomo, 95124 Catania',
  'ct-fontana-amenano': 'Piazza del Duomo, 95124 Catania',
  'ct-fontana-elefante': 'Piazza del Duomo, 95124 Catania',
  'ct-duomo-catania': 'Piazza del Duomo, 95124 Catania',
  'ct-collegiata': 'Via Etnea, 95124 Catania',
  'ct-castello-ursino': 'Piazza Federico II di Svevia, 95121 Catania',
  'ct-teatro-romano': 'Via Vittorio Emanuele II, 266, 95124 Catania',
  'ct-palazzo-gravina-cruyllas': "Piazza San Francesco d'Assisi, 3, 95124 Catania",
  'ct-palazzo-elefanti': 'Piazza del Duomo, 95124 Catania',
  'ct-teatro-bellini': 'Via Giuseppe Perrotta, 12, 95131 Catania',
  'ct-pescheria': 'Piazza Alonzo di Benedetto, 95121 Catania',
  'ct-via-etnea': 'Via Etnea, 95124 Catania',
  'ct-monastero-benedettini': 'Piazza Dante Alighieri, 32, 95124 Catania',
  'ct-villa-bellini': 'Via Etnea, 292, 95131 Catania',
  'ct-piazza-universita': 'Piazza Universita, 95124 Catania',
  'ct-anfiteatro-romano': 'Piazza Stesicoro, 95124 Catania',
  'ct-mount-etna': 'Piazzale Rifugio Sapienza, 95030 Nicolosi',
  'ct-badia-sant-agata': 'Via Vittorio Emanuele II, 182, 95131 Catania',
  'ct-terme-achilliane': 'Piazza del Duomo, 95124 Catania',
  'ct-palazzo-san-giuliano': 'Piazza Universita, 13, 95124 Catania',
  'ct-museo-emilio-greco': "Piazza San Francesco d'Assisi, 3, 95124 Catania",
  'sr-ortigia-duomo': 'Piazza Duomo, 96100 Siracusa',
  'sr-fonte-aretusa': 'Largo Aretusa, 96100 Siracusa',
  'sr-parco-neapolis': 'Via del Teatro Greco, 96100 Siracusa',
  'ta-teatro-antico-taormina': 'Via Teatro Greco, 1, 98039 Taormina',
  'ta-corso-umberto': 'Corso Umberto I, 98039 Taormina',
  'ta-piazza-ix-aprile': 'Piazza IX Aprile, 98039 Taormina',
  'ta-duomo-taormina': 'Piazza Duomo, 98039 Taormina',
  'ta-odeon-romano': 'Via Timeo, 98039 Taormina',
  'ta-villa-comunale': 'Via Bagnoli Croci, 98039 Taormina',
  'ta-palazzo-corvaja': 'Largo Santa Caterina, 98039 Taormina',
  'ta-madonna-della-rocca': 'Via Madonna della Rocca, 98039 Taormina',
  'ta-castello-taormina': 'Via Madonna della Rocca, 98039 Taormina',
  'ta-isola-bella': 'Via Nazionale, 98039 Taormina',
  'ta-spiaggia-mazzaro': 'Via Nazionale, 98039 Taormina',
  'ta-baia-delle-sirene': 'Via Nazionale, 98039 Taormina',
  'ta-grotta-azzurra': 'Isola Bella, 98039 Taormina',
  'ta-castelmola': "Piazza Sant'Antonio, 98030 Castelmola",
  'ta-etna': 'Piazzale Rifugio Sapienza, 95030 Nicolosi',
  'ta-giardini-naxos': 'Lungomare Tysandros, 98035 Giardini Naxos',
  'ta-parco-archeologico-naxos': 'Via Lungomare Schiso, 98035 Giardini Naxos',
  'ta-letojanni': 'Lungomare di Letojanni, 98037 Letojanni',
  'ta-savoca': 'Piazza Fossia, 98038 Savoca',
  'ta-forza-d-agro': "Piazza Giovanni XXIII, 98030 Forza d'Agro",
  'rg-cattedrale-di-san-giovanni-battista': 'Piazza San Giovanni, 97100 Ragusa',
  'rg-museo-della-cattedrale': 'Piazza San Giovanni, 97100 Ragusa',
  'rg-palazzo-zacco': 'Corso Vittorio Veneto, 97100 Ragusa',
  'rg-palazzo-bertini': 'Corso Italia, 97100 Ragusa',
  'rg-palazzo-schinina-di-sant-elia': 'Via Roma, 97100 Ragusa',
  'rg-palazzo-sortino-trono': 'Via del Mercato, 97100 Ragusa Ibla',
  'rg-ponte-vecchio-di-ragusa': 'Via Roma, 97100 Ragusa',
  'rg-chiesa-di-santa-maria-delle-scale': 'Corso Mazzini, 97100 Ragusa',
  'rg-salita-commendatore-le-scale': 'Salita Commendatore, 97100 Ragusa Ibla',
  'rg-il-palazzo-della-cancelleria': 'Via del Commendatore, 97100 Ragusa Ibla',
  'rg-chiesa-di-santa-lucia': 'Corso Mazzini, 97100 Ragusa',
  'rg-salita-specula': 'Salita Specula, 97100 Ragusa Ibla',
  'rg-duomo-di-san-giorgio': 'Piazza Duomo, 97100 Ragusa Ibla',
  'rg-piazza-duomo': 'Piazza Duomo, 97100 Ragusa Ibla',
  'rg-palazzo-la-rocca': 'Via Capitano Bocchieri, 97100 Ragusa Ibla',
  'rg-circolo-di-conversazione': 'Piazza Duomo, 97100 Ragusa Ibla',
  'rg-palazzo-arezzo-di-donnafugata': 'Corso XXV Aprile, 97100 Ragusa Ibla',
  'rg-piazza-pola': 'Piazza Pola, 97100 Ragusa Ibla',
  'rg-chiesa-di-san-giuseppe': 'Piazza Pola, 97100 Ragusa Ibla',
  'rg-corso-xxv-aprile': 'Corso XXV Aprile, 97100 Ragusa Ibla',
  'rg-giardino-ibleo': 'Via dei Normanni, 97100 Ragusa Ibla',
  'rg-cinabro-carrettieri': 'Via Orfanotrofio, 22, 97100 Ragusa Ibla'
};

const poiAddressOverridesByCityAndName = {
  [poiAddressKey('catania', 'Casa Museo di Giovanni Verga')]: "Via Sant'Anna, 8, 95124 Catania",
  [poiAddressKey('catania', 'Chiesa San Benedetto')]: 'Via Crociferi, 2, 95124 Catania',
  [poiAddressKey('catania', "Chiesa San Francesco D'Assisi all'Immacolata")]:
    "Piazza San Francesco d'Assisi, 95124 Catania",
  [poiAddressKey('catania', 'Chiesa di San Francesco Borgia')]: 'Via Crociferi, 17, 95124 Catania',
  [poiAddressKey('catania', 'Chiesa di San Giuliano')]: 'Via Crociferi, 42, 95124 Catania',
  [poiAddressKey('catania', 'Chiesa di San Placido')]: 'Piazza San Placido, 95131 Catania',
  [poiAddressKey('catania', "Grotta dell'Amenano (Accesso presso Agora Hostel)")]: 'Piazza Curro, 6, 95121 Catania',
  [poiAddressKey('catania', 'Il Pozzo di Gammazita')]: 'Via San Calogero, 95121 Catania',
  [poiAddressKey('catania', 'Lungomare Ognina - San Giovanni Li Cuti')]: 'Lungomare di Ognina, 95127 Catania',
  [poiAddressKey('catania', "Orto Botanico dell'Universita di Catania")]: 'Via Etnea, 397, 95125 Catania',
  [poiAddressKey('catania', 'Palazzo Biscari')]: 'Via Museo Biscari, 10, 95131 Catania',
  [poiAddressKey('catania', 'Palazzo Platamone')]: 'Via Vittorio Emanuele II, 121, 95131 Catania',
  [poiAddressKey('catania', 'Palazzo del Toscano')]: 'Piazza Stesicoro, 38, 95131 Catania',
  [poiAddressKey('catania', 'Palazzo delle Poste')]: 'Via Etnea, 215, 95131 Catania',
  [poiAddressKey('catania', "Piazza Carlo Alberto - Fera 'o Luni")]: 'Piazza Carlo Alberto, 95131 Catania',
  [poiAddressKey('catania', 'Piazza Dante Alighieri')]: 'Piazza Dante Alighieri, 95124 Catania',
  [poiAddressKey('catania', 'Piazza Mazzini')]: 'Piazza Giuseppe Mazzini, 95121 Catania',
  [poiAddressKey('catania', 'Porta Uzeda')]: 'Piazza del Duomo, 95124 Catania',
  [poiAddressKey('catania', "San Nicola l'Arena")]: 'Piazza Dante Alighieri, 95124 Catania',
  [poiAddressKey('catania', 'Via Crociferi')]: 'Via Crociferi, 95124 Catania',
  [poiAddressKey('catania', 'Villa Cerami')]: 'Via Crociferi, 91, 95124 Catania',
  [poiAddressKey('siracusa', 'Anfiteatro Romano')]: 'Via del Teatro Greco, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Area Marina Protetta del Plemmirio')]: 'Plemmirio, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Castello Maniace')]: 'Via Castello Maniace, 51, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Catacombe di San Giovanni')]: 'Largo San Marciano, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Galleria Regionale di Palazzo Bellomo')]: 'Via Capodieci, 14, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Marina di Ortigia')]: 'Foro Vittorio Emanuele II, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Mercato di Ortigia')]: 'Via Emmanuele de Benedictis, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Museo Archeologico Regionale Paolo Orsi')]: 'Viale Teocrito, 66, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Orecchio di Dionisio')]: 'Via Ettore Romagnoli, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Palazzo Beneventano del Bosco')]: 'Piazza Duomo, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Palazzo Vermexio')]: 'Piazza Duomo, 4, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Piccolo Teatro dei Pupi e delle Figure')]: 'Via della Giudecca, 22, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Quartiere della Giudecca (Ortigia)')]: 'Via della Giudecca, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Spiaggia di Cala Rossa')]: "Lungomare d'Ortigia, 96100 Siracusa",
  [poiAddressKey('siracusa', 'Teatro Greco di Siracusa')]: 'Via Luigi Bernabo Brea, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Tempio di Apollo (Ortigia)')]: 'Largo XXV Luglio, 96100 Siracusa',
  [poiAddressKey('siracusa', 'Tempio di Zeus Olimpio')]: 'Via Elorina, 96100 Siracusa',
  [poiAddressKey('palermo-75bdc32e', 'Cappella Palatina')]: 'Piazza del Parlamento, 1, 90129 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Catacombe dei Cappuccini')]: 'Piazza Cappuccini, 1, 90129 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Cattedrale')]: 'Via Vittorio Emanuele, 90134 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Chiesa del Gesu (Casa Professa)')]: 'Piazza Casa Professa, 21, 90134 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Chiesa della Martorana')]: 'Piazza Bellini, 3, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Chiesa di San Cataldo')]: 'Piazza Bellini, 1, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Fontana del Garraffo')]: 'Piazza Garraffo, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Foro Italico')]: 'Foro Italico Umberto I, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Giardino Inglese')]: 'Via della Liberta, 90143 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'La Kalsa')]: 'Quartiere Kalsa, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Mercato del Capo')]: 'Via Cappuccinelle, 90134 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Mercato della Vucciria')]: 'Piazza Caracciolo, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Mercato di Ballaro')]: 'Via Ballaro, 90134 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Monte Pellegrino')]: 'Monte Pellegrino, 90149 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Oratorio di San Lorenzo')]: 'Via Immacolatella, 5, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Orto Botanico di Palermo')]: 'Via Lincoln, 2, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Palazzo Abatellis')]: 'Via Alloro, 4, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Palazzo Chiaramonte-Steri')]: 'Piazza Marina, 61, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Palazzo dei Normanni')]: 'Piazza del Parlamento, 1, 90129 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Piazza Marina')]: 'Piazza Marina, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Piazza Pretoria')]: 'Piazza Pretoria, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Porta Felice')]: 'Foro Italico Umberto I, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Porta Nuova')]: 'Via Vittorio Emanuele, 475, 90134 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Porta dei Greci')]: 'Via Lincoln, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Quattro Canti')]: 'Piazza Vigliena, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Santa Maria dello Spasimo')]: 'Piazza Carlo Maria Ventimiglia, 13, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Santuario di Santa Rosalia')]: 'Via Pietro Bonanno, 90142 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Teatro Massimo')]: 'Piazza Verdi, 90138 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Teatro Politeama Garibaldi')]: 'Piazza Ruggero Settimo, 15, 90139 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Via Maqueda')]: 'Via Maqueda, 90133 Palermo',
  [poiAddressKey('palermo-75bdc32e', 'Villa Giulia')]: 'Via Lincoln, 90133 Palermo'
};

const poiAddressesByCityAndName = poisSeed.reduce(
  (addresses, poi) => {
    const address = poiAddressesById[poi.id];
    if (address) {
      addresses[poiAddressKey(poi.cityId, poi.name)] = address;
    }

    return addresses;
  },
  { ...poiAddressOverridesByCityAndName }
);

function normalizePoiAddressKeyPart(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function poiAddressKey(cityId, name) {
  return `${normalizePoiAddressKeyPart(cityId)}:${normalizePoiAddressKeyPart(name)}`;
}

export function getPoiAddress(poi) {
  const cityId = poi?.cityId || poi?.city_id;
  const name = poi?.name;
  const seededAddress = poiAddressesById[poi?.id];
  const namedAddress = poiAddressesByCityAndName[poiAddressKey(cityId, name)];
  return String(poi?.address || seededAddress || namedAddress || '').trim();
}
