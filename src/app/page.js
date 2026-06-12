'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useInView } from 'framer-motion';

// ─── DATA ────────────────────────────────────────────────────
const ME = {
  name: 'Nandu Panakanti',
  title: 'Full-Stack AI Engineer',
  tagline: 'Shipping production-ready AI systems — LLM agents, RAG pipelines, SaaS platforms.',
  email: 'panakantinandu@gmail.com',
  phone: '+1 (913) 206-2988',
  linkedin: 'https://www.linkedin.com/in/nandu-panakanti-41839731a/',
  github: 'https://github.com/panakantinandu',
  resume: '/assets/Resume(Nan).pdf',
  location: 'Kansas City, MO',
  available: true,
};

const PROJECTS = [
  { id: 1, num: '01', name: 'PropMind', category: 'AI SaaS', year: '2025', accent: '#6366f1',
    desc: 'End-to-end property management SaaS with OpenAI risk scoring, Stripe billing, BullMQ jobs, and Socket.io real-time notifications.',
    stack: ['Node.js','Express','MongoDB','OpenAI','Stripe','BullMQ','Redis','Socket.io','React'],
    live: 'https://propmind-6mkn.onrender.com/', github: 'https://github.com/panakantinandu/PropMind' },
  { id: 2, num: '02', name: 'AI SaaS Copilot', category: 'Dev Tools', year: '2025', accent: '#22d3ee',
    desc: 'GitHub repo analytics platform with LLM-powered recommendations, dormant repo detection, CI/CD waste analysis, and conversational AI copilot.',
    stack: ['FastAPI','PostgreSQL','React','TypeScript','GitHub API','OAuth 2.0','LLM'],
    live: 'https://ai-saas-copilot.vercel.app/', github: 'https://github.com/panakantinandu/ai-saas-copilot' },
  { id: 3, num: '03', name: 'AI Workflow Platform', category: 'Automation', year: '2025', accent: '#a855f7',
    desc: 'Drag-and-drop LLM workflow orchestration with structured outputs, retry logic, monitoring dashboard, and AWS-backed deployment pipeline.',
    stack: ['FastAPI','React','PostgreSQL','AWS EC2','S3','Docker','GitHub Actions'],
    live: 'https://ai-workflow-platform-sigma.vercel.app/', github: 'https://github.com/panakantinandu/ai-workflow-platform' },
  { id: 4, num: '04', name: 'Attrition Engine', category: 'ML / XAI', year: '2024', accent: '#f472b6',
    desc: 'Random Forest classifier with SHAP-based explainability, batch CSV prediction, and interactive Streamlit dashboard for HR analytics.',
    stack: ['Python','Scikit-Learn','SHAP','Streamlit','Pandas','NumPy','Render'],
    live: 'https://ml-project-nan.onrender.com/', github: 'https://github.com/panakantinandu/ML_Project-Nan-' },
];

const SKILLS_MARQUEE = [
  'FastAPI','Node.js','React','TypeScript','Python','Java',
  'OpenAI API','Claude API','LangChain','RAG','LLM Agents',
  'PostgreSQL','MongoDB','Redis','AWS','Docker','GitHub Actions',
  'Stripe','BullMQ','Socket.io','SHAP','Scikit-Learn','Framer Motion',
];

const STATS = [
  { v: '8+', l: 'Projects Shipped' },
  { v: '200+', l: 'LeetCode Solved' },
  { v: '9', l: 'Certifications' },
  { v: '4+', l: 'Years Coding' },
];

const EXPERIENCE = [
  { year: '2022', title: 'Started M.S. Computer Science', place: 'University of Central Missouri', desc: 'Dived deep into algorithms, distributed systems, and AI fundamentals.' },
  { year: '2023', title: 'First Full-Stack Projects', place: 'Self-directed', desc: 'Built and deployed first production web applications. Learned the hard way about architecture.' },
  { year: '2024', title: 'Deep AI/LLM Engineering', place: 'Research & Projects', desc: 'Attrition Engine with SHAP explainability. Went all-in on LLMs, RAG, and agent systems.' },
  { year: '2025', title: 'Shipped Production SaaS', place: 'PropMind · Copilot · Workflow Platform', desc: 'Three production-grade AI platforms from zero to deployed — real users, real data, real stakes.' },
  { year: '2026', title: 'M.S. Complete · AWS & Anthropic Certified', place: 'UCM · Anthropic · AWS Academy', desc: 'Graduated. Earned certifications in Claude API, Claude Code, AWS Architecting & Security.' },
];

