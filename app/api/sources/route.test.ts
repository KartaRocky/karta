
/**
 * @jest-environment node
 */

import { POST } from '@/app/api/sources/route'; // Import your route handler

import { NextRequest } from 'next/server';
import { save } from '@/lib/repositories/sourceRepository';

// Mock the dependencyRepository
jest.mock('@/lib/repositories/sourceRepository');
describe('POST /api/sources', () => {

  it('should register a source successfully', async () => {
    // Test data
    const mockSave = save as jest.Mock;
    const sourceData = 'https://github.com/exampleUser/repo.git';
    mockSave.mockResolvedValueOnce(sourceData);

    const request = new NextRequest(new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify(sourceData),
    }));

    // Run the POST function directly
    const res = await POST(request);
    expect(res.status).toBe(201)
    const json = await res.json();
    expect(json.message).toBe('Source registered successfully');
  
  });
});