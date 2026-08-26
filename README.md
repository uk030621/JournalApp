# Marginalia — a personal journal app

Next.js 15 (App Router) + MongoDB + Auth.js (NextAuth v5) with Google sign-in.

## Features

- Google sign-in / sign-out (Auth.js v5, database sessions in MongoDB)
- Full CRUD on journal entries (title, content, date, mood, tags)
- Full-text search across title/content/tags, plus mood filtering
- Pin/favorite entries, sorted to the top
- Writing streak, total entries, and total word count (top bar)
- Word count on the entry you're writing
- Light (parchment) / dark (ink) theme toggle, persisted locally
- Fully responsive: collapsible entry list on mobile, ruled-paper
  editor that works down to phone width
- Per-user data isolation — entries are scoped to the signed-in user
  at the database query level, not just in the UI
- Route params are awaited (`const { id } = await params`) per the
  Next.js 15 async-params requirement, everywhere they're used

## 1. Install dependencies

```bash
npm install
```

## 2. Set up MongoDB

Use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
cluster or a local `mongod`. You just need a connection string — no
manual schema setup is required, indexes are created automatically
(including the text index used for search) the first time the app
connects.

## 3. Set up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an OAuth 2.0 Client ID (type: Web application).
3. Add authorized redirect URI:
   - Local dev: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
4. Copy the Client ID and Client Secret.

## 4. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

```
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=<run: openssl rand -base64 33>
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

## 5. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`, sign in with Google, and start writing
at `/journal`.

## Project structure

```
app/
  api/
    auth/[...nextauth]/route.js   Auth.js handler
    entries/route.js              GET (list+search), POST (create)
    entries/[id]/route.js         GET/PUT/DELETE one entry (async params)
    stats/route.js                streak / totals / mood breakdown
  journal/
    page.js                       server component, auth-gated
    JournalClient.jsx             client-side app shell
  signin/page.js                  custom Google sign-in screen
  components/                     UI building blocks
  layout.js, globals.css          fonts, theme, ruled-paper styling
auth.js                           Auth.js config (Google + Mongo adapter)
middleware.js                     protects /journal/*
lib/mongoose.js                   Mongoose connection (app data)
lib/mongodb-client.js             raw MongoClient (Auth.js adapter)
models/Entry.js                   journal entry schema + text index
```

## Notes on deploying

- Set the same environment variables on your host (Vercel, etc.).
- Update the Google OAuth redirect URI and `NEXTAUTH_URL` to your
  production domain.
- MongoDB Atlas: allow network access from your host's IP range (or
  `0.0.0.0/0` for simplicity, tightened later).
