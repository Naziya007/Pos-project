import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Trash2,
  Minus,
  X,
  Plus,
  Printer,
  Check
} from 'lucide-react';

// --- Mock Data ---
const menuItems = [
  { id: 1, name: 'Paneer Tikka', price: 249.00, size: '2 sizes', category: 'Starters', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Chicken Wings', price: 299.00, size: '3 sizes', category: 'Starters', imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Spring Rolls', price: 179.00, size: '2 sizes', category: 'Starters', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Mushroom Manchurian', price: 179.00, size: '2 sizes', category: 'Starters', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Fish Fingers', price: 349.00, size: '3 sizes', category: 'Starters', imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Crispy Corn', price: 189.00, size: '2 sizes', category: 'Starters', imageUrl: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 7, name: 'Veg Biryani', price: 249.00, size: '4 sizes', category: 'Main Course', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 8, name: 'Coke', price: 49.00, size: '1 size', category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 9, name: 'Butter Chicken', price: 329.00, size: '2 sizes', category: 'Main Course', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 10, name: 'Garlic Naan', price: 79.00, size: '1 piece', category: 'Breads', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 11, name: 'Chocolate Brownie', price: 199.00, size: '1 piece', category: 'Desserts', imageUrl: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 12, name: 'Masala Dosa', price: 149.00, size: '1 piece', category: 'South Indian', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 13, name: 'Mutton Rogan Josh', price: 399.00, size: '2 sizes', category: 'Main Course', imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 14, name: 'Veg Fried Rice', price: 189.00, size: '3 sizes', category: 'Chinese', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 15, name: 'Chocolate Ice Cream', price: 129.00, size: '1 scoop', category: 'Desserts', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
];

const categories = ['All', 'Starters', 'Main Course', 'South Indian', 'Chinese', 'Beverages', 'Desserts', 'Breads'];
const tables = ['Takeaway', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8'];

// --- Main New Order Component ---
const NewOrder = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState('Table 1');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Filter menu items based on category and search
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add item to cart
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = subtotal * 0.18; // 18% GST
  const total = subtotal + gst;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Clear cart
  const clearCart = () => {
    if (cart.length > 0 && window.confirm('Are you sure you want to clear the cart?')) {
      setCart([]);
    }
  };

  // Place order
  const placeOrder = () => {
    if (cart.length === 0) {
      alert('Please add items to cart before placing order');
      return;
    }
    
    const orderDetails = {
      table: selectedTable,
      customer: customerName || 'Walk-in Customer',
      phone: customerPhone,
      items: cart,
      subtotal,
      gst,
      total,
      notes: orderNotes,
      timestamp: new Date().toISOString(),
      orderId: Math.floor(100000 + Math.random() * 900000)
    };

    // In real app, send to backend
    console.log('Order placed:', orderDetails);
    alert(`Order #${orderDetails.orderId} placed successfully!`);
    
    // Print receipt (simulated)
    printReceipt(orderDetails);
    
    // Clear cart
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setOrderNotes('');
  };

  // Print receipt
  const printReceipt = (order) => {
    const receiptContent = `
      POSCLOUD RECEIPT
      Order #${order.orderId}
      Date: ${new Date().toLocaleString()}
      Table: ${order.table}
      Customer: ${order.customer}
      Phone: ${order.phone}
      
      ITEMS:
      ${order.items.map(item => `${item.name} x${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      
      Subtotal: ₹${order.subtotal.toFixed(2)}
      GST (18%): ₹${order.gst.toFixed(2)}
      TOTAL: ₹${order.total.toFixed(2)}
      
      Thank you for visiting!
    `;
    
    console.log('Receipt:', receiptContent);
    // In real app, trigger printer
    window.print(); // Simple print dialog for demo
  };

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      {/* Main Content - Full width without sidebar */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Menu Items (75% width) */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Header with Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">PC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">New Order</h1>
              <p className="text-sm text-gray-400">POSCLOUD Restaurant System</p>
            </div>
          </div>

          {/* Search and Table Selection */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700"
                />
              </div>
              
              {/* Table Selection */}
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-2">Select Table</label>
                <div className="flex flex-wrap gap-2">
                  {tables.map((table) => (
                    <button
                      key={table}
                      onClick={() => setSelectedTable(table)}
                      className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                        selectedTable === table
                          ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {table}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Table Display */}
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 inline-block">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Current Table: </span>
                <span className="font-bold text-purple-300">{selectedTable}</span>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mb-6">
            <div className="flex overflow-x-auto pb-3 scrollbar-hide gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-purple-500/20 transition-all duration-200 hover:scale-[1.02] border border-gray-700"
                onClick={() => addToCart(item)}
              >
                <div className="h-28 overflow-hidden relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white text-xs px-2 py-1 rounded">
                    {item.category}
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm truncate mb-1">{item.name}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-lg font-bold text-green-400">₹{item.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{item.size}</p>
                  </div>
                  <button className="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg text-sm transition duration-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Cart (25% width) */}
        <div className="w-full lg:w-96 xl:w-1/4 bg-gray-800 border-t lg:border-l border-gray-700 flex flex-col">
          <div className="p-4 lg:p-6 flex-1 flex flex-col">
            {/* Cart Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart size={24} />
                Current Order
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">{totalItems} Items</span>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300"
                    title="Clear Cart"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-6 bg-gray-900 p-4 rounded-xl border border-gray-700">
              <h4 className="font-medium mb-3 text-gray-300">Customer Details</h4>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Order Notes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={2}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-400 py-10">
                  <ShoppingCart size={64} className="mb-4 opacity-50" />
                  <p className="font-semibold mb-2">No items in cart</p>
                  <p className="text-sm">Tap items to add</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gray-900 p-3 rounded-xl border border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-800 rounded hover:bg-gray-700"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-800 rounded hover:bg-gray-700"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-gray-400">₹{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">GST (18%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span className="text-green-400 text-xl">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={placeOrder}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-xl font-semibold transition duration-200"
                >
                  <Check size={20} />
                  Place Order
                </button>
                <button
                  onClick={printReceipt}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-semibold transition duration-200"
                >
                  <Printer size={20} />
                  Print Bill
                </button>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t border-gray-700 text-center">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div>
                    <div className="font-medium">Items</div>
                    <div className="text-white font-bold">{totalItems}</div>
                  </div>
                  <div>
                    <div className="font-medium">Table</div>
                    <div className="text-purple-300 font-bold">{selectedTable}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewOrder;