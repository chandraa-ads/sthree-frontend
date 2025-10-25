import { Product, FilterParams, ApiResponse } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ProductService {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

      if (params.category) searchParams.append('category', params.category);
      if (params.main_category) searchParams.append('main_category', params.main_category);
      if (params.sub_category) searchParams.append('sub_category', params.sub_category);
      if (params.brand) searchParams.append('brand', params.brand);
      if (params.color?.length) {
        params.color.forEach((c) => searchParams.append('color', c));
      }
      if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
      if (params.rating !== undefined) searchParams.append('rating', params.rating.toString());
      if (params.name) searchParams.append('name', params.name);
      if (params.sort) searchParams.append('sort', params.sort);
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.page) searchParams.append('page', params.page.toString());

      const response = await fetch(`${API_BASE_URL}/products/filter?${searchParams.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (Array.isArray(data)) return { data };
      if (data.data) return data;
      return { data: [] };
    } catch (error) {
      console.error('Error filtering products:', error);
      throw error;
    }
  }
  
async getAverageRating(productId: string): Promise<{ average: number; count: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/average-rating`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return {
        average: data.average ?? 0,
        count: data.count ?? 0
      };
    } catch (error) {
      console.error("Error fetching average rating:", error);
      return { average: 0, count: 0 };
    }
  }
  
async getProductsByCategory(mainCategory: string): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/search/by-category?main_category=${encodeURIComponent(mainCategory)}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
      products.forEach((p) => p.main_category && categories.add(p.main_category));
      return Array.from(categories);
    } catch (error) {
      console.error('Error fetching main categories:', error);
      return ['Saree', 'Salwar', 'Lehenga', 'Kurti', 'Dress'];
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const products = await this.getAllProducts();
      const categories = new Set<string>();
      products.forEach((p) => {
        if (p.main_category) categories.add(p.main_category);
        if (p.category_relation?.name) categories.add(p.category_relation.name);
      });
      return ['All', ...Array.from(categories)];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['All', 'Saree', 'Salwar', 'Lehenga', 'Kurti', 'Dress'];
    }
  }

  async getBrands(): Promise<string[]> {
    try {
      const products = await this.getAllProducts();
      const brands = new Set<string>();
      products.forEach((p) => p.brand && brands.add(p.brand));
      return ['All', ...Array.from(brands)];
    } catch (error) {
      console.error('Error fetching brands:', error);
      return ['All', 'Deeptex', 'Kessi', 'Shangrila', 'Triveni', 'Lifestyle'];
    }
  }

  async getColors(): Promise<string[]> {
    try {
      const products = await this.getAllProducts();
      const colors = new Set<string>();
      products.forEach((p) => p.variants?.forEach((v) => v.color && colors.add(v.color)));
      return ['All', ...Array.from(colors)];
    } catch (error) {
      console.error('Error fetching colors:', error);
      return ['All', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Black', 'White', 'Yellow', 'Orange'];
    }
  }

  parseJsonString(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  }

  getProductTags(product: Product): string[] {
    if (!product.tags?.length) return [];
    return product.tags
      .map((tag) => {
        const parsed = this.parseJsonString(tag);
        return Array.isArray(parsed) ? parsed : [tag];
      })
      .flat()
      .filter(Boolean);
  }

  getProductSizes(product: Product): string[] {
    const sizes = this.parseJsonString(product.product_size);
    return Array.isArray(sizes) ? sizes : [];
  }

// Toggle wishlist for a product (adds/removes row in wishlist table)
async toggleWishlist(productId: string, userId: string): Promise<{ wishlist: boolean }> {
  const storedUser = localStorage.getItem("loggedInUser");
  if (!storedUser) throw new Error("User not logged in");

  const user = JSON.parse(storedUser);
  if (!user?.token) throw new Error("User not logged in");

  // ✅ Updated endpoint to match backend
  const response = await fetch(`${API_BASE_URL}/products/${productId}/wishlist`, {
    method: "PATCH", // PATCH endpoint toggles wishlist
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${user.token}`,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to toggle wishlist");
  }

  // The API should return { wishlist: true/false } depending on current state
  return await response.json();
}

// Check if product is wishlisted for the logged-in user
async isProductWishlisted(productId: string, id: string): Promise<{ wishlisted: boolean }> {
  try {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) throw new Error("User not logged in");

    const user = JSON.parse(storedUser);
    if (!user?.token || !user?.id) throw new Error("User not logged in");

    const res = await fetch(`${API_BASE_URL}/products/user/${user.id}/wishlist`, {
      headers: {
        "Authorization": `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch wishlist");

    const wishlistItems = await res.json();

    // ✅ Safety check: ensure it's an array
    const wishlistArray = Array.isArray(wishlistItems)
      ? wishlistItems
      : Array.isArray(wishlistItems?.data)
      ? wishlistItems.data
      : [];

    const wishlisted = wishlistArray.some((item: any) => item.product_id === productId);

    return { wishlisted };
  } catch (err) {
    console.error("Error in isProductWishlisted:", err);
    return { wishlisted: false };
  }
}






  

}

// ✅ Export a SINGLE shared instance (named)
export const productService = new ProductService();


// ✅ Also export default (optional — for flexibility)
export default productService;
