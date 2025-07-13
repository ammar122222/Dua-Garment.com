import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Product } from "@/types/product";

// Define ProductManagerProps interface at the top level
interface ProductManagerProps {
  products: Product[];
  onProductUpdate: (products: Product[]) => void;
}

// Define ProductFormProps interface at the top level
interface ProductFormProps {
  formData: Partial<Product>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product>>>;
}

// Define ProductForm component outside of ProductManager to prevent unnecessary re-renders
const ProductForm = ({ formData, setFormData }: ProductFormProps) => (
  <ScrollArea className="h-[600px] px-4">
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter product name"
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value: "men" | "women" | "kids") =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="kids">Kids</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Enter product description"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price || ""}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="originalPrice">Original Price</Label>
          <Input
            id="originalPrice"
            type="number"
            value={formData.originalPrice || ""}
            onChange={(e) => setFormData({...formData, originalPrice: parseFloat(e.target.value)})}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Input
            id="stockQuantity"
            type="number"
            value={formData.stockQuantity || ""}
            onChange={(e) => setFormData({...formData, stockQuantity: parseInt(e.target.value)})}
            placeholder="10"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">Main Image URL</Label>
        <Input
          id="image"
          value={formData.image || ""}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          placeholder="Enter main image URL"
        />
      </div>

      {/* NEW: Additional Image URLs field */}
      <div>
        <Label htmlFor="images">Additional Image URLs (comma-separated)</Label>
        <Input
          id="images"
          value={formData.images?.join(", ") || ""}
          onChange={(e) => setFormData({...formData, images: e.target.value.split(", ").map(s => s.trim()).filter(s => s !== '')})}
          placeholder="URL1, URL2, URL3"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Input
            id="subcategory"
            value={formData.subcategory || ""}
            onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
            placeholder="e.g., shirts, pants, dresses"
          />
        </div>
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating || ""}
            onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
            placeholder="4.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="sizes">Sizes (comma-separated)</Label>
        <Input
          id="sizes"
          value={formData.sizes?.join(", ") || ""}
          onChange={(e) => setFormData({...formData, sizes: e.target.value.split(", ").map(s => s.trim()).filter(s => s !== '')})}
          placeholder="S, M, L, XL"
        />
      </div>

      <div>
        <Label htmlFor="colors">Colors (comma-separated)</Label>
        <Input
          id="colors"
          value={formData.colors?.join(", ") || ""}
          onChange={(e) => setFormData({...formData, colors: e.target.value.split(", ").map(c => c.trim()).filter(c => c !== '')})}
          placeholder="Black, White, Blue"
        />
      </div>

      <div className="flex space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.inStock ?? true}
            onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
          />
          <span>In Stock</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isNew ?? false}
            onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
          />
          <span>New Arrival</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isFeatured ?? false}
            onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
          />
          <span>Featured</span>
        </label>
      </div>
    </div>
  </ScrollArea>
);

export const ProductManager = ({ products, onProductUpdate }: ProductManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      image: "",
      images: [], // Initialize images as an empty array
      category: "men",
      subcategory: "",
      sizes: [], // Initialize sizes as empty array
      colors: [], // Initialize colors as empty array
      inStock: true,
      stockQuantity: 10,
      rating: 4.5,
      reviews: 0,
      isNew: false,
      isFeatured: false
    });
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.description || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name!,
      description: formData.description!,
      price: formData.price!,
      originalPrice: formData.originalPrice,
      image: formData.image || "https://placehold.co/400x400/F0F0F0/000000?text=No+Image", // Default placeholder
      images: formData.images || [], // Ensure images is an array
      category: formData.category as 'men' | 'women' | 'kids' || 'men',
      subcategory: formData.subcategory || "clothing",
      sizes: formData.sizes || [], // Ensure sizes is an array
      colors: formData.colors || [], // Ensure colors is an array
      inStock: formData.inStock ?? true,
      stockQuantity: formData.stockQuantity || 10,
      rating: formData.rating || 4.5,
      reviews: formData.reviews || 0,
      isNew: formData.isNew || false,
      isFeatured: formData.isFeatured || false
    };

    onProductUpdate([...products, newProduct]);
    resetForm();
    setIsAddDialogOpen(false);

    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to inventory.`,
    });
  };

  const handleEditProduct = () => {
    if (!editingProduct || !formData.name || !formData.description || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.name!,
      description: formData.description!,
      price: formData.price!,
      originalPrice: formData.originalPrice,
      image: formData.image || editingProduct.image,
      images: formData.images || [], // Ensure images is an array
      category: formData.category as 'men' | 'women' | 'kids' || editingProduct.category,
      subcategory: formData.subcategory || editingProduct.subcategory,
      sizes: formData.sizes || editingProduct.sizes,
      colors: formData.colors || editingProduct.colors,
      inStock: formData.inStock ?? editingProduct.inStock,
      stockQuantity: formData.stockQuantity || editingProduct.stockQuantity,
      rating: formData.rating || editingProduct.rating,
      reviews: formData.reviews || editingProduct.reviews,
      isNew: formData.isNew ?? editingProduct.isNew,
      isFeatured: formData.isFeatured ?? editingProduct.isFeatured
    };

    onProductUpdate(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    resetForm();

    toast({
      title: "Product Updated",
      description: `${updatedProduct.name} has been updated.`,
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    onProductUpdate(products.filter(p => p.id !== productId));

    toast({
      title: "Product Deleted",
      description: `${product?.name} has been removed from inventory.`,
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      images: product.images, // Populate images for editing
      category: product.category,
      subcategory: product.subcategory,
      sizes: product.sizes,
      colors: product.colors,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      rating: product.rating,
      reviews: product.reviews,
      isNew: product.isNew,
      isFeatured: product.isFeatured
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Add, edit, and manage your product inventory</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" style={{ backgroundColor: 'hsl(0 0% 100%)' }}>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Fill in the product details below</DialogDescription>
              </DialogHeader>
              {/* Pass formData and setFormData as props */}
              <ProductForm formData={formData} setFormData={setFormData} />
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>
                  <Save className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category} - {product.subcategory}</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stockQuantity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    {product.isNew && <Badge variant="secondary">New</Badge>}
                    {product.isFeatured && <Badge variant="outline">Featured</Badge>}
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <p className="font-medium">${product.price}</p>
                  <div className="flex space-x-2">
                    <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => !open && setEditingProduct(null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl" style={{ backgroundColor: 'hsl(0 0% 100%)' }}>
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                          <DialogDescription>Update the product details below</DialogDescription>
                        </DialogHeader>
                        {/* Pass formData and setFormData as props */}
                        <ProductForm formData={formData} setFormData={setFormData} />
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setEditingProduct(null)}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleEditProduct}>
                            <Save className="h-4 w-4 mr-2" />
                            Update Product
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
