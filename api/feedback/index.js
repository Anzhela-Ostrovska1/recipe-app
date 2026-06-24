const connectDB = require("../_lib/db");
const Feedback = require("../_lib/Feedback");
const Recipe = require("../_lib/Recipe");
const setCors = require("../_lib/cors");

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    await connectDB();
  } catch (err) {
    console.error("DB connection error:", err.message);
    return res.status(500).json({ error: "Database connection failed" });
  }

  if (req.method === "POST") {
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

      return res.status(201).json(feedback);
    } catch (err) {
      console.error("POST /api/feedback error:", err.message);
      return res.status(500).json({ error: "Failed to save review" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
};
