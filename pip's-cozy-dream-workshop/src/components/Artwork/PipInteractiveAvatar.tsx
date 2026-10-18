import React, { useState, useEffect, useRef } from 'react';
import { DreamMode } from '../../types';
import { musicBox } from '../../utils/audio';

interface PipInteractiveAvatarProps {
  dreamMode?: DreamMode;
  className?: string;
  size?: number;
}

export function PipInteractiveAvatar({
  dreamMode = 'day',
  className = '',
  size = 320,
}: PipInteractiveAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isWinking, setIsWinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isNight = dreamMode === 'night';

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // 1. Head Tilt (clamped to max ±16 degrees)
      const maxTilt = 16;
      const tiltX = Math.max(-maxTilt, Math.min(maxTilt, (-dy / window.innerHeight) * 32));
      const tiltY = Math.max(-maxTilt, Math.min(maxTilt, (dx / window.innerWidth) * 32));
      setTilt({ x: tiltX, y: tiltY });

      // 2. Eye Pupil Tracking (offset within eye radius, max 9px)
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const maxEyeShift = 9;
      const currentShift = Math.min(maxEyeShift, dist / 25);
      const pupilX = Math.cos(angle) * currentShift;
      const pupilY = Math.sin(angle) * currentShift;

      setEyeOffset({ x: pupilX, y: pupilY });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  const handleClick = () => {
    setIsWinking(true);
    musicBox.playNamedNote('G5', 0.6);
    setTimeout(() => musicBox.playNamedNote('C6', 0.8), 120);
    setTimeout(() => setIsWinking(false), 900);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
        setEyeOffset({ x: 0, y: 0 });
      }}
      className={`relative cursor-pointer select-none transition-transform duration-150 ease-out ${className}`}
      style={{
        width: `${size}px`,
        height: `${size * 1.15}px`,
        perspective: '800px',
      }}
      title="Pip's eyes follow your pointer! Click Pip to hear a giggle chime."
    >
      {/* 3D Head Tilt Container */}
      <div
        className="w-full h-full relative transition-transform duration-100 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Soft Ambient Shadow */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-md opacity-40 pointer-events-none"
          style={{
            background: isNight ? '#a855f7' : '#9d4562',
          }}
        />

        {/* Pip Interactive Vector Illustration */}
        <svg
          viewBox="0 0 340 390"
          className="w-full h-full drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft Porcelain Gradient for Pip's Head */}
            <radialGradient id="pipBoneGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#fff6ee" />
              <stop offset="85%" stopColor="#fae7d9" />
              <stop offset="100%" stopColor="#ecd3c1" />
            </radialGradient>

            {/* Rosy Nightcap Gradient */}
            <linearGradient id="nightcapGrad" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor={isNight ? '#6d28d9' : '#f472b6'} />
              <stop offset="50%" stopColor={isNight ? '#4c1d95' : '#e11d48'} />
              <stop offset="100%" stopColor={isNight ? '#2e1065' : '#9f1239'} />
            </linearGradient>

            {/* Glowing Eye Socket Gradient */}
            <radialGradient id="eyeSocketGrad" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#1e131d" />
              <stop offset="75%" stopColor="#2e1b2b" />
              <stop offset="100%" stopColor="#3d2138" />
            </radialGradient>

            {/* Starlight Pupil Gradient */}
            <radialGradient id="pupilGlowGrad" cx="40%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
          </defs>

          {/* ============================================================== */}
          {/* 1. Cozy Nightcap Behind Head */}
          {/* ============================================================== */}
          <path
            d="M 65,140 C 40,80 70,30 140,20 C 230,10 300,50 315,110 C 330,170 290,220 280,240 C 265,220 270,160 250,130 C 220,90 140,80 90,120 Z"
            fill="url(#nightcapGrad)"
            stroke={isNight ? '#8b5cf6' : '#fda4af'}
            strokeWidth="3"
            filter="drop-shadow(0 6px 12px rgba(0,0,0,0.15))"
          />

          {/* Golden Bell / Star at Tip of Nightcap */}
          <g transform="translate(285, 235)">
            <circle cx="0" cy="0" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="-3" cy="-3" r="4" fill="#fef08a" />
            <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#78350f" fontWeight="bold">★</text>
          </g>

          {/* Tiny Stars on Nightcap */}
          <text x="120" y="55" fontSize="14" fill="#fef08a" opacity="0.9">✦</text>
          <text x="190" y="45" fontSize="11" fill="#fef08a" opacity="0.8">★</text>
          <text x="245" y="85" fontSize="13" fill="#fef08a" opacity="0.9">✦</text>

          {/* ============================================================== */}
          {/* 2. Pip's Round Skull Baby Head */}
          {/* ============================================================== */}
          <ellipse
            cx="170"
            cy="195"
            rx="98"
            ry="92"
            fill="url(#pipBoneGrad)"
            stroke="#e5bda7"
            strokeWidth="3.5"
          />

          {/* Fluffy Nightcap Rim Band Over Forehead */}
          <path
            d="M 78,145 C 120,130 220,130 262,145 C 265,160 255,175 240,175 C 200,165 140,165 100,175 C 85,175 75,160 78,145 Z"
            fill="#ffffff"
            stroke="#e5bda7"
            strokeWidth="2.5"
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))"
          />

          {/* Rosy Soft Cheeks */}
          <ellipse
            cx="108"
            cy="235"
            rx="18"
            ry="11"
            fill={isNight ? '#f472b6' : '#fb7185'}
            opacity={isNight ? 0.35 : 0.45}
          />
          <ellipse
            cx="232"
            cy="235"
            rx="18"
            ry="11"
            fill={isNight ? '#f472b6' : '#fb7185'}
            opacity={isNight ? 0.35 : 0.45}
          />

          {/* ============================================================== */}
          {/* 3. Eyes (Reaction to Cursor & Night/Day Mood) */}
          {/* ============================================================== */}
          {isNight ? (
            /* NIGHT MODE: Sleepy closed crescent eyes with peaceful smile & Zzz bubbles */
            <g>
              {/* Left Eye: Sleepy Crescent Arc */}
              <path
                d="M 105,200 Q 125,220 145,200"
                stroke="#4a2835"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 125,212 L 125,220 M 115,208 L 112,216 M 135,208 L 138,216"
                stroke="#4a2835"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Right Eye: Sleepy Crescent Arc */}
              <path
                d="M 195,200 Q 215,220 235,200"
                stroke="#4a2835"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 215,212 L 215,220 M 205,208 L 202,216 M 225,208 L 228,216"
                stroke="#4a2835"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Floating Z-z-z dream bubbles */}
              <g className="animate-float-gentle">
                <text x="250" y="160" fontSize="16" fill="#c084fc" fontWeight="bold">z</text>
                <text x="265" y="140" fontSize="20" fill="#a855f7" fontWeight="bold">Z</text>
                <text x="282" y="118" fontSize="24" fill="#9333ea" fontWeight="black">Z</text>
              </g>
            </g>
          ) : (
            /* DAY MODE: Big round glowing eyes that actively follow the pointer */
            <g>
              {/* Left Eye Socket */}
              <ellipse
                cx="125"
                cy="200"
                rx="25"
                ry="27"
                fill="url(#eyeSocketGrad)"
                stroke="#8b5266"
                strokeWidth="2"
              />
              {/* Left Pupil (Follows Pointer) */}
              <g transform={`translate(${125 + eyeOffset.x}, ${200 + eyeOffset.y})`}>
                <ellipse cx="0" cy="0" rx="14" ry="14" fill="url(#pupilGlowGrad)" />
                <ellipse cx="-4" cy="-4" rx="5" ry="5" fill="#ffffff" />
                <text x="0" y="3" textAnchor="middle" fontSize="11" fill="#78350f" fontWeight="bold">✦</text>
              </g>

              {/* Right Eye Socket */}
              <ellipse
                cx="215"
                cy="200"
                rx="25"
                ry="27"
                fill="url(#eyeSocketGrad)"
                stroke="#8b5266"
                strokeWidth="2"
              />
              {/* Right Pupil (Winks on Click or Follows Pointer) */}
              {isWinking ? (
                <path
                  d="M 195,200 Q 215,220 235,200"
                  stroke="#fbbf24"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                <g transform={`translate(${215 + eyeOffset.x}, ${200 + eyeOffset.y})`}>
                  <ellipse cx="0" cy="0" rx="14" ry="14" fill="url(#pupilGlowGrad)" />
                  <ellipse cx="-4" cy="-4" rx="5" ry="5" fill="#ffffff" />
                  <text x="0" y="3" textAnchor="middle" fontSize="11" fill="#78350f" fontWeight="bold">✦</text>
                </g>
              )}
            </g>
          )}

          {/* ============================================================== */}
          {/* 4. Cute Inverted Heart Skull Nose */}
          {/* ============================================================== */}
          <path
            d="M 170,225 C 167,218 160,217 158,221 C 156,225 160,229 170,235 C 180,229 184,225 182,221 C 180,217 173,218 170,225 Z"
            fill="#4a2835"
          />

          {/* ============================================================== */}
          {/* 5. Sleepy Sweet Smile */}
          {/* ============================================================== */}
          <path
            d={isNight ? 'M 152,246 Q 170,256 188,246' : 'M 148,245 Q 170,260 192,245'}
            stroke="#4a2835"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Soft teeth stitch marks on smile */}
          <path
            d="M 162,248 L 162,253 M 170,250 L 170,255 M 178,248 L 178,253"
            stroke="#4a2835"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* ============================================================== */}
          {/* 6. Fluffy Cloud Onesie Neck Collar */}
          {/* ============================================================== */}
          <g transform="translate(90, 275)">
            <ellipse cx="25" cy="18" rx="28" ry="18" fill="#ffffff" stroke="#ecd3c1" strokeWidth="2.5" />
            <ellipse cx="80" cy="22" rx="36" ry="20" fill="#ffffff" stroke="#ecd3c1" strokeWidth="2.5" />
            <ellipse cx="135" cy="18" rx="28" ry="18" fill="#ffffff" stroke="#ecd3c1" strokeWidth="2.5" />
            <circle cx="80" cy="22" r="6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Bottom Mood Indicator Badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-white/95 dark:bg-[#2e1c33]/95 border border-[#ecd3c1] dark:border-[#523359] shadow-sm flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-xs">{isNight ? '🌙' : '👀'}</span>
          <span
            className="text-[11px] font-bold text-[#5a382e] dark:text-[#f8eef2]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {isNight ? 'Sleeping Peacefully (Night Mode)' : 'Eyes Tracking Cursor!'}
          </span>
        </div>
      </div>
    </div>
  );
}
