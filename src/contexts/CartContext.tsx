import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product, CartItem, WishlistItem } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  cartItemCount: number;
  addToCart: (item: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (id: string, newQuantity: number, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (id: string, selectedSize?: string, selectedColor?: string) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
  selectedColorFilter: string | null;
  setSelectedColorFilter: (color: string | null) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  formatPrice: (price: number) => string; // ADDED: formatPrice to the interface
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
      return [];
    }
  });

  const [currency, setCurrency] = useState<string>(() => {
    try {
      const savedCurrency = localStorage.getItem('currency');
      return savedCurrency || 'PKR'; // Default currency to PKR
    } catch (error) {
      console.error("Failed to parse currency from localStorage", error);
      return 'PKR';
    }
  });

  const [selectedColorFilter, setSelectedColorFilter] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage", error);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('currency', currency);
    } catch (error) {
      console.error("Failed to save currency to localStorage", error);
    }
  }, [currency]);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const getCartItemId = (productId: string, size?: string, color?: string) => {
    return `${productId}-${size || 'nosize'}-${color || 'nocolor'}`;
  };

  const addToCart = (product: Product, quantityToAdd: number = 1, selectedSize?: string, selectedColor?: string) => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Selection Required",
        description: `Please select a size for ${product.name}.`,
        variant: "destructive",
      });
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Selection Required",
        description: `Please select a color for ${product.name}.`,
        variant: "destructive",
      });
      return;
    }

    setCart((prevCart) => {
      const uniqueCartItemId = getCartItemId(product.id, selectedSize, selectedColor);
      const existingItemIndex = prevCart.findIndex(
        (item) => getCartItemId(item.id, item.selectedSize, item.selectedColor) === uniqueCartItemId
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantityToAdd;
        toast({
          title: "Cart Updated",
          description: `Added ${quantityToAdd} more ${product.name} to cart.`,
          variant: "default",
        });
        return updatedCart;
      } else {
        const newItem: CartItem = {
          ...product,
          quantity: quantityToAdd,
          selectedSize: selectedSize || (product.sizes?.[0] || ''),
          selectedColor: selectedColor || (product.colors?.[0] || ''),
        };
        toast({
          title: "Item Added",
          description: `${product.name} added to cart.`,
          variant: "default",
        });
        return [...prevCart, newItem];
      }
    });
  };

  const updateQuantity = (id: string, newQuantity: number, selectedSize?: string, selectedColor?: string) => {
    setCart((prevCart) => {
      const uniqueCartItemId = getCartItemId(id, selectedSize, selectedColor);
      return prevCart
        .map((item) => {
          if (getCartItemId(item.id, item.selectedSize, item.selectedColor) === uniqueCartItemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id: string, selectedSize?: string, selectedColor?: string) => {
    setCart((prevCart) => {
      const uniqueCartItemId = getCartItemId(id, selectedSize, selectedColor);
      const updatedCart = prevCart.filter(
        (item) => getCartItemId(item.id, item.selectedSize, item.selectedColor) !== uniqueCartItemId
      );
      toast({
        title: "Item Removed",
        description: "Product removed from cart.",
        variant: "default",
      });
      return updatedCart;
    });
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} removed from your wishlist.`,
          variant: "default",
        });
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        toast({
          title: "Added to Wishlist",
          description: `${product.name} added to your wishlist!`,
          variant: "default",
        });
        return [...prevWishlist, product];
      }
    });
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      variant: "default",
    });
  };

  // Function to format price based on selected currency
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
        formatPrice, // ADDED: formatPrice to the context value
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
