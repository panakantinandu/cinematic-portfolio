'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Hand-rolled word/letter split-and-stagger reveal — GSAP SplitText
// is a paid Club plugin we don't have a license for, so this splits
// text into spans manually and staggers them the same way SplitText
// would. Reserve `by="chars"` for short headlines (DOM cost scales
// per character); use `by="words"` for longer copy.
export default function SplitReveal({
  as: Tag = 'div',
  children,
  by = 'words',
  className,
  style,
  trigger = 'scroll',
  stagger = 0.03,
  duration = 0.6,
  delay = 0,
  y = 20,
  once = true,
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const text = children ?? '';
    const units = by === 'chars' ? Array.from(text) : text.split(' ');
    el.innerHTML = units
      .map(u => {
        if (by === 'chars') {
          return `<span class="split-unit" style="display:inline-block;">${u === ' ' ? '&nbsp;' : u}</span>`;
        }
        return `<span class="split-unit" style="display:inline-block;">${u}&nbsp;</span>`;
      })
      .join('');

    const spans = el.querySelectorAll('.split-unit');

    if (reducedMotion) {
      gsap.set(spans, { opacity: 1, y: 0, rotateX: 0 });
      return;
    }

    gsap.set(spans, { opacity: 0, y, rotateX: -30, transformOrigin: '50% 100%' });

    const tween = gsap.to(spans, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration,
      stagger,
      delay,
      ease: 'expo.out',
      scrollTrigger: trigger === 'scroll' ? {
        trigger: el,
        start: 'top 88%',
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      } : undefined,
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [children, by, stagger, duration, delay, y, once, trigger, reducedMotion]);

  return <Tag ref={ref} className={className} style={style}>{children}</Tag>;
}
