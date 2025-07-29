# Detailed Implementation Plan for E-Commerce Website Bug Fixes

Based on my analysis of the codebase, I've created a detailed implementation plan for each of the identified issues. This plan will serve as a roadmap for fixing all the bugs and implementing the required features.

## 1. Fix Heart Icon (Add to Favorites) Functionality

### Current Issue
The heart icon currently redirects to the product detail page instead of adding the product to the user's wishlist.

### Implementation Plan

#### 1.1. Modify ProductCard.tsx
- The issue is in the `ProductCard.tsx` component where the heart icon is wrapped inside the Link component that redirects to the product detail page.
- We need to modify the `handleToggleWishlistClick` function to properly stop event propagation and prevent the redirect.
- The current implementation has:
  ```tsx
  <Link to={`/product/${product.id}`} className="block h-full">
    <!-- Heart icon button is inside this Link -->
  </Link>
  ```
- Solution: Move the heart icon button outside of the Link component or ensure event propagation is stopped.

#### 1.2. Update toggleWishlist Function
- The `toggleWishlist` function in `CartContext.tsx` only updates the local state and localStorage.
- We need to modify it to also update the user's Firebase profile data.
- This requires:
  - Getting the current user ID from AuthContext
  - Using Firebase's `arrayUnion` and `arrayRemove` to update the user's wishlist array in Firestore
