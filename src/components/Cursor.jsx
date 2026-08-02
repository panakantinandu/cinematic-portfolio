'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useIsMobile } from '@/hooks/useReducedMotion';

const TRAIL_LEN = 6;

// Dot + ring (unchanged) plus a short lerped trail of dots rendered
// with mix-blend-mode: difference. Desktop + fine-pointer only —
// real touch input never mounts this at all.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const trailRefs = useRef([]);
  const pos = useRef({ x: 0, y: 0 });
  const rPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef(Array.from({ length: TRAIL_LEN }, () => ({ x: 0, y: 0 })));
  const raf = useRef(null);
  const [hov, setHov] = useState(false);

  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [hasFinePointer, setHasFinePointer] = useState(true);

  useEffect(() => {
    setHasFinePointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  const active = !reducedMotion && !isMobile && hasFinePointer;

  useEffect(() => {
    if (!active) return;

    document.body.classList.add('custom-cursor');

    const onMove = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onOver = e => { if (e.target.closest('a,button,[data-hover]')) setHov(true); };
    const onOut = e => { if (e.target.closest('a,button,[data-hover]')) setHov(false); };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    const loop = () => {
      if (dot.current) { dot.current.style.left = pos.current.x + 'px'; dot.current.style.top = pos.current.y + 'px'; }
      if (ring.current) {
        rPos.current.x += (pos.current.x - rPos.current.x) * 0.12;
        rPos.current.y += (pos.current.y - rPos.current.y) * 0.12;
        ring.current.style.left = rPos.current.x + 'px';
        ring.current.style.top = rPos.current.y + 'px';
      }
      let leaderX = pos.current.x, leaderY = pos.current.y;
      trailPos.current.forEach((p, i) => {
        p.x += (leaderX - p.x) * 0.35;
        p.y += (leaderY - p.y) * 0.35;
        const node = trailRefs.current[i];
        if (node) {
          node.style.left = p.x + 'px';
          node.style.top = p.y + 'px';
          node.style.opacity = (1 - i / TRAIL_LEN) * 0.5;
        }
        leaderX = p.x; leaderY = p.y;
      });
      raf.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.body.classList.remove('custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      {trailPos.current.map((_, i) => (
        <div
          key={i}
          ref={el => { trailRefs.current[i] = el; }}
          className="cursor-trail-dot"
          style={{ width: 5 - i * 0.4, height: 5 - i * 0.4 }}
        />
      ))}
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className={`cursor-ring ${hov ? 'hovered' : ''}`} />
    </>
  );
}
