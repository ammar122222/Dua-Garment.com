
import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Package, Heart, Settings } from "lucide-react";

const AccountPage = () => {
  const [user] = useState({
    name: "John Doe",
    email: "admin@duagarments.com",
    joinDate: "January 2024"
  });

  const [orders] = useState([
    {
      id: "ORD-001",
      date: "2024-01-15",
      total: 89.99,
      status: "delivered",
      items: [
        { name: "Men's Cotton Shirt", size: "M", color: "Blue", quantity: 1 }
      ]
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      total: 149.99,
      status: "shipped",
      items: [
        { name: "Women's Floral Dress", size: "S", color: "Pink", quantity: 1 }
      ]
    }
  ]);

  const [wishlist] = useState([
    {
      id: "1",
      name: "Men's Formal Suit",
      price: 299.99,
      image: "/api/placeholder/200/200"
    },
    {
      id: "2", 
      name: "Women's Casual Top",
      price: 45.99,
      image: "/api/placeholder/200/200"
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={0}
        onCartClick={() => {}}
        onSearchChange={() => {}}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your account and view your orders</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your personal details and account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-lg">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Member Since</label>
                      <p className="text-lg">{user.joinDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Account Status</label>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                  <Separator />
                  <Button>Edit Profile</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and track your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">Order #{order.id}</p>
                              <p className="text-sm text-muted-foreground">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${order.total}</p>
                              <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                {item.name} - Size: {item.size}, Color: {item.color} (x{item.quantity})
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>My Wishlist</CardTitle>
                  <CardDescription>Items you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg mb-2"
                          />
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-primary font-bold">${item.price}</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm">Add to Cart</Button>
                            <Button size="sm" variant="outline">Remove</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive updates about your orders</p>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Privacy Settings</h3>
                        <p className="text-sm text-muted-foreground">Control your data and privacy</p>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Password</h3>
                        <p className="text-sm text-muted-foreground">Change your password</p>
                      </div>
                      <Button variant="outline">Change</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountPage;
