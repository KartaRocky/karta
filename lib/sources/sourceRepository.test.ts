/**
 * @jest-environment node
 */
import { db } from "@/lib/database";
import { findAll, saveSource } from "./sourceRepository";
import { afterEach, describe, expect, it } from "vitest";

describe("POST /api/sources", () => {
  afterEach(async () => {
    await db.deleteFrom("sources").execute();
  });

  it("should register a source successfully", async () => {
    // Test data
    const sourceData = "https://github.com/exampleUser/repo.git";

    // Run the POST function directly
    await saveSource({
      url: sourceData,
      name: "repo",
      path_with_namespace: "exempleUser/repo",
    });

    // Query the in-memory database to check if the data was inserted
    const rows = await db
      .selectFrom("sources")
      .where("url", "=", sourceData)
      .selectAll()
      .execute();
    expect(rows).toHaveLength(1);
    expect(rows[0].repository_owner).toBe("exampleUser");
    expect(rows[0].repository_name).toBe("repo");
  });

  it("should find all sources successfully", async () => {
    // Test data
    const sourceData = "https://github.com/exampleUser/repo2.git";
    // Run the POST function directly
    await saveSource({
      url: sourceData,
      name: "repo",
      path_with_namespace: "exempleUser/repo2",
    });

    const sourceData2 = "https://github.com/exampleUser/repo3.git";
    // Run the POST function directly
    await saveSource({
      url: sourceData2,
      name: "repo",
      path_with_namespace: "exempleUser/repo3",
    });

    // Query the in-memory database to check if the data was inserted
    const rows = await findAll();
    expect(rows).toHaveLength(2);
    expect(rows[0].repository_owner).toBe("exampleUser");
    expect(rows[0].repository_name).toBe("repo");
  });
});
