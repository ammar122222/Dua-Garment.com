import { createRoot } from 'react-dom/client'
import App from './app.tsx' // Note: This should probably be './App.tsx' if your App component is in App.tsx
import './index.css'
import { AuthProvider } from './contexts/AuthContext.jsx'; // Import AuthProvider

createRoot(document.getElementById("root")!).render(
  <AuthProvider> {/* Wrap App with AuthProvider */}
    <App />
  </AuthProvider>
);