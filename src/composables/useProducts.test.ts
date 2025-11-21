import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useProducts, type Product } from './useProducts';

// Mock the appConfig module
vi.mock('@/config/appConfig', () => ({
  appConfig: {
    apiBaseUrl: 'http://test-api.com/api/',
  },
}));

describe('useProducts', () => {
  // Store original fetch
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original fetch after each test
    global.fetch = originalFetch;
  });

  it('should initialize with empty products array', () => {
    const { products, loading, error } = useProducts();

    expect(products.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(error.value).toBe(null);
  });

  it('should fetch products successfully', async () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Product 1', pricePence: 1000 },
      { id: '2', name: 'Product 2', pricePence: 2000 },
    ];

    // Mock fetch to return successful response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
      status: 200,
      statusText: 'OK',
    });

    const { products, loading, error, fetchProducts } = useProducts();

    expect(loading.value).toBe(false);

    // Call fetchProducts and wait for it to complete
    await fetchProducts();

    expect(loading.value).toBe(false);
    expect(error.value).toBe(null);
    expect(products.value).toEqual(mockProducts);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://test-api.com/api/products',
      { headers: { Accept: 'application/json' } },
    );
  });

  // TODO: Add more tests for error handling, empty responses, etc.
});
