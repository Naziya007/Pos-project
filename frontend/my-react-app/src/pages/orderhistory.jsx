import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Table,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Download,
  Eye,
  Printer,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BarChart,
  TrendingUp,
  TrendingDown,
  Hash,
  Package,
  CreditCard,
  MapPin
} from 'lucide-react';

// --- Mock Order Data ---
const dummyOrders = [
  {
    id: 1001,
    orderId: 'ORD-2024-001',
    customerName: 'John Doe',
    customerPhone: '+91 9876543210',
    table: 'Table 5',
    items: [
      { name: 'Paneer Tikka', quantity: 2, price: 249 },
      { name: 'Butter Chicken', quantity: 1, price: 329 },
      { name: 'Garlic Naan', quantity: 3, price: 79 }
    ],
    subtotal: 1234,
    gst: 222.12,
    total: 1456.12,
    status: 'completed',
    paymentMethod: 'Credit Card',
    orderType: 'Dine-in',
    date: '2024-03-15',
    time: '19:30',
    server: 'Mike',
    notes: 'Extra spicy'
  },
  {
    id: 1002,
    orderId: 'ORD-2024-002',
    customerName: 'Sarah Smith',
    customerPhone: '+91 9876543211',
    table: 'Takeaway',
    items: [
      { name: 'Chicken Wings', quantity: 1, price: 299 },
      { name: 'Coke', quantity: 2, price: 49 }
    ],
    subtotal: 397,
    gst: 71.46,
    total: 468.46,
    status: 'completed',
    paymentMethod: 'Cash',
    orderType: 'Takeaway',
    date: '2024-03-15',
    time: '20:15',
    server: 'Lisa',
    notes: ''
  },
  {
    id: 1003,
    orderId: 'ORD-2024-003',
    customerName: 'Robert Johnson',
    customerPhone: '+91 9876543212',
    table: 'Table 3',
    items: [
      { name: 'Veg Biryani', quantity: 2, price: 249 },
      { name: 'Mushroom Manchurian', quantity: 1, price: 179 },
      { name: 'Spring Rolls', quantity: 1, price: 179 },
      { name: 'Coke', quantity: 3, price: 49 }
    ],
    subtotal: 994,
    gst: 178.92,
    total: 1172.92,
    status: 'pending',
    paymentMethod: 'Pending',
    orderType: 'Dine-in',
    date: '2024-03-15',
    time: '21:00',
    server: 'Mike',
    notes: 'No onions'
  },
  {
    id: 1004,
    orderId: 'ORD-2024-004',
    customerName: 'Emma Wilson',
    customerPhone: '+91 9876543213',
    table: 'Table 7',
    items: [
      { name: 'Fish Fingers', quantity: 2, price: 349 },
      { name: 'Crispy Corn', quantity: 1, price: 189 },
      { name: 'Chocolate Brownie', quantity: 2, price: 199 }
    ],
    subtotal: 1485,
    gst: 267.30,
    total: 1752.30,
    status: 'cancelled',
    paymentMethod: 'Refunded',
    orderType: 'Dine-in',
    date: '2024-03-14',
    time: '18:45',
    server: 'John',
    notes: 'Allergic to nuts'
  },
  {
    id: 1005,
    orderId: 'ORD-2024-005',
    customerName: 'David Brown',
    customerPhone: '+91 9876543214',
    table: 'Table 2',
    items: [
      { name: 'Masala Dosa', quantity: 3, price: 149 },
      { name: 'Butter Chicken', quantity: 1, price: 329 },
      { name: 'Coke', quantity: 2, price: 49 }
    ],
    subtotal: 874,
    gst: 157.32,
    total: 1031.32,
    status: 'completed',
    paymentMethod: 'UPI',
    orderType: 'Dine-in',
    date: '2024-03-14',
    time: '20:30',
    server: 'Lisa',
    notes: ''
  },
  {
    id: 1006,
    orderId: 'ORD-2024-006',
    customerName: 'Priya Sharma',
    customerPhone: '+91 9876543215',
    table: 'Takeaway',
    items: [
      { name: 'Paneer Tikka', quantity: 1, price: 249 },
      { name: 'Garlic Naan', quantity: 4, price: 79 },
      { name: 'Veg Biryani', quantity: 2, price: 249 }
    ],
    subtotal: 1091,
    gst: 196.38,
    total: 1287.38,
    status: 'preparing',
    paymentMethod: 'Credit Card',
    orderType: 'Takeaway',
    date: '2024-03-14',
    time: '19:15',
    server: 'Mike',
    notes: 'Delivery by 8 PM'
  },
  {
    id: 1007,
    orderId: 'ORD-2024-007',
    customerName: 'Amit Patel',
    customerPhone: '+91 9876543216',
    table: 'Table 4',
    items: [
      { name: 'Chicken Wings', quantity: 2, price: 299 },
      { name: 'Fish Fingers', quantity: 1, price: 349 },
      { name: 'Coke', quantity: 4, price: 49 }
    ],
    subtotal: 1343,
    gst: 241.74,
    total: 1584.74,
    status: 'completed',
    paymentMethod: 'Cash',
    orderType: 'Dine-in',
    date: '2024-03-13',
    time: '21:45',
    server: 'John',
    notes: ''
  },
  {
    id: 1008,
    orderId: 'ORD-2024-008',
    customerName: 'Sneha Gupta',
    customerPhone: '+91 9876543217',
    table: 'Table 1',
    items: [
      { name: 'Mushroom Manchurian', quantity: 1, price: 179 },
      { name: 'Spring Rolls', quantity: 1, price: 179 },
      { name: 'Crispy Corn', quantity: 1, price: 189 }
    ],
    subtotal: 547,
    gst: 98.46,
    total: 645.46,
    status: 'completed',
    paymentMethod: 'UPI',
    orderType: 'Dine-in',
    date: '2024-03-13',
    time: '20:00',
    server: 'Lisa',
    notes: 'Less oil'
  }
];

