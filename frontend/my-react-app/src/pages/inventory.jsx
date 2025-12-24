import { useEffect, useState } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api.js";

import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdInventory2,
  MdCategory,
  MdLocalOffer,
  MdTrendingUp,
  MdWarning,
  MdCheckCircle,
  MdRefresh,
  MdFilterList,
  MdPrint,
  MdDownload,
} from 'react-icons/md';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    unit: "pcs",
    supplier: "",
    lowStockThreshold: 5,
  });

  const units = ["pcs", "kg", "g", "l", "ml", "pack", "dozen", "box", "bottle"];
  const categories = [
    "Vegetables",
    "Fruits",
    "Dairy",
    "Meat",
    "Beverages",
    "Spices",
    "Grains",
    "Packaged",
    "Cleaning",
    "Utensils",
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (productsData) => {
    const totalItems = productsData.length;
    const lowStock = productsData.filter(
      (p) => p.stock <= p.lowStockThreshold && p.stock > 0
    ).length;
    const outOfStock = productsData.filter((p) => p.stock <= 0).length;
    const totalValue = productsData.reduce((sum, p) => sum + (p.price * p.stock), 0);

    setStats({
      totalItems,
      lowStock,
      outOfStock,
      totalValue,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateProduct(editId, formData);
        setEditId(null);
      } else {
        await createProduct(formData);
      }
      setFormData({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        unit: "pcs",
        supplier: "",
        lowStockThreshold: 5,
      });
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      supplier: product.supplier,
      lowStockThreshold: product.lowStockThreshold,
    });
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: "",
      sku: "",
      category: "",
      price: "",
      stock: "",
      unit: "pcs",
      supplier: "",
      lowStockThreshold: 5,
    });
    setShowForm(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStyle = (stock, threshold) => {
    if (stock <= 0) return "bg-red-700 text-red-300 px-3 py-1 rounded-full text-sm font-medium";
    if (stock <= threshold) return "bg-yellow-700 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium";
    return "bg-green-700 text-green-300 px-3 py-1 rounded-full text-sm font-medium";
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <MdInventory2 className="text-purple-400 text-3xl" />
            Inventory Management
          </h1>
          <p className="text-gray-400 mt-1">Manage your restaurant inventory items</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
            />
            <MdSearch className="absolute left-3 top-2.5 text-gray-400 text-xl" />
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            <MdAdd className="mr-2 text-xl" /> Add Product
          </button>
          
          <button
            onClick={fetchProducts}
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            <MdRefresh className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Total Items</p>
              <p className="text-2xl font-bold mt-1">{stats.totalItems}</p>
            </div>
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <MdInventory2 className="text-2xl text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-2xl font-bold mt-1">₹{stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-900/30 rounded-lg">
              <MdTrendingUp className="text-2xl text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Low Stock</p>
              <p className="text-2xl font-bold mt-1">{stats.lowStock}</p>
            </div>
            <div className="p-3 bg-yellow-900/30 rounded-lg">
              <MdWarning className="text-2xl text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Out of Stock</p>
              <p className="text-2xl font-bold mt-1">{stats.outOfStock}</p>
            </div>
            <div className="p-3 bg-red-900/30 rounded-lg">
              <MdWarning className="text-2xl text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-semibold">Inventory Items</h2>
            <p className="text-gray-400 text-sm mt-1">
              {filteredProducts.length} of {products.length} items
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button className="flex items-center text-sm text-gray-400 hover:text-white">
              <MdFilterList className="mr-2" /> Filter
            </button>
            <button className="flex items-center text-sm text-gray-400 hover:text-white">
              <MdPrint className="mr-2" /> Print
            </button>
            <button className="flex items-center text-sm text-gray-400 hover:text-white">
              <MdDownload className="mr-2" /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-400">Loading inventory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr className="text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-750 transition duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg mr-4 flex items-center justify-center">
                            <span className="text-xl font-bold text-purple-300">
                              {p.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-base font-medium text-white">{p.name}</p>
                            <p className="text-sm text-gray-400 mt-0.5">{p.unit}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <code className="bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                          {p.sku}
                        </code>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MdCategory className="text-gray-400" />
                          <span>{p.category}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MdLocalOffer className="text-green-400" />
                          <span className="text-lg font-bold text-white">₹{p.price}</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          ₹{(p.price * p.stock).toLocaleString()} total
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span className={getStockStyle(p.stock, p.lowStockThreshold)}>
                            {p.stock <= 0 ? "Out of Stock" : 
                             p.stock <= p.lowStockThreshold ? "Low Stock" : 
                             "In Stock"}
                          </span>
                          <div className="text-sm">
                            <div className="flex justify-between text-gray-400">
                              <span>Stock:</span>
                              <span className="font-medium">{p.stock} {p.unit}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 mt-1">
                              <span>Threshold:</span>
                              <span>{p.lowStockThreshold}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-white">{p.supplier}</p>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            title="Edit"
                            className="text-gray-400 hover:text-yellow-400 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <MdEdit className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            title="Delete"
                            className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <MdDelete className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <MdInventory2 className="text-5xl mb-4 opacity-50" />
                          <h3 className="text-lg font-medium text-gray-300 mb-2">No products found</h3>
                          <p className="text-gray-500 mb-4">
                            {searchQuery 
                              ? "No products match your search" 
                              : "Add your first product to inventory"}
                          </p>
                          <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                          >
                            <MdAdd className="mr-2" /> Add Product
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editId ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {editId ? "Update product details" : "Add a new product to inventory"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="name"
                    placeholder="e.g., Chicken Breast"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="sku"
                    placeholder="e.g., CHKN-BRST-001"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">₹</span>
                    <input
                      required
                      type="number"
                      name="price"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    name="stock"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                {/* Supplier */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Supplier
                  </label>
                  <input
                    name="supplier"
                    placeholder="e.g., ABC Suppliers"
                    value={formData.supplier}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Low Stock Threshold */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    placeholder="5"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-700 text-gray-300 hover:text-white font-medium rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                >
                  {editId ? (
                    <span className="flex items-center gap-2">
                      <MdCheckCircle className="text-xl" />
                      Update Product
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <MdAdd className="text-xl" />
                      Add Product
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

