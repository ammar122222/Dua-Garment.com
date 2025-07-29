import React, { useState, useEffect } from 'react';
import ReviewForm from '../components/ReviewForm';
import ProductReviews from '../components/ProductReviews';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Your Firebase config

const ProductPage = () => {
  const productId = 'prod-123'; // You can replace this with useParams later
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        setProduct({ id: productSnap.id, ...productSnap.data() });
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleReviewSubmitted = () => {
    alert('Review submitted! Refreshing...');
    fetchProduct(); // Refresh the product (and its reviews)
  };

  if (isLoading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="product-page" style={{ padding: '2rem' }}>
      <h1>{product.name}</h1>
      <img src={product.imageUrl || product.mainImageUrl} alt={product.name} style={{ maxWidth: '400px' }} />
      <p><strong>Price: Rs. {product.price}</strong></p>
      <p>{product.description}</p>

      <hr style={{ margin: '2rem 0' }} />
      <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
      <hr style={{ margin: '2rem 0' }} />
      <ProductReviews reviews={product.reviews || []} />
    </div>
  );
};

export default ProductPage;
