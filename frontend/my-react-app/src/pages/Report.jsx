import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Printer,
  Eye,
  ChevronDown,
  ChevronUp,
  Hash,
  Package,
  CreditCard,
  MapPin,
  ShoppingCart,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock as ClockIcon,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Target,
  Award,
  Star,
  Trophy,
  Activity,
  Table,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';

// --- Mock Data ---
const salesData = [
  { day: 'Mon', sales: 23450, orders: 45 },
  { day: 'Tue', sales: 31200, orders: 52 },
  { day: 'Wed', sales: 29850, orders: 48 },
  { day: 'Thu', sales: 41500, orders: 67 },
  { day: 'Fri', sales: 48700, orders: 78 },
  { day: 'Sat', sales: 52300, orders: 85 },
  { day: 'Sun', sales: 38900, orders: 62 }
];

const categoryData = [
  { category: 'Starters', sales: 145200, percentage: 25, items: 12 },
  { category: 'Main Course', sales: 278400, percentage: 48, items: 18 },
  { category: 'Beverages', sales: 89200, percentage: 15, items: 8 },
  { category: 'Desserts', sales: 48600, percentage: 8, items: 6 },
  { category: 'Breads', sales: 34800, percentage: 6, items: 5 }
];

const paymentMethodData = [
  { method: 'Cash', amount: 246800, percentage: 45, count: 320 },
  { method: 'Credit Card', amount: 178900, percentage: 32, count: 215 },
  { method: 'UPI', amount: 123500, percentage: 22, count: 185 },
  { method: 'Wallet', amount: 15800, percentage: 3, count: 28 }
];

const topSellingItems = [
  { id: 1, name: 'Butter Chicken', sales: 123, revenue: 40590, growth: 12 },
  { id: 2, name: 'Paneer Tikka', sales: 98, revenue: 24402, growth: 8 },
  { id: 3, name: 'Veg Biryani', sales: 87, revenue: 21663, growth: 15 },
  { id: 4, name: 'Chicken Wings', sales: 76, revenue: 22724, growth: -3 },
  { id: 5, name: 'Coke', sales: 145, revenue: 7105, growth: 5 },
  { id: 6, name: 'Garlic Naan', sales: 112, revenue: 8848, growth: 22 },
  { id: 7, name: 'Chocolate Brownie', sales: 68, revenue: 13532, growth: 18 },
  { id: 8, name: 'Masala Dosa', sales: 54, revenue: 8046, growth: 7 }
];

const timePeriods = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'This Quarter', 'Last Quarter', 'This Year', 'Last Year'];
const reportTypes = ['Sales Report', 'Order Report', 'Inventory Report', 'Customer Report', 'Staff Report', 'Financial Report'];

const ReportsAndAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [selectedReport, setSelectedReport] = useState('Sales Report');
  const [dateRange, setDateRange] = useState({ start: '2024-03-01', end: '2024-03-15' });
  const [viewMode, setViewMode] = useState('overview');
  const [expandedSection, setExpandedSection] = useState(null);

  // Stats Calculations
  const totalRevenue = 587500;
  const totalOrders = 437;
  const avgOrderValue = Math.round(totalRevenue / totalOrders);
  const customerCount = 289;
  const peakHour = '19:00 - 21:00';
  const popularTable = 'Table 5';

  // Growth Calculations
  const revenueGrowth = 12.5;
  const ordersGrowth = 8.3;
  const customerGrowth = 5.7;
  const avgOrderGrowth = 3.2;

  // Top stats
  const topStats = [
    { 
      title: 'Total Revenue', 
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      growth: revenueGrowth,
      trend: revenueGrowth >= 0 ? 'up' : 'down'
    },
    { 
      title: 'Total Orders', 
      value: totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      growth: ordersGrowth,
      trend: ordersGrowth >= 0 ? 'up' : 'down'
    },
    { 
      title: 'Avg Order Value', 
      value: `₹${avgOrderValue}`,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      growth: avgOrderGrowth,
      trend: avgOrderGrowth >= 0 ? 'up' : 'down'
    },
    { 
      title: 'Customers Served', 
      value: customerCount,
      icon: Users,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      growth: customerGrowth,
      trend: customerGrowth >= 0 ? 'up' : 'down'
    }
  ];

  // Toggle section
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Export report
  const exportReport = () => {
    alert(`Exporting ${selectedReport}...`);
  };

  // Print report
  const printReport = () => {
    window.print();
  };

  // Refresh data
  const refreshData = () => {
    alert('Refreshing report data...');
  };

  // Get growth color
  const getGrowthColor = (value) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  // Get growth icon
  const getGrowthIcon = (value) => {
    return value >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />;
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg">
            <BarChart3 className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Reports & Analysis</h1>
            <p className="text-gray-400 text-sm">Comprehensive business insights and analytics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition duration-200"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition duration-200"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={printReport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition duration-200"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Report Type</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white appearance-none"
              >
                {reportTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Time Period */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Time Period</label>
            <div className="flex flex-wrap gap-2">
              {timePeriods.slice(0, 6).map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    selectedPeriod === period
                      ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white'
                      : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Custom Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
              <span className="self-center text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {topStats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`text-xl ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${getGrowthColor(stat.growth)}`}>
                {getGrowthIcon(stat.growth)}
                <span>{Math.abs(stat.growth)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              {stat.trend === 'up' ? 'Increase from last period' : 'Decrease from last period'}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-300 flex items-center gap-2">
              <LineChart size={18} className="text-green-400" />
              Sales Trend ({selectedPeriod})
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-400">Orders</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {salesData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex justify-center gap-1 mb-2" style={{ height: '180px' }}>
                  {/* Revenue bar */}
                  <div 
                    className="w-6 bg-gradient-to-t from-green-600 to-green-700 rounded-t-lg relative group"
                    style={{ height: `${(day.sales / 60000) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ₹{day.sales.toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Orders bar */}
                  <div 
                    className="w-6 bg-gradient-to-t from-blue-600 to-blue-700 rounded-t-lg relative group"
                    style={{ height: `${(day.orders / 100) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.orders} orders
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">{day.day}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Best Day</div>
              <div className="font-medium">Saturday</div>
              <div className="text-xs text-green-400">₹52,300 revenue</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Peak Hour</div>
              <div className="font-medium">{peakHour}</div>
              <div className="text-xs text-blue-400">78% of daily sales</div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-300 flex items-center gap-2">
              <PieChart size={18} className="text-purple-400" />
              Category Distribution
            </h3>
            <div className="text-sm text-gray-400">By Revenue</div>
          </div>
          
          <div className="h-48 flex items-center justify-center mb-4">
            {/* Pie Chart Representation */}
            <div className="relative w-40 h-40 rounded-full" style={{
              background: `conic-gradient(
                #10b981 0% ${categoryData[0].percentage}%,
                #3b82f6 ${categoryData[0].percentage}% ${categoryData[0].percentage + categoryData[1].percentage}%,
                #8b5cf6 ${categoryData[0].percentage + categoryData[1].percentage}% ${categoryData[0].percentage + categoryData[1].percentage + categoryData[2].percentage}%,
                #f59e0b ${categoryData[0].percentage + categoryData[1].percentage + categoryData[2].percentage}% ${categoryData[0].percentage + categoryData[1].percentage + categoryData[2].percentage + categoryData[3].percentage}%,
                #ef4444 ${categoryData[0].percentage + categoryData[1].percentage + categoryData[2].percentage + categoryData[3].percentage}% 100%
              )`
            }}>
              <div className="absolute inset-10 bg-gray-800 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold">₹{categoryData.reduce((sum, cat) => sum + cat.sales, 0).toLocaleString().slice(0, -3)}K</div>
                  <div className="text-xs text-gray-400">Total</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {categoryData.map((cat, index) => {
              const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                    <span className="text-sm">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">₹{(cat.sales/1000).toFixed(0)}K</span>
                    <span className="text-xs text-gray-400">{cat.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Items */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-medium text-gray-300 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-400" />
                Top Selling Items
              </h3>
              <button
                onClick={() => toggleSection('topItems')}
                className="text-gray-400 hover:text-white"
              >
                {expandedSection === 'topItems' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Sales Count</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Growth</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {topSellingItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-900/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm">{item.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ShoppingCart size={14} className="text-gray-500" />
                          <span>{item.sales}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-green-400">₹{item.revenue.toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1 ${getGrowthColor(item.growth)}`}>
                          {getGrowthIcon(item.growth)}
                          <span>{Math.abs(item.growth)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {item.growth >= 0 ? (
                          <TrendingUpIcon className="text-green-400" size={18} />
                        ) : (
                          <TrendingDownIcon className="text-red-400" size={18} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {expandedSection === 'topItems' && (
              <div className="p-4 bg-gray-900 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Top items contribute to 68% of total revenue. Consider promoting high-growth items.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <h3 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-400" />
              Payment Methods
            </h3>
            
            <div className="space-y-4">
              {paymentMethodData.map((method, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{method.method}</span>
                    <span>₹{(method.amount/1000).toFixed(0)}K ({method.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{method.count} transactions</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Most Popular</div>
                  <div className="font-medium">Cash</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Avg Transaction</div>
                  <div className="font-medium text-green-400">₹771</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Peak Hours */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <h3 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-orange-400" />
            Peak Hours Analysis
          </h3>
          
          <div className="space-y-3">
            {[
              { time: '12:00 - 14:00', orders: 78, revenue: 145600 },
              { time: '19:00 - 21:00', orders: 124, revenue: 289300 },
              { time: '21:00 - 23:00', orders: 67, revenue: 98700 }
            ].map((peak, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <div>
                  <div className="font-medium">{peak.time}</div>
                  <div className="text-xs text-gray-400">{peak.orders} orders</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">₹{(peak.revenue/1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-400">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table Performance */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <h3 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
            <Table size={18} className="text-green-400" />
            Table Performance
          </h3>
          
          <div className="space-y-3">
            {[
              { table: 'Table 5', turnover: 4.2, revenue: 89200 },
              { table: 'Table 3', turnover: 3.8, revenue: 76500 },
              { table: 'Table 7', turnover: 3.5, revenue: 65400 }
            ].map((table, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-600 to-yellow-700' : 'bg-gray-700'
                  }`}>
                    <span className="font-bold">{table.table.split(' ')[1]}</span>
                  </div>
                  <div>
                    <div className="font-medium">{table.table}</div>
                    <div className="text-xs text-gray-400">{table.turnover} avg turns</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">₹{(table.revenue/1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-400">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <h3 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-purple-400" />
            Quick Insights
          </h3>
          
          <div className="space-y-4">
            <div className="p-3 bg-gray-900 rounded-lg border-l-4 border-green-500">
              <div className="font-medium text-sm">Best Performing Day</div>
              <div className="text-xs text-gray-400">Saturday generates 25% more revenue than weekday average</div>
            </div>
            
            <div className="p-3 bg-gray-900 rounded-lg border-l-4 border-blue-500">
              <div className="font-medium text-sm">Customer Trend</div>
              <div className="text-xs text-gray-400">New customer acquisition increased by 15% this month</div>
            </div>
            
            <div className="p-3 bg-gray-900 rounded-lg border-l-4 border-yellow-500">
              <div className="font-medium text-sm">Menu Optimization</div>
              <div className="text-xs text-gray-400">Top 20% items contribute to 80% of total revenue</div>
            </div>
            
            <div className="p-3 bg-gray-900 rounded-lg border-l-4 border-purple-500">
              <div className="font-medium text-sm">Staff Performance</div>
              <div className="text-xs text-gray-400">Server Mike handles 30% more orders than average</div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Actions */}
      <div className="mt-6 flex justify-center gap-4">
        <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition duration-200 flex items-center gap-2">
          <Download />
          Download Full Report
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-medium transition duration-200 flex items-center gap-2">
          <Eye />
          View Detailed Analysis
        </button>
        <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-medium transition duration-200 flex items-center gap-2">
          <Calendar />
          Schedule Report
        </button>
      </div>
    </div>
  );
};

export default ReportsAndAnalysis;