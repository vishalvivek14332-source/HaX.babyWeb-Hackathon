import React, { useState } from 'react';
import { LullabyState } from '../../types';
import { musicBox } from '../../utils/audio';

interface CreationsSectionProps {
  lullabyState: LullabyState;
  onToggleLullaby: () => void;
}

export function CreationsSection({ lullabyState, onToggleLullaby }: CreationsSectionProps) {
  // Interactive modal states
  const [activeModal, setActiveModal] = useState<'nightlight' | 'map' | 'toys' | null>(null);
  const [nightlightGlow, setNightlightGlow] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [toyFeedback, setToyFeedback] = useState<string | null>(null);

  const routes = [
    { name: 'Observatory Tower', desc: 'Gathering fresh starlight from the night sky' },
    { name: 'Cloudberry Lane', desc: 'Delivering soft sleep-clouds to sleepy pups' },
    { name: 'Moonlit Chimneys', desc: 'Leaving quiet lullaby tunes on bedroom windowsills' },
    { name: 'Cradle Hollow', desc: 'Tucking in the littlest dreamers with starlight blankets' },
  ];

  const handlePlayToy = (toy: string) => {
    if (toy === 'rattle') {
      musicBox.playNamedNote('B5', 0.8);
      setTimeout(() => musicBox.playNamedNote('E6', 0.8), 120);
      setToyFeedback('Tinkle-clink! The moon rattle giggles ✨');
    } else {
      musicBox.playNamedNote('C5', 0.6);
      setTimeout(() => musicBox.playNamedNote('G4', 0.6), 100);
      setToyFeedback('Tap-tap! The wooden dream blocks nestled safely 🌙');
    }
    setTimeout(() => setToyFeedback(null), 2500);
  };

  return (
    <section id="creations" className="py-20 md:py-28 relative bg-[#fff8f1] border-b border-[#ebd7c8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header (Exact match to whole.png Section 3) */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-[#e5a93c] text-xl">⭐</span>
            <h2
              className="font-editorial text-4xl sm:text-5xl font-black text-[#38201a] tracking-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Little Things, Lovely Dreams
            </h2>
            <span className="text-[#e5a93c] text-xl">⭐</span>
          </div>
          <p
            className="text-base sm:text-lg text-[#5a382e] font-semibold leading-relaxed"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Every little creation has one job: to make bedtime feel a little more magical.
          </p>
        </div>

        {/* 4 Creations Cards (4 Columns on Desktop, 2x2 Tablet, 1 on Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* ============================================================== */}
          {/* Card 01: The Lullaby Lab */}
          {/* ============================================================== */}
          <div
            className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#a34063] transition-all flex flex-col justify-between group"
            style={{ backgroundColor: 'rgba(255, 252, 248, 0.98)' }}
          >
            <div>
              {/* Artwork Container */}
              <div className="w-full h-48 overflow-hidden bg-[#fff0e5] relative">
                <img
                  src="artwork/creation_01_lullaby_lab_v2.png"
                  alt="The Lullaby Lab music box with glowing crescent moon"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager" decoding="async"
                />
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-[#fce7ed] text-[#a34063] mb-2.5">
                  01
                </div>
                <h3
                  className="font-editorial text-xl font-black text-[#38201a] mb-2"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  The Lullaby Lab
                </h3>
                <p
                  className="text-xs sm:text-sm text-[#5a382e] font-semibold leading-relaxed"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  Little melodies for sleepy minds. Pip composes gentle lullabies using a magical music box.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={onToggleLullaby}
                aria-label={lullabyState.isPlaying ? 'Pause lullaby' : 'Play lullaby'}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-white font-bold text-xs sm:text-sm transition-all duration-300 hover:opacity-90 active:scale-98 cursor-pointer shadow-sm"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  backgroundColor: '#a34063',
                  boxShadow: '0 4px 14px rgba(163, 64, 99, 0.25)',
                }}
              >
                <span>{lullabyState.isPlaying ? '❚❚' : '▶'}</span>
                <span>{lullabyState.isPlaying ? 'Pause Lullaby' : 'Play a Lullaby'}</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* Card 02: Nightlight Collection */}
          {/* ============================================================== */}
          <div
            className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#a34063] transition-all flex flex-col justify-between group"
            style={{ backgroundColor: 'rgba(255, 252, 248, 0.98)' }}
          >
            <div>
              {/* Artwork Container */}
              <div className="w-full h-48 overflow-hidden bg-[#fff0e5] relative">
                <img
                  src="artwork/creation_02_nightlight_v2.png"
                  alt="Nightlight Collection with glowing moon and star lantern"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager" decoding="async"
                />
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-[#fce7ed] text-[#a34063] mb-2.5">
                  02
                </div>
                <h3
                  className="font-editorial text-xl font-black text-[#38201a] mb-2"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Nightlight Collection
                </h3>
                <p
                  className="text-xs sm:text-sm text-[#5a382e] font-semibold leading-relaxed"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  A little light for every dream. Explore Pip's collection of moon jars, star lanterns, and cloud lights.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setActiveModal('nightlight')}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-white font-bold text-xs sm:text-sm transition-all duration-300 hover:opacity-90 active:scale-98 cursor-pointer shadow-sm"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  backgroundColor: '#a34063',
                  boxShadow: '0 4px 14px rgba(163, 64, 99, 0.25)',
                }}
              >
                <span>🔔</span>
                <span>Explore the Collection</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* Card 03: Dream Delivery Routes */}
          {/* ============================================================== */}
          <div
            className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#a34063] transition-all flex flex-col justify-between group"
            style={{ backgroundColor: 'rgba(255, 252, 248, 0.98)' }}
          >
            <div>
              {/* Artwork Container */}
              <div className="w-full h-48 overflow-hidden bg-[#fff0e5] relative">
                <img
                  src="artwork/creation_03_delivery_routes_v2.png"
                  alt="Dream Delivery Routes through starry Midnight Nursery"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager" decoding="async"
                />
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-[#fce7ed] text-[#a34063] mb-2.5">
                  03
                </div>
                <h3
                  className="font-editorial text-xl font-black text-[#38201a] mb-2"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Dream Delivery Routes
                </h3>
                <p
                  className="text-xs sm:text-sm text-[#5a382e] font-semibold leading-relaxed"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  Every rooftop deserves a little magic. Follow Pip across the Midnight Nursery as dreams travel to sleeping friends.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setActiveModal('map')}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-white font-bold text-xs sm:text-sm transition-all duration-300 hover:opacity-90 active:scale-98 cursor-pointer shadow-sm"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  backgroundColor: '#a34063',
                  boxShadow: '0 4px 14px rgba(163, 64, 99, 0.25)',
                }}
              >
                <span>📍</span>
                <span>Explore the Map</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* Card 04: Rattle & Block Toys */}
          {/* ============================================================== */}
          <div
            className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#a34063] transition-all flex flex-col justify-between group"
            style={{ backgroundColor: 'rgba(255, 252, 248, 0.98)' }}
          >
            <div>
              {/* Artwork Container */}
              <div className="w-full h-48 overflow-hidden bg-[#fff0e5] relative">
                <img
                  src="artwork/creation_04_rattle_blocks_v2.png"
                  alt="Pastel dream blocks and star rattle toys"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager" decoding="async"
                />
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-[#fce7ed] text-[#a34063] mb-2.5">
                  04
                </div>
                <h3
                  className="font-editorial text-xl font-black text-[#38201a] mb-2"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Rattle & Block Toys
                </h3>
                <p
                  className="text-xs sm:text-sm text-[#5a382e] font-semibold leading-relaxed"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  Tiny toys for big imaginations. Click, stack, and play with Pip's magical building blocks and rattles.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setActiveModal('toys')}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-white font-bold text-xs sm:text-sm transition-all duration-300 hover:opacity-90 active:scale-98 cursor-pointer shadow-sm"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  backgroundColor: '#a34063',
                  boxShadow: '0 4px 14px rgba(163, 64, 99, 0.25)',
                }}
              >
                <span>🎁</span>
                <span>Play with the Toys</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* Interactive Modal 02: Nightlight Collection Explorer */}
      {/* ============================================================== */}
      {activeModal === 'nightlight' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-[#fff8f1] border-2 border-[#ecd3c1] shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fce7ed] text-[#a34063] font-bold flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <div className="text-4xl mb-3">🌙</div>
            <h3 className="font-editorial text-2xl font-black text-[#38201a] mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Nightlight Starlight Chamber
            </h3>
            <p className="text-sm text-[#5a382e] font-semibold mb-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              Pip keeps gentle star lanterns that warm chilly bedrooms and keep sleepy fears away.
            </p>
            <div
              className={`p-8 rounded-2xl border-2 transition-all duration-500 mb-6 flex flex-col items-center justify-center ${
                nightlightGlow ? 'bg-amber-100/70 border-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.4)]' : 'bg-slate-900/10 border-slate-300'
              }`}
            >
              <span className={`text-6xl transition-transform duration-300 ${nightlightGlow ? 'scale-110' : 'scale-95 opacity-50'}`}>
                {nightlightGlow ? '✨' : '💤'}
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#8b6154] mt-3">
                {nightlightGlow ? 'Starlight Lantern Glowing Warmly' : 'Lantern Sleeping Peacefully'}
              </span>
            </div>
            <button
              onClick={() => setNightlightGlow(!nightlightGlow)}
              className="px-6 py-2.5 rounded-full font-bold text-white bg-[#a34063] hover:bg-[#8b3452] cursor-pointer shadow-md text-sm"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {nightlightGlow ? 'Dim Lantern' : 'Awaken Star Light'}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Interactive Modal 03: Dream Delivery Routes Map */}
      {/* ============================================================== */}
      {activeModal === 'map' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-[#fff8f1] border-2 border-[#ecd3c1] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fce7ed] text-[#a34063] font-bold flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <span className="text-3xl">📍</span>
              <h3 className="font-editorial text-2xl font-black text-[#38201a] mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
                Midnight Delivery Route Map
              </h3>
              <p className="text-xs text-[#5a382e] font-semibold mt-1">Tap a waypoint to guide Pip's cloud cart!</p>
            </div>
            <div className="space-y-3 mb-6">
              {routes.map((r, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedRoute(i)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                    selectedRoute === i ? 'bg-[#fce7ed] border-[#a34063] shadow-xs' : 'bg-white border-[#ecd3c1]'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedRoute === i ? 'bg-[#a34063] text-white' : 'bg-[#fff0e5] text-[#38201a]'
                  }`}>
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#38201a]">{r.name}</h4>
                    <p className="text-xs text-[#5a382e]">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Interactive Modal 04: Rattle & Toys Playroom */}
      {/* ============================================================== */}
      {activeModal === 'toys' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-[#fff8f1] border-2 border-[#ecd3c1] shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fce7ed] text-[#a34063] font-bold flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <div className="text-4xl mb-2">🎁</div>
            <h3 className="font-editorial text-2xl font-black text-[#38201a] mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Pip's Bedtime Toybox
            </h3>
            <p className="text-sm text-[#5a382e] font-semibold mb-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              Tap each toy to hear sweet musical chimes!
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handlePlayToy('rattle')}
                className="p-5 rounded-2xl bg-white border-2 border-[#ecd3c1] hover:border-[#a34063] hover:scale-105 active:scale-95 transition-all cursor-pointer flex flex-col items-center gap-2 shadow-xs"
              >
                <span className="text-4xl">🌟</span>
                <span className="font-bold text-sm text-[#38201a]">Star Rattle</span>
                <span className="text-xs text-[#8b6154]">Shake for chimes</span>
              </button>
              <button
                onClick={() => handlePlayToy('blocks')}
                className="p-5 rounded-2xl bg-white border-2 border-[#ecd3c1] hover:border-[#a34063] hover:scale-105 active:scale-95 transition-all cursor-pointer flex flex-col items-center gap-2 shadow-xs"
              >
                <span className="text-4xl">🧱</span>
                <span className="font-bold text-sm text-[#38201a]">Dream Blocks</span>
                <span className="text-xs text-[#8b6154]">Tap to stack</span>
              </button>
            </div>
            {toyFeedback && (
              <div className="p-3 rounded-xl bg-[#fce7ed] text-[#a34063] text-sm font-bold animate-fade-in">
                {toyFeedback}
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
