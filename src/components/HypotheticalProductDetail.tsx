import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Assuming this path is correct
import { useCart } from '@/contexts/CartContext'; // Assuming you have a CartContext
import { Product } from '@/types/product'; // Corrected: Import from the single source of truth
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

/**
 * THIS IS AN EXAMPLE of the correct way to fetch a product and add it to the cart.
 * You must find the equivalent code in your project and apply this logic.
 * The key is ensuring the product object passed to `addToCart` contains the `id`.
 */

interface ProductDetailProps {
  productId: string;
}

export const HypotheticalProductDetail = ({ productId }: ProductDetailProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        // THIS IS THE CRITICAL FIX:
        // Combine the document data with its ID into a single, valid object.
        const productData: Product = {
          ...(productSnap.data() as Omit<Product, 'id'>),
          id: productSnap.id,
        };
        setProduct(productData);
      } else {
        console.error("No such product found with ID:", productId);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      // Because we correctly added the `id` when fetching, `product` is valid.
      // On a real product page, you would get quantity, size, and color from user selections.
      const quantity = 1;
      const selectedSize = product.sizes?.[0] || 'Default';
      const selectedColor = product.colors?.[0] || 'Default';

      addToCart(product, quantity, selectedSize, selectedColor);
      toast({ title: "Success", description: `${product.name} has been added to your cart.` });
    }
  };

  if (!product) return <div>Loading product...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <Button onClick={handleAddToCart}>Add to Cart</Button>
    </div>
  );
};