const connectDB = require("../../_lib/db");
const Recipe = require("../../_lib/Recipe");
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

  if (req.method === "GET") {
    try {
      const recipes = await Recipe.find().sort({ createdAt: -1 });
      return res.json(recipes);
    } catch (err) {
      console.error("GET /api/admin/recipes error:", err.message);
      return res.status(500).json({ error: "Failed to fetch recipes" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
};
