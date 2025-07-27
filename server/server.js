// server/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();
connectDB();

const authRoutes = require("./Routes/AuthRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const orderRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/reviewRoutes");
const orderRoutes = require("./Routes/VendorProfileRoutes");

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use("/api/auth", AuthRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/product", productRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/VendorProfile", VendorProfileRoutes);

// Basic Route for Testing
app.get("/api", (req, res) => {
  res.send("Backend API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
