
/**
 * @jest-environment node
 */

import { GET } from '@/app/api/dependencies/route'; // Import your route handler

import { findAllSourceDependencies } from '@/lib/sources/sourceRepository';
import { describe, expect, it, vi } from 'vitest';

// Mock the dependencyRepository
vi.mock('@/lib/sources/sourceRepository');
describe('GET /api/dependencies', () => {

  it('should register a source successfully', async () => {
    // Test data
    const mockSave = vi.mocked(findAllSourceDependencies);
    mockSave.mockResolvedValueOnce([{ "source": { "url": "https://git.svt.se/data/playground/karta-test-thiago", "repository_name": "karta-test-thiago", "repository_owner": "data", "path_with_namespace": "data/playground/karta-test-thiago", "created_at": "2024-11-08 13:23:11" }, "dependencies": [{ "id": 1, "who": "DataOps", "what": "table", "value": "table", "created_at": "2024-11-08 13:23:11" }] }]);

    // Run the POST function directly
    const res = await GET();
    expect(res.status).toBe(200)
    const data = await res.json();
    expect(data).toHaveLength(1);

  });
});