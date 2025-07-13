import { useState } from "react";
import { Header } from "@/components/Header";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Footer } from "@/components/Footer";
// Import SheetDescription for accessibility
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
// Removed ScrollArea import as it will no longer be used directly in the SheetContent
// import { ScrollArea } from "@/components/ui/scroll-area";
import { sampleProducts } from "@/data/products";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { ColorFilter } from "@/components/ColorFilter"; // NEW: Import ColorFilter

const NewArrivalsPage = () => {
  // Filter products specifically for new arrivals
  const [products] = useState<Product[]>(sampleProducts.filter(p => p.isNew));
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, wishlist, addToCart, updateQuantity, removeFromCart, toggleWishlist, cartItemCount } = useCart();

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItems={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
      />

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          // Apply the same styling as in Index.tsx and other category pages for white background and full height/scrolling
          className="w-full max-w-md flex flex-col h-full overflow-y-auto"
          style={{ backgroundColor: 'hsl(0 0% 100%)' }} // Pure white background
        >
          {/* Re-add SheetHeader with visually hidden Title and Description for accessibility */}
          <SheetHeader className="pb-4">
            <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
            <SheetDescription className="sr-only">
              Review your items and proceed to checkout.
            </SheetDescription>
          </SheetHeader>

          {/* This div will now take all available vertical space.
              The SheetContent now handles overflow for the whole content,
              so the ScrollArea is no longer needed here.
          */}
          <div className="flex-1"> {/* This div ensures ShoppingCart takes available space */}
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
        <h1 className="text-3xl font-bold mb-8">New Arrivals</h1>
        {/* NEW: Add ColorFilter here */}
        <div className="mb-8">
          <ColorFilter />
        </div>
        <ProductCatalog
          products={products} // Pass the filtered new arrival products
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          wishlist={wishlist}
          searchQuery={searchQuery}
          // No specific category for new arrivals, so omit selectedCategory
        />
      </div>

      <Footer />
    </div>
  );
};

export default NewArrivalsPage;
