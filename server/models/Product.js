// server/models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: "text", // For text search capabilities
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "oil",
        "fruits",
        "vegetables",
        "spices",
        "dairy",
        "groceries",
        "others",
      ],
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "litre", "piece"],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
