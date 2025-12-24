import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: { type: String },  // PIN-only for staff 
  role: {
    type: String,
    enum: ["admin", "manager", "staff"],
    default: "staff",
  },

  locationIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
  ],

  pinHash: { type: String }, // for 4-digit PIN login

  qrData: { type: String },

  createdAt: { type: Date, default: Date.now },
});

// ==========================
// 🔐 HASH PASSWORD
// ==========================
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ==========================
// 🔐 Compare Password
// ==========================
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// ==========================
// 🔐 Set PIN (hash)
// ==========================
userSchema.methods.setPin = async function (pin) {
  const salt = await bcrypt.genSalt(10);
  this.pinHash = await bcrypt.hash(String(pin), salt);
};

// ==========================
// 🔐 Verify PIN
// ==========================
userSchema.methods.verifyPin = async function (pin) {
  if (!this.pinHash) return false;
  return bcrypt.compare(String(pin), this.pinHash);
};

const User = mongoose.model("User", userSchema);
export default User;
