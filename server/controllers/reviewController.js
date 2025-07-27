const Review = require("../models/Review");
const Order = require("../models/Order");

const createReview = async (req, res) => {
  try {
    const { customer, order, vendor, rating, comment } = req.body;

    const existing = await Review.findOne({ order });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Review for this order already exists" });
    }

    const newReview = await Review.create({
      customer,
      order,
      vendor,
      rating,
      comment,
    });

    await Order.findByIdAndUpdate(order, { review: newReview._id });

    res.status(201).json({ message: "Review created", review: newReview });
  } catch (err) {
    console.error("Error creating review:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("customer vendor order");
    res.status(200).json({ reviews });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch reviews", error: err.message });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      "customer vendor order"
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ review });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch review", error: err.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review updated", review });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update review", error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    await Order.findOneAndUpdate({ review: review._id }, { review: null });

    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete review", error: err.message });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
