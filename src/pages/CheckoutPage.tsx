import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Lock, Truck } from "lucide-react";
import { db, auth } from "@/firebase";
import { collection, addDoc, Timestamp, doc, updateDoc } from "firebase/firestore";
import { useCart } from "@/contexts/CartContext";
import confetti from 'canvas-confetti';

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cart, clearCart, formatPrice } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = 0; // Tax removed as per request
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in before placing an order.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create order data that exactly matches the Order interface in product.ts
      const orderData = {
        userId: currentUser.uid,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items: cart.map(item => ({
          ...item,
          // Ensure each item has the required CartItem properties
          quantity: item.quantity || 1,
          selectedSize: item.selectedSize || 'Default',
          selectedColor: item.selectedColor || 'Default',
        })),
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        status: "pending" as const, // Type assertion to match the union type
        paymentMethod: "Card",
        trackingNumber: "",
        // Optional fields from the Order interface
        discountCode: "",
        discountAmount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Save order to Firestore
      const orderRef = await addDoc(collection(db, "orders"), orderData);
      
      // Get the order ID from Firestore
      const savedOrderId = orderRef.id;
      
      // Update the order with the ID field
      await updateDoc(orderRef, { id: savedOrderId });
      
      // Add confetti effect for successful order
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Update toast message with order ID
      toast({
        title: "✅ Order Placed Successfully!",
        description: `Order #${savedOrderId.slice(0, 8)} has been placed. You'll receive a confirmation email shortly.`,
      });

      // Clear the cart
      clearCart();
      
      // Navigate to the account page with orders tab selected
      navigate("/account?tab=orders");
    } catch (error) {
      console.error("❌ Order failed:", error);
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItems={cart.length}
        onCartClick={() => {}}
        onSearchChange={() => {}}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-8">Complete your order</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Billing Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>Enter your billing details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={formData.firstName} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={formData.lastName} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={formData.address} onChange={handleChange} required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={formData.city} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value={formData.state} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input id="zipCode" value={formData.zipCode} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" value={formData.country} onChange={handleChange} required />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" value={formData.cardNumber} onChange={handleChange} required />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" value={formData.cvv} onChange={handleChange} required />
                      </div>
                    </div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" value={formData.cardName} onChange={handleChange} required />
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Processing..." : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Place Order - {formatPrice(total)}
                    </div>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                        <div className="flex justify-between">
                          <span className="text-xs">Qty: {item.quantity}</span>
                          <span className="font-semibold">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span><span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping on orders over PKR 5000</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
              