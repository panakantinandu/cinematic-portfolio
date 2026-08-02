'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion, useIsMobile } from '@/hooks/useReducedMotion';

// Magnetic pull on hover — gsap.quickTo on x/y, elastic release,
// pull clamped to 0.3x cursor delta so the button never leaves its
// hit box. Reserve for 1-2 focal CTAs per screen; desktop only.
export default function MagneticButton({ as: Tag = 'a', className, style, children, strength = 0.3, ...props }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const disabled = reducedMotion || isMobile;

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'elastic.out(1,0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'elastic.out(1,0.4)' });

    const onMove = e => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * strength);
      yTo((e.clientY - r.top - r.height / 2) * strength);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [disabled, strength]);

  return (
    <Tag ref={ref} className={className} style={{ display: 'inline-block', willChange: 'transform', ...style }} {...props}>
      {children}
    </Tag>
  );
}
