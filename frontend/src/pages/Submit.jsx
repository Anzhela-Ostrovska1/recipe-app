import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitRecipe } from "../api/recipes";
import "./Submit.css";

export default function Submit() {
  const navigate = useNavigate();
  const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Desserts", "Drinks", "Appetizers", "Simple Recipes"];
  const [form, setForm] = useState({ title: "", ingredients: "", instructions: "", category: "", author: "" });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("ingredients", form.ingredients);
      data.append("instructions", form.instructions);
      data.append("category", form.category);
      data.append("author", form.author);
      if (photo) data.append("photo", photo);

      const recipe = await submitRecipe(data);
      navigate(`/recipe/${recipe._id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="submit-page">
      <div className="submit-container">
        <h1>Share a Recipe</h1>
        <p className="submit-subtitle">Fill in the details below and share your dish with the community.</p>

        <form onSubmit={handleSubmit} className="submit-form">
          <div className="field">
            <label htmlFor="author">Your name (optional)</label>
            <input
              id="author"
              name="author"
              type="text"
              placeholder="e.g. Maria"
              value={form.author}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="category">Category (optional)</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              <option value="">— Select a category —</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="field">
            <label htmlFor="title">Recipe title *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Grandma's Tomato Soup"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="ingredients">Ingredients *</label>
            <textarea
              id="ingredients"
              name="ingredients"
              rows={5}
              placeholder={"2 cups flour\n1 egg\n1 tsp salt\n..."}
              value={form.ingredients}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="instructions">Instructions *</label>
            <textarea
              id="instructions"
              name="instructions"
              rows={6}
              placeholder="Describe the steps clearly..."
              value={form.instructions}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="photo">Photo (optional)</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="file-input"
            />
            {preview && (
              <img src={preview} alt="Preview" className="photo-preview" />
            )}
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting…" : "Submit Recipe"}
          </button>
        </form>
      </div>
    </main>
  );
}
