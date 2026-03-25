# Humanizer — Remove the Robot

> Paste AI-generated text. Get writing that sounds like a person wrote it.

**100% free · Open source · No credit card ever**

Live at: `https://your-project.vercel.app` (after you deploy below)

---

## Everything is free

| What | Cost |
|---|---|
| GitHub (code storage) | Free |
| Vercel (hosting + backend) | Free |
| Gemini 2.0 Flash API | Free — 1,500 requests/day |
| Your domain (optional) | Free subdomain from Vercel |

---

## How it works

```
You (browser)
    │
    │  POST { text: "..." }
    ▼
Vercel Edge Function  ← your API key is secret here
    │
    │  calls Gemini API with your key
    ▼
Google Gemini 2.0 Flash
    │
    │  streams response back
    ▼
Your browser shows text in real time
```

---

## Deploy in 15 minutes (step by step)

### 1. Install the tools you need

Install these once on your computer:

- **VS Code** → https://code.visualstudio.com
- **Git** → https://git-scm.com/downloads
- **Node.js** (version 18 or higher) → https://nodejs.org
- **Vercel CLI** — open a terminal (in VS Code: Terminal → New Terminal) and run:

```bash
npm install -g vercel
```

---

### 2. Get your FREE Gemini API key

1. Go to → **https://aistudio.google.com**
2. Sign in with your Google account
3. Click **"Get API Key"** in the top left
4. Click **"Create API key"**
5. Copy the key (looks like `AIzaSy...`) — save it somewhere safe

This key gives you **1,500 free requests per day**. No credit card needed.

---

### 3. Put the project on GitHub

**Create the repo:**
1. Go to → **https://github.com** and sign in (or sign up free)
2. Click the **+** icon → **New repository**
3. Name it: `humanizer`
4. Leave it Public
5. Click **Create repository**

**Push the code from VS Code:**

Open the `humanizer-free/` folder in VS Code, then open the terminal:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/humanizer.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

### 4. Deploy to Vercel (free hosting)

In the same terminal:

```bash
vercel
```

It will ask a few questions — just press **Enter** to accept all defaults.

At the end it prints your live URL, like:
```
https://humanizer-abc123.vercel.app
```

That URL is already live — but it won't work yet until you add the API key in step 5.

---

### 5. Add your Gemini API key to Vercel

1. Go to → **https://vercel.com** → open your `humanizer` project
2. Click **Settings** tab → **Environment Variables**
3. Click **Add New**:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** paste your key from step 2 (`AIzaSy...`)
   - Check all three boxes: Production ✓ Preview ✓ Development ✓
4. Click **Save**
5. Go to the **Deployments** tab → click the **⋯** menu on the latest deploy → click **Redeploy**

Wait ~30 seconds. Your site is now live and working. Share the URL with anyone.

---

## Day-to-day: edit → push → live

This is your normal workflow once set up:

1. Open the project in **VS Code**
2. Edit `index.html` (to change the UI) or `api/humanize.js` (to change the AI behavior)
3. Save the file
4. In the VS Code terminal:

```bash
git add .
git commit -m "what I changed"
git push
```

5. Vercel auto-deploys in ~30 seconds. Your live site updates automatically. Done.

---

## Test on your computer before pushing (optional)

Create a file called `.env.local` in the project folder:

```
GEMINI_API_KEY=AIzaSy...your key here...
```

Then run:

```bash
vercel dev
```

Open http://localhost:3000 — this runs everything locally including the backend.

---

## Project files explained

```
humanizer-free/
│
├── index.html          ← The entire website UI
│                         Edit this to change buttons, text, colors, samples
│
├── api/
│   └── humanize.js     ← The secure backend
│                         Edit this to change the AI prompt or model
│
├── vercel.json         ← Routing config (don't need to touch this)
├── .gitignore          ← Keeps your API key off GitHub (don't touch)
└── README.md           ← This file
```

---

## Customizing

**Change the AI prompt** → open `api/humanize.js`, edit the `SYSTEM_PROMPT` string at the top

**Add more sample texts** → open `index.html`, find the `SAMPLES` object, add a new key

**Change colors** → open `index.html`, find `#c0392b` (red) and replace with any hex color

**Change the model** → in `api/humanize.js`, replace `gemini-2.0-flash` with another model name

---

## Free tier limits (Gemini)

| Limit | Amount |
|---|---|
| Requests per minute | 15 |
| Requests per day | 1,500 |
| Tokens per minute | 1,000,000 |

For a personal or small project this is more than enough. If you ever need more, paid tier starts at $0.10 per million tokens.

---

## License

MIT — do whatever you want with this.
