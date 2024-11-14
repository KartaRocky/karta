import { expect, describe, it, vi } from "vitest";
import { render, screen } from '@testing-library/react'
import createFetchMock from 'vitest-fetch-mock';
import Page from '@/app/page'
// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

describe('Page', () => {
  it('renders a heading', () => {
    const fetchMocker = createFetchMock(vi);
    const fetch = fetchMocker.enableMocks()
    fetch.mockResponseOnce(JSON.stringify([{ "source": { "url": "https://github.com/KartaRocky/users", "repository_name": "users", "repository_owner": "KartaRocky", "path_with_namespace": "KartaRocky/users", "created_at": "2024-11-13 08:19:01" }, "dependencies": [{ "id": 1, "who": "auth", "what": "endpoint", "value": "/v1/users/{id}", "created_at": "2024-11-13 08:19:02" }] }, { "source": { "url": "https://github.com/KartaRocky/auth", "repository_name": "auth", "repository_owner": "KartaRocky", "path_with_namespace": "KartaRocky/auth", "created_at": "2024-11-13 08:19:01" }, "dependencies": [{ "id": 4, "who": "bprice", "what": "endpoint", "value": "/v1/auth", "created_at": "2024-11-13 08:24:35" }, { "id": 5, "who": "lprice", "what": "endpoint", "value": "/v1/auth", "created_at": "2024-11-13 08:24:35" }, { "id": 6, "who": "lprice", "what": "endpoint", "value": "/v1/me", "created_at": "2024-11-13 08:24:35" }] }, { "source": { "url": "https://github.com/KartaRocky/bprice", "repository_name": "bprice", "repository_owner": "KartaRocky", "path_with_namespace": "KartaRocky/bprice", "created_at": "2024-11-13 08:19:01" }, "dependencies": [{ "id": 2, "who": "data", "what": "table", "value": "b_avarage_price", "created_at": "2024-11-13 08:23:55" }] }, { "source": { "url": "https://github.com/KartaRocky/lprice", "repository_name": "lprice", "repository_owner": "KartaRocky", "path_with_namespace": "KartaRocky/lprice", "created_at": "2024-11-13 08:19:01" }, "dependencies": [{ "id": 3, "who": "data", "what": "table", "value": "l_total_prices", "created_at": "2024-11-13 08:23:55" }] }]))
    render(<Page />)

    const title = screen.getByText('Karta')

    expect(title).toBeDefined()
  })
})