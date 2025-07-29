import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// A type for items in the shopping cart. Assumes 'id' is the unique product ID.
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // Add other properties like selectedSize, selectedColor, image, etc.
  [key: string]: any;
}

// A type for items as they will be stored in an order.
interface OrderItem {
  productId: string; // This is the crucial field.
  name: string;
  price: number;
  quantity: number;
  [key: string]: any;
}

/**
 * Creates an order in Firestore, ensuring each item includes the product ID.
 * This is the primary fix for the review submission issue.
 */
export const createOrderInFirestore = async (cartItems: CartItem[], userId: string) => {
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cannot create an order with an empty cart.");
  }

  // **THE FIX**: Map cart items to order items, explicitly saving the product ID.
  const itemsForOrder: OrderItem[] = cartItems.map(({ id, ...rest }) => ({
    productId: id, // Here we save the unique ID as 'productId'.
    ...rest,
  }));

  await addDoc(collection(db, "orders"), {
    userId,
    items: itemsForOrder,
    status: "Processing",
    createdAt: serverTimestamp(),
  });
};