import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipe, getRecipeReviews, submitRecipeReview } from "../api/recipes";
import "./RecipeDetail.css";

function Stars({ rating, max = 5 }) {
  return (
    <span className="stars-display">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < Math.round(rating) ? "star filled" : "star"}>★</span>
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-picker">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={i <= (hovered || value) ? "star filled" : "star"}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
        >★</button>
      ))}
    </div>
  );
}

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;
  const [form, setForm] = useState({ name: "", message: "", rating: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    Promise.all([getRecipe(id), getRecipeReviews(id)])
      .then(([r, revs]) => { setRecipe(r); setReviews(revs); })
      .catch(() => setError("Recipe not found."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (form.rating === 0) { setSubmitError("Please select a star rating."); return; }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const newReview = await submitRecipeReview({ recipeId: id, ...form });
      setReviews((prev) => [newReview, ...prev]);
      setRecipe((r) => ({
        ...r,
        reviewCount: (r.reviewCount || 0) + 1,
        averageRating: Math.round(
          (((r.averageRating || 0) * (r.reviewCount || 0)) + form.rating) /
          ((r.reviewCount || 0) + 1) * 10
        ) / 10,
      }));
      setForm({ name: "", message: "", rating: 0 });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main className="detail-page"><p className="state-msg">Loading…</p></main>;
  if (error) return <main className="detail-page"><p className="state-msg error">{error}</p></main>;

  return (
    <main className="detail-page">
      <div className="detail-top-bar">
        <Link to="/" className="back-link">← Back to recipes</Link>
        <button className="print-btn" onClick={() => window.print()}>🖨 Print</button>
      </div>

      {recipe.photoUrl && (
        <img src={recipe.photoUrl} alt={recipe.title} className="detail-photo" />
      )}

      <h1 className="detail-title">{recipe.title}</h1>
      <div className="detail-meta">
        {recipe.category && <span className="detail-category">{recipe.category}</span>}
        {recipe.author && <span className="detail-author">by {recipe.author}</span>}
        {recipe.reviewCount > 0 && (
          <span className="detail-rating">
            <Stars rating={recipe.averageRating} />
            <span className="detail-rating-label">{recipe.averageRating} ({recipe.reviewCount})</span>
          </span>
        )}
      </div>

      <section className="detail-section">
        <h2>Ingredients</h2>
        <pre className="detail-pre">{recipe.ingredients}</pre>
      </section>

      <section className="detail-section">
        <h2>Instructions</h2>
        <pre className="detail-pre">{recipe.instructions}</pre>
      </section>

      <section className="detail-section reviews-section">
        <h2>Reviews {reviews.length > 0 && `(${reviews.length})`}</h2>

        {reviews.length === 0 && (
          <p className="no-reviews">No reviews yet. Be the first!</p>
        )}

        {reviews.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE).map((r) => (
          <div key={r._id} className="review-item">
            <div className="review-header">
              <Stars rating={r.rating} />
              <span className="review-name">{r.name || "Anonymous"}</span>
              <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            {r.message && <p className="review-message">{r.message}</p>}
          </div>
        ))}

        {reviews.length > REVIEWS_PER_PAGE && (
          <div className="reviews-pagination">
            <button
              className="page-btn"
              onClick={() => setReviewPage((p) => p - 1)}
              disabled={reviewPage === 1}
            >← Prev</button>
            <span className="page-info">{reviewPage} / {Math.ceil(reviews.length / REVIEWS_PER_PAGE)}</span>
            <button
              className="page-btn"
              onClick={() => setReviewPage((p) => p + 1)}
              disabled={reviewPage === Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
            >Next →</button>
          </div>
        )}

        <div className="review-form-wrapper">
          <h3>Leave a Review</h3>
          {submitSuccess && <p className="review-success">Thank you for your review!</p>}
          <form onSubmit={handleReviewSubmit} className="review-form">
            <div className="review-form-row">
              <div className="field">
                <label>Your rating *</label>
                <StarPicker value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
              </div>
              <div className="field">
                <label>Your name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Maria"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
            </div>
            <div className="field">
              <label>Comment *</label>
              <textarea
                rows={3}
                placeholder="What did you think of this recipe?"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
            </div>
            {submitError && <p className="form-error">{submitError}</p>}
            <button type="submit" className="review-submit-btn" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
