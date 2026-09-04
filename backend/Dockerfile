FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY public ./public
COPY public/assets/logo.png ./static-assets/logo.png
RUN test -f public/assets/logo.png && test -f static-assets/logo.png
COPY scripts ./scripts

# NIENTE .env NELL'IMMAGINE.
#
# Qui c'era `COPY .env.example ./.env`, e faceva esattamente quello che dice:
# il container partiva con i valori del file di esempio. Siccome quel file
# conteneva le credenziali vere, l'immagine se le portava dentro — e chiunque
# potesse fare `docker run` sull'immagine le aveva.
#
# La configurazione arriva dall'ambiente (compose, o -e), e se manca il
# programma si ferma invece di ripiegare su un valore scritto da qualche parte.

EXPOSE 3000

CMD ["node", "src/server.js"]
