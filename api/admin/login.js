const setCors = require("../_lib/cors");

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
      return res.json({ success: true });
    }
    return res.status(401).json({ error: "Wrong password" });
  }

  res.status(405).json({ error: "Method not allowed" });
};
