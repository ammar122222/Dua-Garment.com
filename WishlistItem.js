import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const WishlistItem = ({ item }) => {
  const { addToCart } = useContext(CartContext);
  const { removeFromWishlist } = useContext(WishlistContext);

  const handleAddToCart = () => {
    addToCart(item);
    // A good user experience is to remove the item from the wishlist after adding it to the cart.
    removeFromWishlist(item.id);
    alert(`"${item.name}" has been added to your cart.`);
  };

  const handleDelete = () => {
    removeFromWishlist(item.id);
    alert(`"${item.name}" has been removed from your wishlist.`);
  };

  return (
    <div className="wishlist-item" style={{ border: '1px solid #ddd', padding: '1rem', margin: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', marginRight: '1rem' }} />
      <div>
        <h4>{item.name}</h4>
        <p>Price: Rs. {item.price}</p>
      </div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
    </div>
  );
};

export default WishlistItem;