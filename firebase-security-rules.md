# Firebase Security Rules for E-Commerce Application

These security rules will address the permission issues in the application, particularly for product deletion, user management, and order operations.

## Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is accessing their own data
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users collection rules
    match /users/{userId} {
      // Anyone can read their own user document, admins can read any user document
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
      
      // Users can update their own document, admins can update any user document
      allow update: if isAuthenticated() && (isOwner(userId) || isAdmin());
      
      // Only admins can delete user documents
      allow delete: if isAdmin();
      
      // Only authenticated users can create their own user document
      allow create: if isAuthenticated() && isOwner(userId);
    }
    
    // Products collection rules
    match /products/{productId} {
      // Anyone can read products
      allow read: if true;
      
      // Only admins can create, update, or delete products
      allow create, update, delete: if isAdmin();
    }
    
    // Orders collection rules
    match /orders/{orderId} {
      // Users can read their own orders, admins can read any order
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
      
      // Authenticated users can create orders
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      
      // Users can update their own orders (e.g., to cancel), admins can update any order
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
      
      // Only admins can delete orders
      allow delete: if isAdmin();
    }
    
    // Reviews subcollection rules
    match /products/{productId}/reviews/{reviewId} {
      // Anyone can read reviews
      allow read: if true;
      
      // Authenticated users can create reviews
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      
      // Users can update or delete their own reviews, admins can update or delete any review
      allow update, delete: if isAuthenticated() && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
    }
    
    // Wishlist collection rules (if separate from user document)
    match /wishlists/{userId} {
      // Users can read their own wishlist, admins can read any wishlist
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
      
      // Users can update their own wishlist
      allow write: if isAuthenticated() && isOwner(userId);
    }
  }
}
```

## Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Product images
    match /products/{productId}/{allImages=**} {
      // Anyone can view product images
      allow read: if true;
      
      // Only admins can upload, update, or delete product images
      allow write: if isAdmin();
    }
    
    // User profile images
    match /users/{userId}/{allImages=**} {
      // Anyone can view user profile images
      allow read: if true;
      
      // Users can upload their own profile images, admins can upload any user's profile image
      allow write: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
    }
    
    // Review images
    match /reviews/{userId}/{allImages=**} {
      // Anyone can view review images
      allow read: if true;
      
      // Users can upload images for their own reviews
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

## Authentication Rules

For Firebase Authentication, you'll need to configure the following settings in the Firebase Console:

1. **Email/Password Authentication**: Enable this method for user login.
2. **Email Verification**: Enable email verification to ensure users have valid email addresses.
3. **Password Requirements**: Set strong password requirements (minimum length, complexity).
4. **User Actions**: Allow users to reset their password.

## Implementation Notes

1. **Admin Role**: The admin role is determined by checking the user's document in Firestore. Make sure to create this document when registering admin users.

2. **Security Rule Testing**: Test these rules thoroughly before deploying to production to ensure they work as expected.

3. **Error Handling**: Implement proper error handling in your application to handle permission denied errors gracefully.

4. **Rule Updates**: Update these rules as needed when adding new features or collections to your application.

5. **Performance**: Be mindful of the performance implications of using `get()` in security rules. Consider caching admin status in your application if needed.