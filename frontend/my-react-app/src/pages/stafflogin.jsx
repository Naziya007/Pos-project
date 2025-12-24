import React, { useState } from "react";
import { loginStaffWithPin } from "../api";

const StaffPinLogin = () => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginStaffWithPin({ pin });

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("staffUser", JSON.stringify(res.data.user));

      window.location.href = "/staff-dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      <form
        className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
        onSubmit={handleLogin}
      >
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-xl font-bold text-white">PC</span>
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            Staff Login
          </h2>

          <p className="text-gray-400 mt-2">Enter your 4-digit PIN</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300 text-center text-sm">{error}</p>
          </div>
        )}

        {/* PIN Input */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="****"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
            maxLength={4}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white p-3 rounded-lg font-semibold hover:opacity-90 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Verifying...
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default StaffPinLogin;
