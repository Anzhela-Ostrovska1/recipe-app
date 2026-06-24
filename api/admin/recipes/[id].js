const connectDB = require("../../_lib/db");
const Recipe = require("../../_lib/Recipe");
const cloudinary = require("../../_lib/cloudinary");
const setCors = require("../../_lib/cors");

function checkAdmin(req, res) {
  if (req.headers["x-admin-password"] !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!checkAdmin(req, res)) return;

  try {
    await connectDB();
  } catch (err) {
    console.error("DB connection error:", err.message);
    return res.status(500).json({ error: "Database connection failed" });
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const recipe = await Recipe.findById(id);
      if (!recipe) return res.status(404).json({ error: "Recipe not found" });

      const { title, ingredients, instructions, category, author, photoUrl, photoPublicId } = req.body;
      if (title) recipe.title = title;
      if (ingredients) recipe.ingredients = ingredients;
      if (instructions) recipe.instructions = instructions;
      if (category !== undefined) recipe.category = category;
      if (author !== undefined) recipe.author = author;

      if (photoUrl) {
        if (recipe.photoPublicId) {
          await cloudinary.uploader.destroy(recipe.photoPublicId);
        }
        recipe.photoUrl = photoUrl;
        recipe.photoPublicId = photoPublicId || null;
      }

      await recipe.save();
      return res.json(recipe);
    } catch (err) {
      console.error("PUT /api/admin/recipes/[id] error:", err.message);
      return res.status(500).json({ error: "Failed to update recipe" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const recipe = await Recipe.findById(id);
      if (!recipe) return res.status(404).json({ error: "Recipe not found" });

      if (recipe.photoPublicId) {
        await cloudinary.uploader.destroy(recipe.photoPublicId);
      }

      await recipe.deleteOne();
      return res.json({ message: "Recipe deleted" });
    } catch (err) {
      console.error("DELETE /api/admin/recipes/[id] error:", err.message);
      return res.status(500).json({ error: "Failed to delete recipe" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
};
