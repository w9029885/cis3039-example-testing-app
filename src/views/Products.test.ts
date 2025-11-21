import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import Products from './Products.vue';
import type { Product } from '../composables/useProducts';

// Create mock functions
let mockFetchProducts = vi.fn();
let mockProducts: any;
let mockLoading: any;
let mockError: any;

// Mock the useProducts composable
vi.mock('@/composables/useProducts', () => ({
  useProducts: () => ({
    products: mockProducts,
    loading: mockLoading,
    error: mockError,
    fetchProducts: mockFetchProducts,
  }),
}));

describe('Products.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Create fresh refs for each test
    mockFetchProducts = vi.fn();
    mockProducts = ref<Product[]>([]);
    mockLoading = ref(false);
    mockError = ref<string | null>(null);
  });

  it('should call fetchProducts on mount', () => {
    mount(Products);

    expect(mockFetchProducts).toHaveBeenCalledTimes(1);
    expect(mockFetchProducts).toHaveBeenCalledWith();
  });

  it('should display empty state when no products', () => {
    const wrapper = mount(Products);

    expect(wrapper.find('.empty').exists()).toBe(true);
    expect(wrapper.find('.empty').text()).toBe('No products found.');
  });

  it('should display list of products', () => {
    const testProducts: Product[] = [
      { id: '1', name: 'Product 1', pricePence: 1000 },
      { id: '2', name: 'Product 2', pricePence: 2500 },
    ];
    mockProducts.value = testProducts;

    const wrapper = mount(Products);

    const listItems = wrapper.findAll('.card');
    expect(listItems).toHaveLength(2);
    expect(listItems[0].find('.name').text()).toBe('Product 1');
    expect(listItems[0].find('.price').text()).toBe('£10.00');
    expect(listItems[1].find('.name').text()).toBe('Product 2');
    expect(listItems[1].find('.price').text()).toBe('£25.00');
  });

  it('should display product description when available', () => {
    const testProducts: Product[] = [
      {
        id: '1',
        name: 'Product 1',
        pricePence: 1000,
        description: 'A great product',
      },
      { id: '2', name: 'Product 2', pricePence: 2000 },
    ];
    mockProducts.value = testProducts;

    const wrapper = mount(Products);

    const listItems = wrapper.findAll('.card');

    // First product has description
    expect(listItems[0].find('.desc').exists()).toBe(true);
    expect(listItems[0].find('.desc').text()).toBe('A great product');

    // Second product has no description
    expect(listItems[1].find('.desc').exists()).toBe(false);
  });

  it('should format prices correctly', () => {
    const testProducts: Product[] = [
      { id: '1', name: 'Product 1', pricePence: 999 }, // £9.99
      { id: '2', name: 'Product 2', pricePence: 10000 }, // £100.00
      { id: '3', name: 'Product 3', pricePence: 0 }, // £0.00
      { id: '4', name: 'Product 4' }, // No price
    ];
    mockProducts.value = testProducts;

    const wrapper = mount(Products);

    const prices = wrapper.findAll('.price');
    expect(prices[0].text()).toBe('£9.99');
    expect(prices[1].text()).toBe('£100.00');
    expect(prices[2].text()).toBe('£0.00');
    expect(prices[3].text()).toBe('—'); // Em dash for missing price
  });

  // TODO: Add more tests for error handling, empty responses, etc.
});
