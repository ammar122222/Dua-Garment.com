import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Product } from "@/types/product";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext'; // NEW: Import useCart

// Assuming Review is defined elsewhere, e.g., in types/product or types/review
// If not, you might need to define it here or import it.
// Example:
// interface Review {
//   id: string;
//   author: string;
//   comment: string;
//   rating: number;
// }

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist
}: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isAdding, setIsAdding] = useState(false); // State for animation
  const { formatPrice } = useCart(); // NEW: Get formatPrice from context

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up to the Link
    if (!product.inStock || isAdding) return;

    setIsAdding(true);
    onAddToCart({ ...product, selectedSize, selectedColor });

    setTimeout(() => {
      setIsAdding(false);
    }, 500); // Animation duration in milliseconds
  };

  const handleToggleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up to the Link
    onToggleWishlist(product);
  };

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-product transition-all duration-300 hover:-translate-y-1">
      {/* Wishlist Button - Moved outside the Link to prevent redirection */}
      <button
        className="absolute top-2 right-2 bg-white/80 hover:bg-white inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 p-0 z-20"
        onClick={handleToggleWishlistClick}
      >
        <Heart className={`h-4 w-4 transition-all duration-300 ${isInWishlist ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
      </button>
      
      {/* Wrap the product content with Link */}
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/400x400/F0F0F0/000000?text=No+Image`;
            }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isNew && (
              <Badge className="bg-success text-success-foreground">New</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">
                {discountPercentage}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-muted-foreground">
              {/* FIX: Access the length property of the reviews array */}
              ({product.reviews.length})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product.price)} {/* NEW: Use formatPrice */}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)} {/* NEW: Use formatPrice */}
              </span>
            )}
          </div>

          {/* Size Selection (if needed on card, otherwise remove) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <label className="text-sm font-medium mb-1 block">Size:</label>
              <div className="flex gap-1">
                {/* Only showing first size as per original code, consider mapping all if desired */}
                <button
                  key={product.sizes[0]}
                  className={`h-8 w-8 p-0 rounded-md text-sm font-medium ${selectedSize === product.sizes[0] ? 'bg-primary text-primary-foreground' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedSize(product.sizes[0]); }}
                >
                  {product.sizes[0]}
                </button>
              </div>
            </div>
          )}

          {/* Color Selection (if needed on card, otherwise remove) */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Color:</label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={(e) => { e.stopPropagation(); setSelectedColor(color); }}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-primary scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            className={`
              w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
              ring-offset-background transition-all duration-300 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              disabled:pointer-events-none disabled:opacity-50
              h-10 px-4 py-2
              ${isAdding ? 'transform scale-105' : ''}
            `}
            style={{
              backgroundColor: isAdding ? 'hsl(24 70% 60%)' : 'hsl(0 0% 9%)',
              color: 'hsl(0 0% 98%)',
              border: 'none'
            }}
            onClick={handleAddToCartClick}
            disabled={!product.inStock || isAdding}
          >
            <ShoppingCart
              className="h-4 w-4 mr-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              stroke="hsl(0 0% 98%)"
            />
            {product.inStock ? (isAdding ? "Adding..." : "Add to Cart") : "Out of Stock"}
          </button>
        </CardContent>
      </Link>
    </Card>
  );
};
