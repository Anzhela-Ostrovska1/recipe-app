const connectDB = require("../_lib/db");
const Feedback = require("../_lib/Feedback");
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

  if (req.method === "GET") {
    try {
      const reviews = await Feedback.find({ recipeId: req.query.recipeId }).sort({ createdAt: -1 });
      return res.json(reviews);
    } catch (err) {
      console.error("GET /api/feedback/[recipeId] error:", err.message);
      return res.status(500).json({ error: "Failed to fetch reviews" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
};
