export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string; // Make sure this is present and not optional if ProductManager expects it
  images?: string[]; // Optional array for multiple images
  category: 'men' | 'women' | 'kids';
  subcategory: string;
  sizes: string[];
  colors: string[]; // Make sure this is present and not optional if ProductManager expects it
  selectedSize?: string;
  selectedColor?: string;
  inStock: boolean; // Make sure this is present and not optional if ProductManager expects it
  stockQuantity: number; // Make sure this is present and not optional if ProductManager expects it
  rating: number;
  reviews: Review[]; // This should likely be `reviews: Review[]` or similar, not `number`, if ProductManager uses it for a list of reviews. If it's a count, then `number` is fine. I'll keep it as number for now based on your definition, but be aware of this potential mismatch.
  isNew?: boolean;
  isFeatured?: boolean;
  tags: string[]; // Make 'tags' required
  totalStocks: number;
  mainImageUrl: string;
  createdAt: Date | import("firebase/firestore").Timestamp;
  updatedAt: Date | import("firebase/firestore").Timestamp;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface WishlistItem extends Product {}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  discountCode?: string;
  discountAmount?: number;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  orders: Order[];
  wishlist: WishlistItem[];
  createdAt: Date;
}