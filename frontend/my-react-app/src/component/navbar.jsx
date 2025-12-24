// component/Navbar.jsx
import { useEffect, useState } from "react";
import { getProfile, logoutUser } from "../api";
// import LanguageSwitcher from "./LanguageSwitcher"; // ⬅ ADD THIS

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch logged in user profile
  const fetchUser = async () => {
    try {
      const res = await getProfile();
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex justify-between items-center shadow-lg">

      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center shadow-md">
          <span className="text-lg font-bold text-white">PC</span>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            POSCLOUD
          </h1>
          <p className="text-xs text-gray-400">Admin Dashboard</p>
        </div>
      </div>

      {/* Right Side (Language Switcher + Profile) */}
      <div className="flex items-center gap-4">

        {/* 🌐 Language Switcher */}
        <div>
          {/* <LanguageSwitcher /> */}
        </div>

        {/* Profile Dropdown */}
        {user && (
          <div className="relative">
            <button
              className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg transition duration-200 border border-gray-700 hover:border-purple-500"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>

              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">

                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-700 bg-gray-900">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Menu */}
                <div className="py-1">
                  <a href="/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition">
                    Profile Settings
                  </a>

                  <a href="/settings" className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition">
                    System Settings
                  </a>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-700 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition"
                  >
                    Logout
                  </button>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

