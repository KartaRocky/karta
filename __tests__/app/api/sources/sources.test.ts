
import { NextApiRequest, NextApiResponse } from 'next';

import { createMocks } from 'node-mocks-http'
import { getRepoName, getUserName } from '@/lib/git_helper';
import { POST } from '@/app/api/sources/route'; // Import your route handler
import { openTestDB } from '@/lib/dabatase_test';

import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { NextRequest } from 'next/server';

describe('POST /api/sources', () => {
  let db: Database<sqlite3.Database, sqlite3.Statement>;

  beforeAll(async () => {
    // Set up an in-memory database
    db = await openTestDB();
  });

  afterAll(async () => {
    // Clean up the in-memory database
    await db.close();
  });

  it('should register a source successfully', async () => {
    // Test data
    const sourceData = {
      source: 'https://github.com/exampleUser/repo.git',
    };

    // Create mock request
    const req = createMocks({
        method: "POST",
        body: sourceData
    });

    console.log(req);
    // Run the POST function directly

    //@ts-ignore
    await POST(req);

    // Query the in-memory database to check if the data was inserted
    const rows = await db.all('SELECT * FROM sources WHERE source = ?', sourceData.source);
    expect(rows).toHaveLength(1);
    expect(rows[0].repository_owner).toBe('exampleUser');
    expect(rows[0].repository_name).toBe('repo');
  });

//   it('should return error for invalid source URL', async () => {
//     const sourceData = {
//       source: 'invalid-url',
//     };

//     const req = createMockRequest(sourceData);

//     // Run the POST function directly
//     const res = await POST(req);

//     // Check the response to ensure the error message is correct
//     expect(res.status).toBe(400);
//     expect(res.text).toMatch(/Error inserting data/);
//   });
});