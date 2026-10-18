import React, { useState } from 'react';
import { Pip3DViewer } from './Artwork/Pip3DViewer';

export function MeetPip() {
  const [is3DMode, setIs3DMode] = useState(true);
  return (
    <section id="meet-pip" className="py-20 md:py-28 relative overflow-hidden bg-[#fffaf5] border-b border-[#ebd7c8]">
      {/* Background ambient sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <span className="absolute top-12 left-[8%] text-amber-300/60 text-xl">✦</span>
        <span className="absolute top-24 right-[12%] text-pink-300/50 text-2xl">★</span>
        <span className="absolute bottom-16 left-[15%] text-indigo-200/50 text-xl">★</span>
        <span className="absolute bottom-24 right-[10%] text-amber-200/60 text-base">✦</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div
            className="inline-flex items-center gap-2 mb-3 text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#a34063]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <span>✦</span>
            <span>ABOUT OUR LITTLE CREATOR</span>
            <span>✦</span>
          </div>

          <h2
            className="font-editorial text-4xl sm:text-5xl font-black text-[#38201a] tracking-tight mb-4"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Meet the Little Dream Engineer 🐾
          </h2>
        </div>

        {/* 3-Column Core Showcase: Left Bio & Quote, Center Glowing Artwork, Right Quick Facts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-16">
          
          {/* Left Column: Story Bio & Quote Callout */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
            <p
              className="text-[#38201a] text-base sm:text-[1.12rem] font-semibold leading-[1.75]"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              Pip is a cute baby with a smooth, round skull face, huge glowing eyes, and a cozy nightcap with stars. Pip designs dreams, lullabies, nightlights, and bedtime stories for the whole neighborhood.
            </p>

            {/* Quote Callout Box */}
            <div
              className="p-6 rounded-2xl border-2 border-[#ecd3c1] shadow-sm relative overflow-hidden"
              style={{
                backgroundColor: 'rgba(255, 245, 237, 0.95)',
              }}
            >
              <div className="text-[#a34063] text-xl sm:text-2xl font-serif italic mb-2 leading-relaxed" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                “I build the dreams you fall asleep inside.”
              </div>
              <div className="text-[#5a382e] text-sm font-bold text-right" style={{ fontFamily: "'Outfit', sans-serif" }}>
                — Pip
              </div>
            </div>
          </div>

          {/* Center Column: Pip Character 3D Interactive Viewer */}
          <div className="lg:col-span-4 flex items-center justify-center relative">
            {/* Soft celestial glowing backdrop */}
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-60 scale-95"
              style={{
                background: 'radial-gradient(circle, #fde68a 0%, #f472b6 40%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            {/* Interactive 3D Pip Model Viewer */}
            <Pip3DViewer
              fallbackImage="artwork/pip_avatar_full_v2.png"
              is3DMode={is3DMode}
              onToggleViewMode={() => setIs3DMode(!is3DMode)}
            />
          </div>

          {/* Right Column: Quick Facts Card */}
          <div className="lg:col-span-4">
            <div
              className="rounded-3xl border-2 border-[#ecd3c1] p-6 sm:p-7 shadow-sm"
              style={{
                backgroundColor: 'rgba(255, 248, 241, 0.96)',
              }}
            >
              <div className="flex items-center gap-2 mb-6 justify-center">
                <span className="text-[#e5a93c] text-base">⭐</span>
                <h3
                  className="font-editorial text-2xl font-black text-[#38201a]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Quick Facts
                </h3>
                <span className="text-[#e5a93c] text-base">⭐</span>
              </div>

              <div className="space-y-4 text-sm" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                {/* Fact 1: Name */}
                <div className="flex items-start gap-3.5 pb-3 border-b border-[#ecd3c1]/60">
                  <div className="w-8 h-8 rounded-full bg-[#fde68a]/50 flex items-center justify-center text-base flex-shrink-0">
                    👤
                  </div>
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-[#8b6154] block">Name</span>
                    <span className="font-bold text-[#38201a] text-base">Pip</span>
                  </div>
                </div>

                {/* Fact 2: Species */}
                <div className="flex items-start gap-3.5 pb-3 border-b border-[#ecd3c1]/60">
                  <div className="w-8 h-8 rounded-full bg-[#fbcfe8]/50 flex items-center justify-center text-base flex-shrink-0">
                    💀
                  </div>
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-[#8b6154] block">Species</span>
                    <span className="font-bold text-[#38201a] text-base">Skull Baby</span>
                  </div>
                </div>

                {/* Fact 3: Profession */}
                <div className="flex items-start gap-3.5 pb-3 border-b border-[#ecd3c1]/60">
                  <div className="w-8 h-8 rounded-full bg-[#fed7aa]/50 flex items-center justify-center text-base flex-shrink-0">
                    🎒
                  </div>
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-[#8b6154] block">Profession</span>
                    <span className="font-bold text-[#38201a] text-sm leading-snug">Junior Dream Engineer at Midnight Nursery</span>
                  </div>
                </div>

                {/* Fact 4: Personality */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#fbcfe8]/60 flex items-center justify-center text-base flex-shrink-0">
                    💖
                  </div>
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-[#8b6154] block">Personality</span>
                    <span className="font-bold text-[#38201a] text-sm leading-snug">Sleepy, curious, gentle, imaginative, kind</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 4 Feature / Trait Cards (Exact match to whole.png Section 2 bottom row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Personality */}
          <div
            className="p-5 rounded-2xl border-2 border-[#ecd3c1] shadow-xs hover:border-[#a34063] transition-all flex flex-col justify-between"
            style={{ backgroundColor: 'rgba(255, 248, 241, 0.94)' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💖</span>
                <h4
                  className="font-bold text-base text-[#38201a]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Personality
                </h4>
              </div>
              <p
                className="text-xs sm:text-sm font-semibold text-[#5a382e] leading-relaxed"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                Curious, sleepy, clumsy, easily delighted.
              </p>
            </div>
          </div>

          {/* Card 2: Favorite Things */}
          <div
            className="p-5 rounded-2xl border-2 border-[#ecd3c1] shadow-xs hover:border-[#a34063] transition-all flex flex-col justify-between"
            style={{ backgroundColor: 'rgba(255, 248, 241, 0.94)' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⭐</span>
                <h4
                  className="font-bold text-base text-[#38201a]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Favorite Things
                </h4>
              </div>
              <div className="flex items-center gap-2 text-base mb-1.5 select-none">
                <span>📚</span>
                <span>🌙</span>
                <span>🍯</span>
                <span>🎵</span>
              </div>
              <p
                className="text-xs sm:text-sm font-semibold text-[#5a382e] leading-relaxed"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                Bedtime stories, star snacks, glowing lights, soft melodies.
              </p>
            </div>
          </div>

          {/* Card 3: Where Pip Lives */}
          <div
            className="p-5 rounded-2xl border-2 border-[#ecd3c1] shadow-xs hover:border-[#a34063] transition-all flex flex-col justify-between"
            style={{ backgroundColor: 'rgba(255, 248, 241, 0.94)' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🏠</span>
                <h4
                  className="font-bold text-base text-[#38201a]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Where Pip Lives
                </h4>
              </div>
              <div className="rounded-xl overflow-hidden mb-2.5 h-12 border border-[#ecd3c1]">
                <img
                  src="artwork/pip_where_he_lives_v2.png"
                  alt="The Midnight Nursery village in the clouds"
                  className="w-full h-full object-cover"
                  loading="eager" decoding="async"
                />
              </div>
              <p
                className="text-xs sm:text-sm font-semibold text-[#5a382e] leading-relaxed"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                The Midnight Nursery: A dreamy neighborhood in the clouds.
              </p>
            </div>
          </div>

          {/* Card 4: Pip's Tools */}
          <div
            className="p-5 rounded-2xl border-2 border-[#ecd3c1] shadow-xs hover:border-[#a34063] transition-all flex flex-col justify-between"
            style={{ backgroundColor: 'rgba(255, 248, 241, 0.94)' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎵</span>
                <h4
                  className="font-bold text-base text-[#38201a]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Pip's Tools
                </h4>
              </div>
              <div className="rounded-xl overflow-hidden mb-2.5 h-12 border border-[#ecd3c1]">
                <img
                  src="artwork/pip_tools_v2.png"
                  alt="Music box, dream lantern, and tiny treasures"
                  className="w-full h-full object-cover"
                  loading="eager" decoding="async"
                />
              </div>
              <p
                className="text-xs sm:text-sm font-semibold text-[#5a382e] leading-relaxed"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                Music box, dream lantern, story books, cloud cart and tiny treasures.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
