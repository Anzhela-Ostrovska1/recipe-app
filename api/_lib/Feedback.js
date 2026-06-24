const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    recipeId: { type: String, required: true, index: true },
    name: { type: String, default: "" },
    message: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
