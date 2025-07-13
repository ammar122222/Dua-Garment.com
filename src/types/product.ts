export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[]; // Added: Optional array for multiple images
  category: 'men' | 'women' | 'kids';
  subcategory: string;
  sizes: string[]; // Changed to required
  colors: string[]; // Changed to required
  selectedSize?: string; // Kept as optional in Product, as it's selected later
  selectedColor?: string; // Kept as optional in Product, as it's selected later
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
  tags?: string[]; // Added: Optional tags array
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string; // Changed to required
  selectedColor: string; // Changed to required
}

export interface WishlistItem extends Product {} // Added: WishlistItem interface

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
  discountCode?: string; // Added: Optional discount code
  discountAmount?: number; // Added: Optional discount amount
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review { // Added: Review interface
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
}

export interface User { // Added: User interface
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  orders: Order[];
  wishlist: WishlistItem[];
  createdAt: Date;
}
