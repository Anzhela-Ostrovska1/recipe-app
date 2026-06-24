const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    category: { type: String, default: "" },
    author: { type: String, default: "" },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    photoUrl: { type: String, default: null },
    photoPublicId: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