const statusOptions = ['all', 'completed', 'pending', 'preparing', 'cancelled'];
const orderTypeOptions = ['all', 'dine-in', 'takeaway'];
const paymentMethodOptions = ['all', 'cash', 'credit card', 'upi'];

const OrderHistory = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOrderType, setFilterOrderType] = useState('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'pending': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'preparing': return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'cancelled': return 'bg-red-900/30 text-red-300 border-red-700';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} />;
      case 'pending': return <ClockIcon size={14} />;
      case 'preparing': return <AlertCircle size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return null;
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesOrderType = filterOrderType === 'all' || order.orderType.toLowerCase() === filterOrderType;
    const matchesPaymentMethod = filterPaymentMethod === 'all' || order.paymentMethod.toLowerCase().includes(filterPaymentMethod);
    const matchesDate = !selectedDate || order.date === selectedDate;

    return matchesSearch && matchesStatus && matchesOrderType && matchesPaymentMethod && matchesDate;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = `${a.date} ${a.time}`;
        bValue = `${b.date} ${b.time}`;
        break;
      case 'total':
        aValue = a.total;
        bValue = b.total;
        break;
      case 'customer':
        aValue = a.customerName.toLowerCase();
        bValue = b.customerName.toLowerCase();
        break;
      default:
        aValue = a.id;
        bValue = b.id;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Calculate stats
  const calculateStats = () => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
    const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
    
    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue: totalRevenue.toFixed(2),
      averageOrderValue: averageOrderValue.toFixed(2)
    };
  };

  const stats = calculateStats();

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterOrderType('all');
    setFilterPaymentMethod('all');
    setSelectedDate('');
  };

  // Export data (dummy function)
  const exportData = () => {
    alert('Exporting order data...');
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg">
            <Calendar className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Order History</h1>
            <p className="text-gray-400 text-sm">View and manage all past orders</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition duration-200"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition duration-200"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <BarChart className="text-3xl text-gray-600" />
          </div>
          <div className="mt-2 text-xs text-gray-500">All time orders</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl border border-green-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-400">{stats.completedOrders}</p>
            </div>
            <CheckCircle className="text-3xl text-green-600" />
          </div>
          <div className="mt-2 text-xs text-gray-500">Successfully served</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl border border-yellow-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendingOrders}</p>
            </div>
            <ClockIcon className="text-3xl text-yellow-600" />
          </div>
          <div className="mt-2 text-xs text-gray-500">Awaiting completion</div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border border-purple-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-400">₹{stats.totalRevenue}</p>
            </div>
            <DollarSign className="text-3xl text-purple-600" />
          </div>
          <div className="mt-2 text-xs text-gray-500">From completed orders</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Search Orders</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Order ID, Customer, Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Order Type Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Order Type</label>
            <div className="flex flex-wrap gap-2">
              {orderTypeOptions.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterOrderType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                    filterOrderType === type
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <p className="text-sm text-gray-400">{filteredOrders.length} orders found</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white"
              >
                <option value="all">All Payments</option>
                <option value="cash">Cash</option>
                <option value="credit card">Credit Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Package className="text-5xl mx-auto mb-4 opacity-50" />
            <p className="text-lg">No orders found</p>
            <p className="text-sm">Try changing your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      Date & Time
                      {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    <button
                      onClick={() => handleSort('customer')}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      Customer
                      {sortBy === 'customer' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Table / Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    <button
                      onClick={() => handleSort('total')}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      Amount
                      {sortBy === 'total' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-900/50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-500" />
                            <span>{order.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock size={12} />
                            <span>{order.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <User size={14} className="text-gray-500" />
                            {order.customerName}
                          </div>
                          <div className="text-xs text-gray-400">{order.customerPhone}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {order.table === 'Takeaway' ? (
                            <MapPin size={14} className="text-blue-500" />
                          ) : (
                            <Table size={14} className="text-green-500" />
                          )}
                          <div>
                            <div>{order.table}</div>
                            <div className="text-xs text-gray-400 capitalize">{order.orderType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Package size={14} className="text-gray-500" />
                            <span>{order.items.length} items</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {order.items[0].name} {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-green-500" />
                          <span className="font-bold text-green-400">₹{order.total.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.paymentMethod}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded"
                            title="View Details"
                          >
                            {expandedOrder === order.id ? <ChevronUp size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            className="p-1.5 bg-blue-900/30 hover:bg-blue-900/50 rounded border border-blue-700"
                            title="Print Receipt"
                          >
                            <Printer size={16} className="text-blue-400" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Order Details */}
                    {expandedOrder === order.id && (
                      <tr className="bg-gray-900/50">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Order Details */}
                              <div>
                                <h4 className="font-medium mb-3 text-gray-300 flex items-center gap-2">
                                  <Hash size={16} />
                                  Order Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Order ID:</span>
                                    <span className="font-medium">{order.orderId}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Date:</span>
                                    <span>{order.date} at {order.time}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Server:</span>
                                    <span>{order.server}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Order Type:</span>
                                    <span className="capitalize">{order.orderType}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Customer Details */}
                              <div>
                                <h4 className="font-medium mb-3 text-gray-300 flex items-center gap-2">
                                  <User size={16} />
                                  Customer Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Name:</span>
                                    <span className="font-medium">{order.customerName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Phone:</span>
                                    <span>{order.customerPhone}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Table:</span>
                                    <span>{order.table}</span>
                                  </div>
                                  {order.notes && (
                                    <div>
                                      <span className="text-gray-400">Notes:</span>
                                      <div className="mt-1 p-2 bg-gray-900 rounded border border-gray-700">
                                        {order.notes}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h4 className="font-medium mb-3 text-gray-300 flex items-center gap-2">
                                  <Package size={16} />
                                  Order Items ({order.items.length})
                                </h4>
                                <div className="space-y-2">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm p-2 bg-gray-900 rounded">
                                      <div>
                                        <span className="font-medium">{item.name}</span>
                                        <div className="text-xs text-gray-400">Quantity: {item.quantity}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-green-400">₹{(item.price * item.quantity).toFixed(2)}</div>
                                        <div className="text-xs text-gray-400">₹{item.price.toFixed(2)} each</div>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* Order Summary */}
                                  <div className="pt-3 border-t border-gray-700 text-sm">
                                    <div className="flex justify-between mb-1">
                                      <span className="text-gray-400">Subtotal:</span>
                                      <span>₹{order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-gray-400">GST (18%):</span>
                                      <span>₹{order.gst.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                                      <span>Total:</span>
                                      <span className="text-green-400">₹{order.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        <div className="p-4 border-t border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
              Previous
            </button>
            <span className="text-sm">Page 1 of 1</span>
            <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <h3 className="font-medium mb-4 text-gray-300">Revenue Overview</h3>
          <div className="h-48 flex items-center justify-center text-gray-500">
            <BarChart className="text-5xl opacity-50" />
            <div className="ml-4">
              <p>Revenue chart would appear here</p>
              <p className="text-sm">(Chart implementation)</p>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <h3 className="font-medium mb-4 text-gray-300">Order Status Distribution</h3>
          <div className="space-y-3">
            {['completed', 'pending', 'preparing', 'cancelled'].map(status => {
              const count = orders.filter(o => o.status === status).length;
              const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'pending' ? 'bg-yellow-500' :
                        status === 'preparing' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="capitalize">{status}</span>
                    </div>
                    <div className="text-gray-300">
                      {count} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'pending' ? 'bg-yellow-500' :
                        status === 'preparing' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;