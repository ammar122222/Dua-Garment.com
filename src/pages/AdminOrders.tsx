import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Sort orders by creation date (newest first)
      data.sort((a, b) => {
        const getDate = (order) => {
          if (!order.createdAt) return null;
          const date = order.createdAt.toDate?.() || new Date(order.createdAt);
          return isNaN(date.getTime()) ? null : date;
        };
        const aDate = getDate(a);
        const bDate = getDate(b);

        if (!aDate) return 1; // a is invalid, move it to the end
        if (!bDate) return -1; // b is invalid, move it to the end

        return bDate.getTime() - aDate.getTime();
      });
      setOrders(data);
    });

    return () => unsub();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await updateDoc(doc(db, "orders", orderId), {
      status: newStatus,
      updatedAt: Timestamp.now(),
    });
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteDoc(doc(db, "orders", orderId));
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "processing":
      case "in process":
        return "bg-red-100 text-red-800 border-red-200";
      case "shipped":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusButtonColor = (status: string, currentStatus: string) => {
    const isActive = currentStatus === status;
    switch (status) {
      case "in process":
        return isActive 
          ? "bg-red-600 text-white hover:bg-red-700" 
          : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300";
      case "shipped":
        return isActive 
          ? "bg-orange-600 text-white hover:bg-orange-700" 
          : "bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300";
      case "delivered":
        return isActive 
          ? "bg-green-600 text-white hover:bg-green-700" 
          : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300";
      default:
        return isActive 
          ? "bg-gray-600 text-white hover:bg-gray-700" 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📦 Orders Dashboard</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        <Button 
          onClick={() => navigate("/admin")}
          className="bg-black text-white hover:bg-gray-800"
        >
          Back to Admin Dashboard
        </Button>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-red-600">In Process</h3>
            <p className="text-2xl font-bold text-red-800">
              {orders.filter(o => o.status === "in process").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-orange-600">Shipped</h3>
            <p className="text-2xl font-bold text-orange-800">
              {orders.filter(o => o.status === "shipped").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-green-600">Delivered</h3>
            <p className="text-2xl font-bold text-green-800">
              {orders.filter(o => o.status === "delivered").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 text-lg">No orders found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-800">Order #{order.id.slice(0, 8)}...</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <p><span className="font-medium">Placed:</span> {formatDate(order.createdAt)}</p>
                      <p><span className="font-medium">Customer:</span> {order.fullName || order.email || "N/A"}</p>
                      <p><span className="font-medium">Email:</span> {order.email || "N/A"}</p>
                      <p><span className="font-medium">Total:</span> <span className="font-bold text-green-600">PKR {order.total?.toFixed(2)}</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 items-end">
                    <Badge className={`px-3 py-1 text-sm font-medium capitalize ${getStatusColor(order.status || "pending")}`}>
                      {order.status || "pending"}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Update Order Status:</h3>
                  <div className="flex gap-3 flex-wrap">
                    {["in process", "shipped", "delivered"].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        className={`capitalize transition-all duration-200 ${getStatusButtonColor(status, order.status)}`}
                        onClick={() => updateOrderStatus(order.id, status)}
                      >
                        {status === "in process" ? "In Process" : status}
                      </Button>
                    ))}
                    <Button
                      size="sm"
                      className="bg-red-600 text-white hover:bg-red-700 ml-auto"
                      onClick={() => deleteOrder(order.id)}
                    >
                      Delete Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 🔍 Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                  <p><span className="font-medium">Status:</span> 
                    <Badge className={`ml-2 capitalize ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </Badge>
                  </p>
                  <p><span className="font-medium">Placed:</span> {formatDate(selectedOrder.createdAt)}</p>
                  <p><span className="font-medium">Updated:</span> {formatDate(selectedOrder.updatedAt)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold text-lg mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedOrder.shippingAddress?.name || selectedOrder.fullName || "N/A"}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.email || "N/A"}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.phone || "N/A"}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold text-lg mb-3">Shipping Address</h3>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  {selectedOrder.shippingAddress ? (
                    // New format with nested shippingAddress
                    `${selectedOrder.shippingAddress.address}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state}, ${selectedOrder.shippingAddress.zipCode}, ${selectedOrder.shippingAddress.country}`
                  ) : (
                    // Old format with direct properties for backward compatibility
                    `${selectedOrder.address || ''}, ${selectedOrder.city || ''}, ${selectedOrder.state || ''}, ${selectedOrder.zipCode || ''}, ${selectedOrder.country || ''}`
                  )}
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold text-lg mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center p-3 bg-gray-50 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="inline-block mr-4">Qty: <span className="font-medium">{item.quantity || 1}</span></span>
                          <span className="inline-block mr-4">Size: <span className="font-medium">{item.selectedSize || item.size || 'Default'}</span></span>
                          <span className="inline-block">Color: <span className="font-medium">{item.selectedColor || item.color || 'Default'}</span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">PKR {(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">PKR {item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold text-lg mb-3">Payment Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>PKR {selectedOrder.subtotal?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>PKR {selectedOrder.shipping?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg text-green-600">
                    <span>Total:</span>
                    <span>PKR {selectedOrder.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
