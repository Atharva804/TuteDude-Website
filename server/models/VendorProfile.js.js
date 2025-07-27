// server/models/VendorProfile.js

const mongoose = require("mongoose");

const vendorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    gstin: {
      type: String,
      trim: true,
    },
    fssaiLicense: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const VendorProfile = mongoose.model("VendorProfile", vendorProfileSchema);

module.exports = VendorProfile;
