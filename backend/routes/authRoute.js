import express from "express";
import User from "../model/UserModel.js";
import { register, login, loginWithPin, logout, getProfile } from "../Controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// -------------------------
// Public Routes
// -------------------------

// Register (In prod: only admin should register admin/manager)
router.post("/register", register);

// Email/password login
router.post("/login", login);

// Staff PIN login
router.post("/pin-login", loginWithPin);

// -------------------------
// Protected Routes
// -------------------------

// Logout
router.post("/logout", protect, logout);

// Get current user/profile
router.get("/profile", protect, getProfile);

// Example: get all staff (only admin & manager)
router.get("/staff", protect, authorizeRoles("admin","manager"), async (req,res)=>{
  const staffUsers = await User.find({ 
    role: "staff",
    locationIds: { $in: req.user.locationIds } 
  }).select("-password -pinHash");
  res.json(staffUsers);
});

export default router;
