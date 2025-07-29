import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Footer } from "@/components/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { ColorFilter } from "@/components/ColorFilter";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const SalePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, wishlist, addToCart, updateQuantity, removeFromCart, toggleWishlist, cartItemCount } = useCart();

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  // ✅ Fetch products where onSale === true
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const q = query(collection(db, "products"), where("onSale", "==", true));
        const snapshot = await getDocs(q);
        const saleProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(saleProducts);
      } catch (error) {
        console.error("❌ Failed to fetch sale products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItems={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
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

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Sale Items</h1>

        <div className="mb-8">
          <ColorFilter />
        </div>

        <ProductCatalog
          products={products}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          wishlist={wishlist}
          searchQuery={searchQuery}
        />
      </div>

      <Footer />
    </div>
  );
};

export default SalePage;
