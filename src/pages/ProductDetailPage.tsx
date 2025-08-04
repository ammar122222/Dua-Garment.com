import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Minus,
  Plus,
  Star,
  CheckCircle,
  User2,
  Heart,
  ChevronLeft,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import confetti from "canvas-confetti";
import { Product } from "@/types/product"; // Assuming Product type is defined here
import { Header } from "@/components/Header"; // 🆕 Import the Header component

interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();

  const [product, setProduct] = useState<Product>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const foundProduct = docSnap.data() as Product;
          setProduct(foundProduct);
          setSelectedSize(foundProduct.sizes?.[0]);
          setSelectedColor(foundProduct.colors?.[0]);
          setMainImage(foundProduct.images?.[0] || foundProduct.image);
        } else {
          toast({ title: "Product Not Found", variant: "destructive" });
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!userInfo?.uid || !id) {
        setIsInWishlist(false);
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, "users", userInfo.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const wishlist = userData.wishlist || [];
          setIsInWishlist(wishlist.includes(id));
        }
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    checkWishlist();
  }, [userInfo?.uid, id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      toast({ title: "Please select size and color", variant: "destructive" });
      return;
    }
    
    // Correct usage of addToCart
    addToCart(product, quantity, selectedSize, selectedColor);

    toast({
      title: "🎉 Product Added!",
      description: `${product.name} has been added to your cart.`,
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const toggleWishlist = async () => {
    if (!userInfo?.uid || !id) {
      toast({ title: "Please login to add to wishlist", variant: "destructive" });
      return;
    }

    try {
      const userRef = doc(db, "users", userInfo.uid);
      
      if (isInWishlist) {
        await updateDoc(userRef, {
          wishlist: arrayRemove(id)
        });
        setIsInWishlist(false);
        toast({ title: "Removed from wishlist" });
      } else {
        await updateDoc(userRef, {
          wishlist: arrayUnion(id)
        });
        setIsInWishlist(true);
        toast({ title: "Added to wishlist" });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({ title: "Failed to update wishlist", variant: "destructive" });
    }
  };

  const calculateAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = (reviews: Review[]) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });
    return distribution;
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={`${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Header cartItems={0} onCartClick={function (): void {
        throw new Error("Function not implemented.");
      } } onSearchChange={function (query: string): void {
        throw new Error("Function not implemented.");
      } } /> {/* 🆕 Add the Header component here */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="absolute top-8 left-4 sm:left-6 lg:left-8 z-20 flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ChevronLeft size={16} />
          Back
        </Button>

        {/* Floating Success Toast */}
        {showSuccess && (
          <div className="fixed top-5 right-5 z-50 flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn glow">
            <CheckCircle className="mr-2" />
            Added to Cart!
          </div>
        )}

        {/* Floating Navigation Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4 z-40">
          <Button
            className="rounded-full p-3 bg-gradient-to-br from-indigo-500 to-violet-700 text-white shadow-xl hover:scale-110 transition"
            onClick={() => navigate("/account")}
          >
            <User2 />
          </Button>
          <Button
            className="rounded-full p-3 bg-gradient-to-br from-green-500 to-teal-700 text-white shadow-xl hover:scale-110 transition"
            onClick={() => navigate("/checkout")}
          >
            <ShoppingCart />
          </Button>
        </div>

        {/* Product Details */}
        {product ? (
          <div className="space-y-12 pt-16">
            <div className="grid md:grid-cols-2 gap-12 animate-fadeIn">
              {/* Product Images */}
              <div>
                <div className="overflow-hidden rounded-xl shadow-2xl">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-auto transform transition-all duration-500 hover:scale-105"
                  />
                </div>
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                  {product.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumb ${idx}`}
                      className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 ${
                        img === mainImage
                          ? "border-black ring-2 ring-offset-2 ring-black"
                          : "border-gray-200 hover:border-gray-400"
                      } transition-all duration-300`}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge className="bg-gray-100 text-gray-800 border border-gray-200">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(Math.round(Number(calculateAverageRating(product.reviews || []))))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {calculateAverageRating(product.reviews || [])} ({product.reviews?.length || 0} reviews)
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight">{product.name}</h1>
                <p className="text-xl font-bold text-green-600">
                  PKR {product.price.toLocaleString()}
                </p>

                <p className="text-gray-600 leading-relaxed max-w-lg">{product.description}</p>

                <Separator className="my-6" />

                {/* Size Picker */}
                {product.sizes?.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700">Select Size:</Label>
                    <div className="flex gap-3 flex-wrap">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSize(size)}
                          className={`
                            rounded-full font-semibold transition-all duration-200
                            ${selectedSize === size ? "bg-black text-white hover:bg-gray-800" : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"}
                          `}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Picker */}
                {product.colors?.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700">Select Color:</Label>
                    <div className="flex gap-3 flex-wrap">
                      {product.colors.map((color) => (
                        <Button
                          key={color}
                          variant={selectedColor === color ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedColor(color)}
                          className={`
                            rounded-full font-semibold transition-all duration-200
                            ${selectedColor === color ? "bg-black text-white hover:bg-gray-800" : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"}
                          `}
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Picker */}
                <div className="flex items-center gap-6 mt-6">
                  <Label className="text-base font-semibold text-gray-700">Quantity:</Label>
                  <div className="flex items-center border border-gray-300 rounded-full overflow-hidden transition-shadow focus-within:ring-2 focus-within:ring-black">
                    <Button 
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 text-gray-600 hover:bg-gray-100"
                    >
                      <Minus size={18} />
                    </Button>
                    <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                    <Button 
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 text-gray-600 hover:bg-gray-100"
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-black text-white text-lg font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:bg-gray-800"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                  </Button>
                  <Button
                    onClick={toggleWishlist}
                    variant="outline"
                    className={`h-12 w-12 rounded-full border-2 transition-colors duration-300 ${
                      isInWishlist ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-gray-300 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                
                {/* Stock Status */}
                <div className="text-sm mt-4">
                  {product.inStock ? (
                    <span className="flex items-center gap-2 text-green-600 font-semibold">
                      <CheckCircle size={16} /> In Stock ({product.stockQuantity} available)
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
              <Card className="rounded-xl shadow-xl border-none">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-8">
                      {/* Rating Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-gray-50 rounded-lg">
                        <div className="text-center md:text-left">
                          <div className="text-5xl font-bold text-yellow-500 mb-2">
                            {calculateAverageRating(product.reviews)}
                          </div>
                          <div className="flex justify-center md:justify-start mb-2">
                            {renderStars(Math.round(Number(calculateAverageRating(product.reviews))), 24)}
                          </div>
                          <p className="text-gray-600 text-sm">Based on {product.reviews.length} reviews</p>
                        </div>
                        
                        <div className="md:col-span-2 space-y-2">
                          {Object.entries(getRatingDistribution(product.reviews))
                            .reverse()
                            .map(([rating, count]) => (
                              <div key={rating} className="flex items-center gap-3">
                                <span className="text-base font-medium w-8">{rating}★</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${product.reviews?.length ? (count / product.reviews.length) * 100 : 0}%`
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Individual Reviews */}
                      <div className="space-y-6">
                        {product.reviews.map((review, index) => (
                          <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-4">
                                <User2 className="h-10 w-10 text-gray-500 bg-gray-100 p-2 rounded-full" />
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-lg">{review.userName}</span>
                                    <div className="flex">
                                      {renderStars(review.rating, 16)}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-800 leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Star className="h-16 w-16 mx-auto text-gray-300 mb-6" />
                      <p className="text-xl text-gray-600 mb-2 font-semibold">No reviews yet</p>
                      <p className="text-base text-gray-500">Be the first to review this product!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 py-20">Loading product details...</p>
        )}

        {/* Custom Animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out;
          }
          .glow {
            box-shadow: 0 0 20px rgba(72, 187, 120, 0.8);
          }
        `}</style>
      </div>
    </div>
  );
};