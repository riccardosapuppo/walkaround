const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

function log(message) {
  console.log(`\n[deploy] ${message}`);
}

function fail(message) {
  console.error(`\n[deploy] ERRORE: ${message}`);
  process.exit(1);
}

function loadDeployEnv() {
  const envPath = path.join(rootDir, '.env.deploy');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env: process.env,
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8'
  });

  if (result.error) {
    fail(`${command} non eseguibile: ${result.error.message}`);
  }
  if (result.status !== 0) {
    if (options.capture && result.stderr) {
      process.stderr.write(result.stderr);
    }
    fail(`${command} ${args.join(' ')} terminato con codice ${result.status}`);
  }

  return options.capture ? String(result.stdout || '').trim() : '';
}

function commandSucceeds(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env: process.env,
    stdio: 'ignore'
  });
  return !result.error && result.status === 0;
}

function createAskPassFile() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'walkaround-deploy-'));
  const isWindows = process.platform === 'win32';
  const askPassPath = path.join(tempDir, isWindows ? 'git-askpass.cmd' : 'git-askpass.sh');
  const content = isWindows
    ? [
        '@echo off',
        'echo %~1 | findstr /I "Username" >nul && (echo %DEPLOY_GIT_USERNAME%& exit /b 0)',
        'echo %~1 | findstr /I "Password" >nul && (echo %DEPLOY_GIT_TOKEN%& exit /b 0)',
        'echo.',
        ''
      ].join('\r\n')
    : [
        '#!/usr/bin/env sh',
        'case "$1" in',
        '  *Username*) printf "%s\\n" "$DEPLOY_GIT_USERNAME" ;;',
        '  *Password*) printf "%s\\n" "$DEPLOY_GIT_TOKEN" ;;',
        '  *) printf "\\n" ;;',
        'esac',
        ''
      ].join('\n');

  fs.writeFileSync(askPassPath, content, { mode: 0o700 });
  return {
    askPassPath,
    cleanup: () => fs.rmSync(tempDir, { recursive: true, force: true })
  };
}

loadDeployEnv();

process.env.DEPLOY_GIT_USERNAME = process.env.DEPLOY_GIT_USERNAME || 'riccardosapuppo';

if (process.env.DEPLOY_SKIP_PULL !== '1') {
  if (!process.env.DEPLOY_GIT_TOKEN) {
    fail('DEPLOY_GIT_TOKEN non impostato. Crea .env.deploy sul server o esporta la variabile.');
  }

  const status = run('git', ['status', '--porcelain'], { capture: true });
  if (process.env.DEPLOY_ALLOW_DIRTY !== '1' && status) {
    fail('working tree non pulito. Commit/stash delle modifiche o rilancia con DEPLOY_ALLOW_DIRTY=1.');
  }

  const branch = process.env.DEPLOY_BRANCH || run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { capture: true });
  const askPass = createAskPassFile();
  process.env.GIT_ASKPASS = askPass.askPassPath;
  process.env.GIT_TERMINAL_PROMPT = '0';

  try {
    log(`Aggiorno il repository da origin/${branch}`);
    run('git', ['fetch', 'origin', branch]);
    run('git', ['pull', '--ff-only', 'origin', branch]);
  } finally {
    askPass.cleanup();
  }
}

if (process.env.DEPLOY_SKIP_DOCKER === '1') {
  log('Docker compose saltato per DEPLOY_SKIP_DOCKER=1');
  process.exit(0);
}

let composeCommand = null;
let composeArgs = null;
if (commandSucceeds('docker', ['compose', 'version'])) {
  composeCommand = 'docker';
  composeArgs = ['compose'];
} else if (commandSucceeds('docker-compose', ['version'])) {
  composeCommand = 'docker-compose';
  composeArgs = [];
} else {
  fail('Docker Compose non trovato.');
}

log('Build e riavvio container app');
run(composeCommand, [...composeArgs, 'up', '-d', '--build', '--force-recreate', 'backend', 'frontend']);

log('Stato container');
run(composeCommand, [...composeArgs, 'ps']);
