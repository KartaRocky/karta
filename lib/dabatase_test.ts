import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openTestDB() {
  const db = await open({
    filename: ':memory:', // Use in-memory database
    driver: sqlite3.Database
  });

  // Create tables for the test (same schema as in your application)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sources (
      source TEXT PRIMARY KEY,
      repository_name VARCHAR(255) NOT NULL,
      repository_owner VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}