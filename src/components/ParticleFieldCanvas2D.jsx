'use client';
import { useEffect, useRef } from 'react';

// Lightweight canvas2d lattice — used on mobile (<768px) and as the
// static frame under prefers-reduced-motion. No WebGL, no per-frame
// GC churn beyond simple particle updates.
export default function ParticleFieldCanvas2D({ animate = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles, raf;
    const mouse = { x: -9999, y: -9999 };
    const COLORS = ['99,102,241', '34,211,238', '168,85,247', '244,114,182'];

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio, 2);
      h = canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio, 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
      const count = Math.min(45, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const onMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const frame = () => {
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      for (const p of particles) {
        if (animate) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > cw) p.vx *= -1;
          if (p.y < 0 || p.y > ch) p.vy *= -1;
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) { p.x -= (dx / dist) * 0.35; p.y -= (dy / dist) * 0.35; }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(${a.c},${0.1 * (1 - dist / 110)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},0.65)`;
        ctx.fill();
      }

      if (animate) raf = requestAnimationFrame(frame);
    };

    resize();
    frame();
    window.addEventListener('resize', resize);
    if (animate) window.addEventListener('mousemove', onMove);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [animate]);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />;
}
