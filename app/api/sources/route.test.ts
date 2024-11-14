/**
 * @jest-environment node
 */

import { POST } from "@/app/api/sources/route"; // Import your route handler

import { NextRequest } from "next/server";
import { saveSource } from "@/lib/sources/sourceRepository";
import { vi, describe, it, expect, afterEach } from "vitest";

// Mock the dependencyRepository
vi.mock("@/lib/sources/sourceRepository");
describe("POST /api/sources", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should register a source successfully", async () => {
    // Test data
    vi.mocked(saveSource).mockResolvedValue();
    const sourceData = "https://github.com/exampleUser/repo.git";
    //    mockSave.mockResolvedValueOnce(sourceData);

    const request = new NextRequest(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          url: sourceData,
          name: "repo",
          path_with_namespace: "exampleUser/repo",
        }),
      })
    );

    // Run the POST function directly
    const res = await POST(request);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.message).toBe("Source registered successfully");
  });
});
