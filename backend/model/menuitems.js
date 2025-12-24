// models/MenuItem.js
import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  name: String,  // e.g., Small, Medium
  price: Number,
});

const menuItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "Starter",
        "Main Course",
        "Beverages",
        "Rice & Biryani",
        "Desserts",
        "Breads",
      ],
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    variants: [variantSchema],
    status: {
      type: String,
      enum: ["Available", "Out of Stock"],
      default: "Available",
    },
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);
