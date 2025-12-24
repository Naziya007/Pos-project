import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },

  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: false, // Takeaway orders may not need a table
  },

  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],

  amount: { type: Number, required: true },

  status: { 
    type: String, 
    enum: ["pending", "served", "cancelled","Billing","Ready"],
    default: "pending" 
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
