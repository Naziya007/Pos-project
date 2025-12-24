import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from "../Controllers/inventoryController.js";

const router = express.Router();

router.get("/", getProducts);          // get all products
router.get("/:id", getProduct);        // get single product by id
router.post("/", createProduct);       // add new product
router.put("/:id", updateProduct);     // update product
router.delete("/:id", deleteProduct);  // delete product

export default router;
