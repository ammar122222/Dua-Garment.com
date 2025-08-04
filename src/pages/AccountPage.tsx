import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, ShoppingBag, Heart, Star, Upload, Eye, EyeOff, Trash2, Save, X, Camera, Check, AlertCircle, Mail, Lock, UserCircle, ShoppingCart, Eye as ViewIcon } from 'lucide-react';
import { getDoc, doc, collection, query, where, getDocs, updateDoc, arrayRemove, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useCart } from '../contexts/CartContext';
import { Product } from '@/types/product';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ShoppingCart as ShoppingCartComponent } from "@/components/ShoppingCart";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
  hasBeenReviewed?: boolean;
}

interface Order {
  id: string;
  userId: string;
  status: string;
  createdAt: Date;
  items: OrderItem[];
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

const AccountPage = () => {
  const navigate = useNavigate();
  const { addToCart, cart, cartItemCount, updateQuantity, removeFromCart } = useCart();

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [wishlist, setWishlist] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [reviewingItem, setReviewingItem] = useState<OrderItem & { orderId: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [animate, setAnimate] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
      setNewDisplayName(currentUser?.displayName || "");
      setNewEmail(currentUser?.email || "");
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setOrders([]);
        setLoadingOrders(false);
        return;
      }

      setLoadingOrders(true);
      setError(null);

      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedOrders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          let createdAtDate: Date;
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            createdAtDate = data.createdAt.toDate();
          } else {
            createdAtDate = data.createdAt instanceof Date ? data.createdAt : new Date();
          }

