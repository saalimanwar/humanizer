# Humanizer — Remove the Robot

> Paste AI-generated text. Get writing that sounds like a person wrote it.

**Free · Open Source · No credit card · No login**

🔗 **Live site:** [humanizer.vercel.app](https://humanizer.vercel.app)
📦 **GitHub:** [github.com/saalimanwar/humanizer](https://github.com/saalimanwar/humanizer)

---

## What it does

Humanizer detects and removes 25 patterns of AI-generated writing — based on Wikipedia's [Signs of AI Writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) guide — then injects genuine voice and personality into the result.

It streams the rewrite to your browser in real time, and tells you exactly what changed and why.

---

## The 25 patterns it fixes

| # | Pattern | Example removed |
|---|---|---|
| 1 | Significance inflation | "marks a pivotal moment", "evolving landscape" |
| 2 | Notability overemphasis | vague media lists, "active social media presence" |
| 3 | Superficial -ing phrases | "highlighting...", "reflecting...", "showcasing..." |
| 4 | Promotional language | "nestled", "vibrant", "groundbreaking", "stunning" |
| 5 | Vague attributions | "Experts argue", "Industry observers" |
| 6 | Copula avoidance | "serves as" → "is", "stands as" → "is" |
| 7 | Negative parallelism | "It's not just X; it's Y" |
| 8 | Em dash overuse | decorative — em — dashes |
| 9 | Rule of three / synonym cycling | "innovative, dynamic, and transformative" |
| 10 | False ranges | "from X to Y, from A to B" |
| 11 | Chatbot artifacts | "Great question!", "I hope this helps!" |
| 12 | Hollow transitions | "Furthermore", "Moreover", "In conclusion" |
| 13 | Bullet point obsession | fragmenting prose into unnecessary lists |
| 14 | Emoji abuse | 💡🚀✅ as bullet points |
| 15 | Bold overuse | **random bolding** for fake emphasis |
| 16 | Unnecessary headers | "Key Benefits:", "Important Considerations:" |
| 17 | Knowledge cutoff hedging | "As of my last update..." |
| 18 | Unnecessary affirmations | "Certainly!", "Absolutely!", "Of course!" |
| 19 | False objectivity | "pros and cons on both sides" |
| 20 | Excessive caution disclaimers | walls of caveats before any useful content |
| 21 | Sycophantic openers | "That's a fascinating question!" |
| 22 | Filler phrases | "leverage", "synergy", "circle back", "bandwidth" |
| 23 | Excessive hedging | "could potentially possibly be argued that" |
| 24 | Generic positive conclusions | "The future looks bright", "exciting times lie ahead" |
| 25 | Hyphenated word pair overuse | "cross-functional", "data-driven", "end-to-end" |

---

## Stack — everything free

| Layer | Tool | Cost |
|---|---|---|
| Frontend | HTML + CSS + Vanilla JS | Free |
| Hosting | [Vercel](https://vercel.com) | Free |
| Backend | Vercel Serverless Function | Free |
| AI Model | Llama 3.3 70B via [Groq](https://groq.com) | Free (14,400 req/day) |
| Source | [GitHub](https://github.com) | Free |

No credit card. No subscription. No login required to use the site.

---

## How it works

```
Browser (index.html)
    │
    │  POST { text: "..." }
    ▼
Vercel Serverless Function (api/humanize.js)
    │  ← GROQ_API_KEY lives here, safe and hidden
    │
    │  calls Groq API → Llama 3.3 70B
    ▼
Streams SSE response back to browser
    │
    ▼
Text appears word-by-word in real time
```

Your API key never touches the browser. It lives only in Vercel's environment variables.

---

## Project structure

```
humanizer/
│
├── index.html          ← Entire frontend UI
│                         Edit for: colors, samples, layout, copy
│
├── api/
│   └── humanize.js     ← Secure serverless backend
│                         Edit for: AI prompt, model, behavior
│
├── vercel.json         ← Vercel routing config
├── .gitignore          ← Keeps secrets off GitHub
├── LICENSE             ← MIT
└── README.md           ← This file
```

---

## Deploy your own copy

### 1. Get a free Groq API key

1. Go to → **https://console.groq.com**
2. Sign up with Google — no credit card
3. Click **API Keys → Create API Key**
4. Copy the key (starts with `gsk_...`)

### 2. Fork this repo

Click **Fork** on this GitHub page → your copy is ready.

### 3. Deploy to Vercel

1. Go to **https://vercel.com** → New Project
2. Import your forked GitHub repo
3. Click Deploy — done, it's live

### 4. Add your API key

1. Vercel → your project → **Settings → Environment Variables**
2. Add:
   - **Key:** `GROQ_API_KEY`
   - **Value:** `gsk_...your key...`
   - Tick: Production ✅ Preview ✅ Development ✅
3. Save → **Deployments → Redeploy**

Your site is live.

---

## Daily workflow

```bash
# Edit files in VS Code, then:
git add .
git commit -m "describe what changed"
git push
# Vercel auto-deploys in ~30 seconds ✅
```

No `vercel --prod` needed. GitHub push = auto-deploy.

---

## Customizing

**Change the AI behavior** → edit `SYSTEM_PROMPT` in `api/humanize.js`

**Add sample texts** → find the `SAMPLES` object in `index.html`

**Change colors** → find CSS variables at the top of `index.html` (`:root { ... }`)

**Change the model** → in `api/humanize.js`, replace `llama-3.3-70b-versatile` with any [Groq-supported model](https://console.groq.com/docs/models)

---

## Groq free tier limits

| Limit | Amount |
|---|---|
| Requests per minute | 30 |
| Requests per day | 14,400 |
| Tokens per minute | 6,000 |

More than enough for personal or small-scale use.

---

## Based on

Wikipedia: [Signs of AI Writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
Maintained by WikiProject AI Cleanup.

> "LLMs use statistical algorithms to guess what should come next. The result tends toward the most statistically likely result that applies to the widest variety of cases."

---

## License


---

Made by [@saalimanwar](https://github.com/saalimanwar)
