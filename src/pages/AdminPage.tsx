import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Package, Users, ShoppingCart, Settings, Truck, CheckCircle, Star, MessageSquare, Eye, EyeOff } from "lucide-react";
import { sampleProducts } from "@/data/products";
import { Product, Order } from "@/types/product";
import {ProductManager} from '@/components/ProductManager';
import { ImageUploader } from '@/components/ImageUploader'; // Import the ImageUploader component


const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ord1",
      userId: "user1",
      items: [],
      total: 89.99,
      status: "processing",
      shippingAddress: {
        name: "John Doe",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      paymentMethod: "Credit Card",
      trackingNumber: "TRK123456789",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "ord2",
      userId: "user2",
      items: [],
      total: 129.99,
      status: "shipped",
      shippingAddress: {
        name: "Jane Smith",
        address: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      paymentMethod: "PayPal",
      trackingNumber: "TRK987654321",
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }
  ]);
  const [customerReviews] = useState([
    {
      id: "rev1",
      customerName: "Alice Johnson",
      orderNumber: "ord1",
      rating: 5,
      comment: "Excellent quality and fast delivery!",
      productName: "Premium Cotton Shirt",
      date: new Date(),
      status: "delivered"
    },
    {
      id: "rev2",
      customerName: "Bob Wilson",
      orderNumber: "ord2",
      rating: 4,
      comment: "Good product, but delivery was slightly delayed.",
      productName: "Casual Jeans",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "delivered"
    }
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (loginEmail === "admin@duagarments.com" && loginPassword === "admin123") {
        setIsLoggedIn(true);
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard!",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials. Try admin@duagarments.com / admin123",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginEmail("");
    setLoginPassword("");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  // MODIFIED: handleUpdateOrderStatus to filter out delivered/cancelled orders
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    if (newStatus === 'delivered' || newStatus === 'cancelled') {
      // If status is delivered or cancelled, remove it from the active orders list
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      toast({
        title: "Order Status Updated",
        description: `Order ${orderId} status changed to ${newStatus} and removed from active orders.`,
      });
    } else {
      // Otherwise, just update the status
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      ));
      toast({
        title: "Order Status Updated",
        description: `Order ${orderId} status changed to ${newStatus}.`,
      });
    }
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'processing': return 'default';
      case 'shipped': return 'outline';
      case 'out-for-delivery': return 'destructive';
      case 'delivered': return 'default'; // Delivered orders will be removed, but define for completeness
      case 'cancelled': return 'destructive'; // Cancelled orders will be removed, but define for completeness
      default: return 'secondary';
    }
  };

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

  // Filter active orders for display and count
  const activeOrders = orders.filter(order => order.status !== 'delivered' && order.status !== 'cancelled');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter admin email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In as Admin"}
              </Button>
            </form>
            <div className="mt-4 text-center text-xs text-muted-foreground">
              Demo: admin@duagarments.com / admin123
            </div>
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => navigate("/")}>
                Back to Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dua Garments Admin</h1>
              <p className="text-muted-foreground">Manage your store</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                View Store
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{products.length}</p>
                  <p className="text-muted-foreground">Total Products</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  {/* UPDATED: Total Orders count to reflect active orders */}
                  <p className="text-2xl font-bold">{activeOrders.length}</p>
                  <p className="text-muted-foreground">Total Active Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">$2,847</p>
                  <p className="text-muted-foreground">Revenue Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders & Tracking</TabsTrigger>
            <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManager products={products} onProductUpdate={setProducts} />
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management & Tracking</CardTitle>
                <CardDescription>Manage active orders and update delivery status</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {/* CONDITIONAL RENDERING: Show message if no active orders */}
                    {activeOrders.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg font-semibold mb-2">No current active orders.</p>
                        <p>All orders have been delivered or cancelled.</p>
                      </div>
                    ) : (
                      activeOrders.map(order => ( // Use activeOrders for mapping
                        <div key={order.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-medium">Order #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                {order.shippingAddress.name} - ${order.total}
                              </p>
                              {order.trackingNumber && (
                                <p className="text-sm text-muted-foreground">
                                  Tracking: {order.trackingNumber}
                                </p>
                              )}
                              {order.estimatedDelivery && (
                                <p className="text-sm text-muted-foreground">
                                  Est. Delivery: {order.estimatedDelivery.toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                              disabled={order.status === 'processing'}
                            >
                              Processing
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                              disabled={order.status === 'shipped'}
                            >
                              <Truck className="h-4 w-4 mr-1" />
                              Shipped
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateOrderStatus(order.id, 'out-for-delivery')}
                              disabled={order.status === 'out-for-delivery'}
                            >
                              Out for Delivery
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                              disabled={order.status === 'delivered'}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Delivered
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>View and manage customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {customerReviews.map(review => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{review.customerName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Order #{review.orderNumber} - {review.productName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {review.date.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <Badge variant={review.status === 'delivered' ? 'default' : 'secondary'}>
                              {review.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage customer accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>Configure your store settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Data & Hosting Information</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p className="text-sm"><strong>Current Setup:</strong> Client-side React application</p>
                      <p className="text-sm"><strong>Data Storage:</strong> Local state (resets on page refresh)</p>
                      <p className="text-sm"><strong>Hosting:</strong> Static hosting (Lovable platform)</p>
                      <p className="text-sm"><strong>Backend:</strong> None (mock data and functions)</p>
                    </div>
                  </div>
                  {/* Image Uploader Section */}
                  <div>
                    <h3 className="font-semibold mb-2">Image Upload Tool</h3>
                    <ImageUploader /> {/* Integrated ImageUploader here */}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Recommended Upgrades</h3>
                    <div className="space-y-2">
                      <p className="text-sm">• <strong>Database:</strong> Supabase, Firebase, or PostgreSQL for persistent data</p>
                      <p className="text-sm">• <strong>Authentication:</strong> Supabase Auth or Auth0</p>
                      <p className="text-sm">• <strong>Payment Processing:</strong> Stripe or PayPal integration</p>
                      <p className="text-sm">• <strong>Image Storage:</strong> Cloudinary or AWS S3</p>
                      <p className="text-sm">• <strong>Email:</strong> SendGrid or Mailgun for notifications</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
