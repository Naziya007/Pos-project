import { useState } from "react";
import { registerAdmin } from "../api"; // backend /auth/register
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    location: {
      name: "",
      address: "",
      city: "",
      state: ""
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Location fields
    if (["locName", "address", "city", "state"].includes(name)) {
      let locField = name === "locName" ? "name" : name;
      setFormData({
        ...formData,
        location: { ...formData.location, [locField]: value }
      });
    } else {
      // Admin fields
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerAdmin(formData);
      alert("Admin registered successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <form className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700" onSubmit={handleSubmit}>
        
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-xl font-bold text-white">PC</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            Admin Registration
          </h2>
          <p className="text-gray-400 mt-2">POSCLOUD Management System</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300 text-center text-sm">{error}</p>
          </div>
        )}

        {/* Admin Details Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-700">Admin Details</h3>
          
          <div className="mb-4">
            <input 
              type="text" 
              name="name" 
              placeholder="Admin Name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
              required 
            />
          </div>
          
          <div className="mb-4">
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
              required 
            />
          </div>
          
          <div className="mb-6">
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
              required 
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-700">Location Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input 
                type="text" 
                name="locName" 
                placeholder="Location Name" 
                value={formData.location.name} 
                onChange={handleChange} 
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
                required 
              />
            </div>
            
            <div>
              <input 
                type="text" 
                name="city" 
                placeholder="City" 
                value={formData.location.city} 
                onChange={handleChange} 
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <input 
              type="text" 
              name="address" 
              placeholder="Address" 
              value={formData.location.address} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
            />
          </div>
          
          <div>
            <input 
              type="text" 
              name="state" 
              placeholder="State" 
              value={formData.location.state} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
            />
          </div>
        </div>

        {/* Register Button */}
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white p-3 rounded-lg font-semibold hover:opacity-90 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Registering...
            </div>
          ) : (
            'Register'
          )}
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <span 
            className="text-purple-400 cursor-pointer hover:text-purple-300 font-medium transition duration-200"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

     

      </form>
    </div>
  );
};

export default AdminRegister;