- Example implementation:
  ```tsx
  const toggleWishlist = async (product: Product) => {
    if (!auth.currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    const userId = auth.currentUser.uid;
    const userRef = doc(db, "users", userId);

    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      
      // Update Firestore
      if (exists) {
        updateDoc(userRef, {
          wishlist: arrayRemove(product.id)
        }).catch(error => console.error("Error removing from wishlist:", error));
        
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} removed from your wishlist.`,
        });
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        updateDoc(userRef, {
          wishlist: arrayUnion(product.id)
        }).catch(error => console.error("Error adding to wishlist:", error));
        
        toast({
          title: "Added to Wishlist",
          description: `${product.name} added to your wishlist!`,
        });
        return [...prevWishlist, product];
      }
    });
  };
  ```

#### 1.3. Ensure Wishlist Items Display
- The `AccountPage.tsx` already has code to fetch and display wishlist items, but it may need adjustments to work with the updated wishlist storage.
- We need to ensure the wishlist tab in the account page correctly displays items from Firebase.
- Verify the fetch logic in the useEffect hook in AccountPage.tsx.

#### 1.4. Add Visual Feedback
- Enhance the heart icon toggle with animations for better user experience.
- Add toast notifications when adding/removing items from the wishlist.
- Example CSS for heart icon animation:
  ```css
  .heart-icon {
    transition: transform 0.3s ease, color 0.3s ease;
  }
  
  .heart-icon.active {
    transform: scale(1.2);
    color: #ff4d4d;
  }
  
  .heart-icon:hover {
    transform: scale(1.1);
  }
  ```

## 2. Fix Cart → Checkout → Order Not Saved Issue

### Current Issue
Users can add products to cart and checkout, but the orders don't appear in "My Orders" or "Order History."

### Implementation Plan

#### 2.1. Analyze CheckoutPage.tsx
- The `CheckoutPage.tsx` component is already saving orders to Firebase, but there might be issues with the data structure or the way orders are being saved.
- The current implementation uses:
  ```tsx
  await addDoc(collection(db, "orders"), orderData);
  ```
- Ensure this operation is successful and properly handles errors.

#### 2.2. Ensure Order Data Structure
- Compare the order data structure being saved with the `Order` interface in `product.ts`.
- Ensure all required fields are present and correctly formatted.
- The current order data structure in `CheckoutPage.tsx` is:
  ```tsx
  const orderData = {
    userId: currentUser.uid,
    userInfo: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
    },
    items: cart,
    paymentMethod: "Card",
    total: parseFloat(total.toFixed(2)),
    status: "pending",
    createdAt: Timestamp.now(),
  };
  ```
- The Order interface requires additional fields like shippingAddress, updatedAt, etc.
- Update the order data structure to match the interface.

#### 2.3. Fix Firebase Data Storage
- Ensure the orders collection in Firebase has the correct security rules.
- Verify that the order document is being created with the correct structure.
- Add proper error handling for the order creation process.
- Example security rule for orders:
  ```
  match /orders/{orderId} {
    allow read: if request.auth != null && (
      resource.data.userId == request.auth.uid || 
      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
    );
    allow create: if request.auth != null;
    allow update, delete: if request.auth != null && (
      resource.data.userId == request.auth.uid || 
      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
    );
  }
  ```

#### 2.4. Update AccountPage.tsx
- The `AccountPage.tsx` component already has code to fetch and display orders, but it may need adjustments.
- Ensure the query is correctly filtering orders by the current user's ID:
  ```tsx
  const q = query(collection(db, "orders"), where("userId", "==", userInfo.uid));
  ```
- Verify that the order data is being correctly parsed and displayed.

## 3. Implement Customer Account Settings Functionality

### Current Issue
Several buttons in the account settings section don't work: Change Password, Update Email, Notification Preferences, Delete Account.

### Implementation Plan

#### 3.1. Implement Change Password
- Use Firebase Auth's `updatePassword` method to change the user's password.
- Create a modal dialog with password input fields (current password, new password, confirm new password).
- Add validation for password strength and matching.
- Example implementation:
  ```tsx
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, newPassword);
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Password Update Failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };
  ```

#### 3.2. Implement Update Email
- Use Firebase Auth's `updateEmail` method to change the user's email.
- Create a modal dialog with email input fields (current email, new email, password for verification).
- Add validation for email format.
- Example implementation:
  ```tsx
  const updateEmail = async (newEmail: string, password: string) => {
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update email
      await updateEmail(auth.currentUser, newEmail);
      
      // Update email in Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        email: newEmail
      });
      
      toast({
        title: "Email Updated",
        description: "Your email has been successfully updated.",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: "Email Update Failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };
  ```

#### 3.3. Implement Notification Preferences
- Create a new collection in Firestore to store user preferences.
- Implement a form with toggle switches for different notification types.
- Save preferences to the user's document in Firestore.
- Example implementation:
  ```tsx
  const updateNotificationPreferences = async (preferences: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  }) => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        notificationPreferences: preferences
      });
      
      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been updated.",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };
  ```

#### 3.4. Implement Delete Account
- Use Firebase Auth's `deleteUser` method to delete the user's account.
- Create a confirmation dialog with password verification.
- Clean up user data from Firestore when an account is deleted.
- Example implementation:
  ```tsx
  const deleteAccount = async (password: string) => {
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Delete user data from Firestore
      await deleteDoc(doc(db, "users", auth.currentUser.uid));
      
      // Delete user account
      await deleteUser(auth.currentUser);
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };
  ```

#### 3.5. Add Error Handling
- Implement proper error handling for all account operations.
- Add success and error toast notifications.
- Handle edge cases like re-authentication requirements.

## 4. Add Order Reviews After Delivery Feature

### Current Issue
There's no option to review products after receiving them.

### Implementation Plan

#### 4.1. Enhance Order Interface
- Update the `Order` interface in `product.ts` to include a `reviewed` field.
- This field will track whether the user has already reviewed the order.
- Example update:
  ```tsx
  export interface Order {
    // existing fields
    reviewed?: boolean;
  }
  ```

#### 4.2. Update AccountPage.tsx
- Modify the orders section in `AccountPage.tsx` to show a "Review" button for delivered orders that haven't been reviewed yet.
- The current implementation already has some code for this:
  ```tsx
  {order.status === "delivered" && !order.reviewed && (
    <Button 
      size="sm"
      onClick={() => setReviewOrder(order)}
      className="bg-yellow-600 text-white hover:bg-yellow-700"
    >
      <Star className="h-4 w-4 mr-1" />
      Review
    </Button>
  )}
  ```
- Ensure this code is working correctly and the review button appears at the right time.

#### 4.3. Create Review Form
- Enhance the existing review dialog in `AccountPage.tsx`.
- Add fields for rating, text review, and optionally image upload.
- Implement validation for the review form.
- Example implementation:
  ```tsx
  const ReviewForm = ({ order, onSubmit, onCancel }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [image, setImage] = useState(null);
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ rating, comment, image });
    };
    
    return (
      <form onSubmit={handleSubmit}>
        {/* Rating stars */}
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
        
        {/* Comment textarea */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full p-3 border rounded-lg h-32 resize-none mb-4"
          required
        />
        
        {/* Image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4"
        />
        
        {/* Submit button */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Submit Review
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };
  ```

#### 4.4. Implement Firebase Storage
- Store reviews in the products collection in Firestore.
- Update the product document with the new review.
- Mark the order as reviewed in the orders collection.
- Example implementation:
  ```tsx
  const submitReview = async (orderId, productId, review) => {
    try {
      // Upload image if provided
      let imageUrl = null;
      if (review.image) {
        const storageRef = ref(storage, `reviews/${auth.currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, review.image);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      // Create review object
      const reviewData = {
        userId: auth.currentUser.uid,
        userName: userInfo.name || auth.currentUser.email,
        rating: review.rating,
        comment: review.comment,
        imageUrl,
        createdAt: Timestamp.now()
      };
      
      // Add review to product
      await updateDoc(doc(db, "products", productId), {
        reviews: arrayUnion(reviewData)
      });
      
      // Mark order as reviewed
      await updateDoc(doc(db, "orders", orderId), {
        reviewed: true
      });
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      
      return true;
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };
  ```

#### 4.5. Display Reviews
- Update the product detail page to display reviews.
- Add a reviews section with user ratings, comments, and dates.
- Calculate and display average ratings.
- Example implementation:
  ```tsx
  const ProductReviews = ({ reviews }) => {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0;
    
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        
        {/* Average rating */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-lg font-medium">{averageRating.toFixed(1)} out of 5</span>
          <span className="text-gray-500">({reviews.length} reviews)</span>
        </div>
        
        {/* Review list */}
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="border-b pb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-medium">{review.userName}</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {review.createdAt.toDate().toLocaleDateString()}
              </p>
              <p className="text-gray-700">{review.comment}</p>
              {review.imageUrl && (
                <img
                  src={review.imageUrl}
                  alt="Review"
                  className="mt-2 max-w-xs rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  ```

## 5. Fix Admin Login Redirect Issue

### Current Issue
Logging in as Admin redirects to the customer "My Account" page instead of the Admin Dashboard.

### Implementation Plan

#### 5.1. Analyze AuthContext.jsx
- The issue is in the `login` function in `AuthContext.jsx`.
- After successful login, it's not redirecting based on the user's role.

#### 5.2. Fix Login Function
- Modify the `login` function to check the user's role and redirect accordingly.
- Update the return value to include the redirect path.
- The current implementation returns:
  ```jsx
  return { success: true, role: userRole };
  ```
- Updated implementation:
  ```jsx
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      setUser({ id: result.user.uid });

      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      }

      const userRole = result.user.email === "admin@duagarments.com" ? "admin" : "customer";
      setRole(userRole);
      
      // Return the appropriate redirect path based on role
      return { 
        success: true, 
        role: userRole,
        redirectTo: userRole === "admin" ? "/admin" : "/account"
      };
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      setUser(null);
      setUserInfo(null);
      setRole(null);
      return { success: false, error };
    }
  };
  ```

#### 5.3. Add Role-Based Routing
- Implement proper role-based routing in the application.
- Create a higher-order component for protected routes.
- Ensure admin routes are only accessible to users with the admin role.
- Example implementation:
  ```jsx
  const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, role, loading } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          navigate("/login");
        } else if (requiredRole && role !== requiredRole) {
          navigate(role === "admin" ? "/admin" : "/account");
        }
      }
    }, [isAuthenticated, role, loading, navigate, requiredRole]);
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    return isAuthenticated && (!requiredRole || role === requiredRole) ? children : null;
  };
  ```

## 6. Fix Product Deletion Firebase Permission Errors

### Current Issue
Trying to delete products from the Admin panel gives Firebase permission errors.

### Implementation Plan

#### 6.1. Review Firebase Security Rules
- Check the current Firestore security rules for the products collection.
- Update the rules to allow admins to delete products.
- Example rule:
  ```
  match /products/{productId} {
    allow read: if true;
    allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
  }
  ```

#### 6.2. Update ProductManager.tsx
- Modify the `handleDelete` function in `ProductManager.tsx` to handle permissions properly.
- Add proper error handling for deletion operations.
- The current implementation is:
  ```tsx
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };
  ```
- Updated implementation:
  ```tsx
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        toast({
          title: "Product Deleted",
          description: "The product has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Deletion Failed",
          description: "You may not have permission to delete this product.",
          variant: "destructive",
        });
      }
    }
  };
  ```

#### 6.3. Implement Error Handling
- Add try-catch blocks around the deletion operation.
- Display meaningful error messages to the user.
- Add logging for debugging purposes.

## 7. Fix User Ban/Delete Functionality

### Current Issue
Firebase throws errors when trying to ban users or delete accounts.

### Implementation Plan

#### 7.1. Review Firebase Security Rules
- Check the current Firestore security rules for the users collection.
- Update the rules to allow admins to modify user documents.
- Example rule:
  ```
  match /users/{userId} {
    allow read: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    allow write: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
  }
  ```

#### 7.2. Update AdminPage.tsx
- Modify the `handleBanUser` and `handlePromoteToAdmin` functions in `AdminPage.tsx`.
- Add proper error handling and authentication checks.
- The current implementations are:
  ```tsx
  const handlePromoteToAdmin = async (user: User) => {
    await updateDoc(doc(db, "users", user.id), { role: "admin" });
  };

  const handleBanUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to ban ${user.email}?`)) {
      await updateDoc(doc(db, "users", user.id), { banned: true });
    }
  };
  ```
- Updated implementations:
  ```tsx
  const handlePromoteToAdmin = async (user: User) => {
    try {
      await updateDoc(doc(db, "users", user.id), { role: "admin" });
      toast({
        title: "User Promoted",
        description: `${user.email} has been promoted to admin.`,
      });
    } catch (error) {
      console.error("Error promoting user:", error);
      toast({
        title: "Promotion Failed",
        description: "You may not have permission to promote this user.",
        variant: "destructive",
      });
    }
  };

  const handleBanUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to ban ${user.email}?`)) {
      try {
        await updateDoc(doc(db, "users", user.id), { 
          banned: true,
          status: "banned",
          updatedAt: Timestamp.now()
        });
        toast({
          title: "User Banned",
          description: `${user.email} has been banned.`,
        });
      } catch (error) {
        console.error("Error banning user:", error);
        toast({
          title: "Ban Failed",
          description: "You may not have permission to ban this user.",
          variant: "destructive",
        });
      }
    }
  };
  ```

#### 7.3. Implement Error Handling
- Add try-catch blocks around user management operations.
- Display meaningful error messages to the user.
- Add logging for debugging purposes.

## 8. Fix Order Dashboard Shift+Delete Error

### Current Issue
Using Shift+Delete on any order gives Firebase and admin errors.

### Implementation Plan

#### 8.1. Analyze AdminOrders.tsx
- The issue might be in the `deleteOrder` function in `AdminOrders.tsx`.
- Check if there are any keyboard event listeners that might be interfering.

#### 8.2. Update Order Deletion
- Modify the `deleteOrder` function to handle the Shift+Delete case.
- Add proper error handling and authentication checks.
- The current implementation is:
  ```tsx
  const deleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteDoc(doc(db, "orders", orderId));
    }
  };
  ```
- Updated implementation:
  ```tsx
  const deleteOrder = async (orderId: string, isShiftDelete = false) => {
    const confirmMessage = isShiftDelete 
      ? "Are you sure you want to permanently delete this order? This action cannot be undone."
      : "Are you sure you want to delete this order?";
      
    if (window.confirm(confirmMessage)) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        toast({
          title: "Order Deleted",
          description: "The order has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting order:", error);
        toast({
          title: "Deletion Failed",
          description: "You may not have permission to delete this order.",
          variant: "destructive",
        });
      }
    }
  };
  ```

#### 8.3. Add Confirmation Dialog
- Replace the basic `window.confirm` with a more robust confirmation dialog.
- Include details about the order being deleted.
- Add an option to cancel the deletion.
- Example implementation:
  ```tsx
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isShiftDelete, setIsShiftDelete] = useState(false);
  
  const showDeleteConfirmation = (order, shiftKey = false) => {
    setOrderToDelete(order);
    setIsShiftDelete(shiftKey);
  };
  
  const confirmDelete = async () => {
    if (!orderToDelete) return;
    
    try {
      await deleteDoc(doc(db, "orders", orderToDelete.id));
      toast({
        title: "Order Deleted",
        description: "The order has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Deletion Failed",
        description: "You may not have permission to delete this order.",
        variant: "destructive",
      });
    } finally {
      setOrderToDelete(null);
    }
  };
  ```

#### 8.4. Implement Error Handling
- Add try-catch blocks around the deletion operation.
- Display meaningful error messages to the user.
- Add logging for debugging purposes.

## 9. Add Animations and Visual Improvements

### Implementation Plan

#### 9.1. Add Fade-In Animations
- Use CSS transitions or a library like Framer Motion for page transitions.
- Add fade-in effects when components mount.
- Example CSS:
  ```css
  .fade-in {
    opacity: 0;
    animation: fadeIn 0.5s ease-in-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  ```

#### 9.2. Add Smooth Transitions
- Implement smooth transitions for UI elements.
- Add transition effects for hover states, button clicks, etc.
- Example CSS:
  ```css
  .button {
    transition: all 0.3s ease;
  }

  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  ```

#### 9.3. Implement Loading Effects
- Add loading spinners or skeleton screens for async operations.
- Use libraries like react-loading-skeleton or create custom loading components.
- Example implementation:
  ```tsx
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
  
  // Usage
  {isLoading ? (
    <LoadingSpinner />
  ) : (
    <ProductList products={products} />
  )}
  ```

#### 9.4. Add Hover Animations
- Enhance interactive elements with hover animations.
- Add subtle effects to improve user experience.
- Example CSS:
  ```css
  .card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  ```

## Implementation Strategy

I recommend implementing these fixes in the following order:

1. Start with the critical functionality issues (Heart Icon, Checkout, Admin Login)
2. Move on to the Firebase permission issues (Product Deletion, User Ban/Delete, Order Dashboard)
3. Implement the new features (Account Settings, Order Reviews)
4