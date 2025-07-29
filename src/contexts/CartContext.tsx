import {
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { Product, CartItem, WishlistItem } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { updateDoc, arrayUnion, arrayRemove, doc } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface CartContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  cartItemCount: number;
  addToCart: (
    item: Product,
    quantity?: number,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  updateQuantity: (
    id: string,
    newQuantity: number,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  removeFromCart: (
    id: string,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
  selectedColorFilter: string | null;
  setSelectedColorFilter: (color: string | null) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  formatPrice: (price: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error('Failed to parse wishlist from localStorage', error);
      return [];
    }
  });

  const [currency, setCurrency] = useState<string>(() => {
    try {
      const savedCurrency = localStorage.getItem('currency');
      return savedCurrency || 'PKR';
    } catch (error) {
      console.error('Failed to parse currency from localStorage', error);
      return 'PKR';
    }
  });

  const [selectedColorFilter, setSelectedColorFilter] = useState<string | null>(
    null
  );

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const getCartItemId = (productId: string, size?: string, color?: string) => {
    return `${productId}-${size || 'nosize'}-${color || 'nocolor'}`;
  };

  const addToCart = (
    product: Product,
    quantityToAdd: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: 'Selection Required',
        description: `Please select a size for ${product.name}.`,
        variant: 'destructive',
      });
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: 'Selection Required',
        description: `Please select a color for ${product.name}.`,
        variant: 'destructive',
      });
      return;
    }

    setCart((prevCart) => {
      const uniqueCartItemId = getCartItemId(
        product.id,
        selectedSize,
        selectedColor
      );
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          getCartItemId(
            item.id,
            item.selectedSize,
            item.selectedColor
          ) === uniqueCartItemId
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantityToAdd;

        toast({
          title: 'Cart Updated',
          description: `Added ${quantityToAdd} more ${product.name} to cart.`,
        });

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        return updatedCart;
      } else {
        const newItem: CartItem = {
          id: product.id, // ✅ important: keep the ID
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          quantity: quantityToAdd,
          selectedSize: selectedSize || product.sizes?.[0] || '',
          selectedColor: selectedColor || product.colors?.[0] || '',
          image: "",
          category: "men",
          subcategory: "",
          sizes: [],
          colors: [],
          inStock: false,
          stockQuantity: 0,
          rating: 0,
          reviews: [],
          tags: [],
          totalStocks: 0,
          mainImageUrl: "",
          createdAt: undefined,
          updatedAt: undefined
        };

        toast({
          title: 'Item Added',
          description: `${product.name} added to cart.`,
        });

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        return [...prevCart, newItem];
      }
    });
  };

  const updateQuantity = (
    id: string,
    newQuantity: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setCart((prevCart) => {
      const uniqueCartItemId = getCartItemId(id, selectedSize, selectedColor);
      return prevCart
        .map((item) => {
          if (
            getCartItemId(item.id, item.selectedSize, item.selectedColor) ===
            uniqueCartItemId
          ) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (
    id: string,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setCart((prevCart) => {
      const uniqueCartItemId = getCartItemId(id, selectedSize, selectedColor);
      const updatedCart = prevCart.filter(
        (item) =>
          getCartItemId(
            item.id,
            item.selectedSize,
            item.selectedColor
          ) !== uniqueCartItemId
      );

      toast({
        title: 'Item Removed',
        description: 'Product removed from cart.',
      });

      return updatedCart;
    });
  };

  const toggleWishlist = async (product: Product) => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your wishlist.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const exists = wishlist.some((item) => item.id === product.id);
      const userRef = doc(db, "users", user.id);

      if (exists) {
        await updateDoc(userRef, {
          wishlist: arrayRemove(product.id)
        });

        setWishlist((prevWishlist) => {
          return prevWishlist.filter((item) => item.id !== product.id);
        });

        toast({
          title: 'Removed from Wishlist',
          description: `${product.name} removed from your wishlist.`,
        });
      } else {
        await updateDoc(userRef, {
          wishlist: arrayUnion(product.id)
        });

        setWishlist((prevWishlist) => {
          return [...prevWishlist, product];
        });

        toast({
          title: 'Added to Wishlist',
          description: `${product.name} added to your wishlist!`,
        });

        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.5 },
          colors: ['#ff0000', '#ff6666', '#ff9999'],
        });
      }
    } catch (error) {
      console.error('Error updating wishlist in Firebase:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wishlist. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: 'Cart Cleared',
      description: 'All items have been removed from your cart.',
    });
  };

  const formatPrice = (price: number): string => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(price);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        cartItemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleWishlist,
        clearCart,
        selectedColorFilter,
        setSelectedColorFilter,
        currency,
        setCurrency,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
