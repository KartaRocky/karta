import { db } from '../database'
import { Dependency, KartaDependency } from '../types'

export async function findAllDependencies() {
  return await db.selectFrom('dependencies')
    .selectAll()
}

export async function findAllDependenciesByIds(dependencyIds: number[]): Promise<Dependency[]> {
  return await db.selectFrom('dependencies').selectAll().where("id", "in", dependencyIds).execute();
}

export async function saveDependency(dependency: KartaDependency): Promise<Dependency | undefined> {

  // Insert the new source into the database
  return await db.insertInto("dependencies").values(dependency)
    .onConflict((oc) => oc.doUpdateSet(dependency))
    .returningAll()
    .executeTakeFirst()
}