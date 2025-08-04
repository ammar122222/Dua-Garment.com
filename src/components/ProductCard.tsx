import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: {
    id: string;
    author: string;
    comment: string;
    rating: number;
  }[];
  inStock: boolean;
  stockQuantity?: number;
  isNew?: boolean;
  isRecommended?: boolean;
  selectedSize?: string;
  selectedColor?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { formatPrice } = useCart();

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock || isAdding) return;
    setIsAdding(true);
    onAddToCart(product, 1, selectedSize, selectedColor);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleToggleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <TooltipProvider>
      <Card className="group relative overflow-hidden rounded-3xl border border-muted bg-white dark:bg-neutral-900 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/60 dark:bg-black/30 backdrop-blur-md shadow hover:scale-110 transition-transform"
          onClick={handleToggleWishlistClick}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isInWishlist ? "fill-red-500 text-red-500 scale-110" : "text-muted"
            }`}
          />
        </button>

        {/* Image & Badges */}
        <Link to={`/product/${product.id}`} className="block h-full">
          <div className="relative overflow-hidden rounded-t-3xl group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-105"
              onError={(e) =>
                (e.currentTarget.src = "https://placehold.co/400x400?text=No+Image")
              }
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
              style={{
                background: `radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 40%)`,
              }}
            />
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md shadow-md font-semibold z-10">
              {formatPrice(product.price)}
            </div>
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
              {product.isNew && (
                <Badge className="bg-green-600/90 text-white backdrop-blur">New</Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="bg-red-600/90 text-white backdrop-blur">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {product.isRecommended && (
                <Badge className="bg-purple-600/90 text-white backdrop-blur-sm">
                  AI Favorite
                </Badge>
              )}
              {!product.inStock && <Badge variant="secondary">Out of Stock</Badge>}
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-5 space-y-4 text-white dark:text-white">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-white/70 line-clamp-2">{product.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-white/70">({product.reviews.length})</span>
            </div>

            {product.inStock && product.stockQuantity && product.stockQuantity <= 10 && (
              <div>
                <div className="flex justify-between text-xs font-medium text-white/60 mb-1">
                  <span>Only {product.stockQuantity} left!</span>
                  <span>{Math.max(0, Math.round((product.stockQuantity / 100) * 100))}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="h-2 bg-red-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (product.stockQuantity / 100) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/70">Size:</span>
                <div className="flex gap-2">
                  {product.sizes.slice(0, 3).map((size) => (
                    <button
                      key={size}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size);
                      }}
                      className={`px-2 py-1 rounded-md text-xs font-semibold border transition-all ${
                        selectedSize === size
                          ? "bg-white text-black border-white"
                          : "border-white text-white hover:bg-white/10"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/70">Color:</span>
                <div className="flex gap-2">
                  {product.colors.slice(0, 4).map((color) => (
                    <Tooltip key={color}>
                      <TooltipTrigger asChild>
                        <button
                          title={color}
                          style={{ backgroundColor: color.toLowerCase() }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColor(color);
                          }}
                          className={`w-6 h-6 rounded-full border-2 transition-transform duration-300 ${
                            selectedColor === color
                              ? "border-white scale-110"
                              : "border-white/40"
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{color}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 text-white text-sm font-semibold transition-all duration-300 ${
                  isAdding
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 scale-[1.03]"
                    : "bg-black hover:brightness-110"
                }`}
                disabled={!product.inStock || isAdding}
                onClick={handleAddToCartClick}
              >
                <ShoppingCart className="w-4 h-4" />
                {product.inStock ? (isAdding ? "Adding..." : "Add to Cart") : "Out of Stock"}
              </button>

              <button
                className="text-sm underline text-white/70 hover:text-white mt-2 sm:mt-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowModal(true);
                }}
              >
                Quick View
              </button>
            </div>
          </CardContent>
        </Link>

        {/* Quick View Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-2xl p-6 bg-white dark:bg-neutral-900 text-black dark:text-white">
            <DialogHeader>
              <DialogTitle>{product.name}</DialogTitle>
              <DialogDescription>{product.description}</DialogDescription>
            </DialogHeader>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <p className="text-lg font-semibold">{formatPrice(product.price)}</p>
            <p className="text-sm text-muted-foreground">Rating: {product.rating} / 5</p>
          </DialogContent>
        </Dialog>
      </Card>
    </TooltipProvider>
  );
};