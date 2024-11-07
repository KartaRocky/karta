import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// Type for the database instance
let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function openDB() {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database,
    });
  }
  return db;
}