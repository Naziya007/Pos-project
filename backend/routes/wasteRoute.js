import express from "express";
import {
  createWaste,
  getWaste,
  deleteWaste,
  updateWaste
} from "../Controllers/wasteController.js";

const router = express.Router();

router.post("/", createWaste);
router.get("/", getWaste);
router.delete("/:id", deleteWaste);
router.put("/:id", updateWaste);

export default router;

