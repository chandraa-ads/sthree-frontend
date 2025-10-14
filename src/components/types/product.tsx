export interface ProductVariant {
  id: string;
  color: string;
  size: string[];
  price: number;
  original_price: number;
  discount_percentage: number;
  stock: number;
  product_id: string;
  images: string[];
  created_by: string;
  updated_by: string;
}

export interface CategoryRelation {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  full_name: string | null;
  username: string;
  email: string;
  email_verified: boolean;
  role: string;
  phone: string | null;
  whatsapp_no: string | null;
  address: string | null;
  profile_photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user_id: string;
  product_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductMedia {
  url: string;               // File URL (image/video/gif)
  type: "image" | "video" | "gif";  // Type of media
  thumbnail?: string;        // Optional thumbnail for videos
}

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  stock: number;
  category_id: string;
  category: string | null;
  main_category: string;
  sub_category: string;
  brand: string;
  about_item: string;
  description: string;
  product_detail: string;
  images: string[];
  tags: string[];
  product_size: string;
  image: string | null;
  created_by: string;
  updated_by: string;
  discount_start_date: string;
  discount_end_date: string;
  published_at: string;
  archived_at: string | null;
  is_active: boolean;
  is_deleted: boolean;
  wishlist?: boolean;

  // ⭐ Ratings & Reviews
  average_rating?: number;
  review_count?: number;
  reviews?: Review[];

  // 🧩 Relations
  category_relation: CategoryRelation;
  variants: ProductVariant[];

  // 🎥 Media Files
  product_images: ProductMedia[];

  // 👤 Created/Updated Info
  created_by_user?: User;
  updated_by_user?: User;

  // 🕒 Timestamps
  created_at: string;
  updated_at: string;
}


export interface FilterParams {
  category?: string;
  main_category?: string;
  sub_category?: string;
  brand?: string;
  color?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  name?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'name_asc' | 'name_desc';
  limit?: number;
  page?: number;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}