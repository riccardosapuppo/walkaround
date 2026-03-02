import { initDatabase } from '../src/db/init.js';
import { pool } from '../src/db/pool.js';

async function run() {
  try {
    await initDatabase();
    console.log('Database initialized and seeded.');
  } catch (error) {
    console.error('Failed to initialize database', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
