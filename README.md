# Family Recipes App

A family recipe sharing app built with React, Vercel Serverless Functions, MongoDB Atlas, and Cloudinary. The entire app — frontend and API — runs as a single project on Vercel. No separate backend server needed.

---

## Features

- Browse family recipes in a card grid
- Live search as you type
- Filter by category: Breakfast, Lunch, Dinner, Desserts, Drinks, Appetizers, Simple Recipes
- Submit a recipe with title, ingredients, instructions, photo, category, and author name
- Photos upload directly to Cloudinary from the browser
- Star reviews (1–5) on each recipe, paginated 5 per page
- Print a recipe cleanly — navbar and reviews are hidden when printing
- Admin panel to edit or delete any recipe (password protected)

---

## Project Structure

```
recipe-app/
├── api/                     → Vercel serverless functions (Node.js)
│   ├── _lib/                → Shared helpers (DB, models, Cloudinary, CORS)
│   ├── recipes/             → GET all / POST new recipe
│   ├── admin/               → Admin login, GET/PUT/DELETE recipes
│   ├── feedback/            → GET and POST star reviews
│   └── upload-signature.js  → Signs Cloudinary uploads
├── src/                     → React frontend
│   ├── api/recipes.js       → All API calls
│   ├── components/          → Navbar, RecipeCard
│   └── pages/               → Home, Submit, RecipeDetail, Admin
├── public/                  → Static HTML shell
├── package.json             → Combined dependencies
└── vercel.json              → Build config and SPA routing
```

---

## Before You Start — Create These Free Accounts

1. **MongoDB Atlas** → https://www.mongodb.com/atlas
   - Create a free cluster
   - Go to **Database Access** → add a user with a password
   - Go to **Network Access** → click Add IP Address → choose **Allow access from anywhere** (`0.0.0.0/0`)
   - Go to **Clusters → Connect** → copy the connection string

2. **Cloudinary** → https://cloudinary.com
   - Sign up for free
   - From the dashboard copy: Cloud Name, API Key, API Secret

3. **GitHub** → https://github.com
   - Create a repository and push this project to it

4. **Vercel** → https://vercel.com
   - Sign up and connect your GitHub account

---

## Environment Variables

You need these 5 variables. For local development put them in `.env.local` at the project root. For production set them in the Vercel dashboard.

```
MONGODB_URI=mongodb+srv://user:password@cluster0.mongodb.net/recipeapp
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PASSWORD=choose_a_strong_password
```

---

## Local Development

You need the Vercel CLI to run the app locally, because it runs both the React dev server and the serverless API functions together.

```bash
# Install the Vercel CLI (once)
npm install -g vercel

# Install project dependencies
npm install

# Log in and link the project (once)
vercel login
vercel link

# Create your local env file
cp .env.example .env.local
# Fill in your real values in .env.local

# Start the local dev server
vercel dev
```

The app runs at `http://localhost:3000`.

> Do not use `npm start` — it only starts the React UI and the API calls will fail.

---

## Deployment

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "initial deploy"
git push
```

### Step 2 — Deploy on Vercel

1. Go to https://vercel.com → **New Project**
2. Import your GitHub repository
3. Leave the root directory as `.` (the project root)
4. Go to **Environment Variables** and add all 5 variables listed above
5. Click **Deploy**

Vercel automatically runs `npm run build` and serves the app. Future deploys happen automatically on every `git push`.

---

## Admin Panel

Go to `/admin` on your live site (e.g. `yoursite.vercel.app/admin`).

- Enter the `ADMIN_PASSWORD` you set in your environment variables
- Edit or delete any recipe, including its category and author

---

## Pages

| Route | Description |
|---|---|
| `/` | Browse all recipes with live search and category filters |
| `/submit` | Submit a new recipe |
| `/recipe/:id` | View a recipe, read reviews, and leave a star review |
| `/admin` | Admin panel (password protected) |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/recipes` | Get all recipes |
| GET | `/api/recipes/:id` | Get one recipe |
| POST | `/api/recipes` | Create a recipe (JSON body) |
| GET | `/api/feedback/:recipeId` | Get reviews for a recipe |
| POST | `/api/feedback` | Submit a star review |
| POST | `/api/upload-signature` | Get a signed Cloudinary upload token |
| POST | `/api/admin/login` | Verify admin password |
| GET | `/api/admin/recipes` | Admin: list all recipes |
| PUT | `/api/admin/recipes/:id` | Admin: edit a recipe |
| DELETE | `/api/admin/recipes/:id` | Admin: delete a recipe |

---

## Making Changes After Deployment

```bash
# Edit files, then:
git add .
git commit -m "describe your change"
git push
# Vercel redeploys automatically within ~1 minute
```
