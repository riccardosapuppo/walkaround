# Tourism Audio Guide App (PWA)

Webapp PWA completa per audio guide turistiche in stile Material Android:
- Frontend Angular + Angular Material + Leaflet + Service Worker
- Backend Node.js/Express + PostgreSQL
- Flusso mobile-first: splash, welcome, home conversion-first, mappa interattiva, player, acquisti simulati, offline

## Struttura

- `frontend/`: Angular app PWA
- `backend/`: REST API Express + seed DB + static assets (`/public/images`, `/public/audio`)
- `docker-compose.yml`: stack `postgres + backend + frontend`

## Funzioni implementate

- 9 schermate richieste: Splash, Welcome, Home, Mappa, Dettaglio POI, Player, I miei audio, Preferiti, Profilo
- Bottom navigation fissa a 5 tab
- Geolocalizzazione + fallback se denied
- Geofencing soft (snackbar "Sei davanti a... Avvia?")
- Preview audio 30s
- Acquisti simulati singoli e bundle città
- Validazione codice hotel con sblocco bundle Catania
- Offline download di audio/immagini (Cache API + metadata IndexedDB)
- Salvataggio progress player e resume
- Multi-città mock: Catania, Siracusa, Taormina
- PWA con `ngsw-config` e runtime cache per `/public/audio/**` e `/public/images/**`

## Backend API

- `GET /api/cities`
- `GET /api/cities/:cityId/pois`
- `GET /api/pois/:poiId`
- `POST /api/purchase`
- `GET /api/me/purchases?userId=...`
- `POST /api/hotel/validate`
- static: `GET /public/images/*`, `GET /public/audio/*`

## Config Postgres con tunnel SSH (locale)

Avvia il tunnel in un terminale separato:
```powershell
ssh -N -L 25432:127.0.0.1:5433 utente@203.0.113.10
```

Poi il backend locale usa:
- host: `127.0.0.1`
- port: `25432`
- database: `turismo_db_dev`
- user: `tourism`
- password: ``

Nota: la porta `5433` è remota (sul server), mentre l'app locale deve usare `25432`.

## Avvio in sviluppo

Prerequisiti:
- Node.js 22+
- tunnel SSH attivo (comando sopra)

1. Backend
```powershell
cd backend
npm.cmd install
npm.cmd run dev
```

2. Frontend
```powershell
cd frontend
npm.cmd install
npm.cmd run start
```

App disponibile su:
- frontend: `http://localhost:4200`
- backend: `http://localhost:3001`

## Avvio in produzione con Docker

```powershell
docker compose up --build
```

Servizi:
- frontend (nginx): `http://localhost:8080`
- backend API: `http://localhost:3001`
- postgres: `localhost:25432`

Se usi Docker backend + tunnel SSH invece del postgres locale in compose, imposta nel servizio backend:
- `DB_HOST=127.0.0.1
- `DB_PORT=25432`

## Note tecniche

- Il backend crea schema e seed automaticamente al bootstrap (`initDatabase`).
- Le immagini sono placeholder SVG locali.
- Gli audio demo sono file MP3 brevi nella cartella `backend/public/audio`.
