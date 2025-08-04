import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/types/product";

/**
 * NOTE: This file demonstrates the CORRECT way to fetch data from Firestore.
 * The key is to always capture the document ID and add it to your object.
 * The persistent "missing Product ID" error is caused by other parts of the
 * application NOT following this pattern.
 */

/**
 * Fetches all products from the 'products' collection in Firestore.
 * @returns A promise that resolves to an array of Product objects.
 */
export const getProducts = async (): Promise<Product[]> => {
  const productsCol = collection(db, "products");
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map(doc => {
    // This is the correct pattern: combine document data with its ID.
    return { ...doc.data(), id: doc.id } as Product;
  });
  return productList;
};

/**
 * Fetches a single product by its ID from Firestore.
 * @param productId - The unique ID of the product to fetch.
 * @returns A promise that resolves to a Product object, or null if not found.
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  if (!productId) {
    console.error("getProductById called with no productId");
    return null;
  }
  const productRef = doc(db, "products", productId);
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    // This is the correct pattern: combine document data with its ID.
    return { ...productSnap.data(), id: productSnap.id } as Product;
  } else {
    console.warn(`Product with ID "${productId}" not found.`);
    return null;
  }
};