const express = require("express");
const router = express.Router();

const {
  RegisterAsSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/VendorProfileController");

router.post("/suppliers", RegisterAsSupplier);

router.get("/suppliers", getAllSuppliers);

router.get("/suppliers/:user_id", getSupplierById);

router.put("/suppliers/:user_id", updateSupplier);

router.delete("/suppliers/:user_id", deleteSupplier);

module.exports = router;
