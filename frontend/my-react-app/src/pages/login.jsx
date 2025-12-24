import { useState } from "react";
import { loginAdmin } from "../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(formData);
      localStorage.setItem("adminToken", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form
        className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-xl font-bold text-white">PC</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            Admin Login
          </h2>
          <p className="text-gray-400 mt-2">POSCLOUD Management System</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300 text-center text-sm">{error}</p>
          </div>
        )}

        <div className="mb-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
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
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white p-3 rounded-lg font-semibold hover:opacity-90 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* --- STAFF LOGIN BUTTON --- */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 mb-2">OR</p>

          <button
            type="button"
            onClick={() => navigate("/stafflogin")}
            className="w-full bg-gray-700 text-white p-3 rounded-lg font-medium hover:bg-gray-600 transition"
          >
            Login as Staff (PIN)
          </button>
        </div>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-purple-400 cursor-pointer hover:text-purple-300 font-medium"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
