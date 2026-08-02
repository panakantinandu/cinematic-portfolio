'use client';
import dynamic from 'next/dynamic';
import { useReducedMotion, useIsMobile } from '@/hooks/useReducedMotion';
import ParticleFieldCanvas2D from './ParticleFieldCanvas2D';

// Three.js touches the DOM directly (WebGLRenderer canvas) and must
// never run during SSR.
const ParticleFieldWebGL = dynamic(() => import('./ParticleFieldWebGL'), { ssr: false });

export default function ParticleField() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  if (reducedMotion) return <ParticleFieldCanvas2D animate={false} />;
  if (isMobile) return <ParticleFieldCanvas2D animate />;
  return <ParticleFieldWebGL />;
}
