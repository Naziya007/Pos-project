import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import tableOrderRoutes from "./routes/ordertableRoute.js";
import kotRoutes from "./routes/kotRoute.js"
import inventoryRoutes from "./routes/inventoryRoute.js";
import menuRoutes from "./routes/menuitemRoute.js"
import wasteRoutes from "./routes/wasteRoute.js";



dotenv.config();

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",                 // local dev
  "https://pos-project-1.onrender.com" // deployed frontend
 // deployed frontend" // deployed frontend
];

// Middlewares
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman or server-to-server requests
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // allow cookies if needed
}));         // Allow frontend requests
app.use(express.json());    // JSON parsing

// Connect Database
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/order-table", tableOrderRoutes);

app.use("/api/kot", kotRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/waste", wasteRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("POS Backend Server Running Successfully...");
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
