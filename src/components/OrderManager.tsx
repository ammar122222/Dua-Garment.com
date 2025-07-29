import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { Order } from "@/types/product";

const statusFlow = ["processing", "shipped", "delivered"];

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const allOrders: Order[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(allOrders);
    });
    return () => unsub();
  }, []);

  // Filter for today's orders
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayOrders = orders.filter(order => {
    let createdAt: Date;
    if (order.createdAt instanceof Date) {
      createdAt = order.createdAt;
    } else if (order.createdAt && typeof order.createdAt === 'object' && typeof (order.createdAt as any).toDate === 'function') {
      createdAt = (order.createdAt as any).toDate();
    } else {
      createdAt = new Date(order.createdAt);
    }
    return createdAt >= startOfDay;
  });

  const displayedOrders = showTodayOnly ? todayOrders : orders;

  const handleStatusUpdate = async (order: Order) => {
    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex < statusFlow.length - 1) {
      const newStatus = statusFlow[currentIndex + 1];
      await updateDoc(doc(db, "orders", order.id), { status: newStatus, updatedAt: new Date() });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <button
        className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        onClick={() => setShowTodayOnly(v => !v)}
      >
        {showTodayOnly ? "Show All Orders" : "Show Today's Orders"}
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.map(order => (
              <tr key={order.id} className="border-b">
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.userId}</td>
                <td className="p-2 border">Rs. {order.total}</td>
                <td className="p-2 border capitalize">{order.status.replace(/-/g, " ")}</td>
                <td className="p-2 border">{
                  (() => {
                    let createdAt: Date;
                    if (order.createdAt instanceof Date) {
                      createdAt = order.createdAt;
                    } else if (order.createdAt && typeof order.createdAt === 'object' && typeof (order.createdAt as any).toDate === 'function') {
                      createdAt = (order.createdAt as any).toDate();
                    } else {
                      createdAt = new Date(order.createdAt);
                    }
                    return createdAt.toLocaleString();
                  })()
                }</td>
                <td className="p-2 border">
                  {statusFlow.includes(order.status) && statusFlow.indexOf(order.status) < statusFlow.length - 1 && (
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                      onClick={() => handleStatusUpdate(order)}
                    >
                      Mark as {statusFlow[statusFlow.indexOf(order.status) + 1].charAt(0).toUpperCase() + statusFlow[statusFlow.indexOf(order.status) + 1].slice(1)}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManager;
