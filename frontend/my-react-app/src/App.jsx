import { BrowserRouter as Router, Routes, Route,Navigate  } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import StaffPinLogin from "./pages/stafflogin";
import Staffdashboard from "./pages/staffdashboard"

function App() {
  return (
    <Router>
      <Routes>
           <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stafflogin" element={<StaffPinLogin />} />
        
       <Route path="/staff-dashboard" element={<Staffdashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;


