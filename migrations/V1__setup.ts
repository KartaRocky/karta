import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("dependencies")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("who", "text", (col) => col.notNull())
    .addColumn("what", "text", (col) => col.notNull())
    .addColumn("value", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addUniqueConstraint("uk_dependency", ["who", "what", "value"])
    .execute();

  await db.schema
    .createTable("sources")
    .addColumn("url", "text", (col) => col.primaryKey())
    .addColumn("repository_name", "text", (col) => col.notNull())
    .addColumn("repository_owner", "text", (col) => col.notNull())
    .addColumn("path_with_namespace", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  await db.schema
    .createTable("sources_dependencies")
    .addColumn("source_id", "text", (col) => col.notNull())
    .addColumn("dependency_id", "integer", (col) => col.notNull())
    .addPrimaryKeyConstraint("pk_sources_dependencies", [
      "source_id",
      "dependency_id",
    ])
    .addForeignKeyConstraint(
      "fk_sources_dependencies_source",
      ["source_id"],
      "sources",
      ["url"],
      (oc) => oc.onDelete("cascade")
    )
    .addForeignKeyConstraint(
      "fk_sources_dependencies_dependency",
      ["dependency_id"],
      "dependencies",
      ["id"],
      (oc) => oc.onDelete("cascade")
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("sources").execute();
  await db.schema.dropTable("dependencies").execute();
}
