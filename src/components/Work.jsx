'use client';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import { Code2, ArrowUpRight, Clock } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { PROJECTS } from '@/data/content';
import { useReducedMotion, useIsMobile } from '@/hooks/useReducedMotion';

function useTilt(disabled) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotateY = useSpring(ry, { stiffness: 150, damping: 20, mass: 0.5 });

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const onMove = e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry.set(px * 6);
      rx.set(-py * 6);
    };
    const onLeave = () => { rx.set(0); ry.set(0); };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [disabled]);

  return { ref, rotateX, rotateY };
}

function LinkButton({ href, pending, children, accent, variant = 'solid' }) {
  if (pending || !href) {
    return (
      <span
        className="px-5 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2"
        style={{ border: '1px dashed rgba(255,255,255,0.15)', color: '#475569', fontFamily: 'var(--font-space)', cursor: 'default' }}
      >
        <Clock size={14} strokeWidth={2} /> Link coming soon
      </span>
    );
  }
  return (
    <MagneticButton
      as={motion.a}
      href={href}
      target="_blank"
      rel="noreferrer"
      data-hover
      strength={0.25}
      whileHover={{ boxShadow: variant === 'solid' ? `0 8px 24px ${accent}40` : 'none' }}
      whileTap={{ scale: 0.97 }}
      className="px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
      style={variant === 'solid'
        ? { background: `linear-gradient(135deg,${accent},${accent}99)`, color: 'white', fontFamily: 'var(--font-space)' }
        : { border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontFamily: 'var(--font-space)' }}
    >
      {children}
    </MagneticButton>
  );
}

