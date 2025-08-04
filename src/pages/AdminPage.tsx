import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { db, auth } from "@/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { User } from "@/types/product";
import ProductManager from "@/components/ProductManager";
import { Header } from "@/components/Header";

const AdminPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, logout, loading } = useAuth();

  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [activeOrders, setActiveOrders] = useState<number | null>(null);
  const [revenueToday, setRevenueToday] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "admin")) {
      navigate("/login");
    }
  }, [isAuthenticated, role, loading, navigate]);

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      setTotalProducts(snapshot.size);
    });

    const activeStatuses = ["processing", "shipped", "out-for-delivery"];
    const qActive = query(collection(db, "orders"), where("status", "in", activeStatuses));
    const unsubOrders = onSnapshot(qActive, (snapshot) => {
      setActiveOrders(snapshot.size);
    });

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const qToday = query(collection(db, "orders"), where("createdAt", ">=", startTimestamp));
    const unsubRevenue = onSnapshot(qToday, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        total += data.totalAmount || data.total || 0;
      });
      setRevenueToday(total);
      setMetricsLoading(false);
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const allUsers: User[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as User));
      setUsers(allUsers);
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubRevenue();
      unsubUsers();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handlePromoteToAdmin = async (user: User) => {
    await updateDoc(doc(db, "users", user.id), { role: "admin" });
  };

  const handleBanUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to ban ${user.email}?`)) {
      await updateDoc(doc(db, "users", user.id), { banned: true });
    }
  };

  if (!isAuthenticated || role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />
      <div className="container mx-auto p-4 md:p-8">
        {/* The original header div has been replaced by the Header component.
            The title and buttons are now placed below for a cleaner look. */}
        <div className="flex justify-between items-center mb-6 mt-4">
          <h1 className="text-3xl font-bold">Dua Garments Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/admin/orders")}>
              View Orders
            </Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Total Products</h2>
              <p className="text-2xl font-bold mt-2">
                {metricsLoading || totalProducts === null ? "..." : totalProducts}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Active Orders</h2>
              <p className="text-2xl font-bold mt-2">
                {metricsLoading || activeOrders === null ? "..." : activeOrders}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Revenue Today</h2>
              <p className="text-2xl font-bold mt-2">
                {metricsLoading || revenueToday === null
                  ? "..."
                  : `PKR ${revenueToday.toLocaleString()}`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Product Manager */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Product Manager</h2>
          <div className="p-4 bg-white rounded shadow-sm">
            <ProductManager />
          </div>
        </div>

        {/* Users Panel */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Users Panel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border border-gray-200 hover:shadow-lg transition"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white mb-3">
                  {user.name
                    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                    : user.email[0].toUpperCase()}
                </div>
                <div className="text-lg font-semibold mb-1">{user.name || "No Name"}</div>
                <div className="text-gray-500 text-sm mb-2">{user.email}</div>
                <div className="mb-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mb-4">
                  {(() => {
                    let createdAt: Date;
                    if (user.createdAt instanceof Date) {
                      createdAt = user.createdAt;
                    } else if (
                      user.createdAt &&
                      typeof user.createdAt === "object" &&
                      typeof (user.createdAt as any).toDate === "function"
                    ) {
                      createdAt = (user.createdAt as any).toDate();
                    } else {
                      createdAt = new Date(user.createdAt);
                    }
                    return `Joined: ${createdAt.toLocaleDateString()}`;
                  })()}
                </div>
                <div className="flex gap-2 w-full justify-center">
                  {user.role !== "admin" && (
                    <button
                      className="px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full text-xs font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition"
                      onClick={() => handlePromoteToAdmin(user)}
                    >
                      Promote to Admin
                    </button>
                  )}
                  <button
                    className="px-4 py-1 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full text-xs font-semibold shadow hover:from-red-600 hover:to-red-800 transition"
                    onClick={() => handleBanUser(user)}
                  >
                    Ban User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
