import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/types/product";
import { ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  onProductAdded: (product: Product) => void;
}

const AddProductForm: React.FC<Props> = ({ onProductAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<"men" | "women" | "kids">("men");
  const [subcategory, setSubcategory] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const commonSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const commonColors = [
    { name: "Red", value: "#ef4444" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
    { name: "Gray", value: "#6b7280" },
    { name: "Yellow", value: "#eab308" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
  ];

  const handleUploadComplete = (urls: string[]) => {
    setImages(urls);
  };

  const addSize = (size: string) => {
    if (size && !sizes.includes(size)) {
      setSizes([...sizes, size]);
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter(s => s !== size));
  };

  const addColor = (color: string) => {
    if (color && !colors.includes(color)) {
      setColors([...colors, color]);
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSizeInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (sizeInput.trim()) {
        addSize(sizeInput.trim().toUpperCase());
        setSizeInput("");
      }
    }
  };

  const handleColorInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (colorInput.trim()) {
        addColor(colorInput.trim());
        setColorInput("");
      }
    }
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput.trim());
        setTagInput("");
      }
    }
  };

  const getColorValue = (colorName: string) => {
    const commonColor = commonColors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
    return commonColor ? commonColor.value : "#6b7280";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (images.length === 0) {
        alert("Please upload at least one image.");
        return;
      }
      if (!name || !description || !price || !category || !stockQuantity || !tags.length) {
        alert("Please fill all required fields.");
        return;
      }
      
      // Limit stock quantity to a reasonable value
      const safeStock = Math.min(Number(stockQuantity), 10000);
      const now = Timestamp.now();
      
      // Do not send id on creation
      const newProduct = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        image: images[0],
        mainImageUrl: images[0],
        images: images.filter(Boolean),
        category,
        subcategory: subcategory || "",
        sizes: sizes,
        colors: colors,
        inStock: safeStock > 0,
        stockQuantity: safeStock,
        totalStocks: safeStock,
        tags: tags,
        rating: 0,
        reviews: [],
        isNew,
        isFeatured,
        createdAt: now,
        updatedAt: now,
      };
      
      // Log the product data before sending
      console.log("Submitting product to Firestore:", JSON.stringify(newProduct, null, 2));
      const docRef = await addDoc(collection(db, "products"), newProduct);
      
      // Add id after creation
      onProductAdded({ ...newProduct, id: docRef.id });
      
      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategory("men");
      setSubcategory("");
      setSizes([]);
      setColors([]);
      setStockQuantity(0);
      setTags([]);
      setImages([]);
      setIsNew(false);
      setIsFeatured(false);
      setSizeInput("");
      setColorInput("");
      setTagInput("");
      alert("Product added successfully!");
    } catch (error: any) {
      console.error("Error adding product:", error);
      if (error?.message) {
        alert("Failed to add product: " + error.message);
      } else {
        alert("Failed to add product. Check the console for details.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (PKR) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent h-24 resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "men" | "women" | "kids")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
          <input
            type="text"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            placeholder="e.g., Shirts, Pants, Dresses"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
        <input
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(Number(e.target.value))}
          placeholder="Enter stock quantity"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          min="0"
          max="10000"
        />
      </div>

      {/* Sizes Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Sizes</label>
        <div className="space-y-3">
          {/* Common sizes */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {commonSizes.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={sizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => sizes.includes(size) ? removeSize(size) : addSize(size)}
                  className={sizes.includes(size) ? "bg-black text-white" : ""}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Custom size input */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Add custom size:</p>
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyPress={handleSizeInputKeyPress}
              placeholder="Type size and press Enter or comma"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          
          {/* Selected sizes */}
          {sizes.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Selected sizes:</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <Badge key={size} variant="secondary" className="flex items-center gap-1">
                    {size}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeSize(size)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Colors Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Colors</label>
        <div className="space-y-3">
          {/* Common colors */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {commonColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => colors.includes(color.name) ? removeColor(color.name) : addColor(color.name)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    colors.includes(color.name) ? 'border-black' : 'border-gray-300'
                  } ${color.name === 'White' ? 'border-gray-400' : ''}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          {/* Custom color input */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Add custom color:</p>
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyPress={handleColorInputKeyPress}
              placeholder="Type color name and press Enter or comma"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          
          {/* Selected colors */}
          {colors.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Selected colors:</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Badge key={color} variant="secondary" className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: getColorValue(color) }}
                    />
                    {color}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeColor(color)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Tags *</label>
        <div className="space-y-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagInputKeyPress}
            placeholder="Type tag and press Enter or comma (e.g., new arrival, featured, sale)"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
          />
          
          {tags.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
          />
          <span className="text-sm font-medium text-gray-700">New Arrival</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
          />
          <span className="text-sm font-medium text-gray-700">Featured Product</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Product Images *</label>
        <ImageUploader onUploadComplete={handleUploadComplete} />
      </div>

      <Button
        type="submit"
        className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
      >
        Add Product
      </Button>
    </form>
  );
};

export default AddProductForm;