function ProjectCard({ project: p, index, total, progress }) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { ref: tiltRef, rotateX, rotateY } = useTilt(reducedMotion || isMobile);
  const cardInView = useInView(tiltRef, { once: true, margin: '-60px' });

  const seg = 1 / total;
  const start = index * seg;
  const own = (index + 1) * seg;
  const recede = Math.min((index + 2) * seg, 1);
  const isLast = index === total - 1;

  const scale = useTransform(progress, isLast ? [0, 1] : [start, own, recede], isLast ? [1, 1] : [1, 1, 0.94]);
  const opacity = useTransform(progress, isLast ? [0, 1] : [start, own, recede], isLast ? [1, 1] : [1, 1, 0.55]);

  return (
    <motion.div
      ref={tiltRef}
      initial={{ opacity: 0, y: 40 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ scale: reducedMotion ? 1 : scale, opacity: reducedMotion ? 1 : opacity, perspective: 1200 }}
      className="glass-card overflow-hidden w-full"
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        <div className="h-1.5" style={{ background: `linear-gradient(90deg,${p.accent},${p.accent}60,transparent)` }} />
        <div className="p-8 md:p-10 grid lg:grid-cols-[1fr_auto] gap-8">
          <div>
            <div className="flex items-start gap-4 mb-3">
              <span className="cinematic-title text-5xl md:text-6xl" style={{ color: p.accent, opacity: 0.3, lineHeight: 1 }}>{p.num}</span>
              <div>
                <h3 className="cinematic-title text-3xl md:text-4xl" style={{ color: 'white', lineHeight: 1 }}>{p.name.toUpperCase()}</h3>
                <p style={{ color: '#94a3b8', fontFamily: 'var(--font-space)', fontSize: 14, marginTop: 4 }}>{p.subtitle}</p>
                <span style={{ color: p.accent, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em' }}>{p.category.toUpperCase()} · {p.date}</span>
              </div>
            </div>

            <p className="mt-5 mb-5 leading-relaxed" style={{ color: '#94a3b8', fontFamily: 'var(--font-space)' }}>{p.desc}</p>

            {p.bullets && (
              <ul className="space-y-2 mb-6">
                {p.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm" style={{ color: '#94a3b8', fontFamily: 'var(--font-space)', lineHeight: 1.6 }}>
                    <span style={{ color: p.accent, flexShrink: 0 }}>▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {p.stack.map(t => (
                <span key={t} className="px-3 py-1 text-xs rounded-full"
                  style={{ background: `${p.accent}15`, color: p.accent, border: `1px solid ${p.accent}40`, fontFamily: 'var(--font-mono)' }}
                >{t}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <LinkButton href={p.live} pending={p.live === '#' || (!p.live && !p.linksPending)} accent={p.accent}>
                {p.liveLabel || 'Live Demo'} <ArrowUpRight size={15} strokeWidth={2.2} />
              </LinkButton>
              {p.liveSecondary !== undefined && (
                <LinkButton href={p.liveSecondary} pending={p.liveSecondary === '#'} accent={p.accent} variant="ghost">
                  {p.liveSecondaryLabel} <ArrowUpRight size={15} strokeWidth={2.2} />
                </LinkButton>
              )}
              <LinkButton href={p.github} pending={p.github === '#'} accent={p.accent} variant="ghost">
                <Code2 size={15} strokeWidth={2.2} /> GitHub
              </LinkButton>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center items-center w-56 shrink-0 rounded-2xl p-6 text-center"
            style={{ background: `radial-gradient(circle at 50% 30%, ${p.accent}1a, transparent 70%)`, border: `1px solid ${p.accent}25` }}
          >
            <span className="cinematic-title" style={{ fontSize: 64, color: p.accent, opacity: 0.85, lineHeight: 1 }}>{p.num}</span>
            <span style={{ color: '#475569', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', marginTop: 8 }}>
              {p.stack.length} TECHNOLOGIES
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Work() {
  const wrapRef = useRef(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' });
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });

  return (
    <section id="work" className="relative py-32 px-6 overflow-hidden" style={{ background: 'var(--bg2)' }}>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(34,211,238,0.06) 0%,transparent 70%)', filter: 'blur(60px)' }}
      />
      <div className="max-w-5xl mx-auto">
        <div ref={headerRef} className="mb-16">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <div style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', marginBottom: 12 }}>— SELECTED WORK</div>
            <h2 className="cinematic-title" style={{ fontSize: 'clamp(3rem,8vw,8rem)', color: 'white', lineHeight: 0.9 }}>
              PROJECTS<br /><span className="grad-text">BUILT TO</span><br />PRODUCTION.
            </h2>
          </motion.div>
        </div>

        {isMobile ? (
          <div className="flex flex-col gap-8">
            {PROJECTS.map((p, i) => (
              <ProjectCardMobile key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div ref={wrapRef} className="relative">
            {PROJECTS.map((p, i) => (
              <div key={p.id} style={{ minHeight: i === PROJECTS.length - 1 ? 'auto' : '92vh' }} className="relative flex items-start">
                <div className="sticky w-full" style={{ top: '9vh', zIndex: i + 1 }}>
                  <ProjectCard project={p} index={i} total={PROJECTS.length} progress={scrollYProgress} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCardMobile({ project: p }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      <div className="h-1.5" style={{ background: `linear-gradient(90deg,${p.accent},${p.accent}60,transparent)` }} />
      <div className="p-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="cinematic-title text-4xl" style={{ color: p.accent, opacity: 0.3 }}>{p.num}</span>
          <div>
            <h3 className="cinematic-title text-2xl" style={{ color: 'white' }}>{p.name.toUpperCase()}</h3>
            <span style={{ color: p.accent, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em' }}>{p.category.toUpperCase()} · {p.date}</span>
          </div>
        </div>
        <p className="mb-4 text-sm leading-relaxed" style={{ color: '#94a3b8', fontFamily: 'var(--font-space)' }}>{p.desc}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {p.stack.slice(0, 6).map(t => (
            <span key={t} className="px-2.5 py-1 text-[11px] rounded-full"
              style={{ background: `${p.accent}15`, color: p.accent, border: `1px solid ${p.accent}40`, fontFamily: 'var(--font-mono)' }}
            >{t}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href={p.live} pending={p.live === '#'} accent={p.accent}>{p.liveLabel || 'Live Demo'} <ArrowUpRight size={14} /></LinkButton>
          <LinkButton href={p.github} pending={p.github === '#'} accent={p.accent} variant="ghost"><Code2 size={14} /> GitHub</LinkButton>
        </div>
      </div>
    </motion.div>
  );
}
