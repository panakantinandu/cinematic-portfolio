'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView } from 'framer-motion';
import { SKILL_CATEGORIES } from '@/data/content';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const MAX_COUNT = Math.max(...SKILL_CATEGORIES.map(c => c.items.length));

function CountUp({ to, active, reducedMotion }) {
  const [val, setVal] = useState(reducedMotion ? to : 0);
  useEffect(() => {
    if (!active || reducedMotion) return;
    const controls = animate(0, to, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [active, to, reducedMotion]);
  return <>{val}</>;
}

function CategoryCard({ category, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();
  const pct = Math.round((category.items.length / MAX_COUNT) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: reducedMotion ? 0 : (index % 3) * 0.08 }}
      className="glass-card p-6"
    >
      <div className="flex items-baseline justify-between mb-3">
        <h3 style={{ color: 'white', fontFamily: 'var(--font-space)', fontSize: 15, fontWeight: 600 }}>{category.label}</h3>
        <span className="cinematic-title grad-text" style={{ fontSize: 28, lineHeight: 1 }}>
          <CountUp to={category.items.length} active={inView} reducedMotion={reducedMotion} />
        </span>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg,#6366f1,#22d3ee)' }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.9, delay: reducedMotion ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <motion.div
        className="flex flex-wrap gap-2"
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reducedMotion ? 0 : 0.035 } },
        }}
      >
        {category.items.map(item => (
          <motion.span
            key={item}
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0 },
            }}
            className="px-2.5 py-1 text-xs rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)' }}
          >{item}</motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' });
  const totalSkills = SKILL_CATEGORIES.reduce((n, c) => n + c.items.length, 0);

  return (
    <section id="skills" className="relative py-32 px-6 overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(168,85,247,0.06) 0%,transparent 60%)' }}
      />
      <div className="max-w-7xl mx-auto" ref={headerRef}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', marginBottom: 12 }}>
            — {totalSkills} SKILLS · {SKILL_CATEGORIES.length} CATEGORIES
          </div>
          <h2 className="cinematic-title" style={{ fontSize: 'clamp(2.5rem,7vw,7rem)', color: 'white', lineHeight: 0.9 }}>
            TOOLS OF<br /><span className="grad-text">THE TRADE.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILL_CATEGORIES.map((c, i) => (
            <CategoryCard key={c.key} category={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
