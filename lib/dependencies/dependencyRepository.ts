import { db } from '@/lib/database'
//import { Dependency, NewDependency } from '@/app/types'

export async function findAllDependencies() {
  return await db.selectFrom('dependency')
    .selectAll()
    .executeTakeFirst()
}