import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ShoppingCart } from "@/components/ShoppingCart"; // Corrected import syntax
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleProducts } from "@/data/products";
import { Product, CartItem } from "@/types/product";
import { Truck, Shield, RefreshCw, Star, ArrowRight, TrendingUp } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import mensCollection from "@/assets/mens-collection.jpg";
import womensCollection from "@/assets/womens-collection.jpg";
import kidsCollection from "@/assets/kids-collection.jpg";
import { ColorFilter } from "@/components/ColorFilter";

const Index = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products] = useState<Product[]>(sampleProducts);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | "catalog">(searchQuery ? "catalog" : "home");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { cart, wishlist, addToCart, updateQuantity, removeFromCart, toggleWishlist, cartItemCount } = useCart();

  // Update search query when URL changes
  useEffect(() => {
    if (searchQuery) {
      setLocalSearchQuery(searchQuery);
      setCurrentView("catalog");
    }
  }, [searchQuery]);

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentView("catalog");
  };

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const newArrivals = products.filter(p => p.isNew).slice(0, 8);

  const categories = [
    {
      name: "Men's Collection",
      image: mensCollection,
      count: products.filter(p => p.category === "men").length,
      href: "/men"
    },
    {
      name: "Women's Collection",
      image: womensCollection,
      count: products.filter(p => p.category === "women").length,
      href: "/women"
    },
    {
      name: "Kids' Collection",
      image: kidsCollection,
      count: products.filter(p => p.category === "kids").length,
      href: "/kids"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItems={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={setLocalSearchQuery}
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

      {currentView === "home" ? (
        <>
          <HeroSection />

          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#FDD8A8' }}
                  >
                    <Truck className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Free Shipping</h3>
                  <p className="text-sm text-muted-foreground">Free shipping on orders over RS3,000</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#FDD8A8' }}
                  >
                    <Shield className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Quality Guarantee</h3>
                  <p className="text-sm text-muted-foreground">Premium quality guaranteed</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#FDD8A8' }}
                  >
                    <RefreshCw className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">30-Day Returns</h3>
                  <p className="text-sm text-muted-foreground">Easy returns within 30 days</p>
                </div>
              </div>
            </div>
          </section>

          <CategorySection
            title="Shop by Category"
            description="Explore our extensive collection of premium clothing for men, women, and kids"
            categories={categories}
          />

          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
                <p className="text-lg text-muted-foreground">
                  Discover our handpicked selection of trending fashion items
                </p>
              </div>

              <div className="mb-8">
                <ColorFilter />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={wishlist.some(item => item.id === product.id)}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <Button
                  size="lg"
                  onClick={() => setCurrentView("catalog")}
                  className="px-8"
                >
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 bg-gradient-subtle">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent mr-2" />
                  <Badge variant="secondary">New Arrivals</Badge>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Fashion Trends</h2>
                <p className="text-lg text-muted-foreground">
                  Stay ahead of the curve with our newest collection
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={wishlist.some(item => item.id === product.id)}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay Updated with Fashion Trends
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-primary-foreground/80">
                Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals, and fashion tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-primary"
                />
                <Button variant="secondary" size="lg">
                  Subscribe
                </Button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <ColorFilter />
          </div>
          <ProductCatalog
            products={products}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlist={wishlist}
            searchQuery={localSearchQuery}
            selectedCategory={selectedCategory}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Index;
