//db address

const createProduct = async (req, res) => {
  try {
    const { user_id, name, description, category, price, unit, stock } =
      req.body;

    if (!user_id || !name || !category || !price || !unit || !stock) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const [newProduct] = await db("products")
      .insert({
        user_id,
        name,
        description,
        category,
        price,
        unit,
        stock,
      })
      .returning("*");

    return res
      .status(201)
      .json({ message: "Product created", data: newProduct });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { user_id } = req.body;

    const query = db("Products");
    if (user_id) {
      query.where({ user_id });
    }

    const products = await query.select("*");
    return res.status(200).json({ message: "Product list", data: products });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db("Products").where({ id }).first();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product found", data: product });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updateFields = req.body;

    const updated = await db("Products")
      .where({ id })
      .update(updateFields)
      .returning("*");

    if (!updated.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product updated", data: updated[0] });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db("Products").where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
};
