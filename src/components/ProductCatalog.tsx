import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
  searchQuery?: string;
  selectedCategory?: string;
}

export const ProductCatalog = ({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  searchQuery = "",
  selectedCategory = ""
}: ProductCatalogProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState(selectedCategory);
  const [priceRange, setPriceRange] = useState("all");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // MODIFIED: Search filter - now only searches by product name
      const searchMatch = localSearchQuery === "" ||
        product.name.toLowerCase().includes(localSearchQuery.toLowerCase());

      // Category filter - strict category matching
      let categoryMatch = true;
      if (selectedCategory && selectedCategory !== "all" && selectedCategory !== "") {
        categoryMatch = product.category === selectedCategory;
      } else if (filterCategory && filterCategory !== "all" && filterCategory !== "") {
        categoryMatch = product.category === filterCategory;
      }

      // Price filter
      let priceMatch = true;
      if (priceRange === "under-50") priceMatch = product.price < 50;
      else if (priceRange === "50-100") priceMatch = product.price >= 50 && product.price <= 100;
      else if (priceRange === "over-100") priceMatch = product.price > 100;

      return searchMatch && categoryMatch && priceMatch;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, localSearchQuery, filterCategory, priceRange, sortBy, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {!selectedCategory && (
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-50">Under $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="over-100">Over $100</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredAndSortedProducts.length} of {products.length} products
          {selectedCategory && ` in ${selectedCategory} category`}
        </p>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={wishlist.some(item => item.id === product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};
