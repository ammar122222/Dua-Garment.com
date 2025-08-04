// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User,
} from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/SEO";

// ✅ Pages
import Index from "./pages/Index";
import MenPage from "./pages/MenPage";
import WomenPage from "./pages/WomenPage";
import KidsPage from "./pages/KidsPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import SalePage from "./pages/SalePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AccountPage from "./pages/AccountPage";
import ContactPage from "./pages/ContactPage";
import CheckoutPage from "./pages/CheckoutPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import AdminPage from "./pages/AdminPage";
import AdminOrders from "./pages/AdminOrders";
import IphonePage from "./pages/IphonePage";
import NotFound from "./pages/NotFound";

// ✅ Legal Pages
import CopyrightPolicy from "./pages/CopyrightPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import ReturnsAndExchanges from "./pages/ReturnsAndExchanges";

// ✅ Admin Protected Route Wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated || role !== "admin")
    return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        onAuthStateChanged(auth, (loggedUser) => {
          setUser(loggedUser ?? null);
        });
      })
      .catch((error) => {
        console.error("❌ Firebase persistence error:", error);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          {/* ✅ Global SEO Meta Tags */}
          <SEO />

          <BrowserRouter>
            <Routes>
              {/* 🏠 Public Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/men" element={<MenPage />} />
              <Route path="/women" element={<WomenPage />} />
              <Route path="/kids" element={<KidsPage />} />
              <Route path="/new-arrivals" element={<NewArrivalsPage />} />
              <Route path="/sale" element={<SalePage />} />
              <Route path="/iphone" element={<IphonePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />

              {/* 📄 Legal Pages */}
              <Route path="/copyright-policy" element={<CopyrightPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route
                path="/returns-and-exchanges"
                element={
                  <ReturnsAndExchanges
                    isOpen={false}
                    onClose={() => {}}
                    productId=""
                    productName=""
                    productImage=""
                  />
                }
              />

              {/* 🔐 Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />

              {/* ❌ Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
