// controllers/kotController.js

import Order from "../model/order.js";
import Table from "../model/table.js";
import KOT from "../model/kot.js";

// =============================
// Create KOT from Order
// =============================
export const createKOT = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("table");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const kot = await KOT.create({
      order: order._id,
      table: order.table?._id || null,
      items: order.items.map(i => ({
        name: i.name,
        quantity: i.quantity
      })),
      status: "pending"
    });

    res.status(201).json({ message: "KOT Created", kot });
  } catch (err) {
    res.status(500).json({ message: "Error creating KOT", error: err.message });
  }
};

// =============================
// Accept KOT (Kitchen Accepts)
// =============================
export const acceptKOT = async (req, res) => {
  try {
    const { kotId } = req.params;

    const kot = await KOT.findByIdAndUpdate(
      kotId,
      {
        status: "accepted",
        acceptedAt: new Date()
      },
      { new: true }
    );

    res.json({ message: "KOT Accepted", kot });
  } catch (err) {
    res.status(500).json({ message: "Error accepting KOT", error: err.message });
  }
};

// =============================
// Move to Preparing
// =============================
export const startPreparing = async (req, res) => {
  try {
    const { kotId } = req.params;

    const kot = await KOT.findByIdAndUpdate(
      kotId,
      {
        status: "preparing",
        preparingAt: new Date()
      },
      { new: true }
    );

    res.json({ message: "KOT Preparing Started", kot });
  } catch (err) {
    res.status(500).json({ message: "Error starting preparation", error: err.message });
  }
};

// =============================
// Mark as Ready
// =============================
export const markReady = async (req, res) => {
  try {
    const { kotId } = req.params;

    const kot = await KOT.findByIdAndUpdate(
      kotId,
      {
        status: "ready",
        readyAt: new Date()
      },
      { new: true }
    );

    res.json({ message: "KOT is Ready", kot });
  } catch (err) {
    res.status(500).json({ message: "Error marking as ready", error: err.message });
  }
};

// =============================
// Mark as Served
// =============================
export const markServed = async (req, res) => {
  try {
    const { kotId } = req.params;

    const kot = await KOT.findByIdAndUpdate(
      kotId,
      {
        status: "served",
        servedAt: new Date()
      },
      { new: true }
    );

    res.json({ message: "KOT Served", kot });
  } catch (err) {
    res.status(500).json({ message: "Error marking as served", error: err.message });
  }
};


// Get All KOTs with Time Calculations
export const getAllKOT = async (req, res) => {
  try {
    const kots = await KOT.find()
      .populate("table")
      .populate("order")
      .sort({ createdAt: -1 });

    const formatted = kots.map(k => {
      const now = Date.now();

      return {
        ...k._doc,

        timeSinceCreated: k.createdAt
          ? Math.floor((now - new Date(k.createdAt).getTime()) / 60000)
          : 0,

        timeSinceAccepted: k.acceptedAt
          ? Math.floor((now - new Date(k.acceptedAt).getTime()) / 60000)
          : null,

        timeSinceReady: k.readyAt
          ? Math.floor((now - new Date(k.readyAt).getTime()) / 60000)
          : null,

        timeSinceServed: k.servedAt
          ? Math.floor((now - new Date(k.servedAt).getTime()) / 60000)
          : null
      };
    });

    res.json({ message: "KOT List", kots: formatted });
  } catch (err) {
    res.status(500).json({ message: "Error fetching KOT", error: err.message });
  }
};
