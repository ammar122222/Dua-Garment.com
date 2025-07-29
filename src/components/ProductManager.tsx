import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/types/product";
import AddProductForm from "@/components/AddProductForm";

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const prods: Product[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (updated: Product) => {
    const { id, ...rest } = updated;
    await updateDoc(doc(db, "products", id), rest);
    setEditingProduct(null);
  };

  const handleProductAdded = (product: Product) => {
    setShowAddForm(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Manager</h1>
      <button
        className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        onClick={() => setShowAddForm((v) => !v)}
      >
        {showAddForm ? "Close Add Product" : "Add Product"}
      </button>
      {showAddForm && <AddProductForm onProductAdded={handleProductAdded} />}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Tags</th>
              <th className="p-2 border">Colors</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border">{product.tags?.join(", ")}</td>
                <td className="p-2 border">{product.colors?.join(", ")}</td>
                <td className="p-2 border">Rs. {product.price}</td>
                <td className="p-2 border">
                  <button
                    className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingProduct && (
        <EditProductInlineForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

// Inline edit form for editing a product
const EditProductInlineForm: React.FC<{
  product: Product;
  onCancel: () => void;
  onSave: (product: Product) => void;
}> = ({ product, onCancel, onSave }) => {
  const [form, setForm] = useState<Product>({ ...product });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded shadow w-full max-w-lg"
        onSubmit={e => {
          e.preventDefault();
          onSave(form);
        }}
      >
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <input
          className="w-full p-2 border rounded mb-2"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Product Name"
        />
        <input
          className="w-full p-2 border rounded mb-2"
          value={form.price}
          type="number"
          onChange={e => setForm({ ...form, price: Number(e.target.value) })}
          placeholder="Price"
        />
        <input
          className="w-full p-2 border rounded mb-2"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value as any })}
          placeholder="Category"
        />
        <input
          className="w-full p-2 border rounded mb-2"
          value={form.tags?.join(", ")}
          onChange={e => setForm({ ...form, tags: e.target.value.split(",") })}
          placeholder="Tags (comma separated)"
        />
        <input
          className="w-full p-2 border rounded mb-2"
          value={form.colors?.join(", ")}
          onChange={e => setForm({ ...form, colors: e.target.value.split(",") })}
          placeholder="Colors (comma separated)"
        />
        <div className="flex gap-2 mt-4">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ProductManager;
