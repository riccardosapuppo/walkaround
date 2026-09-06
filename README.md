# Walk Around

![La mappa dei luoghi, la scheda di un punto di interesse con l'anteprima da trenta secondi, e la schermata iniziale con il catalogo di una città](docs/schermate.webp)

Un'audioguida è un file mp3. Il turista paga 2,49–2,99 € per un punto di interesse, oppure 15 € per la città intera, e quello che riceve in cambio non è il file — il file esiste già, sta su un disco, ed è raggiungibile via HTTP — ma il **permesso** di ascoltarlo. Tolto il permesso, questo progetto è un archivio di 739 mp3 aperto a chiunque conosca un indirizzo.

Il permesso era una riga, e non funzionava:

```js
if (percorso.startsWith('audio/')) return res.status(403).json(…);
```

Il valore su cui era scritto quel confronto è `req.path`, che Express **non** decodifica. Due righe più sotto, sullo stesso prefisso, c'è `express.static`, che **decodifica**. Quindi

    GET /public/%61udio/catania/anfiteatro-romano-en.mp3

non cominciava per `audio/`, superava il controllo, e veniva servita dallo strato che nel frattempo aveva letto `%61` come `a`. Senza sessione, senza acquisto, e senza niente da vedere nei log: è una richiesta come le altre, e finisce con un 200. Il difetto non stava in una parte complicata, stava fra due strati che trattano la stessa stringa in due modi diversi — ed è di questo che parla il repository: non di come si vende un audio, che sono due tabelle, ma di dove si mettono i controlli perché non dipendano da come è scritta una richiesta.

**I 739 mp3 non stanno in questo repository.** Sono il prodotto, erano versionati, ed erano la sola ragione per cui questo repository non poteva essere pubblicato: sono stati tolti da tutta la cronologia, e al loro posto c'è un segnaposto silenzioso da 20 KiB. Come e perché sta più sotto, in [«Il repository conteneva il prodotto»](#il-repository-conteneva-il-prodotto); le audioguide vere si ascoltano su <https://walkaround.cloud>.

Arriva con sei affermazioni, e ognuna può essere falsa:

| | |
| --- | --- |
| **Il blocco dell'audio a pagamento non dipende da come è scritto il percorso.** | Il confronto testuale che c'era lasciava passare `%61udio`, `aud%69o`, `audio%2Fcatania`: **739** file, cioè l'intera libreria a pagamento. |
| **Nessuna rotta si fida dello `userId` scritto nella richiesta.** | **Sei** rotte lo prendevano dalla query o dal corpo e non guardavano affatto la sessione. Fra queste `DELETE /api/me/purchases`, che cancella gli acquisti di chiunque venga nominato. |
| **Un link mandato per posta punta a un indirizzo di un elenco scritto da noi.** | L'origine del link di reset password arrivava dal corpo della richiesta, e l'unico controllo era che lo schema fosse `http` o `https`: **qualunque** dominio lo superava, e la vittima riceveva una email vera con dentro un token valido. |
| **Un segreto che manca ferma l'avvio.** | Le password erano valori di **ripiego** in `config/env.js`: senza variabile d'ambiente il programma partiva lo stesso, sulle credenziali scritte nel codice, e nessuno se ne accorgeva. Il `Dockerfile` faceva `COPY .env.example ./.env`. |
| **Nessuna immagine del catalogo porta i metadati di qualcun altro.** | Su **128** fotografie, **24** avevano in EXIF, IPTC o XMP il copyright di altri fotografi — campi che non si vedono aprendo il file. |
| **Nessuna query contiene un commento JavaScript.** | Dentro una stringa, `// spiegazione` è JavaScript valido e `node --check` passa. Postgres si ferma su `//`, che in SQL non è un commento, e quella query stava dentro un `catch` dentro un altro `catch` vuoto: la riga non veniva aggiornata, per sempre, in silenzio. |

```
cd backend && npm test        # 44 prove, nessun database, meno di un secondo
```

Le prove tengono la prima, la terza, la quinta e la sesta. La seconda e la quarta sono scritte nel codice — `requireAppUser` in `routes/api.js`, `required()` in `config/env.js` — ma non hanno ancora una prova che diventi rossa se qualcuno le toglie, ed è la cosa che manca per prima. Prima di questo lavoro le prove erano **zero**.

---

## Prima di cominciare

**Node 22 o più recente** e **Docker**.

```
node --version        # il backend dichiara >=22, l'immagine è node:22-alpine
```

**Gli mp3 non ci sono, e l'applicazione parte lo stesso.** Il catalogo a pagamento — 739 file, circa 2,4 GiB — era versionato in LFS, e adesso non sta in nessun commit. Al suo posto c'è un file solo, `backend/public/audio/segnaposto.mp3`: cinque secondi di silenzio, 20 KiB, che si rifanno con `npm run audio:segnaposto`. Tutti i 66 punti di interesse del seed puntano lì, quindi un'installazione nuova mostra il catalogo, vende, taglia l'anteprima e riproduce — e quello che si sente non è una guida. Le audioguide vere stanno sul servizio in esercizio, <https://walkaround.cloud>.

**La configurazione non ha valori di ripiego, ed è voluto.** Senza `DB_PASSWORD` il backend non parte e stampa che cosa gli manca. Prima ripiegava sulla password scritta nel sorgente, che è il motivo per cui una variabile dimenticata non si è mai notata.

### Lo stack, con Docker

Il `docker-compose.yml` legge la password da un `.env` accanto a sé, che non è versionato. La sintassi `${DB_PASSWORD:

```
git clone <questo repository>
cd walkaround

echo "DB_PASSWORD=$(openssl rand -base64 24)" > .env
docker compose up
```

- frontend (nginx): `http://localhost:8080`
- API: `http://localhost:3001`
- PostgreSQL 16: `localhost:5433`

I due volumi (`walkaround_pgdata` per il database, `walkaround_public` per i file caricati dalla dashboard) sono i dati: `docker compose down -v` li cancella.

### In sviluppo, senza container il backend

```
cp backend/.env.example backend/.env      # e riempi almeno DB_PASSWORD

cd backend
npm install
npm run dev                                # http://localhost:3000
npm test                                   # 44 prove

cd ../frontend
npm install
npm start                                  # http://localhost:4200
```

Il dev server Angular gira su 4200 e inoltra `/api` e `/public` a `localhost:3000` (`frontend/proxy.conf.json`). Lo schema e il catalogo iniziale li crea il backend al primo avvio; `DB_SEED_MODE` (`always`, `if-empty`, `never`) decide se riscriverlo, e in compose vale `if-empty`: chi prova il progetto ci trova dentro le quattro città invece di una schermata vuota, e un catalogo già popolato non viene toccato.

### Cosa non serve per far partire tutto

Niente chiave OpenAI, niente credenziali PayPal, niente SMTP. La posta è opzionale: senza un host configurato l'invio non parte e lo dice a parole, invece di fallire dentro le rotte con un errore di rete che non spiega niente. Le chiavi di PayPal e di OpenAI non stanno affatto nell'ambiente, si mettono dalla dashboard e vivono in due tabelle; gli script di traduzione e di sintesi vocale sono comandi separati che non partecipano all'avvio. `ADMIN_EMAIL` e `ADMIN_PASSWORD` servono soltanto alla primissima installazione: creano l'amministratore se non c'è e non lo toccano se c'è già.

---

## Cosa c'è dentro

| | |
| --- | --- |
| `backend/src/media/paths.js` | Dove finisce davvero un percorso chiesto da fuori. Il file che sostituisce il confronto fra stringhe, e che spiega per esteso perché quello non poteva funzionare. |
| `backend/src/media/strip-metadata.js` | Toglie i metadati da un'immagine senza ricomprimerla, e sa che dopo la fine di un JPEG ce ne può stare un altro. |
| `backend/src/auth/origins.js` | Su quale indirizzo si costruisce un link che finisce dentro una email. Un elenco, perché la domanda giusta è «è uno dei nostri?» e a quella non risponde nessuna regola sulla forma. |
| `backend/src/config/env.js` | La configurazione, e che cosa succede quando manca: si ferma, e dice quali. |
| `backend/src/routes/api.js` | Le rotte pubbliche: catalogo, anteprime, audio completo, checkout PayPal, acquisti, codici struttura. |
| `backend/src/routes/admin.js` | La dashboard: catalogo, strutture partner, PDF e QR, impostazioni, documenti legali. |
| `backend/src/routes/app-auth.js`, `auth.js` | Due mondi di sessioni distinti: gli utenti dell'app e chi amministra. |
| `backend/src/db/init.js` | Schema e migrazioni, 26 tabelle, idempotenti. |
| `backend/src/db/seed-data.js` | Il catalogo di partenza: 4 città siciliane e 66 punti di interesse. |
| `backend/media-manifests/poi-audio-manifest.json` | 729 righe: per ogni file audio, il punto di interesse, la lingua, il modello, la voce e la data. |
| `backend/scripts/` | Traduzione, sintesi vocale, applicazione del manifesto, spoglio dei metadati delle immagini, generazione del segnaposto audio. Quelli che scrivono nel catalogo hanno un `--dry-run`. |
| `backend/test/` | 44 prove. Nessuna tocca il database. |
| `frontend/src/app/core/interceptors/` | Il token di sessione su ogni chiamata al backend, una volta sola invece che rotta per rotta. |
| `frontend/src/app/features/` | 13 schermate: welcome, home, mappa, dettaglio, player, i miei audio, preferiti, carrello, profilo, registrazione partner, dashboard. |
| `docs/immagini.md` | Da dove vengono le immagini, e le ventiquattro che sono state tolte. |

Il frontend è una PWA: Angular 21, Angular Material, Leaflet per la mappa, service worker con cache di runtime per le immagini e per le anteprime audio, geolocalizzazione con ripiego se negata, download per l'ascolto offline (Cache API più metadati in IndexedDB), interfaccia in sei lingue.

### I contenuti sono generati, e il manifesto lo registra

Le schede sono scritte in italiano e tradotte con `gpt-4o-mini`. L'audio delle traduzioni è sintetizzato con `gpt-4o-mini-tts`. Il manifesto conserva **729 voci**, una per file, ognuna con modello, voce, lingua, punto di interesse e data.

Serve a due cose concrete. La prima è poter rispondere «da dove viene questo file» senza aprirlo. La seconda è che i conti si vedono: 146 punti di interesse per cinque lingue tradotte farebbero 730, e le voci sono 729 — all'inglese ne manca una. Non è un errore che si nota ascoltando; si nota contando.

L'italiano non è nel manifesto perché non è generato: è la lingua in cui il testo è stato scritto.

### Come si vende

Anteprima gratuita di **30 secondi** per ogni punto di interesse, in tutte e sei le lingue, senza account: `GET /api/pois/:id/audio-preview` taglia il file completo e conserva il ritaglio. L'audio intero è `GET /api/pois/:id/audio`, e chiede una sessione e un acquisto — il singolo punto oppure il pacchetto della sua città.

Il canale principale non è la pubblicità, è **B2B2C**. Hotel, B&B e case vacanza espongono un QR con un codice: l'ospite lo scansiona, arriva sull'app con lo sconto già applicato, e alla struttura resta una **commissione fissa** per ogni vendita — colonne `structure_fixed_amount_single` e `structure_fixed_amount_bundle`, separate dallo sconto in percentuale che vede il turista, perché sono due decisioni diverse e vanno potute cambiare una alla volta.

Il PDF con il QR che le strutture ricevono per email è scritto a mano: `backend/src/services/partner-pdf.js` importa soltanto `node:fs`, `path`, `url` e `zlib`, e dentro c'è anche l'encoder Reed-Solomon del codice QR. Nessuna libreria.

---

## Le cose che erano sbagliate, e cosa le ha sostituite

### Il controllo si faceva sulla forma del percorso

Descritto in apertura. Sostituito da `resolveInside`, che decodifica, rifiuta le percentuali malformate e i byte nulli, risolve il percorso, e poi guarda **dove è finito** con `path.relative` — non con `startsWith`, perché `/public/audio-x` comincia per `/public/audio` e non ci sta dentro.

La lezione vale oltre a questo caso: le forme testuali di un percorso sono infinite — la percentuale, la doppia codifica, la barra rovesciata, il punto punto, la maiuscola su un filesystem che non distingue — mentre il posto in cui quel percorso finisce è uno solo. Un controllo di sicurezza si fa sul secondo.

La stessa funzione, per giunta, era già scritta due volte, identica, in `routes/api.js` e in `routes/admin.js`. Il punto in cui contava di più faceva un'altra cosa.

Diciassette prove in `backend/test/paths.test.js` sono scritte per fallire sul codice vecchio.

### E la porta accanto non la guardava nessuno

Chiuso il blocco, l'audio intero usciva lo stesso, da un'altra parte. Le anteprime da trenta secondi si scrivevano in `public/audio-previews`, cartella sorella di quella sorvegliata, e la lunghezza del taglio si calcolava dalla durata dichiarata in `duration_sec` — che la scrive l'amministratore, e che lo schema accetta anche uguale a 1. Con una durata di un secondo la proporzione veniva schiacciata a «tutto», e l'anteprima era una copia integrale del file, servita senza sessione dalla porta accanto a quella chiusa.

Due correzioni, e la prima toglie la domanda invece di aggiungere un controllo: **le anteprime sono uscite da `public/`**. La rotta che le serve legge dal disco con `sendFile` e non ha mai avuto bisogno che fossero raggiungibili via URL, quindi adesso non lo sono, e non c'è niente da difendere perché non c'è nessuna porta. La seconda è un tetto che non dipende dai dati: qualunque cosa dica `duration_sec`, quello che esce è al massimo metà del file.

### Sei rotte chiedevano alla richiesta stessa chi fosse chi la mandava

Il controllo esisteva già ed era già giusto. Si chiamava `requireCheckoutAppUser` e stava su due rotte di pagamento — e siccome il nome diceva «checkout», nessuno ha pensato di metterlo altrove. Queste sei prendevano lo `userId` dalla query o dal corpo:

```
POST   /api/paypal/checkout/quote
GET    /api/me/purchases
DELETE /api/me/purchases
POST   /api/hotel/validate
GET    /api/me/hotel-association
DELETE /api/hotel/association
```

È un dettaglio che sembra estetico e non lo è: **un controllo con un nome che descrive una rotta non viene riusato**, e la rotta che ne ha bisogno domani si scrive senza.

La prima correzione, però, pretendeva una sessione **sempre**, e così spegneva chi una sessione non ce l'ha mai avuta. Qui convivono due specie di identità, e non è un difetto: chi ha un account, la cui prova è il token in `app_sessions`; e l'**ospite**, a cui il browser genera un uuid al primo avvio, che è l'unica cosa che ha. Chi scansiona il QR di un albergo atterra su `/welcome` e la prima cosa che l'applicazione fa è chiedere se quel codice vale — molto prima che esista un account, e per l'albergo quel momento è tutto il modello di business.

La regola, adesso:

| | |
| --- | --- |
| sessione presente, e parla di sé | passa |
| sessione presente, e parla di un altro | 403 |
| nessuna sessione, e lo `userId` è di un account registrato | 401 |
| nessuna sessione, e non è di nessuno | passa: è un ospite |

Cioè **non si può indossare un account senza il suo token**, che era tutto il difetto, mentre l'uuid dell'ospite resta autodichiarato come è sempre stato: non c'è niente da rubargli che non sia già suo, e cambiarlo vorrebbe dire obbligare tutti a registrarsi prima di vedere un prezzo.

Il token, dal canto suo, il frontend non lo mandava su nessuna di quelle sei rotte, perché non gli era mai servito. Aggiungerlo in sei posti e ricordarsene alla settima rotta sarebbe la stessa specie di soluzione che ha creato il problema — una regola tenuta a mente invece che dal codice — quindi sta in un `HttpInterceptor` solo, e vale anche per le rotte che non esistono ancora.

### Il link di reset lo sceglieva chi chiedeva il reset

```
POST /api/app-auth/password-reset
{ "email": "vittima@esempio.it", "origin": "https://sito-di-chi-attacca" }
```

Il servizio mandava alla vittima una email vera, dal dominio giusto, con dentro un token di reset valido, puntato altrove. Un clic e l'account cambiava padrone. Non serviva essere autenticati.

Il difetto non è «mancava una validazione»: la validazione c'era e chiedeva se lo schema fosse `http` o `https`. È che **la domanda era sbagliata**. «Questa stringa è una URL ben formata?» è una domanda sulla forma; quella che conta è «questo indirizzo è uno dei nostri?», che è una domanda sull'identità, e a cui si può rispondere solo con un elenco scritto a mano. Non esiste una regola che distingua il proprio dominio da quello di un altro.

`pickOrigin` non solleva mai e non distingue i casi nel valore di ritorno: se rifiutasse un'origine con un errore, quell'errore direbbe a chi prova che l'indirizzo email esiste. E la stessa rotta lo diceva comunque, dieci righe più sotto — con un indirizzo che non esiste rispondeva 200, con uno vero provava a spedire, e se la posta non è configurata l'invio falliva e usciva un 500. Adesso il fallimento dell'invio non cambia la risposta: va nel log del server, che lo legge chi gestisce la macchina e non chi sta provando gli indirizzi.

Quattro rotte gemelle in `admin.js` — invito, approvazione di un partner, rinvio dell'attivazione, reset fatto dall'amministratore — sono rimaste indietro per un po', con la versione vecchia e più debole. Adesso l'elenco delle origini si costruisce in un punto solo e ci passano tutte e cinque.

### Le password erano valori di ripiego

```js
password: process.env.DB_PASSWORD || '<la password vera>'
```

Il ripiego era la parte pericolosa, più ancora del fatto che la stringa stesse in chiaro nel repository. Una password scritta qui finisce in git e la si toglie. Una password scritta qui **come ripiego** fa anche un'altra cosa: se la variabile d'ambiente non arriva — un `.env` dimenticato, una riga scritta male nel compose, un container ricostruito senza — il programma parte lo stesso, si collega, funziona. Il guasto non fa rumore, e il servizio resta in piedi sulla credenziale che sta nella storia del repository.

E il `Dockerfile` faceva `COPY .env.example ./.env`, con dentro le credenziali di produzione: l'immagine se le portava addosso, e chiunque potesse farci `docker run` le aveva.

Adesso i segreti non hanno ripiego: se mancano, il programma si ferma e dice quali, tutti insieme e non uno per volta. È scomodo apposta — un avvio fallito è un problema che si vede. Restano con un default i valori non segreti, porta e host e origine CORS, perché sbagliarli non espone niente.

### Ventiquattro fotografie erano di qualcun altro

Il catalogo aveva 128 immagini e nessuna provenienza dichiarata: né un file di crediti, né una colonna nello schema, né una riga nel README. Leggendo EXIF, IPTC e XMP, **ventiquattro** portavano il copyright di altri fotografi, una con licenza CC BY-SA dove l'attribuzione *è* la licenza, una di un'agenzia stock commerciale. Altre dodici avevano la firma del ridimensionatore di un CMS, cioè erano state salvate da pagine web.

Le ventiquattro sono state **sostituite** con un segnaposto disegnato per il progetto. Togliere i metadati non le avrebbe rese nostre: cancellare la firma di un fotografo non è un modo di acquisire una fotografia, è solo un modo di perdere l'informazione su chi l'ha fatta.

Le altre sono state spogliate dei metadati — una fotografia porta addosso le coordinate GPS di dove è stata scattata e il numero di serie della macchina, e questo catalogo è pubblico. Lo spoglio è senza perdita: toglie i segmenti di intestazione e non tocca i pixel. E non può ricapitare, perché `POST /api/admin/catalog/upload-image` passa ogni file da `stripImageMetadata` **prima** di scriverlo su disco.

Quello spoglio, però, si fermava dove finisce la prima immagine e copiava il resto senza guardarlo — e i telefoni attaccano dietro una **seconda immagine intera**, con dentro il proprio EXIF e il proprio GPS. Il modulo scritto per non pubblicare dove abita qualcuno lo pubblicava lo stesso, dichiarando di no: un controllo che si ferma al primo risultato utile non è un controllo, è un campione. Adesso i dati compressi si attraversano davvero fino alla fine, riconoscendo il riempimento e i marcatori di riavvio, e quello che segue si butta.

Nello stesso giro APP14 è tornato fra i segmenti che restano — dichiara lo spazio colore, cioè come si leggono i pixel, non chi ha scattato — e l'orientamento sopravvive da solo, in un APP1 ricostruito con una voce sola: altrimenti ogni futura foto verticale finirebbe in catalogo coricata di novanta gradi.

**I conti di oggi**, contati e non ricordati (`git ls-files backend/public/images`, confronto per SHA-256): **112 file** tracciati, di cui **17 sono copie del segnaposto** e 95 sono fotografie vere; le immagini distinte sono 94. I numeri del paragrafo qui sopra — 128 e ventiquattro — descrivono il catalogo **com'era quando è stata fatta la pulizia**, e sono la misura del problema, non dello stato attuale: da allora il catalogo si è mosso, e una cartella di quattordici SVG che non nominava nessuno è stata tolta.

Restano dei punti di interesse con un segnaposto al posto della fotografia. Vanno rifatte. Tutta la storia, con l'elenco, è in `docs/immagini.md`.

### Un commento JavaScript dentro una query

Fatto mentre si sistemava la gestione degli errori di PayPal: delle righe di spiegazione sono finite dentro il template literal invece che sopra.

```js
await pool.query(`
  // Che cosa si scrive qui dipende da…      <- dentro l'SQL
  UPDATE paypal_checkout_orders …
`);
```

`node --check` passa, perché è JavaScript perfettamente valido: dice soltanto che la stringa è una stringa. Postgres si sarebbe fermato su `//`, che in SQL non è un commento — lo è `--`. E la query stava dentro un `catch` con dentro un altro `catch` vuoto, quindi il guasto non sarebbe arrivato da nessuna parte: la riga semplicemente non veniva aggiornata.

Qui dentro di linguaggi ce ne sono due, e il secondo non lo guardava nessuno. Adesso una prova legge i sorgenti, trova i template literal che cominciano con una parola chiave SQL, e fallisce se dentro c'è una riga che comincia per `//`.

### Un incasso riuscito spariva sotto la parola «fallito»

Nella cattura PayPal esisteva un booleano: i soldi sono stati presi, oppure no. Ma i casi sono tre, e quello che mancava è il più probabile — **la chiamata che non torna**. Timeout, connessione chiusa, 502 del proxy davanti: PayPal ha eseguito, e da questa parte non si sa. Il booleano restava falso, e l'ordine veniva marcato `failed`.

Adesso lo stato si segna *prima* della chiamata e vale «ignoto», che conta come incasso: quando non si sa si sceglie l'errore dalla parte in cui qualcuno guarda, perché una riga che dice il falso chiude il caso per sempre, mentre una che dice «guardami» costa una verifica a mano. Insieme allo stato si conservano l'identificativo della capture e la risposta, senza i quali chi deve riconciliare non ha da dove cominciare.

### Il repository conteneva il prodotto

Questo limite non l'ha trovato una prova e nemmeno una revisione da fuori: era **scritto in questo README**, nell'elenco di quello che manca, e c'è rimasto finché non è stato risolto. Diceva che i 739 mp3 a pagamento erano versionati in LFS, circa 2,4 GiB, e che il paywall difende `/public/audio` via HTTP — ma `git clone` non passa dal paywall e consegnava la libreria intera. Finché il repository restava privato non cambiava niente; renderlo pubblico voleva dire pubblicare il catalogo.

Un progetto che si presenta con l'elenco delle cose che erano sbagliate non può tenere in vetrina l'unica che lo rende impubblicabile.

Gli mp3 sono stati tolti da **tutta la cronologia**, non dall'ultimo commit: un file cancellato oggi resta dentro ogni commit che lo conteneva, e chi clona se lo porta a casa lo stesso. Il repository è passato da 2,4 GiB di oggetti LFS a **zero puntatori**, e i **75 commit ci sono tutti e 75** — è cambiato quello che i commit contengono, non quali commit esistono. Dal `.gitattributes` è sparita la regola LFS, che non filtrava più niente.

Al posto del catalogo c'è un file solo: `backend/public/audio/segnaposto.mp3`, cinque secondi di silenzio, 20 KiB, che `backend/scripts/genera-audio-segnaposto.js` ricostruisce byte per byte — MPEG-1 Layer III, frame di soli zeri, che è il modo in cui il formato dice «qui non c'è niente da suonare». Generato invece che preso da qualche parte, per la stessa ragione delle ventiquattro fotografie: un file che arriva da fuori si porta dietro la domanda di chi è.

Toglierli ha fatto diventare rossa `backend/test/seed-percorsi.test.js`, perché cinque `audioUrl` del seed nominavano file che non c'erano più. Era il comportamento giusto: quella prova chiede «il file c'è?», e la risposta era no. Le si è data una risposta invece di cambiarle la domanda — se guardasse la forma dell'URL smetterebbe di trovare proprio i due difetti per cui è nata, che erano due file nel posto sbagliato dietro URL di forma perfetta.

Resta una regola in `.gitignore`, perché `npm run git` fa `git add .` senza che nessuno guardi: sotto `backend/public/audio/` passa soltanto il segnaposto. Senza quella regola basterebbe un giro per rimettere dentro 2,4 GiB, e la volta dopo toccherebbe riscrivere di nuovo la cronologia.

---

## Quello che manca ancora

- **Le credenziali vecchie sono ancora nella cronologia, e vanno ruotate.** È la voce più urgente dell'elenco. Password del database, password dell'amministratore, password SMTP di una casella reale, indirizzo e utente del server: tolte dai file, restano in 53 versioni di `backend/.env.example` e nelle vecchie versioni del README, tutte già su GitHub. Toglierle da un file non le toglie a chi ha clonato.
- **Nessuna prova tocca il database né una rotta.** Le 44 coprono funzioni pure e la forma dei sorgenti. Il controllo di autorizzazione più importante — «la sessione è quella dell'utente nominato» — è verificato a mano contro il programma in esecuzione, non da una prova che si rilancia da sola, e dovrebbe essere il prossimo passo.
- **`migrateClientUserDataToAppUser` si fida dello `userId` nel corpo della richiesta.** In `backend/src/routes/app-auth.js`, sposta gli acquisti fatti da ospite sull'account che si registra. Quell'uuid è l'unica cosa che un ospite ha, quindi non c'è un token da chiedere; la migrazione è di fatto una sola volta, perché le righe di partenza vengono spostate. Resta che chi conoscesse l'uuid di un ospite potrebbe rivendicarne gli acquisti registrandosi. Il modo giusto è legare l'uuid alla sessione che l'ha creato, e non è stato fatto.
- **Le chiavi di PayPal e di OpenAI stanno nel database in chiaro.** Tolte dall'ambiente e dall'immagine, non ancora cifrate a riposo. Chi legge quel database le legge.
- **Chi installa non ha le audioguide.** Il seed punta al segnaposto silenzioso, quindi la catena si prova tutta — anteprima, acquisto, riproduzione — ma il contenuto no. È il prezzo di non pubblicare il catalogo, ed è scelto.
- **Ventiquattro punti di interesse hanno un segnaposto** al posto della fotografia.
- **Il repository non è il catalogo di esercizio.** Il seed versionato è quattro città e 66 punti; il manifesto degli audio ne registra 146, su sei città. Quello che sta in produzione è più grande di quello che sta qui.
- **Il flusso è provato con PayPal in sandbox.** La modalità `live` si sceglie dalla dashboard, e l'unica differenza che il codice conosce è l'indirizzo a cui parla.

---

## Sul progetto

Progetto personale dell'autore, non un lavoro per un cliente. È in esercizio su <https://walkaround.cloud/>.

Il README che questo sostituisce conteneva l'indirizzo del server, l'utente per l'accesso remoto e la password del database, in chiaro. Non ci sono più **in nessun file di adesso**: la configurazione arriva dall'ambiente, e quando manca il programma si ferma invece di ripiegare su qualcosa scritto da qualche parte.

**Ci sono ancora nella cronologia di git, e questo va detto.** Un valore tolto da un file resta nei commit che lo contenevano: `backend/.env.example` ne ha 53 versioni con dentro delle credenziali, e il vecchio README ne ha altre. Sono commit già spinti, quindi l'unica correzione che vale qualcosa **è ruotare quelle credenziali** — riscrivere la cronologia non le toglie a chi ha già clonato, e non le toglie dalle copie che GitHub tiene raggiungibili per SHA.

---

## Licenza

MIT — vedi [LICENSE](LICENSE).

Sviluppato da Riccardo Sapuppo.
