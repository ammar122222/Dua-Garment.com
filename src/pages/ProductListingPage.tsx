import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const ProductListingPage = () => { // Changed to a named export
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsCollection = collection(db, 'products');
        const querySnapshot = await getDocs(productsCollection);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ProductItem[];
        setProducts(fetchedProducts);
      } catch (err: any) {
        console.error("Error fetching products: ", err);
        setError(`Failed to fetch products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600">Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900">Men</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <Link to={`/product/${product.id}`}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-64 object-cover"
              />
            </Link>
            <div className="p-5">
              <Link to={`/product/${product.id}`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
              </Link>
              <p className="text-2xl font-bold text-blue-600">Rs. {product.price.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                  <Heart size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};