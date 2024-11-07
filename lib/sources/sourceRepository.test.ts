
/**
 * @jest-environment node
 */
import { db } from '@/lib/database';
import { deleteTestDatabase, migrateToLatest } from '@/scripts/migration';
import { save } from './sourceRepository';


describe('POST /api/sources', () => {

  beforeAll(async () => {
    await migrateToLatest()
  })

  afterAll(async () => {
    await deleteTestDatabase()
  })

  it('should register a source successfully', async () => {
    // Test data
    const sourceData = 'https://github.com/exampleUser/repo.git';

    // Run the POST function directly
    await save(sourceData);

    // Query the in-memory database to check if the data was inserted
    const rows = await db.selectFrom('source').where("source", "=", sourceData).selectAll().execute();
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