# Animations and Visual Improvements

This document provides code examples for implementing animations and visual improvements in the e-commerce application.

## 1. Fade-In Animations

### Page Transitions

Add these styles to your global CSS file:

```css
/* Global fade-in animation for page transitions */
.page-transition-enter {
  opacity: 0;
}

.page-transition-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-in-out;
}

.page-transition-exit {
  opacity: 1;
}

.page-transition-exit-active {
  opacity: 0;
  transition: opacity 300ms ease-in-out;
}
```

Implement with React Router and the `react-transition-group` library:

```tsx
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames="page-transition"
        timeout={300}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          {/* Other routes */}
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}
```

### Component Mount Animations

For individual components that need to fade in when mounted:

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.fade-in-delay-1 {
  animation: fadeIn 0.5s ease-out 0.1s forwards;
  opacity: 0;
}

.fade-in-delay-2 {
  animation: fadeIn 0.5s ease-out 0.2s forwards;
  opacity: 0;
}

.fade-in-delay-3 {
  animation: fadeIn 0.5s ease-out 0.3s forwards;
  opacity: 0;
}
```

Usage in components:

```tsx
function ProductCard({ product }) {
  return (
    <div className="fade-in">
      <img src={product.image} alt={product.name} />
      <h3 className="fade-in-delay-1">{product.name}</h3>
      <p className="fade-in-delay-2">{product.description}</p>
      <div className="fade-in-delay-3">
        <span>{product.price}</span>
        <button>Add to Cart</button>
      </div>
    </div>
  );
}
```

## 2. Smooth Transitions

### Button Transitions

```css
.button {
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #333;
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### Card Transitions

```css
.card {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-image {
  transition: transform 0.5s ease;
}

.card:hover .card-image {
  transform: scale(1.05);
}
```

### Form Input Transitions

```css
.input {
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  padding: 0.5rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  outline: none;
}
```

## 3. Loading Effects

### Spinner Component

```tsx
function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}
```

```css
.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Skeleton Loading

```tsx
function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-price"></div>
      <div className="skeleton-button"></div>
    </div>
  );
}
```

```css
.product-card-skeleton {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-image,
.skeleton-title,
.skeleton-price,
.skeleton-button {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-image {
  width: 100%;
  height: 200px;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}

.skeleton-title {
  width: 80%;
  height: 1.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.skeleton-price {
  width: 40%;
  height: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}

.skeleton-button {
  width: 100%;
  height: 2.5rem;
  border-radius: 0.25rem;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Progress Bar for Checkout

```tsx
function CheckoutProgress({ step }) {
  return (
    <div className="checkout-progress">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>
      <div className="progress-steps">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          Cart
        </div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          Shipping
        </div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          Payment
        </div>
      </div>
    </div>
  );
}
```

```css
.checkout-progress {
  margin: 2rem 0;
}

.progress-bar {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.5s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
}

.progress-step {
  color: #999;
  font-weight: 500;
  transition: color 0.3s ease;
}

.progress-step.active {
  color: #4caf50;
}
```

## 4. Hover Animations

### Product Card Hover Effects

```css
.product-card {
  position: relative;
  overflow: hidden;
}

.product-card-image {
  transition: transform 0.5s ease;
}

.product-card:hover .product-card-image {
  transform: scale(1.1);
}

.product-card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.product-card:hover .product-card-overlay {
  transform: translateY(0);
}
```

### Button Hover Effects

```css
.button-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.button-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
  z-index: -1;
}

.button-primary:hover::before {
  left: 100%;
}
```

### Icon Hover Effects

```css
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: scale(1.1);
}

.icon-button svg {
  transition: transform 0.3s ease, color 0.3s ease;
}

.icon-button:hover svg {
  transform: rotate(15deg);
  color: #007bff;
}
```

### Heart Icon Animation

```css
.heart-icon {
  color: #ccc;
  transition: transform 0.3s ease, color 0.3s ease;
}

.heart-icon.active {
  color: #ff3b5c;
}

.heart-icon:hover {
  transform: scale(1.2);
}

.heart-icon.active:hover {
  animation: heartbeat 1s infinite;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1); }
  75% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

## 5. Toast Notifications

```tsx
function showToast({ title, message, type = 'success', duration = 3000 }) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  toast.innerHTML = `
    <div class="toast-header">
      <span class="toast-title">${title}</span>
      <button class="toast-close">&times;</button>
    </div>
    <div class="toast-body">${message}</div>
  `;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto-remove after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
  
  // Close button functionality
  const closeButton = toast.querySelector('.toast-close');
  closeButton.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  });
}
```

```css
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 9999;
  transform: translateX(110%);
  transition: transform 0.3s ease;
}

.toast.show {
  transform: translateX(0);
}

.toast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.toast-title {
  font-weight: 600;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.toast-close:hover {
  opacity: 1;
}

.toast-body {
  padding: 0.75rem 1rem;
}

.toast-success {
  border-left: 4px solid #4caf50;
}

.toast-error {
  border-left: 4px solid #f44336;
}

.toast-warning {
  border-left: 4px solid #ff9800;
}

.toast-info {
  border-left: 4px solid #2196f3;
}
```

## 6. Confetti Effect for Order Completion

Using the `canvas-confetti` library (already imported in the project):

```tsx
function OrderConfirmation() {
  useEffect(() => {
    // Trigger confetti when component mounts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // More elaborate confetti effect
    setTimeout(() => {
      const end = Date.now() + 3000;
      
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      
      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }, 500);
  }, []);
  
  return (
    <div className="order-confirmation">
      <h1>Thank You for Your Order!</h1>
      <p>Your order has been successfully placed.</p>
      {/* Order details */}
    </div>
  );
}
```

## 7. Implementing These Animations

To implement these animations in the e-commerce application:

1. **Add the CSS**: Create a new file `src/animations.css` and add the relevant CSS code.

2. **Import the CSS**: Import the CSS file in your main application file:
   ```tsx
   import './animations.css';
   ```

3. **Apply Classes**: Add the appropriate classes to your components.

4. **Install Dependencies**: Make sure to install any required libraries:
   ```bash
   npm install react-transition-group canvas-confetti
   ```

5. **Progressive Enhancement**: Implement animations progressively, starting with the most important user interactions.

6. **Performance Considerations**: Use hardware-accelerated properties (transform, opacity) for animations to ensure smooth performance.

7. **Accessibility**: Ensure animations respect user preferences by checking the `prefers-reduced-motion` media query:
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }