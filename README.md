# Nandu Panakanti — Cinematic Portfolio

## Setup

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Assets to add (put in `/public/assets/`)

| File | What it is |
|---|---|
| `nandu-intro.mp4` | Your portrait video (with audio) — used only in the About section |

## What changed in this update

- **Fixed duplicate name on Hero**: the `.glitch-wrap` pseudo-elements (cyan/purple copies of "NANDU PANAKANTI") now stay hidden and only flash briefly every ~7s for a real glitch effect, instead of sitting permanently visible as 2-3 overlapping copies.
- **Fixed duplicate/badly-cropped video on Hero**: the Hero used to show a poorly-cropped, faded copy of your portrait video as a background. That's removed — replaced with an animated particle/network canvas (interactive, reacts to mouse movement) that fits an AI engineer's portfolio much better.
- **Audio is now synced**: there's only ONE video element with audio — the About section portrait video, which keeps its perfect crop. Click the speaker icon on it to unmute and hear it with picture in perfect sync (same element = same timeline, no drift). The separate ambient-audio button is removed since it was a second, unsynced audio source.
- **New features**:
  - "Currently Shipping" section — live typewriter code snippets + activity feed.
  - Command palette (press `Cmd/Ctrl+K`) for quick navigation to sections, GitHub, LinkedIn, resume, email.
  - Animated particle network background on the Hero section.


## Deploy to Vercel

```bash
npm run build   # test build locally first
# push to GitHub → import in vercel.com → zero config
```

## Features
- Cinematic full-screen sections with parallax video
- Bebas Neue display font for huge titles
- Scroll-progress bar
- Animated greeting based on time of day ("Good evening, I'm")
- Skills marquee ticker (runs twice)
- Project showcase with live iframe demos
- Experience timeline
- Certifications grid
- Terminal easter egg (press ` backtick key)
- Custom cursor
- Film-grain noise overlay
- Mobile hamburger nav
- Loading screen
