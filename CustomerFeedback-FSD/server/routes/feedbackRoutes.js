import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// GET: read all feedback records, newest first.
router.get("/", async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: "Could not get feedback." });
  }
});

// POST: check the submitted values and save a feedback record.
router.post("/", async (req, res) => {
  try {
    const { name, mobile, rating, comment } = req.body;

    if (
      typeof name !== "string" ||
      typeof mobile !== "string" ||
      typeof comment !== "string" ||
      !name.trim() || !mobile.trim() || !comment.trim() ||
      rating === undefined || rating === null
    ) {
      return res.status(400).json({ message: "Please provide all feedback fields." });
    }

    if (!/^[6-9][0-9]{9}$/.test(mobile.trim())) {
      return res.status(400).json({ message: "Please enter a valid 10-digit Indian mobile number." });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be a number from 1 to 5." });
    }

    const newFeedback = await Feedback.create({
      name: name.trim(),
      mobile: mobile.trim(),
      rating: numericRating,
      comment: comment.trim()
    });

    res.status(201).json({
      message: "Feedback submitted successfully.",
      feedback: newFeedback
    });
  } catch (error) {
    res.status(500).json({ message: "Could not save feedback." });
  }
});

export default router;
