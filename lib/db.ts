import Database from 'better-sqlite3';
import path from 'path';

// Garante que o caminho seja absoluto e consistente
const dbPath = path.resolve(process.cwd(), 'dev.db');
const db = new Database(dbPath);

// Configuração para performance e concorrência
db.pragma('journal_mode = WAL');

// Inicialização das tabelas com tratamento para campos de data no SQLite
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
  )
`);

db.exec(`
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

export default db;
