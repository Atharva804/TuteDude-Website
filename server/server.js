// server/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Basic Route for Testing
app.get("/api", (req, res) => {
  res.send("Backend API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
