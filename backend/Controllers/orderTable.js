// controllers/orderTableController.js

import mongoose from "mongoose";
import Order from "../model/order.js";
import Table from "../model/table.js";
import { v4 as uuidv4 } from "uuid";

// ===============================
//        TABLE CONTROLLERS
// ===============================

// Create Table
export const createTable = async (req, res) => {
  try {
    const { tableNumber, seats, status } = req.body;

    const newTable = await Table.create({
      tableNumber,
      seats,
      status,
    });

    res.status(201).json({ message: "Table created", table: newTable });
  } catch (error) {
    res.status(500).json({ message: "Error creating table", error });
  }
};

// Get All Tables
export const getTables = async (req, res) => {
  try {
    const tables = await Table.find().populate("activeOrderId");
    res.json({ message: "Tables fetched", tables });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tables", error: err.message });
  }
};

// Update Table (status, seats etc.)
export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTable = await Table.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("activeOrderId");

    res.json({ message: "Table updated", updatedTable });
  } catch (error) {
    res.status(500).json({ message: "Error updating table", error });
  }
};

// Delete Table
export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    await Table.findByIdAndDelete(id);

    res.json({ message: "Table deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting table", error });
  }
};

// ===============================
//         ORDER CONTROLLERS
// ===============================

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { items, amount, table } = req.body;

    const orderId = "ORD-" + uuidv4().slice(0, 8).toUpperCase();

    const newOrder = await Order.create({
      orderId,
      items,
      amount,
      table, // use correct field name
    });

    // Link order to table
    if (table) {
      await Table.findByIdAndUpdate(table, {
        activeOrderId: newOrder._id,
        status: "occupied",
      });
    }

    res.status(201).json({ message: "Order created", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};

// Get Orders
export const getOrders = async (req, res) => {
  try {
    let query = {};
    if (req.query.tableId) {
      const table = req.query.tableId;
      if (!mongoose.Types.ObjectId.isValid(table)) {
        return res.status(400).json({ message: "Invalid table ID" });
      }
      query.table = table;
    }

    const orders = await Order.find(query).populate("table");
    res.json({ message: "Orders fetched", orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Update Order
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({ message: "Order updated", updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Free table if order deleted
    if (order.table) {
      await Table.findByIdAndUpdate(order.table, {
        activeOrderId: null,
        status: "dirty", // table dirty after order delete
      });
    }

    await order.deleteOne();

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
};

// ===============================
//   BILLING / ACTIVE ORDER FOR TABLE
// ===============================

export const getTableBilling = async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findById(tableId).populate("activeOrderId");

    if (!table) return res.status(404).json({ message: "Table not found" });

    res.json({
      tableNumber: table.tableNumber,
      status: table.status,
      currentOrder: table.activeOrderId,
      occupiedAt: table.occupiedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting billing", error });
  }
};

