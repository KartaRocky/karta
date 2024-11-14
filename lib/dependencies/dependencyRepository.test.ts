/**
 * @jest-environment node
 */
import { db } from "@/lib/database";
import { saveDependency } from "./dependencyRepository";
import { afterEach, describe, expect, it } from "vitest";

describe("POST /api/sources", () => {
  afterEach(async () => {
    await db.deleteFrom("dependencies").execute();
  });

  it("should register a dependency successfully", async () => {
    // Test data
    const who = "Dataops";
    const what = "table";
    const value = "src_realtime_events";

    // Run the POST function directly
    await saveDependency({ who, what, value });

    // Query the in-memory database to check if the data was inserted
    const rows = await db
      .selectFrom("dependencies")
      .where("who", "=", who)
      .selectAll()
      .execute();
    expect(rows).toHaveLength(1);
    expect(rows[0].who).toBe(who);
    expect(rows[0].what).toBe(what);
    expect(rows[0].value).toBe(value);
  });

  it("should register a dependency successfully not duplicate and return id", async () => {
    // Test data
    const who = "Dataops";
    const what = "table";
    const value = "src_realtime_events";

    // Run the POST function directly
    await saveDependency({ who, what, value });
    const dep = await saveDependency({ who, what, value });

    expect(dep?.who).toBe(who);
    expect(dep?.what).toBe(what);
    expect(dep?.value).toBe(value);
  });
});
