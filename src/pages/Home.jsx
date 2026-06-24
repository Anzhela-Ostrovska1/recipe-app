import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { getRecipes } from "../api/recipes";
import "./Home.css";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Desserts", "Drinks", "Appetizers", "Simple Recipes"];

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const activeCategory = searchParams.get("category") || "";

  useEffect(() => {
    getRecipes()
      .then(setRecipes)
      .catch(() => setError("Could not load recipes. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  function selectCategory(cat) {
    const params = new URLSearchParams(searchParams);
    if (cat) params.set("category", cat);
    else params.delete("category");
    navigate(`/?${params.toString()}`, { replace: true });
  }

  const displayed = recipes.filter((r) => {
    const matchesQuery = !query ||
      r.title?.toLowerCase().includes(query.toLowerCase()) ||
      r.description?.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !activeCategory || r.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <main className="home">
      <div className="home-header">
        {query ? (
          <>
            <h1>Results for "{query}"</h1>
            <p>{displayed.length} recipe{displayed.length !== 1 ? "s" : ""} found</p>
          </>
        ) : (
          <>
            <h1>Family Recipes</h1>
            <p>Dishes shared by people like you</p>
          </>
        )}
      </div>

      <div className="category-filters">
        <button
          className={`category-btn ${!activeCategory ? "active" : ""}`}
          onClick={() => selectCategory("")}
        >All</button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => selectCategory(cat)}
          >{cat}</button>
        ))}
      </div>

      {loading && <p className="state-msg">Loading recipes…</p>}

      {error && <p className="state-msg error">{error}</p>}

      {!loading && !error && displayed.length === 0 && (
        <div className="empty-state">
          <span>🍳</span>
          <p>{query || activeCategory ? "No recipes match your filters." : "No recipes yet."}</p>
          {!query && !activeCategory && <Link to="/submit" className="btn-primary">Be the first to add one</Link>}
        </div>
      )}

      {!loading && !error && displayed.length > 0 && (
        <div className="recipe-grid">
          {displayed.map((r) => <RecipeCard key={r._id} recipe={r} />)}
        </div>
      )}
    </main>
  );
}
