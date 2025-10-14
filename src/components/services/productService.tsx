import { Product, FilterParams, ApiResponse } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ProductService {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return empty array when API is unavailable to prevent crashes
      return [];
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async filterProducts(params: FilterParams): Promise<ApiResponse<Product[]>> {
    try {
      const searchParams = new URLSearchParams();
      
      // Add all filter parameters
      if (params.category) searchParams.append('category', params.category);
      if (params.main_category) searchParams.append('main_category', params.main_category);
      if (params.sub_category) searchParams.append('sub_category', params.sub_category);
      if (params.brand) searchParams.append('brand', params.brand);
      if (params.color && params.color.length > 0) {
        params.color.forEach(color => searchParams.append('color', color));
      }
      if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
      if (params.rating !== undefined) searchParams.append('rating', params.rating.toString());
      if (params.name) searchParams.append('name', params.name);
      if (params.sort) searchParams.append('sort', params.sort);
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.page) searchParams.append('page', params.page.toString());

      const response = await fetch(`${API_BASE_URL}/products/filter?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle different response formats
      if (Array.isArray(data)) {
        return { data };
      } else if (data.data) {
        return data;
      } else {
        return { data: [] };
      }
    } catch (error) {
      console.error('Error filtering products:', error);
      // Return empty result instead of throwing to prevent crashes
      return { data: [] };
    }
  }

  async getProductsByCategory(mainCategory: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/search/by-category?main_category=${encodeURIComponent(mainCategory)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  async getMainCategories(): Promise<string[]> {
    try {
      const products = await this.getAllProducts();
      const categories = new Set<string>();
      products.forEach(product => {
        if (product.main_category) {
          categories.add(product.main_category);
        }
      });
      return Array.from(categories);
    } catch (error) {
      console.error('Error fetching main categories:', error);
      return ['Saree', 'Salwar', 'Lehenga', 'Kurti', 'Dress'];
    }
  }

  // Helper method to get unique categories
  async getCategories(): Promise<string[]> {
    try {
      const products = await this.getAllProducts();
      const categories = new Set<string>();
      products.forEach(product => {
        if (product.main_category) categories.add(product.main_category);
        if (product.category_relation?.name) categories.add(product.category_relation.name);
      });
      return ['All', ...Array.from(categories)];
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return default categories when API is unavailable
      return ['All', 'Saree', 'Salwar', 'Lehenga', 'Kurti', 'Dress'];
    }
  }

  // Helper method to get unique brands
  async getBrands(): Promise<string[]> {
    try {
      const products = await this.getAllProducts();
      const brands = new Set<string>();
      products.forEach(product => {
        if (product.brand) brands.add(product.brand);
      });
      return ['All', ...Array.from(brands)];
    } catch (error) {
      console.error('Error fetching brands:', error);
      // Return default brands when API is unavailable
      return ['All', 'Deeptex', 'Kessi', 'Shangrila', 'Triveni', 'Lifestyle'];
    }
  }

  // Helper method to get unique colors from variants
  async getColors(): Promise<string[]> {
    try {
      const products = await this.getAllProducts();
      const colors = new Set<string>();
      products.forEach(product => {
        product.variants?.forEach(variant => {
          if (variant.color) colors.add(variant.color);
        });
      });
      return ['All', ...Array.from(colors)];
    } catch (error) {
      console.error('Error fetching colors:', error);
      // Return default colors when API is unavailable
      return ['All', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Black', 'White', 'Yellow', 'Orange'];
    }
  }

  // Helper method to parse JSON strings safely
  parseJsonString(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  }

  // Helper method to get product tags
  getProductTags(product: Product): string[] {
    if (!product.tags || product.tags.length === 0) return [];
    
    return product.tags.map(tag => {
      const parsed = this.parseJsonString(tag);
      return Array.isArray(parsed) ? parsed : [tag];
    }).flat().filter(Boolean);
  }

  // Helper method to get product sizes
  getProductSizes(product: Product): string[] {
    const sizes = this.parseJsonString(product.product_size);
    return Array.isArray(sizes) ? sizes : [];
  }
}

export const productService = new ProductService();
