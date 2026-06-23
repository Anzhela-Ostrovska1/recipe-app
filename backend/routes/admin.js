const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const { cloudinary, upload } = require("../middleware/upload");

// Simple password middleware
const requireAdmin = (req, res, next) => {
  const password = req.headers["x-admin-password"];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// GET all recipes for admin (same as public but protected)
router.get("/recipes", requireAdmin, async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// DELETE a recipe
router.delete("/recipes/:id", requireAdmin, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    // Delete photo from Cloudinary if it exists
    if (recipe.photoPublicId) {
      await cloudinary.uploader.destroy(recipe.photoPublicId);
    }

    await recipe.deleteOne();
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

// EDIT a recipe
router.put("/recipes/:id", requireAdmin, upload.single("photo"), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const { title, ingredients, instructions, category, author } = req.body;
    if (title) recipe.title = title;
    if (ingredients) recipe.ingredients = ingredients;
    if (instructions) recipe.instructions = instructions;
    if (category !== undefined) recipe.category = category;
    if (author !== undefined) recipe.author = author;

    // If new photo uploaded, delete old one from Cloudinary
    if (req.file) {
      if (recipe.photoPublicId) {
        await cloudinary.uploader.destroy(recipe.photoPublicId);
      }
      recipe.photoUrl = req.file.path;
      recipe.photoPublicId = req.file.filename;
    }

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// Verify admin password
router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Wrong password" });
  }
});

module.exports = router;