const CERTS = [
  { icon: '🤖', name: 'Building with Claude API', issuer: 'Anthropic', date: 'Apr 2026', link: 'https://verify.skilljar.com/c/k997obwezamm' },
  { icon: '⚡', name: 'Claude Code in Action', issuer: 'Anthropic', date: 'Apr 2026', link: 'https://verify.skilljar.com/c/kpere2qc4net' },
  { icon: '☁️', name: 'AWS Cloud Architecting', issuer: 'AWS Academy', date: 'Apr 2026', link: 'https://www.credly.com/badges/60e3c565-1c17-4a49-a70e-630da5cacac1' },
  { icon: '🔒', name: 'AWS Cloud Security', issuer: 'AWS Academy', date: 'Apr 2026', link: 'https://www.credly.com/badges/41edff27-62fc-481c-9fea-998259e90231' },
  { icon: '🏪', name: 'Advanced SWE Simulation', issuer: 'Walmart', date: 'May 2025', link: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/prBZoAihniNijyD6d/oX6f9BbCL9kJDJzfg_prBZoAihniNijyD6d_hFspdJeJnuae3BoDB_1747109821353_completion_certificate.pdf' },
  { icon: '✈️', name: 'SWE Simulation', issuer: 'Skyscanner', date: 'Apr 2025', link: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/skoQmxqhtgWmKv2pm/p3xGFkpdot5H8NBih_skoQmxqhtgWmKv2pm_hFspdJeJnuae3BoDB_1745513981330_completion_certificate.pdf' },
];

// ─── TERMINAL DATA ─────────────────────────────────────────
const TERM_CMDS = {
  help: [
    { t: 'Available commands:', c: '#22d3ee' },
    { t: '  whoami · skills · projects · experience', c: '#94a3b8' },
    { t: '  contact · leetcode · certs', c: '#94a3b8' },
    { t: '  hire nandu · sudo hire nandu · clear · exit', c: '#94a3b8' },
  ],
  whoami: [
    { t: '┌─ Nandu Panakanti ──────────────────┐', c: '#6366f1' },
    { t: '│  Role    : Full-Stack AI Engineer   │', c: '#e2e8f0' },
    { t: '│  Status  : Seeking roles 🟢          │', c: '#e2e8f0' },
    { t: '│  Degree  : M.S. CS, UCM (May 2026)  │', c: '#e2e8f0' },
    { t: '│  Focus   : LLMs · RAG · SaaS · APIs │', c: '#e2e8f0' },
    { t: '└────────────────────────────────────┘', c: '#6366f1' },
  ],
  skills: [
    { t: '⚡ AI   → OpenAI · Claude · LangChain · RAG · Agents', c: '#22d3ee' },
    { t: '⚡ BE   → FastAPI · Node.js · Express · BullMQ', c: '#22d3ee' },
    { t: '⚡ FE   → React · TypeScript · Framer Motion', c: '#22d3ee' },
    { t: '⚡ DB   → PostgreSQL · MongoDB · Redis', c: '#22d3ee' },
    { t: '⚡ OPS  → AWS · Docker · GitHub Actions · Vercel', c: '#22d3ee' },
  ],
  projects: [
    { t: '🚀 PropMind         → propmind-6mkn.onrender.com', c: '#6366f1' },
    { t: '🚀 AI SaaS Copilot  → ai-saas-copilot.vercel.app', c: '#22d3ee' },
    { t: '🚀 Workflow Platform → ai-workflow-platform-sigma.vercel.app', c: '#a855f7' },
    { t: '🚀 Attrition Engine → ml-project-nan.onrender.com', c: '#f472b6' },
  ],
  experience: [
    { t: '2022 → Started M.S. CS at UCM', c: '#94a3b8' },
    { t: '2023 → First production full-stack apps', c: '#94a3b8' },
    { t: '2024 → Deep LLM engineering + ML with SHAP', c: '#94a3b8' },
    { t: '2025 → 3 production AI SaaS platforms shipped', c: '#94a3b8' },
    { t: '2026 → M.S. complete · 9 certs · job hunting 🟢', c: '#4ade80' },
  ],
  contact: [
    { t: '📧  panakantinandu@gmail.com', c: '#22d3ee' },
    { t: '📞  +1 (913) 206-2988', c: '#94a3b8' },
    { t: '💼  linkedin.com/in/nandu-panakanti-41839731a', c: '#94a3b8' },
    { t: '🐙  github.com/panakantinandu', c: '#94a3b8' },
    { t: '⏱️  Response: usually < 24 hours', c: '#4ade80' },
  ],
  leetcode: [
    { t: '🔢 Solved    : 200+ problems', c: '#f59e0b' },
    { t: '   Strengths : DP · Graphs · Sliding Window · Two Pointers', c: '#94a3b8' },
    { t: '   Approach  : Pattern recognition > memorization', c: '#22d3ee' },
  ],
  certs: [
    { t: '✓ Building with Claude API  — Anthropic  Apr 2026', c: '#4ade80' },
    { t: '✓ Claude Code in Action     — Anthropic  Apr 2026', c: '#4ade80' },
    { t: '✓ AWS Cloud Architecting    — AWS        Apr 2026', c: '#4ade80' },
    { t: '✓ AWS Cloud Security        — AWS        Apr 2026', c: '#4ade80' },
    { t: '✓ Advanced SWE Simulation   — Walmart    May 2025', c: '#4ade80' },
    { t: '✓ SWE Simulation            — Skyscanner Apr 2025', c: '#4ade80' },
  ],
  'hire nandu': [
    { t: '👀 Smart move. Here\'s what you get:', c: '#f472b6' },
    { t: '   ✓ Production AI systems, not just demos', c: '#4ade80' },
    { t: '   ✓ Full-stack ownership end to end', c: '#4ade80' },
    { t: '   ✓ AWS + Anthropic certified', c: '#4ade80' },
    { t: '   → Run: contact  to reach out 📬', c: '#22d3ee' },
  ],
  'sudo hire nandu': [
    { t: '[sudo] password for recruiter: ••••••••', c: '#475569' },
    { t: '✅ Permission granted.', c: '#4ade80' },
    { t: '🚀 Downloading Nandu Panakanti...', c: '#6366f1' },
    { t: '   [████████████████████] 100%', c: '#22d3ee' },
    { t: '   ✓ Full-Stack AI Engineer installed', c: '#4ade80' },
    { t: '   ✓ Good vibes included 😄', c: '#4ade80' },
    { t: '   → panakantinandu@gmail.com', c: '#f472b6' },
  ],
};

const BOOT = [
  { t: 'nandu-os v2.0.26 booting...', c: '#475569' },
  { t: 'Loading portfolio kernel... ✓', c: '#475569' },
  { t: '', c: '' },
  { t: 'Welcome to Nandu\'s Terminal 👾', c: '#6366f1' },
  { t: 'Type "help" to see commands.', c: '#94a3b8' },
  { t: '', c: '' },
];

// ─── UTILS ───────────────────────────────────────────────────
function useGreeting() {
  const [g, setG] = useState('');
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setG('Good morning');
    else if (h < 17) setG('Good afternoon');
    else if (h < 21) setG('Good evening');
    else setG('Good night');
  }, []);
  return g;
}


