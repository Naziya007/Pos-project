// models/Product.js
import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: "pcs" },         // unit of measurement
  supplier: { type: String, default: "Unknown" }, // supplier name
  lowStockThreshold: { type: Number, default: 5 } // alert if below
}, { timestamps: true }); // adds createdAt & updatedAt automatically

export default mongoose.model("Inventory", inventorySchema);
