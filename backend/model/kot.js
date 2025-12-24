import mongoose from "mongoose";

const kotSchema = new mongoose.Schema({

  // Kis order ka KOT hai
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  // Kis table ke liye hai (takeaway ke liye null)
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    default: null
  },

  // Kitchen copy of items
  items: [
    {
      name: String,
      quantity: Number
    }
  ],

  // ALL STATUS (Accept is separate)
  status: {
    type: String,
    enum: ["pending", "accepted", "preparing", "ready", "served"],
    default: "pending"
  },

  // TIMESTAMP FOR EACH STATE
  acceptedAt: { type: Date, default: null },
  preparingAt: { type: Date, default: null },
  readyAt: { type: Date, default: null },
  servedAt: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now }
});


// VIRTUAL TIME CALCULATIONS
kotSchema.virtual("sinceCreated").get(function () {
  return Math.floor((Date.now() - this.createdAt.getTime()) / 60000);
});

kotSchema.virtual("sinceAccepted").get(function () {
  if (!this.acceptedAt) return 0;
  return Math.floor((Date.now() - this.acceptedAt.getTime()) / 60000);
});

kotSchema.virtual("preparationTime").get(function () {
  if (!this.preparingAt) return 0;
  return Math.floor((Date.now() - this.preparingAt.getTime()) / 60000);
});

kotSchema.virtual("readySince").get(function () {
  if (!this.readyAt) return 0;
  return Math.floor((Date.now() - this.readyAt.getTime()) / 60000);
});

kotSchema.virtual("servedSince").get(function () {
  if (!this.servedAt) return 0;
  return Math.floor((Date.now() - this.servedAt.getTime()) / 60000);
});

const KOT = mongoose.model("KOT", kotSchema);
export default KOT;
