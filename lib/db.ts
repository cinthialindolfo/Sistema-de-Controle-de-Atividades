import { createClient } from '@libsql/client';
import path from 'path';

// --- CONFIGURAÇÃO HÍBRIDA FINAL ---

const isCloud = process.env.TURSO_DATABASE_URL !== undefined;

export async function getDb() {
  if (isCloud) {
    // Modo Nuvem: Turso
    console.log('--- DB INIT --- Modo: TURSO (Nuvem)');
    return createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  } else {
    // Modo Local: Better-SQLite3
    try {
      // Importação dinâmica para evitar que o Vercel tente carregar a biblioteca nativa
      const Database = (await import('better-sqlite3')).default;
      const dbPath = path.join(process.cwd(), 'dev.db');
      console.log('--- DB INIT --- Path:', dbPath);
      const db = new Database(dbPath);
      db.pragma('journal_mode = WAL');

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
      console.log('--- DB INIT --- Modo: LOCAL (SQLite)');
      return db;
    } catch (e: any) {
      console.error('Erro ao carregar banco local:', e.message);
      throw e;
    }
  }
}

export { isCloud };
