import { useState } from "react";
import { adminLogin, adminGetRecipes, adminDeleteRecipe, adminUpdateRecipe, uploadPhoto } from "../api/recipes";
import "./Admin.css";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loginError, setLoginError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editPhoto, setEditPhoto] = useState(null);
  const [msg, setMsg] = useState(null);

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(null), 3000); };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(password);
      const data = await adminGetRecipes(password);
      setRecipes(data);
      setAuthed(true);
    } catch {
      setLoginError("Wrong password.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await adminDeleteRecipe(id, password);
      setRecipes((r) => r.filter((x) => x._id !== id));
      notify("Recipe deleted.");
    } catch {
      notify("Failed to delete.");
    }
  };

  const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Desserts", "Drinks", "Appetizers", "Simple Recipes"];

  const startEdit = (recipe) => {
    setEditing(recipe._id);
    setEditForm({ title: recipe.title, ingredients: recipe.ingredients, instructions: recipe.instructions, category: recipe.category || "", author: recipe.author || "" });
    setEditPhoto(null);
  };

  const handleEditSave = async (id) => {
    try {
      const body = {
        title: editForm.title,
        ingredients: editForm.ingredients,
        instructions: editForm.instructions,
        category: editForm.category,
        author: editForm.author,
      };
      if (editPhoto) {
        const { photoUrl, photoPublicId } = await uploadPhoto(editPhoto);
        body.photoUrl = photoUrl;
        body.photoPublicId = photoPublicId;
      }

      const updated = await adminUpdateRecipe(id, body, password);
      setRecipes((r) => r.map((x) => (x._id === id ? updated : x)));
      setEditing(null);
      notify("Recipe updated.");
    } catch {
      notify("Failed to update.");
    }
  };

  if (!authed) {
    return (
      <main className="admin-page">
        <div className="admin-login">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginError && <p className="form-error">{loginError}</p>}
            <button type="submit">Log in</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>{recipes.length} recipe{recipes.length !== 1 ? "s" : ""} in total</p>
      </div>

      {msg && <div className="admin-toast">{msg}</div>}

      <div className="admin-list">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="admin-item">
            {editing === recipe._id ? (
              <div className="edit-form">
                <input
                  value={editForm.author}
                  onChange={(e) => setEditForm((f) => ({ ...f, author: e.target.value }))}
                  placeholder="Author name"
                />
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                >
                  <option value="">— No category —</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Title"
                />
                <textarea
                  rows={4}
                  value={editForm.ingredients}
                  onChange={(e) => setEditForm((f) => ({ ...f, ingredients: e.target.value }))}
                  placeholder="Ingredients"
                />
                <textarea
                  rows={4}
                  value={editForm.instructions}
                  onChange={(e) => setEditForm((f) => ({ ...f, instructions: e.target.value }))}
                  placeholder="Instructions"
                />
                <input type="file" accept="image/*" onChange={(e) => setEditPhoto(e.target.files[0])} />
                <div className="edit-actions">
                  <button className="btn-save" onClick={() => handleEditSave(recipe._id)}>Save</button>
                  <button className="btn-cancel" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="admin-item-content">
                {recipe.photoUrl && (
                  <img src={recipe.photoUrl} alt={recipe.title} className="admin-thumb" />
                )}
                <div className="admin-item-info">
                  <p className="admin-item-title">{recipe.title}</p>
                  <p className="admin-item-date">{new Date(recipe.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="admin-item-actions">
                  <button className="btn-edit" onClick={() => startEdit(recipe)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(recipe._id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
