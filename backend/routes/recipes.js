const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const { upload } = require("../middleware/upload");

// GET all recipes (newest first)
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// GET single recipe
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// POST new recipe
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { title, ingredients, instructions, category, author } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ error: "Title, ingredients and instructions are required" });
    }

    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      category: category || "",
      author: author || "",
      photoUrl: req.file ? req.file.path : null,
      photoPublicId: req.file ? req.file.filename : null,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to save recipe" });
  }
});

module.exports = router;
