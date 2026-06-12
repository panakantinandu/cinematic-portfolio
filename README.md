# Nandu Panakanti — Cinematic Portfolio

A cinematic, interactive developer portfolio built with **Next.js 15**, **React 19**, and **Framer Motion** — featuring an animated particle background, live project demos, a hidden terminal easter egg, and a command palette.

🔗 **Live:** [nandupanakanti.vercel.app](https://nandupanakanti.vercel.app) *(update with your domain)*

---

## ✨ Features

- **Animated particle network hero** — interactive canvas background that reacts to mouse movement
- **Cinematic typography** — huge Bebas Neue display titles with a subtle, time-limited glitch flicker
- **Time-aware greeting** — "Good evening, I'm Nandu" based on the visitor's local time
- **Skills marquee** — infinite-scroll ticker of tech stack
- **Project showcase** — live embedded iframe demos for each shipped project
- **Experience timeline** — animated scroll-triggered career milestones
- **Certifications grid** — linked credential badges
- **"Currently Shipping"** — live typewriter code snippets + activity feed
- **Command palette** — press `Cmd/Ctrl + K` for instant navigation to any section, GitHub, LinkedIn, resume, or email
- **Terminal easter egg** — press `` ` `` to open an interactive fake terminal (`whoami`, `projects`, `hire nandu`, and more)
- **Synced audio** — About section portrait video plays with audio in perfect sync (single video element, no drift)
- **Custom cursor, scroll-progress bar, film-grain overlay, loading screen, mobile nav** — full polish across devices

---

## 🛠 Tech Stack

| | |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI Library | React 19 |
| Animation | [Framer Motion](https://www.framer.com/motion/), GSAP, Lenis (smooth scroll) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# run the dev server
npm run dev
# → http://localhost:3000
```

### Required asset

Add your portrait video (with audio) to `/public/assets/`:

| File | Used in |
|---|---|
| `nandu-intro.mp4` | About section — portrait video with synced audio |

---

## 📦 Build & Deploy

```bash
npm run build    # production build — verify locally before deploying
npm run start    # run the production build
```

**Deploy on Vercel** (recommended — zero config for Next.js):

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Deploy — Vercel auto-detects the Next.js framework and build settings

---

## 📁 Project Structure

```
src/app/
├── layout.js       # Root layout & metadata
├── page.js         # All sections & components
└── globals.css     # Global styles, animations, design tokens
```

---

## 📄 License

© 2026 Nandu Panakanti. All rights reserved.
