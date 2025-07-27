//add the db path here

const RegisterAsSupplier = async (req, res) => {
  try {
    const { user_id, buissness_Name, gstin, fssai_License, isVerified } =
      req.body;

    if (
      !user_id ||
      !buissness_Name ||
      !gstin ||
      !fssai_License ||
      !isVerified
    ) {
      return res.status(400).json({
        status: 400,
        message: "All fields are required:",
      });
    }
    const existingSupplier = await db("VendorProfile")
      .where({ user_id })
      .first();
    if (existingSupplier) {
      return res.status(409).json({
        status: 409,
        message: "Supplier already exists",
      });
    }
    const [newUser] = await db("users")
      .insert({
        user_id,
        buissness_Name,
        gstin,
        fssai_License,
        isVerified,
      })
      .returning([
        "user_id",
        "buissness_Name",
        "gstin",
        "fssai_License",
        "isVerified",
      ]);

    return res.status(201).json({
      status: 201,
      message: "supplier registered successfully",
      data: newSupplier,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong during registration of Supplier",
      error: error.message,
    });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await db("VendorProfile").select("*");
    res.status(200).json({ status: 200, data: suppliers });
  } catch (error) {
    console.error("Get Suppliers Error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const supplier = await db("VendorProfile").where({ user_id }).first();
    if (!supplier) {
      return res
        .status(404)
        .json({ status: 404, message: "Supplier not found" });
    }
    res.status(200).json({ status: 200, data: supplier });
  } catch (error) {
    console.error("Get Supplier By ID Error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { user_id } = req.params;
    const updates = req.body;

    const updated = await db("VendorProfile")
      .where({ user_id })
      .update(updates)
      .returning("*");

    if (!updated.length) {
      return res
        .status(404)
        .json({ status: 404, message: "Supplier not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Supplier updated successfully",
      data: updated[0],
    });
  } catch (error) {
    console.error("Update Supplier Error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { user_id } = req.params;

    const deleted = await db("VendorProfile").where({ user_id }).del();

    if (!deleted) {
      return res
        .status(404)
        .json({ status: 404, message: "Supplier not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    console.error("Delete Supplier Error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  RegisterAsSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
