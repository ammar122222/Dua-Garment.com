import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// Ensure Loader2 is imported for the spinner animation
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { CartItem } from "@/types/product";
import { useCart } from '@/contexts/CartContext'; // NEW: Import useCart

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number, selectedSize?: string, selectedColor?: string) => void; // Updated signature
  onRemoveItem: (id: string, selectedSize?: string, selectedColor?: string) => void; // Updated signature
  onCheckout: () => void;
}

export const ShoppingCart = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: ShoppingCartProps) => {
  const [discountCode, setDiscountCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { formatPrice } = useCart(); // NEW: Get formatPrice from context

  const handleProceedToCheckout = () => {
    setIsLoading(true);

    setTimeout(() => {
      onCheckout();
    }, 1500);
  };

  // Ensure unique identification for cart items when calculating totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-4">Add some items to get started</p>
        <Button>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        <Badge variant="secondary">{items.length} items</Badge>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          // Use a combined key for unique items including size and color
          <Card key={`${item.id}-${item.selectedSize || 'nosize'}-${item.selectedColor || 'nocolor'}`}>
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Size: {item.selectedSize || 'N/A'} | Color: {item.selectedColor || 'N/A'}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="font-semibold">{formatPrice(item.price)}</span> {/* NEW: Use formatPrice */}
                    {item.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(item.originalPrice)} {/* NEW: Use formatPrice */}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id, item.selectedSize, item.selectedColor)} // Pass size/color
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)} // Pass size/color
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)} // Pass size/color
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span> {/* NEW: Use formatPrice */}
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span> {/* NEW: Use formatPrice */}
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span> {/* NEW: Use formatPrice */}
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatPrice(total)}</span> {/* NEW: Use formatPrice */}
          </div>

          {/* Discount Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Discount Code</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button variant="outline">Apply</Button>
            </div>
          </div>

          {/* Proceed to Checkout Button */}
          <Button
            className="w-full bg-black text-white hover:bg-gray-800"
            size="lg"
            onClick={handleProceedToCheckout}
            disabled={isLoading || items.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
