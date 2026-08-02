'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Mail, ChevronDown } from 'lucide-react';
import ParticleField from './ParticleField';
import MagneticButton from './MagneticButton';
import SplitReveal from './SplitReveal';
import { ME, STATS } from '@/data/content';

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

const FOCUS_AREAS = ['Backend & Distributed Systems.', 'AI/LLM Engineering.', 'Cloud Infrastructure.'];

export default function Hero() {
  const greeting = useGreeting();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % FOCUS_AREAS.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <ParticleField />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,5,16,0.2) 0%, rgba(5,5,16,0.1) 50%, rgba(5,5,16,0.95) 100%)' }} />
      </motion.div>

      <motion.div animate={{ x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <motion.div animate={{ x: [0, -40, 0], y: [0, 60, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {greeting && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="time-tag mb-6 inline-block"
          >{greeting}, I'm</motion.div>
        )}

        <div className="glitch-wrap" data-text="NANDU PANAKANTI">
          <SplitReveal as="h1" by="chars" trigger="load" delay={0.3} stagger={0.02} duration={0.7}
            className="cinematic-title"
            style={{ fontSize: 'clamp(2.6rem, 10vw, 10rem)', color: 'white' }}
          >NANDU PANAKANTI</SplitReveal>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-4 mb-2 text-2xl md:text-3xl font-light"
          style={{ color: '#94a3b8', fontFamily: 'var(--font-space)' }}
        >{ME.title}</motion.div>

        <div className="overflow-hidden h-12 mb-8">
          <AnimatePresence mode="wait">
            <motion.div key={idx} initial={{ y: 48, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -48, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grad-text text-xl md:text-2xl font-medium"
              style={{ fontFamily: 'var(--font-space)' }}
            >{FOCUS_AREAS[idx]}</motion.div>
          </AnimatePresence>
        </div>

        {ME.available && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10"
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span style={{ color: '#4ade80', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em' }}>AVAILABLE FOR FULL-TIME ROLES{ME.relocate ? ' · OPEN TO RELOCATE' : ''}</span>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            as={motion.a}
            href="#work"
            data-hover
            whileHover={{ boxShadow: '0 12px 40px rgba(99,102,241,0.5)' }} whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', fontFamily: 'var(--font-space)' }}
          >View Work <ArrowRight size={16} strokeWidth={2} /></MagneticButton>
          <MagneticButton
            as={motion.a}
            href={`mailto:${ME.email}`}
            data-hover
            whileHover={{ borderColor: 'rgba(34,211,238,0.6)' }} whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors duration-300"
            style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', fontFamily: 'var(--font-space)' }}
          >Let's Talk <Mail size={16} strokeWidth={2} /></MagneticButton>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span style={{ color: '#334155', fontSize: 9, letterSpacing: '0.4em', fontFamily: 'var(--font-mono)' }}>SCROLL</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown size={16} color="#6366f1" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
