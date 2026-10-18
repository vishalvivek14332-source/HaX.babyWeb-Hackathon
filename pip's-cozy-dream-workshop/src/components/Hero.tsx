import React from 'react';
import { PipAnimationCanvas } from './Artwork/PipAnimationCanvas';
import { LullabyState, DreamMode } from '../types';

interface HeroProps {
  lullabyState: LullabyState;
  onToggleLullaby: () => void;
  onEasterEggTrigger: () => void;
  dreamMode?: DreamMode;
}

export function Hero({
  lullabyState,
  onToggleLullaby,
  onEasterEggTrigger,
  dreamMode = 'day',
}: HeroProps) {
  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector('#creations');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-[720px] max-h-[960px] lg:h-[920px] flex items-center border-b border-[var(--border-subtle)] bg-[#0b0d18]"
    >
      {/* 1. Hanging Star Decoration (Top Right as in heronew.png) */}
      <div className="hanging-star" aria-hidden="true">
        <div className="star-string" />
        <div className="star-charm">★</div>
      </div>

      {/* 2. Full Section 300-Frame Continuous Looping Animation */}
      <PipAnimationCanvas fullSection={true} isPlaying={true} />

      {/* 3. Hero Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Dream Cloud Container & Hero Copy */}
          <div className="lg:col-span-7 relative max-w-[580px]">
            {/* Organic Billowing Cumulus Dream Cloud Backdrop */}
            <div
              className="absolute -inset-x-8 -inset-y-8 sm:-inset-x-12 sm:-inset-y-10 -z-10 pointer-events-none select-none flex items-center justify-center"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 720 540"
                className="w-full h-full object-contain filter drop-shadow-[0_16px_36px_rgba(180,90,120,0.20)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="dreamCloudGrad" x1="15%" y1="10%" x2="85%" y2="90%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
                    <stop offset="35%" stopColor="#fff8f2" stopOpacity="0.94" />
                    <stop offset="70%" stopColor="#feeedf" stopOpacity="0.92" />
                    <stop offset="100%" stopColor="#f8d6de" stopOpacity="0.88" />
                  </linearGradient>
                  <filter id="softCloudRim" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blurred" />
                    <feMerge>
                      <feMergeNode in="blurred" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Organic cumulus billow shape comfortably cradling all copy and buttons */}
                <path
                  d="M130,220 
                     C110,150 160,85 240,85 
                     C280,45 350,35 415,65 
                     C475,35 550,60 585,115 
                     C645,130 685,185 675,250 
                     C705,310 680,385 620,425 
                     C595,480 525,525 450,525 
                     C390,535 305,530 250,505 
                     C195,525 125,505 95,450 
                     C55,410 45,330 80,270 
                     C65,245 85,225 130,220 Z"
                  fill="url(#dreamCloudGrad)"
                  stroke="#fed4dc"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  filter="url(#softCloudRim)"
                />
              </svg>
            </div>

            {/* Inner Content */}
            <div className="flex flex-col items-start text-left px-2 sm:px-4 py-2">
              {/* Eyebrow & Character Mood Expression Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-3 select-none">
                <div
                  className="flex items-center gap-2 text-xs sm:text-[13px] font-extrabold tracking-[0.14em] uppercase text-[#38201a]"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <span className="text-[#a34063] text-sm">✦</span>
                  <span>JUNIOR DREAM ENGINEER</span>
                  <span className="text-sm">🐾</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                    dreamMode === 'night'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <span>{dreamMode === 'night' ? '🌙 Sleepy (Zzz)' : '⭐ Wide Awake'}</span>
                </span>
              </div>

              {/* Headline: Good Dreams Start Small. with hand-drawn curl flourish */}
              <h1
                className="font-editorial text-5xl sm:text-6xl md:text-[4.2rem] lg:text-[4.65rem] font-black leading-[1.04] tracking-[-0.025em] text-[#341f1a] mb-5 select-none"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                }}
              >
                <span className="block">Good Dreams</span>
                <span className="inline-flex items-baseline flex-wrap">
                  Start <span className="text-[#a34063] ml-2.5 sm:ml-3.5">Small.</span>
                  <span
                    className="relative inline-flex items-center ml-2.5 -translate-y-1 sm:-translate-y-2 select-none"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-14 sm:w-16 h-7 sm:h-8"
                      viewBox="0 0 68 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 14C12 28 32 30 46 16C54 8 62 10 65 14"
                        stroke="#a34063"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute -right-2.5 -top-2.5 text-[#a34063] text-xl sm:text-2xl">
                      ★
                    </span>
                  </span>
                </span>
              </h1>

              {/* Subtitle Description */}
              <p
                className="text-base sm:text-lg md:text-[1.12rem] text-[#38201a] font-semibold leading-[1.65] max-w-[480px] mb-8"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                Meet Pip, the sleepy skull baby who designs lullabies, nightlights, and bedtime stories
                for the whole neighborhood.
              </p>

              {/* CTA Buttons Group */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Primary CTA: Explore Pip's World */}
                <a
                  href="#creations"
                  onClick={handleExploreClick}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-bold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 cursor-pointer no-underline"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    backgroundColor: '#9d4562',
                    border: '2px solid #b8627e',
                    boxShadow:
                      '0 8px 24px rgba(157, 69, 98, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <span className="text-[#e5a93c] text-base">★</span>
                  <span>Explore Pip's World</span>
                  <span className="text-lg">→</span>
                </a>

                {/* Secondary CTA: Play a Lullaby */}
                <button
                  type="button"
                  onClick={onToggleLullaby}
                  aria-label={
                    lullabyState.isPlaying ? 'Pause soothing lullaby' : 'Play soothing lullaby'
                  }
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full font-bold text-base text-[#38201a] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a34063] cursor-pointer"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    backgroundColor: '#fff8f2',
                    border: '2px solid #ecc4cb',
                    boxShadow: '0 6px 18px rgba(70, 35, 25, 0.08), inset 0 1px 2px #ffffff',
                  }}
                >
                  <span className="w-7 h-7 rounded-full bg-[#9d4562] flex items-center justify-center text-white text-xs pl-0.5 shadow-sm">
                    {lullabyState.isPlaying ? '❚❚' : '▶'}
                  </span>
                  <span>{lullabyState.isPlaying ? 'Pause Lullaby' : 'Play a Lullaby'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Kept completely clean so Pip on the clouds is unobstructed */}
          <div className="lg:col-span-5 hidden lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
