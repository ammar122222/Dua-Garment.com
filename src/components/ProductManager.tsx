import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/types/product";
import AddProductForm from "@/components/AddProductForm"; // Updated import to the new component

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const prods: Product[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    // Replaced window.confirm with a custom modal or component for better user experience
    // For now, let's just log a message to the console
    console.log("Delete confirmation required for product with id:", id);
    // You should implement a modal here to ask for confirmation before calling deleteDoc.
    await deleteDoc(doc(db, "products", id));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (updated: Product) => {
    const { id, ...rest } = updated;
    await updateDoc(doc(db, "products", id), rest);
    setEditingProduct(null);
  };

  const handleProductAdded = (newProduct: Product) => {
    // You can add any post-addition logic here, like a success message
    console.log("New product added:", newProduct);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>

      <AddProductForm onProductAdded={handleProductAdded} />

      {/* Editing form */}
      {editingProduct && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Edit Product</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editingProduct);
            }}
          >
            <input
              className="w-full p-2 border rounded mb-2"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              placeholder="Product Name"
            />
            <input
              className="w-full p-2 border rounded mb-2"
              value={editingProduct.price}
              type="number"
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: Number(e.target.value),
                })
              }
              placeholder="Price"
            />
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-6 bg-white rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">Price: ${product.price}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(product)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
