import { useState } from "react";
import Sidebar from "../component/sidebar";
import Orders from "./orders";
import Tables from "./tables";
import Navbar from "../component/navbar";
import KOT from "./kot";
import Inventory  from  "./inventory";
import MenuItems from "./menuItems";
import WasteManagement from "./wasteManage";
import ReportsAndAnalysis from "./Report";


export default function Dashboard() {
  const [selected, setSelected] = useState("orders");

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar - Fixed width */}
      <div className="flex-shrink-0">
        <Sidebar onMenuSelect={setSelected} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Navbar - Fixed height */}
        <div className="flex-shrink-0">
          <Navbar />
        </div>

        {/* Page Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="p-4 sm:p-6 lg:p-8">
            {selected === "orders" && <Orders />}
            {selected === "tables" && <Tables />}
            {selected === "kot" && <KOT />}
            {selected === "inventory" && <Inventory/>}
             {selected === "menuItems" && <MenuItems/>}

             {selected === "wasteManage" && <WasteManagement/>}
              {selected === "Report" && <ReportsAndAnalysis/>}






            {selected === "settings" && (
              <div className="text-center py-20 text-gray-400">
                <h2 className="text-2xl font-bold mb-4">System Settings</h2>
                <p>Coming soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Optional: Footer */}
        <div className="flex-shrink-0 border-t border-gray-700 bg-gray-800 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>POSCLOUD v2.1</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                All systems operational
              </span>
            </div>
            <div>
              <span>© {new Date().getFullYear()} MyPMS Solutions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}