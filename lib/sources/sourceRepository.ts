import { db } from "../database";
import { getRepoName, getUserName } from "../git_helper";

export async function saveSource(url: string) {
    const repository_owner = getUserName(url);
    const repository_name = getRepoName(url);

    // Insert the new source into the database
    await db.insertInto("source").values({
      url,
      repository_name,
      repository_owner
    })
    .onConflict((oc) => oc.doNothing())
    .execute()
}

export async function findAll() {
  return await db.selectFrom("source").selectAll().execute();
}