import { useState, useEffect } from "react";
import { getWaste, createWaste, updateWaste, deleteWaste } from "../api.js";

import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdWarning,
  MdTrendingDown,
  MdCalendarToday,
  MdInventory,
  MdAttachMoney,
  MdRefresh,
  MdFilterList,
  MdPrint,
  MdDownload,
  MdInfo,
  MdRecycling,
} from 'react-icons/md';

export default function WasteManagement() {
  const [wasteList, setWasteList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null);
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalLoss: 0,
    todayWaste: 0,
    thisMonthLoss: 0,
  });

  const [form, setForm] = useState({
    item: "",
    qty: "",
    unit: "",
    price: "",
    reason: "",
    date: new Date().toISOString().split('T')[0],
    notes: "",
  });

  const units = ["kg", "g", "l", "ml", "pcs", "pack", "dozen", "box", "bottle"];
  const reasons = [
    "Expired",
    "Damaged",
    "Overproduction",
    "Quality Issue",
    "Accidental Spill",
    "Spoilage",
    "Customer Return",
    "Preparation Waste",
    "Other"
  ];

  const loadWaste = async () => {
    setLoading(true);
    try {
      const res = await getWaste();
      const data = Array.isArray(res.data) ? res.data : [];
      setWasteList(data);
      calculateStats(data);
    } catch (err) {
      console.error("Load Waste Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (wasteData) => {
    const totalRecords = wasteData.length;
    const totalLoss = wasteData.reduce((sum, w) => sum + (w.totalLoss || 0), 0);
    
    const today = new Date().toISOString().split('T')[0];
    const todayWaste = wasteData.filter(w => 
      w.wasteDate && w.wasteDate.split('T')[0] === today
    ).length;
    
    const thisMonth = new Date().getMonth();
    const thisMonthLoss = wasteData
      .filter(w => {
        if (!w.wasteDate) return false;
        const wasteDate = new Date(w.wasteDate);
        return wasteDate.getMonth() === thisMonth;
      })
      .reduce((sum, w) => sum + (w.totalLoss || 0), 0);

    setStats({
      totalRecords,
      totalLoss,
      todayWaste,
      thisMonthLoss,
    });
  };

  useEffect(() => {
    loadWaste();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      itemName: form.item,
      quantity: form.qty,
      unit: form.unit,
      perUnitPrice: Number(form.price),
      totalLoss: Number(form.price) * Number(form.qty.replace(/[^\d.]/g, "")),
      wasteDate: form.date,
      reason: form.reason,
      notes: form.notes,
    };

    try {
      if (editId) {
        await updateWaste(editId, payload);
        setEditId(null);
      } else {
        await createWaste(payload);
      }
      setForm({ 
        item: "", 
        qty: "", 
        unit: "", 
        price: "", 
        reason: "", 
        date: new Date().toISOString().split('T')[0], 
        notes: "" 
      });
      setShowForm(false);
      loadWaste();
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  const handleEdit = (w) => {
    setEditId(w._id);
    setForm({
      item: w.itemName,
      qty: w.quantity,
      unit: w.unit || "",
      price: w.perUnitPrice,
      reason: w.reason,
      date: w.wasteDate ? w.wasteDate.split("T")[0] : new Date().toISOString().split('T')[0],
      notes: w.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id, itemName) => {
    if (confirm(`Are you sure you want to delete waste record for "${itemName}"?`)) {
      await deleteWaste(id);
      loadWaste();
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ 
      item: "", 
      qty: "", 
      unit: "", 
      price: "", 
      reason: "", 
      date: new Date().toISOString().split('T')[0], 
      notes: "" 
    });
    setShowForm(false);
  };

  const filteredWaste = wasteList.filter(w =>
    w.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getReasonStyle = (reason) => {
    const criticalReasons = ["Expired", "Spoilage", "Accidental Spill"];
    const warningReasons = ["Damaged", "Quality Issue", "Overproduction"];
    
    if (criticalReasons.includes(reason)) return "bg-red-700 text-red-300 px-3 py-1 rounded-full text-sm font-medium";
    if (warningReasons.includes(reason)) return "bg-yellow-700 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium";
    return "bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm font-medium";
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <MdWarning className="text-orange-400 text-3xl" />
            Waste Management
          </h1>
          <p className="text-gray-400 mt-1">Track and manage food waste and losses</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search waste records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
            />
            <MdSearch className="absolute left-3 top-2.5 text-gray-400 text-xl" />
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            <MdAdd className="mr-2 text-xl" /> Record Waste
          </button>
          
          <button
            onClick={loadWaste}
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            <MdRefresh className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Total Records</p>
              <p className="text-2xl font-bold mt-1">{stats.totalRecords}</p>
            </div>
            <div className="p-3 bg-red-900/30 rounded-lg">
              <MdWarning className="text-2xl text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-red-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Total Loss</p>
              <p className="text-2xl font-bold mt-1">₹{stats.totalLoss.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-900/30 rounded-lg">
              <MdAttachMoney className="text-2xl text-red-300" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Today's Waste</p>
              <p className="text-2xl font-bold mt-1">{stats.todayWaste} items</p>
            </div>
            <div className="p-3 bg-orange-900/30 rounded-lg">
              <MdCalendarToday className="text-2xl text-orange-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">This Month Loss</p>
              <p className="text-2xl font-bold mt-1">₹{stats.thisMonthLoss.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-900/30 rounded-lg">
              <MdTrendingDown className="text-2xl text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-semibold">Waste Records</h2>
            <p className="text-gray-400 text-sm mt-1">
              {filteredWaste.length} of {wasteList.length} records
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
              <p className="text-gray-400">Loading waste records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr className="text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Unit Price</th>
                    <th className="px-6 py-4">Total Loss</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Notes</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {filteredWaste.map((w) => (
                    <tr key={w._id} className="hover:bg-gray-750 transition duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-red-900 to-orange-900 rounded-lg mr-4 flex items-center justify-center">
                            <span className="text-xl font-bold text-red-300">
                              {w.itemName?.charAt(0).toUpperCase() || "W"}
                            </span>
                          </div>
                          <div>
                            <p className="text-base font-medium text-white">{w.itemName}</p>
                            <p className="text-sm text-gray-400 mt-0.5">{w.unit}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-white">{w.quantity}</div>
                        <div className="text-sm text-gray-400 mt-1">{w.unit}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MdAttachMoney className="text-green-400" />
                          <span className="text-lg font-bold text-white">₹{w.perUnitPrice}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-red-400">₹{w.totalLoss}</span>
                          <div className="text-sm text-gray-400">
                            {w.quantity} × ₹{w.perUnitPrice}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={getReasonStyle(w.reason)}>
                          {w.reason}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MdCalendarToday className="text-gray-400" />
                          <span>{w.wasteDate ? w.wasteDate.split("T")[0] : ""}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 max-w-xs">
                        {w.notes ? (
                          <div className="flex items-start gap-2">
                            <MdInfo className="text-blue-400 mt-1 flex-shrink-0" />
                            <p className="text-sm text-gray-300 line-clamp-2">{w.notes}</p>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No notes</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(w)}
                            title="Edit"
                            className="text-gray-400 hover:text-yellow-400 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <MdEdit className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDelete(w._id, w.itemName)}
                            title="Delete"
                            className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <MdDelete className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredWaste.length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <MdRecycling className="text-5xl mb-4 opacity-50" />
                          <h3 className="text-lg font-medium text-gray-300 mb-2">No waste records found</h3>
                          <p className="text-gray-500 mb-4">
                            {searchQuery 
                              ? "No waste records match your search" 
                              : "Start tracking your food waste to reduce losses"}
                          </p>
                          <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                          >
                            <MdAdd className="mr-2" /> Record Waste
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

      {/* Add/Edit Waste Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editId ? "Edit Waste Record" : "Record New Waste"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {editId ? "Update waste record details" : "Track food waste to reduce losses"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Item Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="item"
                    placeholder="e.g., Chicken Breast"
                    value={form.item}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="qty"
                    placeholder="e.g., 5"
                    value={form.qty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                {/* Price per Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price per Unit (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">₹</span>
                    <input
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Total Loss (Auto-calculated) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Loss
                  </label>
                  <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                    <span className="text-lg font-bold text-red-400">
                      ₹{(Number(form.price) * Number(form.qty.replace(/[^\d.]/g, "")) || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select Reason</option>
                    {reasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MdCalendarToday className="absolute left-3 top-3 text-gray-400" />
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Additional details about the waste..."
                    value={form.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
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
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg"
                >
                  {editId ? "Update Record" : "Save Waste Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
