import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// Type for the database instance
let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function openDB() {
  if (!db) {
    let filename = './database.sqlite'
    if (process.env.NODE_ENV === 'test') {
      filename = ":memory:"
    }
    db = await open({
      filename: filename,
      driver: sqlite3.Database,
    });

    if (process.env.NODE_ENV === 'test') {
    }
  }
  return db;
}