const express = require("express");
const router = express.Router();

const {
  RegisterAsSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/VendorProfileController");

router.post("/VendorProfile", RegisterAsSupplier);

router.get("/VendorProfile", getAllSuppliers);

router.get("/VendorProfile/:user_id", getSupplierById);

router.put("/VendorProfile/:user_id", updateSupplier);

router.delete("/VendorProfile/:user_id", deleteSupplier);

module.exports = router;
