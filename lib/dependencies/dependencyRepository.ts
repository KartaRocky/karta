import { db } from '@/lib/database'
import { Dependency } from '../types'
//import { Dependency, NewDependency } from '@/app/types'

export async function findAllDependencies() {
  return await db.selectFrom('dependency')
    .selectAll()
}

export async function saveDependency(who: string, what: string, value: string): Promise<Dependency | undefined> {

  // Insert the new source into the database
  return await db.insertInto("dependency").values({
    who,
    what,
    value
  })
  .onConflict((oc) => oc.doUpdateSet({who, what, value}))
  .returningAll()
  .executeTakeFirst()
}