// ─── COMMAND PALETTE (Cmd/Ctrl+K) ─────────────────────────────
const PALETTE_ACTIONS = [
  { label: 'Go to About', icon: '👤', href: '#about' },
  { label: 'Go to Work', icon: '🚀', href: '#work' },
  { label: 'Go to Experience', icon: '📈', href: '#experience' },
  { label: 'Go to Contact', icon: '✉️', href: '#contact' },
  { label: 'View GitHub', icon: '🐙', href: ME.github, external: true },
  { label: 'View LinkedIn', icon: '💼', href: ME.linkedin, external: true },
  { label: 'Download Resume', icon: '📄', href: ME.resume, external: true },
  { label: 'Email Nandu', icon: '📧', href: `mailto:${ME.email}`, external: true },
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
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', border: 'none', background: 'transparent', color: '#e2e8f0', fontFamily: 'var(--font-space)', fontSize: 14, textAlign: 'left', cursor: 'none' }}
                >
                  <span style={{ fontSize: 16 }}>{a.icon}</span>
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

// ─── CURSOR ──────────────────────────────────────────────────
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const rPos = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const onMove = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onOver = e => { if (e.target.closest('a,button,[data-hover]')) setHov(true); };
    const onOut  = e => { if (e.target.closest('a,button,[data-hover]')) setHov(false); };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    const loop = () => {
      if (dot.current) { dot.current.style.left = pos.current.x + 'px'; dot.current.style.top = pos.current.y + 'px'; }
      if (ring.current) {
        rPos.current.x += (pos.current.x - rPos.current.x) * 0.12;
        rPos.current.y += (pos.current.y - rPos.current.y) * 0.12;
        ring.current.style.left = rPos.current.x + 'px';
        ring.current.style.top  = rPos.current.y + 'px';
      }
      raf.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('mousemove', onMove); document.removeEventListener('mouseover', onOver); document.removeEventListener('mouseout', onOut); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className={`cursor-ring ${hov ? 'hovered' : ''}`} />
    </>
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

// ─── PARTICLE FIELD (hero background) ─────────────────────────
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles, raf;
    const mouse = { x: -9999, y: -9999 };
    const COLORS = ['99,102,241', '34,211,238', '168,85,247', '244,114,182'];

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const count = Math.min(90, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const onMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const draw = () => {
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > cw) p.vx *= -1;
        if (p.y < 0 || p.y > ch) p.vy *= -1;

        // subtle attraction toward mouse
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          p.x -= (dx / dist) * 0.4;
          p.y -= (dy / dist) * 0.4;
        }
      }

      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(${a.c},${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},0.7)`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />;
}

// ─── HERO ─────────────────────────────────────────────────────
function Hero() {
  const greeting = useGreeting();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const words = ['Agent Systems.', 'RAG Pipelines.', 'Production APIs.', 'AI SaaS.'];
  const [wIdx, setWIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWIdx(i => (i + 1) % words.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated particle network background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <ParticleField />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,5,16,0.2) 0%, rgba(5,5,16,0.1) 50%, rgba(5,5,16,0.95) 100%)' }} />
      </motion.div>

      {/* Glow orbs */}
      <motion.div animate={{ x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <motion.div animate={{ x: [0, -40, 0], y: [0, 60, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      {/* Grid lines */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Greeting */}
        {greeting && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="time-tag mb-6 inline-block"
          >{greeting}, I'm</motion.div>
        )}

        {/* Huge name */}
        <motion.h1 initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.3, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="cinematic-title glitch-wrap"
          data-text="NANDU PANAKANTI"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 10rem)', color: 'white' }}
        >NANDU PANAKANTI</motion.h1>

        {/* Subtitle */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-4 mb-2 text-2xl md:text-3xl font-light"
          style={{ color: '#94a3b8', fontFamily: 'var(--font-space)' }}
        >Full-Stack AI Engineer</motion.div>

        {/* Animated word */}
        <div className="overflow-hidden h-12 mb-8">
          <AnimatePresence mode="wait">
            <motion.div key={wIdx} initial={{ y: 48, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -48, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grad-text text-xl md:text-2xl font-medium"
              style={{ fontFamily: 'var(--font-space)' }}
            >Building {words[wIdx]}</motion.div>
          </AnimatePresence>
        </div>

        {/* Available badge */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10"
          style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span style={{ color: '#4ade80', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em' }}>AVAILABLE FOR FULL-TIME ROLES</span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a href="#work" whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(99,102,241,0.5)' }} whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-xl text-white font-semibold"
            style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', fontFamily: 'var(--font-space)' }}
          >View Work</motion.a>
          <motion.a href={`mailto:${ME.email}`} whileHover={{ scale: 1.05, borderColor: 'rgba(34,211,238,0.6)' }} whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-xl font-medium transition-all duration-300"
            style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', fontFamily: 'var(--font-space)' }}
          >Let's Talk</motion.a>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-8 mt-16"
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="cinematic-title text-4xl grad-text">{s.v}</div>
              <div style={{ color: '#475569', fontSize: 11, letterSpacing: '0.15em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span style={{ color: '#334155', fontSize: 9, letterSpacing: '0.4em', fontFamily: 'var(--font-mono)' }}>SCROLL</span>
        <div className="scroll-dot w-px h-8" style={{ background: 'linear-gradient(180deg,rgba(99,102,241,0.8),transparent)' }} />
      </motion.div>
    </section>
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
                style={{ position: 'absolute', bottom: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(5,5,16,0.7)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted ? '#94a3b8' : '#22d3ee', cursor: 'none' }}
              >
                {muted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                )}
              </motion.button>
            </div>
          </div>
          {/* Floating tag */}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl"
            style={{ background: 'rgba(5,5,16,0.95)', border: '1px solid rgba(34,211,238,0.4)', color: '#22d3ee', fontFamily: 'var(--font-mono)', fontSize: 11, whiteSpace: 'nowrap' }}
          >{'</ AI Engineer >'}</motion.div>
        </motion.div>

        {/* Right — text */}
        <motion.div initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <div style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', marginBottom: 16 }}>— WHO I AM</div>
          <h2 className="cinematic-title mb-8" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', color: 'white', lineHeight: 0.9 }}>
            I BUILD<br /><span className="grad-text">THINGS THAT</span><br />SHIP.
          </h2>
          <p className="mb-6 leading-relaxed" style={{ color: '#94a3b8', fontFamily: 'var(--font-space)', fontSize: '1rem' }}>
            Full-stack AI Engineer who builds production-ready systems end to end — LLM agent orchestration, RAG pipelines, event-driven payment backends, and real-time dashboards that hold up under real load.
          </p>
          <p className="mb-8 leading-relaxed" style={{ color: '#94a3b8', fontFamily: 'var(--font-space)', fontSize: '1rem' }}>
            My philosophy: reliability and correctness over demos. Everything I ship has proper error handling, idempotent operations, strong data integrity, and CI/CD pipelines that actually work.
          </p>
          <div className="flex flex-wrap gap-2">
            {['M.S. Computer Science','UCM 2026','Anthropic Certified','AWS Certified','200+ LeetCode'].map(t => (
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
  { t: 'Pushed commit', d: 'feat: add streaming responses to AI Workflow Platform', time: '2h ago', icon: '🚀' },
  { t: 'Deployed', d: 'PropMind v2.3 — Stripe webhook hardening', time: '6h ago', icon: '☁️' },
  { t: 'Solved', d: 'LeetCode #1456 — Maximum Number of Vowels in a Substring', time: '1d ago', icon: '🧩' },
  { t: 'Studying', d: 'Multi-agent orchestration patterns with Claude', time: '1d ago', icon: '🤖' },
  { t: 'Opened PR', d: 'ai-saas-copilot: dormant repo detection v2', time: '2d ago', icon: '🔧' },
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
          <div style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', marginBottom: 12 }}>— RIGHT NOW</div>
          <h2 className="cinematic-title" style={{ fontSize: 'clamp(2.5rem,7vw,7rem)', color: 'white', lineHeight: 0.9 }}>
            CURRENTLY<br /><span className="grad-text">SHIPPING.</span>
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
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1">
                  <div style={{ color: 'white', fontFamily: 'var(--font-space)', fontSize: 14, fontWeight: 600 }}>{a.t}</div>
                  <div style={{ color: '#94a3b8', fontFamily: 'var(--font-space)', fontSize: 13, marginTop: 2 }}>{a.d}</div>
                </div>
                <span style={{ color: '#475569', fontFamily: 'var(--font-mono)', fontSize: 11, whiteSpace: 'nowrap' }}>{a.time}</span>
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

// ─── WORK (horizontal scroll feel) ───────────────────────────
function Work() {
  const [active, setActive] = useState(0);
  const proj = PROJECTS[active];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="work" ref={ref} className="relative py-32 px-6 overflow-hidden" style={{ background: 'var(--bg2)' }}>
      <motion.div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(34,211,238,0.06) 0%,transparent 70%)', filter: 'blur(60px)' }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', marginBottom: 12 }}>— SELECTED WORK</div>
          <h2 className="cinematic-title" style={{ fontSize: 'clamp(3rem,8vw,8rem)', color: 'white', lineHeight: 0.9 }}>
            PROJECTS<br /><span className="grad-text">BUILT TO</span><br />PRODUCTION.
          </h2>
        </motion.div>

        {/* Project selector tabs */}
        <div className="flex flex-wrap gap-3 mb-12">
          {PROJECTS.map((p, i) => (
            <motion.button key={p.id} onClick={() => setActive(i)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300"
              style={{
                background: active === i ? `${p.accent}18` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active === i ? p.accent : 'rgba(255,255,255,0.08)'}`,
                color: active === i ? 'white' : '#475569',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ color: p.accent, fontSize: 12 }}>{p.num}</span>
              <span style={{ fontSize: 13 }}>{p.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Project detail */}
        <AnimatePresence mode="wait">
          <motion.div key={proj.id}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-card overflow-hidden"
          >
            <div className="h-1" style={{ background: `linear-gradient(90deg,${proj.accent},${proj.accent}60,transparent)` }} />
            <div className="p-10 grid lg:grid-cols-2 gap-12 items-start">
              {/* Left */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="cinematic-title text-6xl" style={{ color: proj.accent, opacity: 0.3 }}>{proj.num}</span>
                  <div>
                    <h3 className="cinematic-title text-4xl" style={{ color: 'white' }}>{proj.name.toUpperCase()}</h3>
                    <span style={{ color: proj.accent, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em' }}>{proj.category.toUpperCase()} · {proj.year}</span>
                  </div>
                </div>
                <p className="mt-6 mb-8 leading-relaxed" style={{ color: '#94a3b8', fontFamily: 'var(--font-space)' }}>{proj.desc}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {proj.stack.map(t => (
                    <span key={t} className="px-3 py-1 text-xs rounded-full"
                      style={{ background: `${proj.accent}15`, color: proj.accent, border: `1px solid ${proj.accent}40`, fontFamily: 'var(--font-mono)' }}
                    >{t}</span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <motion.a href={proj.live} target="_blank" rel="noreferrer"
                    whileHover={{ scale: 1.05, boxShadow: `0 8px 24px ${proj.accent}40` }} whileTap={{ scale: 0.97 }}
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                    style={{ background: `linear-gradient(135deg,${proj.accent},${proj.accent}99)`, fontFamily: 'var(--font-space)' }}
                  >Live Demo ↗</motion.a>
                  {proj.github && (
                    <motion.a href={proj.github} target="_blank" rel="noreferrer"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                      style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontFamily: 'var(--font-space)' }}
                    >GitHub ↗</motion.a>
                  )}
                </div>
              </div>
              {/* Right — live iframe */}
              <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${proj.accent}30` }}>
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(0,0,0,0.4)', borderBottom: `1px solid ${proj.accent}20` }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
                  <span style={{ marginLeft: 8, fontSize: 10, color: '#334155', fontFamily: 'var(--font-mono)' }}>{proj.live.replace('https://', '')}</span>
                </div>
                <iframe src={proj.live} title={proj.name} loading="lazy"
                  style={{ width: '100%', height: 340, border: 'none', background: '#000' }}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
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

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 timeline-line hidden md:block" />

          <div className="space-y-12">
            {EXPERIENCE.map((e, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative md:pl-24 group"
              >
                {/* Dot */}
                <motion.div whileHover={{ scale: 1.4 }}
                  className="absolute left-6 top-1 w-4 h-4 rounded-full hidden md:block"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}
                />
                <div className="glass-card p-8 transition-all duration-400 group-hover:border-indigo-500/40">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <span style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.15em' }}>{e.year}</span>
                      <h3 className="text-xl font-bold mt-1" style={{ color: 'white', fontFamily: 'var(--font-space)' }}>{e.title}</h3>
                      <p style={{ color: '#22d3ee', fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 2 }}>{e.place}</p>
                    </div>
                  </div>
                  <p style={{ color: '#94a3b8', fontFamily: 'var(--font-space)', lineHeight: 1.7 }}>{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certs grid */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24"
        >
          <div style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', marginBottom: 16 }}>— CERTIFICATIONS</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CERTS.map((c, i) => (
              <motion.a key={i} href={c.link} target="_blank" rel="noreferrer"
                whileHover={{ y: -6, borderColor: 'rgba(99,102,241,0.5)' }}
                className="glass-card p-5 flex items-center gap-4 transition-all duration-300"
              >
                <span className="text-3xl">{c.icon}</span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'white', fontFamily: 'var(--font-space)' }}>{c.name}</div>
                  <div style={{ color: '#475569', fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 2 }}>{c.issuer} · {c.date}</div>
                </div>
              </motion.a>
            ))}
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
          style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#22d3ee)', border: 'none', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white', fontFamily: 'var(--font-mono)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}
        >{open ? '✕' : '>_'}</motion.button>
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
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', cursor: 'none' }} onClick={() => setOpen(false)} />
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
                  style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', color: '#a5b4fc', fontSize: 11, cursor: 'none', fontFamily: 'var(--font-mono)' }}
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
            Actively seeking full-time AI / full-stack engineering roles. If you're building something ambitious, let's talk.
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
          <Work />
          <Experience />
          <Contact />
          <Footer />
          <Terminal />
        </motion.div>
      )}
    </main>
  );
}
