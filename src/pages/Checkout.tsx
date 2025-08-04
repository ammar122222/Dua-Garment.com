import React, { useState, useMemo, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useCart } from '@/contexts/CartContext';

const CheckoutPage = () => {
  const { cart, formatPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [currentUser, setCurrentUser] = useState(null);

  const COD_CHARGE = 50;
  const SHIPPING_FEE = 100;
  const FREE_SHIPPING_THRESHOLD = 5000;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );
  
  const shipping = useMemo(
    () => subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE,
    [subtotal]
  );

  const total = useMemo(() => {
    return subtotal + shipping + COD_CHARGE;
  }, [subtotal, shipping]);

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!currentUser) {
      alert("Please log in to place an order.");
      return;
    }

    try {
      const orderData = {
        userId: currentUser.uid,
        items: cart.map(item => ({
          productId: item.id, // Corrected to use item.id
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize || null,
          selectedColor: item.selectedColor || null,
          image: item.image || null,
        })),
        paymentMethod: "cod",
        subtotal,
        shipping,
        total,
        status: "pending",
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "orders"), orderData);
      alert(`Order placed successfully with Cash on Delivery! Your total is ${formatPrice(total)}.`);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order. Please try again.");
    }
  };

  return (
    <div className="checkout-page" style={{ padding: '2rem' }}>
      <h2>Checkout</h2>
      <form onSubmit={handlePlaceOrder}>
        <div className="order-summary" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h3>Order Summary</h3>
          <p>Subtotal: {formatPrice(subtotal)}</p>
          <p>Shipping: {formatPrice(shipping)}</p>
          <p>Cash on Delivery Fee: {formatPrice(COD_CHARGE)}</p>
          <hr />
          <p><strong>Total: {formatPrice(total)}</strong></p>
        </div>

        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          <div>
            <label><input type="radio" name="payment" value="cod" checked readOnly /> Cash on Delivery (+ {formatPrice(COD_CHARGE)})</label>
          </div>
        </div>
        <button type="submit" style={{ marginTop: '1rem', padding: '10px 20px', cursor: 'pointer' }}>Place Order</button>
      </form>
    </div>
  );
};

export default CheckoutPage;