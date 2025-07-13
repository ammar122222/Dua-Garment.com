import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sampleProducts } from "@/data/products"; // Assuming your product data is here
import { Product, CartItem } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Minus, Plus, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined); // State for the currently displayed main image
  const [isSizeSelecting, setIsSizeSelecting] = useState(false); // State for size selection animation
  const [isColorSelecting, setIsColorSelecting] = useState(false); // State for color selection animation
  const [isAddingToCart, setIsAddingToCart] = useState(false); // NEW: State for add to cart animation


  useEffect(() => {
    const foundProduct = sampleProducts.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      // Set default selected size and color if available
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }
      // Set the initial main image: prefer 'images' array first, then 'image' property
      setMainImage(foundProduct.images?.[0] || foundProduct.image);

      console.log("Product loaded:", foundProduct);
      console.log("Main image set to:", foundProduct.images?.[0] || foundProduct.image);

    } else {
      toast({
        title: "Product Not Found",
        description: "The product you are looking for does not exist.",
        variant: "destructive",
      });
      navigate("/"); // Redirect to home page
    }
  }, [id, navigate, toast]);

  const handleAddToCart = () => {
    if (!product || isAddingToCart) return; // Prevent multiple clicks during animation

    // Check if sizes are required and not selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    // Check if colors are required and not selected
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Color Required",
        description: "Please select a color before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true); // Start add to cart animation

    // Simulate adding to cart with a delay
    setTimeout(() => {
      const itemToAdd: CartItem = {
        ...product, // Spread all properties from the product
        quantity: quantity,
        selectedSize: selectedSize || (product.sizes?.[0] || ''),
        selectedColor: selectedColor || (product.colors?.[0] || ''),
      } as CartItem; // Type assertion to satisfy TypeScript

      addToCart(itemToAdd);
      toast({
        title: "Added to Cart!",
        description: `${quantity} x ${product.name} added to your cart.`,
        variant: "default",
      });
      setIsAddingToCart(false); // End add to cart animation
    }, 300); // Animation duration for add to cart
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Handle size selection with animation
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setIsSizeSelecting(true);
    setTimeout(() => {
      setIsSizeSelecting(false);
    }, 200); // Animation duration
  };

  // Handle color selection with animation
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setIsColorSelecting(true);
    setTimeout(() => {
      setIsColorSelecting(false);
    }, 200); // Animation duration
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        &larr; Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image Gallery */}
        <div className="flex flex-col items-center">
          <img
            src={mainImage || "/placeholder.svg"} // Use mainImage state for the large display
            alt={product.name}
            className="w-full max-w-lg h-auto object-contain rounded-lg shadow-md"
            onError={(e) => {
              // Fallback for any truly broken image URL, even after initial processing
              e.currentTarget.src = `https://placehold.co/600x600/E0E0E0/000000?text=Image+Error`;
            }}
          />
          {/* Dynamic thumbnails from product.images array */}
          {product.images && product.images.length > 0 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
              {product.images.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-md border cursor-pointer transition-all duration-200 ease-in-out
                    ${mainImage === imgUrl ? "border-primary-foreground scale-105 shadow-md" : "border-input hover:border-primary"}`}
                  onClick={() => setMainImage(imgUrl)} // Set mainImage on thumbnail click
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/80x80/E0E0E0/000000?text=Thumb+Error`;
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-foreground">{product.name}</h1>
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.isNew && <Badge className="bg-blue-500 text-white">New Arrival</Badge>}
            {product.isFeatured && <Badge variant="outline">Featured</Badge>}
          </div>

          {/* Rating */}
          {product.rating !== undefined && (
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-muted-foreground">({product.reviews} Reviews)</span>
            </div>
          )}

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <Separator />

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base">Select Size:</Label>
              <RadioGroup
                value={selectedSize}
                onValueChange={handleSizeSelect} // Use new handler
                className="flex flex-wrap gap-2"
              >
                {product.sizes.map((size) => (
                  <div key={size}>
                    <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className={`
                        flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium
                        cursor-pointer transition-all duration-200 ease-in-out
                        ${selectedSize === size
                          ? `bg-primary text-primary-foreground border-primary ${isSizeSelecting ? 'scale-105' : ''}` // Apply animation class
                          : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        }
                      `}
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Color Selection (basic example, could be color swatches) */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base">Select Color:</Label>
              <RadioGroup
                value={selectedColor}
                onValueChange={handleColorSelect} // Use new handler
                className="flex flex-wrap gap-2"
              >
                {product.colors.map((color) => (
                  <div key={color}>
                    <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                    <Label
                      htmlFor={`color-${color}`}
                      className={`
                        flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium
                        cursor-pointer transition-all duration-200 ease-in-out
                        ${selectedColor === color
                          ? `bg-primary text-primary-foreground border-primary ${isColorSelecting ? 'scale-105' : ''}` // Apply animation class
                          : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        }
                      `}
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="quantity" className="text-base">Quantity:</Label>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center"
              min="1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className={`w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-transform duration-300 ease-out
              ${isAddingToCart ? 'scale-105' : ''}`} // Apply animation class
            onClick={handleAddToCart}
            disabled={
              (product.sizes && product.sizes.length > 0 && !selectedSize) ||
              (product.colors && product.colors.length > 0 && !selectedColor) ||
              isAddingToCart // Disable button during animation
            }
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isAddingToCart ? "Adding..." : "Add to Cart"} {/* Change text during animation */}
          </Button>

          {/* Stock Information */}
          <p className="text-sm text-muted-foreground">
            {product.inStock && product.stockQuantity > 0
              ? `In Stock (${product.stockQuantity} available)`
              : "Out of Stock"}
          </p>
        </div>
      </div>
    </div>
  );
};
