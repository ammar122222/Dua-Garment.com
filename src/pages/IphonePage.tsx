import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ShoppingCart } from "@/components/ShoppingCart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Product } from '@/types/product';
import { db } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

const IphonePage: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, updateQuantity, removeFromCart, cartItemCount, addToCart } = useCart();
  const [iphoneProduct, setIphoneProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  useEffect(() => {
    const fetchIphoneProduct = async () => {
      try {
        const q = query(collection(db, "products"), where("name", "==", "iPhone 15 Pro"), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setIphoneProduct({ id: doc.id, ...doc.data() } as Product);
        } else {
          console.warn("iPhone 15 Pro product not found in database.");
        }
      } catch (error) {
        console.error("Failed to fetch iPhone product:", error);
      }
    };
    fetchIphoneProduct();
  }, []);

  const handleBuyNow = () => {
    if (!iphoneProduct) {
      toast({ title: "Product not available", description: "The iPhone 15 Pro is not available at the moment.", variant: "destructive" });
      return;
    }
    const defaultSize = iphoneProduct.sizes?.[0] || 'default';
    const defaultColor = iphoneProduct.colors?.[0] || 'default';
    addToCart(iphoneProduct, 1, defaultSize, defaultColor);
    toast({ title: "🎉 Added to Cart!", description: `${iphoneProduct.name} has been added to your cart.` });
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setIsCartOpen(true);
  };

  return (
    <div className="bg-black text-white">
      <Header 
        cartItems={cartItemCount} 
        onCartClick={() => setIsCartOpen(true)} 
        onSearchChange={() => {}} 
      />
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          className="w-full max-w-md flex flex-col h-full overflow-y-auto"
          style={{ backgroundColor: 'hsl(0 0% 100%)' }}
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
            <SheetDescription className="sr-only">
              Review your items and proceed to checkout.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1">
            <ShoppingCart
              items={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onCheckout={handleCheckout}
            />
          </div>
        </SheetContent>
      </Sheet>
      <main className="text-center py-20">
        <h1 className="text-6xl font-bold">iPhone 15 Pro</h1>
        <h2 className="text-3xl mt-4">Titanium. So strong. So light. So Pro.</h2>
        <div className="mt-8 flex justify-center items-center gap-6">
          <Link
            to={iphoneProduct ? `/product/${iphoneProduct.id}` : "#"}
            className="text-blue-500 hover:underline text-lg"
          >
            Learn more &gt;
          </Link>
          <Button
            onClick={handleBuyNow}
            disabled={!iphoneProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg"
          >
            Buy
          </Button>
        </div>
      </main>
      <div className="flex justify-center">
        <img src="https://www.apple.com/v/iphone-15-pro/c/images/overview/hero/hero_iphone_15_pro__i7ciy6fzkzuu_large.jpg" alt="iPhone 15 Pro" className="max-w-full h-auto" />
      </div>
      <Footer />
    </div>
  );
};

export default IphonePage;