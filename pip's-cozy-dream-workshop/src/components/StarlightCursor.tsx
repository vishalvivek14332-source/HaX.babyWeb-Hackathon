import React, { useEffect, useState, useRef } from 'react';
import { DreamMode } from '../types';

interface StarlightCursorProps {
  dreamMode: DreamMode;
  enabled?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export function StarlightCursor({ dreamMode, enabled = true }: StarlightCursorProps) {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    // Only track on fine pointer (mouse/stylus), avoid overhead on touch-only
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Throttle particle emission to every 60ms
      const now = Date.now();
      if (now - lastEmitRef.current > 60) {
        lastEmitRef.current = now;
        const newParticle: Particle = {
          id: now + Math.random(),
          x: e.clientX + (Math.random() * 24 - 12),
          y: e.clientY + (Math.random() * 24 - 12),
          size: Math.random() * 4 + 2,
          opacity: 0.9,
        };
        setParticles((prev) => [...prev.slice(-15), newParticle]);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animate and decay particles
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.08, y: p.y - 1 }))
          .filter((p) => p.opacity > 0)
      );
    }, 40);
    return () => clearInterval(interval);
  }, [particles]);

  if (!enabled || !isVisible) return null;

  const isNight = dreamMode === 'night';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden transition-opacity duration-300"
      aria-hidden="true"
    >
      {/* Nightlight Spotlight Glow */}
      <div
        className="absolute rounded-full transition-transform duration-75 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isNight ? '340px' : '220px',
          height: isNight ? '340px' : '220px',
          transform: 'translate(-50%, -50%)',
          background: isNight
            ? 'radial-gradient(circle, rgba(253, 230, 138, 0.28) 0%, rgba(245, 158, 11, 0.12) 45%, rgba(168, 85, 247, 0.05) 70%, transparent 100%)'
            : 'radial-gradient(circle, rgba(254, 243, 199, 0.35) 0%, rgba(251, 191, 36, 0.1) 50%, transparent 100%)',
          mixBlendMode: isNight ? 'screen' : 'soft-light',
          filter: 'blur(2px)',
        }}
      />

      {/* Floating Stardust Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: isNight ? '#fde047' : '#f59e0b',
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${isNight ? '#fde047' : '#fbbf24'}`,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.05s linear',
          }}
        />
      ))}
    </div>
  );
}
