'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Drives Lenis smooth scroll and keeps GSAP's ScrollTrigger in sync
// with it. Fully bypassed under prefers-reduced-motion — native
// scroll + instant ScrollTrigger refresh only.
export default function SmoothScroll({ children }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      ScrollTrigger.normalizeScroll(false);
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: t => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      window.__lenis = undefined;
    };
  }, [reducedMotion]);

  return children;
}
