import { useState, useEffect } from "react";
import {
  getOrders,
  createKOT,
  getAllKOT,
  acceptKOT,
  startPreparing,
  markReady,
  markServed,
} from "../api";
import {
  FaClock,
  FaFire,
  FaCheck,
  FaHourglassHalf,
  FaCheckCircle,
  FaTruck,
  FaPlus,
  FaTable,
  FaReceipt,
  FaList,
  FaSpinner,
  FaExclamationTriangle,
  FaChevronRight,
  FaStopwatch,
  FaUser,
  FaRegClock
} from "react-icons/fa";

const KDSWithCreateKOT = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [kots, setKots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("kots"); // "kots" or "orders"

  // Fetch all data
  const fetchData = async () => {
    try {
      const [ordersRes, kotsRes] = await Promise.all([getOrders(), getAllKOT()]);
      
      const orders = ordersRes.data.orders?.filter(o => o.status === "pending") || [];
      setPendingOrders(orders);
      setKots(kotsRes.data.kots || kotsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle Create KOT
  const handleCreateKOT = async (order) => {
    try {
      await createKOT({ orderId: order._id });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to create KOT");
    }
  };

  // Handle KOT action
  const handleKOTAction = async (kotId, action) => {
    try {
      if (action === "accept") await acceptKOT(kotId);
      else if (action === "preparing") await startPreparing(kotId);
      else if (action === "ready") await markReady(kotId);
      else if (action === "served") await markServed(kotId);

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending': return { color: 'text-yellow-400 bg-yellow-900/20', icon: '⏳' };
      case 'accepted': return { color: 'text-blue-400 bg-blue-900/20', icon: '✓' };
      case 'preparing': return { color: 'text-orange-400 bg-orange-900/20', icon: '🔥' };
      case 'ready': return { color: 'text-green-400 bg-green-900/20', icon: '✅' };
      case 'served': return { color: 'text-purple-400 bg-purple-900/20', icon: '🚚' };
      default: return { color: 'text-gray-400 bg-gray-900/20', icon: '📋' };
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get elapsed minutes
  const getElapsedMinutes = (timestamp) => {
    if (!timestamp) return null;
    return Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
  };

  // Get action button for KOT status
  const getActionButton = (kot) => {
    const baseClass = "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200";
    
    switch (kot.status) {
      case "pending":
        return (
          <button
            onClick={() => handleKOTAction(kot._id, "accept")}
            className={`${baseClass} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white`}
          >
            Accept
          </button>
        );
      case "accepted":
        return (
          <button
            onClick={() => handleKOTAction(kot._id, "preparing")}
            className={`${baseClass} bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white`}
          >
            Start Prep
          </button>
        );
      case "preparing":
        return (
          <button
            onClick={() => handleKOTAction(kot._id, "ready")}
            className={`${baseClass} bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white`}
          >
            Mark Ready
          </button>
        );
      case "ready":
        return (
          <button
            onClick={() => handleKOTAction(kot._id, "served")}
            className={`${baseClass} bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white`}
          >
            Mark Served
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg">
            <FaFire className="text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Kitchen Display</h1>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <FaClock /> {pendingOrders.length} Pending
              </span>
              <span className="flex items-center gap-1">
                <FaFire /> {kots.length} Active
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("kots")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "kots"
                ? "bg-gradient-to-r from-orange-600 to-red-600"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            KOTs ({kots.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "orders"
                ? "bg-gradient-to-r from-blue-600 to-purple-600"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Orders ({pendingOrders.length})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <FaSpinner className="text-3xl mb-3 animate-spin text-orange-500" />
          <p className="text-gray-400">Loading kitchen data...</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* KOTs Section - Always visible on large screens, but controlled by tab on small */}
        <div className={`lg:col-span-2 ${activeTab === "kots" ? "block" : "lg:block hidden lg:block"}`}>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <FaFire className="text-orange-400" /> Active KOTs
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaRegClock className="text-green-400" />
                <span>Auto-refresh every 5s</span>
              </div>
            </div>

            {kots.length === 0 ? (
              <div className="text-center py-8">
                <FaExclamationTriangle className="text-3xl mx-auto mb-3 text-gray-600" />
                <p className="text-gray-500">No active KOTs</p>
                <p className="text-gray-400 text-sm mt-1">Create KOTs from pending orders</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {kots.map(kot => {
                  const statusInfo = getStatusInfo(kot.status);
                  const elapsed = getElapsedMinutes(kot.updatedAt);
                  
                  return (
                    <div key={kot._id} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <FaTable className="text-gray-500 text-sm" />
                              <span className="font-medium">
                                {kot.table?.tableNumber || "T/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FaReceipt className="text-gray-500 text-sm" />
                              <span className="text-sm text-gray-400">#{kot.order?.orderId}</span>
                            </div>
                          </div>
                          {kot.customerName && (
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                              <FaUser className="text-xs" />
                              <span>{kot.customerName}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.icon} {kot.status}
                          </div>
                          {getActionButton(kot)}
                        </div>
                      </div>

                      {/* Compact Items List */}
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {kot.items.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-800 rounded text-xs">
                              {item.name} ×{item.quantity}
                            </span>
                          ))}
                          {kot.items.length > 3 && (
                            <span className="px-2 py-1 bg-gray-800 rounded text-xs">
                              +{kot.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Compact Timeline */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-4">
                          {kot.acceptedAt && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Accepted: {formatTime(kot.acceptedAt)}</span>
                            </div>
                          )}
                          {kot.preparingAt && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>Prep: {formatTime(kot.preparingAt)}</span>
                            </div>
                          )}
                          {kot.readyAt && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Ready: {formatTime(kot.readyAt)}</span>
                            </div>
                          )}
                        </div>
                        
                        {elapsed !== null && (
                          <div className="flex items-center gap-1 text-orange-400">
                            <FaStopwatch className="text-xs" />
                            <span>{elapsed}m</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Orders Section - Always visible on large screens, but controlled by tab on small */}
        <div className={`${activeTab === "orders" ? "block" : "lg:block hidden lg:block"}`}>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <FaClock className="text-yellow-400" /> Pending Orders
              </h3>
              <span className="text-xs text-gray-400">{pendingOrders.length} waiting</span>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="text-center py-8">
                <FaCheckCircle className="text-3xl mx-auto mb-3 text-green-500" />
                <p className="text-gray-500">No pending orders</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {pendingOrders.map(order => (
                  <div key={order._id} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center text-xs font-bold">
                          {order.table?.tableNumber || "T/A"}
                        </div>
                        <div>
                          <div className="font-medium text-sm">Order #{order.orderId}</div>
                          <div className="text-xs text-gray-400">
                            {order.items.length} items • {formatTime(order.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleCreateKOT(order)}
                        className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <FaPlus className="text-xs" /> KOT
                      </button>
                    </div>

                    {/* Compact Items */}
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-300 flex justify-between">
                          <span className="truncate">{item.name}</span>
                          <span className="text-gray-400">×{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                    
                    {order.notes && (
                      <div className="mt-2 text-xs text-gray-400 bg-gray-800/50 p-2 rounded">
                        <span className="text-yellow-400">Note:</span> {order.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Status Legend */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium mb-2">Status Legend</h4>
              <div className="grid grid-cols-2 gap-2">
                {['pending', 'accepted', 'preparing', 'ready', 'served'].map(status => {
                  const info = getStatusInfo(status);
                  return (
                    <div key={status} className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${info.color.split(' ')[0]}`}></div>
                      <span className="text-gray-300 capitalize">{status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation - Only shown on small screens */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-gray-800 rounded-lg border border-gray-700 p-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveTab("kots")}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
              activeTab === "kots"
                ? "bg-gradient-to-r from-orange-600 to-red-600"
                : "bg-gray-900 text-gray-400"
            }`}
          >
            <FaFire />
            <span>KOTs ({kots.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
              activeTab === "orders"
                ? "bg-gradient-to-r from-blue-600 to-purple-600"
                : "bg-gray-900 text-gray-400"
            }`}
          >
            <FaClock />
            <span>Orders ({pendingOrders.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KDSWithCreateKOT;
