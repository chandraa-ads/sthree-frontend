export interface Product {
  id: string;
  title: string;
  brand: string;
  image: string;
  images: string[];
  description: string;
  fabric: string;
  origin: string;
  care: string;
  size: string;
  color: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  soldCount: number;
  badges?: string[];
  features: string[];
}

export const products: Product[] = [
  {
    id: '1',
    title: 'Elegant Banarasi Silk Saree with Golden Zari Work',
    brand: 'Kanchipuram Silks',
    image: 'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8839888/pexels-photo-8839888.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8839889/pexels-photo-8839889.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Exquisite Banarasi silk saree featuring intricate golden zari work and traditional motifs. Perfect for weddings and special occasions.',
    fabric: 'Pure Silk',
    origin: 'Varanasi, India',
    care: 'Dry clean only',
    size: 'Free Size (5.5 meters)',
    color: 'Royal Blue',
    category: 'Silk',
    rating: 4.8,
    reviewCount: 245,
    price: 12999,
    originalPrice: 18999,
    soldCount: 156,
    badges: ['Best Seller', 'Premium Quality'],
    features: [
      'Handwoven pure silk',
      'Traditional zari work',
      'Includes matching blouse piece',
      'Authentic Banarasi craftsmanship'
    ]
  },
  {
    id: '2',
    title: 'Cotton Handloom Saree with Block Print',
    brand: 'Artisan Weaves',
    image: 'https://images.pexels.com/photos/8839890/pexels-photo-8839890.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/8839890/pexels-photo-8839890.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8839891/pexels-photo-8839891.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Beautiful handloom cotton saree with traditional block print designs. Comfortable for daily wear and casual occasions.',
    fabric: 'Pure Cotton',
    origin: 'Rajasthan, India',
    care: 'Machine wash cold',
    size: 'Free Size (5.5 meters)',
    color: 'Maroon',
    category: 'Cotton',
    rating: 4.5,
    reviewCount: 189,
    price: 2499,
    originalPrice: 3999,
    soldCount: 234,
    badges: ['Eco-friendly'],
    features: [
      'Handloom cotton fabric',
      'Natural block print',
      'Breathable and comfortable',
      'Includes blouse piece'
    ]
  },
  {
    id: '3',
    title: 'Art Silk Saree with Floral Embroidery',
    brand: 'Royal Collections',
    image: 'https://images.pexels.com/photos/8839892/pexels-photo-8839892.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/8839892/pexels-photo-8839892.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Stunning art silk saree with delicate floral embroidery work. Perfect blend of traditional and contemporary design.',
    fabric: 'Art Silk',
    origin: 'Karnataka, India',
    care: 'Dry clean recommended',
    size: 'Free Size (5.5 meters)',
    color: 'Pink',
    category: 'Art Silk',
    rating: 4.6,
    reviewCount: 167,
    price: 4999,
    originalPrice: 7999,
    soldCount: 98,
    badges: ['Limited Edition'],
    features: [
      'Premium art silk',
      'Hand embroidered florals',
      'Lightweight and elegant',
      'Matching blouse included'
    ]
  },
  {
    id: '4',
    title: 'Traditional Kanjivaram Silk Saree',
    brand: 'South Silk House',
    image: 'https://images.pexels.com/photos/8839893/pexels-photo-8839893.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/8839893/pexels-photo-8839893.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Authentic Kanjivaram silk saree with traditional temple border and rich gold zari work.',
    fabric: 'Pure Kanjivaram Silk',
    origin: 'Kanchipuram, Tamil Nadu',
    care: 'Dry clean only',
    size: 'Free Size (5.5 meters)',
    color: 'Green',
    category: 'Silk',
    rating: 4.9,
    reviewCount: 312,
    price: 15999,
    originalPrice: 22999,
    soldCount: 87,
    badges: ['Authentic', 'Premium'],
    features: [
      'Pure Kanjivaram silk',
      'Temple border design',
      'Heavy zari work',
      'Traditional craftsmanship'
    ]
  },
  {
    id: '5',
    title: 'Georgette Saree with Sequin Work',
    brand: 'Modern Drapes',
    image: 'https://images.pexels.com/photos/8839894/pexels-photo-8839894.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/8839894/pexels-photo-8839894.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Contemporary georgette saree with sparkling sequin work, perfect for parties and celebrations.',
    fabric: 'Georgette',
    origin: 'Mumbai, India',
    care: 'Dry clean only',
    size: 'Free Size (5.5 meters)',
    color: 'Black',
    category: 'Georgette',
    rating: 4.4,
    reviewCount: 143,
    price: 3999,
    originalPrice: 5999,
    soldCount: 176,
    badges: ['Party Wear'],
    features: [
      'Flowing georgette fabric',
      'Sequin embellishments',
      'Modern design',
      'Ready to wear'
    ]
  },
  {
    id: '6',
    title: 'Chanderi Cotton Silk Saree',
    brand: 'Heritage Textiles',
    image: 'https://images.pexels.com/photos/8839895/pexels-photo-8839895.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/8839895/pexels-photo-8839895.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Elegant Chanderi cotton silk saree with subtle gold motifs and traditional weaving.',
    fabric: 'Cotton Silk',
    origin: 'Chanderi, Madhya Pradesh',
    care: 'Hand wash or dry clean',
    size: 'Free Size (5.5 meters)',
    color: 'Cream',
    category: 'Cotton Silk',
    rating: 4.7,
    reviewCount: 201,
    price: 6999,
    originalPrice: 9999,
    soldCount: 134,
    badges: ['Handwoven'],
    features: [
      'Chanderi cotton silk',
      'Gold motif work',
      'Lightweight texture',
      'Traditional weaving'
    ]
  },
  {
    id: '7',
    title: 'Tussar Silk Saree with Hand Painting',
    brand: 'Artisan Studio',
    image: 'https://images.pexels.com/photos/8839896/pexels-photo-8839896.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/8839896/pexels-photo-8839896.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Unique Tussar silk saree featuring beautiful hand-painted designs by skilled artisans.',
    fabric: 'Tussar Silk',
    origin: 'West Bengal, India',
    care: 'Dry clean only',
    size: 'Free Size (5.5 meters)',
    color: 'Yellow',
    category: 'Silk',
    rating: 4.8,
    reviewCount: 89,
    price: 8999,
    originalPrice: 12999,
    soldCount: 67,
    badges: ['Hand Painted', 'Unique'],
    features: [
      'Natural Tussar silk',
      'Hand-painted artwork',
      'Eco-friendly dyes',
      'One-of-a-kind design'
    ]
  },
  {
    id: '8',
    title: 'Linen Saree with Digital Print',
    brand: 'Contemporary Weaves',
    image: 'https://images.pexels.com/photos/8839897/pexels-photo-8839897.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/8839897/pexels-photo-8839897.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Modern linen saree with vibrant digital print, perfect for office wear and casual outings.',
    fabric: 'Pure Linen',
    origin: 'Kerala, India',
    care: 'Machine wash gentle',
    size: 'Free Size (5.5 meters)',
    color: 'Multi',
    category: 'Linen',
    rating: 4.3,
    reviewCount: 156,
    price: 1999,
    originalPrice: 2999,
    soldCount: 298,
    badges: ['Office Wear'],
    features: [
      'Breathable linen fabric',
      'Digital print design',
      'Easy maintenance',
      'Contemporary style'
    ]
  }
];

export const categories = [
  'All',
  'Silk',
  'Cotton',
  'Art Silk',
  'Georgette',
  'Cotton Silk',
  'Linen'
];

export const colors = [
  'All',
  'Royal Blue',
  'Maroon',
  'Pink',
  'Green',
  'Black',
  'Cream',
  'Yellow',
  'Multi'
];

export const brands = [
  'All',
  'Kanchipuram Silks',
  'Artisan Weaves',
  'Royal Collections',
  'South Silk House',
  'Modern Drapes',
  'Heritage Textiles',
  'Artisan Studio',
  'Contemporary Weaves'
];