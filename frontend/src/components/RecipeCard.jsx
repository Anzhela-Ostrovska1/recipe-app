import { Link } from "react-router-dom";
import "./RecipeCard.css";

function Stars({ rating }) {
  return (
    <span className="card-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? "star filled" : "star"}>★</span>
      ))}
      <span className="card-rating-label">{rating}</span>
    </span>
  );
}

export default function RecipeCard({ recipe }) {
  const preview = recipe.ingredients.slice(0, 80) + (recipe.ingredients.length > 80 ? "…" : "");

  return (
    <Link to={`/recipe/${recipe._id}`} className="recipe-card">
      {recipe.photoUrl ? (
        <img src={recipe.photoUrl} alt={recipe.title} className="recipe-card-img" />
      ) : (
        <div className="recipe-card-placeholder">🍴</div>
      )}
      <div className="recipe-card-body">
        <div className="recipe-card-top">
          {recipe.category && <span className="recipe-card-category">{recipe.category}</span>}
          {recipe.reviewCount > 0 && <Stars rating={recipe.averageRating} />}
        </div>
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-ingredients">{preview}</p>
        <div className="recipe-card-footer">
          {recipe.author && <span className="recipe-card-author">by {recipe.author}</span>}
          <span className="recipe-card-link">View recipe →</span>
        </div>
      </div>
    </Link>
  );
}
