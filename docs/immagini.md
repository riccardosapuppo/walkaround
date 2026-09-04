# Le immagini: da dove vengono, e le ventiquattro che sono state tolte

Questo file esiste perché una cosa è andata storta e conviene che resti scritta,
invece di essere sistemata in silenzio.

## Che cosa è successo

Il catalogo conteneva 128 immagini. Nessuna aveva una provenienza dichiarata: né
un file di crediti, né una colonna nello schema, né una riga nel README. Si
guardavano le fotografie e non c'era modo di sapere di chi fossero.

Leggendo i metadati — EXIF, IPTC e XMP, che sono campi che non si vedono
aprendo l'immagine — **ventiquattro portavano il copyright di qualcun altro**:

| chi | file |
|---|---|
| Lorenzo Taccioli | 14, con l'indirizzo del suo sito in quattro campi diversi |
| Alessandro Saffo | 2, «tutti i diritti riservati» |
| Filippo Poli | 2 |
| Christophe Faugere | 1, in sei campi concordi |
| S. Leggio / Sicilystockphoto.com | 1, agenzia stock commerciale |
| Berthold Werner | 1, da Wikimedia Commons, licenza CC BY-SA |
| Barbagiovanni Giuseppe, Valentina | 2 |
| — | 1 con `File source: commons.wikimedia.org` scritto nel commento JPEG |

Altre dodici portavano `CREATOR: gd-jpeg` o `Compressed by jpeg-recompress`: è
la firma del ridimensionatore di un CMS, cioè erano state salvate da pagine web.

## Che cosa è stato fatto

**Le ventiquattro sono state sostituite** con `backend/public/images/segnaposto.jpg`,
un'immagine disegnata per questo progetto: un tramonto sul mare, senza scritte
perché le schede esistono in sei lingue, e senza un luogo riconoscibile perché
deve andare bene per qualsiasi punto di interesse. È lo stesso file per tutte e
ventiquattro, quindi git ne conserva una copia sola.

**Le altre 104 sono state ripulite dei metadati.** Non per nascondere qualcosa:
una fotografia porta addosso le coordinate GPS di dove è stata scattata e il
numero di serie della macchina, e questo catalogo è pubblico. Lo spoglio è
**senza perdita** — toglie i segmenti di intestazione e non tocca i pixel,
verificato confrontando le immagini decodificate prima e dopo.

**E non può ricapitare**: `POST /api/admin/catalog/upload-image` passa ogni file
da `stripImageMetadata` *prima* di scriverlo su disco. Quello che non viene
scritto non va ripulito dopo.

## La cosa importante, che è quella che manca ancora

**Togliere i metadati non ha reso quelle immagini nostre, e non era lo scopo.**
Le ventiquattro sono state sostituite proprio perché cancellare la firma di un
fotografo non è un modo di acquisire una fotografia: è solo un modo di perdere
l'informazione su chi l'ha fatta. Su quella di Berthold Werner sarebbe stato
peggio ancora — è CC BY-SA, dove l'attribuzione *è* la licenza, e toglierla
trasforma una dimenticanza in una violazione.

Restano quindi ventiquattro punti di interesse con un segnaposto al posto della
fotografia. Vanno rifatte, e ci sono tre modi che vanno bene:

1. **fotografie proprie** — la soluzione pulita, e non serve altro;
2. **Wikimedia Commons**, citando autore e licenza nel campo `credits` del POI;
3. **una banca immagini** con licenza commerciale, tenendo la ricevuta.

Quello che non va bene è riprendere una fotografia da una pagina web perché
«non c'era scritto niente». Su queste ventiquattro c'era scritto: era nei
metadati, e nessuno li aveva letti.

## Come si controlla

    node backend/scripts/clean-image-metadata.js

Senza `--write` dice soltanto che cosa toglierebbe. Su un archivio già pulito
non stampa niente, quindi si può rilanciare quando si vuole — e la CI lo lancia
proprio così, per far fallire la build se entra un'immagine con i metadati
addosso.
