import { createClient } from '@libsql/client';
import path from 'path';

// --- CONFIGURAÇÃO HÍBRIDA FINAL ---

// No Vercel, process.env.VERCEL é '1'
const isVercel = process.env.VERCEL === '1' || process.env.NEXT_RUNTIME === 'nodejs';
const hasTurso = process.env.TURSO_DATABASE_URL !== undefined && process.env.TURSO_DATABASE_URL !== "";

// Priorizamos Turso na Nuvem, mas permitimos SQLite em /tmp se Turso não estiver configurado
const isCloud = hasTurso;

export async function getDb() {
  if (isCloud) {
    // Modo Nuvem: Turso (LibSQL)
    console.log('--- DB INIT --- Modo: TURSO (Nuvem)');
    try {
      const url = process.env.TURSO_DATABASE_URL!;
      // Garantir que a URL comece com libsql:// ou https://
      const formattedUrl = url.includes('://') ? url : `libsql://${url}`;
      
      return createClient({
        url: formattedUrl,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
    } catch (e: any) {
      console.error('Erro ao configurar cliente Turso:', e.message);
      throw e;
    }
  } else {
    // Modo Local ou Vercel Temporário: Better-SQLite3
    try {
      // Importação dinâmica protegida
      const betterSqlite3 = await import('better-sqlite3');
      const Database = betterSqlite3.default || betterSqlite3;
      
      // No Vercel, usamos /tmp para escrita. Localmente usamos a raiz.
      const dbDir = isVercel ? '/tmp' : process.cwd();
      const dbPath = path.join(dbDir, 'dev.db');
      
      console.log(`--- DB INIT --- Modo: SQLITE | Ambiente: ${isVercel ? 'VERCEL' : 'LOCAL'} | Path: ${dbPath}`);
      
      const db = new Database(dbPath);
      db.pragma('journal_mode = WAL');

      // Inicialização síncrona de tabelas para SQLite
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
      
      return db;
    } catch (e: any) {
      console.error('Erro ao carregar banco SQLite:', e.message);
      throw e;
    }
  }
}

export { isCloud, isVercel };
