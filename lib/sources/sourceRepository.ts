import { db } from "../database";
import { findAllDependenciesByIds } from "../dependencies/dependencyRepository";
import { getUserName } from "../git_helper";
import { Dependency, Source, SourceDependencies } from "../types";

export interface SaveNewSource {
  url: string;
  name: string;
  path_with_namespace: string;
}

export async function saveSource(newSource: SaveNewSource) {
  const repository_owner = getUserName(newSource.url);
  const newSourceToSave = {
    url: newSource.url,
    repository_name: newSource.name,
    repository_owner: repository_owner,
    path_with_namespace: newSource.path_with_namespace,
  };
  // Insert the new source into the database
  await db
    .insertInto("sources")
    .values(newSourceToSave)
    .onConflict((oc) => oc.doNothing())
    .execute();
}

export async function findAll() {
  return await db.selectFrom("sources").selectAll().execute();
}

export async function saveAllSourceDependencies(
  source: string,
  dependencyIds: number[]
) {
  await db
    .deleteFrom("sources_dependencies")
    .where("source_id", "==", source)
    .execute();
  dependencyIds.forEach(async (dependencyId) => {
    await db
      .insertInto("sources_dependencies")
      .values({ source_id: source, dependency_id: dependencyId })
      .onConflict((oc) => oc.doNothing())
      .execute();
  });
}

export async function findAllDependenciesBySource(
  url: string
): Promise<SourceDependencies> {
  const source = await db
    .selectFrom("sources")
    .selectAll()
    .where("url", "==", url)
    .executeTakeFirst();
  const sourceDependencies = await db
    .selectFrom("sources_dependencies")
    .selectAll()
    .where("source_id", "==", source?.url ?? "not-found")
    .execute();
  const dependencies = await findAllDependenciesByIds(
    sourceDependencies.map((dep) => dep.dependency_id)
  );

  const result = {
    source: source ?? {
      url: "",
      repository_name: "",
      repository_owner: "",
      path_with_namespace: "",
      created_at: new Date(),
    },
    dependencies: dependencies ?? [],
  };
  return result;
}

export async function findAllSourceDependencies(): Promise<
  SourceDependencies[]
> {
  const all = await db
    .selectFrom("sources_dependencies")
    .innerJoin("dependencies", "id", "dependency_id")
    .innerJoin("sources", "url", "source_id")
    .select([
      "sources.url as source_url",
      "sources.repository_name",
      "sources.repository_owner",
      "sources.path_with_namespace",
      "sources.created_at as source_created_at",
      "dependencies.id as dependency_id",
      "dependencies.who",
      "dependencies.what",
      "dependencies.value",
      "dependencies.created_at as dependency_created_at",
    ])
    .execute();

  const sourceMap = new Map<
    string,
    { source: Source; dependencies: Dependency[] }
  >();

  all.forEach((row) => {
    const sourceUrl = row.source_url;
    if (!sourceMap.has(sourceUrl)) {
      sourceMap.set(sourceUrl, {
        source: {
          url: row.source_url,
          repository_name: row.repository_name,
          repository_owner: row.repository_owner,
          path_with_namespace: row.path_with_namespace,
          created_at: row.source_created_at,
        },
        dependencies: [],
      });
    }
    sourceMap.get(sourceUrl)?.dependencies.push({
      id: row.dependency_id,
      who: row.who,
      what: row.what,
      value: row.value,
      created_at: row.dependency_created_at,
    });
  });

  return Array.from(sourceMap.values());
}

export async function findAllSourceDependenciesBySource(
  source: string
): Promise<SourceDependencies> {
  const all = await db
    .selectFrom("sources_dependencies")
    .innerJoin("dependencies", "id", "dependency_id")
    .innerJoin("sources", "url", "source_id")
    .select([
      "sources.url as source_url",
      "sources.repository_name",
      "sources.repository_owner",
      "sources.path_with_namespace",
      "sources.created_at as source_created_at",
      "dependencies.id as dependency_id",
      "dependencies.who",
      "dependencies.what",
      "dependencies.value",
      "dependencies.created_at as dependency_created_at",
    ])
    .where("sources.url", "==", source)
    .execute();

  const sourceMap = new Map<
    string,
    { source: Source; dependencies: Dependency[] }
  >();

  all.forEach((row) => {
    const sourceUrl = row.source_url;
    if (!sourceMap.has(sourceUrl)) {
      sourceMap.set(sourceUrl, {
        source: {
          url: row.source_url,
          repository_name: row.repository_name,
          repository_owner: row.repository_owner,
          path_with_namespace: row.path_with_namespace,
          created_at: row.source_created_at,
        },
        dependencies: [],
      });
    }
    sourceMap.get(sourceUrl)?.dependencies.push({
      id: row.dependency_id,
      who: row.who,
      what: row.what,
      value: row.value,
      created_at: row.dependency_created_at,
    });
  });

  return Array.from(sourceMap.values())[0];
}
