import React, { useState, useMemo, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const COD_CHARGE = 50;

const CheckoutPage = () => {
  const { cartItems } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState('easypesa'); // Default payment method
  const [currentUser, setCurrentUser] = useState(null);

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

  // Calculate subtotal from all items in the cart
  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  // Calculate the final total, adding COD charge if necessary
  const total = useMemo(() => {
    return paymentMethod === 'cod' ? subtotal + COD_CHARGE : subtotal;
  }, [subtotal, paymentMethod]);

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    if (cartItems.length === 0) {
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
        items: cartItems.map(item => ({
          productId: item.productId || item.id, // Ensure productId is included, fallback to item.id
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize || null,
          selectedColor: item.selectedColor || null,
          image: item.image || null,
        })),
        paymentMethod,
        subtotal,
        total,
        status: "pending",
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "orders"), orderData);
      alert(`Order placed successfully with ${paymentMethod}! Your total is Rs. ${total.toFixed(2)}.`);
      // clearCart(); // Assuming you have a clearCart function in CartContext
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order. Please try again.");
    }
  };

  return (
    <div className="checkout-page" style={{ padding: '2rem' }}>
      <h2>Checkout</h2>
      <form onSubmit={handlePlaceOrder}>
        {/* You should add input fields for customer's name, address, and phone number here */}

        <div className="order-summary" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h3>Order Summary</h3>
          <p>Subtotal: Rs. {subtotal.toFixed(2)}</p>
          {paymentMethod === 'cod' && (
            <p>Cash on Delivery Fee: Rs. {COD_CHARGE.toFixed(2)}</p>
          )}
          <hr />
          <p><strong>Total: Rs. {total.toFixed(2)}</strong></p>
        </div>

        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          <div>
            <label><input type="radio" name="payment" value="easypesa" checked={paymentMethod === 'easypesa'} onChange={(e) => setPaymentMethod(e.target.value)} /> EasyPesa</label>
          </div>
          <div>
            <label><input type="radio" name="payment" value="jazzcash" checked={paymentMethod === 'jazzcash'} onChange={(e) => setPaymentMethod(e.target.value)} /> JazzCash</label>
          </div>
          <div>
            <label><input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} /> Cash on Delivery (+ Rs. 50.00)</label>
          </div>
        </div>
        <button type="submit" style={{ marginTop: '1rem', padding: '10px 20px', cursor: 'pointer' }}>Place Order</button>
      </form>
    </div>
  );
};

export default CheckoutPage;