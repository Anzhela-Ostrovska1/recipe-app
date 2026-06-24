export const getRecipes = async () => {
  const res = await fetch("/api/recipes");
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
};

export const getRecipe = async (id) => {
  const res = await fetch(`/api/recipes/${id}`);
  if (!res.ok) throw new Error("Recipe not found");
  return res.json();
};

export const uploadPhoto = async (file) => {
  const sigRes = await fetch("/api/upload-signature", { method: "POST" });
  if (!sigRes.ok) throw new Error("Failed to get upload signature");
  const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("api_key", apiKey);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );
  if (!uploadRes.ok) throw new Error("Photo upload failed");
  const data = await uploadRes.json();
  return { photoUrl: data.secure_url, photoPublicId: data.public_id };
};

export const submitRecipe = async (body) => {
  const res = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to submit recipe");
  return res.json();
};

export const adminLogin = async (password) => {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Wrong password");
  return res.json();
};

export const adminGetRecipes = async (password) => {
  const res = await fetch("/api/admin/recipes", {
    headers: { "x-admin-password": password },
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};

export const adminDeleteRecipe = async (id, password) => {
  const res = await fetch(`/api/admin/recipes/${id}`, {
    method: "DELETE",
    headers: { "x-admin-password": password },
  });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
};

export const adminUpdateRecipe = async (id, body, password) => {
  const res = await fetch(`/api/admin/recipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
};

export const getRecipeReviews = async (recipeId) => {
  const res = await fetch(`/api/feedback/${recipeId}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

export const submitRecipeReview = async ({ recipeId, name, message, rating }) => {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipeId, name, message, rating }),
  });
  if (!res.ok) throw new Error("Failed to submit review");
  return res.json();
};
