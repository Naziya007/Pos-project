// routes/menu.js
import express from "express";
import MenuItem from "../model/menuitems.js";

const router = express.Router();

// GET ALL ITEMS BY CATEGORY
router.get("/:category", async (req, res) => {
  const items = await MenuItem.find({ category: req.params.category });
  res.json(items);
});

// CREATE
router.post("/", async (req, res) => {
  const newItem = new MenuItem(req.body);
  await newItem.save();
  res.json(newItem);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
