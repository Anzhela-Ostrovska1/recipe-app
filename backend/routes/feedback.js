const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const Recipe = require("../models/Recipe");

router.get("/:recipeId", async (req, res) => {
  try {
    const reviews = await Feedback.find({ recipeId: req.params.recipeId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { recipeId, name, message, rating } = req.body;
    if (!recipeId) return res.status(400).json({ error: "recipeId is required" });
    if (!message || !message.trim()) return res.status(400).json({ error: "Message is required" });
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be 1–5" });

    const feedback = new Feedback({ recipeId, name: name || "", message: message.trim(), rating });
    await feedback.save();

    const all = await Feedback.find({ recipeId });
    const avg = all.reduce((sum, f) => sum + f.rating, 0) / all.length;
    await Recipe.findByIdAndUpdate(recipeId, {
      averageRating: Math.round(avg * 10) / 10,
      reviewCount: all.length,
    });

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

module.exports = router;
