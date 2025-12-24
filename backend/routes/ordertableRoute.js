import express from "express";
import {
  createTable,
  getTables,
  updateTable,
  deleteTable,

  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,

  getTableBilling,
} from "../Controllers/orderTable.js";

import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// ===============================
//         TABLE ROUTES
// ===============================

// Create table (only admin/manager)
router.post("/tables",
  protect,
  authorizeRoles("admin", "manager"),
  createTable
);

// Get all tables
router.get("/tables",
  protect,
  getTables
);

// Update table (status, seats)
router.put("/tables/:id",
  protect,
  authorizeRoles("admin", "manager"),
  updateTable
);

// Delete table
router.delete("/tables/:id",
  protect,
  authorizeRoles("admin", "manager"),
  deleteTable
);


// ===============================
//         ORDER ROUTES
// ===============================

// Create order (staff, manager, admin)
router.post("/orders",
  protect,
  authorizeRoles("staff", "manager", "admin"),
  createOrder
);

// Get all orders
router.get("/orders",
  protect,
  getOrders
);

// Update order
router.put("/orders/:id",
  protect,
  authorizeRoles("staff", "manager", "admin"),
  updateOrder
);

// Delete order
router.delete("/orders/:id",
  protect,
  authorizeRoles("manager", "admin"),
  deleteOrder
);


// ===============================
//      BILLING / ACTIVE ORDER
// ===============================

// Get billing details for table
router.get("/billing/:tableId",
  protect,
  getTableBilling
);


export default router;
