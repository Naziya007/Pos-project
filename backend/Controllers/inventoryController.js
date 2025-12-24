import Inventory from "../model/inventory.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Inventory.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Inventory.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const product = new Inventory(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Inventory.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
