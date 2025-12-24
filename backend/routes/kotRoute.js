// routes/kotRoutes.js

import express from "express";
import {
  createKOT,
  acceptKOT,
  startPreparing,
  markReady,
  markServed,
  getAllKOT
} from "../Controllers/kotController.js";

const router = express.Router();

// Create KOT from Order
router.post("/create", createKOT);

// Accept KOT
router.put("/accept/:kotId", acceptKOT);

// Start Preparing
router.put("/preparing/:kotId", startPreparing);

// Mark Ready
router.put("/ready/:kotId", markReady);

// Mark Served
router.put("/served/:kotId", markServed);

// Get All KOTs (with time calculations)
router.get("/all", getAllKOT);

export default router;
