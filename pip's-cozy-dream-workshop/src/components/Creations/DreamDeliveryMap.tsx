import React, { useState, useEffect } from 'react';
import { musicBox } from '../../utils/audio';

interface Waypoint {
  id: string;
  name: string;
  desc: string;
  x: number;
  y: number;
  icon: string;
}

const WAYPOINTS: Waypoint[] = [
  {
    id: 'tower',
    name: 'Observatory Tower',
    desc: 'Gathering fresh starlight and moon dust from the night sky',
    x: 60,
    y: 80,
    icon: '🔭',
  },
  {
    id: 'lane',
    name: 'Cloudberry Lane',
    desc: 'Delivering soft sleep-clouds to sleepy village pups',
    x: 230,
    y: 130,
    icon: '☁️',
  },
  {
    id: 'chimneys',
    name: 'Moonlit Chimneys',
    desc: 'Leaving quiet lullaby tunes on bedroom windowsills',
    x: 390,
    y: 90,
    icon: '🏡',
  },
  {
    id: 'hollow',
    name: 'Cradle Hollow',
    desc: 'Tucking in the littlest dreamers with starlight blankets',
    x: 520,
    y: 190,
    icon: '🌙',
  },
];

export function DreamDeliveryMap() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // SVG Path Definition
  const flightPathD = "M 60,80 C 130,20 170,170 230,130 C 290,90 330,40 390,90 C 450,140 470,220 520,190";

  // Auto-advance cart step periodically if playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % WAYPOINTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSelectWaypoint = (index: number) => {
    setActiveStep(index);
    setIsPlaying(false);
    musicBox.playNamedNote('C5', 0.5);
    setTimeout(() => musicBox.playNamedNote('E5', 0.6), 120);
  };

  const currentWp = WAYPOINTS[activeStep];

  return (
    <div className="w-full rounded-3xl bg-[#fff8f1] dark:bg-[#231526] border-2 border-[#ecd3c1] dark:border-[#523359] p-5 sm:p-7 shadow-lg flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#a34063] uppercase tracking-wider">
            <span>✦</span>
            <span>SVG Animated Flight Route</span>
          </div>
          <h3 className="font-editorial text-xl sm:text-2xl font-black text-[#38201a] dark:text-[#f8eef2]" style={{ fontFamily: "'Fraunces', serif" }}>
            Midnight Delivery Routes
          </h3>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#fce7ed] text-[#a34063] hover:bg-[#fbcfe8] transition-colors cursor-pointer flex items-center gap-1"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <span>{isPlaying ? '⏸ Pause' : '▶ Auto-Tour'}</span>
        </button>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full aspect-[600/260] rounded-2xl bg-gradient-to-b from-[#16122c] via-[#241738] to-[#120d24] overflow-hidden border border-[#523359] shadow-inner">
        {/* Ambient star constellations in map background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <span className="absolute top-4 left-[12%] text-amber-200 text-xs animate-pulse">✦</span>
          <span className="absolute top-10 right-[25%] text-pink-300 text-xs">★</span>
          <span className="absolute bottom-6 left-[35%] text-indigo-200 text-xs animate-pulse">✦</span>
          <span className="absolute top-16 right-[10%] text-amber-300 text-sm">🌙</span>
        </div>

        <svg viewBox="0 0 600 260" className="w-full h-full">
          <defs>
            {/* Glowing Golden Flight Trail */}
            <linearGradient id="flightPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#f472b6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fde047" stopOpacity="0.9" />
            </linearGradient>

            {/* Pulsing Star Glow Filter */}
            <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dotted Flight Path Base */}
          <path
            d={flightPathD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Glowing Animated Flight Path */}
          <path
            d={flightPathD}
            fill="none"
            stroke="url(#flightPathGrad)"
            strokeWidth="3.5"
            strokeDasharray="12 8"
            className="animate-pulse"
          />

          {/* Waypoint Nodes */}
          {WAYPOINTS.map((wp, i) => {
            const isSelected = activeStep === i;
            return (
              <g
                key={wp.id}
                onClick={() => handleSelectWaypoint(i)}
                className="cursor-pointer group"
                transform={`translate(${wp.x}, ${wp.y})`}
              >
                {/* Outer Target Ring */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 18 : 12}
                  fill={isSelected ? 'rgba(244, 114, 182, 0.35)' : 'rgba(255, 255, 255, 0.1)'}
                  stroke={isSelected ? '#f472b6' : 'rgba(255, 255, 255, 0.3)'}
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all duration-300"
                />

                {/* Inner Core */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 8 : 6}
                  fill={isSelected ? '#fbbf24' : '#e2e8f0'}
                  filter={isSelected ? 'url(#starGlow)' : undefined}
                />

                {/* Waypoint Number Label */}
                <text
                  x="0"
                  y="28"
                  textAnchor="middle"
                  fontSize="10"
                  fill={isSelected ? '#fde047' : '#94a3b8'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontFamily="'Outfit', sans-serif"
                >
                  {wp.name}
                </text>
              </g>
            );
          })}

          {/* Pip's Animated Cloud Cart Travelling to Current Waypoint */}
          <g
            className="transition-all duration-1000 ease-in-out"
            transform={`translate(${currentWp.x}, ${currentWp.y - 14})`}
          >
            {/* Cloud Puff Cart Base */}
            <ellipse cx="0" cy="4" rx="20" ry="10" fill="#ffffff" filter="url(#starGlow)" />
            <circle cx="-9" cy="0" r="8" fill="#ffffff" />
            <circle cx="8" cy="1" r="7" fill="#ffffff" />
            {/* Star Lantern in Cart */}
            <circle cx="0" cy="-6" r="5" fill="#fde047" />
            <text x="0" y="-3" textAnchor="middle" fontSize="7" fill="#78350f" fontWeight="bold">★</text>
            {/* Pip's Nightcap */}
            <path d="M -4,-2 Q 0,-12 6,-8" stroke="#f472b6" strokeWidth="2.5" fill="none" />
            {/* Pulsing Stardust Aura */}
            <circle cx="0" cy="0" r="24" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4" className="animate-ping" />
          </g>
        </svg>
      </div>

      {/* Waypoints Selection Pills Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
        {WAYPOINTS.map((wp, i) => (
          <button
            key={wp.id}
            onClick={() => handleSelectWaypoint(i)}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeStep === i
                ? 'bg-[#fce7ed] dark:bg-[#431d3e] border-[#a34063] shadow-xs'
                : 'bg-white/80 dark:bg-[#2e1c33]/80 border-[#ecd3c1] dark:border-[#523359] hover:bg-[#fff0e5]'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{wp.icon}</span>
              <span className="text-xs font-bold text-[#38201a] dark:text-[#f8eef2] leading-tight">
                {wp.name}
              </span>
            </div>
            <span className="text-[10px] text-[#8b6154] dark:text-[#d4b0be] block leading-tight">
              Stop {i + 1} of 4
            </span>
          </button>
        ))}
      </div>

      {/* Active Stop Description Banner */}
      <div className="mt-4 p-3.5 rounded-2xl bg-[#fff0e5] dark:bg-[#2b1830] border border-[#ecd3c1] dark:border-[#523359] flex items-center gap-3">
        <span className="text-2xl">{currentWp.icon}</span>
        <div className="flex-1 min-w-0">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#a34063] block">
            Current Delivery Mission
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[#38201a] dark:text-[#f8eef2]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            {currentWp.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
