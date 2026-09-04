import cors from 'cors';
import express from 'express';
import fs from 'fs/promises';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { initDatabase } from './db/init.js';
import { pool } from './db/pool.js';
import { adminRouter } from './routes/admin.js';
import { appAuthRouter } from './routes/app-auth.js';
import { apiRouter } from './routes/api.js';
import { authRouter } from './routes/auth.js';
import { isInsideDirectory, resolveInside } from './media/paths.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, '../public');
const publicAudioDir = path.resolve(publicPath, 'audio');
const publicImagesPath = path.join(publicPath, 'images');

async function pathExists(absolutePath) {
  try {
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

function stripUploadedPrefix(fileName) {
  return String(fileName || '').replace(/^\d{10,}-[a-f0-9]{6,}-/i, '');
}

function tokenizeMediaName(fileName) {
  return String(path.basename(fileName || '', path.extname(fileName || '')))
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

function mediaMatchScore(targetFileName, candidateFileName) {
  const targetTokens = tokenizeMediaName(targetFileName);
  const candidateTokens = tokenizeMediaName(candidateFileName);
  if (!targetTokens.length || !candidateTokens.length) {
    return 0;
  }

  const candidateTokenSet = new Set(candidateTokens);
  let score = 0;
  targetTokens.forEach((token) => {
    if (candidateTokenSet.has(token)) {
      score += token.length >= 6 ? 3 : 2;
    }
  });

  const normalizedTarget = stripUploadedPrefix(String(targetFileName || '').toLowerCase());
  const normalizedCandidate = String(candidateFileName || '').toLowerCase();
  if (normalizedCandidate.includes(normalizedTarget) || normalizedTarget.includes(normalizedCandidate)) {
    score += 3;
  }

  return score;
}

async function resolveMediaAliasFromDirectory(directoryPath, requestedFileName) {
  if (!(await pathExists(directoryPath))) {
    return null;
  }

  const strippedFileName = stripUploadedPrefix(requestedFileName);
  const requestedExt = String(path.extname(strippedFileName || '')).toLowerCase();

  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  if (!files.length) {
    return null;
  }

  const exactCaseInsensitive = files.find((fileName) => fileName.toLowerCase() === strippedFileName.toLowerCase());
  if (exactCaseInsensitive) {
    return path.join(directoryPath, exactCaseInsensitive);
  }

  let bestMatch = null;
  let bestScore = 0;
  files.forEach((fileName) => {
    const candidateExt = String(path.extname(fileName || '')).toLowerCase();
    if (requestedExt && candidateExt && candidateExt !== requestedExt) {
      return;
    }

    const score = mediaMatchScore(strippedFileName, fileName);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = fileName;
    }
  });

  return bestMatch && bestScore >= 3 ? path.join(directoryPath, bestMatch) : null;
}

async function resolvePublicAlias(relativeRequestPath) {
  const normalizedRelativePath = String(relativeRequestPath || '').replace(/^\/+/, '');
  if (!normalizedRelativePath) {
    return null;
  }

  const requestedAbsolutePath = path.resolve(publicPath, normalizedRelativePath);
  if (!requestedAbsolutePath.startsWith(publicPath)) {
    return null;
  }
  if (await pathExists(requestedAbsolutePath)) {
    return requestedAbsolutePath;
  }

  if (!requestedAbsolutePath.startsWith(publicImagesPath)) {
    return null;
  }

  const parsedRequestPath = path.parse(requestedAbsolutePath);
  const normalizedBaseName = stripUploadedPrefix(parsedRequestPath.base);
  if (normalizedBaseName === parsedRequestPath.base) {
    return null;
  }

  const directAlias = await resolveMediaAliasFromDirectory(parsedRequestPath.dir, normalizedBaseName);
  if (directAlias) {
    return directAlias;
  }

  if (requestedAbsolutePath.startsWith(publicImagesPath)) {
    const oldImagesAlias = await resolveMediaAliasFromDirectory(path.join(publicImagesPath, 'old'), normalizedBaseName);
    if (oldImagesAlias) {
      return oldImagesAlias;
    }
  }

  return null;
}

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: false
  })
);
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '30mb' }));

app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use('/public', async (req, res, next) => {
  try {
    const relativeRequestPath = String(req.path || '').replace(/^\/+/, '');
    if (!relativeRequestPath) {
      return next();
    }

    // Dove finisce il percorso, non come e' scritto.
    //
    // Qui c'era startsWith('audio/') su req.path, che Express NON
    // decodifica, mentre express.static piu' sotto decodifica: quindi
    // /public/%61udio/... passava di qui e veniva servito di la'.
    // Vedi il commento in media/paths.js.
    const resolvedPublic = resolveInside(publicPath, req.path);
    if (resolvedPublic === null) {
      return res.status(400).json({ message: 'Percorso non valido.' });
    }

    if (isInsideDirectory(publicAudioDir, resolvedPublic) || resolvedPublic === publicAudioDir) {
      return res.status(403).json({ message: 'Audio completo disponibile solo tramite contenuti acquistati.' });
    }

    const aliasPath = await resolvePublicAlias(relativeRequestPath);
    if (!aliasPath) {
      return next();
    }

    const normalizedRequestedPath = path.resolve(publicPath, relativeRequestPath);
    if (aliasPath === normalizedRequestedPath) {
      return next();
    }

    return res.sendFile(aliasPath);
  } catch (error) {
    return next(error);
  }
});
app.use('/public', express.static(publicPath));
app.use('/api/auth', authRouter);
app.use('/api/app-auth', appAuthRouter);
app.use('/api/admin', adminRouter);
app.use('/api', apiRouter);

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error instanceof Error ? error.message : 'db error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message: 'Internal server error',
    error: error instanceof Error ? error.message : 'unknown error'
  });
});

async function bootstrap() {
  try {
    await initDatabase();
    app.listen(env.port, () => {
      console.log(`Backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Cannot start backend', error);
    process.exit(1);
  }
}

bootstrap();
