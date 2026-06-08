import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import path from 'path';

// --- CONFIGURAÇÃO HÍBRIDA (LOCAL VS NUVEM) ---

const isCloud = process.env.TURSO_DATABASE_URL !== undefined;

let db: any;

if (isCloud) {
  // Configuração para Turso (Vercel / Netlify)
  db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  console.log('--- DB INIT --- Modo: TURSO (Nuvem)');
} else {
  // Configuração para SQLite Local (Better-SQLite3)
  const dbPath = path.resolve(process.cwd(), 'dev.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  console.log('--- DB INIT --- Modo: LOCAL (better-sqlite3) - Path:', dbPath);
}

// Inicialização das tabelas (Apenas local, no Turso use o terminal se necessário)
if (!isCloud) {
  (db as any).exec(`
    CREATE TABLE IF NOT EXISTS Activity (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL,
      category TEXT NOT NULL,
      teamResponsible TEXT NOT NULL,
      personResponsible TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDENTE',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  (db as any).exec(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      pin TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(firstName, lastName)
    )
  `);
}

export default db;
export { isCloud };
