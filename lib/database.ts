import { Database } from "@/lib/types"; // this is the Database interface we defined earlier
import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

let dialect = null;
if (process.env.NODE_ENV == "test") {
  dialect = new SqliteDialect({
    database: new SQLite("database-test.sqlite"),
  });
} else {
  dialect = new SqliteDialect({
    database: new SQLite(process.env.DATABASE_LOCATION ?? "database.sqlite"),
  });
}

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});
