import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dependency')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('who', 'text', (col) => col.notNull())
    .addColumn('what', 'text', (col) => col.notNull())
    .addColumn('value', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addUniqueConstraint("uk_dependency", ['who', 'what', 'value'])
    .execute()

  await db.schema
    .createTable('source')
    .addColumn('source', 'text', (col) => col.primaryKey())
    .addColumn('repository_name', 'text', (col) => col.notNull())
    .addColumn('repository_owner', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
        col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
      )
    .execute()

}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('source').execute()
  await db.schema.dropTable('dependency').execute()
}