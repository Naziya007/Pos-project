import { useState, useEffect } from "react";
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../api.js";

import { 
  MdOutlineFastfood, 
  MdLocalDining, 
  MdOutlineRiceBowl, 
  MdOutlineBakeryDining, 
  MdLocalCafe, 
  MdOutlineIcecream,
  MdQrCode,
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdOutlineCategory,
  MdOutlineInventory2,
  MdFileUpload
} from 'react-icons/md';

const categories = [
  "Starter",
  "Main Course",
  "Beverages",
  "Rice & Biryani",
  "Desserts",
  "Breads",
];

// Get icon for category
const getCategoryIcon = (category) => {
  switch(category) {
    case "Starter": return <MdOutlineFastfood />;
    case "Main Course": return <MdLocalDining />;
    case "Beverages": return <MdLocalCafe />;
    case "Rice & Biryani": return <MdOutlineRiceBowl />;
    case "Desserts": return <MdOutlineIcecream />;
    case "Breads": return <MdOutlineBakeryDining />;
    default: return <MdOutlineCategory />;
  }
};

export default function POSMenu() {
  const [selectedCat, setSelectedCat] = useState("Starter");
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    variants: [],
    status: "Available",
  });

  const [variantInput, setVariantInput] = useState({ name: "", price: "" });

  // LOAD MENU
  const loadItems = async () => {
    setIsLoading(true);
    try {
      const res = await getMenu(selectedCat);
      setItems(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [selectedCat]);

  // ADD VARIANT
  const addVariant = () => {
    if (variantInput.name && variantInput.price) {
      setForm({
        ...form,
        variants: [...form.variants, { ...variantInput }],
      });
      setVariantInput({ name: "", price: "" });
    }
  };

  // REMOVE VARIANT
  const removeVariant = (index) => {
    setForm({
      ...form,
      variants: form.variants.filter((_, i) => i !== index),
    });
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, category: selectedCat };

    try {
      if (editId) {
        await updateMenuItem(editId, payload);
        setEditId(null);
      } else {
        await createMenuItem(payload);
      }

      setForm({ name: "", price: "", variants: [], status: "Available" });
      setShowForm(false);
      loadItems();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status style
  const getStatusStyle = (status) => {
    return status === "Available"
      ? "bg-green-700 text-green-300 px-3 py-1 rounded-full text-sm font-medium"
      : "bg-red-700 text-red-300 px-3 py-1 rounded-full text-sm font-medium";
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      name: item.name,
      price: item.price,
      variants: item.variants,
      status: item.status,
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteMenuItem(id);
      loadItems();
    }
  };

  // Reset form
  const resetForm = () => {
    setEditId(null);
    setForm({ name: "", price: "", variants: [], status: "Available" });
    setShowForm(false);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-gray-400 mt-1">Manage your restaurant menu items</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
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
            <MdAdd className="mr-2 text-xl" /> Add Item
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* --- Top Tabs & Controls --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-700">
          <div className="flex flex-wrap items-center gap-4 mb-4 sm:mb-0">
            <button className="text-sm font-medium border-b-2 border-purple-500 pb-2 flex items-center">
              <MdOutlineInventory2 className="mr-2" /> Menu Items
            </button>
            <button className="text-sm text-gray-400 hover:text-white pb-2 flex items-center">
              <MdQrCode className="mr-2" /> Generate QR
            </button>
            <button className="text-sm text-gray-400 hover:text-white pb-2 flex items-center">
              <MdFileUpload className="mr-2" /> Import CSV
            </button>
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-white font-medium">{selectedCat}</span> • {items.length} items
          </div>
        </div>

        {/* --- Categories Grid --- */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div
                key={category}
                className={`flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedCat === category
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/50'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedCat(category)}
              >
                <div className="text-3xl mb-2">{getCategoryIcon(category)}</div>
                <p className="font-semibold text-center">{category}</p>
                <small className="text-gray-300 mt-1">
                  {items.filter(item => item.category === category).length} items
                </small>
              </div>
            ))}
          </div>
        </div>

        {/* --- Items Table Section --- */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {selectedCat} Items
              <span className="ml-2 text-gray-400 font-normal">({filteredItems.length})</span>
            </h3>
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-400">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr className="text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Variants</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-750 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg mr-4 flex items-center justify-center">
                          <span className="text-xl font-bold text-purple-300">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-base font-medium text-white">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-400 mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-white">₹{item.price}</div>
                      {item.variants.length > 0 && (
                        <div className="text-sm text-gray-400 mt-1">
                          Base price
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {item.variants.map((v, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 bg-gray-700 px-3 py-1.5 rounded-lg text-sm border border-gray-600"
                          >
                            <span className="text-gray-300">{v.name}</span>
                            <span className="text-gray-400">-</span>
                            <span className="font-semibold text-green-400">₹{v.price}</span>
                          </div>
                        ))}
                        {item.variants.length === 0 && (
                          <span className="text-gray-500 text-sm">No variants</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={getStatusStyle(item.status)}>
                        {item.status === "Available" ? "Available" : "Out of Stock"}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          title="Edit"
                          className="text-gray-400 hover:text-yellow-400 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.name)}
                          title="Delete"
                          className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <MdDelete className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredItems.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <MdOutlineFastfood className="text-5xl mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No items found</h3>
                        <p className="text-gray-500">
                          {searchQuery 
                            ? "No items match your search" 
                            : `Add your first item to ${selectedCat} category`}
                        </p>
                        <button
                          onClick={() => setShowForm(true)}
                          className="mt-4 flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                          <MdAdd className="mr-2" /> Add Item
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Add/Edit Item Modal/Form --- */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editId ? "Edit Menu Item" : "Add New Menu Item"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {editId ? "Update existing item details" : "Add a new item to your menu"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="e.g., Chicken Tikka Masala"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Base Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Status Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                {/* Category Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                    <div className="text-xl text-purple-400">
                      {getCategoryIcon(selectedCat)}
                    </div>
                    <span className="font-medium text-white">{selectedCat}</span>
                  </div>
                </div>
              </div>

              {/* Variants Section */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Add Variants (Optional)
                </label>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input
                    placeholder="Variant name (e.g., Small, Medium, Large)"
                    value={variantInput.name}
                    onChange={(e) =>
                      setVariantInput({ ...variantInput, name: e.target.value })
                    }
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={variantInput.price}
                    onChange={(e) =>
                      setVariantInput({ ...variantInput, price: e.target.value })
                    }
                    className="w-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />

                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Add Variant
                  </button>
                </div>

                {/* Variants List */}
                {form.variants.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Added Variants</h4>
                    <div className="flex flex-wrap gap-3">
                      {form.variants.map((v, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 px-4 py-2.5 rounded-lg border border-blue-800/50"
                        >
                          <div>
                            <span className="font-medium text-white">{v.name}</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="font-bold text-blue-300">₹{v.price}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVariant(i)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-900/20 rounded"
                            aria-label="Remove variant"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4">
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
                    {editId ? "Update Item" : "Add Item"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}