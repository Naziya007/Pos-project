import { useEffect, useState } from "react";
import { getTables, createTable, updateTable, deleteTable } from "../api";
import {
  FaChair,
  FaUsers,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaTable,
  FaPlus,
  FaDoorOpen,
  FaCoffee,
  FaClock,
  FaExclamationTriangle
} from "react-icons/fa";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [newTableSeats, setNewTableSeats] = useState(4);
  const [editingTable, setEditingTable] = useState(null);
  const statusOptions = ["free", "reserved", "occupied", "dirty"];

  // Status configuration with simpler styling
  const statusConfig = {
    free: {
      label: "Free",
      icon: <FaDoorOpen className="text-green-500" />,
      bgColor: "bg-green-900/20",
      textColor: "text-green-400"
    },
    occupied: {
      label: "Occupied",
      icon: <FaCoffee className="text-red-500" />,
      bgColor: "bg-red-900/20",
      textColor: "text-red-400"
    },
    reserved: {
      label: "Reserved",
      icon: <FaClock className="text-yellow-500" />,
      bgColor: "bg-yellow-900/20",
      textColor: "text-yellow-400"
    },
    dirty: {
      label: "Dirty",
      icon: <FaExclamationTriangle className="text-gray-500" />,
      bgColor: "bg-gray-800",
      textColor: "text-gray-400"
    }
  };

  // Fetch tables from backend
  const fetchTables = async () => {
    try {
      const res = await getTables();
      setTables(res.data.tables || res.data);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  // Create new table
  const handleCreate = async () => {
    try {
      const tableNumber = tables.length > 0 ? Math.max(...tables.map(t => t.tableNumber)) + 1 : 1;
      await createTable({ tableNumber, seats: newTableSeats, status: "free" });
      setNewTableSeats(4);
      fetchTables();
    } catch (err) {
      console.error("Error creating table:", err);
    }
  };

  // Update table
  const handleUpdate = async (table) => {
    try {
      await updateTable(table._id, {
        seats: table.seats,
        status: table.status,
      });
      setEditingTable(null);
      fetchTables();
    } catch (err) {
      console.error("Error updating table:", err);
    }
  };

  // Delete table
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this table?")) return;
    try {
      await deleteTable(id);
      fetchTables();
    } catch (err) {
      console.error("Error deleting table:", err);
    }
  };

  // Handle inline change
  const handleChange = (id, key, value) => {
    setTables((prev) =>
      prev.map((t) => (t._id === id ? { ...t, [key]: value } : t))
    );
  };

  // Calculate statistics
  const calculateStats = () => {
    const total = tables.length;
    const free = tables.filter(t => t.status === "free").length;
    const occupied = tables.filter(t => t.status === "occupied").length;
    return { total, free, occupied };
  };

  const stats = calculateStats();

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-gray-900 text-white">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaTable className="text-purple-400" />
          Tables Management
        </h2>
        <p className="text-gray-400 text-sm">Manage your table layout and seating</p>
      </div>

      {/* Create Table Section */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Number of Seats</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="12"
                value={newTableSeats}
                onChange={(e) => setNewTableSeats(Number(e.target.value))}
                className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-400">{newTableSeats}</span>
                <FaUsers className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition duration-200"
          >
            <FaPlus /> Add Table
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Tables</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FaTable className="text-3xl text-gray-600" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg border border-green-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Available</p>
              <p className="text-2xl font-bold text-green-400">{stats.free}</p>
            </div>
            <FaDoorOpen className="text-3xl text-green-600" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg border border-red-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Occupied</p>
              <p className="text-2xl font-bold text-red-400">{stats.occupied}</p>
            </div>
            <FaCoffee className="text-3xl text-red-600" />
          </div>
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tables.map((t) => (
          <div
            key={t._id}
            className={`bg-gray-800 rounded-lg p-4 border-2 ${
              statusConfig[t.status]?.bgColor || "border-gray-700"
            } ${statusConfig[t.status]?.textColor ? 'border-' + statusConfig[t.status].textColor.split('-')[1] + '/30' : 'border-gray-700'}`}
          >
            {/* Table Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold">Table {t.tableNumber}</h3>
              </div>
              
              {/* Small Action Buttons */}
              <div className="flex gap-1">
                {editingTable === t._id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(t)}
                      className="p-1.5 bg-green-600 hover:bg-green-700 rounded"
                      title="Save"
                    >
                      <FaSave className="text-xs" />
                    </button>
                    <button
                      onClick={() => setEditingTable(null)}
                      className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded"
                      title="Cancel"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingTable(t._id)}
                      className="p-1.5 bg-yellow-600 hover:bg-yellow-700 rounded"
                      title="Edit"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="p-1.5 bg-red-600 hover:bg-red-700 rounded"
                      title="Delete"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Table Details - Simple */}
            <div className="space-y-3">
              {/* Seats */}
              <div className="flex items-center gap-2">
                <FaChair className="text-gray-500" />
                {editingTable === t._id ? (
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={t.seats}
                    onChange={(e) => handleChange(t._id, "seats", Number(e.target.value))}
                    className="w-16 p-1 bg-gray-900 border border-gray-700 rounded text-white text-center"
                  />
                ) : (
                  <span className="font-medium">{t.seats} seats</span>
                )}
              </div>

              {/* Status */}
              <div className={`flex items-center gap-2 px-2 py-1 rounded ${statusConfig[t.status]?.bgColor || 'bg-gray-700'}`}>
                {statusConfig[t.status]?.icon}
                {editingTable === t._id ? (
                  <select
                    value={t.status}
                    onChange={(e) => handleChange(t._id, "status", e.target.value)}
                    className="flex-1 p-1 bg-transparent text-sm border-none focus:ring-0"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s} className="text-gray-900 capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`text-sm ${statusConfig[t.status]?.textColor || 'text-gray-300'}`}>
                    {statusConfig[t.status]?.label || t.status}
                  </span>
                )}
              </div>
            </div>

            {/* Occupied time - Only show if occupied */}
            {t.minutesOccupied > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FaClock />
                  <span>{t.minutesOccupied} min</span>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Add Table Card (only visible when no tables exist) */}
        {tables.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <FaTable className="text-5xl mb-4 opacity-50" />
            <p className="mb-4">No tables found</p>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg"
            >
              <FaPlus /> Create First Table
            </button>
          </div>
        )}
      </div>

      {/* Status Legend */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="font-medium mb-3 text-gray-300">Status Legend</h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              {config.icon}
              <span className="text-sm text-gray-300 capitalize">{key}</span>
              <span className="text-xs text-gray-500">
                ({tables.filter(t => t.status === key).length})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}





