const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const createOrder = async (req, res) => {
  try {
    const { customer, vendor, items, shippingAddress, paymentDetails } =
      req.body;

    if (!customer || !vendor || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let totalWeight = 0;
    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.product} not found` });
      }

      const itemWeight = product.unit * item.quantity;
      totalWeight += itemWeight;
      const itemAmount = product.price * item.quantity;
      totalAmount += itemAmount;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtOrder: product.price,
      });
    }

    if (totalWeight < 10) {
      return res.status(400).json({ message: "Minimum order weight is 10KG" });
    }

    const newOrder = await Order.create({
      customer,
      vendor,
      items: orderItems,
      totalWeight,
      totalAmount,
      shippingAddress,
      paymentDetails,
      status: "Pending",
    });

    return res.status(201).json({ message: "Order placed", order: newOrder });
  } catch (err) {
    console.error("Error placing order:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customer vendor items.product");
    res.status(200).json({ orders });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({ customer: customerId })
      .populate("items.product", "name price category")
      .populate("vendor", "name")
      .populate("review")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch customer orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer vendor items.product"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: err.message });
  }
};

const getOrdersByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const orders = await Order.find({ vendor: vendorId })
      .populate("items.product", "name price category")
      .populate("customer", "name email") // populate customer info
      .populate("review") // optional
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch vendor orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update status", error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete order", error: err.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByVendor,
  getOrdersByCustomer,
  updateOrderStatus,
  deleteOrder,
};
