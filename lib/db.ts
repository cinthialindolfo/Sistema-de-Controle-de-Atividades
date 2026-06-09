import { createClient } from '@libsql/client';
import path from 'path';

// --- CONFIGURAÇÃO HÍBRIDA OTIMIZADA ---

const isCloud = process.env.TURSO_DATABASE_URL !== undefined;

let db: any;

if (isCloud) {
  // Em produção (Vercel), usamos APENAS o cliente do Turso (libsql)
  // Isso evita avisos de dependências nativas como o better-sqlite3
  db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  console.log('--- DB INIT --- Modo: TURSO (Nuvem)');
} else {
  // Localmente, usamos o better-sqlite3 para rapidez
  // Usamos require dinâmico para que a Vercel não tente analisar este pacote no build de nuvem
  const Database = require('better-sqlite3');
  const dbPath = path.resolve(process.cwd(), 'dev.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  console.log('--- DB INIT --- Modo: LOCAL (better-sqlite3)');
}

// Inicialização automática de tabelas para banco local
if (!isCloud) {
  db.exec(`
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
    );
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      pin TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(firstName, lastName)
    );
  `);
}

export default db;
export { isCloud };
