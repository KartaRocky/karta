
/**
 * @jest-environment node
 */
import { db } from '@/lib/database';
import { deleteTestDatabase, migrateToLatest } from '@/scripts/migration';
import { findAll, save } from './sourceRepository';


describe('POST /api/sources', () => {

  beforeAll(async () => {
    await migrateToLatest()
  })

  afterAll(async () => {
    await deleteTestDatabase()
  })

  afterEach(async () => {
    await db.deleteFrom('source').execute()
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

  it('should find all sources successfully', async () => {
    // Test data
    const sourceData = 'https://github.com/exampleUser/repo2.git';
    // Run the POST function directly
    await save(sourceData);

    const sourceData2 = 'https://github.com/exampleUser/repo3.git';
    // Run the POST function directly
    await save(sourceData2);

    // Query the in-memory database to check if the data was inserted
    const rows = await findAll();
    expect(rows).toHaveLength(2)
    expect(rows[0].repository_owner).toBe('exampleUser');
    expect(rows[0].repository_name).toBe('repo2');
  });

});