import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },

  seats: { type: Number, required: true },  // table capacity

  status: { 
    type: String,
    enum: ["free", "reserved", "occupied", "dirty"],
    default: "free"
  },

  // Guest sitting time
  occupiedAt: { type: Date, default: null },

  // Reservation time (optional)
  reservedAt: { type: Date, default: null },

  // Total order amount for current session
  currentOrderAmount: { type: Number, default: 0 },

  // Billing status
  billingStatus: {
    type: String,
    enum: ["pending", "paid", "none"],
    default: "none"
  },

  // Active order reference for this table
  activeOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null
  },

  createdAt: { type: Date, default: Date.now }
});

// Virtual: How many minutes guest is sitting
tableSchema.virtual("minutesOccupied").get(function () {
  if (!this.occupiedAt) return 0;
  const diff = Date.now() - new Date(this.occupiedAt).getTime();
  return Math.floor(diff / 60000); // convert ms to minutes
});

const Table = mongoose.model("Table", tableSchema);
export default Table;
