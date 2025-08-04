import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types/product';

export const CheckoutOrderSummary = () => {
  const { cart, formatPrice } = useCart();

  // Corrected constants based on the user's request
  const COD_FEE = 50;
  const SHIPPING_FEE = 100;
  const FREE_SHIPPING_THRESHOLD = 5000;

  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);

  // Corrected shipping calculation
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  
  // Corrected total calculation including the COD fee
  const total = subtotal + shipping + COD_FEE;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cart.map((item: CartItem) => (
            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={item.image || 
                       (item as any).mainImageUrl || 
                       (Array.isArray((item as any).images) && (item as any).images[0]) || 
                       'https://placehold.co/400x400/F0F0F0/000000?text=No+Image'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md border"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = 'https://placehold.co/400x400/F0F0F0/000000?text=No+Image';
                  }}
                />
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.selectedSize || 'N/A'} / {item.selectedColor || 'N/A'}
                </p>
              </div>
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <p>{formatPrice(subtotal)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Shipping</p>
            <p>{shipping === 0 ? 'Free' : formatPrice(shipping)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Cash on Delivery</p>
            <p>{formatPrice(COD_FEE)}</p>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <p>Total</p>
            <p>{formatPrice(total)}</p>
          </div>
        </div>
        <Button className="w-full mt-6 bg-black text-white hover:bg-gray-800">Place Order</Button>
      </CardContent>
    </Card>
  );
};