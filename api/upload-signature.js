const cloudinary = require("./_lib/cloudinary");
const setCors = require("./_lib/cors");

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "recipe-app";
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );
    return res.json({
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  }

  res.status(405).json({ error: "Method not allowed" });
};
