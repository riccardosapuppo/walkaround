# Walk Around

![The map of places, a point-of-interest card with its thirty-second preview, and the opening screen with a city's catalogue](docs/schermate.webp)

An audio guide is an mp3 file. The file exists, it sits on a disk, and it is reachable over HTTP. The tourist pays 2,49–2,99 € for a single point of interest, or 15 € for a whole city, and what they get in return is not that file but **permission** to listen to it. Take the permission away and this project is an archive of 739 mp3s open to anyone who knows a URL.

The permission was one line, and it did not work:

```js
if (percorso.startsWith('audio/')) return res.status(403).json(…);
```

The value that comparison was written against is `req.path`, which Express does **not** decode. Two lines below, on the same prefix, sits `express.static`, which **does decode**. So

    GET /public/%61udio/catania/anfiteatro-romano-en.mp3

did not begin with `audio/`, passed the check, and was served by the layer that had meanwhile read `%61` as `a`. No session, no purchase, and nothing to see in the logs: it is a request like any other, and it ends in a 200. The flaw was not in some complicated part; it sat between two layers that treat the same string in two different ways, and that is what the repository is about: not how you sell audio, which is two tables, but where you put the checks so they do not depend on how a request happens to be written.

**The 739 mp3s are not in this repository.** They are the product, they were versioned, and they were the one reason this repository could not be published: they have been removed from the entire history, and in their place sits a silent 20 KiB placeholder. How and why is further down, in ["The repository contained the product"](#the-repository-contained-the-product); the real audio guides are heard at <https://walkaround.cloud>.

It comes with six claims, and each of them can fail:

| | |
| --- | --- |
| **The paid-audio block does not depend on how the path is written.** | The text comparison that was there let `%61udio`, `aud%69o`, `audio%2Fcatania` through: **739** files, that is, the entire paid library. |
| **No route trusts the `userId` written in the request.** | **Six** routes took it from the query or the body and never looked at the session at all. Among them `DELETE /api/me/purchases`, which deletes the purchases of whoever is named. |
| **A link sent by email points to an address from a list we wrote.** | The origin of the password-reset link came from the request body, and the only check was that the scheme be `http` or `https`: **any** domain passed it, and the victim received a real email carrying a valid token. |
| **A missing secret stops startup.** | The passwords were **fallback** values in `config/env.js`: without the environment variable the program started anyway, on the credentials written in the code, and nobody noticed. The `Dockerfile` did `COPY .env.example ./.env`. |
| **No catalogue image carries somebody else's metadata.** | Out of **128** photographs, **24** carried the copyright of other photographers in EXIF, IPTC or XMP, fields you do not see when you open the file. |
| **No query contains a JavaScript comment.** | Inside a string, `// explanation` is valid JavaScript and `node --check` passes. Postgres stops on `//`, which in SQL is not a comment, and that query sat inside a `catch` inside another empty `catch`: the row was not updated, forever, in silence. |

```
cd backend && npm test        # 44 tests, no database, under a second
```

The tests hold the first, the third, the fifth and the sixth. The second and the fourth are enforced in the code, by `requireAppUser` (`routes/api.js`) and `required()` (`config/env.js`), but they do not yet have a test that turns red if someone removes them, and that is the first thing missing. Before this work the tests numbered **zero**.

---

## Before you start

**Node 22 or newer** and **Docker**.

```
node --version        # the backend declares >=22, the image is node:22-alpine
```

**The mp3s are not here, and the application starts anyway.** The paid catalogue of 739 files, about 2,4 GiB, was versioned in LFS and is now in no commit. In its place is a single file, `backend/public/audio/segnaposto.mp3`: five seconds of silence, 20 KiB, regenerated with `npm run audio:segnaposto`. All 66 seed points of interest point to it, so a fresh install shows the catalogue, sells, cuts the preview and plays, but what you hear is not a guide. The real audio guides are on the running service, <https://walkaround.cloud>.

**The configuration has no fallback values, and that is deliberate.** Without `DB_PASSWORD` the backend does not start and prints what it is missing. It used to fall back on the password written in the source, which is why a forgotten variable was never noticed.

### The stack, with Docker

The `docker-compose.yml` reads the password from a `.env` beside it, which is not versioned. The syntax is `${DB_PASSWORD:?...}` rather than `${DB_PASSWORD}`, so a missing
variable stops the command and says what it wants. With the plain form the
database would come up with an empty password and nothing would say so.

```
git clone <this repository>
cd walkaround

echo "DB_PASSWORD=$(openssl rand -base64 24)" > .env
docker compose up
```

- frontend (nginx): `http://localhost:8080`
- API: `http://localhost:3001`
- PostgreSQL 16: `localhost:5433`

The two volumes (`walkaround_pgdata` for the database, `walkaround_public` for files uploaded from the dashboard) are the data: `docker compose down -v` deletes them.

### In development, with the backend outside a container

```
cp backend/.env.example backend/.env      # and fill in at least DB_PASSWORD

cd backend
npm install
npm run dev                                # http://localhost:3000
npm test                                   # 44 tests

cd ../frontend
npm install
npm start                                  # http://localhost:4200
```

The Angular dev server runs on 4200 and forwards `/api` and `/public` to `localhost:3000` (`frontend/proxy.conf.json`). The schema and the initial catalogue are created by the backend on first start; `DB_SEED_MODE` (`always`, `if-empty`, `never`) decides whether to rewrite it, and in compose it is `if-empty`: whoever tries the project finds the four cities inside instead of an empty screen, and an already populated catalogue is left untouched.

### What you do not need to run it all

No OpenAI key, no PayPal credentials, no SMTP. Mail is optional: without a configured host, sending does not start and says so in words, instead of failing inside the routes with a network error that explains nothing. The PayPal and OpenAI keys are not in the environment at all; they are set from the dashboard and live in two tables; the translation and text-to-speech scripts are separate commands that take no part in startup. `ADMIN_EMAIL` and `ADMIN_PASSWORD` are needed only for the very first install: they create the administrator if there is none and leave it alone if there is already one.

---

## What is in here

| | |
| --- | --- |
| `backend/src/media/paths.js` | Where a path requested from outside actually ends up. The file that replaces the string comparison, and that spells out at length why that could not work. |
| `backend/src/media/strip-metadata.js` | Strips the metadata from an image without recompressing it, and knows that after the end of one JPEG there can be another. |
| `backend/src/auth/origins.js` | Which address a link that ends up inside an email is built on. A list, because the right question is "is it one of ours?" and no rule about form answers that. |
| `backend/src/config/env.js` | The configuration, and what happens when it is missing: it stops, and says which. |
| `backend/src/routes/api.js` | The public routes: catalogue, previews, full audio, PayPal checkout, purchases, property codes. |
| `backend/src/routes/admin.js` | The dashboard: catalogue, partner properties, PDFs and QR codes, settings, legal documents. |
| `backend/src/routes/app-auth.js`, `auth.js` | Two distinct worlds of sessions: the app's users and whoever administers. |
| `backend/src/db/init.js` | Schema and migrations, 26 tables, idempotent. |
| `backend/src/db/seed-data.js` | The starting catalogue: 4 Sicilian cities and 66 points of interest. |
| `backend/media-manifests/poi-audio-manifest.json` | 729 lines: for each audio file, the point of interest, the language, the model, the voice and the date. |
| `backend/scripts/` | Translation, text-to-speech, applying the manifest, stripping image metadata, generating the audio placeholder. The ones that write to the catalogue have a `--dry-run`. |
| `backend/test/` | 44 tests. None touches the database. |
| `frontend/src/app/core/interceptors/` | The session token on every call to the backend, once instead of route by route. |
| `frontend/src/app/features/` | 13 screens: welcome, home, map, detail, player, my audio, favourites, cart, profile, partner registration, dashboard. |
| `docs/immagini.md` | Where the images come from, and the twenty-four that were removed. |

The frontend is a PWA: Angular 21, Angular Material, Leaflet for the map, a service worker with runtime caching for images and audio previews, geolocation with a fallback if denied, downloads for offline listening (Cache API plus metadata in IndexedDB), an interface in six languages.

### The content is generated, and the manifest records it

The cards are written in Italian and translated with `gpt-4o-mini`. The audio of the translations is synthesised with `gpt-4o-mini-tts`. The manifest keeps **729 entries**, one per file, each with model, voice, language, point of interest and date.

It serves two concrete purposes. The first is being able to answer "where does this file come from" without opening it. The second is that the arithmetic is visible: 146 points of interest across five translated languages would be 730, and the entries are 729; English is missing one. It is not a mistake you notice by listening; you notice it by counting.

Italian is not in the manifest because it is not generated: it is the language the text was written in.

### How it is sold

A free **30-second** preview for every point of interest, in all six languages, without an account: `GET /api/pois/:id/audio-preview` cuts the full file and keeps the clip. The full audio is `GET /api/pois/:id/audio`, and it requires a session and a purchase of the single point or of its city's bundle.

The main channel is not advertising, it is **B2B2C**. Hotels, B&Bs and holiday homes display a QR code with a code: the guest scans it, arrives at the app with the discount already applied, and the property keeps a **fixed commission** on every sale, in columns `structure_fixed_amount_single` and `structure_fixed_amount_bundle`, kept separate from the percentage discount the tourist sees, because they are two different decisions and must be changeable one at a time.

The PDF with the QR code that properties receive by email is written by hand: `backend/src/services/partner-pdf.js` imports only `node:fs`, `path`, `url` and `zlib`, and inside it is even the Reed-Solomon encoder for the QR code. No library.

---

## The things that were wrong, and what replaced them

### The check was made on the shape of the path

Described at the top. Replaced by `resolveInside`, which decodes, rejects malformed percent-escapes and null bytes, resolves the path, and then looks at **where it ended up** with `path.relative`, not `startsWith`, because `/public/audio-x` begins with `/public/audio` and is not inside it.

The lesson holds beyond this case: the textual forms of a path are infinite — percent-encoding, double encoding, the backslash, dot-dot, an uppercase letter on a filesystem that does not distinguish — while the place that path ends up is only one. A security check is made on the second.

The same function, moreover, was already written twice, identical, in `routes/api.js` and `routes/admin.js`. The place where it mattered most did something else.

Seventeen tests in `backend/test/paths.test.js` are written to fail on the old code.

### And nobody was watching the door next to it

With the block closed, the full audio still got out, elsewhere. The thirty-second previews were written to `public/audio-previews`, a sibling folder of the guarded one, and the length of the cut was computed from the duration declared in `duration_sec`, which the administrator writes and the schema accepts even equal to 1. With a duration of one second the proportion was squashed to "everything", and the preview was a complete copy of the file, served without a session from the door next to the closed one.

Two fixes, and the first removes the question instead of adding a check: **the previews moved out of `public/`**. The route that serves them reads from disk with `sendFile` and never needed them to be reachable by URL, so now they are not, and there is nothing to defend because there is no door. The second is a ceiling that does not depend on the data: whatever `duration_sec` says, what comes out is at most half the file.

### Six routes asked the request itself who was sending it

The check already existed and was already right. It was called `requireCheckoutAppUser` and sat on two payment routes, and because the name said "checkout", nobody thought to put it elsewhere. These six took the `userId` from the query or the body:

```
POST   /api/paypal/checkout/quote
GET    /api/me/purchases
DELETE /api/me/purchases
POST   /api/hotel/validate
GET    /api/me/hotel-association
DELETE /api/hotel/association
```

It is a detail that looks cosmetic and is not: **a check with a name that describes a route does not get reused**, and the route that needs it tomorrow gets written without it.

The first fix, though, demanded a session **always**, and so shut out those who never had one. Two kinds of identity live here together, and that is not a flaw: those with an account, whose proof is the token in `app_sessions`; and the **guest**, for whom the browser generates a uuid on first launch, which is the only thing they have. Whoever scans a hotel's QR code lands on `/welcome` and the first thing the application does is ask whether that code is valid, long before an account exists, and for the hotel that moment is the whole business model.

The rule, now:

| | |
| --- | --- |
| session present, and it speaks of itself | passes |
| session present, and it speaks of another | 403 |
| no session, and the `userId` belongs to a registered account | 401 |
| no session, and it belongs to no one | passes: it is a guest |

That is, **you cannot wear an account without its token**, which was the whole flaw, while the guest's uuid stays self-declared as it always was: there is nothing to steal from them that is not already theirs, and changing it would mean forcing everyone to register before seeing a price.

The token, for its part, the frontend was not sending on any of those six routes, because it had never needed to. Adding it in six places and remembering it for the seventh route would be the same kind of solution that created the problem, a rule kept in mind instead of by the code, so it lives in a single `HttpInterceptor`, and it holds for the routes that do not exist yet too.

### The reset link was chosen by whoever asked for the reset

```
POST /api/app-auth/password-reset
{ "email": "victim@example.com", "origin": "https://attacker-site" }
```

The service sent the victim a real email, from the right domain, carrying a valid reset token, pointed elsewhere. One click and the account changed hands. You did not need to be authenticated.

The flaw is not "a validation was missing": the validation was there and asked whether the scheme was `http` or `https`. It is that **the question was wrong**. "Is this string a well-formed URL?" is a question about form; the one that matters is "is this address one of ours?", which is a question about identity, and one you can only answer with a hand-written list. There is no rule that tells your own domain from someone else's.

`pickOrigin` never throws and does not distinguish the cases in its return value: if it rejected an origin with an error, that error would tell whoever is probing that the email address exists. And the same route was telling them anyway, ten lines below. For an address that does not exist it answered 200; for a real one it tried to send, and if mail is not configured the send failed and a 500 came out. Now the send failing does not change the response: it goes into the server log, which is read by whoever runs the machine and not by whoever is probing addresses.

Four sibling routes in `admin.js` — invitation, approving a partner, resending activation, a reset done by the administrator — lagged behind for a while, on the old, weaker version. Now the list of origins is built in one place and all five go through it.

### The passwords were fallback values

```js
password: process.env.DB_PASSWORD || '<the real password>'
```

The fallback was the dangerous part, more so than the fact that the string sat in cleartext in the repository. A password written here ends up in git and you take it out. A password written here **as a fallback** does one more thing: if the environment variable does not arrive (a forgotten `.env`, a badly written line in the compose file, a container rebuilt without it) the program starts anyway, connects, works. The failure makes no noise, and the service stays up on the credential that sits in the repository's history.

And the `Dockerfile` did `COPY .env.example ./.env`, with the production credentials inside: the image carried them, and anyone who could `docker run` it had them.

Now the secrets have no fallback: if they are missing, the program stops and says which, all at once and not one at a time. It is inconvenient on purpose, since a failed start is a problem you can see. The non-secret values, port and host and CORS origin, keep a default, because getting them wrong exposes nothing.

### Twenty-four photographs belonged to someone else

The catalogue had 128 images and no declared provenance: no credits file, no column in the schema, no line in the README. Reading EXIF, IPTC and XMP, **twenty-four** carried the copyright of other photographers, one under a CC BY-SA licence where attribution *is* the licence, one from a commercial stock agency. Another twelve carried the signature of a CMS resizer, that is, they had been saved from web pages.

The twenty-four were **replaced** with a placeholder drawn for the project. Stripping the metadata would not have made them ours: erasing a photographer's signature is not a way of acquiring a photograph, only a way of losing the information about who made it.

The others were stripped of their metadata, because a photograph carries the GPS coordinates of where it was taken and the camera's serial number, and this catalogue is public. The stripping is lossless: it removes the header segments and does not touch the pixels. And it cannot happen again, because `POST /api/admin/catalog/upload-image` passes every file through `stripImageMetadata` **before** writing it to disk.

That stripping, though, stopped where the first image ends and copied the rest without looking at it, while phones append a **second whole image** behind it, with its own EXIF and its own GPS inside. The module written not to publish where someone lives published it anyway, while declaring it did not: a check that stops at the first useful result is not a check, it is a sample. Now the compressed data is genuinely traversed to the end, recognising the padding and the restart markers, and what follows is thrown away.

In the same pass APP14 came back among the segments that stay — it declares the colour space, that is, how the pixels are read, not who took the shot — and the orientation survives on its own, in an APP1 rebuilt with a single entry: otherwise every future portrait photo would end up in the catalogue lying on its side by ninety degrees.

**Today's counts**, counted and not remembered (`git ls-files backend/public/images`, compared by SHA-256): **112 files** tracked, of which **17 are copies of the placeholder** and 95 are real photographs; the distinct images are 94. The numbers in the paragraph above, 128 and twenty-four, describe the catalogue **as it was when the cleanup was done**, and are the measure of the problem, not of the current state: the catalogue has moved since then, and a folder of fourteen SVGs that named no one was removed.

Some points of interest are left with a placeholder in place of the photograph. They need redoing. The whole story, with the list, is in `docs/immagini.md`.

### A JavaScript comment inside a query

Done while fixing PayPal's error handling: some lines of explanation ended up inside the template literal instead of above it.

```js
await pool.query(`
  // What goes here depends on…      <- inside the SQL
  UPDATE paypal_checkout_orders …
`);
```

`node --check` passes, because it is perfectly valid JavaScript: it only says the string is a string. Postgres would have stopped on `//`, which in SQL is not a comment; `--` is. And the query sat inside a `catch` with another empty `catch` inside it, so the failure would have gone nowhere: the row simply was not updated.

There are two languages in here, and nobody was watching the second. Now a test reads the sources, finds the template literals that begin with a SQL keyword, and fails if inside there is a line that begins with `//`.

### A successful payment vanished under the word "failed"

In the PayPal capture there was a boolean: the money was taken, or it was not. But there are three cases, and the missing one, **the call that does not come back**, is the most likely. A timeout, a closed connection, a 502 from the proxy in front: PayPal has executed, and on this side you do not know. The boolean stayed false, and the order was marked `failed`.

Now the state is marked *before* the call and reads "unknown", which counts as collected: when you do not know, you err on the side someone is watching, because a row that states a falsehood closes the case forever, while one that says "look at me" costs a manual check. Along with the state, the capture identifier and the response are kept, without which whoever has to reconcile has nowhere to start.

### The repository contained the product

This limitation was not found by a test, nor by an outside review: it was **written in this README**, in the list of what is missing, and it stayed there until it was fixed. It said that the 739 paid mp3s were versioned in LFS, about 2,4 GiB, and that the paywall defends `/public/audio` over HTTP, but `git clone` does not go through the paywall and handed over the whole library. As long as the repository stayed private nothing changed; making it public meant publishing the catalogue.

A project that presents itself with a list of the things that were wrong cannot keep in the window the one that makes it unpublishable.

The mp3s were removed from the **entire history**, not from the last commit: a file deleted today stays inside every commit that contained it, and whoever clones takes it home all the same. The repository went from 2,4 GiB of LFS objects to **zero pointers**, and **all 75 commits are still there, all 75**: what changed is what the commits contain, not which commits exist. The LFS rule vanished from `.gitattributes`, where it was no longer filtering anything.

In place of the catalogue is a single file: `backend/public/audio/segnaposto.mp3`, five seconds of silence, 20 KiB, which `backend/scripts/genera-audio-segnaposto.js` rebuilds byte by byte as MPEG-1 Layer III, frames of nothing but zeros, the format's way of saying "there is nothing to play here". Generated rather than taken from somewhere, for the same reason as the twenty-four photographs: a file that comes from outside brings the question of whose it is with it.

Removing them turned `backend/test/seed-percorsi.test.js` red, because five of the seed's `audioUrl`s named files that were no longer there. That was the right behaviour: that test asks "is the file there?", and the answer was no. It was given an answer instead of having its question changed, because if it looked at the shape of the URL it would stop finding the very two flaws it was born for, which were two files in the wrong place behind URLs of perfect shape.

A rule stays in `.gitignore`, because `npm run git` does `git add .` without anyone watching: under `backend/public/audio/` only the placeholder gets through. Without that rule one pass would be enough to put 2,4 GiB back in, and the next time the history would have to be rewritten all over again.

---

## What is still missing

- **The old credentials are still in the history, and must be rotated.** It is the most urgent item on the list. The database password, the administrator password, the SMTP password of a real mailbox, the server's address and user: taken out of the files, they remain in 53 versions of `backend/.env.example` and in the old versions of the README, all already on GitHub. Taking them out of a file does not take them from whoever has cloned it.
- **No test touches the database or a route.** The 44 cover pure functions and the shape of the sources. The most important authorization check, that the session belongs to the named user, is verified by hand against the running program, not by a test that runs itself again, and should be the next step.
- **`migrateClientUserDataToAppUser` trusts the `userId` in the request body.** In `backend/src/routes/app-auth.js`, it moves purchases made as a guest onto the account being registered. That uuid is the only thing a guest has, so there is no token to ask for; the migration is effectively one-time, because the source rows are moved. It remains that whoever knew a guest's uuid could claim its purchases by registering. The right way is to bind the uuid to the session that created it, and it has not been done.
- **The PayPal and OpenAI keys are in the database in cleartext.** Taken out of the environment and the image, not yet encrypted at rest. Whoever reads that database reads them.
- **Whoever installs it does not have the audio guides.** The seed points to the silent placeholder, so the whole chain of preview, purchase and playback can be tried, but not the content. It is the price of not publishing the catalogue, and it is chosen.
- **Twenty-four points of interest have a placeholder** in place of the photograph.
- **The repository is not the production catalogue.** The versioned seed is four cities and 66 points; the audio manifest records 146, across six cities. What is in production is larger than what is here.
- **The flow is tested with PayPal in sandbox.** The `live` mode is chosen from the dashboard, and the only difference the code knows is the address it talks to.

---

## About the project

A personal project of the author's, not work for a client. It is running at <https://walkaround.cloud/>.

The README this replaces contained the server's address, the user for remote access and the database password, in cleartext. They are no longer **in any current file**: the configuration comes from the environment, and when it is missing the program stops instead of falling back on something written somewhere.

**They are still in the git history, and that has to be said.** A value taken out of a file stays in the commits that contained it: `backend/.env.example` has 53 versions with credentials inside, and the old README has more. They are commits already pushed, so the only correction worth anything **is to rotate those credentials**: rewriting the history does not take them from whoever has already cloned, and does not take them from the copies GitHub keeps reachable by SHA.

---

## License

MIT. See [LICENSE](LICENSE).

Developed by Riccardo Sapuppo.
