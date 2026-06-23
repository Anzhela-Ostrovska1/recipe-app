# RecipeShare App

A full-stack recipe sharing web app built with React, Node.js, MongoDB, and Cloudinary.

---

## Project Structure

```
recipe-app/
├── frontend/   → React app (deployed to Vercel)
└── backend/    → Node.js API (deployed to Render)
```

---

## Before You Start — Create These Free Accounts

1. **MongoDB Atlas** → https://www.mongodb.com/atlas
   - Create a free cluster
   - Go to Database Access → add a user with a password
   - Go to Network Access → Allow access from anywhere (0.0.0.0/0)
   - Go to Clusters → Connect → copy the connection string

2. **Cloudinary** → https://cloudinary.com
   - Sign up for free
   - From the dashboard copy: Cloud Name, API Key, API Secret

3. **GitHub** → https://github.com
   - Create a new repository called `recipe-app`
   - Push this project to it

4. **Render** → https://render.com (backend hosting)

5. **Vercel** → https://vercel.com (frontend hosting)

---

## Local Development Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

Your `.env` file should look like:
```
MONGODB_URI=mongodb+srv://user:password@cluster0.mongodb.net/recipeapp
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PASSWORD=choose_a_strong_password
PORT=5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000 for local development
npm start
```

---

## Deployment

### Step 1 — Deploy Backend to Render

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo
3. Set Root Directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all your environment variables from `.env`
7. Click Deploy — copy the URL (e.g. `https://recipe-app-xyz.onrender.com`)

### Step 2 — Deploy Frontend to Vercel

1. Go to https://vercel.com → New Project
2. Connect your GitHub repo
3. Set Root Directory to `frontend`
4. Add environment variable:
   `REACT_APP_API_URL` = the Render URL from Step 1
5. Click Deploy

---

## Admin Panel

The admin panel is at `/admin` on your live site.

- Go to `yoursite.com/admin`
- Enter the `ADMIN_PASSWORD` you set in the backend `.env`
- You can now edit or delete any recipe

---

## Pages

| Route | Description |
|---|---|
| `/` | Browse all recipes |
| `/submit` | Submit a new recipe |
| `/recipe/:id` | View a single recipe |
| `/admin` | Admin panel (password protected) |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/recipes` | Get all recipes |
| GET | `/api/recipes/:id` | Get one recipe |
| POST | `/api/recipes` | Submit a recipe |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/recipes` | Admin: get all |
| PUT | `/api/admin/recipes/:id` | Admin: edit recipe |
| DELETE | `/api/admin/recipes/:id` | Admin: delete recipe |

---

## Making Changes After Deployment

Any change follows this process:
1. Edit the code on your computer
2. `git add . && git commit -m "describe your change"`
3. `git push`
4. Vercel and Render auto-deploy within ~1 minute
