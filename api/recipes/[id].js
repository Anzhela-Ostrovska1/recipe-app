const connectDB = require("../_lib/db");
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

  if (req.method === "GET") {
    try {
      const recipe = await Recipe.findById(req.query.id);
      if (!recipe) return res.status(404).json({ error: "Recipe not found" });
      return res.json(recipe);
    } catch (err) {
      console.error("GET /api/recipes/[id] error:", err.message);
      return res.status(500).json({ error: "Failed to fetch recipe" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
};
