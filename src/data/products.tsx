import { Product } from "@/types/product";
import productMensShirt from "@/assets/product-mens-shirt.jpg";
import productWomensDress from "@/assets/product-womens-dress.jpg";
import productKidsTshirt from "@/assets/product-kids-tshirt.jpg";

export const sampleProducts: Product[] = [
  // Men's Collection
  {
    id: "m1",
    name: "Premium Cotton Shirt",
    description: "Classic white cotton shirt with modern fit. Perfect for both office and casual wear.",
    price: 59.99,
    originalPrice: 79.99,
    image: productMensShirt,
    images: ["/api/placeholder/600/600?text=Mens+Shirt+Front", "/api/placeholder/600/600?text=Mens+Shirt+Back"], // Added placeholder images
    category: "men",
    subcategory: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Black", "Gray"],
    inStock: true,
    stockQuantity: 50,
    rating: 4.5,
    reviews: 128,
    isNew: true,
    isFeatured: true,
    tags: ["cotton", "formal", "classic"]
  },
  {
    id: "m2",
    name: "Denim Jeans",
    description: "Comfortable slim-fit denim jeans made from premium cotton blend.",
    price: 89.99,
    originalPrice: 119.99,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/600/600?text=Denim+Jeans+Front", "/api/placeholder/600/600?text=Denim+Jeans+Back"], // Added placeholder images
    category: "men",
    subcategory: "pants",
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Blue", "Black", "Gray"],
    inStock: true,
    stockQuantity: 30,
    rating: 4.3,
    reviews: 89,
    tags: ["denim", "casual", "slim-fit"]
  },
  {
    id: "m3",
    name: "Formal Suit",
    description: "Elegant two-piece formal suit perfect for business meetings and special occasions.",
    price: 299.99,
    originalPrice: 399.99,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/600/600?text=Formal+Suit+Front", "/api/placeholder/600/600?text=Formal+Suit+Detail"], // Added placeholder images
    category: "men",
    subcategory: "suits",
    sizes: ["38", "40", "42", "44", "46"],
    colors: ["Navy", "Black", "Charcoal"],
    inStock: true,
    stockQuantity: 15,
    rating: 4.8,
    reviews: 45,
    isFeatured: true,
    tags: ["formal", "business", "elegant"]
  },
  {
    id: "m4",
    name: "Shalwar Kameez",
    description: "Traditional Pakistani shalwar kameez with modern cut and premium fabric.",
    price: 79.99,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/600/600?text=Shalwar+Kameez+Front", "/api/placeholder/600/600?text=Shalwar+Kameez+Detail"], // Added placeholder images
    category: "men",
    subcategory: "traditional",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Cream", "Light Blue", "Gray"],
    inStock: true,
    stockQuantity: 25,
    rating: 4.6,
    reviews: 67,
    tags: ["traditional", "Pakistani", "cultural"]
  },

  // Women's Collection
  {
    id: "w1",
    name: "Floral Summer Dress",
    description: "Beautiful floral print dress perfect for summer occasions and casual outings.",
    price: 69.99,
    originalPrice: 89.99,
    image: productWomensDress,
    images: ["/api/placeholder/600/600?text=Floral+Dress+Front", "/api/placeholder/600/600?text=Floral+Dress+Side"], // Added placeholder images
    category: "women",
    subcategory: "dresses",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Blue", "Yellow", "Green"],
    inStock: true,
    stockQuantity: 40,
    rating: 4.4,
    reviews: 156,
    isNew: true,
    isFeatured: true,
    tags: ["floral", "summer", "casual"]
  },
  {
    id: "w2",
    name: "Silk Blouse",
    description: "Elegant silk blouse with delicate embroidery. Perfect for formal and semi-formal occasions.",
    price: 99.99,
    originalPrice: 129.99,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/600/600?text=Silk+Blouse+Front", "/api/placeholder/600/600?text=Silk+Blouse+Detail"], // Added placeholder images
    category: "women",
    subcategory: "tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Rose", "Navy", "Black"],
    inStock: true,
    stockQuantity: 20,
    rating: 4.7,
    reviews: 92,
    tags: ["silk", "elegant", "embroidery"]
  },
  {
    id: "w3",
    name: "Wide Leg Pants",
    description: "Comfortable wide-leg pants made from breathable fabric. Great for both office and casual wear.",
    price: 54.99,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/600/600?text=Pants+Front", "/api/placeholder/600/600?text=Pants+Side"], // Added placeholder images
    category: "women",
    subcategory: "pants",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Beige", "Gray"],
    inStock: true,
    stockQuantity: 35,
    rating: 4.2,
    reviews: 74,
    tags: ["comfortable", "wide-leg", "versatile"]
  },
  {
    id: "w4",
    name: "Hijab Collection",
    description: "Premium quality hijab collection in various colors and materials.",
    price: 24.99,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/600/600?text=Hijab+Front", "/api/placeholder/600/600?text=Hijab+Colors"], // Added placeholder images
    category: "women",
    subcategory: "hijabs",
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Gray", "Beige", "Pink", "Blue"],
    inStock: true,
    stockQuantity: 100,
    rating: 4.6,
    reviews: 234,
    isFeatured: true,
    tags: ["hijab", "modest", "premium"]
  },
  {
    id: "w5",
    name: "Abaya",
    description: "Traditional abaya with modern cut and premium fabric. Available in various colors.",
    price: 119.99,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/600/600?text=Abaya+Front", "/api/placeholder/600/600?text=Abaya+Detail"], // Added placeholder images
    category: "women",
    subcategory: "abayas",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray", "Brown"],
    inStock: true,
    stockQuantity: 18,
    rating: 4.8,
    reviews: 87,
    tags: ["abaya", "traditional", "modest"]
  },

  // Kids' Collection
  {
    id: "k1",
    name: "Kids T-Shirt",
    description: "Comfortable cotton t-shirt for kids with fun prints and bright colors.",
    price: 19.99,
    originalPrice: 24.99,
    image: productKidsTshirt,
    images: ["/api/placeholder/600/600?text=Kids+T-Shirt+Front", "/api/placeholder/600/600?text=Kids+T-Shirt+Print"], // Added placeholder images
    category: "kids",
    subcategory: "t-shirts",
    sizes: ["2T", "3T", "4T", "5T", "6", "7", "8"],
    colors: ["Red", "Blue", "Yellow", "Green", "Pink"],
    inStock: true,
    stockQuantity: 60,
    rating: 4.3,
    reviews: 145,
    isNew: true,
    tags: ["kids", "cotton", "comfortable"]
  },
  {
    id: "k2",
    name: "School Uniform",
    description: "Complete school uniform set including shirt, pants, and tie.",
    price: 49.99,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/600/600?text=Uniform+Shirt", "/api/placeholder/600/600?text=Uniform+Pants"], // Added placeholder images
    category: "kids",
    subcategory: "uniforms",
    sizes: ["4", "5", "6", "7", "8", "9", "10"],
    colors: ["Navy", "White", "Gray"],
    inStock: true,
    stockQuantity: 45,
    rating: 4.5,
    reviews: 78,
    tags: ["school", "uniform", "complete-set"]
  },
  {
    id: "k3",
    name: "Kids Dress",
    description: "Beautiful dress for girls with cute patterns and comfortable fabric.",
    price: 34.99,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/600/600?text=Kids+Dress+Front", "/api/placeholder/600/600?text=Kids+Dress+Pattern"], // Added placeholder images
    category: "kids",
    subcategory: "dresses",
    sizes: ["2T", "3T", "4T", "5T", "6", "7", "8"],
    colors: ["Pink", "Purple", "Blue", "Yellow"],
    inStock: true,
    stockQuantity: 30,
    rating: 4.4,
    reviews: 56,
    isFeatured: true,
    tags: ["girls", "dress", "cute"]
  },
  {
    id: "k4",
    name: "Kids Pants",
    description: "Durable and comfortable pants for active kids. Perfect for school and play.",
    price: 29.99,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/600/600?text=Kids+Pants+Front", "/api/placeholder/600/600?text=Kids+Pants+Side"], // Added placeholder images
    category: "kids",
    subcategory: "pants",
    sizes: ["2T", "3T", "4T", "5T", "6", "7", "8"],
    colors: ["Blue", "Black", "Khaki", "Gray"],
    inStock: true,
    stockQuantity: 40,
    rating: 4.2,
    reviews: 89,
    tags: ["kids", "durable", "comfortable"]
  }
];
