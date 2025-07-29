import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Minus, Plus, Star, CheckCircle, User2, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import confetti from "canvas-confetti"; // 🎉

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
  }, [id]);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!userInfo?.uid || !id) return;
      
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

    // ✅ Fixed: correct usage of addToCart
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
      distribution[review.rating as keyof typeof distribution]++;
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
    <div className="relative px-6 py-8 max-w-6xl mx-auto">
      {/* ✅ Floating Success Toast */}
      {showSuccess && (
        <div className="fixed top-5 right-5 z-50 flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn glow">
          <CheckCircle className="mr-2" />
          Added to Cart!
        </div>
      )}

      {/* 🧭 Floating Navigation Buttons */}
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
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-10 animate-fadeIn">
            {/* 🖼️ Product Images */}
            <div>
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-auto rounded shadow-md transition hover:shadow-xl"
              />
              <div className="flex gap-2 mt-4">
                {product.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                      img === mainImage
                        ? "border-primary ring-2 ring-primary"
                        : "border-gray-300 hover:opacity-75"
                    } transition`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            </div>

            {/* 📋 Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <Badge>{product.category}</Badge>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(Math.round(Number(calculateAverageRating(product.reviews || []))))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {calculateAverageRating(product.reviews || [])} ({product.reviews?.length || 0} reviews)
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{product.description}</p>

              <p className="text-3xl font-bold text-green-600 mb-6">
                PKR {product.price.toLocaleString()}
              </p>

              <Separator className="my-4" />

              {/* 🟦 Size Picker */}
              {product.sizes?.length > 0 && (
                <div className="mb-6">
                  <Label className="mb-3 block font-medium">Select Size:</Label>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                        className={selectedSize === size ? "bg-black text-white" : ""}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* 🟥 Color Picker */}
              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <Label className="mb-3 block font-medium">Select Color:</Label>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                        className={selectedColor === color ? "bg-black text-white" : ""}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* 🔢 Quantity Picker */}
              <div className="flex items-center gap-3 mb-6">
                <Label className="block font-medium">Quantity:</Label>
                <div className="flex items-center border rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* 🛒 Action Buttons */}
              <div className="flex gap-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button
                  onClick={toggleWishlist}
                  variant="outline"
                  className={`p-3 ${isInWishlist ? 'text-red-500 border-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Stock Status */}
              <div className="text-sm text-gray-600">
                {product.inStock ? (
                  <span className="text-green-600">✅ In Stock ({product.stockQuantity} available)</span>
                ) : (
                  <span className="text-red-600">❌ Out of Stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-yellow-500 mb-2">
                          {calculateAverageRating(product.reviews)}
                        </div>
                        <div className="flex justify-center mb-2">
                          {renderStars(Math.round(Number(calculateAverageRating(product.reviews))), 20)}
                        </div>
                        <p className="text-gray-600">Based on {product.reviews.length} reviews</p>
                      </div>
                      
                      <div className="space-y-2">
                        {Object.entries(getRatingDistribution(product.reviews))
                          .reverse()
                          .map(([rating, count]) => (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-sm w-8">{rating}★</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{
                                    width: `${product.reviews?.length ? (count / product.reviews.length) * 100 : 0}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{review.userName}</span>
                                <div className="flex">
                                  {renderStars(review.rating, 14)}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{formatDate(review.createdAt)}</p>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg text-gray-600 mb-2">No reviews yet</p>
                    <p className="text-sm text-gray-500">Be the first to review this product!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading product details...</p>
      )}

      {/* 💅 Custom Animations */}
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
  );
};
