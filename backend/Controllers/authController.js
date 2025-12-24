// controllers/authController.js
import User from "../model/UserModel.js";
import Location from "../model/Location.js";
import { signToken } from "../utils/jwt.js";

// ------------------
// REGISTER
// ------------------
export const register = async (req,res) => {
  try{
    const { name,email,password,role,pin,location } = req.body; 
    // location: { name, address, city, state }

    if(!name || !email) return res.status(400).json({message:"Name & email required"});

    const exists = await User.findOne({ email });
    if(exists) return res.status(400).json({message:"Email already registered"});

    // Handle location input
    let locationIds = [];
    if(location && location.name){
      let loc = await Location.findOne({ name: location.name });
      if(!loc){
        loc = new Location(location);
        await loc.save();
      }
      locationIds.push(loc._id);
    }

    // Create user
    const user = new User({ name,email,role,locationIds });
    if(password) user.password = password;
    if(pin) await user.setPin(pin);

    await user.save();
    if(!user.qrData){
      user.qrData = `staff:${user._id.toString()}`;
      await user.save();
    }

    const token = signToken({ userId:user._id, role:user.role, locationIds:user.locationIds });

    res.status(201).json({
      message:"Registered",
      token,
      user:{ id:user._id, name:user.name, email:user.email, role:user.role, locationIds:user.locationIds }
    });

  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server error", error:err.message});
  }
};

// ------------------
// LOGIN (EMAIL/PASSWORD)
// ------------------
export const login = async (req,res) => {
  try{
    const { email,password,selectedLocation } = req.body;
    if(!email || !password) return res.status(400).json({ message:"Email & password required" });

    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ message:"Invalid credentials" });

    const ok = await user.comparePassword(password);
    if(!ok) return res.status(401).json({ message:"Invalid credentials" });

    // Multi-location check
    if(selectedLocation && user.locationIds.map(String).indexOf(selectedLocation)===-1){
      return res.status(403).json({ message:"No access to selected location" });
    }

    const token = signToken({ userId:user._id, role:user.role, locationIds:user.locationIds });
    res.json({ message:"Logged in", token, user:{id:user._id,name:user.name,role:user.role} });

  }catch(err){
    console.error(err);
    res.status(500).json({ message:"Server error", error:err.message });
  }
};
// controllers/authController.js

export const logout = async (req, res) => {
  try {
    // JWT stateless hai, toh backend sirf frontend ko success bhejta hai
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ use req.user.id, not req.user.userId
    const user = await User.findById(userId).populate("locationIds");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        locations: user.locationIds.map(loc => ({
          id: loc._id,
          name: loc.name,
          address: loc.address,
          city: loc.city,
          state: loc.state,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ------------------
// PIN LOGIN (STAFF SHIFT)
// ------------------
export const loginWithPin = async (req,res) => {
  try{
    const { pin } = req.body;
    if(!pin) return res.status(400).json({ message:"PIN is required" });

    // staff ko PIN se find karo
    const user = await User.findOne({});
    const allStaff = await User.find({ role: "staff" });

    // Find staff whose PIN matches
    let matchedUser = null;
    for (const staff of allStaff) {
      const ok = await staff.verifyPin(pin);
      if (ok) {
        matchedUser = staff;
        break;
      }
    }

    if(!matchedUser) {
      return res.status(401).json({ message:"Invalid PIN" });
    }

    const token = signToken({
      userId: matchedUser._id,
      role: matchedUser.role,
      shift: true
    });

    res.json({
      message: "PIN login success",
      token,
      user: {
        id: matchedUser._id,
        name: matchedUser.name,
        role: matchedUser.role
      }
    });

  }catch(err){
    console.error(err);
    res.status(500).json({ message:"Server error", error:err.message });
  }
};


