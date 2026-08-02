'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useInView } from 'framer-motion';
import { User, Rocket, TrendingUp, Mail, Code2, Briefcase, FileText, Send, Volume2, VolumeX, TerminalSquare, X, Bot, Server, Cloud, Puzzle } from 'lucide-react';
import SmoothScroll from '@/lib/SmoothScroll';
import Cursor from '@/components/Cursor';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Work from '@/components/Work';
import Timeline from '@/components/Timeline';
import { ME, SKILL_CATEGORIES, EXPERIENCE, CERTS } from '@/data/content';

// ─── DATA ────────────────────────────────────────────────────
// All content now lives in src/data/content.js (resume-sourced single source of truth).
const SKILLS_MARQUEE = SKILL_CATEGORIES.flatMap(c => c.items);

// ─── TERMINAL DATA ─────────────────────────────────────────
const TERM_CMDS = {
  help: [
    { t: 'Available commands:', c: '#22d3ee' },
    { t: '  whoami · skills · projects · experience', c: '#94a3b8' },
    { t: '  contact · leetcode · certs', c: '#94a3b8' },
    { t: '  hire nandu · sudo hire nandu · clear · exit', c: '#94a3b8' },
  ],
  whoami: [
    { t: '┌─ Nandu Panakanti ──────────────────────────────┐', c: '#6366f1' },
    { t: '│  Role    : Software Engineer                    │', c: '#e2e8f0' },
    { t: '│  Focus   : Backend · Distributed Systems · AI   │', c: '#e2e8f0' },
    { t: '│  Status  : Seeking full-time roles              │', c: '#4ade80' },
    { t: '│  Degree  : M.S. CS, UCM (May 2026)              │', c: '#e2e8f0' },
    { t: '└──────────────────────────────────────────────────┘', c: '#6366f1' },
  ],
  skills: [
    { t: 'AI/LLM  -> LangGraph, LangChain, Claude API, OpenAI API, RAG', c: '#22d3ee' },
    { t: 'BACKEND -> Spring Boot, FastAPI, Node.js, Express, REST/GraphQL', c: '#22d3ee' },
    { t: 'FRONTEND-> React, Next.js, TypeScript, Tailwind CSS', c: '#22d3ee' },
    { t: 'DATA    -> PostgreSQL, MySQL, MongoDB, Redis, Supabase', c: '#22d3ee' },
    { t: 'CLOUD   -> AWS (EC2/S3/Lambda), Terraform, Docker, GitHub Actions', c: '#22d3ee' },
  ],
  projects: [
    { t: 'FactoryFlow AI Agent   -> factoryflow-ai.vercel.app', c: '#6366f1' },
    { t: 'PropMind               -> propmind-6mkn.onrender.com', c: '#22d3ee' },
    { t: 'Raki                   -> frontend-production-d7f3.up.railway.app', c: '#a855f7' },
    { t: 'AI SaaS Ops Copilot    -> ai-saas-copilot.vercel.app', c: '#f472b6' },
  ],
  experience: [
    { t: 'Aug 2023 -> Research Analyst, Central Institute of Tool Design', c: '#94a3b8' },
    { t: 'Sep 2025 -> Software Engineer Intern, Jio Robotics', c: '#94a3b8' },
    { t: '         -> Cut production latency 25% via query/API profiling', c: '#94a3b8' },
    { t: 'May 2026 -> M.S. Computer Science, University of Central Missouri', c: '#4ade80' },
  ],
  contact: [
    { t: 'EMAIL   panakantinandu@gmail.com', c: '#22d3ee' },
    { t: 'PHONE   +1 (913) 206-2988', c: '#94a3b8' },
    { t: 'LINKED  linkedin.com/in/nandu-panakanti-41839731a', c: '#94a3b8' },
    { t: 'GITHUB  github.com/panakantinandu', c: '#94a3b8' },
    { t: 'RESPONSE usually < 24 hours', c: '#4ade80' },
  ],
  leetcode: [
    { t: 'Solved     : 200+ problems', c: '#f59e0b' },
    { t: 'Strengths  : graphs, DP, recursion, binary search, sliding window', c: '#94a3b8' },
    { t: 'Approach   : pattern recognition over memorization', c: '#22d3ee' },
  ],
  certs: [
    { t: '[x] Building with the Claude API  -- Anthropic    Apr 2026', c: '#4ade80' },
    { t: '[x] Claude Code in Action         -- Anthropic    Apr 2026', c: '#4ade80' },
    { t: '[x] AWS Cloud Architecting        -- AWS Academy  Apr 2026', c: '#4ade80' },
    { t: '[x] AWS Cloud Security Foundations-- AWS Academy  Apr 2026', c: '#4ade80' },
  ],
  'hire nandu': [
    { t: 'Smart move. Here\'s what you get:', c: '#f472b6' },
    { t: '   [x] Six production systems shipped end to end in a year', c: '#4ade80' },
    { t: '   [x] Backend, distributed systems & LLM agent engineering', c: '#4ade80' },
    { t: '   [x] AWS + Anthropic certified', c: '#4ade80' },
    { t: '   -> Run: contact  to reach out', c: '#22d3ee' },
  ],
  'sudo hire nandu': [
    { t: '[sudo] password for recruiter: ********', c: '#475569' },
    { t: 'Permission granted.', c: '#4ade80' },
    { t: 'Downloading Nandu Panakanti...', c: '#6366f1' },
    { t: '   [####################] 100%', c: '#22d3ee' },
    { t: '   [x] Software Engineer installed', c: '#4ade80' },
    { t: '   [x] Good vibes included', c: '#4ade80' },
    { t: '   -> panakantinandu@gmail.com', c: '#f472b6' },
  ],
};

const BOOT = [
  { t: 'nandu-os v2.0.26 booting...', c: '#475569' },
  { t: 'Loading portfolio kernel... done', c: '#475569' },
  { t: '', c: '' },
  { t: 'Welcome to Nandu\'s Terminal', c: '#6366f1' },
  { t: 'Type "help" to see commands.', c: '#94a3b8' },
  { t: '', c: '' },
];

// ─── UTILS ───────────────────────────────────────────────────
// ─── COMMAND PALETTE (Cmd/Ctrl+K) ─────────────────────────────
const PALETTE_ACTIONS = [
  { label: 'Go to About', icon: User, href: '#about' },
  { label: 'Go to Work', icon: Rocket, href: '#work' },
  { label: 'Go to Experience', icon: TrendingUp, href: '#experience' },
  { label: 'Go to Contact', icon: Mail, href: '#contact' },
  { label: 'View GitHub', icon: Code2, href: ME.github, external: true },
  { label: 'View LinkedIn', icon: Briefcase, href: ME.linkedin, external: true },
  { label: 'Download Resume', icon: FileText, href: ME.resume, external: true },
  { label: 'Email Nandu', icon: Send, href: `mailto:${ME.email}`, external: true },
];

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const filtered = PALETTE_ACTIONS.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  const go = a => {
    if (a.external) window.open(a.href, '_blank');
    else window.location.hash = a.href;
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 20000, background: 'rgba(5,5,16,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh' }}
        >
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
            className="terminal-window"
            style={{ width: 'min(520px, calc(100vw - 32px))', overflow: 'hidden' }}
          >
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#e2e8f0', fontFamily: 'var(--font-mono)', fontSize: 14 }}
                spellCheck={false}
              />
            </div>
            <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
              {filtered.length === 0 && (
                <div style={{ padding: 20, color: '#475569', fontFamily: 'var(--font-mono)', fontSize: 12 }}>No results.</div>
              )}
              {filtered.map((a, i) => (
                <motion.button key={i} onClick={() => go(a)}
                  whileHover={{ background: 'rgba(99,102,241,0.08)' }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', border: 'none', background: 'transparent', color: '#e2e8f0', fontFamily: 'var(--font-space)', fontSize: 14, textAlign: 'left' }}
                >
                  <a.icon size={16} strokeWidth={2} color="#94a3b8" />
                  <span>{a.label}</span>
                </motion.button>
              ))}
            </div>
            <div style={{ padding: '8px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#334155' }}>
              <span>↑↓ navigate</span><span>↵ select</span><span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── LOADING ─────────────────────────────────────────────────
function Loader({ onDone }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      v += Math.random() * 15 + 5;
      if (v >= 100) { v = 100; clearInterval(t); setTimeout(onDone, 300); }
      setP(Math.floor(v));
    }, 80);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center gap-8"
      style={{ background: '#050510' }}
    >
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
        className="cinematic-title text-7xl grad-text"
      >NP</motion.div>
      <div style={{ width: 240, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
        <div className="loader-bar" style={{ width: `${p}%`, transition: 'width 0.1s ease' }} />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#334155', letterSpacing: '0.2em' }}>
        {p < 30 ? 'INITIALIZING' : p < 60 ? 'LOADING ASSETS' : p < 90 ? 'ALMOST THERE' : 'READY'}
      </div>
    </motion.div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────
function Nav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ['about', 'work', 'experience', 'contact'];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <motion.div className="progress-bar" style={{ scaleX }} />
      <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between transition-all duration-500 ${scrolled ? 'backdrop-blur-xl' : ''}`}
        style={{ borderBottom: scrolled ? '1px solid rgba(99,102,241,0.15)' : 'none', background: scrolled ? 'rgba(5,5,16,0.85)' : 'transparent' }}
      >
        <motion.a href="#" whileHover={{ scale: 1.05 }} className="cinematic-title text-3xl grad-text">NP</motion.a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l, i) => (
            <motion.a key={l} href={`#${l}`}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
              className="nav-link text-sm uppercase tracking-widest"
              style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: 11 }}
            >{l}</motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.a href={ME.resume} target="_blank" rel="noreferrer"
            whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.97 }}
            className="hidden sm:block px-5 py-2 rounded-lg text-white text-xs font-semibold tracking-wider uppercase"
            style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', fontFamily: 'var(--font-mono)' }}
          >Resume</motion.a>
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden flex flex-col gap-1.5 p-1"
            style={{ background: 'none', border: 'none' }}
          >
            <span style={{ display: 'block', width: 22, height: 2, background: menuOpen ? 'transparent' : 'white', borderRadius: 2, transform: menuOpen ? 'rotate(45deg) translate(4px,4px)' : 'none', transition: 'all 0.3s' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: menuOpen ? 'transparent' : 'white', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'all 0.3s' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: menuOpen ? 'transparent' : 'white', borderRadius: 2, transform: menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none', transition: 'all 0.3s' }} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{ background: 'rgba(5,5,16,0.97)', backdropFilter: 'blur(24px)' }}
          >
            {links.map((l, i) => (
              <motion.a key={l} href={`#${l}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="cinematic-title text-5xl" style={{ color: '#94a3b8' }}
                onClick={() => setMenuOpen(false)}
              >{l.toUpperCase()}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── ABOUT ─────────────────────────────────────────────────
function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted) el.play().catch(() => {});
  };

  return (
    <section id="about" ref={ref} className="relative min-h-screen flex items-center overflow-hidden scanlines">
      {/* Ambient background — gradient + grid + drifting orbs (NOT the intro video again) */}
      <div className="absolute inset-0 z-0" style={{ background: 'var(--bg2)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <motion.div animate={{ x: [0, 80, 0], y: [0, -40, 0] }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-10%] right-[5%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <motion.div animate={{ x: [0, -60, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-10%] left-[5%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(5,5,16,0.4) 0%, rgba(5,5,16,0.15) 50%, rgba(5,5,16,0.7) 100%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-20 items-center w-full">
        {/* Left — video portrait */}
        <motion.div initial={{ opacity: 0, x: -60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex justify-center"
        >
          <div className="aurora-border" style={{ borderRadius: 24 }}>
            <div style={{ borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(99,102,241,0.3)', position: 'relative' }}>
              <video ref={videoRef} autoPlay muted={muted} loop playsInline
                style={{ width: 360, height: 450, objectFit: 'cover', objectPosition: 'center top', display: 'block', borderRadius: 22 }}
              >
                <source src="/assets/nandu-intro.mp4" type="video/mp4" />
              </video>
              <motion.button onClick={toggleMute} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                title={muted ? 'Unmute video' : 'Mute video'}
                style={{ position: 'absolute', bottom: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(5,5,16,0.7)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted ? '#94a3b8' : '#22d3ee' }}
              >
                {muted ? <VolumeX size={14} strokeWidth={2} /> : <Volume2 size={14} strokeWidth={2} />}
              </motion.button>
            </div>
          </div>
          {/* Floating tag */}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl"
            style={{ background: 'rgba(5,5,16,0.95)', border: '1px solid rgba(34,211,238,0.4)', color: '#22d3ee', fontFamily: 'var(--font-mono)', fontSize: 11, whiteSpace: 'nowrap' }}
          >{'</ Software Engineer >'}</motion.div>
        </motion.div>

        {/* Right — text */}
        <motion.div initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <div style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', marginBottom: 16 }}>— WHO I AM</div>
          <h2 className="cinematic-title mb-8" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', color: 'white', lineHeight: 0.9 }}>
            I BUILD<br /><span className="grad-text">THINGS THAT</span><br />SHIP.
          </h2>
          <p className="mb-6 leading-relaxed" style={{ color: '#94a3b8', fontFamily: 'var(--font-space)', fontSize: '1rem' }}>
            {ME.summary}
          </p>
          <p className="mb-8 leading-relaxed" style={{ color: '#94a3b8', fontFamily: 'var(--font-space)', fontSize: '1rem' }}>
            I consistently own the full lifecycle: schema and API design, authentication and authorization, performance profiling, deployment, structured logging, and monitoring.
          </p>
          <div className="flex flex-wrap gap-2">
            {['M.S. Computer Science','UCM · May 2026','Anthropic Certified','AWS Certified','200+ LeetCode'].map(t => (
              <span key={t} className="px-3 py-1 text-xs rounded-full"
                style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)', fontFamily: 'var(--font-mono)' }}
              >{t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── LIVE ACTIVITY (new feature) ──────────────────────────────
const CODE_SNIPPETS = [
  `async function ragQuery(input) {
  const embedding = await embed(input);
  const docs = await vectorStore.search(embedding, { k: 5 });
  return llm.generate({ context: docs, query: input });
}`,
  `@app.post("/agent/run")
async def run_agent(task: TaskRequest):
    plan = await planner.decompose(task.goal)
    results = await executor.run_steps(plan)
    return AgentResponse(results=results)`,
  `const job = await queue.add('risk-score', {
  propertyId,
  model: 'gpt-4o-mini',
}, { attempts: 3, backoff: 'exponential' });`,
];

const ACTIVITY_FEED = [
  { t: 'AI Agent Systems', d: 'LangGraph reasoning graphs, tool calling, and retrieval over Claude and OpenAI APIs', icon: Bot },
  { t: 'Distributed Backends', d: 'Spring Boot + FastAPI services communicating over versioned HTTP contracts', icon: Server },
  { t: 'Cloud Deployment', d: 'AWS, Docker, and GitHub Actions CI/CD across every shipped project', icon: Cloud },
  { t: 'Algorithms', d: '200+ LeetCode problems — graphs, DP, recursion, sliding window', icon: Puzzle },
  { t: 'Open Source', d: 'github.com/panakantinandu', icon: Code2 },
];

function TypewriterCode({ code }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    setShown('');
    let i = 0;
    const t = setInterval(() => {
      i++;
      setShown(code.slice(0, i));
      if (i >= code.length) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [code]);
  return <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{shown}<span className="term-cursor" style={{ color: '#22d3ee' }}>▋</span></pre>;
}

function LiveActivity() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [snippetIdx, setSnippetIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSnippetIdx(i => (i + 1) % CODE_SNIPPETS.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative py-32 px-6 overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', marginBottom: 12 }}>— HOW I BUILD</div>
          <h2 className="cinematic-title" style={{ fontSize: 'clamp(2.5rem,7vw,7rem)', color: 'white', lineHeight: 0.9 }}>
            WHAT I'M<br /><span className="grad-text">SHIPPING.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live code panel */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}
            className="terminal-window overflow-hidden"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 8, fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)' }}>now-building.ts</span>
            </div>
            <div style={{ padding: 20, fontSize: 12.5, lineHeight: 1.8, color: '#a5b4fc', minHeight: 180 }}>
              <AnimatePresence mode="wait">
                <motion.div key={snippetIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <TypewriterCode code={CODE_SNIPPETS[snippetIdx]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Activity feed */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-2"
          >
            {ACTIVITY_FEED.map((a, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                whileHover={{ x: 4, background: 'rgba(99,102,241,0.06)' }}
                className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200"
                style={{ borderBottom: i < ACTIVITY_FEED.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.1)' }}>
                  <a.icon size={16} strokeWidth={2} color="#a5b4fc" />
                </span>
                <div className="flex-1">
                  <div style={{ color: 'white', fontFamily: 'var(--font-space)', fontSize: 14, fontWeight: 600 }}>{a.t}</div>
                  <div style={{ color: '#94a3b8', fontFamily: 'var(--font-space)', fontSize: 13, marginTop: 2 }}>{a.d}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────
function SkillsMarquee() {
  const doubled = [...SKILLS_MARQUEE, ...SKILLS_MARQUEE];
  return (
    <div className="relative py-8 overflow-hidden" style={{ borderTop: '1px solid rgba(99,102,241,0.15)', borderBottom: '1px solid rgba(99,102,241,0.15)', background: 'rgba(99,102,241,0.03)' }}>
      <div className="marquee-track">
        {doubled.map((s, i) => (
          <span key={i} className="px-8 text-sm uppercase tracking-widest whitespace-nowrap"
            style={{ color: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#22d3ee' : '#a855f7', fontFamily: 'var(--font-mono)' }}
          >
            {s} <span style={{ color: '#1e2035', margin: '0 8px' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── EXPERIENCE ───────────────────────────────────────────────
function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" ref={ref} className="relative py-32 px-6 overflow-hidden" style={{ background: 'var(--bg)' }}>
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(99,102,241,0.05) 0%,transparent 70%)' }}
      />
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', marginBottom: 12 }}>— JOURNEY</div>
          <h2 className="cinematic-title" style={{ fontSize: 'clamp(2.5rem,7vw,7rem)', color: 'white', lineHeight: 0.9 }}>
            THE<br /><span className="grad-text">TIMELINE.</span>
          </h2>
        </motion.div>

        <Timeline />

        {/* Certs grid */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24"
        >
          <div style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', marginBottom: 16 }}>— CERTIFICATIONS</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CERTS.map((c, i) => {
              const Icon = c.issuer === 'Anthropic' ? Bot : Cloud;
              return (
                <motion.a key={i} href={c.link} target="_blank" rel="noreferrer" data-hover
                  whileHover={{ y: -6, borderColor: 'rgba(99,102,241,0.5)' }}
                  className="glass-card p-5 flex items-center gap-4 transition-all duration-300"
                >
                  <span className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.12)' }}>
                    <Icon size={20} strokeWidth={2} color="#a5b4fc" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'white', fontFamily: 'var(--font-space)' }}>{c.name}</div>
                    <div style={{ color: '#475569', fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 2 }}>{c.issuer} · {c.date}</div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── TERMINAL EASTER EGG ─────────────────────────────────────
function Terminal() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [cmdHist, setCmdHist] = useState([]);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const [booted, setBooted] = useState(false);
  const [bootLines, setBootLines] = useState([]);
  const [hint, setHint] = useState(true);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    if (booted) { setTimeout(() => inputRef.current?.focus(), 50); return; }
    let i = 0;
    const t = setInterval(() => {
      setBootLines(p => [...p, BOOT[i]]);
      i++;
      if (i >= BOOT.length) { clearInterval(t); setBooted(true); setTimeout(() => inputRef.current?.focus(), 100); }
    }, 100);
    return () => clearInterval(t);
  }, [open]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history, bootLines, open]);
  useEffect(() => { if (open) setHint(false); }, [open]);

  useEffect(() => {
    const h = e => {
      if (e.key === '`') { e.preventDefault(); setOpen(o => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const run = raw => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setCmdHist(p => [raw, ...p]);
    setCmdIdx(-1);
    if (cmd === 'clear') { setHistory([]); setBootLines([]); return; }
    if (cmd === 'exit') { setOpen(false); return; }
    const out = TERM_CMDS[cmd]
      ? TERM_CMDS[cmd]
      : [{ t: `bash: ${cmd}: command not found`, c: '#ef4444' }, { t: 'Type "help" to see commands.', c: '#475569' }];
    setHistory(p => [...p, { type: 'input', raw }, { type: 'output', lines: out }]);
  };

  const onKey = e => {
    if (e.key === 'Enter') { run(input); setInput(''); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(cmdIdx + 1, cmdHist.length - 1); setCmdIdx(n); setInput(cmdHist[n] ?? ''); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); const n = Math.max(cmdIdx - 1, -1); setCmdIdx(n); setInput(n === -1 ? '' : cmdHist[n]); }
    else if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(TERM_CMDS).find(c => c.startsWith(input.toLowerCase())); if (m) setInput(m); }
  };

  return (
    <>
      <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <AnimatePresence>
          {hint && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: 'rgba(6,6,15,0.95)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 10, padding: '6px 12px', color: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}
            >press <span style={{ color: '#22d3ee' }}>`</span> or click</motion.div>
          )}
        </AnimatePresence>
        <motion.button onClick={() => setOpen(o => !o)}
          whileHover={{ scale: 1.1, boxShadow: '0 0 32px rgba(99,102,241,0.6)' }} whileTap={{ scale: 0.9 }}
          style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#22d3ee)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white', fontFamily: 'var(--font-mono)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}
        >{open ? <X size={22} strokeWidth={2} /> : <TerminalSquare size={22} strokeWidth={2} />}</motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => inputRef.current?.focus()}
            className="terminal-window"
            style={{ position: 'fixed', bottom: 96, right: 28, zIndex: 10001, width: 'min(560px,calc(100vw - 48px))', maxHeight: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            {/* Title bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} onClick={() => setOpen(false)} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 8, fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)' }}>nandu@portfolio:~$</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: '#1e293b', fontFamily: 'var(--font-mono)' }}>` to toggle</span>
            </div>
            {/* Output */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, fontSize: 12.5, lineHeight: 1.7, scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.3) transparent', fontFamily: 'var(--font-mono)' }}>
              {bootLines.map((l, i) => <motion.div key={`b${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: l.c || '#94a3b8', minHeight: '1.4em' }}>{l.t}</motion.div>)}
              {history.map((e, i) => (
                <div key={i}>
                  {e.type === 'input' && <div style={{ display: 'flex', gap: 8, marginTop: 6 }}><span style={{ color: '#6366f1', flexShrink: 0 }}>nandu@portfolio:~$</span><span style={{ color: '#e2e8f0' }}>{e.raw}</span></div>}
                  {e.type === 'output' && <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 4, marginBottom: 8, paddingLeft: 4 }}>{e.lines.map((l, j) => <div key={j} style={{ color: l.c || '#94a3b8', minHeight: '1.4em' }}>{l.t}</div>)}</motion.div>}
                </div>
              ))}
              {booted && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                  <span style={{ color: '#6366f1', flexShrink: 0 }}>nandu@portfolio:~$</span>
                  <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: 12.5, fontFamily: 'var(--font-mono)', flex: 1, caretColor: '#22d3ee' }}
                    spellCheck={false} autoComplete="off"
                  />
                </div>
              )}
              {!booted && <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ color: '#22d3ee' }}>▋</motion.div>}
              <div ref={bottomRef} />
            </div>
            {/* Quick pills */}
            <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0, background: 'rgba(0,0,0,0.3)' }}>
              {['help', 'whoami', 'projects', 'hire nandu', 'sudo hire nandu'].map(cmd => (
                <button key={cmd} onClick={() => { run(cmd); inputRef.current?.focus(); }}
                  style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', color: '#a5b4fc', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(99,102,241,0.2)'; }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(99,102,241,0.08)'; }}
                >{cmd}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────
function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="contact" ref={ref} className="relative py-40 px-6 overflow-hidden" style={{ background: 'var(--bg2)' }}>
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(99,102,241,0.12) 0%,transparent 60%)', filter: 'blur(40px)' }}
      />
      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <div style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', marginBottom: 16 }}>— LET'S WORK</div>
          <h2 className="cinematic-title mb-8" style={{ fontSize: 'clamp(3rem,9vw,9rem)', color: 'white', lineHeight: 0.9 }}>
            LET'S<br /><span className="grad-text">BUILD</span><br />SOMETHING.
          </h2>
          <p className="mb-12 max-w-xl mx-auto leading-relaxed" style={{ color: '#94a3b8', fontFamily: 'var(--font-space)' }}>
            Actively seeking full-time roles in backend, distributed systems, and AI/LLM engineering{ME.relocate ? ' — open to relocation' : ''}. If you're building something ambitious, let's talk.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <motion.a href={`mailto:${ME.email}`}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(99,102,241,0.5)' }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-xl text-white font-semibold text-lg"
            style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', fontFamily: 'var(--font-space)' }}
          >Say Hello →</motion.a>
          <motion.a href={ME.resume} target="_blank" rel="noreferrer"
            whileHover={{ scale: 1.05, borderColor: 'rgba(99,102,241,0.6)' }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-xl font-medium text-lg transition-all duration-300"
            style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', fontFamily: 'var(--font-space)' }}
          >Download Resume</motion.a>
        </motion.div>

        {/* Links row */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {[
            { l: ME.linkedin, t: 'LinkedIn' },
            { l: ME.github, t: 'GitHub' },
            { l: `mailto:${ME.email}`, t: ME.email },
            { l: `tel:${ME.phone}`, t: ME.phone },
          ].map((c, i) => (
            <motion.a key={i} href={c.l} target={c.l.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
              whileHover={{ color: 'white', y: -2 }}
              style={{ color: '#475569', fontFamily: 'var(--font-mono)', fontSize: 13, transition: 'all 0.2s' }}
            >{c.t}</motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative overflow-hidden py-20 px-6 text-center" style={{ background: 'var(--bg)', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
      <div className="footer-name select-none mb-6">NANDU</div>
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        {['React', 'Next.js', 'Three.js', 'Framer Motion', 'GSAP'].map(t => (
          <span key={t} style={{ color: '#1e293b', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em' }}>{t}</span>
        ))}
      </div>
      <div style={{ color: '#1e293b', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em' }}>
        © 2026 NANDU PANAKANTI · ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────
export default function Page() {
  const [loaded, setLoaded] = useState(false);

  return (
    <SmoothScroll>
      <main className="noise">
        <AnimatePresence mode="wait">
          {!loaded && <Loader key="loader" onDone={() => setLoaded(true)} />}
        </AnimatePresence>

        {loaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Cursor />
            <CommandPalette />
            <Nav />
            <Hero />
            <SkillsMarquee />
            <About />
            <LiveActivity />
            <SkillsMarquee />
            <Skills />
            <Work />
            <Experience />
            <Contact />
            <Footer />
            <Terminal />
          </motion.div>
        )}
      </main>
    </SmoothScroll>
  );
}
