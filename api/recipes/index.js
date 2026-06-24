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
      const recipes = await Recipe.find().sort({ createdAt: -1 });
      return res.json(recipes);
    } catch (err) {
      console.error("GET /api/recipes error:", err.message);
      return res.status(500).json({ error: "Failed to fetch recipes" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, ingredients, instructions, category, author, photoUrl, photoPublicId } = req.body;
      if (!title || !ingredients || !instructions) {
        return res.status(400).json({ error: "Title, ingredients and instructions are required" });
      }
      const recipe = new Recipe({
        title,
        ingredients,
        instructions,
        category: category || "",
        author: author || "",
        photoUrl: photoUrl || null,
        photoPublicId: photoPublicId || null,
      });
      await recipe.save();
      return res.status(201).json(recipe);
    } catch (err) {
      console.error("POST /api/recipes error:", err.message);
      return res.status(500).json({ error: "Failed to save recipe" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
};
