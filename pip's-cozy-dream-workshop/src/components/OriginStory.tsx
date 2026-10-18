import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, LayoutGrid } from 'lucide-react';
import { musicBox } from '../utils/audio';

export function OriginStory() {
  const [viewMode, setViewMode] = useState<'cards' | 'book'>('cards');
  const [currentPage, setCurrentPage] = useState(0);
  const [activeScrollStep, setActiveScrollStep] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    {
      step: 1,
      title: 'The Fallen Star',
      subtitle: 'A Midnight Miracle',
      image: 'artwork/story_01_fallen_star_v2.png',
      alt: 'A gentle glowing star falling near the Midnight Nursery',
      text: 'One quiet night, a little star falls near the Midnight Nursery. Pip discovers it and notices that its glow changes whenever a sleepy dream passes nearby.',
      quote: '"Even the smallest star deserves a soft place to rest."',
    },
    {
      step: 2,
      title: 'The First Lullaby',
      subtitle: 'The Workshop Awakes',
      image: 'artwork/story_02_first_lullaby_v2.png',
      alt: 'Pip building the first carved music box to help the star glow',
      text: 'Pip builds a tiny music box to help the tired star glow again. A gentle melody emerges, and Pip discovers a new purpose: creating small comforts for sleepy dreamers.',
      quote: '"With one gentle chime, the darkness turns into lavender."',
    },
    {
      step: 3,
      title: 'The Dream Deliverer',
      subtitle: 'Wings Over the Rooftops',
      image: 'artwork/story_03_dream_deliverer_v2.png',
      alt: 'Pip with starlight lantern delivering dreams to rooftops',
      text: 'With a dream lantern and a heart full of hope, Pip begins preparing little dreams and delivering them through the night as a Junior Dream Engineer.',
      quote: '"Off we go into the starlight, tucking the world to sleep."',
    },
  ];

  // Scroll-driven story progression (Tier 1)
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far through the section the user has scrolled
      const progress = Math.min(Math.max((viewportHeight * 0.6 - rect.top) / (rect.height || 1), 0), 1);
      if (progress < 0.35) {
        setActiveScrollStep(0);
      } else if (progress < 0.7) {
        setActiveScrollStep(1);
      } else {
        setActiveScrollStep(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for interactive storybook (Tier 2)
  useEffect(() => {
    if (viewMode !== 'book') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentPage]);

  const handleNextPage = () => {
    if (currentPage < steps.length - 1 && !isFlipping) {
      setIsFlipping(true);
      musicBox.playNamedNote('G5', 0.4);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsFlipping(false);
      }, 250);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      musicBox.playNamedNote('E5', 0.4);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setIsFlipping(false);
      }, 250);
    }
  };

  // Touch swipe support for interactive storybook
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (diff > 50) {
      handleNextPage(); // Swiped left -> Next page
    } else if (diff < -50) {
      handlePrevPage(); // Swiped right -> Prev page
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      id="origin-story"
      ref={sectionRef}
      className="py-20 md:py-28 relative bg-[#fffaf5] border-b border-[#ebd7c8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[#e5a93c] text-xl">⭐</span>
            <h2
              className="font-editorial text-4xl sm:text-5xl font-black text-[#38201a] tracking-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              How a Little Star Found Its Way Home
            </h2>
            <span className="text-[#e5a93c] text-xl">⭐</span>
          </div>
          <p
            className="text-base sm:text-lg text-[#5a382e] font-semibold leading-relaxed mb-6"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Follow Pip's journey from a fallen star to the Midnight Nursery.
          </p>

          {/* View Mode Toggle: Interactive Storybook vs Journey Cards */}
          <div className="inline-flex p-1 rounded-full bg-[#fceddd] border border-[#ecd3c1] shadow-xs">
            <button
              onClick={() => {
                setViewMode('cards');
                musicBox.playNamedNote('C5', 0.4);
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#a34063] text-white shadow-xs'
                  : 'text-[#5a382e] hover:text-[#a34063]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Journey Cards</span>
            </button>
            <button
              onClick={() => {
                setViewMode('book');
                musicBox.playNamedNote('E5', 0.4);
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'book'
                  ? 'bg-[#a34063] text-white shadow-xs'
                  : 'text-[#5a382e] hover:text-[#a34063]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Storybook (Flip)</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODE 1: Journey Cards with Scroll Progression (Tier 1) */}
        {/* ============================================================== */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Step 1 Card */}
            <div className="md:col-span-3 lg:col-span-3">
              <div
                className={`rounded-3xl border-2 transition-all duration-500 overflow-hidden bg-white shadow-xs ${
                  activeScrollStep === 0
                    ? 'border-[#a34063] shadow-xl scale-102 ring-4 ring-[#fce7ed]'
                    : 'border-[#ecd3c1] opacity-90'
                }`}
              >
                <div className="h-44 sm:h-48 overflow-hidden bg-[#fff0e5]">
                  <img
                    src={steps[0].image}
                    alt={steps[0].alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="eager" decoding="async"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center transition-colors ${
                      activeScrollStep === 0 ? 'bg-[#a34063] text-white' : 'bg-[#fce7ed] text-[#a34063]'
                    }`}>
                      {steps[0].step}
                    </span>
                    <h3
                      className="font-editorial text-lg sm:text-xl font-black text-[#38201a]"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {steps[0].title} <span className="text-[#e5a93c] text-sm">✦</span>
                    </h3>
                  </div>
                  <p
                    className="text-xs sm:text-sm text-[#5a382e] font-semibold leading-relaxed"
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  >
                    {steps[0].text}
                  </p>
                </div>
              </div>
            </div>

            {/* Connecting Arrow 1 */}
            <div className="hidden md:flex md:col-span-1 justify-center items-center">
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-lg font-bold transition-all ${
                activeScrollStep >= 1 ? 'bg-[#a34063] text-white border-[#a34063] shadow-md scale-110' : 'bg-[#fce7ed] text-[#a34063] border-[#ecd3c1]'
              }`}>
                ➔
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="md:col-span-3 lg:col-span-4">
              <div
                className={`rounded-3xl border-2 transition-all duration-500 overflow-hidden bg-white shadow-xs ${
                  activeScrollStep === 1
                    ? 'border-[#a34063] shadow-xl scale-102 ring-4 ring-[#fce7ed]'
                    : 'border-[#ecd3c1] opacity-90'
                }`}
              >
                <div className="h-44 sm:h-48 overflow-hidden bg-[#fff0e5]">
                  <img
                    src={steps[1].image}
                    alt={steps[1].alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="eager" decoding="async"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center transition-colors ${
                      activeScrollStep === 1 ? 'bg-[#a34063] text-white' : 'bg-[#fce7ed] text-[#a34063]'
                    }`}>
                      {steps[1].step}
                    </span>
                    <h3
                      className="font-editorial text-lg sm:text-xl font-black text-[#38201a]"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {steps[1].title} <span className="text-[#e5a93c] text-sm">✦</span>
                    </h3>
                  </div>
                  <p
                    className="text-xs sm:text-sm text-[#5a382e] font-semibold leading-relaxed"
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  >
                    {steps[1].text}
                  </p>
                </div>
              </div>
            </div>

            {/* Connecting Arrow 2 */}
            <div className="hidden md:flex md:col-span-1 justify-center items-center">
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-lg font-bold transition-all ${
                activeScrollStep >= 2 ? 'bg-[#a34063] text-white border-[#a34063] shadow-md scale-110' : 'bg-[#fce7ed] text-[#a34063] border-[#ecd3c1]'
              }`}>
                ➔
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="md:col-span-4 lg:col-span-3">
              <div
                className={`rounded-3xl border-2 transition-all duration-500 overflow-hidden bg-white shadow-xs ${
                  activeScrollStep === 2
                    ? 'border-[#a34063] shadow-xl scale-102 ring-4 ring-[#fce7ed]'
                    : 'border-[#ecd3c1] opacity-90'
                }`}
              >
                <div className="h-44 sm:h-48 overflow-hidden bg-[#fff0e5]">
                  <img
                    src={steps[2].image}
                    alt={steps[2].alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="eager" decoding="async"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center transition-colors ${
                      activeScrollStep === 2 ? 'bg-[#a34063] text-white' : 'bg-[#fce7ed] text-[#a34063]'
                    }`}>
                      {steps[2].step}
                    </span>
                    <h3
                      className="font-editorial text-lg sm:text-xl font-black text-[#38201a]"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {steps[2].title} <span className="text-[#e5a93c] text-sm">✦</span>
                    </h3>
                  </div>
                  <p
                    className="text-xs sm:text-sm text-[#5a382e] font-semibold leading-relaxed"
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  >
                    {steps[2].text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE 2: Interactive Storybook with 3D Page Flip (Tier 2) */}
        {/* ============================================================== */}
        {viewMode === 'book' && (
          <div
            className="max-w-4xl mx-auto"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Storybook Hardcover Container */}
            <div
              className={`relative rounded-3xl bg-[#fff8f1] border-4 border-[#ecd3c1] p-6 sm:p-10 shadow-2xl transition-all duration-500 ${
                isFlipping ? 'scale-[0.98] rotate-y-6 opacity-75' : 'scale-100 rotate-y-0 opacity-100'
              }`}
              style={{
                boxShadow: '0 20px 50px rgba(163, 64, 99, 0.2), inset 0 0 30px rgba(236, 211, 193, 0.4)',
              }}
            >
              {/* Gold Bookmark Ribbon */}
              <div className="absolute -top-3 right-12 w-6 h-12 bg-amber-400 rounded-b-md shadow-md z-20"></div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left Page: Illustration with vintage picture frame */}
                <div className="md:col-span-6">
                  <div className="rounded-2xl border-4 border-[#ecd3c1] overflow-hidden shadow-md bg-[#fff0e5] aspect-4/3 relative">
                    <img
                      src={steps[currentPage].image}
                      alt={steps[currentPage].alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-bold backdrop-blur-xs">
                      Chapter {steps[currentPage].step}
                    </div>
                  </div>
                </div>

                {/* Right Page: Story Typography & Quote */}
                <div className="md:col-span-6 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#a34063]">
                      {steps[currentPage].subtitle}
                    </span>
                    <h3
                      className="font-editorial text-3xl font-black text-[#38201a] mt-1 mb-4"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {steps[currentPage].title}
                    </h3>
                    <p
                      className="text-base text-[#5a382e] font-semibold leading-relaxed mb-6"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      {steps[currentPage].text}
                    </p>
                    <blockquote className="border-l-4 border-amber-400 pl-4 italic text-sm text-[#8b6154] font-medium">
                      {steps[currentPage].quote}
                    </blockquote>
                  </div>

                  {/* Navigation Footer */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#ecd3c1]">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="flex items-center gap-1 px-4 py-2 rounded-full border border-[#ecd3c1] text-xs font-bold text-[#38201a] hover:border-[#a34063] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous Page</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {steps.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(idx)}
                          className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                            currentPage === idx ? 'bg-[#a34063] w-6' : 'bg-[#ecd3c1]'
                          }`}
                          aria-label={`Jump to page ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === steps.length - 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#a34063] text-xs font-bold text-white hover:bg-[#8b3452] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs"
                    >
                      <span>Next Page</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructions Prompt */}
              <div className="text-center mt-6 text-xs text-[#8b6154] font-semibold">
                Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#ecd3c1] font-mono text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#ecd3c1] font-mono text-[10px]">→</kbd> arrow keys or swipe on mobile to turn pages! 📖
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
