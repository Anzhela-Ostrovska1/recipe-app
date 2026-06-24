import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    navigate(val.trim() ? `/?q=${encodeURIComponent(val.trim())}` : "/", { replace: true });
  }

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to="/" className="navbar-logo">🍽 RecipeShare</Link>
        <div className="navbar-links">
          <Link to="/" className={`btn-browse ${pathname === "/" && !searchParams.get("q") ? "active" : ""}`}>Browse</Link>
          <Link to="/submit" className={`btn-submit ${pathname === "/submit" ? "active" : ""}`}>
            + Add Recipe
          </Link>
        </div>
      </div>
      <form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          placeholder="Search recipes…"
          value={query}
          onChange={handleChange}
          aria-label="Search recipes"
        />
      </form>
    </nav>
  );
}
