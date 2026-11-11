import mongoose from "mongoose";

// A schema describes the fields each feedback record must have.
const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true }
  },
  {
    // Mongoose adds createdAt and updatedAt automatically.
    timestamps: true
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
