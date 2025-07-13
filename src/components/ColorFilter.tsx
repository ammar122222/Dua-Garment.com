import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { sampleProducts } from '@/data/products'; // Import your sample products
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const ColorFilter = () => {
  const { selectedColorFilter, setSelectedColorFilter } = useCart();
  const [uniqueColors, setUniqueColors] = useState<string[]>([]);

  useEffect(() => {
    // Extract all unique colors from your sample products
    const colors = new Set<string>();
    sampleProducts.forEach(product => {
      product.colors.forEach(color => {
        colors.add(color);
      });
    });
    setUniqueColors(Array.from(colors));
  }, []);

  const handleColorClick = (color: string) => {
    // Toggle the filter: if the same color is clicked, clear the filter
    if (selectedColorFilter === color) {
      setSelectedColorFilter(null);
    } else {
      setSelectedColorFilter(color);
    }
  };

  const handleClearFilter = () => {
    setSelectedColorFilter(null);
  };

  // Helper to get a consistent background color for swatches (handles common names)
  const getColorStyle = (colorName: string) => {
    const lowerCaseColor = colorName.toLowerCase();
    switch (lowerCaseColor) {
      case 'white': return { backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0' };
      case 'black': return { backgroundColor: '#000000' };
      case 'blue': return { backgroundColor: '#3B82F6' }; // Tailwind blue-500
      case 'red': return { backgroundColor: '#EF4444' }; // Tailwind red-500
      case 'green': return { backgroundColor: '#22C55E' }; // Tailwind green-500
      case 'yellow': return { backgroundColor: '#F59E0B' }; // Tailwind yellow-500
      case 'pink': return { backgroundColor: '#EC4899' }; // Tailwind pink-500
      case 'navy': return { backgroundColor: '#1E3A8A' }; // Tailwind blue-800
      case 'gray': return { backgroundColor: '#6B7280' }; // Tailwind gray-500
      case 'grey': return { backgroundColor: '#6B7280' }; // Tailwind gray-500
      case 'cream': return { backgroundColor: '#FDF3E7' };
      case 'light blue': return { backgroundColor: '#BFDBFE' }; // Tailwind blue-200
      case 'charcoal': return { backgroundColor: '#343A40' };
      case 'khaki': return { backgroundColor: '#C3B091' };
      case 'ivory': return { backgroundColor: '#FFFFF0' };
      case 'rose': return { backgroundColor: '#F08080' };
      case 'purple': return { backgroundColor: '#A855F7' }; // Tailwind purple-500
      case 'brown': return { backgroundColor: '#8B4513' };
      default: return { backgroundColor: lowerCaseColor }; // Fallback for unknown colors
    }
  };


  return (
    <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Filter by Color</h3>
        {selectedColorFilter && (
          <Button variant="ghost" size="sm" onClick={handleClearFilter} className="text-muted-foreground hover:text-foreground">
            Clear <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {uniqueColors.map(color => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            className={`
              w-8 h-8 rounded-full border-2 transition-all duration-200 ease-in-out
              flex items-center justify-center text-xs font-medium
              ${selectedColorFilter === color
                ? 'ring-2 ring-offset-2 ring-primary scale-110' // Highlight selected color
                : 'border-gray-300 hover:scale-105'
              }
            `}
            style={getColorStyle(color)}
            title={color}
          >
            {/* Optionally display initial for very light colors or if no color swatch is visible */}
            {color.toLowerCase() === 'white' && selectedColorFilter !== 'white' && <span className="text-black">W</span>}
            {color.toLowerCase() === 'ivory' && selectedColorFilter !== 'ivory' && <span className="text-black">I</span>}
          </button>
        ))}
      </div>
    </div>
  );
};