          return {
            id: doc.id,
            ...data,
            createdAt: createdAtDate,
            items: data.items.map((item: any) => ({
              ...item,
              hasBeenReviewed: item.hasBeenReviewed || false
            }))
          } as Order;
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlist([]);
        setLoadingWishlist(false);
        return;
      }

      setLoadingWishlist(true);
      setError(null);

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const wishlistProductIds = userData.wishlist || [];

          if (wishlistProductIds.length > 0) {
            const q = query(
              collection(db, "products"),
              where("__name__", "in", wishlistProductIds)
            );
            const querySnapshot = await getDocs(q);

            const fetchedProducts = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setWishlist(fetchedProducts as ProductItem[]);
          } else {
            setWishlist([]);
          }
        }
      } catch (error) {
        console.error("Error fetching wishlist: ", error);
        setError("Failed to fetch wishlist. Please try again.");
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchWishlist();
  }, [user]);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingItem) return;

    const { productId, orderId } = reviewingItem;
    if (!productId || !orderId) {
      setError('Product ID or Order ID is missing. Cannot submit review.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
              ...order,
              items: order.items.map(item =>
                item.productId === productId
                  ? { ...item, hasBeenReviewed: true }
                  : item
              )
            }
            : order
        )
      );

      showSuccess('Thank you! Your review has been submitted.');
      setReviewingItem(null);
      setReviewText('');
      setRating(5);
      setReviewImage(null);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        wishlist: arrayRemove(productId)
      });

      setWishlist(prevWishlist =>
        prevWishlist.filter(item => item.id !== productId)
      );
      showSuccess("Item removed from wishlist.");
    } catch (error) {
      setError("Failed to remove item from wishlist.");
    }
  };

  const handleAddToCart = (item: ProductItem) => {
    if (!user) {
      setError("Please log in to add items to your cart.");
      return;
    }

    const productForCart: Product = {
      id: item.id,
      name: item.name,
      price: item.price,
      description: '',
      images: [item.image],
      image: item.image,
      category: 'men',
      subcategory: '',
      sizes: [],
      colors: [],
      inStock: true,
      stockQuantity: 1,
      rating: 0,
      reviews: [],
      tags: [],
      totalStocks: 0,
      mainImageUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addToCart(productForCart, 1);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };


  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(prev => ({ ...prev, displayName: newDisplayName, email: newEmail }));
      showSuccess("Profile updated successfully!");
    } catch (error: any) {
      setError(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess("Password updated successfully!");
      setNewPassword("");
      setConfirmNewPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      setError(`Failed to change password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon, count }: { id: string; label: string; icon: any; count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        activeTab === id
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-xs px-2 py-1 rounded-full ${
          activeTab === id ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            <ShoppingCartComponent
              items={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onCheckout={handleCheckout}
            />
          </div>
        </SheetContent>
      </Sheet>

      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <Check size={20} />
            {successMessage}
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
            <button onClick={() => setError(null)} className="ml-2 hover:bg-red-600 rounded p-1">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {loadingUser || loadingOrders ? (
          <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">Loading...</h2>
            </div>
          </div>
        ) : !user ? (
          <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
              <UserCircle size={64} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Required</h2>
              <p className="text-gray-600">Please log in to view your account and order history.</p>
            </div>
          </div>
        ) : (
          <>
            <div className={`bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-700 ${
              animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">
                    Welcome back, {user.displayName || 'User'}!
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail size={16} />
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className={`bg-white rounded-2xl shadow-xl p-6 mb-8 transform transition-all duration-700 delay-100 ${
              animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="flex flex-wrap gap-4">
                <TabButton id="orders" label="My Orders" icon={ShoppingBag} count={orders.length} />
                <TabButton id="wishlist" label="Wishlist" icon={Heart} count={wishlist.length} />
                <TabButton id="settings" label="Account Settings" icon={Settings} />
              </div>
            </div>

            <div className={`transform transition-all duration-700 delay-200 ${
              animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                      <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
                      <p className="text-gray-600">Start shopping to see your orders here!</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                              <p className="text-gray-600">{order.createdAt.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 space-y-4">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded-lg object-cover shadow-md"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                <p className="text-sm text-gray-600">
                                  Size: {item.selectedSize} • Color: {item.selectedColor} • Qty: {item.quantity}
                                </p>
                                <p className="font-bold text-blue-600">Rs. {item.price.toLocaleString()}</p>
                              </div>
                              <button
                                onClick={() => setReviewingItem({ ...item, orderId: order.id })}
                                disabled={item.hasBeenReviewed || order.status !== 'Delivered'}
                                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                                  item.hasBeenReviewed
                                    ? 'bg-green-100 text-green-600 cursor-not-allowed'
                                    : order.status === 'Delivered'
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                {item.hasBeenReviewed ? (
                                  <span className="flex items-center gap-2">
                                    <Check size={16} />
                                    Reviewed
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <Star size={16} />
                                    Review
                                  </span>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  {loadingWishlist ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Wishlist...</h3>
                    </div>
                  ) : (
                    wishlist.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h3>
                        <p className="text-gray-600">Save items you love to your wishlist!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((item) => (
                          <div key={item.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <button
                                onClick={() => handleRemoveFromWishlist(item.id)}
                                className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-red-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-800 mb-2">{item.name}</h4>
                              <p className="text-lg font-bold text-blue-600">Rs. {item.price.toLocaleString()}</p>
                              <div className="flex gap-2 mt-4">
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                                >
                                  <ShoppingCart size={16} />
                                  Add to Cart
                                </button>
                                <button
                                  onClick={() => handleViewProduct(item.id)}
                                  className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
                                >
                                  <ViewIcon size={16} />
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <UserCircle size={24} />
                      Profile Information
                    </h3>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                          <input
                            type="text"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your display name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password (required for email change)</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save size={20} />
                        )}
                        Update Profile
                      </button>
                    </form>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Lock size={24} />
                      Change Password
                    </h3>
                    <form onSubmit={handleChangePassword} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmNewPassword}
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Lock size={20} />
                        )}
                        Change Password
                      </button>
                    </form>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500">
                    <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-3">
                      <Trash2 size={24} />
                      Danger Zone
                    </h3>
                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                      <p className="text-red-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
                        <Trash2 size={20} />
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {reviewingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={reviewingItem.image}
                    alt={reviewingItem.name}
                    className="w-16 h-16 rounded-lg object-cover shadow-md"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Write a Review</h3>
                    <p className="text-gray-600">{reviewingItem.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setReviewingItem(null)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit}>
                {/* ... existing form content for reviews */}
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AccountPage;