import * as path from 'path'
import { promises as fs } from 'fs'
import {
    Kysely,
    Migrator,
    FileMigrationProvider,
    SqliteDialect,
} from 'kysely'
import SQLite from 'better-sqlite3'
import { Database } from '@/lib/types'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export async function migrateToLatest() {

    let dialect = null;
    if (process.env.NODE_ENV == 'test') {
        console.log('running migrations for test')
        dialect = new SqliteDialect({
            database: new SQLite('database-test.sqlite'),
        })
    } else {
        dialect = new SqliteDialect({
            database: new SQLite('database.sqlite'),
        })
    }
    const db = new Kysely<Database>({
        dialect: dialect,
    })

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            // This needs to be an absolute path.
            migrationFolder: path.join(__dirname, '../migrations'),
        }),
    })

    const { error, results } = await migrator.migrateToLatest()

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        console.error('failed to migrate')
        console.error(error)
        process.exit(1)
    }

    if (process.env.NODE_ENV != 'test'){
        await db.destroy()
    }
}

export async function deleteTestDatabase() {
    const testDbPath = path.join(__dirname, '../database-test.sqlite');
    try {
        await fs.unlink(testDbPath);
        console.log('Test database deleted successfully.');
    } catch (error) {
        console.error('Error deleting test database:', error);
    }
}

migrateToLatest()