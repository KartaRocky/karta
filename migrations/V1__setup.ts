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
    .addColumn('url', 'text', (col) => col.primaryKey())
    .addColumn('repository_name', 'text', (col) => col.notNull())
    .addColumn('repository_owner', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute()

  await db.schema
    .createTable('dependency_source')
    .addColumn('url', 'text', col => col.notNull())
    .addColumn('dependency_id', 'integer', col => col.notNull())
    .addPrimaryKeyConstraint('pk_dependency_source', ['url', 'dependency_id'])
    .addForeignKeyConstraint('fk_dependency_source_source', ['url'], 'source', ['url'], (oc) => oc.onDelete('cascade'))
    .addForeignKeyConstraint('fk_dependency_source_dependency', ['dependency_id'], 'dependency', ['id'], (oc) => oc.onDelete('cascade'))
    .execute()

}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('source').execute()
  await db.schema.dropTable('dependency').execute()
}