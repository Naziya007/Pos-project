// models/Waste.js
import mongoose from "mongoose";

const wasteSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: "pcs" },

  perUnitPrice: { type: Number, required: true },  
  totalLoss: { type: Number, required: true },     

  wasteDate: { type: Date, required: true },

  reason: {
    type: String,
    enum: ["Overcooked", "Expired", "Customer Return", "Extra Prepared", "Spoiled", "Other"],
    required: true
  },

  notes: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Waste", wasteSchema);
