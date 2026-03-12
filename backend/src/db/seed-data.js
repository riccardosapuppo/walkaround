export const citiesSeed = [
  {
    id: 'catania',
    name: 'Catania',
    region: 'Sicilia',
    bundlePrice: 14.99,
    heroImage: '/public/images/catania/piazza-duomo-ct.jpg',
    isDefault: true
  },
  {
    id: 'siracusa',
    name: 'Siracusa',
    region: 'Sicilia',
    bundlePrice: 14.99,
    heroImage: '/public/images/siracusa/fonte-aretusa-sr.jpg',
    isDefault: false
  },
  {
    id: 'taormina',
    name: 'Taormina',
    region: 'Sicilia',
    bundlePrice: 14.99,
    heroImage: '/public/images/taormina-hero.svg',
    isDefault: false
  }
];

export const poisSeed = [
  {
    id: 'ct-piazza-duomo',
    cityId: 'catania',
    name: 'Piazza del Duomo',
    lat: 37.5025,
    lng: 15.0872,
    category: 'Piazza',
    descriptionShort: 'Il cuore nero di Catania batte qui, tra lava e barocco.',
    descriptionLong:
      'Piazza del Duomo è il cuore monumentale e simbolico di Catania, il luogo in cui la città esprime pienamente la propria anima barocca e la sua storia di resilienza. Quasi interamente distrutta dal terremoto del 1693, fu ricostruita trasformando la tragedia in rinascita, con il contrasto tra pietra lavica e pietra chiara che definisce ancora oggi l\'identità del centro storico.',
    imageUrl: '/public/images/catania/piazza-duomo-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 430
  },
  {
    id: 'ct-fontana-amenano',
    cityId: 'catania',
    name: 'Fontana dell\'Amenano',
    lat: 37.50204,
    lng: 15.08701,
    category: 'Monumento',
    descriptionShort: 'La fontana che rivela il fiume nascosto sotto la città.',
    descriptionLong:
      'La Fontana dell\'Amenano si trova accanto alla Pescheria, alle spalle di Piazza del Duomo, nel cuore più autentico e vivace di Catania. Tra il mercato del pesce e il ritmo della città, la fontana si presenta come presenza elegante e silenziosa, in un contrasto continuo tra acqua, pietra lavica e memoria popolare.',
    imageUrl: '/public/images/catania/fontana-dell-amenano-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 320
  },
  {
    id: 'ct-fontana-elefante',
    cityId: 'catania',
    name: 'Fontana dell\'Elefante',
    lat: 37.5025,
    lng: 15.0872,
    category: 'Monumento',
    descriptionShort: 'Un elefante in lava nera, un obelisco e il simbolo di Catania.',
    descriptionLong:
      'La Fontana dell\'Elefante, realizzata nel 1736 da Giovanni Battista Vaccarini, è il simbolo indiscusso di Catania. Al centro domina il celebre Liotru: un elefante in pietra lavica che sostiene un obelisco egizio, immagine che fonde epoche e culture e racconta il legame profondo tra mito cittadino, protezione e identità urbana.',
    imageUrl: '/public/images/catania/Fontana-dellElefante-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 360
  },
  {
    id: 'ct-duomo-catania',
    cityId: 'catania',
    name: 'Cattedrale di Sant\'Agata (Duomo)',
    lat: 37.5024,
    lng: 15.087,
    category: 'Monumento',
    descriptionShort: 'Un tempio nato sulle rovine romane, tra fede e memoria cittadina.',
    descriptionLong:
      'La Cattedrale di Sant\'Agata rappresenta il cuore spirituale di Catania. Dedicata alla patrona martirizzata nel 251, custodisce una devozione che attraversa i secoli e si rinnova ogni anno nelle celebrazioni agatine. Il Duomo è anche il simbolo della rinascita della città dopo il terremoto del 1693, tra architettura monumentale e memoria collettiva.',
    imageUrl: '/public/images/catania/cathedral-of-sant-agata-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 540
  },
  {
    id: 'ct-collegiata',
    cityId: 'catania',
    name: 'Basilica della Collegiata',
    lat: 37.5035,
    lng: 15.0879,
    category: 'Monumento',
    descriptionShort: 'Una facciata barocca scenografica nel cuore di Via Etnea.',
    descriptionLong:
      'La Basilica Maria Santissima dell\'Elemosina, nota come Collegiata, è uno dei massimi esempi di tardo barocco siciliano. Ricostruita dopo il 1693, presenta una facciata dinamica di colonne, statue e cornici che dialogano con la pietra lavica della città e trasformano la strada in un vero scenario teatrale.',
    imageUrl: '/public/images/catania/Collegiata.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 420
  },
  {
    id: 'ct-castello-ursino',
    cityId: 'catania',
    name: 'Castello Ursino',
    lat: 37.4994,
    lng: 15.0785,
    category: 'Museo',
    descriptionShort: 'Una fortezza sveva che ha sfidato mare, lava e secoli di storia.',
    descriptionLong:
      'Il Castello Ursino fu edificato nel XIII secolo per volontà di Federico II come presidio strategico sul mare. Dopo l\'eruzione del 1669, la colata lavica ne modificò il paesaggio ma non ne compromise la struttura. Oggi resta una delle testimonianze più forti della storia civile e politica della città.',
    imageUrl: '/public/images/catania/castello-ursino-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 520
  },
  {
    id: 'ct-teatro-romano',
    cityId: 'catania',
    name: 'Teatro Romano - Odeon',
    lat: 37.5021,
    lng: 15.0829,
    category: 'Archeologia',
    descriptionShort: 'Sotto il barocco cittadino emerge la scena della Catania romana.',
    descriptionLong:
      'Il Teatro Romano di Catania, costruito tra I e II secolo d.C., è incastonato nel centro storico e racconta la stratificazione della città antica. La cavea in pietra lavica e i rivestimenti marmorei testimoniavano la centralità culturale di questo spazio, destinato a spettacoli pubblici e vita civica.',
    imageUrl: '/public/images/catania/Teatro-romano-Odeon-ct2.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 500
  },
  {
    id: 'ct-palazzo-gravina-cruyllas',
    cityId: 'catania',
    name: 'Palazzo GravinaCruyllas',
    lat: 37.502722,
    lng: 15.084167,
    category: 'Cultura',
    descriptionShort: 'Dimora storica nobiliare e luogo legato alla memoria musicale cittadina.',
    descriptionLong:
      'Nel centro storico di Catania, Palazzo Gravina Cruyllas unisce architettura barocca, stratificazioni urbane e vita culturale. Tra corti interne e sale storiche, il palazzo racconta secoli di trasformazioni e conserva un ruolo centrale nel rapporto tra patrimonio artistico e identità cittadina.',
    imageUrl: '/public/images/catania/palazzo-gravina-cruyas-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 410
  },
  {
    id: 'ct-palazzo-elefanti',
    cityId: 'catania',
    name: 'Palazzo degli Elefanti',
    lat: 37.5026,
    lng: 15.0869,
    category: 'Cultura',
    descriptionShort: 'La sede civica di Catania tra facciata barocca e memoria istituzionale.',
    descriptionLong:
      'Il Palazzo degli Elefanti, affacciato su Piazza del Duomo, è la sede del Municipio e uno dei simboli della rinascita successiva al terremoto del 1693. La sua architettura barocca, con balconi e decorazioni in dialogo con la pietra lavica, racconta il legame tra scena urbana e storia politica cittadina.',
    imageUrl: '/public/images/catania/palazzo-degli-elefanti-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 360
  },
  {
    id: 'ct-teatro-bellini',
    cityId: 'catania',
    name: 'Teatro Massimo Bellini',
    lat: 37.5023,
    lng: 15.0931,
    category: 'Cultura',
    descriptionShort: 'Un tempio dell\'opera dedicato a Vincenzo Bellini.',
    descriptionLong:
      'Il Teatro Massimo Bellini, inaugurato nel 1890, è uno dei simboli culturali di Catania. La sala a ferro di cavallo, i velluti rossi, gli stucchi dorati e l\'acustica eccellente fanno di questo luogo una tappa centrale per comprendere la tradizione lirica della città e la sua stagione ottocentesca.',
    imageUrl: '/public/images/catania/teatro-massimo-vincenzo-bellini-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 450
  },
  {
    id: 'ct-pescheria',
    cityId: 'catania',
    name: 'La Pescheria - Mercato del Pesce',
    lat: 37.5018,
    lng: 15.0859,
    category: 'Mercato',
    descriptionShort: 'Il mercato storico dove la voce della città incontra il mare.',
    descriptionLong:
      'Alle spalle di Piazza Duomo, la Pescheria è uno dei luoghi più autentici di Catania. Tra banchi colmi di pesce fresco, pietra lavica bagnata e le tradizionali abbanniate dei venditori, questo mercato restituisce la dimensione popolare e quotidiana della città etnea.',
    imageUrl: '/public/images/catania/pescheria-ct2.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 350
  },
  {
    id: 'ct-via-etnea',
    cityId: 'catania',
    name: 'Via Etnea',
    lat: 37.507,
    lng: 15.0873,
    category: 'Quartiere',
    descriptionShort: 'L\'asse urbano che guida lo sguardo verso l\'Etna.',
    descriptionLong:
      'Via Etnea attraversa Catania in linea retta dal Duomo ai Giardini Bellini e rappresenta la spina dorsale della rinascita barocca. Tra chiese, palazzi nobiliari, attività storiche e prospettive sul vulcano, è il luogo in cui si percepisce con più evidenza il dialogo tra vita quotidiana e paesaggio etneo.',
    imageUrl: '/public/images/catania/via-etnea-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 390
  },
  {
    id: 'ct-monastero-benedettini',
    cityId: 'catania',
    name: 'Monastero dei Benedettini di San Nicolò l\'Arena',
    lat: 37.5079,
    lng: 15.0803,
    category: 'Cultura',
    descriptionShort: 'Uno dei più grandi complessi monastici d\'Europa nel cuore di Catania.',
    descriptionLong:
      'Il Monastero dei Benedettini di San Nicolò l\'Arena è un grande complesso monumentale, ricostruito dopo la lava del 1669 e il terremoto del 1693. Tra chiostri, scale, corti e stratificazioni architettoniche dal Rinascimento al Neoclassico, racconta in modo unico il rapporto tra sapere, città e paesaggio vulcanico.',
    imageUrl: '/public/images/catania/san-nicolo-l-arena-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 560
  },
  {
    id: 'ct-villa-bellini',
    cityId: 'catania',
    name: 'Villa Bellini',
    lat: 37.512,
    lng: 15.0876,
    category: 'Natura',
    descriptionShort: 'Il giardino storico dove Catania rallenta tra viali e panorami sull\'Etna.',
    descriptionLong:
      'Villa Bellini è il principale parco urbano della città, un\'oasi verde nata tra Settecento e Ottocento. Viali alberati, aiuole curate, scalinate e terrazze panoramiche la rendono un punto di equilibrio tra la dimensione barocca del centro e il profilo naturale del vulcano.',
    imageUrl: '/public/images/catania/Villa_Bellini_ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 330
  },
  {
    id: 'ct-piazza-universita',
    cityId: 'catania',
    name: 'Piazza Università',
    lat: 37.5032,
    lng: 15.0888,
    category: 'Piazza',
    descriptionShort: 'Un salotto barocco dove sapere accademico e leggende cittadine si incontrano.',
    descriptionLong:
      'Piazza Università ospita il Palazzo dell\'Università, tra i più antichi atenei siciliani, e i celebri candelabri monumentali che raccontano storie e miti popolari di Catania. Lo spazio urbano unisce eleganza settecentesca, memoria civica e identità culturale contemporanea.',
    imageUrl: '/public/images/catania/piazza-dell-universita-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 300
  },
  {
    id: 'ct-anfiteatro-romano',
    cityId: 'catania',
    name: 'Anfiteatro Romano',
    lat: 37.5077,
    lng: 15.0893,
    category: 'Archeologia',
    descriptionShort: 'Un grande anfiteatro imperiale che emerge sotto la Catania moderna.',
    descriptionLong:
      'In Piazza Stesicoro affiora l\'Anfiteatro Romano, una delle più importanti testimonianze della Katane imperiale. Solo una parte è visibile oggi: il resto resta sotto la città contemporanea, ricordando la dimensione monumentale dell\'antico impianto destinato agli spettacoli pubblici.',
    imageUrl: '/public/images/catania/piazza-stesicoro-ct.jpg',
    audioUrl: '/public/audio/catania-anfiteatroromano.mp3',
    priceSingle: 2.99,
    durationSec: 470
  },
  {
    id: 'ct-mount-etna',
    cityId: 'catania',
    name: 'Mount Etna (escursioni da Catania)',
    lat: 37.5012,
    lng: 15.0923,
    category: 'Natura',
    descriptionShort: 'Il gigante attivo che domina l\'orizzonte e l\'identità della città.',
    descriptionLong:
      'Mount Etna è la presenza naturale più potente del paesaggio catanese: vulcano attivo, patrimonio UNESCO e simbolo della città. Tra colate storiche, terre nere fertili e panorami in continuo cambiamento, racconta la relazione profonda tra Catania, il fuoco e la rinascita.',
    imageUrl: '/public/images/catania/etna2.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 540
  },
  {
    id: 'ct-badia-sant-agata',
    cityId: 'catania',
    name: 'Badia di Sant\'Agata',
    lat: 37.5023,
    lng: 15.0864,
    category: 'Monumento',
    descriptionShort: 'Una chiesa barocca affacciata sul Duomo, tra clausura e skyline cittadino.',
    descriptionLong:
      'La Badia di Sant\'Agata, ricostruita nel Settecento, è uno dei luoghi più suggestivi del centro storico. Legata alla storia del monastero benedettino femminile e alla devozione agatina, racconta il volto religioso e sociale della città barocca nel dialogo continuo con Piazza del Duomo.',
    imageUrl: '/public/images/catania/badia-santAgata.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 340
  },
  {
    id: 'ct-terme-achilliane',
    cityId: 'catania',
    name: 'Terme Achilliane',
    lat: 37.5024,
    lng: 15.0871,
    category: 'Archeologia',
    descriptionShort: 'Sotto la Cattedrale riemerge la memoria termale della Catania romana.',
    descriptionLong:
      'Nel sottosuolo di Piazza del Duomo, le Terme Achilliane conservano tracce della città romana tra III e IV secolo d.C. Il percorso sotterraneo, a pochi passi dal Duomo, mostra in modo diretto la stratificazione storica di Catania e il dialogo tra epoche che convivono nello stesso spazio urbano.',
    imageUrl: '/public/images/catania/Terme-Achilliane-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 360
  },
  {
    id: 'ct-palazzo-san-giuliano',
    cityId: 'catania',
    name: 'Palazzo San Giuliano',
    lat: 37.5029,
    lng: 15.0875,
    category: 'Cultura',
    descriptionShort: 'Un palazzo scenografico che abbraccia Piazza del Duomo.',
    descriptionLong:
      'Palazzo San Giuliano domina uno degli angoli più rappresentativi di Catania con la sua facciata curva settecentesca. Legato alla nobiltà cittadina, racconta il rapporto tra architettura barocca, vita pubblica e rappresentazione sociale nel cuore del centro storico.',
    imageUrl: '/public/images/catania/palazzo-san-giuliano-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 380
  },
  {
    id: 'ct-museo-emilio-greco',
    cityId: 'catania',
    name: 'Museo Emilio Greco',
    lat: 37.502,
    lng: 15.0848,
    category: 'Museo',
    descriptionShort: 'Arte del Novecento in dialogo con le stratificazioni storiche della città.',
    descriptionLong:
      'Accanto alla Cattedrale di Sant\'Agata, il Museo Emilio Greco raccoglie opere dello scultore catanese tra i più importanti del Novecento. Il percorso unisce scultura moderna e contesto archeologico, mostrando come a Catania il linguaggio contemporaneo continui a dialogare con pietra antica, spiritualità e memoria urbana.',
    imageUrl: '/public/images/catania/MUSEO-EMILIO-GRECO-ct.jpg',
    audioUrl: '/public/audio/catania-guide.mp3',
    priceSingle: 2.99,
    durationSec: 390
  },
  {
    id: 'sr-ortigia-duomo',
    cityId: 'siracusa',
    name: 'Duomo di Ortigia',
    lat: 37.0604,
    lng: 15.2946,
    category: 'Monumento',
    descriptionShort: 'Tempio dorico trasformato in cattedrale sull\'isola di Ortigia.',
    descriptionLong:
      'La Cattedrale di Siracusa ingloba colonne doriche del tempio di Atena in un impianto barocco unico. è un esempio straordinario di continuità storica nel Mediterraneo.',
    imageUrl: '/public/images/siracusa-duomo.svg',
    audioUrl: '/public/audio/siracusa-guide.mp3',
    priceSingle: 2.49,
    durationSec: 360
  },
  {
    id: 'sr-fonte-aretusa',
    cityId: 'siracusa',
    name: 'Fonte Aretusa',
    lat: 37.0585,
    lng: 15.2928,
    category: 'Natura',
    descriptionShort: 'La sorgente leggendaria a pochi passi dal mare.',
    descriptionLong:
      'Secondo il mito, Aretusa si trasformò in sorgente per sfuggire ad Alfeo. Oggi la fonte è uno dei simboli più riconoscibili di Ortigia, con papiri che crescono in acqua dolce vicino alla costa.',
    imageUrl: '/public/images/siracusa/fonte-aretusa-sr.jpg',
    audioUrl: '/public/audio/siracusa-guide.mp3',
    priceSingle: 2.49,
    durationSec: 305
  },
  {
    id: 'sr-parco-neapolis',
    cityId: 'siracusa',
    name: 'Parco Archeologico della Neapolis',
    lat: 37.0758,
    lng: 15.2786,
    category: 'Archeologia',
    descriptionShort: 'Teatro greco, latomie e Orecchio di Dionisio.',
    descriptionLong:
      'Neapolis raccoglie alcuni tra i più importanti monumenti della Siracusa antica. Le cave, il teatro e gli scenari naturali rendono il sito uno snodo centrale per comprendere la Magna Grecia.',
    imageUrl: '/public/images/neapolis.svg',
    audioUrl: '/public/audio/siracusa-guide.mp3',
    priceSingle: 2.49,
    durationSec: 420
  },
  {
    id: 'ta-teatro-antico',
    cityId: 'taormina',
    name: 'Teatro Antico di Taormina',
    lat: 37.8528,
    lng: 15.2929,
    category: 'Archeologia',
    descriptionShort: 'Il teatro con vista iconica su Etna e Ionio.',
    descriptionLong:
      'Costruito in età ellenistica e trasformato dai romani, il teatro antico di Taormina unisce spettacolo e paesaggio. La cavea affacciata sul mare è tra le immagini più celebri della Sicilia orientale.',
    imageUrl: '/public/images/teatro-taormina.svg',
    audioUrl: '/public/audio/taormina-guide.mp3',
    priceSingle: 2.49,
    durationSec: 402
  },
  {
    id: 'ta-corso-umberto',
    cityId: 'taormina',
    name: 'Corso Umberto',
    lat: 37.8512,
    lng: 15.2857,
    category: 'Quartiere',
    descriptionShort: 'La via pedonale tra negozi storici e scorci panoramici.',
    descriptionLong:
      'Corso Umberto collega Porta Messina a Porta Catania attraversando piazze, chiese e terrazze con vista. è il cuore sociale di Taormina, ideale per una visita lenta.',
    imageUrl: '/public/images/corso-umberto.svg',
    audioUrl: '/public/audio/taormina-guide.mp3',
    priceSingle: 2.49,
    durationSec: 275
  },
  {
    id: 'ta-isola-bella',
    cityId: 'taormina',
    name: 'Isola Bella',
    lat: 37.851,
    lng: 15.3036,
    category: 'Natura',
    descriptionShort: 'Riserva naturale tra acqua trasparente e macchia mediterranea.',
    descriptionLong:
      'Isola Bella è un piccolo paradiso collegato alla costa da una sottile lingua di sabbia. Tra sentieri e mare, il sito offre uno dei paesaggi più fotografati della zona.',
    imageUrl: '/public/images/isola-bella.svg',
    audioUrl: '/public/audio/taormina-guide.mp3',
    priceSingle: 2.49,
    durationSec: 298
  }
];

export const hotelCodesSeed = [
  {
    code: 'CATANIAHOTEL2026',
    cityId: 'catania',
    isActive: true
  },
  {
    code: 'ETNAWELCOME',
    cityId: 'catania',
    isActive: true
  }
];
