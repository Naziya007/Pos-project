// models/Location.js
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  city: String,
  state: String,
  createdAt: { type: Date, default: Date.now }
});

const Location = mongoose.model("Location", locationSchema);
export default Location;
