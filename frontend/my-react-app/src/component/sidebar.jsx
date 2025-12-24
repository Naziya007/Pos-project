import { useState } from "react";

export default function Sidebar({ onMenuSelect }) {
  const [active, setActive] = useState("orders");

  const handleClick = (menu) => {
    setActive(menu);
    onMenuSelect(menu);
  };

  const menuItems = [
    { id: "orders", label: "Orders", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
      </svg>

    ) },
    { id: "tables", label: "Tables", icon: (
       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
    ) },
    { id: "kot", label: "KOT & KDS", icon: (
       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
    ) },
    { id: "inventory", label: "inventory", icon: (
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
      </svg>
    ) },
    { id: "menuItems", label: "Menu & QR", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 18h6m-6-6h6m-6-6h6" opacity="0.5"></path>
      </svg>

    ) },
    { id: "wasteManage", label: "Manage waste", icon: (
       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    ) },
    { id: "Report", label: "Report and Analysis", icon: (
       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    ) },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 text-white h-screen flex flex-col overflow-hidden">
      {/* Sidebar Header with Logo */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-lg font-bold text-white">PC</span>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              POSCLOUD
            </h1>
            <p className="text-xs text-gray-400">Management Panel</p>
          </div>
        </div>
        
       
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-2">Main Menu</h3>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all duration-200 ${
                  active === item.id
                    ? "bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => handleClick(item.id)}
              >
                <span className={`${active === item.id ? "text-white" : "text-gray-400"}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
                {active === item.id && (
                  <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Quick Stats Section */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-2">Quick Stats</h3>
          <div className="space-y-2">
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Today's Orders</span>
                <span className="text-sm font-bold text-green-400">24</span>
              </div>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Active Tables</span>
                <span className="text-sm font-bold text-purple-400">8/12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-gray-300 font-medium">System Status</p>
          </div>
          <p className="text-xs text-gray-400">All systems operational</p>
          <div className="mt-3 text-xs text-gray-500 text-center">
            POSCLOUD v2.1
          </div>
        </div>
      </div> */}
    </div>
  );
}
