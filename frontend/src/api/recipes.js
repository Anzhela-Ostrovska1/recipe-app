const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getRecipes = async () => {
  const res = await fetch(`${BASE}/api/recipes`);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
};

export const getRecipe = async (id) => {
  const res = await fetch(`${BASE}/api/recipes/${id}`);
  if (!res.ok) throw new Error("Recipe not found");
  return res.json();
};

export const submitRecipe = async (formData) => {
  const res = await fetch(`${BASE}/api/recipes`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to submit recipe");
  return res.json();
};

export const adminLogin = async (password) => {
  const res = await fetch(`${BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Wrong password");
  return res.json();
};

export const adminGetRecipes = async (password) => {
  const res = await fetch(`${BASE}/api/admin/recipes`, {
    headers: { "x-admin-password": password },
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};

export const adminDeleteRecipe = async (id, password) => {
  const res = await fetch(`${BASE}/api/admin/recipes/${id}`, {
    method: "DELETE",
    headers: { "x-admin-password": password },
  });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
};

export const getRecipeReviews = async (recipeId) => {
  const res = await fetch(`${BASE}/api/feedback/${recipeId}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

export const submitRecipeReview = async ({ recipeId, name, message, rating }) => {
  const res = await fetch(`${BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipeId, name, message, rating }),
  });
  if (!res.ok) throw new Error("Failed to submit review");
  return res.json();
};

export const adminUpdateRecipe = async (id, formData, password) => {
  const res = await fetch(`${BASE}/api/admin/recipes/${id}`, {
    method: "PUT",
    headers: { "x-admin-password": password },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
};
