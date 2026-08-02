'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, Cpu } from 'lucide-react';
import { EXPERIENCE } from '@/data/content';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const ICONS = [Cpu, Briefcase, GraduationCap];

// Single SVG path down the left rail, drawn in via stroke-dashoffset
// scrubbed to scroll progress. Falls back to a fully-drawn static
// line under prefers-reduced-motion.
export default function Timeline() {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const [height, setHeight] = useState(0);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const el = wrapRef.current;
    if (!path || !el || !height) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;

    if (reducedMotion) {
      path.style.strokeDashoffset = 0;
      return;
    }

    path.style.strokeDashoffset = length;
    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 0.6,
      },
    });

    return () => tween.scrollTrigger?.kill();
  }, [height, reducedMotion]);

  return (
    <div ref={wrapRef} className="relative">
      <svg
        className="absolute left-8 top-0 hidden md:block"
        width="4" height={height}
        viewBox={`0 0 4 ${height}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <path ref={pathRef} className="timeline-draw-path" d={`M2,0 L2,${height}`} stroke="url(#timeline-grad)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <defs>
          <linearGradient id="timeline-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      <div className="space-y-12">
        {EXPERIENCE.map((e, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.div key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: reducedMotion ? 0 : i * 0.1 }}
              className="relative md:pl-24 group"
            >
              <div
                className="absolute left-5 top-1 w-7 h-7 rounded-full items-center justify-center hidden md:flex"
                style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}
              >
                <Icon size={14} color="white" strokeWidth={2} />
              </div>
              <div className="glass-card p-8 transition-all duration-400 group-hover:border-indigo-500/40">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <span style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.15em' }}>{e.date}</span>
                    <h3 className="text-xl font-bold mt-1" style={{ color: 'white', fontFamily: 'var(--font-space)' }}>{e.title}</h3>
                    <p style={{ color: '#22d3ee', fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 2 }}>{e.place}</p>
                  </div>
                </div>
                {e.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {e.tags.map(t => (
                      <span key={t} className="px-2.5 py-1 text-xs rounded-full"
                        style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)', fontFamily: 'var(--font-mono)' }}
                      >{t}</span>
                    ))}
                  </div>
                )}
                <ul className="space-y-2">
                  {e.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2" style={{ color: '#94a3b8', fontFamily: 'var(--font-space)', lineHeight: 1.7 }}>
                      <span style={{ color: '#475569', flexShrink: 0 }}>—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
