// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";

export const protect = async (req,res,next) => {
  let token;
  const authHeader = req.headers.authorization;
  if(authHeader && authHeader.startsWith("Bearer ")){
    token = authHeader.split(" ")[1];
  }
  if(!token) return res.status(401).json({ message:"No token, authorization denied" });

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password -pinHash");
    if(!user) return res.status(401).json({ message:"User not found" });

    req.user = { id:user._id.toString(), role:user.role, locationIds:user.locationIds.map(String) };
    next();
  }catch(err){
    console.error(err);
    return res.status(401).json({ message:"Invalid or expired token" });
  }
};

// Role-based access
export const authorizeRoles = (...roles) => (req,res,next)=>{
  if(!req.user) return res.status(401).json({ message:"Not authenticated" });
  if(!roles.includes(req.user.role)) return res.status(403).json({ message:`Role '${req.user.role}' not allowed` });
  next();
};

// Location-based access
export const authorizeLocation = (req,res,next)=>{
  const locId = req.body.locationId || req.query.locationId;
  if(!locId) return res.status(400).json({ message:"Location required" });

  if(!req.user.locationIds.includes(locId)){
    return res.status(403).json({ message:"No access to this location" });
  }
  next();
};


