# Humanizer — Complete Project Documentation
### From Idea to Live Website — Everything Explained

---

## Table of Contents

1. [What Problem Are We Solving?](#1-what-problem-are-we-solving)
2. [Why Build This When It Already Exists Online?](#2-why-build-this-when-it-already-exists-online)
3. [What Is Humanizer?](#3-what-is-humanizer)
4. [The Technical Stack — What We Used and Why](#4-the-technical-stack--what-we-used-and-why)
5. [How It Works — The Complete Flow](#5-how-it-works--the-complete-flow)
6. [The AI Brain — How We Taught It to Humanize](#6-the-ai-brain--how-we-taught-it-to-humanize)
7. [Project Structure Explained](#7-project-structure-explained)
8. [Security — Why the API Key Is Never in the Code](#8-security--why-the-api-key-is-never-in-the-code)
9. [The Deployment Pipeline](#9-the-deployment-pipeline)
10. [What We Built vs What Exists Online](#10-what-we-built-vs-what-exists-online)
11. [Interview — How to Explain This Project](#11-interview--how-to-explain-this-project)

---

## 1. What Problem Are We Solving?

### The Rise of AI Writing

Since 2023, tools like ChatGPT, Claude, and Gemini have become mainstream. Millions of people use them daily to write emails, essays, LinkedIn posts, product reviews, blog articles, and reports.

The problem? **AI writing sounds like AI writing.**

Everyone can feel it. Nobody can quite explain it until they see the patterns:

> *"In today's rapidly evolving technological landscape, artificial intelligence stands as a testament to human ingenuity, marking a pivotal moment in the history of civilization."*

That sentence has:
- "rapidly evolving landscape" — AI filler
- "stands as a testament to" — inflated significance
- "marking a pivotal moment" — dramatic but empty
- "history of civilization" — wildly over-scoped

It sounds impressive for half a second. Then it says absolutely nothing.

### The Real Cost

When your writing sounds like it came from a robot:

- **Professional credibility drops** — employers and clients notice
- **AI detectors flag it** — tools like Turnitin, GPTZero mark it as AI-generated
- **Readers disengage** — the writing feels hollow, nobody connects with it
- **Your actual voice disappears** — you sound like everyone else using ChatGPT

### What People Do Today

Currently people either:
1. Paste text into ChatGPT and say "make this sound more human" — which often just produces different AI writing
2. Pay $20–30/month for tools like Undetectable.ai or Quillbot — which spin words but don't fix the underlying patterns
3. Manually rewrite — time consuming, and they don't know what to look for

**None of these solutions are free. None of them explain what they changed. None of them are open source.**

---

## 2. Why Build This When It Already Exists Online?

This is the most important question. Here is the honest answer:

### What Exists Online

| Tool | Cost | Open Source | Explains Changes | Quality |
|---|---|---|---|---|
| Undetectable.ai | $9.99–$49.99/month | No | No | Medium |
| Quillbot | $19.95/month | No | No | Medium |
| Humanize AI | Freemium, limits | No | No | Low |
| GPTinf | Paid | No | No | Low |
| WordAI | $57/month | No | No | Medium |

### What Makes Ours Different

**1. Completely free, forever.**
No login. No credit card. No daily limit hit after 3 uses. Just paste and go.

**2. It explains what it changed and why.**
Every other tool is a black box. Ours shows you a "What Changed" section after every rewrite — so you learn what AI patterns look like and start avoiding them yourself.

**3. It fixes root causes, not symptoms.**
Most tools rephrase sentences. We remove 25 specific documented AI patterns — like "significance inflation", "vague attributions", "superficial -ing phrases" — based on Wikipedia's actual research into AI writing tells. The problem is structural, not just vocabulary.

**4. It streams in real time.**
You see the rewrite appearing word by word, live. No spinner, no waiting. It feels interactive and immediate.

**5. It is open source.**
Anyone can read the code, fork it, improve it, or learn from it. The prompt is visible. The logic is transparent. No black box.

**6. It is a complete real-world engineering project.**
Not a tutorial. Not a toy. A production deployment with a secure backend, environment variables, CI/CD pipeline, and a live URL — built with the same patterns professional developers use every day.

---

## 3. What Is Humanizer?

Humanizer is a **free, open source web application** that:

1. Accepts AI-generated text as input
2. Sends it to a powerful language model (Llama 3.3 70B via Groq)
3. Rewrites it to remove 25 documented AI writing patterns
4. Streams the result back to your browser word by word in real time
5. Shows you exactly what changed and why

It runs at a public URL. Anyone in the world can use it. It costs the user nothing.

### Who Is It For?

- **Students** — fixing AI-assisted essays before submission
- **Professionals** — making work emails and reports sound natural
- **Content creators** — cleaning up AI-drafted blog posts
- **Job seekers** — humanizing AI-written cover letters
- **Anyone** — who wants their writing to have a voice again

---

## 4. The Technical Stack — What We Used and Why

Every tool was chosen deliberately. Here is what we used and the exact reason:

---

### Frontend — `index.html`
**Plain HTML + CSS + Vanilla JavaScript**

**Why not React or Vue?**
This project has one screen. One input box. One output box. One button. React adds a build step, node_modules, and complexity for zero benefit here. Vanilla JS is faster to load, easier to understand, and requires no setup. When you are learning, understanding the fundamentals beats hiding them behind a framework.

**Fonts — Fraunces + Figtree**
Fraunces is a variable optical-size serif — it looks completely different at display size versus body size. Used for the hero heading. Figtree is a clean geometric sans used for body text and UI. Together they create visual contrast that makes the page feel designed, not generated.

**Aurora Background**
Four colored blobs with `filter: blur(120px)` drifting slowly using CSS `@keyframes`. No images, no canvas, no JavaScript — pure CSS. Gives the page depth and atmosphere without slowing it down.

**Streaming — Server Sent Events (SSE)**
Instead of waiting for the full rewrite to finish and showing it all at once, we stream it word by word using SSE. The browser reads a continuous stream of data chunks and renders them as they arrive. This is how ChatGPT's interface works. It makes the experience feel fast and alive even if the total time is the same.

---

### Backend — `api/humanize.js`
**Vercel Serverless Edge Function (Node.js)**

**What is a serverless function?**
Instead of running a permanent server 24/7 (which costs money), Vercel spins up a tiny function only when someone clicks the button. It runs, does its job, and disappears. You pay nothing. The function handles:
- Receiving the text from the browser
- Adding the API key from environment variables
- Calling the Groq API
- Streaming the response back to the browser

**Why not call the AI API directly from the browser?**
If you call the API from the browser, your secret API key is visible to anyone who opens DevTools → Network. They can steal it, use it, and run up your bill. The serverless function sits in the middle — the browser sends text to our function, our function adds the secret key and calls the AI, the AI responds to our function, and our function streams it back. The key never touches the browser.

---

### AI Model — Llama 3.3 70B via Groq
**Why Groq?**
Groq built custom hardware called LPUs (Language Processing Units) specifically for running AI models. They are dramatically faster than GPU-based inference. The free tier gives 14,400 requests per day — more than enough for any personal or small project.

**Why Llama 3.3 70B?**
Meta's Llama 3.3 70B is one of the most capable open source language models available. "70B" means 70 billion parameters — the size of the model determines how well it understands nuance, follows complex instructions, and produces high-quality rewrites. It is comparable to GPT-4 in writing tasks and is completely free to use via Groq.

**Why not ChatGPT or Claude?**
Both require paid API access. Our entire goal is zero cost. Groq + Llama gives GPT-4 level quality for free.

---

### Hosting — Vercel
**Why Vercel?**
Vercel is purpose-built for exactly this kind of project — a static frontend with serverless API functions. It handles:
- Hosting the `index.html`
- Running the `api/humanize.js` function on every request
- SSL certificate (the `https://` padlock) automatically
- Global CDN — the site loads fast from India, USA, Europe, everywhere
- Auto-deploy when you push to GitHub

The free tier is permanent and has no meaningful limits for a project like this.

---

### Version Control — Git + GitHub
**Why Git?**
Git tracks every change you make to your code. Every `git commit` is a saved snapshot. If you break something, you can go back. It is the universal standard — every professional developer uses it.

**Why GitHub?**
GitHub stores your code in the cloud so it is not lost if your computer breaks. It also acts as the trigger for Vercel — every `git push` automatically deploys your latest changes to the live site.

---

### CI/CD Pipeline — Continuous Integration / Continuous Deployment
This is the professional term for what happens when you run `git push`:

```
You edit code in VS Code
       ↓
git add . → git commit → git push
       ↓
GitHub receives the new code
       ↓
Vercel detects the push automatically
       ↓
Vercel builds and deploys in ~30 seconds
       ↓
Live site is updated at the same URL
```

This is exactly how Netflix, Spotify, and every modern software company ships code. You built a real CI/CD pipeline.

---

## 5. How It Works — The Complete Flow

Here is what happens from the moment someone opens the site to the moment they read their result:

```
STEP 1 — User opens the website
Browser loads index.html from Vercel's CDN
Fonts load from Google Fonts
Aurora animation starts running in CSS
Page fades in with staggered animations

STEP 2 — User pastes text and clicks Humanize
JavaScript reads the text from the textarea
The output panel border starts spinning (animated conic gradient)
A progress bar appears at the top of the page
fetch('/api/humanize') is called with the text as JSON body

STEP 3 — The serverless function wakes up
Vercel starts api/humanize.js
The function reads GROQ_API_KEY from environment variables
It builds a request to the Groq API with:
  - The system prompt (the 25 pattern instructions)
  - The user's text
  - model: llama-3.3-70b-versatile
  - stream: true

STEP 4 — Groq streams the response
Groq processes the text using Llama 3.3 70B
It returns the rewrite as a stream of small chunks
Each chunk is a few words or a sentence fragment

STEP 5 — The function pipes the stream to the browser
As each chunk arrives from Groq, the function immediately
forwards it to the browser using Server-Sent Events (SSE)
No buffering — instant relay

STEP 6 — The browser renders the stream
JavaScript reads each SSE chunk
It extracts the text between <humanized> tags
It updates the output panel in real time
The user sees text appearing word by word

STEP 7 — The stream ends
The full rewrite is now in the output panel
The spinning border disappears
The progress bar completes
The "What Changed" section appears
The "Copy Result" button appears
```

---

## 6. The AI Brain — How We Taught It to Humanize

The most important part of the project is not the code. It is the **system prompt** — the instructions we give the AI before it sees the user's text.

### What is a System Prompt?

Every AI model conversation has two parts:
- **System prompt** — background instructions the user never sees. Sets the AI's role, rules, and behavior.
- **User message** — what the user actually sends.

Our system prompt is 400+ words of detailed instructions based on Wikipedia's "Signs of AI Writing" research. It tells the AI:

### The 25 Patterns It Must Fix

These are grouped into categories:

**Significance Inflation** — AI puffs up importance artificially
- Removes: "testament to", "pivotal moment", "evolving landscape", "vital role"
- Fix: State facts directly. No puffery.

**Promotional Language** — AI writes like a brochure
- Removes: "groundbreaking", "nestled", "vibrant", "breathtaking", "stunning"
- Fix: Neutral, specific language.

**Superficial -ing Phrases** — AI tacks on fake depth
- Removes: "highlighting...", "showcasing...", "reflecting...", "contributing to..."
- Fix: End the sentence. Start fresh if needed.

**Vague Attributions** — AI invents authority
- Removes: "Experts argue", "Industry observers", "Studies show"
- Fix: Name the actual source, or delete the claim.

**Chatbot Artifacts** — AI is trained to be agreeable
- Removes: "Great question!", "I hope this helps!", "Certainly!"
- Fix: Delete entirely. Start with actual content.

**Hollow Transitions** — AI connects ideas with filler
- Removes: "Furthermore", "Moreover", "In conclusion", "It is important to note"
- Fix: Connect ideas directly or start a new sentence.

**Generic Conclusions** — AI ends on empty optimism
- Removes: "The future looks bright", "Exciting times lie ahead"
- Fix: End with a specific fact or honest observation.

...and 18 more patterns covering em dash overuse, bullet obsession, emoji abuse, excessive hedging, sycophantic openers, false objectivity, and more.

### Why This Works Better Than Other Tools

Other humanizers use a vague prompt like "rewrite this to sound human." That produces different AI writing — same patterns, different words.

Our prompt names each pattern explicitly and gives the AI a rule for each one. The AI knows exactly what "significance inflation" is and how to remove it. The result is structurally different, not just lexically different.

---

## 7. Project Structure Explained

```
humanizer/
│
├── index.html              ← The entire frontend
│   ├── HTML structure      — what the user sees
│   ├── CSS styles          — how it looks (aurora, panels, animations)
│   └── JavaScript          — what happens when buttons are clicked
│
├── api/
│   └── humanize.js         ← The secure backend
│       ├── System prompt   — the 25-pattern AI instructions
│       ├── API key reading — process.env.GROQ_API_KEY
│       ├── Groq API call   — sends text, receives stream
│       └── SSE relay       — forwards stream to browser
│
├── vercel.json             ← Tells Vercel how to route requests
│                             /api/* → serverless functions
│                             /* → index.html
│
├── .gitignore              ← Files Git should never upload to GitHub
│                             .env.local (API keys)
│                             .vercel (local config)
│                             node_modules (dependencies)
│
└── README.md               ← Project documentation
```

---

## 8. Security — Why the API Key Is Never in the Code

This is one of the most important concepts in web development.

### The Wrong Way (What Beginners Do)

```javascript
// NEVER DO THIS
const apiKey = "gsk_abc123yourrealkey";
const response = await fetch('https://api.groq.com/...', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});
```

If this code is in `index.html`, anyone can:
1. Open your website
2. Right click → Inspect → Network tab
3. See the API key in plain text
4. Use it to make thousands of requests on your account
5. You get charged or banned

### The Right Way (What We Did)

```javascript
// In api/humanize.js — runs on the server, never in the browser
const apiKey = process.env.GROQ_API_KEY;
```

`process.env.GROQ_API_KEY` reads the key from Vercel's secure environment variable storage. The key is:
- Never written in any file
- Never uploaded to GitHub
- Never sent to the browser
- Only readable by the serverless function when it runs on Vercel's servers

### The Three-Layer Security Model

```
Browser (public — anyone can see)
    ↓  sends only: { text: "..." }
    ↓  never sees the API key
Vercel Function (private — runs on server)
    ↓  reads GROQ_API_KEY from Vercel environment
    ↓  adds key to request
Groq API (external — authenticated)
    ↓  validates key
    ↓  returns response
```

---

## 9. The Deployment Pipeline

### How We Set It Up (One Time)

1. Wrote the code locally in VS Code
2. Created a GitHub repository
3. Pushed the code to GitHub with `git push`
4. Connected GitHub to Vercel
5. Added `GROQ_API_KEY` to Vercel environment variables
6. Vercel deployed automatically

### How We Ship Updates (Every Time)

```bash
# 1. Edit any file in VS Code

# 2. Three commands:
git add .
git commit -m "describe what changed"
git push

# 3. Vercel detects the push
# 4. Builds and deploys in ~30 seconds
# 5. Live URL is updated automatically
```

This is a real CI/CD pipeline. No manual uploads, no FTP, no clicking buttons on a server. Code goes from your laptop to a live global website in under a minute.

---

## 10. What We Built vs What Exists Online

### Feature Comparison

| Feature | Undetectable.ai | Quillbot | **Humanizer (ours)** |
|---|---|---|---|
| Price | $9.99–$49.99/mo | $19.95/mo | **Free forever** |
| No login required | No | No | **Yes** |
| Explains changes | No | No | **Yes** |
| Open source | No | No | **Yes** |
| Real-time streaming | No | No | **Yes** |
| Based on research | Unknown | Unknown | **Wikipedia AI patterns** |
| API key security | N/A | N/A | **Serverless proxy** |
| Self-hostable | No | No | **Yes — fork it** |

### The Unique Value

The most unique thing about this project is the **"What Changed" section**. Every other tool is a black box. You paste text in, get text out, and have no idea why.

Humanizer tells you:
- "Removed significance inflation — 'marks a pivotal moment' replaced with direct statement"
- "Removed vague attribution — 'Industry experts say' deleted, claim unverifiable"
- "Removed hollow transition — 'Furthermore' deleted, ideas connected directly"

Over time, users stop making these mistakes in their own writing. The tool teaches while it fixes. That is the real value — not just the output, but the education.

---

## 11. Interview — How to Explain This Project

### The 30-Second Version

> "I built a free web tool called Humanizer that rewrites AI-generated text to sound natural. You paste robotic AI writing, it streams a human rewrite back in real time and tells you exactly what it changed. It's built with plain HTML and JavaScript on the frontend, a Vercel serverless function as a secure backend, and Llama 3.3 running on Groq as the AI — all completely free. The system prompt is based on 25 documented AI writing patterns from Wikipedia's AI Cleanup project."

---

### The 2-Minute Version

> "The problem I wanted to solve is that AI writing is everywhere now, but it all sounds the same — inflated, hollow, robotic. Existing tools that fix this cost $20–50 a month and are black boxes. You have no idea what they changed or why.
>
> So I built Humanizer. It's a free, open source web application. The user pastes their AI-generated text. The frontend sends it to a serverless function I wrote on Vercel. The function — which is the secure layer — reads my API key from environment variables, calls Groq's API running Llama 3.3 70B, and streams the rewrite back to the browser in real time.
>
> The AI is instructed by a detailed system prompt I wrote based on Wikipedia's 'Signs of AI Writing' research — 25 specific patterns like significance inflation, vague attributions, chatbot artifacts, hollow transitions. It doesn't just rephrase — it fixes the root structural problems.
>
> After the rewrite, the tool shows a 'What Changed' section explaining every edit. That's the part nobody else does. Users learn to stop making these mistakes.
>
> The whole stack is free — Groq's free tier, Vercel's free tier, GitHub. I connected GitHub to Vercel so every `git push` auto-deploys in 30 seconds. That's a real CI/CD pipeline."

---

### Technical Questions You May Be Asked

**Q: Why serverless instead of a traditional backend?**
> A: For a project like this, a traditional server would run 24/7 and cost money even when nobody is using it. Serverless functions only run when triggered — zero cost at idle, scales automatically under load. Vercel's free tier handles this perfectly.

**Q: What is streaming and why did you use it?**
> A: Instead of waiting for the full AI response and showing it all at once, streaming sends chunks of text as they're generated. The browser renders each chunk immediately. The user sees text appearing word by word — it feels fast and interactive. I used Server-Sent Events (SSE) to pipe the stream from Groq through my serverless function to the browser.

**Q: How do you keep your API key secure?**
> A: The API key lives in Vercel's environment variables — never in any file, never in GitHub. My serverless function reads it at runtime with `process.env.GROQ_API_KEY`. The browser never sees the key. It only talks to my `/api/humanize` endpoint, which acts as a secure proxy.

**Q: Why Groq over OpenAI or Anthropic?**
> A: Cost. The entire goal is free. Groq offers Llama 3.3 70B — a Meta open source model that matches GPT-4 in writing tasks — at 14,400 free requests per day. No credit card required.

**Q: What makes your system prompt different?**
> A: It names specific problems. Most humanizer prompts say "sound more human." Mine identifies 25 documented patterns by name — like "copula avoidance" (using 'serves as' instead of 'is'), "negative parallelism" ('It's not just X, it's Y'), and "superficial -ing phrases" — and gives the AI a specific rule for each one. The fix is structural, not cosmetic.

**Q: Is this actually useful or just a portfolio project?**
> A: It solves a real, growing problem. Every student using ChatGPT, every professional writing AI-assisted emails, every content creator using AI drafts — they all need this. The existing paid alternatives prove there's demand. We just made it free and transparent.

---

## Summary — The Full Picture

| What | Detail |
|---|---|
| **Problem** | AI writing is everywhere but sounds robotic and hollow |
| **Solution** | A free tool that removes 25 documented AI patterns |
| **Frontend** | HTML + CSS + Vanilla JS — single file, no framework |
| **Backend** | Vercel serverless function — secure API proxy |
| **AI Model** | Llama 3.3 70B via Groq — free, open source, fast |
| **Streaming** | Server-Sent Events — real-time word-by-word output |
| **Security** | API key in environment variables, never in code |
| **Deployment** | GitHub → Vercel CI/CD — `git push` = live in 30 seconds |
| **What's unique** | Free + explains changes + based on real research + open source |
| **Who benefits** | Students, professionals, content creators, anyone using AI |

---

*Built by [@saalimanwar](https://github.com/saalimanwar/humanizer)*
*Live at: [github.com/saalimanwar/humanizer](https://github.com/saalimanwar/humanizer)*
