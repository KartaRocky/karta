import { db } from "../database";
import { getRepoName, getUserName } from "../git_helper";

export async function save(source: string) {
    const repository_owner = getUserName(source);
    const repository_name = getRepoName(source);

    // Insert the new source into the database
    await db.insertInto("source").values({
      source,
      repository_name,
      repository_owner
    })
    .execute()
}