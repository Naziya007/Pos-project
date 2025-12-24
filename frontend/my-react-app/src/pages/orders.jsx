import { useEffect, useState } from "react";
import { getOrders, createOrder, updateOrder, deleteOrder, getTables } from "../api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaList,
  FaTable,
  FaRupeeSign,
  FaTag,
  FaClipboardList,
  FaClock,
  FaCheck,
  FaTimesCircle,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaShoppingCart,
  FaRegEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaMinusCircle,
  FaDollarSign,
  FaEye,
  FaReceipt,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFilter,
  FaSearch,
  FaDownload,
  FaPrint,
  FaCalendar,
  FaUser,
  FaPhone,
  FaComments,
  FaShoppingBag,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [newOrderItems, setNewOrderItems] = useState([{ name: "", quantity: 1, price: 0 }]);
  const [selectedTable, setSelectedTable] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [viewOrderId, setViewOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", notes: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const statusOptions = ["pending", "preparing", "ready", "served", "cancelled", "billing"];

  // Status mapping
  const statusConfig = {
    pending: { 
      label: "Pending", 
      icon: <FaClock className="text-yellow-400" />, 
      color: "text-yellow-400 bg-yellow-900/20 border-yellow-700/30" 
    },
    preparing: { 
      label: "Preparing", 
      icon: <FaClock className="text-orange-400" />, 
      color: "text-orange-400 bg-orange-900/20 border-orange-700/30" 
    },
    ready: { 
      label: "Ready", 
      icon: <FaCheckCircle className="text-blue-400" />, 
      color: "text-blue-400 bg-blue-900/20 border-blue-700/30" 
    },
    served: { 
      label: "Served", 
      icon: <FaCheck className="text-green-400" />, 
      color: "text-green-400 bg-green-900/20 border-green-700/30" 
    },
    cancelled: { 
      label: "Cancelled", 
      icon: <FaTimesCircle className="text-red-400" />, 
      color: "text-red-400 bg-red-900/20 border-red-700/30" 
    },
    billing: { 
      label: "Billing", 
      icon: <FaFileInvoiceDollar className="text-purple-400" />, 
      color: "text-purple-400 bg-purple-900/20 border-purple-700/30" 
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data.orders || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch tables
  const fetchTables = async () => {
    try {
      const res = await getTables();
      setTables(res.data.tables || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchTables();
  }, []);

  // Add item
  const handleAddItem = () => {
    setNewOrderItems([...newOrderItems, { name: "", quantity: 1, price: 0 }]);
  };

  // Remove item
  const handleRemoveItem = (index) => {
    if (newOrderItems.length > 1) {
      const items = [...newOrderItems];
      items.splice(index, 1);
      setNewOrderItems(items);
    }
  };

  // Change item
  const handleChangeItem = (index, key, value) => {
    const items = [...newOrderItems];
    items[index][key] = key === "quantity" || key === "price" ? Number(value) : value;
    setNewOrderItems(items);
  };

  // Create or update order
  const handleCreateOrUpdateOrder = async () => {
    const amount = newOrderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const payload = {
      table: selectedTable || null,
      items: newOrderItems,
      amount,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      notes: customerInfo.notes
    };

    try {
      if (editingOrderId) {
        await updateOrder(editingOrderId, payload);
        setEditingOrderId(null);
      } else {
        await createOrder(payload);
      }
      resetForm();
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit order
  const handleEdit = (order) => {
    setEditingOrderId(order._id);
    setSelectedTable(order.table?._id || "");
    setNewOrderItems(order.items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })));
    setCustomerInfo({
      name: order.customerName || "",
      phone: order.customerPhone || "",
      notes: order.notes || ""
    });
    setIsFormOpen(true);
  };

  // Delete order
  const handleDelete = async (id, orderId) => {
    if (window.confirm(`Are you sure you want to delete order #${orderId}?`)) {
      await deleteOrder(id);
      fetchOrders();
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrder(orderId, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return newOrderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  // Reset form
  const resetForm = () => {
    setEditingOrderId(null);
    setNewOrderItems([{ name: "", quantity: 1, price: 0 }]);
    setSelectedTable("");
    setCustomerInfo({ name: "", phone: "", notes: "" });
    setIsFormOpen(false);
  };

  // Toggle view order
  const toggleViewOrder = (orderId) => {
    setViewOrderId(viewOrderId === orderId ? null : orderId);
  };

  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table?.tableNumber?.toString().includes(searchQuery) ||
      false;
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((acc, o) => acc + o.amount, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    preparingOrders: orders.filter(o => o.status === 'preparing').length,
    readyOrders: orders.filter(o => o.status === 'ready').length,
    servedOrders: orders.filter(o => o.status === 'served').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg">
              <FaShoppingCart className="text-lg" />
            </div>
            <div>
              <div>Order Management</div>
              <div className="text-sm text-gray-400">Manage restaurant orders efficiently</div>
            </div>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            <FaPlus className="mr-2" /> New Order
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-sm text-gray-400">Total Orders</div>
          <div className="text-lg font-bold">{stats.totalOrders}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-sm text-gray-400">Revenue</div>
          <div className="text-lg font-bold text-green-400">₹{stats.totalRevenue.toLocaleString()}</div>
        </div>
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className={`bg-gray-800 rounded-lg p-3 border-l-2 ${config.color.split(' ')[0]}`}>
            <div className="text-sm text-gray-400">{config.label}</div>
            <div className="text-lg font-bold">{orders.filter(o => o.status === key).length}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {statusConfig[status]?.label || status}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendar className="text-gray-400" />
          <select className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option>Today</option>
            <option>Yesterday</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <button className="flex items-center text-sm text-gray-400 hover:text-white">
            <FaDownload className="mr-1" /> Export
          </button>
          <button className="flex items-center text-sm text-gray-400 hover:text-white">
            <FaPrint className="mr-1" /> Print
          </button>
          <button
            onClick={fetchOrders}
            className="flex items-center text-sm text-gray-400 hover:text-white"
          >
            <FaCheckCircle className="mr-1" /> Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                
                return (
                  <tr key={order._id} className="hover:bg-gray-750 transition duration-150">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg mr-3 flex items-center justify-center">
                          <span className="font-bold text-purple-300">#{order.orderId?.slice(-3)}</span>
                        </div>
                        <div>
                          <div className="font-medium">Order #{order.orderId}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <FaTable className="text-xs" />
                            {order.table?.tableNumber || "Takeaway"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      {viewOrderId === order._id && (
                        <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                          <div className="text-sm font-medium mb-2">Order Items:</div>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm text-gray-300 py-1">
                              <span>{item.name} ×{item.quantity}</span>
                              <span className="text-green-400">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 py-3">
                      {order.customerName ? (
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-gray-400">{order.customerPhone}</div>
                          {order.notes && (
                            <div className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                              <FaComments className="mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{order.notes}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">Walk-in</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status?.color || 'bg-gray-700'} border-0 focus:ring-0`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {statusConfig[s]?.label || s}
                            </option>
                          ))}
                        </select>
                        {status?.icon}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="text-lg font-bold text-green-400">₹{order.amount}</div>
                      <button
                        onClick={() => toggleViewOrder(order._id)}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mt-1"
                      >
                        <FaEye className="text-xs" />
                        {viewOrderId === order._id ? 'Hide Items' : 'Show Items'}
                      </button>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(order)}
                          className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit order"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id, order.orderId)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Delete order"
                        >
                          <FaTrash />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Generate Bill"
                        >
                          <FaFileInvoiceDollar />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FaClipboardList className="text-4xl mb-3 opacity-50" />
                      <h3 className="text-lg font-medium text-gray-300 mb-2">No orders found</h3>
                      <p className="text-gray-500">
                        {searchQuery || statusFilter !== "all" 
                          ? "No orders match your filters" 
                          : "Create your first order to get started"}
                      </p>
                      <button
                        onClick={() => setIsFormOpen(true)}
                        className="mt-4 flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                      >
                        <FaPlus className="mr-2" /> Create Order
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Order Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingOrderId ? "Edit Order" : "Create New Order"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {editingOrderId ? "Update order details" : "Add a new order to the system"}
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Customer Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Customer name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Table Selection & Notes */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Table Selection
                    </label>
                    <select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">📦 Takeaway (No Table)</option>
                      {tables.map((t) => (
                        <option key={t._id} value={t._id}>
                          Table {t.tableNumber} ({t.seats} seats)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes
                    </label>
                    <div className="relative">
                      <FaComments className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        placeholder="Special instructions or notes..."
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                        rows="2"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Order Items</h3>
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    <FaPlusCircle /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newOrderItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center p-3 bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => handleChangeItem(idx, "name", e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleChangeItem(idx, "quantity", e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-center focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-32">
                        <div className="relative">
                          <FaRupeeSign className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                          <input
                            type="number"
                            placeholder="Price"
                            min="0"
                            value={item.price}
                            onChange={(e) => handleChangeItem(idx, "price", e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                        disabled={newOrderItems.length <= 1}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-gray-700 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400">Total Items</div>
                    <div className="text-lg font-bold">{newOrderItems.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Subtotal</div>
                    <div className="text-lg font-bold">₹{calculateTotal()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Tax (5%)</div>
                    <div className="text-lg font-bold">₹{(calculateTotal() * 0.05).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Total</div>
                    <div className="text-2xl font-bold text-green-400">
                      ₹{(calculateTotal() * 1.05).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-700 text-gray-300 hover:text-white font-medium rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrUpdateOrder}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                >
                  {editingOrderId ? "Update Order" : "Create Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

