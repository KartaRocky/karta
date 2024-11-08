import { db } from "../database";
import { findAllDependenciesByIds } from "../dependencies/dependencyRepository";
import { getRepoName, getUserName } from "../git_helper";
import { SourceDependencies } from "../types";

export async function saveSource(url: string, repository_name: string, path_with_namespace: string) {
  const repository_owner = getUserName(url);

  // Insert the new source into the database
  await db.insertInto("sources").values({
    url,
    repository_name,
    repository_owner,
    path_with_namespace
  })
    .onConflict((oc) => oc.doNothing())
    .execute()
}

export async function findAll() {
  return await db.selectFrom("sources").selectAll().execute();
}


export async function saveAllSourceDependencies(source: string, dependencyIds: number[]) {
  await db.deleteFrom("sources_dependencies").where("source_id", "==", "source").execute();
  dependencyIds.forEach(async (dependencyId) => {
    await db.insertInto("sources_dependencies").values({ source_id: source, dependency_id: dependencyId }).execute()
  })
}

export async function findAllDependenciesBySource(url: string): Promise<SourceDependencies> {
  const source = await db.selectFrom("sources").selectAll().where("url", "==", url).executeTakeFirst();
  const sourceDependencies = await db.selectFrom("sources_dependencies").selectAll().where("source_id", "==", source?.url ?? 'not-found').execute();
  const dependencies = await findAllDependenciesByIds(sourceDependencies.map(dep => dep.dependency_id))

  const result = {
    source: source ?? {
      url: '',
      repository_name: '',
      repository_owner: '',
      path_with_namespace: '',
      created_at: new Date()
    },
    dependencies: dependencies ?? []
  }
  return result

  
}